<script lang="ts">
	import type { MidiNote, Note, NoteEvent, NoteFullName, ScoreProps } from '$lib/types/types';
	import type { ValidationResult } from '$lib/types/exercise-api';
	import BaseExercise from '../../../components/BaseExercise.svelte';
	import {
		validateHandNote,
		isHandIndependenceCompleted,
		midiToNoteName
	} from '$lib/handIndependenceValidation';

	// Level 1 data: Cm7 shell voicing + C major scale
	const L1_LH: MidiNote[] = [36, 58] as MidiNote[]; // C2 (root), Bb3 (minor 7th)
	const L1_RH: MidiNote[] = [60, 62, 64, 65, 67, 69, 71, 72] as MidiNote[]; // C major scale C4–C5

	// Level 2 data: walking bass (Cmaj7 arpeggio) + C major pentatonic
	const L2_LH: MidiNote[] = [36, 40, 43, 47] as MidiNote[]; // C2, E2, G2, B2
	const L2_RH: MidiNote[] = [60, 64, 67, 69, 72] as MidiNote[]; // C4, E4, G4, A4, C5

	let level = $state(1);

	let lhExpected = $derived(level === 1 ? L1_LH : L2_LH);
	let rhExpected = $derived(level === 1 ? L1_RH : L2_RH);

	// LH: collect by pitch class (enharmonic-safe)
	let lhCollected: Set<number> = $state(new Set());
	// RH: sequential progress index
	let rhProgress = $state(0);

	function resetState() {
		lhCollected = new Set();
		rhProgress = 0;
	}

	// Reset when level changes
	$effect(() => {
		level;
		resetState();
	});

	function generateExpectedNotes(_selectedNote: Note): MidiNote[] {
		return [...lhExpected, ...rhExpected];
	}

	function generateScoreProps(_selectedNote: Note): ScoreProps {
		return {
			selectedNote: 'C' as Note,
			leftHand: [lhExpected.map((n) => midiToNoteName(n) as NoteFullName)],
			rightHand: [rhExpected.map((n) => midiToNoteName(n) as NoteFullName)]
		};
	}

	function validateNoteEvent(
		_selectedNote: Note,
		event: NoteEvent,
		_expectedNotes: ReadonlyArray<MidiNote>,
		_currentNotes: ReadonlyArray<MidiNote>
	): ValidationResult {
		const state = { lhCollected, rhProgress };
		const result = validateHandNote(event, lhExpected, rhExpected, state);
		lhCollected = state.lhCollected;
		rhProgress = state.rhProgress;
		return result;
	}

	function isCompleted(
		_currentNotes: ReadonlyArray<MidiNote>,
		_expectedNotes: ReadonlyArray<MidiNote>
	): boolean {
		return isHandIndependenceCompleted(lhExpected, rhExpected, { lhCollected, rhProgress });
	}
</script>

<BaseExercise
	randomMode={false}
	{generateExpectedNotes}
	{generateScoreProps}
	{validateNoteEvent}
	{isCompleted}
	onReset={resetState}
	onComplete={() => {}}
	description="Train your hands to work independently. LH and RH play different patterns simultaneously."
	initialNote="C"
	exerciseType="hand_independence"
	showTempoControl={true}
	timingModeLabel="Play with rhythm"
