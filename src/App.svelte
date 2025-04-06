<script lang="ts">
  import { onMount } from 'svelte';
  import { RequestMidiAccess } from './midi/midi';
  import MidiDisplay from './components/MidiDisplay.svelte';

  let midiAccess:MIDIAccess|null = null;

  onMount(async () => {midiAccess = await RequestMidiAccess();});
</script>

<main>
  <h1>Jazz MIDI</h1>
  {#if midiAccess}
    <MidiDisplay {midiAccess} />
  {:else}
    <p>Loading MIDI Access...</p>
  {/if}
</main>

<style>
  main {
    font-family: Arial, sans-serif;
    text-align: center;
    margin: 2rem;
  }
</style>