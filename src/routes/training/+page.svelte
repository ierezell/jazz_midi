<svelte:options runes={true} />

<script lang="ts">
	import {
		journeyService,
		type TrainingSession,
		type Lesson,
		type Pillar
	} from '$lib/JourneyService';
	import { userStatsService } from '$lib/UserStatsService';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import {
		Dumbbell,
		Brain,
		Music2,
		BookOpen,
		Play,
		CheckCircle2,
		Star,
		RefreshCw,
		Trophy,
		Flame,
		Home
	} from 'lucide-svelte';

	// --- State ----------------------------------------------------------------

	let activeUnit = $derived(journeyService.getActiveUnit());
	let session = $state<TrainingSession | undefined>(undefined);
	let completedInSession = $state<Set<string>>(new Set());
	let sessionStarted = $state(false);
	let sessionComplete = $state(false);
	let sessionXpGained = $state(0);

	// Pillar progress across all units
	let pillarProgress = $derived(journeyService.getPillarProgress());

	// On mount: generate session for active unit; handle returning from an exercise
	onMount(() => {
		if (activeUnit) {
			session = journeyService.generateTraining(activeUnit.id);
		}

		// If returning from an exercise that completed a lesson
		const unitId = page.url.searchParams.get('unitId');
		const lessonId = page.url.searchParams.get('lessonId');
		const stars = parseInt(page.url.searchParams.get('stars') ?? '0', 10);
		if (unitId && lessonId && stars > 0) {
			// completeLesson already called by BaseExercise before navigating back, so just track session
			completedInSession = new Set([...completedInSession, lessonId]);
			sessionXpGained += Math.max(0, 100 - (3 - stars) * 20);
			// Regenerate session so ordering updates
			if (activeUnit) session = journeyService.generateTraining(activeUnit.id);

			// Check if all session lessons are now done (completed or mastered in this session)
			if (session) {
				const allDone = session.lessons.every((l) => completedInSession.has(l.id) || l.completed);
				if (allDone && completedInSession.size > 0) {
					sessionComplete = true;
				}
			}
		}
	});

	// --- Helpers --------------------------------------------------------------

	const PILLAR_META: Record<Pillar, { label: string; icon: any; color: string }> = {
		technique: { label: 'Technique', icon: Dumbbell, color: '#22c55e' },
		theory: { label: 'Theory', icon: Brain, color: '#3b82f6' },
		vocabulary: { label: 'Vocabulary', icon: Music2, color: '#a855f7' },
		repertoire: { label: 'Repertoire', icon: BookOpen, color: '#f59e0b' }
	};

	const DIFFICULTY_LABEL: Record<string, string> = {
		beginner: '?? Beginner',
		intermediate: '?? Intermediate',
		advanced: '?? Advanced'
	};

	function pillarPct(p: Pillar): number {
		const { total, mastered } = pillarProgress[p];
		return total === 0 ? 0 : Math.round((mastered / total) * 100);
	}

	function startExercise(lesson: Lesson): void {
		if (!activeUnit) return;
		sessionStarted = true;
		const url = base + journeyService.getLessonUrl(activeUnit, lesson).replace(/^\/?\//, '/');
		window.location.assign(url);
	}

	function refreshSession(): void {
		if (activeUnit) {
			session = journeyService.generateTraining(activeUnit.id);
			completedInSession = new Set();
		}
	}

	function lessonDoneInSession(id: string): boolean {
		return completedInSession.has(id);
	}

	function dismissSessionComplete(): void {
		sessionComplete = false;
		completedInSession = new Set();
		sessionXpGained = 0;
		if (activeUnit) session = journeyService.generateTraining(activeUnit.id);
	}
</script>

<svelte:head>
	<title>Training — Jazz MIDI</title>
</svelte:head>

<div class="training-page">
	<!-- Header -->
	<header class="page-header">
		<div class="header-left">
			<h1>??? Daily Training</h1>
			{#if activeUnit}
				<span class="unit-badge">{activeUnit.title}</span>
				<span class="difficulty-badge">{DIFFICULTY_LABEL[activeUnit.difficulty]}</span>
			{/if}
		</div>
		{#if session}
			<div class="header-right">
				<span class="time-estimate">~{session.estimatedMinutes} min</span>
				<button type="button" class="icon-btn" onclick={refreshSession} title="Refresh session">
					<RefreshCw size={18} />
				</button>
			</div>
		{/if}
	</header>

	<!-- Pillar Progress Strip -->
	<section class="pillars-strip">
		{#each Object.entries(PILLAR_META) as [id, meta]}
			{@const pct = pillarPct(id as Pillar)}
			<div class="pillar-chip" style="--pc: {meta.color}">
				<meta.icon size={16} style="color: {meta.color}" />
				<span class="pillar-label">{meta.label}</span>
				<div class="pillar-bar">
					<div class="pillar-fill" style="width: {pct}%"></div>
				</div>
				<span class="pillar-pct">{pct}%</span>
			</div>
		{/each}
	</section>

	<!-- Session Complete Banner -->
	{#if sessionComplete}
		<section class="session-complete">
			<div class="session-complete-inner">
				<Trophy size={48} class="trophy-icon" />
				<h2>Session Complete! 🎉</h2>
				<p>You finished today's practice session.</p>
				<div class="session-stats">
					<div class="stat-chip">
						<Star size={18} fill="gold" stroke="gold" />
						<span
							>{completedInSession.size} lesson{completedInSession.size !== 1 ? 's' : ''} done</span
						>
					</div>
					<div class="stat-chip">
						<Flame size={18} style="color: #f59e0b" />
						<span>+{sessionXpGained} XP</span>
					</div>
					<div class="stat-chip">
						<CheckCircle2 size={18} style="color: var(--color-success)" />
						<span>Streak: {userStatsService.getStatistics().currentStreak} days</span>
					</div>
				</div>
				<div class="session-complete-actions">
					<button class="session-home-btn" onclick={() => goto(base + '/')}>
						<Home size={18} />
						Back to Home
					</button>
					<button class="session-more-btn" onclick={dismissSessionComplete}>
						<RefreshCw size={18} />
						Practice More
					</button>
				</div>
			</div>
		</section>
	{/if}

	<!-- Training Session -->
	{#if !sessionComplete && session && session.lessons.length > 0}
		<section class="session-section">
			<h2>Today's Session</h2>
			<ol class="lesson-list">
				{#each session.lessons as lesson, i}
					{@const done = lessonDoneInSession(lesson.id) || lesson.completed}
					{@const meta = PILLAR_META[lesson.pillar]}
					<li class="lesson-card" class:done style="--pc: {meta.color}">
						<span class="lesson-num">{i + 1}</span>
						<div class="lesson-body">
							<div class="lesson-top">
								<strong>{lesson.title}</strong>
								<span class="pillar-tag" style="color: {meta.color}">
									<meta.icon size={12} />
									{meta.label}
								</span>
							</div>
							<div class="lesson-stars">
								{#each [1, 2, 3] as s}
									<Star
										size={14}
										fill={lesson.stars >= s ? 'gold' : 'none'}
										stroke={lesson.stars >= s ? 'gold' : 'var(--color-text-muted)'}
									/>
								{/each}
								{#if lesson.perfectCompletions > 0}
									<span class="mastery-hint">
										{lesson.perfectCompletions}/{lesson.requiredPerfectCompletions} perfect
									</span>
								{/if}
							</div>
						</div>
						<div class="lesson-action">
							{#if lesson.completed}
								<CheckCircle2 size={28} class="done-icon" />
							{:else if lessonDoneInSession(lesson.id)}
								<CheckCircle2 size={28} class="session-done-icon" />
							{:else}
								<button type="button" class="go-btn" onclick={() => startExercise(lesson)}>
									<Play size={18} />
								</button>
							{/if}
						</div>
					</li>
				{/each}
			</ol>
		</section>
	{:else if !activeUnit}
		<div class="empty-state">
			<Trophy size={48} />
			<h2>All units complete!</h2>
			<p>You've mastered the full curriculum. Keep practising to maintain your skills.</p>
			<a href="{base}/journey" class="cta-btn">View Journey</a>
		</div>
	{/if}

	<!-- Unit Overview -->
	{#if activeUnit}
		<section class="unit-overview">
			<h2>Unit Progress</h2>
			<div class="all-lessons">
				{#each activeUnit.lessons as lesson}
					{@const meta = PILLAR_META[lesson.pillar]}
					<div class="overview-row" class:completed={lesson.completed}>
						{#if lesson.completed}
							<CheckCircle2 size={16} class="ov-done" />
						{:else}
							<div class="ov-dot" style="background: {meta.color}"></div>
						{/if}
						<span class="ov-title">{lesson.title}</span>
						<span class="ov-pillar" style="color: {meta.color}">{meta.label}</span>
						<span class="ov-stars">
							{#each [1, 2, 3] as s}
								<Star
									size={12}
									fill={lesson.stars >= s ? 'gold' : 'none'}
									stroke={lesson.stars >= s ? 'gold' : 'var(--color-text-muted)'}
								/>
							{/each}
						</span>
					</div>
				{/each}
			</div>
		</section>
	{/if}
</div>

<style>
	.training-page {
		max-width: 800px;
		margin: 0 auto;
		padding: 1rem 1.5rem 4rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.header-left {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.page-header h1 {
		margin: 0;
		font-size: 1.5rem;
		color: var(--color-text);
	}

	.unit-badge {
		font-size: 0.85rem;
		color: var(--color-text-muted);
	}

	.difficulty-badge {
		font-size: 0.8rem;
		color: var(--color-primary);
		font-weight: 600;
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.time-estimate {
		font-size: 0.9rem;
		color: var(--color-text-muted);
	}

	.icon-btn {
		background: none;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		padding: 0.4rem;
		cursor: pointer;
		color: var(--color-text-muted);
		display: flex;
		align-items: center;
		min-width: 44px;
		min-height: 44px;
		justify-content: center;
	}

	/* Pillar strip */
	.pillars-strip {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.75rem;
	}

	.pillar-chip {
		background: var(--color-surface-raised);
		border-radius: 10px;
		padding: 0.6rem 0.8rem;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		border-top: 3px solid var(--pc);
	}

	.pillar-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-text);
	}

	.pillar-bar {
		height: 5px;
		background: var(--color-surface);
		border-radius: 3px;
		overflow: hidden;
	}

	.pillar-fill {
		height: 100%;
		background: var(--pc);
		border-radius: 3px;
		transition: width 0.4s ease;
	}

	.pillar-pct {
		font-size: 0.7rem;
		color: var(--color-text-muted);
		align-self: flex-end;
	}

	/* Session */
	.session-section h2,
	.unit-overview h2 {
		margin: 0 0 0.75rem;
		font-size: 1.1rem;
		color: var(--color-text);
	}

	.lesson-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.lesson-card {
		display: grid;
		grid-template-columns: 28px 1fr 44px;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		background: var(--color-surface-raised);
		border-radius: 10px;
		border-left: 4px solid var(--pc);
		transition: opacity 0.2s;
	}

	.lesson-card.done {
		opacity: 0.55;
	}

	.lesson-num {
		width: 28px;
		height: 28px;
		background: var(--pc);
		color: #fff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 0.85rem;
		flex-shrink: 0;
	}

	.lesson-body {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		min-width: 0;
	}

	.lesson-top {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.lesson-top strong {
		font-size: 0.9rem;
		color: var(--color-text);
	}

	.pillar-tag {
		font-size: 0.7rem;
		display: flex;
		align-items: center;
		gap: 0.2rem;
		font-weight: 500;
	}

	.lesson-stars {
		display: flex;
		align-items: center;
		gap: 0.15rem;
	}

	.mastery-hint {
		font-size: 0.7rem;
		color: var(--color-text-muted);
		margin-left: 0.35rem;
	}

	.lesson-action {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.go-btn {
		background: var(--color-primary);
		color: #fff;
		border: none;
		border-radius: 50%;
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: transform 0.15s;
	}

	.go-btn:hover {
		transform: scale(1.1);
	}

	:global(.done-icon) {
		color: var(--color-success);
	}
	:global(.session-done-icon) {
		color: var(--color-primary);
	}

	/* Unit overview */
	.all-lessons {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.overview-row {
		display: grid;
		grid-template-columns: 20px 1fr auto auto;
		align-items: center;
		gap: 0.6rem;
		padding: 0.4rem 0.5rem;
		border-radius: 6px;
		font-size: 0.82rem;
	}

	.overview-row.completed {
		opacity: 0.6;
	}

	.ov-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}

	:global(.ov-done) {
		color: var(--color-success);
	}

	.ov-title {
		color: var(--color-text);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.ov-pillar {
		font-size: 0.72rem;
		font-weight: 500;
	}

	.ov-stars {
		display: flex;
		gap: 0.1rem;
	}

	/* Empty state */
	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
		color: var(--color-text-muted);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.cta-btn {
		background: var(--color-primary);
		color: #fff;
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		text-decoration: none;
		font-weight: 600;
	}

	@media (max-width: 600px) {
		.pillars-strip {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	/* Session complete */
	.session-complete {
		background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%);
		border: 1px solid rgba(76, 175, 80, 0.4);
		border-radius: 1.25rem;
		padding: 2rem 1.5rem;
	}

	.session-complete-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		text-align: center;
	}

	.session-complete h2 {
		margin: 0;
		font-size: 1.6rem;
		color: var(--color-text);
	}

	.session-complete p {
		margin: 0;
		color: var(--color-text-muted);
	}

	:global(.trophy-icon) {
		color: #ffd700;
		filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.5));
	}

	.session-stats {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.stat-chip {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		background: var(--color-surface-raised);
		padding: 0.4rem 0.8rem;
		border-radius: 20px;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.session-complete-actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}

	.session-home-btn,
	.session-more-btn {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.65rem 1.25rem;
		border-radius: 10px;
		font-weight: 600;
		cursor: pointer;
		border: none;
		font-size: 0.95rem;
		transition: transform 0.15s;
	}

	.session-home-btn:hover,
	.session-more-btn:hover {
		transform: translateY(-2px);
	}

	.session-home-btn {
		background: var(--color-surface-raised);
		color: var(--color-text);
	}

	.session-more-btn {
		background: var(--color-primary);
		color: #fff;
	}

	@media (max-width: 480px) {
		.session-complete-actions {
			flex-direction: column;
			width: 100%;
		}
		.session-home-btn,
		.session-more-btn {
			width: 100%;
			justify-content: center;
		}
	}

	@media (orientation: landscape) and (max-height: 600px) {
		.training-page {
			padding: 0.5rem 1rem 0.5rem;
		}
		.overview-row {
			padding: 0.25rem 0.5rem;
		}
		.session-complete {
			padding: 1rem;
		}
	}
</style>
