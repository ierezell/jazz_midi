<svelte:options runes={true} />

<script lang="ts">
	type PageData = { songs: import('$lib/types/musicxml').MusicXMLSong[] };
	import BaseExercise from '../../../components/BaseExercise.svelte';
	import MusicXMLScore from '../../../components/MusicXMLScore.svelte';
	import type { MusicXMLSong, SongNote } from '$lib/types/musicxml';
	import type { ValidationResult } from '$lib/types/exercise-api';
	import type { NoteEvent, ScoreProps } from '$lib/types/types';
	import type { MidiNote, Note } from '$lib/types/notes';
	import { generateAnnotations } from '$lib/ScoreAnnotationUtils';
	import { MidiToNote } from '$lib/types/notes.constants';

	const description = 'Practice the melody of jazz standards. Play each note in sequence to learn the tune.';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const songs = data.songs;

	let selectedSong: MusicXMLSong = $state(songs[0]);
	let currentNoteIndex = $state(0);
	let useRhythm = $state(false);
	let showAnnotations = $state(true);

	// Get current melody note
	function getCurrentNote(): SongNote | null {
		if (!selectedSong.melody?.length) return null;
		return selectedSong.melody[currentNoteIndex] ?? null;
	}

	// Generate expected notes (just the current melody note)
	function generateExpectedNotes(): MidiNote[] {
		const note = getCurrentNote();
		if (!note) return [];
		return [note.pitch as MidiNote];
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

		const expectedNote = expectedNotes[0];
		if (event.noteNumber === expectedNote) {
			return {
				isCorrect: true,
				message: 'Correct note!',
				collected: true,
				resetCollected: false
			};
		}

		// Check if it's a wrong octave of the right note
		if (event.noteNumber % 12 === expectedNote % 12) {
			return {
				isCorrect: false,
				message: 'Right note, wrong octave!',
				collected: false,
				resetCollected: false
			};
		}

		return {
			isCorrect: false,
			message: 'Wrong note. Listen and try again!',
			collected: false,
			resetCollected: false
		};
	}

	// Check if exercise is complete
	function isCompleted(currentNotes: ReadonlyArray<MidiNote>, expectedNotes: ReadonlyArray<MidiNote>): boolean {
		return currentNotes.length === expectedNotes.length && 
			currentNotes.every((note) => expectedNotes.includes(note));
	}

	// Handle exercise complete - move to next note
	function handleComplete(): void {
		if (currentNoteIndex < (selectedSong.melody?.length ?? 0) - 1) {
			currentNoteIndex++;
		}
	}

	// Reset exercise state
	function handleReset(): void {
		currentNoteIndex = 0;
	}

	// Change song
	function selectSong(song: MusicXMLSong): void {
		selectedSong = song;
		currentNoteIndex = 0;
	}

	// Get annotations for the score
	function getAnnotations() {
		if (!showAnnotations) return [];
		return generateAnnotations(selectedSong);
	}

	// Generate score props for display
	function generateScoreProps(selectedNote: Note): ScoreProps {
		void selectedNote;
		return {
			leftHand: [[]],
			rightHand: [[]],
			selectedNote: 'C'
		};
	}

	// Get note name display
	function getNoteName(pitch: number): string {
		return MidiToNote[pitch as MidiNote] ?? '?';
	}

	// Generate prompt
	let computedPrompt = $derived(() => {
		const note = getCurrentNote();
		if (!note) return 'Select a song with melody';
		return `Play: ${getNoteName(note.pitch)} (${currentNoteIndex + 1}/${selectedSong.melody?.length ?? 0})`;
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
	initialNote="C"
	{description}
	prompt={computedPrompt()}
	showTempoControl={true}
	timingModeLabel={useRhythm ? 'Play in time' : 'Any timing'}
>
	{#snippet children()}
		<div class="exercise-controls">
			<!-- Song Selection -->
			<div class="control-group">
				<label for="song-select">Song:</label>
				<select id="song-select" onchange={(e) => selectSong(songs[parseInt(e.currentTarget.value)])}>
					{#each songs as song, i}
						<option value={i} selected={song.id === selectedSong.id}>
							{song.title} ({song.key})
						</option>
					{/each}
				</select>
			</div>

			<!-- Rhythm Toggle -->
			<div class="control-group toggle">
				<label>
					<input type="checkbox" bind:checked={useRhythm} />
					Use Rhythm / Strict Timing
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

		<!-- Current Note Display -->
		{@const currentNote = getCurrentNote()}
		{#if currentNote}
			<div class="current-note-display">
				<div class="note-to-play">
					<span class="note-name">{getNoteName(currentNote.pitch)}</span>
				</div>
				<div class="progress-text">
					Note {currentNoteIndex + 1} of {selectedSong.melody?.length ?? 0}
				</div>
			</div>
		{:else}
			<div class="no-melody">No melody available for this song</div>
		{/if}

		<!-- MusicXML Score Display -->
		{#if selectedSong}
			<div class="score-section">
				<MusicXMLScore 
					url={selectedSong.url}
					annotations={getAnnotations()}
				/>
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

	.current-note-display {
		text-align: center;
		padding: 1.5rem;
		background: var(--color-surface, #1c2128);
		border-radius: 8px;
		margin-bottom: 1rem;
	}

	.note-to-play {
		margin-bottom: 0.5rem;
	}

	.note-name {
		font-size: 3rem;
		font-weight: bold;
		color: var(--color-primary, #58a6ff);
	}

	.progress-text {
		font-size: 0.875rem;
		color: var(--color-text-secondary, #8b949e);
	}

	.no-melody {
		text-align: center;
		padding: 1rem;
		color: var(--color-warn, #d29922);
		font-style: italic;
		margin-bottom: 1rem;
	}

	.score-section {
		margin-top: 1rem;
	}
</style>
