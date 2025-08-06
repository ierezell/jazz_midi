<svelte:options runes={true} />

<script lang="ts">
	import { calculateOptimalRange, chords } from '$lib/MusicTheoryUtils';
	import { AllChordTypes, MidiToNote, NoteToMidi } from '$lib/types/notes.constants';
	import type {
		ChordToneColors,
		ChordToneInfo,
		ChordToneRole,
		ChordType,
		MidiNote,
		Note,
		NoteEvent,
		NoteFullName
	} from '$lib/types/types';
	import { DEFAULT_CHORD_TONE_COLORS } from '$lib/types/types';
	import { onMount } from 'svelte';
	import BaseExercise from '../../components/BaseExercise.svelte';
	import ChordToneToggle from '../../components/ChordToneToggle.svelte';

	// Random mode props
	interface Props {
		randomMode?: boolean;
		randomNote?: Note;
		randomChordType?: ChordType;
		randomInversion?: 0 | 1 | 2 | 3;
		onRandomComplete?: () => void;
	}

	let {
		randomMode = false,
		randomNote,
		randomChordType,
		randomInversion,
		onRandomComplete
	}: Props = $props();

	// Chord-specific configuration
	let chordType: ChordType = $state('maj7');
	let inversion: 0 | 1 | 2 | 3 = $state(0);
	let voicing: 'full' | 'left-hand' | 'right-hand' | 'split' = $state('full');

	// Initialize random values if in random mode
	onMount(() => {
		if (randomMode) {
			if (randomChordType) chordType = randomChordType;
			if (randomInversion !== undefined) inversion = randomInversion;
		}
	});

	// Generate score data for notation
	function generateScoreData(selectedNote: Note): {
		leftHandNotes: NoteFullName[][];
		rightHandNotes: NoteFullName[][];
	} {
		const rootNote = (selectedNote + '4') as NoteFullName;
		const rootMidi = NoteToMidi[rootNote];
		const currentChord = chords(rootMidi, chordType, inversion);

		console.log('Generating score data:', {
			rootNote,
			rootMidi,
			currentChord,
			chordType,
			voicing,
			inversion
		});

		const allChordNotes = [
			currentChord.root,
			currentChord.third,
			currentChord.fifth,
			currentChord.seventh
		].filter((note) => note !== undefined) as MidiNote[];

		switch (voicing) {
			case 'full':
				// All notes in right hand as a single chord
				const fullResult = {
					leftHandNotes: [],
					rightHandNotes: [allChordNotes.map((midi) => MidiToNote[midi])]
				};
				console.log('Full voicing result:', fullResult);
				return fullResult;
			case 'left-hand':
				const leftOnly = [currentChord.root, currentChord.seventh].filter(
					(note) => note !== undefined
				) as MidiNote[];
				return {
					leftHandNotes: [leftOnly.map((midi) => MidiToNote[midi])],
					rightHandNotes: []
				};
			case 'right-hand':
				const rightOnly = [currentChord.third, currentChord.fifth];
				return {
					leftHandNotes: [],
					rightHandNotes: [rightOnly.map((midi) => MidiToNote[midi])]
				};
			case 'split':
				const leftHand = [
					currentChord.root - 12,
					(currentChord.seventh || currentChord.root) - 12
				].filter((note) => note >= 24) as MidiNote[];
				const rightHand = [currentChord.third, currentChord.fifth];
				return {
					leftHandNotes: [leftHand.map((midi) => MidiToNote[midi])],
					rightHandNotes: [rightHand.map((midi) => MidiToNote[midi])]
				};
			default:
				return {
					leftHandNotes: [],
					rightHandNotes: [allChordNotes.map((midi) => MidiToNote[midi])]
				};
		}
	}

	// Generate expected notes for a given root note
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

	// Chord-specific validation (optional - uses default if not provided)
	function validateChordNote(
		event: NoteEvent,
		expectedNotes: MidiNote[]
	): { isCorrect: boolean; message: string } {
		if (expectedNotes.includes(event.noteNumber)) {
			return { isCorrect: true, message: 'Correct chord tone!' };
		}
		return { isCorrect: false, message: 'Not a chord tone. Try again!' };
	}

	// Handle chord parameter changes
	function handleChordTypeChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		chordType = target.value as ChordType;
	}

	function handleInversionChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		inversion = parseInt(target.value) as 0 | 1 | 2 | 3;
	}

	function handleVoicingChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		voicing = target.value as typeof voicing;
	}

	// Derived values for display and score
	let chordInfo = $derived.by(() => {
		const symbols: Record<ChordType, string> = {
			major: 'M',
			minor: 'm',
			maj7: 'Maj7',
			min7: 'm7',
			'7': '7',
			dom7: '7',
			diminished: '°',
			dim7: '°7',
			'half-dim7': 'ø',
			augmented: '+',
			sus2: 'sus2',
			sus4: 'sus4'
		};
		return {
			name: `${chordType}`,
			voicing: voicing,
			inversion: inversion
		};
	});

	// Function to get score props with current settings
	function generateScorePropsForExercise(selectedNote: Note) {
		try {
			const scoreData = generateScoreData(selectedNote);
			console.log('Generated score data:', {
				selectedNote,
				chordType,
				voicing,
				inversion,
				scoreData
			});
			return {
				title: chordInfo.name,
				leftHandNotes: scoreData.leftHandNotes,
				rightHandNotes: scoreData.rightHandNotes
			};
		} catch (error) {
			console.error('Error generating score data:', error);
			// Return a default C major chord if there's an error
			return {
				title: 'C Major',
				leftHandNotes: [],
				rightHandNotes: [['C4', 'E4', 'G4']] as NoteFullName[][]
			};
		}
	}

	function analyzeChordTone(
		noteNumber: MidiNote,
		chordNotes: { root: MidiNote; third: MidiNote; fifth: MidiNote; seventh?: MidiNote }
	): ChordToneRole {
		const normalizedNote = noteNumber % 12;
		const rootNormalized = chordNotes.root % 12;
		const thirdNormalized = chordNotes.third % 12;
		const fifthNormalized = chordNotes.fifth % 12;
		const seventhNormalized = chordNotes.seventh ? chordNotes.seventh % 12 : null;
		if (normalizedNote === rootNormalized) return 'root';
		if (normalizedNote === thirdNormalized) return 'third';
		if (normalizedNote === fifthNormalized) return 'fifth';
		if (seventhNormalized !== null && normalizedNote === seventhNormalized) return 'seventh';
		return 'none';
	}

	function getChordToneColor(
		role: ChordToneRole,
		colors: ChordToneColors = DEFAULT_CHORD_TONE_COLORS
	): string {
		return colors[role];
	}
	export function createChordToneMapping(
		startNote: MidiNote,
		endNote: MidiNote,
		chordNotes: { root: MidiNote; third: MidiNote; fifth: MidiNote; seventh?: MidiNote },
		colors: ChordToneColors = DEFAULT_CHORD_TONE_COLORS
	): ChordToneInfo[] {
		const mapping: ChordToneInfo[] = [];
		for (let noteNumber = startNote; noteNumber <= endNote; noteNumber++) {
			const role = analyzeChordTone(noteNumber as MidiNote, chordNotes);
			const color = getChordToneColor(role, colors);
			mapping.push({
				midiNote: noteNumber as MidiNote,
				noteNumber: noteNumber as MidiNote,
				role,
				color
			});
		}
		return mapping;
	}

	// Create chord tone info for keyboard highlighting
	function createChordToneInfo(selectedNote: Note) {
		const rootNote = (selectedNote + '4') as NoteFullName;
		const rootMidi = NoteToMidi[rootNote];
		const currentChord = chords(rootMidi, chordType, inversion);

		const expectedNotes = generateExpectedNotes(selectedNote);
		const keyboardRange = calculateOptimalRange(expectedNotes);
		const startNote = keyboardRange.middleC - Math.floor(keyboardRange.octaves / 2) * 12;
		const endNote = startNote + keyboardRange.octaves * 12;

		// Create a list of chord notes for the mapping
		const chordObject = {
			root: currentChord.root,
			third: currentChord.third,
			fifth: currentChord.fifth,
			seventh: currentChord.seventh
		};

		return createChordToneMapping(startNote as MidiNote, endNote as MidiNote, chordObject);
	}

	// Function to generate keyboard props with current settings
	function generateKeyboardPropsForExercise(selectedNote: Note) {
		console.log(
			'Generating keyboard props for note:',
			selectedNote,
			'chordType:',
			chordType,
			'inversion:',
			inversion
		);
		const chordToneInfo = createChordToneInfo(selectedNote);
		console.log('Generated chord tone info:', chordToneInfo);
		return {
			chordToneInfo,
			showChordTones: true
		};
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
	exerciseTitle={randomMode ? 'Random Chord' : 'Jazz Chord Practice'}
	exerciseDescription={randomMode
		? `Play the ${randomNote}${chordType} chord`
		: 'Practice playing jazz chords with different voicings and inversions'}
	initialSelectedNote={randomMode ? randomNote : undefined}
	{randomMode}
	{generateExpectedNotes}
	generateScoreProps={generateScorePropsForExercise}
	generateKeyboardProps={generateKeyboardPropsForExercise}
	validateNoteEvent={validateChordNote}
	scoreProps={{
		title: chordInfo.name
	}}
	customControls={true}
	{onExerciseComplete}
>
	{#snippet children(api: any)}
		<div class="chord-info">
			<h2 class="chord-display">{api.selectedNote} {chordInfo.name}</h2>
			<div class="chord-details">
				<span>Voicing: {chordInfo.voicing}</span>
				<span
					>Inversion: {chordInfo.inversion === 0
						? 'Root'
						: chordInfo.inversion === 1
							? '1st'
							: chordInfo.inversion === 2
								? '2nd'
								: '3rd'}</span
				>
			</div>
		</div>

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

			<div class="control-group">
				<button onclick={api.resetExercise}>Reset</button>
				{#if !randomMode}
					<button onclick={api.toggleDebug}>
						{api.debugMode ? 'Hide' : 'Show'} Debug
					</button>
				{/if}
			</div>

			{#if !randomMode}
				<div class="control-group chord-tone-controls">
					<ChordToneToggle showChordTones={api.showChordTones} onToggle={api.setShowChordTones} />
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
				<div class="completion">🎉 Chord Completed!</div>
			{/if}
		</div>
	{/snippet}
</BaseExercise>

<style>
	.chord-info {
		text-align: center;
		margin: 2rem 0;
	}

	.chord-display {
		font-size: 3rem;
		font-weight: bold;
		color: #3498db;
		margin-bottom: 0.5rem;
	}

	.chord-details {
		display: flex;
		justify-content: center;
		gap: 2rem;
		color: #7f8c8d;
		font-size: 1.1rem;
	}

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

	.control-group select,
	.control-group button {
		padding: 0.5rem;
		border: 1px solid #ced4da;
		border-radius: 0.25rem;
		background-color: white;
		min-width: 120px;
	}

	.control-group button {
		background-color: #007bff;
		color: white;
		cursor: pointer;
		border: none;
	}

	.control-group button:hover {
		background-color: #0056b3;
	}

	.chord-tone-controls {
		grid-column: 1 / -1;
		justify-self: center;
	}

	.exercise-status {
		display: flex;
		justify-content: center;
		gap: 2rem;
		margin: 1rem 0;
		padding: 1rem;
		background-color: #f1f3f4;
		border-radius: 0.5rem;
		font-weight: 500;
	}

	.completion {
		color: #28a745;
		font-size: 1.2rem;
	}

	@media (max-width: 768px) {
		.chord-details {
			flex-direction: column;
			gap: 0.5rem;
		}

		.controls {
			flex-direction: column;
			align-items: center;
		}

		.control-group {
			width: 100%;
			max-width: 200px;
		}

		.exercise-status {
			flex-direction: column;
			text-align: center;
			gap: 0.5rem;
		}
	}
</style>
