<script lang="ts">
	import { onMount } from 'svelte';
	import { RequestMidiAccess } from '../../midi/midi';
	import { getMidiNote, type NoteEvent } from '../../midi/midi';
	import Keyboard from '../../components/keyboard/Keyboard.svelte';

	let noteEvents: NoteEvent[] = $state([]);
	// let { midiAccess } = $props();
	let midiAccess: MIDIAccess;

	function onMidiEvent(midiEvent: MIDIMessageEvent) {
		const note = getMidiNote(midiEvent);
		
		if (note.type === 'on') {
			noteEvents = [note, ...noteEvents];
		} else {
			noteEvents = noteEvents.filter((n) => n.noteFullName !== note.noteFullName);
		}
		console.log('Note:', note);
		console.log("Pressed", noteEvents);
	}

	onMount(async () => {
		try {
			midiAccess = await RequestMidiAccess();
			console.log('MIDI Access obtained:', midiAccess);
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
	<h1>MIDI Monitor</h1>
	<Keyboard noteEvents={noteEvents} middleC={60} octaves={2} />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}
</style>
