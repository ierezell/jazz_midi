<script lang="ts">
	import { onMount } from 'svelte';
	import { audioOutputService } from '$lib/audio/AudioOutputService';

	onMount(() => {
		audioOutputService.refreshDevices();
	});
</script>

<div class="control-group">
	<label for="audio-output-select">Audio Output</label>
	{#if !audioOutputService.isSinkIdSupported}
		<p class="unsupported-note">Not supported in this browser (use Chrome/Edge)</p>
	{:else}
		<select
			id="audio-output-select"
			value={audioOutputService.selectedDeviceId}
			onchange={(e) => audioOutputService.selectDevice((e.target as HTMLSelectElement).value)}
		>
			<option value="">Default (system)</option>
			{#each audioOutputService.devices as device (device.deviceId)}
				<option value={device.deviceId}>{device.label || 'Audio Device'}</option>
			{/each}
		</select>
	{/if}
</div>

<style>
	.unsupported-note {
		font-size: 0.75rem;
		color: var(--color-text-muted);
		margin: 0;
	}
</style>
