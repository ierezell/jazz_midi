<svelte:options runes={true} />

<script lang="ts">
	import type { ChordType, ChordVoicing, Inversion, Note, ScaleMode } from '$lib/types/notes';

	import { AllChordVoicings, AllScaleModes, AllThreeNotesChords } from '$lib/types/notes.constants';
	import { type ExerciseType } from '$lib/types/types';
	import { onDestroy, onMount } from 'svelte';
	import ConfigPopup from '../../../components/ConfigPopup.svelte';
	import ChordsPage from '../chords/+page.svelte';
	import ScalesPage from '../scales/+page.svelte';
	import TwoFiveOnesPage from '../two_five_ones/+page.svelte';
	// Import only components, not Svelte pages

	interface RandomExerciseConfig {
		type: ExerciseType;
		key: Note;
		chordType?: ChordType;
		voicing?: ChordVoicing;
		inversion?: Inversion;
		scaleMode?: ScaleMode;
		description: string;
	}

	const description =
		'A random exercise: play the notes or chords as instructed. The type and key will change each time.';
	let currentConfig: RandomExerciseConfig = $state({
		type: 'chord',
		key: 'C',
		chordType: 'maj7',
		voicing: 'full-right',
		inversion: 0,
		description: 'Cmaj - Random Voicing'
	});

	let exerciseKey = $state(0); // Force re-render of child components
	let isCompleted = $state(false);
	let completionTimeout: ReturnType<typeof setTimeout> | null = null;
	let countdown = $state(0);
	let countdownInterval: ReturnType<typeof setInterval> | null = null;
	let allowedNotes = $state<Note[]>(['C', 'F', 'G']); // Start with all notes allowed
	let allowedChordTypes: ChordType[] = $state<ChordType[]>(['maj7', 'min7', '7', 'major', 'minor']); // All possible chord types
	let allowedInversions: Inversion[] = $state<Inversion[]>([0, 1, 2, 3]); // All possible inversions
	let allowedScaleModes: ScaleMode[] = $state<ScaleMode[]>(AllScaleModes); // Available scale modes
	let allowedVoicings: ChordVoicing[] = $state<ChordVoicing[]>(AllChordVoicings); // Available voicing types
	let allowedExerciseTypes: ExerciseType[] = $state<ExerciseType[]>(['chord', 'II-V-I', 'scale']); // Available exercise types
	let showConfigPopup = $state(false); // Control visibility of the config popup

	$effect(() => {
		if (isCompleted && currentConfig) {
			if (completionTimeout) {
				clearTimeout(completionTimeout);
			}
			if (countdownInterval) {
				clearInterval(countdownInterval);
			}

			countdown = 3;
			countdownInterval = setInterval(() => {
				countdown--;
				if (countdown <= 0) {
					if (countdownInterval) {
						clearInterval(countdownInterval);
					}
					generateNewExercise();
					isCompleted = false;
				}
			}, 1000);
		}
	});

	function generateRandomExercise(): RandomExerciseConfig {
		const type = allowedExerciseTypes[Math.floor(Math.random() * allowedExerciseTypes.length)];
		const key = allowedNotes[Math.floor(Math.random() * allowedNotes.length)];
		return createExerciseConfig(type, key);
	}

	function createExerciseConfig(type: ExerciseType, key: Note): RandomExerciseConfig {
		switch (type) {
			case 'chord': {
				const chordType = allowedChordTypes[Math.floor(Math.random() * allowedChordTypes.length)];
				let inversion = allowedInversions[Math.floor(Math.random() * allowedInversions.length)];
				let voicing = allowedVoicings[Math.floor(Math.random() * allowedVoicings.length)];
				if (AllThreeNotesChords.includes(chordType) && inversion > 2) {
					inversion = allowedInversions[Math.floor(Math.random() * (allowedInversions.length - 1))];
				}

				return {
					type,
					key,
					chordType,
					voicing,
					inversion,
					description: `${key}${chordType}${inversion > 0 ? ` (${inversion}st inversion)` : ''} - ${voicing}`
				};
			}
			case 'scale': {
				const randomScaleMode =
					allowedScaleModes[Math.floor(Math.random() * allowedScaleModes.length)];
				return {
					type,
					key,
					scaleMode: randomScaleMode,
					description: `${key} ${randomScaleMode}`
				};
			}
			case 'II-V-I': {
				const inversion = allowedInversions[Math.floor(Math.random() * allowedInversions.length)];
				let voicing = allowedVoicings[Math.floor(Math.random() * allowedVoicings.length)];

				return {
					type,
					key,
					voicing,
					inversion,
					description: `${key} II-V-I Progression${inversion > 0 ? ` (${inversion}st inversion)` : ''} ${voicing}`
				};
			}
			default:
				throw new Error(`Unknown exercise type: ${type}`);
		}
	}

	function generateNewExercise() {
		currentConfig = generateRandomExercise();
		exerciseKey = Date.now(); // Force component re-render with new props
		isCompleted = false; // Reset completion state
		// Clear any running timers
		if (completionTimeout) {
			clearTimeout(completionTimeout);
			completionTimeout = null;
		}
		if (countdownInterval) {
			clearInterval(countdownInterval);
			countdownInterval = null;
		}
		countdown = 0;
	}

	function handleExerciseComplete() {
		isCompleted = true;
	}

	onMount(() => {
		currentConfig = generateRandomExercise();
	});

	onDestroy(() => {
		// Clean up any running timers
		if (completionTimeout) {
			clearTimeout(completionTimeout);
		}
		if (countdownInterval) {
			clearInterval(countdownInterval);
		}
	});
