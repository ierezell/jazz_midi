<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ComponentType, SvelteComponent } from 'svelte';
	import {
		Dumbbell,
		Music,
		Zap,
		Ruler,
		BookOpen,
		Mic2,
		Grid,
		Key,
		Guitar,
		Piano,
		Fingerprint,
		RefreshCw,
		Layers
	} from 'lucide-svelte';

	type Difficulty = 'beginner' | 'intermediate' | 'advanced';

	const exercises: {
		title: string;
		description: string;
		href: string;
		icon: ComponentType<SvelteComponent>;
		color: string;
		difficulty: Difficulty;
	}[] = [
		{
			title: 'Rhythm',
			description:
				'Master timing and two-hand coordination. Play patterns in sync with the metronome.',
			href: resolve('/exercises/rhythm'),
			icon: Dumbbell,
			color: 'var(--color-primary)',
			difficulty: 'beginner'
		},
		{
			title: 'Note Names',
			description: 'Identify notes on the staff instantly. Build your music reading foundation.',
			href: resolve('/exercises/names'),
			icon: Music,
			color: 'var(--color-secondary)',
			difficulty: 'beginner'
		},
		{
			title: 'Intervals',
			description:
				'Recognize distances between notes by ear and by sight. Essential for improvisation.',
			href: resolve('/exercises/intervals'),
			icon: Ruler,
			color: 'var(--color-success)',
			difficulty: 'beginner'
		},
		{
			title: 'Chords',
			description:
				'Build major, minor, dominant 7th and rootless voicings — the jazz harmony toolkit.',
			href: resolve('/exercises/chords'),
			icon: Grid,
			color: 'var(--color-warn)',
			difficulty: 'intermediate'
		},
		{
			title: 'Scales',
			description: 'Practice major scales, modes, and jazz scales in all 12 keys with correct fingering.',
			href: resolve('/exercises/scales'),
			icon: Key,
			color: 'var(--color-primary)',
			difficulty: 'beginner'
		},
		{
			title: 'Licks',
			description: 'Learn classic jazz vocabulary. Practice real licks used by jazz masters.',
			href: resolve('/exercises/licks'),
			icon: Guitar,
			color: 'var(--color-secondary)',
			difficulty: 'intermediate'
		},
		{
			title: 'Flashcards',
			description: 'Rapid-fire theory drills to reinforce notes, chords and scales under pressure.',
			href: resolve('/exercises/flashcards'),
			icon: Zap,
			color: 'var(--color-error)',
			difficulty: 'beginner'
		},
		{
			title: 'Sight Reading',
			description: 'Read and play sheet music in real time. Train your eyes and hands together.',
			href: resolve('/exercises/partition'),
			icon: BookOpen,
			color: 'var(--color-level-5)',
			difficulty: 'intermediate'
		},
		{
			title: 'Songs',
			description: 'Apply everything to real jazz standards. The ultimate test of your skills.',
			href: resolve('/exercises/songs'),
			icon: Mic2,
			color: 'var(--color-rh)',
			difficulty: 'advanced'
		},
		{
			title: 'II-V-I',
			description: 'Master the most important chord progression in jazz across all 12 keys.',
			href: resolve('/exercises/two_five_ones'),
			icon: RefreshCw,
			color: 'var(--color-lh)',
			difficulty: 'intermediate'
		},
		{
			title: 'Boogie',
			description: 'Learn boogie-woogie left-hand patterns — the rhythmic foundation of jazz and blues.',
			href: resolve('/exercises/boogie'),
			icon: Piano,
			color: 'var(--color-warn)',
			difficulty: 'intermediate'
		},
		{
			title: 'Dexterity',
			description: 'Build finger speed and accuracy with targeted technical exercises.',
			href: resolve('/exercises/dexterity'),
			icon: Fingerprint,
			color: 'var(--color-success)',
			difficulty: 'intermediate'
		},
		{
			title: 'Hand Independence',
			description: 'Train your hands to work independently. LH comps while RH plays melody.',
			href: resolve('/exercises/hand_independence'),
			icon: Layers,
			color: 'var(--color-level-3)',
			difficulty: 'advanced'
		}
	];

	const difficultyLabel: Record<Difficulty, string> = {
		beginner: 'Beginner',
		intermediate: 'Intermediate',
		advanced: 'Advanced'
	};
