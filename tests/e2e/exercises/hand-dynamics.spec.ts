import { test, expect } from '@playwright/test';
import { playMidiNote, playMidiChord } from '../midi-helper';

test.describe('Hand Dynamics Exercise', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/exercises/hand-dynamics');
		await page.waitForSelector('.exercise-main', { timeout: 10_000 });
	});

	test('should display loudness meters', async ({ page }) => {
		await expect(page.locator('.meters-container')).toBeVisible();
		await expect(page.locator('.meter-row')).toHaveCount(2); // LH and RH
		await expect(page.locator('.meter-row:has-text("LH")')).toContainText('Comping');
		await expect(page.locator('.meter-row:has-text("RH")')).toContainText('Melody');
	});

	test('should validate LH soft velocity (< 50)', async ({ page }) => {
		// Play LH note (below middle C)
		await playMidiNote(page, 48, 40); // C3, soft
		
		await expect(page.locator('.feedback-toast')).toContainText('LH soft', { timeout: 5_000 });
		await expect(page.locator('.feedback-toast')).toContainText('✓');
	});

	test('should reject LH that is too loud (> 50)', async ({ page }) => {
		// Play LH note too loud
		await playMidiNote(page, 48, 80); // C3, too loud
		
		await expect(page.locator('.feedback-toast')).toContainText('LH too loud', { timeout: 5_000 });
		
		// "Too Loud" counter should increment
		const tooLoudCount = await page.locator('.stat-card:has-text("LH Too Loud") .stat-value').textContent();
		expect(parseInt(tooLoudCount || '0')).toBeGreaterThanOrEqual(1);
	});

	test('should validate RH strong velocity (> 80)', async ({ page }) => {
		// Play RH note loud
		await playMidiNote(page, 72, 100); // C5, strong
		
		await expect(page.locator('.feedback-toast')).toContainText('RH strong', { timeout: 5_000 });
		await expect(page.locator('.feedback-toast')).toContainText('✓');
	});

	test('should show RH too soft warning (< 80)', async ({ page }) => {
		// Play RH note too soft
		await playMidiNote(page, 72, 50); // C5, too soft
		
		await expect(page.locator('.feedback-toast')).toContainText('RH too soft', { timeout: 5_000 });
	});

	test('should display velocity indicators on meters', async ({ page }) => {
		// Play a note
		await playMidiNote(page, 60, 60);
		
		// Indicator should be visible
		await expect(page.locator('.meter-indicator')).toBeVisible();
	});

	test('should track balance score', async ({ page }) => {
		// Play correct LH
		await playMidiNote(page, 48, 40);
		
		// Play correct RH
		await playMidiNote(page, 72, 90);
		
		// Balance score should be displayed
		await expect(page.locator('.stat-card:has-text("Balance Score")')).toBeVisible();
	});

	test('should show hand-specific accuracy', async ({ page }) => {
		// Play some notes
		await playMidiNote(page, 48, 40); // Correct LH
		await playMidiNote(page, 72, 90); // Correct RH
		
		// Check LH accuracy
		const lhAccuracy = await page.locator('.meter-row:has-text("LH") .accuracy').textContent();
		expect(lhAccuracy).toContain('%');
		
		// Check RH accuracy
		const rhAccuracy = await page.locator('.meter-row:has-text("RH") .accuracy').textContent();
		expect(rhAccuracy).toContain('%');
	});
});
