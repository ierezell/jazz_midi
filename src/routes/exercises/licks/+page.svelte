<svelte:options runes={true} />

<script lang="ts">
	import { onMount } from 'svelte';
	import type { MidiNote, Note, NoteEvent, NoteFullName, ScoreProps, Lick } from '$lib/types/types';
	import type { ValidationResult } from '$lib/types/exercise-api';
	import { MidiToNote, NoteToMidi } from '$lib/types/notes.constants';
	import BaseExercise from '../../../components/BaseExercise.svelte';
	import { licks, getLicksByHand, getLicksByDifficulty } from '$lib/data/licksData';

	const description =
		'Practice jazz licks and patterns to develop finger mechanics, muscle memory, and vocabulary. Learn classic phrases from different styles.';

	interface Props {
		randomMode: boolean;
		onComplete?: () => void;
		rootKey?: Note;
	}

	let { randomMode, onComplete, rootKey: propKey }: Props = $props();

	let currentLick: Lick | null = $state(null);
	let playedCount = $state(0);
	let selectedHand = $state<'left' | 'right' | 'both'>('right');
	let selectedDifficulty = $state<'beginner' | 'intermediate' | 'advanced' | 'all'>('beginner');
	let selectedLickId = $state<string>('');

	// Failure modes: 'hard-reset' or 'sticky-note'
	let failureMode = $state<'hard-reset' | 'sticky-note'>('hard-reset');

	// Progression modes: 'cycle', 'require-x', 'loop'
	let progressionMode = $state<'cycle' | 'require-x' | 'loop'>('cycle');
	let requiredRepetitions = $state(3);
	let currentRepetitions = $state(0);

	function getFilteredLicks(): Lick[] {
		let filtered = [...licks];

		// Filter by hand
		if (selectedHand !== 'both') {
			filtered = filtered.filter((lick) => lick.hand === selectedHand);
		}

		// Filter by difficulty
		if (selectedDifficulty !== 'all') {
			filtered = filtered.filter((lick) => lick.difficulty === selectedDifficulty);
		}

		return filtered;
	}

	function selectRandomLick() {
		const availableLicks = getFilteredLicks();
		if (availableLicks.length === 0) {
			// Fallback to all licks if no match
			currentLick = licks[Math.floor(Math.random() * licks.length)];
		} else {
			// Exclude current lick to ensure variety
			const otherLicks =
				currentLick !== null
					? availableLicks.filter((l) => l.id !== currentLick!.id)
					: availableLicks;

			if (otherLicks.length > 0) {
				currentLick = otherLicks[Math.floor(Math.random() * otherLicks.length)];
			} else {
				// If only one lick available, keep the current one
				currentLick = availableLicks[0];
			}
		}
		selectedLickId = currentLick.id;
		playedCount = 0;
	}

	function selectSpecificLick(lickId: string) {
		const lick = licks.find((l) => l.id === lickId);
		if (lick) {
			currentLick = lick;
			selectedLickId = lick.id;
			playedCount = 0;
		}
	}

	// Initialize first lick
	onMount(() => {
		selectRandomLick();
	});

	function generateExpectedNotes(selectedNote: Note): MidiNote[] {
		if (!currentLick) return [];

		// Return the NEXT expected note in the lick
		if (playedCount < currentLick.notes.length) {
			const note = currentLick.notes[playedCount];
			if (note && NoteToMidi[note]) {
				return [NoteToMidi[note]];
			}
		}
		return [];
	}

	function validateNoteEvent(
		selectedNote: Note,
		event: NoteEvent,
		expectedNotes: ReadonlyArray<MidiNote>
	): ValidationResult {
		if (!currentLick) {
			return {
				isCorrect: false,
				message: 'No lick loaded',
				collected: false,
				resetCollected: false
			};
		}

		const expectedMidi = expectedNotes[0];

		if (event.noteNumber === expectedMidi) {
			playedCount++;
			const remaining = currentLick.notes.length - playedCount;

			if (remaining === 0) {
				// Lick completed!
				currentRepetitions++;

				// Check progression mode
				if (progressionMode === 'loop') {
					// Just restart the same lick
					playedCount = 0;
					return {
						isCorrect: true,
						message: `Completed! Repetition ${currentRepetitions}. Keep practicing!`,
						collected: true,
						resetCollected: true
					};
				} else if (progressionMode === 'require-x') {
					if (currentRepetitions >= requiredRepetitions) {
						// Move to next lick
						currentRepetitions = 0;
						setTimeout(() => selectRandomLick(), 1500);
						return {
							isCorrect: true,
							message: `🎉 Perfect! ${requiredRepetitions} repetitions completed!`,
							collected: true,
							resetCollected: true
						};
					} else {
						// Need more repetitions
						playedCount = 0;
						return {
							isCorrect: true,
							message: `Great! ${currentRepetitions}/${requiredRepetitions} repetitions`,
							collected: true,
							resetCollected: true
						};
					}
				} else {
					// 'cycle' mode - move to next lick immediately
					currentRepetitions = 0;
					setTimeout(() => selectRandomLick(), 1500);
					return {
						isCorrect: true,
						message: `🎉 Perfect! "${currentLick.name}" completed!`,
						collected: true,
						resetCollected: true
					};
				}
			} else {
				return {
					isCorrect: true,
					message: `Good! ${playedCount}/${currentLick.notes.length}`,
					collected: true,
					resetCollected: false
				};
			}
		} else {
			// Wrong note
			const playedNote = MidiToNote[event.noteNumber];
			const expectedNoteName = currentLick.notes[playedCount];

			if (failureMode === 'hard-reset') {
				// Reset entire lick
				playedCount = 0;
				return {
					isCorrect: false,
					message: `Mistake! Starting over. You played ${playedNote}, expected ${expectedNoteName}`,
					collected: false,
					resetCollected: false
				};
			} else {
				// 'sticky-note' mode - don't advance, wait for correct note
				return {
					isCorrect: false,
					message: `Wrong note! You played ${playedNote}, expected ${expectedNoteName}. Try again!`,
					collected: false,
					resetCollected: false
				};
			}
		}
	}

	function generateScoreProps(selectedNote: Note): ScoreProps {
		if (!currentLick) {
			return {
				selectedNote,
				leftHand: [],
				rightHand: []
			};
		}

		// Display up to 12 notes to avoid VexFlow rendering issues
		const maxNotesToDisplay = 12;
		const displayNotes = currentLick.notes.slice(0, maxNotesToDisplay);
		const formattedNotes = displayNotes.map((note) => [note]);

		return {
			selectedNote,
			leftHand: currentLick.hand === 'left' ? formattedNotes : [],
			rightHand: currentLick.hand === 'right' ? formattedNotes : []
		};
	}

	function isCompleted(
		currentNotes: ReadonlyArray<MidiNote>,
		expectedNotes: ReadonlyArray<MidiNote>
	): boolean {
		return currentLick ? playedCount === currentLick.notes.length : false;
	}

	function handleParentReset(): void {
		selectRandomLick();
	}

	function getBpmColor(bpm: number): string {
		if (bpm < 100) return '#4caf50'; // Green - slow
		if (bpm < 130) return '#ff9800'; // Orange - medium
		return '#f44336'; // Red - fast
	}
