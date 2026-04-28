<svelte:options runes={true} />

<script lang="ts">
	import type { MidiNote, Note, NoteEvent, NoteFullName, ScoreProps } from '$lib/types/types';
	import type { ValidationResult } from '$lib/types/exercise-api';
	import BaseExercise from '../../../components/BaseExercise.svelte';
	import { audioManager } from '$lib/AudioManager';
	import { NoteToMidi, MidiToNote } from '$lib/types/notes.constants';

	// Interval definitions with names
	const INTERVALS = [
		{ semitones: 1, name: 'Minor 2nd', quality: 'dissonant' },
		{ semitones: 2, name: 'Major 2nd', quality: 'step' },
		{ semitones: 3, name: 'Minor 3rd', quality: 'minor' },
		{ semitones: 4, name: 'Major 3rd', quality: 'major' },
		{ semitones: 5, name: 'Perfect 4th', quality: 'perfect' },
		{ semitones: 6, name: 'Tritone', quality: 'dissonant' },
		{ semitones: 7, name: 'Perfect 5th', quality: 'perfect' },
		{ semitones: 8, name: 'Minor 6th', quality: 'minor' },
		{ semitones: 9, name: 'Major 6th', quality: 'major' },
		{ semitones: 10, name: 'Minor 7th', quality: 'minor' },
		{ semitones: 11, name: 'Major 7th', quality: 'major' },
		{ semitones: 12, name: 'Octave', quality: 'perfect' }
	] as const;

	let currentInterval = $state<(typeof INTERVALS)[number] | null>(null);
	let rootNote = $state<MidiNote>(60); // C4
	let targetNote = $state<MidiNote | null>(null);
	let roundCount = $state(0);
	let correctCount = $state(0);
	let isPlayingInterval = $state(false);
	let isListening = $state(false);

	function startNewRound(selectedNote: Note) {
		// Pick random interval
		currentInterval = INTERVALS[Math.floor(Math.random() * INTERVALS.length)];

		// Set root note based on selected key, random octave between 3 and 5
		const octave = 3 + Math.floor(Math.random() * 3);
		const baseMidi = NoteToMidi[`${selectedNote}${octave}` as keyof typeof NoteToMidi];
		rootNote = baseMidi as MidiNote;
		targetNote = (rootNote + currentInterval.semitones) as MidiNote;

		isListening = false;

		// Play the interval
		playInterval();
	}

	async function playInterval() {
		if (isPlayingInterval || !currentInterval) return;
		isPlayingInterval = true;

		// Play root note
		audioManager.playNote(rootNote, 100);
		await new Promise((r) => setTimeout(r, 600));

		// Play target note
		audioManager.playNote(targetNote!, 100);
		await new Promise((r) => setTimeout(r, 600));

		// Play both together
		audioManager.playNote(rootNote, 80);
		audioManager.playNote(targetNote!, 80);

		isPlayingInterval = false;
		isListening = true;
	}

	function generateExpectedNotes(_selectedNote: Note): MidiNote[] {
		// Only return target note after interval is played
		if (targetNote && isListening) {
			return [targetNote];
		}
		return [];
	}

	function generateScoreProps(selectedNote: Note): ScoreProps {
		const notes: MidiNote[] = [];
		if (targetNote) {
			notes.push(rootNote, targetNote);
		}
		return {
			selectedNote,
			leftHand: [],
			rightHand: notes.length > 0 ? [notes.map((n) => MidiToNote[n] as NoteFullName)] : []
		};
	}

	function validateNoteEvent(
		selectedNote: Note,
		event: NoteEvent,
		_expectedNotes: ReadonlyArray<MidiNote>,
		_currentNotes: ReadonlyArray<MidiNote>
	): ValidationResult {
		if (!isListening || !targetNote) {
			return {
				isCorrect: false,
				message: 'Wait for the interval to play!',
				collected: false,
				resetCollected: false
			};
		}

		const playedNote = event.noteNumber;

		if (playedNote === targetNote) {
			correctCount++;
			roundCount++;
			const intervalName = currentInterval?.name || 'interval';

			// Start next round after a delay
			setTimeout(() => startNewRound(selectedNote), 1000);

			return {
				isCorrect: true,
				message: `Correct! That was a ${intervalName}`,
				collected: true,
				resetCollected: false
			};
		}

		// Wrong note
		return {
			isCorrect: false,
			message: `Not quite! Try again.`,
			collected: false,
			resetCollected: false
		};
	}

	function isCompleted(): boolean {
		return roundCount >= 10; // Complete after 10 intervals
	}

	function resetState(selectedNote: Note) {
		roundCount = 0;
		correctCount = 0;
		startNewRound(selectedNote);
	}

	let accuracy = $derived(roundCount > 0 ? Math.round((correctCount / roundCount) * 100) : 0);
