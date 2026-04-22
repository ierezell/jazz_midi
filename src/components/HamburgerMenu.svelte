<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { RouteId } from '$app/types';
	import { Menu, X } from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';

	let isOpen = $state(false);

	function toggleMenu() {
		isOpen = !isOpen;
	}

	function closeMenu() {
		isOpen = false;
	}

	const menuGroups = [
		{
			title: 'Main',
			links: [
				{ href: '/', label: 'Home', icon: '🏠' },
				{ href: '/journey', label: 'Journey', icon: '🗺️' },
				{ href: '/profile', label: 'Profile', icon: '👤' }
			]
		},
		{
			title: 'Foundations',
			links: [
				{ href: '/exercises/names', label: 'Note Names', icon: '📝' },
				{ href: '/exercises/intervals', label: 'Intervals', icon: '📏' },
				{ href: '/exercises/flashcards', label: 'Flashcards', icon: '⚡' },
				{ href: '/exercises/songs', label: 'Songs', icon: '🎵' },
				{ href: '/exercises/partition', label: 'Sight Reading', icon: '👀' },
				{ href: '/exercises/rhythm', label: 'Rhythm', icon: '🥁' }
			]
		},
		{
			title: 'Scales & Chords',
			links: [
				{ href: '/exercises/scales', label: 'Scales', icon: '🎼' },
				{ href: '/exercises/chords', label: 'Chords', icon: '🎵' },
				{ href: '/exercises/two_five_ones', label: 'II-V-I', icon: '🎹' },
				{ href: '/exercises/licks', label: 'Licks', icon: '🎸' }
			]
		}
	];
</script>

<div class="hamburger-menu">
	<button class="menu-btn" onclick={toggleMenu} aria-label="Toggle menu">
		{#if isOpen}
			<X size={24} />
		{:else}
			<Menu size={24} />
		{/if}
	</button>

	{#if isOpen}
		<div
			class="menu-overlay"
			role="button"
			tabindex="0"
			onclick={closeMenu}
			onkeydown={(e) => e.key === 'Escape' && closeMenu()}
			transition:fade={{ duration: 200 }}
		></div>
		<nav class="menu-content" transition:slide={{ axis: 'x', duration: 300 }}>
			<div class="menu-header">
				<h2>Menu</h2>
				<button class="close-btn" onclick={closeMenu} aria-label="Close menu">
					<X size={24} />
				</button>
			</div>
			<div class="menu-scroll">
				{#each menuGroups as group}
					<div class="menu-group">
						<h3>{group.title}</h3>
						<ul>
							{#each group.links as link}
								<li
									class:active={page.url.pathname === link.href ||
										(link.href !== '/' && page.url.pathname.startsWith(link.href))}
								>
									<a href={resolve(link.href as unknown as RouteId)} onclick={closeMenu}>
										<span class="icon">{link.icon}</span>
										<span class="label">{link.label}</span>
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</nav>
	{/if}
</div>

<style>
	.hamburger-menu {
		position: relative;
		z-index: 100;
	}

	.menu-btn {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		color: var(--color-text);
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: background-color 0.2s;
	}

	.menu-btn:hover {
		background-color: var(--color-surface-raised);
	}

	.menu-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.5);
		z-index: 99;
	}

	.menu-content {
		position: fixed;
		top: 0;
		left: 0;
		width: 280px;
		height: 100vh;
		background: var(--color-surface);
		z-index: 100;
		box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
		display: flex;
		flex-direction: column;
	}

	.menu-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem 1rem;
		border-bottom: 1px solid var(--color-border);
		flex-shrink: 0;
	}

	.menu-header h2 {
		margin: 0;
		color: var(--color-text);
		font-size: 1.5rem;
	}

	.close-btn {
		background: none;
		border: none;
		cursor: pointer;
		color: var(--color-text-muted);
		transition: color 0.2s;
	}

	.close-btn:hover {
		color: var(--color-text);
	}

	.menu-scroll {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.menu-group h3 {
		font-size: 0.8rem;
		text-transform: uppercase;
		color: var(--color-text-muted);
		margin: 0 0 0.5rem 0.5rem;
		letter-spacing: 0.05em;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	li a {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 1rem;
		color: var(--color-text);
		text-decoration: none;
		border-radius: 0.5rem;
		transition: all 0.2s;
	}

	li a:hover {
		background: var(--color-surface-raised);
		color: var(--color-text);
	}

	li.active a {
		background: var(--color-primary);
		color: var(--color-on-primary);
		font-weight: bold;
	}

	.icon {
		font-size: 1.2rem;
		width: 1.5rem;
		text-align: center;
	}
</style>
