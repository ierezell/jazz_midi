<svelte:options runes={true} />

<script lang="ts">
	import type { Note } from '$lib/types/notes';
	import { AllNotes } from '$lib/types/notes.constants';
	import type { NoteProgress } from '$lib/UserStatsService';
	import { userStatsService } from '$lib/UserStatsService';
	import { onMount } from 'svelte';
	let {
		showDetailed = false,
		exerciseType = 'all' as 'all' | 'scale' | 'chord' | 'progression'
	}: {
		showDetailed?: boolean;
		exerciseType?: 'all' | 'scale' | 'chord' | 'progression';
	} = $props();
	let userStats = $state(userStatsService.getStatistics());
	let progressData: NoteProgress[] = $state([]);
	let filteredProgress = $derived.by(() => {
		if (exerciseType === 'all') {
			return progressData;
		}
		return progressData.filter((p) => p.exerciseType === exerciseType);
	});
	let progressByNote = $derived.by(() => {
		const grouped = new Map<Note, NoteProgress[]>();
		filteredProgress.forEach((progress) => {
			if (!grouped.has(progress.note)) {
				grouped.set(progress.note, []);
			}
			grouped.get(progress.note)!.push(progress);
		});
		return grouped;
	});
	let overallProgress = $derived.by(() => {
		if (filteredProgress.length === 0) return 0;
		const totalMastery = filteredProgress.reduce((sum, p) => {
			const masteryScore = {
				beginner: 25,
				intermediate: 50,
				advanced: 75,
				mastered: 100
			}[p.masteryLevel];
			return sum + masteryScore;
		}, 0);
		return Math.round(totalMastery / filteredProgress.length);
	});
	function getMasteryColor(level: string): string {
		switch (level) {
			case 'mastered':
				return '#4caf50';
			case 'advanced':
				return '#2196f3';
			case 'intermediate':
				return '#ff9800';
			case 'beginner':
				return '#f44336';
			default:
				return '#9e9e9e';
		}
	}
	function getMasteryIcon(level: string): string {
		switch (level) {
			case 'mastered':
				return '🏆';
			case 'advanced':
				return '⭐';
			case 'intermediate':
				return '📈';
			case 'beginner':
				return '🌱';
			default:
				return '❓';
		}
	}
	function formatTime(seconds: number): string {
		if (seconds === Infinity) return 'N/A';
		if (seconds < 60) return `${seconds.toFixed(1)}s`;
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60);
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	}
	function updateStats() {
		userStats = userStatsService.getStatistics();
		progressData = Array.from(userStats.noteProgress.values());
	}
	onMount(() => {
		updateStats();
		const unsubscribe = userStatsService.subscribe(updateStats);
		return unsubscribe;
	});
</script>

