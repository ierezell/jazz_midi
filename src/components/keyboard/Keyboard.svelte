<script lang="ts">
	import type { MidiNote } from '../../midi/midi';
	import Key from './Key.svelte';

	interface KeyboardProps {
		midiNotes: MidiNote[];
		middleC: number;
		octaves: number;
	}
	let { midiNotes, middleC, octaves }: KeyboardProps = $props();

	let keys = [...Array(octaves * 12 + 1).keys()].map(
		(i) => i + (middleC - Math.floor(octaves / 2) * 12)
	);
</script>

<div class="keyboard">
	<div>
		{#each keys as note}
			<Key noteNum={note} pressed={midiNotes.includes(note as MidiNote)} />
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
