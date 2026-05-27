<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Piano, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-svelte';
	import { midiManager } from '$lib/MIDIManager';

	interface MidiDevice {
		name: string | null;
		id: string;
		[key: string]: unknown;
	}

	let midiState = $state<{ inputs: MidiDevice[]; outputs: MidiDevice[] }>({
		inputs: [],
		outputs: []
	});
	let showHelp = $state(false);
	let permissionState = $state<'unknown' | 'granted' | 'denied' | 'prompt'>('unknown');
	let retrying = $state(false);

	let isConnected = $derived(midiState.inputs.length > 0);

	let unsubscribe: () => void;

	async function checkPermission() {
		if (!navigator.permissions) return;
		try {
			const result = await navigator.permissions.query({
				name: 'midi' as PermissionName,
				sysex: false
			} as PermissionDescriptor);
			permissionState = result.state as typeof permissionState;
			result.onchange = () => {
				permissionState = result.state as typeof permissionState;
			};
		} catch {
			// Firefox doesn't support querying 'midi'
		}
	}

	async function requestMidi() {
		retrying = true;
		try {
			await midiManager.connectMIDI();
			await checkPermission();
		} finally {
			retrying = false;
		}
	}

	onMount(async () => {
		unsubscribe = midiManager.midiState.subscribe((state) => {
			if (state) {
				midiState = {
					inputs: state.inputs.map((input) => ({
						name: input.name,
						id: input.id
					})),
					outputs: state.outputs.map((output) => ({
						name: output.name,
						id: output.id
					}))
				};
			}
		});
		await checkPermission();
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
	aria-label={isConnected
		? 'MIDI Connected — click for details'
		: 'No MIDI Device Found — click for help'}
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
	<div
		class="modal-backdrop"
		role="button"
		tabindex="0"
		aria-label="Close MIDI help"
		onclick={() => (showHelp = false)}
		onkeydown={(e) => e.key === 'Enter' && (showHelp = false)}
	>
		<div
			class="modal-content"
			role="dialog"
			aria-modal="true"
			aria-label="MIDI Setup"
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
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
								<li>🎹 {input.name ?? 'Unknown Device'}</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>

			{#if permissionState === 'denied'}
				<div class="permission-blocked">
					<AlertCircle size={18} />
					<span>MIDI access is <strong>blocked</strong> in your browser settings.</span>
				</div>
			{/if}

			{#if !isConnected}
				<button class="retry-midi-btn" onclick={requestMidi} disabled={retrying}>
					<RefreshCw size={16} class={retrying ? 'spin' : ''} />
					{retrying ? 'Requesting…' : 'Grant MIDI Access'}
				</button>
			{/if}

			<div class="troubleshoot-steps">
				<h4>Troubleshooting</h4>
				<ol>
					<li>
						Plug in your MIDI keyboard via USB, then click <strong>Grant MIDI Access</strong> above.
					</li>
					<li>
						If no popup appeared: click the <strong>🔒 lock icon</strong> in the address bar →
						<em>Site permissions</em>
						→ set MIDI to <strong>Allow</strong>.
					</li>
					<li>Use Chrome or Edge — Firefox does not support Web MIDI.</li>
					<li>After changing permissions, reload this page (F5).</li>
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

	.permission-blocked {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.3);
		color: var(--color-error);
		border-radius: 8px;
		padding: 0.75rem 1rem;
		font-size: 0.85rem;
		margin-bottom: 1rem;
	}

	.retry-midi-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.75rem 1rem;
		background: var(--color-primary, #4075a6);
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		margin-bottom: 1.5rem;
		transition: opacity 0.2s;
	}

	.retry-midi-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	:global(.spin) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.close-btn {
		width: 100%;
		padding: 1rem;
		border-radius: 8px;
		background: var(--color-primary);
		color: var(--color-on-primary);
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
