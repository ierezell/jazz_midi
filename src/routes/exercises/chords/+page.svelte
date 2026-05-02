<svelte:options runes={true} />

<script lang="ts">
	import {
		chords,
		generateChordNotesData,
		getVoicedChordNotes,
		calculateOptimalInversion
	} from '$lib/MusicTheoryUtils';
	import type { ChordVoicing, Inversion } from '$lib/types/notes';
	import {
		AllChordTypes,
		AllChordVoicings,
		NoteToMidi,
		DEFAULT_OCTAVE,
		AllNotes
	} from '$lib/types/notes.constants';
	import type {
		ChordType,
		MidiNote,
		Note,
		NoteEvent,
		NoteFullName,
		ScoreProps
	} from '$lib/types/types';
	import type { ValidationResult } from '$lib/types/exercise-api';
	import { untrack } from 'svelte';
	import BaseExercise from '../../../components/exercise/BaseExercise.svelte';
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { RhythmMode } from '$lib/exercises/utils/RhythmMode.svelte.js';
	import { rhythmPatterns } from '$lib/data/rhythmPatternsData';
	import BeatIndicator from '../../../components/exercise/BeatIndicator.svelte';

	const description =
		'Play the notes of the displayed chord on your MIDI keyboard. Try to match the voicing and inversion shown.';

	interface Props {
		randomMode?: boolean;
		onComplete: () => void;
		chordType: ChordType;
		inversion: Inversion;
		rootKey: Note;
		voicing: ChordVoicing;
		progressiveHints?: boolean;
		prompt?: string;
	}

	let {
		randomMode = false,
		onComplete,
		chordType: propChordType,
		inversion: propInversion,
		rootKey: propKey,
		voicing: propVoicing,
		progressiveHints,
		prompt
	}: Props = $props();

	let possibleChordTypes = ['maj7', 'min7', '7', 'dom7', 'half-dim7', 'dim7'] as ChordType[];

	/** Voicing options shown on the chords gym page (subset may appear in URL). */
	const URL_VOICINGS: ChordVoicing[] = [
		'full-right',
		'full-left',
		'1735',
		'1537',
		'rootless-a',
		'rootless-b',
		'shell',
		'guide-tones'
	];

	// Local state — gym deep-links sync from the URL in `afterNavigate` / `onMount` (see below).
	// @svelte-ignore state_referenced_locally
	let currentRoot: Note = $state(
		untrack(
			() => propKey ?? (randomMode ? AllNotes[Math.floor(Math.random() * AllNotes.length)] : 'C')
		)
	);
	// @svelte-ignore state_referenced_locally
	let currentChordType: ChordType = $state(
		untrack(
			() =>
				propChordType ??
				(randomMode
					? possibleChordTypes[Math.floor(Math.random() * possibleChordTypes.length)]
					: 'maj7')
		)
	);
	// @svelte-ignore state_referenced_locally
	let currentInversion: Inversion = $state(
		untrack(() => propInversion ?? (randomMode ? (Math.floor(Math.random() * 4) as Inversion) : 0))
	);
	// @svelte-ignore state_referenced_locally
	let currentVoicing: ChordVoicing = $state(
		untrack(
			() =>
				propVoicing ??
				(randomMode
					? AllChordVoicings[Math.floor(Math.random() * AllChordVoicings.length)]
					: 'full-right')
		)
	);

	function applyChordQuery(sp: URLSearchParams): void {
		const rootParam = sp.get('root');
		if (rootParam && (AllNotes as readonly string[]).includes(rootParam)) {
			currentRoot = rootParam as Note;
		}

		const qualityParam = sp.get('quality');
		if (qualityParam && (AllChordTypes as readonly string[]).includes(qualityParam)) {
			currentChordType = qualityParam as ChordType;
		}

		const invParam = sp.get('inversion');
		if (invParam !== null && invParam !== '') {
			const n = Number.parseInt(invParam, 10);
			if (Number.isFinite(n) && n >= 0 && n <= 3) {
				currentInversion = n as Inversion;
			}
		}

		const voicingParam = sp.get('voicing');
		if (voicingParam && (URL_VOICINGS as readonly string[]).includes(voicingParam)) {
			currentVoicing = voicingParam as ChordVoicing;
		}
	}

	function isChordsGymPathname(pathname: string): boolean {
		const normalized = pathname.replace(/\/$/, '') || '/';
		return normalized.endsWith('/exercises/chords');
	}

	// Apply gym deep-link params from the real browser URL (query is authoritative for E2E).
	// Key off `page.url.href` so this re-runs on navigations; read `window.location.search` because
	// `page.url` can briefly lag the actual address bar during client hydration.
	$effect(() => {
		void page.url.href;
		if (!browser) return;
		if (!isChordsGymPathname(window.location.pathname)) return;
		applyChordQuery(new URLSearchParams(window.location.search));
	});
	let useOptimizedVoicing = $state(false);
	let previousChordNotes: MidiNote[] = $state([]);

	// Rhythm mode
	const rhythm = new RhythmMode(rhythmPatterns);

	function generateNewChallenge() {
		const randomRoot = AllNotes[Math.floor(Math.random() * AllNotes.length)];
		const randomType = possibleChordTypes[Math.floor(Math.random() * possibleChordTypes.length)];

		// Calculate optimal inversion if enabled
		let randomInv: Inversion;
		if (useOptimizedVoicing && previousChordNotes.length > 0) {
			const rootNote = (randomRoot + '3') as NoteFullName;
			const rootMidi = NoteToMidi[rootNote];
			randomInv = calculateOptimalInversion(rootMidi, randomType, previousChordNotes);
		} else {
			randomInv = Math.floor(Math.random() * 4) as Inversion;
		}

		currentRoot = randomRoot;
		currentChordType = randomType;
		currentInversion = randomInv;
	}

	function handleComplete() {
		// Store current chord notes for voice leading optimization
		const notes = generateExpectedNotes(currentRoot);
		previousChordNotes = notes;

		// Gym / URL-driven mode: keep the same chord. Randomizing here changes `initialNote`,
		// which triggers BaseExercise's `initialNote` effect → `resetExercise()` and wipes
		// completion feedback (and breaks E2E that deep-links a chord).
		if (randomMode) {
			generateNewChallenge();
		}
		onComplete?.();
	}

	function generateExpectedNotes(selectedNote: Note): MidiNote[] {
		void selectedNote;
		// Calculate optimal octave to keep chords centered
		// If root is high (G, A, B), drop to octave 3. Otherwise use octave 4.
		// This keeps roots roughly between G3 and F4.
		const notes = [
			'C',
			'C#',
			'Db',
			'D',
			'D#',
			'Eb',
			'E',
			'F',
			'F#',
			'Gb',
			'G',
			'G#',
			'Ab',
			'A',
			'A#',
			'Bb',
			'B'
		];
		const noteIndex = notes.indexOf(selectedNote);
		// G is index 10. G, G#, A... B are high.
		const octave = noteIndex >= 10 ? '3' : DEFAULT_OCTAVE;

		const rootNote = (selectedNote + octave) as NoteFullName;
		const rootMidi = NoteToMidi[rootNote];
		const currentChord = chords(rootMidi, currentChordType, currentInversion);

		return getVoicedChordNotes(currentChord, currentVoicing);
	}

	function validateNoteEvent(
		selectedNote: Note,
		event: NoteEvent,
		expectedNotes: ReadonlyArray<MidiNote>,
		currentNotes: ReadonlyArray<MidiNote>
	): ValidationResult {
		void selectedNote;
		void currentNotes;

		const beatResult = currentNotes.length === 0 ? rhythm.validateHit(event) : null;
		if (beatResult && !beatResult.isHit) {
			return {
				isCorrect: false,
				message: `Off beat! (${beatResult.label})`,
				collected: false,
				resetCollected: false
			};
		}

		const expectedClasses = expectedNotes.map((n) => n % 12);
		const playedClass = event.noteNumber % 12;

		if (expectedClasses.includes(playedClass)) {
			// For strict inversion validation, check if the exact MIDI note is expected
			// For rootless voicings, we can be more lenient with octaves
			const isExactMatch = expectedNotes.includes(event.noteNumber);
			const isRootless = currentVoicing.startsWith('rootless');

			if (isExactMatch || isRootless) {
				return {
					isCorrect: true,
					message: isExactMatch ? 'Correct chord tone!' : 'Correct chord tone (octave ignored)!',
					collected: true,
					resetCollected: false
				};
			} else {
				// Right pitch class, wrong octave/inversion
				return {
					isCorrect: false,
					message: 'Correct note, but check the inversion/octave!',
					collected: false,
					resetCollected: true
				};
			}
		}

		return {
			isCorrect: false,
			message: 'Not a chord tone. Try again!',
			collected: false,
			resetCollected: true
		};
	}

	function generateScoreProps(selectedNote: Note): ScoreProps {
		void selectedNote;
		try {
			const scoreData = generateChordNotesData(
				selectedNote,
				currentChordType,
				currentInversion,
				currentVoicing
			);
			return {
				leftHand: scoreData.leftHand,
				rightHand: scoreData.rightHand,
				selectedNote: currentRoot
			};
		} catch (error) {
			void error;
			// Return a default C major chord if there's an error
			return {
				selectedNote: 'C',
				leftHand: [[]] as NoteFullName[][],
				rightHand: [['C4', 'E4', 'G4']] as NoteFullName[][]
			} as ScoreProps;
		}
	}

	function isCompleted(
		currentNotes: ReadonlyArray<MidiNote>,
		expectedNotes: ReadonlyArray<MidiNote>
	): boolean {
		// If rootless, check if we have 4 unique note classes that match expected
		if (currentVoicing.startsWith('rootless')) {
			const currentClasses = new Set(currentNotes.map((n) => n % 12));
			const expectedClasses = new Set(expectedNotes.map((n) => n % 12));
			return (
				currentClasses.size === expectedClasses.size &&
				[...currentClasses].every((c) => expectedClasses.has(c))
			);
		}

		return (
			currentNotes.length === expectedNotes.length &&
			currentNotes.every((note) => expectedNotes.includes(note))
		);
	}

	function handleParentReset(): void {}

	// Generate prompt from current state
	let computedPrompt = $derived(
		`${currentRoot} ${currentChordType} - ${getInversionName(currentInversion)}`
	);
	let effectivePrompt = $derived(prompt ?? computedPrompt);

	function getInversionName(inv: Inversion): string {
		switch (inv) {
			case 0:
				return 'Root Position';
			case 1:
				return '1st Inversion';
			case 2:
				return '2nd Inversion';
			case 3:
				return '3rd Inversion';
			default:
				return 'Root Position';
		}
	}
