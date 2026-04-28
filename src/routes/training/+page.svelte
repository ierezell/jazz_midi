<svelte:options runes={true} />

<script lang="ts">
	import { curriculumEngine, type Pillar, CURRICULUM, type WorkoutSession } from '$lib/CurriculumEngine';
	import { 
		Dumbbell, 
		Brain, 
		Music2, 
		BookOpen, 
		Target, 
		TrendingUp, 
		AlertTriangle,
		CheckCircle2,
		Lock,
		Play,
		RotateCcw,
		Clock,
		Zap,
		Award
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';

	let selectedPillar: Pillar | undefined = $state(undefined);
	let currentWorkout: WorkoutSession | null = $state(null);
	let showWorkout = $state(false);
	let workoutDuration = $state(20); // minutes

	// Computed data
	let pillarStats = $derived(curriculumEngine.getPillarStats());
	let weaknesses = $derived(curriculumEngine.identifyWeaknesses());
	let availableSkills = $derived(curriculumEngine.getAvailableSkills());
	let recommendedFocus = $derived(curriculumEngine.getRecommendedFocus());
	let learningPath = $derived(curriculumEngine.getLearningPath());

	const pillars: { id: Pillar; name: string; icon: any; color: string; desc: string }[] = [
		{ id: 'technique', name: 'Technique', icon: Dumbbell, color: '#22c55e', desc: 'Physical dexterity & jazz touch' },
		{ id: 'theory', name: 'Theory', icon: Brain, color: '#3b82f6', desc: 'Mental mapping & ear training' },
		{ id: 'vocabulary', name: 'Vocabulary', icon: Music2, color: '#a855f7', desc: 'Patterns & transposition' },
		{ id: 'repertoire', name: 'Repertoire', icon: BookOpen, color: '#f59e0b', desc: 'Real songs & application' }
	];

	function generateWorkout() {
		currentWorkout = curriculumEngine.generateWorkout({
			duration: workoutDuration,
			focusPillar: selectedPillar,
			includeWeaknesses: true
		});
		showWorkout = true;
	}

	function startExercise(route: string) {
		goto(resolve(route as any));
	}

	function getStatusIcon(status: string) {
		switch (status) {
			case 'mastered': return CheckCircle2;
			case 'in-progress': return Play;
			case 'available': return Target;
			default: return Lock;
		}
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case 'mastered': return 'var(--color-success)';
			case 'in-progress': return 'var(--color-primary)';
			case 'available': return 'var(--color-warn)';
			default: return 'var(--color-text-muted)';
		}
	}
</script>

