<script lang="ts">
	import logo from '$lib/images/logo.png';
	import { midiManager } from '$lib/MIDIManager';
	import { onMount } from 'svelte';
	onMount(async () => {
		try {
			await midiManager.initialize();
			console.debug('MIDI Access obtained');
		} catch (error) {
			console.error('Failed to obtain MIDI Access:', error);
		}
	});

	let midiDevices = midiManager.getMIDIDevices().inputs;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
<section>
		<img style="width: 50%;" src={logo} alt="Svelte Logo" />
	<main>
		{#if midiManager.midiAccess}
			<div>
				<h2>MIDI Inputs</h2>
				{#if midiDevices.length > 0}
					<ul>
						{#each midiDevices as device}
							<li>{device.name}</li>
						{/each}
					</ul>
				{:else}
					<p>No MIDI inputs available.</p>
				{/if}
			</div>
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
		padding: 1rem;
		max-width: 100%;
	}
	h1 {
		width: 100%;
		text-align: center;
		margin-bottom: 1rem;
	}
	.welcome {
		display: block;
		position: relative;
		width: 100%;
		max-width: 400px;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
		margin: 0 auto;
	}
	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
		object-fit: contain;
	}
	main {
		font-family: Arial, sans-serif;
		text-align: center;
		margin: 1rem;
		width: 100%;
		max-width: 600px;
	}
	@media (max-width: 768px) {
		section {
			padding: 0.5rem;
		}
		.welcome {
			max-width: 300px;
		}
		h1 {
			font-size: 1.6rem;
			margin-bottom: 0.5rem;
		}
		main {
			margin: 0.5rem;
		}
	}
	@media (max-width: 480px) {
		section {
			padding: 0.25rem;
		}
		.welcome {
			max-width: 250px;
		}
		h1 {
			font-size: 1.4rem;
		}
		main {
			margin: 0.25rem;
		}
	}
	@media (max-width: 360px) {
		.welcome {
			max-width: 200px;
		}
		h1 {
			font-size: 1.2rem;
		}
	}
</style>
