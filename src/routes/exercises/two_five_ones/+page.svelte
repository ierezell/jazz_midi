<svelte:options runes={true} />

<script lang="ts">
	import { chords, generateChordNotesDataFromChord } from '$lib/MusicTheoryUtils';
	import type {
		Chord,
		ChordVoicing,
		Inversion,
		MidiNote,
		Note,
		NoteFullName
	} from '$lib/types/notes';
	import {
		AllChordVoicings,
		MidiToNote,
		NoteToMidi,
		DEFAULT_OCTAVE
	} from '$lib/types/notes.constants';
	import type { NoteEvent, ScoreProps } from '$lib/types/types';
	import type { ValidationResult } from '$lib/types/exercise-api';
	import { untrack } from 'svelte';
	import BaseExercise from '../../../components/exercise/BaseExercise.svelte';
	import { page } from '$app/state';
	import { RhythmMode } from '$lib/exercises/utils/RhythmMode.svelte.js';
	import { rhythmPatterns } from '$lib/data/rhythmPatternsData';
	import BeatIndicator from '../../../components/exercise/BeatIndicator.svelte';

	const description =
		'Play the II-V-I progression as shown. Use the correct chords and voicings for each step.';

	interface Props {
		randomMode: boolean;
		onComplete?: () => void;
		inversion?: Inversion;
		rootKey?: Note;
		voicing?: ChordVoicing;
		progressiveHints?: boolean;
		prompt?: string;
	}

	let {
		randomMode = false,
		onComplete,
		inversion: propInversion,
		rootKey: propKey,
		voicing: propVoicing,
		progressiveHints,
		prompt
	}: Props = $props();

	// Journey Params
	const paramKey = $derived(page.url.searchParams.get('key') as Note);

	// Rhythm mode - filter to progression-friendly patterns
	// Rhythm mode — filter to progression-friendly patterns
	const progressionPatterns = (() => {
		const filtered = rhythmPatterns.filter((p) => p.isProgression);
		if (filtered.length > 0) return filtered;
		const preferred = ['blues-shells', 'jazz-charleston'];
		return [...rhythmPatterns].sort((a, b) => {
			const ai = preferred.indexOf(a.id);
			const bi = preferred.indexOf(b.id);
			if (ai !== -1 && bi !== -1) return ai - bi;
			if (ai !== -1) return -1;
			if (bi !== -1) return 1;
			return 0;
		});
	})();
	const rhythm = new RhythmMode(progressionPatterns);

	let currentChordIndex = $state(0);
	// @svelte-ignore state_referenced_locally
	let inversion: Inversion = $state(
		untrack(() => propInversion ?? (randomMode ? (Math.floor(Math.random() * 4) as Inversion) : 0))
	);
	// @svelte-ignore state_referenced_locally
	let voicing: ChordVoicing = $state(
		untrack(
			() =>
				propVoicing ??
				(randomMode
					? AllChordVoicings[Math.floor(Math.random() * AllChordVoicings.length)]
					: 'full-right')
		)
	);

	let effectiveRootKey = $derived(paramKey ?? propKey ?? 'C');
	let exerciseCompleted = $state(false);

	function handleParentReset(): void {
		resetProgression();
		exerciseCompleted = false;
	}

	// Function to reset progression state
	function resetProgression(): void {
		currentChordIndex = 0;
	}

	function getCurrentChord(selectedNote: Note): Chord {
		const twoChordRoot = NoteToMidi[(selectedNote + DEFAULT_OCTAVE) as NoteFullName] + 2;
		const fiveChordRoot = NoteToMidi[(selectedNote + DEFAULT_OCTAVE) as NoteFullName] + 7;
		const oneChordRoot = NoteToMidi[(selectedNote + DEFAULT_OCTAVE) as NoteFullName];

		const twoChord = chords(twoChordRoot as MidiNote, 'min7', inversion);
		const fiveChord = chords(fiveChordRoot as MidiNote, '7', inversion);
		const oneChord = chords(oneChordRoot as MidiNote, 'maj7', inversion);

		const progressionChords = [twoChord, fiveChord, oneChord];
		return progressionChords[currentChordIndex];
	}

	function generateExpectedNotes(selectedNote: Note): MidiNote[] {
		const curChord = getCurrentChord(selectedNote);

		return [curChord.root, curChord.third, curChord.fifth, curChord.seventh].filter(
			(n) => n != null
		) as MidiNote[];
	}

	function validateNoteEvent(
		selectedNote: Note,
		event: NoteEvent,
		expectedNotes: ReadonlyArray<MidiNote>,
		currentNotes: ReadonlyArray<MidiNote>
	): ValidationResult {
		const beatResult = currentNotes.length === 0 ? rhythm.validateHit(event) : null;
		if (beatResult && !beatResult.isHit) {
			return {
				isCorrect: false,
				message: `Off beat! (${beatResult.label})`,
				collected: false,
				resetCollected: false
			};
		}

		const chordName = getChordNames(selectedNote)[currentChordIndex];
		if (expectedNotes.includes(event.noteNumber)) {
			const correctCount = currentNotes.filter((note) => expectedNotes.includes(note)).length;
			const totalExpected = expectedNotes.length;

			if (correctCount === totalExpected) {
				if (currentChordIndex < 2) {
					setTimeout(() => {
						currentChordIndex++;
					}, 1000);
					return {
						isCorrect: true,
						message: getChordCompletedMessage(),
						collected: true,
						resetCollected: false
					};
				} else {
					return {
						isCorrect: true,
						message: getChordCompletedMessage(),
						collected: true,
						resetCollected: false
					};
				}
			} else {
				return {
					isCorrect: true,
					message: `Good! ${correctCount}/${totalExpected} notes for ${chordName}`,
					collected: true,
					resetCollected: false
				};
			}
		}

		const missing = expectedNotes.filter((n) => !currentNotes.includes(n));
		const missingNames = missing.map((n) => MidiToNote[n].slice(0, -1)).join(', ');
		return {
			isCorrect: false,
			message: `Wrong note. For ${chordName} expected: ${missingNames}`,
			collected: false,
			resetCollected: true
		};
	}

	function isCompleted(
		currentNotes: ReadonlyArray<MidiNote>,
		expectedNotes: ReadonlyArray<MidiNote>
	): boolean {
		if (expectedNotes.length === 0) return false;

		const correctNotes = currentNotes.filter((note) => expectedNotes.includes(note));
		const currentChordComplete = correctNotes.length === expectedNotes.length;
		const isFullProgressionComplete = currentChordComplete && currentChordIndex === 2;

		// Loop back to the first chord for continuous practice
		if (isFullProgressionComplete) {
			setTimeout(() => {
				currentChordIndex = 0;
			}, 1500);
		}

		return isFullProgressionComplete;
	}

	function getChordNames(selectedNote: Note = 'C'): string[] {
		const twoChordRoot = NoteToMidi[(selectedNote + DEFAULT_OCTAVE) as NoteFullName] + 2;
		const fiveChordRoot = NoteToMidi[(selectedNote + DEFAULT_OCTAVE) as NoteFullName] + 7;
		const oneChordRoot = NoteToMidi[(selectedNote + DEFAULT_OCTAVE) as NoteFullName];

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
	function handleInversionChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		inversion = parseInt(target.value) as Inversion;
		resetProgression();
	}

	function handleVoicingChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		voicing = target.value as typeof voicing;
		resetProgression();
	}
	function generateScoreProps(selectedNote: Note): ScoreProps {
		const currentChord = getCurrentChord(selectedNote);
		return {
			...generateChordNotesDataFromChord(currentChord, voicing),
			selectedNote: selectedNote
		};
	}