</script>

<BaseExercise
	{randomMode}
	{generateExpectedNotes}
	{generateScoreProps}
	{validateNoteEvent}
	{isCompleted}
	onReset={handleParentReset}
	onComplete={handleComplete}
	initialNote={currentRoot}
	{description}
	{progressiveHints}
	prompt={effectivePrompt}
	showTempoControl={true}
	timingModeLabel="Play chord on beat"
>
	{#snippet children()}
		{#if !randomMode && !page.url.searchParams.get('unitId')}
			<div class="controls">
				<div class="control-group">
					<label for="chord-type">Chord Type</label>
					<select id="chord-type" bind:value={currentChordType}>
						{#each AllChordTypes as type}
							<option value={type}>{type}</option>
						{/each}
					</select>
				</div>

				<div class="control-group">
					<label for="inversion">Inversion</label>
					<select id="inversion" bind:value={currentInversion}>
						<option value={0}>Root</option>
						<option value={1}>1st</option>
						<option value={2}>2nd</option>
						<option value={3}>3rd</option>
					</select>
				</div>

				<div class="control-group">
					<label>
						<input type="checkbox" bind:checked={useOptimizedVoicing} />
						Optimized Voice Leading
					</label>
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

				<div class="control-group">
					<label for="voicing">Voicing</label>
					<select id="voicing" bind:value={currentVoicing}>
						<option value="full-right">Full Right Hand</option>
						<option value="full-left">Full Left Hand</option>
						<option value="1735">1 & 7 Left / 3 & 5 Right</option>
						<option value="1537">1 & 5 Left / 3 & 7 Right</option>
						<option value="rootless-a">Rootless A (3-5-7-9)</option>
						<option value="rootless-b">Rootless B (7-9-3-5)</option>
						<option value="shell">Shell Voicing (LH: Root + 7th)</option>
						<option value="guide-tones">Guide Tones (3rd + 7th)</option>
					</select>
				</div>
			</div>
		{/if}
	{/snippet}
</BaseExercise>

<style>
	.controls {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
		margin: 2rem 0;
		padding: 1rem;
		background-color: var(--color-surface);
		border-radius: 0.5rem;
		border: 1px solid var(--color-border);
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: center;
	}

	.control-group label {
		font-weight: 500;
		color: var(--color-text-muted);
	}

	.rhythm-controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background: var(--color-surface-raised, rgba(255, 255, 255, 0.04));
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		min-width: 160px;
	}

	.rhythm-toggle {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-weight: 500;
		color: var(--color-text-muted);
		cursor: pointer;
	}

	.pattern-select {
		width: 100%;
		padding: 0.25rem 0.5rem;
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		background: var(--color-surface);
		color: var(--color-text);
		font-size: 0.85rem;
	}

	@media (max-width: 768px) {
		.controls {
			flex-direction: column;
			align-items: center;
		}

		.control-group {
			width: 100%;
			max-width: 200px;
		}
	}

	@media (orientation: landscape) and (max-height: 500px) {
		.controls {
			flex-direction: row;
			gap: 0.5rem;
			padding: 0.5rem;
			margin: 0.5rem 0;
		}
	}
</style>
