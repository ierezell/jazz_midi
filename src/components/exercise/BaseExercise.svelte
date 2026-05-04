<script lang="ts">
	import { audioManager } from '$lib/audio/AudioManager';
	import { midiManager } from '$lib/MIDIManager';
	import { userStatsService } from '$lib/UserStatsService';
	import { calculateOptimalRange, getNoteRole } from '$lib/MusicTheoryUtils';
	import { validateNoteTiming } from '$lib/musicValidation';
	import type {
		ExerciseAPI,
		BeatTiming,
		TempoValidation,
		ValidationResult
	} from '$lib/types/exercise-api';
	import { AllNotes, NoteToMidi, DEFAULT_OCTAVE, MidiToNote } from '$lib/types/notes.constants';
	import {
		type KeyboardProps,
		type MidiNote,
		type Note,
		type NoteEvent,
		type ScoreProps,
		type ExerciseResult,
		type ExerciseType
	} from '$lib/types/types';
	import { onMount, onDestroy, untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { journeyService } from '$lib/JourneyService';
	import type { Snippet } from 'svelte';
	import DebugPanel from './DebugPanel.svelte';
	import ExerciseSidebar from './ExerciseSidebar.svelte';
	import Keyboard from './Keyboard.svelte';
	import Score from './Score.svelte';
	import LessonCompleteModal from '../LessonCompleteModal.svelte';
	import MidiStatusPill from '../MidiStatusPill.svelte';

	interface BaseExerciseProps {
		randomMode: boolean;
		generateExpectedNotes: (
			selectedNote: Note,
			...additionalParams: (string | number | boolean | undefined)[]
		) => MidiNote[];
		generateScoreProps: (selectedNote: Note) => ScoreProps;
		validateNoteEvent: (
			selectedNote: Note,
			event: NoteEvent,
			expectedNotes: MidiNote[],
			currentNotes: MidiNote[]
		) => ValidationResult;
		isCompleted: (currentNotes: MidiNote[], expectedNotes: MidiNote[]) => boolean;
		onReset: () => void;
		onComplete: () => void;
		description: string;
		initialNote: Note;
		showScore?: boolean;
		exerciseType?: ExerciseType;
		breadcrumbParent?: string;
		perNoteTiming?: boolean;
		defaultBpm?: number;
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
		showTrainingControl = true,
		defaultBpm = undefined,
		timingModeLabel = 'Play on beat',
		breadcrumbParent = undefined,
		perNoteTiming = false
	}: BaseExerciseProps & {
		children?: Snippet<[ExerciseAPI]>;
		progressiveHints?: boolean;
		prompt?: string;
		showTempoControl?: boolean;
		showTrainingControl?: boolean;
		timingModeLabel?: string;
	} = $props();

	const SCORE_SHOW_AFTER_MISTAKES = 1; // Show score after 1 mistake
	const KEYBOARD_SHOW_AFTER_MISTAKES = 3; // Show keyboard after 3 mistakes
	const EXPECTED_NOTES_SHOW_AFTER_MISTAKES = 3;

	// @svelte-ignore state_referenced_locally
	let selectedNote: Note = $state(untrack(() => initialNote ?? 'C'));

	// Only react to *prop* changes of initialNote (e.g. parent generates a new challenge).
	// Do NOT force-reset when the user changes the selected note locally via the UI.
	// @svelte-ignore state_referenced_locally
	let lastInitialNote: Note | undefined = $state(untrack(() => initialNote));

	$effect(() => {
		if (initialNote !== lastInitialNote) {
			lastInitialNote = initialNote;
			if (initialNote !== undefined && initialNote !== selectedNote) {
				selectedNote = initialNote;
				resetExercise();
			}
		}
	});

	let noteEvents: NoteEvent[] = $state([]);
	let mistakes = $state(0);
	let collectedNotes: Set<MidiNote> = $state(new Set());
	let lastVelocity = $state(0);
	let startTime = $state(0);
	let completed = $state(false);
	let debugMode = $state(false);

	let feedbackMessage = $state('');
	let showNotesRoles = $state(false);
	let showMobileSidebar = $state(false);
	let isLandscapeMobile = $state(false);
	let lastNoteDisplay = $state<{ note: string; correct: boolean } | null>(null);

	// Landscape phase: name-only → score → keyboard
	let landscapePhase = $derived.by((): 'name' | 'score' | 'keyboard' => {
		if (!isLandscapeMobile) return 'name';
		if (exerciseType === 'partition') return 'score'; // sight-reading always shows score
		if (mistakes < SCORE_SHOW_AFTER_MISTAKES) return 'name';
		if (mistakes < KEYBOARD_SHOW_AFTER_MISTAKES) return 'score';
		return 'keyboard';
	});

	let stopOnMistake = $state(false);
	let tempoMode = $state(false);
	let strictBeat = $state(false);
	let beatFlash = $state(false);
	let lastTickTime = $state(0);
	let currentBpm = $state(120);
	let lastBeatNumber = $state(0);
	let wasDownbeat = $state(false);
	const STRICT_TOLERANCE_MS = 50;
	const NORMAL_TOLERANCE_MS = 150;
	let toleranceMs = $derived(strictBeat ? STRICT_TOLERANCE_MS : NORMAL_TOLERANCE_MS);

	// showScore controls whether the Score UI is rendered
	// If progressiveHints is true, we hide score until mistakes threshold is reached
	// If showScore prop is explicitly provided, it overrides default behavior but progressiveHints can still force hide
	let showScoreState = $derived.by(() => {
		if (showScore === false) return false; // Explicitly hidden
		if (exerciseType === 'partition') return true; // Always show for sight reading
		if (isLandscapeMobile) return landscapePhase === 'score';
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
	let completedPerfectCompletions = $state(0);
	let completedRequiredPerfectCompletions = $state(1);

	let showExpected = $derived.by(() => {
		return mistakes >= EXPECTED_NOTES_SHOW_AFTER_MISTAKES;
	});

	let currentNotes = $derived(noteEvents.map((e) => e.noteNumber));
	let expectedNotes = $derived(generateExpectedNotes(selectedNote));
	let scoreProps = $derived(generateScoreProps(selectedNote));
	let showKeyboard = $derived(
		debugMode ||
			(isLandscapeMobile
				? landscapePhase === 'keyboard'
				: progressiveHints && mistakes >= KEYBOARD_SHOW_AFTER_MISTAKES)
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
		if (exerciseType === 'partition') return ''; // Score always visible for sight reading

		const scoreVisible = mistakes >= SCORE_SHOW_AFTER_MISTAKES;
		const keyboardVisible = mistakes >= KEYBOARD_SHOW_AFTER_MISTAKES;
		const expectedNotesVisible = mistakes >= EXPECTED_NOTES_SHOW_AFTER_MISTAKES;

		if (!scoreVisible) {
			// No hint before the first mistake threshold
			if (mistakes === 0) return '';
			const remaining = SCORE_SHOW_AFTER_MISTAKES - mistakes;
			return `Struggling? Sheet music will appear after ${remaining} more mistake${remaining === 1 ? '' : 's'}.`;
		}

		if (!keyboardVisible) {
			const remaining = KEYBOARD_SHOW_AFTER_MISTAKES - mistakes;
			return `Sheet music is now visible. Keyboard will appear after ${remaining} more mistake${remaining === 1 ? '' : 's'}.`;
		}

		if (!expectedNotesVisible) {
			const remaining = EXPECTED_NOTES_SHOW_AFTER_MISTAKES - mistakes;
			return `Keyboard is now visible. Expected notes will appear after ${remaining} more mistake${remaining === 1 ? '' : 's'}.`;
		}

		return 'All hints are visible. Keep practicing!';
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
		if (typeof window !== 'undefined') {
			(window as any).__midiExerciseReady = false;
			(window as any).__landscapeMqCleanup?.();
		}
		midiManager.cleanup();
	});

	onMount(async () => {
		// Detect landscape mobile mode (no header, constrained height)
		const landscapeMq = window.matchMedia('(orientation: landscape) and (max-height: 600px)');
		isLandscapeMobile = landscapeMq.matches;
		const onMqChange = (e: MediaQueryListEvent) => {
			isLandscapeMobile = e.matches;
		};
		landscapeMq.addEventListener('change', onMqChange);
		// Cleanup handled via onDestroy below; store ref for cleanup
		const mqCleanup = () => landscapeMq.removeEventListener('change', onMqChange);
		// Store for onDestroy (attach to window temporarily)
		(window as any).__landscapeMqCleanup = mqCleanup;

		await midiManager.initialize();
		midiManager.setupVirtualKeyboard();
		midiManager.setEventHandlers({
			onNoteOn: handleNoteOn,
			onNoteOff: handleNoteOff
		});
		if (typeof window !== 'undefined') {
			(window as any).__midiExerciseReady = true;
		}
		startTime = Date.now();

		// Unlock audio playback on first user gesture (some browsers block play() before a gesture)
		const attemptUnlock = async () => {
			if (audioManager.needsUserGesture()) {
				const ok = await audioManager.unlock();
				if (ok) {
					console.log('Audio enabled');
				} else {
					console.log('Failed to enable audio');
				}
			}
		};

		window.addEventListener('pointerdown', attemptUnlock, { once: true });
		window.addEventListener('keydown', attemptUnlock, { once: true });

		// no test-only hooks here
	});

	function handleNoteOn(note: NoteEvent): void {
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
				toleranceMs,
				requireDownbeat:
					exerciseType === 'chord' || exerciseType === 'progression' || exerciseType === 'II-V-I'
			};

			// For chord-based exercises, only check timing on the first note of the chord
			// For sequential exercises (partition/licks), check timing on every note
			const shouldCheckTiming =
				exerciseType === 'partition' || // Licks: check every note
				exerciseType === 'rhythm' || // Rhythm: check every note
				perNoteTiming === true || // Opt-in per-note timing (e.g. scales)
				collectedNotes.size === 0; // Chords/Progressions: only first note of chord

			if (shouldCheckTiming) {
				const errorMessage = validateNoteTiming(note, lastBeat, tempoConfig, currentBpm);

				if (errorMessage) {
					showFeedback(errorMessage, 'error');
					mistakes++;
					isOffBeat = true;
					audioManager.playError();
					// Don't process the note further — off-beat notes don't count
					return;
				}
			}
		}

		lastVelocity = note.velocity;
		noteEvents = [...noteEvents, note];
		// Compute the live note list immediately (before $derived re-evaluates)
		const updatedNotes = noteEvents.map((e) => e.noteNumber);
		const result = validateNoteEvent(selectedNote, note, expectedNotes, updatedNotes);

		// Track last played note for landscape name-phase feedback
		lastNoteDisplay = { note: note.noteName, correct: result.isCorrect && !isOffBeat };

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

				const mappedType = exerciseType;
				if (mappedType !== 'rhythm') {
					userStatsService.trackMissedNote(note.noteName, mappedType);
					if (mappedType === 'chord' || mappedType === 'II-V-I' || mappedType === 'progression') {
						const chordKey = `${selectedNote}-${prompt ?? exerciseType ?? 'unknown'}`;
						userStatsService.trackMissedChord(chordKey, mappedType);
					}
				}
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
			userStatsService.updateNoteProgress(
				note.noteName,
				exerciseType,
				undefined,
				result.isCorrect,
				0,
				result.isCorrect ? 100 : 0
			);
		}

		// Pass updatedNotes (not the stale $derived `currentNotes`) to isCompleted
		if (isCompleted(updatedNotes, expectedNotes)) {
			onCompleteExercise();
		}
	}

	function handleNoteOff(note: NoteEvent): void {
		noteEvents = noteEvents.filter((e) => e.noteNumber !== note.noteNumber);
	}

	function resetExercise(options?: { preserveFeedback?: boolean }): void {
		noteEvents = [];
		mistakes = 0;
		completed = false;
		if (!options?.preserveFeedback) {
			feedbackMessage = '';
		}
		lastNoteDisplay = null;
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
		completed = true;
		const timeElapsed = Date.now() - startTime;
		const expectedCount = expectedNotes.length;
		const accuracy =
			expectedCount > 0
				? Math.max(0, Math.round(((expectedCount - mistakes) / expectedCount) * 100))
				: 0;
		showFeedback(`Exercise completed! Time: ${timeElapsed}ms, Accuracy: ${accuracy}%`, 'success');
		audioManager.playSound?.('success');

		if (exerciseType) {
			userStatsService.recordExerciseResult({
				exerciseId: window.location.pathname,
				exerciseType,
				success: true,
				accuracy,
				timeElapsed,
				mistakes,
				score: Math.max(0, 100 - mistakes * 10),
				timestamp: new Date(),
				...extra
			});
		}

		// Journey mode: calculate stars and show modal
		if (isJourneyMode && unitId && lessonId) {
			// Calculate stars: 3 stars = 0 mistakes, 2 stars = 1-2 mistakes, 1 star = 3+ mistakes
			completedStars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
			completedAccuracy = accuracy;
			completedXp = Math.max(0, 100 - mistakes * 10);

			journeyService.completeLesson(unitId, lessonId, completedStars);

			// Read updated mastery progress from service after recording
			const unit = journeyService.getUnit(unitId);
			const lesson = unit?.lessons.find((l) => l.id === lessonId);
			completedPerfectCompletions = lesson?.perfectCompletions ?? 0;
			completedRequiredPerfectCompletions = lesson?.requiredPerfectCompletions ?? 1;

			showCompleteModal = true;
		} else {
			// Non-journey mode: just call onComplete and reset
			onComplete?.();
			// Keep the completion toast visible — an immediate full reset clears `feedbackMessage`
			// synchronously, which makes success feedback impossible to observe (and breaks E2E).
			resetExercise({ preserveFeedback: true });
		}
	}

	function handleModalContinue() {
		showCompleteModal = false;
		// Return to training page with context so it can advance the session
		if (unitId && lessonId) {
			const params = new URLSearchParams({
				unitId,
				lessonId,
				stars: String(completedStars)
			});
			window.location.assign(resolve(`/training?${params.toString()}`));
		} else {
			goto(resolve('/training'));
		}
	}

	function handleModalRetry() {
		showCompleteModal = false;
		resetExercise();
	}

	function toggleDebug(): void {
		debugMode = !debugMode;
		midiManager.setDebugMode(debugMode);
	}

	function handleTick(timestamp: number, beatNumber: number, isDownbeat: boolean) {
		lastTickTime = timestamp;
		lastBeatNumber = beatNumber;
		wasDownbeat = isDownbeat;
		// Flash the beat indicator
		if (tempoMode) {
			beatFlash = true;
			setTimeout(() => {
				beatFlash = false;
			}, 80);
		}
	}

	function toggleTempoMode() {
		tempoMode = !tempoMode;
	}

	function handleBack(): void {
		if (isJourneyMode) goto(resolve('/journey'));
		else history.back();
	}

	interface Breadcrumb {
		label: string;
		href: string | null;
	}

	let breadcrumbs = $derived.by((): Breadcrumb[] => {
		if (isJourneyMode) {
			return [
				{ label: 'Journey', href: resolve('/journey') },
				{ label: breadcrumbParent ?? 'Lesson', href: null }
			];
		}
		const gymLabel = exerciseType
			? exerciseType.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
			: 'Exercise';
		return [
			{ label: 'Gym', href: resolve('/exercises') },
			{ label: gymLabel, href: null }
		];
	});
