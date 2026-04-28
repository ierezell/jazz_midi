import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
export default defineConfig({
	plugins: [sveltekit()],
	test: {
		// Include patterns: tests in tests/unit and src/lib
		include: [
			'tests/unit/**/*.spec.{js,ts}',
			'tests/unit/**/*.test.{js,ts}',
			'src/**/*.spec.{js,ts}',
			'src/**/*.test.{js,ts}'
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
