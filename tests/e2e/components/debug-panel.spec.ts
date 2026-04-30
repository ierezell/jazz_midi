import { test, expect } from '@playwright/test';

test.describe('Debug Panel', () => {
	test('should show debug panel toggle button on exercise pages', async ({ page }) => {
		await page.goto('/exercises/chords');
		await page.waitForSelector('.exercise-main', { timeout: 10_000 });

		// Debug toggle button should be visible
		await expect(page.locator('#debug-toggle')).toBeVisible();
	});
});
