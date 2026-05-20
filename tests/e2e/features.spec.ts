/**
 * features.spec.ts - Basic smoke tests for key user-facing features.
 */
import { test, expect, type BrowserContext } from '@playwright/test';

const SEED_PROFILE = {
id: 'test-features-e2e',
name: 'Feature Tester',
level: 1,
experiencePoints: 10,
streakDays: 0,
lastPracticeDate: null,
preferences: {}
};

async function seedProfile(context: BrowserContext) {
await context.addInitScript((profile) => {
localStorage.setItem('jazz-midi-user-profile', JSON.stringify(profile));
}, SEED_PROFILE);
}

test.describe('Core Features', () => {
test.beforeEach(async ({ context }) => { await seedProfile(context); });

test('home page loads with navigation', async ({ page }) => {
await page.goto('/');
await expect(page.locator('h1')).toBeVisible();
await expect(page.locator('nav').first()).toBeVisible();
});

test('key routes are accessible', async ({ page }) => {
for (const route of ['/journey', '/exercises', '/training', '/about', '/profile']) {
await page.goto(route);
await expect(page.locator('h1')).toBeVisible();
}
});

test('exercise pages load', async ({ page }) => {
for (const ex of ['/exercises/chords', '/exercises/scales', '/exercises/intervals']) {
await page.goto(ex);
await expect(page.locator('.exercise-main')).toBeVisible();
}
});

test('theme toggle exists', async ({ page }) => {
await page.goto('/');
await expect(page.locator('[aria-label="Toggle Theme"]')).toBeVisible();
});

test('training page shows pillar strip and lesson cards', async ({ page }) => {
await page.goto('/training');
await expect(page.locator('.pillars-strip')).toBeVisible();
expect(await page.locator('.lesson-card').count()).toBeGreaterThan(0);
});
});
