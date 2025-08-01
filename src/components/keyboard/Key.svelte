<script lang="ts">
	let {
		noteNum,
		pressed,
		keyWidth,
		keyHeight,
		interactive = false,
		onclick,
		onmousedown,
		onmouseup
	}: {
		noteNum: number;
		pressed: boolean;
		keyWidth: number;
		keyHeight: number;
		interactive?: boolean;
		onclick?: () => void;
		onmousedown?: () => void;
		onmouseup?: () => void;
	} = $props();

	let isNatural = ![1, 3, 6, 8, 10].includes(noteNum % 12);
	let bias = $state(0);

	if (!isNatural) {
		if ([1, 6].includes(noteNum % 12)) bias = -keyWidth / 12;
		else if ([3, 10].includes(noteNum % 12)) bias = keyWidth / 12;
	}

	function handleClick() {
		if (interactive && onclick) {
			onclick();
		}
	}

	function handleMouseDown(event: MouseEvent) {
		if (interactive && onmousedown) {
			onmousedown();
			event.preventDefault();
		}
	}

	function handleMouseUp(event: MouseEvent) {
		if (interactive && onmouseup) {
			onmouseup();
			event.preventDefault();
		}
	}
</script>

<div
	class:accidental={!isNatural}
	class:natural={isNatural}
	class:pressed
	class:interactive
	style="--width: {keyWidth -
		keyWidth *
			0.47 *
			(isNatural ? 0.0 : 1.0)}px; --height: {keyHeight}px; transform: translate({bias}px);"
	draggable="false"
	onclick={handleClick}
	onmousedown={handleMouseDown}
	onmouseup={handleMouseUp}
	role={interactive ? 'button' : undefined}
	tabindex={interactive ? 0 : undefined}
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

	.interactive {
		cursor: pointer;
		user-select: none;
	}

	.interactive:hover {
		opacity: 0.8;
	}

	.interactive:active {
		transform: scale(0.98);
	}
</style>
