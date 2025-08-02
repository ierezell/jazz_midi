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
		MidiToNote,
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

	let noteEvents: NoteEvent[] = $state([]);
	let midiNotes = $derived(noteEvents.map((note) => note.noteNumber));
	let midiAccess: MIDIAccess;
	let selectedNote: Note = $state('C');
	let selectedChordType: ChordType = $state('maj7');
	let selectedInversion: 0 | 1 | 2 | 3 = $state(0);
	let voicingMode: 'full' | 'left-hand' | 'right-hand' | 'split' = $state('full');
	let debugMode: boolean = $state(false);
	let virtualMidi: VirtualMidiInput | undefined = $state(undefined);
	let keyboardCleanup: (() => void) | null = null;

	let selectedNoteMiddleKey = $derived(selectedNote + '4') as NoteFullName;
	let chord = $derived(
		chords(NoteToMidi[selectedNoteMiddleKey], selectedChordType, selectedInversion)
	);

	// Generate the expected notes based on voicing mode
	let expectedNotes = $derived(() => {
		const allChordNotes = [chord.root, chord.third, chord.fifth, chord.seventh].filter(
			(n) => n != null && n != undefined
		) as MidiNote[];

		switch (voicingMode) {
			case 'full':
				return allChordNotes;
			case 'left-hand':
				// Left hand plays root and 7th (1-7 voicing)
				return [chord.root, chord.seventh].filter((n) => n != null) as MidiNote[];
			case 'right-hand':
				// Right hand plays 3rd and 5th (3-5 voicing)
				return [chord.third, chord.fifth].filter((n) => n != null) as MidiNote[];
			case 'split':
				// Split hands: 1-7 in left (lower octave), 3-5 in right (higher octave)
				const leftHand = [chord.root - 12, (chord.seventh || chord.root) - 12].filter(
					(n) => n >= 24
				) as MidiNote[];
				const rightHand = [chord.third, chord.fifth].filter((n) => n != null) as MidiNote[];
				return [...leftHand, ...rightHand];
			default:
				return allChordNotes;
		}
	});

	let chordNotes = $derived(expectedNotes());

	let chordNameNotes = $derived(
		chordNotes.map((note) => (MidiToNote[note].slice(0, -1) + '4') as NoteFullName)
	);

	// Calculate optimal keyboard range based on the notes we need to display
	let keyboardRange = $derived.by(() => {
		if (chordNotes.length === 0) return { middleC: 60, octaves: 2 };

		const minNote = Math.min(...chordNotes);
		const maxNote = Math.max(...chordNotes);
		const noteRange = maxNote - minNote;

		// Ensure we show at least from one C to the next C that encompasses all notes
		const minC = Math.floor((minNote - 12) / 12) * 12 + 12; // Find C below the lowest note
		const maxC = Math.ceil((maxNote + 12) / 12) * 12; // Find C above the highest note

		// Calculate middle C position and octaves needed
		const totalRange = maxC - minC;
		const octaves = Math.max(2, Math.ceil(totalRange / 12));

		// Position middle C to center the range, but ensure all notes are visible
		const middleC = minC + Math.floor((octaves * 12) / 2) - 6; // -6 to center better

		return {
			middleC: Math.max(24, middleC), // Ensure we don't go below MIDI note 24
			octaves: Math.min(7, octaves) // Cap at 7 octaves for screen space
		};
	});

	// Derived score notes for proper bass/treble clef display
	let scoreLeftHand = $derived.by(() => {
		if (voicingMode === 'right-hand') return [];

		// For split mode, show left hand parts in bass clef
		if (voicingMode === 'split') {
			// Left hand plays root and 7th in lower octave
			const leftNotes = [chord.root - 12, (chord.seventh || chord.root) - 12].filter(
				(n) => n >= 24
			) as MidiNote[];
			return [leftNotes.map((note: MidiNote) => MidiToNote[note])];
		}

		// For left hand mode, show all chord notes in bass clef (lower octave)
		if (voicingMode === 'left-hand') {
			return [chordNameNotes.map((note: NoteFullName) => note.replace('4', '3') as NoteFullName)];
		}

		// Default: show all notes in bass clef
		return [chordNameNotes.map((note: NoteFullName) => note.replace('4', '3') as NoteFullName)];
	});

	let scoreRightHand = $derived.by(() => {
		if (voicingMode === 'left-hand') return [];

		// For split mode, show right hand parts in treble clef
		if (voicingMode === 'split') {
			// Right hand plays 3rd and 5th in normal octave
			const rightNotes = [chord.third, chord.fifth].filter((n) => n != null) as MidiNote[];
			return [rightNotes.map((note: MidiNote) => MidiToNote[note])];
		}

		// For right hand mode, show all chord notes in treble clef
		if (voicingMode === 'right-hand') {
			return [chordNameNotes.map((note: NoteFullName) => note as NoteFullName)];
		}

		// Default: show all notes in treble clef
		return [chordNameNotes.map((note: NoteFullName) => note as NoteFullName)];
	});

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

			// Hand detection (C4 = 60 is the dividing line)
			const leftHandNotes = noteBuffer.filter((n) => n < 60);
			const rightHandNotes = noteBuffer.filter((n) => n >= 60);

			// Validate based on voicing mode
			let isCorrect = false;
			let progressMessage = '';

			switch (voicingMode) {
				case 'full':
					isCorrect = noteBuffer.every((n) => chordNotes.includes(n));
					if (isCorrect && noteBuffer.length === chordNotes.length) {
						feedbackMessage = getInversionSuccessMessage();
						errorCount = 0;
						if (okSound) okSound.play();
						noteBuffer = [];
						return;
					} else if (isCorrect) {
						progressMessage = `Great! ${chordNotes.length - noteBuffer.length} more note${chordNotes.length - noteBuffer.length > 1 ? 's' : ''} to go`;
					}
					break;

				case 'left-hand':
					// Check if notes are in left hand range and correct
					const expectedLeftNotes = chordNotes.filter((n) => n < 60);
					isCorrect =
						leftHandNotes.every((n) => expectedLeftNotes.includes(n)) &&
						rightHandNotes.length === 0;
					if (isCorrect && leftHandNotes.length === expectedLeftNotes.length) {
						feedbackMessage = `Excellent left hand voicing! 🎹 (1-7: ${getChordToneNames(leftHandNotes)})`;
						errorCount = 0;
						if (okSound) okSound.play();
						noteBuffer = [];
						return;
					} else if (isCorrect) {
						progressMessage = `Left hand: ${leftHandNotes.length}/${expectedLeftNotes.length} notes correct`;
					}
					break;

				case 'right-hand':
					// Check if notes are in right hand range and correct
					const expectedRightNotes = chordNotes.filter((n) => n >= 60);
					isCorrect =
						rightHandNotes.every((n) => expectedRightNotes.includes(n)) &&
						leftHandNotes.length === 0;
					if (isCorrect && rightHandNotes.length === expectedRightNotes.length) {
						feedbackMessage = `Perfect right hand voicing! 🎹 (3-5: ${getChordToneNames(rightHandNotes)})`;
						errorCount = 0;
						if (okSound) okSound.play();
						noteBuffer = [];
						return;
					} else if (isCorrect) {
						progressMessage = `Right hand: ${rightHandNotes.length}/${expectedRightNotes.length} notes correct`;
					}
					break;

				case 'split':
					const expectedLeftSplit = chordNotes.filter((n) => n < 60);
					const expectedRightSplit = chordNotes.filter((n) => n >= 60);
					const leftCorrect = leftHandNotes.every((n) => expectedLeftSplit.includes(n));
					const rightCorrect = rightHandNotes.every((n) => expectedRightSplit.includes(n));
					isCorrect = leftCorrect && rightCorrect;

					if (
						isCorrect &&
						leftHandNotes.length === expectedLeftSplit.length &&
						rightHandNotes.length === expectedRightSplit.length
					) {
						feedbackMessage = `Outstanding split voicing! 🎹🎵 Left: ${getChordToneNames(leftHandNotes)} | Right: ${getChordToneNames(rightHandNotes)}`;
						errorCount = 0;
						if (okSound) okSound.play();
						noteBuffer = [];
						return;
					} else if (leftCorrect || rightCorrect) {
						progressMessage = `Left: ${leftHandNotes.length}/${expectedLeftSplit.length}, Right: ${rightHandNotes.length}/${expectedRightSplit.length}`;
					}
					break;
			}

			if (isCorrect && progressMessage) {
				feedbackMessage = progressMessage;
			} else {
				errorCount++;
				feedbackMessage = getErrorMessage();
				if (errorSound) {
					errorSound.play();
				}
				noteBuffer = [];
			}
		} else {
			noteEvents = noteEvents.filter((n) => n.noteFullName !== note.noteFullName);
		}
	}

	function getInversionSuccessMessage(): string {
		const inversionNames = ['Root Position', '1st Inversion', '2nd Inversion', '3rd Inversion'];
		return `Bravo! Perfect ${inversionNames[selectedInversion]} ${selectedNote}${selectedChordType}! 🎉`;
	}

	function getChordToneNames(notes: MidiNote[]): string {
		// Convert MIDI notes to chord tone names (1, 3, 5, 7)
		const chordToneMap = new Map([
			[chord.root, '1'],
			[chord.third, '3'],
			[chord.fifth, '5'],
			[chord.seventh, '7']
		]);

		return notes
			.map(
				(n) =>
					chordToneMap.get(n) ||
					chordToneMap.get((n + 12) as MidiNote) ||
					chordToneMap.get((n - 12) as MidiNote) ||
					'?'
			)
			.join('-');
	}

	function getErrorMessage(): string {
		const voicingMessages = {
			full: `Incorrect chord. Try the ${selectedInversion > 0 ? getInversionName() + ' ' : ''}${selectedNote}${selectedChordType}!`,
			'left-hand': `Left hand only! Play 1-7 (${selectedNote}-${get7thName()}) in your left hand.`,
			'right-hand': `Right hand only! Play 3-5 in your right hand.`,
			split: `Split hands! Left: 1-7 (lower), Right: 3-5 (higher).`
		};
		return `${voicingMessages[voicingMode]} (Attempt ${errorCount})`;
	}

	function getInversionName(): string {
		const names = ['root position', '1st inversion', '2nd inversion', '3rd inversion'];
		return names[selectedInversion];
	}

	function get7thName(): string {
		// Get the 7th note name for display
		if (chord.seventh) {
			return MidiToNote[chord.seventh].slice(0, -1);
		}
		return '';
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
		<h1>Chord Practice</h1>
		<p class="subtitle">
			Play the correct chord on your MIDI keyboard{debugMode
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

		<div class="control-group">
			<label for="chord-select">Chord Type:</label>
			<select id="chord-select" bind:value={selectedChordType} onchange={resetExercise}>
				<option value="">--Choose a Chord Type--</option>
				{#each AllChordTypes as chord}
					<option value={chord}>{chord}</option>
				{/each}
			</select>
		</div>

		<div class="control-group">
			<label for="inversion-select">Inversion:</label>
			<select id="inversion-select" bind:value={selectedInversion} onchange={resetExercise}>
				<option value={0}>Root Position</option>
				<option value={1}>1st Inversion</option>
				<option value={2}>2nd Inversion</option>
				{#if selectedChordType === 'maj7' || selectedChordType === 'min7' || selectedChordType === '7'}
					<option value={3}>3rd Inversion</option>
				{/if}
			</select>
		</div>

		<div class="control-group">
			<label for="voicing-select">Voicing:</label>
			<select id="voicing-select" bind:value={voicingMode} onchange={resetExercise}>
				<option value="full">Full Chord</option>
				<option value="left-hand">Left Hand (1-7)</option>
				<option value="right-hand">Right Hand (3-5)</option>
				<option value="split">Split Hands (1-7 Left, 3-5 Right)</option>
			</select>
		</div>

		<button class="reset-btn" onclick={resetExercise}>Reset Exercise</button>
	</div>

	{#if selectedNote && selectedChordType}
		<div class="exercise-container">
			<div class="chord-display">
				<h2 class="chord-name">
					{selectedNote}{selectedChordType}
					{#if selectedInversion > 0}
						<span class="inversion-indicator">
							/{MidiToNote[
								selectedInversion === 1
									? chord.third
									: selectedInversion === 2
										? chord.fifth
										: chord.seventh || chord.root
							].slice(0, -1)}
						</span>
					{/if}
				</h2>
				<p class="voicing-info">
					{#if voicingMode === 'full'}
						Play all chord notes ({selectedInversion === 0 ? 'Root Position' : getInversionName()})
					{:else if voicingMode === 'left-hand'}
						<strong>Left Hand:</strong> Root + 7th ({selectedNote} + {get7thName()})
					{:else if voicingMode === 'right-hand'}
						<strong>Right Hand:</strong> 3rd + 5th
					{:else if voicingMode === 'split'}
						<strong>Left:</strong> 1-7 (lower) | <strong>Right:</strong> 3-5 (higher)
					{/if}
				</p>
			</div>

			<!-- Always show the score -->
			<div class="score-container">
				<h3>Musical Score</h3>
				<Score {selectedNote} leftHand={scoreLeftHand} rightHand={scoreRightHand} />
			</div>

			<!-- Show note names after 3 mistakes -->
			{#if showNoteNames}
				<div class="hint-container note-names-hint">
					<h3>💡 Hint: Note Names</h3>
					<div class="note-names">
						{#each chordNameNotes as note}
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
						midiNotes={chordNotes}
						middleC={keyboardRange.middleC}
						octaves={keyboardRange.octaves}
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
					middleC={keyboardRange.middleC}
					octaves={keyboardRange.octaves}
					{virtualMidi}
					{debugMode}
				/>
			</div>

			{#if feedbackMessage}
				<div
					class="feedback-container"
					class:success={feedbackMessage.includes('Bravo')}
					class:error={feedbackMessage.includes('Incorrect')}
				>
					<p class="feedback-message">{feedbackMessage}</p>
					{#if errorCount > 0 && !feedbackMessage.includes('Bravo')}
						<p class="error-count">Mistakes: {errorCount}/6 (hints unlock at 3 and 6 mistakes)</p>
					{/if}
				</div>
			{/if}
		</div>
	{:else}
		<div class="placeholder-container">
			<p>Please select a root note and chord type to begin practicing.</p>
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
	}

	.controls-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 1.5rem;
		justify-content: center;
		align-items: end;
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
		grid-column: 1 / -1;
		justify-self: center;
		max-width: 200px;
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

	.chord-display {
		text-align: center;
		padding: 1rem;
		background: linear-gradient(135deg, var(--color-theme-1), var(--color-theme-2));
		border-radius: 12px;
		margin-bottom: 1rem;
	}

	.chord-name {
		font-size: 3rem;
		font-weight: 700;
		color: white;
		margin: 0;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
	}

	.inversion-indicator {
		font-size: 0.7em;
		opacity: 0.9;
	}

	.voicing-info {
		color: white;
		font-size: 1.1rem;
		margin: 0.5rem 0 0 0;
		opacity: 0.95;
		font-weight: 500;
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

		.controls-container {
			flex-direction: column;
			gap: 1rem;
		}

		.control-group {
			width: 100%;
			max-width: 200px;
		}

		.chord-name {
			font-size: 2rem;
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
