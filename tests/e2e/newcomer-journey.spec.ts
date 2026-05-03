/**
 * newcomer-journey.spec.ts
 *
 * Comprehensive end-to-end test that follows a brand-new student from first
 * visit all the way through a training session, lesson completion, mastery
 * tracking, and session summary — exactly the experience Duolingo-style apps
 * promise.
 *
 * Chapters
 * --------
 * 1. Onboarding      – login form → home dashboard
 * 2. Training page   – session overview, pillar strips, lesson cards
 * 3. Names exercise  – read note from DOM, play MIDI, repeat until modal
 * 4. Session flow    – modal → continue → session-complete banner
 * 5. Mastery         – third perfect run shows "Mastered!" trophy badge
 *
 * Design rules
 * ------------
 * - Never skip exercise logic via URL param tricks or direct service calls.
 * - The only "test hook" is window.__dispatchMidi which is explicitly wired
 *   by MIDIManager.ensurePlaywrightMidiDispatchHook() for this purpose.
 * - Profile is seeded via addInitScript (localStorage) to avoid repeating
 *   the login form in every test — the login flow itself is tested once.
 * - Journey progress is seeded where needed so each chapter can focus on
 *   one specific part of the flow without replaying every prior step.
 * - Tests run with workers:1 (see playwright.config.ts) — one test at a time,
 *   each with its own fresh isolated browser context, avoiding vite dev server
 *   overload and shared-context state accumulation.
 */

import { test, expect, type BrowserContext, type Page } from '@playwright/test';

// ---------------------------------------------------------------------------
// Shared profile data
// ---------------------------------------------------------------------------

const PROFILE_FRESH = {
	id: 'newcomer-fresh',
	name: 'Jazz Student',
	level: 1,
	experiencePoints: 0, // fresh → shows "getting started" card
	totalPracticeTime: 0,
	createdAt: new Date('2026-01-01').toISOString(),
	lastActivity: new Date('2026-01-01').toISOString()
};

const PROFILE_ACTIVE = {
	...PROFILE_FRESH,
	id: 'newcomer-active',
	experiencePoints: 50 // non-zero → no redirect to login
};

// ---------------------------------------------------------------------------
// Note → MIDI mapping (octave 4, the DEFAULT_OCTAVE used by exercises)
// ---------------------------------------------------------------------------

const NOTE_TO_MIDI: Record<string, number> = {
	C: 60,
	'C#': 61,
	Db: 61,
	D: 62,
	'D#': 63,
	Eb: 63,
	E: 64,
	F: 65,
	'F#': 66,
	Gb: 66,
	G: 67,
	'G#': 68,
	Ab: 68,
	A: 69,
	'A#': 70,
	Bb: 70,
	B: 71
};

// ---------------------------------------------------------------------------
// Dexterity — five-finger (Hanon) sequence for right hand, octave 4
// Precomputed from generateSequence('five-finger', 'right') in dexterity page.
// naturalNotes = [C,D,E,F,G,A,B], startNotes = [C,D,E,F,G,A], octave = 4.
// ---------------------------------------------------------------------------

const FIVE_FINGER_MIDI = [
	// C group: C D E F G  F E D C
	60, 62, 64, 65, 67, 65, 64, 62, 60,
	// D group: D E F G A  G F E D
	62, 64, 65, 67, 69, 67, 65, 64, 62,
	// E group: E F G A B  A G F E
	64, 65, 67, 69, 71, 69, 67, 65, 64,
	// F group: F G A B C5  B A G F
	65, 67, 69, 71, 72, 71, 69, 67, 65,
	// G group: G A B C5 D5  C5 B A G
	67, 69, 71, 72, 74, 72, 71, 69, 67,
	// A group: A B C5 D5 E5  D5 C5 B A
	69, 71, 72, 74, 76, 74, 72, 71, 69
];

// ---------------------------------------------------------------------------
// Context seeds
// ---------------------------------------------------------------------------

