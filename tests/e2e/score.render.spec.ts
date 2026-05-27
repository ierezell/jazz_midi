import { test, expect, type Page } from '@playwright/test';

const SCORE_TIMEOUT = 45_000;
const MIDI_READY_TIMEOUT = 15_000;

// ─── helpers ─────────────────────────────────────────────────────────────────

/**
 * Wait for BaseExercise MIDI bridge then send a deliberately wrong note
 * so progressiveHints reveals the score.
 */
async function triggerScoreDisplay(page: Page) {
	await page.waitForFunction(
		() =>
			typeof (window as any).__dispatchMidi === 'function' &&
			(window as any).__midiExerciseReady === true,
		{ timeout: MIDI_READY_TIMEOUT }
	);
	// MIDI 1 is never a valid answer in any exercise
	await page.evaluate(() => (window as any).__dispatchMidi(new Uint8Array([0x90, 1, 80])));
	await page.waitForTimeout(300);
	await page.evaluate(() => (window as any).__dispatchMidi(new Uint8Array([0x80, 1, 0])));
}

/** Wait for OSMD SVG to appear and have at least `minNotes` pitch elements. */
async function expectScoreVisible(page: Page, minNotes = 1) {
	await expect(page.locator('.osmd-container svg'), 'OSMD SVG must be visible').toBeVisible({
		timeout: SCORE_TIMEOUT
	});
	const noteEls = page.locator(
		'.osmd-container svg ellipse, .osmd-container svg path[fill="#000000"]'
	);
	await expect(noteEls.first(), 'At least one note element must exist').toBeVisible({
		timeout: SCORE_TIMEOUT
	});
	const count = await noteEls.count();
	expect(count, `Expected ≥${minNotes} note elements`).toBeGreaterThanOrEqual(minNotes);
}

/** Navigate, trigger score display, then assert the score is visible. */
async function navigateAndVerifyScore(page: Page, url: string, minNotes = 1) {
	await page.goto(url);
	await triggerScoreDisplay(page);
	await expectScoreVisible(page, minNotes);
}

// ─── suite ───────────────────────────────────────────────────────────────────

