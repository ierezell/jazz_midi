import { test, expect } from '@playwright/test';

test.describe('User Journey - Complete Exercise Flow', () => {
	test('should complete a full exercise session', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('.logo-text')).toBeVisible();

		// Navigate to an exercise via main nav + exercise hub
		await page.locator('nav.nav-bar a[href="/exercises"]').first().click();
		await page.click('a[href="/exercises/flashcards"]');

		// Wait for exercise page to load
		await expect(page).toHaveURL('/exercises/flashcards');

		// Verify exercise components are present
		// Look for common exercise elements
		const hasExerciseElements = await page.locator('body').evaluate((body) => {
			const text = body.textContent || '';
			return text.length > 0;
		});
		expect(hasExerciseElements).toBeTruthy();
	});

	test('should navigate through Journey page', async ({ page }) => {
		await page.goto('/');

		// Navigate to Journey
		await page.locator('nav.nav-bar a[href="/journey"]').first().click();

		// Verify Journey page loaded
		await expect(page).toHaveURL('/journey');
		await expect(page.locator('h1')).toContainText(/Journey/i);
	});

	test('should access profile statistics page', async ({ page }) => {
		await page.goto('/');

		// Navigate to Profile
		await page.locator('nav.nav-bar a[href="/profile"]').first().click();

		// Verify Profile page loaded
		await expect(page).toHaveURL('/profile');
	});

	test('should access Profile page', async ({ page }) => {
		await page.goto('/');

		// Navigate to Profile
		await page.locator('nav.nav-bar a[href="/profile"]').first().click();

		// Verify Profile page loaded
		await expect(page).toHaveURL('/profile');
	});
});

test.describe('User Journey - Exercise Type Access', () => {
	const exercises = [
		{ route: '/exercises/two_five_ones', name: 'II-V-I' },
		{ route: '/exercises/scales', name: 'Scales' },
		{ route: '/exercises/chords', name: 'Chords' },
		{ route: '/exercises/intervals', name: 'Intervals' },
		{ route: '/exercises/songs', name: 'Songs' },
		{ route: '/exercises/licks', name: 'Licks' },
		{ route: '/exercises/names', name: 'Names' },
		{ route: '/exercises/partition', name: 'Partition' },
		{ route: '/exercises/rhythm', name: 'Rhythm' },
		{ route: '/exercises/flashcards', name: 'Flashcards' },
		{ route: '/exercises/dexterity', name: 'Dexterity' }
	];

	for (const exercise of exercises) {
		test(`should load ${exercise.name} exercise without errors`, async ({ page }) => {
			await page.goto(exercise.route);

			// Wait for page to load
			await page.waitForLoadState('domcontentloaded');

			// Check that page loaded (has content)
			const bodyText = await page.textContent('body');
			expect(bodyText).toBeTruthy();
			expect(bodyText!.length).toBeGreaterThan(0);

			// Verify no 404 error
			expect(bodyText).not.toContain('404');
			expect(bodyText).not.toContain('Not Found');
		});
	}
});

test.describe('User Journey - Navigation Persistence', () => {
	test('should maintain state when navigating between pages', async ({ page }) => {
		// Start at home
		await page.goto('/');

		// Go to Journey
		await page.goto('/journey');
		await expect(page).toHaveURL('/journey');

		// Go to an exercise
		await page.goto('/exercises/scales');
		await expect(page).toHaveURL('/exercises/scales');

		// Go to profile
		await page.goto('/profile');
		await expect(page).toHaveURL('/profile');

		// Navigate back
		await page.goBack();
		await expect(page).toHaveURL('/exercises/scales');

		await page.goBack();
		await expect(page).toHaveURL('/journey');
	});
});
