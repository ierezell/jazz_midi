<svelte:options runes={true} />

<script lang="ts">
	import { MidiToNote, NoteToMidi } from '$lib/types/notes.constants';
	import type { MidiNote, Note, NoteEvent, NoteFullName } from '$lib/types/types';
	import BaseExercise from '../../components/BaseExercise.svelte';

	// Random mode props
	interface Props {
		randomMode?: boolean;
		randomNote?: Note;
		onRandomComplete?: () => void;
	}

	let { randomMode = false, randomNote, onRandomComplete }: Props = $props();

	// Scale-specific configuration
	let sequentialMode: boolean = $state(true);

	// Generate expected notes for a given root note
	function generateExpectedNotes(selectedNote: Note): MidiNote[] {
		// Get the scale starting from the selected note in octave 4
		const rootMidi = NoteToMidi[(selectedNote + '4') as NoteFullName];

		// Major scale intervals: [2, 2, 1, 2, 2, 2, 1] (whole-whole-half-whole-whole-whole-half)
		const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11]; // Semitones from root

		const scaleNotes = majorScaleIntervals.map((interval) => (rootMidi + interval) as MidiNote);

		console.log(
			`Scale for ${selectedNote}4:`,
			scaleNotes.map((note) => MidiToNote[note])
		);

		return scaleNotes;
	}

	// Generate score data for notation
	function generateScorePropsForExercise(selectedNote: Note) {
		const scaleNotes = generateExpectedNotes(selectedNote);
		const noteNames = scaleNotes.map((midi) => MidiToNote[midi]);

		return {
			title: `${selectedNote} Major Scale`,
			leftHandNotes: [],
			rightHandNotes: noteNames.map((note) => [note]) // Each scale note as individual note
		};
	}

	// Scale-specific validation logic
	function validateScaleNote(
		event: NoteEvent,
		expectedNotes: MidiNote[],
		currentNotes: MidiNote[]
	): { isCorrect: boolean; message: string } {
		if (sequentialMode) {
			return validateSequential(event, expectedNotes, currentNotes);
		} else {
			return validateAnyOrder(event, expectedNotes, currentNotes);
		}
	}

	function validateSequential(
		event: NoteEvent,
		expectedNotes: MidiNote[],
		currentNotes: MidiNote[]
	): { isCorrect: boolean; message: string } {
		// In sequential mode, we want to check if the current note is the next expected note
		const nextExpectedIndex = currentNotes.length;
		const expectedNote = expectedNotes[nextExpectedIndex];

		if (event.noteNumber === expectedNote) {
			if (nextExpectedIndex === expectedNotes.length - 1) {
				return { isCorrect: true, message: 'Perfect scale! 🎵✨' };
			} else {
				return {
					isCorrect: true,
					message: `Good! Note ${nextExpectedIndex + 1}/${expectedNotes.length}`
				};
			}
		} else {
			const expectedNoteName = MidiToNote[expectedNote]?.slice(0, -1) || expectedNote.toString();
			return {
				isCorrect: false,
				message: `Wrong note! Expected ${expectedNoteName} (note ${nextExpectedIndex + 1})`
			};
		}
	}

	function validateAnyOrder(
		event: NoteEvent,
		expectedNotes: MidiNote[],
		currentNotes: MidiNote[]
	): { isCorrect: boolean; message: string } {
		if (expectedNotes.includes(event.noteNumber)) {
			const correctNotes = currentNotes.filter((note) => expectedNotes.includes(note));
			if (correctNotes.length === expectedNotes.length) {
				return { isCorrect: true, message: 'Perfect scale! 🎵' };
			} else {
				return {
					isCorrect: true,
					message: `Good! ${correctNotes.length}/${expectedNotes.length} notes`
				};
			}
		} else {
			return { isCorrect: false, message: 'Wrong note!' };
		}
	}

	// Custom completion logic for scales
	function isScaleCompleted(currentNotes: MidiNote[], expectedNotes: MidiNote[]): boolean {
		if (sequentialMode) {
			// For sequential mode, check if we have the correct number of notes
			// and they are in the correct sequence
			return (
				currentNotes.length === expectedNotes.length &&
				currentNotes.every((note, index) => note === expectedNotes[index])
			);
		} else {
			// For any order mode, check if all expected notes are present
			const uniqueCurrentNotes = [...new Set(currentNotes)];
			const uniqueExpectedNotes = [...new Set(expectedNotes)];

			return (
				uniqueCurrentNotes.length === uniqueExpectedNotes.length &&
				uniqueCurrentNotes.every((note) => uniqueExpectedNotes.includes(note))
			);
		}
	}

	// Handle sequential mode toggle
	function handleSequentialToggle(event: Event): void {
		const target = event.target as HTMLInputElement;
		sequentialMode = target.checked;
	}
	// Custom completion handler for random mode
	function onExerciseComplete() {
		if (randomMode && onRandomComplete) {
			// Small delay to show completion before moving to next exercise
			setTimeout(() => {
				onRandomComplete();
			}, 1500);
		}
	}
</script>

<BaseExercise
	exerciseTitle={randomMode ? 'Random Scale' : 'Scale Practice'}
	exerciseDescription={randomMode
		? `Play the ${randomNote} major scale`
		: sequentialMode
			? 'Play the scale notes in order'
			: 'Play all scale notes in any order'}
	initialSelectedNote={randomMode ? randomNote : undefined}
	{randomMode}
	{generateExpectedNotes}
	generateScoreProps={generateScorePropsForExercise}
	validateNoteEvent={validateScaleNote}
	isCompleted={isScaleCompleted}
	customControls={true}
	{onExerciseComplete}
>
	{#snippet children(api: any)}
		<div class="scale-controls">
			{#if !randomMode}
				<div class="control-group">
					<button onclick={api.toggleDebug} class="debug-btn">
						{api.debugMode ? 'Disable' : 'Enable'} Debug Mode
					</button>
					<button onclick={api.resetExercise} class="reset-btn">Reset</button>
				</div>

				<div class="control-group">
					<label>
						<input
							type="checkbox"
							bind:checked={sequentialMode}
							onchange={handleSequentialToggle}
						/>
						Sequential Mode (play in order)
					</label>
				</div>
			{:else}
				<div class="control-group">
					<button onclick={api.resetExercise} class="reset-btn">Reset</button>
				</div>
			{/if}
		</div>

		<div class="exercise-status">
			<div class="progress">
				Progress: {Math.round(
					(api.currentNotes.filter((n: MidiNote) => api.expectedNotes.includes(n)).length /
						api.expectedNotes.length) *
						100
				)}%
			</div>
			<div class="mistakes">Mistakes: {api.mistakes}</div>
			{#if api.completed}
				<div class="completion">🎉 Scale Completed!</div>
			{/if}
		</div>
	{/snippet}
</BaseExercise>

<style>
	.scale-controls {
		display: flex;
		gap: 2rem;
		margin-bottom: 1rem;
		align-items: center;
		justify-content: center;
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
		justify-content: center;
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
		.scale-controls {
			flex-direction: column;
			gap: 1rem;
		}

		.exercise-status {
			flex-direction: column;
			text-align: center;
			gap: 0.5rem;
		}
	}
</style>
