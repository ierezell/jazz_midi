<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Piano, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-svelte';
	import { midiManager } from '$lib/MIDIManager';

	let midiState = $state<{ inputs: any[]; outputs: any[] }>({ inputs: [], outputs: [] });
	let showHelp = $state(false);

	let isConnected = $derived(midiState.inputs.length > 0);

	let unsubscribe: () => void;

	onMount(() => {
		unsubscribe = midiManager.midiState.subscribe((state) => {
			if (state) {
				midiState = state;
			}
		});
	});

	onDestroy(() => {
		if (unsubscribe) unsubscribe();
	});
</script>

<button
	class="midi-pill"
	class:connected={isConnected}
	onclick={() => (showHelp = !showHelp)}
	title={isConnected ? 'MIDI Connected' : 'No MIDI Device Found'}
>
	{#if isConnected}
		<CheckCircle2 size={16} class="icon-success" />
		<span class="label">MIDI Ready</span>
	{:else}
		<AlertCircle size={16} class="icon-warn" />
		<span class="label">No MIDI</span>
	{/if}
</button>

{#if showHelp}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="modal-backdrop" onclick={() => (showHelp = false)}>
		<div class="modal-content" onclick={(e) => e.stopPropagation()}>
			<div class="modal-header">
				<Piano size={28} class="text-primary" />
				<h3>MIDI Setup</h3>
			</div>

			<div class="status-section">
				<div class="status-row">
					<span class="status-label">Status:</span>
					{#if isConnected}
						<span class="status-value success">Active</span>
					{:else}
						<span class="status-value error">Disconnected</span>
					{/if}
				</div>
				{#if isConnected}
					<div class="device-list">
						<p>Connected Devices:</p>
						<ul>
							{#each midiState.inputs as input}
								<li>🎹 {input.name}</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>

			<div class="troubleshoot-steps">
				<h4>Troubleshooting</h4>
				<ol>
					<li>Ensure your keyboard is plugged in via USB.</li>
					<li>Refresh this page (F5).</li>
					<li>Use Chrome or Edge (MIDI is not supported on Firefox).</li>
					<li>Check if "Generic MIDI Device" appears in your OS settings.</li>
				</ol>
			</div>

			<button class="close-btn" onclick={() => (showHelp = false)}>Got it</button>
		</div>
	</div>
{/if}

<style>
	.midi-pill {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.4rem 0.8rem;
		border-radius: 20px;
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		border: 1px solid var(--color-border);
		background: var(--color-surface);
		transition: all 0.2s;
	}

	.midi-pill:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.midi-pill.connected {
		background: rgba(34, 197, 94, 0.1);
		border-color: rgba(34, 197, 94, 0.3);
		color: var(--color-success);
	}

	.midi-pill:not(.connected) {
		background: rgba(239, 68, 68, 0.1);
		border-color: rgba(239, 68, 68, 0.3);
		color: var(--color-error);
	}

	.label {
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* Modal Styles */
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 200;
	}

	.modal-content {
		width: 90%;
		max-width: 400px;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 16px;
		padding: 2rem;
		box-shadow: var(--shadow-lg);
	}

	.modal-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 2rem;
		color: var(--color-text);
	}

	.modal-header h3 {
		margin: 0;
		font-size: 1.5rem;
	}

	.status-section {
		background: var(--color-surface-raised);
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 1.5rem;
		border: 1px solid var(--color-border);
	}

	.status-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.status-value.success {
		color: var(--color-success);
		font-weight: bold;
	}

	.status-value.error {
		color: var(--color-error);
		font-weight: bold;
	}

	.device-list p {
		margin: 0.5rem 0;
		font-size: 0.9rem;
		color: var(--color-text-muted);
	}

	.device-list ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.device-list li {
		font-family: monospace;
		padding: 0.25rem 0;
		color: var(--color-text);
	}

	.troubleshoot-steps {
		margin-bottom: 2rem;
	}

	.troubleshoot-steps h4 {
		margin: 0 0 1rem 0;
		color: var(--color-text);
	}

	.troubleshoot-steps ol {
		padding-left: 1.5rem;
		color: var(--color-text-muted);
		font-size: 0.95rem;
		line-height: 1.6;
	}

	.close-btn {
		width: 100%;
		padding: 1rem;
		border-radius: 8px;
		background: var(--color-primary);
		color: #000;
		font-weight: bold;
		border: none;
		cursor: pointer;
		font-size: 1rem;
		transition: transform 0.2s;
	}

	.close-btn:hover {
		transform: scale(1.02);
	}
</style>
