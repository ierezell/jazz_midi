<svelte:options runes={true} />

<script lang="ts">
	import { onMount } from 'svelte';
	import BaseExercise from '../../components/BaseExercise.svelte';
	import { audioManager } from '../../lib/managers/AudioManager';
	import { midiManager } from '../../lib/managers/MIDIManager';
	import { userStatsService } from '../../lib/services/UserStatsService';
	import type {
		BaseExerciseState,
		MidiNote,
		Note,
		NoteEvent,
		NoteFullName,
		ChordType
	} from '$lib/types';
	import {
		AllChordTypes,
		AllNotes,
		chords,
		majorScales,
		minorScales,
		NoteToMidi,
		midiNoteToNoteName,
		MusicTheoryUtils,
		type ChordToneInfo
	} from '$lib/core';

	// Exercise types
	type ExerciseType = 'chord' | 'scale-major' | 'scale-minor' | 'ii-v-i';

	interface Exercise {
		type: ExerciseType;
		key: Note;
		chordType?: ChordType;
		inversion?: 0 | 1 | 2 | 3;
		description: string;
		expectedNotes: MidiNote[];
		scoreNotes: NoteFullName[];
	}

	// ===== STATE =====
	let noteEvents: NoteEvent[] = $state([]);
	let currentExercise: Exercise | null = $state(null);
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
	let expectedNotes = $derived(currentExercise?.expectedNotes || []);

	let chordToneMapping = $derived.by((): ChordToneInfo[] => {
		if (!currentExercise || currentExercise.type !== 'chord') return [];
		const rootNote = (currentExercise.key + '4') as NoteFullName;
		const rootMidi = NoteToMidi[rootNote];
		const chord = chords(
			rootMidi,
			currentExercise.chordType || 'maj7',
			currentExercise.inversion || 0
		);
		return MusicTheoryUtils.Chord.createChordToneMapping(chord, rootMidi, currentExercise.chordType || 'maj7', currentExercise.inversion || 0);
	});

	// Exercise state for BaseExercise
	let exerciseState = $derived.by((): BaseExerciseState => {
		return {
			selectedNote: currentExercise?.key || 'C',
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

	// Score properties
	let scoreProps = $derived({
		notes: currentExercise?.scoreNotes || [],
		highlightedNotes: currentNotes.map((note) => midiNoteToNoteName(note as MidiNote)),
		title: currentExercise?.description || 'Random Exercise'
	});

	// ===== FUNCTIONS =====

	function generateRandomExercise(): Exercise {
		const types: ExerciseType[] = ['chord', 'scale-major', 'scale-minor', 'ii-v-i'];
		const type = types[Math.floor(Math.random() * types.length)];
		const key = AllNotes[Math.floor(Math.random() * AllNotes.length)];

		return createExercise(type, key);
	}

	function createExercise(type: ExerciseType, key: Note): Exercise {
		switch (type) {
			case 'chord': {
				const chordType = AllChordTypes[Math.floor(Math.random() * AllChordTypes.length)];
				const inversion = Math.floor(Math.random() * 4) as 0 | 1 | 2 | 3;

				const rootNote = (key + '4') as NoteFullName;
				const rootMidi = NoteToMidi[rootNote];
				const chord = chords(rootMidi, chordType, inversion);

				const expectedNotes = [chord.root, chord.third, chord.fifth, chord.seventh].filter(
					(n) => n != null
				) as MidiNote[];
				const scoreNotes = expectedNotes.map((note) =>
					midiNoteToNoteName(note as MidiNote)
				) as NoteFullName[];

				return {
					type,
					key,
					chordType,
					inversion,
					description: `${key}${chordType}${inversion > 0 ? ` (${inversion}st inversion)` : ''}`,
					expectedNotes,
					scoreNotes
				};
			}
			case 'scale-major': {
				const scaleNotes = majorScales[key];
				const middleOctaveNotes = Array.from(
					new Set(scaleNotes.map((note) => note.slice(0, -1) as Note))
				);
				const middleKeyboard = middleOctaveNotes.map((note) => (note + '4') as NoteFullName);
				const expectedNotes = middleKeyboard.map((note) => NoteToMidi[note]);

				return {
					type,
					key,
					description: `${key} Major Scale`,
					expectedNotes,
					scoreNotes: middleKeyboard
				};
			}
			case 'scale-minor': {
				const scaleNotes = minorScales[key];
				const middleOctaveNotes = Array.from(
					new Set(scaleNotes.map((note) => note.slice(0, -1) as Note))
				);
				const middleKeyboard = middleOctaveNotes.map((note) => (note + '4') as NoteFullName);
				const expectedNotes = middleKeyboard.map((note) => NoteToMidi[note]);

				return {
					type,
					key,
					description: `${key} Minor Scale`,
					expectedNotes,
					scoreNotes: middleKeyboard
				};
			}
			case 'ii-v-i': {
				const rootMidi = NoteToMidi[(key + '4') as NoteFullName];
				const twoChord = chords((rootMidi + 2) as MidiNote, 'min7');
				const fiveChord = chords((rootMidi + 7) as MidiNote, '7');
				const oneChord = chords(rootMidi, 'maj7');

				const allNotes = [
					...[twoChord.root, twoChord.third, twoChord.fifth, twoChord.seventh],
					...[fiveChord.root, fiveChord.third, fiveChord.fifth, fiveChord.seventh],
					...[oneChord.root, oneChord.third, oneChord.fifth, oneChord.seventh]
				].filter((n) => n != null) as MidiNote[];

				const scoreNotes = allNotes.map((note) =>
					midiNoteToNoteName(note as MidiNote)
				) as NoteFullName[];

				return {
					type,
					key,
					description: `${key} ii-V-I Progression`,
					expectedNotes: allNotes,
					scoreNotes
				};
			}
			default:
				throw new Error(`Unknown exercise type: ${type}`);
		}
	}

	function handleNoteSelect(note: Note) {
		// Note selection not applicable in random mode
		console.log('Note selection not supported in random exercise mode');
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
		feedbackMessage = '';
		startTime = Date.now();
		midiManager.resetExercise();
	}

	function generateNewExercise() {
		currentExercise = generateRandomExercise();
		resetExercise();
	}

	function onMidiEvent(event: NoteEvent) {
		if (!currentExercise) return;

		noteEvents = [event, ...noteEvents.slice(0, 9)];

		if (event.type === 'on') {
			if (expectedNotes.includes(event.noteNumber)) {
				const activeCorrect = noteEvents
					.filter((e) => e.type === 'on')
					.filter((e) => expectedNotes.includes(e.noteNumber));

				if (activeCorrect.length === expectedNotes.length) {
					completed = true;
					feedbackMessage = getSuccessMessage();
					audioManager.playSuccess();

					// Track progress
					const timeSpent = (Date.now() - startTime) / 1000;
					const accuracy = Math.round(
						(expectedNotes.length / (expectedNotes.length + mistakes)) * 100
					);
					userStatsService.updateNoteProgress(
						currentExercise.key,
						currentExercise.type.startsWith('scale')
							? 'scale'
							: currentExercise.type === 'ii-v-i'
								? 'progression'
								: 'chord',
						currentExercise.chordType,
						true,
						timeSpent,
						accuracy
					);
				} else {
					feedbackMessage = `Good! ${activeCorrect.length}/${expectedNotes.length}`;
				}
			} else {
				mistakes++;
				feedbackMessage = 'Wrong note!';
				audioManager.playError();
			}
		}
	}

	function getSuccessMessage(): string {
		if (!currentExercise) return 'Excellent! 🎵';

		switch (currentExercise.type) {
			case 'chord':
				return `Perfect ${currentExercise.description} chord! 🎹`;
			case 'scale-major':
			case 'scale-minor':
				return `Excellent ${currentExercise.description}! 🎵`;
			case 'ii-v-i':
				return `Great ${currentExercise.description}! 🎵✨`;
			default:
				return 'Excellent! 🎵';
		}
	}

	// ===== LIFECYCLE =====
	onMount(() => {
		currentExercise = generateRandomExercise();
		midiManager.connect(onMidiEvent);
		audioManager.initialize();

		return () => {
			midiManager.disconnect();
		};
	});
</script>

<div class="random-exercise">
	{#if currentExercise}
		<BaseExercise
			{exerciseState}
			exerciseTitle="Random Exercise"
			exerciseDescription={currentExercise.description}
			{expectedNotes}
			{scoreProps}
			keyboardProps={{
				chordToneInfo: chordToneMapping,
				showChordTones: currentExercise.type === 'chord'
			}}
			onNoteSelect={handleNoteSelect}
			onDebugToggle={toggleDebug}
			onReset={resetExercise}
			customControls={true}
		>
			<!-- Custom controls for random exercise -->
			<div class="random-controls">
				<div class="control-group">
					<button onclick={toggleDebug} class="debug-btn">
						{debugMode ? 'Disable' : 'Enable'} Debug Mode
					</button>
					<button onclick={resetExercise} class="reset-btn">Reset</button>
					<button onclick={generateNewExercise} class="new-exercise-btn">New Exercise</button>
				</div>
			</div>

			<!-- Custom status display -->
			<div class="exercise-status">
				<div class="exercise-type">
					Type: {currentExercise.type}
				</div>
				<div class="exercise-key">
					Key: {currentExercise.key}
				</div>
				<div class="progress">
					Progress: {Math.round(
						(currentNotes.filter((n) => expectedNotes.includes(n)).length / expectedNotes.length) *
							100
					)}%
				</div>
				<div class="mistakes">
					Mistakes: {mistakes}
				</div>
				{#if completed}
					<div class="completion">🎉 Exercise Completed!</div>
				{/if}
			</div>
		</BaseExercise>
	{:else}
		<div class="loading">Generating random exercise...</div>
	{/if}
</div>

<style>
	.random-exercise {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		font-family: system-ui, sans-serif;
	}

	.random-controls {
		display: flex;
		gap: 2rem;
		margin-bottom: 1rem;
		align-items: center;
	}

	.control-group {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.debug-btn,
	.reset-btn,
	.new-exercise-btn {
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

	.new-exercise-btn {
		background: #e8f5e8;
		border-color: #4caf50;
		font-weight: 500;
	}

	.debug-btn:hover,
	.reset-btn:hover,
	.new-exercise-btn:hover {
		background: #f5f5f5;
		transform: translateY(-1px);
	}

	.new-exercise-btn:hover {
		background: #d4f4d4;
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

	.exercise-type,
	.exercise-key,
	.progress,
	.mistakes {
		font-weight: 500;
	}

	.exercise-type {
		color: #6c757d;
		text-transform: capitalize;
	}

	.exercise-key {
		color: #495057;
	}

	.completion {
		color: #28a745;
		font-weight: bold;
		animation: bounce 0.5s ease-in-out;
	}

	.loading {
		text-align: center;
		padding: 4rem;
		color: #6c757d;
		font-size: 1.2rem;
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
		.random-exercise {
			padding: 1rem;
		}

		.random-controls {
			flex-direction: column;
			gap: 1rem;
		}

		.exercise-status {
			flex-direction: column;
			gap: 0.5rem;
		}
	}
</style>
