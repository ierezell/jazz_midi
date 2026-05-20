<script lang="ts">
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { page } from '$app/state';
	import BaseExercise from '../../../components/exercise/BaseExercise.svelte';
	import type { Note, NoteEvent, MidiNote, ScoreProps } from '$lib/types/types';
	import type { ValidationResult } from '$lib/types/exercise-api';
	import { rhythmPatterns } from '$lib/data/rhythmPatternsData';

	// Read URL params
	const urlPatternId = page.url.searchParams.get('patternId');
	const urlBpm = Number(page.url.searchParams.get('bpm')) || 0;
	const urlHand = page.url.searchParams.get('hand') as 'LH' | 'RH' | 'both' | null;
	const isGymMode = !page.url.searchParams.get('unitId');

	let bpm = $state(urlBpm || 100);
	let isPlaying = $state(false);
	let beatCount = $state(0);
	let leftHandHits = $state(0);
	let rightHandHits = $state(0);
	let coordinatedHits = $state(0);
	let lastDiff = $state<number | null>(null);
	let feedback = $state('');
	let syncOffset = $state<number | null>(null); // Difference between LH and RH in ms

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

	let selectedPatternId = $state(
		(urlPatternId && rhythmPatterns.find((p) => p.id === urlPatternId))
			? urlPatternId
			: rhythmPatterns[0].id
	);
	let currentPattern = $derived(
		rhythmPatterns.find((p) => p.id === selectedPatternId) || rhythmPatterns[0]
	);

	// Hand mode from URL or default
	let soloHand = $state<'none' | 'LH' | 'RH'>(
		urlHand === 'LH' ? 'LH' : urlHand === 'RH' ? 'RH' : 'none'
	);

	// Completion targets: 2 full loops through the pattern per hand
	let lhTarget = $derived(Math.max(4, currentPattern.hits.filter((h) => h.hand === 'LH').length * 2));
	let rhTarget = $derived(Math.max(4, currentPattern.hits.filter((h) => h.hand === 'RH').length * 2));

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

		// Auto-start on first MIDI note (MIDI keypress is a valid user gesture)
		if (!isPlaying) {
			start();
			return {
				isCorrect: true,
				message: '🎹 Metronome started! Play on the beat.',
				collected: false,
				resetCollected: false
			};
		}

		if (!audioContext) {
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

		if (soloHand === 'LH') return leftHandHits >= lhTarget;
		if (soloHand === 'RH') return rightHandHits >= rhTarget;
		// Both hands: need hits from each
		return leftHandHits >= lhTarget && rightHandHits >= rhTarget;
	}

	function onReset() {
		beatCount = 0;
		leftHandHits = 0;
		rightHandHits = 0;
		coordinatedHits = 0;
		deviations = [];
		syncOffset = null;
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
			<!-- Controls row: gym mode only -->
			{#if isGymMode}
			<div class="rhythm-header card-premium">
				<div class="pattern-selector">
					<label for="pattern-select">Style</label>
					<select
						id="pattern-select"
						class="select-premium"
						bind:value={selectedPatternId}
						onchange={() => { stop(); onReset(); }}
					>
						{#each rhythmPatterns as pattern}
							<option value={pattern.id}>{pattern.name}</option>
						{/each}
					</select>
				</div>

				<div class="hand-isolation">
					<span class="label" id="solo-focus-label">Hand</span>
					<div class="toggle-group" role="group" aria-labelledby="solo-focus-label">
						<button class:active={soloHand === 'LH'} onclick={() => { soloHand = 'LH'; onReset(); }}>LH</button>
						<button class:active={soloHand === 'none'} onclick={() => { soloHand = 'none'; onReset(); }}>Both</button>
						<button class:active={soloHand === 'RH'} onclick={() => { soloHand = 'RH'; onReset(); }}>RH</button>
					</div>
				</div>

				<div class="bpm-input">
					<label for="bpm">BPM: {bpm}</label>
					<input id="bpm" type="range" min="40" max="200" bind:value={bpm} />
				</div>

				<button class="action-btn" onclick={togglePlay} class:playing={isPlaying}>
					{isPlaying ? '⏹ Stop' : '▶ Start'}
				</button>
			</div>
			{/if}

			<!-- How to play instruction card -->
			<div class="instruction-card card-premium">
				<div class="instruction-row">
					{#if soloHand === 'LH' || soloHand === 'none'}
						<div class="hand-guide lh-guide">
							<span class="hand-badge lh-badge">LH</span>
							<span class="hand-note">Any note <strong>below C4</strong> (e.g. C3)</span>
						</div>
					{/if}
					{#if soloHand === 'RH' || soloHand === 'none'}
						<div class="hand-guide rh-guide">
							<span class="hand-badge rh-badge">RH</span>
							<span class="hand-note">Any note <strong>C4 or above</strong> (e.g. C4)</span>
						</div>
					{/if}
					<div class="desc-text">{currentPattern.description}</div>
				</div>
				{#if !isPlaying}
					<p class="start-hint">🎹 Press any key on your MIDI keyboard to start!</p>
				{/if}
			</div>

			<!-- Timeline Visualizer: always visible so student can read the pattern -->
			<div class="timeline-container card-premium">
				<div class="beat-labels">
					{#each Array(currentPattern.measures * 4) as _, i}
						<span class="beat-label">{(i % 4) + 1}</span>
					{/each}
				</div>
				<div class="timeline-track">
					{#each Array(currentPattern.measures * 16) as _, i}
						{@const isWholeBeat = i % 4 === 0}
						{@const isHalfBeat = i % 2 === 0}
						<div class="subdivision-mark" class:whole={isWholeBeat} class:half={isHalfBeat}></div>
					{/each}

					{#each currentPattern.hits as hit}
						<div
							class="hit-marker"
							class:lh={hit.hand === 'LH'}
							class:rh={hit.hand === 'RH'}
							class:dimmed={soloHand !== 'none' && hit.hand !== soloHand}
							style="left: {((hit.beat - 1) / (currentPattern.measures * 4)) * 100}%"
						>
							<span class="hit-dot"></span>
							<span class="hit-label">{hit.hand}</span>
						</div>
					{/each}

					{#if isPlaying}
						<div
							class="playhead"
							style="left: {(currentBeat / (currentPattern.measures * 16)) * 100}%"
						></div>
					{/if}
				</div>
			</div>

			<!-- Progress + Feedback row -->
			<div class="feedback-area">
				<!-- Progress bars -->
				<div class="progress-card card-premium">
					{#if soloHand === 'LH' || soloHand === 'none'}
						<div class="progress-row">
							<span class="lh-badge-sm">LH</span>
							<div class="progress-bar">
								<div class="progress-fill lh-fill" style="width: {Math.min(100, (leftHandHits / lhTarget) * 100)}%"></div>
							</div>
							<span class="progress-count">{leftHandHits}/{lhTarget}</span>
						</div>
					{/if}
					{#if soloHand === 'RH' || soloHand === 'none'}
						<div class="progress-row">
							<span class="rh-badge-sm">RH</span>
							<div class="progress-bar">
								<div class="progress-fill rh-fill" style="width: {Math.min(100, (rightHandHits / rhTarget) * 100)}%"></div>
							</div>
							<span class="progress-count">{rightHandHits}/{rhTarget}</span>
						</div>
					{/if}
				</div>

				<!-- Timing feedback -->
				{#if lastDiff !== null}
					<div
						class="timing-feedback"
						class:perfect={Math.abs(lastDiff) < 50}
						class:near={Math.abs(lastDiff) >= 50 && Math.abs(lastDiff) < 120}
						class:miss={Math.abs(lastDiff) >= 120}
						transition:fade
					>
						<span class="feedback-msg">{feedback}</span>
						<span class="diff-val">{lastDiff > 0 ? '+' : ''}{Math.round(lastDiff)}ms</span>
					</div>
				{/if}
			</div>

			<!-- Completion CTA -->
			{#if isCompleted([], [])}
				<div class="completion-cta card-premium" transition:fade>
					<h3>🎉 Well done!</h3>
					<p>{soloHand === 'none' ? `LH: ${leftHandHits} · RH: ${rightHandHits} hits` : `${leftHandHits + rightHandHits} correct hits`}</p>
					<button
						class="finish-btn"
						onclick={() => {
							const avgDev =
								deviations.length > 0
									? deviations.reduce((a, b) => a + b, 0) / deviations.length
									: undefined;
							api.completeExercise({ avgDeviationMs: avgDev, leftHandHits, rightHandHits, coordinatedHits });
						}}
					>
						Finish Exercise
					</button>
				</div>
			{/if}

			<!-- Chord sequence -->
			<div class="chord-display card-premium">
				<span class="label">Sequence:</span>
				<div class="chords">
					{#each currentPattern.defaultChords as chord}
						<span class="chord-tag">{chord}</span>
					{/each}
				</div>
			</div>
		</div>
	{/snippet}
</BaseExercise>

<style>
	.rhythm-exercise-content {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
	}

	/* Controls row */
	.rhythm-header {
		display: flex;
		align-items: center;
		padding: 0.6rem 1rem;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.pattern-selector,
	.bpm-input {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.pattern-selector label,
	.bpm-input label {
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--color-text-muted);
		text-transform: uppercase;
	}

	select {
		background: var(--color-surface-raised);
		border: 1px solid var(--color-border);
		color: var(--color-text);
		padding: 0.4rem 0.75rem;
		border-radius: 8px;
		min-width: 160px;
		font-size: 0.9rem;
	}

	.bpm-input input[type='range'] {
		width: 100px;
	}

	.action-btn {
		padding: 0.5rem 1.25rem;
		border-radius: 20px;
		border: none;
		background: var(--color-primary);
		color: #000;
		font-weight: 700;
		cursor: pointer;
		font-size: 0.9rem;
		white-space: nowrap;
	}

	.action-btn.playing {
		background: var(--color-error);
		color: white;
	}

	/* Hand isolation */
	.hand-isolation {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		align-items: center;
	}

	.hand-isolation .label {
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--color-text-muted);
		text-transform: uppercase;
	}

	.toggle-group {
		display: flex;
		background: var(--color-surface-raised);
		padding: 0.15rem;
		border-radius: 20px;
		border: 1px solid var(--color-border);
	}

	.toggle-group button {
		padding: 0.3rem 0.7rem;
		border-radius: 18px;
		border: none;
		background: transparent;
		color: var(--color-text-muted);
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.15s;
	}

	.toggle-group button.active {
		background: var(--color-primary);
		color: #000;
	}

	/* Instruction card */
	.instruction-card {
		padding: 0.6rem 1rem;
	}

	.instruction-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
	}

	.hand-guide {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.hand-badge {
		font-size: 0.7rem;
		font-weight: 800;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
	}

	.lh-badge {
		background: var(--color-lh, #3b82f6);
		color: white;
	}

	.rh-badge {
		background: var(--color-rh, #ef4444);
		color: white;
	}

	.hand-note {
		font-size: 0.85rem;
		color: var(--color-text);
	}

	.desc-text {
		font-size: 0.8rem;
		color: var(--color-text-muted);
		flex: 1;
	}

	.start-hint {
		margin: 0.4rem 0 0;
		font-size: 0.85rem;
		color: var(--color-primary);
		font-weight: 600;
		text-align: center;
	}

	/* Timeline */
	.timeline-container {
		padding: 0.75rem 1rem;
		position: relative;
		overflow: hidden;
	}

	.beat-labels {
		display: flex;
		justify-content: space-between;
		color: var(--color-text-muted);
		font-size: 0.75rem;
		font-family: monospace;
		margin-bottom: 0.4rem;
	}

	.beat-label {
		flex: 1;
		text-align: center;
	}

	.timeline-track {
		height: 64px;
		background: var(--color-surface-raised);
		border-radius: 8px;
		position: relative;
		display: flex;
		align-items: center;
	}

	.subdivision-mark {
		flex: 1;
		height: 6px;
		border-right: 1px solid var(--color-border);
	}

	.subdivision-mark.half {
		height: 12px;
		border-color: var(--color-text-muted);
	}

	.subdivision-mark.whole {
		height: 24px;
		border-color: var(--color-text);
	}

	.hit-marker {
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 2;
	}

	.hit-marker.dimmed {
		opacity: 0.15;
	}

	.hit-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		margin-bottom: 2px;
	}

	.lh .hit-dot {
		background-color: var(--color-lh, #3b82f6);
		box-shadow: 0 0 6px var(--color-lh, #3b82f6);
	}

	.rh .hit-dot {
		background-color: var(--color-rh, #ef4444);
		box-shadow: 0 0 6px var(--color-rh, #ef4444);
	}

	.hit-label {
		font-size: 0.6rem;
		font-weight: 700;
		color: var(--color-text-muted);
	}

	.playhead {
		position: absolute;
		top: 0;
		height: 100%;
		width: 2px;
		background: var(--color-primary);
		box-shadow: 0 0 8px var(--color-primary);
		z-index: 5;
		transition: left 0.05s linear;
	}

	/* Progress + feedback row */
	.feedback-area {
		display: flex;
		gap: 0.75rem;
		align-items: stretch;
	}

	.progress-card {
		padding: 0.6rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		flex: 1;
	}

	.progress-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.lh-badge-sm {
		font-size: 0.65rem;
		font-weight: 800;
		padding: 0.1rem 0.4rem;
		border-radius: 3px;
		background: var(--color-lh, #3b82f6);
		color: white;
		min-width: 24px;
		text-align: center;
	}

	.rh-badge-sm {
		font-size: 0.65rem;
		font-weight: 800;
		padding: 0.1rem 0.4rem;
		border-radius: 3px;
		background: var(--color-rh, #ef4444);
		color: white;
		min-width: 24px;
		text-align: center;
	}

	.progress-bar {
		flex: 1;
		height: 10px;
		background: var(--color-surface-raised);
		border-radius: 5px;
		overflow: hidden;
		border: 1px solid var(--color-border);
	}

	.progress-fill {
		height: 100%;
		border-radius: 5px;
		transition: width 0.2s ease;
	}

	.lh-fill {
		background: var(--color-lh, #3b82f6);
	}

	.rh-fill {
		background: var(--color-rh, #ef4444);
	}

	.progress-count {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--color-text-muted);
		min-width: 36px;
		text-align: right;
	}

	/* Timing feedback */
	.timing-feedback {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		background: var(--color-surface);
		border: 2px solid transparent;
		min-width: 90px;
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
		font-size: 1rem;
		font-weight: 800;
	}

	.diff-val {
		font-size: 0.75rem;
		opacity: 0.8;
	}

	/* Completion */
	.completion-cta {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		text-align: center;
		border: 2px solid var(--color-primary);
	}

	.completion-cta h3 {
		color: var(--color-primary);
		margin: 0 0 0.25rem;
	}

	.completion-cta p {
		font-size: 0.85rem;
		color: var(--color-text-muted);
		margin: 0 0 0.75rem;
	}

	.finish-btn {
		padding: 0.5rem 1.5rem;
		border-radius: 8px;
		background: var(--color-primary);
		color: #000;
		font-weight: 700;
		border: none;
		cursor: pointer;
	}

	/* Chord display */
	.chord-display {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 1rem;
	}

	.chord-display .label {
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--color-text-muted);
		text-transform: uppercase;
		white-space: nowrap;
	}

	.chords {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.chord-tag {
		padding: 0.2rem 0.6rem;
		background: var(--color-surface-raised);
		border-radius: 4px;
		font-weight: 700;
		color: var(--color-primary);
		font-size: 0.85rem;
		border: 1px solid rgba(88, 166, 255, 0.2);
	}

	.select-premium {
		background: var(--color-surface-raised);
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		padding: 0.4rem 0.6rem;
		font-size: 0.9rem;
	}

	@media (max-width: 768px) {
		.feedback-area {
			flex-direction: column;
		}
	}
</style>
