<svelte:options runes={true} />

<script lang="ts">
	import { chords } from '$lib/MusicTheoryUtils';
	import type { ChordType, MidiNote, Note } from '$lib/types/notes';
	import { AllChordTypes, AllNotes, NoteToMidi, MidiToNote } from '$lib/types/notes.constants';
	import type { NoteEvent } from '$lib/types/types';
	import type { VirtualMidiInput } from '../lib/virtualMidi';
	import { getKeyboardToMidi } from '../lib/virtualMidi';
	interface DebugPanelProps {
		virtualMidi?: VirtualMidiInput;
		debugMode?: boolean;
		onToggleDebugMode?: () => void;
		noteEvents?: NoteEvent[];
		expectedNotes?: MidiNote[];
		currentNotes?: MidiNote[];
	}
	let {
		virtualMidi,
		debugMode = true,
		onToggleDebugMode,
		noteEvents = [],
		expectedNotes = [],
		currentNotes = []
	}: DebugPanelProps = $props();

	// readable names derived from midi arrays for template rendering
	let expectedNoteNames = $derived(expectedNotes.map((n) => MidiToNote[n]));
	let currentNoteNames = $derived(currentNotes.map((n) => MidiToNote[n]));

	let selectedNote: Note = $state('C');
	let selectedChordType: ChordType = $state('maj7');
	let selectedOctave: number = $state(3);

	// Dynamic keyboard shortcuts using the same mapping function
	let keyboardShortcuts = $derived.by(() => {
		const mapping = getKeyboardToMidi(selectedOctave);
		const formatKeyMapping = (keys: string[]) =>
			keys
				.map((key) => ({ key: key.toUpperCase(), note: MidiToNote[mapping[key.toLowerCase()]] }))
				.filter((item) => item.note); // Filter out unmapped keys

		return {
			white: formatKeyMapping(['z', 'x', 'c', 'v', 'b', 'n', 'm']),
			black: formatKeyMapping(['s', 'd', 'g', 'h', 'j'])
		};
	});

	// Sync octave changes with virtual MIDI
	$effect(() => {
		if (virtualMidi) {
			virtualMidi.setOctave(selectedOctave);
		}
	});
	function playChord() {
		if (!virtualMidi) return;
		// Use the same octave calculation as the keyboard mapping
		const baseNote = selectedOctave * 12 + 12; // Same formula as getKeyboardToMidi
		const noteOffset = AllNotes.indexOf(selectedNote as Note);
		if (noteOffset === -1) return;

		const rootMidi = (baseNote + noteOffset) as MidiNote;
		const chord = chords(rootMidi, selectedChordType);
		const chordNotes = [chord.root, chord.third, chord.fifth, chord.seventh].filter(
			(n) => n != null && n != undefined
		) as MidiNote[];
		virtualMidi.playChord(chordNotes);
	}
	function stopChord() {
		if (!virtualMidi) return;
		virtualMidi.releaseAllKeys();
	}
	let scaleTimeouts: ReturnType<typeof setTimeout>[] = [];

	function playScale() {
		if (!virtualMidi) return;
		// Clear any existing timeouts
		scaleTimeouts.forEach((t) => clearTimeout(t));
		scaleTimeouts = [];

		// Use the same octave calculation as the keyboard mapping
		const baseNote = selectedOctave * 12 + 12;
		const noteOffset = AllNotes.indexOf(selectedNote as Note);
		if (noteOffset === -1) return;

		const root = (baseNote + noteOffset) as MidiNote;
		const majorScale = [0, 2, 4, 5, 7, 9, 11, 12].map((interval) => (root + interval) as MidiNote);
		majorScale.forEach((note, index) => {
			const timeout = setTimeout(() => {
				virtualMidi!.pressKey(note);
				setTimeout(() => virtualMidi!.releaseKey(note), 300);
			}, index * 400);
			scaleTimeouts.push(timeout);
		});
	}
	function playRandomNote() {
		if (!virtualMidi) return;
		const randomMidi = (72 + Math.floor(Math.random() * 24)) as MidiNote;
		virtualMidi.pressKey(randomMidi);
		setTimeout(() => virtualMidi!.releaseKey(randomMidi), 500);
	}
</script>

