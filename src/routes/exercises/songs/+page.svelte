<svelte:options runes={true} />

<script lang="ts">
	import type { ChordType, Note, ChordVoicing, Inversion } from '$lib/types/notes';
	import type { MidiNote, NoteEvent, ScoreProps, NoteFullName } from '$lib/types/types';
	import BaseExercise from '../../../components/BaseExercise.svelte';
	import { generateChordNotesData, chords } from '$lib/MusicTheoryUtils';
	import { NoteToMidi, AllNotes } from '$lib/types/notes.constants';

	const description =
		'Practice chord progressions from real songs. Play each chord in the progression.';

	interface ChordInProgression {
		note: Note;
		type: ChordType;
	}

	interface Song {
		name: string;
		composer?: string;
		key?: string;
		chords: ChordInProgression[];
	}

	interface Props {
		data: {
			songs: Song[];
		};
	}

	let { data }: Props = $props();
	const songs = data.songs;

	let selectedSong: Song = $state(songs[0]);
	let currentChordIndex = $state(0);
	let voicing: ChordVoicing = $state('full-right');
	let inversion: Inversion = $state(0);
	let playedNotes: Set<MidiNote> = $state(new Set());

	$effect(() => {
		// Reset when changing song
		currentChordIndex = 0;
		playedNotes = new Set();
	});

	function handleParentReset(): void {
		playedNotes = new Set();
	}

	function getCurrentChord(): ChordInProgression {
		return selectedSong.chords[currentChordIndex];
	}

	function generateExpectedNotes(selectedNote: Note): MidiNote[] {
		const currentChord = getCurrentChord();
		const rootNote = (currentChord.note + '3') as NoteFullName;
		const rootMidi = NoteToMidi[rootNote];
		const chord = chords(rootMidi, currentChord.type, inversion);

		const allChordNotes = [chord.root, chord.third, chord.fifth, chord.seventh].filter(
			(note) => note !== undefined
		) as MidiNote[];

		return allChordNotes;
	}

	function generateScoreProps(selectedNote: Note): ScoreProps {
		const currentChord = getCurrentChord();
		const { leftHand, rightHand } = generateChordNotesData(
			currentChord.note,
			currentChord.type,
			inversion,
			voicing
		);

		return {
			selectedNote: currentChord.note,
			leftHand,
			rightHand
		};
	}

	function validateChordNote(
		selectedNote: Note,
		event: NoteEvent,
		expectedNotes: MidiNote[],
		currentNotes: MidiNote[]
	): { isCorrect: boolean; message: string; collected: boolean; resetCollected: boolean } {
		if (expectedNotes.includes(event.noteNumber)) {
			playedNotes = new Set([...playedNotes, event.noteNumber]);

			if (playedNotes.size === expectedNotes.length) {
				const currentChord = getCurrentChord();
				const chordName = `${currentChord.note}${currentChord.type}`;
				return {
					isCorrect: true,
					message: `Perfect ${chordName}! 🎵✨`,
					collected: true,
					resetCollected: false
				};
			} else {
				return {
					isCorrect: true,
					message: `Good! ${playedNotes.size}/${expectedNotes.length} notes`,
					collected: true,
					resetCollected: false
				};
			}
		} else {
			playedNotes = new Set();
			return {
				isCorrect: false,
				message: 'Wrong note!',
				collected: false,
				resetCollected: true
			};
		}
	}

	function isChordCompleted(currentNotes: MidiNote[], expectedNotes: MidiNote[]): boolean {
		const uniqueExpectedNotes = [...new Set(expectedNotes)];
		return playedNotes.size === uniqueExpectedNotes.length;
	}

	function handleChordComplete(): void {
		// Move to next chord
		if (currentChordIndex < selectedSong.chords.length - 1) {
			currentChordIndex++;
			playedNotes = new Set();
		}
	}

	function handleVoicingChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		voicing = target.value as ChordVoicing;
		playedNotes = new Set();
	}

	function handleInversionChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		inversion = parseInt(target.value) as Inversion;
		playedNotes = new Set();
	}

	function handleSongChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		const songIndex = parseInt(target.value);
		selectedSong = songs[songIndex];
		currentChordIndex = 0;
		playedNotes = new Set();
	}
</script>

