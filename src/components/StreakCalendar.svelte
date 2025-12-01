<script lang="ts">
	import type { DayStats } from '$lib/UserStatsService';

	interface Props {
		calendarData: DayStats[];
		currentStreak: number;
		longestStreak: number;
	}

	let { calendarData, currentStreak, longestStreak }: Props = $props();

	const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];

	// Get color based on activity level
	function getColor(exercisesCompleted: number): string {
		if (exercisesCompleted === 0) return 'rgba(255, 255, 255, 0.05)';
		if (exercisesCompleted === 1) return 'rgba(76, 175, 80, 0.3)';
		if (exercisesCompleted <= 3) return 'rgba(76, 175, 80, 0.5)';
		if (exercisesCompleted <= 5) return 'rgba(76, 175, 80, 0.7)';
		return 'rgba(76, 175, 80, 0.9)';
	}

	// Format date for display
	function formatDate(dateStr: string): string {
		const date = new Date(dateStr + 'T00:00:00');
		return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
	}

	//Get day of week (0-6, Monday = 0)
	function getDayOfWeek(dateStr: string): number {
		const date = new Date(dateStr + 'T00:00:00');
		const day = date.getDay();
		return day === 0 ? 6 : day - 1;
	}

	// Organize data into weeks
	const weeks = $derived.by(() => {
		const result: (DayStats | null)[][] = [];
		let currentWeek: (DayStats | null)[] = [];

		if (calendarData.length > 0) {
			const firstDayOfWeek = getDayOfWeek(calendarData[0].date);
			for (let i = 0; i < firstDayOfWeek; i++) {
				currentWeek.push(null);
			}
		}

		calendarData.forEach((day) => {
			currentWeek.push(day);
			if (currentWeek.length === 7) {
				result.push(currentWeek);
				currentWeek = [];
			}
		});

		if (currentWeek.length > 0) {
			while (currentWeek.length < 7) {
				currentWeek.push(null);
			}
			result.push(currentWeek);
		}

		return result;
	});
</script>

<div class="streak-calendar">
	<div class="streak-stats">
		<div class="streak-stat">
			<div class="streak-icon">🔥</div>
			<div class="streak-info">
				<div class="streak-value">{currentStreak}</div>
				<div class="streak-label">Day Streak</div>
			</div>
		</div>
		<div class="streak-stat">
			<div class="streak-icon">🏆</div>
			<div class="streak-info">
				<div class="streak-value">{longestStreak}</div>
				<div class="streak-label">Longest Streak</div>
			</div>
		</div>
	</div>

	<div class="calendar-wrapper">
		<div class="calendar-header">
			<div class="day-labels">
				{#each daysOfWeek as day}
					<div class="day-label">{day}</div>
				{/each}
			</div>
		</div>

		<div class="calendar-grid">
			{#each weeks as week}
				<div class="calendar-week">
					{#each week as day}
						{#if day}
							<div
								class="calendar-day"
								style="background: {getColor(day.exercisesCompleted)}"
								title="{formatDate(day.date)}
{day.exercisesCompleted} exercise{day.exercisesCompleted !== 1 ? 's' : ''}
{Math.round(day.practiceTime)} min practice"
							>
								{#if day.exercisesCompleted > 0}
									<span class="day-count">{day.exercisesCompleted}</span>
								{/if}
							</div>
						{:else}
							<div class="calendar-day empty"></div>
						{/if}
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<div class="legend">
		<span class="legend-label">Less</span>
		<div class="legend-square" style="background: rgba(255, 255, 255, 0.05)"></div>
		<div class="legend-square" style="background: rgba(76, 175, 80, 0.3)"></div>
		<div class="legend-square" style="background: rgba(76, 175, 80, 0.5)"></div>
		<div class="legend-square" style="background: rgba(76, 175, 80, 0.7)"></div>
		<div class="legend-square" style="background: rgba(76, 175, 80, 0.9)"></div>
		<span class="legend-label">More</span>
	</div>
</div>

<style>
	.streak-calendar {
		background: rgba(0, 0, 0, 0.05);
		border-radius: 1rem;
		padding: 1.5rem;
		margin: 2rem 0;
	}

	.streak-stats {
		display: flex;
		gap: 2rem;
		margin-bottom: 2rem;
		justify-content: center;
	}

	.streak-stat {
		display: flex;
		align-items: center;
		gap: 1rem;
		background: rgba(0, 0, 0, 0.05);
		padding: 1rem 1.5rem;
		border-radius: 0.75rem;
	}

	.streak-icon {
		font-size: 2.5rem;
	}

	.streak-value {
		font-size: 2rem;
		font-weight: bold;
		color: rgb(0, 0, 0);
		line-height: 1;
	}

	.streak-label {
		font-size: 0.9rem;
		color: rgba(0, 0, 0, 0.6);
	}

	.calendar-wrapper {
		overflow-x: auto;
		margin-bottom: 1rem;
	}

	.calendar-header {
		margin-bottom: 0.5rem;
	}

	.day-labels {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 3px;
		margin-left: 0;
	}

	.day-label {
		font-size: 0.7rem;
		color: rgba(0, 0, 0, 0.5);
		text-align: center;
		padding: 0.25rem;
	}

	.calendar-grid {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.calendar-week {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 3px;
	}

	.calendar-day {
		aspect-ratio: 1;
		border-radius: 2px;
		border: 1px solid rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: help;
		transition:
			transform 0.2s,
			border-color 0.2s;
		position: relative;
		min-width: 15px;
		min-height: 15px;
	}

	.calendar-day:not(.empty):hover {
		transform: scale(1.2);
		border-color: rgba(76, 175, 80, 0.8);
		z-index: 10;
	}

	.calendar-day.empty {
		background: transparent;
		border-color: transparent;
		cursor: default;
	}

	.day-count {
		font-size: 0.6rem;
		font-weight: bold;
		color: rgb(0, 0, 0);
		text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
	}

	.legend {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 1.5rem;
	}

	.legend-label {
		font-size: 0.8rem;
		color: rgba(0, 0, 0, 0.5);
	}

	.legend-square {
		width: 15px;
		height: 15px;
		border-radius: 2px;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	@media (max-width: 768px) {
		.streak-stats {
			flex-direction: column;
			gap: 1rem;
		}

		.calendar-day {
			min-width: 12px;
			min-height: 12px;
		}

		.day-count {
			font-size: 0.5rem;
		}
	}
</style>
