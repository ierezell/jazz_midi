<script lang="ts">
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import BaseExercise from '../../../components/BaseExercise.svelte';
	import type { Note, NoteEvent, MidiNote, ScoreProps } from '$lib/types/types';
	import type { ValidationResult } from '$lib/types/exercise-api';
	import { rhythmPatterns } from '$lib/data/rhythmPatterns';

	let bpm = $state(100);
	let isPlaying = $state(false);
	let beatCount = $state(0);
	let leftHandHits = $state(0);
	let rightHandHits = $state(0);
	let coordinatedHits = $state(0);
	let lastDiff = $state<number | null>(null);
	let feedback = $state('');
	let syncOffset = $state<number | null>(null); // Difference between LH and RH in ms
	let soloHand = $state<'none' | 'LH' | 'RH'>('none');
	let lastLhTime = 0;
	let lastRhTime = 0;
	let audioContext: AudioContext | null = null;
	let nextNoteTime = 0;
	let timerID: number | null = null;
	let lookahead = 25.0;
	let scheduleAheadTime = 0.1;
	let currentBeat = $state(0); // 0-indexed subdivision internal
	let deviations: number[] = [];
	let notesInQueue: { beat: number; time: number }[] = [];

	let selectedPatternId = $state(rhythmPatterns[0].id);
	let currentPattern = $derived(
		rhythmPatterns.find((p) => p.id === selectedPatternId) || rhythmPatterns[0]
	);

	const HIT_WINDOW = 0.15;
	const LH_SPLIT_NOTE = 60; // Middle C

	function nextNote() {
		// Subdivision is 0.25 (16th notes) for rhythm precision
		const secondsPerSubdivision = 60.0 / bpm / 4;
		nextNoteTime += secondsPerSubdivision;
		currentBeat++;

		const totalSubdivisions = currentPattern.measures * 4 * 4;
		if (currentBeat >= totalSubdivisions) {
			currentBeat = 0;
		}
	}

	function scheduleNote(beatNumber: number, time: number) {
		// We use a subdivision-based system. beatNumber is 0, 1, 2, 3... (16th notes)
		// Convert to musical beat (1-indexed)
		const musicalBeat = beatNumber / 4 + 1;
		notesInQueue.push({ beat: musicalBeat, time: time });

		if (!audioContext) return;

		// Only play metronome click on whole beats
		if (beatNumber % 4 === 0) {
			const osc = audioContext.createOscillator();
			const gain = audioContext.createGain();
			osc.connect(gain);
			gain.connect(audioContext.destination);

			const isDownbeat = (beatNumber / 4) % (parseInt(currentPattern.timeSignature[0]) || 4) === 0;
			osc.frequency.value = isDownbeat ? 880 : 440;
			gain.gain.value = 0.2;

			osc.start(time);
			osc.stop(time + 0.05);
		}
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
		void selectedNote;
		// For rhythm, we just need something to show on the keyboard if debug is on
		// But validation is custom.
		return [60 as MidiNote];
	}

	function generateScoreProps(selectedNote: Note): ScoreProps {
		void selectedNote;
		return {
			selectedNote,
			leftHand: [],
			rightHand: []
		};
	}

	function validateNoteEvent(
		selectedNote: Note,
		event: NoteEvent,
		expectedNotes: ReadonlyArray<MidiNote>,
		currentNotes: ReadonlyArray<MidiNote>
	): ValidationResult {
		void selectedNote;
		void expectedNotes;
		void currentNotes;
		if (!isPlaying || !audioContext) {
			return {
				isCorrect: false,
				message: 'Start the metronome first!',
				collected: false,
				resetCollected: false
			};
		}

		const now = audioContext.currentTime;
		notesInQueue = notesInQueue.filter((n) => n.time > now - 1.0);

		// Find the expected hit in the pattern that is closest to "now"
		let minDiff = Infinity;
		const hand = event.noteNumber < LH_SPLIT_NOTE ? 'LH' : 'RH';

		if (soloHand !== 'none' && hand !== soloHand) {
			return {
				isCorrect: false,
				message: `Focus on ${soloHand}!`,
				collected: false,
				resetCollected: false
			};
		}

		// Search for hits in the current pattern
		// Pattern hits are musical beats (1, 1.5, etc.)
		for (const queueItem of notesInQueue) {
			for (const hit of currentPattern.hits) {
				if (hit.hand !== hand) continue;

				// Calculate the time this hit was/is supposed to occur
				// diff = hit.beat - queueItem.beat
				const beatDiff = hit.beat - queueItem.beat;
				const hitTime = queueItem.time + beatDiff * (60.0 / bpm);

				const timeDiff = hitTime - now;
				if (Math.abs(timeDiff) < Math.abs(minDiff)) {
					minDiff = timeDiff;
				}
			}
		}

		const absDiff = Math.abs(minDiff);
		lastDiff = minDiff * 1000;

		if (absDiff <= HIT_WINDOW) {
			let msg = 'Perfect!';
			if (absDiff > 0.05) msg = minDiff > 0 ? 'Early' : 'Late';
			feedback = msg;
			beatCount++;
			if (hand === 'LH') {
				leftHandHits++;
			} else {
				rightHandHits++;
			}
			deviations.push(absDiff * 1000);

			// Logic for Sync Meter
			if (hand === 'LH') lastLhTime = now;
			else lastRhTime = now;

			// If both hands hit within a small window, calculate sync offset
			if (Math.abs(lastLhTime - lastRhTime) < 0.2) {
				syncOffset = (lastRhTime - lastLhTime) * 1000;
				coordinatedHits++;
			}

			return {
				isCorrect: true,
				message: `${hand}: ${msg} (${Math.round(minDiff * 1000)}ms)`,
				collected: true,
				resetCollected: true
			};
		} else {
			feedback = 'Miss';
			return {
				isCorrect: false,
				message: 'Off beat!',
				collected: false,
				resetCollected: false
			};
		}
	}

	function isCompleted(
		currentNotes: ReadonlyArray<MidiNote>,
		expectedNotes: ReadonlyArray<MidiNote>
	): boolean {
		void currentNotes;
		void expectedNotes;

		if (soloHand !== 'none') {
			return beatCount >= 32;
		}

		return beatCount >= 32 && leftHandHits >= 8 && rightHandHits >= 8 && coordinatedHits >= 8;
	}

	function onReset() {
		beatCount = 0;
		leftHandHits = 0;
		rightHandHits = 0;
		coordinatedHits = 0;
		deviations = [];
		stop();
	}

	onDestroy(() => {
		stop();
		if (audioContext) audioContext.close();
	});
