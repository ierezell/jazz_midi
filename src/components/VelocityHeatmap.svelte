<script lang="ts">
	import { MidiToNote } from '$lib/types/notes.constants';
	import type { MidiNote, NoteEvent } from '$lib/types/types';

	interface Props {
		noteEvents: NoteEvent[];
	}

	let { noteEvents }: Props = $props();

	// Calculate velocity statistics per note
	const velocityStats = $derived.by(() => {
		const stats = new Map<
			MidiNote,
			{ count: number; avgVelocity: number; min: number; max: number }
		>();

		for (const event of noteEvents) {
			if (event.type !== 'on') continue;

			const existing = stats.get(event.noteNumber);
			if (existing) {
				existing.count++;
				existing.avgVelocity =
					(existing.avgVelocity * (existing.count - 1) + event.velocity) / existing.count;
				existing.min = Math.min(existing.min, event.velocity);
				existing.max = Math.max(existing.max, event.velocity);
			} else {
				stats.set(event.noteNumber, {
					count: 1,
					avgVelocity: event.velocity,
					min: event.velocity,
					max: event.velocity
				});
			}
		}

		return stats;
	});

	// Get all unique notes that were played
	const playedNotes = $derived(Array.from(velocityStats.keys()).sort((a, b) => a - b));

	// Calculate overall statistics
	const overallStats = $derived.by(() => {
		if (noteEvents.length === 0) return null;

		const velocities = noteEvents.filter((e) => e.type === 'on').map((e) => e.velocity);
		if (velocities.length === 0) return null;

		const avg = velocities.reduce((a, b) => a + b, 0) / velocities.length;
		const min = Math.min(...velocities);
		const max = Math.max(...velocities);

		// Ghost notes (velocity < 40) and accents (velocity > 80)
		const ghostNotes = velocities.filter((v) => v < 40).length;
		const accents = velocities.filter((v) => v > 80).length;

		return { avg: Math.round(avg), min, max, ghostNotes, accents, total: velocities.length };
	});

	function getColorForVelocity(velocity: number): string {
		// Blue (soft) to Red (hard) gradient
		// velocity 0 = blue, 127 = red
		const normalized = velocity / 127;
		const hue = (1 - normalized) * 240; // 240 (blue) to 0 (red)
		return `hsl(${hue}, 80%, 50%)`;
	}

	function getVelocityLabel(velocity: number): string {
		if (velocity < 30) return 'Ghost 👻';
		if (velocity < 50) return 'Soft 🎹';
		if (velocity < 70) return 'Medium';
		if (velocity < 90) return 'Strong';
		return 'Accent 💥';
	}

	function formatNoteName(note: MidiNote): string {
		return MidiToNote[note] || `Note ${note}`;
	}
</script>

<div class="velocity-heatmap">
	<h3>Velocity Heatmap</h3>
	<p class="subtitle">Blue = Soft (Ghost Notes) | Red = Hard (Accents)</p>

	{#if overallStats}
		<div class="stats-summary">
			<div class="stat-pill">
				<span class="stat-label">Average</span>
				<span class="stat-value" style="color: {getColorForVelocity(overallStats.avg)}">
					{overallStats.avg}
				</span>
			</div>
			<div class="stat-pill ghost">
				<span class="stat-label">Ghost Notes</span>
				<span class="stat-value">{overallStats.ghostNotes}</span>
			</div>
			<div class="stat-pill accent">
				<span class="stat-label">Accents</span>
				<span class="stat-value">{overallStats.accents}</span>
			</div>
		</div>

		<div class="velocity-bar-container">
			<div class="velocity-bar-labels">
				<span>Ghost (pp)</span>
				<span>Soft (p)</span>
				<span>Medium (mf)</span>
				<span>Loud (f)</span>
				<span>Accent (ff)</span>
			</div>
			<div class="velocity-gradient-bar"></div>
		</div>

		<div class="notes-list">
			{#each playedNotes as note}
				{@const stat = velocityStats.get(note)}
				{#if stat}
					<div class="note-row">
						<span class="note-name">{formatNoteName(note)}</span>
						<div class="velocity-bars">
							<div
								class="velocity-bar avg"
								style="width: {(stat.avgVelocity / 127) * 100}%; background: {getColorForVelocity(
									stat.avgVelocity
								)}"
								title="Average: {Math.round(stat.avgVelocity)}"
							>
								<span class="bar-label">Avg: {Math.round(stat.avgVelocity)}</span>
							</div>
							<div
								class="velocity-bar min"
								style="width: {(stat.min / 127) * 100}%; background: {getColorForVelocity(
									stat.min
								)}; opacity: 0.5"
								title="Min: {stat.min}"
							></div>
							<div
								class="velocity-bar max"
								style="width: {(stat.max / 127) * 100}%; background: {getColorForVelocity(
									stat.max
								)}; opacity: 0.5"
								title="Max: {stat.max}"
							></div>
						</div>
						<span class="velocity-label">{getVelocityLabel(stat.avgVelocity)}</span>
					</div>
				{/if}
			{/each}
		</div>
	{:else}
		<p class="no-data">Play some notes to see velocity analysis! 🎹</p>
	{/if}
