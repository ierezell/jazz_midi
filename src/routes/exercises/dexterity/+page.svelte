<script lang="ts">
	import { onMount } from 'svelte';
	import type { MidiNote, Note, NoteEvent, NoteFullName, ScoreProps } from '$lib/types/types';
	import type { ValidationResult } from '$lib/types/exercise-api';
	import { AllNotes, MidiToNote, NoteToMidi } from '$lib/types/notes.constants';
	import { page } from '$app/state';
	import BaseExercise from '../../../components/BaseExercise.svelte';

	type DexMode = 'random' | 'chromatic' | 'five-finger' | 'thirds';

	interface Props {
		randomMode: boolean;
		onComplete?: () => void;
		rootKey?: Note;
	}

	let { randomMode: _randomMode, onComplete, rootKey: propKey }: Props = $props();

	const naturalNotes = AllNotes.filter((n) => !n.includes('#') && !n.includes('b'));

	let hand = $state<'left' | 'right'>('right');
	let currentSequence: NoteFullName[] = $state([]);
	let playedCount = $state(0);

	const modeLabel: Record<DexMode, string> = {
		random: 'Random Walk',
		chromatic: 'Chromatic Scale',
		'five-finger': '5-Finger (Hanon)',
		thirds: 'Thirds'
	};

	const urlMode = page.url.searchParams.get('mode') as DexMode | null;
	let mode = $state<DexMode>(urlMode && urlMode in modeLabel ? urlMode : 'five-finger');

	const modeHint: Record<DexMode, string> = {
		random: 'Play each note shown in order. Stay relaxed!',
		chromatic: 'Play every semitone from C up to B and back down.',
		'five-finger': 'Classic Hanon warm-up: C-D-E-F-G-F-E-D-C. Lift each finger cleanly.',
		thirds: 'Skip-step pattern: C-E-D-F-E-G... great for interval control.'
	};

	function generateSequence(m: DexMode, h: 'left' | 'right'): NoteFullName[] {
		const octave = h === 'left' ? 3 : 4;

		if (m === 'five-finger') {
			// Hanon 1: C D E F G - F E D C, then shift up to D E F G A - G F E D, etc.
			const startNotes: Note[] = ['C', 'D', 'E', 'F', 'G', 'A'];
			const seq: NoteFullName[] = [];
			for (const root of startNotes) {
				const rootIdx = naturalNotes.indexOf(root);
				if (rootIdx < 0) continue;
				// Up: root, +1, +2, +3, +4
				for (let i = 0; i <= 4; i++) {
					const ni = (rootIdx + i) % naturalNotes.length;
					const oct = rootIdx + i >= naturalNotes.length ? octave + 1 : octave;
					seq.push(`${naturalNotes[ni]}${oct}` as NoteFullName);
				}
				// Down: +3, +2, +1, root
				for (let i = 3; i >= 0; i--) {
					const ni = (rootIdx + i) % naturalNotes.length;
					const oct = rootIdx + i >= naturalNotes.length ? octave + 1 : octave;
					seq.push(`${naturalNotes[ni]}${oct}` as NoteFullName);
				}
			}
			return seq;
		}

		if (m === 'chromatic') {
			// All 12 semitones C4–B4 ascending then descending
			const allChromaticUp: NoteFullName[] = [];
			const allChromaticDown: NoteFullName[] = [];
			const chromaticBase = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
			for (const n of chromaticBase) {
				allChromaticUp.push(`${n}${octave}` as NoteFullName);
			}
			for (const n of [...chromaticBase].reverse()) {
				allChromaticDown.push(`${n}${octave}` as NoteFullName);
			}
			return [...allChromaticUp, ...allChromaticDown];
		}

		if (m === 'thirds') {
			// C-E, D-F, E-G, F-A, G-B, A-C (skip-step ascending, then descend)
			const seq: NoteFullName[] = [];
			const len = naturalNotes.length;
			// Ascending: play each note, then the note a third up
			for (let i = 0; i < len; i++) {
				seq.push(`${naturalNotes[i]}${octave}` as NoteFullName);
				const thirdIdx = (i + 2) % len;
				const thirdOct = i + 2 >= len ? octave + 1 : octave;
				seq.push(`${naturalNotes[thirdIdx]}${thirdOct}` as NoteFullName);
			}
			// Descending
			for (let i = len - 1; i >= 0; i--) {
				const thirdIdx = (i + 2) % len;
				const thirdOct = i + 2 >= len ? octave + 1 : octave;
				seq.push(`${naturalNotes[thirdIdx]}${thirdOct}` as NoteFullName);
				seq.push(`${naturalNotes[i]}${octave}` as NoteFullName);
			}
			return seq;
		}

		// random: random walk through natural notes
		const seq: NoteFullName[] = [];
		let idx = 0;
		for (let i = 0; i < 16; i++) {
			const step = Math.floor(Math.random() * 3) - 1;
			idx = Math.max(0, Math.min(naturalNotes.length - 1, idx + step));
			seq.push(`${naturalNotes[idx]}${octave}` as NoteFullName);
		}
		return seq;
	}

	function resetSequence() {
		currentSequence = generateSequence(mode, hand);
		playedCount = 0;
	}

	$effect(() => {
		mode;
		hand;
		resetSequence();
	});

	onMount(resetSequence);

	function generateExpectedNotes(_selectedNote: Note): MidiNote[] {
		if (playedCount < currentSequence.length) {
			const note = currentSequence[playedCount];
			if (note && NoteToMidi[note]) return [NoteToMidi[note]];
		}
		return [];
	}

	function validateNoteEvent(
		_selectedNote: Note,
		event: NoteEvent,
		expectedNotes: ReadonlyArray<MidiNote>
	): ValidationResult {
		const expectedMidi = expectedNotes[0];

		if (event.noteNumber === expectedMidi) {
			playedCount++;
			const remaining = currentSequence.length - playedCount;
			if (remaining === 0) {
				return {
					isCorrect: true,
					message: `All ${currentSequence.length} notes — well done!`,
					collected: true,
					resetCollected: true
				};
			}
			return {
				isCorrect: true,
				message: `${playedCount}/${currentSequence.length}`,
				collected: true,
				resetCollected: false
			};
		}

		const playedName = MidiToNote[event.noteNumber];
		const expectedName = currentSequence[playedCount];
		return {
			isCorrect: false,
			message: `Expected ${expectedName}, got ${playedName}`,
			collected: false,
			resetCollected: false
		};
	}

	function generateScoreProps(_selectedNote: Note): ScoreProps {
		const maxDisplay = 8;
		const display = currentSequence.slice(playedCount, playedCount + maxDisplay).map((n) => [n]);
		return {
			selectedNote: 'C' as Note,
			leftHand: hand === 'left' ? display : [],
			rightHand: hand === 'right' ? display : []
		};
	}

	function isCompleted(): boolean {
		return playedCount === currentSequence.length;
	}
