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

	$effect(() => {
		const container = document.getElementById('output');
		if (container) {
			container.innerHTML = '';
		}

		const f: Factory = new Factory({
			renderer: { elementId: 'output', backend: Renderer.Backends.SVG, width: 600, height: 400 }
		});

		const score = f.EasyScore({ throwOnError: true });
		score.set({ time: '4/4', stem: 'up' });

		let x = 120;
		let y = 80;

		function appendSystem(width: number) {
			const system = f.System({ x, y, width, spaceBetweenStaves: 10 });
			x += width;
			return system;
		}

		let system = appendSystem(420);
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
				.addKeySignature(selectedNote)
				.addTimeSignature('4/4');
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
				.addKeySignature(selectedNote)
				.addTimeSignature('4/4');
		}
		system.addConnector('brace');
		system.addConnector('singleRight');
		system.addConnector('singleLeft');

		f.draw();
	});
</script>

<div id="output"></div>

<style>
	#output {
		width: 100%;
	}
</style>
