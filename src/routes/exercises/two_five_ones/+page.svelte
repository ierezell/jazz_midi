<svelte:options runes={true} />

<script lang="ts">
	import {
		chords,
		generateChordNotesDataFromChord,
		getVoicedChordNotes,
		constrainToOptimalRange
	} from '$lib/MusicTheoryUtils';
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

	const voicingHandGuide: Record<string, string> = {
		'full-right': '🤚 Right hand only (around C4)',
		'full-left': '👇 Left hand only (below C4)',
		'1735': '👈 LH: Root+7th  ·  🤚 RH: 3rd+5th',
		'1537': '👈 LH: Root+5th  ·  🤚 RH: 3rd+7th',
		'rootless-a': '🤚 RH: 3–5–7–9 (no root)',
		'rootless-b': '🤚 RH: 7–9–3–5 (no root)',
		shell: '👇 LH: Root + 7th',
		'guide-tones': '🤚 RH: 3rd + 7th'
	};

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
		const base = NoteToMidi[(selectedNote + DEFAULT_OCTAVE) as NoteFullName];
		const twoChordRoot = constrainToOptimalRange((base + 2) as MidiNote);
		const fiveChordRoot = constrainToOptimalRange((base + 7) as MidiNote);
		const oneChordRoot = constrainToOptimalRange(base as MidiNote);

		const twoChord = chords(twoChordRoot as MidiNote, 'min7', inversion);
		const fiveChord = chords(fiveChordRoot as MidiNote, '7', inversion);
		const oneChord = chords(oneChordRoot as MidiNote, 'maj7', inversion);

		const progressionChords = [twoChord, fiveChord, oneChord];
		return progressionChords[currentChordIndex];
	}

	// Use voiced notes so expected positions match what the score shows (correct octaves / hands)
	function generateExpectedNotes(selectedNote: Note): MidiNote[] {
		const curChord = getCurrentChord(selectedNote);
		return getVoicedChordNotes(curChord, voicing);
	}

	// Per-chord hand breakdown shown in the guide card
	let currentChordHandGuide = $derived.by(() => {
		const chord = getCurrentChord(effectiveRootKey);
		const voicedNotes = getVoicedChordNotes(chord, voicing);
		const lhNotes = voicedNotes.filter((n) => n < 60).map((n) => MidiToNote[n]);
		const rhNotes = voicedNotes.filter((n) => n >= 60).map((n) => MidiToNote[n]);
		return { lhNotes, rhNotes };
	});

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

		// Same pitch class but wrong octave → correct tone, wrong voicing position
		const pitchClass = event.noteNumber % 12;
		const matchedVoiced = expectedNotes.find((n) => n % 12 === pitchClass);
		if (matchedVoiced !== undefined) {
			const needsLower = matchedVoiced < event.noteNumber;
			const hint = needsLower
				? `⬇ Play ${MidiToNote[matchedVoiced]} (left hand)`
				: `⬆ Play ${MidiToNote[matchedVoiced]} (right hand)`;
			return {
				isCorrect: true,
				message: `Right note, wrong octave! ${hint}`,
				collected: false,
				resetCollected: false
			};
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
		const base = NoteToMidi[(selectedNote + DEFAULT_OCTAVE) as NoteFullName];
		const twoChordRoot = constrainToOptimalRange((base + 2) as MidiNote);
		const fiveChordRoot = constrainToOptimalRange((base + 7) as MidiNote);
		const oneChordRoot = constrainToOptimalRange(base as MidiNote);

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

				<!-- Voicing guide: always visible — shows which hand plays which notes -->
				<div class="voicing-guide card-premium">
					<div class="vg-info">
						<span class="vg-name">{voicingHandGuide[voicing] ?? voicing}</span>
						<span class="vg-ref">Reference: <strong>{effectiveRootKey}4</strong> = middle C</span>
					</div>
					<div class="vg-hands">
						{#if currentChordHandGuide.lhNotes.length > 0}
							<span class="vg-hand lh">👈 {currentChordHandGuide.lhNotes.join(' · ')}</span>
						{/if}
						{#if currentChordHandGuide.rhNotes.length > 0}
							<span class="vg-hand rh">🤚 {currentChordHandGuide.rhNotes.join(' · ')}</span>
						{/if}
					</div>
				</div>

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
			{#if api.completed}
				<div class="completion">🎉 ii-V-I Completed!</div>
			{/if}
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
		border: 2px solid var(--color-border);
		border-radius: 8px;
		background: var(--color-surface);
		color: var(--color-text);
		font-weight: 500;
		transition: all 0.3s;
		min-width: 80px;
		text-align: center;
	}

	.chord-indicator.active {
		border-color: var(--color-primary);
		background: color-mix(in srgb, var(--color-primary) 15%, transparent);
		color: var(--color-primary);
		transform: scale(1.05);
	}

	.chord-indicator.completed {
		border-color: var(--color-success);
		background: color-mix(in srgb, var(--color-success) 15%, transparent);
		color: var(--color-success);
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

	.completion {
		padding: 0.75rem 1.5rem;
		background: color-mix(in srgb, var(--color-success) 15%, transparent);
		border: 1px solid var(--color-success);
		border-radius: 8px;
		color: var(--color-success);
		font-weight: bold;
		text-align: center;
		animation: bounce 0.5s ease-in-out;
	}

	/* Voicing guide card */
	.voicing-guide {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.6rem 1rem;
		flex-wrap: wrap;
	}

	.vg-info {
		display: flex;
		gap: 0.75rem;
		align-items: baseline;
		flex-wrap: wrap;
	}

	.vg-name {
		font-weight: 600;
		color: var(--color-text);
		font-size: 0.9rem;
	}

	.vg-ref {
		font-size: 0.78rem;
		color: var(--color-text-muted);
	}

	.vg-hands {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.vg-hand {
		font-size: 0.85rem;
		padding: 0.2rem 0.6rem;
		border-radius: 6px;
		font-weight: 600;
		letter-spacing: 0.02em;
	}

	.vg-hand.lh {
		background: color-mix(in srgb, #60a5fa 20%, transparent);
		color: #60a5fa;
		border: 1px solid #60a5fa;
	}

	.vg-hand.rh {
		background: color-mix(in srgb, #34d399 20%, transparent);
		color: #34d399;
		border: 1px solid #34d399;
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
	}
</style>
