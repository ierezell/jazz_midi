<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { Menu, X } from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';

	let isOpen = $state(false);

	function toggleMenu() {
		isOpen = !isOpen;
	}

	function closeMenu() {
		isOpen = false;
	}

	const links = [
		{ href: '/', label: 'Home', icon: '🏠' },
		{ href: '/journey', label: 'Journey', icon: '🗺️' },
		{ href: '/exercises/random', label: 'Random', icon: '🎲' },
		{ href: '/exercises/two_five_ones', label: 'II-V-I', icon: '🎹' },
		{ href: '/exercises/scales', label: 'Scales', icon: '🎼' },
		{ href: '/exercises/chords', label: 'Chords', icon: '🎵' },
		{ href: '/exercises/intervals', label: 'Intervals', icon: '📏' },
		{ href: '/exercises/songs', label: 'Songs', icon: '🎤' },
		{ href: '/exercises/names', label: 'Names', icon: '📝' },
		{ href: '/exercises/partition', label: 'Partition', icon: '🎼' },
		{ href: '/exercises/rhythm', label: 'Rhythm', icon: '🥁' },
		{ href: '/stats', label: 'Statistics', icon: '📊' },
		{ href: '/profile', label: 'Profile', icon: '👤' }
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
				<button class="close-btn" onclick={closeMenu}>
					<X size={24} />
				</button>
			</div>
			<ul>
				{#each links as link}
					<li
						class:active={page.url.pathname === link.href ||
							(link.href !== '/' && page.url.pathname.startsWith(link.href))}
					>
						<a href={resolve(link.href as any)} onclick={closeMenu}>
							<span class="icon">{link.icon}</span>
							<span class="label">{link.label}</span>
						</a>
					</li>
				{/each}
			</ul>
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
		color: var(--color-text, white);
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: background-color 0.2s;
	}

	.menu-btn:hover {
		background-color: rgba(255, 255, 255, 0.1);
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
		background: #2c3e50; /* Fallback */
		background: var(--color-bg-2, #2c3e50);
		z-index: 100;
		box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
		display: flex;
		flex-direction: column;
		padding: 1rem;
	}

	.menu-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.menu-header h2 {
		margin: 0;
		color: white;
	}

	.close-btn {
		background: none;
		border: none;
		cursor: pointer;
		color: rgba(255, 255, 255, 0.7);
		transition: color 0.2s;
	}

	.close-btn:hover {
		color: white;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	li a {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 1rem;
		color: rgba(255, 255, 255, 0.8);
		text-decoration: none;
		border-radius: 0.5rem;
		transition: all 0.2s;
	}

	li a:hover {
		background: rgba(255, 255, 255, 0.1);
		color: white;
	}

	li.active a {
		background: var(--color-theme-1, #4caf50);
		color: white;
		font-weight: bold;
	}

	.icon {
		font-size: 1.2rem;
		width: 1.5rem;
		text-align: center;
	}
</style>
