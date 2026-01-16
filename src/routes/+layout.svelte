<script lang="ts">
	import { userStatsService } from '$lib/UserStatsService';
	import { onDestroy, onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import '../styles/app.css';
	import '../styles/global.css';
	import NavigationBar from '../components/NavigationBar.svelte';
	import MidiStatusPill from '../components/MidiStatusPill.svelte';
	import Metronome from '../components/Metronome.svelte';
	import MicInputControl from '../components/MicInputControl.svelte';
	import ThemeToggle from '../components/ThemeToggle.svelte';
	import { page } from '$app/stores';
	import { themeService } from '$lib/ThemeService.svelte';

	let { children } = $props();

	let isExercisePage = $derived($page.url.pathname.includes('/exercises/'));

	onMount(() => {
		userStatsService.startSession();
	});

	onDestroy(() => {
		userStatsService.endSession();
	});
</script>

<div class="app">
	<header>
		<div class="header-content">
			<a href={resolve('/')} class="logo">
				<span class="logo-text">Jazz MIDI</span>
			</a>

			<div class="desktop-nav">
				<NavigationBar />
			</div>

			<div class="header-controls">
				<MidiStatusPill />
				{#if isExercisePage}
					<div class="tools-group">
						<MicInputControl />
					</div>
				{/if}
				<ThemeToggle />
			</div>
		</div>
	</header>

	<main>
		{@render children()}
	</main>

	<div class="mobile-nav">
		<NavigationBar />
	</div>
	<footer>© 2025 Jazz midi. All rights reserved.</footer>
</div>

<style>
	/* Layout Styles */
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background: var(--color-bg);
		color: var(--color-text);
		padding-bottom: 80px; /* Space for mobile nav */
	}

	header {
		position: sticky;
		top: 0;
		z-index: 100;
		background: var(--glass-bg);
		backdrop-filter: var(--glass-blur);
		-webkit-backdrop-filter: var(--glass-blur);
		border-bottom: 1px solid var(--color-border);
	}

	.header-content {
		max-width: 1400px;
		margin: 0 auto;
		height: 70px;
		padding: 0 2rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.logo {
		text-decoration: none;
		font-weight: 800;
		font-size: 1.5rem;
		background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.header-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.tools-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding-right: 1rem;
		border-right: 1px solid var(--color-border);
		margin-right: 0.5rem;
	}

	.mobile-nav {
		display: none;
	}

	main {
		flex: 1;
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		justify-content: center;
		padding: 2rem;
		color: var(--color-text-muted);
		font-size: 0.85rem;
	}

	@media (max-width: 1024px) {
		.desktop-nav {
			display: none;
		}

		.mobile-nav {
			display: block;
		}
	}

	@media (max-width: 768px) {
		.header-content {
			padding: 0 1rem;
		}

		.logo {
			font-size: 1.2rem;
		}

		.tools-group {
			display: none; /* Hide tools on mobile header to save space, maybe move them elsewhere later */
		}
	}
</style>
