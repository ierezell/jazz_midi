import { test, expect } from '@playwright/test';

test.describe('Enclosure Drill Exercise', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/exercises/enclosure');
		await page.waitForSelector('.exercise-main', { timeout: 10_000 });
	});

	test('should display exercise UI', async ({ page }) => {
		await expect(page.locator('h1')).toBeVisible();
		await expect(page.locator('.exercise-main')).toContainText('Enclosure');
	});

	test('should display exercise description', async ({ page }) => {
		await expect(page.locator('.exercise-main')).toContainText(/enclosure|pattern|target/i);
	});
});
