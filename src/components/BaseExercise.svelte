<script lang="ts">
	import { audioManager } from '$lib/AudioManager';
	import { midiManager } from '$lib/MIDIManager';
	import { userStatsService } from '$lib/UserStatsService';
	import { calculateOptimalRange, getNoteRole } from '$lib/MusicTheoryUtils';
	import { validateNoteTiming } from '$lib/music-validation';
	import type {
		ValidationResult,
		ExerciseAPI,
		BeatTiming,
		TempoValidation
	} from '$lib/types/exercise-api';
	import { AllNotes, NoteToMidi, DEFAULT_OCTAVE } from '$lib/types/notes.constants';
	import {
		type KeyboardProps,
		type MidiNote,
		type Note,
		type NoteEvent,
		type ScoreProps,
		type ExerciseResult
	} from '$lib/types/types';
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { journeyService } from '$lib/JourneyService';
	import type { Snippet } from 'svelte';
	import DebugPanel from './DebugPanel.svelte';
	import Keyboard from './Keyboard.svelte';
	import Metronome from './Metronome.svelte';
	import Score from './Score.svelte';
	import LessonCompleteModal from './LessonCompleteModal.svelte';

	interface BaseExerciseProps {
		randomMode: boolean;
		generateExpectedNotes: (selectedNote: Note, ...args: unknown[]) => MidiNote[];
		generateScoreProps: (selectedNote: Note) => ScoreProps;
		validateNoteEvent: (
			selectedNote: Note,
			event: NoteEvent,
			expectedNotes: ReadonlyArray<MidiNote>,
			currentNotes: ReadonlyArray<MidiNote>
		) => ValidationResult;
		isCompleted: (
			currentNotes: ReadonlyArray<MidiNote>,
			expectedNotes: ReadonlyArray<MidiNote>
		) => boolean;
		onReset: () => void;
		onComplete: () => void;
		description: string;
		initialNote: Note;
		showScore?: boolean;
		exerciseType?:
			| 'chord'
			| 'scale'
			| 'II-V-I'
			| 'note'
			| 'interval'
			| 'partition'
			| 'progression'
			| 'rhythm';
	}

	let {
		randomMode = false,
		generateExpectedNotes,
		generateScoreProps,
		validateNoteEvent,
		isCompleted,
		onReset,
		onComplete,
		initialNote,
		showScore,
		children,
		description,
		exerciseType = 'chord',
		progressiveHints = true,
		prompt,
		showTempoControl = true,
		showTrainingControl = true
	}: BaseExerciseProps & {
		children?: Snippet<[ExerciseAPI]>;
		progressiveHints?: boolean;
		prompt?: string;
		showTempoControl?: boolean;
		showTrainingControl?: boolean;
	} = $props();

	const SCORE_SHOW_AFTER_MISTAKES = 1; // Show score after 1 mistake
	const KEYBOARD_SHOW_AFTER_MISTAKES = 3; // Show keyboard after 3 mistakes
	const EXPECTED_NOTES_SHOW_AFTER_MISTAKES = 3;

	let selectedNote: Note = $state(initialNote ?? 'C');

	$effect(() => {
		if (initialNote !== undefined && initialNote !== selectedNote) {
			selectedNote = initialNote;
			resetExercise();
		}
	});

	let noteEvents: NoteEvent[] = $state([]);
	let mistakes = $state(0);
	let collectedNotes: Set<MidiNote> = $state(new Set());
	let startTime = $state(0);
	let completed = $state(false);
	let debugMode = $state(false);
	let feedbackMessage = $state('');
	let showNotesRoles = $state(false);

	let stopOnMistake = $state(false);
	let tempoMode = $state(false);
	let lastTickTime = $state(0);
	let currentBpm = $state(120);
	let lastBeatNumber = $state(0);
	let wasDownbeat = $state(false);
	const TEMPO_TOLERANCE_MS = 150; // Tolerance for "on beat"

	// showScore controls whether the Score UI is rendered
	// If progressiveHints is true, we hide score until mistakes threshold is reached
	// If showScore prop is explicitly provided, it overrides default behavior but progressiveHints can still force hide
	let showScoreState = $derived.by(() => {
		if (showScore === false) return false; // Explicitly hidden
		if (exerciseType === 'partition') return true; // Always show for sight reading
		if (progressiveHints) {
			return mistakes >= SCORE_SHOW_AFTER_MISTAKES;
		}
		return showScore ?? true;
	});

	// Journey integration - detect URL params
	const unitId = $derived(page.url.searchParams.get('unitId'));
	const lessonId = $derived(page.url.searchParams.get('lessonId'));
	const isJourneyMode = $derived(!!unitId && !!lessonId);

	// Modal state for lesson completion
	let showCompleteModal = $state(false);
	let completedStars = $state(0);
	let completedAccuracy = $state(0);
	let completedXp = $state(0);

	let showExpected = $derived.by(() => {
		return mistakes >= EXPECTED_NOTES_SHOW_AFTER_MISTAKES;
	});

	let currentNotes = $derived(noteEvents.map((e) => e.noteNumber));
	let expectedNotes = $derived(generateExpectedNotes(selectedNote));
	let scoreProps = $derived(generateScoreProps(selectedNote));
	let showKeyboard = $derived(
		debugMode || (progressiveHints && mistakes >= KEYBOARD_SHOW_AFTER_MISTAKES)
	);
	let keyboardProps = $derived({
		...calculateOptimalRange(expectedNotes),
		midiNotes: currentNotes,
		debugMode: debugMode,
		noteRoles: Object.fromEntries(
			expectedNotes.map((note) => [
				note,
				getNoteRole(note, NoteToMidi[`${selectedNote}${DEFAULT_OCTAVE}` as keyof typeof NoteToMidi])
			])
		),
		expectedNotes: expectedNotes,
		showExpected: showExpected
	} as KeyboardProps);

	let progressPercentage = $derived.by(() => {
		if (expectedNotes.length === 0) return 0;
		const uniqueExpected = [...new Set(expectedNotes)];
		return Math.round((collectedNotes.size / uniqueExpected.length) * 100);
	});

	let helpMessage = $derived.by(() => {
		if (!progressiveHints || completed) return '';
		if (exerciseType === 'partition') return ''; // Score is visible, no hint needed

		if (mistakes < SCORE_SHOW_AFTER_MISTAKES) {
			let description = `correct ${exerciseType || 'note'}`;
			if (prompt) {
				const typeLabel =
					exerciseType === 'II-V-I'
						? 'progression'
						: exerciseType === 'note'
							? 'note'
							: exerciseType;
				description = `${prompt} ${typeLabel}`;
			}

			return `Play the ${description}. After ${SCORE_SHOW_AFTER_MISTAKES - mistakes} more mistake${SCORE_SHOW_AFTER_MISTAKES - mistakes === 1 ? '' : 's'} the score will appear.`;
		}
		if (mistakes < KEYBOARD_SHOW_AFTER_MISTAKES) {
			return `Reference keyboard will appear after ${KEYBOARD_SHOW_AFTER_MISTAKES - mistakes} more mistake${KEYBOARD_SHOW_AFTER_MISTAKES - mistakes === 1 ? '' : 's'}.`;
		}
		return 'Adaptive help is active. Use the score and keyboard for reference.';
	});

	const exposedAPI: ExerciseAPI = $derived({
		selectedNote,
		currentNotes: currentNotes as ReadonlyArray<MidiNote>,
		expectedNotes: expectedNotes as ReadonlyArray<MidiNote>,
		mistakes,
		completed,
		collectedNotes,
		debugMode,
		feedbackMessage,
		showNotesRoles,
		tempoMode,
		toggleDebug,
		showFeedback,
		toggleTempoMode,
		handleTick,
		completeExercise: (extra?: Partial<ExerciseResult>) => onCompleteExercise(extra)
	});

	onDestroy(() => {
		midiManager.cleanup();
	});

	onMount(async () => {
		await midiManager.initialize();
		midiManager.setupVirtualKeyboard();
		midiManager.setEventHandlers({
			onNoteOn: handleNoteOn,
			onNoteOff: handleNoteOff
		});
		startTime = Date.now();

		// Unlock audio playback on first user gesture (some browsers block play() before a gesture)
		const attemptUnlock = async () => {
			if (audioManager.needsUserGesture()) {
				const ok = await audioManager.unlock();
				if (ok) {
					showFeedback('Audio enabled', 'info');
				} else {
					showFeedback('Click or press any key to enable audio', 'info');
				}
			}
		};

		window.addEventListener('pointerdown', attemptUnlock, { once: true });
		window.addEventListener('keydown', attemptUnlock, { once: true });
	});

	function handleNoteOn(note: NoteEvent): void {
		if (debugMode) {
			console.debug(
				`MIDI Note ON: ${note.noteNumber} (${note.noteFullName}) velocity=${note.velocity} channel=${note.channel}`
			);
		}

		let isOffBeat = false;

		// Tempo Check - only validate timing for certain conditions
		if (tempoMode) {
			const lastBeat: BeatTiming = {
				timestamp: lastTickTime,
				beatNumber: lastBeatNumber,
				isDownbeat: wasDownbeat
			};

			const tempoConfig: TempoValidation = {
				enabled: true,
				toleranceMs: TEMPO_TOLERANCE_MS,
				requireDownbeat:
					exerciseType === 'chord' || exerciseType === 'progression' || exerciseType === 'II-V-I'
			};

			// For chord-based exercises, only check timing on the first note of the chord
			// For sequential exercises (partition/licks), check timing on every note
			const shouldCheckTiming =
				exerciseType === 'partition' || // Licks: check every note
				exerciseType === 'rhythm' || // Rhythm: check every note
				collectedNotes.size === 0; // Chords/Progressions: only first note of chord

			if (shouldCheckTiming) {
				const errorMessage = validateNoteTiming(note, lastBeat, tempoConfig, currentBpm);

				if (errorMessage) {
					showFeedback(errorMessage, 'error');
					mistakes++;
					isOffBeat = true;
					audioManager.playError();
				}
			}
		}

		noteEvents = [...noteEvents, note];
		const result = validateNoteEvent(selectedNote, note, expectedNotes, currentNotes);

		if (result.resetCollected) {
			collectedNotes = new Set();
		}

		if ('resetMistakes' in result && result.resetMistakes) {
			mistakes = 0;
		}

		// Only collect and show success if on beat (or if tempo mode is off)
		if (result.collected && !isOffBeat) {
			collectedNotes.add(note.noteNumber);
		}

		if (result.isCorrect) {
			if (!isOffBeat) {
				showFeedback(result.message, 'success');
			}
			// If isCorrect but isOffBeat, we already showed "Off beat" error and played error sound above.
			// We do NOT show success message/sound.
		} else {
			// If note matches pitch but is off beat, we already counted mistake above.
			// If note is WRONG pitch, we count another mistake here?
			// Ideally we don't double penalize if they just missed the beat but hit the wrong note?
			// But sticking to simple logic: Wrong Note = Mistake. Off Beat = Mistake.
			if (!isOffBeat) {
				mistakes++;
				showFeedback(result.message, 'error');
				audioManager.playError();
			}
			// If it was already off beat, we already showed error/played sound.
			// But the message might need to say "Wrong note AND Off beat"?
			// For now, "Off beat" is the priority feedback if tempo mode is on.

			if (stopOnMistake) {
				// Stop processing or handle "stop/skip" behavior
				feedbackMessage = 'error : Mistake! Take your time...';
				return;
			}
		}

		if (exerciseType) {
			// Map exercise types to the types expected by updateNoteProgress
			const progressType =
				exerciseType === 'II-V-I'
					? 'progression'
					: exerciseType === 'note' || exerciseType === 'interval'
						? 'chord'
						: exerciseType;

			userStatsService.updateNoteProgress(
				note.noteName,
				progressType as 'chord' | 'scale' | 'progression' | 'partition' | 'rhythm',
				undefined,
				result.isCorrect,
				0,
				result.isCorrect ? 100 : 0
			);
		}

		if (isCompleted(currentNotes, expectedNotes)) {
			onCompleteExercise();
		}
	}

	function handleNoteOff(note: NoteEvent): void {
		if (debugMode) {
			console.debug(
				`MIDI Note OFF: ${note.noteNumber} (${note.noteFullName}) channel=${note.channel}`
			);
		}
		noteEvents = noteEvents.filter((e) => e.noteNumber !== note.noteNumber);
	}

	function handleNoteSelect(note: Note): void {
		selectedNote = note;
		resetExercise();
	}

	function resetExercise(): void {
		noteEvents = [];
		mistakes = 0;
		completed = false;
		feedbackMessage = '';
		startTime = Date.now();
		selectedNote = selectedNote;
		collectedNotes = new Set();
		// Notify parent exercises so they can reset their own tracking
		onReset?.();
	}

	function showFeedback(message: string, type: 'success' | 'error' | 'info'): void {
		feedbackMessage = `${type} : ${message}`;
		setTimeout(() => {
			feedbackMessage = '';
		}, 5000);
	}

	function onCompleteExercise(extra?: Partial<ExerciseResult>): void {
		console.log('Exercise Completed!', { exerciseType, mistakes, startTime });
		completed = true;
		const timeElapsed = Date.now() - startTime;
		const accuracy = Math.round(((expectedNotes.length - mistakes) / expectedNotes.length) * 100);
		showFeedback(`Exercise completed! Time: ${timeElapsed}ms, Accuracy: ${accuracy}%`, 'success');
		audioManager.playSound?.('success');

		if (exerciseType) {
			console.log('Recording stats...', { exerciseType, success: true, accuracy, timeElapsed });

			// Map exercise types to match ExerciseResult type
			const resultType: 'chord' | 'scale' | 'progression' | 'partition' | 'rhythm' =
				exerciseType === 'II-V-I'
					? 'progression'
					: exerciseType === 'note' || exerciseType === 'interval'
						? 'chord'
						: (exerciseType as 'chord' | 'scale' | 'progression' | 'partition' | 'rhythm');

			userStatsService.recordExerciseResult({
				exerciseId: window.location.pathname,
				exerciseType: resultType,
				success: true,
				accuracy,
				timeElapsed,
				mistakes,
				score: Math.max(0, 100 - mistakes * 10),
				timestamp: new Date(),
				...extra
			});
		} else {
			console.warn('No exerciseType provided, stats not recorded.');
		}

		// Journey mode: calculate stars and show modal
		if (isJourneyMode && unitId && lessonId) {
			// Calculate stars: 3 stars = 0 mistakes, 2 stars = 1-2 mistakes, 1 star = 3+ mistakes
			completedStars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
			completedAccuracy = accuracy;
			completedXp = Math.max(0, 100 - mistakes * 10);

			journeyService.completeLesson(unitId, lessonId, completedStars);
			showCompleteModal = true;
		} else {
			// Non-journey mode: just call onComplete and reset
			onComplete?.();
			resetExercise();
		}
	}

	function handleModalContinue() {
		showCompleteModal = false;
		goto(resolve('/journey'));
	}

	function handleModalRetry() {
		showCompleteModal = false;
		resetExercise();
	}

	function toggleDebug(): void {
		debugMode = !debugMode;
		midiManager.setDebugMode(debugMode);
	}

	function handleNoteSelectEvent(event: Event) {
		const target = event.target as HTMLSelectElement;
		const note = target.value as Note;
		handleNoteSelect(note);
	}

	function handleTick(timestamp: number, beatNumber: number, isDownbeat: boolean) {
		lastTickTime = timestamp;
		lastBeatNumber = beatNumber;
		wasDownbeat = isDownbeat;
	}

	function toggleTempoMode() {
		tempoMode = !tempoMode;
	}
