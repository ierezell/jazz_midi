<svelte:options runes={true} />

<script lang="ts">
	import { MidiToNote, AllIntervals, INTERVAL_NAMES, NoteToMidi } from '$lib/types/notes.constants';
	import type {
		MidiNote,
		Note,
		NoteEvent,
		ScoreProps,
		IntervalType,
		NoteFullName
	} from '$lib/types/types';
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

	function generateExpectedNotes(selectedNote: Note): MidiNote[] {
		try {
			const octave = handMode ? '3' : '4';
			const expectedNoteValue = calculateInterval(selectedNote, intervalType, octave);
			const rootMidi = NoteToMidi[(selectedNote + octave) as NoteFullName];
			const expectedMidi = NoteToMidi[(expectedNoteValue + octave) as NoteFullName];

			console.debug(
				`Interval ${INTERVAL_NAMES[intervalType]} from ${selectedNote}${octave} to ${expectedNoteValue}${octave}:`,
				`Root MIDI: ${rootMidi}, Expected MIDI: ${expectedMidi}`
			);
			// Always return both notes for validation
			return [rootMidi, expectedMidi];
		} catch (error) {
			console.error('Error generating expected note:', error);
			// Return default fallback
			const rootMidi = NoteToMidi['C4'];
			const expectedMidi = NoteToMidi['E4'];
			return [rootMidi, expectedMidi];
		}
	}

	function generateScoreProps(selectedNote: Note): ScoreProps {
		try {
			const expectedNote = calculateInterval(selectedNote, intervalType, '4');
			const rootNote = (selectedNote + '4') as NoteFullName;
			const intervalNote = MidiToNote[expectedNote];

			let leftHand: NoteFullName[][] = [];
			let rightHand: NoteFullName[][] = [];
			if (handMode) {
				rightHand = [[rootNote, intervalNote]];
			} else {
				leftHand = [[rootNote, intervalNote]];
			}

			return {
				selectedNote: selectedNote,
				leftHand,
				rightHand
			};
		} catch (error) {
			console.error('Error generating score props:', error);
			// Return default fallback
			return {
				selectedNote: selectedNote,
				leftHand: [],
				rightHand: [['C4', 'E4']]
			};
		}
	}
	function validateIntervalNote(
		selectedNote: Note,
		event: NoteEvent,
		expectedNotes: MidiNote[],
		currentNotes: MidiNote[]
	): { isCorrect: boolean; message: string; collected: boolean; resetCollected: boolean } {
		const [rootMidi, intervalMidi] = expectedNotes;
		const intervalName = INTERVAL_NAMES[intervalType];

		if (expectedNotes.includes(event.noteNumber)) {
			// Add the played note to our collection
			playedNotes = new Set([...playedNotes, event.noteNumber]);

			// Check if we have both notes
			if (playedNotes.size === 2) {
				return {
					isCorrect: true,
					message: `Perfect ${intervalName}! 🎵✨`,
					collected: true,
					resetCollected: false
				};
			} else {
				// Determine which note was played
				const isRoot = event.noteNumber === rootMidi;
				const noteName = isRoot ? 'root' : intervalName;
				return {
					isCorrect: true,
					message: `Good! ${noteName} played (${playedNotes.size}/2)`,
					collected: true,
					resetCollected: false
				};
			}
		} else {
			playedNotes = new Set();
			const playedNoteName = MidiToNote[event.noteNumber]?.slice(0, -1) as Note;
			return {
				isCorrect: false,
				message: `Wrong! You played ${playedNoteName}. Play ${intervalName} from ${selectedNote}`,
				collected: false,
				resetCollected: true
			};
		}
	}

	function isIntervalCompleted(currentNotes: MidiNote[], expectedNotes: MidiNote[]): boolean {
		const uniqueExpectedNotes = [...new Set(expectedNotes)];
		return playedNotes.size === uniqueExpectedNotes.length;
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
</script>

<BaseExercise
	{randomMode}
	{generateExpectedNotes}
	{generateScoreProps}
	validateNoteEvent={validateIntervalNote}
	isCompleted={isIntervalCompleted}
	onReset={handleParentReset}
	onComplete={() => {}}
	initialNote={propKey || 'C'}
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
					<label for="intervalType">Interval Type:</label>
					<select id="intervalType" value={intervalType} onchange={handleIntervalTypeChange}>
						{#each AllIntervals as interval}
							<option value={interval}>{INTERVAL_NAMES[interval]}</option>
						{/each}
					</select>
				</div>
				<div class="control-group">
					<label>
						<input type="checkbox" bind:checked={handMode} onchange={handleHandModeToggle} />
						Right hand
					</label>
				</div>
			{/if}
		</div>
	{/snippet}
</BaseExercise>

<style>
	.control-group {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	select {
		padding: 0.3rem 0.6rem;
		border: 1px solid #ddd;
		border-radius: 0.3rem;
		background: white;
		font-size: 0.9rem;
	}

	@keyframes bounce {
		0%,
		20%,
		50%,
		80%,
		100% {
			transform: translateY(0);
		}
		40% {
			transform: translateY(-10px);
		}
		60% {
			transform: translateY(-5px);
		}
	}
</style>
