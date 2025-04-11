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
	<h1>Scales</h1>
	<h2>Major Scale</h2>
	<Score
		{selectedNote}
		leftHand={[chordNameNotes.map((note) => note.replace('4', '3') as NoteFullName)]}
		rightHand={[chordNameNotes.map((note) => note.replace('4', '4') as NoteFullName)]}
	/>
	<Keyboard midiNotes={chordNotes} middleC={NoteToMidi[selectedNoteMiddleKey] + 11} octaves={2} />
	<br />
	<br />
	<Keyboard {midiNotes} middleC={NoteToMidi[selectedNoteMiddleKey] + 11} octaves={2} />

	<label for="note-select">Select a Note:</label>
	<select bind:value={selectedNote}>
		<option value="">--Choose a Note--</option>
		{#each AllNotes as note}
			<option value={note}>{note}</option>
		{/each}
	</select>

	<label for="chord-select">Select a Type:</label>
	<select bind:value={selectedChordType}>
		<option value="">--Choose a Chord Type--</option>
		{#each AllChordTypes as chord}
			<option value={chord}>{chord}</option>
		{/each}
	</select>

	{#if feedbackMessage}
		<p>{feedbackMessage}</p>
	{/if}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}
	label {
		display: block;
		margin-top: 1em;
	}
	select {
		margin: 0.5em;
	}
	p {
		font-size: 1.2em;
		font-weight: bold;
		margin-top: 1em;
	}
</style>
