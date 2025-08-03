<script lang="ts">
	export let midiAccess: MIDIAccess | null = null;
</script>

<div>
	<h2>MIDI Inputs</h2>
	{#if midiAccess}
		<ul>
			{#each Array.from(midiAccess.inputs.values()) as input}
				<li>{input.name}</li>
			{/each}
		</ul>
	{:else}
		<p>No MIDI inputs available.</p>
	{/if}
</div>

<style>
	div {
		margin: 1rem;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 8px;
		max-width: 100%;
		box-sizing: border-box;
	}

	h2 {
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
	}

	ul {
		list-style-type: none;
		padding: 0;
	}

	li {
		margin: 0.5rem 0;
		word-break: break-word;
	}

	@media (max-width: 768px) {
		div {
			margin: 0.5rem;
			padding: 0.75rem;
			border-radius: 6px;
		}

		h2 {
			font-size: 1.3rem;
		}

		li {
			margin: 0.4rem 0;
			font-size: 0.9rem;
		}
	}

	@media (max-width: 480px) {
		div {
			margin: 0.25rem;
			padding: 0.5rem;
			border-radius: 4px;
		}

		h2 {
			font-size: 1.2rem;
		}

		li {
			margin: 0.3rem 0;
			font-size: 0.85rem;
		}
	}
</style>