/** Seed a logged-in active profile (skips login). */
async function seedProfile(context: BrowserContext, xp = 50) {
	await context.addInitScript((profile) => {
		localStorage.setItem('jazz-midi-user-profile', JSON.stringify(profile));
	}, { ...PROFILE_ACTIVE, experiencePoints: xp });
}

/**
 * Seed profile + journey progress where all Unit-1 lessons are completed
 * EXCEPT u1-white-keys.  The training session will contain:
 *   [u1-white-keys (Go), u1-black-keys (done), u1-five-finger (done), u1-quarter-rhythm (done)]
 * Completing white-keys in that session triggers "Session Complete".
 */
async function seedUnit1AlmostDone(context: BrowserContext) {
	await context.addInitScript(() => {
		localStorage.setItem(
			'jazz-midi-user-profile',
			JSON.stringify({
				id: 'newcomer-e2e',
				name: 'Jazz Student',
				level: 2,
				experiencePoints: 150,
				totalPracticeTime: 120,
				createdAt: new Date('2026-01-01').toISOString(),
				lastActivity: new Date().toISOString()
			})
		);
		localStorage.setItem(
			'journey_progress_v2',
			JSON.stringify([
				{
					id: 'unit-1',
					status: 'active',
					lessons: [
						{ id: 'u1-white-keys', completed: false, stars: 0, perfectCompletions: 0 },
						{ id: 'u1-black-keys', completed: true, stars: 3, perfectCompletions: 3 },
						{ id: 'u1-treble-staff', completed: true, stars: 3, perfectCompletions: 3 },
						{ id: 'u1-five-finger', completed: true, stars: 3, perfectCompletions: 3 },
						{ id: 'u1-quarter-rhythm', completed: true, stars: 3, perfectCompletions: 2 },
						{ id: 'u1-flashcards', completed: true, stars: 3, perfectCompletions: 3 }
					]
				}
			])
		);
	});
}

/**
 * Seed profile + journey progress where u1-white-keys has 2 of 3 perfect
 * completions. One more perfect run will trigger "Mastered!".
 */
async function seedNearMastery(context: BrowserContext) {
	await context.addInitScript(() => {
		localStorage.setItem(
			'jazz-midi-user-profile',
			JSON.stringify({
				id: 'newcomer-mastery',
				name: 'Jazz Student',
				level: 2,
				experiencePoints: 200,
				totalPracticeTime: 180,
				createdAt: new Date('2026-01-01').toISOString(),
				lastActivity: new Date().toISOString()
			})
		);
		// u1-white-keys has 2/3 perfect completions; all others are mastered so that
		// generateTraining always places white-keys first in the session (only incomplete lesson).
		localStorage.setItem(
			'journey_progress_v2',
			JSON.stringify([
				{
					id: 'unit-1',
					status: 'active',
					lessons: [
						{ id: 'u1-white-keys', completed: false, stars: 3, perfectCompletions: 2 },
						{ id: 'u1-black-keys', completed: true, stars: 3, perfectCompletions: 3 },
						{ id: 'u1-treble-staff', completed: true, stars: 3, perfectCompletions: 3 },
						{ id: 'u1-five-finger', completed: true, stars: 3, perfectCompletions: 3 },
						{ id: 'u1-quarter-rhythm', completed: true, stars: 3, perfectCompletions: 2 },
						{ id: 'u1-flashcards', completed: true, stars: 3, perfectCompletions: 3 }
					]
				}
			])
		);
	});
}

// ---------------------------------------------------------------------------
// MIDI helpers
// ---------------------------------------------------------------------------

async function waitForMidi(page: Page) {
	await page.waitForFunction(
		() =>
			typeof (window as any).__dispatchMidi === 'function' &&
			(window as any).__midiExerciseReady === true,
		{ timeout: 25_000 }
	);
}

