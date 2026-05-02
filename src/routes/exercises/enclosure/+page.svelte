<svelte:options runes={true} />

<script lang="ts">
	import { untrack } from 'svelte';
	import type { MidiNote, Note, NoteEvent, NoteFullName, ScoreProps } from '$lib/types/types';
	import type { ValidationResult } from '$lib/types/exercise-api';
	import BaseExercise from '../../../components/exercise/BaseExercise.svelte';
	import { NoteToMidi, MidiToNote } from '$lib/types/notes.constants';

	// Enclosure patterns: circling target tones
	// Example: To target E (3rd of C), play D -> F# -> E
	type EnclosurePattern = {
		name: string;
		description: string;
		steps: number[]; // Semitone offsets from target (played in order)
		targetDegree: string;
	};

	const PATTERNS: EnclosurePattern[] = [
		{
			name: 'Lower Neighbor',
			description: 'Approach from below',
			steps: [-1, 0],
			targetDegree: 'any'
		},
		{
			name: 'Upper Neighbor',
			description: 'Approach from above',
			steps: [1, 0],
			targetDegree: 'any'
		},
		{
			name: 'Double Enclosure',
			description: 'Below → Above → Target',
			steps: [-1, 2, 0],
			targetDegree: '3rd or 7th'
		},
		{
			name: 'Chromatic Enclosure',
			description: 'Half-step below → Half-step above → Target',
			steps: [-1, 1, 0],
			targetDegree: '3rd or 7th'
		},
		{
			name: 'Bebop Enclosure',
			description: 'Scale below → Chromatic above → Target',
			steps: [-2, 1, 0],
			targetDegree: '3rd'
		}
	];

	// Target chord degrees in major scale
	const TARGET_DEGREES = [
		{ name: 'Root', offset: 0, quality: 'major' },
		{ name: '3rd', offset: 4, quality: 'major' },
		{ name: '5th', offset: 7, quality: 'perfect' },
		{ name: '7th', offset: 11, quality: 'major' }
	];

	let currentPattern = $state<EnclosurePattern>(PATTERNS[0]);
	let targetDegree = $state(TARGET_DEGREES[1]); // Default to 3rd
	let targetNote = $state<MidiNote | null>(null);
	let expectedNotes = $state<MidiNote[]>([]);
	let stepIndex = $state(0);
	let completedPatterns = $state(0);
	let patternAttempts = $state(0);

	function generateEnclosure(rootNote: Note): { target: MidiNote; notes: MidiNote[] } {
		// Calculate target note based on degree
		const baseMidi = NoteToMidi[`${rootNote}4` as keyof typeof NoteToMidi];
		const target = (baseMidi + targetDegree.offset) as MidiNote;

		// Calculate enclosure notes
		const notes = currentPattern.steps.map((step) => (target + step) as MidiNote);

		return { target, notes };
	}

	function startNewPattern(selectedNote: Note) {
		// Random pattern
		currentPattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];

		// Random target degree
		targetDegree = TARGET_DEGREES[Math.floor(Math.random() * TARGET_DEGREES.length)];

		const result = generateEnclosure(selectedNote);
		targetNote = result.target;
		expectedNotes = result.notes;
		stepIndex = 0;
	}

	function generateExpectedNotes(selectedNote: Note): MidiNote[] {
		if (expectedNotes.length === 0) {
			startNewPattern(selectedNote);
		}
		return expectedNotes;
	}

	function generateScoreProps(selectedNote: Note): ScoreProps {
		const noteNames: NoteFullName[] = expectedNotes.map((n) => MidiToNote[n] as NoteFullName);

		return {
			selectedNote,
			leftHand: [],
			rightHand: [noteNames]
		};
	}

	function validateNoteEvent(
		selectedNote: Note,
		event: NoteEvent,
		_expectedNotes: ReadonlyArray<MidiNote>,
		_currentNotes: ReadonlyArray<MidiNote>
	): ValidationResult {
		if (expectedNotes.length === 0) {
			startNewPattern(selectedNote);
		}

		const expectedNote = expectedNotes[stepIndex];

		if (event.noteNumber === expectedNote) {
			stepIndex++;

			if (stepIndex >= expectedNotes.length) {
				// Pattern complete
				completedPatterns++;
				patternAttempts = 0;

				setTimeout(() => startNewPattern(selectedNote), 800);

				return {
					isCorrect: true,
					message: `Perfect! ${currentPattern.name} complete.`,
					collected: true,
					resetCollected: false
				};
			}

			// Next step
			const nextNoteName = MidiToNote[expectedNotes[stepIndex]];
			return {
				isCorrect: true,
				message: `Good! Now play ${nextNoteName}`,
				collected: true,
				resetCollected: false
			};
		}

		// Wrong note
		patternAttempts++;
		const correctNoteName = MidiToNote[expectedNote];
		return {
			isCorrect: false,
			message: `Expected ${correctNoteName}. Try again!`,
			collected: false,
			resetCollected: false
		};
	}

	function isCompleted(): boolean {
		return completedPatterns >= 8;
	}

	function resetState(selectedNote: Note) {
		completedPatterns = 0;
		patternAttempts = 0;
		startNewPattern(selectedNote);
	}

	// Initialize on mount - use untrack to avoid state mutation warning
	$effect(() => {
		if (untrack(() => expectedNotes.length) === 0) {
			// Use setTimeout to defer state mutation outside of effect
			setTimeout(() => startNewPattern('C'), 0);
		}
	});
