<svelte:options runes={true} />

<script lang="ts">
	import type { Achievement, UserProfile, UserStatistics } from '$lib/UserStatsService';
	import { userStatsService } from '$lib/UserStatsService';
	import { journeyService } from '$lib/JourneyService';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import StatsWidget from '../../components/StatsWidget.svelte';
	import type { PageData } from './$types';
	import { fade, fly } from 'svelte/transition';
	import {
		Trophy,
		Target,
		Clock,
		Zap,
		Edit2,
		Save,
		X,
		Download,
		Upload,
		TrendingUp
	} from 'lucide-svelte';
	import NoteHeatmap from '../../components/NoteHeatmap.svelte';
	import StreakCalendar from '../../components/StreakCalendar.svelte';

	let { data }: { data: PageData } = $props();

	let profile = $state<UserProfile>(userStatsService.getProfile());
	let statistics = $state<UserStatistics>(userStatsService.getStatistics());
	let achievements = $state<Achievement[]>(userStatsService.getAchievements());

	let isEditing = $state(false);
	let showExportDialog = $state(false);
	let exportData = $state('');

	let completionRate = $derived(
		statistics.totalExercises > 0
			? Math.round((statistics.completedExercises / statistics.totalExercises) * 100)
			: 0
	);

	function formatTime(minutes: number): string {
		const hours = Math.floor(minutes / 60);
		const mins = Math.round(minutes % 60);
		if (hours > 0) {
			return `${hours}h ${mins}m`;
		}
		return `${mins}m`;
	}

	function formatDate(date: Date | string): string {
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		}).format(new Date(date));
	}

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

	function toggleEdit(): void {
		isEditing = !isEditing;
	}

	function saveProfile(): void {
		userStatsService.updateProfile(profile);
		isEditing = false;
	}

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

	// Get missed notes and recommendations
	let missedNotes = $derived(userStatsService.getMostMissedNotes(12));
	let weaknessRecommendations = $derived(userStatsService.getWeaknessRecommendations());

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
	<header class="profile-header" in:fade>
		<div class="avatar-section">
			<div class="avatar">
				{profile.avatar || '🎹'}
			</div>
			<div class="profile-info">
				{#if isEditing}
					<div class="edit-mode">
						<input
							type="text"
							bind:value={profile.name}
							class="name-input"
							placeholder="Your name"
						/>
						<div class="edit-actions">
							<button onclick={saveProfile} class="icon-btn save" title="Save"
								><Save size={20} /></button
							>
							<button onclick={toggleEdit} class="icon-btn cancel" title="Cancel"
								><X size={20} /></button
							>
						</div>
					</div>
				{:else}
					<div class="view-mode">
						<h1 class="profile-name">{profile.name}</h1>
						<button onclick={toggleEdit} class="icon-btn edit" title="Edit Profile"
							><Edit2 size={18} /></button
						>
					</div>
				{/if}
				<div class="profile-meta">
					<span class="meta-item level-tag">Level {profile.level}</span>
					<span class="meta-divider">•</span>
					<span class="meta-item">{profile.experiencePoints} XP</span>
					<span class="meta-divider">•</span>
					<span class="meta-item">Joined {formatDate(profile.createdAt)}</span>
				</div>
			</div>
		</div>
	</header>

	<section class="stats-overview" in:fly={{ y: 20, duration: 500, delay: 100 }}>
		<div class="stat-card highlight">
			<div class="stat-icon"><Target size={32} /></div>
			<div class="stat-content">
				<div class="stat-value">{completionRate}%</div>
				<div class="stat-label">Success Rate</div>
			</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon"><Trophy size={32} /></div>
			<div class="stat-content">
				<div class="stat-value">{Math.round(statistics.averageScore)}</div>
				<div class="stat-label">Avg Score</div>
			</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon"><Clock size={32} /></div>
			<div class="stat-content">
				<div class="stat-value">{formatTime(statistics.totalPracticeTime)}</div>
				<div class="stat-label">Practice Time</div>
			</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon"><Zap size={32} /></div>
			<div class="stat-content">
				<div class="stat-value">{statistics.currentStreak}</div>
				<div class="stat-label">Day Streak</div>
			</div>
		</div>
	</section>

	<div class="content-grid">
		<section class="main-stats" in:fly={{ y: 20, duration: 500, delay: 200 }}>
			<h2>Detailed Progress</h2>
			<StatsWidget showDetailed={true} />

			<!-- Weak Areas & Recommendations -->
			<div class="weak-areas-section">
				<h3>📊 Weak Areas & Recommendations</h3>

				<NoteHeatmap {missedNotes} />

				{#if weaknessRecommendations.length > 0}
					<div class="recommendations">
						<h4>Recommended Practice</h4>
						<div class="recommendation-list">
							{#each weaknessRecommendations as rec}
								<a href={resolve(rec.path)} class="recommendation-card">
									<div class="rec-header">
										<TrendingUp size={20} />
										<strong>{rec.weakness}</strong>
									</div>
									<div class="rec-exercise">{rec.recommendedExercise}</div>
								</a>
							{/each}
						</div>
					</div>
				{:else}
					<p class="no-weaknesses">🎉 No weaknesses detected! You're doing great!</p>
				{/if}
			</div>

			<div class="exercise-breakdown">
				<h3>Performance by Category</h3>
				<div class="exercise-grid">
					<div class="exercise-card">
						<div class="exercise-header">
							<h4>🎵 Chords</h4>
							<span
								class="mastery-badge"
								style="background-color: {getMasteryColor(statistics.chordStats.masteryLevel)}"
							>
								{statistics.chordStats.masteryLevel}
							</span>
						</div>
						<div class="exercise-stats">
							<div class="stat-row">
								<span>Completed</span><span>{statistics.chordStats.completed}</span>
							</div>
							<div class="stat-row">
								<span>Accuracy</span><span
									>{Math.round(statistics.chordStats.averageAccuracy)}%</span
								>
							</div>
						</div>
					</div>
					<div class="exercise-card">
						<div class="exercise-header">
							<h4>🎼 Scales</h4>
							<span
								class="mastery-badge"
								style="background-color: {getMasteryColor(statistics.scaleStats.masteryLevel)}"
							>
								{statistics.scaleStats.masteryLevel}
							</span>
						</div>
						<div class="exercise-stats">
							<div class="stat-row">
								<span>Completed</span><span>{statistics.scaleStats.completed}</span>
							</div>
							<div class="stat-row">
								<span>Accuracy</span><span
									>{Math.round(statistics.scaleStats.averageAccuracy)}%</span
								>
							</div>
						</div>
					</div>
					<div class="exercise-card">
						<div class="exercise-header">
							<h4>🎸 Progressions</h4>
							<span
								class="mastery-badge"
								style="background-color: {getMasteryColor(
									statistics.progressionStats.masteryLevel
								)}"
							>
								{statistics.progressionStats.masteryLevel}
							</span>
						</div>
						<div class="exercise-stats">
							<div class="stat-row">
								<span>Completed</span><span>{statistics.progressionStats.completed}</span>
							</div>
							<div class="stat-row">
								<span>Accuracy</span><span
									>{Math.round(statistics.progressionStats.averageAccuracy)}%</span
								>
							</div>
						</div>
					</div>
				</div>
			</div>

			<section class="streak-section">
				<h2>Practice Streak</h2>
				<StreakCalendar
					calendarData={userStatsService.getPracticeCalendar(84)}
					currentStreak={statistics.currentStreak}
					longestStreak={statistics.longestStreak}
				/>
			</section>

			<section class="recent-activity">
				<h2>Recent Sessions</h2>
				{#if statistics.recentSessions.length === 0}
					<p class="empty">No recent activity recorded.</p>
				{:else}
					<div class="sessions-list">
						{#each statistics.recentSessions as session}
							<div class="session-item">
								<span class="date">{session.date.toLocaleDateString()}</span>
								<span class="duration">{formatTime(session.duration)}</span>
								<span class="score">Avg Score: {Math.round(session.averageScore)}</span>
							</div>
						{/each}
					</div>
				{/if}
			</section>
		</section>

		<aside class="sidebar" in:fly={{ x: 20, duration: 500, delay: 300 }}>
			<section class="achievements-section">
				<h2>🏆 Achievements</h2>
				<div class="achievements-list">
					{#each achievements as achievement}
						<div class="achievement-item" class:unlocked={achievement.progress >= 100}>
							<div class="achievement-icon">{achievement.icon}</div>
							<div class="achievement-info">
								<h4>{achievement.name}</h4>
								<div class="progress-bar small">
									<div class="progress-fill" style="width: {achievement.progress}%"></div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</section>

			<section class="data-section">
				<h2>⚙️ Data</h2>
				<div class="data-actions">
					<button onclick={handleExport} class="action-btn export">
						<Download size={16} /> Export
					</button>
					<label for="import-file" class="action-btn import">
						<Upload size={16} /> Import
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
		</aside>
	</div>
</div>

{#if showExportDialog}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="modal-overlay" role="button" tabindex="-1" onclick={() => (showExportDialog = false)}>
		<div class="modal" role="dialog" tabindex="-1" onclick={(e) => e.stopPropagation()}>
			<div class="modal-header">
				<h3>Export Data</h3>
				<button onclick={() => (showExportDialog = false)} class="close-btn"><X size={20} /></button
				>
			</div>
			<div class="modal-content">
				<textarea readonly class="export-textarea">{exportData}</textarea>
				<button onclick={copyExportData} class="action-btn primary">Copy to Clipboard</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.profile-container {
		max-width: 1200px;
		margin: 0 auto;
	}

	.profile-header {
		background: var(--color-surface);
		backdrop-filter: var(--glass-blur);
		border-radius: 1.5rem;
		padding: 2rem;
		margin-bottom: 2rem;
		border: 1px solid var(--color-border);
		box-shadow: var(--shadow-lg);
	}

	.avatar-section {
		display: flex;
		align-items: center;
		gap: 2rem;
		margin-bottom: 2rem;
	}

	.avatar {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		background: var(--color-surface-raised);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 3rem;
		border: 4px solid var(--color-border);
	}

	.profile-info {
		flex: 1;
	}

	.view-mode,
	.edit-mode {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 0.5rem;
	}

	.profile-name {
		font-size: 2.5rem;
		font-weight: bold;
		margin: 0;
		background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.name-input {
		font-size: 1.5rem;
		background: var(--color-surface-raised);
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		padding: 0.5rem;
		color: var(--color-text);
	}

	.icon-btn {
		background: var(--color-surface-raised);
		border: 1px solid var(--color-border);
		color: var(--color-text);
		padding: 0.5rem;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}

	.icon-btn:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.profile-meta {
		display: flex;
		gap: 1rem;
		color: var(--color-text-muted);
		font-size: 0.9rem;
		align-items: center;
	}

	.level-tag {
		background: var(--color-success);
		color: white;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-weight: bold;
		font-size: 0.8rem;
	}

	.progress-bar {
		height: 8px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 4px;
		overflow: hidden;
	}

	.progress-bar.small {
		height: 4px;
	}

	.progress-fill {
		height: 100%;
		background: #4caf50;
		transition: width 0.5s ease;
	}

	.stats-overview {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		background: var(--color-surface);
		border-radius: 1rem;
		padding: 1.5rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		border: 1px solid var(--color-border);
		transition:
			transform 0.2s,
			background-color 0.2s;
		box-shadow: var(--shadow-lg);
	}

	.stat-card:hover {
		transform: translateY(-5px);
		background: var(--color-surface-raised);
	}

	.stat-card.highlight {
		background: linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0.1) 100%);
		border-color: rgba(76, 175, 80, 0.3);
	}

	.stat-icon {
		color: rgba(255, 255, 255, 0.8);
	}

	.stat-value {
		font-size: 1.8rem;
		font-weight: bold;
		line-height: 1;
		margin-bottom: 0.25rem;
	}

	.stat-label {
		font-size: 0.9rem;
		color: var(--color-text-muted);
	}

	.content-grid {
		display: grid;
		grid-template-columns: 1fr 300px;
		gap: 2rem;
	}

	@media (max-width: 900px) {
		.content-grid {
			grid-template-columns: 1fr;
		}
	}

	.main-stats,
	.sidebar section {
		background: var(--color-surface);
		border-radius: 1rem;
		padding: 1.5rem;
		margin-bottom: 2rem;
		border: 1px solid var(--color-border);
		box-shadow: var(--shadow-lg);
	}

	h2,
	h3 {
		margin: 0 0 1.5rem 0;
		font-size: 1.2rem;
		color: var(--color-text);
	}

	.exercise-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.exercise-card {
		background: var(--color-surface-raised);
		border-radius: 0.75rem;
		padding: 1rem;
		border: 1px solid var(--color-border);
	}

	.exercise-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.exercise-header h4 {
		margin: 0;
		font-size: 1rem;
	}

	.mastery-badge {
		font-size: 0.7rem;
		padding: 0.2rem 0.5rem;
		border-radius: 1rem;
		color: white;
		text-transform: uppercase;
		font-weight: bold;
	}

	.stat-row {
		display: flex;
		justify-content: space-between;
		font-size: 0.9rem;
		color: var(--color-text-muted);
		margin-bottom: 0.25rem;
	}

	.achievements-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.achievement-item {
		display: flex;
		gap: 1rem;
		padding: 0.75rem;
		background: var(--color-surface-raised);
		border-radius: 0.5rem;
		opacity: 0.5;
		border: 1px solid var(--color-border);
	}

	.achievement-item.unlocked {
		opacity: 1;
		background: rgba(255, 215, 0, 0.1);
		border: 1px solid rgba(255, 215, 0, 0.2);
	}

	.achievement-icon {
		font-size: 1.5rem;
	}

	.achievement-info h4 {
		margin: 0 0 0.5rem 0;
		font-size: 0.9rem;
	}

	.data-actions {
		display: flex;
		gap: 0.5rem;
	}

	.action-btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background: var(--color-surface-raised);
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		color: var(--color-text);
		cursor: pointer;
		font-size: 0.9rem;
		transition: all 0.2s;
	}

	.action-btn:hover {
		background: var(--color-surface);
	}

	.action-btn.primary {
		background: #4caf50;
		border-color: #4caf50;
	}

	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
	}

	.modal {
		background: #2c3e50;
		padding: 2rem;
		border-radius: 1rem;
		width: 90%;
		max-width: 500px;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.export-textarea {
		width: 100%;
		height: 200px;
		background: rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: white;
		padding: 0.5rem;
		margin-bottom: 1rem;
		border-radius: 0.5rem;
	}

	.close-btn {
		background: none;
		border: none;
		color: white;
		cursor: pointer;
	}

	.modal {
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

	.weak-areas-section {
		margin: 2rem 0;
	}

	.weak-areas-section h3,
	.weak-areas-section h4 {
		margin: 0 0 1rem 0;
	}

	.recommendations {
		margin-top: 1.5rem;
	}

	.recommendation-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
	}

	.recommendation-card {
		background: var(--color-surface-raised);
		border: 1px solid var(--color-border);
		border-radius: 0.75rem;
		padding: 1rem;
		text-decoration: none;
		color: var(--color-text);
		transition: all 0.2s;
		display: block;
	}

	.recommendation-card:hover {
		background: var(--color-surface);
		border-color: var(--color-success);
		transform: translateY(-2px);
	}

	.rec-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
		color: var(--color-warn);
	}

	.sessions-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.session-item {
		background: var(--color-surface-raised);
		padding: 1rem;
		border-radius: 0.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: var(--color-text);
		border: 1px solid var(--color-border);
	}

	.profile-meta {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		font-size: 0.95rem;
		margin-top: 0.5rem;
	}

	.meta-item {
		color: var(--color-text-muted); /* Ensure high contrast */
		font-weight: 500;
	}

	.meta-divider {
		color: var(--color-border);
	}
	.empty {
		text-align: center;
		color: var(--color-text-muted);
		font-style: italic;
	}

	.rec-exercise {
		color: var(--color-text-muted);
		font-size: 0.9rem;
	}

	.no-weaknesses {
		text-align: center;
		color: var(--color-text-muted);
		font-style: italic;
		padding: 2rem;
	}

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
		.exercise-grid {
			grid-template-columns: 1fr;
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