</script>

<div class="exercise-layout">
	<!-- Mobile landscape: backdrop overlay when sidebar is open -->
	{#if showMobileSidebar}
		<div
			class="sidebar-backdrop"
			onclick={() => (showMobileSidebar = false)}
			role="presentation"
			aria-hidden="true"
		></div>
	{/if}

	<!-- Sidebar wrapper — normal flex child on desktop, fixed overlay on mobile landscape -->
	<div class="sidebar-wrapper" class:open={showMobileSidebar}>
		<!-- Sidebar for Controls -->
		<ExerciseSidebar
			{randomMode}
			{selectedNote}
			{tempoMode}
			{strictBeat}
			{stopOnMistake}
			{debugMode}
			{showTempoControl}
			{showTrainingControl}
			{timingModeLabel}
			{defaultBpm}
			strictToleranceMs={STRICT_TOLERANCE_MS}
			normalToleranceMs={NORMAL_TOLERANCE_MS}
			onNoteChange={(n) => {
				selectedNote = n;
				resetExercise();
			}}
			onTempoToggle={toggleTempoMode}
			onStrictToggle={() => {
				strictBeat = !strictBeat;
			}}
			onStopToggle={() => {
				stopOnMistake = !stopOnMistake;
			}}
			onDebugToggle={toggleDebug}
			onTick={handleTick}
			onReset={() => resetExercise()}
		/>
	</div>
	<!-- /sidebar-wrapper -->

	<!-- Main Exercise Area -->
	<main class="exercise-main">
		<!-- Breadcrumb navigation -->
		{#if breadcrumbs.length > 0}
			<nav class="breadcrumbs" aria-label="Breadcrumb">
				{#each breadcrumbs as crumb, i}
					{#if crumb.href}
						<a href={crumb.href} class="breadcrumb-link">{crumb.label}</a>
					{:else}
						<span class="breadcrumb-current">{crumb.label}</span>
					{/if}
					{#if i < breadcrumbs.length - 1}
						<span class="breadcrumb-sep" aria-hidden="true"> › </span>
					{/if}
				{/each}
			</nav>
		{/if}

		<!-- Beat flash indicator (shown in tempo mode) -->
		{#if tempoMode}
			<div
				class="beat-indicator"
				class:flash={beatFlash}
				class:strict={strictBeat}
				aria-hidden="true"
			></div>
		{/if}

		<!-- Header / Feedback Strip -->
		<header class="exercise-header">
			<button class="back-btn" onclick={handleBack} aria-label="Go back">
				← {isJourneyMode ? 'Journey' : 'Back'}
			</button>

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
				{#if lastVelocity > 0}
					<div
						class="stat-pill velocity-pill"
						title="MIDI velocity (touch sensitivity)"
						aria-label="Last note velocity: {lastVelocity}"
					>
						<span class="label">Vel:</span>
						<span class="velocity-bar">
							<span
								class="velocity-fill"
								class:soft={lastVelocity < 50}
								class:medium={lastVelocity >= 50 && lastVelocity < 90}
								class:loud={lastVelocity >= 90}
								style="width: {Math.round((lastVelocity / 127) * 100)}%"
							></span>
						</span>
						<span class="value">{lastVelocity}</span>
					</div>
				{/if}
				<!-- Mobile landscape: MIDI status + settings toggle -->
				{#if isLandscapeMobile}
					<div class="mobile-header-controls">
						<MidiStatusPill />
						<button
							class="sidebar-toggle-btn"
							onclick={() => (showMobileSidebar = !showMobileSidebar)}
							aria-label="Toggle exercise controls"
							title="Exercise Controls">⚙</button
						>
					</div>
				{/if}
			</div>
		</header>

		<!-- Landscape phase progress indicator -->
		{#if isLandscapeMobile}
			<div class="landscape-phase-bar" role="status" aria-label="Exercise hint phase">
				<div class="lp-seg" class:active={landscapePhase === 'name'}>🎵 Play</div>
				<div class="lp-arrow">›</div>
				<div class="lp-seg" class:active={landscapePhase === 'score'}>♩ Score</div>
				<div class="lp-arrow">›</div>
				<div class="lp-seg" class:active={landscapePhase === 'keyboard'}>⌨ Keys</div>
			</div>
		{/if}

		{#if feedbackMessage}
			<div class="feedback-toast" transition:fade>
				{feedbackMessage}
			</div>
		{/if}

		<div class="focus-area">
			{#if isJourneyMode && mistakes === 0 && !completed && !isLandscapeMobile}
				<div class="star-criteria" aria-label="Star criteria">
					<span class="star-chip gold">⭐⭐⭐ No mistakes</span>
					<span class="star-sep">·</span>
					<span class="star-chip silver">⭐⭐ 1-2 mistakes</span>
					<span class="star-sep">·</span>
					<span class="star-chip bronze">⭐ 3+</span>
				</div>
			{/if}

			<!-- Landscape name phase: big exercise name + live note feedback -->
			{#if isLandscapeMobile && landscapePhase === 'name'}
				<div
					class="landscape-name-panel"
					class:note-correct={lastNoteDisplay?.correct === true}
					class:note-wrong={lastNoteDisplay?.correct === false}
					transition:fade
				>
					<div class="lnp-title">{exerciseType?.replace(/_/g, ' ') || 'Practice'}</div>
					{#if prompt}
						<div class="lnp-prompt">{prompt}</div>
					{/if}
					<div class="lnp-feedback">
						{#if lastNoteDisplay}
							<span
								class="lnp-note"
								class:correct={lastNoteDisplay.correct}
								class:wrong={!lastNoteDisplay.correct}
							>
								{lastNoteDisplay.note}
								<span class="lnp-icon">{lastNoteDisplay.correct ? '✓' : '✗'}</span>
							</span>
						{:else}
							<span class="lnp-cue">🎹 Play a note</span>
						{/if}
					</div>
					<div class="lnp-hint">
						{mistakes === 0
							? 'A wrong note will reveal the score'
							: `${SCORE_SHOW_AFTER_MISTAKES - mistakes} more mistake→ score`}
					</div>
				</div>
			{/if}

			<!-- Prompt card: not shown during landscape name phase (name panel replaces it) -->
			{#if prompt && !(isLandscapeMobile && landscapePhase === 'name')}
				<div class="prompt-card card-premium">
					<div class="prompt-text">{prompt}</div>
				</div>
			{/if}

			{#if showScoreState}
				<div class="score-container card-premium" in:fade>
					<Score {scoreProps} />
				</div>
			{/if}

			{#if helpMessage && !isLandscapeMobile}
				<div class="adaptive-help-text">
					{helpMessage}
				</div>
			{/if}

			{#if expectedNotes.length > 0}
				<div class="expected-notes visually-hidden" aria-live="polite">
					{expectedNotes.map((n) => MidiToNote[n]).join(', ')}
				</div>
			{/if}

			<!-- Landscape keyboard phase: show expected notes as text above keyboard -->
			{#if isLandscapeMobile && landscapePhase === 'keyboard'}
				<div class="landscape-keyboard-hint" transition:fade>
					Expected: {expectedNotes.map((n) => MidiToNote[n]).join(' · ')}
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
	perfectCompletions={completedPerfectCompletions}
	requiredPerfectCompletions={completedRequiredPerfectCompletions}
	onContinue={handleModalContinue}
	onRetry={handleModalRetry}
/>

<style>
	:global(.exercise-layout) {
		display: flex;
		height: calc(100vh - 80px);
		overflow: hidden;
		gap: 1rem;
		padding: 1rem;
		background: var(--color-bg);
	}

	/* Sidebar wrapper — transparent wrapper on desktop */
	.sidebar-wrapper {
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
	}

	/* Backdrop overlay (mobile landscape only — hidden by default) */
	.sidebar-backdrop {
		display: none;
	}

	/* Mobile landscape controls (hidden on desktop) */
	.mobile-header-controls {
		display: none;
	}

	/* Landscape-only elements — hidden outside landscape */
	.landscape-phase-bar,
	.landscape-name-panel,
	.landscape-keyboard-hint {
		display: none;
	}

	.exercise-main {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		overflow-y: auto;
		padding-right: 0.5rem;
	}

	/* Beat flash indicator */
	.beat-indicator {
		height: 3px;
		border-radius: 2px;
		background: var(--color-border);
		transition:
			background 0.05s ease,
			box-shadow 0.05s ease;
		margin-bottom: 0.25rem;
	}

	.beat-indicator.flash {
		background: var(--color-primary);
		box-shadow: 0 0 8px var(--color-primary);
	}

	.beat-indicator.strict.flash {
		background: var(--color-error, #f87171);
		box-shadow: 0 0 12px var(--color-error, #f87171);
	}

	@media (prefers-reduced-motion: reduce) {
		.beat-indicator {
			transition: none;
		}
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

	.velocity-pill {
		align-items: center;
		gap: 0.4rem;
	}

	.velocity-bar {
		display: inline-block;
		width: 40px;
		height: 6px;
		background: var(--color-border);
		border-radius: 3px;
		overflow: hidden;
	}

	.velocity-fill {
		display: block;
		height: 100%;
		border-radius: 3px;
		transition: width 0.1s ease;
	}

	.velocity-fill.soft {
		background: #60a5fa;
	}
	.velocity-fill.medium {
		background: #34d399;
	}
	.velocity-fill.loud {
		background: #f87171;
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
	}

	/* ── Mobile landscape: progressive phase layout ── */
	@media (orientation: landscape) and (max-height: 600px) {
		:global(.exercise-layout) {
			height: 100vh;
			padding: 0;
			gap: 0;
			overflow: hidden;
			flex-direction: row;
		}

		/* Sidebar becomes a fixed overlay */
		.sidebar-wrapper {
			position: fixed;
			top: 0;
			left: 0;
			height: 100%;
			width: 240px;
			z-index: 200;
			transform: translateX(-100%);
			transition: transform 0.2s ease;
			overflow-y: auto;
		}

		.sidebar-wrapper.open {
			transform: translateX(0);
		}

		.sidebar-backdrop {
			display: block;
			position: fixed;
			inset: 0;
			background: rgba(0, 0, 0, 0.5);
			z-index: 199;
		}

		.exercise-main {
			flex: 1;
			width: 100%;
			padding: 0;
			gap: 0;
			overflow: hidden;
			display: flex;
			flex-direction: column;
		}

		.breadcrumbs {
			display: none;
		}

		/* Compact header row */
		.exercise-header {
			padding: 0.2rem 0.5rem;
			min-height: 36px;
			flex-shrink: 0;
		}

		.info-group h1 {
			font-size: 0.85rem;
		}

		.stat-pill {
			padding: 0.15rem 0.4rem;
			font-size: 0.65rem;
			border-radius: 10px;
		}

		.mobile-header-controls {
			display: flex;
			align-items: center;
			gap: 0.25rem;
			margin-left: 0.25rem;
		}

		.sidebar-toggle-btn {
			background: var(--color-surface);
			border: 1px solid var(--color-border);
			color: var(--color-text-muted);
			border-radius: 6px;
			padding: 0.15rem 0.4rem;
			font-size: 0.85rem;
			cursor: pointer;
			line-height: 1;
		}

		/* Phase progress bar */
		.landscape-phase-bar {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 0.3rem;
			padding: 0.15rem 0.5rem;
			background: var(--color-surface);
			border-bottom: 1px solid var(--color-border);
			flex-shrink: 0;
		}

		.lp-seg {
			font-size: 0.62rem;
			font-weight: 600;
			color: var(--color-text-muted);
			padding: 0.1rem 0.4rem;
			border-radius: 8px;
			transition:
				color 0.2s,
				background 0.2s;
		}

		.lp-seg.active {
			color: var(--color-primary);
			background: color-mix(in srgb, var(--color-primary) 15%, transparent);
		}

		.lp-arrow {
			font-size: 0.65rem;
			color: var(--color-text-muted);
			opacity: 0.5;
		}

		/* Focus area fills everything below header + phase bar */
		.focus-area {
			flex: 1;
			gap: 0;
			overflow: hidden;
			justify-content: stretch;
			display: flex;
			flex-direction: column;
			min-height: 0;
		}

		.star-criteria,
		.adaptive-help-text {
			display: none;
		}

		/* ── Phase: name ── */
		.landscape-name-panel {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 0.4rem;
			padding: 0.5rem 1rem;
			min-height: 0;
			border: 2px solid var(--color-border);
			border-radius: 10px;
			margin: 0.3rem;
			transition:
				border-color 0.15s,
				background 0.15s;
		}

		.landscape-name-panel.note-correct {
			border-color: var(--color-success);
			background: color-mix(in srgb, var(--color-success) 8%, var(--color-surface-raised));
		}

		.landscape-name-panel.note-wrong {
			border-color: var(--color-error, #f87171);
			background: color-mix(in srgb, var(--color-error, #f87171) 8%, var(--color-surface-raised));
		}

		.lnp-title {
			font-size: 1.2rem;
			font-weight: 800;
			text-transform: uppercase;
			color: var(--color-primary);
			letter-spacing: 0.05em;
		}

		.lnp-prompt {
			font-size: 1rem;
			font-weight: 700;
			color: var(--color-text);
		}

		.lnp-feedback {
			display: flex;
			align-items: center;
			justify-content: center;
			min-height: 2.5rem;
		}

		.lnp-note {
			font-size: 2rem;
			font-weight: 800;
			display: flex;
			align-items: center;
			gap: 0.3rem;
			transition: color 0.1s;
		}

		.lnp-note.correct {
			color: var(--color-success);
		}

		.lnp-note.wrong {
			color: var(--color-error, #f87171);
		}

		.lnp-icon {
			font-size: 1.2rem;
		}

		.lnp-cue {
			font-size: 1rem;
			color: var(--color-text-muted);
		}

		.lnp-hint {
			font-size: 0.65rem;
			color: var(--color-text-muted);
			opacity: 0.7;
		}

		/* ── Phase: score ── */
		.score-container {
			flex: 1;
			min-height: 0;
			padding: 0;
			align-items: stretch;
		}

		/* Compact prompt above score */
		.prompt-card {
			padding: 0.2rem 0.5rem;
			flex-shrink: 0;
			min-height: 0;
		}

		.prompt-text {
			font-size: 1.1rem;
		}

		/* ── Phase: keyboard ── */
		.landscape-keyboard-hint {
			font-size: 0.7rem;
			font-weight: 600;
			color: var(--color-text-muted);
			text-align: center;
			padding: 0.2rem 0.5rem;
			flex-shrink: 0;
			letter-spacing: 0.03em;
		}

		.keyboard-container {
			flex: 1;
			min-height: 100px;
			max-height: 55vh;
			flex-shrink: 0;
		}

		/* Override: hidden class still hides keyboard in non-keyboard phases */
		.keyboard-container.hidden {
			display: none;
		}

		/* Minimal footer */
		.exercise-footer {
			padding: 0;
			flex-shrink: 0;
		}

		.feedback-toast {
			top: 60px;
			padding: 0.35rem 0.75rem;
			font-size: 0.75rem;
		}
	}

	.back-btn {
		background: transparent;
		border: 1px solid var(--color-border);
		color: var(--color-text-muted);
		border-radius: 8px;
		padding: 0.35rem 0.75rem;
		font-size: 0.85rem;
		cursor: pointer;
		flex-shrink: 0;
	}
	.back-btn:hover {
		color: var(--color-text);
		border-color: var(--color-text-muted);
	}

	.breadcrumbs {
		font-size: 0.8rem;
		color: var(--color-text-muted);
		margin-bottom: 0.5rem;
		display: flex;
		align-items: center;
		gap: 0.15rem;
	}
	.breadcrumb-link {
		color: var(--color-primary);
		text-decoration: none;
	}
	.breadcrumb-link:hover {
		text-decoration: underline;
	}
	.breadcrumb-current {
		color: var(--color-text-muted);
	}
	.breadcrumb-sep {
		color: var(--color-text-muted);
		opacity: 0.5;
	}

	.star-criteria {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		justify-content: center;
		font-size: 0.78rem;
		color: var(--color-text-muted);
		margin-bottom: 0.75rem;
		flex-wrap: wrap;
	}
	.star-chip {
		opacity: 0.7;
	}
	.star-sep {
		opacity: 0.4;
	}

	/* Visually hidden utility for accessible expected notes (readable by tests/screen readers) */
	.visually-hidden {
		position: absolute !important;
		width: 1px !important;
		height: 1px !important;
		padding: 0 !important;
		margin: -1px !important;
		overflow: hidden !important;
		clip: rect(0 0 0 0) !important;
		white-space: nowrap !important;
		border: 0 !important;
	}
</style>
