<svelte:options runes={true} />

<script lang="ts">
	import { chords, generateChordNotesData } from '$lib/MusicTheoryUtils';
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
	import BaseExercise from '../../components/BaseExercise.svelte';

	interface Props {
		randomMode: boolean;
		onComplete?: () => void;
		chordType?: ChordType;
		inversion?: Inversion;
		voicing?: ChordVoicing;
	}

	let {
		randomMode,
		onComplete,
		chordType: propChordType,
		inversion: propInversion,
		voicing: propVoicing
	}: Props = $props();
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

	$effect(() => {
		if (exerciseCompleted && onComplete) {
			onComplete();
		}
	});

	function generateExpectedNotes(selectedNote: Note): MidiNote[] {
		const rootNote = (selectedNote + DEFAULT_OCTAVE) as NoteFullName;
		const rootMidi = NoteToMidi[rootNote];
		const currentChord = chords(rootMidi, chordType, inversion);

		const allChordNotes = [
			currentChord.root,
			currentChord.third,
			currentChord.fifth,
			currentChord.seventh
		].filter((note) => note !== undefined) as MidiNote[];

		switch (voicing) {
			case 'full-right':
				return allChordNotes;
			case 'full-left':
				return allChordNotes.map((n) => (n as number) - 12).filter((n) => n >= 24) as MidiNote[];
			case '1735':
				return [
					(currentChord.root as number) - 12,
					((currentChord.seventh || currentChord.root) as number) - 12,
					currentChord.third,
					currentChord.fifth
				].filter((n) => n !== undefined && (n as number) >= 24) as MidiNote[];
			case '1537':
				return [
					(currentChord.root as number) - 12,
					(currentChord.fifth as number) - 12,
					currentChord.third,
					(currentChord.seventh as number) || currentChord.root
				].filter((n) => n !== undefined && (n as number) >= 24) as MidiNote[];
			default:
				return allChordNotes;
		}
	}

	function validateNoteEvent(
		selectedNote: Note,
		event: NoteEvent,
		expectedNotes: MidiNote[]
	): { isCorrect: boolean; message: string; collected: boolean; resetCollected: boolean } {
		if (expectedNotes.includes(event.noteNumber)) {
			return {
				isCorrect: true,
				message: 'Correct chord tone!',
				collected: true,
				resetCollected: false
			};
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
