<svelte:options runes={true} />

<script lang="ts">
	import type { MidiNote, Note, NoteEvent, NoteFullName, ScoreProps } from '$lib/types/types';
	import type { ValidationResult } from '$lib/types/exercise-api';
	import { NoteToMidi, MidiToNote } from '$lib/types/notes.constants';
	import BaseExercise from '../../../components/BaseExercise.svelte';

	const description =
		'Practice the boogie-woogie rhythm pattern. Left hand plays the walking bass line, right hand plays C6 chord on beats 1 and the & of 3.';

	interface Props {
		randomMode?: boolean;
		onComplete?: () => void;
		rootKey?: Note;
	}

	let { randomMode = false, onComplete, rootKey: propKey = 'C' }: Props = $props();

	// Boogie bass pattern in C: C, A, C, G, C, A, G
	// Beat positions: 1, &, 2, &, 3, &, 4
	// Right hand C6 chord: on 1 and &3

	let currentBeat = $state(0); // 0-7 for 8 eighth notes in 4/4
	let playedNotes: Set<MidiNote> = $state(new Set());
	let lastTickTime = $state(0);
	let currentKey: Note = $state(propKey);

	// Bass pattern notes relative to root (in semitones)
	const bassPattern = [0, 9, 0, 7, 0, 9, 7]; // C, A, C, G, C, A, G
	const bassPositions = [0, 1, 2, 3, 4, 5, 6]; // Which eighth note positions

	// Right hand plays C6 on positions 0 (beat 1) and 5 (& of 3)
	const chordPositions = [0, 5];

	function getBassNoteForBeat(beat: number): MidiNote | null {
		const index = bassPositions.indexOf(beat);
		if (index === -1) return null;

		const rootMidi = NoteToMidi[(currentKey + '2') as NoteFullName]; // C2 for bass
		return (rootMidi + bassPattern[index]) as MidiNote;
	}

	function getChordNotesForBeat(beat: number): MidiNote[] {
		if (!chordPositions.includes(beat)) return [];

		// C6 chord: C, E, G, A (root, 3rd, 5th, 6th)
		const rootMidi = NoteToMidi[(currentKey + '4') as NoteFullName];
		return [
			rootMidi,
			(rootMidi + 4) as MidiNote, // E
			(rootMidi + 7) as MidiNote, // G
			(rootMidi + 9) as MidiNote // A
		];
	}

	function handleParentReset(): void {
		currentBeat = 0;
		playedNotes = new Set();
	}

	function generateExpectedNotes(selectedNote: Note): MidiNote[] {
		const bassNote = getBassNoteForBeat(currentBeat);
		const chordNotes = getChordNotesForBeat(currentBeat);

		const expected: MidiNote[] = [];
		if (bassNote !== null) expected.push(bassNote);
		expected.push(...chordNotes);

		return expected;
	}

	function validateNoteEvent(
		selectedNote: Note,
		event: NoteEvent,
		expectedNotes: ReadonlyArray<MidiNote>
	): ValidationResult {
		if (expectedNotes.includes(event.noteNumber)) {
			playedNotes = new Set([...playedNotes, event.noteNumber]);

			// Check if we've played all expected notes for this beat
			const allPlayed = expectedNotes.every((note) => playedNotes.has(note));

			if (allPlayed) {
				return {
					isCorrect: true,
					message: `Perfect! Beat ${Math.floor(currentBeat / 2) + 1}${currentBeat % 2 === 1 ? ' &' : ''}`,
					collected: true,
					resetCollected: true
				};
			} else {
				return {
					isCorrect: true,
					message: `Good! ${playedNotes.size}/${expectedNotes.length} notes`,
					collected: true,
					resetCollected: false
				};
			}
		}

		const playedNoteName = MidiToNote[event.noteNumber];
		return {
			isCorrect: false,
			message: `Wrong note! Expected ${expectedNotes.map((n) => MidiToNote[n]).join(', ')}`,
			collected: false,
			resetCollected: true
		};
	}

	function generateScoreProps(selectedNote: Note): ScoreProps {
		// Generate visual representation of the pattern
		const bassNotes: NoteFullName[] = [];
		const chordNotes: NoteFullName[][] = [];

		for (let i = 0; i < bassPattern.length; i++) {
			const rootMidi = NoteToMidi[(currentKey + '2') as NoteFullName];
			bassNotes.push(MidiToNote[(rootMidi + bassPattern[i]) as MidiNote]);

			if (chordPositions.includes(i)) {
				const chordRoot = NoteToMidi[(currentKey + '4') as NoteFullName];
				chordNotes.push([
					MidiToNote[chordRoot],
					MidiToNote[(chordRoot + 4) as MidiNote],
					MidiToNote[(chordRoot + 7) as MidiNote],
					MidiToNote[(chordRoot + 9) as MidiNote]
				]);
			} else {
				chordNotes.push([]);
			}
		}

		return {
			selectedNote: currentKey,
			leftHand: bassNotes.map((note) => [note]),
			rightHand: chordNotes
		};
	}

	function isCompleted(
		currentNotes: ReadonlyArray<MidiNote>,
		expectedNotes: ReadonlyArray<MidiNote>
	): boolean {
		const allExpectedPlayed = expectedNotes.every((note) => playedNotes.has(note));

		if (allExpectedPlayed) {
			// Move to next beat
			setTimeout(() => {
				currentBeat = (currentBeat + 1) % 8; // Loop through 8 eighth notes
				playedNotes = new Set();
			}, 500);
		}

		// Never truly "complete" - continuous practice
		return false;
	}

	let computedPrompt = $derived(
		`Boogie Pattern - Beat ${Math.floor(currentBeat / 2) + 1}${currentBeat % 2 === 1 ? ' &' : ''}`
	);
