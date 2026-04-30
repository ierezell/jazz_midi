import { test, expect } from '@playwright/test';

test.describe('Rhythm Exercise', () => {
	test('page loads without errors', async ({ page }) => {
		const errors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				errors.push(msg.text());
			}
		});
		page.on('pageerror', (error) => {
			errors.push(`Page error: ${error.message}`);
		});

		await page.goto('/exercises/rhythm');
		await page.waitForSelector('.exercise-main', { timeout: 10_000 });

		await page.waitForTimeout(500);

		expect(errors).toHaveLength(0);
	});

	test('exercise UI loads', async ({ page }) => {
		await page.goto('/exercises/rhythm');
		await page.waitForSelector('.exercise-main', { timeout: 10_000 });
		await expect(page.locator('h1')).toBeVisible();
	});
});