</script>

<div class="random-exercise">
	<div class="random-header">
		{#if currentConfig}
			<div class="exercise-info">
				<span class="exercise-type">{currentConfig.type}</span>
				<span class="exercise-description">{currentConfig.description}</span>
				<button onclick={() => (showConfigPopup = true)} class="config-btn" type="button">
					⚙️ Config
				</button>
				<button onclick={generateNewExercise} class="new-exercise-btn"> 🎲 New </button>
			</div>
		{/if}
	</div>

	<ConfigPopup
		showPopup={showConfigPopup}
		{allowedNotes}
		{allowedChordTypes}
		{allowedInversions}
		{allowedScaleModes}
		{allowedVoicings}
		{allowedExerciseTypes}
		onClose={() => (showConfigPopup = false)}
		onUpdate={(type, value) => {
			switch (type) {
				case 'allowedNotes':
					allowedNotes = value as Note[];
					break;
				case 'allowedChordTypes':
					allowedChordTypes = value as ChordType[];
					break;
				case 'allowedInversions':
					allowedInversions = value.map(Number) as Inversion[];
					break;
				case 'allowedScaleModes':
					allowedScaleModes = value as ScaleMode[];
					break;
				case 'allowedVoicings':
					allowedVoicings = value as ChordVoicing[];
					break;
				case 'allowedExerciseTypes':
					allowedExerciseTypes = value as ExerciseType[];
					break;
			}
		}}
	/>

	{#if isCompleted}
		<div class="completion-overlay">
			<div class="completion-message">
				<h2>🎉 Exercise Completed!</h2>
				<p>Great job! Next random exercise in <strong>{countdown}</strong> seconds...</p>
				<button onclick={generateNewExercise} class="skip-btn"> Skip Wait </button>
			</div>
		</div>
	{/if}

	{#if currentConfig}
		{#key exerciseKey}
			{#if currentConfig.type === 'chord'}
				<ChordsPage
						randomMode={true}
						onComplete={handleExerciseComplete}
						chordType={currentConfig.chordType || 'maj7'}
						inversion={currentConfig.inversion || 0}
						voicing={currentConfig.voicing || 'full-right'}
						rootKey={currentConfig.key}
					/>
				{:else if currentConfig.type === 'scale'}
					<ScalesPage
						randomMode={true}
						onComplete={handleExerciseComplete}
						scaleMode={currentConfig.scaleMode}
						sequentialMode={Math.random() > 0.5}
						rootKey={currentConfig.key}
					/>
				{:else if currentConfig.type === 'II-V-I'}
					<TwoFiveOnesPage
						randomMode={true}
						onComplete={handleExerciseComplete}
						inversion={currentConfig.inversion}
						voicing={currentConfig.voicing}
						rootKey={currentConfig.key}
					/>
				<div>
					<!-- TODO: Refactor to use actual exercise components, not Svelte pages -->
					Random exercise type: {currentConfig.type} (component not implemented)
				</div>
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
		padding: 0.5rem;
		font-family: system-ui, sans-serif;
	}

	.random-header {
		text-align: center;
		margin-bottom: 0.5rem;
	}

	.config-btn {
		padding: 0.5rem 1rem;
		border: 2px solid #6c757d;
		border-radius: 8px;
		background: #e9ecef;
		color: #495057;
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.3s;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.config-btn:hover {
		background: #dee2e6;
		transform: translateY(-1px);
	}

	.new-exercise-btn {
		padding: 0.5rem 1rem;
		border: 2px solid #4caf50;
		border-radius: 8px;
		background: #e8f5e8;
		color: #2e7d32;
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.3s;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.new-exercise-btn:hover {
		background: #d4f4d4;
		transform: translateY(-1px);
	}

	@media (orientation: landscape) and (max-height: 600px) {
		.random-exercise {
			padding: 0.25rem;
		}

		.random-header {
			padding: 0.25rem;
			margin-bottom: 0.25rem;
		}

		.exercise-info {
			padding: 0.5rem;
			gap: 0.5rem;
		}

		.config-btn,
		.new-exercise-btn {
			padding: 0.35rem 0.75rem;
			font-size: 0.75rem;
		}
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

	.completion-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.completion-message {
		background: white;
		padding: 2rem;
		border-radius: 12px;
		text-align: center;
		max-width: 400px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	.completion-message h2 {
		color: #2e7d32;
		margin-bottom: 1rem;
		font-size: 1.5rem;
	}

	.completion-message p {
		color: #666;
		margin-bottom: 1.5rem;
		font-size: 1.1rem;
	}

	.skip-btn {
		padding: 0.5rem 1rem;
		border: 2px solid #1976d2;
		border-radius: 6px;
		background: #e3f2fd;
		color: #1976d2;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s;
	}

	.skip-btn:hover {
		background: #1976d2;
		color: white;
	}

	@media (max-width: 768px) {
		.random-exercise {
			padding: 0.5rem;
		}

		.random-header {
			margin-bottom: 0.5rem;
		}

		.exercise-info {
			flex-direction: column;
			gap: 0.5rem;
		}
	}
</style>
