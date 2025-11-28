<svelte:options runes={true} />

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import BaseExercise from '../../../components/BaseExercise.svelte';
	import type { Note, NoteEvent, MidiNote, ScoreProps } from '$lib/types/types';
	import { NoteToMidi } from '$lib/types/notes.constants';

	let bpm = $state(60);
	let isPlaying = $state(false);
	let beatCount = $state(0);
	let lastDiff = $state<number | null>(null);
	let feedback = $state('');
	let audioContext: AudioContext | null = null;
	let nextNoteTime = 0;
	let timerID: number | null = null;
	let lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
	let scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
	let currentBeat = 0;
	let notesInQueue: { note: number; time: number }[] = [];

	// Window in seconds to accept input (e.g. +/- 0.1s)
	const HIT_WINDOW = 0.15;

	function nextNote() {
		const secondsPerBeat = 60.0 / bpm;
		nextNoteTime += secondsPerBeat;
		currentBeat++;
		if (currentBeat === 4) {
			currentBeat = 0;
		}
	}

	function scheduleNote(beatNumber: number, time: number) {
		notesInQueue.push({ note: beatNumber, time: time });

		if (!audioContext) return;
		const osc = audioContext.createOscillator();
		const gain = audioContext.createGain();
		osc.connect(gain);
		gain.connect(audioContext.destination);

		osc.frequency.value = beatNumber === 0 ? 880 : 440;
		gain.gain.value = 0.5;

		osc.start(time);
		osc.stop(time + 0.05);
	}

	function scheduler() {
		if (!audioContext) return;
		while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
			scheduleNote(currentBeat, nextNoteTime);
			nextNote();
		}
		timerID = window.setTimeout(scheduler, lookahead);
	}

	function start() {
		if (isPlaying) return;
		if (!audioContext) {
			audioContext = new AudioContext();
		}
		isPlaying = true;
		currentBeat = 0;
		nextNoteTime = audioContext.currentTime + 0.1;
		scheduler();
	}

	function stop() {
		isPlaying = false;
		if (timerID) {
			window.clearTimeout(timerID);
			timerID = null;
		}
		notesInQueue = [];
		lastDiff = null;
		feedback = '';
	}

	function togglePlay() {
		if (isPlaying) stop();
		else start();
	}

	function generateExpectedNotes(selectedNote: Note): MidiNote[] {
		// We accept any note, but BaseExercise needs something.
		// We'll return C4 just to satisfy the type, but validation will ignore it.
		return [60 as MidiNote];
	}

	function generateScoreProps(selectedNote: Note): ScoreProps {
		return {
			selectedNote,
			leftHand: [],
			rightHand: []
		};
	}

	function validateNoteEvent(
		selectedNote: Note,
		event: NoteEvent,
		expectedNotes: MidiNote[]
	): { isCorrect: boolean; message: string; collected: boolean; resetCollected: boolean } {
		if (!isPlaying || !audioContext) {
			return {
				isCorrect: false,
				message: 'Start the metronome first!',
				collected: false,
				resetCollected: false
			};
		}

		// Find the closest beat in the queue
		const now = audioContext.currentTime;
		// Filter notes that are relevant (past or near future)
		// We look for the closest scheduled note time

		// Simple approach: find the note with min abs diff
		let minDiff = Infinity;
		let closestNoteTime = 0;

		// Clean up old notes from queue
		notesInQueue = notesInQueue.filter((n) => n.time > now - 1.0);

		for (const item of notesInQueue) {
			const diff = item.time - now; // positive if future, negative if past
			if (Math.abs(diff) < Math.abs(minDiff)) {
				minDiff = diff;
				closestNoteTime = item.time;
			}
		}

		// minDiff is in seconds.
		// If minDiff is 0.05, it means user played 0.05s BEFORE the beat (since now < time) -> Wait, no.
		// diff = target - now.
		// If diff > 0, target is in future. User played EARLY.
		// If diff < 0, target is in past. User played LATE.

		const absDiff = Math.abs(minDiff);
		lastDiff = minDiff * 1000; // Convert to ms for display

		if (absDiff <= HIT_WINDOW) {
			let msg = 'Perfect!';
			if (absDiff > 0.05) msg = minDiff > 0 ? 'Early' : 'Late';

			feedback = msg;
			beatCount++;

			return {
				isCorrect: true,
				message: `${msg} (${Math.round(minDiff * 1000)}ms)`,
				collected: true,
				resetCollected: true // Reset so we don't accumulate
			};
		} else {
			feedback = 'Miss';
			return {
				isCorrect: false,
				message: `Missed! (${Math.round(minDiff * 1000)}ms)`,
				collected: false,
				resetCollected: false
			};
		}
	}

	function isCompleted(currentNotes: MidiNote[], expectedNotes: MidiNote[]): boolean {
		return false; // Endless mode for now
	}

	onDestroy(() => {
		stop();
		if (audioContext) {
			audioContext.close();
		}
	});
