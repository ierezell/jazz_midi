<script lang="ts">
	import { authService } from '$lib/AuthService.svelte';
	import { userStatsService } from '$lib/UserStatsService';
	import { journeyService } from '$lib/JourneyService';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { fade } from 'svelte/transition';

	let mode = $state<'signin' | 'signup'>('signin');
	let email = $state('');
	let password = $state('');
	let name = $state('');
	let loading = $state(false);
	let error = $state('');
	let successMsg = $state('');

	async function handleSubmit() {
		error = '';
		successMsg = '';
		loading = true;

		if (mode === 'signup') {
			const err = await authService.signUp(email, password, name);
			if (err) {
				error = err;
			} else {
				const userId = authService.userId;
				if (userId) {
					await loadAndNavigate(userId);
				} else {
					successMsg = 'Check your email to confirm your account, then sign in.';
					mode = 'signin';
				}
			}
		} else {
			const err = await authService.signIn(email, password);
			if (err) {
				error = err;
			} else if (authService.userId) {
				await loadAndNavigate(authService.userId);
			}
		}

		loading = false;
	}

	async function loadAndNavigate(userId: string) {
		await Promise.all([
			userStatsService.loadFromSupabase(userId),
			journeyService.loadFromSupabase(userId)
		]);
		goto(resolve('/'));
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') handleSubmit();
	}
</script>

<svelte:head>
	<title>Login - Jazz MIDI</title>
</svelte:head>

<div class="login-container" in:fade>
	<div class="login-card">
		<h1>Jazz MIDI</h1>
		<p class="subtitle">Your jazz improvisation journey</p>

		<div class="tabs">
			<button
				class:active={mode === 'signin'}
				onclick={() => {
					mode = 'signin';
					error = '';
				}}
			>
				Sign In
			</button>
			<button
				class:active={mode === 'signup'}
				onclick={() => {
					mode = 'signup';
					error = '';
				}}
			>
				Sign Up
			</button>
		</div>

		{#if mode === 'signup'}
			<div class="input-group">
				<label for="name">Display name</label>
				<input
					type="text"
					id="name"
					bind:value={name}
					onkeydown={handleKeydown}
					placeholder="Jazz Student"
					autocomplete="nickname"
					maxlength="40"
				/>
			</div>
		{/if}

		<div class="input-group">
			<label for="email">Email</label>
			<input
				type="email"
				id="email"
				bind:value={email}
				onkeydown={handleKeydown}
				placeholder="you@example.com"
				autocomplete="email"
			/>
		</div>

		<div class="input-group">
			<label for="password">Password</label>
			<input
				type="password"
				id="password"
				bind:value={password}
				onkeydown={handleKeydown}
				placeholder="••••••••"
				autocomplete={mode === 'signin' ? 'current-password' : 'new-password'}
			/>
		</div>

		{#if error}
			<p class="error" transition:fade>{error}</p>
		{/if}
		{#if successMsg}
			<p class="success" transition:fade>{successMsg}</p>
		{/if}

		<button class="start-btn" onclick={handleSubmit} disabled={loading}>
			{loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
		</button>
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
		padding: 2.5rem;
		border-radius: 1.5rem;
		width: 100%;
		max-width: 380px;
		text-align: center;
		box-shadow: var(--shadow-lg);
	}

	h1 {
		font-size: clamp(1.4rem, 5vw, 2rem);
		margin-bottom: 0.4rem;
		background: linear-gradient(135deg, var(--color-text) 0%, var(--color-primary) 100%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.subtitle {
		color: var(--color-text-muted);
		margin-bottom: 1.5rem;
		font-size: 0.9rem;
	}

	.tabs {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
		background: var(--color-bg);
		border-radius: 0.75rem;
		padding: 0.25rem;
	}

	.tabs button {
		flex: 1;
		padding: 0.5rem;
		border: none;
		border-radius: 0.5rem;
		background: transparent;
		color: var(--color-text-muted);
		cursor: pointer;
		font-size: 0.9rem;
		transition: all 0.2s;
	}

	.tabs button.active {
		background: var(--color-surface);
		color: var(--color-text);
		font-weight: 600;
		box-shadow: var(--shadow-sm);
	}

	.input-group {
		margin-bottom: 1rem;
		text-align: left;
	}

	label {
		display: block;
		margin-bottom: 0.4rem;
		color: var(--color-text);
		font-size: 0.85rem;
	}

	input {
		width: 100%;
		padding: 0.7rem 1rem;
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		color: var(--color-text);
		font-size: 1rem;
		transition: border-color 0.2s;
		box-sizing: border-box;
	}

	input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.error {
		color: #ef4444;
		font-size: 0.85rem;
		margin: 0.5rem 0 1rem;
	}

	.success {
		color: #22c55e;
		font-size: 0.85rem;
		margin: 0.5rem 0 1rem;
	}

	.start-btn {
		width: 100%;
		padding: 0.85rem;
		background: var(--color-primary);
		border: none;
		border-radius: 0.5rem;
		color: var(--color-on-primary);
		font-weight: bold;
		font-size: 1rem;
		cursor: pointer;
		margin-top: 0.5rem;
		transition:
			transform 0.2s,
			box-shadow 0.2s,
			opacity 0.2s;
	}

	.start-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(99, 102, 241, 0.4);
	}

	.start-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
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
	}
</style>
