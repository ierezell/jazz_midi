<script lang="ts">
	import { audioManager } from '$lib/AudioManager';
	import { midiManager } from '$lib/MIDIManager';
	import { calculateOptimalRange, getNoteRole } from '$lib/MusicTheoryUtils';
	import {
		AllNotes,
		DEFAULT_NOTE_ROLE_COLORS,
		NoteToMidi,
		DEFAULT_OCTAVE
	} from '$lib/types/notes.constants';
	import {
		type KeyboardProps,
		type MidiNote,
		type Note,
		type NoteEvent,
		type ScoreProps
	} from '$lib/types/types';
	import { onDestroy, onMount } from 'svelte';
	import DebugPanel from './DebugPanel.svelte';
	import Keyboard from './Keyboard.svelte';
	import Score from './Score.svelte';

	interface BaseExerciseProps {
		randomMode: boolean;
		generateExpectedNotes: (selectedNote: Note, ...args: any[]) => MidiNote[];
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
		};
		isCompleted: (currentNotes: MidiNote[], expectedNotes: MidiNote[]) => boolean;
		onReset: () => void;
		onComplete: () => void;
		initialNote: Note;
	}

	let {
		randomMode = false,
		generateExpectedNotes,
		generateScoreProps,
		validateNoteEvent,
		isCompleted,
		onReset,
		initialNote,
		children
	}: BaseExerciseProps & { children?: any } = $props();

	const KEYBOARD_SHOW_AFTER_MISTAKES = 3;
	const EXPECTED_NOTES_SHOW_AFTER_MISTAKES = 5;

	let selectedNote: Note = $state(initialNote ?? 'C');
	let noteEvents: NoteEvent[] = $state([]);
	let mistakes = $state(0);
	let collectedNotes: Set<MidiNote> = $state(new Set());
	let startTime = $state(0);
	let completed = $state(false);
	let debugMode = $state(false);
	let feedbackMessage = $state('');
	let showNotesRoles = $state(false);

	let currentNotes = $derived(noteEvents.map((e) => e.noteNumber));
	let expectedNotes = $derived(generateExpectedNotes(selectedNote));
	let scoreProps = $derived(generateScoreProps(selectedNote));
	let showKeyboard = $derived(debugMode || mistakes >= KEYBOARD_SHOW_AFTER_MISTAKES);
	let showExpected = $derived.by(() => {
		return mistakes >= EXPECTED_NOTES_SHOW_AFTER_MISTAKES;
	});
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

	let exposedAPI = $derived({
		selectedNote,
		currentNotes,
		expectedNotes,
		mistakes,
		completed,
		collectedNotes,
		debugMode,
		feedbackMessage,
		showNotesRoles,
		handleNoteSelect,
		resetExercise,
		toggleDebug,
		showFeedback
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
		noteEvents = [...noteEvents, note];
		const result = validateNoteEvent(selectedNote, note, expectedNotes, currentNotes);

		if (result.resetCollected) {
			collectedNotes = new Set();
		}

		if (result.collected) {
			collectedNotes = new Set([...collectedNotes, note.noteNumber]);
		}

		if (result.isCorrect) {
			showFeedback(result.message, 'success');
		} else {
			mistakes++;
			showFeedback(result.message, 'error');
			audioManager.playError();
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

	function onCompleteExercise(): void {
		completed = true;
		const timeElapsed = Date.now() - startTime;
		const accuracy = Math.round(((expectedNotes.length - mistakes) / expectedNotes.length) * 100);
		showFeedback(`Exercise completed! Time: ${timeElapsed}ms, Accuracy: ${accuracy}%`, 'success');
		audioManager.playSound?.('success');
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
</script>

<div class="exercise-container">
	{#if feedbackMessage}
		<div class="feedback" role="alert">
			{feedbackMessage}
		</div>
	{/if}

	{#if !randomMode}
		<div class="exercise-controls">
			<div class="control-group">
				<label for="note-select">Key:</label>
				<select id="note-select" value={selectedNote} onchange={handleNoteSelectEvent}>
					{#each AllNotes as note}
						<option value={note}>{note}</option>
					{/each}
				</select>
			</div>
		</div>
	{/if}

	<div class="score-section">
		<Score {...scoreProps} />
	</div>

	<div class="keyboard-section" class:hidden={!showKeyboard}>
		<Keyboard {...keyboardProps} />
	</div>

	{#if debugMode}
		<div class="debug-section">
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

	<div class="exercise-content">
		{@render children?.(exposedAPI)}
	</div>

	{#if showNotesRoles}
		<div class="color-legend">
			{#each Object.entries(DEFAULT_NOTE_ROLE_COLORS) as [role, color]}
				<div class="legend-item">
					<div class="color-dot" style="background-color: {color}"></div>
					<span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
				</div>
			{/each}
		</div>
	{/if}
	{#if debugMode}
		<div class="debug-info">
			<p><strong>Debug Mode Active</strong></p>
			<p>Use computer keyboard to simulate MIDI input</p>
			<p>Active notes: {currentNotes.length > 0 ? currentNotes.join(', ') : 'None'}</p>
		</div>
	{/if}

	<div class="progress-info">
		<div class="progress-bar">
			<div class="progress-fill" style="width: {progressPercentage}%"></div>
		</div>
		<div class="progress-stats">
			<span>Progress: {progressPercentage}%</span>
			<span>Errors: {mistakes}</span>
		</div>
	</div>

	<div class="control-group">
		<button onclick={toggleDebug} class="debug-btn">
			{debugMode ? 'Disable' : 'Enable'} Debug Mode
		</button>
		<button onclick={resetExercise} class="reset-btn"> Reset Exercise </button>
	</div>
</div>

<style>
	.exercise-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
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
		min-height: 280px;
		display: flex;
		justify-content: center;
		align-items: center;
		background: var(--color-bg, white);
		border: 1px solid var(--color-border, #e1e5e9);
		border-radius: 8px;
		padding: 1rem;
	}

	.keyboard-section {
		transition: all 0.3s ease;
	}

	.keyboard-section.hidden {
		display: none;
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
			gap: 0.5rem;
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
			min-height: 220px;
			padding: 0.5rem;
		}
	}
</style>
