<svelte:options runes={true} />

<script lang="ts">
	import type { ChordToneInfo } from '../../lib/types';
	import type { MidiNote } from '../../midi/midi';
	import type { VirtualMidiInput } from '../../midi/virtualMidi';
	import Key from './Key.svelte';

	interface InteractiveKeyboardProps {
		midiNotes: MidiNote[];
		middleC: number;
		octaves: number;
		virtualMidi?: VirtualMidiInput;
		debugMode?: boolean;
		chordToneInfo?: ChordToneInfo[];
		showChordTones?: boolean;
		expectedNotes?: MidiNote[];
		showLabels?: boolean;
	}

	let {
		midiNotes,
		middleC,
		octaves,
		virtualMidi,
		debugMode = false,
		chordToneInfo = [],
		showChordTones = false,
		expectedNotes = [],
		showLabels = false
	}: InteractiveKeyboardProps = $props();

	let w = $state(10);
	let h = $state(10);

	let keys = [...Array(octaves * 12 + 1).keys()].map(
		(i) => i + (middleC - Math.floor(octaves / 2) * 12)
	);
	const totalKeys = 12 * octaves;

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
		{@const isPressed = midiNotes.includes(note as MidiNote)}
		{@const isWrong =
			isPressed && expectedNotes.length > 0 && !expectedNotes.includes(note as MidiNote)}
		<Key
			noteNum={note}
			pressed={isPressed}
			keyWidth={w / totalKeys}
			keyHeight={h}
			interactive={false}
			chordToneRole={chordTone?.role ?? 'none'}
			chordToneColor={chordTone?.color ?? 'transparent'}
			{showChordTones}
			isWrongNote={isWrong}
		/>
	{/each}
</div>

{#if debugMode}
	<div class="debug-info">
		<p><strong>Debug Mode Active</strong></p>
		<p>Use computer keyboard to simulate MIDI input</p>
		<p>Active notes: {midiNotes.length > 0 ? midiNotes.join(', ') : 'None'}</p>
	</div>
{/if}

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
		overflow-x: auto;
		overflow-y: hidden;
	}

	.debug-info {
		margin-top: 1rem;
		padding: 0.5rem;
		background-color: #f0f8ff;
		border: 1px solid #007acc;
		border-radius: 4px;
		font-size: 0.9rem;
		color: #333;
	}

	.debug-info p {
		margin: 0.25rem 0;
	}

	/* Mobile responsiveness */
	@media (max-width: 768px) {
		.keyboard {
			min-height: 100px;
			max-height: 150px;
			aspect-ratio: 5 / 1;
		}

		.debug-info {
			font-size: 0.8rem;
			padding: 0.4rem;
			margin-top: 0.75rem;
		}
	}

	@media (max-width: 480px) {
		.keyboard {
			min-height: 80px;
			max-height: 120px;
			aspect-ratio: 4 / 1;
		}

		.debug-info {
			font-size: 0.75rem;
			padding: 0.3rem;
			margin-top: 0.5rem;
		}
	}

	@media (max-width: 360px) {
		.keyboard {
			min-height: 70px;
			max-height: 100px;
			aspect-ratio: 3.5 / 1;
		}

		.debug-info {
			font-size: 0.7rem;
			padding: 0.25rem;
		}
	}
</style>
