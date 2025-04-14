<script lang="ts">
	let {
		noteNum,
		pressed,
		keyWidth,
		keyHeight
	}: { noteNum: number; pressed: boolean; keyWidth: number; keyHeight: number } = $props();
	let isNatural = ![1, 3, 6, 8, 10].includes(noteNum % 12);
	let bias = $state(0);

	if (!isNatural) {
		if ([1, 6].includes(noteNum % 12)) bias = -keyWidth / 12;
		else if ([3, 10].includes(noteNum % 12)) bias = keyWidth / 12;
	}
</script>

<div
	class:accidental={!isNatural}
	class:natural={isNatural}
	class:pressed
	style="--width: {keyWidth -
		keyWidth *
			0.47 *
			(isNatural ? 0.0 : 1.0)}px; --height: {keyHeight}px; transform: translate({bias}px);"
	draggable="false"
></div>

<style>
	div {
		flex-shrink: 0;
		width: var(--width);
		min-width: min-content;
		height: var(--height); /* Adjust height dynamically using CSS variable */
		border-radius: 0px 0px calc(var(--width) / 8) calc(var(--width) / 8);
		-webkit-user-drag: none;
	}

	.accidental {
		margin: 0px calc(var(--width) / -2) 0px calc(var(--width) / -2);
		z-index: 2;
		height: 60%; /* Adjust height relative to the parent */
		background: black;
		box-shadow: inset white 0px 0px 2px 0px;
	}

	.natural {
		height: 100%; /* Adjust height relative to the parent */
		box-shadow: inset black 0px 0px 2px 0px;
	}

	.accidental.pressed {
		background: hsl(165, 92%, 48%);
	}

	.natural.pressed {
		background: hsl(140, 89%, 45%);
	}
</style>
