import { test, expect } from '@playwright/test';
import { playMidiNote } from '../midi-helper';
import { midiFromName } from '../music-theory';

test.describe('Partition Exercise', () => {
	test('Sight-reading tracks correct sequence and handles wrong notes', async ({ page }) => {
		await page.goto('/exercises/partition');
		await page.waitForSelector('.exercise-main');

		// Read sequence length from progress text
		const progressText = await page.locator('.progress-text').innerText({ timeout: 5000 }).catch(() => '0/1');
		const totalMatch = progressText.match(/0\/(\d+)/);
		const sequenceLength = totalMatch ? parseInt(totalMatch[1]) : 1;

		for (let i = 0; i < sequenceLength; i++) {
			// Re-read the current expected note on each iteration from UI
			const rawText = await page.locator('.expected-notes').innerText({ timeout: 5000 }).catch(() => '');
			const [noteName] = rawText.split(',').map(s => s.trim());
			if (!noteName) break;

			const m = noteName.trim().match(/^([A-Ga-g][#b]?)(\d+)$/);
			if (!m) break;
			const midi = midiFromName(m[1], parseInt(m[2]));

			// On first note, also play a wrong note first to test error
			if (i === 0) {
				await playMidiNote(page, midi + 1, 50);
				await expect(page.locator('.stat-pill.warn .value')).not.toHaveText('0');
			}

			// Play the correct note
			await playMidiNote(page, midi, 80);

			if (i < sequenceLength - 1) {
				// Verify progress advanced
				await expect(page.locator('.progress-text')).toContainText(`${i + 1}/${sequenceLength}`);
			} else {
				// Last note – expect success or completion feedback
				await expect(page.locator('.feedback-toast')).toContainText('success', { ignoreCase: true });
			}
		}
	});
});
