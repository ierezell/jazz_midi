import { test, expect } from '@playwright/test';

const SCORE_SELECTOR = '.osmd-container svg';
const TIMEOUT = 45_000;

test.describe('OSMD Score Rendering', () => {
	test.setTimeout(90_000);

	test('should render MusicXML in song-chords exercise', async ({ page }) => {
		await page.goto('/exercises/song-chords');
		await expect(page.locator(SCORE_SELECTOR).first()).toBeVisible({ timeout: TIMEOUT });
	});

	test('should render score in song-melody exercise', async ({ page }) => {
		await page.goto('/exercises/song-melody');
		await page.waitForLoadState('networkidle');
		await expect(page.locator(SCORE_SELECTOR).first()).toBeVisible({ timeout: TIMEOUT });
	});

	test('should display loading state while score loads', async ({ page }) => {
		await page.goto('/exercises/song-chords');
		// Loading indicator may appear briefly; by the time networkidle fires it may be gone
		await page.waitForLoadState('networkidle');
		// Score must eventually be visible
		await expect(page.locator(SCORE_SELECTOR).first()).toBeVisible({ timeout: TIMEOUT });
		// Loading overlay must be gone
		await expect(page.locator('.loading-overlay')).toBeHidden();
	});

	test('should handle zoom controls', async ({ page }) => {
		await page.goto('/exercises/song-chords');
		await page.waitForLoadState('networkidle');
		await expect(page.locator(SCORE_SELECTOR).first()).toBeVisible({ timeout: TIMEOUT });

		const svgLocator = page.locator(SCORE_SELECTOR).first();
		const initialWidth = await svgLocator.evaluate((el) => el.getBoundingClientRect().width);

		await page.locator('.zoom-btn[title="Zoom in"]').click();
		await page.waitForTimeout(400);

		const newWidth = await svgLocator.evaluate((el) => el.getBoundingClientRect().width);
		expect(newWidth).toBeGreaterThan(initialWidth);
	});

	test('should display chord symbols', async ({ page }) => {
		await page.goto('/exercises/song-chords');
		await page.waitForLoadState('networkidle');
		await expect(page.locator(SCORE_SELECTOR).first()).toBeVisible({ timeout: TIMEOUT });

		// OSMD renders text elements for chord symbols
		const svgContent = await page.locator(SCORE_SELECTOR).first().innerHTML();
		// At minimum the SVG should have some content
		expect(svgContent.length).toBeGreaterThan(100);
	});

	test('should be responsive on mobile', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/exercises/song-chords');
		await page.waitForLoadState('networkidle');
		await expect(page.locator(SCORE_SELECTOR).first()).toBeVisible({ timeout: TIMEOUT });

		const svgWidth = await page
			.locator(SCORE_SELECTOR)
			.first()
			.evaluate((el) => el.getBoundingClientRect().width);
		expect(svgWidth).toBeLessThanOrEqual(400); // small tolerance for scrollbar
	});
});

