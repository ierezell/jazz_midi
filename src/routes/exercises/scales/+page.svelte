<svelte:options runes={true} />

<script lang="ts">
	import type { ScaleMode } from '$lib/types/notes';
	import {
		AllScaleModes,
		MidiToNote,
		AllNotes,
		SCALE_INTERVALS,
		NoteToMidi
	} from '$lib/types/notes.constants';
	import type { MidiNote, Note, NoteEvent, NoteFullName, ScoreProps } from '$lib/types/types';
	import type { ValidationResult } from '$lib/types/exercise-api';
	import BaseExercise from '../../../components/BaseExercise.svelte';
	import { page } from '$app/state';
	import { userStatsService } from '$lib/UserStatsService';

	const description =
		'Play the scale shown, ascending and/or descending, using your MIDI keyboard. Try to follow the correct order.';
	import { generateExpectedNotesFor, type HandMode } from '$lib/scaleExercise';

	interface Props {
		randomMode: boolean;
		onComplete?: () => void;
		scaleMode?: ScaleMode;
		rootKey?: Note;
		sequentialMode?: boolean;
		handMode?: HandMode;
		progressiveHints?: boolean;
		prompt?: string;
		octaves?: number;
		direction?: 'up' | 'down' | 'up-down';
	}

	let {
		randomMode,
		onComplete,
		scaleMode: propScaleMode,
		sequentialMode: propSequentialMode,
		handMode: propHandMode,
		rootKey: propKey,
		progressiveHints,
		prompt,
		strictMode = true,
		octaves: propOctaves = 2,
		direction: propDirection = 'up-down'
	}: Props & { strictMode?: boolean } = $props();

	/**
	 * Progressive root note unlocking based on user level
	 * Circle of fifths progression: C -> G/F -> D/Bb -> A/Eb -> E/Ab -> B/Db -> F#/Gb
	 */
	function getUnlockedRootNotes(userLevel: number): Note[] {
		const progressionLevels: Note[][] = [
			['C'], // Level 0-1: Start with C (no sharps/flats)
			['C', 'G', 'F'], // Level 2-3: Add dominant (G, 1♯) and subdominant (F, 1♭)
			['C', 'G', 'F', 'D', 'Bb'], // Level 4-5: Add 2 sharps (D) and 2 flats (B♭)
			['C', 'G', 'F', 'D', 'Bb', 'A', 'Eb'], // Level 6-7: Add 3 sharps (A) and 3 flats (E♭)
			['C', 'G', 'F', 'D', 'Bb', 'A', 'Eb', 'E', 'Ab'], // Level 8-9: Add 4 sharps (E) and 4 flats (A♭)
			['C', 'G', 'F', 'D', 'Bb', 'A', 'Eb', 'E', 'Ab', 'B', 'Db'], // Level 10-11: Add 5 sharps (B) and 5 flats (D♭)
			AllNotes // Level 12+: All notes including enharmonics (F♯/G♭, C♯)
		];

		const levelIndex = Math.min(Math.floor(userLevel / 2), progressionLevels.length - 1);
		return progressionLevels[levelIndex];
	}

	// Get user level and unlocked notes
	let userLevel = $derived(userStatsService.getProfile().level);
	let unlockedNotes = $derived(getUnlockedRootNotes(userLevel));
	let showUnlockInfo = $state(false);

	// State
	let sequentialMode = $state(propSequentialMode ?? false);
	let handMode = $state(propHandMode ?? 'right');
	let scaleMode = $state(propScaleMode ?? 'Maj');
	let octaves = $state(propOctaves);
	let direction = $state(propDirection);
	let currentRootKey = $state<Note>('C');
	let effectiveRootKey = $derived(propKey ?? currentRootKey);

	// Initialize currentRootKey based on unlocked notes
	$effect(() => {
		if (!propKey && unlockedNotes.length > 0) {
			currentRootKey = randomMode
				? unlockedNotes[Math.floor(Math.random() * unlockedNotes.length)]
				: unlockedNotes[0];
		}
	});

	let playedSequence: MidiNote[] = $state([]);
	let playedNotes: Set<MidiNote> = $state(new Set());

	// Derived
	let computedPrompt = $derived(
		`${effectiveRootKey} ${scaleMode === 'Maj' ? 'Major' : 'Minor'} Scale`
	);
	let effectivePrompt = $derived(prompt ?? computedPrompt);

	function handleParentReset(): void {
		playedSequence = [];
		playedNotes = new Set();
	}

	function validateScaleNote(
		selectedNote: Note,
		event: NoteEvent,
		expectedNotes: ReadonlyArray<MidiNote>,
		currentNotes: ReadonlyArray<MidiNote>
	): ValidationResult {
		void selectedNote;
		if (sequentialMode) {
			return validateSequential(event, expectedNotes, currentNotes);
		} else {
			return validateAnyOrder(event, expectedNotes, currentNotes);
		}
	}

	function generateExpectedNotes(selectedNote: Note): MidiNote[] {
		void selectedNote;
		// Use local state effectiveRootKey
		const baseNotes = generateExpectedNotesFor(effectiveRootKey, scaleMode, handMode);

		// If only 1 octave, return base notes
		if (octaves === 1 && direction === 'up') {
			return baseNotes;
		}

		// Generate multi-octave scale
		const startOctave = handMode === 'left' ? 2 : 3;
		const intervals = SCALE_INTERVALS[scaleMode];
		const result: MidiNote[] = [];

		// Generate ascending scale across octaves
		if (direction === 'up' || direction === 'up-down') {
			for (let oct = 0; oct < octaves; oct++) {
				const rootMidi = NoteToMidi[(effectiveRootKey + (startOctave + oct)) as NoteFullName];
				intervals.forEach((interval) => {
					result.push((rootMidi + interval) as MidiNote);
				});
			}
		}

		// Generate descending scale
		if (direction === 'down' || direction === 'up-down') {
			const ascendingNotes: MidiNote[] = [];
			for (let oct = 0; oct < octaves; oct++) {
				const rootMidi = NoteToMidi[(effectiveRootKey + (startOctave + oct)) as NoteFullName];
				intervals.forEach((interval) => {
					ascendingNotes.push((rootMidi + interval) as MidiNote);
				});
			}

			if (direction === 'down') {
				// Only descending
				result.push(...ascendingNotes.reverse());
			} else {
				// up-down: remove duplicate top note, then descend
				const descendingNotes = [...ascendingNotes].reverse().slice(1);
				result.push(...descendingNotes);
			}
		}

		return result;
	}

	function generateScoreProps(selectedNote: Note): ScoreProps {
		const expectedNotes = generateExpectedNotes(selectedNote);

		// Convert MIDI notes to note names and format as individual beats (not a chord)
		const noteNames = expectedNotes.map((n) => MidiToNote[n]);

		// Create array of single-note arrays (one note per beat) instead of one chord
		const notesAsBeats = noteNames.map((note) => [note]);

		return {
			selectedNote: effectiveRootKey,
			leftHand: handMode === 'left' || handMode === 'both' ? notesAsBeats : [],
			rightHand: handMode === 'right' || handMode === 'both' ? notesAsBeats : []
		} as ScoreProps;
	}

	function validateSequential(
		event: NoteEvent,
		expectedNotes: ReadonlyArray<MidiNote>,
		currentNotes: ReadonlyArray<MidiNote>
	): ValidationResult {
		void currentNotes;
		const nextExpectedIndex = playedSequence.length;
		const expectedNote = expectedNotes[nextExpectedIndex];

		let collected: boolean = false;
		// strictMode check
		const matches = strictMode
			? event.noteNumber === expectedNote
			: event.noteNumber % 12 === expectedNote % 12;

		if (matches) {
			// Track what was actively played for sequence logic
			playedSequence = [...playedSequence, event.noteNumber];
			playedNotes = new Set([...playedNotes, event.noteNumber]);
			collected = true;
		} else {
			const expectedNoteName = MidiToNote[expectedNote]?.slice(0, -1) ?? String(expectedNote);
			playedSequence = [];
			playedNotes = new Set();
			return {
				isCorrect: false,
				message: `Wrong note! Expected ${expectedNoteName} ${strictMode ? '' : '(any octave)'}`,
				collected: false,
				resetCollected: true
			};
		}

		if (playedSequence.length === expectedNotes.length) {
			return {
				isCorrect: true,
				message: 'Perfect scale! 🎵✨',
				collected: true,
				resetCollected: false
			};
		} else {
			return {
				isCorrect: true,
				message: `Good! Note ${nextExpectedIndex + 1}/${expectedNotes.length}`,
				collected: true,
				resetCollected: false
			};
		}
	}

	function validateAnyOrder(
		event: NoteEvent,
		expectedNotes: ReadonlyArray<MidiNote>,
		currentNotes: ReadonlyArray<MidiNote>
	): ValidationResult {
		void currentNotes;
		const expectedClasses = expectedNotes.map((n) => n % 12);
		const playedClass = event.noteNumber % 12;

		const isExpected = strictMode
			? expectedNotes.includes(event.noteNumber)
			: expectedClasses.includes(playedClass);

		if (isExpected) {
			// Use a fresh Set to ensure reactivity when notes are added
			playedNotes = new Set([...playedNotes, event.noteNumber]);

			// Check completion based on strict/lenient
			let isComplete = false;
			if (strictMode) {
				isComplete = playedNotes.size === expectedNotes.length;
			} else {
				// In lenient mode, check if we have collected all REQUIRED PITCH CLASSES
				const collectedClasses = new Set([...playedNotes].map((n) => n % 12));
				const requiredClasses = new Set(expectedClasses);
				isComplete = collectedClasses.size === requiredClasses.size;
			}

			if (isComplete) {
				return {
					isCorrect: true,
					message: 'Perfect scale! 🎵',
					collected: true, // simplified logic, effectively we collected it
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
			return { isCorrect: false, message: 'Wrong note!', resetCollected: true, collected: false };
		}
	}

	function isScaleCompleted(
		currentNotes: ReadonlyArray<MidiNote>,
		expectedNotes: ReadonlyArray<MidiNote>
	): boolean {
		if (sequentialMode) {
			return (
				playedSequence.length === expectedNotes.length &&
				playedSequence.every((note, index) => {
					return strictMode
						? note === expectedNotes[index]
						: note % 12 === expectedNotes[index] % 12;
				})
			);
		} else {
			if (strictMode) {
				const uniqueExpectedNotes = [...new Set(expectedNotes)];
				return playedNotes.size === uniqueExpectedNotes.length;
			} else {
				const collectedClasses = new Set([...playedNotes].map((n) => n % 12));
				const requiredClasses = new Set(expectedNotes.map((n) => n % 12));
				return collectedClasses.size === requiredClasses.size;
			}
		}
	}

	function handleSequentialToggle(event: Event): void {
		const target = event.target as HTMLInputElement;
		sequentialMode = target.checked;
		playedNotes = new Set();
		playedSequence = [];
	}

	function handleHandModeChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		handMode = target.value as HandMode;
		playedNotes = new Set();
		playedSequence = [];
	}

	function handleScaleModeChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		scaleMode = target.value as ScaleMode;
		playedNotes = new Set();
		playedSequence = [];
	}

	function handleOctavesChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		octaves = parseInt(target.value);
		playedNotes = new Set();
		playedSequence = [];
	}

	function handleDirectionChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		direction = target.value as 'up' | 'down' | 'up-down';
		playedNotes = new Set();
		playedSequence = [];
	}

	function handleScaleComplete(): void {
		// Auto-generate new scale if in randomMode
		if (randomMode) {
			const randomRoot = unlockedNotes[Math.floor(Math.random() * unlockedNotes.length)];
			const randomScaleMode = AllScaleModes[Math.floor(Math.random() * AllScaleModes.length)];

			currentRootKey = randomRoot;
			scaleMode = randomScaleMode;
			playedNotes = new Set();
			playedSequence = [];
		}

		onComplete?.();
	}
	// Prompt logic moved to top derived state
