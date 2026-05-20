<svelte:options runes={true} />

<script lang="ts">
	import type { MidiNote, Note, NoteEvent, NoteFullName, ScoreProps } from '$lib/types/types';
	import type { ValidationResult } from '$lib/types/exercise-api';
	import BaseExercise from '../../../components/exercise/BaseExercise.svelte';
	import {
		validateGhostNote,
		isGhostNoteChallengeCompleted,
		getExpectedGhostNote,
		createGhostNoteState,
		type GhostNoteState
	} from '$lib/exercises/utils/ghostNoteValidation';
	import { MidiToNote } from '$lib/types/notes.constants';

	// Ghost Note Challenge: 8th-note scales where downbeats are soft (< 40) and upbeats are accented (> 80)
	const GHOST_VELOCITY_MAX = 40;
	const ACCENT_VELOCITY_MIN = 80;

	let state: GhostNoteState = $state(createGhostNoteState());

	function resetState() {
		state = createGhostNoteState();
	}

	function generateExpectedNotes(selectedNote: Note): MidiNote[] {
		return getExpectedGhostNote(selectedNote, 4);
	}

	function generateScoreProps(selectedNote: Note): ScoreProps {
		const notes = getExpectedGhostNote(selectedNote, 4);
		return {
			selectedNote,
			leftHand: [],
			rightHand: [notes.map((n) => MidiToNote[n] as NoteFullName)]
		};
	}

	function validateNoteEvent(
		selectedNote: Note,
		event: NoteEvent,
		_expectedNotes: ReadonlyArray<MidiNote>,
		_currentNotes: ReadonlyArray<MidiNote>
	): ValidationResult {
		const scaleNotes = getExpectedGhostNote(selectedNote, 4);
		const config = {
			ghostVelocityMax: GHOST_VELOCITY_MAX,
			accentVelocityMin: ACCENT_VELOCITY_MIN,
			scaleNotes
		};
		return validateGhostNote(event, config, state);
	}

	function isCompleted(
		_currentNotes: ReadonlyArray<MidiNote>,
		_expectedNotes: ReadonlyArray<MidiNote>
	): boolean {
		const scaleNotes = getExpectedGhostNote('C', 4); // Will be updated with actual note
		const config = {
			ghostVelocityMax: GHOST_VELOCITY_MAX,
			accentVelocityMin: ACCENT_VELOCITY_MIN,
			scaleNotes
		};
		return isGhostNoteChallengeCompleted(config, state, 16);
	}

	// Calculate accuracy for display
	let accuracy = $derived.by(() => {
		if (state.notesPlayed === 0) return 0;
		const totalCorrect = state.ghostNotesCorrect + state.accentNotesCorrect;
		return Math.round((totalCorrect / state.notesPlayed) * 100);
	});

	let beatIndicator = $derived(
		state.beatPosition === 0 ? '↓ Beat (Ghost)' : '↑ & of Beat (Accent)'
	);
</script>

<BaseExercise
	randomMode={false}
	{generateExpectedNotes}
	{generateScoreProps}
	{validateNoteEvent}
	{isCompleted}
	onReset={resetState}
	onComplete={() => {}}
	description="Play 8th-note scales with jazz articulation. Downbeats = soft ghost notes (< 40 velocity). Upbeats ('and') = accented (> 80 velocity)."
	initialNote="C"
	exerciseType="scale"
	showTempoControl={true}
	timingModeLabel="Play with swing"
	perNoteTiming={true}
	prompt={beatIndicator}
>
	{#snippet children(_api: import('$lib/types/exercise-api').ExerciseAPI)}
		<div class="ghost-note-content">
			<div class="velocity-guide card-premium">
				<h3>Articulation Guide</h3>
				<div class="velocity-rules">
					<div class="rule ghost">
						<span class="rule-icon">👻</span>
						<div class="rule-text">
							<strong>Ghost Notes</strong>
							<span>Downbeats: Velocity &lt; {GHOST_VELOCITY_MAX}</span>
						</div>
					</div>
					<div class="rule accent">
						<span class="rule-icon">💥</span>
						<div class="rule-text">
							<strong>Accents</strong>
							<span>Upbeats ('and'): Velocity ≥ {ACCENT_VELOCITY_MIN}</span>
						</div>
					</div>
				</div>
			</div>

			<div class="stats-grid">
				<div class="stat-card">
					<span class="stat-label">Notes Played</span>
					<span class="stat-value">{state.notesPlayed}</span>
				</div>
				<div class="stat-card">
					<span class="stat-label">Ghost Notes ✓</span>
					<span class="stat-value success">{state.ghostNotesCorrect}</span>
				</div>
				<div class="stat-card">
					<span class="stat-label">Accents ✓</span>
					<span class="stat-value success">{state.accentNotesCorrect}</span>
				</div>
				<div class="stat-card">
					<span class="stat-label">Accuracy</span>
					<span
						class="stat-value"
						class:success={accuracy >= 80}
						class:warn={accuracy < 80 && accuracy >= 50}
						class:error={accuracy < 50}
					>
						{accuracy}%
					</span>
				</div>
			</div>
		</div>
	{/snippet}
</BaseExercise>

<style>
	.ghost-note-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.velocity-guide {
		padding: 1.5rem;
	}

	.velocity-guide h3 {
		margin: 0 0 1rem 0;
		color: var(--color-text);
		font-size: 1.2rem;
	}

	.velocity-rules {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.rule {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		border-radius: 8px;
		background: var(--color-surface-raised);
	}

	.rule-icon {
		font-size: 1.5rem;
	}

	.rule-text {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.rule-text strong {
		color: var(--color-text);
	}

	.rule-text span {
		font-size: 0.85rem;
		color: var(--color-text-muted);
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
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
		text-align: center;
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text);
	}

	.stat-value.success {
		color: var(--color-success);
	}

	.stat-value.warn {
		color: var(--color-warn);
	}

	.stat-value.error {
		color: var(--color-error);
	}
</style>

