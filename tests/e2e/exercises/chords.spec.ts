import { test, expect } from '@playwright/test';

test.describe('Chords Exercise', () => {
	test('should load exercise UI', async ({ page }) => {
		await page.goto('/exercises/chords');
		await page.waitForSelector('.exercise-main', { timeout: 10_000 });
		await expect(page.locator('h1')).toBeVisible();
		await expect(page.locator('#note-select')).toBeVisible();
	});

	test('should allow note and chord selection', async ({ page }) => {
		await page.goto('/exercises/chords');
		await page.waitForSelector('.exercise-main', { timeout: 10_000 });
		
		// Change note
		await page.locator('#note-select').selectOption('G');
		await page.waitForTimeout(500);
		
		// Page should still be functional
		await expect(page.locator('.exercise-main')).toBeVisible();
	});
});

