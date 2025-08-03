<script lang="ts">
	import type { ChordToneInfo } from '../../lib/types';
	import type { MidiNote } from '../../midi/midi';
	import Key from './Key.svelte';

	interface KeyboardProps {
		midiNotes: MidiNote[];
		middleC: number;
		octaves: number;
		chordToneInfo?: ChordToneInfo[];
		showChordTones?: boolean;
	}
	let {
		midiNotes,
		middleC,
		octaves,
		chordToneInfo = [],
		showChordTones = false
	}: KeyboardProps = $props();
	let w = $state(10);
	let h = $state(10);

	let keys = [...Array(octaves * 12 + 1).keys()].map(
		(i) => i + (middleC - Math.floor(octaves / 2) * 12)
	);
	const totalKeys = 12 * octaves; // Approximate number of keys for 7 octaves

	// Create a lookup map for chord tone info
	let chordToneMap = $derived.by(() => {
		const map = new Map<number, ChordToneInfo>();
		chordToneInfo.forEach((info) => {
			map.set(info.noteNumber, info);
		});
		return map;
	});
</script>

<div class="keyboard" bind:clientWidth={w} bind:clientHeight={h}>
	{#each keys as note}
		{@const chordTone = chordToneMap.get(note)}
		<Key
			noteNum={note}
			pressed={midiNotes.includes(note as MidiNote)}
			keyWidth={w / totalKeys}
			keyHeight={h}
			chordToneRole={chordTone?.role ?? 'none'}
			chordToneColor={chordTone?.color ?? 'transparent'}
			{showChordTones}
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
		min-height: 120px;
		max-height: 200px;
		touch-action: none;
	}

	@media (max-width: 768px) {
		.keyboard {
			height: 50%;
			min-height: 100px;
			max-height: 150px;
			aspect-ratio: 5 / 1;
		}
	}

	@media (max-width: 480px) {
		.keyboard {
			height: 45%;
			min-height: 80px;
			max-height: 120px;
			aspect-ratio: 4 / 1;
		}
	}

	@media (max-width: 360px) {
		.keyboard {
			min-height: 70px;
			max-height: 100px;
			aspect-ratio: 3.5 / 1;
		}
	}
</style>
