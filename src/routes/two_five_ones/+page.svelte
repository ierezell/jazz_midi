<svelte:options runes={true} />

<script lang="ts">
	import errorSoundPath from '$lib/sounds/error.mp3';
	import okSoundPath from '$lib/sounds/ok.mp3';
	import { onMount } from 'svelte';
	import DebugPanel from '../../components/DebugPanel.svelte';
	import InteractiveKeyboard from '../../components/keyboard/InteractiveKeyboard.svelte';
	import Score from '../../components/Score.svelte';
	import {
		AllNotes,
		chords,
		getMidiNote,
		MidiToNote,
		NoteToMidi,
		RequestMidiAccess,
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

	let noteEvents: NoteEvent[] = $state([]);
	let midiNotes = $derived(noteEvents.map((note) => note.noteNumber));
	let midiAccess: MIDIAccess;
	let selectedNote: Note = $state('C');
	let currentChordIndex: number = $state(0);
	let errorCount: number = $state(0);
	let showNoteNames: boolean = $derived(errorCount >= 3);
	let showKeyboard: boolean = $derived(errorCount >= 6);
	let debugMode: boolean = $state(false);
	let virtualMidi: VirtualMidiInput | undefined = undefined;
	let keyboardCleanup: (() => void) | null = null;

	// Two-five-one progression in the selected key
	let selectedNoteMiddleKey = $derived(selectedNote + '4') as NoteFullName;

	// Calculate ii-V-I chords
	let twoChordRoot = $derived(NoteToMidi[selectedNoteMiddleKey] + 2); // ii chord (2nd degree)
	let fiveChordRoot = $derived(NoteToMidi[selectedNoteMiddleKey] + 7); // V chord (5th degree)
	let oneChordRoot = $derived(NoteToMidi[selectedNoteMiddleKey]); // I chord (root)

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

	// Generate chords for the progression
	let twoChord = $derived(chords(twoChordRoot as MidiNote, 'min7'));
	let fiveChord = $derived(chords(fiveChordRoot as MidiNote, '7'));
	let oneChord = $derived(chords(oneChordRoot as MidiNote, 'maj7'));

	let progression = $derived([
		{
			name: 'ii7',
			chord: twoChord,
			notes: [twoChord.root, twoChord.third, twoChord.fifth, twoChord.seventh].filter(
				(n) => n != null
			),
			noteNames: [twoChord.root, twoChord.third, twoChord.fifth, twoChord.seventh]
				.filter((n) => n != null)
				.map((note) => (MidiToNote[note].slice(0, -1) + '4') as NoteFullName)
		},
		{
			name: 'V7',
			chord: fiveChord,
			notes: [fiveChord.root, fiveChord.third, fiveChord.fifth, fiveChord.seventh].filter(
				(n) => n != null
			),
			noteNames: [fiveChord.root, fiveChord.third, fiveChord.fifth, fiveChord.seventh]
				.filter((n) => n != null)
				.map((note) => (MidiToNote[note].slice(0, -1) + '4') as NoteFullName)
		},
		{
			name: 'Imaj7',
			chord: oneChord,
			notes: [oneChord.root, oneChord.third, oneChord.fifth, oneChord.seventh].filter(
				(n) => n != null
			),
			noteNames: [oneChord.root, oneChord.third, oneChord.fifth, oneChord.seventh]
				.filter((n) => n != null)
				.map((note) => (MidiToNote[note].slice(0, -1) + '4') as NoteFullName)
		}
	]);

	let currentChord = $derived(progression[currentChordIndex]);
	let noteBuffer: MidiNote[] = [];
	let feedbackMessage: string = $state('');

	let errorSound: HTMLAudioElement | null = null;
	let okSound: HTMLAudioElement | null = null;

	function onMidiEvent(midiEvent: MIDIMessageEvent) {
		const note = getMidiNote(midiEvent);

		// Skip non-note events
		if (!note) {
			return;
		}

		if (note.type === 'on') {
			noteEvents = [note, ...noteEvents];
			noteBuffer.push(note.noteNumber);
			noteBuffer = [...new Set(noteBuffer)];

			if (noteBuffer.every((n) => currentChord.notes.includes(n))) {
				if (noteBuffer.length === currentChord.notes.length) {
					if (currentChordIndex === 2) {
						// Completed the progression
						feedbackMessage = 'Amazing! You completed the ii-V-I progression! 🎉';
						currentChordIndex = 0;
						errorCount = 0;
					} else {
						feedbackMessage = `Great! Moving to ${progression[currentChordIndex + 1].name}`;
						currentChordIndex++;
					}
					if (okSound) {
						okSound.play();
					}
					noteBuffer = [];
				} else {
					feedbackMessage = `Good! ${currentChord.notes.length - noteBuffer.length} more note${currentChord.notes.length - noteBuffer.length > 1 ? 's' : ''} for ${currentChord.name}`;
				}
			} else {
				errorCount++;
				feedbackMessage = `Incorrect notes for ${currentChord.name}. Try again! (Attempt ${errorCount})`;
				if (errorSound) {
					errorSound.play();
				}
				noteBuffer = [];
			}
		} else {
			noteEvents = noteEvents.filter((n) => n.noteFullName !== note.noteFullName);
		}
	}

	function resetExercise() {
		errorCount = 0;
		noteBuffer = [];
		feedbackMessage = '';
		noteEvents = [];
		currentChordIndex = 0;
	}

	onMount(async () => {
		errorSound = new Audio(errorSoundPath);
		errorSound.volume = 0.5;
		errorSound.loop = false;
		okSound = new Audio(okSoundPath);
		okSound.volume = 0.5;
		okSound.loop = false;
		try {
			midiAccess = await RequestMidiAccess();
			console.log('Two-Five-One MIDI Access obtained:', midiAccess);
			const inputs = midiAccess.inputs;
			inputs.forEach((input) => {
				input.onmidimessage = onMidiEvent;
			});
		} catch (error) {
			console.error('Failed to obtain MIDI Access:', error);
		}
	});
</script>

<svelte:head>
	<title>Two Five Ones</title>
	<meta name="description" content="Practice jazz ii-V-I progressions" />
</svelte:head>

<main>
	<!-- Debug Panel -->
	{#if debugMode}
		<DebugPanel {virtualMidi} {debugMode} onToggleDebugMode={toggleDebugMode} />
	{/if}

	<div class="page-header">
		<h1>ii-V-I Progressions</h1>
		<p class="subtitle">
			Practice the fundamental jazz chord progression{debugMode
				? ' with computer keyboard controls'
				: ''}
		</p>
		{#if !debugMode}
			<button onclick={toggleDebugMode} class="debug-toggle"> 🎹 Enable Computer Keyboard </button>
			<p class="keyboard-hint">Connect a MIDI keyboard or enable computer keyboard to play</p>
		{:else}
			<div class="keyboard-instructions">
				<p><strong>🎹 Computer Keyboard Controls Active!</strong></p>
				<p>
					Use your computer keyboard to play: <kbd>Z</kbd><kbd>X</kbd><kbd>C</kbd><kbd>V</kbd><kbd
						>B</kbd
					><kbd>N</kbd><kbd>M</kbd> for white keys
				</p>
				<p>
					<kbd>S</kbd><kbd>D</kbd><kbd>G</kbd><kbd>H</kbd><kbd>J</kbd> for black keys •
					<kbd>Q</kbd><kbd>W</kbd><kbd>E</kbd><kbd>R</kbd><kbd>T</kbd> for higher octave
				</p>
			</div>
		{/if}
	</div>

	<div class="controls-container">
		<div class="control-group">
			<label for="note-select">Key:</label>
			<select id="note-select" bind:value={selectedNote} onchange={resetExercise}>
				<option value="">--Choose a Key--</option>
				{#each AllNotes as note}
					<option value={note}>{note} Major</option>
				{/each}
			</select>
		</div>

		<button class="reset-btn" onclick={resetExercise}>Reset Progression</button>
	</div>

	{#if selectedNote}
		<div class="exercise-container">
			<div class="progression-display">
				<h2 class="progression-name">{selectedNote} Major ii-V-I</h2>
				<div class="chord-progression">
					{#each progression as chord, index}
						<div
							class="chord-step"
							class:active={index === currentChordIndex}
							class:completed={index < currentChordIndex}
						>
							<div class="chord-roman">{chord.name}</div>
							<div class="chord-symbol">
								{MidiToNote[chord.notes[0]].slice(0, -1)}{chord.name === 'ii7'
									? 'm7'
									: chord.name === 'V7'
										? '7'
										: 'maj7'}
							</div>
						</div>
						{#if index < progression.length - 1}
							<div class="arrow">→</div>
						{/if}
					{/each}
				</div>
			</div>

			<div class="current-chord-display">
				<h3>Current Chord: <span class="chord-highlight">{currentChord.name}</span></h3>
			</div>

			<!-- Always show the score -->
			<div class="score-container">
				<h3>Musical Score - Current Chord</h3>
				<Score
					selectedNote={MidiToNote[currentChord.notes[0]].slice(0, -1) as Note}
					leftHand={[currentChord.noteNames.map((note) => note.replace('4', '3') as NoteFullName)]}
					rightHand={[currentChord.noteNames]}
				/>
			</div>

			<!-- Show note names after 3 mistakes -->
			{#if showNoteNames}
				<div class="hint-container note-names-hint">
					<h3>💡 Hint: Note Names for {currentChord.name}</h3>
					<div class="note-names">
						{#each currentChord.noteNames as note}
							<span class="note-name">{note.slice(0, -1)}</span>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Show keyboard after 6 mistakes -->
			{#if showKeyboard}
				<div class="hint-container keyboard-hint">
					<h3>💡 Hint: Keyboard Reference for {currentChord.name}</h3>
					<InteractiveKeyboard
						midiNotes={currentChord.notes}
						middleC={NoteToMidi[selectedNoteMiddleKey] + 11}
						octaves={2}
						{virtualMidi}
						{debugMode}
					/>
				</div>
			{/if}

			<!-- Your input visualization -->
			<div class="input-container">
				<h3>Your Input</h3>
				<InteractiveKeyboard
					{midiNotes}
					middleC={NoteToMidi[selectedNoteMiddleKey] + 11}
					octaves={2}
					{virtualMidi}
					{debugMode}
				/>
			</div>

			{#if feedbackMessage}
				<div
					class="feedback-container"
					class:success={feedbackMessage.includes('Amazing') || feedbackMessage.includes('Great!')}
					class:error={feedbackMessage.includes('Incorrect')}
				>
					<p class="feedback-message">{feedbackMessage}</p>
					{#if errorCount > 0 && !feedbackMessage.includes('Amazing') && !feedbackMessage.includes('Great!')}
						<p class="error-count">Mistakes: {errorCount}/6 (hints unlock at 3 and 6 mistakes)</p>
					{/if}
				</div>
			{/if}
		</div>
	{:else}
		<div class="placeholder-container">
			<p>Please select a key to begin practicing ii-V-I progressions.</p>
		</div>
	{/if}
</main>

<style>
	main {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		min-height: calc(100vh - 8rem);
	}

	.page-header {
		text-align: center;
		margin-bottom: 2rem;
		padding-bottom: 1rem;
		border-bottom: 2px solid var(--color-theme-2);
	}

	.page-header h1 {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
		color: var(--color-theme-2);
		font-weight: 600;
	}

	.subtitle {
		font-size: 1.1rem;
		color: var(--color-text);
		opacity: 0.8;
		margin: 0;
	}

	.controls-container {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		justify-content: center;
		align-items: center;
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: rgba(255, 255, 255, 0.6);
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-width: 150px;
	}

	.control-group label {
		font-weight: 600;
		color: var(--color-theme-2);
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	select {
		padding: 0.75rem 1rem;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		background: white;
		font-size: 1rem;
		transition: all 0.2s ease;
		cursor: pointer;
	}

	select:hover {
		border-color: var(--color-theme-2);
	}

	select:focus {
		outline: none;
		border-color: var(--color-theme-1);
		box-shadow: 0 0 0 3px rgba(255, 62, 0, 0.1);
	}

	.reset-btn {
		padding: 0.75rem 1.5rem;
		background: var(--color-theme-1);
		color: white;
		border: none;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.reset-btn:hover {
		background: #e63600;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(255, 62, 0, 0.3);
	}

	.exercise-container {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.progression-display {
		text-align: center;
		padding: 1.5rem;
		background: linear-gradient(135deg, var(--color-theme-1), var(--color-theme-2));
		border-radius: 12px;
		margin-bottom: 1rem;
	}

	.progression-name {
		font-size: 2.5rem;
		font-weight: 700;
		color: white;
		margin-bottom: 1rem;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
	}

	.chord-progression {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.chord-step {
		background: rgba(255, 255, 255, 0.2);
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-radius: 12px;
		padding: 1rem;
		min-width: 100px;
		transition: all 0.3s ease;
		backdrop-filter: blur(5px);
	}

	.chord-step.active {
		background: rgba(255, 255, 255, 0.9);
		border-color: white;
		transform: scale(1.1);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
	}

	.chord-step.completed {
		background: rgba(76, 175, 80, 0.8);
		border-color: #4caf50;
	}

	.chord-roman {
		font-size: 1.5rem;
		font-weight: 700;
		color: white;
		margin-bottom: 0.5rem;
	}

	.chord-step.active .chord-roman {
		color: var(--color-theme-2);
	}

	.chord-symbol {
		font-size: 1rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.9);
	}

	.chord-step.active .chord-symbol {
		color: var(--color-theme-1);
	}

	.arrow {
		font-size: 2rem;
		color: white;
		font-weight: bold;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
	}

	.current-chord-display {
		text-align: center;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.8);
		border-radius: 12px;
		border: 2px solid var(--color-theme-1);
	}

	.current-chord-display h3 {
		margin: 0;
		font-size: 1.5rem;
		color: var(--color-theme-2);
	}

	.chord-highlight {
		color: var(--color-theme-1);
		font-weight: 700;
	}

	.score-container,
	.input-container {
		background: rgba(255, 255, 255, 0.8);
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.score-container h3,
	.input-container h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		color: var(--color-theme-2);
		font-weight: 600;
		text-align: center;
		font-size: 1.3rem;
	}

	.hint-container {
		background: rgba(255, 248, 220, 0.9);
		border: 2px solid #ffd700;
		border-radius: 12px;
		padding: 1.5rem;
		animation: fadeIn 0.5s ease-in;
	}

	.hint-container h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		color: #b8860b;
		font-weight: 600;
		text-align: center;
		font-size: 1.2rem;
	}

	.note-names {
		display: flex;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.note-name {
		background: var(--color-theme-2);
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		font-weight: 600;
		font-size: 1.2rem;
		min-width: 2.5rem;
		text-align: center;
	}

	.feedback-container {
		text-align: center;
		padding: 1.5rem;
		border-radius: 12px;
		margin-top: 1rem;
		transition: all 0.3s ease;
	}

	.feedback-container.success {
		background: rgba(76, 175, 80, 0.1);
		border: 2px solid #4caf50;
	}

	.feedback-container.error {
		background: rgba(244, 67, 54, 0.1);
		border: 2px solid #f44336;
	}

	.feedback-message {
		font-size: 1.3rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.feedback-container.success .feedback-message {
		color: #2e7d32;
	}

	.feedback-container.error .feedback-message {
		color: #c62828;
	}

	.error-count {
		font-size: 0.9rem;
		opacity: 0.8;
		margin: 0;
	}

	.placeholder-container {
		text-align: center;
		padding: 3rem;
		background: rgba(255, 255, 255, 0.6);
		border-radius: 12px;
		border: 2px dashed #ccc;
	}

	.placeholder-container p {
		font-size: 1.2rem;
		color: var(--color-text);
		margin: 0;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 768px) {
		main {
			padding: 0.5rem;
		}

		.page-header h1 {
			font-size: 1.8rem;
		}

		.subtitle {
			font-size: 1rem;
		}

		.controls-container {
			flex-direction: column;
			gap: 1rem;
			padding: 1rem;
		}

		.control-group {
			width: 100%;
			max-width: 200px;
		}

		.progression-name {
			font-size: 1.5rem;
		}

		.chord-progression {
			flex-direction: column;
			gap: 0.5rem;
		}

		.chord-step {
			min-width: auto;
			width: 100%;
			max-width: 150px;
		}

		.arrow {
			transform: rotate(90deg);
			font-size: 1.5rem;
		}

		.note-names {
			gap: 0.5rem;
			justify-content: center;
		}

		.note-name {
			min-width: 2rem;
			font-size: 1rem;
			padding: 0.4rem 0.8rem;
		}

		.feedback-message {
			font-size: 1.1rem;
		}

		.score-container,
		.input-container,
		.hint-container {
			padding: 1rem;
		}

		.score-container h3,
		.input-container h3 {
			font-size: 1.1rem;
		}

		.hint-container h3 {
			font-size: 1rem;
		}
	}

	@media (max-width: 480px) {
		main {
			padding: 0.25rem;
		}

		.page-header {
			margin-bottom: 1rem;
			padding-bottom: 0.5rem;
		}

		.page-header h1 {
			font-size: 1.5rem;
		}

		.subtitle {
			font-size: 0.9rem;
		}

		.controls-container {
			padding: 0.75rem;
			gap: 0.75rem;
		}

		.progression-name {
			font-size: 1.2rem;
		}

		.chord-step {
			padding: 0.75rem;
		}

		.chord-roman {
			font-size: 1.2rem;
		}

		.chord-symbol {
			font-size: 0.9rem;
		}

		.current-chord-display h3 {
			font-size: 1.2rem;
		}

		.score-container,
		.input-container,
		.hint-container {
			padding: 0.75rem;
		}

		.score-container h3,
		.input-container h3 {
			font-size: 1rem;
		}

		.hint-container h3 {
			font-size: 0.9rem;
		}

		.note-name {
			font-size: 0.9rem;
			padding: 0.3rem 0.6rem;
		}

		.feedback-container {
			padding: 1rem;
		}

		.feedback-message {
			font-size: 1rem;
		}

		.debug-toggle {
			font-size: 0.8rem;
			padding: 6px 12px;
		}

		.keyboard-hint {
			font-size: 0.8rem;
		}

		.keyboard-instructions {
			padding: 0.75rem;
		}

		.keyboard-instructions p {
			font-size: 0.8rem;
		}

		.keyboard-instructions kbd {
			font-size: 0.7rem;
			padding: 1px 4px;
		}

		/* Hide less critical elements on very small screens */
		.exercise-container {
			gap: 1rem;
		}
	}

	.debug-toggle {
		background: #007acc;
		color: white;
		border: none;
		padding: 8px 16px;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.9rem;
		margin-top: 10px;
		transition: background 0.2s;
	}

	.debug-toggle:hover {
		background: #005a9e;
	}

	.keyboard-hint {
		font-size: 0.9rem;
		color: var(--color-text-light);
		margin-top: 0.5rem;
		font-style: italic;
	}

	.keyboard-instructions {
		background: rgba(0, 122, 204, 0.1);
		border: 2px solid #007acc;
		border-radius: 8px;
		padding: 1rem;
		margin-top: 1rem;
		text-align: center;
	}

	.keyboard-instructions p {
		margin: 0.25rem 0;
		font-size: 0.9rem;
	}

	.keyboard-instructions kbd {
		background: #007acc;
		color: white;
		padding: 2px 6px;
		border-radius: 3px;
		font-family: monospace;
		font-size: 0.8rem;
		margin: 0 1px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}
</style>
