<script lang="ts">
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcomeFallback from '$lib/images/svelte-welcome.png';
	import { onMount } from 'svelte';
	import { RequestMidiAccess } from '../midi/midi';
	import MidiDisplay from '../components/MidiDisplay.svelte';
  
	let midiAccess:MIDIAccess;
  
	onMount(async () => {
		try {
			midiAccess = await RequestMidiAccess();
			console.log('MIDI Access obtained:', midiAccess);
		} catch (error) {
			console.error('Failed to obtain MIDI Access:', error);
		}
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		<span class="welcome">
			<picture>
				<source srcset={welcome} type="image/webp" />
				<img src={welcomeFallback} alt="Welcome" />
			</picture>
		</span>

		to the jazz <br />midi app
	</h1>
	<main>
		<h1>Jazz MIDI</h1>
		{#if midiAccess}
		  <MidiDisplay {midiAccess} />
		{:else}
		  <p>Loading MIDI Access...</p>
		{/if}
	</main>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
	main {
  font-family: Arial, sans-serif;
  text-align: center;
  margin: 2rem;
}
</style>




