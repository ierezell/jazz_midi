<script lang="ts">
	import { audioManager } from '$lib/AudioManager';
	import { midiManager } from '$lib/MIDIManager';
	import { calculateOptimalRange } from '$lib/MusicTheoryUtils';
	import { AllNotes } from '$lib/types/notes.constants';
	import type {
		BaseKeyboardProps,
		BaseScoreProps,
		MidiNote,
		Note,
		NoteEvent
	} from '$lib/types/types';
	import { onDestroy, onMount } from 'svelte';
	import DebugPanel from './DebugPanel.svelte';
	import InteractiveKeyboard from './keyboard/InteractiveKeyboard.svelte';
	import Score from './Score.svelte';

	interface BaseExerciseProps {
		exerciseTitle: string;
		exerciseDescription?: string;
		initialSelectedNote?: Note;
		exerciseType: 'chord' | 'scale' | 'progression';
		randomMode?: boolean;
		generateExpectedNotes: (selectedNote: Note, ...args: any[]) => MidiNote[];
		validateNoteEvent?: (
			event: NoteEvent,
			expectedNotes: MidiNote[],
			currentNotes: MidiNote[],
			sequentialMode?: boolean
		) => { isCorrect: boolean; message: string };
		isCompleted?: (currentNotes: MidiNote[], expectedNotes: MidiNote[]) => boolean;
		scoreProps?: Partial<BaseScoreProps>;
		keyboardProps?: Partial<BaseKeyboardProps>;
		showProgressInfo?: boolean;
		customControls?: boolean;
		onExerciseComplete?: () => void;
		onExerciseReset?: () => void;
	}

	let {
		exerciseTitle,
		exerciseDescription = '',
		initialSelectedNote = 'C',
		exerciseType,
		randomMode = false,
		generateExpectedNotes,
		validateNoteEvent,
		isCompleted,
		scoreProps = {},
		keyboardProps = {},
		showProgressInfo = true,
		customControls = false,
		onExerciseComplete,
		onExerciseReset,
		children
	}: BaseExerciseProps & { children?: any } = $props();

	// State management - all common logic centralized here
	let selectedNote: Note = $state(initialSelectedNote);
	let noteEvents: NoteEvent[] = $state([]);
	let mistakes = $state(0);
	let startTime = $state(0);
	let completed = $state(false);
	let debugMode = $state(false);
	let feedbackMessage = $state('');
	let showChordTones = $state(false);

	// Derived values
	let currentNotes = $derived(noteEvents.map((e) => e.noteNumber));
	let expectedNotes = $derived(generateExpectedNotes(selectedNote));
	let showNoteNames = $derived(mistakes >= 3);
	let showKeyboard = $derived(debugMode);

	// Default validation logic
	function defaultValidateNoteEvent(
		event: NoteEvent,
		expectedNotes: MidiNote[],
		currentNotes: MidiNote[]
	): { isCorrect: boolean; message: string } {
		if (expectedNotes.includes(event.noteNumber)) {
			return { isCorrect: true, message: 'Correct!' };
		}
		return { isCorrect: false, message: 'Try again!' };
	}

	// Default completion check
	function defaultIsCompleted(currentNotes: MidiNote[], expectedNotes: MidiNote[]): boolean {
		const sorted1 = [...currentNotes].sort();
		const sorted2 = [...expectedNotes].sort();
		return sorted1.length === sorted2.length && sorted1.every((note, i) => note === sorted2[i]);
	}

	// MIDI event handlers - centralized logic
	function handleNoteOn(note: NoteEvent): void {
		noteEvents = [...noteEvents, note];

		const validator = validateNoteEvent || defaultValidateNoteEvent;
		const result = validator(note, expectedNotes, currentNotes);

		if (result.isCorrect) {
			showFeedback(result.message, 'success');
			audioManager.playSuccess();
		} else {
			mistakes++;
			showFeedback(result.message, 'error');
			audioManager.playError();
		}

		const completionChecker = isCompleted || defaultIsCompleted;
		if (completionChecker(currentNotes, expectedNotes)) {
			completeExercise();
		}
	}

	function handleNoteOff(note: NoteEvent): void {
		noteEvents = noteEvents.filter((e) => e.noteNumber !== note.noteNumber);
	}

	// Feedback and completion logic
	function showFeedback(message: string, type: 'success' | 'error' | 'info'): void {
		feedbackMessage = message;
		setTimeout(() => {
			feedbackMessage = '';
		}, 2000);
	}

	function completeExercise(): void {
		completed = true;
		const timeElapsed = Date.now() - startTime;
		const accuracy = Math.round(((expectedNotes.length - mistakes) / expectedNotes.length) * 100);
		showFeedback('Exercise completed!', 'success');
		audioManager.playSound?.('success');
		onExerciseComplete?.();
	}

	// Control handlers
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
		onExerciseReset?.();
	}

	function toggleDebug(): void {
		debugMode = !debugMode;
	}

	// Initialize MIDI
	onMount(async () => {
		await midiManager.initialize();
		midiManager.setEventHandlers({
			onNoteOn: handleNoteOn,
			onNoteOff: handleNoteOff
		});
		startTime = Date.now();
	});

	onDestroy(() => {
		midiManager.cleanup();
	});

	let keyboardConfig = $derived.by(() => {
		if (expectedNotes.length === 0) {
			return {
				middleC: 60 as MidiNote,
				octaves: 2
			};
		}
		return calculateOptimalRange(expectedNotes);
	});

	let finalKeyboardProps = $derived({
		midiNotes: currentNotes,
		middleC: keyboardConfig.middleC,
		octaves: keyboardConfig.octaves,
		interactive: debugMode,
		showLabels: showNoteNames,
		chordToneInfo: keyboardProps.chordToneInfo || [],
		showChordTones: keyboardProps.showChordTones || showChordTones,
		expectedNotes: expectedNotes,
		...keyboardProps
	});

	let finalScoreProps = $derived({
		leftHand: scoreProps.leftHandNotes || [],
		rightHand: scoreProps.rightHandNotes || [],
		selectedNote: selectedNote,
		...scoreProps
	});

	function handleNoteSelectEvent(event: Event) {
		const target = event.target as HTMLSelectElement;
		const note = target.value as Note;
		handleNoteSelect(note);
	}

	let progressPercentage = $derived.by(() => {
		if (expectedNotes.length === 0) return 0;
		const correctNotes = currentNotes.filter((note: MidiNote) => expectedNotes.includes(note));
		return Math.round((correctNotes.length / expectedNotes.length) * 100);
	});

	// Expose functions for child components
	let exposedAPI = $derived({
		selectedNote,
		currentNotes,
		expectedNotes,
		mistakes,
		completed,
		debugMode,
		feedbackMessage,
		showChordTones,
		handleNoteSelect,
		resetExercise,
		toggleDebug,
		showFeedback,
		setShowChordTones: (show: boolean) => {
			showChordTones = show;
		}
	});
