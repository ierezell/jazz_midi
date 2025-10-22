<svelte:options runes={true} />

<script lang="ts">
	import { AllNotes, MidiToNote, NoteToMidi, DEFAULT_OCTAVE } from '$lib/types/notes.constants';
	import type { MidiNote, Note, NoteEvent, NoteFullName, ScoreProps } from '$lib/types/types';
	import BaseExercise from '../../../components/BaseExercise.svelte';

	const description =
		'Identify and play the note name shown. Use either English or Latin notation.';

	// Note name mappings between English and Latin (Solfège)
	const ENGLISH_TO_LATIN: Record<Note, string> = {
		C: 'Do',
		'C#': 'Do#',
		Db: 'Reb',
		D: 'Re',
		'D#': 'Re#',
		Eb: 'Mib',
		E: 'Mi',
		F: 'Fa',
		'F#': 'Fa#',
		Gb: 'Solb',
		G: 'Sol',
		'G#': 'Sol#',
		Ab: 'Lab',
		A: 'La',
		'A#': 'La#',
		Bb: 'Sib',
		B: 'Si'
	};

	const LATIN_TO_ENGLISH: Record<string, Note> = {
		Do: 'C',
		'Do#': 'C#',
		Reb: 'Db',
		Re: 'D',
		'Re#': 'D#',
		Mib: 'Eb',
		Mi: 'E',
		Fa: 'F',
		'Fa#': 'F#',
		Solb: 'Gb',
		Sol: 'G',
		'Sol#': 'G#',
		Lab: 'Ab',
		La: 'A',
		'La#': 'A#',
		Sib: 'Bb',
		Si: 'B'
	};

	const ALL_LATIN_NOTES = Object.values(ENGLISH_TO_LATIN);

	interface Props {
		randomMode: boolean;
		onComplete?: () => void;
		rootKey?: Note;
		englishToLatin?: boolean;
	}

	let {
		randomMode,
		onComplete,
		englishToLatin: propEnglishToLatin,
		rootKey: propKey
	}: Props = $props();

	let englishToLatin: boolean = $state(propEnglishToLatin ?? true);
	let currentDisplayNote: string = $state('');
	let currentTargetNote: Note = $state('C');
	let playedCorrectly = $state(false);
	let exerciseCompleted = $state(false);

	function handleParentReset(): void {
		playedCorrectly = false;
		exerciseCompleted = false;
		generateNewNote();
	}

	$effect(() => {
		if (exerciseCompleted && onComplete) {
			onComplete();
		}
	});

	function generateNewNote(): void {
		// Generate a random note for the exercise
		const randomNote = AllNotes[Math.floor(Math.random() * AllNotes.length)];
		currentTargetNote = randomNote;

		if (englishToLatin) {
			// Show English note, expect Latin equivalent
			currentDisplayNote = randomNote;
		} else {
			// Show Latin note, expect English equivalent
			const latinNote = ENGLISH_TO_LATIN[randomNote];
			currentDisplayNote = latinNote;
		}
		playedCorrectly = false;
	}

	function generateExpectedNotes(selectedNote: Note): MidiNote[] {
		// For this exercise, we use our own random currentTargetNote instead of selectedNote
		const rootNoteName = (currentTargetNote + DEFAULT_OCTAVE) as NoteFullName;
		const rootMidi = NoteToMidi[rootNoteName];

		console.debug(
			`Note name exercise: ${currentDisplayNote} -> ${currentTargetNote}`,
			`Expected MIDI: ${rootMidi}`
		);
		return [rootMidi];
	}

	function generateScoreProps(selectedNote: Note): ScoreProps {
		const expectedNotes = generateExpectedNotes(selectedNote);
		const noteNames = expectedNotes.map((midi) => MidiToNote[midi]);
		// Show the expected note in the right hand
		const rightNotes = noteNames.map((note) => [note]);
		const leftNotes: NoteFullName[][] = [];
		return {
			selectedNote,
			leftHand: leftNotes,
			rightHand: rightNotes
		};
	}

	function validateNoteName(
		selectedNote: Note,
		event: NoteEvent,
		expectedNotes: MidiNote[],
		currentNotes: MidiNote[]
	): { isCorrect: boolean; message: string; collected: boolean; resetCollected: boolean } {
		if (expectedNotes.includes(event.noteNumber)) {
			playedCorrectly = true;
			const sourceNotation = englishToLatin ? 'English' : 'Latin';
			const targetNotation = englishToLatin ? 'Latin' : 'English';
			const correctAnswer = englishToLatin
				? ENGLISH_TO_LATIN[currentTargetNote]
				: currentTargetNote;
			return {
				isCorrect: true,
				message: `Perfect! ${currentDisplayNote} (${sourceNotation}) = ${correctAnswer} (${targetNotation}) 🎵✨`,
				collected: true,
				resetCollected: false
			};
		} else {
			const playedNoteName = MidiToNote[event.noteNumber]?.slice(0, -1) as Note;
			const correctAnswer = englishToLatin
				? ENGLISH_TO_LATIN[currentTargetNote]
				: currentTargetNote;
			return {
				isCorrect: false,
				message: `Wrong! You played ${playedNoteName}. ${currentDisplayNote} = ${correctAnswer}`,
				collected: false,
				resetCollected: true
			};
		}
	}

	function isNoteNameCompleted(currentNotes: MidiNote[], expectedNotes: MidiNote[]): boolean {
		return playedCorrectly;
	}

	function handleDirectionToggle(event: Event): void {
		const target = event.target as HTMLInputElement;
		englishToLatin = target.checked;
		generateNewNote();
	}

	function handleNextNote(): void {
		// Generate a new random note for the next exercise
		playedCorrectly = false;
		exerciseCompleted = false;
		generateNewNote();
	}

	// Initialize with first note
	$effect(() => {
		if (!currentDisplayNote) {
			generateNewNote();
		}
	});
