<svelte:options runes={true} />

<script lang="ts">
	import type { ScaleMode } from '$lib/types/notes';
	import { MidiToNote } from '$lib/types/notes.constants';
	import type { MidiNote, Note, NoteEvent, ScoreProps } from '$lib/types/types';
	import BaseExercise from '../../../components/BaseExercise.svelte';
	import { page } from '$app/state';

	const description =
		'Play the scale shown, ascending and/or descending, using your MIDI keyboard. Try to follow the correct order.';
	import { generateExpectedNotesFor, type HandMode } from '$lib/scaleExercise';

	interface Props {
		randomMode: boolean;
		onComplete?: () => void;
		scaleMode?: ScaleMode;
		rootKey?: Note;
		sequentialMode?: boolean;
		handMode?: HandMode;
		progressiveHints?: boolean;
		prompt?: string;
	}

	let {
		randomMode,
		onComplete,
		scaleMode: propScaleMode,
		sequentialMode: propSequentialMode,
		handMode: propHandMode,
		rootKey: propKey,
		progressiveHints,
		prompt,
		strictMode = true
	}: Props & { strictMode?: boolean } = $props();

	// State
	let sequentialMode = $state(propSequentialMode ?? false);
	let handMode = $state(propHandMode ?? 'right');
	let scaleMode = $state(propScaleMode ?? 'Maj');
	let effectiveRootKey = $derived(propKey ?? 'C');

	let playedSequence: MidiNote[] = $state([]);
	let playedNotes: Set<MidiNote> = $state(new Set());

	// Derived
	let computedPrompt = $derived(
		`${effectiveRootKey} ${scaleMode === 'Maj' ? 'Major' : 'Minor'} Scale`
	);
	let effectivePrompt = $derived(prompt ?? computedPrompt);

	function handleParentReset(): void {
		playedSequence = [];
		playedNotes = new Set();
	}

	function validateScaleNote(
		selectedNote: Note,
		event: NoteEvent,
		expectedNotes: MidiNote[],
		currentNotes: MidiNote[]
	) {
		void selectedNote;

		if (sequentialMode) {
			return validateSequential(event, expectedNotes, currentNotes);
		} else {
			return validateAnyOrder(event, expectedNotes, currentNotes);
		}
	}

	function generateExpectedNotes(selectedNote: Note): MidiNote[] {
		void selectedNote;
		// Use local state effectiveRootKey
		return generateExpectedNotesFor(effectiveRootKey, scaleMode, handMode);
	}

	function generateScoreProps(selectedNote: Note): ScoreProps {
		const expectedNotes = generateExpectedNotes(selectedNote);
		const notes = expectedNotes.map((n) => MidiToNote[n]);
		return {
			selectedNote: effectiveRootKey,
			leftHand: handMode === 'left' || handMode === 'both' ? [notes] : [],
			rightHand: handMode === 'right' || handMode === 'both' ? [notes] : []
		} as ScoreProps;
	}

	function validateSequential(
		event: NoteEvent,
		expectedNotes: MidiNote[],
		currentNotes: MidiNote[]
	): { isCorrect: boolean; message: string; collected: boolean; resetCollected: boolean } {
		void currentNotes;

		const nextExpectedIndex = playedSequence.length;
		const expectedNote = expectedNotes[nextExpectedIndex];

		let collected: boolean = false;
		// strictMode check
		const matches = strictMode
			? event.noteNumber === expectedNote
			: event.noteNumber % 12 === expectedNote % 12;

		if (matches) {
			// Track what was actively played for sequence logic
			playedSequence = [...playedSequence, event.noteNumber];
			playedNotes = new Set([...playedNotes, event.noteNumber]);
			collected = true;
		} else {
			const expectedNoteName = MidiToNote[expectedNote]?.slice(0, -1) ?? String(expectedNote);
			playedSequence = [];
			playedNotes = new Set();
			return {
				isCorrect: false,
				message: `Wrong note! Expected ${expectedNoteName} ${strictMode ? '' : '(any octave)'}`,
				collected: false,
				resetCollected: true
			};
		}

		if (playedSequence.length === expectedNotes.length) {
			return {
				isCorrect: true,
				message: 'Perfect scale! 🎵✨',
				collected: true,
				resetCollected: false
			};
		} else {
			return {
				isCorrect: true,
				message: `Good! Note ${nextExpectedIndex + 1}/${expectedNotes.length}`,
				collected: true,
				resetCollected: false
			};
		}
	}

	function validateAnyOrder(
		event: NoteEvent,
		expectedNotes: MidiNote[],
		currentNotes: MidiNote[]
	): { isCorrect: boolean; message: string; collected: boolean; resetCollected: boolean } {
		void currentNotes;

		const expectedClasses = expectedNotes.map((n) => n % 12);
		const playedClass = event.noteNumber % 12;

		const isExpected = strictMode
			? expectedNotes.includes(event.noteNumber)
			: expectedClasses.includes(playedClass);

		if (isExpected) {
			// Use a fresh Set to ensure reactivity when notes are added
			playedNotes = new Set([...playedNotes, event.noteNumber]);

			// Check completion based on strict/lenient
			let isComplete = false;
			if (strictMode) {
				isComplete = playedNotes.size === expectedNotes.length;
			} else {
				// In lenient mode, check if we have collected all REQUIRED PITCH CLASSES
				const collectedClasses = new Set([...playedNotes].map((n) => n % 12));
				const requiredClasses = new Set(expectedClasses);
				isComplete = collectedClasses.size === requiredClasses.size;
			}

			if (isComplete) {
				return {
					isCorrect: true,
					message: 'Perfect scale! 🎵',
					collected: true, // simplified logic, effectively we collected it
					resetCollected: false
				};
			} else {
				return {
					isCorrect: true,
					message: `Good! ${playedNotes.size}/${expectedNotes.length} notes`,
					collected: true,
					resetCollected: false
				};
			}
		} else {
			playedNotes = new Set();
			return { isCorrect: false, message: 'Wrong note!', resetCollected: true, collected: false };
		}
	}

	function isScaleCompleted(currentNotes: MidiNote[], expectedNotes: MidiNote[]): boolean {
		if (sequentialMode) {
			return (
				playedSequence.length === expectedNotes.length &&
				playedSequence.every((note, index) => {
					return strictMode
						? note === expectedNotes[index]
						: note % 12 === expectedNotes[index] % 12;
				})
			);
		} else {
			if (strictMode) {
				const uniqueExpectedNotes = [...new Set(expectedNotes)];
				return playedNotes.size === uniqueExpectedNotes.length;
			} else {
				const collectedClasses = new Set([...playedNotes].map((n) => n % 12));
				const requiredClasses = new Set(expectedNotes.map((n) => n % 12));
				return collectedClasses.size === requiredClasses.size;
			}
		}
	}

	function handleSequentialToggle(event: Event): void {
		const target = event.target as HTMLInputElement;
		sequentialMode = target.checked;
		playedNotes = new Set();
		playedSequence = [];
	}

	function handleHandModeChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		handMode = target.value as HandMode;
		playedNotes = new Set();
		playedSequence = [];
	}

	function handleScaleModeChange(event: Event): void {
		const target = event.target as HTMLInputElement;
		scaleMode = target.value as ScaleMode;
		playedNotes = new Set();
		playedSequence = [];
	}
	// Prompt logic moved to top derived state
</script>

<BaseExercise
	{randomMode}
	{generateExpectedNotes}
	{generateScoreProps}
	validateNoteEvent={validateScaleNote}
	isCompleted={isScaleCompleted}
	onReset={handleParentReset}
	onComplete={onComplete ?? (() => {})}
	initialNote={effectiveRootKey}
	{description}
	exerciseType="scale"
	{progressiveHints}
	prompt={effectivePrompt}
	showTempoControl={true}
	timingModeLabel="Play scale on beat"
>
	{#snippet children()}
		<div class="scale-controls">
			{#if !randomMode && !page.url.searchParams.get('unitId')}
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
					<label for="handMode">Hand:</label>
					<select id="handMode" value={handMode} onchange={handleHandModeChange}>
						<option value="right">Right Hand</option>
						<option value="left">Left Hand</option>
						<option value="both">Both Hands</option>
					</select>
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
