import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		headers: {
			// Explicitly allow Web MIDI API on all origins in dev
			'Permissions-Policy': 'midi=*, microphone=*'
		}
	},
	build: {
		chunkSizeWarningLimit: 1500
	}
});