</script>

<BaseExercise
	randomMode={true}
	{generateExpectedNotes}
	{generateScoreProps}
	{validateNoteEvent}
	{isCompleted}
	onReset={() => resetState('C')}
	onComplete={() => {}}
	description="Listen to the interval played by the browser, then play it back on your keyboard. Train your ear to recognize distances between notes."
	initialNote="C"
	exerciseType="interval"
	showTempoControl={false}
	showTrainingControl={false}
	prompt={isListening ? 'Play back the interval!' : isPlayingInterval ? 'Listening...' : 'Ready?'}
>
	{#snippet children(api: import('$lib/types/exercise-api').ExerciseAPI)}
		<div class="interval-content">
			<div class="controls card-premium">
				<button class="play-btn" onclick={() => playInterval()} disabled={isPlayingInterval}>
					{isPlayingInterval ? '▶ Playing...' : '▶ Hear Interval Again'}
				</button>

				{#if currentInterval}
					<div class="interval-hint" class:revealed={!isListening}>
						<span class="hint-label">Last interval:</span>
						<span class="hint-value">{currentInterval.name}</span>
					</div>
				{/if}
			</div>

			<div class="stats-grid">
				<div class="stat-card">
					<span class="stat-label">Round</span>
					<span class="stat-value">{roundCount} / 10</span>
				</div>
				<div class="stat-card">
					<span class="stat-label">Correct</span>
					<span class="stat-value success">{correctCount}</span>
				</div>
				<div class="stat-card">
					<span class="stat-label">Accuracy</span>
					<span
						class="stat-value"
						class:success={accuracy >= 70}
						class:warn={accuracy < 70 && accuracy >= 50}
					>
						{accuracy}%
					</span>
				</div>
			</div>

			{#if roundCount === 0}
				<div class="instructions card-premium">
					<h4>How to Play</h4>
					<ol>
						<li>The browser will play two notes (an interval)</li>
						<li>Listen carefully to the distance between them</li>
						<li>Play the same two notes on your keyboard</li>
						<li>Complete 10 intervals to finish</li>
					</ol>
				</div>
			{/if}
		</div>
	{/snippet}
</BaseExercise>

<style>
	.interval-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 1.5rem;
	}

	.play-btn {
		background: var(--color-primary);
		color: white;
		border: none;
		padding: 1rem 2rem;
		border-radius: 8px;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.play-btn:hover:not(:disabled) {
		transform: scale(1.05);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.play-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.interval-hint {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		opacity: 0;
		transition: opacity 0.3s;
	}

	.interval-hint.revealed {
		opacity: 1;
	}

	.hint-label {
		color: var(--color-text-muted);
		font-size: 0.9rem;
	}

	.hint-value {
		color: var(--color-success);
		font-weight: 700;
		font-size: 1.1rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	.stat-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		background: var(--color-surface-raised);
		border-radius: 8px;
		border: 1px solid var(--color-border);
	}

	.stat-label {
		font-size: 0.85rem;
		color: var(--color-text-muted);
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text);
	}

	.stat-value.success {
		color: var(--color-success);
	}

	.stat-value.warn {
		color: var(--color-warn);
	}

	.instructions {
		padding: 1.5rem;
	}

	.instructions h4 {
		margin: 0 0 1rem 0;
		color: var(--color-text);
	}

	.instructions ol {
		margin: 0;
		padding-left: 1.5rem;
		color: var(--color-text-muted);
		line-height: 1.8;
	}

	.instructions li {
		margin-bottom: 0.5rem;
	}
</style>
