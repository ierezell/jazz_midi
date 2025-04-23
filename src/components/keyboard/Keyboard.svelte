<script lang="ts">
	import type { MidiNote } from '../../midi/midi';
	import Key from './Key.svelte';

	interface KeyboardProps {
		midiNotes: MidiNote[];
		middleC: number;
		octaves: number;
	}
	let { midiNotes, middleC, octaves }: KeyboardProps = $props();
	let w = $state(10);
	let h = $state(10);

	let keys = [...Array(octaves * 12 + 1).keys()].map(
		(i) => i + (middleC - Math.floor(octaves / 2) * 12)
	);
	const totalKeys = 12 * octaves; // Approximate number of keys for 7 octaves
</script>

<div class="keyboard" bind:clientWidth={w} bind:clientHeight={h}>
	{#each keys as note}
		<Key
			noteNum={note}
			pressed={midiNotes.includes(note as MidiNote)}
			keyWidth={w / totalKeys}
			keyHeight={h}
		/>
	{/each}
</div>

<style>
	.keyboard {
		width: 100%;
		height: 60%;
		aspect-ratio: 6 / 1;
		display: flex;
		justify-content: center;
	}
</style>
