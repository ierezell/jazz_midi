import { test, expect } from '@playwright/test';

const ROUTES = [
	'/',
	'/journey',
	'/exercises/two_five_ones',
	'/exercises/scales',
	'/exercises/chords',
	'/exercises/intervals',
	'/exercises/songs',
	'/exercises/licks',
	'/exercises/names',
	'/exercises/partition',
	'/exercises/rhythm',
	'/exercises/flashcards',
	'/exercises/dexterity',
	'/exercises',
	'/profile'
];

test.describe('Navigation Flow', () => {
	test('should show core nav links', async ({ page }) => {
		await page.goto('/');

		await expect(page.locator('nav.nav-bar a[href="/journey"]').first()).toBeVisible();
		await expect(page.locator('nav.nav-bar a[href="/exercises"]').first()).toBeVisible();
		await expect(page.locator('nav.nav-bar a[href="/profile"]').first()).toBeVisible();
	});

	test('should navigate to Flashcards page from exercises hub', async ({ page }) => {
		await page.goto('/');
		await page.locator('nav.nav-bar a[href="/exercises"]').first().click();
		await page.click('a[href="/exercises/flashcards"]');

		// Verify navigation
		await expect(page).toHaveURL('/exercises/flashcards');
		await expect(page.locator('body')).toContainText(/Exercise|Flash|card/i);
	});

	test('should navigate to journey page from nav', async ({ page }) => {
		await page.goto('/');
		await page.locator('nav.nav-bar a[href="/journey"]').first().click();
		await expect(page).toHaveURL('/journey');
		await expect(page.locator('h1')).toContainText(/Journey/i);
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
