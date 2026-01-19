<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { Map, Dumbbell, User } from 'lucide-svelte';

	const navItems = [
		{ href: resolve('/journey'), icon: Map, label: 'Journey' },
		{ href: resolve('/exercises'), icon: Dumbbell, label: 'Gym' },
		{ href: resolve('/profile'), icon: User, label: 'Profile' }
	];

	function isActive(href: string) {
		if (href === '/exercises/rhythm') {
			return page.url.pathname.startsWith('/exercises');
		}
		return page.url.pathname.startsWith(href);
	}
</script>

<nav class="nav-bar">
	{#each navItems as item}
		<a href={item.href} class="nav-item" class:active={isActive(item.href)}>
			<div class="icon-container">
				<item.icon size={24} />
			</div>
			<span class="label">{item.label}</span>
		</a>
	{/each}
</nav>

<style>
	.nav-bar {
		display: flex;
		background: var(--color-surface);
		border-radius: 16px;
		padding: 0.5rem;
		border: 1px solid var(--color-border);
		box-shadow: var(--shadow-lg);
		gap: 0.5rem;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1.25rem;
		border-radius: 12px;
		color: var(--color-text-muted);
		text-decoration: none;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		font-weight: 600;
		font-size: 0.95rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.nav-item:hover {
		background: var(--color-surface-raised);
		color: var(--color-text);
	}

	.nav-item.active {
		background: rgba(56, 189, 248, 0.15); /* Primary color low opacity */
		color: var(--color-primary);
		border: 1px solid rgba(56, 189, 248, 0.3);
	}

	.nav-item.active .icon-container {
		transform: scale(1.1);
	}

	.icon-container {
		transition: transform 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	@media (max-width: 768px) {
		.nav-bar {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			border-radius: 0;
			border-top: 1px solid var(--color-border);
			border-bottom: none;
			border-left: none;
			border-right: none;
			justify-content: space-around;
			padding: 0.75rem 0.5rem;
			z-index: 100;
			background: var(--color-surface); /* Ensure solid bg on mobile */
		}

		.nav-item {
			flex-direction: column;
			gap: 0.25rem;
			padding: 0.5rem;
			font-size: 0.7rem;
			background: transparent !important; /* Remove bg active state on mobile to stay clean */
			border: none !important;
		}

		.nav-item.active {
			color: var(--color-primary);
		}

		.nav-item:hover {
			background: transparent;
		}
	}
</style>
