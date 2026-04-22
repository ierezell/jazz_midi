import { test, expect } from '@playwright/test';
import { playMidiSequence } from '../midi-helper';
import { ALL_NOTES, INTERVAL_SEMITONES, intervalNotes } from '../music-theory';

const ALL_INTERVALS = Object.keys(INTERVAL_SEMITONES);

test.describe('Intervals Exercise', () => {
	test.describe.configure({ mode: 'parallel' });

	for (const note of ALL_NOTES) {
		for (const interval of ALL_INTERVALS) {
			test(`${note} ${interval} – success & failure`, async ({ page }) => {
				await page.goto('/exercises/intervals');
				await page.waitForSelector('.exercise-main');

				// Configure
				await page.locator('#note-select').selectOption(note);
				await expect(page.locator('#note-select')).toHaveValue(note);
				// Robustly set the select value and dispatch change so Svelte handlers run
				await page.evaluate(([selector, val]) => {
					const el = document.querySelector(selector) as HTMLSelectElement | null;
					if (!el) throw new Error('interval select not found');
					el.value = val;
					el.dispatchEvent(new Event('change', { bubbles: true }));
				}, ['#intervalType', interval]);
				await expect(page.locator('#intervalType')).toHaveValue(interval);

				// Determine what the app actually expects (prompt reflects current interval)
				const promptText = (await page.locator('.prompt-text').textContent()) || '';
				// promptText like 'Major 3rd from C' → convert to key 'major3rd'
				const promptInterval = promptText.split(' from ')[0].toLowerCase().replace(/\s+/g, '');
				const usedInterval = promptInterval || interval;
				const [root, second] = intervalNotes(note, usedInterval);

				// 1. Correct interval → success
				await playMidiSequence(page, [root, second], 80);
				await expect(page.locator('.feedback-toast')).toContainText('success', { ignoreCase: true });

				// Reset
				await page.locator('.reset-btn').click();

				// 2. Wrong second note → error
				await playMidiSequence(page, [root, second + 1], 80);
				await expect(page.locator('.stat-pill.warn .value')).not.toHaveText('0');
				await expect(page.locator('.feedback-toast')).toContainText('error', { ignoreCase: true });
			});
		}
	}
});
