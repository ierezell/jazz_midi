<!-- <script lang="ts">
  import { onMount } from 'svelte';
  import MidiDisplay from './MidiDisplay.svelte';

  let midiNotes: string[] = [];

  onMount(() => {
    navigator.requestMIDIAccess({ sysex: false })
      .then(onMIDISuccess)
      .catch(onMIDIFailure);
  });

  function onMIDISuccess(midiAccess: WebMidi.MIDIAccess) {
    const inputs = midiAccess.inputs;
    inputs.forEach((input) => {
      input.onmidimessage = (message) => {
        const [status, note, velocity] = message.data;
        if (status === 9 && velocity > 0) { // Note on
          midiNotes.push(`Note On: ${note}`);
        } else if (status === 8 || (status === 9 && velocity === 0)) { // Note off
          midiNotes.push(`Note Off: ${note}`);
        }
      };
    });
  }

  function onMIDIFailure() {
    console.error('Could not access your MIDI devices.');
  }
</script>

<main>
  <h1>MIDI Monitor</h1>
  <MidiDisplay {midiNotes} />
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 600px;
    margin: 0 auto;
  }
</style> -->