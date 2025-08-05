<script lang="ts">
	import { chords, majorScales, MidiToNote, NoteToMidi } from '$lib/core';
	import { audioManager } from '$lib/managers/AudioManager';
	import { midiManager } from '$lib/managers/MIDIManager';
	import { userStatsService } from '$lib/services/UserStatsService';
	import type {
		ChordType,
		ExerciseResult,
		MidiNote,
		Note,
		NoteEvent,
		NoteFullName
	} from '$lib/types';
	import { onDestroy, onMount } from 'svelte';
	// Component imports
	import DebugPanel from './DebugPanel.svelte';
	import InteractiveKeyboard from './keyboard/InteractiveKeyboard.svelte';
	import Score from './Score.svelte';

	// ===== PROPS =====

	interface ExerciseProps {
		// Core exercise configuration
		title: string;
		description?: string;
		type: 'chord' | 'scale' | 'progression';

		// Exercise parameters
		selectedNote: Note;
		chordType?: ChordType;
		inversion?: 0 | 1 | 2 | 3;
		voicing?: 'full' | 'left-hand' | 'right-hand' | 'split';
		sequential?: boolean; // For scales

		// UI configuration
		showControls?: boolean;
		showScore?: boolean;
		autoKeyboardRange?: boolean;
		enableDebug?: boolean;

		// Callbacks
		onComplete?: (result: ExerciseResult) => void;
		onProgress?: (progress: number) => void;
		onMistake?: (note: MidiNote) => void;
	}

	let {
		title,
		description = '',
		type,
		selectedNote = $bindable('C'),
		chordType = $bindable('maj7'),
		inversion = $bindable(0),
		voicing = $bindable('full'),
		sequential = $bindable(true),
		showControls = true,
		showScore = true,
		autoKeyboardRange = true,
		enableDebug = false,
		onComplete,
		onProgress,
		onMistake
	}: ExerciseProps = $props();

	// ===== STATE =====

	let noteEvents: NoteEvent[] = $state([]);
	let currentNotes = $derived(noteEvents.map((e) => e.noteNumber));
	let debugMode = $state(false);
	let mistakes = $state(0);
	let startTime = $state(0);
	let completed = $state(false);
	let feedbackMessage = $state('');
	let feedbackType: 'success' | 'error' | 'info' = $state('info');

	// Auto-enable helpers based on mistakes
	let showNoteNames = $derived(mistakes >= 3);
	let showKeyboard = $derived(mistakes >= 6);

	// ===== COMPUTED PROPERTIES =====

	/**
	 * Get expected notes based on exercise type and parameters
	 */
	let expectedNotes = $derived.by(() => {
		switch (type) {
			case 'chord':
				return getChordNotes(selectedNote, chordType!, inversion!, voicing!);
			case 'scale':
				return getScaleNotes(selectedNote, sequential);
			case 'progression':
				return getProgressionNotes(); // Would implement based on requirements
			default:
				return [];
		}
	});

	/**
	 * Calculate optimal keyboard range
	 */
	let keyboardRange = $derived.by(() => {
		if (!autoKeyboardRange || expectedNotes.length === 0) {
			return { middleC: 60, octaves: 2 };
		}

		const minNote = Math.min(...expectedNotes);
		const maxNote = Math.max(...expectedNotes);
		const minC = Math.floor((minNote - 12) / 12) * 12 + 12;
		const maxC = Math.ceil((maxNote + 12) / 12) * 12;
		const totalRange = maxC - minC;
		const octaves = Math.max(2, Math.ceil(totalRange / 12));
		const middleC = minC + Math.floor((octaves * 12) / 2) - 6;

		return {
			middleC: Math.max(24, middleC),
			octaves: Math.min(7, octaves)
		};
	});

	/**
	 * Check if exercise is completed
	 */
	let isCompleted = $derived.by(() => {
		if (type === 'scale' && sequential) {
			// For sequential scales, check order
			return checkSequentialCompletion();
		} else {
			// For chords and non-sequential, check if all notes are pressed
			return arraysEqual(currentNotes.sort(), expectedNotes.sort());
		}
	});

	/**
	 * Calculate progress percentage
	 */
	let progress = $derived.by(() => {
		if (expectedNotes.length === 0) return 0;
		const completed = currentNotes.filter((note) => expectedNotes.includes(note));
		return Math.round((completed.length / expectedNotes.length) * 100);
	});

	// ===== EXERCISE LOGIC FUNCTIONS =====

	function getChordNotes(
		root: Note,
		chordType: ChordType,
		inversion: number,
		voicing: string
	): MidiNote[] {
		const rootMidi = NoteToMidi[`${root}4` as NoteFullName];
		const chord = chords(rootMidi, chordType, inversion as 0 | 1 | 2 | 3);

		let notes = [chord.root, chord.third, chord.fifth, chord.seventh].filter(
			(n) => n !== undefined
		) as MidiNote[];

		// Apply voicing
		switch (voicing) {
			case 'left-hand':
				return [chord.root, chord.seventh].filter((n) => n) as MidiNote[];
			case 'right-hand':
				return [chord.third, chord.fifth];
			case 'split':
				const leftHand = [chord.root - 12, (chord.seventh || chord.root) - 12].filter(
					(n) => n >= 24
				) as MidiNote[];
				const rightHand = [chord.third, chord.fifth];
				return [...leftHand, ...rightHand];
			default:
				return notes;
		}
	}

	function getScaleNotes(root: Note, sequential: boolean): MidiNote[] {
		const scale = majorScales[root];
		const middleScale = scale
			.map((note: NoteFullName) => (note.slice(0, -1) + '4') as NoteFullName)
			.slice(0, 8);
		return middleScale.map((note: NoteFullName) => NoteToMidi[note]);
	}

	function getProgressionNotes(): MidiNote[] {
		// Placeholder for progression logic
		return [];
	}

	function checkSequentialCompletion(): boolean {
		// For sequential exercises, check if notes were played in correct order
		// This would need more sophisticated state tracking
		return false;
	}

	function arraysEqual(a: MidiNote[], b: MidiNote[]): boolean {
		return a.length === b.length && a.every((note) => b.includes(note));
	}

	// ===== EVENT HANDLERS =====

	function handleNoteOn(note: NoteEvent): void {
		noteEvents = [...noteEvents, note];

		if (expectedNotes.includes(note.noteNumber)) {
			// Correct note
			showFeedback('Correct!', 'success');
			audioManager.playSound('success');
		} else {
			// Incorrect note
			mistakes++;
			showFeedback('Try again!', 'error');
			audioManager.playSound('error');
			onMistake?.(note.noteNumber);
		}

		// Check completion
		if (isCompleted) {
			completeExercise(true);
		}

		onProgress?.(progress);
	}

	function handleNoteOff(note: NoteEvent): void {
		noteEvents = noteEvents.filter((e) => e.noteNumber !== note.noteNumber);
	}

	function showFeedback(message: string, type: 'success' | 'error' | 'info'): void {
		feedbackMessage = message;
		feedbackType = type;
		setTimeout(() => {
			feedbackMessage = '';
		}, 2000);
	}

	function completeExercise(success: boolean): void {
		completed = true;
		const timeElapsed = Date.now() - startTime;
		const accuracy = Math.round(((expectedNotes.length - mistakes) / expectedNotes.length) * 100);

		const result: ExerciseResult = {
			success,
			completedNotes: currentNotes,
			expectedNotes: expectedNotes,
			accuracy,
			timeElapsed,
			errorsCount: mistakes
		};

		// Create exercise result for statistics tracking
		const exerciseResult = {
			exerciseId: `${type}-${selectedNote}-${Date.now()}`,
			exerciseType: type,
			success,
			accuracy,
			timeElapsed,
			mistakes,
			score: Math.max(0, accuracy - mistakes * 5),
			timestamp: new Date()
		};

		// Record the result in user statistics
		userStatsService.recordExerciseResult(exerciseResult);

		showFeedback(
			success ? 'Exercise completed!' : 'Exercise failed',
			success ? 'success' : 'error'
		);
		onComplete?.(result);
	}

	function resetExercise(): void {
		noteEvents = [];
		mistakes = 0;
		completed = false;
		feedbackMessage = '';
		startTime = Date.now();
	}

	function toggleDebug(): void {
		debugMode = !debugMode;
	}

	// ===== LIFECYCLE =====

	onMount(async () => {
		// Initialize MIDI system
		await midiManager.initialize();
		midiManager.setEventHandlers({
			onNoteOn: handleNoteOn,
			onNoteOff: handleNoteOff
		});

		// Initialize audio
		await audioManager.initialize();

		startTime = Date.now();
	});

	onDestroy(() => {
		midiManager.cleanup();
	});
