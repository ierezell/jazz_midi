<script lang="ts">
	import { userStatsService, type UserStatistics, type UserProfile } from '$lib/UserStatsService';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import StreakCalendar from '../../components/StreakCalendar.svelte';

	let stats = $state<UserStatistics>(userStatsService.getStatistics());
	let profile = $state<UserProfile>(userStatsService.getProfile());

	onMount(() => {
		const unsubscribe = userStatsService.subscribe((newStats) => {
			stats = newStats;
			profile = userStatsService.getProfile();
		});
		return unsubscribe;
	});

	function formatTime(minutes: number): string {
		const h = Math.floor(minutes / 60);
		const m = Math.round(minutes % 60);
		if (h > 0) return `${h}h ${m}m`;
		return `${m}m`;
	}

	function formatAccuracy(acc: number): string {
		return `${Math.round(acc)}%`;
	}

	// Get calendar data and streaks
	let calendarData = $derived(userStatsService.getPracticeCalendar(84));
	let streakInfo = $derived(userStatsService.getPracticeStreak());
</script>

<svelte:head>
	<title>Jazz MIDI - Statistics</title>
</svelte:head>

<div class="stats-container">
	<header in:fade>
		<h1>Your Progress</h1>
		<div class="profile-summary">
			<div class="stat-card highlight">
				<span class="label">Level</span>
				<span class="value">{profile.level}</span>
				<span class="sub">{profile.experiencePoints} XP</span>
			</div>
			<div class="stat-card">
				<span class="label">Practice Time</span>
				<span class="value">{formatTime(stats.totalPracticeTime)}</span>
			</div>
			<div class="stat-card">
				<span class="label">Streak</span>
				<span class="value">{stats.currentStreak} 🔥</span>
				<span class="sub">Best: {stats.longestStreak}</span>
			</div>
		</div>
	</header>

	<section class="main-stats" in:fade={{ delay: 200 }}>
		<h2>Overall Performance</h2>
		<div class="grid">
			<div class="stat-card">
				<span class="label">Exercises Completed</span>
				<span class="value">{stats.completedExercises}</span>
				<span class="sub">/ {stats.totalExercises} attempted</span>
			</div>
			<div class="stat-card">
				<span class="label">Average Accuracy</span>
				<span class="value">{formatAccuracy(stats.averageAccuracy)}</span>
			</div>
			<div class="stat-card">
				<span class="label">Average Score</span>
				<span class="value">{Math.round(stats.averageScore)}</span>
			</div>
		</div>
	</section>

	<section class="breakdown" in:fade={{ delay: 400 }}>
		<h2>Skill Breakdown</h2>
		<div class="grid">
			<div class="skill-card">
				<h3>Chords</h3>
				<div class="skill-stats">
					<div class="row">
						<span>Completed</span>
						<span>{stats.chordStats.completed}</span>
					</div>
					<div class="row">
						<span>Accuracy</span>
						<span>{formatAccuracy(stats.chordStats.averageAccuracy)}</span>
					</div>
					<div class="row">
						<span>Mastery</span>
						<span class="badge {stats.chordStats.masteryLevel}"
							>{stats.chordStats.masteryLevel}</span
						>
					</div>
				</div>
			</div>

			<div class="skill-card">
				<h3>Scales</h3>
				<div class="skill-stats">
					<div class="row">
						<span>Completed</span>
						<span>{stats.scaleStats.completed}</span>
					</div>
					<div class="row">
						<span>Accuracy</span>
						<span>{formatAccuracy(stats.scaleStats.averageAccuracy)}</span>
					</div>
					<div class="row">
						<span>Mastery</span>
						<span class="badge {stats.scaleStats.masteryLevel}"
							>{stats.scaleStats.masteryLevel}</span
						>
					</div>
				</div>
			</div>

			<div class="skill-card">
				<h3>Sight Reading</h3>
				<div class="skill-stats">
					<div class="row">
						<span>Completed</span>
						<span>{stats.partitionStats.completed}</span>
					</div>
					<div class="row">
						<span>Accuracy</span>
						<span>{formatAccuracy(stats.partitionStats.averageAccuracy)}</span>
					</div>
					<div class="row">
						<span>Mastery</span>
						<span class="badge {stats.partitionStats.masteryLevel}"
							>{stats.partitionStats.masteryLevel}</span
						>
					</div>
				</div>
			</div>

			<div class="skill-card">
				<h3>Rhythm</h3>
				<div class="skill-stats">
					<div class="row">
						<span>Completed</span>
						<span>{stats.rhythmStats.completed}</span>
					</div>
					<div class="row">
						<span>Accuracy</span>
						<span>{formatAccuracy(stats.rhythmStats.averageAccuracy)}</span>
					</div>
					<div class="row">
						<span>Mastery</span>
						<span class="badge {stats.rhythmStats.masteryLevel}"
							>{stats.rhythmStats.masteryLevel}</span
						>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="streak-section" in:fade={{ delay: 500 }}>
		<h2>Practice Streak</h2>
		<StreakCalendar
			{calendarData}
			currentStreak={streakInfo.current}
			longestStreak={streakInfo.longest}
		/>
	</section>

	<section class="recent-activity" in:fade={{ delay: 600 }}>
		<h2>Recent Sessions</h2>
		{#if stats.recentSessions.length === 0}
			<p class="empty">No recent activity recorded.</p>
		{:else}
			<div class="sessions-list">
				{#each stats.recentSessions as session}
					<div class="session-item">
						<span class="date">{session.date.toLocaleDateString()}</span>
						<span class="duration">{formatTime(session.duration)}</span>
						<span class="score">Avg Score: {Math.round(session.averageScore)}</span>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>

<style>
	.stats-container {
		max-width: 1000px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}

	h1,
	h2 {
		color: var(--color-text);
		margin-bottom: 1.5rem;
	}

	h1 {
		font-size: 2.5rem;
		text-align: center;
	}

	.profile-summary {
		display: flex;
		justify-content: center;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.stat-card {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		padding: 1.5rem;
		border-radius: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 150px;
		backdrop-filter: blur(10px);
	}

	.stat-card.highlight {
		background: linear-gradient(145deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05));
		border-color: rgba(76, 175, 80, 0.3);
	}

	.label {
		font-size: 0.9rem;
		color: var(--color-text-secondary, #888);
		margin-bottom: 0.5rem;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.value {
		font-size: 2rem;
		font-weight: bold;
		color: var(--color-text);
	}

	.sub {
		font-size: 0.8rem;
		color: var(--color-text-secondary, #666);
		margin-top: 0.25rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
	}

	.skill-card {
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.05);
		padding: 1.5rem;
		border-radius: 1rem;
	}

	.skill-card h3 {
		margin: 0 0 1rem 0;
		font-size: 1.2rem;
		color: var(--color-primary, #3498db);
	}

	.skill-stats {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.95rem;
	}

	.badge {
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.8rem;
		text-transform: capitalize;
		font-weight: 500;
	}

	.badge.beginner {
		background: #607d8b;
		color: white;
	}
	.badge.intermediate {
		background: #2196f3;
		color: white;
	}
	.badge.advanced {
		background: #9c27b0;
		color: white;
	}
	.badge.expert {
		background: #ff9800;
		color: white;
	}
	.badge.mastered {
		background: #4caf50;
		color: white;
	}

	.sessions-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.session-item {
		background: rgba(255, 255, 255, 0.02);
		padding: 1rem;
		border-radius: 0.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.empty {
		text-align: center;
		color: var(--color-text-secondary);
		font-style: italic;
	}

	@media (max-width: 600px) {
		.profile-summary {
			flex-direction: column;
			align-items: stretch;
		}
	}
</style>
