import { test, expect } from '@playwright/test';
import { playMidiNote } from '../midi-helper';

test.describe('Ghost Note Challenge Exercise', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/exercises/ghost-notes');
		await page.waitForSelector('.exercise-main', { timeout: 10_000 });
	});

	test('should display exercise UI elements', async ({ page }) => {
		await expect(page.locator('h1')).toContainText('Ghost Note Challenge');
		await expect(page.locator('.velocity-guide')).toBeVisible();
		await expect(page.locator('.stats-grid')).toBeVisible();
		await expect(page.locator('.ghost')).toContainText('Ghost Notes');
		await expect(page.locator('.accent')).toContainText('Accents');
	});

	test('should validate soft ghost notes on downbeats (velocity < 40)', async ({ page }) => {
		// Play a ghost note (soft, velocity 30)
		await playMidiNote(page, 60, 30); // C4, soft
		
		// Should show ghost note success
		await expect(page.locator('.feedback-toast')).toContainText('Ghost note', { timeout: 5_000 });
		
		// Stats should update
		await expect(page.locator('.stat-card:has-text("Ghost Notes") .stat-value')).toHaveText('1');
	});

	test('should validate accented notes on upbeats (velocity > 80)', async ({ page }) => {
		// First play ghost note to get to upbeat
		await playMidiNote(page, 60, 30);
		
		// Then play accent
		await playMidiNote(page, 62, 90); // D4, loud
		
		// Should show accent success
		await expect(page.locator('.feedback-toast')).toContainText('Accent', { timeout: 5_000 });
		
		// Stats should update
		await expect(page.locator('.stat-card:has-text("Accents") .stat-value')).toHaveText('1');
	});

	test('should reject notes with wrong articulation', async ({ page }) => {
		// Play too loud on downbeat (should be ghost)
		await playMidiNote(page, 60, 90);
		
		// Should show articulation error
		await expect(page.locator('.feedback-toast')).toContainText('Wrong articulation', { timeout: 5_000 });
		await expect(page.locator('.feedback-toast')).toContainText('Ghost note');
	});

	test('should track accuracy percentage', async ({ page }) => {
		// Play some notes
		await playMidiNote(page, 60, 30); // Correct ghost
		await playMidiNote(page, 62, 90); // Correct accent
		await playMidiNote(page, 64, 30); // Correct ghost
		
		// Check accuracy display
		const accuracyText = await page.locator('.stat-card:has-text("Accuracy") .stat-value').textContent();
		expect(parseInt(accuracyText || '0')).toBeGreaterThan(0);
	});

	test('should complete after target number of notes', async ({ page }) => {
		// Play 16 notes alternating ghost/accent
		for (let i = 0; i < 16; i++) {
			const isDownbeat = i % 2 === 0;
			const velocity = isDownbeat ? 30 : 90;
			const note = 60 + (i % 7); // Scale notes
			await playMidiNote(page, note, velocity);
			await page.waitForTimeout(100);
		}
		
		// Should show completion
		await expect(page.locator('.lesson-complete-modal, .completion-celebration')).toBeVisible({ timeout: 5_000 });
	});

	test('should change key with note selector', async ({ page }) => {
		// Change to G
		await page.selectOption('#note-select', 'G');
		await page.waitForTimeout(500);
		
		// Should update scale
		await expect(page.locator('#note-select')).toHaveValue('G');
		
		// Play should still work
		await playMidiNote(page, 67, 30); // G4 (root of G scale)
		await expect(page.locator('.feedback-toast')).toContainText('Ghost', { timeout: 5_000 });
	});
});
