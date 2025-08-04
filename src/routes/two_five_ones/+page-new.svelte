<svelte:options runes={true} />

<script lang="ts">
	import { onMount } from 'svelte';
	import BaseExercise from '../../components/BaseExercise.svelte';
	import { audioManager } from '../../lib/managers/AudioManager';
	import { midiManager } from '../../lib/managers/MIDIManager';
	import { userStatsService } from '../../lib/services/UserStatsService';
	import type { BaseExerciseState, ChordToneInfo, MidiNote, Note, NoteEvent, NoteFullName } from '../../lib/types';
	import { createChordToneMapping } from '../../lib/types';
	import {
		AllNotes,
		chords,
		getMidiNote,
		MidiToNote,
		NoteToMidi,
		midiNoteToNoteName
	} from '../../midi/midi';

	// ===== STATE =====
	let selectedNote: Note = $state('C');
	let currentChordIndex = $state(0); // 0 = ii, 1 = V, 2 = I
	let noteEvents: NoteEvent[] = $state([]);
	let mistakes = $state(0);
	let completed = $state(false);
	let debugMode = $state(false);
	let feedbackMessage = $state('');
	let startTime = $state(Date.now());

	// Auto-enable helpers based on mistakes
	let showNoteNames = $derived(mistakes >= 3);
	let showKeyboard = $derived(mistakes >= 6);

	// ===== COMPUTED PROPERTIES =====
	let currentNotes = $derived(noteEvents.map((e) => e.noteNumber));

	// Calculate ii-V-I progression
	let twoChordRoot = $derived(NoteToMidi[(selectedNote + '4') as NoteFullName] + 2);
	let fiveChordRoot = $derived(NoteToMidi[(selectedNote + '4') as NoteFullName] + 7);
	let oneChordRoot = $derived(NoteToMidi[(selectedNote + '4') as NoteFullName]);

	let twoChord = $derived(chords(twoChordRoot as MidiNote, 'min7'));
	let fiveChord = $derived(chords(fiveChordRoot as MidiNote, '7'));
	let oneChord = $derived(chords(oneChordRoot as MidiNote, 'maj7'));

	let progressionChords = $derived([twoChord, fiveChord, oneChord]);
	let chordNames = $derived([
		`${MidiToNote[twoChordRoot].slice(0, -1)}m7`,
		`${MidiToNote[fiveChordRoot].slice(0, -1)}7`,
		`${MidiToNote[oneChordRoot].slice(0, -1)}maj7`
	]);

	let currentChord = $derived(progressionChords[currentChordIndex]);
	let currentExpectedNotes = $derived(
		[currentChord.root, currentChord.third, currentChord.fifth, currentChord.seventh].filter(n => n != null) as MidiNote[]
	);

	// For the full progression
	let allExpectedNotes = $derived.by(() => {
		const allNotes: MidiNote[] = [];
		progressionChords.forEach(chord => {
			const notes = [chord.root, chord.third, chord.fifth, chord.seventh].filter(n => n != null) as MidiNote[];
			allNotes.push(...notes);
		});
		return allNotes;
	});

	let expectedNotes = $derived(currentExpectedNotes);

	let chordToneMapping = $derived.by((): ChordToneInfo[] => {
		return createChordToneMapping(currentChord);
	});

	// Exercise state for BaseExercise
	let exerciseState = $derived.by((): BaseExerciseState => {
		return {
			selectedNote,
			midiNotes: currentNotes,
			noteEvents,
			debugMode,
			showNoteNames,
			showKeyboard,
			feedbackMessage,
			errorCount: mistakes,
			completed
		};
	});

	// Score properties - show current chord
	let scoreProps = $derived({
		notes: currentExpectedNotes.map(note => midiNoteToNoteName(note as MidiNote)) as NoteFullName[],
		highlightedNotes: currentNotes.map((note) => midiNoteToNoteName(note as MidiNote)),
		title: `${selectedNote} ii-V-I: ${chordNames[currentChordIndex]} (${currentChordIndex + 1}/3)`
	});

	// ===== FUNCTIONS =====

	function handleNoteSelect(note: Note) {
		selectedNote = note;
		resetExercise();
	}

	function toggleDebug() {
		debugMode = !debugMode;
		if (debugMode) {
			midiManager.enableDebugMode();
		} else {
			midiManager.disableDebugMode();
		}
	}

	function resetExercise() {
		mistakes = 0;
		noteEvents = [];
		completed = false;
		currentChordIndex = 0;
		feedbackMessage = '';
		startTime = Date.now();
		midiManager.resetExercise();
	}

	function nextChord() {
		if (currentChordIndex < 2) {
			currentChordIndex++;
			feedbackMessage = `Great! Now play ${chordNames[currentChordIndex]}`;
		} else {
			completed = true;
			feedbackMessage = `Perfect! Complete ${selectedNote} ii-V-I progression! 🎵✨`;
			audioManager.playSuccess();
			
			// Track progress
			const timeSpent = (Date.now() - startTime) / 1000;
			const accuracy = Math.round((12 / (12 + mistakes)) * 100); // 12 total notes in progression
			userStatsService.updateNoteProgress(
				selectedNote,
				'progression',
				undefined,
				true,
				timeSpent,
				accuracy
			);
		}
	}

	function onMidiEvent(event: NoteEvent) {
		noteEvents = [event, ...noteEvents.slice(0, 9)];

		if (event.type === 'on') {
			if (expectedNotes.includes(event.noteNumber)) {
				const activeCorrect = noteEvents
					.filter(e => e.type === 'on')
					.filter(e => expectedNotes.includes(e.noteNumber));

				if (activeCorrect.length === expectedNotes.length) {
					nextChord();
				} else {
					feedbackMessage = `Good! ${activeCorrect.length}/${expectedNotes.length} notes for ${chordNames[currentChordIndex]}`;
				}
			} else {
				mistakes++;
				feedbackMessage = `Wrong note! Expected: ${chordNames[currentChordIndex]}`;
				audioManager.playError();
			}
		}
	}

	// ===== LIFECYCLE =====
	onMount(() => {
		midiManager.connect(onMidiEvent);
		audioManager.initialize();
		
		return () => {
			midiManager.disconnect();
		};
	});
