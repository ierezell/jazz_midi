<svelte:options runes={true} />

<script lang="ts">
	import type { Achievement, UserProfile, UserStatistics } from '$lib/services/UserStatsService';
	import { userStatsService } from '$lib/services/UserStatsService';
	import { onMount } from 'svelte';
	import StatsWidget from '../../components/StatsWidget.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let profile = $state<UserProfile>(data.profile);
	let statistics = $state<UserStatistics>(data.statistics);
	let achievements = $state<Achievement[]>(data.achievements);
	let isEditing = $state(false);
	let showExportDialog = $state(false);
	let exportData = $state('');

	// Reactive computations
	let completionRate = $derived(
		statistics.totalExercises > 0
			? Math.round((statistics.completedExercises / statistics.totalExercises) * 100)
			: 0
	);

	let levelProgress = $derived(Math.round(((profile.experiencePoints % 1000) / 1000) * 100));

	let nextLevelXP = $derived(profile.level * 1000 - profile.experiencePoints);

	// Format time in hours and minutes
	function formatTime(minutes: number): string {
		const hours = Math.floor(minutes / 60);
		const mins = Math.round(minutes % 60);
		if (hours > 0) {
			return `${hours}h ${mins}m`;
		}
		return `${mins}m`;
	}

	// Format date for display
	function formatDate(date: Date): string {
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		}).format(date);
	}

	// Get mastery level color
	function getMasteryColor(level: string): string {
		switch (level) {
			case 'expert':
				return '#ffd700';
			case 'advanced':
				return '#28a745';
			case 'intermediate':
				return '#ffc107';
			default:
				return '#6c757d';
		}
	}

	// Get trend arrow
	function getTrendArrow(trend: number): string {
		if (trend > 0) return '↗️';
		if (trend < 0) return '↘️';
		return '→';
	}

	// Edit profile
	function toggleEdit(): void {
		isEditing = !isEditing;
	}

	function saveProfile(): void {
		userStatsService.updateProfile(profile);
		isEditing = false;
	}

	// Export/Import functionality
	function handleExport(): void {
		exportData = userStatsService.exportData();
		showExportDialog = true;
	}

	function handleImport(event: Event): void {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const data = e.target?.result as string;
				if (userStatsService.importData(data)) {
					// Refresh data
					profile = userStatsService.getProfile();
					statistics = userStatsService.getStatistics();
					achievements = userStatsService.getAchievements();
					alert('Data imported successfully!');
				} else {
					alert('Failed to import data. Please check the file format.');
				}
			};
			reader.readAsText(file);
		}
	}

	function copyExportData(): void {
		navigator.clipboard.writeText(exportData);
		alert('Data copied to clipboard!');
	}

	// Subscribe to statistics updates
	onMount(() => {
		const unsubscribe = userStatsService.subscribe((newStats) => {
			statistics = newStats;
			profile = userStatsService.getProfile();
			achievements = userStatsService.getAchievements();
		});

		return () => {
			unsubscribe();
		};
	});
</script>

<svelte:head>
	<title>Profile - Jazz MIDI</title>
	<meta name="description" content="Your jazz practice progress and statistics" />
</svelte:head>

