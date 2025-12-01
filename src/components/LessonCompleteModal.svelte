<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { Star, ArrowRight, RotateCcw } from 'lucide-svelte';

	interface Props {
		isOpen: boolean;
		stars: number; // 0-3
		accuracy: number;
		xp: number;
		onContinue: () => void;
		onRetry: () => void;
	}

	let { isOpen, stars, accuracy, xp, onContinue, onRetry }: Props = $props();
</script>

{#if isOpen}
	<div class="modal-overlay" transition:fade>
		<div class="modal-content" transition:scale>
			<div class="modal-header">
				<h2>Lesson Complete!</h2>
				<div class="stars-container">
					{#each Array(3) as _, i}
						<div class="star-wrapper" style="animation-delay: {i * 200}ms">
							<Star
								size={48}
								class={i < stars ? 'star-filled' : 'star-empty'}
								fill={i < stars ? '#ffd700' : 'none'}
								stroke={i < stars ? '#ffd700' : 'currentColor'}
							/>
						</div>
					{/each}
				</div>
			</div>

			<div class="stats-grid">
				<div class="stat-item">
					<span class="stat-label">Accuracy</span>
					<span class="stat-value">{accuracy}%</span>
				</div>
				<div class="stat-item">
					<span class="stat-label">XP Gained</span>
					<span class="stat-value">+{xp}</span>
				</div>
			</div>

			<div class="modal-actions">
				<button class="retry-btn" onclick={onRetry}>
					<RotateCcw size={20} />
					Retry
				</button>
				<button class="continue-btn" onclick={onContinue}>
					Continue
					<ArrowRight size={20} />
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		backdrop-filter: blur(5px);
	}

	.modal-content {
		background: #1a1a1a;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 1.5rem;
		padding: 2.5rem;
		width: 90%;
		max-width: 400px;
		text-align: center;
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
	}

	h2 {
		font-size: 2rem;
		margin: 0 0 1.5rem 0;
		background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.stars-container {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		margin-bottom: 2rem;
	}

	.star-wrapper {
		animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards;
	}

	.star-wrapper :global(.star-filled) {
		color: #ffd700;
		filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
	}

	.star-wrapper :global(.star-empty) {
		color: rgba(255, 255, 255, 0.2);
	}

	.stats-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.stat-item {
		background: rgba(255, 255, 255, 0.05);
		padding: 1rem;
		border-radius: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.stat-label {
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.6);
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: bold;
		color: white;
	}

	.modal-actions {
		display: flex;
		gap: 1rem;
	}

	button {
		flex: 1;
		padding: 1rem;
		border-radius: 1rem;
		font-weight: bold;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		transition: transform 0.2s;
		border: none;
	}

	button:hover {
		transform: translateY(-2px);
	}

	.retry-btn {
		background: rgba(255, 255, 255, 0.1);
		color: white;
	}

	.continue-btn {
		background: #4caf50;
		color: white;
	}

	@keyframes popIn {
		from {
			transform: scale(0);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
