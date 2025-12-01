import { test, expect } from '@playwright/test';

const ROUTES = [
	'/',
	'/journey',
	'/exercises/random',
	'/exercises/two_five_ones',
	'/exercises/scales',
	'/exercises/chords',
	'/exercises/intervals',
	'/exercises/songs',
	'/exercises/names',
	'/exercises/partition',
	'/exercises/rhythm',
	'/exercises/flashcards',
	'/exercises/dexterity',
	'/stats',
	'/profile'
];

test.describe('Navigation Flow', () => {
	test('should be able to navigate to all routes via hamburger menu', async ({ page }) => {
		await page.goto('/');

		// Open hamburger menu
		await page.click('button[aria-label="Toggle menu"]');

		// Wait for menu to be visible
		await expect(page.locator('nav.menu-content')).toBeVisible();

		// Verify all expected menu items are present
		for (const route of ROUTES) {
			const link = page.locator(`nav.menu-content a[href="${route}"]`);
			await expect(link).toBeVisible();
		}
	});

	test('should navigate to Flashcards page from menu', async ({ page }) => {
		await page.goto('/');

		// Open menu
		await page.click('button[aria-label="Toggle menu"]');
		await expect(page.locator('nav.menu-content')).toBeVisible();

		// Click Flashcards link
		await page.click('nav.menu-content a[href="/exercises/flashcards"]');

		// Verify navigation
		await expect(page).toHaveURL('/exercises/flashcards');
		await expect(page.locator('text=Flashcards').or(page.locator('text=flashcard'))).toBeVisible();
	});

	test('should navigate to Dexterity page from menu', async ({ page }) => {
		await page.goto('/');

		// Open menu
		await page.click('button[aria-label="Toggle menu"]');
		await expect(page.locator('nav.menu-content')).toBeVisible();

		// Click Dexterity link
		await page.click('nav.menu-content a[href="/exercises/dexterity"]');

		// Verify navigation
		await expect(page).toHaveURL('/exercises/dexterity');
		await expect(
			page.locator('text=Dexterity').or(page.locator('text=dexterity'))
		).toBeVisible();
	});

	test('should close menu when clicking a link', async ({ page }) => {
		await page.goto('/');

		// Open menu
		await page.click('button[aria-label="Toggle menu"]');
		await expect(page.locator('nav.menu-content')).toBeVisible();

		// Click any link
		await page.click('nav.menu-content a[href="/journey"]');

		// Menu should close
		await expect(page.locator('nav.menu-content')).not.toBeVisible();
	});

	test('should close menu when clicking overlay', async ({ page }) => {
		await page.goto('/');

		// Open menu
		await page.click('button[aria-label="Toggle menu"]');
		await expect(page.locator('nav.menu-content')).toBeVisible();

		// Click overlay
		await page.click('.menu-overlay');

		// Menu should close
		await expect(page.locator('nav.menu-content')).not.toBeVisible();
	});

	test('should close menu when pressing Escape', async ({ page }) => {
		await page.goto('/');

		// Open menu
		await page.click('button[aria-label="Toggle menu"]');
		await expect(page.locator('nav.menu-content')).toBeVisible();

		// Press Escape
		await page.keyboard.press('Escape');

		// Menu should close
		await expect(page.locator('nav.menu-content')).not.toBeVisible();
	});

	test('should be able to access all routes directly via URL', async ({ page }) => {
		for (const route of ROUTES) {
			await page.goto(route);

			// Check that we didn't get a 404 or error page
			// Look for common error indicators
			const bodyText = await page.textContent('body');
			expect(bodyText).not.toContain('404');
			expect(bodyText).not.toContain('Not Found');
			expect(bodyText).not.toContain('Page not found');
		}
	});
});