async function midiOn(page: Page, note: number, velocity = 100) {
	await page.evaluate(
		({ n, v }) => (window as any).__dispatchMidi(new Uint8Array([0x90, n, v])),
		{ n: note, v: velocity }
	);
}

async function midiOff(page: Page, note: number) {
	await page.evaluate(
		(n) => (window as any).__dispatchMidi(new Uint8Array([0x80, n, 0])),
		note
	);
}

/**
 * Play through the Note Names exercise.
 *
 * Each round the exercise displays an English note name; we read it from
 * the DOM and dispatch the corresponding MIDI note.  After a correct hit
 * the exercise auto-advances with a 1 500 ms setTimeout — we detect the
 * change via waitForFunction rather than sleeping a fixed duration.
 *
 * The exercise completes once all 12 chromatic pitch-classes have been
 * played correctly (coveredPitchClasses.size >= 12).  Expected iterations
 * before completion: ~37 (coupon-collector, n=12).  Limit: 70.
 */
async function playNamesExercise(page: Page) {
	// Ensure page is fully hydrated (onMount ran) before polling for MIDI readiness.
	await page.waitForLoadState('networkidle');
	await waitForMidi(page);

	for (let attempt = 0; attempt < 70; attempt++) {
		if (await page.locator('.modal-overlay').isVisible()) break;

		// The question card has no extra class; the answer card gets `.correct`.
		// If all cards are now correct (exercise complete but modal not yet visible)
		// the locator returns nothing — catch the timeout and let the outer
		// modal-visible assertion sort it out.
		const noteText = await page
			.locator('.note-card:not(.correct) .note-name')
			.first()
			.textContent({ timeout: 3_000 })
			.then((t) => t?.trim() ?? '')
			.catch(() => null);

		if (noteText === null) break; // exercise done, wait for modal below

		const midi = NOTE_TO_MIDI[noteText];
		if (midi === undefined) {
			await page.waitForTimeout(300);
			continue;
		}

		await midiOn(page, midi);
		await page.waitForTimeout(80);
		await midiOff(page, midi);

		// Wait until the displayed note changes (auto-advance) OR the modal appears.
		await page
			.waitForFunction(
				(prev) => {
					if (document.querySelector('.modal-overlay')) return true;
					const el = document.querySelector('.note-card:not(.correct) .note-name');
					const curr = el?.textContent?.trim() ?? '';
					return curr !== '' && curr !== prev;
				},
				noteText,
				{ timeout: 3_000 }
			)
			.catch(() => {
				/* last note before modal — timeout is fine */
			});
	}

	await expect(page.locator('.modal-overlay')).toBeVisible({ timeout: 10_000 });
}

/**
 * Play the five-finger dexterity sequence note-by-note.
 * The sequence is deterministic so we can hard-code it.
 */
async function playFiveFingerExercise(page: Page) {
	// Ensure page is fully hydrated before polling for MIDI readiness.
	await page.waitForLoadState('networkidle');
	await waitForMidi(page);

	for (const note of FIVE_FINGER_MIDI) {
		if (await page.locator('.modal-overlay').isVisible()) break;
		await midiOn(page, note);
		await page.waitForTimeout(80);
		await midiOff(page, note);
		await page.waitForTimeout(60);
	}

	await expect(page.locator('.modal-overlay')).toBeVisible({ timeout: 5_000 });
}

// ===========================================================================
// Chapter 1 — Onboarding
// ===========================================================================

