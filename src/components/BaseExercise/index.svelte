<script lang="ts">
	/**
	 * BaseExercise - Refactored to use ExerciseController
	 * Orchestrates: MIDI input, UI rendering, state management
	 */
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { fade } from 'svelte/transition';
	import type { Snippet } from 'svelte';
	
	// Services
	import { midiManager } from '$lib/MIDIManager';
	import { audioManager } from '$lib/AudioManager';
	import { journeyService } from '$lib/JourneyService';
	import { logger } from '$lib/LoggingService';
	
	// Types
	import type {
		MidiNote,
		Note,
		NoteEvent,
		ScoreProps,
		ExerciseResult,
		ExerciseType
	} from '$lib/types/types';
	import type { ExerciseAPI } from '$lib/types/exercise-api';
	
	// Child Components
	import DebugPanel from '../DebugPanel.svelte';
	import Keyboard from '../Keyboard.svelte';
	import Metronome from '../Metronome.svelte';
	import Score from '../Score.svelte';
	import OSMDScore from '../OSMDScore.svelte';
	import LessonCompleteModal from '../LessonCompleteModal.svelte';
	import AudioOutputSelector from '../AudioOutputSelector.svelte';
	
	// Controllers
	import { createExerciseController, type ExerciseState } from '$lib/ExerciseController';
	import { createTempoManager } from '$lib/TempoManager';
	
	// Utils
	import { calculateOptimalRange, getNoteRole } from '$lib/MusicTheoryUtils';
	import { AllNotes, NoteToMidi, DEFAULT_OCTAVE, MidiToNote } from '$lib/types/notes.constants';

	// Props
	interface Props {
		// Core
		randomMode?: boolean;
		description: string;
		initialNote: Note;
		exerciseType?: ExerciseType;
		
		// Functions
		generateExpectedNotes: (selectedNote: Note, ...args: unknown[]) => MidiNote[];
		generateScoreProps: (selectedNote: Note) => ScoreProps;
		validateNoteEvent: (
			selectedNote: Note,
			event: NoteEvent,
			expectedNotes: MidiNote[],
			currentNotes: MidiNote[]
		) => {
			isCorrect: boolean;
			message: string;
			collected: boolean;
			resetCollected: boolean;
			resetMistakes?: boolean;
		};
		isCompleted: (currentNotes: MidiNote[], expectedNotes: MidiNote[]) => boolean;
		onReset?: () => void;
		onComplete?: () => void;
		
		// UI Options
		showScore?: boolean;
		progressiveHints?: boolean;
		prompt?: string;
		showTempoControl?: boolean;
		showTrainingControl?: boolean;
		defaultBpm?: number;
		timingModeLabel?: string;
		breadcrumbParent?: string;
		perNoteTiming?: boolean;
		stopOnMistake?: boolean;
		
		// Snippet
		children?: Snippet<[ExerciseAPI]>;
	}

	let {
		randomMode = false,
		description,
		initialNote,
		exerciseType = 'chord',
		generateExpectedNotes,
		generateScoreProps,
		validateNoteEvent,
		isCompleted,
		onReset,
		onComplete,
		showScore,
		progressiveHints = true,
		prompt,
		showTempoControl = true,
		showTrainingControl = true,
		defaultBpm = 120,
		timingModeLabel = 'Play on beat',
		breadcrumbParent,
		perNoteTiming = false,
		stopOnMistake = false,
		children
	}: Props = $props();

	// State
	let selectedNote: Note = $state(initialNote ?? 'C');
	let debugMode = $state(false);
	let tempoMode = $state(false);
	let strictBeat = $state(false);
	let currentBpm = $state(defaultBpm ?? 120);
	let showNotesRoles = $state(false);
	let lastVelocity = $state(0);
	
	// Modal state
	let showCompleteModal = $state(false);
	let completedStars = $state(0);
	let completedAccuracy = $state(0);
	let completedXp = $state(0);

	// Controllers (created in onMount)
	let exerciseController = $state<ReturnType<typeof createExerciseController> | null>(null);
	let tempoManager = $state<ReturnType<typeof createTempoManager> | null>(null);

	// Derived state
	const unitId = $derived(page.url.searchParams.get('unitId'));
	const lessonId = $derived(page.url.searchParams.get('lessonId'));
	const isJourneyMode = $derived(!!unitId && !!lessonId);

	let expectedNotes = $derived(generateExpectedNotes(selectedNote));
	let scoreProps = $derived(generateScoreProps(selectedNote));
	
	let showScoreState = $derived.by(() => {
		if (showScore === false) return false;
		if (exerciseType === 'partition') return true;
		if (!progressiveHints) return showScore ?? true;
		return (exerciseController?.getMistakes() ?? 0) >= 1;
	});

	let showKeyboard = $derived(
		debugMode || (progressiveHints && (exerciseController?.getMistakes() ?? 0) >= 3)
	);

	// Exercise API exposed to children
	let api: ExerciseAPI = $derived({
		selectedNote,
		currentNotes: exerciseController?.getCurrentNotes() ?? [],
		expectedNotes: expectedNotes as ReadonlyArray<MidiNote>,
		mistakes: exerciseController?.getMistakes() ?? 0,
		completed: exerciseController?.isCompleted() ?? false,
		collectedNotes: exerciseController?.getState().collectedNotes ?? new Set(),
		debugMode,
		feedbackMessage: exerciseController?.getState().feedbackMessage ?? '',
		showNotesRoles,
		tempoMode,
		toggleDebug: () => debugMode = !debugMode,
		showFeedback: (msg: string, type: 'success' | 'error' | 'info') => 
			exerciseController?.showFeedback(msg, type),
		toggleTempoMode: () => tempoMode = !tempoMode,
		handleTick: (timestamp: number, beatNumber: number, isDownbeat: boolean) => 
			tempoManager?.handleTick(beatNumber, isDownbeat),
		completeExercise: (extra?: Partial<ExerciseResult>) => handleComplete(extra)
	});

	onMount(() => {
		// Initialize controllers
		exerciseController = createExerciseController({
			exerciseType,
			prompt,
			progressiveHints,
			stopOnMistake,
			perNoteTiming
		});
		
		exerciseController.setCallbacks(
			(state: ExerciseState) => {
				// State change callback - triggers reactivity
				logger.debug('Exercise state updated', { mistakes: state.mistakes }, 'BaseExercise');
			},
			(accuracy: number, timeElapsed: number) => {
				// Complete callback
				logger.info('Exercise completed', { accuracy, timeElapsed }, 'BaseExercise');
			},
			validateNoteEvent
		);
		
		exerciseController.setSelectedNote(selectedNote);

		tempoManager = createTempoManager();
		tempoManager.bpm = currentBpm;
		tempoManager.tempoMode = tempoMode;
		tempoManager.strictBeat = strictBeat;

		// Initialize MIDI
		midiManager.initialize().then(() => {
			midiManager.setupVirtualKeyboard();
			midiManager.setEventHandlers({
				onNoteOn: handleNoteOn,
				onNoteOff: handleNoteOff
			});
		});

		// Unlock audio on first gesture
		const attemptUnlock = async () => {
			if (audioManager.needsUserGesture()) {
				await audioManager.unlock();
			}
		};
		window.addEventListener('pointerdown', attemptUnlock, { once: true });
		window.addEventListener('keydown', attemptUnlock, { once: true });
	});

	onDestroy(() => {
		midiManager.cleanup();
	});

	function handleNoteOn(note: NoteEvent): void {
		lastVelocity = note.velocity;
		
		// Check tempo if enabled
		let isOffBeat = false;
		if (tempoMode && tempoManager) {
			const tempoCheck = tempoManager.validateNoteTiming(
				note,
				exerciseType,
				exerciseController?.getState().collectedNotes.size ?? 0,
				{ perNoteTiming }
			);
			
			if (!tempoCheck.valid && tempoCheck.error) {
				exerciseController?.showFeedback(tempoCheck.error, 'error');
				isOffBeat = true;
				audioManager.playError();
				return;
			}
		}

		const result = exerciseController?.handleNoteOn(note, isOffBeat, expectedNotes);
		
		if (result?.shouldComplete) {
			handleComplete();
		}
	}

	function handleNoteOff(note: NoteEvent): void {
		exerciseController?.handleNoteOff(note);
	}

	function handleComplete(extra?: Partial<ExerciseResult>): void {
		const state = exerciseController?.getState();
		if (!state) return;

		const accuracy = Math.max(
			0,
			Math.round(((expectedNotes.length - state.mistakes) / expectedNotes.length) * 100)
		);

		if (isJourneyMode && unitId && lessonId) {
			journeyService.completeLesson(unitId, lessonId, {
				accuracy,
				timeSpent: Date.now() - performance.now(),
				stars: accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : 1,
				...extra
			});
			
			completedStars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : 1;
			completedAccuracy = accuracy;
			showCompleteModal = true;
		} else {
			onComplete?.();
		}
	}

	function resetExercise(): void {
		exerciseController?.reset();
		tempoManager?.reset();
		onReset?.();
	}

	function handleBack(): void {
		if (isJourneyMode) {
			goto(resolve('/journey'));
		} else {
			history.back();
		}
	}
