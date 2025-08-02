<!-- 
    Base Exercise Component
    Provides common UI elements and functionality for all exercises
-->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import { DEFAULT_KEYBOARD_CONFIG } from '../lib/config';
	import type {
		BaseExerciseState,
		BaseKeyboardProps,
		BaseScoreProps,
		MidiNote,
		Note
	} from '../lib/types';
	import { AllNotes } from '../midi/midi';
	import DebugPanel from './DebugPanel.svelte';
	import InteractiveKeyboard from './keyboard/InteractiveKeyboard.svelte';
	import Score from './Score.svelte';

	// Props interface for the base component
	interface BaseExerciseProps {
		exerciseState: BaseExerciseState;
		exerciseTitle: string;
		exerciseDescription?: string;
		expectedNotes: MidiNote[];
		scoreProps?: Partial<BaseScoreProps>;
		keyboardProps?: Partial<BaseKeyboardProps>;
		onNoteSelect?: (note: Note) => void;
		onDebugToggle?: () => void;
		onReset?: () => void;
		showProgressInfo?: boolean;
		customControls?: boolean;
	}

	let {
		exerciseState,
		exerciseTitle,
		exerciseDescription = '',
		expectedNotes,
		scoreProps = {},
		keyboardProps = {},
		onNoteSelect,
		onDebugToggle,
		onReset,
		showProgressInfo = true,
		customControls = false,
		children
	}: BaseExerciseProps & { children?: any } = $props();

	// Derived keyboard configuration
	let keyboardConfig = $derived.by(() => {
		if (expectedNotes.length === 0) {
			return {
				middleC: DEFAULT_KEYBOARD_CONFIG.defaultMiddleC,
				octaves: DEFAULT_KEYBOARD_CONFIG.defaultOctaves
			};
		}

		const minNote = Math.min(...expectedNotes);
		const maxNote = Math.max(...expectedNotes);
		const noteRange = maxNote - minNote;

		// Ensure we show at least from one C to the next C that encompasses all notes
		const minC = Math.floor((minNote - 12) / 12) * 12 + 12;
		const maxC = Math.ceil((maxNote + 12) / 12) * 12;

		const totalRange = maxC - minC;
		const octaves = Math.max(2, Math.ceil(totalRange / 12));
		const middleC = Math.max(24, minC + Math.floor((octaves * 12) / 2) - 6);

		return {
			middleC: Math.max(24, middleC),
			octaves: Math.min(7, octaves)
		};
	});

	// Merge keyboard props with computed config
	let finalKeyboardProps = $derived({
		midiNotes: exerciseState.midiNotes,
		middleC: keyboardConfig.middleC,
		octaves: keyboardConfig.octaves,
		interactive: exerciseState.debugMode,
		showLabels: exerciseState.showNoteNames,
		...keyboardProps
	});

	// Default score props
	let finalScoreProps = $derived({
		title: exerciseTitle,
		showClefs: true,
		...scoreProps
	});

	function handleNoteSelect(event: Event) {
		const target = event.target as HTMLSelectElement;
		const note = target.value as Note;
		onNoteSelect?.(note);
	}

	function handleDebugToggle() {
		onDebugToggle?.();
	}

	function handleReset() {
		onReset?.();
	}

	// Progress calculation
	let progressPercentage = $derived(() => {
		if (expectedNotes.length === 0) return 0;
		const correctNotes = exerciseState.midiNotes.filter((note: MidiNote) =>
			expectedNotes.includes(note)
		);
		return Math.round((correctNotes.length / expectedNotes.length) * 100);
	});

	// Cleanup on component destroy
	onDestroy(() => {
		// Any cleanup logic here
	});
</script>

