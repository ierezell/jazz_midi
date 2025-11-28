<script lang="ts">
	import { userStatsService } from '$lib/UserStatsService';
	import { onDestroy, onMount } from 'svelte';
	import '../styles/app.css';
	import HamburgerMenu from '../components/HamburgerMenu.svelte';
	import Metronome from '../components/Metronome.svelte';
	import MicInputControl from '../components/MicInputControl.svelte';

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
		<div class="header-left">
			<HamburgerMenu />
			<a href="/" class="logo">Jazz MIDI</a>
		</div>
		<div class="header-right">
			<MicInputControl />
			<Metronome />
		</div>
	</header>
	<main>
		{@render children()}
	</main>
	<footer>© 2025 Jazz midi. All rights reserved.</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background: var(--color-bg-1);
		color: var(--color-text);
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		background: rgba(0, 0, 0, 0.2);
		backdrop-filter: blur(10px);
		position: sticky;
		top: 0;
		z-index: 50;
	}

	.header-left,
	.header-right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.logo {
		font-size: 1.5rem;
		font-weight: bold;
		color: white;
		text-decoration: none;
		letter-spacing: 1px;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 2rem;
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2rem;
		color: rgba(255, 255, 255, 0.5);
		font-size: 0.9rem;
	}

	@media (max-width: 768px) {
		header {
			padding: 0.75rem 1rem;
		}

		main {
			padding: 1rem;
		}

		.logo {
			font-size: 1.2rem;
		}
	}
</style>
