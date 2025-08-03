<svelte:options runes={true} />

<script lang="ts">
	import { onMount } from 'svelte';
	import BaseExercise from '../../components/BaseExercise.svelte';
	import { audioManager } from '../../lib/managers/AudioManager';
	import { midiManager } from '../../lib/managers/MIDIManager';
	import type { BaseExerciseState, MidiNote, Note, NoteEvent, NoteFullName } from '../../lib/types';
	import { getMidiNote, majorScales, NoteToMidi, midiNoteToNoteName } from '../../midi/midi';

	// ===== STATE =====
	let selectedNote: Note = $state('C');
	let sequentialMode: boolean = $state(true);
	let noteEvents: NoteEvent[] = $state([]);
	let mistakes = $state(0);
	let completed = $state(false);
	let debugMode = $state(false);
	let feedbackMessage = $state('');

	// Auto-enable helpers based on mistakes
	let showNoteNames = $derived(mistakes >= 3);
	let showKeyboard = $derived(mistakes >= 6);

	// ===== COMPUTED PROPERTIES =====
	let currentNotes = $derived(noteEvents.map((e) => e.noteNumber));

	let selectedNoteMiddleKey = $derived(selectedNote + '4') as NoteFullName;
	let entireKeyboardMajorScale = $derived(majorScales[selectedNote]);
	let majorScaleOneOctaveNotes = $derived(
		Array.from(new Set(entireKeyboardMajorScale.map((note) => note.slice(0, -1) as Note)))
	);
	let majorScaleMiddleKeyboard = $derived(
		majorScaleOneOctaveNotes.map((note) => (note + '4') as NoteFullName)
	);
	let expectedNotes = $derived(majorScaleMiddleKeyboard.map((note) => NoteToMidi[note]));

	// Exercise state for BaseExercise
	let exerciseState = $derived.by((): BaseExerciseState => {
		return {
			selectedNote,
			midiNotes: currentNotes,
			noteEvents,
			debugMode,
			showNoteNames,
			showKeyboard,
			feedbackMessage,
			errorCount: mistakes,
			completed
		};
	});

	// Score properties
	let scoreProps = $derived({
		notes: majorScaleMiddleKeyboard,
		highlightedNotes: currentNotes.map((note) => midiNoteToNoteName(note as MidiNote)),
		title: `${selectedNote} Major Scale`
	});

	// ===== FUNCTIONS =====

	function handleNoteSelect(note: Note) {
		selectedNote = note;
		resetExercise();
	}

	function toggleDebug() {
		debugMode = !debugMode;
		if (debugMode) {
			midiManager.enableDebugMode();
		} else {
			midiManager.disableDebugMode();
		}
	}

	function resetExercise() {
		mistakes = 0;
		noteEvents = [];
		completed = false;
		feedbackMessage = '';
		midiManager.resetExercise();
	}

	function onMidiEvent(event: NoteEvent) {
		noteEvents = [event, ...noteEvents.slice(0, 9)];

		if (event.type === 'on') {
			if (sequentialMode) {
				handleSequentialMode(event);
			} else {
				handleAnyOrderMode(event);
			}
		}
	}

	function handleSequentialMode(event: NoteEvent) {
		const currentIndex =
			noteEvents.filter((e) => e.type === 'on' && expectedNotes.includes(e.noteNumber)).length - 1;
		const expectedNote = expectedNotes[currentIndex];

		if (event.noteNumber === expectedNote) {
			if (currentIndex === expectedNotes.length - 1) {
				completed = true;
				feedbackMessage = 'Perfect scale! 🎵✨';
				audioManager.playSuccess();
			} else {
				feedbackMessage = `Good! Note ${currentIndex + 1}/${expectedNotes.length}`;
			}
		} else {
			mistakes++;
			feedbackMessage = `Wrong note! Expected note ${currentIndex + 1}`;
			audioManager.playError();
		}
	}

	function handleAnyOrderMode(event: NoteEvent) {
		const activeNotes = noteEvents.filter((e) => e.type === 'on').map((e) => e.noteNumber);
		const correctNotes = activeNotes.filter((note) => expectedNotes.includes(note));

		if (expectedNotes.includes(event.noteNumber)) {
			if (correctNotes.length === expectedNotes.length) {
				completed = true;
				feedbackMessage = 'Perfect scale! 🎵';
				audioManager.playSuccess();
			} else {
				feedbackMessage = `Good! ${correctNotes.length}/${expectedNotes.length} notes`;
			}
		} else {
			mistakes++;
			feedbackMessage = 'Wrong note!';
			audioManager.playError();
		}
	}

	// ===== LIFECYCLE =====
	onMount(() => {
		midiManager.connect(onMidiEvent);
		audioManager.initialize();

		return () => {
			midiManager.disconnect();
		};
	});
</script>

<div class="scale-exercise">
	<BaseExercise
		{exerciseState}
		exerciseTitle={`${selectedNote} Major Scale`}
		exerciseDescription={sequentialMode
			? 'Play the scale notes in order'
			: 'Play all scale notes in any order'}
		{expectedNotes}
		{scoreProps}
		onNoteSelect={handleNoteSelect}
		onDebugToggle={toggleDebug}
		onReset={resetExercise}
		customControls={true}
	>
		<!-- Custom controls for scale exercise -->
		<div class="scale-controls">
			<div class="control-group">
				<button onclick={toggleDebug} class="debug-btn">
					{debugMode ? 'Disable' : 'Enable'} Debug Mode
				</button>
				<button onclick={resetExercise} class="reset-btn">Reset</button>
			</div>

			<div class="control-group">
				<label>
					<input type="checkbox" bind:checked={sequentialMode} />
					Sequential Mode (play in order)
				</label>
			</div>
		</div>

		<!-- Custom status display -->
		<div class="exercise-status">
			<div class="progress">
				Progress: {Math.round(
					(currentNotes.filter((n) => expectedNotes.includes(n)).length / expectedNotes.length) *
						100
				)}%
			</div>
			<div class="mistakes">
				Mistakes: {mistakes}
			</div>
			{#if completed}
				<div class="completion">🎉 Scale Completed!</div>
			{/if}
		</div>
	</BaseExercise>
</div>

<style>
	.scale-exercise {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		font-family: system-ui, sans-serif;
	}

	.scale-controls {
		display: flex;
		gap: 2rem;
		margin-bottom: 1rem;
		align-items: center;
	}

	.control-group {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.debug-btn,
	.reset-btn {
		padding: 0.5rem 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		background: white;
		cursor: pointer;
		transition: all 0.2s;
	}

	.debug-btn {
		background: var(--color-debug, #e3f2fd);
		border-color: var(--color-debug-border, #2196f3);
	}

	.debug-btn:hover,
	.reset-btn:hover {
		background: #f5f5f5;
		transform: translateY(-1px);
	}

	.exercise-status {
		display: flex;
		gap: 2rem;
		padding: 1rem;
		background: #f8f9fa;
		border-radius: 8px;
		margin-top: 1rem;
	}

	.progress,
	.mistakes {
		font-weight: 500;
	}

	.completion {
		color: #28a745;
		font-weight: bold;
		animation: bounce 0.5s ease-in-out;
	}

	@keyframes bounce {
		0%,
		20%,
		50%,
		80%,
		100% {
			transform: translateY(0);
		}
		40% {
			transform: translateY(-10px);
		}
		60% {
			transform: translateY(-5px);
		}
	}

	@media (max-width: 768px) {
		.scale-exercise {
			padding: 1rem;
		}

		.scale-controls {
			flex-direction: column;
			gap: 1rem;
		}
	}
</style>
