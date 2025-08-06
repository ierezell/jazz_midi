<svelte:options runes={true} />

<script lang="ts">
	import { chords } from '$lib/MusicTheoryUtils';
	import type { MidiNote, Note, NoteFullName } from '$lib/types/notes';
	import { MidiToNote, NoteToMidi } from '$lib/types/notes.constants';
	import type { NoteEvent } from '$lib/types/types';
	import { userStatsService } from '$lib/UserStatsService';
	import { onMount } from 'svelte';
	import BaseExercise from '../../components/BaseExercise.svelte';

	// Random mode props
	interface Props {
		randomMode?: boolean;
		randomNote?: Note;
		onRandomComplete?: () => void;
	}

	let { randomMode = false, randomNote, onRandomComplete }: Props = $props();

	let currentChordIndex = $state(0);

	// Generate expected notes function - returns current chord notes
	function generateExpectedNotes(selectedNote: Note): MidiNote[] {
		const twoChordRoot = NoteToMidi[(selectedNote + '4') as NoteFullName] + 2;
		const fiveChordRoot = NoteToMidi[(selectedNote + '4') as NoteFullName] + 7;
		const oneChordRoot = NoteToMidi[(selectedNote + '4') as NoteFullName];

		const twoChord = chords(twoChordRoot as MidiNote, 'min7');
		const fiveChord = chords(fiveChordRoot as MidiNote, '7');
		const oneChord = chords(oneChordRoot as MidiNote, 'maj7');

		const progressionChords = [twoChord, fiveChord, oneChord];
		const currentChord = progressionChords[currentChordIndex];

		return [currentChord.root, currentChord.third, currentChord.fifth, currentChord.seventh].filter(
			(n) => n != null
		) as MidiNote[];
	}

	// Custom validation for progression
	function validateNoteEvent(
		event: NoteEvent,
		expectedNotes: MidiNote[],
		currentNotes: MidiNote[]
	): { isCorrect: boolean; message: string } {
		if (expectedNotes.includes(event.noteNumber)) {
			const correctCount = currentNotes.filter((note) => expectedNotes.includes(note)).length;
			const totalExpected = expectedNotes.length;

			if (correctCount === totalExpected) {
				// Current chord is complete
				if (currentChordIndex < 2) {
					// Move to next chord after a short delay
					setTimeout(() => {
						currentChordIndex++;
					}, 1000);
					return { isCorrect: true, message: getChordCompletedMessage() };
				} else {
					// All chords completed
					return { isCorrect: true, message: getChordCompletedMessage() };
				}
			} else {
				return {
					isCorrect: true,
					message: `Good! ${correctCount}/${totalExpected} notes for ${getChordNames('C')[currentChordIndex]}`
				};
			}
		}

		return {
			isCorrect: false,
			message: `Wrong note! Expected: ${getChordNames()[currentChordIndex]}`
		};
	}

	// Custom completion check - only complete when all 3 chords are done
	function isCompleted(currentNotes: MidiNote[], expectedNotes: MidiNote[]): boolean {
		if (expectedNotes.length === 0) return false;

		const correctNotes = currentNotes.filter((note) => expectedNotes.includes(note));
		const currentChordComplete = correctNotes.length === expectedNotes.length;

		// Only consider the entire exercise complete when we're on the last chord (index 2)
		// AND that chord is complete
		return currentChordComplete && currentChordIndex === 2;
	}

	function getChordNames(selectedNote: Note = 'C'): string[] {
		const twoChordRoot = NoteToMidi[(selectedNote + '4') as NoteFullName] + 2;
		const fiveChordRoot = NoteToMidi[(selectedNote + '4') as NoteFullName] + 7;
		const oneChordRoot = NoteToMidi[(selectedNote + '4') as NoteFullName];

		return [
			`${MidiToNote[twoChordRoot as MidiNote].slice(0, -1)}m7`,
			`${MidiToNote[fiveChordRoot as MidiNote].slice(0, -1)}7`,
			`${MidiToNote[oneChordRoot as MidiNote].slice(0, -1)}maj7`
		];
	}

	function getChordCompletedMessage(): string {
		if (currentChordIndex < 2) {
			return `Great! Now play ${getChordNames()[currentChordIndex + 1]}`;
		} else {
			return `Perfect! Complete ii-V-I progression! 🎵✨`;
		}
	}

	function nextChord() {
		if (currentChordIndex < 2) {
			currentChordIndex++;
		} else {
			// Progression completed
			return true;
		}
		return false;
	}

	function onExerciseComplete() {
		// This is only called when the entire exercise is complete (all 3 chords)
		if (randomMode && onRandomComplete) {
			// Small delay to show completion before moving to next exercise
			setTimeout(() => {
				onRandomComplete();
			}, 1500);
		} else {
			const timeSpent = 10; // placeholder
			const accuracy = 100; // placeholder

			userStatsService.updateNoteProgress(
				'C', // selectedNote will be available from BaseExercise
				'progression',
				undefined,
				true,
				timeSpent,
				accuracy
			);
		}
	}

	function onExerciseReset() {
		currentChordIndex = 0;
	}

	let scoreProps = $derived.by(() => {
		const selectedNote = randomMode ? randomNote : 'C';
		return {
			notes: generateExpectedNotes(selectedNote || 'C').map(
				(note) => MidiToNote[note as MidiNote]
			) as NoteFullName[],
			highlightedNotes: [],
			title: `${selectedNote || 'C'} ii-V-I: ${getChordNames(selectedNote || 'C')[currentChordIndex]} (${currentChordIndex + 1}/3)`
		};
	});

	onMount(() => {
		// Remove audioManager.initialize() as it doesn't exist
	});
