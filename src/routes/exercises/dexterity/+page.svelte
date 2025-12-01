<script lang="ts">
	import { onMount } from 'svelte';
	import type { MidiNote, Note, NoteEvent, NoteFullName, ScoreProps } from '$lib/types/types';
	import { AllNotes, MidiToNote, NoteToMidi } from '$lib/types/notes.constants';
	import BaseExercise from '../../../components/BaseExercise.svelte';

	const description =
		'Improve your finger dexterity and speed! Play the sequence of notes shown in time with the metronome.';

	interface Props {
		randomMode: boolean;
		onComplete?: () => void;
		rootKey?: Note;
	}

	let { randomMode, onComplete, rootKey: propKey }: Props = $props();

	let currentSequence: NoteFullName[] = $state([]);
	let hand: 'left' | 'right' = $state('right');
	let playedCount = $state(0);

	// Filter for natural notes (C Major) for dexterity focus
	const naturalNotes = AllNotes.filter((n) => !n.includes('#') && !n.includes('b'));

	function generateNewSequence() {
		const sequenceLength = 16; // Longer sequence for dexterity
		const newSequence: NoteFullName[] = [];

		hand = Math.random() < 0.5 ? 'left' : 'right';

		const minOctave = hand === 'left' ? 2 : 4;
		const maxOctave = hand === 'left' ? 3 : 5;

		// Generate a random "run" or pattern
		// Let's do a random walk to avoid large jumps
		let currentNoteIndex = Math.floor(Math.random() * naturalNotes.length);
		let currentOctave = minOctave;

		for (let i = 0; i < sequenceLength; i++) {
			// Random step: -1, 0, +1
			const step = Math.floor(Math.random() * 3) - 1;
			let nextIndex = currentNoteIndex + step;

			// Wrap around or bounce? Bounce.
			if (nextIndex < 0) nextIndex = 1;
			if (nextIndex >= naturalNotes.length) nextIndex = naturalNotes.length - 2;

			currentNoteIndex = nextIndex;

			// Handle octave changes?
			// For simplicity, keep octave mostly constant or random within range
			// Let's just pick random octave within range for now, but maybe keep it close?
			// Actually, let's just pick random note from naturalNotes + random octave
			// But to make it "dexterity", maybe runs are better.

			// Let's stick to random notes for now, but restricted to natural keys.
			const note = naturalNotes[Math.floor(Math.random() * naturalNotes.length)];
			const octave = Math.floor(Math.random() * (maxOctave - minOctave + 1)) + minOctave;
			newSequence.push(`${note}${octave}` as NoteFullName);
		}
		currentSequence = newSequence;
		playedCount = 0;
	}

	// Initialize first sequence
	onMount(() => {
		generateNewSequence();
	});

	function generateExpectedNotes(selectedNote: Note): MidiNote[] {
		// Return the NEXT expected note in the sequence
		if (playedCount < currentSequence.length) {
			const note = currentSequence[playedCount];
			if (note && NoteToMidi[note]) {
				return [NoteToMidi[note]];
			}
		}
		return [];
	}

	function validateNoteEvent(
		selectedNote: Note,
		event: NoteEvent,
		expectedNotes: MidiNote[]
	): { isCorrect: boolean; message: string; collected: boolean; resetCollected: boolean } {
		const expectedMidi = expectedNotes[0];

		if (event.noteNumber === expectedMidi) {
			playedCount++;
			const remaining = currentSequence.length - playedCount;

			if (remaining === 0) {
				return {
					isCorrect: true,
					message: `Perfect! All ${currentSequence.length} notes completed! 🎵✨`,
					collected: true,
					resetCollected: true
				};
			} else {
				return {
					isCorrect: true,
					message: `Good! ${playedCount}/${currentSequence.length}`,
					collected: true,
					resetCollected: false
				};
			}
		} else {
			const playedNote = MidiToNote[event.noteNumber];
			const expectedNoteName = currentSequence[playedCount];
			return {
				isCorrect: false,
				message: `Wrong note! You played ${playedNote}, expected ${expectedNoteName}`,
				collected: false,
				resetCollected: false
			};
		}
	}

	function generateScoreProps(selectedNote: Note): ScoreProps {
		// Limit to first 8 notes to avoid VexFlow "too many ticks" error
		// VexFlow can't handle more than ~8 notes on a single staff gracefully
		const maxNotesToDisplay = 8;
		const displaySequence = currentSequence.slice(0, maxNotesToDisplay);
		const formattedSequence = displaySequence.map((note) => [note]);

		return {
			selectedNote,
			leftHand: hand === 'left' ? formattedSequence : [],
			rightHand: hand === 'right' ? formattedSequence : []
		};
	}

	function isCompleted(currentNotes: MidiNote[], expectedNotes: MidiNote[]): boolean {
		return playedCount === currentSequence.length;
	}

	function handleParentReset(): void {
		generateNewSequence();
	}
</script>

<BaseExercise
	randomMode={true}
	{generateExpectedNotes}
	{generateScoreProps}
	{validateNoteEvent}
	{isCompleted}
	onReset={handleParentReset}
	onComplete={onComplete ?? (() => {})}
	initialNote={propKey || 'C'}
	{description}
	exerciseType="partition"
>
	{#snippet children(api: any)}
		<div class="dexterity-content">
			<h2>Dexterity Builder</h2>
			<p class="note-count">
				{hand === 'left' ? 'Left Hand' : 'Right Hand'} - {currentSequence.length} notes
			</p>
			<p class="progress-text">
				{playedCount}/{currentSequence.length}
			</p>
			<p class="hint">Try to play evenly with the metronome!</p>
		</div>
	{/snippet}
</BaseExercise>

<style>
	.dexterity-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.dexterity-content h2 {
		color: var(--color-theme-1, #e67e22);
		margin: 0;
		font-size: 1.5rem;
	}

	.note-count {
		font-size: 1.1rem;
		color: var(--color-text-secondary, #666);
		margin: 0;
		font-weight: 500;
	}

	.progress-text {
		font-size: 1.2rem;
		font-weight: bold;
		color: var(--color-primary, #3498db);
		margin: 0;
	}

	.hint {
		font-style: italic;
		opacity: 0.8;
	}
</style>
