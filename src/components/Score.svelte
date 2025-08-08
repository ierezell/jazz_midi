<script lang="ts">
	import type { NoteFullName } from '$lib/types/notes';
	import type { ScoreProps } from '$lib/types/types';
	import { onMount } from 'svelte';
	import { Factory, Renderer, Voice } from 'vexflow';

	let { leftHand, rightHand, selectedNote }: ScoreProps = $props();

	const fmt = (group: NoteFullName[][]) =>
		group?.map((chord) => (chord.length > 1 ? `(${chord.join(' ')})` : chord[0])).join(', ') || '';
	let stringRightHand = $derived(fmt(rightHand));
	let stringLeftHand = $derived(fmt(leftHand));
	function renderScore(width: number) {
		const isMobile = width < 768;
		const isSmallMobile = width < 480;
		const isVerySmallMobile = width < 360;
		let height;
		if (isVerySmallMobile) {
			height = 200;
		} else if (isSmallMobile) {
			height = 240;
		} else if (isMobile) {
			height = 280;
		} else {
			height = 340;
		}

		// Clear the canvas element first
		const canvas = document.getElementById('output') as HTMLCanvasElement;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const f: Factory = new Factory({
			renderer: {
				elementId: 'output',
				backend: Renderer.Backends.CANVAS,
				width: Math.max(300, width),
				height: height
			}
		});

		const score = f.EasyScore({ throwOnError: false });

		const spaceBetweenStaves = isMobile ? Math.max(20, width / 40) : width / 35;
		const system = f.System({
			width: Math.max(300, width),
			spaceBetweenStaves: spaceBetweenStaves,
			noPadding: isMobile,
			noJustification: isMobile,
			formatOptions: {
				alignRests: true,
				autoBeam: true
			}
		});

		// Only proceed if we have notes to render
		if ((!rightHand || rightHand.length === 0) && (!leftHand || leftHand.length === 0)) {
			console.debug('No notes to render, rendering test chord');
			// Render a test C major chord for debugging
			const testRightHand = 'C4, E4, G4';
			try {
				const stave = system.addStave({
					voices: [
						score
							.voice(score.notes(testRightHand, { clef: 'treble', stem: 'up' }))
							.setMode(Voice.Mode.SOFT)
					]
				});
				stave.addClef('treble');
				if (selectedNote) {
					stave.addKeySignature(selectedNote);
				}
				f.draw();
			} catch (error) {
				console.error('Error rendering test chord:', error);
			}
			return;
		}

		console.debug('Rendering score with notes:', { stringLeftHand, stringRightHand });

		try {
			if (rightHand && rightHand.length > 0 && stringRightHand) {
				const stave = system.addStave({
					voices: [
						score
							.voice(score.notes(stringRightHand, { clef: 'treble', stem: 'up' }))
							.setMode(Voice.Mode.SOFT)
					]
				});
				stave.addClef('treble');
				if (selectedNote) {
					stave.addKeySignature(selectedNote);
				}
			}

			if (leftHand && leftHand.length > 0 && stringLeftHand) {
				const stave = system.addStave({
					voices: [
						score
							.voice(score.notes(stringLeftHand, { clef: 'bass', stem: 'down' }))
							.setMode(Voice.Mode.SOFT)
					]
				});
				stave.addClef('bass');
				if (selectedNote) {
					stave.addKeySignature(selectedNote);
				}
			}

			// Only add connectors if we have both hands
			if (rightHand && rightHand.length > 0 && leftHand && leftHand.length > 0) {
				system.addConnector('brace');
				system.addConnector('singleRight');
				system.addConnector('singleLeft');
			}

			f.draw();
		} catch (error) {
			console.error('Error rendering VexFlow score:', error);
		}
	}
	$effect(() => {
		// This effect will re-run whenever leftHand, rightHand, or selectedNote changes
		console.debug('Score $effect triggered with props:', { leftHand, rightHand, selectedNote });
		// Add a small delay to ensure DOM is ready
		setTimeout(() => {
			const container = document.getElementById('score-container');
			if (container) {
				const width = container.getBoundingClientRect().width;
				if (width > 0) {
					// Ensure container has dimensions
					renderScore(width);
				}
			}
		}, 100);
	});
	onMount(() => {
		const handleResize = () => {
			const container = document.getElementById('score-container');
			if (container) {
				const width = container.getBoundingClientRect().width;
				console.debug(`Container width: ${width}`);
				if (width > 0) {
					renderScore(width);
				}
			}
		};

		window.addEventListener('resize', handleResize);

		// Clean up event listener
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<div id="score-container">
	<canvas id="output"></canvas>
</div>

<style>
	#score-container {
		width: 100%;
		height: 340px;
		overflow-x: auto;
		overflow-y: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
		background: white;
		border-radius: 8px;
		border: 1px solid #e1e5e9;
	}
	#output {
		width: 100%;
		max-width: 100%;
		height: auto;
		display: block;
	}
	@media (max-width: 768px) {
		#score-container {
			height: 280px;
			border-radius: 6px;
		}
		#output {
			max-width: none;
			min-width: 300px;
		}
	}
	@media (max-width: 480px) {
		#score-container {
			height: 240px;
			border-radius: 4px;
			overflow-x: scroll;
			-webkit-overflow-scrolling: touch;
			scrollbar-width: thin;
		}
		#output {
			min-width: 280px;
		}
	}
	@media (max-width: 360px) {
		#score-container {
			height: 200px;
		}
		#output {
			min-width: 260px;
		}
	}
</style>
