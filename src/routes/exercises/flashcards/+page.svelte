<script lang="ts">
	import BaseExercise from '../../../components/BaseExercise.svelte';
	import {
		AllNotes,
		NoteToMidi,
		DEFAULT_OCTAVE,
		INTERVAL_SEMITONES
	} from '$lib/types/notes.constants';
	import type { MidiNote, Note, NoteEvent, ScoreProps, ChordType } from '$lib/types/types';
	import { chords, calculateInterval } from '$lib/MusicTheoryUtils';
	import { onMount } from 'svelte';

	type FlashCardType = 'note' | 'interval' | 'chord';

	interface FlashCard {
		type: FlashCardType;
		prompt: string;
		subtext?: string;
		expectedNotes: MidiNote[];
	}

	let currentCard: FlashCard = $state({
		type: 'note',
		prompt: 'Loading...',
		expectedNotes: []
	});

	let cardsCompleted = $state(0);
	const TOTAL_CARDS = 10; // Number of cards per session

	function generateRandomCard(root: Note): FlashCard {
		const types: FlashCardType[] = ['note', 'interval', 'chord'];
		const type = types[Math.floor(Math.random() * types.length)];

		const rootMidi = NoteToMidi[`${root}${DEFAULT_OCTAVE}` as keyof typeof NoteToMidi];

		if (type === 'note') {
			return {
				type: 'note',
				prompt: root,
				subtext: 'Play the note',
				expectedNotes: [rootMidi]
			};
		} else if (type === 'interval') {
			const intervals = Object.keys(INTERVAL_SEMITONES) as (keyof typeof INTERVAL_SEMITONES)[];
			const interval = intervals[Math.floor(Math.random() * intervals.length)];
			const targetMidi = calculateInterval(root, interval);
			return {
				type: 'interval',
				prompt: `${root} + ${interval}`,
				subtext: 'Play the interval (Root + Note)',
				expectedNotes: [rootMidi, targetMidi]
			};
		} else {
			const chordTypes: ChordType[] = ['major', 'minor', 'maj7', 'min7', 'dom7'];
			const chordType = chordTypes[Math.floor(Math.random() * chordTypes.length)];
			const chord = chords(rootMidi, chordType);
			const notes = [chord.root, chord.third, chord.fifth];
			if (chord.seventh) notes.push(chord.seventh);

			return {
				type: 'chord',
				prompt: `${root} ${chordType}`,
				subtext: 'Play the chord',
				expectedNotes: notes as MidiNote[]
			};
		}
	}

	// Initialize first card on component mount
	onMount(() => {
		const initialRoot = AllNotes[Math.floor(Math.random() * AllNotes.length)];
		currentCard = generateRandomCard(initialRoot);
	});

	function generateExpectedNotes(selectedNote: Note): MidiNote[] {
		// Don't mutate state here - just return existing card's notes
		return currentCard.expectedNotes;
	}

	function generateScoreProps(selectedNote: Note): ScoreProps {
		return {
			leftHand: [],
			rightHand: [],
			selectedNote
		};
	}

	function validateNoteEvent(
		selectedNote: Note,
		event: NoteEvent,
		expectedNotes: MidiNote[],
		currentNotes: MidiNote[]
	) {
		const isCorrect = expectedNotes.includes(event.noteNumber);
		return {
			isCorrect,
			message: isCorrect ? 'Correct!' : 'Wrong note!',
			collected: isCorrect,
			resetCollected: !isCorrect
		};
	}

	function isCompleted(currentNotes: MidiNote[], expectedNotes: MidiNote[]): boolean {
		const heldNotes = new Set(currentNotes);
		const allExpectedHeld = expectedNotes.every((n) => heldNotes.has(n));
		return allExpectedHeld;
	}

	function onReset() {
		// Retry same card
	}

	function onComplete() {
		cardsCompleted++;
		if (cardsCompleted < TOTAL_CARDS) {
			const nextRoot = AllNotes[Math.floor(Math.random() * AllNotes.length)];
			currentCard = generateRandomCard(nextRoot);
		}
	}
</script>

<BaseExercise
	description="Test your speed! Identify and play the notes, intervals, or chords shown."
	exerciseType="partition"
	{generateExpectedNotes}
	{generateScoreProps}
	{validateNoteEvent}
	{isCompleted}
	{onReset}
	{onComplete}
	showScore={true}
	randomMode={true}
	initialNote={'C'}
>
	{#snippet children(api: any)}
		<div class="flash-card">
			<div class="card-content">
				<div class="prompt">{currentCard.prompt}</div>
				<div class="subtext">{currentCard.subtext}</div>
				<div class="counter">Card {cardsCompleted + 1} / {TOTAL_CARDS}</div>
			</div>
		</div>
	{/snippet}
</BaseExercise>

<style>
	.flash-card {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 300px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 20px;
		color: white;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
		margin: 2rem 0;
	}

	.card-content {
		text-align: center;
	}

	.prompt {
		font-size: 5rem;
		font-weight: bold;
		margin-bottom: 1rem;
		text-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
	}

	.subtext {
		font-size: 1.5rem;
		opacity: 0.9;
	}

	.counter {
		margin-top: 2rem;
		font-size: 1rem;
		opacity: 0.7;
	}
</style>