</script>

<BaseExercise
	randomMode={false}
	{generateExpectedNotes}
	{generateScoreProps}
	{validateNoteEvent}
	{isCompleted}
	onReset={() => {
		beatCount = 0;
		stop();
	}}
	onComplete={() => {}}
	initialNote={'C'}
	description="Play any note on the beat. Try to be as precise as possible!"
	showScore={false}
	exerciseType="rhythm"
>
	{#snippet children(api: any)}
		<div class="rhythm-container">
			<h2>Rhythm Training</h2>

			<div class="controls">
				<button class="play-btn" onclick={togglePlay} class:playing={isPlaying}>
					{isPlaying ? 'Stop' : 'Start'}
				</button>

				<div class="bpm-control">
					<label for="bpm">BPM: {bpm}</label>
					<input id="bpm" type="range" min="40" max="200" bind:value={bpm} />
				</div>
			</div>

			<div class="visualizer">
				<div class="beat-indicator" class:pulse={isPlaying && Math.abs(lastDiff || 1000) < 100}>
					🎵
				</div>
				{#if lastDiff !== null}
					<div
						class="feedback-display"
						class:success={Math.abs(lastDiff) < 50}
						class:warn={Math.abs(lastDiff) >= 50 && Math.abs(lastDiff) < 150}
						class:error={Math.abs(lastDiff) >= 150}
					>
						<span class="feedback-text">{feedback}</span>
						<span class="diff-text">{lastDiff > 0 ? '+' : ''}{Math.round(lastDiff)}ms</span>
					</div>
				{/if}
			</div>

			<div class="stats">
				<p>Hits: {beatCount}</p>
			</div>
		</div>
	{/snippet}
</BaseExercise>

<style>
	.rhythm-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		padding: 2rem;
	}

	.controls {
		display: flex;
		gap: 2rem;
		align-items: center;
	}

	.play-btn {
		padding: 1rem 2rem;
		font-size: 1.2rem;
		border-radius: 2rem;
		border: none;
		background: #4caf50;
		color: white;
		cursor: pointer;
		transition: all 0.2s;
	}

	.play-btn.playing {
		background: #f44336;
	}

	.bpm-control {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.visualizer {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		min-height: 150px;
	}

	.beat-indicator {
		font-size: 4rem;
		opacity: 0.3;
		transition: opacity 0.1s;
	}

	.beat-indicator.pulse {
		opacity: 1;
		transform: scale(1.1);
	}

	.feedback-display {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
		border-radius: 1rem;
		background: rgba(0, 0, 0, 0.1);
		min-width: 200px;
	}

	.feedback-display.success {
		color: #4caf50;
		border: 2px solid #4caf50;
	}
	.feedback-display.warn {
		color: #ff9800;
		border: 2px solid #ff9800;
	}
	.feedback-display.error {
		color: #f44336;
		border: 2px solid #f44336;
	}

	.feedback-text {
		font-size: 1.5rem;
		font-weight: bold;
	}

	.diff-text {
		font-size: 1rem;
		opacity: 0.8;
	}
</style>
