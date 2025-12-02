<svelte:options runes={true} />

<script lang="ts">
	import { onMount } from 'svelte';
	import type { MidiNote, Note, NoteEvent, NoteFullName, ScoreProps } from '$lib/types/types';
	import { AllNotes, MidiToNote, NoteToMidi } from '$lib/types/notes.constants';
	import BaseExercise from '../../../components/BaseExercise.svelte';

	const description =
		'Read and play the sequence of notes shown on the musical staff. Its a fancier version of arpeggios!';

	interface Props {
		randomMode: boolean;
		onComplete?: () => void;
		rootKey?: Note;
	}

	let { randomMode, onComplete, rootKey: propKey }: Props = $props();

	let currentSequence: NoteFullName[] = $state([]);
	let hand = $state<'left' | 'right'>('right');
	let playedCount = $state(0);

	function generateNewSequence() {
		const notes: NoteFullName[] = [];
		const count = 4 + Math.floor(Math.random() * 4); // 4 to 8 notes
		const possibleNotes = Object.keys(NoteToMidi).filter((n) => {
			const midi = NoteToMidi[n as NoteFullName];
			return midi >= 60 && midi <= 72; // C4 to C5 range for simplicity
		}) as NoteFullName[];

		for (let i = 0; i < count; i++) {
			const randomNote = possibleNotes[Math.floor(Math.random() * possibleNotes.length)];
			notes.push(randomNote);
		}
		currentSequence = notes;
		playedCount = 0;
	}

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
		// expectedNotes contains only the NEXT note to play
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
					message: `Good! ${playedCount}/${currentSequence.length} notes played`,
					collected: true,
					resetCollected: false
				};
			}
		} else {
			// Wrong note
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
		// Format sequence for Score component: [[note1], [note2], ...] for sequential display
		// Or [all_notes] for simultaneous display
		const formattedSequence: NoteFullName[][] = currentSequence.map((note) => [note]);

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
		<div class="partition-content">
			<h2>Sight Reading Exercise</h2>
			<p class="note-count">
				{hand === 'left' ? 'Left Hand (Bass Clef)' : 'Right Hand (Treble Clef)'} -
				{currentSequence.length} notes
			</p>
			<p class="progress-text">
				{playedCount}/{currentSequence.length} notes played
			</p>
		</div>
	{/snippet}
</BaseExercise>

<style>
	.partition-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.partition-content h2 {
		color: var(--color-theme-1, #4caf50);
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
</style>
