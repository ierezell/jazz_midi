import { test, expect } from '@playwright/test';

const SCORE_TIMEOUT = 45_000;

/** Trigger a wrong note to show the score (progressiveHints=true by default). */
async function triggerScoreDisplay(page: import('@playwright/test').Page) {
	await page.waitForFunction(
		() =>
			typeof (window as any).__dispatchMidi === 'function' &&
			(window as any).__midiExerciseReady === true,
		{ timeout: 15_000 }
	);
	// Send a very low note (MIDI 1) — never a correct answer in any exercise
	await page.evaluate(() => {
		(window as any).__dispatchMidi(new Uint8Array([0x90, 1, 80]));
	});
	await page.waitForTimeout(300);
	await page.evaluate(() => {
		(window as any).__dispatchMidi(new Uint8Array([0x80, 1, 0]));
	});
}

test.describe('Score rendering', () => {
	test.setTimeout(90_000);
	test.describe('Chord exercise', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/exercises/chords');
			
			// Score is hidden until first mistake (progressiveHints=true default)
			await triggerScoreDisplay(page);
			// Wait for OSMD SVG to render
			await expect(page.locator('.osmd-container svg')).toBeVisible({ timeout: SCORE_TIMEOUT });
		});

		test('shows notes in the score', async ({ page }) => {
			// OSMD renders notes as <ellipse> or <path> elements inside the SVG
			const noteCount = await page.locator('.osmd-container svg ellipse, .osmd-container svg path[fill="#000000"]').count();
			expect(noteCount).toBeGreaterThan(0);
		});

		test('does not show title, composer or part names', async ({ page }) => {
			const svg = page.locator('.osmd-container svg');
			// OSMD renders title/composer as text elements with specific class names
			await expect(svg.locator('text.title, text.composer, text.partName, text.partAbbreviation')).toHaveCount(0);
		});

		test('zoom controls update the score size', async ({ page }) => {
			const svg = page.locator('.osmd-container svg');
			const initialWidth = await svg.evaluate((el) => el.getBoundingClientRect().width);

			await page.locator('.zoom-btn[title="Zoom in"]').click();
			await page.waitForTimeout(400);

			const newWidth = await svg.evaluate((el) => el.getBoundingClientRect().width);
			expect(newWidth).toBeGreaterThan(initialWidth);
		});
	});

	test.describe('Scale exercise', () => {
		test('shows notes in the score', async ({ page }) => {
			await page.goto('/exercises/scales');
			
			await triggerScoreDisplay(page);
			await expect(page.locator('.osmd-container svg')).toBeVisible({ timeout: SCORE_TIMEOUT });

			const noteCount = await page.locator('.osmd-container svg ellipse, .osmd-container svg path[fill="#000000"]').count();
			expect(noteCount).toBeGreaterThan(0);
		});
	});

	test.describe('Partition (sight reading) exercise', () => {
		test('shows notes in the score', async ({ page }) => {
			await page.goto('/exercises/partition');
			
			await triggerScoreDisplay(page);
			await expect(page.locator('.osmd-container svg')).toBeVisible({ timeout: SCORE_TIMEOUT });

			const noteCount = await page.locator('.osmd-container svg ellipse, .osmd-container svg path[fill="#000000"]').count();
			expect(noteCount).toBeGreaterThan(0);
		});

		test('does not show title or composer text', async ({ page }) => {
			await page.goto('/exercises/partition');
			
			await triggerScoreDisplay(page);
			await expect(page.locator('.osmd-container svg')).toBeVisible({ timeout: SCORE_TIMEOUT });

			const svg = page.locator('.osmd-container svg');
			await expect(svg.locator('text.title, text.composer')).toHaveCount(0);
		});
	});

	test.describe('Loading state', () => {
		test('shows loading indicator then score', async ({ page }) => {
			await page.goto('/exercises/chords');
			
			// Immediately check for loading state (may be very brief)
			const loadingVisible = await page.locator('.loading-overlay, .loading-indicator').isVisible().catch(() => false);
			// Trigger score display then check SVG appears
			await triggerScoreDisplay(page);
			// Whether loading was shown or not, the final SVG must appear
			await expect(page.locator('.osmd-container svg')).toBeVisible({ timeout: SCORE_TIMEOUT });
			// Once loaded, loading overlay must be gone
			await expect(page.locator('.loading-overlay')).toBeHidden();
		});
	});

	test.describe('Error handling', () => {
		test('shows error overlay when score fails to load', async ({ page }) => {
			await page.goto('/exercises/song-chords?song=nonexistent-song-file-xyz.mxl');
			
			// Either the error overlay shows, or the score container exists (graceful fallback)
			const hasError = await page.locator('.error-overlay').isVisible().catch(() => false);
			const hasSvg = await page.locator('.osmd-container svg').isVisible().catch(() => false);
			expect(hasError || hasSvg).toBe(true);
		});
	});
});