</script>

<BaseExercise
	randomMode={true}
	{generateExpectedNotes}
	{generateScoreProps}
	{validateNoteEvent}
	{isCompleted}
	onReset={() => resetState('C')}
	onComplete={() => {}}
	description="Practice the bebop technique of 'enclosing' target tones. Play approach notes that circle around your target before landing on it. Essential for jazz improvisation."
	initialNote="C"
	exerciseType="scale"
	showTempoControl={true}
	timingModeLabel="Play with swing"
	prompt={currentPattern ? `${currentPattern.name}: ${currentPattern.description}` : 'Loading...'}
>
	{#snippet children(api: import('$lib/types/exercise-api').ExerciseAPI)}
		<div class="enclosure-content">
			<div class="pattern-info card-premium">
				<div class="info-row">
					<span class="info-label">Target:</span>
					<span class="info-value">{targetDegree.name} of {api.selectedNote}</span>
				</div>
				<div class="info-row">
					<span class="info-label">Pattern:</span>
					<span class="info-value highlight">{currentPattern.name}</span>
				</div>
				<div class="sequence-display">
					{#each expectedNotes as note, i}
						<div
							class="sequence-note"
							class:completed={i < stepIndex}
							class:current={i === stepIndex}
						>
							<span class="note-name">{MidiToNote[note]}</span>
							{#if i < expectedNotes.length - 1}
								<span class="arrow">→</span>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<div class="stats-grid">
				<div class="stat-card">
					<span class="stat-label">Patterns</span>
					<span class="stat-value">{completedPatterns} / 8</span>
				</div>
				<div class="stat-card">
					<span class="stat-label">Step</span>
					<span class="stat-value">{stepIndex + 1} / {expectedNotes.length}</span>
				</div>
			</div>

			<div class="patterns-guide card-premium">
				<h4>Enclosure Patterns</h4>
				<div class="patterns-list">
					{#each PATTERNS as pattern}
						<div class="pattern-item" class:active={pattern.name === currentPattern.name}>
							<strong>{pattern.name}</strong>
							<span>{pattern.description}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/snippet}
</BaseExercise>

<style>
	.enclosure-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.pattern-info {
		padding: 1.5rem;
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.info-label {
		color: var(--color-text-muted);
		font-size: 0.9rem;
	}

	.info-value {
		color: var(--color-text);
		font-weight: 600;
	}

	.info-value.highlight {
		color: var(--color-primary);
	}

	.sequence-display {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
		padding-top: 1rem;
		border-top: 1px solid var(--color-border);
	}

	.sequence-note {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.note-name {
		padding: 0.5rem 1rem;
		background: var(--color-surface-raised);
		border: 2px solid var(--color-border);
		border-radius: 8px;
		font-weight: 600;
		color: var(--color-text);
		transition: all 0.3s;
	}

	.sequence-note.completed .note-name {
		background: var(--color-success);
		border-color: var(--color-success);
		color: white;
	}

	.sequence-note.current .note-name {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: white;
		animation: pulse 1.5s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
	}

	.arrow {
		color: var(--color-text-muted);
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.stat-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		background: var(--color-surface-raised);
		border-radius: 8px;
		border: 1px solid var(--color-border);
	}

	.stat-label {
		font-size: 0.85rem;
		color: var(--color-text-muted);
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text);
	}

	.patterns-guide {
		padding: 1.5rem;
	}

	.patterns-guide h4 {
		margin: 0 0 1rem 0;
		color: var(--color-text);
	}

	.patterns-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.pattern-item {
		display: flex;
		flex-direction: column;
		padding: 0.75rem;
		background: var(--color-surface);
		border-radius: 6px;
		border: 1px solid var(--color-border);
		transition: all 0.2s;
	}

	.pattern-item.active {
		border-color: var(--color-primary);
		background: rgba(88, 166, 255, 0.1);
	}

	.pattern-item strong {
		color: var(--color-text);
		font-size: 0.95rem;
	}

	.pattern-item span {
		color: var(--color-text-muted);
		font-size: 0.85rem;
	}
</style>
