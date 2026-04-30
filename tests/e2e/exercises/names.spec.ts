import { test, expect } from '@playwright/test';

test.describe('Names Exercise', () => {
	test('should load exercise UI', async ({ page }) => {
		await page.goto('/exercises/names');
		await page.waitForSelector('.exercise-main', { timeout: 10_000 });
		await expect(page.locator('h1')).toBeVisible();
	});
});
