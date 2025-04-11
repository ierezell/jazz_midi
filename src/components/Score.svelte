<!-- https://vexflow.github.io/vexflow-sandbox/?ver=5&file=minuet&dev=1 -->
<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Factory,
		Renderer,
		Stave,
		StaveNote,
		Voice,
		Formatter,
		EasyScore,
		Builder,
		BarlineType,
		Registry
	} from 'vexflow';

	onMount(() => {
		const concat = (a: any[], b: any[]): any[] => a.concat(b);
		const id = (id: string) => registry.getElementById(id) as StaveNote;
		function appendSystem(width: number) {
			const system = f.System({ x, y, width, spaceBetweenStaves: 10 });
			x += width;
			return system;
		}

		const registry = new Registry();
		Registry.enableDefaultRegistry(registry);

		const f: Factory = new Factory({
			renderer: { elementId: 'output', backend: Renderer.Backends.SVG, width: 1100, height: 900 }
		});

		const score = f.EasyScore({ throwOnError: true });
		let x = 120;
		let y = 80;

		score.set({ time: '3/4' });

		/*  Measure 1 */
		let system = appendSystem(220);
		system
			.addStave({
				voices: [
					score.voice(
						[
							score.notes('D5/q[id="m1a"]'),
							score.beam(score.notes('G4/8, A4, B4, C5', { stem: 'up' }))
						].reduce(concat)
					),
					score.voice([f.TextDynamics({ text: 'p', duration: 'h', dots: 1, line: 9 })])
				]
			})
			.addClef('treble')
			.addKeySignature('G')
			.addTimeSignature('3/4')
			.setTempo({ name: 'Allegretto', duration: 'h', dots: 1, bpm: 66 }, -30);

		system
			.addStave({ voices: [score.voice(score.notes('(G3 B3 D4)/h, A3/q', { clef: 'bass' }))] })
			.addClef('bass')
			.addKeySignature('G')
			.addTimeSignature('3/4');

		system.addConnector('brace');
		system.addConnector('singleRight');
		system.addConnector('singleLeft');
		id('m1a').addModifier(f.Fingering({ number: '5' }), 0);

		/*  Measure 2 */
		system = appendSystem(150);
		system.addStave({
			voices: [score.voice(score.notes('D5/q[id="m2a"], G4[id="m2b"], G4[id="m2c"]'))]
		});
		system.addStave({ voices: [score.voice(score.notes('B3/h.', { clef: 'bass' }))] });
		system.addConnector('singleRight');

		id('m2a').addModifier(f.Articulation({ type: 'a.', position: 'above' }), 0);
		id('m2b').addModifier(f.Articulation({ type: 'a.', position: 'below' }), 0);
		id('m2c').addModifier(f.Articulation({ type: 'a.', position: 'below' }), 0);

		f.draw();

		// // Create an SVG renderer and attach it to the DIV element with id="output".
		// const div = document.getElementById('output');
		// const renderer = new Renderer(div, Renderer.Backends.SVG);

		// // Configure the rendering context.
		// renderer.resize(500, 500);
		// const context = renderer.getContext();

		// // Create a stave of width 400 at position 10, 40.
		// const stave = new Stave(10, 40, 400);

		// // Add a clef and time signature.
		// stave.addClef('treble').addTimeSignature('4/4');

		// // Connect it to the rendering context and draw!
		// stave.setContext(context).draw();

		// // Create an array of notes
		// const notes = [
		// 	new StaveNote({ keys: ['c/4'], duration: 'h', autoStem: true }),
		// 	// new StaveNote({ keys: ['d/4'], duration: 'h' })
		// 	new StaveNote({ keys: ['e/4', 'g/4'], duration: 'q' }),
		// 	new StaveNote({ keys: ['f/4'], duration: 'q' }),
		// 	new StaveNote({ keys: ['c/4'], duration: 'h', autoStem: true }),
		// 	// new StaveNote({ keys: ['d/4'], duration: 'h' })
		// 	new StaveNote({ keys: ['e/4', 'g/4'], duration: 'q' }),
		// 	new StaveNote({ keys: ['f/4'], duration: 'q' })
		// ];

		// // Create a voice in 4/4 and add the notes
		// // const voice = new Voice({ numBeats: 8, beatValue: 8 });
		// const voice = new Voice({ numBeats: 8, beatValue: 4 });
		// voice.addTickables(notes);

		// // Format and justify the notes to 400 pixels
		// new Formatter().joinVoices([voice]).format([voice], 400);

		// // Render the voice
		// voice.draw(context, stave);
	});
</script>

<div id="output"></div>

<style>
	#output {
		width: 100%;
	}
</style>