</script>

<BaseExercise
	randomMode={false}
	{generateExpectedNotes}
	{generateScoreProps}
	{validateNoteEvent}
	{isCompleted}
	onReset={handleParentReset}
	onComplete={onComplete ?? (() => {})}
	initialNote={currentKey}
	{description}
	exerciseType="rhythm"
	showTempoControl={true}
	showTrainingControl={false}
	prompt={computedPrompt}
>
	{#snippet children(api: import('$lib/types/exercise-api').ExerciseAPI)}
		<div class="boogie-content">
			<div class="pattern-guide">
				<h3>Boogie-Woogie Pattern in {currentKey}</h3>
				<div class="pattern-breakdown">
					<div class="hand-section">
						<h4>Left Hand (Bass)</h4>
						<div class="pattern-beats">
							{#each bassPattern as semitones, i}
								{@const rootMidi = NoteToMidi[(currentKey + '2') as NoteFullName]}
								{@const noteName = MidiToNote[(rootMidi + semitones) as MidiNote].slice(0, -1)}
								<div class="beat-box" class:current={currentBeat === i}>
									<div class="beat-label">
										{Math.floor(i / 2) + 1}{i % 2 === 1 ? '&' : ''}
									</div>
									<div class="note-label">{noteName}</div>
								</div>
							{/each}
						</div>
					</div>

					<div class="hand-section">
						<h4>Right Hand (C6 Chord)</h4>
						<div class="pattern-beats">
							{#each [0, 1, 2, 3, 4, 5, 6, 7] as beatNum}
								<div class="beat-box" class:current={currentBeat === beatNum}>
									<div class="beat-label">
										{Math.floor(beatNum / 2) + 1}{beatNum % 2 === 1 ? '&' : ''}
									</div>
									<div class="note-label">
										{chordPositions.includes(beatNum) ? 'C6' : '-'}
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<div class="tips">
					<p>💡 <strong>Tip:</strong> Use the metronome to keep steady eighth notes!</p>
					<p>🎹 Left hand plays walking bass, right hand accents on 1 and &3</p>
				</div>
			</div>
		</div>
	{/snippet}
</BaseExercise>

<style>
	.boogie-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 1rem;
		max-width: 900px;
		margin: 0 auto;
	}

	.pattern-guide {
		background: var(--color-surface, rgba(0, 0, 0, 0.1));
		border-radius: 12px;
		padding: 1.5rem;
		border: 2px solid var(--color-border, rgba(155, 89, 182, 0.2));
	}

	.pattern-guide h3 {
		text-align: center;
		color: var(--color-theme-1, #9b59b6);
		margin: 0 0 1.5rem 0;
		font-size: 1.5rem;
	}

	.pattern-breakdown {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.hand-section h4 {
		color: var(--color-text, inherit);
		margin: 0 0 1rem 0;
		font-size: 1.1rem;
		text-align: center;
	}

	.pattern-beats {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.beat-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		padding: 0.75rem;
		border: 2px solid var(--color-border, rgba(155, 89, 182, 0.3));
		border-radius: 8px;
		background: var(--color-bg-1, rgba(255, 255, 255, 0.05));
		min-width: 60px;
		transition: all 0.3s ease;
	}

	.beat-box.current {
		border-color: var(--color-theme-1, #9b59b6);
		background: rgba(155, 89, 182, 0.2);
		transform: scale(1.1);
		box-shadow: 0 0 15px rgba(155, 89, 182, 0.4);
	}

	.beat-label {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--color-text, inherit);
		opacity: 0.7;
	}

	.note-label {
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--color-theme-1, #9b59b6);
	}

	.tips {
		margin-top: 1.5rem;
		padding: 1rem;
		background: rgba(155, 89, 182, 0.1);
		border-radius: 8px;
		border-left: 4px solid var(--color-theme-1, #9b59b6);
	}

	.tips p {
		margin: 0.5rem 0;
		color: var(--color-text, inherit);
		line-height: 1.6;
	}

	@media (max-width: 768px) {
		.boogie-content {
			padding: 0.5rem;
		}

		.pattern-guide {
			padding: 1rem;
		}

		.pattern-beats {
			gap: 0.25rem;
		}

		.beat-box {
			min-width: 45px;
			padding: 0.5rem;
		}

		.note-label {
			font-size: 0.9rem;
		}
	}
</style>
