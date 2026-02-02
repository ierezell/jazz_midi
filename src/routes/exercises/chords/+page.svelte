<svelte:options runes={true} />

<script lang="ts">
	import {
		chords,
		generateChordNotesData,
		getVoicedChordNotes,
		calculateOptimalInversion
	} from '$lib/MusicTheoryUtils';
	import type { ChordVoicing, Inversion } from '$lib/types/notes';
	import {
		AllChordTypes,
		AllChordVoicings,
		NoteToMidi,
		DEFAULT_OCTAVE,
		AllNotes
	} from '$lib/types/notes.constants';
	import type {
		ChordType,
		MidiNote,
		Note,
		NoteEvent,
		NoteFullName,
		ScoreProps
	} from '$lib/types/types';
	import type { ValidationResult } from '$lib/types/exercise-api';
	import BaseExercise from '../../../components/BaseExercise.svelte';
	import { page } from '$app/state';

	const description =
		'Play the notes of the displayed chord on your MIDI keyboard. Try to match the voicing and inversion shown.';

	interface Props {
		randomMode: boolean;
		onComplete: () => void;
		chordType: ChordType;
		inversion: Inversion;
		rootKey: Note;
		voicing: ChordVoicing;
		progressiveHints?: boolean;
		prompt?: string;
	}

	let {
		randomMode,
		onComplete,
		chordType: propChordType,
		inversion: propInversion,
		rootKey: propKey,
		voicing: propVoicing,
		progressiveHints,
		prompt
	}: Props = $props();

	let possibleChordTypes = ['maj7', 'min7', '7', 'dom7', 'half-dim7', 'dim7'] as ChordType[];

	// Local State - read URL params directly to avoid state_referenced_locally warning
	let currentRoot: Note = $state(
		(page.url.searchParams.get('root') as Note) ??
			propKey ??
			(randomMode ? AllNotes[Math.floor(Math.random() * AllNotes.length)] : 'C')
	);
	let currentChordType: ChordType = $state(
		(page.url.searchParams.get('quality') as ChordType) ??
			propChordType ??
			(randomMode
				? possibleChordTypes[Math.floor(Math.random() * possibleChordTypes.length)]
				: 'maj7')
	);
	let currentInversion: Inversion = $state(
		propInversion ?? (randomMode ? (Math.floor(Math.random() * 4) as Inversion) : 0)
	);
	let currentVoicing: ChordVoicing = $state(
		propVoicing ??
			(randomMode
				? AllChordVoicings[Math.floor(Math.random() * AllChordVoicings.length)]
				: 'full-right')
	);
	let exerciseCompleted = $state(false);
	let useOptimizedVoicing = $state(false);
	let previousChordNotes: MidiNote[] = $state([]);

	function generateNewChallenge() {
		const randomRoot = AllNotes[Math.floor(Math.random() * AllNotes.length)];
		const randomType = possibleChordTypes[Math.floor(Math.random() * possibleChordTypes.length)];

		// Calculate optimal inversion if enabled
		let randomInv: Inversion;
		if (useOptimizedVoicing && previousChordNotes.length > 0) {
			const rootNote = (randomRoot + '3') as NoteFullName;
			const rootMidi = NoteToMidi[rootNote];
			randomInv = calculateOptimalInversion(rootMidi, randomType, previousChordNotes);
		} else {
			randomInv = Math.floor(Math.random() * 4) as Inversion;
		}

		currentRoot = randomRoot;
		currentChordType = randomType;
		currentInversion = randomInv;
	}

	function handleComplete() {
		// Store current chord notes for voice leading optimization
		const notes = generateExpectedNotes(currentRoot);
		previousChordNotes = notes;

		generateNewChallenge();
		onComplete?.();
	}

	function generateExpectedNotes(selectedNote: Note): MidiNote[] {
		// Calculate optimal octave to keep chords centered
		// If root is high (G, A, B), drop to octave 3. Otherwise use octave 4.
		// This keeps roots roughly between G3 and F4.
		const notes = [
			'C',
			'C#',
			'Db',
			'D',
			'D#',
			'Eb',
			'E',
			'F',
			'F#',
			'Gb',
			'G',
			'G#',
			'Ab',
			'A',
			'A#',
			'Bb',
			'B'
		];
		const noteIndex = notes.indexOf(currentRoot);
		// G is index 10. G, G#, A... B are high.
		const octave = noteIndex >= 10 ? '3' : DEFAULT_OCTAVE;

		const rootNote = (currentRoot + octave) as NoteFullName;
		const rootMidi = NoteToMidi[rootNote];
		const currentChord = chords(rootMidi, currentChordType, currentInversion);

		return getVoicedChordNotes(currentChord, currentVoicing);
	}

	function validateNoteEvent(
		selectedNote: Note,
		event: NoteEvent,
		expectedNotes: ReadonlyArray<MidiNote>
	): ValidationResult {
		const expectedClasses = expectedNotes.map((n) => n % 12);
		const playedClass = event.noteNumber % 12;

		if (expectedClasses.includes(playedClass)) {
			// For strict inversion validation, check if the exact MIDI note is expected
			// For rootless voicings, we can be more lenient with octaves
			const isExactMatch = expectedNotes.includes(event.noteNumber);
			const isRootless = currentVoicing.startsWith('rootless');

			if (isExactMatch || isRootless) {
				return {
					isCorrect: true,
					message: isExactMatch ? 'Correct chord tone!' : 'Correct chord tone (octave ignored)!',
					collected: true,
					resetCollected: false
				};
			} else {
				// Right pitch class, wrong octave/inversion
				return {
					isCorrect: false,
					message: 'Correct note, but check the inversion/octave!',
					collected: false,
					resetCollected: true
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
		currentChordType = target.value as ChordType;
	}

	function handleInversionChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		currentInversion = parseInt(target.value) as Inversion;
	}

	function handleVoicingChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		currentVoicing = target.value as typeof currentVoicing;
	}

	// Derived values for display and score
	let chordInfo = $derived.by(() => {
		return {
			name: `${currentChordType}`,
			voicing: currentVoicing,
			inversion: currentInversion
		};
	});

	function generateScoreProps(selectedNote: Note): ScoreProps {
		try {
			const scoreData = generateChordNotesData(
				currentRoot,
				currentChordType,
				currentInversion,
				currentVoicing
			);
			console.debug('Generated score data:', {
				currentRoot,
				chordType: currentChordType,
				voicing: currentVoicing,
				inversion: currentInversion,
				scoreData
			});
			return {
				leftHand: scoreData.leftHand,
				rightHand: scoreData.rightHand,
				selectedNote: currentRoot
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

	function isCompleted(
		currentNotes: ReadonlyArray<MidiNote>,
		expectedNotes: ReadonlyArray<MidiNote>
	): boolean {
		// If rootless, check if we have 4 unique note classes that match expected
		if (currentVoicing.startsWith('rootless')) {
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

	function handleParentReset(): void {
		exerciseCompleted = false;
	}

	// Generate prompt from current state
	let computedPrompt = $derived(
		`${currentRoot} ${currentChordType} - ${getInversionName(currentInversion)}`
	);
	let effectivePrompt = $derived(prompt ?? computedPrompt);

	function getInversionName(inv: Inversion): string {
		switch (inv) {
			case 0:
				return 'Root Position';
			case 1:
				return '1st Inversion';
			case 2:
				return '2nd Inversion';
			case 3:
				return '3rd Inversion';
			default:
				return 'Root Position';
		}
	}
</script>

<BaseExercise
	{randomMode}
	{generateExpectedNotes}
	{generateScoreProps}
	{validateNoteEvent}
	{isCompleted}
	onReset={handleParentReset}
	onComplete={handleComplete}
	initialNote={currentRoot}
	{description}
	{progressiveHints}
	prompt={effectivePrompt}
>
	{#snippet children(api: import('$lib/types/exercise-api').ExerciseAPI)}
		{@const wasCompleted = exerciseCompleted}
		{@const isNowCompleted = api.completed}
		{#if isNowCompleted && !wasCompleted}
			{(exerciseCompleted = true)}
		{:else if !isNowCompleted && wasCompleted}
			{(exerciseCompleted = false)}
		{/if}

		{#if !randomMode && !page.url.searchParams.get('unitId')}
			<div class="controls">
				<div class="control-group">
					<label for="chord-type">Chord Type</label>
					<select id="chord-type" value={currentChordType} onchange={handleChordTypeChange}>
						{#each AllChordTypes as type}
							<option value={type}>{type}</option>
						{/each}
					</select>
				</div>

				<div class="control-group">
					<label for="inversion">Inversion</label>
					<select id="inversion" value={currentInversion} onchange={handleInversionChange}>
						<option value={0}>Root</option>
						<option value={1}>1st</option>
						<option value={2}>2nd</option>
						<option value={3}>3rd</option>
					</select>
				</div>

				<div class="control-group">
					<label>
						<input type="checkbox" bind:checked={useOptimizedVoicing} />
						Optimized Voice Leading
					</label>
				</div>

				<div class="control-group">
					<label for="voicing">Voicing</label>
					<select id="voicing" value={currentVoicing} onchange={handleVoicingChange}>
						<option value="full-right">Full Right Hand</option>
						<option value="full-left">Full Left Hand</option>
						<option value="1735">1 & 7 Left / 3 & 5 Right</option>
						<option value="1537">1 & 5 Left / 3 & 7 Right</option>
						<option value="rootless-a">Rootless A (3-5-7-9)</option>
						<option value="rootless-b">Rootless B (7-9-3-5)</option>
					</select>
				</div>
			</div>
		{/if}
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
		background-color: var(--color-surface);
		border-radius: 0.5rem;
		border: 1px solid var(--color-border);
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: center;
	}

	.control-group label {
		font-weight: 500;
		color: var(--color-text-muted);
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
