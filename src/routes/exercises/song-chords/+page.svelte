<svelte:options runes={true} />

<script lang="ts">
	type PageData = { songs: import('$lib/types/musicxml').MusicXMLSong[] };
	import BaseExercise from '../../../components/exercise/BaseExercise.svelte';
	import { untrack } from 'svelte';
	import Score from '../../../components/exercise/Score.svelte';
	import type { MusicXMLSong, SongChord } from '$lib/types/musicxml';
	import type { ValidationResult } from '$lib/types/exercise-api';
	import type { NoteEvent, ScoreProps } from '$lib/types/types';
	import type { MidiNote, Note, ChordVoicing, Inversion } from '$lib/types/notes';
	import { generateAnnotations, getVoicingSuggestion } from '$lib/ScoreAnnotationUtils';
	import { NoteToMidi } from '$lib/types/notes.constants';
	import { chords, getVoicedChordNotes } from '$lib/MusicTheoryUtils';

	const description =
		'Practice all chords from real jazz standards. Play each chord with proper voice leading through the progression.';

	interface Props {
		data: PageData;
	}

	// @svelte-ignore state_referenced_locally
	let { data }: Props = $props();
	const songs = untrack(() => data.songs);

	let selectedSong: MusicXMLSong = $state(songs[0]);
	let currentChordIndex = $state(0);
	let voicing: ChordVoicing = $state('full-right');
	let inversion: Inversion = $state(0);
	let useRhythm = $state(false);
	let showAnnotations = $state(true);

	// Get current chord
	function getCurrentChord(): SongChord | null {
		if (!selectedSong.chords?.length) return null;
		return selectedSong.chords[currentChordIndex] ?? null;
	}

	// Generate expected notes for the current chord
	function generateExpectedNotes(): MidiNote[] {
		const chord = getCurrentChord();
		if (!chord) return [];

		// Find root octave note
		const rootNoteName = chord.root as Note;
		const rootFullName = `${rootNoteName}3` as const;
		const rootMidi = NoteToMidi[rootFullName];

		if (!rootMidi) return [];

		// Generate chord notes
		const chordData = chords(rootMidi, chord.quality as any, inversion);
		return getVoicedChordNotes(chordData, voicing);
	}

	// Validate note events
	function validateNoteEvent(
		selectedNote: Note,
		event: NoteEvent,
		expectedNotes: ReadonlyArray<MidiNote>,
		currentNotes: ReadonlyArray<MidiNote>
	): ValidationResult {
		void selectedNote;
		void currentNotes;

		const expectedClasses = expectedNotes.map((n) => n % 12);
		const playedClass = event.noteNumber % 12;

		if (expectedClasses.includes(playedClass)) {
			const isExactMatch = expectedNotes.includes(event.noteNumber);
			const isRootless = voicing.startsWith('rootless');

			if (isExactMatch || isRootless) {
				return {
					isCorrect: true,
					message: isExactMatch ? 'Correct chord tone!' : 'Correct chord tone (octave ignored)!',
					collected: true,
					resetCollected: false
				};
			} else {
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

	// Check if exercise is complete
	function isCompleted(
		currentNotes: ReadonlyArray<MidiNote>,
		expectedNotes: ReadonlyArray<MidiNote>
	): boolean {
		if (voicing.startsWith('rootless')) {
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

	// Handle exercise complete
	function handleComplete(): void {
		// Move to next chord
		if (currentChordIndex < (selectedSong.chords?.length ?? 0) - 1) {
			currentChordIndex++;
		}
	}

	// Reset exercise state
	function handleReset(): void {
		currentChordIndex = 0;
	}

	// Change song
	function selectSong(song: MusicXMLSong): void {
		selectedSong = song;
		currentChordIndex = 0;
	}

	// Get annotations for the score
	function getAnnotations() {
		if (!showAnnotations) return [];
		return generateAnnotations(selectedSong);
	}

	// Generate score props for display
	function generateScoreProps(selectedNote: Note): ScoreProps {
		void selectedNote;
		const chord = getCurrentChord();
		if (!chord) {
			return { leftHand: [[]], rightHand: [[]], selectedNote: 'C' };
		}

		// Return simple display - OSMD handles the actual score rendering
		return {
			leftHand: [[]],
			rightHand: [[]],
			selectedNote: chord.root as Note
		};
	}

	// Get voicing display name
	function getVoicingName(v: ChordVoicing): string {
		const names: Record<ChordVoicing, string> = {
			'full-right': 'Full Chord (RH)',
			'full-left': 'Full Chord (LH)',
			'1735': '1 & 7 Left / 3 & 5 Right',
			'1537': '1 & 5 Left / 3 & 7 Right',
			'rootless-a': 'Rootless A (3-5-7-9)',
			'rootless-b': 'Rootless B (7-9-3-5)',
			shell: 'Shell Voicing',
			'guide-tones': 'Guide Tones (3rd + 7th)'
		};
		return names[v];
	}

	// Get inversion display name
	function getInversionName(inv: Inversion): string {
		const names = ['Root Position', '1st Inversion', '2nd Inversion', '3rd Inversion'];
		return names[inv] ?? 'Root Position';
	}

	// Generate prompt
	let computedPrompt = $derived(() => {
		const chord = getCurrentChord();
		if (!chord) return 'Select a song';
		return `${chord.root}${chord.quality} - ${getInversionName(inversion)} (${currentChordIndex + 1}/${selectedSong.chords?.length ?? 0})`;
	});
</script>

<BaseExercise
	randomMode={false}
	{generateExpectedNotes}
	{generateScoreProps}
	{validateNoteEvent}
	{isCompleted}
	onReset={handleReset}
	onComplete={handleComplete}
	initialNote={(getCurrentChord()?.root as Note) ?? 'C'}
	{description}
	prompt={computedPrompt()}
	showTempoControl={true}
	timingModeLabel="Play chord on beat"
>
	{#snippet children()}
		<div class="exercise-controls">
			<!-- Song Selection -->
			<div class="control-group">
				<label for="song-select">Song:</label>
				<select
					id="song-select"
					onchange={(e) => selectSong(songs[parseInt(e.currentTarget.value)])}
				>
					{#each songs as song, i}
						<option value={i} selected={song.id === selectedSong.id}>
							{song.title} ({song.key})
						</option>
					{/each}
				</select>
			</div>

			<!-- Voicing Selection -->
			<div class="control-group">
				<label for="voicing-select">Voicing:</label>
				<select id="voicing-select" bind:value={voicing}>
					<option value="full-right">{getVoicingName('full-right')}</option>
					<option value="full-left">{getVoicingName('full-left')}</option>
					<option value="1735">{getVoicingName('1735')}</option>
					<option value="1537">{getVoicingName('1537')}</option>
					<option value="rootless-a">{getVoicingName('rootless-a')}</option>
					<option value="rootless-b">{getVoicingName('rootless-b')}</option>
					<option value="shell">{getVoicingName('shell')}</option>
					<option value="guide-tones">{getVoicingName('guide-tones')}</option>
				</select>
			</div>

			<!-- Inversion Selection -->
			<div class="control-group">
				<label for="inversion-select">Inversion:</label>
				<select id="inversion-select" bind:value={inversion}>
					<option value={0}>{getInversionName(0)}</option>
					<option value={1}>{getInversionName(1)}</option>
					<option value={2}>{getInversionName(2)}</option>
					<option value={3}>{getInversionName(3)}</option>
				</select>
			</div>

			<!-- Rhythm Toggle -->
			<div class="control-group toggle">
				<label>
					<input type="checkbox" bind:checked={useRhythm} />
					Use Rhythm
				</label>
			</div>

			<!-- Annotations Toggle -->
			<div class="control-group toggle">
				<label>
					<input type="checkbox" bind:checked={showAnnotations} />
					Show II-V-I
				</label>
			</div>
		</div>

		<!-- MusicXML Score Display -->
		{#if selectedSong}
			<div class="score-section">
				<Score url={selectedSong.url} annotations={getAnnotations()} />
			</div>
		{/if}
	{/snippet}
</BaseExercise>

<style>
	.exercise-controls {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		padding: 1rem;
		background: var(--color-surface, #1c2128);
		border-radius: 8px;
		margin-bottom: 1rem;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.control-group label {
		font-size: 0.875rem;
		color: var(--color-text-secondary, #8b949e);
	}

	.control-group select {
		padding: 0.5rem;
		border-radius: 4px;
		border: 1px solid var(--color-border, #30363d);
		background: var(--color-bg, #0d1117);
		color: var(--color-text, #c9d1d9);
		font-size: 0.875rem;
		min-width: 150px;
	}

	.control-group.toggle {
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
	}

	.control-group.toggle label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	.score-section {
		margin-top: 1rem;
	}
</style>
