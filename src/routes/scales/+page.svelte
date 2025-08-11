<svelte:options runes={true} />

<script lang="ts">
	import type { ScaleMode } from '$lib/types/notes';
	import {
		AllScaleModes,
		MidiToNote,
		NoteToMidi,
		SCALE_INTERVALS
	} from '$lib/types/notes.constants';
	import type { MidiNote, Note, NoteEvent, NoteFullName, ScoreProps } from '$lib/types/types';
	import BaseExercise from '../../components/BaseExercise.svelte';

	interface Props {
		randomMode: boolean;
		onComplete?: () => void;
		scaleMode?: ScaleMode;
		sequentialMode?: boolean;
		handMode?: boolean;
	}

	let {
		randomMode,
		onComplete,
		scaleMode: propScaleMode,
		sequentialMode: propSequentialMode,
		handMode: propHandMode
	}: Props = $props();

	let sequentialMode: boolean = $state(
		propSequentialMode ?? (randomMode ? Math.random() > 0.5 : true)
	);
	let handMode: boolean = $state(propHandMode ?? (randomMode ? Math.random() > 0.5 : true));
	let scaleMode: ScaleMode = $state(
		propScaleMode ??
			(randomMode ? AllScaleModes[Math.floor(Math.random() * AllScaleModes.length)] : 'Maj')
	);
	let playedNotes: Set<MidiNote> = $state(new Set());
	let exerciseCompleted = $state(false);

	$effect(() => {
		if (exerciseCompleted && onComplete) {
			onComplete();
		}
	});

	function generateExpectedNotes(selectedNote: Note): MidiNote[] {
		const rootMidi = NoteToMidi[(selectedNote + (handMode ? '4' : '3')) as NoteFullName];

		const scaleNotes = SCALE_INTERVALS[scaleMode].map(
			(interval) => (rootMidi + interval) as MidiNote
		);

		console.debug(
			`Scale for ${selectedNote}4:`,
			scaleNotes.map((note) => MidiToNote[note])
		);

		return scaleNotes;
	}

	function generateScoreProps(selectedNote: Note): ScoreProps {
		const scaleNotes = generateExpectedNotes(selectedNote);
		const noteNames = scaleNotes.map((midi) => MidiToNote[midi]);
		const rightNotes = handMode ? noteNames.map((note) => [note]) : ([] as NoteFullName[][]);
		const leftNotes = handMode ? ([] as NoteFullName[][]) : noteNames.map((note) => [note]);
		return {
			selectedNote: selectedNote,
			leftHand: leftNotes,
			rightHand: rightNotes
		};
	}

	function validateScaleNote(
		selectedNote: Note,
		event: NoteEvent,
		expectedNotes: MidiNote[],
		currentNotes: MidiNote[]
	): { isCorrect: boolean; message: string } {
		if (sequentialMode) {
			return validateSequential(event, expectedNotes, currentNotes);
		} else {
			return validateAnyOrder(event, expectedNotes, currentNotes);
		}
	}

	function validateSequential(
		event: NoteEvent,
		expectedNotes: MidiNote[],
		currentNotes: MidiNote[]
	): { isCorrect: boolean; message: string } {
		const nextExpectedIndex = playedNotes.size;
		const expectedNote = expectedNotes[nextExpectedIndex];

		if (event.noteNumber === expectedNote) {
			playedNotes = playedNotes.add(event.noteNumber);
		} else {
			const expectedNoteName = MidiToNote[expectedNote]?.slice(0, -1) || expectedNote.toString();
			playedNotes = new Set();
			return {
				isCorrect: false,
				message: `Wrong note! Expected ${expectedNoteName} (note ${nextExpectedIndex + 1})`
			};
		}

		if (playedNotes.size === expectedNotes.length) {
			return { isCorrect: true, message: 'Perfect scale! 🎵✨' };
		} else {
			return {
				isCorrect: true,
				message: `Good! Note ${nextExpectedIndex + 1}/${expectedNotes.length}`
			};
		}
	}

	function validateAnyOrder(
		event: NoteEvent,
		expectedNotes: MidiNote[],
		currentNotes: MidiNote[]
	): { isCorrect: boolean; message: string } {
		if (expectedNotes.includes(event.noteNumber)) {
			playedNotes = playedNotes.add(event.noteNumber);
		} else {
			playedNotes = new Set();
			return { isCorrect: false, message: 'Wrong note!' };
		}

		if (playedNotes.size === expectedNotes.length) {
			return { isCorrect: true, message: 'Perfect scale! 🎵' };
		} else {
			return {
				isCorrect: true,
				message: `Good! ${playedNotes.size}/${expectedNotes.length} notes`
			};
		}
	}

	function isScaleCompleted(currentNotes: MidiNote[], expectedNotes: MidiNote[]): boolean {
		if (sequentialMode) {
			return (
				currentNotes.length === expectedNotes.length &&
				currentNotes.every((note, index) => note === expectedNotes[index])
			);
		} else {
			const uniqueCurrentNotes = [...new Set(currentNotes)];
			const uniqueExpectedNotes = [...new Set(expectedNotes)];

			return (
				uniqueCurrentNotes.length === uniqueExpectedNotes.length &&
				uniqueCurrentNotes.every((note) => uniqueExpectedNotes.includes(note))
			);
		}
	}

	function handleSequentialToggle(event: Event): void {
		const target = event.target as HTMLInputElement;
		sequentialMode = target.checked;
		playedNotes = new Set();
	}

	function handleHandModeToggle(event: Event): void {
		const target = event.target as HTMLInputElement;
		handMode = target.checked;
		playedNotes = new Set();
	}

	function handleScaleModeChange(event: Event): void {
		const target = event.target as HTMLInputElement;
		scaleMode = target.value as ScaleMode;
		playedNotes = new Set();
	}
</script>

<BaseExercise
	{randomMode}
	{generateExpectedNotes}
	{generateScoreProps}
	validateNoteEvent={validateScaleNote}
	isCompleted={isScaleCompleted}
>
	{#snippet children(api: any)}
		{@const wasCompleted = exerciseCompleted}
		{@const isNowCompleted = api.completed}
		{#if isNowCompleted && !wasCompleted}
			{(exerciseCompleted = true)}
		{:else if !isNowCompleted && wasCompleted}
			{(exerciseCompleted = false)}
		{/if}

		<div class="scale-controls">
			{#if !randomMode}
				<div class="control-group">
					<label>
						<input
							type="checkbox"
							bind:checked={sequentialMode}
							onchange={handleSequentialToggle}
						/>
						In order
					</label>
				</div>
				<div class="control-group">
					<label>
						<input type="checkbox" bind:checked={handMode} onchange={handleHandModeToggle} />
						Right hand
					</label>
				</div>
				<div class="control-group">
					<label for="scaleMode">Scale mode:</label>
					<select id="scaleMode" value={scaleMode} onchange={handleScaleModeChange}>
						<option value="Maj">Major</option>
						<option value="Min">Minor</option>
					</select>
				</div>
			{/if}
		</div>
	{/snippet}
</BaseExercise>

<style>
	.scale-controls {
		display: flex;
		gap: 2rem;
		margin-bottom: 1rem;
		align-items: center;
		justify-content: center;
	}

	.control-group {
		display: flex;
		gap: 1rem;
		align-items: center;
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

	@media (max-width: 768px) {
		.scale-controls {
			flex-direction: column;
			gap: 1rem;
		}
	}
</style>
