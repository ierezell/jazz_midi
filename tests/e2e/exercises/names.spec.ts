import { test, expect } from '@playwright/test';
import { playMidiNote } from '../midi-helper';
import { NOTE_OFFSET, defaultOctave, midiFromName } from '../music-theory';

const LATIN_TO_ENGLISH: Record<string, string> = {
	Do: 'C', 'Do#': 'C#', Reb: 'Db', Re: 'D', 'Re#': 'D#', Mib: 'Eb', Mi: 'E',
	Fa: 'F', 'Fa#': 'F#', Solb: 'Gb', Sol: 'G', 'Sol#': 'G#', Lab: 'Ab',
	La: 'A', 'La#': 'A#', Sib: 'Bb', Si: 'B',
};

test.describe('Names Exercise', () => {
	test('Detects correct and wrong notes (English & Latin modes)', async ({ page }) => {
		await page.goto('/exercises/names');
		await page.waitForSelector('.exercise-main');

		// Read displayed note name from the prompt card
		const promptText = await page.locator('.prompt-text').innerText();
		const isEnglish = !Object.keys(LATIN_TO_ENGLISH).includes(promptText.trim());
		const noteEnglish = isEnglish ? promptText.trim() : (LATIN_TO_ENGLISH[promptText.trim()] ?? 'C');

		const octave = defaultOctave(noteEnglish);
		const midi = midiFromName(noteEnglish, octave);

		// 1. Play wrong note → expect error
		await playMidiNote(page, midi + 1, 50);
		await expect(page.locator('.stat-pill.warn .value')).not.toHaveText('0');
		await expect(page.locator('.feedback-toast')).toContainText('error', { ignoreCase: true });

		// 2. Play correct note → expect success
		await playMidiNote(page, midi, 50);
		await expect(page.locator('.feedback-toast')).toContainText('success', { ignoreCase: true });
	});
});