</script>

<div class="progression-exercise">
	<BaseExercise
		{exerciseState}
		exerciseTitle={`${selectedNote} ii-V-I Progression`}
		exerciseDescription="Play each chord in sequence: ii7 - V7 - Imaj7"
		{expectedNotes}
		{scoreProps}
		keyboardProps={{
			chordToneInfo: chordToneMapping,
			showChordTones: true
		}}
		{onNoteSelect}={handleNoteSelect}
		onDebugToggle={toggleDebug}
		onReset={resetExercise}
		customControls={true}
	>
		<!-- Custom controls for progression exercise -->
		<div class="progression-controls">
			<div class="control-group">
				<button onclick={toggleDebug} class="debug-btn">
					{debugMode ? 'Disable' : 'Enable'} Debug Mode
				</button>
				<button onclick={resetExercise} class="reset-btn">Reset</button>
			</div>
			
			<div class="chord-progress">
				{#each chordNames as chordName, index}
					<div class="chord-indicator" class:active={index === currentChordIndex} class:completed={index < currentChordIndex}>
						{chordName}
					</div>
				{/each}
			</div>
		</div>

		<!-- Custom status display -->
		<div class="exercise-status">
			<div class="current-chord">
				Current: {chordNames[currentChordIndex]} ({currentChordIndex + 1}/3)
			</div>
			<div class="progress">
				Progress: {Math.round(
					(currentNotes.filter((n) => expectedNotes.includes(n)).length / expectedNotes.length) * 100
				)}%
			</div>
			<div class="mistakes">
				Mistakes: {mistakes}
			</div>
			{#if completed}
				<div class="completion">🎉 ii-V-I Completed!</div>
			{/if}
		</div>
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

	.debug-btn, .reset-btn {
		padding: 0.5rem 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		background: white;
		cursor: pointer;
		transition: all 0.2s;
	}

	.debug-btn {
		background: var(--color-debug, #e3f2fd);
		border-color: var(--color-debug-border, #2196f3);
	}

	.debug-btn:hover, .reset-btn:hover {
		background: #f5f5f5;
		transform: translateY(-1px);
	}

	.chord-progress {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.chord-indicator {
		padding: 0.5rem 1rem;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		background: #f5f5f5;
		font-weight: 500;
		transition: all 0.3s;
		min-width: 80px;
		text-align: center;
	}

	.chord-indicator.active {
		border-color: #2196f3;
		background: #e3f2fd;
		color: #1976d2;
		transform: scale(1.05);
	}

	.chord-indicator.completed {
		border-color: #4caf50;
		background: #e8f5e8;
		color: #2e7d32;
	}

	.exercise-status {
		display: flex;
		gap: 2rem;
		padding: 1rem;
		background: #f8f9fa;
		border-radius: 8px;
		margin-top: 1rem;
		flex-wrap: wrap;
	}

	.current-chord, .progress, .mistakes {
		font-weight: 500;
	}

	.current-chord {
		color: #1976d2;
	}

	.completion {
		color: #28a745;
		font-weight: bold;
		animation: bounce 0.5s ease-in-out;
	}

	@keyframes bounce {
		0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
		40% { transform: translateY(-10px); }
		60% { transform: translateY(-5px); }
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

		.exercise-status {
			flex-direction: column;
			gap: 0.5rem;
		}
	}
</style>