<BaseExercise
	randomMode={false}
	{generateExpectedNotes}
	{generateScoreProps}
	validateNoteEvent={validateChordNote}
	isCompleted={isChordCompleted}
	onReset={handleParentReset}
	onComplete={handleChordComplete}
	initialNote={getCurrentChord().note}
	{description}
>
	{#snippet children(api: any)}
		<div class="song-controls">
			<div class="song-header">
				<h2>{selectedSong.name}</h2>
				{#if selectedSong.composer}
					<div class="song-info">by {selectedSong.composer}</div>
				{/if}
				{#if selectedSong.key}
					<div class="song-info">Key: {selectedSong.key}</div>
				{/if}
				<div class="chord-progress">
					Chord {currentChordIndex + 1} of {selectedSong.chords.length}
				</div>
			</div>

			<div class="chord-progression">
				{#each selectedSong.chords as chord, index}
					<div
						class="chord-box"
						class:current={index === currentChordIndex}
						class:completed={index < currentChordIndex}
					>
						<div class="chord-name">{chord.note}{chord.type}</div>
					</div>
				{/each}
			</div>

			<div class="control-group">
				<label for="song">Song:</label>
				<select id="song" value={songs.indexOf(selectedSong)} onchange={handleSongChange}>
					{#each songs as song, index}
						<option value={index}>{song.name}</option>
					{/each}
				</select>
			</div>

			<div class="control-group">
				<label for="voicing">Voicing:</label>
				<select id="voicing" value={voicing} onchange={handleVoicingChange}>
					<option value="full-right">Full Right Hand</option>
					<option value="full-left">Full Left Hand</option>
					<option value="1735">Split (1-7-3-5)</option>
					<option value="1537">Split (1-5-3-7)</option>
				</select>
			</div>

			<div class="control-group">
				<label for="inversion">Inversion:</label>
				<select id="inversion" value={inversion} onchange={handleInversionChange}>
					<option value="0">Root Position</option>
					<option value="1">1st Inversion</option>
					<option value="2">2nd Inversion</option>
					<option value="3">3rd Inversion</option>
				</select>
			</div>
		</div>
	{/snippet}
</BaseExercise>

<style>
	.song-controls {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 1rem;
	}

	.song-header {
		text-align: center;
	}

	.song-header h2 {
		margin: 0 0 0.5rem 0;
		color: var(--color-theme-1);
		font-size: 1.5rem;
	}

	.song-info {
		font-size: 0.85rem;
		color: var(--color-text-secondary, #666);
		margin-bottom: 0.25rem;
	}

	.chord-progress {
		font-size: 0.9rem;
		color: var(--color-text-secondary, #666);
	}

	.chord-progression {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
		flex-wrap: wrap;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.02);
		border-radius: 8px;
	}

	.chord-box {
		padding: 0.75rem 1rem;
		border: 2px solid #ddd;
		border-radius: 6px;
		background: white;
		transition: all 0.3s ease;
		min-width: 80px;
		text-align: center;
	}

	.chord-box.current {
		border-color: var(--color-theme-1);
		background: rgba(255, 62, 0, 0.1);
		transform: scale(1.1);
		box-shadow: 0 4px 12px rgba(255, 62, 0, 0.2);
	}

	.chord-box.completed {
		border-color: #4caf50;
		background: rgba(76, 175, 80, 0.1);
		opacity: 0.7;
	}

	.chord-name {
		font-weight: 600;
		font-size: 1rem;
		color: var(--color-text);
	}

	.control-group {
		display: flex;
		gap: 1rem;
		align-items: center;
		justify-content: center;
	}

	.control-group label {
		font-weight: 500;
		min-width: 80px;
	}

	.control-group select {
		padding: 0.5rem;
		border: 1px solid var(--color-border, #ccc);
		border-radius: 4px;
		background: white;
		font-size: 1rem;
		min-width: 180px;
	}

	@media (max-width: 768px) {
		.song-header h2 {
			font-size: 1.2rem;
		}

		.chord-progression {
			gap: 0.3rem;
			padding: 0.75rem;
		}

		.chord-box {
			padding: 0.5rem 0.75rem;
			min-width: 60px;
		}

		.chord-name {
			font-size: 0.85rem;
		}

		.control-group {
			flex-direction: column;
			gap: 0.5rem;
		}

		.control-group label {
			min-width: auto;
		}

		.control-group select {
			min-width: 100%;
		}
	}
</style>
