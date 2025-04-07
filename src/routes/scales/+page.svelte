<svelte:options runes="{true}" />

<script lang="ts">
	import { onMount } from 'svelte';
	import { AllNotes, RequestMidiAccess, type MidiNote } from '../../midi/midi';
	import { getMidiNote, type NoteEvent, majorScales, type Note, NoteToMidi } from '../../midi/midi';
	import Keyboard from '../../components/keyboard/Keyboard.svelte';
	import errorSoundPath from '$lib/sounds/error.mp3';
	import okSoundPath from '$lib/sounds/ok.mp3';

	
	let noteEvents: NoteEvent[] = $state([]);
	let midiNotes = $derived(noteEvents.map((note) => note.noteNumber));
	let midiAccess: MIDIAccess;
	let selectedNote: Note = $state("C");
	let majorScaleMidiNotes = $derived(majorScales[selectedNote].map((note) => NoteToMidi[note]));
	let noteBuffer: MidiNote[] = [];
	let feedbackMessage: string = $state("");
	
	let errorSound: HTMLAudioElement|null = null;
	let okSound: HTMLAudioElement|null=null;

	function onMidiEvent(midiEvent: MIDIMessageEvent) {
		const note = getMidiNote(midiEvent);
		
		if (note.type === 'on') {
			noteEvents = [note, ...noteEvents];
			noteBuffer.push(note.noteNumber);
			noteBuffer = [...new Set(noteBuffer)];
			
			if (noteBuffer.every((n) => majorScaleMidiNotes.includes(n))) {
				if (noteBuffer.length === 7) {
					feedbackMessage = 'Bravo!';
					if (okSound){
						okSound.play();
					}
					noteBuffer = [];
				} else { 
					feedbackMessage = `${7-noteBuffer.length} notes to go`;
				}
			}
			else {
				feedbackMessage = 'Try again';
				if (errorSound){
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
	<Keyboard midiNotes={majorScaleMidiNotes} middleC={60} octaves={2} />
	<br>	
	<br>
	<Keyboard midiNotes={midiNotes} middleC={60} octaves={2} />
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
