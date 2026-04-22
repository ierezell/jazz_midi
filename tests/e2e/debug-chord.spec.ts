import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

// Minimal inline version to debug chord dispatch
async function dispatchNote(page: Page, note: number) {
	await page.evaluate((n) => {
		if (typeof (window as any).__dispatchMidi === 'function') {
			(window as any).__dispatchMidi(new Uint8Array([0x90, n, 100]));
		} else {
			console.error('__dispatchMidi not found!');
		}
	}, note);
}

test('DEBUG: C major chord', async ({ page }) => {
	page.on('console', msg => console.log('[BROWSER]', msg.text()));

	await page.goto('/exercises/chords');
	await page.waitForSelector('.exercise-main');

	// Check __dispatchMidi exists
	const hasMidi = await page.evaluate(() => typeof (window as any).__dispatchMidi === 'function');
	console.log('__dispatchMidi exists:', hasMidi);

	// C major = C3 (60), E3 (64), G3 (67)
	await dispatchNote(page, 60);
	await page.waitForTimeout(100);
	await dispatchNote(page, 64);
	await page.waitForTimeout(100);
	await dispatchNote(page, 67);
	await page.waitForTimeout(1000);

	const toast = await page.locator('.feedback-toast').textContent().catch(() => '<none>');
	console.log('Toast text:', toast);

	const mistakesText = await page.locator('.stat-pill.warn .value').textContent().catch(() => '<none>');
	console.log('Mistakes:', mistakesText);

	// Enable debug to see expected notes
	await page.locator('#debug-toggle').click();
	await page.waitForTimeout(500);

	const debugText = await page.locator('.status-info').textContent().catch(() => '<none>');
	console.log('Debug panel:', debugText);

	// Just assert something minimal so we get the logs
	expect(hasMidi).toBe(true);
});
