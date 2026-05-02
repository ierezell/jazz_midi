<svelte:options runes={true} />

<script lang="ts">
	import type { MidiNote, Note, NoteEvent, NoteFullName, ScoreProps } from '$lib/types/types';
	import type { ValidationResult } from '$lib/types/exercise-api';
	import BaseExercise from '../../../components/exercise/BaseExercise.svelte';
	import {
		validateHandNote,
		isHandIndependenceCompleted,
		midiToNoteName
	} from './hand-independence';

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
		<div class="hi-content">
			<!-- Level selector -->
			<div class="level-selector card-premium">
				<span class="section-label">Level</span>
				<div class="level-toggle" role="group" aria-label="Exercise level">
					<button class="level-btn" class:active={level === 1} onclick={() => (level = 1)}>
						<span class="level-num">1</span>
						<span class="level-name">Shell Voicings + Major Scale</span>
					</button>
					<button class="level-btn" class:active={level === 2} onclick={() => (level = 2)}>
						<span class="level-num">2</span>
						<span class="level-name">Walking Bass + Pentatonic</span>
					</button>
				</div>
			</div>

			<!-- Pattern guide -->
			<div class="pattern-guide card-premium">
				<h3 class="pattern-title">
					{level === 1 ? 'Cm7 Shell + C Major Scale' : 'Cmaj7 Walking Bass + Pentatonic'}
				</h3>

				<div class="pattern-breakdown">
					<!-- Left hand beat boxes -->
					<div class="hand-section">
						<h4 class="hand-label lh-label">Left Hand</h4>
						<p class="hand-detail">
							{level === 1
								? 'Cm7 shell — root + minor 7th (any order)'
								: 'Cmaj7 arpeggio — 1-3-5-7 in sequence'}
						</p>
						<div class="pattern-beats">
							{#each lhExpected as note, i}
								{@const isFilled = Array.from(lhCollected).some((c) => c % 12 === note % 12)}
								{@const isCurrent =
									!isFilled &&
									Array.from(lhCollected).filter((c) => lhExpected.some((n) => n % 12 === c % 12))
										.length === i}
								<div class="beat-box lh-beat" class:current={isCurrent} class:filled={isFilled}>
									<div class="beat-label">{i + 1}</div>
									<div class="note-label">{midiToNoteName(note).slice(0, -1)}</div>
								</div>
							{/each}
						</div>
						<div class="completion-bar">
							<div
								class="completion-fill lh-fill"
								style="width: {(Array.from(
									new Set(Array.from(lhCollected).map((c) => c % 12))
								).filter((pc) => lhExpected.some((n) => n % 12 === pc)).length /
									lhExpected.length) *
									100}%"
							></div>
						</div>
					</div>

					<!-- Right hand beat boxes -->
					<div class="hand-section">
						<h4 class="hand-label rh-label">Right Hand</h4>
						<p class="hand-detail">
							{level === 1
								? 'C major scale ascending — C4 to C5 in order'
								: 'C major pentatonic ascending — C4 to C5 in order'}
						</p>
						<div class="pattern-beats">
							{#each rhExpected as note, i}
								<div
									class="beat-box rh-beat"
									class:current={rhProgress === i}
									class:filled={i < rhProgress}
								>
									<div class="beat-label">{i + 1}</div>
									<div class="note-label">{midiToNoteName(note).slice(0, -1)}</div>
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

				<!-- Tips -->
				<div class="tips">
					{#if level === 1}
						<p>
							Both hands must complete their pattern before the exercise finishes. Left hand notes
							can be played in any order.
						</p>
					{:else}
						<p>
							Both sequences must be played in order. Try to overlap both hands as you would in real
							playing.
						</p>
					{/if}
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
	.hi-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 960px;
		margin: 0 auto;
		padding: 1rem;
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

	/* ── Pattern guide ──────────────────────────────────────── */
	.pattern-guide {
		border-radius: 12px;
		padding: 1.5rem;
	}

	.pattern-title {
		text-align: center;
		color: var(--color-primary, #9b59b6);
		margin: 0 0 1.5rem 0;
		font-size: 1.4rem;
		font-weight: 700;
	}

	.pattern-breakdown {
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
	}

	.hand-section {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.hand-label {
		font-size: 0.9rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		margin: 0;
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
		margin: 0;
		line-height: 1.4;
	}

	/* ── Beat boxes ─────────────────────────────────────────── */
	.pattern-beats {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.beat-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		padding: 0.75rem;
		border: 2px solid var(--color-border, rgba(255, 255, 255, 0.15));
		border-radius: 8px;
		background: var(--color-surface-raised, rgba(255, 255, 255, 0.05));
		min-width: 56px;
		transition: all 0.3s ease;
	}

	.beat-box.filled {
		opacity: 0.45;
	}

	/* Left hand current beat — blue glow */
	.lh-beat.current {
		border-color: var(--color-level-3, #3b82f6);
		background: rgba(59, 130, 246, 0.18);
		transform: scale(1.1);
		box-shadow: 0 0 15px rgba(59, 130, 246, 0.45);
	}

	/* Right hand current beat — amber glow */
	.rh-beat.current {
		border-color: var(--color-level-5, #f59e0b);
		background: rgba(245, 158, 11, 0.18);
		transform: scale(1.1);
		box-shadow: 0 0 15px rgba(245, 158, 11, 0.45);
	}

	.beat-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-text-muted);
	}

	.lh-beat .note-label {
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--color-level-3, #3b82f6);
	}

	.rh-beat .note-label {
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--color-level-5, #f59e0b);
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

	/* ── Tips ───────────────────────────────────────────────── */
	.tips {
		margin-top: 1.5rem;
		padding: 1rem;
		background: rgba(155, 89, 182, 0.08);
		border-radius: 8px;
		border-left: 4px solid var(--color-primary, #9b59b6);
	}

	.tips p {
		margin: 0;
		color: var(--color-text-muted);
		font-size: 0.9rem;
		line-height: 1.6;
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
		.hi-content {
			padding: 0.5rem;
		}

		.pattern-guide {
			padding: 1rem;
		}

		.pattern-beats {
			gap: 0.25rem;
		}

		.beat-box {
			min-width: 44px;
			padding: 0.5rem;
		}

		.beat-box .note-label {
			font-size: 0.9rem;
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
