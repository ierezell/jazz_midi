<svelte:options runes={true} />

<script lang="ts">
	import { AllNotes, MidiToNote, NoteToMidi, DEFAULT_OCTAVE } from '$lib/types/notes.constants';
	import type { MidiNote, Note, NoteEvent, NoteFullName, ScoreProps } from '$lib/types/types';
	import type { ValidationResult } from '$lib/types/exercise-api';
	import BaseExercise from '../../../components/exercise/BaseExercise.svelte';
	import { page } from '$app/state';
	import { untrack } from 'svelte';

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

	// Pitch class (0-11) for each note name
	const NOTE_TO_PC: Record<Note, number> = {
		C: 0,
		'C#': 1,
		Db: 1,
		D: 2,
		'D#': 3,
		Eb: 3,
		E: 4,
		F: 5,
		'F#': 6,
		Gb: 6,
		G: 7,
		'G#': 8,
		Ab: 8,
		A: 9,
		'A#': 10,
		Bb: 10,
		B: 11
	};

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

	// --- Derive target note pool from URL params ---
	// range=C4,B4  →  white keys C D E F G A B
	// includeBlackKeys=true  →  add sharps/flats
	// Falls back to all 17 note names if no range given.
	function buildTargetPool(): Note[] {
		const sp =
			typeof window !== 'undefined'
				? new URLSearchParams(window.location.search)
				: page.url.searchParams;

		const rangeParam = sp.get('range');
		const includeBlack = sp.get('includeBlackKeys') === 'true';

		if (!rangeParam) {
			// No constraint — use all notes
			return [...AllNotes];
		}

		// Parse "C4,B4" → note names in the chromatic range C–B
		const [loStr, hiStr] = rangeParam.split(',').map((s) => s.trim()) as [
			NoteFullName,
			NoteFullName
		];
		const loMidi = NoteToMidi[loStr];
		const hiMidi = NoteToMidi[hiStr];
		if (!loMidi || !hiMidi) return [...AllNotes];

		// Collect unique note names whose pitch class falls in [lo, hi] (wrapped in same octave)
		const pool: Note[] = [];
		const seen = new Set<number>();
		for (let midi = loMidi; midi <= hiMidi; midi++) {
			const fullName = MidiToNote[midi as MidiNote];
			if (!fullName) continue;
			const noteName = fullName.slice(0, -1) as Note; // strip octave digit
			const pc = midi % 12;
			if (seen.has(pc)) continue;
			// Filter black keys unless requested
			const isBlack = [1, 3, 6, 8, 10].includes(pc);
			if (isBlack && !includeBlack) continue;
			seen.add(pc);
			pool.push(noteName);
		}
		return pool.length > 0 ? pool : [...AllNotes];
	}

	// Target pitch-class set (one per note in the pool)
	const targetPool: Note[] = untrack(buildTargetPool);
	const targetPitchClasses: Set<number> = new Set(targetPool.map((n) => NOTE_TO_PC[n]));
	const totalTarget = targetPitchClasses.size;

	// @svelte-ignore state_referenced_locally
	let englishToLatin: boolean = $state(untrack(() => propEnglishToLatin ?? true));
	let currentDisplayNote: string = $state('');
	let currentTargetNote: Note = $state('C');
	let playedCorrectly = $state(false);
	let exerciseCompleted = $state(false);
	let coveredPitchClasses: Set<number> = $state(new Set());

	// Only pick from uncovered notes so the student sees variety
	function pickNextNote(): Note {
		const uncovered = targetPool.filter((n) => !coveredPitchClasses.has(NOTE_TO_PC[n]));
		const pool = uncovered.length > 0 ? uncovered : targetPool;
		return pool[Math.floor(Math.random() * pool.length)];
	}

	function handleParentReset(): void {
		playedCorrectly = false;
		exerciseCompleted = false;
		coveredPitchClasses = new Set();
		generateNewNote();
	}

	$effect(() => {
		if (exerciseCompleted && onComplete) {
			onComplete();
		}
	});

	function generateNewNote(): void {
		const randomNote = pickNextNote();
		currentTargetNote = randomNote;
		currentDisplayNote = englishToLatin ? randomNote : ENGLISH_TO_LATIN[randomNote];
		playedCorrectly = false;
	}

	function generateExpectedNotes(selectedNote: Note): MidiNote[] {
		const rootNoteName = (currentTargetNote + DEFAULT_OCTAVE) as NoteFullName;
		const rootMidi = NoteToMidi[rootNoteName];
		return [rootMidi];
	}

	function generateScoreProps(selectedNote: Note): ScoreProps {
		const expectedNotes = generateExpectedNotes(selectedNote);
		const noteNames = expectedNotes.map((midi) => MidiToNote[midi]);
		return {
			selectedNote,
			leftHand: [],
			rightHand: noteNames.map((note) => [note])
		};
	}

	function validateNoteName(
		selectedNote: Note,
		event: NoteEvent,
		expectedNotes: ReadonlyArray<MidiNote>,
		currentNotes: ReadonlyArray<MidiNote>
	): ValidationResult {
		if (expectedNotes.includes(event.noteNumber)) {
			playedCorrectly = true;
			const pc = event.noteNumber % 12;
			coveredPitchClasses = new Set([...coveredPitchClasses, pc]);
			const sourceNotation = englishToLatin ? 'English' : 'Latin';
			const targetNotation = englishToLatin ? 'Latin' : 'English';
			const correctAnswer = englishToLatin
				? ENGLISH_TO_LATIN[currentTargetNote]
				: currentTargetNote;

			setTimeout(
				() => {
					generateNewNote();
				},
				typeof window !== 'undefined' && (window as any).__dispatchMidi ? 150 : 1500
			);

			return {
				isCorrect: true,
				message: `Perfect! ${currentDisplayNote} (${sourceNotation}) = ${correctAnswer} (${targetNotation}) 🎵✨`,
				collected: true,
				resetCollected: true
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
				resetCollected: false
			};
		}
	}

	function isNoteNameCompleted(
		currentNotes: ReadonlyArray<MidiNote>,
		expectedNotes: ReadonlyArray<MidiNote>
	): boolean {
		// Done when every target pitch class has been played correctly at least once
		return (
			targetPitchClasses.size > 0 &&
			[...targetPitchClasses].every((pc) => coveredPitchClasses.has(pc))
		);
	}

	function handleDirectionToggle(event: Event): void {
		const target = event.target as HTMLInputElement;
		englishToLatin = target.checked;
		currentDisplayNote = englishToLatin ? currentTargetNote : ENGLISH_TO_LATIN[currentTargetNote];
	}

	function handleNextNote(): void {
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

<!-- Hide the score section for the Note Name exercise (not needed) -->
<BaseExercise
	randomMode={true}
	{generateExpectedNotes}
	{generateScoreProps}
	validateNoteEvent={validateNoteName}
	isCompleted={isNoteNameCompleted}
	onReset={handleParentReset}
	onComplete={onComplete ?? (() => {})}
	showScore={false}
	initialNote={propKey || 'C'}
	{description}
	exerciseType="note"
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

			<!-- Progress bar -->
			<div
				class="progress-bar-wrap"
				title="{coveredPitchClasses.size} / {totalTarget} notes covered"
			>
				<div class="progress-label">{coveredPitchClasses.size} / {totalTarget}</div>
				<div class="progress-track">
					<div
						class="progress-fill"
						style="width: {totalTarget > 0
							? Math.round((coveredPitchClasses.size / totalTarget) * 100)
							: 0}%"
					></div>
				</div>
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

			{#if !randomMode && !page.url.searchParams.get('unitId')}
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
			{:else if playedCorrectly}
				<div class="note-controls">
					<button class="next-note-btn" onclick={handleNextNote}> Next Note </button>
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

	.progress-bar-wrap {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		max-width: 320px;
	}

	.progress-label {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--color-text-muted);
		white-space: nowrap;
		min-width: 3rem;
		text-align: right;
	}

	.progress-track {
		flex: 1;
		height: 8px;
		border-radius: 4px;
		background: var(--color-border);
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		border-radius: 4px;
		background: var(--color-primary, #3b82f6);
		transition: width 0.4s ease;
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
		border: 3px solid var(--color-border);
		border-radius: 1rem;
		background: var(--color-surface);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		min-width: 120px;
	}

	.note-card.correct {
		border-color: var(--color-success, #4caf50);
		background: var(--color-surface, #e8f5e8);
		color: var(--color-text);
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
		color: var(--color-text-muted, #666);
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
		color: var(--color-on-primary);
		background: var(--color-primary);
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

	@media (orientation: landscape) and (max-height: 500px) {
		.note-name-exercise {
			flex-direction: row;
			align-items: flex-start;
			gap: 1rem;
			padding: 0.25rem;
			flex-wrap: wrap;
		}
		.note-card {
			padding: 0.75rem 1.25rem;
			min-width: 80px;
		}
		.note-name {
			font-size: 1.75rem;
		}
		.note-display {
			flex-direction: row;
			gap: 1rem;
			flex-wrap: wrap;
		}
		.answer-display {
			flex-direction: row;
		}
		.arrow {
			font-size: 1.25rem;
		}
	}
</style>
