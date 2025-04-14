<svelte:options runes={true} />

<script lang="ts">
	import { onMount } from 'svelte';
	import {
		AllChordTypes,
		AllNotes,
		MidiToNote,
		RequestMidiAccess,
		type Chord,
		type MidiNote,
		type NoteFullName
	} from '../../midi/midi';
	import {
		getMidiNote,
		type NoteEvent,
		chords,
		type Note,
		NoteToMidi,
		type ChordType
	} from '../../midi/midi';
	import Keyboard from '../../components/keyboard/Keyboard.svelte';
	import errorSoundPath from '$lib/sounds/error.mp3';
	import okSoundPath from '$lib/sounds/ok.mp3';
	import Score from '../../components/Score.svelte';

	let noteEvents: NoteEvent[] = $state([]);
	let midiNotes = $derived(noteEvents.map((note) => note.noteNumber));
	let midiAccess: MIDIAccess;
	let selectedNote: Note = $state('C');
	let selectedChordType: ChordType = $state('maj7');

	let selectedNoteMiddleKey = $derived(selectedNote + '4') as NoteFullName;
	let chord = $derived(chords(NoteToMidi[selectedNoteMiddleKey], selectedChordType));
	let chordNotes = $derived(
		[chord.root, chord.third, chord.fifth, chord.seventh].filter((n) => n != null && n != undefined)
	);

	let chordNameNotes = $derived(
		chordNotes.map((note) => (MidiToNote[note].slice(0, -1) + '4') as NoteFullName)
	);
	let noteBuffer: MidiNote[] = [];
	let feedbackMessage: string = $state('');

	let errorSound: HTMLAudioElement | null = null;
	let okSound: HTMLAudioElement | null = null;

	function onMidiEvent(midiEvent: MIDIMessageEvent) {
		const note = getMidiNote(midiEvent);

		if (note.type === 'on') {
			noteEvents = [note, ...noteEvents];
			noteBuffer.push(note.noteNumber);
			noteBuffer = [...new Set(noteBuffer)];
			if (noteBuffer.every((n) => chordNotes.includes(n))) {
				if (noteBuffer.length === chordNotes.length) {
					feedbackMessage = 'Bravo!';
					if (okSound) {
						okSound.play();
					}
					noteBuffer = [];
				} else {
					feedbackMessage = `${chordNotes.length - noteBuffer.length} notes to go`;
				}
			} else {
				feedbackMessage = 'Try again';
				if (errorSound) {
					errorSound.play();
				}
				noteBuffer = [];
			}
		} else {
			noteEvents = noteEvents.filter((n) => n.noteFullName !== note.noteFullName);
		}
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
	<div class="select-container">
		<label for="note-select">Note:</label>
		<select bind:value={selectedNote}>
			<option value="">--Choose a Note--</option>
			{#each AllNotes as note}
				<option value={note}>{note}</option>
			{/each}
		</select>

		<label for="chord-select">Type:</label>
		<select bind:value={selectedChordType}>
			<option value="">--Choose a Chord Type--</option>
			{#each AllChordTypes as chord}
				<option value={chord}>{chord}</option>
			{/each}
		</select>
	</div>

	<div class="reference-container">
		<Score
			{selectedNote}
			leftHand={[chordNameNotes.map((note) => note.replace('4', '3') as NoteFullName)]}
			rightHand={[chordNameNotes.map((note) => note.replace('4', '4') as NoteFullName)]}
		/>
		<Keyboard midiNotes={chordNotes} middleC={NoteToMidi[selectedNoteMiddleKey] + 11} octaves={2} />
	</div>

	<div class="notesKeyboard">
		<Keyboard {midiNotes} middleC={NoteToMidi[selectedNoteMiddleKey] + 11} octaves={2} />
	</div>

	{#if feedbackMessage}
		<p>{feedbackMessage}</p>
	{/if}
</main>

<style>
	.select-container {
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: center;
	}

	.reference-container {
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: center;
		gap: 1em;
		border: 2px solid black; /* Add a black border */
		border-radius: 8px; /* Optional: Add rounded corners */
		padding: 1em; /* Optional: Add padding inside the container */
	}

	.reference-container > :first-child {
		flex: 1; /* 1/4 size */
	}

	.reference-container > :nth-child(2) {
		flex: 3; /* 3/4 size */
	}

	@media (max-width: 768px) and (orientation: landscape) {
		.reference-container {
			flex-direction: column;
			gap: 0.5em;
		}
	}
</style>