<div class="profile-container">
	<!-- Header with Profile Info -->
	<header class="profile-header">
		<div class="avatar-section">
			<div class="avatar">
				{profile.avatar || '🎹'}
			</div>
			<div class="profile-info">
				{#if isEditing}
					<input type="text" bind:value={profile.name} class="name-input" placeholder="Your name" />
					<div class="edit-actions">
						<button onclick={saveProfile} class="save-btn">Save</button>
						<button onclick={toggleEdit} class="cancel-btn">Cancel</button>
					</div>
				{:else}
					<h1 class="profile-name">{profile.name}</h1>
					<button onclick={toggleEdit} class="edit-btn">Edit Profile</button>
				{/if}
				<div class="profile-meta">
					<span>Level {profile.level}</span>
					<span>•</span>
					<span>{profile.experiencePoints} XP</span>
					<span>•</span>
					<span>Joined {formatDate(profile.createdAt)}</span>
				</div>
			</div>
		</div>

		<!-- Level Progress -->
		<div class="level-progress">
			<div class="progress-header">
				<span>Level {profile.level}</span>
				<span>{nextLevelXP} XP to next level</span>
			</div>
			<div class="progress-bar">
				<div class="progress-fill" style="width: {levelProgress}%"></div>
			</div>
		</div>
	</header>

	<!-- Quick Stats Overview -->
	<section class="stats-overview">
		<div class="stat-card highlight">
			<div class="stat-icon">🎯</div>
			<div class="stat-content">
				<div class="stat-value">{completionRate}%</div>
				<div class="stat-label">Success Rate</div>
			</div>
		</div>

		<div class="stat-card">
			<div class="stat-icon">📊</div>
			<div class="stat-content">
				<div class="stat-value">{Math.round(statistics.averageScore)}</div>
				<div class="stat-label">Avg Score</div>
			</div>
		</div>

		<div class="stat-card">
			<div class="stat-icon">⏱️</div>
			<div class="stat-content">
				<div class="stat-value">{formatTime(statistics.totalPracticeTime)}</div>
				<div class="stat-label">Practice Time</div>
			</div>
		</div>

		<div class="stat-card">
			<div class="stat-icon">🔥</div>
			<div class="stat-content">
				<div class="stat-value">{statistics.currentStreak}</div>
				<div class="stat-label">Current Streak</div>
			</div>
		</div>
	</section>

	<!-- Detailed Stats Widget -->
	<section class="detailed-stats">
		<h2>Detailed Progress</h2>
		<StatsWidget showDetailed={true} />
	</section>

	<!-- Exercise Type Breakdown -->
	<section class="exercise-breakdown">
		<h2>Exercise Performance</h2>
		<div class="exercise-grid">
			<!-- Chords -->
			<div class="exercise-card">
				<div class="exercise-header">
					<h3>🎵 Chords</h3>
					<span
						class="mastery-badge"
						style="background-color: {getMasteryColor(statistics.chordStats.masteryLevel)}"
					>
						{statistics.chordStats.masteryLevel}
					</span>
				</div>
				<div class="exercise-stats">
					<div class="stat-row">
						<span>Attempted:</span>
						<span>{statistics.chordStats.attempted}</span>
					</div>
					<div class="stat-row">
						<span>Completed:</span>
						<span>{statistics.chordStats.completed}</span>
					</div>
					<div class="stat-row">
						<span>Best Score:</span>
						<span>{statistics.chordStats.bestScore}</span>
					</div>
					<div class="stat-row">
						<span>Avg Accuracy:</span>
						<span>{Math.round(statistics.chordStats.averageAccuracy)}%</span>
					</div>
					<div class="stat-row">
						<span>Practice Time:</span>
						<span>{formatTime(statistics.chordStats.totalTime)}</span>
					</div>
				</div>
			</div>

			<!-- Scales -->
			<div class="exercise-card">
				<div class="exercise-header">
					<h3>🎼 Scales</h3>
					<span
						class="mastery-badge"
						style="background-color: {getMasteryColor(statistics.scaleStats.masteryLevel)}"
					>
						{statistics.scaleStats.masteryLevel}
					</span>
				</div>
				<div class="exercise-stats">
					<div class="stat-row">
						<span>Attempted:</span>
						<span>{statistics.scaleStats.attempted}</span>
					</div>
					<div class="stat-row">
						<span>Completed:</span>
						<span>{statistics.scaleStats.completed}</span>
					</div>
					<div class="stat-row">
						<span>Best Score:</span>
						<span>{statistics.scaleStats.bestScore}</span>
					</div>
					<div class="stat-row">
						<span>Avg Accuracy:</span>
						<span>{Math.round(statistics.scaleStats.averageAccuracy)}%</span>
					</div>
					<div class="stat-row">
						<span>Practice Time:</span>
						<span>{formatTime(statistics.scaleStats.totalTime)}</span>
					</div>
				</div>
			</div>

			<!-- Progressions -->
			<div class="exercise-card">
				<div class="exercise-header">
					<h3>🎸 Progressions</h3>
					<span
						class="mastery-badge"
						style="background-color: {getMasteryColor(statistics.progressionStats.masteryLevel)}"
					>
						{statistics.progressionStats.masteryLevel}
					</span>
				</div>
				<div class="exercise-stats">
					<div class="stat-row">
						<span>Attempted:</span>
						<span>{statistics.progressionStats.attempted}</span>
					</div>
					<div class="stat-row">
						<span>Completed:</span>
						<span>{statistics.progressionStats.completed}</span>
					</div>
					<div class="stat-row">
						<span>Best Score:</span>
						<span>{statistics.progressionStats.bestScore}</span>
					</div>
					<div class="stat-row">
						<span>Avg Accuracy:</span>
						<span>{Math.round(statistics.progressionStats.averageAccuracy)}%</span>
					</div>
					<div class="stat-row">
						<span>Practice Time:</span>
						<span>{formatTime(statistics.progressionStats.totalTime)}</span>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Mastery Progress -->
	<section class="mastery-section">
		<h2>Mastery Progress</h2>

		<!-- Mastered Chords -->
		{#if statistics.masteredChords.length > 0}
			<div class="mastery-category">
				<h3>🎵 Mastered Chords</h3>
				<div class="mastery-grid">
					{#each statistics.masteredChords.filter((c) => c.isMastered) as chord}
						<div class="mastery-item">
							<div class="mastery-name">{chord.root}{chord.chordType}</div>
							<div class="mastery-level">{chord.masteryLevel}%</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Currently Learning -->
		{#if statistics.masteredChords.some((c) => c.isLearning)}
			<div class="mastery-category">
				<h3>📚 Currently Learning</h3>
				<div class="learning-grid">
					{#each statistics.masteredChords.filter((c) => c.isLearning && !c.isMastered) as chord}
						<div class="learning-item">
							<div class="learning-header">
								<span class="learning-name">{chord.root}{chord.chordType}</span>
								<span class="learning-progress">{chord.masteryLevel}%</span>
							</div>
							<div class="progress-bar small">
								<div class="progress-fill" style="width: {chord.masteryLevel}%"></div>
							</div>
							<div class="learning-meta">
								{chord.attemptsCount} attempts • Last practiced {formatDate(chord.lastPracticed)}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</section>

	<!-- Achievements -->
	<section class="achievements-section">
		<h2>🏆 Achievements</h2>
		<div class="achievements-grid">
			{#each achievements as achievement}
				<div class="achievement-card" class:unlocked={achievement.progress >= 100}>
					<div class="achievement-icon">{achievement.icon}</div>
					<div class="achievement-content">
						<h4 class="achievement-name">{achievement.name}</h4>
						<p class="achievement-description">{achievement.description}</p>
						<div class="achievement-progress">
							<div class="progress-bar small">
								<div class="progress-fill" style="width: {achievement.progress}%"></div>
							</div>
							<span class="progress-text">{achievement.progress}%</span>
						</div>
						{#if achievement.unlockedAt}
							<div class="unlock-date">
								Unlocked {formatDate(achievement.unlockedAt)}
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Recent Activity -->
	{#if statistics.recentSessions.length > 0}
		<section class="activity-section">
			<h2>📅 Recent Sessions</h2>
			<div class="sessions-list">
				{#each statistics.recentSessions as session}
					<div class="session-item">
						<div class="session-date">{formatDate(session.date)}</div>
						<div class="session-stats">
							<span>{formatTime(session.duration)}</span>
							<span>•</span>
							<span>{session.exercisesCompleted} exercises</span>
							<span>•</span>
							<span>Avg score: {Math.round(session.averageScore)}</span>
						</div>
						<div class="session-category">
							Focus: {session.topCategory}
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Data Management -->
	<section class="data-section">
		<h2>⚙️ Data Management</h2>
		<div class="data-actions">
			<button onclick={handleExport} class="action-btn export"> 📤 Export Data </button>
			<label for="import-file" class="action-btn import">
				📥 Import Data
				<input
					id="import-file"
					type="file"
					accept=".json"
					onchange={handleImport}
					style="display: none;"
				/>
			</label>
		</div>
	</section>
</div>

<!-- Export Dialog -->
{#if showExportDialog}
	<div class="modal-overlay" onclick={() => (showExportDialog = false)}>
		<div class="modal" onclick={(e) => e.stopPropagation()}>
			<div class="modal-header">
				<h3>Export Your Data</h3>
				<button onclick={() => (showExportDialog = false)} class="close-btn">×</button>
			</div>
			<div class="modal-content">
				<p>Your practice data has been generated. You can copy it or save it to a file:</p>
				<textarea readonly class="export-textarea">{exportData}</textarea>
				<div class="modal-actions">
					<button onclick={copyExportData} class="action-btn">Copy to Clipboard</button>
					<button onclick={() => (showExportDialog = false)} class="action-btn secondary"
						>Close</button
					>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.profile-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		min-height: 100vh;
		color: white;
	}

	.profile-header {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border-radius: 1rem;
		padding: 2rem;
		margin-bottom: 2rem;
	}

	.avatar-section {
		display: flex;
		align-items: center;
		gap: 2rem;
		margin-bottom: 2rem;
	}

	.avatar {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 3rem;
		border: 4px solid rgba(255, 255, 255, 0.3);
	}

	.profile-info {
		flex: 1;
	}

	.profile-name {
		font-size: 2.5rem;
		font-weight: bold;
		margin: 0 0 0.5rem 0;
	}

	.name-input {
		font-size: 2.5rem;
		font-weight: bold;
		background: rgba(255, 255, 255, 0.1);
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-radius: 0.5rem;
		padding: 0.5rem;
		color: white;
		margin-bottom: 1rem;
	}

	.edit-actions {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.edit-btn,
	.save-btn,
	.cancel-btn {
		background: rgba(255, 255, 255, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 0.5rem;
		color: white;
		padding: 0.5rem 1rem;
		cursor: pointer;
		transition: background 0.2s;
	}

	.edit-btn:hover,
	.save-btn:hover {
		background: rgba(255, 255, 255, 0.3);
	}

	.cancel-btn:hover {
		background: rgba(220, 53, 69, 0.3);
	}

	.profile-meta {
		display: flex;
		gap: 0.5rem;
		color: rgba(255, 255, 255, 0.8);
		font-size: 1.1rem;
	}

	.level-progress {
		margin-top: 1rem;
	}

	.progress-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.5rem;
		font-weight: 500;
	}

	.progress-bar {
		height: 1rem;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.progress-bar.small {
		height: 0.5rem;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #4caf50, #8bc34a);
		transition: width 0.3s ease;
	}

	.stats-overview {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border-radius: 1rem;
		padding: 1.5rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		transition: transform 0.2s;
	}

	.stat-card:hover {
		transform: translateY(-5px);
	}

	.stat-card.highlight {
		background: linear-gradient(135deg, #4caf50, #45a049);
	}

	.stat-icon {
		font-size: 2rem;
	}

	.stat-value {
		font-size: 2rem;
		font-weight: bold;
		margin-bottom: 0.25rem;
	}

	.stat-label {
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.9rem;
	}

	.exercise-breakdown,
	.mastery-section,
	.achievements-section,
	.activity-section,
	.data-section {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border-radius: 1rem;
		padding: 2rem;
		margin-bottom: 2rem;
	}

	.exercise-breakdown h2,
	.mastery-section h2,
	.achievements-section h2,
	.activity-section h2,
	.data-section h2 {
		margin: 0 0 1.5rem 0;
		color: white;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.exercise-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.exercise-card {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 0.75rem;
		padding: 1.5rem;
	}

	.exercise-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.exercise-header h3 {
		margin: 0;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.mastery-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.8rem;
		font-weight: bold;
		color: white;
		text-transform: capitalize;
	}

	.exercise-stats {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.stat-row {
		display: flex;
		justify-content: space-between;
		padding: 0.25rem 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.mastery-category {
		margin-bottom: 2rem;
	}

	.mastery-category h3 {
		margin-bottom: 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.mastery-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 1rem;
	}

	.mastery-item {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 0.5rem;
		padding: 1rem;
		text-align: center;
	}

	.mastery-name {
		font-weight: bold;
		margin-bottom: 0.5rem;
	}

	.mastery-level {
		color: #4caf50;
		font-weight: bold;
	}

	.learning-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1rem;
	}

	.learning-item {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 0.5rem;
		padding: 1rem;
	}

	.learning-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.5rem;
	}

	.learning-name {
		font-weight: bold;
	}

	.learning-progress {
		color: #ffc107;
		font-weight: bold;
	}

	.learning-meta {
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.7);
		margin-top: 0.5rem;
	}

	.achievements-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.achievement-card {
		background: rgba(255, 255, 255, 0.05);
		border: 2px solid rgba(255, 255, 255, 0.1);
		border-radius: 0.75rem;
		padding: 1.5rem;
		display: flex;
		gap: 1rem;
		transition: all 0.3s ease;
	}

	.achievement-card.unlocked {
		background: rgba(255, 215, 0, 0.1);
		border-color: rgba(255, 215, 0, 0.3);
		box-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
	}

	.achievement-icon {
		font-size: 2rem;
		flex-shrink: 0;
	}

	.achievement-content {
		flex: 1;
	}

	.achievement-name {
		margin: 0 0 0.5rem 0;
		font-weight: bold;
	}

	.achievement-description {
		margin: 0 0 1rem 0;
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.9rem;
	}

	.achievement-progress {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.progress-text {
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.8);
	}

	.unlock-date {
		font-size: 0.8rem;
		color: #ffd700;
		font-weight: bold;
	}

	.sessions-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.session-item {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 0.5rem;
		padding: 1rem;
		border-left: 4px solid #4caf50;
	}

	.session-date {
		font-weight: bold;
		margin-bottom: 0.5rem;
	}

	.session-stats {
		display: flex;
		gap: 0.5rem;
		color: rgba(255, 255, 255, 0.8);
		margin-bottom: 0.25rem;
	}

	.session-category {
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.7);
	}

	.data-actions {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.action-btn {
		background: rgba(255, 255, 255, 0.1);
		border: 2px solid rgba(255, 255, 255, 0.2);
		border-radius: 0.5rem;
		color: white;
		padding: 0.75rem 1.5rem;
		cursor: pointer;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		transition: all 0.2s;
		font-weight: 500;
	}

	.action-btn:hover {
		background: rgba(255, 255, 255, 0.2);
		border-color: rgba(255, 255, 255, 0.3);
		transform: translateY(-2px);
	}

	.action-btn.export {
		background: rgba(76, 175, 80, 0.2);
		border-color: rgba(76, 175, 80, 0.4);
	}

	.action-btn.import {
		background: rgba(33, 150, 243, 0.2);
		border-color: rgba(33, 150, 243, 0.4);
	}

	.action-btn.secondary {
		background: rgba(108, 117, 125, 0.2);
		border-color: rgba(108, 117, 125, 0.4);
	}

	/* Modal Styles */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal {
		background: #2c3e50;
		border-radius: 1rem;
		padding: 0;
		max-width: 600px;
		width: 90%;
		max-height: 80vh;
		overflow: hidden;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
	}

	.modal-header {
		background: #34495e;
		padding: 1.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.modal-header h3 {
		margin: 0;
		color: white;
	}

	.close-btn {
		background: none;
		border: none;
		color: white;
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-btn:hover {
		background: rgba(255, 255, 255, 0.1);
	}

	.modal-content {
		padding: 1.5rem;
		color: white;
	}

	.export-textarea {
		width: 100%;
		height: 300px;
		background: #1a1a1a;
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 0.5rem;
		color: white;
		padding: 1rem;
		font-family: monospace;
		font-size: 0.8rem;
		resize: vertical;
		margin: 1rem 0;
	}

	.modal-actions {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		margin-top: 1rem;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.profile-container {
			padding: 1rem;
		}

		.avatar-section {
			flex-direction: column;
			text-align: center;
			gap: 1rem;
		}

		.avatar {
			width: 100px;
			height: 100px;
			font-size: 2.5rem;
		}

		.profile-name,
		.name-input {
			font-size: 2rem;
		}

		.stats-overview {
			grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
			gap: 1rem;
		}

		.exercise-grid,
		.achievements-grid,
		.learning-grid {
			grid-template-columns: 1fr;
		}

		.mastery-grid {
			grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		}

		.data-actions {
			flex-direction: column;
		}

		.modal {
			width: 95%;
			margin: 1rem;
		}

		.export-textarea {
			height: 200px;
		}
	}
</style>
