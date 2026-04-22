import { test, expect } from '@playwright/test';
import { playMidiChord } from '../midi-helper';
import { ALL_NOTES, CHORD_INTERVALS, chordNotes } from '../music-theory';

const CHORD_TYPES = Object.keys(CHORD_INTERVALS);

test.describe('Chords Exercise', () => {
	test.describe.configure({ mode: 'parallel' });

	for (const note of ALL_NOTES) {
		for (const chordType of CHORD_TYPES) {
			test(`${note} ${chordType} chord – success & failure`, async ({ page }) => {
				// Use URL params (the page reads them on init) to avoid relying on
				// client-side select bindings during hydration.
				const qs = new URLSearchParams({
					root: note,
					quality: chordType,
					inversion: '0'
				});
				await page.goto(`/exercises/chords?${qs.toString()}`, { waitUntil: 'load' });
				await page.waitForSelector('.exercise-main');
				await expect
					.poll(() => new URL(page.url()).searchParams.get('root'))
					.toBe(note);
				await expect
					.poll(() => new URL(page.url()).searchParams.get('quality'))
					.toBe(chordType);
				await expect(page.locator('#note-select')).toHaveValue(note, { timeout: 15_000 });
				await expect(page.locator('#chord-type')).toHaveValue(chordType, { timeout: 15_000 });

				const correctNotes = chordNotes(note, chordType);

				// 1. Play correct chord → expect success
				await playMidiChord(page, correctNotes, 50);
				await expect(page.locator('.feedback-toast')).toContainText('success', { ignoreCase: true });

				// Reset for failure test
				await page.locator('.reset-btn').click();

				// 2. Play wrong chord (alter last note) → expect error
				const wrongNotes = [...correctNotes];
				wrongNotes[wrongNotes.length - 1] -= 1;
				await playMidiChord(page, wrongNotes, 50);

				await expect(page.locator('.stat-pill.warn .value')).not.toHaveText('0');
				await expect(page.locator('.feedback-toast')).toContainText('error', { ignoreCase: true });

				// 3. After enough mistakes score and keyboard should appear
				for (let i = 0; i < 3; i++) {
					await playMidiChord(page, wrongNotes, 10);
				}
				await expect(page.locator('.score-container')).toBeVisible();
				await expect(page.locator('.keyboard-container')).not.toHaveClass(/hidden/);
			});
		}
	}
});