</div>

<style>
	.velocity-heatmap {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 1rem;
		padding: 1.5rem;
		margin-bottom: 2rem;
	}

	h3 {
		margin: 0 0 0.25rem 0;
		font-size: 1.2rem;
		color: var(--color-text);
	}

	.subtitle {
		margin: 0 0 1.5rem 0;
		font-size: 0.9rem;
		color: var(--color-text-muted);
	}

	.stats-summary {
		display: flex;
		gap: 1rem;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
	}

	.stat-pill {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		padding: 0.75rem 1rem;
		background: var(--color-surface-raised);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		min-width: 80px;
	}

	.stat-label {
		font-size: 0.75rem;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.stat-value {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text);
	}

	.stat-pill.ghost {
		border-color: #60a5fa;
	}

	.stat-pill.accent {
		border-color: #f87171;
	}

	.velocity-bar-container {
		margin-bottom: 1.5rem;
	}

	.velocity-bar-labels {
		display: flex;
		justify-content: space-between;
		font-size: 0.7rem;
		color: var(--color-text-muted);
		margin-bottom: 0.25rem;
	}

	.velocity-gradient-bar {
		height: 12px;
		border-radius: 6px;
		background: linear-gradient(
			to right,
			hsl(240, 80%, 50%),
			/* Blue - soft */ hsl(180, 80%, 50%),
			/* Cyan */ hsl(120, 80%, 50%),
			/* Green */ hsl(60, 80%, 50%),
			/* Yellow */ hsl(0, 80%, 50%) /* Red - loud */
		);
	}

	.notes-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.note-row {
		display: grid;
		grid-template-columns: 80px 1fr 100px;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem;
		background: var(--color-surface-raised);
		border-radius: 8px;
	}

	.note-name {
		font-weight: 600;
		color: var(--color-text);
		font-size: 0.9rem;
	}

	.velocity-bars {
		display: flex;
		flex-direction: column;
		gap: 2px;
		height: 40px;
		justify-content: center;
	}

	.velocity-bar {
		height: 12px;
		border-radius: 3px;
		position: relative;
		transition: width 0.3s ease;
	}

	.velocity-bar.avg {
		z-index: 2;
	}

	.bar-label {
		position: absolute;
		right: 4px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 0.65rem;
		color: white;
		font-weight: 700;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
	}

	.velocity-label {
		font-size: 0.8rem;
		color: var(--color-text-muted);
		text-align: right;
	}

	.no-data {
		text-align: center;
		color: var(--color-text-muted);
		font-style: italic;
		padding: 2rem;
	}

	@media (max-width: 600px) {
		.note-row {
			grid-template-columns: 60px 1fr 80px;
			gap: 0.5rem;
		}

		.velocity-label {
			font-size: 0.7rem;
		}
	}
</style>
