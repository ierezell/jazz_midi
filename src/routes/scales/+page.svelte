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
		getMidiNote,
		majorScales,
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
	let debugMode: boolean = $state(false);
	let virtualMidi: VirtualMidiInput | undefined = undefined;
	let keyboardCleanup: (() => void) | null = null;

	let selectedNoteMiddleKey = $derived(selectedNote + '4') as NoteFullName;
	let entireKeyboardMajorScale = $derived(majorScales[selectedNote]);
	let majorScaleOneOctaveNotes = $derived(
		Array.from(new Set(entireKeyboardMajorScale.map((note) => note.slice(0, -1) as Note)))
	);
	let majorScaleMiddleKeyboard = $derived(
		majorScaleOneOctaveNotes.map((note) => (note + '4') as NoteFullName)
	);
	let majorScaleMidiNotes = $derived(majorScaleMiddleKeyboard.map((note) => NoteToMidi[note]));
	let noteBuffer: MidiNote[] = [];
	let feedbackMessage: string = $state('');
	let errorCount: number = $state(0);
	let showNoteNames: boolean = $derived(errorCount >= 3);
	let showKeyboard: boolean = $derived(errorCount >= 6);

	let errorSound: HTMLAudioElement | null = null;
	let okSound: HTMLAudioElement | null = null;

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

			if (noteBuffer.every((n) => majorScaleMidiNotes.includes(n))) {
				if (noteBuffer.length === 7) {
					feedbackMessage = 'Excellent! Perfect scale! 🎵';
					errorCount = 0; // Reset error count on success
					if (okSound) {
						okSound.play();
					}
					noteBuffer = [];
				} else {
					feedbackMessage = `Good! ${7 - noteBuffer.length} more note${7 - noteBuffer.length > 1 ? 's' : ''} to complete the scale`;
				}
			} else {
				errorCount++;
				feedbackMessage = `Incorrect note. Try again! (Attempt ${errorCount})`;
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
			console.log('Scale MIDI Access obtained:', midiAccess);
			const inputs = midiAccess.inputs;
			inputs.forEach((input) => {
				input.onmidimessage = onMidiEvent;
			});
		} catch (error) {
			console.error('Failed to obtain MIDI Access:', error);
		}
	});
</script>

<main>
	<!-- Debug Panel -->
	{#if debugMode}
		<DebugPanel {virtualMidi} {debugMode} onToggleDebugMode={toggleDebugMode} />
	{/if}

	<div class="page-header">
		<h1>Scale Practice</h1>
		<h2>Major Scales</h2>
		<p class="subtitle">
			Play all 7 notes of the major scale on your MIDI keyboard{debugMode
				? ' or use computer keyboard controls'
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
			<label for="note-select">Root Note:</label>
			<select id="note-select" bind:value={selectedNote} onchange={resetExercise}>
				<option value="">--Choose a Note--</option>
				{#each AllNotes as note}
					<option value={note}>{note}</option>
				{/each}
			</select>
		</div>

		<button class="reset-btn" onclick={resetExercise}>Reset Exercise</button>
	</div>

	{#if selectedNote}
		<div class="exercise-container">
			<div class="scale-display">
				<h2 class="scale-name">{selectedNote} Major Scale</h2>
			</div>

			<!-- Always show the score -->
			<div class="score-container">
				<h3>Musical Score</h3>
				<Score
					{selectedNote}
					leftHand={[
						...majorScaleMiddleKeyboard.map((note) => note.replace('4', '3') as NoteFullName),
						majorScaleMiddleKeyboard[0] as NoteFullName
					].reduce<NoteFullName[][]>((acc, n) => {
						acc.push([n]);
						return acc;
					}, [])}
					rightHand={[
						...majorScaleMiddleKeyboard,
						majorScaleMiddleKeyboard[0].replace('4', '5') as NoteFullName
					].reduce<NoteFullName[][]>((acc, n) => {
						acc.push([n]);
						return acc;
					}, [])}
				/>
			</div>

			<!-- Show note names after 3 mistakes -->
			{#if showNoteNames}
				<div class="hint-container note-names-hint">
					<h3>💡 Hint: Note Names</h3>
					<div class="note-names">
						{#each majorScaleMiddleKeyboard as note}
							<span class="note-name">{note.slice(0, -1)}</span>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Show keyboard after 6 mistakes -->
			{#if showKeyboard}
				<div class="hint-container keyboard-hint">
					<h3>💡 Hint: Keyboard Reference</h3>
					<InteractiveKeyboard
						midiNotes={majorScaleMidiNotes}
						middleC={NoteToMidi[selectedNoteMiddleKey] + 7}
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
					middleC={NoteToMidi[selectedNoteMiddleKey] + 7}
					octaves={2}
					{virtualMidi}
					{debugMode}
				/>
			</div>

			{#if feedbackMessage}
				<div
					class="feedback-container"
					class:success={feedbackMessage.includes('Excellent')}
					class:error={feedbackMessage.includes('Incorrect')}
				>
					<p class="feedback-message">{feedbackMessage}</p>
					{#if errorCount > 0 && !feedbackMessage.includes('Excellent')}
						<p class="error-count">Mistakes: {errorCount}/6 (hints unlock at 3 and 6 mistakes)</p>
					{/if}
				</div>
			{/if}
		</div>
	{:else}
		<div class="placeholder-container">
			<p>Please select a root note to begin practicing scales.</p>
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

	.page-header h2 {
		font-size: 1.8rem;
		margin-bottom: 0.5rem;
		color: var(--color-theme-1);
		font-weight: 500;
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

	.scale-display {
		text-align: center;
		padding: 1rem;
		background: linear-gradient(135deg, var(--color-theme-1), var(--color-theme-2));
		border-radius: 12px;
		margin-bottom: 1rem;
	}

	.scale-name {
		font-size: 2.5rem;
		font-weight: 700;
		color: white;
		margin: 0;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
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
			padding: 1rem;
		}

		.page-header h1 {
			font-size: 2rem;
		}

		.page-header h2 {
			font-size: 1.5rem;
		}

		.controls-container {
			flex-direction: column;
			gap: 1rem;
		}

		.control-group {
			width: 100%;
			max-width: 200px;
		}

		.scale-name {
			font-size: 1.8rem;
		}

		.note-names {
			gap: 0.5rem;
		}

		.feedback-message {
			font-size: 1.1rem;
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
