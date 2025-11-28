<script lang="ts">
	import { Mic, MicOff } from 'lucide-svelte';
	import { midiManager } from '$lib/MIDIManager';

	let isEnabled = $state(false);
	let error = $state<string | null>(null);

	async function toggleMic() {
		try {
			error = null;
			isEnabled = !isEnabled;
			await midiManager.setAudioInput(isEnabled);
		} catch (e) {
			console.error(e);
			error = 'Failed to access microphone';
			isEnabled = false;
		}
	}
</script>

<div class="mic-control">
	<button
		class="mic-btn"
		class:active={isEnabled}
		class:error={!!error}
		onclick={toggleMic}
		title={error || (isEnabled ? 'Disable Microphone' : 'Enable Microphone')}
	>
		{#if isEnabled}
			<Mic size={20} />
		{:else}
			<MicOff size={20} />
		{/if}
	</button>
</div>

<style>
	.mic-btn {
		background: rgba(0, 0, 0, 0.2);
		border: none;
		color: rgba(255, 255, 255, 0.7);
		cursor: pointer;
		padding: 0.75rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
		backdrop-filter: blur(5px);
	}

	.mic-btn:hover {
		background: rgba(255, 255, 255, 0.3);
		color: white;
	}

	.mic-btn.active {
		background: #4caf50;
		color: white;
		box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
	}

	.mic-btn.error {
		background: #f44336;
		color: white;
	}
</style>
