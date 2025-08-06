<script lang="ts">
	import { onMount } from 'svelte';
	import { Factory, Renderer, Voice } from 'vexflow';
	import type { Note, NoteFullName } from '../lib/midi/midi';
	interface ScoreProps {
		leftHand: NoteFullName[][];
		rightHand: NoteFullName[][];
		selectedNote: Note;
	}
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
		const f: Factory = new Factory({
			renderer: {
				elementId: 'output',
				backend: Renderer.Backends.CANVAS,
				width: Math.max(300, width),
				height: height
			}
		});
		const score = f.EasyScore({ throwOnError: true });
		score.set({ stem: 'up' });
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
		if (rightHand && rightHand.length > 0) {
			system
				.addStave({
					voices: [
						score
							.voice(score.notes(stringRightHand, { clef: 'treble', stem: 'up' }))
							.setMode(Voice.Mode.SOFT)
					]
				})
				.addClef('treble')
				.addKeySignature(selectedNote);
		}
		if (leftHand && leftHand.length > 0) {
			system
				.addStave({
					voices: [
						score
							.voice(score.notes(stringLeftHand, { clef: 'bass', stem: 'down' }))
							.setMode(Voice.Mode.SOFT)
					]
				})
				.addClef('bass')
				.addKeySignature(selectedNote);
		}
		system.addConnector('brace');
		system.addConnector('singleRight');
		system.addConnector('singleLeft');
		f.draw();
	}
	$effect(() => {
		const container = document.getElementById('score-container');
		if (container) {
			renderScore(container.getBoundingClientRect().width);
		}
	});
	onMount(() => {
		window.addEventListener('resize', () => {
			const container = document.getElementById('score-container');
			if (container) {
				console.log(`Container width: ${container.getBoundingClientRect().width}`);
				renderScore(container.getBoundingClientRect().width);
			}
		});
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
