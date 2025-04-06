<script lang="ts">
  export let midiAccess: MIDIAccess | null = null;
</script>

<div>
  <h2>MIDI Inputs</h2>
  {#if midiAccess}
    <ul>
      {#each Array.from(midiAccess.inputs.values()) as input}
        <li>{input.name}</li>
      {/each}
    </ul>
  {:else}
    <p>No MIDI inputs available.</p>
  {/if}
</div>

<style>
  div {
    margin: 1rem;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    margin: 0.5rem 0;
  }
</style>