</script>

<BaseExercise
	randomMode={true}
	{generateExpectedNotes}
	{generateScoreProps}
	{validateNoteEvent}
	{isCompleted}
	onReset={handleParentReset}
	onComplete={onComplete ?? (() => {})}
	initialNote={propKey || 'C'}
	{description}
	exerciseType="partition"
	showTempoControl={true}
>
	{#snippet children(api: import('$lib/types/exercise-api').ExerciseAPI)}
		<div class="licks-content">
			{#if currentLick}
				<div class="lick-header">
					<h2>{currentLick.name}</h2>
					<p class="lick-description">{currentLick.description}</p>
				</div>

				<div class="lick-meta">
					<div class="meta-badge category-badge">
						<span class="label">Category:</span>
						<span class="value">{currentLick.category}</span>
					</div>
					<div class="meta-badge hand-badge">
						<span class="label">Hand:</span>
						<span class="value">{currentLick.hand.toUpperCase()}</span>
					</div>
					<div
						class="meta-badge difficulty-badge"
						class:beginner={currentLick.difficulty === 'beginner'}
						class:intermediate={currentLick.difficulty === 'intermediate'}
						class:advanced={currentLick.difficulty === 'advanced'}
					>
						<span class="label">Level:</span>
						<span class="value">{currentLick.difficulty}</span>
					</div>
					<div
						class="meta-badge bpm-badge"
						style="--bpm-color: {getBpmColor(currentLick.suggestedBpm)}"
					>
						<span class="label">BPM:</span>
						<span class="value">{currentLick.suggestedBpm}</span>
					</div>
				</div>

				{#if currentLick.tags && currentLick.tags.length > 0}
					<div class="tags">
						{#each currentLick.tags as tag}
							<span class="tag">#{tag}</span>
						{/each}
					</div>
				{/if}

				<div class="progress-section">
					<div class="progress-bar">
						<div
							class="progress-fill"
							style="width: {(playedCount / currentLick.notes.length) * 100}%"
						></div>
					</div>
					<p class="progress-text">
						{playedCount}/{currentLick.notes.length} notes
					</p>
				</div>

				<div class="controls-section">
					<div class="control-group">
						<label for="lick-select">Select Lick:</label>
						<select
							id="lick-select"
							bind:value={selectedLickId}
							onchange={() => selectSpecificLick(selectedLickId)}
						>
							{#each licks as lick}
								<option value={lick.id}>{lick.name} ({lick.hand} - {lick.difficulty})</option>
							{/each}
						</select>
					</div>

					<div class="control-group">
						<label for="hand-select">Hand:</label>
						<select id="hand-select" bind:value={selectedHand}>
							<option value="left">Left Hand</option>
							<option value="right">Right Hand</option>
							<option value="both">Both Hands</option>
						</select>
					</div>

					<div class="control-group">
						<label for="difficulty-select">Difficulty:</label>
						<select id="difficulty-select" bind:value={selectedDifficulty}>
							<option value="beginner">Beginner</option>
							<option value="intermediate">Intermediate</option>
							<option value="advanced">Advanced</option>
							<option value="all">All Levels</option>
						</select>
					</div>

					<div class="control-group">
						<label for="failure-mode">On Mistake:</label>
						<select id="failure-mode" bind:value={failureMode}>
							<option value="hard-reset">Hard Reset (Start Over)</option>
							<option value="sticky-note">Sticky Note (Wait for Correct)</option>
						</select>
					</div>

					<div class="control-group">
						<label for="progression-mode">Progression:</label>
						<select id="progression-mode" bind:value={progressionMode}>
							<option value="cycle">Cycle on Success</option>
							<option value="require-x">Require Repetitions</option>
							<option value="loop">Loop Same Lick</option>
						</select>
					</div>

					{#if progressionMode === 'require-x'}
						<div class="control-group">
							<label for="repetitions">Repetitions:</label>
							<input
								id="repetitions"
								type="number"
								min="1"
								max="10"
								bind:value={requiredRepetitions}
								class="repetitions-input"
							/>
						</div>
					{/if}

					<button
						class="new-lick-btn"
						onclick={() => {
							selectRandomLick();
						}}
					>
						Random Lick
					</button>
				</div>
			{:else}
				<p class="loading">Loading lick...</p>
			{/if}
		</div>
	{/snippet}
</BaseExercise>

<style>
	.licks-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 1rem;
		max-width: 800px;
		margin: 0 auto;
	}

	.lick-header {
		text-align: center;
	}

	.lick-header h2 {
		color: var(--color-theme-1, #9b59b6);
		margin: 0 0 0.5rem 0;
		font-size: 1.8rem;
		font-weight: 700;
	}

	.lick-description {
		color: var(--color-text, inherit);
		opacity: 0.8;
		margin: 0;
		font-size: 1rem;
		line-height: 1.4;
	}

	.lick-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		justify-content: center;
	}

	.meta-badge {
		display: flex;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: rgba(155, 89, 182, 0.1);
		border: 1px solid rgba(155, 89, 182, 0.2);
		border-radius: 8px;
		font-size: 0.9rem;
		align-items: center;
	}

	.meta-badge .label {
		font-weight: 600;
		opacity: 0.7;
	}

	.meta-badge .value {
		font-weight: 700;
		text-transform: capitalize;
	}

	.category-badge .value {
		color: #3498db;
	}

	.hand-badge .value {
		color: #e67e22;
	}

	.difficulty-badge.beginner .value {
		color: #4caf50;
	}

	.difficulty-badge.intermediate .value {
		color: #ff9800;
	}

	.difficulty-badge.advanced .value {
		color: #f44336;
	}

	.bpm-badge .value {
		color: var(--bpm-color, #3498db);
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: center;
	}

	.tag {
		padding: 0.25rem 0.75rem;
		background: var(--color-theme-1, #9b59b6);
		color: white;
		border-radius: 12px;
		font-size: 0.85rem;
		font-weight: 500;
	}

	.progress-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: center;
	}

	.progress-bar {
		width: 100%;
		height: 24px;
		background: rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(155, 89, 182, 0.3);
		border-radius: 12px;
		overflow: hidden;
		position: relative;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #9b59b6, #8e44ad);
		transition: width 0.3s ease;
		border-radius: 12px;
	}

	.progress-text {
		font-size: 1.1rem;
		font-weight: bold;
		color: var(--color-primary, #9b59b6);
		margin: 0;
	}

	.controls-section {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
		align-items: flex-end;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(155, 89, 182, 0.2);
		border-radius: 12px;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.control-group label {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--color-text, inherit);
		opacity: 0.8;
	}

	.control-group select {
		padding: 0.5rem 1rem;
		border: 2px solid rgba(155, 89, 182, 0.3);
		border-radius: 8px;
		font-size: 0.95rem;
		background: var(--color-bg-1, #1a1a1a);
		color: var(--color-text, white);
		cursor: pointer;
		transition: all 0.2s;
	}

	.control-group select:hover {
		border-color: var(--color-theme-1, #9b59b6);
	}

	.control-group select:focus {
		outline: none;
		border-color: var(--color-theme-1, #9b59b6);
		box-shadow: 0 0 0 3px rgba(155, 89, 182, 0.1);
	}

	.repetitions-input {
		padding: 0.5rem 1rem;
		border: 2px solid rgba(155, 89, 182, 0.3);
		border-radius: 8px;
		font-size: 0.95rem;
		background: var(--color-bg-1, #1a1a1a);
		color: var(--color-text, white);
		width: 80px;
		transition: all 0.2s;
	}

	.repetitions-input:hover,
	.repetitions-input:focus {
		outline: none;
		border-color: var(--color-theme-1, #9b59b6);
		box-shadow: 0 0 0 3px rgba(155, 89, 182, 0.1);
	}

	.new-lick-btn {
		padding: 0.5rem 1.5rem;
		background: var(--color-theme-1, #9b59b6);
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.new-lick-btn:hover {
		background: var(--color-theme-2, #8e44ad);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(155, 89, 182, 0.3);
	}

	.new-lick-btn:active {
		transform: translateY(0);
	}

	.loading {
		text-align: center;
		font-size: 1.2rem;
		color: var(--color-text, inherit);
		opacity: 0.8;
		padding: 2rem;
	}

	@media (max-width: 600px) {
		.licks-content {
			padding: 0.5rem;
			gap: 1rem;
		}

		.lick-header h2 {
			font-size: 1.4rem;
		}

		.lick-meta {
			flex-direction: column;
			align-items: stretch;
		}

		.meta-badge {
			justify-content: space-between;
		}

		.controls-section {
			flex-direction: column;
		}

		.control-group {
			width: 100%;
		}

		.new-lick-btn {
			width: 100%;
		}
	}
</style>
