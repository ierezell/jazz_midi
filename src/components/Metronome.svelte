<script lang="ts">
	import { Play, Pause } from 'lucide-svelte';

	interface MetronomeProps {
		initialBpm?: number;
		onTick?: (timestamp: number, beatNumber: number, isDownbeat: boolean) => void;
	}
	let { initialBpm = 100, onTick }: MetronomeProps = $props();

	let bpm = $state(initialBpm);
	let isPlaying = $state(false);
	let swingEnabled = $state(false);
	let timeSignature = $state(4);
	let currentBeat = $state(1);

	// Web Audio scheduler state
	let audioCtx: AudioContext | null = null;
	let schedulerTimer: ReturnType<typeof setTimeout> | null = null;
	let nextBeatTime = 0;
	let scheduledBeat = 1;

	// Swing ratio: straight = 0.5, swing ≈ 0.667 (2:1 triplet feel)
	const SWING_RATIO = 2 / 3;
	const LOOKAHEAD_SEC = 0.1;
	const SCHEDULE_INTERVAL_MS = 25;

	function toggleMetronome() {
		if (isPlaying) {
			stopScheduler();
		} else {
			startScheduler();
		}
	}

	function startScheduler() {
		if (!audioCtx) audioCtx = new AudioContext();
		isPlaying = true;
		scheduledBeat = 1;
		currentBeat = 1;
		nextBeatTime = audioCtx.currentTime + 0.05;
		schedule();
	}

	function stopScheduler() {
		isPlaying = false;
		if (schedulerTimer !== null) {
			clearTimeout(schedulerTimer);
			schedulerTimer = null;
		}
		currentBeat = 1;
	}

	function schedule() {
		if (!audioCtx || !isPlaying) return;

		const secPerBeat = 60 / bpm;

		while (nextBeatTime < audioCtx.currentTime + LOOKAHEAD_SEC) {
			const isDownbeat = scheduledBeat === 1;

			// Quarter-note click
			scheduleClick(nextBeatTime, isDownbeat ? 1200 : 1000, isDownbeat ? 0.7 : 0.5);

			// Schedule the "and" subdivision click (swing or straight)
			const andOffset = swingEnabled ? secPerBeat * SWING_RATIO : secPerBeat * 0.5;
			scheduleClick(nextBeatTime + andOffset, 800, 0.25);

			// Notify on the beat
			const beatForCallback = scheduledBeat;
			const tsForCallback = nextBeatTime;
			const downbeatForCallback = isDownbeat;
			setTimeout(
				() => {
					currentBeat = beatForCallback;
					onTick?.(Math.round(tsForCallback * 1000), beatForCallback, downbeatForCallback);
				},
				Math.max(0, (tsForCallback - audioCtx!.currentTime) * 1000)
			);

			scheduledBeat = scheduledBeat >= timeSignature ? 1 : scheduledBeat + 1;
			nextBeatTime += secPerBeat;
		}

		schedulerTimer = setTimeout(() => schedule(), SCHEDULE_INTERVAL_MS);
	}

	function scheduleClick(time: number, freq: number, gain: number) {
		if (!audioCtx) return;
		const osc = audioCtx.createOscillator();
		const gainNode = audioCtx.createGain();
		osc.connect(gainNode);
		gainNode.connect(audioCtx.destination);
		osc.frequency.value = freq;
		gainNode.gain.setValueAtTime(gain, time);
		gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
		osc.start(time);
		osc.stop(time + 0.08);
	}

	function updateBpm(e: Event) {
		bpm = parseInt((e.target as HTMLInputElement).value);
		if (isPlaying) {
			stopScheduler();
			startScheduler();
		}
	}

	function toggleSwing() {
		swingEnabled = !swingEnabled;
		if (isPlaying) {
			stopScheduler();
			startScheduler();
		}
	}
</script>

<div class="metronome">
	<div class="controls">
		<button
			class="toggle-btn"
			onclick={toggleMetronome}
			class:playing={isPlaying}
			aria-label={isPlaying ? 'Stop metronome' : 'Start metronome'}
		>
			{#if isPlaying}
				<Pause size={20} />
			{:else}
				<Play size={20} />
			{/if}
		</button>

		<div class="bpm-control">
			<span class="bpm-display">{bpm} BPM</span>
			<input
				type="range"
				min="40"
				max="240"
				value={bpm}
				oninput={updateBpm}
				class="bpm-slider"
				aria-label="BPM"
			/>
		</div>

		<button
			class="swing-btn"
			class:active={swingEnabled}
			onclick={toggleSwing}
			aria-label={swingEnabled ? 'Disable swing' : 'Enable swing feel'}
			title="Swing feel (2:1 eighth note ratio)"
		>
			<span class="swing-label">♪♩ Swing</span>
		</button>
	</div>

	{#if isPlaying}
		<div class="beat-dots" aria-hidden="true">
			{#each Array(timeSignature) as _, i}
				<span class="beat-dot" class:active={currentBeat === i + 1}></span>
			{/each}
		</div>
	{/if}
</div>

<style>
	.metronome {
		background: var(--color-surface-raised);
		border: 1px solid var(--color-border);
		padding: 0.5rem 1rem;
		border-radius: 2rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.toggle-btn {
		background: none;
		border: none;
		color: var(--color-text);
		cursor: pointer;
		padding: 0.5rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.2s;
		flex-shrink: 0;
	}

	.toggle-btn:hover {
		background: var(--color-border);
	}

	.toggle-btn.playing {
		color: var(--color-success, #4caf50);
	}

	.bpm-control {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.bpm-display {
		font-size: 0.8rem;
		font-weight: bold;
		color: var(--color-text);
	}

	.bpm-slider {
		width: 90px;
		height: 4px;
		appearance: none;
		background: rgba(255, 255, 255, 0.3);
		border-radius: 2px;
		outline: none;
	}

	.bpm-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: white;
		cursor: pointer;
	}

	/* Swing button */
	.swing-btn {
		padding: 0.3rem 0.75rem;
		border-radius: 1rem;
		border: 1px solid var(--color-border);
		background: transparent;
		color: var(--color-text-muted);
		font-size: 0.75rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;
	}

	.swing-btn:hover {
		border-color: var(--color-primary);
		color: var(--color-text);
	}

	.swing-btn.active {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: #000;
	}

	.swing-label {
		letter-spacing: 0.03em;
	}

	/* Beat dots */
	.beat-dots {
		display: flex;
		justify-content: center;
		gap: 0.4rem;
		padding: 0 0.5rem;
	}

	.beat-dot {
		display: block;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-border);
		transition:
			background 0.05s ease,
			transform 0.05s ease;
	}

	.beat-dot.active {
		background: var(--color-primary);
		transform: scale(1.4);
	}
</style>
