/**
 * training.spec.ts - Playwright tests for the /training page.
 * Uses JourneyService (CurriculumEngine was deleted).
 */
import { test, expect, type BrowserContext } from '@playwright/test';

const SEED_PROFILE = {
id: 'test-training-e2e',
name: 'Training Tester',
level: 1,
experiencePoints: 10,
streakDays: 1,
lastPracticeDate: null,
preferences: {}
};

async function seedProfile(context: BrowserContext) {
await context.addInitScript((profile) => {
localStorage.setItem('jazz-midi-user-profile', JSON.stringify(profile));
}, SEED_PROFILE);
}

test.describe('Training page � structure', () => {
test.beforeEach(async ({ context }) => { await seedProfile(context); });

test('shows Daily Training header', async ({ page }) => {
await page.goto('/training');
await page.waitForSelector('.lesson-card', { state: 'visible', timeout: 15_000 });
await expect(page.locator('h1')).toContainText(/Daily Training/i);
});

test('shows all four pillar progress chips', async ({ page }) => {
await page.goto('/training');
await page.waitForSelector('.lesson-card', { state: 'visible', timeout: 15_000 });
await expect(page.locator('.pillars-strip')).toBeVisible();
await expect(page.locator('.pillar-chip')).toHaveCount(4);
for (const label of ['Technique', 'Theory', 'Vocabulary', 'Repertoire']) {
await expect(page.locator('.pillars-strip')).toContainText(label);
}
});

test("shows lesson cards in Today's Session", async ({ page }) => {
await page.goto('/training');
await page.waitForSelector('.lesson-card', { state: 'visible', timeout: 15_000 });
await expect(page.locator('.session-section h2')).toContainText(/Today.s Session/i);
expect(await page.locator('.lesson-card').count()).toBeGreaterThan(0);
});

test('lesson cards show title, pillar tag, star rating', async ({ page }) => {
await page.goto('/training');
await page.waitForSelector('.lesson-card', { state: 'visible', timeout: 15_000 });
const firstCard = page.locator('.lesson-card').first();
await expect(firstCard.locator('.lesson-body strong')).toBeVisible();
await expect(firstCard.locator('.pillar-tag')).toBeVisible();
await expect(firstCard.locator('.lesson-stars')).toBeVisible();
});

test('Go button visible on un-completed cards', async ({ page }) => {
await page.goto('/training');
await page.waitForSelector('.lesson-card', { state: 'visible', timeout: 15_000 });
await expect(page.locator('.go-btn').first()).toBeVisible();
});

test('shows estimated session duration', async ({ page }) => {
await page.goto('/training');
await page.waitForSelector('.lesson-card', { state: 'visible', timeout: 15_000 });
await expect(page.locator('.time-estimate')).toContainText(/min/i);
});

test('shows unit badge and difficulty badge', async ({ page }) => {
await page.goto('/training');
await page.waitForSelector('.lesson-card', { state: 'visible', timeout: 15_000 });
await expect(page.locator('.unit-badge')).toBeVisible();
await expect(page.locator('.difficulty-badge')).toBeVisible();
});

test('shows Unit Progress overview with rows', async ({ page }) => {
await page.goto('/training');
await page.waitForSelector('.lesson-card', { state: 'visible', timeout: 15_000 });
await expect(page.locator('.unit-overview h2')).toContainText(/Unit Progress/i);
expect(await page.locator('.overview-row').count()).toBeGreaterThan(2);
});

test('pillar percentages are shown', async ({ page }) => {
await page.goto('/training');
await page.waitForSelector('.lesson-card', { state: 'visible', timeout: 15_000 });
const pcts = await page.locator('.pillar-pct').allTextContents();
expect(pcts.length).toBe(4);
for (const pct of pcts) expect(pct).toMatch(/\d+%/);
});

test('pillar fill bars are rendered', async ({ page }) => {
await page.goto('/training');
await page.waitForSelector('.lesson-card', { state: 'visible', timeout: 15_000 });
await expect(page.locator('.pillar-fill')).toHaveCount(4);
});
});

test.describe('Training page � interactions', () => {
test.beforeEach(async ({ context }) => { await seedProfile(context); });

test('Go button navigates to exercise with unitId + lessonId params', async ({ page }) => {
await page.goto('/training');
await page.waitForSelector('.lesson-card', { state: 'visible', timeout: 15_000 });
await page.locator('.go-btn').first().click();
// Wait for SvelteKit client-side navigation to complete
await page.waitForURL(/\/exercises\//, { timeout: 10_000 });
const url = page.url();
expect(url).toContain('unitId=');
expect(url).toContain('lessonId=');
});

test('Refresh button keeps page functional', async ({ page }) => {
await page.goto('/training');
await page.waitForSelector('.lesson-card', { state: 'visible', timeout: 15_000 });
await page.locator('.icon-btn[title="Refresh session"]').click();
await page.waitForTimeout(300);
expect(await page.locator('.lesson-card').count()).toBeGreaterThan(0);
await expect(page.locator('.pillar-chip')).toHaveCount(4);
});

test('returning with stars param marks lesson done', async ({ page }) => {
// u1-five-finger (technique pillar) stays in the regenerated session after 3-star completion
await page.goto('/training?unitId=unit-1&lessonId=u1-five-finger&stars=3');
// Wait for lesson cards to render (populated in onMount)
await expect(page.locator('.lesson-card').first()).toBeVisible();
const done = page.locator('.lesson-card.done, .lesson-card .done-icon, .lesson-card .session-done-icon');
await expect(done.first()).toBeVisible({ timeout: 8_000 });
});
});


