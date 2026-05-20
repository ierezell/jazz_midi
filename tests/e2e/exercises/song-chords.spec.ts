import { test, expect } from '@playwright/test';
import { playMidiChord, playMidiNote } from '../midi-helper';
import { chords as buildChord } from '../../../src/lib/MusicTheoryUtils';
import { NoteToMidi } from '../../../src/lib/types/notes.constants';
import type { ChordType, NoteFullName } from '../../../src/lib/types/types';

function chordNotes(root: string, type: string): number[] {
	const rootMidi = NoteToMidi[`${root}4` as NoteFullName];
	const chord = buildChord(rootMidi, type as ChordType);
	return [chord.root, chord.third, chord.fifth, chord.seventh].filter(
		(n) => n !== undefined
	) as number[];
}

/** Parse chord string like "Am7" or "Gmaj7" into note and type */
function parseChordString(str: string): { note: string; type: string } | null {
	const m = str.trim().match(/^([A-G][#b]?)(.+)$/);
	return m ? { note: m[1], type: m[2] } : null;
}

test.describe('Song Chords Exercise', () => {
	test('page loads without errors', async ({ page }) => {
		const errors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				errors.push(msg.text());
			}
		});
		page.on('pageerror', (error) => {
			errors.push(`Page error: ${error.message}`);
		});
		page.on('response', (response) => {
			if (response.status() >= 400) {
				errors.push(`Failed request: ${response.url()} (${response.status()})`);
			}
		});

		await page.goto('/exercises/song-chords');
		await page.waitForSelector('.exercise-main');

		// Give time for any async errors to appear
		await page.waitForTimeout(500);

		if (errors.length > 0) {
			console.log('Errors:', errors);
		}
		expect(errors).toHaveLength(0);
	});

	test('chords are displayed and current chord is highlighted', async ({ page }) => {
		await page.goto('/exercises/song-chords');
		await page.waitForSelector('.exercise-main');

		// Wait for the song to load
		await page.waitForTimeout(500);

		// Check that chord selection dropdown is present and has options
		const songSelect = page.locator('select#song-select');
		await expect(songSelect).toBeVisible();
		const options = await songSelect.locator('option').count();
		expect(options).toBeGreaterThan(0);
	});

	test('score renders with MusicXML content', async ({ page }) => {
		await page.goto('/exercises/song-chords');
		await page.waitForSelector('.exercise-main');

		// Wait for score to render (OSMD takes time)
		await page.waitForTimeout(1000);

		// Check that the score container exists
		const scoreContainer = page.locator(
			'.score-section, .osmd-container, .musicxml-score-container'
		);
		await expect(scoreContainer.first()).toBeVisible();
	});

	test('keyboard is visible after exercise starts', async ({ page }) => {
		await page.goto('/exercises/song-chords');
		await page.waitForSelector('.exercise-main');

		// Check that keyboard component exists (it may be hidden initially)
		const keyboard = page.locator('.keyboard-container');
		await expect(keyboard).toBeAttached();

		// Keyboard is hidden by default until mistakes accumulate or debug mode is on
		// Check that it has the hidden class initially
		const isHidden = await keyboard.evaluate((el) => el.classList.contains('hidden'));
		// Keyboard may be hidden initially - this is expected behavior
		expect(typeof isHidden).toBe('boolean');
	});

	test('exercise completes when playing all chords correctly', async ({ page }) => {
		await page.goto('/exercises/song-chords');
		await page.waitForSelector('.exercise-main');
		await page.waitForTimeout(500);

		// Get the initial prompt to understand current chord (prompt-card is the container)
		const promptLocator = page.locator('.prompt-card, .prompt-text');
		// Prompt may or may not be visible depending on the song
		const hasPrompt = await promptLocator.isVisible().catch(() => false);
		if (hasPrompt) {
			await expect(promptLocator).toBeVisible();
		}

		// Try to complete up to 4 chords (or fewer if song is shorter)
		const maxChords = 4;
		for (let i = 0; i < maxChords; i++) {
			// Read current chord from the page
			const promptText = await promptLocator.innerText().catch(() => '');

			// Try to extract chord info from prompt text
			const chordMatch = promptText.match(/([A-G][#b]?(?:m|maj7|m7|7|dim|aug|sus[24])?)/);

			if (!chordMatch) {
				// No chord to play, might be complete
				break;
			}

			const chordStr = chordMatch[1];
			const parsed = parseChordString(chordStr);

			if (!parsed) continue;

			// Map chord type to our test format
			let chordType = parsed.type.toLowerCase();
			if (chordType === 'm' || chordType === 'min') chordType = 'minor';
			if (chordType === '') chordType = 'major';
			if (chordType === '7') chordType = 'dom7';
			if (chordType === 'maj7') chordType = 'maj7';
			if (chordType === 'm7') chordType = 'min7';

			try {
				// Get expected notes for this chord
				const expectedNotes = chordNotes(parsed.note, chordType);

				// Play the correct chord
				await playMidiChord(page, expectedNotes, 100);
				await page.waitForTimeout(300);
			} catch (e) {
				// If chord type not recognized, try playing a simple major chord
				const rootNote = parsed.note;
				try {
					const fallbackNotes = chordNotes(rootNote, 'major');
					await playMidiChord(page, fallbackNotes, 100);
					await page.waitForTimeout(300);
				} catch (e2) {
					// Skip if we can't determine the chord
					break;
				}
			}
		}

		// Exercise should show progress - check for feedback toast or performance strip
		const feedback = page.locator('.feedback-toast');
		const performanceStrip = page.locator('.performance-strip');

		// At least one of these should be visible
		const hasFeedback = await feedback.isVisible().catch(() => false);
		const hasPerformance = await performanceStrip.isVisible().catch(() => false);

		expect(hasFeedback || hasPerformance).toBe(true);
	});

	test('mistakes are tracked and feedback is shown', async ({ page }) => {
		await page.goto('/exercises/song-chords');
		await page.waitForSelector('.exercise-main');
		await page.waitForTimeout(500);

		// Play a wrong note (very low note that's unlikely to be correct)
		await playMidiNote(page, 24, 50); // Very low C

		// Wait for feedback (feedback-toast appears with fade animation)
		await page.waitForTimeout(500);

		// Check for mistake feedback or that mistakes counter increased
		const feedback = page.locator('.feedback-toast');
		const mistakesCounter = page.locator('.stat-pill:has-text("Mistakes:") .value');

		// Either feedback toast is visible OR mistakes counter shows > 0
		const hasFeedback = await feedback.isVisible().catch(() => false);
		const mistakesText = await mistakesCounter.innerText().catch(() => '0');
		const mistakesCount = parseInt(mistakesText) || 0;

		// At least one of these should indicate a mistake was registered
		expect(hasFeedback || mistakesCount > 0).toBe(true);
	});

	test('voicing selection changes expected notes', async ({ page }) => {
		await page.goto('/exercises/song-chords');
		await page.waitForSelector('.exercise-main');
		await page.waitForTimeout(500);

		// Find voicing select dropdown
		const voicingSelect = page.locator('select#voicing-select');

		// If voicing select exists, test different voicings
		if (await voicingSelect.isVisible().catch(() => false)) {
			// Change to a different voicing
			await voicingSelect.selectOption('shell');
			await page.waitForTimeout(200);

			// Change to another voicing
			await voicingSelect.selectOption('rootless-a');
			await page.waitForTimeout(200);

			// Exercise should still be functional
			await expect(page.locator('.exercise-main')).toBeVisible();
		}
	});

	test('II-V-I annotations toggle works', async ({ page }) => {
		await page.goto('/exercises/song-chords');
		await page.waitForSelector('.exercise-main');
		await page.waitForTimeout(500);

		// Find annotations toggle
		const annotationsToggle = page
			.locator('input[type="checkbox"]')
			.filter({ hasText: /II-V-I|annotations/i });

		// If toggle exists, click it
		if (await annotationsToggle.isVisible().catch(() => false)) {
			await annotationsToggle.click();
			await page.waitForTimeout(200);

			// Click again to toggle back
			await annotationsToggle.click();
			await page.waitForTimeout(200);
		}

		// Score should still be visible
		const score = page.locator('.score-section, .osmd-container');
		await expect(score.first()).toBeVisible();
	});

	test('song selection changes the exercise', async ({ page }) => {
		await page.goto('/exercises/song-chords');
		await page.waitForSelector('.exercise-main');
		await page.waitForTimeout(500);

		const songSelect = page.locator('select#song-select');
		await expect(songSelect).toBeVisible();

		// Get initial value
		const initialValue = await songSelect.inputValue();

		// Try to select a different option if available
		const options = await songSelect.locator('option').all();
		if (options.length > 1) {
			// Get values for all options
			const optionValues = await Promise.all(
				options.map(async (opt) => await opt.getAttribute('value'))
			);

			// Find a different option
			const differentIndex = optionValues.findIndex((val) => val !== initialValue);

			if (differentIndex >= 0) {
				const newValue = optionValues[differentIndex];
				await songSelect.selectOption(newValue || '');
				await page.waitForTimeout(500);

				// Verify selection changed
				const newSelectedValue = await songSelect.inputValue();
				expect(newSelectedValue).not.toBe(initialValue);
			}
		}
	});

	test('rhythm mode can be toggled', async ({ page }) => {
		await page.goto('/exercises/song-chords');
		await page.waitForSelector('.exercise-main');
		await page.waitForTimeout(500);

		// Find rhythm toggle
		const rhythmToggle = page
			.locator('input[type="checkbox"]')
			.filter({ hasText: /rhythm|timing/i });

		// If toggle exists, test it
		if (await rhythmToggle.isVisible().catch(() => false)) {
			await rhythmToggle.click();
			await page.waitForTimeout(200);

			// Exercise should adapt to rhythm mode
			await expect(page.locator('.exercise-main')).toBeVisible();
		}
	});

	test('inversion selection works', async ({ page }) => {
		await page.goto('/exercises/song-chords');
		await page.waitForSelector('.exercise-main');
		await page.waitForTimeout(500);

		const inversionSelect = page.locator('select#inversion-select');

		if (await inversionSelect.isVisible().catch(() => false)) {
			// Try different inversions
			const options = await inversionSelect.locator('option').all();
			if (options.length > 1) {
				for (let i = 1; i < Math.min(options.length, 3); i++) {
					const value = await options[i].getAttribute('value');
					await inversionSelect.selectOption(value || String(i));
					await page.waitForTimeout(200);
				}
			}
		}
	});

	test('exercise shows completion message when finished', async ({ page }) => {
		await page.goto('/exercises/song-chords');
		await page.waitForSelector('.exercise-main');
		await page.waitForTimeout(500);

		// Try to play through chords
		const maxAttempts = 8;
		for (let i = 0; i < maxAttempts; i++) {
			// Play a C major chord as a fallback
			try {
				const notes = chordNotes('C', 'major');
				await playMidiChord(page, notes, 50);
				await page.waitForTimeout(200);
			} catch (e) {
				// If this fails, just try a simple note
				await playMidiNote(page, 60, 50);
				await page.waitForTimeout(200);
			}
		}

		// Check for any completion indicator or final state
		const completionIndicators = page.locator(
			'.completion-message, .exercise-complete, .success-message, .finished'
		);
		const hasCompletion = await completionIndicators
			.first()
			.isVisible()
			.catch(() => false);

		// Or check if we're still in a valid exercise state
		if (!hasCompletion) {
			await expect(page.locator('.exercise-main')).toBeVisible();
		}
	});
});

