<!-- https://vexflow.github.io/vexflow-sandbox/?ver=5&file=minuet&dev=1 -->
<script lang="ts">
	import { Factory, Renderer, Registry, Voice } from 'vexflow';
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

	function renderScore(container: HTMLElement) {
		// Clear the existing score
		container.innerHTML = '';

		const containerWidth = container?.offsetWidth ?? 350;
		console.log(`Container width: ${containerWidth}`);
		const f: Factory = new Factory({
			renderer: {
				elementId: 'output',
				backend: Renderer.Backends.SVG,
				width: containerWidth,
				height: containerWidth // Adjust height as needed
			}
		});

		// Ensure the SVG resizes to fit the container
		const svg = container.querySelector('svg');
		if (svg) {
			svg.setAttribute('width', '100%');
			svg.setAttribute('height', 'auto');
			svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
		}

		const score = f.EasyScore({ throwOnError: true });
		score.set({ stem: 'up' });

		const system = f.System({
			width: containerWidth,
			autoWidth: true,
			spaceBetweenStaves: containerWidth / 35,
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
		const container = document.getElementById('output');
		if (container) {
			renderScore(container);
		}
	});
</script>

<div id="output">
	<svg></svg>
</div>

<style>
	#output {
		width: 100%; /* Make the container take full width */
		height: auto;
	}
	#output > svg {
		width: 100%;
	}
</style>
