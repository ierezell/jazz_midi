<svelte:options runes={true} />

<script lang="ts">
	import { onMount } from 'svelte';
	import {
		AllNotes,
		MidiToNote,
		RequestMidiAccess,
		type NoteFullName,
		type MidiNote
	} from '../../midi/midi';
	import { getMidiNote, type NoteEvent, majorScales, type Note, NoteToMidi } from '../../midi/midi';
	import Keyboard from '../../components/keyboard/Keyboard.svelte';
	import errorSoundPath from '$lib/sounds/error.mp3';
	import okSoundPath from '$lib/sounds/ok.mp3';
	import Score from '../../components/Score.svelte';

	let noteEvents: NoteEvent[] = $state([]);
	let midiNotes = $derived(noteEvents.map((note) => note.noteNumber));
	let midiAccess: MIDIAccess;
	let selectedNote: Note = $state('C');
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

	let errorSound: HTMLAudioElement | null = null;
	let okSound: HTMLAudioElement | null = null;

	function onMidiEvent(midiEvent: MIDIMessageEvent) {
		const note = getMidiNote(midiEvent);

		if (note.type === 'on') {
			noteEvents = [note, ...noteEvents];
			noteBuffer.push(note.noteNumber);
			noteBuffer = [...new Set(noteBuffer)];

			if (noteBuffer.every((n) => majorScaleMidiNotes.includes(n))) {
				if (noteBuffer.length === 7) {
					feedbackMessage = 'Bravo!';
					if (okSound) {
						okSound.play();
					}
					noteBuffer = [];
				} else {
					feedbackMessage = `${7 - noteBuffer.length} notes to go`;
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
	<Keyboard
		midiNotes={majorScaleMidiNotes}
		middleC={NoteToMidi[selectedNoteMiddleKey] + 7}
		octaves={2}
	/>
	<br />
	<br />
	<Keyboard {midiNotes} middleC={NoteToMidi[selectedNoteMiddleKey] + 7} octaves={2} />
	<label for="note-select">Select a Note:</label>
	<select bind:value={selectedNote}>
		<option value="">--Choose a Note--</option>
		{#each AllNotes as note}
			<option value={note}>{note}</option>
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
