<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import github from '$lib/images/github.svg';
	import logo from '$lib/images/svelte-logo.svg';
	import '../app.css';
	let { children } = $props();
</script>

<div class="app">
	<header>
		<div class="corner">
			<a href="https://svelte.dev/docs/kit">
				<img src={logo} alt="SvelteKit" />
			</a>
		</div>

		<nav>
			<svg viewBox="0 0 2 3" aria-hidden="true">
				<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
			</svg>
			<ul>
				<li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
					<a href="{base}/">Home</a>
				</li>
				<li aria-current={page.url.pathname === '/about' ? 'page' : undefined}>
					<a href="{base}/about">About</a>
				</li>
				<li aria-current={page.url.pathname.startsWith('/random') ? 'page' : undefined}>
					<a href="{base}/random">🎲 Random</a>
				</li>
				<li aria-current={page.url.pathname.startsWith('/two_fives_ones') ? 'page' : undefined}>
					<a href="{base}/two_five_ones">II-V-I</a>
				</li>
				<li aria-current={page.url.pathname.startsWith('/scales') ? 'page' : undefined}>
					<a href="{base}/scales">Scales</a>
				</li>
				<li aria-current={page.url.pathname.startsWith('/chords') ? 'page' : undefined}>
					<a href="{base}/chords">Chords</a>
				</li>
			</ul>
			<svg viewBox="0 0 2 3" aria-hidden="true">
				<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
			</svg>
		</nav>

		<div class="corner">
			<a href="https://github.com/sveltejs/kit">
				<img src={github} alt="GitHub" />
			</a>
		</div>
	</header>

	<main>
		{@render children()}
	</main>

	<footer>
		<p>
			Go to <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to learn about SvelteKit
		</p>
	</footer>
</div>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}

	/* Mobile responsiveness */
	@media (max-width: 768px) {
		header {
			padding: 0 1rem;
		}

		.corner {
			width: 2.5em;
			height: 2.5em;
		}

		.corner img {
			width: 1.5em;
			height: 1.5em;
		}

		nav {
			flex: 1;
			margin: 0 0.5rem;
		}

		nav a {
			padding: 0 0.3rem;
			font-size: 0.7rem;
		}

		main {
			padding: 0.5rem;
			max-width: 100%;
		}

		svg {
			width: 1.5em;
			height: 2.5em;
		}
	}

	@media (max-width: 480px) {
		nav a {
			padding: 0 0.2rem;
			font-size: 0.65rem;
		}

		.corner {
			width: 2em;
			height: 2em;
		}

		.corner img {
			width: 1.2em;
			height: 1.2em;
		}

		ul {
			height: 2.5em;
		}
	}
</style>
