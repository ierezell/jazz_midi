import { test, expect } from '@playwright/test';
import { playMidiChord } from '../midi-helper';
import { ALL_NOTES, midiFromName } from '../music-theory';

test.describe('Two-Five-One Exercise', () => {
	test.describe.configure({ mode: 'parallel' });

	for (const note of ALL_NOTES) {
		test(`${note} II-V-I – success & failure`, async ({ page }) => {
			await page.goto('/exercises/two_five_ones');
			await page.waitForSelector('.exercise-main');

			await page.locator('#note-select').selectOption(note);

			const readExpected = async (): Promise<number[]> => {
				const rawText = await page
					.locator('.expected-notes')
					.innerText({ timeout: 3000 })
					.catch(() => '');
				const noteNames = rawText
					.split(',')
					.map((s) => s.trim())
					.filter(Boolean);
				const midiNotes = noteNames
					.map((n) => {
						const m = n.match(/^([A-Ga-g][#b]?)(\d+)$/);
						if (!m) return null;
						return midiFromName(m[1], parseInt(m[2]));
					})
					.filter((x): x is number => x !== null);
				return midiNotes;
			};

			// ---- Success path (play all three chords in order) ----
			for (let i = 0; i < 3; i++) {
				const expected = await readExpected();
				if (expected.length === 0)
					throw new Error('Could not read expected chord from debug panel');
				await playMidiChord(page, expected, 60);
				await expect(page.locator('.feedback-toast')).toContainText('success', {
					ignoreCase: true
				});
				// Small pause so app advances internal chord index
				await page.waitForTimeout(200);
			}

			// Reset
			await page.locator('.reset-btn').click();

			// ---- Failure path (play wrong first chord) ----
			const expectedFirst = await readExpected();
			const wrongChord = expectedFirst.map((n) => n + 1);
			await playMidiChord(page, wrongChord, 60);
			await expect(page.locator('.stat-pill.warn .value')).not.toHaveText('0');
			await expect(page.locator('.feedback-toast')).toContainText('error', { ignoreCase: true });
		});
	}
});
