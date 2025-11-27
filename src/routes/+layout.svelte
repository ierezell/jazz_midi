<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { userStatsService } from '$lib/UserStatsService';
	import { onDestroy, onMount } from 'svelte';
	import '../styles/app.css';
	let { children } = $props();
	onMount(() => {
		userStatsService.startSession();
	});
	onDestroy(() => {
		userStatsService.endSession();
	});
</script>

<div class="app">
	<header>
		<div class="corner"></div>
		<nav>
			<svg viewBox="0 0 2 3" aria-hidden="true">
				<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
			</svg>
			<ul>
				<li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
					<a href={resolve('/')} data-sveltekit-preload-data="hover">Home</a>
				</li>
				<li aria-current={page.url.pathname.startsWith('/exercises/random') ? 'page' : undefined}>
					<a href={resolve('/exercises/random')} data-sveltekit-preload-data="hover">🎲 Random</a>
				</li>
				<li
					aria-current={page.url.pathname.startsWith('/exercises/two_five_ones')
						? 'page'
						: undefined}
				>
					<a href={resolve('/exercises/two_five_ones')} data-sveltekit-preload-data="hover"
						>II-V-I</a
					>
				</li>
				<li aria-current={page.url.pathname.startsWith('/exercises/scales') ? 'page' : undefined}>
					<a href={resolve('/exercises/scales')} data-sveltekit-preload-data="hover">Scales</a>
				</li>
				<li aria-current={page.url.pathname.startsWith('/exercises/chords') ? 'page' : undefined}>
					<a href={resolve('/exercises/chords')} data-sveltekit-preload-data="hover">Chords</a>
				</li>
				<li
					aria-current={page.url.pathname.startsWith('/exercises/intervals') ? 'page' : undefined}
				>
					<a href={resolve('/exercises/intervals')} data-sveltekit-preload-data="hover">Intervals</a
					>
				</li>
				<li aria-current={page.url.pathname.startsWith('/exercises/songs') ? 'page' : undefined}>
					<a href={resolve('/exercises/songs')} data-sveltekit-preload-data="hover">🎼 Songs</a>
				</li>
				<li aria-current={page.url.pathname.startsWith('/exercises/names') ? 'page' : undefined}>
					<a href={resolve('/exercises/names')} data-sveltekit-preload-data="hover">🎵 Names</a>
				</li>
				<li aria-current={page.url.pathname.startsWith('/profile') ? 'page' : undefined}>
					<a href={resolve('/profile')} data-sveltekit-preload-data="hover">👤 Profile</a>
				</li>
			</ul>
			<svg viewBox="0 0 2 3" aria-hidden="true">
				<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
			</svg>
		</nav>
		<div class="corner"></div>
	</header>
	<main>
		{@render children()}
	</main>
	<footer>© 2025 Jazz midi. All rights reserved.</footer>
</div>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}
	.corner {
		width: 3em;
		height: 3em;
	}
	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}
	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}
	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}
	svg {
		width: 2em;
		height: 3em;
		display: block;
	}
	path {
		fill: var(--background);
	}
	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}
	li {
		position: relative;
		height: 100%;
	}
	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}
	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}
	a:hover {
		color: var(--color-theme-1);
	}
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 0.25rem 1rem 1rem 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}
	footer a {
		font-weight: bold;
	}
	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
	@media (max-width: 768px) {
		header {
			padding: 0.5rem;
			flex-wrap: nowrap;
		}
		.corner {
			width: 2.5em;
			height: 2.5em;
			flex-shrink: 0;
		}
		.corner img {
			width: 1.5em;
			height: 1.5em;
		}
		nav {
			flex: 1;
			margin: 0 0.5rem;
			min-width: 0;
		}
		ul {
			overflow-x: auto;
			scrollbar-width: none;
			-ms-overflow-style: none;
		}
		ul::-webkit-scrollbar {
			display: none;
		}
		nav a {
			padding: 0 0.4rem;
			font-size: 0.7rem;
			white-space: nowrap;
		}
		main {
			padding: 0.25rem 0.75rem 0.75rem 0.75rem;
			max-width: 100%;
		}
		svg {
			width: 1.5em;
			height: 2.5em;
		}
	}
	@media (max-width: 480px) {
		header {
			padding: 0.25rem;
		}
		nav a {
			padding: 0 0.3rem;
			font-size: 0.65rem;
		}
		.corner {
			width: 2em;
			height: 2em;
		}
		.corner img {
			width: 1.2em;
			height: 1.2em;
		}
		ul {
			height: 2.5em;
		}
		main {
			padding: 0.125rem 0.5rem 0.5rem 0.5rem;
		}
	}
	@media (max-width: 360px) {
		nav a {
			padding: 0 0.2rem;
			font-size: 0.6rem;
		}
		ul {
			gap: 0.1rem;
		}
	}
</style>