</script>

<div class="progression-exercise">
	<BaseExercise
		exerciseTitle={randomMode ? 'Random ii-V-I Progression' : 'ii-V-I Progression'}
		exerciseDescription={randomMode
			? `Play ${randomNote} ii-V-I progression`
			: 'Play each chord in sequence: ii7 - V7 - Imaj7'}
		initialSelectedNote={randomMode ? randomNote : 'C'}
		exerciseType="progression"
		{randomMode}
		{generateExpectedNotes}
		{validateNoteEvent}
		{isCompleted}
		{scoreProps}
		keyboardProps={{
			chordToneInfo: [],
			showChordTones: true
		}}
		customControls={true}
		{onExerciseComplete}
		{onExerciseReset}
	>
		{#snippet children(api: any)}
			<div class="progression-controls">
				{#if !randomMode}
					<div class="control-group">
						<button onclick={api.toggleDebug} class="debug-btn">
							{api.debugMode ? 'Disable' : 'Enable'} Debug Mode
						</button>
						<button onclick={api.resetExercise} class="reset-btn">Reset</button>
					</div>
				{:else}
					<div class="control-group">
						<button onclick={api.resetExercise} class="reset-btn">Reset</button>
					</div>
				{/if}
				<div class="chord-progress">
					{#each getChordNames(api.selectedNote) as chordName, index}
						<div
							class="chord-indicator"
							class:active={index === currentChordIndex}
							class:completed={index < currentChordIndex}
						>
							{chordName}
						</div>
					{/each}
				</div>
			</div>
			<div class="exercise-status">
				<div class="current-chord">
					Current: {getChordNames(api.selectedNote)[currentChordIndex]} ({currentChordIndex + 1}/3)
				</div>
				<div class="progress">
					Progress: {Math.round(
						(api.currentNotes.filter((n: any) => api.expectedNotes.includes(n)).length /
							api.expectedNotes.length) *
							100
					)}%
				</div>
				<div class="mistakes">
					Mistakes: {api.mistakes}
				</div>
				{#if api.completed}
					<div class="completion">🎉 ii-V-I Completed!</div>
				{/if}
			</div>
		{/snippet}
	</BaseExercise>
</div>

<style>
	.progression-exercise {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		font-family: system-ui, sans-serif;
	}

	.progression-controls {
		display: flex;
		gap: 2rem;
		margin-bottom: 1rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.control-group {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.debug-btn,
	.reset-btn {
		padding: 0.5rem 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		background: white;
		cursor: pointer;
		transition: all 0.2s;
	}

	.debug-btn {
		background: var(--color-debug, #e3f2fd);
		border-color: var(--color-debug-border, #2196f3);
	}

	.debug-btn:hover,
	.reset-btn:hover {
		background: #f5f5f5;
		transform: translateY(-1px);
	}

	.chord-progress {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.chord-indicator {
		padding: 0.5rem 1rem;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		background: #f5f5f5;
		font-weight: 500;
		transition: all 0.3s;
		min-width: 80px;
		text-align: center;
	}

	.chord-indicator.active {
		border-color: #2196f3;
		background: #e3f2fd;
		color: #1976d2;
		transform: scale(1.05);
	}

	.chord-indicator.completed {
		border-color: #4caf50;
		background: #e8f5e8;
		color: #2e7d32;
	}

	.exercise-status {
		display: flex;
		gap: 2rem;
		padding: 1rem;
		background: #f8f9fa;
		border-radius: 8px;
		margin-top: 1rem;
		flex-wrap: wrap;
	}

	.current-chord,
	.progress,
	.mistakes {
		font-weight: 500;
	}

	.current-chord {
		color: #1976d2;
	}

	.completion {
		color: #28a745;
		font-weight: bold;
		animation: bounce 0.5s ease-in-out;
	}

	@keyframes bounce {
		0%,
		20%,
		50%,
		80%,
		100% {
			transform: translateY(0);
		}
		40% {
			transform: translateY(-10px);
		}
		60% {
			transform: translateY(-5px);
		}
	}

	@media (max-width: 768px) {
		.progression-exercise {
			padding: 1rem;
		}

		.progression-controls {
			flex-direction: column;
			gap: 1rem;
		}

		.chord-progress {
			flex-direction: column;
			gap: 0.5rem;
		}

		.exercise-status {
			flex-direction: column;
			gap: 0.5rem;
		}
	}
</style>