</script>

<div class="exercise-container">
	<header class="exercise-header">
		<h1>{exerciseTitle}</h1>
		{#if exerciseDescription}
			<p class="exercise-description">{exerciseDescription}</p>
		{/if}
	</header>

	{#if feedbackMessage}
		<div class="feedback" role="alert">
			{feedbackMessage}
		</div>
	{/if}

	<div class="exercise-controls">
		{#if !randomMode}
			<div class="control-group">
				<label for="note-select">Key:</label>
				<select id="note-select" value={selectedNote} onchange={handleNoteSelectEvent}>
					{#each AllNotes as note}
						<option value={note}>{note}</option>
					{/each}
				</select>
			</div>
		{/if}
		{#if !customControls}
			<div class="control-group">
				<button onclick={toggleDebug} class="debug-btn">
					{debugMode ? 'Disable' : 'Enable'} Debug Mode
				</button>
				<button onclick={resetExercise} class="reset-btn"> Reset Exercise </button>
			</div>
		{/if}
	</div>

	{#if showProgressInfo}
		<div class="progress-info">
			<div class="progress-bar">
				<div class="progress-fill" style="width: {progressPercentage}%"></div>
			</div>
			<div class="progress-stats">
				<span>Progress: {progressPercentage}%</span>
				<span>Errors: {mistakes}</span>
			</div>
		</div>
	{/if}

	<div class="score-section">
		<Score {...finalScoreProps} />
	</div>

	<div class="keyboard-section" class:hidden={!showKeyboard}>
		<InteractiveKeyboard {...finalKeyboardProps} />
	</div>

	{#if debugMode}
		<div class="debug-section">
			<DebugPanel {noteEvents} {expectedNotes} {currentNotes} />
		</div>
	{/if}

	{#if customControls}
		<div class="exercise-content">
			{@render children?.(exposedAPI)}
		</div>
	{/if}
</div>

<style>
	.exercise-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.exercise-header {
		text-align: center;
		margin-bottom: 1rem;
	}

	.exercise-header h1 {
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: var(--color-text, #333);
	}

	.exercise-description {
		font-size: 1.1rem;
		color: var(--color-text-secondary, #666);
		margin: 0;
	}

	.feedback {
		padding: 1rem;
		margin: 1rem 0;
		border-radius: 0.5rem;
		text-align: center;
		font-weight: 500;
		background-color: #e8f5e8;
		color: #2d5d2d;
		border: 1px solid #a8d8a8;
	}

	.exercise-controls {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: var(--color-bg-secondary, #f8f9fa);
		border-radius: 8px;
		border: 1px solid var(--color-border, #e1e5e9);
	}

	.control-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.control-group label {
		font-weight: 500;
		color: var(--color-text, #333);
	}

	select {
		padding: 0.5rem;
		border: 1px solid var(--color-border, #ccc);
		border-radius: 4px;
		background: white;
		font-size: 1rem;
	}

	button {
		padding: 0.5rem 1rem;
		border: 1px solid var(--color-border, #ccc);
		border-radius: 4px;
		background: var(--color-bg, white);
		color: var(--color-text, #333);
		cursor: pointer;
		font-size: 1rem;
		transition: all 0.2s ease;
	}

	button:hover {
		background: var(--color-bg-hover, #f0f0f0);
		border-color: var(--color-border-hover, #999);
	}

	.debug-btn {
		background: var(--color-debug, #e3f2fd);
		border-color: var(--color-debug-border, #2196f3);
	}

	.reset-btn {
		background: var(--color-warning, #fff3e0);
		border-color: var(--color-warning-border, #ff9800);
	}

	.progress-info {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.progress-bar {
		width: 100%;
		height: 8px;
		background: var(--color-bg-secondary, #e0e0e0);
		border-radius: 4px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(
			90deg,
			var(--color-success, #4caf50),
			var(--color-success-light, #8bc34a)
		);
		transition: width 0.3s ease;
	}

	.progress-stats {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.9rem;
		color: var(--color-text-secondary, #666);
	}

	.score-section {
		min-height: 200px;
		display: flex;
		justify-content: center;
		align-items: center;
		background: var(--color-bg, white);
		border: 1px solid var(--color-border, #e1e5e9);
		border-radius: 8px;
		padding: 1rem;
	}

	.keyboard-section {
		transition: opacity 0.3s ease;
	}

	.keyboard-section.hidden {
		opacity: 0.3;
		pointer-events: none;
	}

	.debug-section {
		background: var(--color-debug-bg, #f3e5f5);
		border: 1px solid var(--color-debug-border, #9c27b0);
		border-radius: 8px;
		padding: 1rem;
	}

	.exercise-content {
		flex: 1;
	}

	@media (max-width: 768px) {
		.exercise-container {
			padding: 0.5rem;
			gap: 1rem;
		}

		.exercise-header h1 {
			font-size: 1.6rem;
			margin-bottom: 0.25rem;
		}

		.exercise-description {
			font-size: 1rem;
		}

		.exercise-controls {
			flex-direction: column;
			gap: 0.75rem;
			padding: 0.75rem;
		}

		.control-group {
			width: 100%;
			justify-content: center;
			flex-wrap: wrap;
			gap: 0.5rem;
		}

		.control-group label {
			min-width: 60px;
			text-align: center;
		}

		select,
		button {
			min-height: 44px;
			font-size: 1rem;
		}

		.progress-stats {
			flex-direction: column;
			text-align: center;
			gap: 0.25rem;
		}

		.score-section {
			min-height: 160px;
			padding: 0.5rem;
		}
	}
</style>
