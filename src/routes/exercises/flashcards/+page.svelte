<svelte:options runes={true} />

<script lang="ts">
	import BaseExercise from '../../../components/BaseExercise.svelte';
	import type { MidiNote, Note, ExerciseType, NoteEvent } from '$lib/types/types';
	import type { ChordType, ScaleMode, ChordVoicing, Inversion } from '$lib/types/notes';
	import {
		NoteToMidi,
		MidiToNote,
		DEFAULT_OCTAVE,
		INTERVAL_SEMITONES,
		AllScaleModes,
		AllChordVoicings
	} from '$lib/types/notes.constants';
	import { calculateInterval } from '$lib/MusicTheoryUtils';
	import { onDestroy, onMount } from 'svelte';

	import { type FlashCard, type FlashCardType } from '$lib/FlashcardUtils';
	import ConfigPopup from '../../../components/ConfigPopup.svelte';
	import ChordsPage from '../chords/+page.svelte';
	import ScalesPage from '../scales/+page.svelte';
	import TwoFiveOnesPage from '../two_five_ones/+page.svelte';

	// Config State
	let allowedNotes = $state<Note[]>(['C', 'F', 'G']);
	let allowedChordTypes = $state<ChordType[]>(['maj7', 'min7', '7', 'major', 'minor']);
	let allowedInversions = $state<Inversion[]>([0, 1, 2, 3]);
	let allowedScaleModes = $state<ScaleMode[]>(AllScaleModes);
	let allowedVoicings = $state<ChordVoicing[]>(AllChordVoicings);
	// We map FlashCardType to ExerciseType where possible, or just use FlashCardType strings
	let allowedCardTypes = $state<FlashCardType[]>(['note', 'interval', 'chord', 'scale', 'II-V-I']);

	let showConfigPopup = $state(false);

	let currentCard: FlashCard | null = $state(null);
	let exerciseKey = $state(0); // Force re-render
	let isCompleted = $state(false);
	let cardsCompleted = $state(0);
	const TOTAL_CARDS = 10;

	// Timer State
	let completionTimeout: ReturnType<typeof setTimeout> | null = null;
	let countdown = $state(0);
	let countdownInterval: ReturnType<typeof setInterval> | null = null;

	function generateNewCard() {
		// Filter types based on allowedCardTypes
		const type = allowedCardTypes[Math.floor(Math.random() * allowedCardTypes.length)];
		const root = allowedNotes[Math.floor(Math.random() * allowedNotes.length)];

		let card: FlashCard;

		if (type === 'note') {
			const rootMidi = NoteToMidi[`${root}${DEFAULT_OCTAVE}` as keyof typeof NoteToMidi];
			card = {
				type: 'note',
				prompt: root,
				subtext: 'Play the note',
				expectedNotes: [rootMidi]
			};
		} else if (type === 'interval') {
			const intervals = Object.keys(INTERVAL_SEMITONES) as (keyof typeof INTERVAL_SEMITONES)[];
			const interval = intervals[Math.floor(Math.random() * intervals.length)];
			const rootMidi = NoteToMidi[`${root}${DEFAULT_OCTAVE}` as keyof typeof NoteToMidi];
			const targetMidi = calculateInterval(root, interval);
			card = {
				type: 'interval',
				prompt: `${root} + ${interval}`,
				subtext: 'Play the interval',
				expectedNotes: [rootMidi, targetMidi]
			};
		} else if (type === 'chord') {
			const chordType = allowedChordTypes[Math.floor(Math.random() * allowedChordTypes.length)];
			const inversion = allowedInversions[Math.floor(Math.random() * allowedInversions.length)];
			const voicing = allowedVoicings[Math.floor(Math.random() * allowedVoicings.length)];
			card = {
				type: 'chord',
				prompt: `${root} ${chordType}`,
				subtext: 'Play the chord',
				expectedNotes: [], // Handled by component
				config: { chordType, inversion, voicing, root }
			};
		} else if (type === 'scale') {
			const mode = allowedScaleModes[Math.floor(Math.random() * allowedScaleModes.length)];
			card = {
				type: 'scale',
				prompt: `${root} ${mode} Scale`,
				subtext: 'Play the scale',
				expectedNotes: [], // Handled by component
				config: { mode, root }
			};
		} else {
			// II-V-I
			const inversion = allowedInversions[Math.floor(Math.random() * allowedInversions.length)];
			const voicing = allowedVoicings[Math.floor(Math.random() * allowedVoicings.length)];
			card = {
				type: 'II-V-I',
				prompt: `${root} II-V-I`,
				subtext: 'Play the progression',
				expectedNotes: [], // Handled by component
				config: { inversion, voicing, root }
			};
		}

		currentCard = card;
		exerciseKey = Date.now();
		isCompleted = false;

		if (completionTimeout) clearTimeout(completionTimeout);
		if (countdownInterval) clearInterval(countdownInterval);
		countdown = 0;
	}

	function handleExerciseComplete() {
		// Just wait a bit and move to next card
		// BaseExercise already shows a success toast
		cardsCompleted++;

		if (completionTimeout) clearTimeout(completionTimeout);
		completionTimeout = setTimeout(() => {
			generateNewCard();
		}, 1000);
	}

	onMount(() => {
		generateNewCard();
	});

	onDestroy(() => {
		if (completionTimeout) clearTimeout(completionTimeout);
	});

	// Helper for simple Note/Interval validation
	function validateSimple(
		selectedNote: Note,
		event: NoteEvent,
		expectedNotes: MidiNote[],
		currentNotes: MidiNote[]
	) {
		if (expectedNotes.includes(event.noteNumber)) {
			// Check if all expected notes are held
			const heldExpected = currentNotes.filter((n) => expectedNotes.includes(n));
			const uniqueHeld = new Set(heldExpected);
			const uniqueExpected = new Set(expectedNotes);

			if (uniqueHeld.size === uniqueExpected.size) {
				return {
					isCorrect: true,
					message: 'Correct!',
					collected: true,
					resetCollected: false
				};
			}
			return {
				isCorrect: true,
				message: 'Good note...',
				collected: true,
				resetCollected: false
			};
		}
		return {
			isCorrect: false,
			message: 'Wrong note',
			collected: false,
			resetCollected: true
		};
	}

	function isSimpleCompleted(currentNotes: MidiNote[], expectedNotes: MidiNote[]) {
		const uniqueHeld = new Set(currentNotes.filter((n) => expectedNotes.includes(n)));
		const uniqueExpected = new Set(expectedNotes);
		return uniqueHeld.size === uniqueExpected.size;
	}