>
	{#snippet children(_api: import('$lib/types/exercise-api').ExerciseAPI)}
		<div class="hand-independence-content">
			<!-- Level selector -->
			<div class="level-selector card-premium">
				<span class="section-label">Level</span>
				<div class="level-toggle" role="group" aria-label="Exercise level">
					<button
						class="level-btn"
						class:active={level === 1}
						onclick={() => (level = 1)}
					>
						<span class="level-num">1</span>
						<span class="level-name">Shell Voicings + Major Scale</span>
					</button>
					<button
						class="level-btn"
						class:active={level === 2}
						onclick={() => (level = 2)}
					>
						<span class="level-num">2</span>
						<span class="level-name">Walking Bass + Pentatonic</span>
					</button>
				</div>
			</div>

			<!-- Hand progress -->
			<div class="hand-progress">
				<!-- Left hand -->
				<div class="hand-card card-premium lh-card">
					<div class="hand-header">
						<span class="hand-label lh-label">Left Hand</span>
						<span class="hand-detail">
							{level === 1 ? 'Cm7 shell: root + minor 7th' : 'Cmaj7 walking bass: 1-3-5-7'}
						</span>
					</div>
					<div class="progress-dots">
						{#each lhExpected as note}
							{@const filled = Array.from(lhCollected).some((c) => c % 12 === note % 12)}
							<div class="dot-wrapper">
								<span class="dot" class:filled></span>
								<span class="dot-label">{midiToNoteName(note)}</span>
							</div>
						{/each}
					</div>
					<div class="completion-bar">
						<div
							class="completion-fill lh-fill"
							style="width: {(Array.from(new Set(Array.from(lhCollected).map((c) => c % 12))).filter((pc) => lhExpected.some((n) => n % 12 === pc)).length / lhExpected.length) * 100}%"
						></div>
					</div>
				</div>

				<!-- Right hand -->
				<div class="hand-card card-premium rh-card">
					<div class="hand-header">
						<span class="hand-label rh-label">Right Hand</span>
						<span class="hand-detail">
							{level === 1 ? 'C major scale ascending (C4 → C5)' : 'C major pentatonic (C4 → C5)'}
						</span>
					</div>
					<div class="progress-dots">
						{#each rhExpected as note, i}
							<div class="dot-wrapper">
								<span class="dot" class:filled={i < rhProgress}></span>
								<span class="dot-label">{midiToNoteName(note)}</span>
							</div>
						{/each}
					</div>
					<div class="completion-bar">
						<div
							class="completion-fill rh-fill"
							style="width: {(rhProgress / rhExpected.length) * 100}%"
						></div>
					</div>
				</div>
			</div>

			<!-- Instructions -->
			<div class="instructions card-premium">
				<h4 class="instructions-title">How to play</h4>
				{#if level === 1}
					<ul>
						<li>
							<strong>Left Hand:</strong> Play C2 and Bb3 (root and minor 7th of Cm7). You can play them
							in any order — just get both.
						</li>
						<li>
							<strong>Right Hand:</strong> Play the C major scale ascending: C D E F G A B C, one note
							at a time in order.
						</li>
						<li>Both hands must complete their pattern before the exercise finishes.</li>
					</ul>
				{:else}
					<ul>
						<li>
							<strong>Left Hand:</strong> Play C2 → E2 → G2 → B2 in sequence (Cmaj7 arpeggio as walking
							bass).
						</li>
						<li>
							<strong>Right Hand:</strong> Play the C major pentatonic: C4 → E4 → G4 → A4 → C5 in order.
						</li>
						<li>Challenge: try to overlap both hands as you would in real playing.</li>
					</ul>
				{/if}
			</div>
		</div>
	{/snippet}
</BaseExercise>

<style>
	.hand-independence-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 960px;
		margin: 0 auto;
	}

	/* ── Level selector ─────────────────────────────────────── */
	.level-selector {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		padding: 1.25rem 1.5rem;
		flex-wrap: wrap;
	}

	.section-label {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-muted);
		white-space: nowrap;
	}

	.level-toggle {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.level-btn {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.6rem 1.1rem;
		border-radius: 8px;
		border: 1px solid var(--color-border);
		background: var(--color-surface-raised);
		color: var(--color-text-muted);
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 600;
		transition: all 0.2s ease;
	}

	.level-btn:hover {
		border-color: var(--color-primary);
		color: var(--color-text);
	}

	.level-btn.active {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: #000;
	}

	.level-num {
		font-size: 1rem;
		font-weight: 800;
	}

	.level-name {
		font-size: 0.85rem;
	}

	/* ── Hand progress cards ────────────────────────────────── */
	.hand-progress {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.25rem;
	}

	.hand-card {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.5rem;
	}

	.lh-card {
		border-top: 3px solid var(--color-level-3, #3b82f6);
	}

	.rh-card {
		border-top: 3px solid var(--color-level-5, #f59e0b);
	}

	.hand-header {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.hand-label {
		font-size: 0.9rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.lh-label {
		color: var(--color-level-3, #3b82f6);
	}

	.rh-label {
		color: var(--color-level-5, #f59e0b);
	}

	.hand-detail {
		font-size: 0.8rem;
		color: var(--color-text-muted);
		line-height: 1.4;
	}

	/* ── Progress dots ──────────────────────────────────────── */
	.progress-dots {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.dot-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.3rem;
	}

	.dot {
		display: block;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--color-border, rgba(255, 255, 255, 0.15));
		border: 2px solid var(--color-border, rgba(255, 255, 255, 0.2));
		transition: background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
	}

	.dot.filled {
		background: var(--color-success, #22c55e);
		border-color: var(--color-success, #22c55e);
		box-shadow: 0 0 8px var(--color-success, #22c55e);
	}

	.dot-label {
		font-size: 0.65rem;
		color: var(--color-text-muted);
		font-family: monospace;
		white-space: nowrap;
	}

	/* ── Completion bar ─────────────────────────────────────── */
	.completion-bar {
		height: 4px;
		background: var(--color-surface-raised);
		border-radius: 2px;
		overflow: hidden;
	}

	.completion-fill {
		height: 100%;
		border-radius: 2px;
		transition: width 0.3s ease;
	}

	.lh-fill {
		background: var(--color-level-3, #3b82f6);
	}

	.rh-fill {
		background: var(--color-level-5, #f59e0b);
	}

	/* ── Instructions ───────────────────────────────────────── */
	.instructions {
		padding: 1.25rem 1.5rem;
	}

	.instructions-title {
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-muted);
		margin: 0 0 0.75rem 0;
	}

	.instructions ul {
		margin: 0;
		padding-left: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.instructions li {
		font-size: 0.9rem;
		color: var(--color-text-muted);
		line-height: 1.5;
	}

	.instructions li strong {
		color: var(--color-text);
	}

	/* ── Responsive ─────────────────────────────────────────── */
	@media (max-width: 640px) {
		.hand-progress {
			grid-template-columns: 1fr;
		}

		.level-toggle {
			flex-direction: column;
			width: 100%;
		}

		.level-btn {
			width: 100%;
			justify-content: flex-start;
		}
	}
</style>
