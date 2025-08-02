<svelte:options runes={true} />

<script lang="ts">
	import errorSoundPath from '$lib/sounds/error.mp3';
	import okSoundPath from '$lib/sounds/ok.mp3';
	import { onMount } from 'svelte';
	import DebugPanel from '../../components/DebugPanel.svelte';
	import InteractiveKeyboard from '../../components/keyboard/InteractiveKeyboard.svelte';
	import Score from '../../components/Score.svelte';
	import {
		AllChordTypes,
		AllNotes,
		chords,
		getMidiNote,
		majorScales,
		MidiToNote,
		minorScales,
		NoteToMidi,
		RequestMidiAccess,
		type ChordType,
		type MidiNote,
		type Note,
		type NoteEvent,
		type NoteFullName
	} from '../../midi/midi';
	import {
		createVirtualMidiAccess,
		setupKeyboardInput,
		type VirtualMidiInput
	} from '../../midi/virtualMidi';

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

	// State variables
	let noteEvents: NoteEvent[] = $state([]);
	let midiNotes = $derived(noteEvents.map((note) => note.noteNumber));
	let midiAccess: MIDIAccess;
	let currentExercise: Exercise | null = $state(null);
	let debugMode: boolean = $state(false);
	let virtualMidi: VirtualMidiInput | undefined = $state(undefined);
	let keyboardCleanup: (() => void) | null = $state(null);
	let correctNotes: Set<MidiNote> = $state(new Set());
	let isComplete: boolean = $state(false);
	let feedbackMessage: string = $state('');
	let score: number = $state(0);
	let totalExercises: number = $state(0);
	let currentProgressIndex: number = $state(0);

	// Audio elements
	let okSound: HTMLAudioElement;
	let errorSound: HTMLAudioElement;

	// Exercise generation functions
	function getRandomElement<T>(array: T[]): T {
		return array[Math.floor(Math.random() * array.length)];
	}

	function generateRandomExercise(): Exercise {
		const exerciseTypes: ExerciseType[] = ['chord', 'scale-major', 'scale-minor', 'ii-v-i'];
		const type = getRandomElement(exerciseTypes);
		const key = getRandomElement(AllNotes);
		const keyMiddle = (key + '4') as NoteFullName;

		switch (type) {
			case 'chord': {
				const chordType = getRandomElement(AllChordTypes);
				const inversion = getRandomElement([0, 1, 2, 3]) as 0 | 1 | 2 | 3;
				const chord = chords(NoteToMidi[keyMiddle], chordType, inversion);
				const expectedNotes = [chord.root, chord.third, chord.fifth, chord.seventh].filter(
					(n) => n != null
				) as MidiNote[];
				const scoreNotes = expectedNotes.map(
					(note) => (MidiToNote[note].slice(0, -1) + '4') as NoteFullName
				);

				return {
					type,
					key,
					chordType,
					inversion,
					description: `Play ${key} ${chordType} chord${inversion > 0 ? ` (${getInversionName(inversion)})` : ''}`,
					expectedNotes,
					scoreNotes
				};
			}
			case 'scale-major': {
				const scaleNotes = majorScales[key];
				// Take 8 notes (one octave) from the scale, ensuring we have enough notes
				const oneOctave = scaleNotes.slice(0, Math.min(8, scaleNotes.length));
				const expectedNotes = oneOctave.map(
					(note) => {
						try {
							// More robust note conversion - extract base note and add octave 4
							const baseNote = note.slice(0, -1);
							const targetNote = (baseNote + '4') as NoteFullName;
							return NoteToMidi[targetNote];
						} catch (error) {
							console.warn('Invalid note conversion:', note);
							return 60; // Default to middle C
						}
					}
				);
				const scoreNotes = oneOctave.map((note) => {
					try {
						const baseNote = note.slice(0, -1);
						return (baseNote + '4') as NoteFullName;
					} catch (error) {
						console.warn('Invalid score note conversion:', note);
						return 'C4' as NoteFullName;
					}
				});

				return {
					type,
					key,
					description: `Play ${key} major scale (ascending)`,
					expectedNotes,
					scoreNotes
				};
			}
			case 'scale-minor': {
				const scaleNotes = minorScales[key];
				// Take 8 notes (one octave) from the scale, ensuring we have enough notes
				const oneOctave = scaleNotes.slice(0, Math.min(8, scaleNotes.length));
				const expectedNotes = oneOctave.map(
					(note) => {
						try {
							// More robust note conversion - extract base note and add octave 4
							const baseNote = note.slice(0, -1);
							const targetNote = (baseNote + '4') as NoteFullName;
							return NoteToMidi[targetNote];
						} catch (error) {
							console.warn('Invalid note conversion:', note);
							return 60; // Default to middle C
						}
					}
				);
				const scoreNotes = oneOctave.map((note) => {
					try {
						const baseNote = note.slice(0, -1);
						return (baseNote + '4') as NoteFullName;
					} catch (error) {
						console.warn('Invalid score note conversion:', note);
						return 'C4' as NoteFullName;
					}
				});

				return {
					type,
					key,
					description: `Play ${key} minor scale (ascending)`,
					expectedNotes,
					scoreNotes
				};
			}
			case 'ii-v-i': {
				// Calculate ii-V-I progression
				const rootMidi = NoteToMidi[keyMiddle];
				const twoChordRoot = (rootMidi + 2) as MidiNote; // ii chord (2nd degree)
				const fiveChordRoot = (rootMidi + 7) as MidiNote; // V chord (5th degree)

				const twoChord = chords(twoChordRoot, 'min7');
				const fiveChord = chords(fiveChordRoot, '7');
				const oneChord = chords(rootMidi, 'maj7');

				// Combine all chord notes in sequence
				const allNotes = [
					...[twoChord.root, twoChord.third, twoChord.fifth, twoChord.seventh].filter(
						(n) => n != null
					),
					...[fiveChord.root, fiveChord.third, fiveChord.fifth, fiveChord.seventh].filter(
						(n) => n != null
					),
					...[oneChord.root, oneChord.third, oneChord.fifth, oneChord.seventh].filter(
						(n) => n != null
					)
				] as MidiNote[];

				const scoreNotes = allNotes.map(
					(note) => (MidiToNote[note].slice(0, -1) + '4') as NoteFullName
				);

				return {
					type,
					key,
					description: `Play ${key} ii-V-I progression (ii7 - V7 - Imaj7)`,
					expectedNotes: allNotes,
					scoreNotes
				};
			}
			default: {
				// Fallback case - return a simple C major chord
				console.warn('Unknown exercise type, falling back to C major chord');
				const chord = chords(NoteToMidi['C4'], 'major');
				const expectedNotes = [chord.root, chord.third, chord.fifth].filter(
					(n) => n != null
				) as MidiNote[];
				const scoreNotes = expectedNotes.map(
					(note) => (MidiToNote[note].slice(0, -1) + '4') as NoteFullName
				);

				return {
					type: 'chord',
					key: 'C',
					chordType: 'major',
					inversion: 0,
					description: 'Play C major chord',
					expectedNotes,
					scoreNotes
				};
			}
		}
	}

	function getInversionName(inversion: number): string {
		switch (inversion) {
			case 1:
				return '1st inversion';
			case 2:
				return '2nd inversion';
			case 3:
				return '3rd inversion';
			default:
				return 'root position';
		}
	}

	function generateNewExercise() {
		try {
			currentExercise = generateRandomExercise();
			correctNotes.clear();
			isComplete = false;
			feedbackMessage = '';
			currentProgressIndex = 0;
			noteEvents = [];
			console.log('Generated new exercise:', currentExercise);
		} catch (error) {
			console.error('Error generating new exercise:', error);
			// Fallback to a simple C major chord
			currentExercise = {
				type: 'chord',
				key: 'C',
				chordType: 'major',
				inversion: 0,
				description: 'Play C major chord (fallback)',
				expectedNotes: [60, 64, 67] as MidiNote[], // C, E, G
				scoreNotes: ['C4', 'E4', 'G4'] as NoteFullName[]
			};
			correctNotes.clear();
			isComplete = false;
			feedbackMessage = 'Using fallback exercise due to error';
			currentProgressIndex = 0;
			noteEvents = [];
		}
	}

	function checkProgress() {
		if (!currentExercise) {
			console.warn('No current exercise to check progress against');
			return;
		}

		try {
			const { expectedNotes, type } = currentExercise;

			if (!expectedNotes || expectedNotes.length === 0) {
				console.warn('No expected notes in current exercise');
				return;
			}

			if (type === 'scale-major' || type === 'scale-minor') {
				// For scales, check sequential playing
				if (currentProgressIndex < expectedNotes.length) {
					const expectedNote = expectedNotes[currentProgressIndex];
					const lastPlayedNote = midiNotes[midiNotes.length - 1];

					if (lastPlayedNote === expectedNote) {
						correctNotes.add(expectedNote);
						currentProgressIndex++;
						feedbackMessage = `Correct! Note ${currentProgressIndex}/${expectedNotes.length}`;

						if (currentProgressIndex === expectedNotes.length) {
							isComplete = true;
							feedbackMessage = 'Scale complete! Well done!';
							score++;
							okSound?.play();
							setTimeout(() => {
								generateNewExercise();
								totalExercises++;
							}, 2000);
						} else {
							okSound?.play();
						}
					} else if (midiNotes.length > 0) {
						feedbackMessage = `Try again. Expected: ${MidiToNote[expectedNote]?.slice(0, -1) || 'Unknown'}`;
						errorSound?.play();
					}
				}
			} else {
				// For chords and ii-V-I, check if all notes are played
				const playedCorrectNotes = midiNotes.filter((note) => expectedNotes.includes(note));
				correctNotes = new Set(playedCorrectNotes);

				if (correctNotes.size === expectedNotes.length) {
					isComplete = true;
					feedbackMessage = 'Perfect! All notes correct!';
					score++;
					okSound?.play();
					setTimeout(() => {
						generateNewExercise();
						totalExercises++;
					}, 2000);
				} else if (correctNotes.size > 0) {
					feedbackMessage = `Good! ${correctNotes.size}/${expectedNotes.length} correct notes`;
				} else if (midiNotes.length > 0) {
					feedbackMessage = 'Try again...';
					errorSound?.play();
				}
			}
		} catch (error) {
			console.error('Error in checkProgress:', error);
			feedbackMessage = 'Error checking progress. Try a new exercise.';
		}
	}

	// MIDI event handling
	function onMidiEvent(event: MIDIMessageEvent) {
		const noteEvent = getMidiNote(event);
		if (noteEvent) {
			if (noteEvent.type === 'on') {
				noteEvents = [...noteEvents, noteEvent];
			} else {
				noteEvents = noteEvents.filter((n) => n.noteNumber !== noteEvent.noteNumber);
			}
		}
	}

	// Calculate optimal keyboard range based on the notes we need to display
	let keyboardRange = $derived.by(() => {
		if (!currentExercise || !currentExercise.expectedNotes || currentExercise.expectedNotes.length === 0) {
			return { middleC: 60, octaves: 3 };
		}

		try {
			const notes = currentExercise.expectedNotes;
			const minNote = Math.min(...notes);
			const maxNote = Math.max(...notes);

			// Validate note range
			if (minNote < 24 || maxNote > 127 || minNote > maxNote) {
				console.warn('Invalid note range, using default');
				return { middleC: 60, octaves: 3 };
			}

			// For scales, we want to show a wider range to accommodate the full scale
			if (currentExercise.type === 'scale-major' || currentExercise.type === 'scale-minor') {
				// Show from one octave below the lowest note to one octave above
				const minC = Math.floor((minNote - 12) / 12) * 12;
				const maxC = Math.ceil((maxNote + 12) / 12) * 12 + 12;
				const totalRange = maxC - minC;
				const octaves = Math.max(3, Math.ceil(totalRange / 12));
				const middleC = minC + Math.floor((octaves * 12) / 2) - 6;

				return {
					middleC: Math.max(24, middleC),
					octaves: Math.min(6, octaves)
				};
			} else {
				// For chords and progressions, show a range that encompasses all notes
				const minC = Math.floor((minNote - 6) / 12) * 12; // Start a bit before lowest note
				const maxC = Math.ceil((maxNote + 6) / 12) * 12 + 12; // End a bit after highest note
				const totalRange = maxC - minC;
				const octaves = Math.max(2, Math.ceil(totalRange / 12));
				const middleC = minC + Math.floor((octaves * 12) / 2) - 6;

				return {
					middleC: Math.max(24, middleC),
					octaves: Math.min(5, octaves)
				};
			}
		} catch (error) {
			console.error('Error calculating keyboard range:', error);
			return { middleC: 60, octaves: 3 };
		}
	});

	// Watch for changes in midiNotes to check progress
	$effect(() => {
		checkProgress();
	});

	function toggleDebugMode() {
		debugMode = !debugMode;

		if (debugMode && !virtualMidi) {
			// Setup virtual MIDI
			const virtualAccess = createVirtualMidiAccess('Virtual Debug Keyboard');
			virtualMidi = virtualAccess.getVirtualInput();

			// Setup computer keyboard input
			keyboardCleanup = setupKeyboardInput(virtualMidi);

			// Connect virtual MIDI to the same event handler
			const virtualInput = Array.from(virtualAccess.inputs.values())[0];
			if (virtualInput) {
				virtualInput.onmidimessage = onMidiEvent;
			}
		} else if (!debugMode && keyboardCleanup) {
			// Cleanup
			keyboardCleanup();
			keyboardCleanup = null;
			if (virtualMidi) {
				virtualMidi.releaseAllKeys();
			}
		}
	}

	onMount(async () => {
		// Initialize audio
		okSound = new Audio(okSoundPath);
		errorSound = new Audio(errorSoundPath);

		// Setup MIDI
		try {
			midiAccess = await RequestMidiAccess();
			const inputs = midiAccess.inputs.values();
			for (const input of inputs) {
				input.onmidimessage = onMidiEvent;
			}
		} catch (error) {
			console.warn('MIDI not available:', error);
		}

		// Generate first exercise
		generateNewExercise();
	});

	// Derived values for display
	let pressedNotes = $derived(midiNotes);
