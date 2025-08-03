<svelte:options runes={true} />

<script lang="ts">
	import type { ChordToneColors } from '../lib/types';
	import { DEFAULT_CHORD_TONE_COLORS } from '../lib/types';

	interface ChordToneToggleProps {
		showChordTones: boolean;
		onToggle: (show: boolean) => void;
		colors?: ChordToneColors;
	}

	let {
		showChordTones,
		onToggle,
		colors = DEFAULT_CHORD_TONE_COLORS
	}: ChordToneToggleProps = $props();

	function handleToggle() {
		onToggle(!showChordTones);
	}
</script>

<div class="chord-tone-toggle">
	<label class="toggle-container">
		<input
			type="checkbox"
			checked={showChordTones}
			onchange={handleToggle}
			aria-label="Show chord tone colors"
		/>
		<span class="toggle-switch"></span>
		<span class="toggle-label">Show Chord Tones</span>
	</label>

	{#if showChordTones}
		<div class="color-legend">
			<div class="legend-item">
				<div class="color-dot" style="background-color: {colors.root}"></div>
				<span>Root</span>
			</div>
			<div class="legend-item">
				<div class="color-dot" style="background-color: {colors.third}"></div>
				<span>Third</span>
			</div>
			<div class="legend-item">
				<div class="color-dot" style="background-color: {colors.fifth}"></div>
				<span>Fifth</span>
			</div>
			<div class="legend-item">
				<div class="color-dot" style="background-color: {colors.seventh}"></div>
				<span>Seventh</span>
			</div>
		</div>
	{/if}
</div>

<style>
	.chord-tone-toggle {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 16px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.toggle-container {
		display: flex;
		align-items: center;
		gap: 12px;
		cursor: pointer;
		user-select: none;
	}

	.toggle-container input[type='checkbox'] {
		display: none;
	}

	.toggle-switch {
		position: relative;
		width: 48px;
		height: 24px;
		background: #ccc;
		border-radius: 12px;
		transition: all 0.3s ease;
	}

	.toggle-switch::after {
		content: '';
		position: absolute;
		top: 2px;
		left: 2px;
		width: 20px;
		height: 20px;
		background: white;
		border-radius: 50%;
		transition: all 0.3s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.toggle-container input:checked + .toggle-switch {
		background: #3498db;
	}

	.toggle-container input:checked + .toggle-switch::after {
		transform: translateX(24px);
	}

	.toggle-label {
		font-weight: 500;
		color: #333;
	}

	.color-legend {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		font-size: 14px;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.color-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: 1px solid rgba(0, 0, 0, 0.3);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.legend-item span {
		color: #555;
		font-weight: 500;
	}

	/* Dark mode support */
	@media (prefers-color-scheme: dark) {
		.chord-tone-toggle {
			background: rgba(0, 0, 0, 0.3);
			border-color: rgba(255, 255, 255, 0.2);
		}

		.toggle-label,
		.legend-item span {
			color: #e0e0e0;
		}

		.color-dot {
			border-color: rgba(255, 255, 255, 0.4);
		}
	}

	/* Mobile responsiveness */
	@media (max-width: 768px) {
		.chord-tone-toggle {
			padding: 12px;
		}

		.color-legend {
			gap: 12px;
			font-size: 13px;
		}

		.toggle-switch {
			width: 40px;
			height: 20px;
		}

		.toggle-switch::after {
			width: 16px;
			height: 16px;
		}

		.toggle-container input:checked + .toggle-switch::after {
			transform: translateX(20px);
		}
	}
</style>
