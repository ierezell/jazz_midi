<svelte:options runes={true} />

<script lang="ts">
	import type { ScaleMode } from '$lib/types/notes';
	import { AllScaleModes, MidiToNote } from '$lib/types/notes.constants';
	import type { MidiNote, Note, NoteEvent, NoteFullName, ScoreProps } from '$lib/types/types';
	import BaseExercise from '../../../components/BaseExercise.svelte';

	const description =
		'Play the scale shown, ascending and/or descending, using your MIDI keyboard. Try to follow the correct order.';
	import { generateExpectedNotesFor } from '$lib/scaleExercise';

	interface Props {
		randomMode: boolean;
		onComplete?: () => void;
		scaleMode?: ScaleMode;
		rootKey?: Note;
		sequentialMode?: boolean;
		rightHandMode?: boolean;
	}

	let {
		randomMode,
		onComplete,
		scaleMode: propScaleMode,
		sequentialMode: propSequentialMode,
		rightHandMode: propRightHandMode,
		rootKey: propKey
	}: Props = $props();

	let sequentialMode: boolean = $state(
		propSequentialMode ?? (randomMode ? Math.random() > 0.5 : true)
	);
	let handMode: boolean = $state(propRightHandMode ?? (randomMode ? Math.random() > 0.5 : true));
	let scaleMode: ScaleMode = $state(
		propScaleMode ??
			(randomMode ? AllScaleModes[Math.floor(Math.random() * AllScaleModes.length)] : 'Maj')
	);
	let playedNotes: Set<MidiNote> = $state(new Set());
	// For sequential mode we track the actual played order
	let playedSequence: MidiNote[] = $state([]);

	function handleParentReset(): void {
		playedNotes = new Set();
		playedSequence = [];
	}

	function generateExpectedNotes(selectedNote: Note): MidiNote[] {
		const scaleNotes = generateExpectedNotesFor(selectedNote, scaleMode, handMode);
		const octave = handMode ? '3' : '1';
		console.debug(
			`Scale for ${selectedNote}${octave}:`,
			scaleNotes.map((note) => MidiToNote[note])
		);
		return scaleNotes;
	}

	function generateScoreProps(selectedNote: Note): ScoreProps {
		const scaleNotes = generateExpectedNotes(selectedNote);
		const noteNames = scaleNotes.map((midi) => MidiToNote[midi]);
		const rightNotes = handMode ? noteNames.map((note) => [note]) : ([] as NoteFullName[][]);
		const leftNotes = handMode ? ([] as NoteFullName[][]) : noteNames.map((note) => [note]);
		return {
			selectedNote: selectedNote,
			leftHand: leftNotes,
			rightHand: rightNotes
		};
	}

	function validateScaleNote(
		selectedNote: Note,
		event: NoteEvent,
		expectedNotes: MidiNote[],
		currentNotes: MidiNote[]
	): { isCorrect: boolean; message: string; collected: boolean; resetCollected: boolean } {
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
	): { isCorrect: boolean; message: string; collected: boolean; resetCollected: boolean } {
		const nextExpectedIndex = playedSequence.length;
		const expectedNote = expectedNotes[nextExpectedIndex];

		let collected: boolean = false;
		if (event.noteNumber === expectedNote) {
			playedSequence = [...playedSequence, event.noteNumber];
			// Create a new Set instance so Svelte detects the change
			playedNotes = new Set([...playedNotes, event.noteNumber]);
			// Inform BaseExercise to add this note to cumulative progress
			collected = true;
		} else {
			const expectedNoteName = MidiToNote[expectedNote]?.slice(0, -1) ?? String(expectedNote);
			playedSequence = [];
			playedNotes = new Set();
			return {
				isCorrect: false,
				message: `Wrong note! Expected ${expectedNoteName} (note ${nextExpectedIndex + 1})`,
				collected: false,
				resetCollected: true
			};
		}

		if (playedSequence.length === expectedNotes.length) {
			return {
				isCorrect: true,
				message: 'Perfect scale! 🎵✨',
				collected: true,
				resetCollected: false
			};
		} else {
			return {
				isCorrect: true,
				message: `Good! Note ${nextExpectedIndex + 1}/${expectedNotes.length}`,
				collected: true,
				resetCollected: false
			};
		}
	}

	function validateAnyOrder(
		event: NoteEvent,
		expectedNotes: MidiNote[],
		currentNotes: MidiNote[]
	): { isCorrect: boolean; message: string; collected: boolean; resetCollected: boolean } {
		if (expectedNotes.includes(event.noteNumber)) {
			// Use a fresh Set to ensure reactivity when notes are added
			playedNotes = new Set([...playedNotes, event.noteNumber]);
			if (playedNotes.size === expectedNotes.length) {
				return {
					isCorrect: true,
					message: 'Perfect scale! 🎵',
					collected: playedNotes.has(event.noteNumber),
					resetCollected: false
				};
			} else {
				return {
					isCorrect: true,
					message: `Good! ${playedNotes.size}/${expectedNotes.length} notes`,
					collected: playedNotes.has(event.noteNumber),
					resetCollected: false
				};
			}
		} else {
			playedNotes = new Set();
			return { isCorrect: false, message: 'Wrong note!', resetCollected: true, collected: false };
		}
	}

	function isScaleCompleted(currentNotes: MidiNote[], expectedNotes: MidiNote[]): boolean {
		if (sequentialMode) {
			return (
				playedSequence.length === expectedNotes.length &&
				playedSequence.every((note, index) => note === expectedNotes[index])
			);
		} else {
			const uniqueExpectedNotes = [...new Set(expectedNotes)];
			return playedNotes.size === uniqueExpectedNotes.length;
		}
	}

	function handleSequentialToggle(event: Event): void {
		const target = event.target as HTMLInputElement;
		sequentialMode = target.checked;
		playedNotes = new Set();
		playedSequence = [];
	}

	function handleHandModeToggle(event: Event): void {
		const target = event.target as HTMLInputElement;
		handMode = target.checked;
		playedNotes = new Set();
		playedSequence = [];
	}

	function handleScaleModeChange(event: Event): void {
		const target = event.target as HTMLInputElement;
		scaleMode = target.value as ScaleMode;
		playedNotes = new Set();
		playedSequence = [];
	}
</script>

<BaseExercise
	{randomMode}
	{generateExpectedNotes}
	{generateScoreProps}
	validateNoteEvent={validateScaleNote}
	isCompleted={isScaleCompleted}
	onReset={handleParentReset}
	onComplete={onComplete ?? (() => {})}
	initialNote={propKey || 'C'}
	{description}
>
	{#snippet children(api: any)}
		<div class="scale-controls">
			{#if !randomMode}
				<div class="control-group">
					<label>
						<input
							type="checkbox"
							bind:checked={sequentialMode}
							onchange={handleSequentialToggle}
						/>
						In order
					</label>
				</div>
				<div class="control-group">
					<label>
						<input type="checkbox" bind:checked={handMode} onchange={handleHandModeToggle} />
						Right hand
					</label>
				</div>
				<div class="control-group">
					<label for="scaleMode">Scale mode:</label>
					<select id="scaleMode" value={scaleMode} onchange={handleScaleModeChange}>
						<option value="Maj">Major</option>
						<option value="Min">Minor</option>
					</select>
				</div>
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
	}
</style>
