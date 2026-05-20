<svelte:options runes={true} />

<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { page } from '$app/state';
	import type { MidiNote, Note, NoteEvent, NoteFullName, ScoreProps } from '$lib/types/types';
	import type { ValidationResult } from '$lib/types/exercise-api';
	import { MidiToNote, NoteToMidi } from '$lib/types/notes.constants';
	import BaseExercise from '../../../components/exercise/BaseExercise.svelte';

	const description =
		'Read and play the sequence of notes shown on the musical staff. Perfect for improving sight-reading skills!';

	interface Props {
		randomMode: boolean;
		onComplete?: () => void;
		rootKey?: Note;
		range?: [NoteFullName, NoteFullName];
	}

	let { randomMode, onComplete, rootKey: propKey, range: propRange }: Props = $props();

	// Parse range from URL params first, then fall back to props
	const urlRange = page.url.searchParams.get('range');
	// @svelte-ignore state_referenced_locally
	let range = $state<[NoteFullName, NoteFullName]>(
		untrack(() => {
			if (urlRange) {
				const parts = urlRange.split(',');
				if (parts.length === 2) return [parts[0] as NoteFullName, parts[1] as NoteFullName];
			}
			return propRange || ['C4', 'C5'];
		})
	);

	let currentSequence: NoteFullName[] = $state([]);
	let playedCount = $state(0);

	// Derive hand from the range: notes in octave ≥4 → treble (right), below → bass (left)
	let hand = $derived.by<'left' | 'right'>(() => {
		const minNote = range[0];
		const octaveStr = minNote.match(/\d+$/)?.[0];
		return octaveStr && parseInt(octaveStr) >= 4 ? 'right' : 'left';
	});

	function generateNewSequence() {
		const minMidi = NoteToMidi[range[0]];
		const maxMidi = NoteToMidi[range[1]];

		if (!minMidi || !maxMidi || minMidi >= maxMidi) {
			currentSequence = [];
			playedCount = 0;
			return;
		}

		// Collect natural (non-accidental) NoteFullNames within the MIDI range
		const available: NoteFullName[] = [];
		for (let midi = minMidi; midi <= maxMidi; midi++) {
			const noteName = MidiToNote[midi as MidiNote];
			if (!noteName || noteName.includes('#') || noteName.includes('b')) continue;
			available.push(noteName);
		}

		if (available.length === 0) {
			currentSequence = [];
			playedCount = 0;
			return;
		}

		const sequenceLength = 12;
		const newSequence: NoteFullName[] = [];
		for (let i = 0; i < sequenceLength; i++) {
			newSequence.push(available[Math.floor(Math.random() * available.length)]);
		}
		currentSequence = newSequence;
		playedCount = 0;
	}

	// Initialize first sequence
	onMount(() => {
		generateNewSequence();
	});

	// $derived so reference changes when playedCount/currentSequence changes,
	// forcing BaseExercise to re-derive expectedNotes and keyboard hints.
	let generateExpectedNotes = $derived((_selectedNote: Note): MidiNote[] => {
		if (playedCount < currentSequence.length) {
			const note = currentSequence[playedCount];
			if (note && NoteToMidi[note]) return [NoteToMidi[note]];
		}
		return [];
	});

	function validateNoteEvent(
		selectedNote: Note,
		event: NoteEvent,
		expectedNotes: ReadonlyArray<MidiNote>
	): ValidationResult {
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

	// $derived so score display advances with playedCount
	let generateScoreProps = $derived((_selectedNote: Note): ScoreProps => {
		const formattedSequence = currentSequence.map((note) => [note]);
		return {
			selectedNote: 'C' as Note,
			leftHand: hand === 'left' ? formattedSequence : [],
			rightHand: hand === 'right' ? formattedSequence : []
		};
	});

	function isCompleted(
		_currentNotes: ReadonlyArray<MidiNote>,
		_expectedNotes: ReadonlyArray<MidiNote>
	): boolean {
		return playedCount === currentSequence.length && currentSequence.length > 0;
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
	{#snippet children(api: import('$lib/types/exercise-api').ExerciseAPI)}
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