test.describe('Chapter 1 — Onboarding', () => {
	// Remove only the app profile key — do NOT call localStorage.clear() as that
	// wipes SvelteKit's internal navigation state and breaks client-side routing.
	test.beforeEach(async ({ context }) => {
		await context.addInitScript(() => {
			localStorage.removeItem('jazz-midi-user-profile');
			localStorage.removeItem('journey_progress_v2');
		});
	});
	test('fresh visitor is redirected to /login', async ({ page }) => {
		test.setTimeout(90_000);
		await page.goto('/');
		// Redirect fires in onMount after Svelte hydrates — needs up to 60s.
		await expect(page).toHaveURL('/login', { timeout: 60_000 });
		await expect(page.locator('h1')).toContainText('Welcome to Jazz MIDI');
	});

	test('login shows feature list and name input', async ({ page }) => {
		test.setTimeout(60_000);
		await page.goto('/login');
		await expect(page.locator('h1')).toContainText('Welcome to Jazz MIDI');
		await expect(page.locator('ul.features-list li')).toHaveCount(3);
		await expect(page.locator('input#name')).toBeVisible();
		await expect(page.locator('.start-btn')).toBeVisible();
	});

	test('empty name shows validation error', async ({ page }) => {
		test.setTimeout(60_000);
		await page.goto('/login');
		// Wait for Svelte to hydrate so onclick handlers are attached.
		await page.waitForLoadState('networkidle');
		await page.locator('.start-btn').click();
		await expect(page.locator('.error')).toBeVisible({ timeout: 5_000 });
		await expect(page).toHaveURL('/login');
	});

	test('entering a name and clicking Start Journey lands on home', async ({ page }) => {
		test.setTimeout(60_000);
		await page.goto('/');
		await expect(page).toHaveURL('/login', { timeout: 30_000 });

		await page.locator('input#name').fill('Alice');
		await page.locator('.start-btn').click();

		await expect(page).toHaveURL('/', { timeout: 15_000 });
		await expect(page.locator('h1')).toContainText('Alice');
	});

	test('pressing Enter in the name field also submits', async ({ page }) => {
		test.setTimeout(60_000);
		await page.goto('/login');
		// Wait for Svelte to hydrate so keydown handler and goto() are available.
		await page.waitForLoadState('networkidle');
		await page.locator('input#name').fill('Bob');
		await page.locator('input#name').press('Enter');
		await expect(page).toHaveURL('/', { timeout: 15_000 });
	});
});

// ===========================================================================
// Chapter 2 — Home Dashboard
// ===========================================================================

test.describe('Chapter 2 — Home Dashboard', () => {
	test.beforeEach(async ({ context }) => {
		await seedProfile(context, 0); // XP=0 → "getting started" card
	});

	test('shows welcome message with student name', async ({ page }) => {
		test.setTimeout(30_000);
		await page.goto('/');
		// Wait for onMount to hydrate the profile name (profile reads from localStorage)
		await page.waitForFunction(
			() => document.querySelector('h1')?.textContent?.includes('Jazz Student'),
			{ timeout: 15_000 }
		);
		await expect(page.locator('h1')).toContainText('Jazz Student');
	});

	test('shows stats bar with level, XP, streak, accuracy', async ({ page }) => {
		test.setTimeout(30_000);
		await page.goto('/');
		const pills = page.locator('.stat-pill');
		await expect(pills).toHaveCount(4);
		await expect(pills.nth(0)).toContainText('Level');
		await expect(pills.nth(1)).toContainText('XP');
		await expect(pills.nth(2)).toContainText('Streak');
		await expect(pills.nth(3)).toContainText('Accuracy');
	});

	test('fresh user sees getting-started card with rhythm and journey links', async ({ page }) => {
		test.setTimeout(30_000);
		await page.goto('/');
		const gsCard = page.locator('.dashboard-card.getting-started-card');
		await expect(gsCard).toBeVisible({ timeout: 10_000 });
		await expect(gsCard.locator('a', { hasText: 'Start Rhythm Exercise' })).toBeVisible();
		await expect(gsCard.locator('a', { hasText: 'View Full Journey' })).toBeVisible();
	});

	test('daily practice card has Start Daily Practice button', async ({ page }) => {
		test.setTimeout(30_000);
		await page.goto('/');
		const card = page.locator('.dashboard-card.daily');
		await expect(card).toBeVisible({ timeout: 10_000 });
		await expect(card.locator('button', { hasText: 'Start Daily Practice' })).toBeVisible();
	});

	test('active unit lessons are listed with links', async ({ page }) => {
		test.setTimeout(30_000);
		await page.goto('/');
		await expect(page.locator('.exercise-card').first()).toBeVisible({ timeout: 10_000 });
	});
});