</script>

<div class="gym-dashboard">
	<header class="dashboard-header">
		<h1>The Gym</h1>
		<p class="subtitle">Your daily workout for musical mastery.</p>
	</header>

	<div class="exercise-grid">
		{#each exercises as exercise}
			<a href={exercise.href} class="exercise-card card-premium">
				<div class="card-top">
					<div class="icon-wrapper" style="color: {exercise.color}">
						<exercise.icon size={32} />
					</div>
					<span class="difficulty-badge difficulty-{exercise.difficulty}">
						{difficultyLabel[exercise.difficulty]}
					</span>
				</div>
				<div class="content">
					<h3>{exercise.title}</h3>
					<p>{exercise.description}</p>
				</div>
				<div class="glow" style="background: {exercise.color}"></div>
			</a>
		{/each}
	</div>
</div>

<style>
	.gym-dashboard {
		max-width: 1200px;
		margin: 0 auto;
		animation: fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.dashboard-header {
		text-align: center;
		margin-bottom: 4rem;
		position: relative;
	}

	h1 {
		font-size: 3.5rem;
		font-weight: 800;
		margin-bottom: 1rem;
		color: var(--color-primary); /* Fallback if gradient unsupported */
		background-image: var(--header-gradient);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		letter-spacing: -0.02em;
	}

	.subtitle {
		font-size: 1.25rem;
		color: var(--color-text-muted);
		max-width: 600px;
		margin: 0 auto;
		line-height: 1.6;
	}

	.exercise-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 2rem;
		padding-bottom: 4rem;
	}

	/* Collapse to 2 columns on narrow viewports, 1 on phone */
	@media (max-width: 640px) {
		.exercise-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 1rem;
		}
	}

	@media (max-width: 400px) {
		.exercise-grid {
			grid-template-columns: 1fr;
			gap: 0.75rem;
		}
	}

	.exercise-card {
		position: relative;
		text-decoration: none;
		color: var(--color-text);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		align-items: flex-start;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		background: var(--card-bg);
		backdrop-filter: blur(12px);
		border-color: var(--color-border);
	}

	.exercise-card:hover {
		transform: translateY(-8px) scale(1.02);
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
		border-color: var(--color-primary);
	}

	/* Row: icon left, badge right */
	.card-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.icon-wrapper {
		background: var(--color-surface-raised);
		padding: 0.875rem;
		border-radius: 14px;
		border: 1px solid var(--color-border);
		transition: transform 0.4s ease;
		line-height: 0; /* prevents extra height from inline icon */
	}

	.exercise-card:hover .icon-wrapper {
		transform: scale(1.1) rotate(5deg);
	}

	/* Difficulty badge */
	.difficulty-badge {
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		padding: 0.2rem 0.55rem;
		border-radius: 999px;
		border: 1px solid currentColor;
		white-space: nowrap;
		/* color is set per modifier below */
	}

	.difficulty-beginner {
		color: var(--color-success);
		background: color-mix(in srgb, var(--color-success) 12%, transparent);
	}

	.difficulty-intermediate {
		color: var(--color-warn);
		background: color-mix(in srgb, var(--color-warn) 12%, transparent);
	}

	.difficulty-advanced {
		color: var(--color-error);
		background: color-mix(in srgb, var(--color-error) 12%, transparent);
	}

	.content {
		flex: 1;
	}

	.content h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text);
	}

	.content p {
		margin: 0;
		color: var(--color-text-muted);
		font-size: 0.9rem;
		line-height: 1.6;
	}

	.glow {
		position: absolute;
		top: 0;
		right: 0;
		width: 180px;
		height: 180px;
		border-radius: 50%;
		filter: blur(55px);
		opacity: 0.12;
		pointer-events: none;
		transform: translate(30%, -30%);
		transition: opacity 0.4s ease;
	}

	.exercise-card:hover .glow {
		opacity: 0.25;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
