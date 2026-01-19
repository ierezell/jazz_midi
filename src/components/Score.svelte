<script lang="ts">
	import type { NoteFullName } from '$lib/types/notes';
	import type { ScoreProps } from '$lib/types/types';
	import { onMount } from 'svelte';

	let { leftHand, rightHand, selectedNote }: ScoreProps = $props();

	// Dynamically import VexFlow to reduce initial bundle size
	let VexFlow: typeof import('vexflow') | null = null;
	let isVexFlowLoaded = $state(false);

	onMount(async () => {
		VexFlow = await import('vexflow');
		isVexFlowLoaded = true;
	});

	// VexFlow expects scientific pitch where middle C is C4 and prefers accidentals
	// consistent with the key signature. Our app maps MIDI 60 to 'C3', so convert
	// note octave to VexFlow convention by adding 1 to the octave number and
	// choose flats vs sharps according to the selected key.
	const FLAT_KEYS = new Set(['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb']);
	const SHARP_TO_FLAT: Record<string, string> = {
		'A#': 'Bb',
		'C#': 'Db',
		'D#': 'Eb',
		'F#': 'Gb',
		'G#': 'Ab',
		'E#': 'F',
		'B#': 'C'
	};

	function prefersFlats(key: string): boolean {
		if (key.includes('b')) return true;
		return FLAT_KEYS.has(key);
	}

	function toValidKeySignature(key: string): string {
		// VexFlow doesn't support certain sharp keys as key signatures
		// Convert them to their flat equivalents
		const KEY_SIGNATURE_CONVERSIONS: Record<string, string> = {
			'A#': 'Bb',
			'C#': 'Db',
			'D#': 'Eb',
			'F#': 'Gb',
			'G#': 'Ab'
		};

		return KEY_SIGNATURE_CONVERSIONS[key] || key;
	}

	function toVexflow(note: NoteFullName): string {
		const match = /(.*?)(\d+)$/.exec(note);
		if (!match) return note;
		let base = match[1];
		const octave = parseInt(match[2], 10);

		// VexFlow has issues with certain sharp notes like A#, D#, and G#
		// Always convert these problematic sharps to their flat equivalents
		if (base === 'A#' || base === 'D#' || base === 'G#') {
			base = SHARP_TO_FLAT[base] ?? base;
		} else if (prefersFlats(selectedNote) && base.includes('#')) {
			// For other sharps, only convert if the key signature prefers flats
			base = SHARP_TO_FLAT[base] ?? base;
		}

		return `${base}${octave + 1}` as NoteFullName;
	}

	const fmt = (group: NoteFullName[][]) =>
		group
			?.map((chord) =>
				chord.length > 1 ? `(${chord.map((n) => toVexflow(n)).join(' ')})` : toVexflow(chord[0])
			)
			.join(', ') || '';

	let stringRightHand = $derived(fmt(rightHand));
	let stringLeftHand = $derived(fmt(leftHand));

	function renderScore(width: number) {
		if (!VexFlow || !isVexFlowLoaded) return;

		const { Factory, Renderer, Voice } = VexFlow;

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
				height: Math.max(200, height)
			}
		});

		const score = f.EasyScore({ throwOnError: false });

		const spaceBetweenStaves = isMobile ? 10 : 20;
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
			// Render a test C major chord for debugging (use octave 3 as default)
			const testRightHand = `${toVexflow('C3')}, ${toVexflow('E3')}, ${toVexflow('G3')}`;
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
					stave.addKeySignature(toValidKeySignature(selectedNote));
				}
				f.draw();
			} catch (error) {
				console.error('Error rendering test chord:', error);
			}
			return;
		}

		console.debug('Rendering score with notes:', { stringLeftHand, stringRightHand });
		console.debug('Selected note for key signature:', selectedNote);

		try {
			if (rightHand && rightHand.length > 0 && stringRightHand) {
				const trebleStave = system.addStave({
					voices: [
						score
							.voice(score.notes(stringRightHand, { clef: 'treble', stem: 'up' }))
							.setMode(Voice.Mode.SOFT)
					]
				});
				trebleStave.addClef('treble');
				if (selectedNote) {
					trebleStave.addKeySignature(toValidKeySignature(selectedNote));
				}
			}

			if (leftHand && leftHand.length > 0 && stringLeftHand) {
				const bassStave = system.addStave({
					voices: [
						score
							.voice(score.notes(stringLeftHand, { clef: 'bass', stem: 'down' }))
							.setMode(Voice.Mode.SOFT)
					]
				});
				bassStave.addClef('bass');
				if (selectedNote) {
					bassStave.addKeySignature(toValidKeySignature(selectedNote));
				}
			}

			// Only add connectors if we have both hands
			if (rightHand && rightHand.length > 0 && leftHand && leftHand.length > 0) {
				system.addConnector('brace');
				system.addConnector('single');
			}

			f.draw();
		} catch (error) {
			console.error('Error rendering VexFlow score:', error);
		}
	}
	$effect(() => {
		// Wait for VexFlow to load before rendering
		if (!isVexFlowLoaded) return;

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
		min-height: 240px;
		max-height: 400px;
		height: auto;
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
			min-height: 200px;
			max-height: 340px;
			border-radius: 6px;
		}
		#output {
			max-width: none;
			min-width: 300px;
		}
	}
	@media (max-width: 480px) {
		#score-container {
			min-height: 180px;
			max-height: 300px;
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
			min-height: 160px;
			max-height: 260px;
		}
		#output {
			min-width: 260px;
		}
	}
</style>
