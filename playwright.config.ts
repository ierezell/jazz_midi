import { defineConfig, devices } from '@playwright/test';
import process from 'process';

export default defineConfig({
	testDir: './tests/e2e',
	timeout: 30_000,
	expect: {
		timeout: 10_000
	},
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 1,
	workers: 1,
	reporter: process.env.CI ? 'html' : 'list',
	use: {
		baseURL: 'http://127.0.0.1:4173',
		trace: 'on-first-retry'
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'], channel: 'chrome' }
		}
	],
	webServer: {
		// start-dev-server.mjs kills any stale process on port 4173 before starting vite.
		// reuseExistingServer:true means: if a healthy vite is already up, just reuse it
		// (avoids the Windows EADDRINUSE race when the previous run's vite hasn't exited yet).
		command: 'node scripts/start-dev-server.mjs',
		url: 'http://127.0.0.1:4173',
		reuseExistingServer: true,
		timeout: 120_000
	}
});
