<script lang="ts">
	import type { MidiNote, NoteEvent } from "../../midi/midi";
    import Key from "./Key.svelte";
    console.log("COUCOU");
    let {noteEvents,middleC,octaves}: {
        noteEvents: NoteEvent[],``
        middleC: number,
        octaves: number,
    } = $props();

    console.log("NoteEvents", noteEvents);
    let midiNotes = noteEvents.map((note) => note.noteNumber);
    let keys = [...Array(octaves * 12 + 1).keys()].map(
        (i) => i + (middleC - Math.floor(octaves / 2) * 12)
    );
</script>

<div class="keyboard">
    <div>
        {#each keys as note}
            <Key noteNum={note} pressed={midiNotes.includes(note as MidiNote)}/>
        {/each}
    </div>
</div>

<style>
    .keyboard {
        display: flex;
        justify-content: center;
        width: 100%;
    }
    .keyboard > div {
        width: 100%;
        display: flex;
        overflow: auto;
        padding: 8px;
        height: 192px;
    }
</style>