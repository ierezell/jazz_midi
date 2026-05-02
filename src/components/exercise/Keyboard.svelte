<svelte:options runes={true} />

<script lang="ts">
	import type { MidiNote } from '$lib/types/notes';
	import { DEFAULT_NOTE_ROLE_COLORS } from '$lib/types/notes.constants';
	import type { KeyboardProps } from '$lib/types/types';
	import Key from './Key.svelte';

	let {
		midiNotes,
		middleC,
		octaves,
		noteRoles,
		expectedNotes = [],
		showExpected = false
	}: KeyboardProps = $props();

	let clientWidth = $state(10);
	let clientHeight = $state(10);

	// Validate octaves to prevent RangeError
	let safeOctaves = $derived(Math.max(1, Math.min(10, octaves || 2)));
	let safeMiddleC = $derived(Math.max(24, Math.min(108, middleC || 60)));

	let keys = $derived(
		[...Array(safeOctaves * 12 + 1).keys()].map(
			(i) => i + (safeMiddleC - Math.floor(safeOctaves / 2) * 12)
		)
	);

	let totalKeys = $derived(keys.filter((k) => ![1, 3, 6, 8, 10].includes(k % 12)).length);
</script>

<div class="keyboard" bind:clientWidth bind:clientHeight>
	{#each keys as note}
		{@const noteRoleColor =
			showExpected && expectedNotes.includes(note as MidiNote)
				? '#2ecc71'
				: DEFAULT_NOTE_ROLE_COLORS[noteRoles[note]]}
		{@const isPressed = midiNotes.includes(note as MidiNote)}
		{@const isWrong =
			isPressed && expectedNotes.length > 0 && !expectedNotes.includes(note as MidiNote)}
		<Key
			noteNum={note}
			pressed={isPressed}
			keyWidth={clientWidth / totalKeys}
			keyHeight={clientHeight}
			{noteRoleColor}
			isWrongNote={isWrong}
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
		overflow-x: auto;
		overflow-y: hidden;
	}

	@media (max-width: 768px) {
		.keyboard {
			min-height: 100px;
			max-height: 150px;
			aspect-ratio: 5 / 1;
		}
	}
	@media (max-width: 480px) {
		.keyboard {
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