</script>

<svelte:head>
	<title>Random Jazz Exercises</title>
	<meta
		name="description"
		content="Random jazz theory exercises combining chords, scales, and progressions"
	/>
</svelte:head>

<div class="container">
	<h1>🎲 Random Jazz Exercises</h1>

	<div class="stats">
		<div class="stat">
			<span class="stat-label">Score:</span>
			<span class="stat-value">{score}/{totalExercises || 1}</span>
		</div>
		<div class="stat">
			<span class="stat-label">Accuracy:</span>
			<span class="stat-value"
				>{totalExercises > 0 ? Math.round((score / totalExercises) * 100) : 0}%</span
			>
		</div>
	</div>

	{#if currentExercise}
		<div class="exercise-info">
			<h2>{currentExercise.description}</h2>
			<div class="exercise-type">
				Type: <span class="type-badge type-{currentExercise.type}"
					>{currentExercise.type.replace('-', ' ')}</span
				>
			</div>
		</div>

		<div class="score-container">
			<Score
				selectedNote={currentExercise.key}
				leftHand={[currentExercise.scoreNotes]}
				rightHand={[]}
			/>
		</div>

		<!-- Show hint keyboard for chords and progressions after some attempts -->
		{#if (currentExercise.type === 'chord' || currentExercise.type === 'ii-v-i') && (feedbackMessage.includes('Try again') || correctNotes.size > 0)}
			<div class="hint-container keyboard-hint">
				<h3>💡 Hint: Expected Notes</h3>
				<InteractiveKeyboard
					midiNotes={currentExercise.expectedNotes}
					middleC={keyboardRange.middleC}
					octaves={keyboardRange.octaves}
					{virtualMidi}
					{debugMode}
				/>
			</div>
		{/if}

		<div class="keyboard-container">
			<h3>Your Input</h3>
			<InteractiveKeyboard
				midiNotes={pressedNotes}
				middleC={keyboardRange.middleC}
				octaves={keyboardRange.octaves}
				{virtualMidi}
				{debugMode}
			/>
		</div>

		<div class="feedback">
			{#if feedbackMessage}
				<div
					class="feedback-message"
					class:success={isComplete}
					class:error={feedbackMessage.includes('Try again')}
				>
					{feedbackMessage}
				</div>
			{/if}
		</div>

		<div class="progress-info">
			{#if currentExercise.type === 'scale-major' || currentExercise.type === 'scale-minor'}
				<div class="scale-progress">
					<div class="progress-bar">
						<div
							class="progress-fill"
							style="width: {(currentProgressIndex / currentExercise.expectedNotes.length) * 100}%"
						></div>
					</div>
					<span class="progress-text"
						>{currentProgressIndex}/{currentExercise.expectedNotes.length} notes</span
					>
				</div>
			{:else}
				<div class="chord-progress">
					<span class="progress-text"
						>{correctNotes.size}/{currentExercise.expectedNotes.length} notes correct</span
					>
					<div class="notes-status">
						{#each currentExercise.expectedNotes as note}
							<span class="note-indicator" class:played={correctNotes.has(note)}>
								{MidiToNote[note].slice(0, -1)}
							</span>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<div class="controls">
		<button onclick={generateNewExercise} class="btn btn-primary"> 🎲 New Exercise </button>

		<button onclick={toggleDebugMode} class="btn btn-secondary">
			{debugMode ? '⌨️ Disable' : '⌨️ Enable'} Computer Keyboard
		</button>
	</div>

	{#if debugMode}
		<DebugPanel {virtualMidi} {debugMode} onToggleDebugMode={toggleDebugMode} />
	{/if}
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		text-align: center;
		color: var(--color-theme-1);
		margin-bottom: 2rem;
		font-size: 2.5rem;
	}

	.stats {
		display: flex;
		justify-content: center;
		gap: 2rem;
		margin-bottom: 2rem;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 8px;
	}

	.stat {
		text-align: center;
	}

	.stat-label {
		display: block;
		font-size: 0.9rem;
		color: var(--color-text);
		opacity: 0.8;
	}

	.stat-value {
		display: block;
		font-size: 1.8rem;
		font-weight: bold;
		color: var(--color-theme-1);
	}

	.exercise-info {
		text-align: center;
		margin-bottom: 2rem;
	}

	.exercise-info h2 {
		color: var(--color-theme-2);
		margin-bottom: 1rem;
		font-size: 1.8rem;
	}

	.exercise-type {
		font-size: 1.1rem;
		color: var(--color-text);
	}

	.type-badge {
		padding: 0.3rem 0.8rem;
		border-radius: 20px;
		font-weight: bold;
		text-transform: capitalize;
	}

	.type-chord {
		background: #ff6b6b;
		color: white;
	}
	.type-scale-major {
		background: #4ecdc4;
		color: white;
	}
	.type-scale-minor {
		background: #45b7d1;
		color: white;
	}
	.type-ii-v-i {
		background: #f9ca24;
		color: #333;
	}

	.score-container {
		margin: 2rem 0;
		display: flex;
		justify-content: center;
	}

	.keyboard-container {
		margin: 2rem 0;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.keyboard-container h3 {
		margin-bottom: 1rem;
		color: var(--color-theme-2);
	}

	.hint-container {
		margin: 1.5rem 0;
		padding: 1.5rem;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.hint-container h3 {
		margin-bottom: 1rem;
		color: var(--color-theme-1);
		text-align: center;
	}

	.feedback {
		text-align: center;
		margin: 1rem 0;
		min-height: 2rem;
	}

	.feedback-message {
		padding: 0.8rem 1.5rem;
		border-radius: 8px;
		font-weight: bold;
		font-size: 1.1rem;
		display: inline-block;
	}

	.feedback-message.success {
		background: #d4edda;
		color: #155724;
		border: 1px solid #c3e6cb;
	}

	.feedback-message.error {
		background: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
	}

	.progress-info {
		margin: 2rem 0;
		text-align: center;
	}

	.progress-bar {
		width: 300px;
		height: 8px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 4px;
		margin: 0 auto 0.5rem;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--color-theme-1);
		transition: width 0.3s ease;
		border-radius: 4px;
	}

	.progress-text {
		font-size: 1.1rem;
		color: var(--color-text);
		font-weight: bold;
	}

	.notes-status {
		margin-top: 1rem;
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.note-indicator {
		padding: 0.3rem 0.6rem;
		border-radius: 4px;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		font-weight: bold;
		transition: all 0.3s ease;
	}

	.note-indicator.played {
		background: var(--color-theme-1);
		color: white;
		border-color: var(--color-theme-1);
	}

	.controls {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin: 2rem 0;
	}

	.btn {
		padding: 1rem 2rem;
		font-size: 1.1rem;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-weight: bold;
		transition: all 0.3s ease;
	}

	.btn-primary {
		background: var(--color-theme-1);
		color: white;
	}

	.btn-primary:hover {
		background: var(--color-theme-2);
		transform: translateY(-2px);
	}

	.btn-secondary {
		background: rgba(255, 255, 255, 0.1);
		color: var(--color-text);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.btn-secondary:hover {
		background: rgba(255, 255, 255, 0.2);
		transform: translateY(-2px);
	}

	@media (max-width: 768px) {
		.container {
			padding: 1rem;
		}

		h1 {
			font-size: 2rem;
		}

		.stats {
			flex-direction: column;
			gap: 1rem;
		}

		.controls {
			flex-direction: column;
			align-items: center;
		}

		.btn {
			width: 100%;
			max-width: 300px;
		}
	}
</style>