// ===========================================================================
// Chapter 3 — Training Page
// ===========================================================================

test.describe('Chapter 3 — Training Page', () => {
	test.beforeEach(async ({ context }) => {
		await seedProfile(context);
	});

	test('shows Daily Training header and pillar strip', async ({ page }) => {
		test.setTimeout(45_000);
		await page.goto('/training');
		await expect(page.locator('h1')).toContainText('Daily Training', { timeout: 20_000 });
		await expect(page.locator('.pillar-chip')).toHaveCount(4);
	});

	test('generates a session with exactly 4 lesson cards', async ({ page }) => {
		test.setTimeout(45_000);
		await page.goto('/training');
		await expect(page.locator('.lesson-card').first()).toBeVisible({ timeout: 20_000 });
		await expect(page.locator('.lesson-card')).toHaveCount(4);
	});

	test('each lesson card shows title, pillar tag, and star row', async ({ page }) => {
		test.setTimeout(45_000);
		await page.goto('/training');
		await expect(page.locator('.lesson-card').first()).toBeVisible({ timeout: 20_000 });
		const first = page.locator('.lesson-card').first();
		await expect(first.locator('strong')).toBeVisible();
		await expect(first.locator('.pillar-tag')).toBeVisible();
		await expect(first.locator('.lesson-stars')).toBeVisible();
	});

	test('fresh unit has Go buttons (no checkmarks yet)', async ({ page }) => {
		test.setTimeout(45_000);
		await page.goto('/training');
		await expect(page.locator('.lesson-card').first()).toBeVisible({ timeout: 20_000 });
		await expect(page.locator('.go-btn').first()).toBeVisible();
		await expect(page.locator('.done-icon')).toHaveCount(0);
	});

	test('clicking Go navigates to the exercise with unitId and lessonId params', async ({
		page
	}) => {
		test.setTimeout(45_000);
		await page.goto('/training');
		await expect(page.locator('.go-btn').first()).toBeVisible({ timeout: 20_000 });

		await page.locator('.go-btn').first().click();
		await page.waitForURL(/\/exercises\//, { timeout: 15_000 });

		expect(page.url()).toContain('unitId=');
		expect(page.url()).toContain('lessonId=');
	});

	test('unit overview section lists all unit lessons', async ({ page }) => {
		test.setTimeout(45_000);
		await page.goto('/training');
		await expect(page.locator('.all-lessons')).toBeVisible({ timeout: 20_000 });
		await expect(page.locator('.overview-row')).toHaveCount(6);
	});
});

// ===========================================================================
// Chapter 4 — Names Exercise (the core interaction)
// ===========================================================================

test.describe('Chapter 4 — Names Exercise', () => {
	test.beforeEach(async ({ context }) => {
		await seedProfile(context);
	});

	test('exercise page loads with note card and MIDI is ready', async ({ page }) => {
		test.setTimeout(45_000);
		await page.goto(
			'/exercises/names?unitId=unit-1&lessonId=u1-white-keys&randomMode=false'
		);

		await page.waitForFunction(
			() => (window as any).__midiExerciseReady === true,
			{ timeout: 20_000 }
		);

		await expect(page.locator('.note-card')).toBeVisible();
		await expect(page.locator('.note-name')).toBeVisible();
	});

	test('playing the correct note advances to the next note', async ({ page }) => {
		test.setTimeout(60_000);
		await page.goto('/exercises/names?unitId=unit-1&lessonId=u1-white-keys');
		await waitForMidi(page);

		const before = await page
			.locator('.note-card:not(.correct) .note-name')
			.first()
			.textContent()
			.then((t) => t?.trim() ?? '');

		const midi = NOTE_TO_MIDI[before];
		if (midi) {
			await midiOn(page, midi);
			await page.waitForTimeout(80);
			await midiOff(page, midi);

			// Answer card (.correct) should appear briefly
			await expect(page.locator('.note-card.correct')).toBeVisible({ timeout: 2_000 });
		}
	});

	test('playing a wrong note shows an error message', async ({ page }) => {
		test.setTimeout(60_000);
		await page.goto('/exercises/names?unitId=unit-1&lessonId=u1-white-keys');
		await waitForMidi(page);

		// Read current note and play a definitely wrong one (+6 semitones away)
		const noteText = await page
			.locator('.note-card:not(.correct) .note-name')
			.first()
			.textContent()
			.then((t) => t?.trim() ?? '');

		const midi = NOTE_TO_MIDI[noteText];
		if (midi) {
			const wrongMidi = ((midi - 60 + 6) % 12) + 60;
			if (wrongMidi !== midi) {
				await midiOn(page, wrongMidi);
				await page.waitForTimeout(80);
				await midiOff(page, wrongMidi);
				// Feedback message should appear
				await expect(page.locator('.feedback-message, [class*="feedback"]')).toBeVisible({
					timeout: 2_000
				});
			}
		}
	});
});

// ===========================================================================
// Chapter 5 — Full Training Session Flow
// ===========================================================================

test.describe('Chapter 5 — Full Training Session Flow', () => {
	/**
	 * All unit-1 lessons are completed except u1-white-keys.
	 * The session is: [u1-white-keys (Go), u1-black-keys (done),
	 *                  u1-five-finger (done), u1-quarter-rhythm (done)]
	 * Completing white-keys triggers Session Complete.
	 */
	test.beforeEach(async ({ context }) => {
		await seedUnit1AlmostDone(context);
	});

	test('training page shows 1 active lesson and 3 already done', async ({ page }) => {
		test.setTimeout(30_000);
		await page.goto('/training');
		await page.waitForLoadState('networkidle');
		await expect(page.locator('.lesson-card').first()).toBeVisible({ timeout: 10_000 });

		await expect(page.locator('.go-btn')).toHaveCount(1);
		await expect(page.locator('.done-icon')).toHaveCount(3);
	});

	test('student completes the last lesson and sees the completion modal', async ({ page }) => {
		test.setTimeout(120_000);

		await page.goto('/training');
		await page.waitForLoadState('networkidle');
		await expect(page.locator('.go-btn')).toBeVisible({ timeout: 10_000 });

		// Start the one remaining lesson
		await page.locator('.go-btn').click();
		await page.waitForURL(/\/exercises\/names/, { timeout: 15_000 });

		// Play through the names exercise by reading each displayed note
		await playNamesExercise(page);

		// Completion modal is now visible
		const modal = page.locator('.modal-overlay');
		await expect(modal).toBeVisible();
		await expect(modal.locator('.mastery-bar')).toBeVisible();
		await expect(modal.locator('.mastery-count')).toContainText('/3 perfect');
	});

	test('Continue button in modal navigates back to /training', async ({ page }) => {
		test.setTimeout(120_000);

		await page.goto('/training');
		await page.waitForLoadState('networkidle');
		await expect(page.locator('.go-btn')).toBeVisible({ timeout: 10_000 });
		await page.locator('.go-btn').click();
		await page.waitForURL(/\/exercises\/names/, { timeout: 15_000 });

		await playNamesExercise(page);

		// Click the Continue / Keep Going button
		await page.locator('.continue-btn').click();

		await page.waitForURL(/\/training/, { timeout: 15_000 });
		expect(page.url()).toContain('unitId=');
		expect(page.url()).toContain('lessonId=');
		expect(page.url()).toContain('stars=');
	});

	test('session-complete banner appears after last lesson is done', async ({ page }) => {
		test.setTimeout(120_000);

		await page.goto('/training');
		await page.waitForLoadState('networkidle');
		await expect(page.locator('.go-btn')).toBeVisible({ timeout: 10_000 });
		await page.locator('.go-btn').click();
		await page.waitForURL(/\/exercises\/names/, { timeout: 15_000 });

		await playNamesExercise(page);
		await page.locator('.continue-btn').click();
		await page.waitForURL(/\/training/, { timeout: 15_000 });
		await page.waitForLoadState('networkidle');

		// Session complete banner
		const banner = page.locator('.session-complete');
		await expect(banner).toBeVisible({ timeout: 8_000 });
		await expect(banner.locator('h2')).toContainText('Session Complete');

		// Stats chips: lessons done + XP gained
		await expect(page.locator('.stat-chip').first()).toBeVisible();

		// Both action buttons present
		await expect(page.locator('.session-home-btn')).toBeVisible();
		await expect(page.locator('.session-more-btn')).toBeVisible();
	});

	test('Back to Home navigates to /', async ({ page }) => {
		test.setTimeout(120_000);

		await page.goto('/training');
		await page.waitForLoadState('networkidle');
		await expect(page.locator('.go-btn')).toBeVisible({ timeout: 10_000 });
		await page.locator('.go-btn').click();
		await page.waitForURL(/\/exercises\/names/, { timeout: 15_000 });

		await playNamesExercise(page);
		await page.locator('.continue-btn').click();
		await page.waitForURL(/\/training/, { timeout: 15_000 });
		await page.waitForLoadState('networkidle');

		await expect(page.locator('.session-complete')).toBeVisible({ timeout: 8_000 });

		await page.locator('.session-home-btn').click();
		await expect(page).toHaveURL('/', { timeout: 10_000 });
		await expect(page.locator('h1')).toContainText('Jazz Student');
	});

	test('Practice More dismisses banner and shows a fresh session', async ({ page }) => {
		test.setTimeout(120_000);

		await page.goto('/training');
		await page.waitForLoadState('networkidle');
		await expect(page.locator('.go-btn')).toBeVisible({ timeout: 10_000 });
		await page.locator('.go-btn').click();
		await page.waitForURL(/\/exercises\/names/, { timeout: 15_000 });

		await playNamesExercise(page);
		await page.locator('.continue-btn').click();
		await page.waitForURL(/\/training/, { timeout: 15_000 });
		await page.waitForLoadState('networkidle');

		await expect(page.locator('.session-complete')).toBeVisible({ timeout: 8_000 });

		await page.locator('.session-more-btn').click();

		// Banner gone, lesson cards back
		await expect(page.locator('.session-complete')).not.toBeVisible({ timeout: 5_000 });
		await expect(page.locator('.lesson-card').first()).toBeVisible();
	});
});

// ===========================================================================
// Chapter 6 — Mastery Progression
// ===========================================================================

test.describe('Chapter 6 — Mastery Progression', () => {
	test.beforeEach(async ({ context }) => {
		await seedNearMastery(context);
	});

	test('training page shows mastery hint (2/3 perfect) on the lesson card', async ({ page }) => {
		test.setTimeout(30_000);
		await page.goto('/training');
		await page.waitForLoadState('networkidle');
		await expect(page.locator('.lesson-card').first()).toBeVisible({ timeout: 10_000 });
		// u1-white-keys has perfectCompletions=2 so the hint should show
		await expect(page.locator('.mastery-hint')).toContainText('2/3 perfect');
	});

	test('third perfect run shows Mastered! badge and Next Lesson button', async ({ page }) => {
		test.setTimeout(120_000);

		// Navigate directly to the exercise in journey mode
		await page.goto(
			'/exercises/names?unitId=unit-1&lessonId=u1-white-keys&randomMode=false'
		);

		// Play all notes with no mistakes (all correct → 3 stars)
		await playNamesExercise(page);

		const modal = page.locator('.modal-overlay');
		await expect(modal).toBeVisible();

		// After the 3rd perfect run the lesson is mastered
		await expect(modal.locator('.mastered-badge')).toBeVisible({ timeout: 5_000 });
		await expect(modal.locator('.mastered-badge')).toContainText('Mastered!');

		// Button label switches to "Next Lesson"
		await expect(modal.locator('.continue-btn')).toContainText('Next Lesson');

		// Mastery fill bar should be at 100 %
		const fill = modal.locator('.mastery-fill.mastered');
		await expect(fill).toBeVisible();
	});

	test('Retry button after mastery says Play Again', async ({ page }) => {
		test.setTimeout(120_000);

		await page.goto(
			'/exercises/names?unitId=unit-1&lessonId=u1-white-keys&randomMode=false'
		);
		await playNamesExercise(page);

		const modal = page.locator('.modal-overlay');
		await expect(modal).toBeVisible();
		await expect(modal.locator('.mastered-badge')).toBeVisible({ timeout: 5_000 });
		await expect(modal.locator('.retry-btn')).toContainText('Play Again');
	});
});

// ===========================================================================
// Chapter 7 — Dexterity Exercise
// ===========================================================================

test.describe('Chapter 7 — Dexterity Exercise', () => {
	test.beforeEach(async ({ context }) => {
		await seedProfile(context);
	});

	test('five-finger sequence completes and shows modal', async ({ page }) => {
		test.setTimeout(90_000);
		// unitId + lessonId required to activate journey mode and show the completion modal.
		await page.goto(
			'/exercises/dexterity?mode=five-finger&root=C&bpm=60&unitId=unit-1&lessonId=u1-five-finger'
		);

		await playFiveFingerExercise(page);

		const modal = page.locator('.modal-overlay');
		await expect(modal).toBeVisible({ timeout: 8_000 });
		await expect(modal.locator('.mastery-count')).toBeVisible();
	});

	test('playing a wrong note shows error feedback', async ({ page }) => {
		test.setTimeout(45_000);
		await page.goto('/exercises/dexterity?mode=five-finger&root=C&bpm=60');
		await waitForMidi(page);

		// First expected note is C4=60; play B3=59 (wrong)
		await midiOn(page, 59);
		await page.waitForTimeout(80);
		await midiOff(page, 59);

		await expect(page.locator('.feedback-message, [class*="feedback"]')).toBeVisible({
			timeout: 3_000
		});
	});
});

// ===========================================================================
// Chapter 8 — Navigation & breadcrumbs
// ===========================================================================

test.describe('Chapter 8 — Navigation', () => {
	test.beforeEach(async ({ context }) => {
		await seedProfile(context);
	});

	test('exercise breadcrumb links back to training', async ({ page }) => {
		test.setTimeout(30_000);
		await page.goto('/exercises/names?unitId=unit-1&lessonId=u1-white-keys');
		await expect(page.locator('.exercise-main')).toBeVisible({ timeout: 10_000 });

		// Breadcrumb or back link
		const backLink = page.locator('a[href*="/training"], .breadcrumb a, .back-link');
		if (await backLink.count() > 0) {
			await backLink.first().click();
			await expect(page).toHaveURL(/\/(training|$)/, { timeout: 10_000 });
		}
	});

	test('home page Start Daily Practice navigates to an exercise', async ({ page }) => {
		test.setTimeout(60_000);
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await expect(page.locator('.dashboard-card.daily')).toBeVisible({ timeout: 10_000 });
		// Confirm home page is fully hydrated (profile name rendered).
		await page.waitForFunction(
			() => document.querySelector('h1')?.textContent?.includes('Jazz Student'),
			{ timeout: 15_000 }
		);

		// startDailyPractice uses window.location.assign — just click and wait.
		await page.locator('button', { hasText: 'Start Daily Practice' }).click();
		await page.waitForURL(/\/exercises\//, { timeout: 25_000 });

		expect(page.url()).toContain('/exercises/');
	});
});
