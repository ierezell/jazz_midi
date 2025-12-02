<script lang="ts">
	import { journeyService } from '$lib/JourneyService';
	import { userStatsService } from '$lib/UserStatsService';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { ArrowRight, CheckCircle, Star } from 'lucide-svelte';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';

	let profile = $state(userStatsService.getProfile());
	let units = $state(journeyService.getUnits());
	let activeUnit = $derived(units.find((u) => u.status === 'active') || units[0]);

	onMount(() => {
		// Redirect to login if using default profile
		if (profile.name === 'Jazz Student' && profile.experiencePoints === 0) {
			goto('/login');
			return;
		}

		const unsubscribe = userStatsService.subscribe(() => {
			profile = userStatsService.getProfile();
			units = journeyService.getUnits();
		});
		return unsubscribe;
	});

	function getExerciseName(path: string): string {
		const parts = path.split('/');
		const name = parts[parts.length - 1];
		return name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' ');
	}

	function getLessonUrl(lessonPath: string): string {
		// For home page, just link directly to exercises
		return lessonPath;
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

	<section class="dashboard-grid" in:fade>
		<div class="dashboard-card daily">
			<div class="card-header">
				<h2>Daily Practice</h2>
				<span class="badge">Recommended</span>
			</div>
			<p>Keep your streak alive! Practice a lesson from your current unit.</p>
			<button
				class="action-btn"
				onclick={() =>
					goto(
						journeyService.getLessonUrl(
							activeUnit,
							journeyService.getPracticeLesson(activeUnit.id)?.lesson || activeUnit.lessons[0]
						)
					)}
			>
				Start Daily Practice <ArrowRight size={16} />
			</button>
		</div>

		<div class="dashboard-card weakness">
			<div class="card-header">
				<h2>Work on Weaknesses</h2>
				<span class="badge">Improve</span>
			</div>
			{#if userStatsService.getWeaknessRecommendations().length > 0}
				<p>Focus on what needs improvement based on your history.</p>
				<div class="recommendations-list">
					{#each userStatsService.getWeaknessRecommendations().slice(0, 2) as rec}
						<a href={rec.path} class="recommendation-link">
							<span>{rec.recommendedExercise}</span>
							<ArrowRight size={14} />
						</a>
					{/each}
				</div>
			{:else}
				<p>No specific weaknesses detected yet. Keep practicing!</p>
				<button class="action-btn secondary" onclick={() => goto('/journey')}>
					Explore Journey <ArrowRight size={16} />
				</button>
			{/if}
		</div>
	</section>

	<section class="journey-section">
		<div class="level-card current" in:fly={{ y: 20, duration: 500 }}>
			<div class="level-header">
				<div class="level-info">
					<span class="level-badge">Active Unit</span>
					<h2>{activeUnit.title}</h2>
				</div>
				<div class="stats-display">
					<div class="stat-item">
						<Star size={20} fill="#ffd700" color="#ffd700" />
						<span>{profile.experiencePoints} XP</span>
					</div>
				</div>
			</div>
			<p class="level-description">{activeUnit.description}</p>

			<div class="lessons-section">
				<h3>Continue Learning:</h3>
				<div class="exercises-grid">
					{#each activeUnit.lessons as lesson}
						<a
							href={journeyService.getLessonUrl(activeUnit, lesson)}
							class="exercise-card"
							class:completed={lesson.completed}
						>
							<div class="exercise-icon">
								{#if lesson.completed}
									<CheckCircle size={32} color="#4caf50" />
								{:else}
									🎵
								{/if}
							</div>
							<div class="exercise-content">
								<h3>{lesson.title}</h3>
								{#if lesson.completed}
									<div class="stars">
										{#each Array(lesson.stars) as _}
											<Star size={12} fill="#ffd700" color="#ffd700" />
										{/each}
									</div>
								{:else}
									<span class="play-link">Start Practice <ArrowRight size={16} /></span>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			</div>
		</div>

		<div class="quick-links" in:fly={{ y: 20, duration: 500, delay: 200 }}>
			<a href="/journey" class="link-card">
				<h3>View Full Journey Map</h3>
				<p>See all units and track your progress</p>
				<ArrowRight size={20} />
			</a>
			<a href="/profile" class="link-card">
				<h3>Your Profile</h3>
				<p>Check stats and achievements</p>
				<ArrowRight size={20} />
			</a>
		</div>
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
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.subtitle {
		font-size: 1.2rem;
		color: rgba(0, 0, 0, 0.7);
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

	.level-info h2 {
		margin: 0;
		font-size: 2rem;
	}

	.stats-display {
		display: flex;
		gap: 1rem;
	}

	.stat-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: bold;
		color: rgb(0, 0, 0);
	}

	.level-description {
		font-size: 1.1rem;
		color: rgba(0, 0, 0, 0.8);
		margin-bottom: 2rem;
		line-height: 1.6;
	}

	.lessons-section h3 {
		margin: 0 0 1rem 0;
		font-size: 1.2rem;
		color: rgba(0, 0, 0, 0.9);
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

	.exercise-card.completed {
		border-color: #4caf50;
		background: rgba(76, 175, 80, 0.1);
	}

	.exercise-icon {
		font-size: 2rem;
		flex-shrink: 0;
	}

	.exercise-content h3 {
		margin: 0 0 0.25rem 0;
		font-size: 1.1rem;
	}

	.stars {
		display: flex;
		gap: 0.1rem;
	}

	.play-link {
		font-size: 0.9rem;
		color: #4caf50;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.quick-links {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
	}

	.link-card {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 1rem;
		padding: 1.5rem;
		text-decoration: none;
		color: rgb(0, 0, 0);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		transition: all 0.2s;
	}

	.link-card:hover {
		background: rgba(255, 255, 255, 0.1);
		transform: translateY(-2px);
		border-color: rgba(255, 255, 255, 0.2);
	}

	.link-card h3 {
		margin: 0;
		font-size: 1.2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.link-card p {
		margin: 0;
		color: rgba(0, 0, 0, 0.6);
		font-size: 0.9rem;
	}
	.dashboard-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.dashboard-card {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 1.5rem;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		transition: transform 0.2s;
	}

	.dashboard-card:hover {
		transform: translateY(-2px);
		background: rgba(255, 255, 255, 0.08);
	}

	.dashboard-card.daily {
		border-left: 4px solid #a5b4fc;
	}

	.dashboard-card.weakness {
		border-left: 4px solid #fca5a5;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.card-header h2 {
		font-size: 1.5rem;
		margin: 0;
	}

	.action-btn {
		margin-top: auto;
		padding: 0.75rem 1rem;
		background: white;
		color: black;
		border: none;
		border-radius: 0.5rem;
		font-weight: bold;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		transition: background 0.2s;
	}

	.action-btn:hover {
		background: #f0f0f0;
	}

	.action-btn.secondary {
		background: rgba(255, 255, 255, 0.1);
		color: white;
	}

	.recommendations-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.recommendation-link {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem;
		background: rgba(0, 0, 0, 0.2);
		border-radius: 0.5rem;
		color: white;
		text-decoration: none;
		font-size: 0.9rem;
		transition: background 0.2s;
	}

	.recommendation-link:hover {
		background: rgba(0, 0, 0, 0.3);
	}
</style>
