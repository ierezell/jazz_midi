<svelte:options runes={true} />

<script lang="ts">
	import type { ChordType, Inversion, Note } from '$lib/types/notes';
	import { AllChordTypes, AllNotes } from '$lib/types/notes.constants';
	import { onMount } from 'svelte';
	import ChordsPage from '../chords/+page.svelte';
	import ScalesPage from '../scales/+page.svelte';
	import TwoFiveOnesPage from '../two_five_ones/+page.svelte';

	type ExerciseType = 'chord' | 'scale' | 'ii-v-i';

	interface RandomExerciseConfig {
		type: ExerciseType;
		key: Note;
		chordType?: ChordType;
		inversion?: Inversion;
		description: string;
	}

	let currentConfig: RandomExerciseConfig | null = $state(null);
	let exerciseKey = $state(0); // Force re-render of child components

	function generateRandomExercise(): RandomExerciseConfig {
		const types: ExerciseType[] = ['chord', 'scale', 'ii-v-i'];
		const type = types[Math.floor(Math.random() * types.length)];
		const key = AllNotes[Math.floor(Math.random() * AllNotes.length)];
		return createExerciseConfig(type, key);
	}

	function createExerciseConfig(type: ExerciseType, key: Note): RandomExerciseConfig {
		switch (type) {
			case 'chord': {
				const chordType = AllChordTypes[Math.floor(Math.random() * AllChordTypes.length)];
				const inversion = Math.floor(Math.random() * 4) as Inversion;
				return {
					type,
					key,
					chordType,
					inversion,
					description: `${key}${chordType}${inversion > 0 ? ` (${inversion}st inversion)` : ''}`
				};
			}
			case 'scale': {
				return {
					type,
					key,
					description: `${key} Major Scale`
				};
			}
			case 'ii-v-i': {
				return {
					type,
					key,
					description: `${key} ii-V-I Progression`
				};
			}
			default:
				throw new Error(`Unknown exercise type: ${type}`);
		}
	}

	function generateNewExercise() {
		currentConfig = generateRandomExercise();
		exerciseKey = Date.now(); // Force component re-render with new props
	}

	onMount(() => {
		currentConfig = generateRandomExercise();
	});
</script>

<div class="random-exercise">
	<div class="random-header">
		<h1>Random Exercise</h1>
		<div class="random-controls">
			<button onclick={generateNewExercise} class="new-exercise-btn">
				🎲 New Random Exercise
			</button>
		</div>
		{#if currentConfig}
			<div class="exercise-info">
				<span class="exercise-type">{currentConfig.type}</span>
				<span class="exercise-description">{currentConfig.description}</span>
			</div>
		{/if}
	</div>

	{#if currentConfig}
		{#key exerciseKey}
			{#if currentConfig.type === 'chord'}
				<ChordsPage randomMode={true} />
			{:else if currentConfig.type === 'scale'}
				<ScalesPage randomMode={true} />
			{:else if currentConfig.type === 'ii-v-i'}
				<TwoFiveOnesPage randomMode={true} />
			{/if}
		{/key}
	{:else}
		<div class="loading">Generating random exercise...</div>
	{/if}
</div>

<style>
	.random-exercise {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		font-family: system-ui, sans-serif;
	}

	.random-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.random-header h1 {
		color: #333;
		margin-bottom: 1rem;
	}

	.random-controls {
		margin-bottom: 1rem;
	}

	.new-exercise-btn {
		padding: 0.75rem 1.5rem;
		border: 2px solid #4caf50;
		border-radius: 8px;
		background: #e8f5e8;
		color: #2e7d32;
		font-weight: 600;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.3s;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.new-exercise-btn:hover {
		background: #d4f4d4;
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.new-exercise-btn:active {
		transform: translateY(0);
	}

	.exercise-info {
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		padding: 1rem;
		background: #f8f9fa;
		border-radius: 8px;
		margin-bottom: 1rem;
	}

	.exercise-type {
		padding: 0.25rem 0.75rem;
		background: #e3f2fd;
		color: #1976d2;
		border-radius: 20px;
		font-size: 0.875rem;
		font-weight: 500;
		text-transform: capitalize;
	}

	.exercise-description {
		font-weight: 600;
		color: #333;
	}

	.loading {
		text-align: center;
		padding: 4rem;
		color: #6c757d;
		font-size: 1.2rem;
	}

	@media (max-width: 768px) {
		.random-exercise {
			padding: 1rem;
		}

		.exercise-info {
			flex-direction: column;
			gap: 0.5rem;
		}
	}
</style>