</script>

<BaseExercise
	randomMode={false}
	{generateExpectedNotes}
	{generateScoreProps}
	{validateNoteEvent}
	{isCompleted}
	onReset={resetSequence}
	onComplete={onComplete ?? (() => {})}
	initialNote={propKey || 'C'}
	description="Build finger speed and accuracy with structured technical exercises."
	exerciseType="dexterity"
	showTempoControl={true}
	timingModeLabel="Play with metronome"
	defaultBpm={80}
>
	{#snippet children(_api: import('$lib/types/exercise-api').ExerciseAPI)}
		<div class="dexterity-content">
			<!-- Mode selector -->
			<div class="mode-selector card-premium">
				<span class="section-label">Mode</span>
				<div class="mode-tabs" role="group" aria-label="Dexterity mode">
					{#each Object.keys(modeLabel) as DexMode[] as m}
						<button class="mode-tab" class:active={mode === m} onclick={() => (mode = m)}>
							{modeLabel[m]}
						</button>
					{/each}
				</div>
			</div>

			<!-- Hand selector + stats -->
			<div class="dex-controls card-premium">
				<div class="hand-toggle" role="group" aria-label="Hand selection">
					<button class="hand-btn" class:active={hand === 'left'} onclick={() => (hand = 'left')}
						>Left Hand</button
					>
					<button class="hand-btn" class:active={hand === 'right'} onclick={() => (hand = 'right')}
						>Right Hand</button
					>
				</div>
				<div class="progress-display">
					<span class="progress-num">{playedCount}</span>
					<span class="progress-sep">/</span>
					<span class="progress-total">{currentSequence.length}</span>
				</div>
			</div>

			<!-- Next notes preview (up to 8) -->
			<div class="next-notes card-premium">
				<span class="section-label">Upcoming</span>
				<div class="note-row">
					{#each currentSequence.slice(playedCount, playedCount + 8) as note, i}
						<span class="note-chip" class:next={i === 0}>
							{note.slice(0, -1)}<sup class="octave-num">{note.slice(-1)}</sup>
						</span>
					{/each}
					{#if playedCount === currentSequence.length}
						<span class="done-chip">Complete!</span>
					{/if}
				</div>
			</div>

			<p class="hint">{modeHint[mode]}</p>
		</div>
	{/snippet}
</BaseExercise>

<style>
	.dexterity-content {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		max-width: 860px;
		margin: 0 auto;
	}

	/* ── Mode selector ───────────────────────── */
	.mode-selector {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		padding: 1rem 1.5rem;
		flex-wrap: wrap;
	}

	.section-label {
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-muted);
		white-space: nowrap;
	}

	.mode-tabs {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.mode-tab {
		padding: 0.35rem 0.85rem;
		border-radius: 6px;
		border: 1px solid var(--color-border);
		background: var(--color-surface-raised);
		color: var(--color-text-muted);
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.mode-tab:hover {
		border-color: var(--color-primary);
		color: var(--color-text);
	}

	.mode-tab.active {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: #000;
	}

	/* ── Dex controls row ───────────────────── */
	.dex-controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.875rem 1.5rem;
		gap: 1rem;
	}

	.hand-toggle {
		display: flex;
		gap: 0.5rem;
	}

	.hand-btn {
		padding: 0.35rem 0.9rem;
		border-radius: 6px;
		border: 1px solid var(--color-border);
		background: transparent;
		color: var(--color-text-muted);
		font-size: 0.82rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.hand-btn:hover {
		border-color: var(--color-primary);
		color: var(--color-text);
	}

	.hand-btn.active {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: #000;
	}

	.progress-display {
		display: flex;
		align-items: baseline;
		gap: 0.2rem;
		font-family: monospace;
	}

	.progress-num {
		font-size: 1.8rem;
		font-weight: 800;
		color: var(--color-primary);
		line-height: 1;
	}

	.progress-sep {
		font-size: 1.2rem;
		color: var(--color-text-muted);
	}

	.progress-total {
		font-size: 1.1rem;
		color: var(--color-text-muted);
	}

	/* ── Next notes preview ─────────────────── */
	.next-notes {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1.5rem;
		flex-wrap: wrap;
	}

	.note-row {
		display: flex;
		gap: 0.4rem;
		flex-wrap: wrap;
	}

	.note-chip {
		padding: 0.2rem 0.55rem;
		border-radius: 6px;
		background: var(--color-surface-raised);
		border: 1px solid var(--color-border);
		font-family: monospace;
		font-size: 0.8rem;
		color: var(--color-text-muted);
		transition: all 0.15s ease;
	}

	.note-chip.next {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: #000;
		font-weight: 700;
		font-size: 0.9rem;
		transform: scale(1.1);
	}

	.octave-num {
		font-size: 0.6em;
		opacity: 0.65;
		vertical-align: super;
		line-height: 0;
	}

	.done-chip {
		padding: 0.2rem 0.75rem;
		border-radius: 6px;
		background: color-mix(in srgb, var(--color-success) 15%, transparent);
		border: 1px solid var(--color-success);
		color: var(--color-success);
		font-size: 0.85rem;
		font-weight: 600;
	}

	.hint {
		font-size: 0.85rem;
		color: var(--color-text-muted);
		font-style: italic;
		text-align: center;
		margin: 0;
	}

	@media (orientation: landscape) and (max-height: 500px) {
		.dexterity-content {
			gap: 0.75rem;
		}
		.mode-tab {
			padding: 0.25rem 0.6rem;
			font-size: 0.72rem;
		}
		.progress-num {
			font-size: 1.2rem;
		}
		.next-notes {
			padding: 0.5rem 0.75rem;
			gap: 0.5rem;
		}
		.hint {
			font-size: 0.75rem;
		}
	}
</style>