<div class="stats-widget">
	<div class="stats-header">
		<h3>Progress Stats</h3>
		<div class="overall-progress">
			<div class="progress-circle" style="--progress: {overallProgress}%">
				<span class="progress-text">{overallProgress}%</span>
			</div>
		</div>
	</div>
	<div class="stats-summary">
		<div class="stat-item">
			<div class="stat-value">{userStats.totalExercises}</div>
			<div class="stat-label">Total Exercises</div>
		</div>
		<div class="stat-item">
			<div class="stat-value">{userStats.averageAccuracy.toFixed(1)}%</div>
			<div class="stat-label">Avg Accuracy</div>
		</div>
		<div class="stat-item">
			<div class="stat-value">{userStats.currentStreak}</div>
			<div class="stat-label">Current Streak</div>
		</div>
	</div>
	{#if showDetailed && filteredProgress.length > 0}
		<div class="detailed-progress">
			<h4>Progress by Note</h4>
			<div class="progress-grid">
				{#each AllNotes as note}
					{@const noteProgressList = progressByNote.get(note) || []}
					{#if noteProgressList.length > 0}
						<div class="note-progress-card">
							<div class="note-header">
								<span class="note-name">{note}</span>
							</div>
							<div class="note-exercises">
								{#each noteProgressList as progress}
									<div class="exercise-progress">
										<div class="exercise-info">
											<span class="exercise-type">
												{progress.exerciseType}
												{#if progress.chordType}
													- {progress.chordType}
												{/if}
											</span>
											<span
												class="mastery-badge"
												style="color: {getMasteryColor(progress.masteryLevel)}"
											>
												{getMasteryIcon(progress.masteryLevel)}
												{progress.masteryLevel}
											</span>
										</div>
										<div class="progress-stats">
											<div class="stat-small">
												<span class="label">Success Rate:</span>
												<span class="value"
													>{Math.round((progress.successes / progress.attempts) * 100)}%</span
												>
											</div>
											<div class="stat-small">
												<span class="label">Best Time:</span>
												<span class="value">{formatTime(progress.bestTime)}</span>
											</div>
											<div class="stat-small">
												<span class="label">Attempts:</span>
												<span class="value">{progress.attempts}</span>
											</div>
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	{:else if filteredProgress.length === 0}
		<div class="no-data">
			<p>No progress data yet. Start practicing to see your stats!</p>
		</div>
	{/if}
</div>

<style>
	.stats-widget {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		margin: 1rem 0;
	}
	.stats-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}
	.stats-header h3 {
		margin: 0;
		color: #2c3e50;
	}
	.overall-progress {
		position: relative;
	}
	.progress-circle {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background: conic-gradient(
			#4caf50 0deg,
			#4caf50 calc(var(--progress) * 3.6deg),
			#e0e0e0 calc(var(--progress) * 3.6deg),
			#e0e0e0 360deg
		);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	.progress-circle::before {
		content: '';
		position: absolute;
		inset: 8px;
		border-radius: 50%;
		background: white;
	}
	.progress-text {
		position: relative;
		z-index: 1;
		font-weight: bold;
		font-size: 0.85rem;
		color: #2c3e50;
	}
	.stats-summary {
		display: flex;
		gap: 2rem;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
	}
	.stat-item {
		text-align: center;
		flex: 1;
		min-width: 100px;
	}
	.stat-value {
		font-size: 1.5rem;
		font-weight: bold;
		color: #2c3e50;
	}
	.stat-label {
		color: #7f8c8d;
		font-size: 0.85rem;
		margin-top: 0.25rem;
	}
	.detailed-progress h4 {
		color: #2c3e50;
		margin-bottom: 1rem;
	}
	.progress-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1rem;
	}
	.note-progress-card {
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		padding: 1rem;
		background: #fafafa;
	}
	.note-header {
		margin-bottom: 0.75rem;
	}
	.note-name {
		font-size: 1.1rem;
		font-weight: bold;
		color: #2c3e50;
		background: #3498db;
		color: rgb(100, 77, 77);
		padding: 0.25rem 0.75rem;
		border-radius: 20px;
	}
	.note-exercises {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.exercise-progress {
		background: white;
		padding: 0.75rem;
		border-radius: 6px;
		border-left: 4px solid #3498db;
	}
	.exercise-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}
	.exercise-type {
		font-weight: 500;
		color: #2c3e50;
		text-transform: capitalize;
	}
	.mastery-badge {
		font-size: 0.85rem;
		font-weight: 500;
		text-transform: capitalize;
	}
	.progress-stats {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.stat-small {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}
	.stat-small .label {
		font-size: 0.75rem;
		color: #7f8c8d;
	}
	.stat-small .value {
		font-size: 0.85rem;
		font-weight: 500;
		color: #2c3e50;
	}
	.no-data {
		text-align: center;
		padding: 2rem;
		color: #7f8c8d;
		font-style: italic;
	}
	@media (max-width: 768px) {
		.stats-widget {
			padding: 1rem;
		}
		.stats-summary {
			gap: 1rem;
		}
		.progress-grid {
			grid-template-columns: 1fr;
		}
		.progress-stats {
			flex-direction: column;
			gap: 0.5rem;
		}
	}
</style>
