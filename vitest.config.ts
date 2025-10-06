import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
export default defineConfig({
	plugins: [sveltekit()],
	test: {
		// Include patterns: find test files inside src and also allow legacy root-level test-*.spec files
		include: ['src/**/*.spec.{js,ts}', 'src/**/*.test.{js,ts}'],
		environment: 'happy-dom',
		setupFiles: ['./tests/setup.ts'],
		globals: true,
		alias: {
			$app: '@sveltejs/kit/app',
			$env: '@sveltejs/kit/env'
		}
	}
});
