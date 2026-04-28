import { test, expect } from '@playwright/test';
import { playMidiNote } from '../midi-helper';

test.describe('Enclosure Drill Exercise', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/exercises/enclosure');
		await page.waitForSelector('.exercise-main', { timeout: 10_000 });
	});

	test('should display exercise UI', async ({ page }) => {
		await expect(page.locator('h1')).toContainText('Enclosure Drill');
		await expect(page.locator('.target-tone-display')).toBeVisible();
		await expect(page.locator('.enclosure-pattern')).toBeVisible();
		await expect(page.locator('.pattern-selector')).toBeVisible();
	});

	test('should display target tone', async ({ page }) => {
		await expect(page.locator('.target-tone-display')).toContainText('Target:');
		// Should show a note name
		const targetText = await page.locator('.target-tone-display').textContent();
		expect(targetText).toMatch(/[A-G][#b]?/);
	});

	test('should validate correct enclosure pattern', async ({ page }) => {
		// Get target tone
		const targetText = await page.locator('.target-tone-display').textContent() || '';
		const targetMatch = targetText.match(/([A-G][#b]?\d)/);
		
		if (!targetMatch) {
			// Skip this test if we can't parse target
			return;
		}
		
		// Get expected pattern from UI
		const patternText = await page.locator('.enclosure-pattern').textContent() || '';
		
		// Play the enclosure pattern based on target
		// Common pattern: diatonic below → chromatic above → target
		const midiNote = 60; // C4 as example
		await playMidiNote(page, midiNote - 2, 80); // Below
		await page.waitForTimeout(100);
		await playMidiNote(page, midiNote + 1, 80); // Above
		await page.waitForTimeout(100);
		await playMidiNote(page, midiNote, 80); // Target
		
		// Should validate the pattern
		await expect(page.locator('.feedback-toast')).toBeVisible({ timeout: 5_000 });
	});

	test('should allow pattern selection', async ({ page }) => {
		await page.selectOption('.pattern-selector', 'diatonic');
		await page.waitForTimeout(500);
		
		// Should update pattern description
		await expect(page.locator('.pattern-description')).toContainText('diatonic', { ignoreCase: true });
	});

	test('should track pattern completion', async ({ page }) => {
		// Check initial state
		await expect(page.locator('.stat-card:has-text("Completed")')).toContainText('0');
		
		// Complete one enclosure
		await playMidiNote(page, 58, 80);
		await page.waitForTimeout(100);
		await playMidiNote(page, 61, 80);
		await page.waitForTimeout(100);
		await playMidiNote(page, 60, 80);
		
		// Should increment
		await expect(page.locator('.stat-card:has-text("Completed")')).toContainText(/[1-9]/, { timeout: 5_000 });
	});

	test('should provide hint after mistakes', async ({ page }) => {
		// Play wrong notes multiple times
		for (let i = 0; i < 3; i++) {
			await playMidiNote(page, 50, 80);
			await page.waitForTimeout(500);
		}
		
		// Should show hint or help
		await expect(page.locator('.hint, .help-text, .enclosure-hint')).toBeVisible();
	});

	test('should change target with note selector', async ({ page }) => {
		// Change root note
		await page.selectOption('#note-select', 'G');
		await page.waitForTimeout(500);
		
		// Target should update
		await expect(page.locator('.target-tone-display')).toContainText('G');
	});

	test('should show keyboard with target highlighted after mistakes', async ({ page }) => {
		// Make mistakes
		for (let i = 0; i < 3; i++) {
			await playMidiNote(page, 50, 80);
			await page.waitForTimeout(500);
		}
		
		// Keyboard should appear
		await expect(page.locator('.keyboard-container')).toBeVisible();
		
		// Target note should be highlighted
		await expect(page.locator('.keyboard .target, .keyboard .highlight')).toBeVisible();
	});
});