</script>

/** * Universal Exercise Component * A single, flexible component that handles all exercise types *
Eliminates duplication across chord, scale, and progression exercises */

<!-- ===== TEMPLATE ===== -->

<div class="exercise-container">
	<!-- Header -->
	<header class="exercise-header">
		<h1>{title}</h1>
		{#if description}
			<p class="description">{description}</p>
		{/if}
	</header>

	<!-- Feedback -->
	{#if feedbackMessage}
		<div class="feedback feedback-{feedbackType}" role="alert">
			{feedbackMessage}
		</div>
	{/if}

	<!-- Controls -->
	{#if showControls}
		<div class="controls">
			<div class="control-group">
				<label for="note-select">Key:</label>
				<select id="note-select" bind:value={selectedNote}>
					{#each ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as note}
						<option value={note}>{note}</option>
					{/each}
				</select>
			</div>

			{#if type === 'chord'}
				<div class="control-group">
					<label for="chord-type">Chord:</label>
					<select id="chord-type" bind:value={chordType}>
						{#each ['major', 'minor', 'maj7', 'min7', '7'] as chord}
							<option value={chord}>{chord}</option>
						{/each}
					</select>
				</div>

				<div class="control-group">
					<label for="inversion">Inversion:</label>
					<select id="inversion" bind:value={inversion}>
						<option value={0}>Root</option>
						<option value={1}>1st</option>
						<option value={2}>2nd</option>
						<option value={3}>3rd</option>
					</select>
				</div>

				<div class="control-group">
					<label for="voicing">Voicing:</label>
					<select id="voicing" bind:value={voicing}>
						<option value="full">Full</option>
						<option value="left-hand">Left Hand</option>
						<option value="right-hand">Right Hand</option>
						<option value="split">Split</option>
					</select>
				</div>
			{/if}

			{#if type === 'scale'}
				<div class="control-group">
					<label>
						<input type="checkbox" bind:checked={sequential} />
						Sequential Mode
					</label>
				</div>
			{/if}

			<div class="control-group">
				<button onclick={resetExercise}>Reset</button>
				{#if enableDebug}
					<button onclick={toggleDebug}>
						{debugMode ? 'Hide' : 'Show'} Debug
					</button>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Main Content -->
	<div class="exercise-content">
		<!-- Score -->
		{#if showScore}
			<div class="score-container">
				<Score
					leftHand={type === 'chord' && voicing !== 'right-hand'
						? [expectedNotes.slice(0, 2).map((n) => MidiToNote[n])]
						: []}
					rightHand={type === 'chord' && voicing !== 'left-hand'
						? [expectedNotes.slice(-2).map((n) => MidiToNote[n])]
						: []}
					{selectedNote}
				/>
			</div>
		{/if}

		<!-- Keyboard -->
		{#if showKeyboard || debugMode}
			<div class="keyboard-container">
				<InteractiveKeyboard
					midiNotes={currentNotes}
					middleC={keyboardRange.middleC}
					octaves={keyboardRange.octaves}
					{debugMode}
					{expectedNotes}
					showLabels={showNoteNames}
				/>
			</div>
		{/if}

		<!-- Progress -->
		<div class="progress-container">
			<div class="progress-bar">
				<div class="progress-fill" style="width: {progress}%"></div>
			</div>
			<div class="progress-text">
				Progress: {progress}% | Mistakes: {mistakes}
			</div>
		</div>
	</div>

	<!-- Debug Panel -->
	{#if debugMode}
		<DebugPanel {noteEvents} {expectedNotes} {currentNotes} exerciseType={type} />
	{/if}
</div>

<style>
	.exercise-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		font-family: system-ui, sans-serif;
	}

	.exercise-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.exercise-header h1 {
		color: #2c3e50;
		margin-bottom: 0.5rem;
	}

	.description {
		color: #7f8c8d;
		font-size: 1.1rem;
	}

	.feedback {
		padding: 1rem;
		border-radius: 0.5rem;
		margin-bottom: 1rem;
		text-align: center;
		font-weight: 500;
	}

	.feedback-success {
		background-color: #d4edda;
		color: #155724;
		border: 1px solid #c3e6cb;
	}

	.feedback-error {
		background-color: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
	}

	.feedback-info {
		background-color: #cce7ff;
		color: #004085;
		border: 1px solid #b8daff;
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
		margin-bottom: 2rem;
		padding: 1rem;
		background-color: #f8f9fa;
		border-radius: 0.5rem;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: center;
	}

	.control-group label {
		font-weight: 500;
		color: #495057;
	}

	.control-group select,
	.control-group button {
		padding: 0.5rem;
		border: 1px solid #ced4da;
		border-radius: 0.25rem;
		background-color: white;
	}

	.control-group button {
		background-color: #007bff;
		color: white;
		cursor: pointer;
		border: none;
	}

	.control-group button:hover {
		background-color: #0056b3;
	}

	.exercise-content {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.score-container,
	.keyboard-container {
		display: flex;
		justify-content: center;
		padding: 1rem;
		border: 1px solid #dee2e6;
		border-radius: 0.5rem;
		background-color: white;
	}

	.progress-container {
		text-align: center;
	}

	.progress-bar {
		width: 100%;
		height: 1rem;
		background-color: #e9ecef;
		border-radius: 0.5rem;
		overflow: hidden;
		margin-bottom: 0.5rem;
	}

	.progress-fill {
		height: 100%;
		background-color: #28a745;
		transition: width 0.3s ease;
	}

	.progress-text {
		color: #6c757d;
		font-size: 0.9rem;
	}

	@media (max-width: 768px) {
		.exercise-container {
			padding: 1rem;
		}

		.controls {
			flex-direction: column;
			align-items: center;
		}

		.control-group {
			width: 100%;
			max-width: 200px;
		}
	}
</style>
