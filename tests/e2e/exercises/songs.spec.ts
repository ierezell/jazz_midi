import { test, expect } from '@playwright/test';
import { playMidiChord } from '../midi-helper';
import { chordNotes, midiFromName } from '../music-theory';

/** Parse a chord display string like "Cmaj7" or "F#min" into note + type */
function parseChordString(str: string): { note: string; type: string } | null {
	const m = str.trim().match(/^([A-G][#b]?)(.+)$/);
	return m ? { note: m[1], type: m[2] } : null;
}

test.describe('Songs Exercise', () => {
	test('Tracks correct chord progression', async ({ page }) => {
		await page.goto('/exercises/songs');
		await page.waitForSelector('.exercise-main');

		const progressText = await page.locator('.chord-progress').innerText();
		const match = progressText.match(/of\s(\d+)/);
		const totalChords = match ? parseInt(match[1]) : 4;

		for (let i = 0; i < totalChords; i++) {
			const chordLabel = await page.locator('.chord-box.current .chord-name').innerText();
			const parsed = parseChordString(chordLabel);
			if (!parsed) continue;

			// Read the app's actual expected notes (machine-readable element)
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

			let expectedNotes = await readExpected();

			if (expectedNotes.length === 0) continue;

			if (i === 0) {
				// Play a wrong chord first to verify error handling
				const wrongNotes = expectedNotes.map((n) => n + 1);
				await playMidiChord(page, wrongNotes, 50);
				// Chord index should NOT advance
				await expect(page.locator('.chord-progress')).toContainText(
					`Chord ${i + 1} of ${totalChords}`
				);
			}

			// Play the correct chord
			await playMidiChord(page, expectedNotes, 50);
			await page.waitForTimeout(300);

			if (i < totalChords - 1) {
				await expect(page.locator('.chord-progress')).toContainText(
					`Chord ${i + 2} of ${totalChords}`
				);
			}
		}
	});
});
