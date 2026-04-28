import { test, expect } from '@playwright/test';

test.describe('Debug Panel', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/exercises/chords');
		await page.waitForSelector('.exercise-main', { timeout: 10_000 });
	});

	test('should show debug panel toggle', async ({ page }) => {
		// Should have debug toggle button
		await expect(page.locator('.debug-toggle, [data-testid="debug-toggle"]')).toBeVisible();
	});

	test('should open debug panel when clicked', async ({ page }) => {
		await page.locator('.debug-toggle, [data-testid="debug-toggle"]').click();

		// Debug panel should be visible
		await expect(page.locator('.debug-panel')).toBeVisible({ timeout: 2_000 });
	});

	test('should display MIDI status in debug panel', async ({ page }) => {
		await page.locator('.debug-toggle').click();
		await expect(page.locator('.debug-panel')).toBeVisible();

		// Should show MIDI section
		await expect(page.locator('.debug-panel')).toContainText('MIDI');
	});

	test('should display velocity heatmap in debug panel', async ({ page }) => {
		// Play some notes first
		await page.evaluate(() => {
			const event = new CustomEvent('midi-message', {
				detail: { noteNumber: 60, velocity: 80, type: 'on' }
			});
			window.dispatchEvent(event);
		});

		await page.locator('.debug-toggle').click();
		await expect(page.locator('.debug-panel')).toBeVisible();

		// Should show velocity heatmap
		await expect(page.locator('.velocity-heatmap, [data-testid="velocity-heatmap"]')).toBeVisible();
	});

	test('should display virtual keyboard in debug panel', async ({ page }) => {
		await page.locator('.debug-toggle').click();
		await expect(page.locator('.debug-panel')).toBeVisible();

		// Should have virtual keyboard section
		await expect(page.locator('.virtual-keyboard, [data-testid="virtual-keyboard"]')).toBeVisible();
	});

	test('should close debug panel on second click', async ({ page }) => {
		await page.locator('.debug-toggle').click();
		await expect(page.locator('.debug-panel')).toBeVisible();

		await page.locator('.debug-toggle').click();
		await expect(page.locator('.debug-panel')).not.toBeVisible();
	});
});