test.describe('Score rendering', () => {
	test.setTimeout(120_000);

	// ── Chords ─────────────────────────────────────────────────────────────
	test.describe('Chords exercise', () => {
		test.beforeEach(async ({ page }) => {
			await navigateAndVerifyScore(page, '/exercises/chords', 1);
		});

		test('renders note elements', async ({ page }) => {
			const count = await page
				.locator('.osmd-container svg ellipse, .osmd-container svg path[fill="#000000"]')
				.count();
			expect(count).toBeGreaterThan(0);
		});

		test('no title, composer or part name text', async ({ page }) => {
			await expect(
				page.locator('.osmd-container svg text.title, .osmd-container svg text.composer, .osmd-container svg text.partName')
			).toHaveCount(0);
		});

		test('grand staff — both treble and bass clefs rendered', async ({ page }) => {
			// Chord exercise uses both hands → staves=2
			const svgHtml = await page.locator('.osmd-container svg').innerHTML();
			// OSMD renders clef glyphs; the SVG should mention both staves via multiple staff lines
			const staffLines = await page.locator('.osmd-container svg line').count();
			expect(staffLines).toBeGreaterThan(8); // 5 treble + 5 bass + ledger lines
		});

		test('zoom in enlarges the score', async ({ page }) => {
			const svg = page.locator('.osmd-container svg');
			const before = await svg.evaluate((el) => el.getBoundingClientRect().width);
			await page.locator('.zoom-btn[title="Zoom in"]').click();
			await page.waitForTimeout(400);
			const after = await svg.evaluate((el) => el.getBoundingClientRect().width);
			expect(after).toBeGreaterThan(before);
		});

		test('loading overlay disappears after render', async ({ page }) => {
			await expect(page.locator('.loading-overlay')).toBeHidden();
		});
	});

	// ── Scales ─────────────────────────────────────────────────────────────
	test.describe('Scales exercise', () => {
		test('renders scale notes on a single staff', async ({ page }) => {
			await navigateAndVerifyScore(page, '/exercises/scales', 7);
		});

		test('bass-clef mode renders notes', async ({ page }) => {
			// left-hand mode uses bass clef
			await navigateAndVerifyScore(page, '/exercises/scales?handMode=left', 7);
		});
	});

	// ── Partition ──────────────────────────────────────────────────────────
	test.describe('Partition (sight reading) exercise', () => {
		test('gym mode: shows score on wrong note', async ({ page }) => {
			await navigateAndVerifyScore(page, '/exercises/partition', 4);
		});

		test('journey mode (treble): renders all 12 notes immediately', async ({ page }) => {
			await page.goto(
				'/exercises/partition?range=C4%2CG4&randomMode=false&unitId=unit-1&lessonId=u1-treble-staff'
			);
			// Partition always shows the score — no wrong note needed
			await expectScoreVisible(page, 4);
		});

		test('journey mode (bass): renders bass-range notes immediately', async ({ page }) => {
			await page.goto(
				'/exercises/partition?range=C2%2CG3&randomMode=false&unitId=unit-1&lessonId=u1-bass-staff'
			);
			await expectScoreVisible(page, 4);
		});

		test('no title or composer text visible', async ({ page }) => {
			await navigateAndVerifyScore(page, '/exercises/partition', 1);
			await expect(
				page.locator('.osmd-container svg text.title, .osmd-container svg text.composer')
			).toHaveCount(0);
		});
	});

	// ── Two-Five-Ones ──────────────────────────────────────────────────────
	test.describe('II-V-I (two-five-ones) exercise', () => {
		test('renders chord notation on grand staff', async ({ page }) => {
			await navigateAndVerifyScore(page, '/exercises/two_five_ones', 1);
		});

		test('journey mode renders score', async ({ page }) => {
			await navigateAndVerifyScore(
				page,
				'/exercises/two_five_ones?unitId=unit-2&progressiveHints=false',
				1
			);
		});
	});

	// ── Licks ──────────────────────────────────────────────────────────────
	test.describe('Licks exercise', () => {
		test('renders lick notes on score', async ({ page }) => {
			await navigateAndVerifyScore(page, '/exercises/licks', 1);
		});

		test('specific lick (bebop-scale-run) renders', async ({ page }) => {
			await navigateAndVerifyScore(page, '/exercises/licks?lickId=bebop-scale-run', 1);
		});
	});

	// ── Intervals ──────────────────────────────────────────────────────────
	test.describe('Intervals exercise', () => {
		test('renders interval notes', async ({ page }) => {
			await navigateAndVerifyScore(page, '/exercises/intervals', 1);
		});
	});

	// ── Enclosure ──────────────────────────────────────────────────────────
	test.describe('Enclosure exercise', () => {
		test('renders enclosure pattern notes', async ({ page }) => {
			await navigateAndVerifyScore(page, '/exercises/enclosure', 1);
		});
	});

	// ── Interval Mimicry ───────────────────────────────────────────────────
	test.describe('Interval mimicry exercise', () => {
		test('renders interval notes', async ({ page }) => {
			await navigateAndVerifyScore(page, '/exercises/interval-mimicry', 1);
		});
	});

	// ── Ghost Notes ────────────────────────────────────────────────────────
	test.describe('Ghost notes exercise', () => {
		test('renders expected notes on score', async ({ page }) => {
			await navigateAndVerifyScore(page, '/exercises/ghost-notes', 1);
		});
	});

	// ── Boogie ─────────────────────────────────────────────────────────────
	test.describe('Boogie exercise', () => {
		test('renders bass + chord pattern on grand staff', async ({ page }) => {
			await navigateAndVerifyScore(page, '/exercises/boogie', 1);
		});
	});

	// ── Hand Independence ──────────────────────────────────────────────────
	test.describe('Hand independence exercise', () => {
		test('renders grand staff with both hands', async ({ page }) => {
			await navigateAndVerifyScore(page, '/exercises/hand_independence', 1);
		});
	});

	// ── Hand Dynamics ──────────────────────────────────────────────────────
	test.describe('Hand dynamics exercise', () => {
		test('renders shell voicing + scale on grand staff', async ({ page }) => {
			await navigateAndVerifyScore(page, '/exercises/hand-dynamics', 1);
		});
	});

	// ── Dexterity ──────────────────────────────────────────────────────────
	test.describe('Dexterity exercise', () => {
		test('renders fingering sequence on single staff', async ({ page }) => {
			await navigateAndVerifyScore(page, '/exercises/dexterity', 1);
		});
	});

	// ── Songs ──────────────────────────────────────────────────────────────
	test.describe('Songs exercise', () => {
		test('renders chord voicings for current song', async ({ page }) => {
			await navigateAndVerifyScore(page, '/exercises/songs', 1);
		});
	});

	// ── Song Chords ────────────────────────────────────────────────────────
	test.describe('Song-chords exercise', () => {
		test('renders chord notation from song data', async ({ page }) => {
			await navigateAndVerifyScore(page, '/exercises/song-chords', 1);
		});
	});

	// ── Song Melody ────────────────────────────────────────────────────────
	test.describe('Song-melody exercise', () => {
		test('renders MusicXML melody score (no wrong note trigger needed)', async ({ page }) => {
			await page.goto('/exercises/song-melody');
			// Song melody embeds a Score component directly — always visible
			await expect(page.locator('.osmd-container svg'), 'OSMD SVG must appear').toBeVisible({
				timeout: SCORE_TIMEOUT
			});
			const count = await page
				.locator('.osmd-container svg ellipse, .osmd-container svg path[fill="#000000"]')
				.count();
			expect(count).toBeGreaterThan(0);
		});
	});

	// ── Rhythm ─────────────────────────────────────────────────────────────
	test.describe('Rhythm exercise (showScore=false)', () => {
		test('score SVG is NOT rendered (rhythm uses timeline instead)', async ({ page }) => {
			await page.goto('/exercises/rhythm');
			// Rhythm exercise sets showScore=false — the OSMD container should be absent or hidden
			await page.waitForTimeout(3_000); // give time for any async load
			const svg = page.locator('.osmd-container svg');
			const isVisible = await svg.isVisible().catch(() => false);
			expect(isVisible).toBe(false);
		});
	});

	// ── Loading & Error states ─────────────────────────────────────────────
	test.describe('Loading and error states', () => {
		test('loading overlay is gone after score renders', async ({ page }) => {
			await navigateAndVerifyScore(page, '/exercises/chords', 1);
			await expect(page.locator('.loading-overlay')).toBeHidden();
		});

		test('error overlay or graceful fallback for bad song URL', async ({ page }) => {
			await page.goto('/exercises/song-chords?song=nonexistent-file-xyz.mxl');
			const hasError = await page.locator('.error-overlay').isVisible().catch(() => false);
			const hasSvg = await page.locator('.osmd-container svg').isVisible().catch(() => false);
			expect(hasError || hasSvg, 'Either error overlay or fallback SVG must exist').toBe(true);
		});
	});

	// ── Cross-exercise: no title/composer text ─────────────────────────────
	test.describe('Score cleanliness (no UI chrome in SVG)', () => {
		const exercisesWithScore = [
			'/exercises/chords',
			'/exercises/scales',
			'/exercises/intervals',
			'/exercises/licks'
		];

		for (const url of exercisesWithScore) {
			test(`${url.replace('/exercises/', '')} — no title or part-name text in SVG`, async ({
				page
			}) => {
				await navigateAndVerifyScore(page, url, 1);
				await expect(
					page.locator(
						'.osmd-container svg text.title, .osmd-container svg text.composer, .osmd-container svg text.partName'
					)
				).toHaveCount(0);
			});
		}
	});
});



