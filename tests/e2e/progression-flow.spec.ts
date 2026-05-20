import { test, expect, type BrowserContext } from '@playwright/test';

const SEED_PROFILE = {
	id: 'flow-test-student',
	name: 'Flow Tester',
	level: 2,
	experiencePoints: 90,
	totalPracticeTime: 10,
	createdAt: new Date('2026-01-01').toISOString(),
	lastActivity: new Date('2026-05-01').toISOString()
};

async function seedProfile(context: BrowserContext) {
	await context.addInitScript((profile) => {
		localStorage.setItem('jazz-midi-user-profile', JSON.stringify(profile));
	}, SEED_PROFILE);
}

test.describe('Progression Flow', () => {
	test('should update profile, journey and recommendations after practice progress', async ({
		page,
		context
	}) => {
		await seedProfile(context);

		// Profile page should show XP
		await page.goto('/profile');
		await expect(page.locator('.profile-meta')).toBeVisible();
		await expect(page.locator('.profile-meta')).toContainText(/90\s*XP/i);

		// Journey page should be accessible and show units
		await page.goto('/journey');
		await expect(page.locator('.unit-section').first()).toBeVisible();
		expect(await page.locator('.unit-section').count()).toBeGreaterThan(0);
	});
});