<div class="training-page">
	<header class="page-header">
		<h1>🏋️ Your Training Plan</h1>
		<p class="subtitle">Personalized workouts based on your weaknesses and the jazz curriculum</p>
	</header>

	<!-- Pillar Stats Overview -->
	<div class="pillars-grid">
		{#each pillars as pillar}
			{@const stats = pillarStats[pillar.id]}
			<div 
				class="pillar-card" 
				class:recommended={recommendedFocus.pillar === pillar.id}
				style="--pillar-color: {pillar.color}"
				onclick={() => selectedPillar = pillar.id}
			>
				<div class="pillar-header">
					<pillar.icon size={28} style="color: {pillar.color}" />
					<h3>{pillar.name}</h3>
					{#if recommendedFocus.pillar === pillar.id}
						<span class="recommended-badge">Recommended</span>
					{/if}
				</div>
				<p class="pillar-desc">{pillar.desc}</p>
				<div class="pillar-progress">
					<div class="progress-bar">
						<div class="progress-fill" style="width: {(stats.mastered / stats.total) * 100}%; background: {pillar.color}"></div>
					</div>
					<span class="progress-text">{stats.mastered}/{stats.total} • {stats.averageAccuracy}% avg</span>
				</div>
			</div>
		{/each}
	</div>

	<!-- Recommendation Banner -->
	<div class="recommendation-banner card-premium">
		<div class="rec-content">
			<Zap size={32} class="rec-icon" />
			<div>
				<h3>Today's Focus: {pillars.find(p => p.id === recommendedFocus.pillar)?.name}</h3>
				<p>{recommendedFocus.reason}</p>
			</div>
		</div>
		<button class="primary-btn" onclick={() => { selectedPillar = recommendedFocus.pillar; generateWorkout(); }}>
			Start Recommended Workout
		</button>
	</div>

	<!-- Weaknesses Alert -->
	{#if weaknesses.length > 0}
		<div class="weaknesses-section card-premium">
			<h3><AlertTriangle size={20} /> Areas Needing Attention</h3>
			<div class="weakness-list">
				{#each weaknesses.slice(0, 3) as weakness}
					{@const skill = CURRICULUM.find(s => s.id === weakness.skillId)}
					{#if skill}
						<div class="weakness-item">
							<div class="weakness-info">
								<strong>{skill.name}</strong>
								<span class="weakness-pillar">{skill.pillar}</span>
							</div>
							<div class="weakness-stats">
								<span class="accuracy-badge low">{weakness.averageAccuracy}% accuracy</span>
								<button class="practice-btn" onclick={() => startExercise(skill.exercises[0])}>
									Practice
								</button>
							</div>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	{/if}

	<!-- Workout Generator -->
	<div class="workout-generator card-premium">
		<h3>🎯 Generate Custom Workout</h3>
		<div class="generator-controls">
			<div class="duration-control">
				<label>Duration: {workoutDuration} min</label>
				<input type="range" min="10" max="60" step="5" bind:value={workoutDuration} />
			</div>
			<div class="pillar-filter">
				<label>Focus (optional):</label>
				<div class="pillar-buttons">
					<button class="pillar-btn" class:active={!selectedPillar} onclick={() => selectedPillar = undefined}>All</button>
					{#each pillars as pillar}
						<button 
							class="pillar-btn" 
							class:active={selectedPillar === pillar.id}
							style="--btn-color: {pillar.color}"
							onclick={() => selectedPillar = pillar.id}
						>
							{pillar.name}
						</button>
					{/each}
				</div>
			</div>
			<button class="generate-btn" onclick={generateWorkout}>
				<Dumbbell size={20} />
				Generate {workoutDuration}-Min Workout
			</button>
		</div>
	</div>

	<!-- Current Workout -->
	{#if showWorkout && currentWorkout}
		<div class="workout-session card-premium">
			<div class="workout-header">
				<h3>💪 Your Personalized Workout</h3>
				<div class="workout-meta">
					<span><Clock size={16} /> {currentWorkout.duration} min</span>
					{#if currentWorkout.weaknessBased}
						<span class="weakness-tag">Targets Weaknesses</span>
					{/if}
				</div>
			</div>
			
			<div class="exercise-list">
				{#each currentWorkout.exercises as exercise, i}
					<div class="exercise-item" style="--ex-color: {pillars.find(p => p.id === exercise.pillar)?.color}">
						<div class="ex-number">{i + 1}</div>
						<div class="ex-content">
							<div class="ex-header">
								<strong>{exercise.skillName}</strong>
								<span class="ex-purpose" class:weakness={exercise.purpose === 'weakness'}>{exercise.purpose}</span>
							</div>
							<div class="ex-meta">
								<span class="ex-pillar">{exercise.pillar}</span>
								<span class="ex-difficulty">{exercise.difficulty}</span>
								<span class="ex-duration">{exercise.duration} min</span>
							</div>
						</div>
						<button class="start-ex-btn" onclick={() => startExercise(exercise.route)}>
							<Play size={18} />
						</button>
					</div>
				{/each}
			</div>
			
			<button class="close-btn" onclick={() => showWorkout = false}>Close</button>
		</div>
	{/if}

	<!-- Learning Path / Curriculum -->
	<div class="curriculum-section card-premium">
		<h3><TrendingUp size={20} /> Full Curriculum Path</h3>
		<div class="curriculum-list">
			{#each learningPath.filter(item => item.status !== 'locked').slice(0, 10) as item}
				<div class="curriculum-item" class:mastered={item.status === 'mastered'}>
					<div class="item-status" style="color: {getStatusColor(item.status)}">
						<svelte:component this={getStatusIcon(item.status)} size={20} />
					</div>
					<div class="item-content">
						<strong>{item.skill.name}</strong>
						<p>{item.skill.description}</p>
						{#if item.progress}
							<div class="item-progress">
								<div class="mini-bar">
									<div class="mini-fill" style="width: {item.progress.accuracy}%"></div>
								</div>
								<span>{item.progress.accuracy}% • {item.progress.timesPracticed}×</span>
							</div>
						{/if}
					</div>
					<button 
						class="item-action" 
						disabled={item.status === 'locked'}
						onclick={() => item.status !== 'locked' && startExercise(item.skill.exercises[0])}
					>
						{item.status === 'mastered' ? 'Review' : item.status === 'locked' ? 'Locked' : 'Practice'}
					</button>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.training-page {
		max-width: 1000px;
		margin: 0 auto;
		padding: 2rem;
	}

	.page-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.page-header h1 {
		font-size: 2.5rem;
		font-weight: 800;
		background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		color: var(--color-text-muted);
		font-size: 1.1rem;
	}

	.pillars-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.pillar-card {
		background: var(--color-surface);
		border: 2px solid var(--color-border);
		border-radius: 12px;
		padding: 1.5rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.pillar-card:hover {
		border-color: var(--pillar-color);
		transform: translateY(-2px);
	}

	.pillar-card.recommended {
		border-color: var(--pillar-color);
		box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.2);
	}

	.pillar-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.5rem;
	}

	.pillar-header h3 {
		margin: 0;
		color: var(--color-text);
	}

	.recommended-badge {
		font-size: 0.7rem;
		background: var(--color-primary);
		color: white;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		margin-left: auto;
	}

	.pillar-desc {
		font-size: 0.9rem;
		color: var(--color-text-muted);
		margin-bottom: 1rem;
	}

	.pillar-progress {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.progress-bar {
		height: 6px;
		background: var(--color-surface-raised);
		border-radius: 3px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		transition: width 0.3s;
	}

	.progress-text {
		font-size: 0.8rem;
		color: var(--color-text-muted);
	}

	.recommendation-banner {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		margin-bottom: 2rem;
		background: linear-gradient(135deg, rgba(88, 166, 255, 0.1), rgba(139, 92, 246, 0.1));
		border-color: var(--color-primary);
	}

	.rec-content {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.rec-icon {
		color: var(--color-primary);
	}

	.rec-content h3 {
		margin: 0 0 0.25rem 0;
		color: var(--color-text);
	}

	.rec-content p {
		margin: 0;
		color: var(--color-text-muted);
	}

	.primary-btn {
		background: var(--color-primary);
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.primary-btn:hover {
		transform: scale(1.05);
	}

	.weaknesses-section {
		padding: 1.5rem;
		margin-bottom: 2rem;
		border-left: 4px solid var(--color-error);
	}

	.weaknesses-section h3 {
		margin: 0 0 1rem 0;
		color: var(--color-text);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.weakness-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.weakness-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background: var(--color-surface-raised);
		border-radius: 8px;
	}

	.weakness-info {
		display: flex;
		flex-direction: column;
	}

	.weakness-info strong {
		color: var(--color-text);
	}

	.weakness-pillar {
		font-size: 0.8rem;
		color: var(--color-text-muted);
		text-transform: capitalize;
	}

	.weakness-stats {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.accuracy-badge {
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.8rem;
		font-weight: 600;
	}

	.accuracy-badge.low {
		background: rgba(239, 68, 68, 0.2);
		color: var(--color-error);
	}

	.practice-btn {
		background: var(--color-primary);
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		font-size: 0.85rem;
		cursor: pointer;
	}

	.workout-generator {
		padding: 1.5rem;
		margin-bottom: 2rem;
	}

	.workout-generator h3 {
		margin: 0 0 1.5rem 0;
		color: var(--color-text);
	}

	.generator-controls {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.duration-control {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.duration-control input {
		width: 100%;
	}

	.pillar-filter {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.pillar-buttons {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.pillar-btn {
		padding: 0.5rem 1rem;
		border: 1px solid var(--color-border);
		background: var(--color-surface-raised);
		color: var(--color-text);
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.pillar-btn.active {
		background: var(--btn-color);
		color: white;
		border-color: var(--btn-color);
	}

	.generate-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		background: var(--color-success);
		color: white;
		border: none;
		padding: 1rem 2rem;
		border-radius: 8px;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.generate-btn:hover {
		transform: scale(1.02);
	}

	.workout-session {
		padding: 1.5rem;
		margin-bottom: 2rem;
		border: 2px solid var(--color-success);
	}

	.workout-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.workout-header h3 {
		margin: 0;
		color: var(--color-text);
	}

	.workout-meta {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.weakness-tag {
		background: var(--color-error);
		color: white;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
	}

	.exercise-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.exercise-item {
		display: grid;
		grid-template-columns: 40px 1fr 50px;
		gap: 1rem;
		align-items: center;
		padding: 1rem;
		background: var(--color-surface-raised);
		border-radius: 8px;
		border-left: 3px solid var(--ex-color);
	}

	.ex-number {
		width: 32px;
		height: 32px;
		background: var(--ex-color);
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
	}

	.ex-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.ex-header {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.ex-purpose {
		font-size: 0.7rem;
		padding: 0.1rem 0.4rem;
		border-radius: 3px;
		background: var(--color-surface);
		color: var(--color-text-muted);
		text-transform: uppercase;
	}

	.ex-purpose.weakness {
		background: var(--color-error);
		color: white;
	}

	.ex-meta {
		display: flex;
		gap: 0.75rem;
		font-size: 0.8rem;
		color: var(--color-text-muted);
	}

	.ex-pillar {
		text-transform: capitalize;
	}

	.start-ex-btn {
		background: var(--color-primary);
		color: white;
		border: none;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	.close-btn {
		width: 100%;
		background: var(--color-surface-raised);
		color: var(--color-text);
		border: 1px solid var(--color-border);
		padding: 0.75rem;
		border-radius: 6px;
		cursor: pointer;
	}

	.curriculum-section {
		padding: 1.5rem;
	}

	.curriculum-section h3 {
		margin: 0 0 1rem 0;
		color: var(--color-text);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.curriculum-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.curriculum-item {
		display: grid;
		grid-template-columns: 30px 1fr 100px;
		gap: 1rem;
		align-items: center;
		padding: 0.75rem 1rem;
		background: var(--color-surface-raised);
		border-radius: 8px;
		opacity: 0.7;
	}

	.curriculum-item.mastered {
		opacity: 1;
		background: rgba(34, 197, 94, 0.1);
	}

	.item-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.item-content strong {
		color: var(--color-text);
	}

	.item-content p {
		margin: 0;
		font-size: 0.85rem;
		color: var(--color-text-muted);
	}

	.item-progress {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}

	.mini-bar {
		width: 60px;
		height: 4px;
		background: var(--color-surface);
		border-radius: 2px;
		overflow: hidden;
	}

	.mini-fill {
		height: 100%;
		background: var(--color-success);
	}

	.item-action {
		padding: 0.5rem;
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 0.8rem;
		cursor: pointer;
	}

	.item-action:disabled {
		background: var(--color-surface);
		color: var(--color-text-muted);
		cursor: not-allowed;
	}

	@media (max-width: 768px) {
		.training-page {
			padding: 1rem;
		}

		.recommendation-banner {
			flex-direction: column;
			gap: 1rem;
			text-align: center;
		}

		.weakness-item {
			flex-direction: column;
			gap: 0.5rem;
			align-items: flex-start;
		}

		.exercise-item {
			grid-template-columns: 35px 1fr 45px;
		}
	}
</style>
