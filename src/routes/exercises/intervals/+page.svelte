<svelte:options runes={true} />

<script lang="ts">
	import {
		MidiToNote,
		AllIntervals,
		INTERVAL_NAMES,
		NoteToMidi,
		AllNotes
	} from '$lib/types/notes.constants';
	import type {
		MidiNote,
		Note,
		NoteEvent,
		ScoreProps,
		IntervalType,
		NoteFullName
	} from '$lib/types/types';
	import type { ValidationResult } from '$lib/types/exercise-api';
	import { calculateInterval } from '$lib/MusicTheoryUtils';
	import BaseExercise from '../../../components/BaseExercise.svelte';

	const description =
		'Play the interval shown on the staff using your MIDI keyboard. Listen and check your answer.';

	const props = $props();
	let randomMode = props.randomMode;
	let onComplete = props.onComplete;
	let propIntervalType = props.intervalType;
	let propRightHandMode = props.rightHandMode;
	let propKey = props.rootKey;

	let intervalType: IntervalType = $state(
		propIntervalType ??
			(randomMode ? AllIntervals[Math.floor(Math.random() * AllIntervals.length)] : 'major3rd')
	);
	let handMode: boolean = $state(propRightHandMode ?? (randomMode ? Math.random() > 0.5 : true));
	let currentRoot: Note = $state(
		propKey ?? (randomMode ? AllNotes[Math.floor(Math.random() * AllNotes.length)] : 'C')
	);
	let playedNotes: Set<MidiNote> = $state(new Set());
	let exerciseCompleted = $state(false);

	function handleParentReset(): void {
		playedNotes = new Set();
		exerciseCompleted = false;
	}

	$effect(() => {
		if (exerciseCompleted && onComplete) {
			onComplete();
		}
	});

	function generateNewChallenge() {
		const randomRoot = AllNotes[Math.floor(Math.random() * AllNotes.length)];
		const randomInterval = AllIntervals[Math.floor(Math.random() * AllIntervals.length)];

		currentRoot = randomRoot;
		intervalType = randomInterval;
		playedNotes = new Set();
		exerciseCompleted = false;
	}

	function getOptimalOctave(note: Note, isRightHand: boolean): string {
		// Center around C3 (Right Hand) or C2 (Left Hand) - Lowered by request
		// If Note is High (G, A, B), drop octave
		const isHighNote = ['G', 'A', 'B'].includes(note);

		if (isRightHand) {
			// Target C3.
			// If C..F -> 3. If G..B -> 2.
			return isHighNote ? '2' : '3';
		} else {
			// Target C2.
			// If C..F -> 2. If G..B -> 1.
			return isHighNote ? '1' : '2';
		}
	}

	function generateExpectedNotes(_selectedNote: Note): MidiNote[] {
		// Ignore selectedNote from BaseExercise, use local currentRoot
		try {
			// Adjustment for centering
			const octave = getOptimalOctave(currentRoot, handMode);
			const expectedNoteValue = calculateInterval(currentRoot, intervalType, octave);
			const rootMidi = NoteToMidi[(currentRoot + octave) as NoteFullName];

			// expectedNoteValue is already a MidiNote, no need to look it up again
			const expectedMidi = expectedNoteValue;

			console.debug(
				`Interval ${INTERVAL_NAMES[intervalType]} from ${currentRoot}${octave} to ${expectedMidi}:`,
				`Root MIDI: ${rootMidi}, Expected MIDI: ${expectedMidi}`
			);

			// Always return both notes for validation
			// Ensure both notes are distinct in the array even if they're the same MIDI number (unison)
			// This helps the keyboard display show the note properly
			if (rootMidi === expectedMidi) {
				// For unison, return the same note but ensure it's in the array
				return [rootMidi];
			}
			return [rootMidi, expectedMidi];
		} catch (error) {
			console.error('Error generating expected note:', error);
			// Return default fallback
			const rootMidi = NoteToMidi['C4'];
			const expectedMidi = NoteToMidi['E4'];
			return [rootMidi, expectedMidi];
		}
	}

	function generateScoreProps(_selectedNote: Note): ScoreProps {
		try {
			// Sync octave with generateExpectedNotes
			const octave = getOptimalOctave(currentRoot, handMode);
			const expectedNote = calculateInterval(currentRoot, intervalType, octave);
			const rootNote = (currentRoot + octave) as NoteFullName;
			const intervalNote = MidiToNote[expectedNote];

			let leftHand: NoteFullName[][] = [];
			let rightHand: NoteFullName[][] = [];
			if (handMode) {
				// Right Hand
				rightHand = [[rootNote, intervalNote]];
			} else {
				// Left Hand
				leftHand = [[rootNote, intervalNote]];
			}

			return {
				selectedNote: currentRoot,
				leftHand,
				rightHand
			};
		} catch (error) {
			console.error('Error generating score props:', error);
			// Return default fallback
			return {
				selectedNote: currentRoot,
				leftHand: [],
				rightHand: [['C4', 'E4']]
			};
		}
	}
	function validateIntervalNote(
		_selectedNote: Note,
		event: NoteEvent,
		expectedNotes: ReadonlyArray<MidiNote>,
		currentNotes: ReadonlyArray<MidiNote>
	): ValidationResult {
		const intervalName = INTERVAL_NAMES[intervalType];
		const isUnison = expectedNotes.length === 1; // Unison means both notes are the same
		const requiredNotesCount = isUnison ? 1 : 2;

		if (expectedNotes.includes(event.noteNumber)) {
			// Add the played note to our collection
			playedNotes = new Set([...playedNotes, event.noteNumber]);

			// Check if we have all required notes
			if (playedNotes.size === requiredNotesCount) {
				// Auto-advance
				setTimeout(() => {
					generateNewChallenge();
				}, 1500);

				return {
					isCorrect: true,
					message: `Perfect ${intervalName}! 🎵✨`,
					collected: true,
					resetCollected: true
				};
			} else {
				// Determine which note was played
				const [rootMidi, intervalMidi] =
					expectedNotes.length === 2 ? expectedNotes : [expectedNotes[0], expectedNotes[0]];
				const isRoot = event.noteNumber === rootMidi;
				const noteName = isRoot ? 'root' : intervalName;
				return {
					isCorrect: true,
					message: `Good! ${noteName} played (${playedNotes.size}/${requiredNotesCount})`,
					collected: true,
					resetCollected: false
				};
			}
		} else {
			playedNotes = new Set();
			const playedNoteName = MidiToNote[event.noteNumber]?.slice(0, -1) as Note;
			return {
				isCorrect: false,
				message: `Wrong! You played ${playedNoteName}. Play ${intervalName} from ${currentRoot}`,
				collected: false,
				resetCollected: true
			};
		}
	}

	function isIntervalCompleted(
		currentNotes: ReadonlyArray<MidiNote>,
		expectedNotes: ReadonlyArray<MidiNote>
	): boolean {
		// Continuous practice
		return false;
	}

	function handleIntervalTypeChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		intervalType = target.value as IntervalType;
		playedNotes = new Set();
	}

	function handleHandModeToggle(event: Event): void {
		const target = event.target as HTMLInputElement;
		handMode = target.checked;
		playedNotes = new Set();
	}

	// Generate prompt from current state
	let computedPrompt = $derived(`${INTERVAL_NAMES[intervalType]} from ${currentRoot}`);
