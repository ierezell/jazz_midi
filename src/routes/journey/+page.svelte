<svelte:options runes={true} />

<script lang="ts">
	import { journeyService, type Unit, type Lesson } from '$lib/JourneyService';
	import { userStatsService } from '$lib/UserStatsService';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { Star, Lock, Check, Play, MapPin, Flame, Zap, Trophy } from 'lucide-svelte';

	let units = $state(journeyService.getUnits());
	let profile = $state(userStatsService.getProfile());
	let stats = $state(userStatsService.getStatistics());

	onMount(() => {
		const unsubscribe = userStatsService.subscribe(() => {
			units = journeyService.getUnits();
			profile = userStatsService.getProfile();
			stats = userStatsService.getStatistics();
		});
		return unsubscribe;
	});

	function getLessonUrl(unit: Unit, lesson: Lesson) {
		return journeyService.getLessonUrl(unit, lesson);
	}
</script>

<svelte:head>
	<title>Your Journey - Jazz MIDI</title>
</svelte:head>

<div class="journey-container">
	<div class="stats-header" in:fade>
		<div class="stat-item">
			<Trophy size={20} class="text-yellow-400" />
			<div class="stat-info">
				<span class="stat-label">Level</span>
				<span class="stat-value">{profile.level}</span>
			</div>
		</div>
		<div class="stat-item">
			<Zap size={20} class="text-blue-400" />
			<div class="stat-info">
				<span class="stat-label">XP</span>
				<span class="stat-value">{profile.experiencePoints}</span>
			</div>
		</div>
		<div class="stat-item">
			<Flame size={20} class="text-orange-400" />
			<div class="stat-info">
				<span class="stat-label">Streak</span>
				<span class="stat-value">{stats.currentStreak} Days</span>
			</div>
		</div>
	</div>

	<header class="journey-header" in:fade>
		<h1>Your Jazz Journey</h1>
		<p>Master the art of jazz improvisation, step by step.</p>
	</header>

	<div class="path-container">
		{#each units as unit, i}
			<div class="unit-section" in:fly={{ y: 20, delay: i * 100 }}>
				<div class="unit-header" class:locked={unit.status === 'locked'}>
					<div class="unit-info">
						<h2 class={unit.color}>{unit.title}</h2>
						<p>{unit.description}</p>
					</div>
					<div class="unit-status">
						{#if unit.status === 'completed'}
							<span class="badge completed">Completed</span>
						{:else if unit.status === 'locked'}
							<span class="badge locked"><Lock size={14} /> Locked</span>
						{/if}
					</div>
				</div>

				<div class="lessons-grid">
					{#each unit.lessons as lesson}
						<a
							href={unit.status === 'locked' ? undefined : getLessonUrl(unit, lesson)}
							class="lesson-card"
							class:completed={lesson.completed}
							class:locked={unit.status === 'locked'}
						>
							<div class="lesson-icon">
								{#if lesson.completed}
									<Check size={24} />
								{:else if unit.status === 'locked'}
									<Lock size={24} />
								{:else}
									<Play size={24} />
								{/if}
							</div>
							<div class="lesson-content">
								<h3>{lesson.title}</h3>
								<div class="stars">
									{#each Array(3) as _, i}
										<Star
											size={14}
											class={i < lesson.stars ? 'star-filled' : 'star-empty'}
											fill={i < lesson.stars ? 'currentColor' : 'none'}
										/>
									{/each}
								</div>
							</div>
						</a>
					{/each}
				</div>
			</div>

			{#if i < units.length - 1}
				<div class="path-connector">
					<div class="line"></div>
				</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	.journey-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
		padding-top: 5rem; /* Space for fixed header */
	}

	.stats-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 60px;
		background: rgba(20, 20, 30, 0.95);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		justify-content: center;
		gap: 2rem;
		align-items: center;
		z-index: 100;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
	}

	.stat-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 1rem;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 2rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.stat-info {
		display: flex;
		flex-direction: column;
		line-height: 1.1;
	}

	.stat-label {
		font-size: 0.7rem;
		color: rgba(255, 255, 255, 0.5);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.stat-value {
		font-weight: bold;
		font-size: 0.9rem;
		color: white;
	}

	.text-yellow-400 {
		color: #facc15;
	}
	.text-blue-400 {
		color: #60a5fa;
	}
	.text-orange-400 {
		color: #fb923c;
	}

	.journey-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
		background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.path-container {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.unit-section {
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 1.5rem;
		padding: 2rem;
		position: relative;
		z-index: 1;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
	}

	.unit-section:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
		border-color: rgba(255, 255, 255, 0.15);
	}

	.unit-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 2rem;
	}

	.unit-header.locked {
		opacity: 0.5;
	}

	.unit-info h2 {
		font-size: 1.5rem;
		margin: 0 0 0.5rem 0;
	}

	.unit-info p {
		margin: 0;
		color: rgba(255, 255, 255, 0.6);
	}

	.badge {
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.8rem;
		font-weight: bold;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.badge.completed {
		background: rgba(76, 175, 80, 0.2);
		color: #4caf50;
	}

	.badge.locked {
		background: rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.5);
	}

	.lessons-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
	}

	.lesson-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 1rem;
		text-decoration: none;
		color: white;
		transition: all 0.2s;
	}

	.lesson-card:not(.locked):hover {
		transform: translateY(-2px);
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.2);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.lesson-card.completed {
		border-color: #4caf50;
		background: rgba(76, 175, 80, 0.1);
	}

	.lesson-card.locked {
		opacity: 0.5;
		cursor: not-allowed;
		pointer-events: none;
	}

	.lesson-icon {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		transition: transform 0.2s ease;
	}

	.lesson-card:not(.locked):hover .lesson-icon {
		transform: scale(1.1);
	}

	.lesson-card.completed .lesson-icon {
		background: #4caf50;
		color: white;
	}

	.lesson-content {
		flex: 1;
		min-width: 0;
	}

	.lesson-content h3 {
		margin: 0 0 0.25rem 0;
		font-size: 1rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.stars {
		display: flex;
		gap: 0.1rem;
		color: #ffd700;
	}

	.star-empty {
		opacity: 0.3;
	}

	.path-connector {
		height: 3rem;
		display: flex;
		justify-content: center;
		position: relative;
		z-index: 0;
	}

	.line {
		width: 2px;
		height: 100%;
		background: rgba(255, 255, 255, 0.1);
		border-left: 2px dashed rgba(255, 255, 255, 0.3);
	}

	/* Tailwind-like utility classes for colors */
	.bg-blue-500 {
		color: #60a5fa;
	}
	.bg-green-500 {
		color: #4ade80;
	}
	.bg-purple-500 {
		color: #c084fc;
	}

	@media (max-width: 600px) {
		.lessons-grid {
			grid-template-columns: 1fr;
		}
		.stats-header {
			gap: 1rem;
			padding: 0 1rem;
			justify-content: space-between;
		}
		.stat-item {
			padding: 0.25rem 0.5rem;
			gap: 0.5rem;
		}
		.stat-label {
			display: none;
		}
	}
</style>