</script>

<div class="exercise-layout">
	<!-- Sidebar for Controls -->
	<aside class="sidebar glass">
		<div class="sidebar-header">
			<h3>Exercise Controls</h3>
		</div>

		<div class="sidebar-content">
			{#if !randomMode}
				<div class="control-group">
					<label for="note-select">Root Key</label>
					<select id="note-select" value={selectedNote} onchange={handleNoteSelectEvent}>
						{#each AllNotes as note}
							<option value={note}>{note}</option>
						{/each}
					</select>
				</div>
			{/if}

			{#if showTempoControl}
				<div class="control-group">
					<label for="tempo-toggle">Tempo Mode</label>
					<button
						id="tempo-toggle"
						class="toggle-btn"
						class:active={tempoMode}
						onclick={toggleTempoMode}
					>
						{tempoMode ? 'Enabled' : 'Disabled'}
					</button>
				</div>

				{#if tempoMode}
					<div class="control-group">
						<Metronome onTick={handleTick} />
					</div>
				{/if}
			{/if}

			{#if showTrainingControl}
				<div class="control-group">
					<label for="training-mode-toggle">Training Mode</label>
					<button
						id="training-mode-toggle"
						onclick={() => (stopOnMistake = !stopOnMistake)}
						class="toggle-btn"
						class:active={stopOnMistake}
						title="If enabled, mistakes will stop the lesson until you correct it"
					>
						{stopOnMistake ? 'Stop on Mistake' : 'Free Play'}
					</button>
				</div>
			{/if}

			<div class="control-group">
				<label for="debug-toggle">Virtual Keyboard</label>
				<button id="debug-toggle" onclick={toggleDebug} class="toggle-btn" class:active={debugMode}>
					{debugMode ? 'Visible' : 'Hidden'}
				</button>
			</div>

			<div class="sidebar-spacer"></div>

			<button onclick={resetExercise} class="reset-btn"> Reset Session </button>
		</div>
	</aside>

	<!-- Main Exercise Area -->
	<main class="exercise-main">
		<!-- Header / Feedback Strip -->
		<header class="exercise-header">
			<div class="info-group">
				{#if description}
					<div class="exercise-description">
						<span class="info-icon">
							?
							<span class="desc-tooltip">{description}</span>
						</span>
					</div>
				{/if}
				<h1>{exerciseType?.toUpperCase() || 'PRACTICE'}</h1>
			</div>

			<div class="performance-strip">
				<div class="stat-pill" class:neutral={mistakes === 0} class:warn={mistakes > 0}>
					<span class="label">Mistakes:</span>
					<span class="value">{mistakes}</span>
				</div>
				<div class="stat-pill success">
					<span class="label">Progress:</span>
					<span class="value">{progressPercentage}%</span>
				</div>
			</div>
		</header>

		{#if feedbackMessage}
			<div class="feedback-toast" transition:fade>
				{feedbackMessage}
			</div>
		{/if}

		<div class="focus-area">
			{#if prompt}
				<div class="prompt-card card-premium">
					<div class="prompt-text">{prompt}</div>
				</div>
			{/if}

			{#if showScoreState}
				<div class="score-container card-premium" in:fade>
					<Score {...scoreProps} />
				</div>
			{/if}

			{#if helpMessage}
				<div class="adaptive-help-text">
					{helpMessage}
				</div>
			{/if}

			<div class="keyboard-container" class:hidden={!showKeyboard}>
				<Keyboard {...keyboardProps} />
			</div>

			<div class="exercise-custom-content">
				{@render children?.(exposedAPI)}
			</div>
		</div>

		<!-- Debug Overlay -->
		{#if debugMode}
			<div class="debug-panel-wrapper">
				<DebugPanel
					{noteEvents}
					{expectedNotes}
					{currentNotes}
					{debugMode}
					onToggleDebugMode={toggleDebug}
					virtualMidi={midiManager.getVirtualMidi() ?? undefined}
				/>
			</div>
		{/if}

		<!-- Progress Bar at bottom -->
		<footer class="exercise-footer">
			<div class="progress-track">
				<div class="progress-fill" style="width: {progressPercentage}%"></div>
			</div>
		</footer>
	</main>
</div>

<LessonCompleteModal
	isOpen={showCompleteModal}
	stars={completedStars}
	accuracy={completedAccuracy}
	xp={completedXp}
	onContinue={handleModalContinue}
	onRetry={handleModalRetry}
/>

<style>
	:global(.exercise-layout) {
		display: flex;
		height: calc(100vh - 80px); /* Adjust based on main layout header */
		overflow: hidden;
		gap: 1rem;
		padding: 1rem;
		background: var(--color-bg);
	}

	.sidebar {
		width: 280px;
		display: flex;
		flex-direction: column;
		background: var(--glass-bg);
		backdrop-filter: var(--glass-blur);
		-webkit-backdrop-filter: var(--glass-blur);
		border: 1px solid var(--color-border);
		border-radius: 16px;
		padding: 1.5rem;
		flex-shrink: 0;
	}

	.sidebar-header h3 {
		font-size: 1.1rem;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-bottom: 2rem;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 2rem;
	}

	.control-group label {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--color-text-muted);
	}

	select,
	.toggle-btn {
		background: var(--color-surface-raised);
		border: 1px solid var(--color-border);
		color: var(--color-text);
		padding: 0.75rem;
		border-radius: 8px;
		font-size: 1rem;
		width: 100%;
		cursor: pointer;
	}

	.toggle-btn.active {
		border-color: var(--color-primary);
		background: rgba(88, 166, 255, 0.1);
		color: var(--color-primary);
	}

	.reset-btn {
		margin-top: auto;
		background: rgba(248, 81, 73, 0.1);
		border: 1px solid var(--color-error);
		color: var(--color-error);
		padding: 0.75rem;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
	}

	.exercise-main {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		overflow-y: auto;
		padding-right: 0.5rem;
	}

	.exercise-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 0;
	}

	.info-group {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.info-group h1 {
		margin: 0;
		font-size: 1.5rem;
		color: var(--color-primary);
	}

	.performance-strip {
		display: flex;
		gap: 1rem;
	}

	.stat-pill {
		display: flex;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 20px;
		font-size: 0.9rem;
		font-weight: 600;
	}

	.stat-pill.warn {
		color: var(--color-warn);
		border-color: var(--color-warn);
	}
	.stat-pill.success {
		color: var(--color-success);
		border-color: var(--color-success);
	}

	.feedback-toast {
		position: fixed;
		top: 100px;
		left: 50%;
		transform: translateX(-50%);
		padding: 1rem 2rem;
		border-radius: 12px;
		background: var(--color-surface-raised);
		border: 1px solid var(--color-border);
		box-shadow: var(--shadow-lg);
		z-index: 1000;
		font-weight: 600;
	}

	.focus-area {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		flex: 1;
		justify-content: center;
	}

	.prompt-card {
		text-align: center;
		padding: 4rem;
	}

	.prompt-text {
		font-size: 4rem;
		font-weight: 800;
		background: linear-gradient(to bottom, var(--color-text), var(--color-text-muted));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.score-container {
		min-height: 250px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.keyboard-container {
		transition: opacity 0.3s;
	}

	.keyboard-container.hidden {
		display: none;
	}

	.exercise-footer {
		padding: 1rem 0;
	}

	.progress-track {
		height: 6px;
		background: var(--color-surface);
		border-radius: 3px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--color-primary);
		transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.exercise-description {
		position: relative;
	}

	.info-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border: 1px solid var(--color-border);
		border-radius: 50%;
		cursor: help;
		font-size: 0.8rem;
		font-weight: 700;
	}

	.desc-tooltip {
		position: absolute;
		top: 120%; /* Move to bottom to avoid header overlap */
		right: 0;
		left: auto; /* Align to right since icon is usually on right side of title? No, it's left of title */
		left: -10px; /* Slight offset */
		background: var(--color-surface-raised);
		border: 1px solid var(--color-border);
		padding: 1rem;
		border-radius: 8px;
		width: 300px;
		font-size: 0.9rem;
		line-height: 1.4;
		opacity: 0;
		visibility: hidden;
		transition: all 0.2s;
		z-index: 9999;
		color: var(--color-text);
		box-shadow: var(--shadow-lg);
		pointer-events: none;
	}

	.info-icon:hover .desc-tooltip,
	.info-icon:focus .desc-tooltip,
	.info-icon:active .desc-tooltip {
		opacity: 1;
		visibility: visible;
		transform: translateY(5px);
		pointer-events: auto;
	}

	@media (max-width: 1024px) {
		:global(.exercise-layout) {
			flex-direction: column;
			height: auto;
		}

		.sidebar {
			width: 100%;
			flex-direction: row;
			flex-wrap: wrap;
			gap: 1rem;
		}

		.control-group {
			flex: 1;
			min-width: 150px;
			margin-bottom: 0;
		}
	}
</style>
