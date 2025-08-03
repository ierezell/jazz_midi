<svelte:options runes={true} />

<script lang="ts">
	import type { Achievement } from '$lib/services/UserStatsService';

	interface AchievementNotificationProps {
		achievement: Achievement;
		onClose: () => void;
	}

	let { achievement, onClose }: AchievementNotificationProps = $props();
	let visible = $state(true);

	function handleClose(): void {
		visible = false;
		setTimeout(() => {
			onClose();
		}, 300);
	}

	// Auto-close after 5 seconds
	setTimeout(() => {
		if (visible) {
			handleClose();
		}
	}, 5000);
</script>

{#if visible}
	<div class="achievement-notification" class:visible>
		<div class="achievement-content">
			<div class="achievement-icon">{achievement.icon}</div>
			<div class="achievement-text">
				<div class="achievement-title">Achievement Unlocked!</div>
				<div class="achievement-name">{achievement.name}</div>
				<div class="achievement-description">{achievement.description}</div>
			</div>
			<button class="close-button" onclick={handleClose} aria-label="Close"> × </button>
		</div>
		<div class="progress-bar">
			<div class="progress-fill" style="width: 100%"></div>
		</div>
	</div>
{/if}

<style>
	.achievement-notification {
		position: fixed;
		top: 20px;
		right: 20px;
		width: 350px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 1rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
		color: white;
		z-index: 1000;
		transform: translateX(100%);
		transition: transform 0.3s ease-in-out;
		overflow: hidden;
	}

	.achievement-notification.visible {
		transform: translateX(0);
	}

	.achievement-content {
		display: flex;
		align-items: flex-start;
		padding: 1rem;
		gap: 1rem;
	}

	.achievement-icon {
		font-size: 2.5rem;
		flex-shrink: 0;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
	}

	.achievement-text {
		flex: 1;
		min-width: 0;
	}

	.achievement-title {
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: rgba(255, 255, 255, 0.8);
		margin-bottom: 0.25rem;
	}

	.achievement-name {
		font-size: 1.1rem;
		font-weight: bold;
		margin-bottom: 0.25rem;
	}

	.achievement-description {
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.9);
		line-height: 1.3;
	}

	.close-button {
		background: none;
		border: none;
		color: rgba(255, 255, 255, 0.7);
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: all 0.2s;
		flex-shrink: 0;
	}

	.close-button:hover {
		background: rgba(255, 255, 255, 0.1);
		color: white;
	}

	.progress-bar {
		height: 4px;
		background: rgba(255, 255, 255, 0.2);
		position: relative;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #ffd700, #ffed4e);
		box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
		transition: width 0.3s ease;
	}

	/* Mobile responsiveness */
	@media (max-width: 768px) {
		.achievement-notification {
			top: 10px;
			right: 10px;
			left: 10px;
			width: auto;
		}

		.achievement-content {
			padding: 0.75rem;
		}

		.achievement-icon {
			font-size: 2rem;
		}

		.achievement-name {
			font-size: 1rem;
		}

		.achievement-description {
			font-size: 0.85rem;
		}
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.achievement-notification {
			transition: opacity 0.3s ease-in-out;
			transform: translateX(0);
		}

		.achievement-notification:not(.visible) {
			opacity: 0;
		}
	}
</style>