</script>

<BaseExercise
	{randomMode}
	{generateExpectedNotes}
	{generateScoreProps}
	validateNoteEvent={validateNoteName}
	isCompleted={isNoteNameCompleted}
	onReset={handleParentReset}
	onComplete={onComplete ?? (() => {})}
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

		<div class="note-name-exercise">
			<div class="exercise-info">
				<h2>Note Name Translation</h2>
				<p class="instruction">
					{#if englishToLatin}
						Play the Latin (Solfège) equivalent of this English note:
					{:else}
						Play the English equivalent of this Latin (Solfège) note:
					{/if}
				</p>
			</div>

			<div class="note-display">
				<div class="note-card">
					<span class="note-name">{currentDisplayNote}</span>
					<span class="notation-type">
						{englishToLatin ? 'English' : 'Latin (Solfège)'}
					</span>
				</div>

				{#if playedCorrectly}
					<div class="answer-display">
						<span class="arrow">→</span>
						<div class="note-card correct">
							<span class="note-name">
								{englishToLatin ? ENGLISH_TO_LATIN[currentTargetNote] : currentTargetNote}
							</span>
							<span class="notation-type">
								{englishToLatin ? 'Latin (Solfège)' : 'English'}
							</span>
						</div>
					</div>
				{/if}
			</div>

			{#if !randomMode}
				<div class="note-controls">
					<div class="control-group">
						<label>
							<input
								type="checkbox"
								bind:checked={englishToLatin}
								onchange={handleDirectionToggle}
							/>
							English → Latin
						</label>
					</div>

					{#if playedCorrectly}
						<button class="next-note-btn" onclick={handleNextNote}> Next Note </button>
					{/if}
				</div>
			{/if}
		</div>
	{/snippet}
</BaseExercise>

<style>
	.note-name-exercise {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		align-items: center;
		padding: 1rem;
	}

	.exercise-info {
		text-align: center;
	}

	.exercise-info h2 {
		margin: 0 0 0.5rem 0;
		color: var(--color-text, #333);
		font-size: 1.5rem;
	}

	.instruction {
		margin: 0;
		color: var(--color-text-secondary, #666);
		font-size: 1.1rem;
	}

	.note-display {
		display: flex;
		align-items: center;
		gap: 2rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.note-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem 3rem;
		border: 3px solid var(--color-border, #ddd);
		border-radius: 1rem;
		background: var(--color-bg, white);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		min-width: 120px;
	}

	.note-card.correct {
		border-color: var(--color-success, #4caf50);
		background: var(--color-success-light, #e8f5e8);
		animation: bounce 0.6s ease;
	}

	.note-name {
		font-size: 3rem;
		font-weight: bold;
		color: var(--color-text, #333);
		margin-bottom: 0.5rem;
	}

	.notation-type {
		font-size: 0.9rem;
		color: var(--color-text-secondary, #666);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.answer-display {
		display: flex;
		align-items: center;
		gap: 1rem;
		animation: slideIn 0.5s ease;
	}

	.arrow {
		font-size: 2rem;
		color: var(--color-primary, #3498db);
		font-weight: bold;
	}

	.note-controls {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
	}

	.control-group {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.next-note-btn {
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		font-weight: bold;
		color: white;
		background: var(--color-primary, #3498db);
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.next-note-btn:hover {
		background: var(--color-primary-dark, #2980b9);
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
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

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateX(-20px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@media (max-width: 768px) {
		.note-name-exercise {
			padding: 0.5rem;
			gap: 1.5rem;
		}

		.note-display {
			flex-direction: column;
			gap: 1rem;
		}

		.note-card {
			padding: 1.5rem 2rem;
			min-width: 100px;
		}

		.note-name {
			font-size: 2.5rem;
		}

		.exercise-info h2 {
			font-size: 1.3rem;
		}

		.instruction {
			font-size: 1rem;
		}

		.answer-display {
			flex-direction: column;
			gap: 0.5rem;
		}

		.arrow {
			transform: rotate(90deg);
			font-size: 1.5rem;
		}
	}

	@media (max-width: 480px) {
		.note-card {
			padding: 1rem 1.5rem;
			min-width: 80px;
		}

		.note-name {
			font-size: 2rem;
		}
	}
</style>
