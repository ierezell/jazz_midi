<script lang="ts">
	import { userStatsService } from '$lib/UserStatsService';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { fade } from 'svelte/transition';

	let name = $state('');
	let error = $state('');

	function handleLogin() {
		if (!name.trim()) {
			error = 'Please enter your name';
			return;
		}

		userStatsService.createProfile(name);
		goto(resolve('/'));
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleLogin();
		}
	}
</script>

<svelte:head>
	<title>Login - Jazz MIDI</title>
</svelte:head>

<div class="login-container" in:fade>
	<div class="login-card">
		<h1>Welcome to Jazz MIDI</h1>
		<p class="subtitle">Start your improvisation journey today</p>

		<ul class="features-list">
			<li>🎹 Interactive MIDI keyboard exercises for jazz piano</li>
			<li>🎵 10+ jazz styles: bebop, blues, funk, latin and more</li>
			<li>📈 Track XP, streaks, and mastery across all exercises</li>
		</ul>

		<div class="input-group">
			<label for="name">What should we call you?</label>
			<input
				type="text"
				id="name"
				bind:value={name}
				onkeydown={handleKeydown}
				placeholder="Enter your name"
				autocomplete="off"
			/>
			{#if error}
				<p class="error" transition:fade>{error}</p>
			{/if}
		</div>

		<button class="start-btn" onclick={handleLogin}> Start Journey </button>
	</div>
</div>

<style>
	.login-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 80vh;
		padding: 1rem;
		box-sizing: border-box;
	}

	.login-card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		padding: 3rem;
		border-radius: 1.5rem;
		width: 100%;
		max-width: 400px;
		text-align: center;
		box-shadow: var(--shadow-lg);
	}

	h1 {
		font-size: clamp(1.4rem, 5vw, 2rem);
		margin-bottom: 0.5rem;
		background: linear-gradient(135deg, var(--color-text) 0%, var(--color-primary) 100%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.subtitle {
		color: var(--color-text-muted);
		margin-bottom: 2rem;
	}

	.features-list {
		list-style: none;
		padding: 0;
		margin: 0 0 1.5rem 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-size: 0.9rem;
		color: var(--color-text-muted);
	}

	.features-list li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.input-group {
		margin-bottom: 2rem;
		text-align: left;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		color: var(--color-text);
		font-size: 0.9rem;
	}

	input {
		width: 100%;
		padding: 0.75rem 1rem;
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		color: var(--color-text);
		font-size: 1rem;
		transition: all 0.2s;
		box-sizing: border-box;
	}

	input:focus {
		outline: none;
		border-color: var(--color-primary);
		background: var(--color-bg);
	}

	.error {
		color: #ef4444;
		font-size: 0.85rem;
		margin-top: 0.5rem;
	}

	.start-btn {
		width: 100%;
		padding: 1rem;
		background: var(--color-primary);
		border: none;
		border-radius: 0.5rem;
		color: var(--color-on-primary);
		font-weight: bold;
		font-size: 1.1rem;
		cursor: pointer;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	.start-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(99, 102, 241, 0.4);
	}

	.start-btn:active {
		transform: translateY(0);
	}

	@media (max-width: 480px) {
		.login-card {
			padding: 1.5rem;
			border-radius: 1rem;
		}
	}

	@media (orientation: landscape) and (max-height: 600px) {
		.login-container {
			align-items: flex-start;
			min-height: 100%;
			overflow-y: auto;
		}
		.login-card {
			padding: 1rem 1.5rem;
			border-radius: 0.75rem;
			margin: 0.5rem auto;
		}
		.subtitle {
			margin-bottom: 0.75rem;
		}
		.features-list {
			display: none;
		}
		.input-group {
			margin-bottom: 1rem;
		}
	}
</style>
