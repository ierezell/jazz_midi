import { test, expect } from '@playwright/test';
import { playMidiNote } from '../midi-helper';

test.describe('Interval Mimicry Exercise', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/exercises/interval-mimicry');
		await page.waitForSelector('.exercise-main', { timeout: 10_000 });
	});

	test('should display exercise UI', async ({ page }) => {
		await expect(page.locator('h1')).toContainText('Interval Mimicry');
		await expect(page.locator('.controls')).toBeVisible();
		await expect(page.locator('.play-btn')).toBeVisible();
	});

	test('should play interval when clicking hear button', async ({ page }) => {
		await page.locator('.play-btn').click();
		
		// Should show playing state
		await expect(page.locator('.play-btn')).toContainText('Playing', { timeout: 5_000 });
		
		// After playback, should show "Play back" prompt
		await expect(page.locator('.prompt')).toContainText('Play back', { timeout: 10_000 });
	});

	test('should validate correct interval playback', async ({ page }) => {
		// Start a round
		await page.locator('.play-btn').click();
		await page.waitForTimeout(2000); // Wait for interval to play
		
		// Play the interval back (C4 and E4 = major 3rd)
		await playMidiNote(page, 60, 80); // Root
		await page.waitForTimeout(200);
		await playMidiNote(page, 64, 80); // Major 3rd
		
		// Should show correct feedback
		await expect(page.locator('.feedback-toast')).toContainText('Correct', { timeout: 5_000 });
	});

	test('should track round progress', async ({ page }) => {
		// Check initial round display
		await expect(page.locator('.stat-card:has-text("Round")')).toContainText('0 / 10');
		
		// Complete one round
		await page.locator('.play-btn').click();
		await page.waitForTimeout(2000);
		await playMidiNote(page, 60, 80);
		await page.waitForTimeout(200);
		await playMidiNote(page, 64, 80);
		
		// Round should increment
		await expect(page.locator('.stat-card:has-text("Round")')).toContainText('1 / 10', { timeout: 5_000 });
	});

	test('should show accuracy percentage', async ({ page }) => {
		await expect(page.locator('.stat-card:has-text("Accuracy")')).toBeVisible();
	});

	test('should complete after 10 intervals', async ({ page }) => {
		// Skip by completing rounds
		for (let i = 0; i < 10; i++) {
			await page.locator('.play-btn').click();
			await page.waitForTimeout(1500);
			
			// Play any interval (might be wrong, but test completion flow)
			await playMidiNote(page, 60, 80);
			await page.waitForTimeout(200);
			await playMidiNote(page, 62, 80);
			await page.waitForTimeout(1000);
		}
		
		// Should show completion
		await expect(page.locator('.lesson-complete-modal, .completion-celebration')).toBeVisible({ timeout: 10_000 });
	});

	test('should reveal interval name after correct answer', async ({ page }) => {
		await page.locator('.play-btn').click();
		await page.waitForTimeout(2000);
		
		// Play correct interval
		await playMidiNote(page, 60, 80);
		await page.waitForTimeout(200);
		await playMidiNote(page, 64, 80);
		
		// Should show interval name in feedback
		const feedback = await page.locator('.feedback-toast').textContent();
		expect(feedback).toMatch(/Major|Minor|Perfect|Tritone/);
	});
});
