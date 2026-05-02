import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
export default defineConfig({
	plugins: [sveltekit()],
	test: {
		// Include patterns: tests in tests/unit and src/lib
		include: [
			'tests/unit/**/*.{spec,test}.{js,ts}',
			'src/**/*.{spec,test}.{js,ts}'
		],
		environment: 'happy-dom',
		setupFiles: ['./tests/setup.ts'],
		globals: true,
		alias: {
			$app: '@sveltejs/kit/app',
			$env: '@sveltejs/kit/env'
		}
	}
});
