/**
 * Playwright Configuration for Jazz MIDI E2E Tests
 *
 * To use these E2E tests:
 * 1. Install Playwright: npm install --save-dev @playwright/test
 * 2. Install browsers: npx playwright install
 * 3. Run tests: npx playwright test
 */

// Uncomment when Playwright is installed:
/*
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: 'html',
  
  // Shared settings for all tests
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: 'http://localhost:4173', // Vite preview port
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Capture screenshot on failure
    screenshot: 'only-on-failure',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Mobile testing
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run preview',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
});
*/

// Alternative: Simple test runner setup for E2E tests without Playwright
export const e2eConfig = {
	baseURL: 'http://localhost:4173',
	timeout: 30000,
	browsers: ['chromium', 'firefox', 'webkit'],
	mobile: ['iPhone', 'Pixel'],

	// Test categories
	tests: {
		smoke: ['home', 'navigation', 'basic-interaction'],
		regression: ['chord-exercise', 'scale-exercise', 'progression-exercise'],
		accessibility: ['keyboard-nav', 'screen-reader', 'aria-compliance'],
		performance: ['load-time', 'interaction-speed', 'memory-usage'],
		responsive: ['mobile', 'tablet', 'desktop']
	}
};
