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
	}

	.login-card {
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		padding: 3rem;
		border-radius: 1.5rem;
		width: 100%;
		max-width: 400px;
		text-align: center;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
		background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.subtitle {
		color: rgba(255, 255, 255, 0.6);
		margin-bottom: 2rem;
	}

	.input-group {
		margin-bottom: 2rem;
		text-align: left;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.9rem;
	}

	input {
		width: 100%;
		padding: 0.75rem 1rem;
		background: rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 0.5rem;
		color: white;
		font-size: 1rem;
		transition: all 0.2s;
		box-sizing: border-box;
	}

	input:focus {
		outline: none;
		border-color: #a5b4fc;
		background: rgba(0, 0, 0, 0.3);
	}

	.error {
		color: #ef4444;
		font-size: 0.85rem;
		margin-top: 0.5rem;
	}

	.start-btn {
		width: 100%;
		padding: 1rem;
		background: linear-gradient(135deg, #6366f1 0%, #a5b4fc 100%);
		border: none;
		border-radius: 0.5rem;
		color: white;
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
</style>
