<svelte:options runes={true} />
<script lang="ts">
	import Metronome from '../Metronome.svelte';
	import AudioOutputSelector from '../AudioOutputSelector.svelte';
	import { AllNotes } from '$lib/types/notes.constants';
	import type { Note } from '$lib/types/types';

	interface Props {
		randomMode: boolean;
		selectedNote: Note;
		tempoMode: boolean;
		strictBeat: boolean;
		stopOnMistake: boolean;
		debugMode: boolean;
		showTempoControl: boolean;
		showTrainingControl: boolean;
		timingModeLabel: string;
		defaultBpm?: number;
		strictToleranceMs: number;
		normalToleranceMs: number;
		onNoteChange: (n: Note) => void;
		onTempoToggle: () => void;
		onStrictToggle: () => void;
		onStopToggle: () => void;
		onDebugToggle: () => void;
		onTick: (timestamp: number, beatNumber: number, isDownbeat: boolean) => void;
		onReset: () => void;
	}

	let {
		randomMode,
		selectedNote,
		tempoMode,
		strictBeat,
		stopOnMistake,
		debugMode,
		showTempoControl,
		showTrainingControl,
		timingModeLabel,
		defaultBpm,
		strictToleranceMs,
		normalToleranceMs,
		onNoteChange,
		onTempoToggle,
		onStrictToggle,
		onStopToggle,
		onDebugToggle,
		onTick,
		onReset
	}: Props = $props();
</script>

<aside class="sidebar glass">
	<div class="sidebar-header">
		<h3>Exercise Controls</h3>
	</div>

	<div class="sidebar-content">
		{#if !randomMode}
			<div class="control-group">
				<label for="note-select">Root Key</label>
				<select
					id="note-select"
					value={selectedNote}
					onchange={(e) => onNoteChange((e.target as HTMLSelectElement).value as Note)}
				>
					{#each AllNotes as note}
						<option value={note}>{note}</option>
					{/each}
				</select>
			</div>
		{/if}

		{#if showTempoControl}
			<div class="control-group">
				<label for="tempo-toggle">Tempo Mode</label>
				<button
					id="tempo-toggle"
					class="toggle-btn"
					class:active={tempoMode}
					onclick={onTempoToggle}
				>
					{tempoMode ? `${timingModeLabel} ✓` : timingModeLabel}
				</button>
			</div>

			{#if tempoMode}
				<div class="control-group">
					<Metronome {onTick} initialBpm={defaultBpm} />
				</div>
				<div class="control-group">
					<label for="strict-beat-toggle">Strict Beat</label>
					<button
						id="strict-beat-toggle"
						class="toggle-btn"
						class:active={strictBeat}
						onclick={onStrictToggle}
						title="Strict: ±{strictToleranceMs}ms · Normal: ±{normalToleranceMs}ms"
					>
						{strictBeat ? `±${strictToleranceMs}ms ✓` : `±${normalToleranceMs}ms`}
					</button>
				</div>
			{/if}
		{/if}

		{#if showTrainingControl}
			<div class="control-group">
				<label for="training-mode-toggle">Training Mode</label>
				<button
					id="training-mode-toggle"
					onclick={onStopToggle}
					class="toggle-btn"
					class:active={stopOnMistake}
					title="If enabled, mistakes will stop the lesson until you correct it"
				>
					{stopOnMistake ? 'Stop on Mistake' : 'Free Play'}
				</button>
			</div>
		{/if}

		<div class="control-group">
			<label for="debug-toggle">Virtual Keyboard</label>
			<button
				id="debug-toggle"
				onclick={onDebugToggle}
				class="toggle-btn"
				class:active={debugMode}
			>
				{debugMode ? 'Visible' : 'Hidden'}
			</button>
		</div>

		<AudioOutputSelector />

		<div class="sidebar-spacer"></div>

		<button onclick={onReset} class="reset-btn">Reset Session</button>
	</div>
</aside>

<style>
	.sidebar {
		max-width: 280px;
		width: 100%;
		display: flex;
		flex-direction: column;
		background: var(--glass-bg);
		backdrop-filter: var(--glass-blur);
		-webkit-backdrop-filter: var(--glass-blur);
		border: 1px solid var(--color-border);
		border-radius: 16px;
		padding: 1.5rem;
		flex-shrink: 0;
	}

	.sidebar-header h3 {
		font-size: 1.1rem;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-bottom: 2rem;
	}

	.sidebar-content {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.sidebar-spacer {
		flex: 1;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 2rem;
	}

	.control-group label {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--color-text-muted);
	}

	select,
	.toggle-btn {
		background: var(--color-surface-raised);
		border: 1px solid var(--color-border);
		color: var(--color-text);
		padding: 0.75rem;
		border-radius: 8px;
		font-size: 1rem;
		width: 100%;
		cursor: pointer;
	}

	.toggle-btn.active {
		border-color: var(--color-primary);
		background: rgba(88, 166, 255, 0.1);
		color: var(--color-primary);
	}

	.reset-btn {
		background: rgba(248, 81, 73, 0.1);
		border: 1px solid var(--color-error);
		color: var(--color-error);
		padding: 0.75rem;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		width: 100%;
	}

	@media (max-width: 1024px) {
		.sidebar {
			width: 100%;
			flex-direction: row;
			flex-wrap: wrap;
			gap: 1rem;
			max-width: none;
		}

		.sidebar-header {
			display: none;
		}

		.sidebar-content {
			flex-direction: row;
			flex-wrap: wrap;
			gap: 1rem;
			width: 100%;
		}

		.control-group {
			flex: 1;
			min-width: 150px;
			margin-bottom: 0;
		}

		.sidebar-spacer {
			display: none;
		}

		.reset-btn {
			align-self: flex-end;
		}
	}

	@media (orientation: landscape) and (max-height: 500px) {
		.sidebar {
			max-width: 180px;
			padding: 0.5rem;
			overflow-y: auto;
		}

		.sidebar-header h3 {
			font-size: 0.7rem;
			margin-bottom: 0.75rem;
		}

		.control-group {
			margin-bottom: 0.75rem;
			gap: 0.3rem;
		}

		.control-group label {
			font-size: 0.7rem;
		}

		select,
		.toggle-btn {
			padding: 0.4rem 0.5rem;
			font-size: 0.75rem;
		}

		.reset-btn {
			padding: 0.4rem 0.5rem;
			font-size: 0.75rem;
		}
	}
</style>