</script>

<div class="progression-exercise">
	<BaseExercise
		{randomMode}
		{generateExpectedNotes}
		{generateScoreProps}
		{validateNoteEvent}
		{isCompleted}
		onReset={handleParentReset}
		onComplete={onComplete ?? (() => {})}
		initialNote={effectiveRootKey}
		{description}
		exerciseType="progression"
		{progressiveHints}
		{prompt}
	>
		{#snippet children(api: import('$lib/types/exercise-api').ExerciseAPI)}
			{@const wasCompleted = exerciseCompleted}
			{@const isNowCompleted = api.completed}
			{#if isNowCompleted && !wasCompleted}
				{(exerciseCompleted = true)}
			{:else if !isNowCompleted && wasCompleted}
				{(exerciseCompleted = false)}
			{/if}
			<div class="progression-controls">
				{#if !randomMode && !page.url.searchParams.get('unitId')}
					<div class="control-group">
						<label for="inversion">Inversion:</label>
						<select id="inversion" value={inversion} onchange={handleInversionChange}>
							<option value={0}>Root</option>
							<option value={1}>1st</option>
							<option value={2}>2nd</option>
							<option value={3}>3rd</option>
						</select>
					</div>

					<div class="control-group">
						<label for="voicing">Voicing:</label>
						<select id="voicing" value={voicing} onchange={handleVoicingChange}>
							<option value="full-right">Full Right Hand</option>
							<option value="full-left">Full Left Hand</option>
							<option value="1735">1 & 7 Left / 3 & 5 Right</option>
							<option value="1537">1 & 5 Left / 3 & 7 Right</option>
						</select>
					</div>

					<div class="rhythm-controls">
						<label class="rhythm-toggle">
							<input type="checkbox" checked={rhythm.active} onchange={() => rhythm.toggle()} />
							<span>With Rhythm</span>
						</label>
						{#if rhythm.active}
							<select bind:value={rhythm.selectedPatternId} class="pattern-select">
								{#each rhythm.patterns as p}
									<option value={p.id}>{p.name} ({p.suggestedBpm} BPM)</option>
								{/each}
							</select>
							<BeatIndicator
								totalBeats={4}
								currentBeat={rhythm.currentBeat}
								hitPositions={rhythm.selectedPattern.hits}
								isActive={rhythm.active}
							/>
						{/if}
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

	.rhythm-controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background: var(--color-surface-raised, rgba(255, 255, 255, 0.04));
		border: 1px solid var(--color-border, #e0e0e0);
		border-radius: 0.5rem;
	}

	.rhythm-toggle {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-weight: 500;
		color: var(--color-text-muted, #666);
		cursor: pointer;
	}

	.pattern-select {
		width: 100%;
		padding: 0.25rem 0.5rem;
		border: 1px solid var(--color-border, #e0e0e0);
		border-radius: 0.375rem;
		background: var(--color-surface, #fff);
		color: var(--color-text, #333);
		font-size: 0.85rem;
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
