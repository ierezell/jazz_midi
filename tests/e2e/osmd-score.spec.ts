import { test, expect } from '@playwright/test';

test.describe('OSMD Score Rendering', () => {
	test('should render MusicXML in song-chords exercise', async ({ page }) => {
		await page.goto('/exercises/song-chords');
		await page.waitForLoadState('networkidle');

		// Should show OSMD container
		await expect(page.locator('.osmd-container, .musicxml-score-container')).toBeVisible({
			timeout: 15_000
		});

		// Score should load
		await expect(page.locator('.osmd-container svg')).toBeVisible({ timeout: 15_000 });
	});

	test('should render score in song-melody exercise', async ({ page }) => {
		await page.goto('/exercises/song-melody');
		await page.waitForLoadState('networkidle');

		// Should show OSMD container
		await expect(page.locator('.osmd-container, .musicxml-score-container')).toBeVisible({
			timeout: 15_000
		});
	});

	test('should display loading state while score loads', async ({ page }) => {
		await page.goto('/exercises/song-chords');

		// Should show loading indicator initially
		await expect(page.locator('.loading-indicator, .loading-overlay')).toBeVisible({
			timeout: 5_000
		});

		// Should disappear after load
		await expect(page.locator('.osmd-container svg')).toBeVisible({ timeout: 15_000 });
	});

	test('should handle zoom controls', async ({ page }) => {
		await page.goto('/exercises/song-chords');
		await page.waitForLoadState('networkidle');

		// Wait for score to load
		await expect(page.locator('.osmd-container svg')).toBeVisible({ timeout: 15_000 });

		// Get initial width
		const initialWidth = await page
			.locator('.osmd-container svg')
			.evaluate((el) => el.getBoundingClientRect().width);

		// Click zoom in if available
		const zoomInBtn = page.locator('.zoom-in, [data-action="zoom-in"]');
		if (await zoomInBtn.isVisible().catch(() => false)) {
			await zoomInBtn.click();
			await page.waitForTimeout(500);

			// Should be larger
			const newWidth = await page
				.locator('.osmd-container svg')
				.evaluate((el) => el.getBoundingClientRect().width);
			expect(newWidth).toBeGreaterThan(initialWidth);
		}
	});

	test('should display chord symbols', async ({ page }) => {
		await page.goto('/exercises/song-chords');
		await page.waitForLoadState('networkidle');

		// Wait for score
		await expect(page.locator('.osmd-container svg')).toBeVisible({ timeout: 15_000 });

		// Should contain chord symbols (harmony elements)
		const svgContent = await page.locator('.osmd-container svg').innerHTML();
		expect(svgContent).toMatch(/maj7|min7|7|m7|Δ/);
	});

	test('should be responsive on mobile', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });

		await page.goto('/exercises/song-chords');
		await page.waitForLoadState('networkidle');

		// Should still render
		await expect(page.locator('.osmd-container svg')).toBeVisible({ timeout: 15_000 });

		// Check that it fits within viewport
		const svgWidth = await page
			.locator('.osmd-container svg')
			.evaluate((el) => el.getBoundingClientRect().width);
		expect(svgWidth).toBeLessThanOrEqual(375);
	});
});