</script>

<BaseExercise
	randomMode={false}
	{generateExpectedNotes}
	{generateScoreProps}
	{validateNoteEvent}
	{isCompleted}
	{onReset}
	onComplete={() => {}}
	initialNote={'C'}
	description={`Style: ${currentPattern.name}. ${currentPattern.description}`}
	showScore={false}
	showTempoControl={false}
	showTrainingControl={false}
	exerciseType="rhythm"
>
	{#snippet children(api: import('$lib/types/exercise-api').ExerciseAPI)}
		<div class="rhythm-exercise-content">
			<!-- Header Controls -->
			<div class="rhythm-header card-premium">
				<div class="pattern-selector">
					<label for="pattern-select">Musical Style</label>
					<select
						id="pattern-select"
						class="select-premium"
						bind:value={selectedPatternId}
						onchange={stop}
					>
						{#each rhythmPatterns as pattern}
							<option value={pattern.id}>{pattern.name}</option>
						{/each}
					</select>
				</div>

				<div class="rhythm-controls">
					<div class="hand-isolation">
						<span class="label" id="solo-focus-label">Solo Focus</span>
						<div class="toggle-group" role="group" aria-labelledby="solo-focus-label">
							<button class:active={soloHand === 'none'} onclick={() => (soloHand = 'none')}
								>Both</button
							>
							<button class:active={soloHand === 'LH'} onclick={() => (soloHand = 'LH')}
								>LH Only</button
							>
							<button class:active={soloHand === 'RH'} onclick={() => (soloHand = 'RH')}
								>RH Only</button
							>
						</div>
					</div>
					<button class="action-btn" onclick={togglePlay} class:playing={isPlaying}>
						{isPlaying ? 'Stop' : 'Start Metronome'}
					</button>
					<div class="bpm-input">
						<label for="bpm">BPM: {bpm}</label>
						<input id="bpm" type="range" min="40" max="200" bind:value={bpm} />
					</div>
				</div>
			</div>

			<!-- Dynamic Timeline Visualizer -->
			<div class="timeline-container card-premium">
				<div class="timeline-labels">
					<span>1</span><span>&</span><span>2</span><span>&</span>
					<span>3</span><span>&</span><span>4</span><span>&</span>
				</div>
				<div class="timeline-track">
					<!-- Subdivisions (16th notes) -->
					{#each Array(currentPattern.measures * 16) as _, i}
						{@const isWholeBeat = i % 4 === 0}
						{@const isHalfBeat = i % 2 === 0}
						<div class="subdivision-mark" class:whole={isWholeBeat} class:half={isHalfBeat}></div>
					{/each}

					<!-- Hits (Expected) -->
					<!-- Hits (Expected) - Only show when playing -->
					{#if isPlaying}
						{#each currentPattern.hits as hit}
							<div
								class="hit-marker"
								class:lh={hit.hand === 'LH'}
								class:rh={hit.hand === 'RH'}
								class:dimmed={soloHand !== 'none' && hit.hand !== soloHand}
								style="left: {((hit.beat - 1) / (currentPattern.measures * 4)) * 100}%"
								transition:fade
							>
								<span class="hit-dot"></span>
								<span class="hit-label">{hit.hand}</span>
							</div>
						{/each}
					{/if}

					<!-- Playhead -->
					{#if isPlaying}
						<div
							class="playhead"
							style="left: {(currentBeat / (currentPattern.measures * 16)) * 100}%"
						></div>
					{/if}
				</div>
			</div>

			<!-- Live Feedback Display -->
			<div class="feedback-area">
				{#if lastDiff !== null}
					<div class="timing-feedback-container">
						<div
							class="timing-feedback"
							class:perfect={Math.abs(lastDiff) < 50}
							class:near={Math.abs(lastDiff) >= 50 && Math.abs(lastDiff) < 120}
							class:miss={Math.abs(lastDiff) >= 120}
						>
							<span class="feedback-msg">{feedback}</span>
							<span class="diff-val">{lastDiff > 0 ? '+' : ''}{Math.round(lastDiff)}ms</span>
						</div>

						{#if syncOffset !== null}
							<div class="sync-meter-card card-premium">
								<span class="label">LH/RH Sync</span>
								<div class="sync-gauge">
									<div class="sync-axis"></div>
									<div class="sync-marker" style="left: {50 + (syncOffset / 100) * 50}%"></div>
								</div>
								<span class="sync-val"
									>{Math.abs(syncOffset) < 10 ? 'Locked' : `${Math.round(syncOffset)}ms`}</span
								>
							</div>
						{/if}
					</div>
				{/if}

				{#if beatCount >= 32}
					<div class="completion-cta card-premium">
						<h3>Target Reached!</h3>
						<p>
							{#if soloHand === 'none'}
								Hit target: 32 hits + balanced hands + 8 synced pairs.
							{:else}
								You've completed 32 hits. Click below to save your stats.
							{/if}
						</p>
						<button
							disabled={!isCompleted([], [])}
							class="finish-btn"
							onclick={() => {
								const avgDev =
									deviations.length > 0
										? deviations.reduce((a, b) => a + b, 0) / deviations.length
										: undefined;
								api.completeExercise({
									avgDeviationMs: avgDev,
									leftHandHits,
									rightHandHits,
									coordinatedHits
								});
							}}
						>
							Finish Exercise
						</button>
						{#if soloHand === 'none'}
							<div class="coordination-summary">
								<span>LH: {leftHandHits}</span>
								<span>RH: {rightHandHits}</span>
								<span>Synced: {coordinatedHits}</span>
							</div>
						{/if}
					</div>
				{/if}

				<div class="chord-display card-premium">
					<span class="label">Current Sequence:</span>
					<div class="chords">
						{#each currentPattern.defaultChords as chord}
							<span class="chord-tag">{chord}</span>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/snippet}
</BaseExercise>

<style>
	.rhythm-exercise-content {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		max-width: 1000px;
		margin: 0 auto;
	}

	.rhythm-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		flex-wrap: wrap;
		gap: 1.5rem;
	}

	.pattern-selector,
	.bpm-input {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.pattern-selector label,
	.bpm-input label {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--color-text-muted);
		text-transform: uppercase;
	}

	select {
		background: var(--color-surface-raised);
		border: 1px solid var(--color-border);
		color: #fff;
		padding: 0.6rem 1rem;
		border-radius: 8px;
		min-width: 200px;
	}

	.action-btn {
		padding: 0.8rem 2rem;
		border-radius: 30px;
		border: none;
		background: var(--color-primary);
		color: #000;
		font-weight: 700;
		cursor: pointer;
	}

	.action-btn.playing {
		background: var(--color-error);
		color: #fff;
	}

	/* Timeline Styles */
	.timeline-container {
		padding: 2rem;
		position: relative;
		overflow: hidden;
	}

	.timeline-labels {
		display: flex;
		justify-content: space-between;
		color: var(--color-text-muted);
		font-family: monospace;
		margin-bottom: 2rem;
		padding: 0 5%;
	}

	.timeline-track {
		height: 80px;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 12px;
		position: relative;
		display: flex;
		align-items: center;
	}

	.subdivision-mark {
		flex: 1;
		height: 8px;
		border-right: 1px solid rgba(255, 255, 255, 0.05);
	}

	.subdivision-mark.half {
		height: 16px;
		border-color: rgba(255, 255, 255, 0.1);
	}
	.subdivision-mark.whole {
		height: 32px;
		border-color: rgba(255, 255, 255, 0.2);
	}

	.hit-marker {
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 2;
		transition: opacity 0.3s ease;
	}

	.hit-marker.dimmed {
		opacity: 0.1;
		filter: grayscale(1);
	}

	.hit-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		margin-bottom: 4px;
	}

	.lh .hit-dot {
		background-color: var(--color-lh) !important;
		box-shadow: 0 0 10px var(--color-lh);
	}
	.rh .hit-dot {
		background-color: var(--color-rh) !important;
		box-shadow: 0 0 10px var(--color-rh);
	}

	.hit-label {
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--color-text-muted);
	}

	.playhead {
		position: absolute;
		top: 0;
		height: 100%;
		width: 2px;
		background: #fff;
		box-shadow: 0 0 15px #fff;
		z-index: 5;
		transition: left 0.05s linear;
	}

	/* Feedback Area */
	.feedback-area {
		display: flex;
		gap: 2rem;
		align-items: flex-start;
	}

	.timing-feedback {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		border-radius: 12px;
		background: var(--color-surface);
		border: 2px solid transparent;
		min-width: 200px;
	}

	.timing-feedback.perfect {
		border-color: var(--color-success);
		color: var(--color-success);
	}
	.timing-feedback.near {
		border-color: var(--color-warn);
		color: var(--color-warn);
	}
	.timing-feedback.miss {
		border-color: var(--color-error);
		color: var(--color-error);
	}

	.feedback-msg {
		font-size: 1.5rem;
		font-weight: 800;
	}
	.diff-val {
		font-size: 1rem;
		opacity: 0.8;
	}

	.chord-display {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.chord-display .label {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--color-text-muted);
		text-transform: uppercase;
	}

	.chords {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.chord-tag {
		padding: 0.5rem 1rem;
		background: var(--color-surface-raised);
		border-radius: 6px;
		font-weight: 700;
		color: var(--color-primary);
		border: 1px solid rgba(88, 166, 255, 0.2);
	}

	.select-premium {
		background: var(--color-surface-raised);
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		padding: 0.5rem;
		font-size: 1rem;
		min-width: 200px;
	}

	/* Completion CTA */
	.completion-cta {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		text-align: center;
		border: 2px solid var(--color-primary);
		background: var(--color-surface);
		box-shadow: var(--shadow-lg);
		animation: slideUp 0.4s ease-out;
	}

	.completion-cta h3 {
		color: var(--color-primary);
		margin-bottom: 0.5rem;
	}

	.completion-cta p {
		font-size: 0.9rem;
		color: var(--color-text-muted);
		margin-bottom: 1.5rem;
	}

	.finish-btn {
		padding: 0.75rem 2rem;
		border-radius: 8px;
		background: var(--color-primary);
		color: #000;
		font-weight: 700;
		border: none;
		cursor: pointer;
		transition: transform 0.2s;
	}

	.finish-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}

	.finish-btn:hover {
		transform: scale(1.05);
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Synchronization Meter */
	.timing-feedback-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		flex: 1;
	}

	.sync-meter-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		background: var(--color-surface);
	}

	.sync-meter-card .label {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--color-text-muted);
		text-transform: uppercase;
	}

	.sync-gauge {
		width: 100%;
		height: 20px;
		background: var(--color-surface-raised);
		border-radius: 10px;
		position: relative;
		overflow: hidden;
		border: 1px solid var(--color-border);
	}

	.sync-axis {
		position: absolute;
		left: 50%;
		top: 0;
		width: 2px;
		height: 100%;
		background: var(--color-border);
	}

	.sync-marker {
		position: absolute;
		top: 0;
		width: 4px;
		height: 100%;
		background: var(--color-success);
		box-shadow: 0 0 10px var(--color-success);
		transition: left 0.1s ease-out;
		transform: translateX(-50%);
	}

	.sync-val {
		font-size: 0.8rem;
		font-weight: 800;
		color: var(--color-success);
	}

	.coordination-summary {
		display: flex;
		gap: 1rem;
		margin-top: 0.75rem;
		font-size: 0.85rem;
		color: var(--color-text-muted);
	}

	/* Hand Isolation Toggles */
	.hand-isolation {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: center;
	}

	.hand-isolation .label {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--color-text-muted);
		text-transform: uppercase;
	}

	.toggle-group {
		display: flex;
		background: var(--color-surface-raised);
		padding: 0.25rem;
		border-radius: 30px;
		border: 1px solid var(--color-border);
	}

	.toggle-group button {
		padding: 0.4rem 1rem;
		border-radius: 25px;
		border: none;
		background: transparent;
		color: var(--color-text-muted);
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.toggle-group button.active {
		background: var(--color-primary);
		color: #000;
	}

	@media (max-width: 768px) {
		.feedback-area {
			flex-direction: column;
		}
		.timing-feedback-container,
		.chord-display {
			width: 100%;
		}
	}
</style>