</script>

<div class="exercise-page">
	<!-- Header -->
	<header class="exercise-header">
		<button class="back-btn" onclick={handleBack}>← {isJourneyMode ? 'Journey' : 'Back'}</button>
		<h1>{exerciseType?.toUpperCase() || 'PRACTICE'}</h1>
	</header>

	<!-- Feedback -->
	{#if exerciseController?.getState().feedbackMessage}
		<div class="feedback-toast" transition:fade>
			{exerciseController.getState().feedbackMessage}
		</div>
	{/if}

	<!-- Main Content -->
	<main class="exercise-main">
		<!-- Note Selector -->
		<div class="note-selector">
			<label for="note-select">Note:</label>
			<select id="note-select" bind:value={selectedNote} onchange={resetExercise} aria-label="Select root note">
				{#each AllNotes as note}
					<option value={note}>{note}</option>
				{/each}
			</select>
		</div>

		<!-- Score Display -->
		{#if showScoreState}
			<div class="score-container">
				<!-- TODO: Convert ScoreProps to MusicXML string -->
			<div class="score-placeholder">Score: {scoreProps.selectedNote}</div>
			</div>
		{/if}

		<!-- Keyboard -->
		{#if showKeyboard}
			<div class="keyboard-container">
				<Keyboard
					{...calculateOptimalRange(expectedNotes)}
					midiNotes={exerciseController?.getCurrentNotes() ?? []}
					{debugMode}
					noteRoles={Object.fromEntries(
						expectedNotes.map((note) => [
							String(note),
							getNoteRole(note, NoteToMidi[`${selectedNote}${DEFAULT_OCTAVE}` as keyof typeof NoteToMidi])
						])
					) as { [key: string]: string }}
					expectedNotes={expectedNotes}
					showExpected={(exerciseController?.getMistakes() ?? 0) >= 3}
				/>
			</div>
		{/if}

		<!-- Custom Exercise Content -->
		{#if children}
			{@render children(api)}
		{/if}
	</main>

	<!-- Controls -->
	<aside class="exercise-controls">
		<button class="reset-btn" onclick={resetExercise}>Reset</button>
		
		{#if showTempoControl}
			<div class="tempo-control">
				<label>Tempo: {currentBpm} BPM</label>
				<input 
					type="range" 
					min="40" 
					max="200" 
					bind:value={currentBpm}
					onchange={() => tempoManager && (tempoManager.bpm = currentBpm)}
				/>
			</div>
		{/if}
		
		<button id="debug-toggle" onclick={() => debugMode = !debugMode}>
			Keyboard: {debugMode ? 'Visible' : 'Hidden'}
		</button>
	</aside>

	<!-- Debug Panel -->
	{#if debugMode}
		<div class="debug-panel-wrapper">
			<DebugPanel
				noteEvents={exerciseController?.getCurrentNotes().map(n => ({ 
					noteNumber: n, 
					velocity: lastVelocity,
					type: 'on',
					noteName: MidiToNote[n]?.slice(0, -1) as Note,
					noteFullName: MidiToNote[n],
					timestamp: Date.now(),
					channel: 1
				})) ?? []}
				expectedNotes={expectedNotes}
				currentNotes={exerciseController?.getCurrentNotes() ?? []}
				{debugMode}
					onToggleDebugMode={() => debugMode = !debugMode}
				virtualMidi={midiManager.getVirtualMidi() ?? undefined}
			/>
		</div>
	{/if}

	<!-- Completion Modal -->
	{#if showCompleteModal}
		<LessonCompleteModal
			stars={completedStars}
			accuracy={completedAccuracy}
			onClose={() => goto(resolve('/journey'))}
		/>
	{/if}
</div>

<style>
	.exercise-page {
		display: flex;
		flex-direction: column;
		height: 100vh;
		padding: 1rem;
		gap: 1rem;
	}

	.exercise-header {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.back-btn {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		padding: 0.5rem 1rem;
		border-radius: 8px;
		cursor: pointer;
	}

	.feedback-toast {
		position: fixed;
		top: 80px;
		left: 50%;
		transform: translateX(-50%);
		background: var(--color-surface-raised);
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		z-index: 100;
	}

	.exercise-main {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		overflow-y: auto;
	}

	.note-selector {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.score-container {
		flex: 1;
		min-height: 200px;
		background: white;
		border-radius: 8px;
		overflow: auto;
	}

	.keyboard-container {
		height: 150px;
	}

	.exercise-controls {
		display: flex;
		gap: 1rem;
		align-items: center;
		padding: 1rem;
		background: var(--color-surface);
		border-radius: 8px;
	}

	.reset-btn {
		background: var(--color-primary);
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		cursor: pointer;
	}

	.tempo-control {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.debug-panel-wrapper {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 80%;
		max-width: 800px;
		max-height: 80%;
		background: var(--color-surface-raised);
		border-radius: 12px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
		z-index: 200;
		overflow: auto;
	}
</style>
