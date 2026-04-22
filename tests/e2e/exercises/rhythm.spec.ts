import { test, expect } from '@playwright/test';
import { playMidiNote } from '../midi-helper';

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
		page.on('response', (response) => {
			if (response.status() >= 400) {
				errors.push(`Failed request: ${response.url()} (${response.status()})`);
			}
		});

		await page.goto('/exercises/rhythm');
		await page.waitForSelector('.exercise-main');

		// Give time for any async errors to appear
		await page.waitForTimeout(500);

		if (errors.length > 0) {
			console.log('Errors:', errors);
		}
		expect(errors).toHaveLength(0);
	});

	test('timeline container and controls are visible', async ({ page }) => {
		await page.goto('/exercises/rhythm');
		await page.waitForSelector('.exercise-main');

		// Check that main elements are present
		await expect(page.locator('.timeline-container')).toBeVisible();
		await expect(page.locator('.timeline-track')).toBeVisible();
		await expect(page.locator('.action-btn')).toBeVisible();
		await expect(page.locator('.bpm-input')).toBeVisible();
	});

	test('Metronome starts, processes MIDI input, and stops correctly', async ({ page }) => {
        // Start metronome
        await page.locator('.action-btn', { hasText: 'Start Metronome' }).click();
        // Wait a moment for the metronome to start and playhead to appear
        await page.waitForTimeout(100);
        await expect(page.locator('.playhead')).toBeVisible({ timeout: 5000 });
        // Fire a MIDI note (RH = >= 60) – timing will likely be "Early" or "Miss"
        // but we just verify the event is processed and feedback appears
        await playMidiNote(page, 60, 10);
        await expect(page.locator('.feedback-area')).toBeVisible();
        // Wait briefly for timing feedback to appear
        await expect(page.locator('.timing-feedback')).toBeVisible({ timeout: 8000 });
        // Stop metronome
        await page.locator('.action-btn', { hasText: 'Stop' }).click();
        await expect(page.locator('.playhead')).not.toBeVisible();

	});
});
