<svelte:options runes={true} />

<script lang="ts">
	type PageData = { songs: import('$lib/types/musicxml').MusicXMLSong[] };
	import BaseExercise from '../../../components/exercise/BaseExercise.svelte';
	import Score from '../../../components/exercise/Score.svelte';
	import type { MusicXMLSong, SongExerciseType } from '$lib/types/musicxml';
	import type { BarData, MistakeMode } from '$lib/types/rhythm';
	import type { MidiNote, NoteEvent, ScoreProps } from '$lib/types/types';
	import type { ValidationResult } from '$lib/types/exercise-api';
	import {
		generateAnnotations,
		getBeginnerChordAnnotation,
		getVoicingSuggestion
	} from '$lib/ScoreAnnotationUtils';
	import {
		createBarsFromChords,
		validateRhythmNote,
		isBarComplete,
		getRestartBarIndex,
		formatBarProgress,
		getAutoRestartMessage,
		getWaitForKeyMessage,
		generateRhythmExerciseFromSong
	} from '../rhythm/rhythm-logic';
	import { NoteToMidi, MidiToNote } from '$lib/types/notes.constants';
	import type { Note } from '$lib/types/notes';

	let { data }: { data: PageData } = $props();

	// Exercise settings
	let exerciseType: SongExerciseType = $state('chords');
	let selectedSong: MusicXMLSong = $derived(data.songs[0]);
	let currentBarIndex = $state(0);
	let mistakeMode: MistakeMode = $state('auto-restart');
	let tempoMode = $state(true);
	let bpm = $state(100);
	let swing = $state(true);
	let autoRestartDelay = $state(4);

	// Exercise state
	let playedNotes: Set<MidiNote> = $state(new Set());
	let playedBeats: Set<number> = $state(new Set());
	let isPaused = $state(false);
	let countdown = $state(0);
	let isRestarting = $state(false);
	let bars: BarData[] = $state([]);

	// Annotations
	let showAnnotations = $state(true);
	let annotations = $derived(showAnnotations ? generateAnnotations(selectedSong) : []);

	// Initialize bars when song or exercise type changes
	$effect(() => {
		if (selectedSong?.chords) {
			bars = createBarsFromChords(selectedSong.chords);
		}
	});

	function getCurrentBar(): BarData {
		return bars[currentBarIndex] || { index: 0, expectedNotes: [], expectedBeats: [] };
	}

	function generateExpectedNotes(selectedNote: Note): MidiNote[] {
		const bar = getCurrentBar();

		if (exerciseType === 'chords' && bar.chordName) {
			// Get chord notes based on chord name
			const chordMatch = bar.chordName.match(/^([A-G][b#]?)(.*)$/);
			if (chordMatch) {
				const root = chordMatch[1];
				const quality = chordMatch[2] || 'major';

				// Get notes from chord function
				const rootMidi = NoteToMidi[`${root}3` as keyof typeof NoteToMidi];
				if (rootMidi) {
					// Return basic chord tones for now
					return [rootMidi, rootMidi + 4, rootMidi + 7] as MidiNote[];
				}
			}
		}

		return bar.expectedNotes;
	}

	function generateScoreProps(selectedNote: Note): ScoreProps {
		// For MusicXML, we return empty arrays as the score is rendered separately
		return {
			selectedNote,
			leftHand: [],
			rightHand: []
		};
	}

	function validateNoteEvent(
		selectedNote: Note,
		event: NoteEvent,
		expectedNotes: MidiNote[],
		currentNotes: MidiNote[]
	): ValidationResult {
		// Check if we're paused waiting for key press
		if (isPaused && mistakeMode === 'wait-for-key') {
			// Any key press will restart
			restartFromCurrentBar();
			return {
				isCorrect: true,
				message: 'Restarting...',
				collected: true,
				resetCollected: true
			};
		}

		const bar = getCurrentBar();

		// Basic validation - check if note is in expected set
		const isExpected = expectedNotes.includes(event.noteNumber);

		if (!isExpected) {
			// Mistake made
			handleMistake();
			return {
				isCorrect: false,
				message: getMistakeMessage(),
				collected: false,
				resetCollected: true
			};
		}

		// Correct note played
		playedNotes.add(event.noteNumber);

		if (isBarComplete(bar, playedNotes, playedBeats)) {
			// Move to next bar
			advanceToNextBar();
			return {
				isCorrect: true,
				message: 'Bar complete! 🎵',
				collected: true,
				resetCollected: true
			};
		}

		return {
			isCorrect: true,
			message: `${playedNotes.size}/${expectedNotes.length} notes`,
			collected: true,
			resetCollected: false
		};
	}

	function handleMistake() {
		if (mistakeMode === 'auto-restart') {
			startAutoRestart();
		} else {
			isPaused = true;
		}
	}

	function getMistakeMessage(): string {
		if (mistakeMode === 'wait-for-key') {
			return getWaitForKeyMessage();
		}
		return `Mistake! Restarting bar...`;
	}

	function startAutoRestart() {
		if (isRestarting) return;

		isRestarting = true;
		countdown = autoRestartDelay;

		const interval = setInterval(() => {
			countdown--;
			if (countdown <= 0) {
				clearInterval(interval);
				restartFromPreviousBar();
				isRestarting = false;
			}
		}, 1000);
	}

	function restartFromPreviousBar() {
		const restartIndex = getRestartBarIndex(currentBarIndex, bars, 1);
		currentBarIndex = restartIndex;
		playedNotes = new Set();
		playedBeats = new Set();
		isPaused = false;
		isRestarting = false;
	}

	function restartFromCurrentBar() {
		playedNotes = new Set();
		playedBeats = new Set();
		isPaused = false;
	}

	function advanceToNextBar() {
		if (currentBarIndex < bars.length - 1) {
			currentBarIndex++;
			playedNotes = new Set();
			playedBeats = new Set();
		} else {
			// Song complete - loop back to start
			currentBarIndex = 0;
			playedNotes = new Set();
			playedBeats = new Set();
		}
	}

	function isCompleted(currentNotes: MidiNote[], expectedNotes: MidiNote[]): boolean {
		// Completion is handled bar by bar
		return false;
	}

	function onReset() {
		currentBarIndex = 0;
		playedNotes = new Set();
		playedBeats = new Set();
		isPaused = false;
		isRestarting = false;
		countdown = 0;
	}

	function onComplete() {
		// Individual bar completion handled in validation
	}

	function handleSongChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const songId = target.value;
		selectedSong = data.songs.find((s: MusicXMLSong) => s.id === songId) || data.songs[0];
		onReset();
	}

	function handleExerciseTypeChange(type: SongExerciseType) {
		exerciseType = type;
		onReset();
	}

	function toggleMistakeMode() {
		mistakeMode = mistakeMode === 'auto-restart' ? 'wait-for-key' : 'auto-restart';
	}

	function toggleTempoMode() {
		tempoMode = !tempoMode;
	}

	const description =
		'Practice songs bar by bar with rhythm. Play each chord or note on the beat. Mistakes will either auto-restart from the previous bar or pause until you press a key.';
</script>

<BaseExercise
	randomMode={false}
	{description}
	exerciseType="rhythm"
	{generateExpectedNotes}
	{generateScoreProps}
	{validateNoteEvent}
	{isCompleted}
	{onReset}
	{onComplete}
	initialNote={(selectedSong?.key?.charAt(0) as Note) || 'C'}
	showScore={false}
	defaultBpm={bpm}
	perNoteTiming={true}
>
	{#snippet children(api)}
		<div class="song-rhythm-exercise">
			<!-- Song Selection -->
			<div class="control-section">
				<div class="control-group">
					<label for="song-select">Song:</label>
					<select id="song-select" value={selectedSong.id} onchange={handleSongChange}>
						{#each data.songs as song}
							<option value={song.id}>{song.title} ({song.composer || 'Unknown'})</option>
						{/each}
					</select>
				</div>

				<div class="exercise-type-toggle">
					<button
						class:active={exerciseType === 'chords'}
						onclick={() => handleExerciseTypeChange('chords')}
					>
						Chords
					</button>
					<button
						class:active={exerciseType === 'melody'}
						onclick={() => handleExerciseTypeChange('melody')}
					>
						Melody
					</button>
					<button
						class:active={exerciseType === 'full'}
						onclick={() => handleExerciseTypeChange('full')}
					>
						Full Song
					</button>
				</div>
			</div>

			<!-- MusicXML Score Display -->
			{#if selectedSong}
				<div class="score-section">
					<Score url={selectedSong.url} {annotations} />
				</div>
			{/if}

			<!-- Progress Display -->
			<div class="progress-section">
				<div class="bar-info">
					<span class="bar-number">Bar {currentBarIndex + 1} of {bars.length}</span>
					{#if getCurrentBar().chordName}
						<span class="chord-name">{getCurrentBar().chordName}</span>
					{/if}
				</div>

				<div class="progress-bar">
					<div
						class="progress-fill"
						style="width: {(currentBarIndex / Math.max(1, bars.length - 1)) * 100}%"
					></div>
				</div>

				{#if isRestarting && mistakeMode === 'auto-restart'}
					<div class="countdown">{getAutoRestartMessage(countdown)}</div>
				{/if}

				{#if isPaused && mistakeMode === 'wait-for-key'}
					<div class="paused-message">{getWaitForKeyMessage()}</div>
				{/if}
			</div>

			<!-- Settings -->
			<div class="settings-section">
				<div class="setting-group">
					<label>
						<input
							type="checkbox"
							checked={mistakeMode === 'auto-restart'}
							onchange={toggleMistakeMode}
						/>
						Auto-restart on mistake
					</label>
					<span class="setting-hint">
						{mistakeMode === 'auto-restart'
							? 'Gives 4 beats to refocus'
							: 'Press any key to continue'}
					</span>
				</div>

				<div class="setting-group">
					<label>
						<input
							type="checkbox"
							checked={showAnnotations}
							onchange={() => (showAnnotations = !showAnnotations)}
						/>
						Show II-V-I annotations
					</label>
				</div>

				{#if tempoMode}
					<div class="setting-group">
						<label for="bpm-slider">Tempo: {bpm} BPM</label>
						<input
							id="bpm-slider"
							type="range"
							min="40"
							max="200"
							value={bpm}
							oninput={(e) => (bpm = parseInt(e.currentTarget.value))}
						/>
					</div>

					<div class="setting-group">
						<label>
							<input type="checkbox" checked={swing} onchange={() => (swing = !swing)} />
							Swing feel
						</label>
					</div>
				{/if}
			</div>

			<!-- Bar Visualizer -->
			<div class="bar-visualizer">
				{#each bars as bar, index}
					<div
						class="bar-box"
						class:current={index === currentBarIndex}
						class:completed={index < currentBarIndex}
						class:upcoming={index > currentBarIndex}
					>
						{#if bar.chordName}
							<span class="bar-chord">{bar.chordName}</span>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/snippet}
</BaseExercise>

<style>
	.song-rhythm-exercise {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 1rem;
	}

	.control-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.control-group {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.control-group label {
		font-weight: 600;
		min-width: 80px;
	}

	.control-group select {
		flex: 1;
		padding: 0.5rem;
		border: 1px solid var(--color-border);
		border-radius: 4px;
		background: var(--color-surface);
		color: var(--color-text);
	}

	.exercise-type-toggle {
		display: flex;
		gap: 0.5rem;
	}

	.exercise-type-toggle button {
		padding: 0.5rem 1rem;
		border: 1px solid var(--color-border);
		background: var(--color-surface);
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.exercise-type-toggle button.active {
		background: var(--color-primary);
		color: white;
		border-color: var(--color-primary);
	}

	.score-section {
		border: 1px solid var(--color-border);
		border-radius: 8px;
		overflow: hidden;
	}

	.progress-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
		background: var(--color-surface-raised);
		border-radius: 8px;
	}

	.bar-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.bar-number {
		font-size: 1.1rem;
		font-weight: 600;
	}

	.chord-name {
		font-size: 1.2rem;
		color: var(--color-primary);
		font-weight: 700;
	}

	.progress-bar {
		height: 8px;
		background: var(--color-surface);
		border-radius: 4px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--color-primary);
		transition: width 0.3s ease;
	}

	.countdown,
	.paused-message {
		padding: 0.75rem;
		border-radius: 4px;
		font-weight: 600;
		text-align: center;
	}

	.countdown {
		background: rgba(255, 193, 7, 0.2);
		color: #856404;
	}

	.paused-message {
		background: rgba(248, 81, 73, 0.1);
		color: var(--color-error);
	}

	.settings-section {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		padding: 1rem;
		background: var(--color-surface);
		border-radius: 8px;
		border: 1px solid var(--color-border);
	}

	.setting-group {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.setting-group label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	.setting-hint {
		font-size: 0.8rem;
		color: var(--color-text-muted);
		margin-left: 1.5rem;
	}

	.bar-visualizer {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.02);
		border-radius: 8px;
	}

	.bar-box {
		width: 60px;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid var(--color-border);
		border-radius: 8px;
		background: var(--color-surface);
		font-size: 0.8rem;
		transition: all 0.3s ease;
	}

	.bar-box.current {
		border-color: var(--color-primary);
		background: rgba(88, 166, 255, 0.2);
		transform: scale(1.1);
	}

	.bar-box.completed {
		border-color: var(--color-success);
		background: rgba(34, 197, 94, 0.1);
		opacity: 0.7;
	}

	.bar-box.upcoming {
		opacity: 0.5;
	}

	.bar-chord {
		font-weight: 600;
	}

	@media (max-width: 768px) {
		.bar-visualizer {
			gap: 0.3rem;
		}

		.bar-box {
			width: 45px;
			height: 45px;
			font-size: 0.7rem;
		}
	}
</style>