</script>

<BaseExercise
	{randomMode}
	{generateExpectedNotes}
	{generateScoreProps}
	validateNoteEvent={validateIntervalNote}
	isCompleted={isIntervalCompleted}
	onReset={handleParentReset}
	onComplete={() => {}}
	initialNote={currentRoot}
	{description}
	prompt={computedPrompt}
	showTempoControl={false}
	showTrainingControl={false}
>
	{#snippet children(api: import('$lib/types/exercise-api').ExerciseAPI)}
		{@const wasCompleted = exerciseCompleted}
		{@const isNowCompleted = api.completed}
		{#if isNowCompleted && !wasCompleted}
			{(exerciseCompleted = true)}
		{:else if !isNowCompleted && wasCompleted}
			{(exerciseCompleted = false)}
		{/if}

		{#if !randomMode}
			<div class="controls-area">
				<div class="control-group">
					<label for="intervalType">Interval Type</label>
					<select id="intervalType" value={intervalType} onchange={handleIntervalTypeChange}>
						{#each AllIntervals as interval}
							<option value={interval}>{INTERVAL_NAMES[interval]}</option>
						{/each}
					</select>
				</div>
				<div class="control-group">
					<label>
						<input type="checkbox" bind:checked={handMode} onchange={handleHandModeToggle} />
						Right hand mode
					</label>
				</div>
			</div>
		{/if}
	{/snippet}
</BaseExercise>

<style>
	.controls-area {
		display: flex;
		gap: 2rem;
		justify-content: center;
		padding: 1rem;
		background: var(--color-surface);
		border-radius: 8px;
		margin-bottom: 1rem;
	}
	.control-group {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}
</style>