<div class="debug-panel" class:visible={debugMode}>
	<div class="debug-header">
		<h3>🎹 Debug Panel</h3>
		<button onclick={onToggleDebugMode} class="toggle-btn">
			{debugMode ? 'Hide' : 'Show'} Debug
		</button>
	</div>
	{#if debugMode}
		<div class="debug-content">
			{#if virtualMidi}
				<div class="section">
					<h4>Virtual MIDI Controls</h4>
					<div class="control-group">
						<label>
							Root Note:
							<select bind:value={selectedNote}>
								{#each AllNotes as note}
									<option value={note}>{note}</option>
								{/each}
							</select>
						</label>
						<label>
							Keyboard Octave:
							<select bind:value={selectedOctave}>
								{#each [2, 3, 4, 5, 6] as octave}
									<option value={octave}>{octave}</option>
								{/each}
							</select>
						</label>
						<label>
							Chord Type:
							<select bind:value={selectedChordType}>
								{#each AllChordTypes as chordType}
									<option value={chordType}>{chordType}</option>
								{/each}
							</select>
						</label>
					</div>
				</div>
				<div class="section">
					<h4>Quick Actions</h4>
					<div class="button-group">
						<button onclick={playChord} class="action-btn">
							Play {selectedNote}{selectedChordType}
						</button>
						<button onclick={stopChord} class="action-btn stop"> Stop All Notes </button>
						<button onclick={playScale} class="action-btn">
							Play {selectedNote} Scale
						</button>
						<button onclick={playRandomNote} class="action-btn"> Random Note </button>
					</div>
				</div>
			{/if}
			{#if expectedNotes.length > 0 || currentNotes.length > 0}
				<div class="section">
					<h4>Exercise Status</h4>
					<div class="status-info">
						{#if expectedNotes.length > 0}
							<div>
								Expected Notes: {expectedNoteNames.join(', ')}
							</div>
						{/if}
						{#if currentNotes.length > 0}
							<div>Current Notes: {currentNoteNames.join(', ')}</div>
						{/if}
						{#if noteEvents.length > 0}
							<div>Recent Events: {noteEvents.length}</div>
						{/if}
					</div>
				</div>
			{/if}
			{#if virtualMidi}
				<div class="section">
					<h4>Keyboard Shortcuts (Octave {selectedOctave})</h4>
					<div class="shortcuts">
						<div class="shortcut-row">
							<strong>White Keys:</strong><br />
							{#each keyboardShortcuts.white as { key, note }}
								<kbd>{key}</kbd> <span>{note}</span>
							{/each}
						</div>
						<div class="shortcut-row">
							<strong>Black Keys:</strong><br />
							{#each keyboardShortcuts.black as { key, note }}
								<kbd>{key}</kbd> <span>{note}</span>
							{/each}
						</div>
					</div>
				</div>
			{/if}
			<div class="section">
				<h4>Status</h4>
				<div class="status">
					<p>
						Active Notes: <span class="count"
							>{virtualMidi ? virtualMidi.getActiveNotes().length : 0}</span
						>
					</p>
					<p>
						Virtual MIDI: <span class="status-good"
							>{virtualMidi ? 'Connected' : 'Disconnected'}</span
						>
					</p>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.debug-panel {
		position: fixed;
		top: 10px;
		right: 10px;
		width: 320px;
		background: rgba(0, 0, 0, 0.9);
		color: white;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		z-index: 1000;
		font-family: 'Courier New', monospace;
		font-size: 0.9rem;
	}
	.debug-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 16px;
		border-bottom: 1px solid #333;
	}
	.debug-header h3 {
		margin: 0;
		font-size: 1.1rem;
	}
	.toggle-btn {
		background: #007acc;
		color: white;
		border: none;
		padding: 6px 12px;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.8rem;
	}
	.toggle-btn:hover {
		background: #005a9e;
	}
	.debug-content {
		padding: 16px;
		max-height: 70vh;
		overflow-y: auto;
	}
	.section {
		margin-bottom: 20px;
	}
	.section h4 {
		margin: 0 0 10px 0;
		color: #ffd700;
		font-size: 1rem;
		border-bottom: 1px solid #333;
		padding-bottom: 4px;
	}
	.control-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.control-group label {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.control-group select {
		background: #333;
		color: white;
		border: 1px solid #555;
		padding: 4px 8px;
		border-radius: 3px;
		width: 100px;
	}
	.button-group {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}
	.action-btn {
		background: #28a745;
		color: white;
		border: none;
		padding: 8px 12px;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.8rem;
		transition: background 0.2s;
	}
	.action-btn:hover {
		background: #218838;
	}
	.action-btn.stop {
		background: #dc3545;
	}
	.action-btn.stop:hover {
		background: #c82333;
	}
	.shortcuts {
		font-size: 0.8rem;
		line-height: 1.4;
	}
	.shortcut-row {
		margin-bottom: 10px;
		padding: 6px;
		background: rgba(0, 122, 204, 0.1);
		border-radius: 4px;
	}
	.shortcut-row strong {
		color: #007acc;
		font-size: 0.75rem;
		display: block;
		margin-bottom: 4px;
	}
	kbd {
		background: #555;
		color: #ffd700;
		padding: 2px 6px;
		border-radius: 3px;
		font-family: monospace;
		font-size: 0.8rem;
		margin-right: 8px;
	}
	.status p {
		margin: 4px 0;
		display: flex;
		justify-content: space-between;
	}
	.count {
		color: #ffd700;
		font-weight: bold;
	}
	.status-good {
		color: #28a745;
		font-weight: bold;
	}
	@media (max-width: 768px) {
		.debug-panel {
			position: relative;
			width: 100%;
			top: 0;
			right: 0;
			margin: 10px 0;
		}
		.debug-content {
			padding: 10px;
		}
		.section {
			margin-bottom: 15px;
		}
		.control-group {
			gap: 6px;
		}
		.control-group select {
			width: 80px;
			font-size: 0.8rem;
		}
		.button-group {
			grid-template-columns: 1fr;
			gap: 6px;
		}
		.action-btn {
			padding: 6px 10px;
			font-size: 0.75rem;
		}
		.shortcuts {
			font-size: 0.7rem;
		}
		kbd {
			font-size: 0.7rem;
			padding: 1px 4px;
		}
	}
	@media (max-width: 480px) {
		.debug-header h3 {
			font-size: 0.9rem;
		}
		.toggle-btn {
			font-size: 0.7rem;
			padding: 4px 8px;
		}
		.section h4 {
			font-size: 0.85rem;
		}
		.control-group label {
			flex-direction: column;
			gap: 4px;
			align-items: flex-start;
		}
		.control-group select {
			width: 100%;
			max-width: 120px;
		}
		.shortcuts {
			display: none;
		}
	}
</style>
