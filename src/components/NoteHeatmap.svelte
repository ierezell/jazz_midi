<script lang="ts">
	import { MidiToNote } from '$lib/types/notes.constants';
	import type { MidiNote } from '$lib/types/types';

	interface Props {
		missedNotes: Array<{ note: string; count: number }>;
		maxCount?: number;
	}

	let { missedNotes, maxCount = 10 }: Props = $props();

	// Piano keyboard layout: White and black keys
	const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
	const blackKeys = ['C#', 'D#', '', 'F#', 'G#', 'A#', '']; // Empty strings for positions without black keys

	// Convert missed notes to a lookup map
	const missedNotesMap = $derived(
		new Map(missedNotes.map((item) => [item.note.replace(/[0-9]/g, ''), item.count]))
	);

	const maxMissedCount = $derived(maxCount || Math.max(...missedNotes.map((n) => n.count), 1));

	function getIntensity(note: string): number {
		const count = missedNotesMap.get(note) || 0;
		return count / maxMissedCount;
	}

	function getColor(note: string): string {
		const intensity = getIntensity(note);
		if (intensity === 0) return 'rgba(255, 255, 255, 0.1)';
		// Gradient from yellow to red based on intensity
		const hue = 60 - intensity * 60; // 60 (yellow) to 0 (red)
		return `hsla(${hue}, 100%, 50%, ${0.3 + intensity * 0.7})`;
	}

	function getMissCount(note: string): number {
		return missedNotesMap.get(note) || 0;
	}
</script>

<div class="heatmap-container">
	<h3>Weak Notes Heatmap</h3>
	<p class="subtitle">Darker/redder = more misses</p>

	<div class="piano-keyboard">
		<!-- Octave 1 -->
		{#each whiteKeys as note, i}
			<div
				class="white-key"
				style="background: {getColor(note)}"
				title="{note}: {getMissCount(note)} misses"
			>
				<span class="note-label">{note}</span>
				{#if getMissCount(note) > 0}
					<span class="miss-count">{getMissCount(note)}</span>
				{/if}
			</div>
		{/each}

		<!-- Black keys layer -->
		<div class="black-keys">
			{#each blackKeys as note, i}
				{#if note}
					<div
						class="black-key"
						style="background: {getColor(note)}; left: {i * 14.28 + 10}%"
						title="{note}: {getMissCount(note)} misses"
					>
						{#if getMissCount(note) > 0}
							<span class="miss-count-black">{getMissCount(note)}</span>
						{/if}
					</div>
				{/if}
			{/each}
		</div>
	</div>

	{#if missedNotes.length === 0}
		<p class="no-data">No missed notes yet! Keep practicing! 🎹</p>
	{/if}
</div>

<style>
	.heatmap-container {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 1rem;
		padding: 1.5rem;
		margin-bottom: 2rem;
	}

	h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.2rem;
		color: rgba(0, 0, 0, 0.9);
	}

	.subtitle {
		margin: 0 0 1.5rem 0;
		font-size: 0.9rem;
		color: rgba(0, 0, 0, 0.6);
	}

	.piano-keyboard {
		position: relative;
		display: flex;
		gap: 2px;
		height: 120px;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 0.5rem;
		padding: 0.5rem;
	}

	.white-key {
		flex: 1;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 0 0 0.25rem 0.25rem;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		padding: 0.25rem;
		cursor: help;
		transition: transform 0.2s;
	}

	.white-key:hover {
		transform: translateY(-5px);
		z-index: 1;
	}

	.note-label {
		font-size: 0.7rem;
		color: rgba(255, 255, 255, 0.7);
		margin-top: auto;
	}

	.miss-count {
		font-size: 1rem;
		font-weight: bold;
		color: white;
		text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
	}

	.black-keys {
		position: absolute;
		top: 0.5rem;
		left: 0.5rem;
		right: 0.5rem;
		height: 70px;
		pointer-events: none;
	}

	.black-key {
		position: absolute;
		width: 8%;
		height: 70px;
		background: rgba(0, 0, 0, 0.8);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 0 0 0.25rem 0.25rem;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding-bottom: 0.25rem;
		pointer-events: all;
		cursor: help;
		transition: transform 0.2s;
	}

	.black-key:hover {
		transform: translateY(-5px) scale(1.1);
		z-index: 2;
	}

	.miss-count-black {
		font-size: 0.8rem;
		font-weight: bold;
		color: white;
		text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
	}

	.no-data {
		text-align: center;
		color: rgba(255, 255, 255, 0.5);
		font-style: italic;
		margin-top: 1rem;
	}
</style>
