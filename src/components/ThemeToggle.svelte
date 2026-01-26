<script lang="ts">
	import { themeService } from '$lib/ThemeService';
	import { Sun, Moon } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
</script>

<button class="theme-toggle" onclick={() => themeService.toggleTheme()} aria-label="Toggle Theme">
	<div class="icon-wrapper">
		{#if themeService.theme === 'dark'}
			<div in:fade={{ duration: 200 }} class="icon">
				<Moon size={20} />
			</div>
		{:else}
			<div in:fade={{ duration: 200 }} class="icon">
				<Sun size={20} />
			</div>
		{/if}
	</div>
</button>

<style>
	.theme-toggle {
		background: var(--color-surface-raised);
		border: 1px solid var(--color-border);
		width: 40px;
		height: 40px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		color: var(--color-text);
	}

	.theme-toggle:hover {
		background: var(--color-border);
		transform: scale(1.05);
	}

	.icon-wrapper {
		position: relative;
		width: 20px;
		height: 20px;
	}

	.icon {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
