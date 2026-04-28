import { test, expect } from '@playwright/test';
import { playMidiSequence } from '../midi-helper';
import { ALL_NOTES, SCALE_INTERVALS, scaleNotes } from '../music-theory';

const SCALE_MODES = Object.keys(SCALE_INTERVALS);

test.describe('Scales Exercise', () => {
	test.describe.configure({ mode: 'parallel' });

	for (const note of ALL_NOTES) {
		for (const mode of SCALE_MODES) {
			test(`${note} ${mode} scale – success & failure`, async ({ page }) => {
				await page.goto('/exercises/scales');
				await page.waitForSelector('.exercise-main');

				// Configure root note and scale mode
				await page.locator('#note-select').selectOption(note);
				await page.locator('#scaleMode').selectOption(mode);

				const correctNotes = scaleNotes(note, mode);

				// 1. Play correct sequence → expect success
				await playMidiSequence(page, correctNotes, 50);
				await expect(page.locator('.feedback-toast')).toContainText('success', {
					ignoreCase: true
				});

				// Reset for failure test
				await page.locator('.reset-btn').click();

				// 2. Play wrong sequence (last note off by one semitone) → expect error
				const wrongNotes = [...correctNotes];
				wrongNotes[wrongNotes.length - 1] += 1;
				await playMidiSequence(page, wrongNotes, 50);

				await expect(page.locator('.stat-pill.warn .value')).not.toHaveText('0');
				await expect(page.locator('.feedback-toast')).toContainText('error', { ignoreCase: true });

				// 3. After enough mistakes the score and keyboard should become visible
				for (let i = 0; i < 3; i++) {
					await playMidiSequence(page, [wrongNotes[0] + 1], 10);
				}
				await expect(page.locator('.score-container')).toBeVisible();
				await expect(page.locator('.keyboard-container')).not.toHaveClass(/hidden/);
			});
		}
	}
});
