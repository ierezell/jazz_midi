import { test, expect } from '@playwright/test';
import { playMidiNote } from '../midi-helper';

test.describe('Hand Dynamics Exercise', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/exercises/hand-dynamics');
		await page.waitForSelector('.exercise-main', { timeout: 10_000 });
	});

	test('should load exercise UI', async ({ page }) => {
		await expect(page.locator('h1')).toBeVisible();
		await expect(page.locator('.exercise-main')).toBeVisible();
	});

	test('should provide feedback on MIDI input', async ({ page }) => {
		// Play a note
		await playMidiNote(page, 60, 60);

		// Feedback should appear
		await expect(page.locator('.feedback-toast')).toBeVisible({ timeout: 5_000 });
	});
});
