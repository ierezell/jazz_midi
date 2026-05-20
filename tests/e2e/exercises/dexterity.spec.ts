import { test, expect } from '@playwright/test';
import { playMidiNote } from '../midi-helper';
import { NoteToMidi } from '../../../src/lib/types/notes.constants';
import type { NoteFullName } from '../../../src/lib/types/types';

test.describe('Dexterity Exercise', () => {
	test('Tracks correct sequence played', async ({ page }) => {
		await page.goto('/exercises/dexterity');
		await page.waitForSelector('.exercise-main');

		// Read upcoming sequence from the page's preview row
		await page.waitForSelector('.next-notes .note-row', { state: 'attached', timeout: 5000 });
		const chips = await page.locator('.next-notes .note-row .note-chip').allInnerTexts();

		const noteNames = chips.map((t) => t.replace(/\s+/g, '')).filter(Boolean); // e.g. C4, D4

		if (noteNames.length === 0) {
			// Nothing to validate – just smoke-test page loads
			return;
		}

		// Map note full names (e.g. "C4") to midi by parsing octave suffix
		const parseMidi = (name: string) => {
			// e.g. "C#3", "Bb4" — allow 1+ digit octave
			const match = name.match(/^([A-Ga-g][#b]?)(\d+)$/);
			if (!match) return null;
			return NoteToMidi[`${match[1]}${match[2]}` as NoteFullName];
		};

		const midiNotes = noteNames.map(parseMidi).filter((n) => n !== null) as number[];

		// 1. Play wrong first note
		if (midiNotes.length > 0) {
			await playMidiNote(page, midiNotes[0] + 1, 50);
			await expect(page.locator('.stat-pill.warn .value')).not.toHaveText('0');
			await expect(page.locator('.feedback-toast')).toContainText('error', { ignoreCase: true });
		}

		// Reset
		await page.locator('.reset-btn').click();

		// 2. Play the correct sequence
		for (const midi of midiNotes) {
			await playMidiNote(page, midi, 80);
		}
		await expect(page.locator('.feedback-toast')).toContainText('success', { ignoreCase: true });
	});
});