</script>

<div class="flashcards-container">
	<div class="header">
		<div class="progress">
			Cards: {cardsCompleted} / {TOTAL_CARDS}
		</div>
		<div class="controls">
			<button onclick={() => (showConfigPopup = true)} class="config-btn"> ⚙️ Config </button>
			<button onclick={generateNewCard} class="new-btn"> 🎲 New Card </button>
		</div>
	</div>

	<ConfigPopup
		showPopup={showConfigPopup}
		{allowedNotes}
		{allowedChordTypes}
		{allowedInversions}
		{allowedScaleModes}
		{allowedVoicings}
		allowedExerciseTypes={allowedCardTypes as any}
		onClose={() => (showConfigPopup = false)}
		onUpdate={(type, value) => {
			switch (type) {
				case 'allowedNotes':
					allowedNotes = value as Note[];
					break;
				case 'allowedChordTypes':
					allowedChordTypes = value as ChordType[];
					break;
				case 'allowedInversions':
					allowedInversions = value.map(Number) as Inversion[];
					break;
				case 'allowedScaleModes':
					allowedScaleModes = value as ScaleMode[];
					break;
				case 'allowedVoicings':
					allowedVoicings = value as ChordVoicing[];
					break;
				case 'allowedExerciseTypes':
					allowedCardTypes = value as FlashCardType[];
					break;
			}
		}}
	/>

	{#if currentCard}
		{#key exerciseKey}
			{#if currentCard.type === 'chord'}
				<ChordsPage
					randomMode={true}
					onComplete={handleExerciseComplete}
					chordType={currentCard.config.chordType}
					inversion={currentCard.config.inversion}
					voicing={currentCard.config.voicing}
					rootKey={currentCard.config.root}
					progressiveHints={true}
					prompt={currentCard.prompt}
				/>
			{:else if currentCard.type === 'scale'}
				<ScalesPage
					randomMode={true}
					onComplete={handleExerciseComplete}
					scaleMode={currentCard.config.mode}
					rootKey={currentCard.config.root}
					progressiveHints={true}
					prompt={currentCard.prompt}
				/>
			{:else if currentCard.type === 'II-V-I'}
				<TwoFiveOnesPage
					randomMode={true}
					onComplete={handleExerciseComplete}
					inversion={currentCard.config.inversion}
					voicing={currentCard.config.voicing}
					rootKey={currentCard.config.root}
					progressiveHints={true}
					prompt={currentCard.prompt}
				/>
			{:else}
				<!-- Note or Interval -->
				<BaseExercise
					randomMode={true}
					generateExpectedNotes={() => currentCard!.expectedNotes}
					generateScoreProps={() => ({
						selectedNote: currentCard!.prompt.split(' ')[0] as Note, // Hacky root extraction
						leftHand: [],
						rightHand: [currentCard!.expectedNotes.map((n) => MidiToNote[n])]
					})}
					validateNoteEvent={validateSimple}
					isCompleted={isSimpleCompleted}
					onComplete={handleExerciseComplete}
					initialNote={currentCard.prompt.split(' ')[0] as Note}
					description={currentCard.subtext ?? ''}
					exerciseType={currentCard.type === 'note' ? 'note' : 'interval'}
					progressiveHints={true}
					onReset={() => {}}
					prompt={currentCard.prompt}
				/>
			{/if}
		{/key}
	{:else}
		<div class="loading">Generating...</div>
	{/if}
</div>

<style>
	.flashcards-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		background: #f8f9fa;
		padding: 1rem;
		border-radius: 8px;
	}

	.progress {
		font-size: 1.2rem;
		font-weight: bold;
		color: #2c3e50;
	}

	.controls {
		display: flex;
		gap: 0.5rem;
	}

	.config-btn,
	.new-btn {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 600;
		transition: all 0.2s;
	}

	.config-btn {
		background: #e9ecef;
		color: #495057;
	}

	.new-btn {
		background: #4caf50;
		color: white;
	}

	.config-btn:hover {
		background: #dee2e6;
	}

	.new-btn:hover {
		background: #43a047;
	}

	@keyframes popIn {
		from {
			transform: scale(0.8);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	.loading {
		text-align: center;
		padding: 4rem;
		color: #666;
	}
</style>