</script>

<BaseExercise
	{randomMode}
	{generateExpectedNotes}
	{generateScoreProps}
	validateNoteEvent={validateScaleNote}
	isCompleted={isScaleCompleted}
	onReset={handleParentReset}
	onComplete={handleScaleComplete}
	initialNote={effectiveRootKey}
	{description}
	exerciseType="scale"
	{progressiveHints}
	prompt={effectivePrompt}
	showTempoControl={true}
	timingModeLabel="Play scale on beat"
>
	{#snippet children()}
		<div class="scale-controls">
			{#if randomMode}
				<div class="unlock-status">
					<button class="info-btn" onclick={() => (showUnlockInfo = !showUnlockInfo)}>
						{unlockedNotes.length}/{AllNotes.length} Root Notes Unlocked (Level {userLevel})
					</button>
					{#if showUnlockInfo}
						<div class="unlock-panel">
							<h4>Available Root Notes:</h4>
							<div class="notes-grid">
								{#each AllNotes as note}
									<span class="note-badge" class:unlocked={unlockedNotes.includes(note)}>
										{note}
										{#if !unlockedNotes.includes(note)}
											<span class="lock-icon">🔒</span>
										{/if}
									</span>
								{/each}
							</div>
							<p class="unlock-hint">
								Practice scales to level up and unlock more root notes!
								{#if unlockedNotes.length < AllNotes.length}
									Next unlock at level {Math.floor(unlockedNotes.length / 1.5) * 2 + 2}
								{/if}
							</p>
						</div>
					{/if}
				</div>
			{/if}

			{#if !randomMode && !page.url.searchParams.get('unitId')}
				<div class="settings-panel">
					<div class="control-group">
						<label>
							<input
								type="checkbox"
								bind:checked={sequentialMode}
								onchange={handleSequentialToggle}
							/>
							In order
						</label>
					</div>
					<div class="control-group">
						<label for="handMode">Hand:</label>
						<select id="handMode" value={handMode} onchange={handleHandModeChange}>
							<option value="right">Right Hand</option>
							<option value="left">Left Hand</option>
							<option value="both">Both Hands</option>
						</select>
					</div>
					<div class="control-group">
						<label for="scaleMode">Scale mode:</label>
						<select id="scaleMode" value={scaleMode} onchange={handleScaleModeChange}>
							<option value="Maj">Major</option>
							<option value="Min">Minor</option>
						</select>
					</div>
					<div class="control-group">
						<label for="octaves">Octaves:</label>
						<select id="octaves" value={octaves} onchange={handleOctavesChange}>
							<option value="1">1 Octave</option>
							<option value="2">2 Octaves</option>
							<option value="3">3 Octaves</option>
						</select>
					</div>
					<div class="control-group">
						<label for="direction">Direction:</label>
						<select id="direction" value={direction} onchange={handleDirectionChange}>
							<option value="up">Ascending ↑</option>
							<option value="down">Descending ↓</option>
							<option value="up-down">Up & Down ↕</option>
						</select>
					</div>
				</div>
			{/if}
		</div>
	{/snippet}
</BaseExercise>

<style>
	.scale-controls {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		margin-bottom: 1rem;
		align-items: center;
		justify-content: center;
	}

	.control-group {
		display: flex;
		gap: 1rem;
		align-items: center;
		flex-wrap: wrap;
		justify-content: center;
	}

	.control-group label {
		min-width: fit-content;
	}

	.control-group select {
		min-width: 140px;
	}

	.settings-panel {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		justify-content: center;
		padding: 1rem;
		background: var(--color-surface, rgba(255, 255, 255, 0.05));
		border-radius: 12px;
		border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
		max-width: 800px;
	}

	.unlock-status {
		width: 100%;
		max-width: 600px;
		position: relative;
	}

	.info-btn {
		width: 100%;
		padding: 0.75rem 1.5rem;
		background: linear-gradient(
			135deg,
			var(--color-theme-1, #9b59b6),
			var(--color-theme-2, #8e44ad)
		);
		color: white;
		border: none;
		border-radius: 12px;
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px rgba(155, 89, 182, 0.2);
	}

	.info-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(155, 89, 182, 0.3);
	}

	.unlock-panel {
		margin-top: 1rem;
		padding: 1.5rem;
		background: var(--color-surface, #2a2a2a);
		border: 2px solid var(--color-theme-1, #9b59b6);
		border-radius: 12px;
		animation: slideDown 0.3s ease;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.unlock-panel h4 {
		margin: 0 0 1rem 0;
		color: var(--color-theme-1, #9b59b6);
		font-size: 1.1rem;
		text-align: center;
	}

	.notes-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.note-badge {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.75rem 0.5rem;
		border-radius: 8px;
		font-weight: 700;
		font-size: 1.1rem;
		transition: all 0.2s;
	}

	.note-badge.unlocked {
		background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(56, 142, 60, 0.2));
		border: 2px solid #4caf50;
		color: #4caf50;
	}

	.note-badge:not(.unlocked) {
		background: rgba(0, 0, 0, 0.2);
		border: 2px solid rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.3);
	}

	.lock-icon {
		position: absolute;
		top: 2px;
		right: 2px;
		font-size: 0.7rem;
	}

	.unlock-hint {
		text-align: center;
		font-size: 0.9rem;
		color: var(--color-text-muted, #aaa);
		margin: 0;
		font-style: italic;
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
		.scale-controls {
			flex-direction: column;
			gap: 1rem;
		}

		.notes-grid {
			grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
			gap: 0.4rem;
		}

		.note-badge {
			padding: 0.5rem 0.25rem;
			font-size: 0.95rem;
		}
	}
</style>
