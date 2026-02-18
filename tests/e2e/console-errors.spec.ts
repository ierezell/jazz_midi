import { test, expect } from '@playwright/test';

const ROUTES = [
	'/',
	'/journey',
	'/exercises/two_five_ones',
	'/exercises/scales',
	'/exercises/chords',
	'/exercises/intervals',
	'/exercises/songs',
	'/exercises/licks',
	'/exercises/names',
	'/exercises/partition',
	'/exercises/rhythm',
	'/exercises/flashcards',
	'/exercises/dexterity',
	'/exercises',
	'/profile'
];

test.describe('Console Error Detection', () => {
	test('home page should have no console errors', async ({ page }) => {
		const errors: string[] = [];

		// Listen for console errors
		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				errors.push(msg.text());
			}
		});

		// Listen for page errors
		page.on('pageerror', (error) => {
			errors.push(error.message);
		});

		await page.goto('/');
		await page.waitForLoadState('domcontentloaded');

		// Check for errors
		if (errors.length > 0) {
			console.log('Console errors found:', errors);
		}
		expect(errors).toHaveLength(0);
	});

	for (const route of ROUTES) {
		test(`${route} should have no console errors`, async ({ page }) => {
			const errors: string[] = [];
			const warnings: string[] = [];

			// Listen for console errors and warnings
			page.on('console', (msg) => {
				if (msg.type() === 'error') {
					errors.push(msg.text());
				} else if (msg.type() === 'warning') {
					warnings.push(msg.text());
				}
			});

			// Listen for page errors (uncaught exceptions)
			page.on('pageerror', (error) => {
				errors.push(`Uncaught exception: ${error.message}`);
			});

			// Listen for failed requests (404s, 500s, etc.)
			page.on('response', (response) => {
				if (response.status() >= 400) {
					errors.push(
						`Failed request: ${response.url()} (${response.status()} ${response.statusText()})`
					);
				}
			});

			await page.goto(route);
			await page.waitForLoadState('domcontentloaded');

			// Give the page some time to potentially log errors
			await page.waitForTimeout(1000);

			// Report findings
			if (errors.length > 0) {
				console.log(`Errors on ${route}:`, errors);
			}
			if (warnings.length > 0) {
				console.log(`Warnings on ${route}:`, warnings);
			}

			// Assert no errors (warnings are logged but don't fail the test)
			expect(errors, `Expected no console errors on ${route}`).toHaveLength(0);
		});
	}
});

test.describe('Resource Loading', () => {
	test('all routes should load without 404 errors', async ({ page }) => {
		const failedRequests: Array<{ url: string; status: number }> = [];

		page.on('response', (response) => {
			if (response.status() === 404) {
				failedRequests.push({
					url: response.url(),
					status: response.status()
				});
			}
		});

		for (const route of ROUTES) {
			await page.goto(route);
			await page.waitForLoadState('domcontentloaded');
		}

		if (failedRequests.length > 0) {
			console.log('404 errors found:', failedRequests);
		}
		expect(failedRequests).toHaveLength(0);
	});
});

test.describe('JavaScript Errors', () => {
	test('should not have unhandled promise rejections', async ({ page }) => {
		const errors: string[] = [];

		// Capture unhandled promise rejections
		await page.addInitScript(() => {
			window.addEventListener('unhandledrejection', (event) => {
				console.error('Unhandled promise rejection:', event.reason);
			});
		});

		page.on('console', (msg) => {
			if (msg.type() === 'error' && msg.text().includes('Unhandled promise rejection')) {
				errors.push(msg.text());
			}
		});

		// Test a few key routes
		const criticalRoutes = ['/', '/journey', '/exercises/flashcards', '/exercises/dexterity'];

		for (const route of criticalRoutes) {
			await page.goto(route);
			await page.waitForLoadState('domcontentloaded');
			await page.waitForTimeout(500);
		}

		expect(errors).toHaveLength(0);
	});
});
