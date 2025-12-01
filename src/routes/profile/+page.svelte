<svelte:options runes={true} />

<script lang="ts">
	import type { Achievement, UserProfile, UserStatistics } from '$lib/UserStatsService';
	import { userStatsService } from '$lib/UserStatsService';
	import { journeyService } from '$lib/JourneyService';
	import { onMount } from 'svelte';
	import StatsWidget from '../../components/StatsWidget.svelte';
	import type { PageData } from './$types';
	import { fade, fly } from 'svelte/transition';
	import { Trophy, Target, Clock, Zap, Edit2, Save, X, Download, Upload } from 'lucide-svelte';

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
					<span class="level-tag">Level {profile.level}</span>
					<span>•</span>
					<span>{profile.experiencePoints} XP</span>
					<span>•</span>
					<span>Joined {formatDate(profile.createdAt)}</span>
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
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(10px);
		border-radius: 1.5rem;
		padding: 2rem;
		margin-bottom: 2rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
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
		background: rgba(255, 255, 255, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 3rem;
		border: 4px solid rgba(255, 255, 255, 0.2);
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
		background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.name-input {
		font-size: 1.5rem;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 0.5rem;
		padding: 0.5rem;
		color: white;
	}

	.icon-btn {
		background: rgba(255, 255, 255, 0.1);
		border: none;
		color: white;
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
		color: rgba(255, 255, 255, 0.6);
		font-size: 0.9rem;
		align-items: center;
	}

	.level-tag {
		background: #4caf50;
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
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(10px);
		border-radius: 1rem;
		padding: 1.5rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		transition: transform 0.2s;
	}

	.stat-card:hover {
		transform: translateY(-5px);
		background: rgba(255, 255, 255, 0.1);
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
		color: rgba(255, 255, 255, 0.6);
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
		background: rgba(255, 255, 255, 0.05);
		border-radius: 1rem;
		padding: 1.5rem;
		margin-bottom: 2rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	h2,
	h3 {
		margin: 0 0 1.5rem 0;
		font-size: 1.2rem;
		color: rgba(255, 255, 255, 0.9);
	}

	.exercise-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.exercise-card {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 0.75rem;
		padding: 1rem;
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
		color: rgba(255, 255, 255, 0.7);
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
		background: rgba(255, 255, 255, 0.05);
		border-radius: 0.5rem;
		opacity: 0.5;
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
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 0.5rem;
		color: white;
		cursor: pointer;
		font-size: 0.9rem;
		transition: all 0.2s;
	}

	.action-btn:hover {
		background: rgba(255, 255, 255, 0.2);
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