<div class="exercise-container">
	<!-- Exercise Header -->
	<header class="exercise-header">
		<h1>{exerciseTitle}</h1>
		{#if exerciseDescription}
			<p class="exercise-description">{exerciseDescription}</p>
		{/if}
	</header>

	<!-- Exercise Controls -->
	<div class="exercise-controls">
		<div class="control-group">
			<label for="note-select">Key:</label>
			<select id="note-select" value={exerciseState.selectedNote} onchange={handleNoteSelect}>
				{#each AllNotes as note}
					<option value={note}>{note}</option>
				{/each}
			</select>
		</div>

		{#if !customControls}
			<div class="control-group">
				<button onclick={handleDebugToggle} class="debug-btn">
					{exerciseState.debugMode ? 'Disable' : 'Enable'} Debug Mode
				</button>
				<button onclick={handleReset} class="reset-btn"> Reset Exercise </button>
			</div>
		{/if}

		<!-- Custom controls slot -->
		{#if customControls}
			{@render children?.()}
		{/if}
	</div>

	<!-- Progress Information -->
	{#if showProgressInfo}
		<div class="progress-info">
			<div class="progress-bar">
				<div class="progress-fill" style="width: {progressPercentage}%"></div>
			</div>
			<div class="progress-stats">
				<span>Progress: {progressPercentage}%</span>
				<span>Errors: {exerciseState.errorCount}</span>
				{#if exerciseState.feedbackMessage}
					<span class="feedback-message">{exerciseState.feedbackMessage}</span>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Score Display -->
	<div class="score-section">
		<Score {...finalScoreProps} />
	</div>

	<!-- Keyboard Display -->
	<div
		class="keyboard-section"
		class:hidden={!exerciseState.showKeyboard && !exerciseState.debugMode}
	>
		<InteractiveKeyboard {...finalKeyboardProps} />
	</div>

	<!-- Debug Panel -->
	{#if exerciseState.debugMode}
		<div class="debug-section">
			<DebugPanel
				noteEvents={exerciseState.noteEvents}
				{expectedNotes}
				currentNotes={exerciseState.midiNotes}
			/>
		</div>
	{/if}

	<!-- Exercise-specific content -->
	<div class="exercise-content">
		{@render children?.()}
	</div>
</div>

<style>
	.exercise-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.exercise-header {
		text-align: center;
		margin-bottom: 1rem;
	}

	.exercise-header h1 {
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: var(--color-text, #333);
	}

	.exercise-description {
		font-size: 1.1rem;
		color: var(--color-text-secondary, #666);
		margin: 0;
	}

	.exercise-controls {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: var(--color-bg-secondary, #f8f9fa);
		border-radius: 8px;
		border: 1px solid var(--color-border, #e1e5e9);
	}

	.control-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.control-group label {
		font-weight: 500;
		color: var(--color-text, #333);
	}

	select {
		padding: 0.5rem;
		border: 1px solid var(--color-border, #ccc);
		border-radius: 4px;
		background: white;
		font-size: 1rem;
	}

	button {
		padding: 0.5rem 1rem;
		border: 1px solid var(--color-border, #ccc);
		border-radius: 4px;
		background: var(--color-bg, white);
		color: var(--color-text, #333);
		cursor: pointer;
		font-size: 1rem;
		transition: all 0.2s ease;
	}

	button:hover {
		background: var(--color-bg-hover, #f0f0f0);
		border-color: var(--color-border-hover, #999);
	}

	.debug-btn {
		background: var(--color-debug, #e3f2fd);
		border-color: var(--color-debug-border, #2196f3);
	}

	.reset-btn {
		background: var(--color-warning, #fff3e0);
		border-color: var(--color-warning-border, #ff9800);
	}

	.progress-info {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.progress-bar {
		width: 100%;
		height: 8px;
		background: var(--color-bg-secondary, #e0e0e0);
		border-radius: 4px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(
			90deg,
			var(--color-success, #4caf50),
			var(--color-success-light, #8bc34a)
		);
		transition: width 0.3s ease;
	}

	.progress-stats {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.9rem;
		color: var(--color-text-secondary, #666);
	}

	.feedback-message {
		font-weight: 500;
		color: var(--color-accent, #2196f3);
	}

	.score-section {
		min-height: 200px;
		display: flex;
		justify-content: center;
		align-items: center;
		background: var(--color-bg, white);
		border: 1px solid var(--color-border, #e1e5e9);
		border-radius: 8px;
		padding: 1rem;
	}

	.keyboard-section {
		transition: opacity 0.3s ease;
	}

	.keyboard-section.hidden {
		opacity: 0.3;
		pointer-events: none;
	}

	.debug-section {
		background: var(--color-debug-bg, #f3e5f5);
		border: 1px solid var(--color-debug-border, #9c27b0);
		border-radius: 8px;
		padding: 1rem;
	}

	.exercise-content {
		flex: 1;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.exercise-container {
			padding: 0.5rem;
			gap: 1rem;
		}

		.exercise-controls {
			flex-direction: column;
			gap: 0.5rem;
		}

		.control-group {
			width: 100%;
			justify-content: center;
		}

		.progress-stats {
			flex-direction: column;
			text-align: center;
			gap: 0.25rem;
		}
	}
</style>
