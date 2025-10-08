<svelte:options runes={true} />

<script lang="ts">
	import { MidiToNote, AllIntervals, INTERVAL_NAMES, NoteToMidi } from '$lib/types/notes.constants';
	import type {
		MidiNote,
		Note,
		NoteEvent,
		ScoreProps,
		IntervalType,
		NoteFullName
	} from '$lib/types/types';
	import { calculateInterval } from '$lib/MusicTheoryUtils';
	import BaseExercise from '../../../components/BaseExercise.svelte';

	interface Props {
		randomMode: boolean;
		onComplete?: () => void;
		rootKey?: Note;
		intervalType?: IntervalType;
		showBothNotes?: boolean;
	}

	let {
		randomMode,
		onComplete,
		rootKey: propKey,
		intervalType: propIntervalType,
		showBothNotes: propShowBothNotes
	}: Props = $props();

	let intervalType: IntervalType = $state(
		propIntervalType ??
			(randomMode ? AllIntervals[Math.floor(Math.random() * AllIntervals.length)] : 'major3rd')
	);
	let selectedClef: 'treble' | 'bass' = $state('treble');
	let playedNotes: Set<MidiNote> = $state(new Set());
	let exerciseCompleted = $state(false);
	let currentRootNote: MidiNote | null = $state(null);
	let expectedNote = $derived(() => {
		if (currentRootNote === null) return null;
		const noteWithOctave = MidiToNote[currentRootNote];
		const noteWithoutOctave = noteWithOctave.slice(0, -1) as Note;
		return calculateInterval(noteWithoutOctave, intervalType, '3');
	});

	function handleParentReset(): void {
		playedNotes = new Set();
		exerciseCompleted = false;
		currentRootNote = null;
	}

	$effect(() => {
		if (exerciseCompleted && onComplete) {
			onComplete();
		}
	});

	function generateExpectedNote(selectedNote: Note): MidiNote[] {
		try {
			// Use octave 3 for bass clef, octave 4 for treble clef
			const octave = selectedClef === 'bass' ? '3' : '4';
			const expectedNoteValue = calculateInterval(selectedNote, intervalType, octave);
			const rootMidi = NoteToMidi[(selectedNote + octave) as NoteFullName];
			const expectedMidi = NoteToMidi[(expectedNoteValue + octave) as NoteFullName];
			currentRootNote = rootMidi;
			console.debug(
				`Interval ${INTERVAL_NAMES[intervalType]} from ${selectedNote}${octave} to ${expectedNoteValue}${octave}:`,
				`Root MIDI: ${rootMidi}, Expected MIDI: ${expectedMidi}`
			);
			// Always return both notes for validation
			return [rootMidi, expectedMidi];
		} catch (error) {
			console.error('Error generating expected note:', error);
			// Return default fallback
			const rootMidi = NoteToMidi['C4'];
			const expectedMidi = NoteToMidi['E4'];
			currentRootNote = rootMidi;
			return [rootMidi, expectedMidi];
		}
	}

	function generateScoreProps(selectedNote: Note): ScoreProps {
		try {
			const expectedNote = calculateInterval(selectedNote, intervalType, '4');
			const rootNote = (selectedNote + '4') as NoteFullName;
			const intervalNote = (expectedNote + '4') as NoteFullName;

			// Show both notes in treble clef for better visibility
			const rightHand = showBothNotes ? [[rootNote, intervalNote]] : [[intervalNote]];

			return {
				selectedNote: selectedNote,
				leftHand: [], // Empty left hand for cleaner display
				rightHand
			};
		} catch (error) {
			console.error('Error generating score props:', error);
			// Return default fallback
			return {
				selectedNote: selectedNote,
				leftHand: [],
				rightHand: [['C4', 'E4']]
			};
		}
	}
	function validateIntervalNote(
		selectedNote: Note,
		event: NoteEvent,
		expectedNotes: MidiNote[],
		currentNotes: MidiNote[]
	): { isCorrect: boolean; message: string; collected: boolean; resetCollected: boolean } {
		const [rootMidi, intervalMidi] = expectedNotes;
		const intervalName = INTERVAL_NAMES[intervalType];

		if (expectedNotes.includes(event.noteNumber)) {
			// Add the played note to our collection
			playedNotes = new Set([...playedNotes, event.noteNumber]);

			// Check if we have both notes
			if (playedNotes.size === 2) {
				return {
					isCorrect: true,
					message: `Perfect ${intervalName}! 🎵✨`,
					collected: true,
					resetCollected: false
				};
			} else {
				// Determine which note was played
				const isRoot = event.noteNumber === rootMidi;
				const noteName = isRoot ? 'root' : intervalName;
				return {
					isCorrect: true,
					message: `Good! ${noteName} played (${playedNotes.size}/2)`,
					collected: true,
					resetCollected: false
				};
			}
		} else {
			playedNotes = new Set();
			const playedNoteName = MidiToNote[event.noteNumber]?.slice(0, -1) as Note;
			return {
				isCorrect: false,
				message: `Wrong! You played ${playedNoteName}. Play ${intervalName} from ${selectedNote}`,
				collected: false,
				resetCollected: true
			};
		}
	}

	function isIntervalCompleted(currentNotes: MidiNote[], expectedNotes: MidiNote[]): boolean {
		const uniqueExpectedNotes = [...new Set(expectedNotes)];
		return playedNotes.size === uniqueExpectedNotes.length;
	}

	function handleIntervalTypeChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		intervalType = target.value as IntervalType;
		playedNotes = new Set();
	}

	function handleClefChange(clef: 'treble' | 'bass'): void {
		selectedClef = clef;
		playedNotes = new Set();
	}
