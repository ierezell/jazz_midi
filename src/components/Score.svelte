<!-- https://vexflow.github.io/vexflow-sandbox/?ver=5&file=minuet&dev=1 -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { Factory, Renderer, Voice } from 'vexflow';
	import type { Note, NoteFullName } from '../midi/midi';

	interface ScoreProps {
		leftHand: NoteFullName[][];
		rightHand: NoteFullName[][];
		selectedNote: Note;
	}
	let { leftHand, rightHand, selectedNote }: ScoreProps = $props();
	const fmt = (group: NoteFullName[][]) =>
		group.map((chord) => (chord.length > 1 ? `(${chord.join(' ')})` : chord[0])).join(', ');

	let stringRightHand = $derived(fmt(rightHand));
	let stringLeftHand = $derived(fmt(leftHand));

	function renderScore(width: number) {
		const f: Factory = new Factory({
			renderer: {
				elementId: 'output',
				backend: Renderer.Backends.CANVAS,
				width: width,
				height: 340
			}
		});

		const score = f.EasyScore({ throwOnError: true });
		score.set({ stem: 'up' });

		const system = f.System({
			width: width,
			// autoWidth: true,
			// spaceBetweenStaves: width / 35,
			noPadding: true,
			noJustification: true,
			formatOptions: {
				alignRests: true,
				autoBeam: true
			}
		});
		if (rightHand.length > 0) {
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

		if (leftHand.length > 0) {
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
			// debugger;
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
	#score-container{
		width: 100%;
		height: 340px;
	}
	#output {
		width: 100%;
	}
</style>
