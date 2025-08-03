<script lang="ts">
	import type { ChordToneRole } from '../../lib/types';

	let {
		noteNum,
		pressed,
		keyWidth,
		keyHeight,
		interactive = false,
		chordToneRole = 'none',
		chordToneColor = 'transparent',
		showChordTones = false,
		isWrongNote = false,
		onclick,
		onmousedown,
		onmouseup
	}: {
		noteNum: number;
		pressed: boolean;
		keyWidth: number;
		keyHeight: number;
		interactive?: boolean;
		chordToneRole?: ChordToneRole;
		chordToneColor?: string;
		showChordTones?: boolean;
		isWrongNote?: boolean;
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

	function handleTouchStart(event: TouchEvent) {
		if (interactive && onmousedown) {
			onmousedown();
			event.preventDefault();
		}
	}

	function handleTouchEnd(event: TouchEvent) {
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
	class:wrong-note={isWrongNote}
	class:chord-tone={showChordTones && chordToneRole !== 'none'}
	style="--width: {keyWidth -
		keyWidth *
			0.47 *
			(isNatural
				? 0.0
				: 1.0)}px; --height: {keyHeight}px; --chord-tone-color: {chordToneColor}; transform: translate({bias}px);"
	draggable="false"
	onclick={handleClick}
	onmousedown={handleMouseDown}
	onmouseup={handleMouseUp}
	ontouchstart={handleTouchStart}
	ontouchend={handleTouchEnd}
	role={interactive ? 'button' : undefined}
	{...interactive ? { tabindex: 0 } : {}}
>
	{#if showChordTones && chordToneRole !== 'none'}
		<div
			class="chord-tone-indicator"
			class:natural-indicator={isNatural}
			class:accidental-indicator={!isNatural}
		>
			<div class="chord-tone-dot"></div>
		</div>
	{/if}
</div>

<style>
	div {
		flex-shrink: 0;
		width: var(--width);
		min-width: min-content;
		height: var(--height);
		border-radius: 0px 0px calc(var(--width) / 8) calc(var(--width) / 8);
		-webkit-user-drag: none;
		touch-action: manipulation;
		transition: all 0.1s ease;
	}

	.accidental {
		margin: 0px calc(var(--width) / -2) 0px calc(var(--width) / -2);
		z-index: 2;
		height: 60%;
		background: black;
		box-shadow: inset white 0px 0px 2px 0px;
	}

	.natural {
		height: 100%;
		box-shadow: inset black 0px 0px 2px 0px;
		background: white;
	}

	.accidental.pressed {
		background: hsl(165, 92%, 48%);
	}

	.natural.pressed {
		background: hsl(140, 89%, 45%);
	}

	/* Chord tone styling */
	.chord-tone-indicator {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		pointer-events: none;
	}

	.natural-indicator {
		padding-bottom: 8px;
	}

	.accidental-indicator {
		padding-bottom: 6px;
	}

	.chord-tone-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: var(--chord-tone-color);
		border: 1px solid rgba(0, 0, 0, 0.3);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	}

	/* Enhanced chord tone visibility when pressed */
	.chord-tone.pressed .chord-tone-dot {
		transform: scale(1.2);
		border-color: rgba(255, 255, 255, 0.8);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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

	/* Wrong note styling */
	.wrong-note {
		background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%) !important;
		border-color: #990000 !important;
		animation: wrongNoteFlash 0.3s ease-in-out;
	}

	.wrong-note.accidental {
		background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%) !important;
	}

	@keyframes wrongNoteFlash {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
		100% {
			transform: scale(1);
		}
	}

	/* Mobile-specific touch improvements */
	@media (max-width: 768px) {
		div {
			transition: all 0.05s ease;
		}

		.interactive:active {
			transform: scale(0.95);
		}

		.accidental {
			box-shadow: inset white 0px 0px 1px 0px;
		}

		.natural {
			box-shadow: inset black 0px 0px 1px 0px;
		}
	}

	@media (max-width: 480px) {
		div {
			border-radius: 0px 0px calc(var(--width) / 6) calc(var(--width) / 6);
		}

		.interactive:active {
			transform: scale(0.92);
		}
	}
</style>
