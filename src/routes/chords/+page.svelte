<svelte:options runes={true} />

<script lang="ts">
	import { chords, generateChordNotesData } from '$lib/MusicTheoryUtils';
	import type { ChordVoicing, Inversion } from '$lib/types/notes';
	import { AllChordTypes, NoteToMidi } from '$lib/types/notes.constants';
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
	}

	let { randomMode }: Props = $props();

	let chordType: ChordType = $state('maj7');
	let inversion: Inversion = $state(0);
	let voicing: ChordVoicing = $state('full');

	function generateExpectedNotes(selectedNote: Note): MidiNote[] {
		const rootNote = (selectedNote + '4') as NoteFullName;
		const rootMidi = NoteToMidi[rootNote];
		const currentChord = chords(rootMidi, chordType, inversion);

		const allChordNotes = [
			currentChord.root,
			currentChord.third,
			currentChord.fifth,
			currentChord.seventh
		].filter((note) => note !== undefined) as MidiNote[];

		switch (voicing) {
			case 'full':
				return allChordNotes;
			case 'left-hand':
				return [currentChord.root, currentChord.seventh].filter(
					(note) => note !== undefined
				) as MidiNote[];
			case 'right-hand':
				return [currentChord.third, currentChord.fifth];
			case 'split':
				const leftHand = [
					currentChord.root - 12,
					(currentChord.seventh || currentChord.root) - 12
				].filter((note) => note >= 24) as MidiNote[];
				const rightHand = [currentChord.third, currentChord.fifth];
				return [...leftHand, ...rightHand];
			default:
				return allChordNotes;
		}
	}

	function validateNoteEvent(
		selectedNote: Note,
		event: NoteEvent,
		expectedNotes: MidiNote[]
	): { isCorrect: boolean; message: string } {
		if (expectedNotes.includes(event.noteNumber)) {
			return { isCorrect: true, message: 'Correct chord tone!' };
		}
		return { isCorrect: false, message: 'Not a chord tone. Try again!' };
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
	exerciseTitle={randomMode ? 'Random Chord' : 'Jazz Chord Practice'}
	exerciseDescription={'Practice playing jazz chords with different voicings and inversions'}
	{randomMode}
	{generateExpectedNotes}
	{generateScoreProps}
	{validateNoteEvent}
	{isCompleted}
>
	{#snippet children(api: any)}
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
						<option value="full">Full</option>
						<option value="left-hand">Left Hand</option>
						<option value="right-hand">Right Hand</option>
						<option value="split">Split</option>
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
