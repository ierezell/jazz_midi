<script lang="ts">
	import { journeyService, type Level } from '$lib/JourneyService';
	import { userStatsService } from '$lib/UserStatsService';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { ArrowRight, Lock, CheckCircle, Star } from 'lucide-svelte';
	import { resolve } from '$app/paths';

	let currentLevel = $state<Level>(journeyService.getCurrentLevel());
	let nextLevel = $state<Level | null>(journeyService.getNextLevel());
	let progress = $state(0);
	let profile = $state(userStatsService.getProfile());

	onMount(() => {
		progress = journeyService.getLevelProgress(currentLevel);
		const unsubscribe = userStatsService.subscribe(() => {
			profile = userStatsService.getProfile();
			currentLevel = journeyService.getCurrentLevel();
			nextLevel = journeyService.getNextLevel();
			progress = journeyService.getLevelProgress(currentLevel);
		});
		return unsubscribe;
	});

	function getExerciseName(path: string): string {
		const parts = path.split('/');
		const name = parts[parts.length - 1];
		return name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' ');
	}
</script>

<svelte:head>
	<title>Jazz MIDI - Your Journey</title>
</svelte:head>

<div class="home-container">
	<section class="hero" in:fade>
		<h1>Welcome back, {profile.name}</h1>
		<p class="subtitle">Ready to continue your jazz journey?</p>
	</section>

	<section class="journey-section">
		<div class="level-card current" in:fly={{ y: 20, duration: 500 }}>
			<div class="level-header">
				<div class="level-info">
					<span class="level-badge">Level {currentLevel.id}</span>
					<h2>{currentLevel.name}</h2>
				</div>
				<div class="level-progress">
					<div class="progress-bar">
						<div class="progress-fill" style="width: {progress}%"></div>
					</div>
					<span class="progress-text">{Math.round(progress)}% Complete</span>
				</div>
			</div>
			<p class="level-description">{currentLevel.description}</p>

			<div class="requirements-list">
				<h3>Requirements for next level:</h3>
				{#each currentLevel.requirements as req}
					<div class="requirement-item">
						{#if (req.type === 'xp' && profile.experiencePoints >= req.target) || (req.type === 'exercise_count' && userStatsService.getStatistics().completedExercises >= req.target)}
							<CheckCircle size={16} color="#4caf50" />
						{:else}
							<div class="circle-placeholder"></div>
						{/if}
						<span>{req.description}</span>
					</div>
				{/each}
			</div>

			<div class="exercises-grid">
				{#each currentLevel.unlockedExercises as exercise}
					<a href={resolve(exercise as any)} class="exercise-card">
						<div class="exercise-icon">🎵</div>
						<div class="exercise-content">
							<h3>{getExerciseName(exercise)}</h3>
							<span class="play-link">Start Practice <ArrowRight size={16} /></span>
						</div>
					</a>
				{/each}
			</div>
		</div>

		{#if nextLevel}
			<div class="level-card locked" in:fly={{ y: 20, duration: 500, delay: 200 }}>
				<div class="level-header">
					<div class="level-info">
						<span class="level-badge locked">Level {nextLevel.id}</span>
						<h2>{nextLevel.name}</h2>
					</div>
					<Lock size={24} class="lock-icon" />
				</div>
				<p class="level-description">{nextLevel.description}</p>
				<div class="locked-exercises">
					{#each nextLevel.unlockedExercises as exercise}
						<div class="locked-exercise">
							<Lock size={14} />
							<span>{getExerciseName(exercise)}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</section>
</div>

<style>
	.home-container {
		max-width: 900px;
		margin: 0 auto;
	}

	.hero {
		text-align: center;
		margin-bottom: 3rem;
	}

	h1 {
		font-size: 3rem;
		margin-bottom: 0.5rem;
		background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.subtitle {
		font-size: 1.2rem;
		color: rgba(255, 255, 255, 0.7);
	}

	.journey-section {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.level-card {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 1.5rem;
		padding: 2rem;
		backdrop-filter: blur(10px);
	}

	.level-card.current {
		background: linear-gradient(
			145deg,
			rgba(255, 255, 255, 0.1) 0%,
			rgba(255, 255, 255, 0.05) 100%
		);
		border: 1px solid rgba(255, 255, 255, 0.2);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
	}

	.level-card.locked {
		opacity: 0.7;
		filter: grayscale(0.5);
	}

	.level-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1.5rem;
	}

	.level-badge {
		background: #4caf50;
		color: white;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.8rem;
		font-weight: bold;
		text-transform: uppercase;
		margin-bottom: 0.5rem;
		display: inline-block;
	}

	.level-badge.locked {
		background: #6c757d;
	}

	.level-info h2 {
		margin: 0;
		font-size: 2rem;
	}

	.level-progress {
		width: 200px;
		text-align: right;
	}

	.progress-bar {
		height: 8px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 0.5rem;
	}

	.progress-fill {
		height: 100%;
		background: #4caf50;
		transition: width 0.5s ease;
	}

	.progress-text {
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.6);
	}

	.level-description {
		font-size: 1.1rem;
		color: rgba(255, 255, 255, 0.8);
		margin-bottom: 2rem;
		line-height: 1.6;
	}

	.requirements-list {
		margin-bottom: 2rem;
		background: rgba(0, 0, 0, 0.2);
		padding: 1.5rem;
		border-radius: 1rem;
	}

	.requirements-list h3 {
		margin: 0 0 1rem 0;
		font-size: 1rem;
		color: rgba(255, 255, 255, 0.9);
	}

	.requirement-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.5rem;
		color: rgba(255, 255, 255, 0.8);
	}

	.circle-placeholder {
		width: 16px;
		height: 16px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
	}

	.exercises-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
	}

	.exercise-card {
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 1rem;
		padding: 1.5rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		text-decoration: none;
		color: white;
		transition: all 0.2s;
	}

	.exercise-card:hover {
		background: rgba(255, 255, 255, 0.15);
		transform: translateY(-2px);
		border-color: rgba(255, 255, 255, 0.3);
	}

	.exercise-icon {
		font-size: 2rem;
	}

	.exercise-content h3 {
		margin: 0 0 0.25rem 0;
		font-size: 1.1rem;
	}

	.play-link {
		font-size: 0.9rem;
		color: #4caf50;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.locked-exercises {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.locked-exercise {
		background: rgba(0, 0, 0, 0.2);
		padding: 0.5rem 1rem;
		border-radius: 2rem;
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.6);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
