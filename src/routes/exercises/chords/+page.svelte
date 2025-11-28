<svelte:options runes={true} />

<script lang="ts">
	import { chords, generateChordNotesData, getVoicedChordNotes } from '$lib/MusicTheoryUtils';
	import type { ChordVoicing, Inversion } from '$lib/types/notes';
	import {
		AllChordTypes,
		AllChordVoicings,
		NoteToMidi,
		DEFAULT_OCTAVE
	} from '$lib/types/notes.constants';
	import type {
		ChordType,
		MidiNote,
		Note,
		NoteEvent,
		NoteFullName,
		ScoreProps
	} from '$lib/types/types';
	import BaseExercise from '../../../components/BaseExercise.svelte';

	const description =
		'Play the notes of the displayed chord on your MIDI keyboard. Try to match the voicing and inversion shown.';

	interface Props {
		randomMode: boolean;
		onComplete: () => void;
		chordType: ChordType;
		inversion: Inversion;
		rootKey: Note;
		voicing: ChordVoicing;
	}

	let {
		randomMode,
		onComplete,
		chordType: propChordType,
		inversion: propInversion,
		rootKey: propKey,
		voicing: propVoicing
	}: Props = $props();

	// Pass description to BaseExercise
	let possibleChordTypes = ['maj7', 'min7', '7', 'dom7', 'half-dim7', 'dim7'] as ChordType[];
	let chordType: ChordType = $state(
		propChordType ??
			(randomMode
				? possibleChordTypes[Math.floor(Math.random() * possibleChordTypes.length)]
				: 'maj7')
	);
	let inversion: Inversion = $state(
		propInversion ?? (randomMode ? (Math.floor(Math.random() * 4) as Inversion) : 0)
	);
	let voicing: ChordVoicing = $state(
		propVoicing ??
			(randomMode
				? AllChordVoicings[Math.floor(Math.random() * AllChordVoicings.length)]
				: 'full-right')
	);
	let exerciseCompleted = $state(false);

	function handleParentReset(): void {
		exerciseCompleted = false;
	}

	function generateExpectedNotes(selectedNote: Note): MidiNote[] {
		const rootNote = (selectedNote + DEFAULT_OCTAVE) as NoteFullName;
		const rootMidi = NoteToMidi[rootNote];
		const currentChord = chords(rootMidi, chordType, inversion);

		return getVoicedChordNotes(currentChord, voicing);
	}

	function validateNoteEvent(
		selectedNote: Note,
		event: NoteEvent,
		expectedNotes: MidiNote[]
	): { isCorrect: boolean; message: string; collected: boolean; resetCollected: boolean } {
		// For rootless, we might want to be lenient about octaves if we didn't calculate them perfectly
		// But BaseExercise expects exact matches usually.
		// Let's check if the note class matches any expected note class

		const expectedClasses = expectedNotes.map((n) => n % 12);
		const playedClass = event.noteNumber % 12;

		if (expectedClasses.includes(playedClass)) {
			// It's a correct note class.
			// Now check if it's the exact note if we are strict, or just allow it.
			// Let's try to be exact first.
			if (expectedNotes.includes(event.noteNumber)) {
				return {
					isCorrect: true,
					message: 'Correct chord tone!',
					collected: true,
					resetCollected: false
				};
			}
			// If we are in rootless mode, maybe allow any octave?
			if (voicing.startsWith('rootless')) {
				return {
					isCorrect: true,
					message: 'Correct chord tone (octave ignored)!',
					collected: true,
					resetCollected: false
				};
			}
		}

		return {
			isCorrect: false,
			message: 'Not a chord tone. Try again!',
			collected: false,
			resetCollected: true
		};
	}

	function handleChordTypeChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		chordType = target.value as ChordType;
	}

	function handleInversionChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		inversion = parseInt(target.value) as Inversion;
	}

	function handleVoicingChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		voicing = target.value as typeof voicing;
	}

	// Derived values for display and score
	let chordInfo = $derived.by(() => {
		return {
			name: `${chordType}`,
			voicing: voicing,
			inversion: inversion
		};
	});

	function generateScoreProps(selectedNote: Note): ScoreProps {
		try {
			const scoreData = generateChordNotesData(selectedNote, chordType, inversion, voicing);
			console.debug('Generated score data:', {
				selectedNote,
				chordType,
				voicing,
				inversion,
				scoreData
			});
			return {
				leftHand: scoreData.leftHand,
				rightHand: scoreData.rightHand,
				selectedNote
			};
		} catch (error) {
			console.error('Error generating score data:', error);
			// Return a default C major chord if there's an error
			return {
				selectedNote: 'C',
				leftHand: [[]] as NoteFullName[][],
				rightHand: [['C4', 'E4', 'G4']] as NoteFullName[][]
			} as ScoreProps;
		}
	}

	function isCompleted(currentNotes: MidiNote[], expectedNotes: MidiNote[]): boolean {
		// If rootless, check if we have 4 unique note classes that match expected
		if (voicing.startsWith('rootless')) {
			const currentClasses = new Set(currentNotes.map((n) => n % 12));
			const expectedClasses = new Set(expectedNotes.map((n) => n % 12));
			return (
				currentClasses.size === expectedClasses.size &&
				[...currentClasses].every((c) => expectedClasses.has(c))
			);
		}

		return (
			currentNotes.length === expectedNotes.length &&
			currentNotes.every((note) => expectedNotes.includes(note))
		);
	}
</script>

<BaseExercise
	{randomMode}
	{generateExpectedNotes}
	{generateScoreProps}
	{validateNoteEvent}
	{isCompleted}
	onReset={handleParentReset}
	{onComplete}
	initialNote={propKey}
	{description}
>
	{#snippet children(api: any)}
		{@const wasCompleted = exerciseCompleted}
		{@const isNowCompleted = api.completed}
		{#if isNowCompleted && !wasCompleted}
			{(exerciseCompleted = true)}
		{:else if !isNowCompleted && wasCompleted}
			{(exerciseCompleted = false)}
		{/if}
		<div class="controls">
			{#if !randomMode}
				<div class="control-group">
					<label for="chord-type">Chord Type:</label>
					<select id="chord-type" value={chordType} onchange={handleChordTypeChange}>
						{#each AllChordTypes as type}
							<option value={type}>{type}</option>
						{/each}
					</select>
				</div>

				<div class="control-group">
					<label for="inversion">Inversion:</label>
					<select id="inversion" value={inversion} onchange={handleInversionChange}>
						<option value={0}>Root</option>
						<option value={1}>1st</option>
						<option value={2}>2nd</option>
						<option value={3}>3rd</option>
					</select>
				</div>

				<div class="control-group">
					<label for="voicing">Voicing:</label>
					<select id="voicing" value={voicing} onchange={handleVoicingChange}>
						<option value="full-right">Full Right Hand</option>
						<option value="full-left">Full Left Hand</option>
						<option value="1735">1 & 7 Left / 3 & 5 Right</option>
						<option value="1537">1 & 5 Left / 3 & 7 Right</option>
						<option value="rootless-a">Rootless A (3-5-7-9)</option>
						<option value="rootless-b">Rootless B (7-9-3-5)</option>
					</select>
				</div>
			{/if}
		</div>
	{/snippet}
</BaseExercise>

<style>
	.controls {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
		margin: 2rem 0;
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

	@media (max-width: 768px) {
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
