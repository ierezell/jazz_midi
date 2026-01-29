<script lang="ts">
	import { resolve } from '$app/paths';
	import { Dumbbell, Music, Zap, Ruler, BookOpen, Mic2, Grid, Key, Guitar } from 'lucide-svelte';

	const exercises = [
		{
			title: 'Rhythm',
			description: 'Master timing and two-handed coordination.',
			href: resolve('/exercises/rhythm'),
			icon: Dumbbell,
			color: 'var(--color-primary)'
		},
		{
			title: 'Note Names',
			description: 'Learn to identify notes on the staff quickly.',
			href: resolve('/exercises/names'),
			icon: Music,
			color: 'var(--color-secondary)'
		},
		{
			title: 'Intervals',
			description: 'Train your ear to recognize distances between notes.',
			href: resolve('/exercises/intervals'),
			icon: Ruler,
			color: 'var(--color-success)'
		},
		{
			title: 'Chords',
			description: 'Build your harmony vocabulary.',
			href: resolve('/exercises/chords'),
			icon: Grid,
			color: 'var(--color-warn)'
		},
		{
			title: 'Scales',
			description: 'Practice major, minor, and mode scales.',
			href: resolve('/exercises/scales'),
			icon: Key,
			color: 'var(--color-primary)'
		},
		{
			title: 'Licks',
			description: 'Master jazz vocabulary and finger mechanics.',
			href: resolve('/exercises/licks'),
			icon: Guitar,
			color: '#9b59b6'
		},
		{
			title: 'Flashcards',
			description: 'Rapid-fire theory drills.',
			href: resolve('/exercises/flashcards'),
			icon: Zap,
			color: 'var(--color-error)'
		},
		{
			title: 'Sight Reading',
			description: 'Read sheet music in real-time.',
			href: resolve('/exercises/partition'),
			icon: BookOpen,
			color: 'var(--color-text)'
		},
		{
			title: 'Songs',
			description: 'Apply your skills to real tunes.',
			href: resolve('/exercises/songs'),
			icon: Mic2,
			color: 'var(--color-rh)'
		}
	];
</script>

<div class="gym-dashboard">
	<header class="dashboard-header">
		<h1>The Gym</h1>
		<p class="subtitle">Your daily workout for musical mastery.</p>
	</header>

	<div class="exercise-grid">
		{#each exercises as exercise}
			<a href={exercise.href} class="exercise-card card-premium">
				<div class="icon-wrapper" style="color: {exercise.color}">
					<exercise.icon size={32} />
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
		color: var(--color-primary); /* Fallback */
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
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 2rem;
		padding-bottom: 4rem;
	}

	.exercise-card {
		position: relative;
		text-decoration: none;
		color: var(--color-text);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		align-items: flex-start;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		background: var(--card-bg); /* themed surface */
		backdrop-filter: blur(12px);
		border-color: rgba(255, 255, 255, 0.1);
	}

	.exercise-card:hover {
		transform: translateY(-8px) scale(1.02);
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
		border-color: var(--color-primary);
		background: var(
			--card-bg
		); /* Keep base opacity or slightly adjust if needed, but glow handles effect */
	}

	.icon-wrapper {
		background: rgba(255, 255, 255, 0.05);
		padding: 1rem;
		border-radius: 16px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		transition: transform 0.4s ease;
	}

	.exercise-card:hover .icon-wrapper {
		transform: scale(1.1) rotate(5deg);
		background: rgba(255, 255, 255, 0.1);
	}

	.content h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.content p {
		margin: 0;
		color: var(--color-text-muted);
		font-size: 0.95rem;
		line-height: 1.6;
	}

	.glow {
		position: absolute;
		top: 0;
		right: 0;
		width: 200px;
		height: 200px;
		border-radius: 50%;
		filter: blur(60px);
		opacity: 0.15;
		pointer-events: none;
		transform: translate(30%, -30%);
		transition: opacity 0.4s ease;
	}

	.exercise-card:hover .glow {
		opacity: 0.3;
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