</script>

<BaseExercise
	{randomMode}
	generateExpectedNotes={generateExpectedNote}
	{generateScoreProps}
	validateNoteEvent={validateIntervalNote}
	isCompleted={isIntervalCompleted}
	onReset={handleParentReset}
	onComplete={onComplete || (() => {})}
	initialNote={propKey || 'C'}
>
	{#snippet children(api: any)}
		{@const wasCompleted = exerciseCompleted}
		{@const isNowCompleted = api.completed}
		{#if isNowCompleted && !wasCompleted}
			{(exerciseCompleted = true)}
		{:else if !isNowCompleted && wasCompleted}
			{(exerciseCompleted = false)}
		{/if}

		<div class="interval-controls">
			{#if !randomMode}
				<div class="control-group">
					<label for="intervalType">Interval:</label>
					<select id="intervalType" value={intervalType} onchange={handleIntervalTypeChange}>
						{#each AllIntervals as interval}
							<option value={interval}>{INTERVAL_NAMES[interval]}</option>
						{/each}
					</select>
				</div>
				<div class="control-group">
					<label>Clef:</label>
					<div class="clef-buttons">
						<button
							class="clef-btn"
							class:active={selectedClef === 'treble'}
							onclick={() => handleClefChange('treble')}
						>
							🎼 Treble
						</button>
						<button
							class="clef-btn"
							class:active={selectedClef === 'bass'}
							onclick={() => handleClefChange('bass')}
						>
							🎵 Bass
						</button>
					</div>
				</div>
			{/if}

			{#if currentRootNote !== null}
				<div class="interval-info">
					<span class="root-note">Root: {MidiToNote[currentRootNote]?.slice(0, -1)}</span>
					<span class="interval-name">→ {INTERVAL_NAMES[intervalType]}</span>
					<span class="progress">({playedNotes.size}/2 notes)</span>
				</div>
			{/if}
		</div>
	{/snippet}
</BaseExercise>

<style>
	.interval-controls {
		display: flex;
		gap: 2rem;
		margin-bottom: 1rem;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
	}

	.control-group {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.clef-buttons {
		display: flex;
		gap: 0.5rem;
	}

	.clef-btn {
		padding: 0.5rem 1rem;
		border: 2px solid #ddd;
		border-radius: 0.5rem;
		background: white;
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.clef-btn:hover {
		border-color: var(--primary-color, #3498db);
		background: #f8f9fa;
	}

	.clef-btn.active {
		border-color: var(--primary-color, #3498db);
		background: var(--primary-color, #3498db);
		color: white;
	}
		padding: 0.5rem 1rem;
		border: 2px solid #ddd;
		border-radius: 0.5rem;
		background: white;
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.clef-btn:hover {
		border-color: var(--primary-color, #3498db);
		background: #f8f9fa;
	}

	.clef-btn.active {
		border-color: var(--primary-color, #3498db);
		background: var(--primary-color, #3498db);
		color: white;
	}

	.interval-info {
		display: flex;
		gap: 1rem;
		align-items: center;
		padding: 0.5rem 1rem;
		background: var(--primary-color, #3498db);
		color: white;
		border-radius: 0.5rem;
		font-weight: bold;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.progress {
		font-size: 0.9rem;
		opacity: 0.9;
	}

	.root-note {
		font-size: 1.1em;
	}

	.interval-name {
		font-size: 0.9em;
		opacity: 0.9;
	}

	select {
		padding: 0.3rem 0.6rem;
		border: 1px solid #ddd;
		border-radius: 0.3rem;
		background: white;
		font-size: 0.9rem;
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
		.interval-controls {
			flex-direction: column;
			gap: 1rem;
		}

		.interval-info {
			font-size: 0.9rem;
		}
	}
</style>
