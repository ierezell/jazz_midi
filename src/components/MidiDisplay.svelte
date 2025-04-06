<!-- <script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  // Store to hold MIDI note updates
  export const midiNotes = writable<string[]>([]);

  // Function to handle MIDI messages
  const handleMIDIMessage = (event: WebMidi.MIDIMessageEvent) => {
    const note = event.data[1]; // MIDI note number
    const action = event.data[0]; // Note on/off action
    const noteName = `Note ${note} ${action === 144 ? 'On' : 'Off'}`;

    // Update the store with the new note
    midiNotes.update(notes => [noteName, ...notes]);
  };

  onMount(() => {
    navigator.requestMIDIAccess().then(midiAccess => {
      const inputs = midiAccess.inputs;
      inputs.forEach(input => {
        input.onmidimessage = handleMIDIMessage;
      });
    });
  });
</script>

<style>
  .midi-display {
    font-family: Arial, sans-serif;
    padding: 1rem;
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
</style>

<div class="midi-display">
  <h2>MIDI Notes</h2>
  <ul>
    {#each $midiNotes as note}
      <li>{note}</li>
    {/each}
  </ul>
</div> -->