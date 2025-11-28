<script lang="ts">
	import { Play, Pause, Settings } from 'lucide-svelte';

	let bpm = $state(120);
	let isPlaying = $state(false);
	let intervalId: number | null = null;
	let audioContext: AudioContext | null = null;

	function toggleMetronome() {
		if (isPlaying) {
			stop();
		} else {
			start();
		}
	}

	function start() {
		if (!audioContext) {
			audioContext = new AudioContext();
		}
		isPlaying = true;
		const interval = (60 / bpm) * 1000;
		playClick();
		intervalId = window.setInterval(playClick, interval);
	}

	function stop() {
		isPlaying = false;
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
	}

	function playClick() {
		if (!audioContext) return;
		const osc = audioContext.createOscillator();
		const gain = audioContext.createGain();

		osc.connect(gain);
		gain.connect(audioContext.destination);

		osc.frequency.value = 1000;
		gain.gain.value = 0.5;

		osc.start();
		gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
		osc.stop(audioContext.currentTime + 0.1);
	}

	function updateBpm(e: Event) {
		const input = e.target as HTMLInputElement;
		bpm = parseInt(input.value);
		if (isPlaying) {
			stop();
			start();
		}
	}
</script>

<div class="metronome">
	<div class="controls">
		<button class="toggle-btn" onclick={toggleMetronome} class:playing={isPlaying}>
			{#if isPlaying}
				<Pause size={20} />
			{:else}
				<Play size={20} />
			{/if}
		</button>
		<div class="bpm-control">
			<span class="bpm-display">{bpm} BPM</span>
			<input type="range" min="40" max="240" value={bpm} oninput={updateBpm} class="bpm-slider" />
		</div>
	</div>
</div>

<style>
	.metronome {
		background: rgba(0, 0, 0, 0.2);
		padding: 0.5rem 1rem;
		border-radius: 2rem;
		backdrop-filter: blur(5px);
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.toggle-btn {
		background: none;
		border: none;
		color: white;
		cursor: pointer;
		padding: 0.5rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.2s;
	}

	.toggle-btn:hover {
		background: rgba(255, 255, 255, 0.1);
	}

	.toggle-btn.playing {
		color: #4caf50;
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
		color: rgba(255, 255, 255, 0.9);
	}

	.bpm-slider {
		width: 100px;
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
</style>
