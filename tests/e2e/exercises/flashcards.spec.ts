import { test, expect } from '@playwright/test';
import { playMidiNote, playMidiChord } from '../midi-helper';
import { midiFromName } from '../music-theory';

test.describe('Flashcards Exercise', () => {
	test('Tracks random cards (note or chord)', async ({ page }) => {
		await page.goto('/exercises/flashcards');
		await page.waitForSelector('.exercise-main');

		// Read expected notes from the main exercise UI
		const rawText = await page.locator('.expected-notes').innerText({ timeout: 5000 }).catch(() => '');

		const noteNames = rawText.split(',').map(s => s.trim()).filter(Boolean);

		if (noteNames.length === 0) return; // smoke-test only

		const parseMidi = (name: string) => {
			const match = name.match(/^([A-Ga-g][#b]?)(\d+)$/);
			if (!match) return null;
			return midiFromName(match[1], parseInt(match[2]));
		};

		const midiNotes = noteNames.map(parseMidi).filter((n): n is number => n !== null);

		// 1. Play wrong note
		if (midiNotes.length > 0) {
			await playMidiNote(page, midiNotes[0] + 2, 50);
			await expect(page.locator('.stat-pill.warn .value')).not.toHaveText('0');
		}

		// Reset
		await page.locator('.reset-btn').click();

		// Re-read expected notes after reset (they may change)
		const rawText2 = await page.locator('.expected-notes').innerText({ timeout: 3000 }).catch(() => rawText);

		const newNotes = rawText2.split(',').map(s => s.trim()).filter(Boolean).map(parseMidi).filter((n): n is number => n !== null);

		if (newNotes.length === 1) {
			await playMidiNote(page, newNotes[0], 80);
		} else if (newNotes.length > 1) {
			await playMidiChord(page, newNotes, 80);
		}

		await expect(page.locator('.feedback-toast')).toContainText('success', { ignoreCase: true });
	});
});
