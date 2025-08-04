import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}', 'test/**/*.{test,spec}.{js,ts}'],
		environment: 'happy-dom',
		setupFiles: ['./src/test/setup.ts'],
		globals: true,
		alias: {
			'$app': '@sveltejs/kit/app',
			'$env': '@sveltejs/kit/env'
		}
	}
});
