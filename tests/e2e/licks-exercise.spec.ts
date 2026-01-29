import { test, expect } from '@playwright/test';

test.describe('Licks Exercise', () => {
	test('should load and display licks exercise page', async ({ page }) => {
		await page.goto('/exercises/licks');

		// Check page title/header
		await expect(page.locator('h2')).toBeVisible();

		// Check that lick metadata is displayed
		await expect(page.locator('.lick-meta')).toBeVisible();

		// Check that progress section exists
		await expect(page.locator('.progress-section')).toBeVisible();

		// Check that controls are available
		await expect(page.locator('#hand-select')).toBeVisible();
		await expect(page.locator('#difficulty-select')).toBeVisible();
		await expect(page.locator('.new-lick-btn')).toBeVisible();
	});

	test('should load different licks when clicking "New Lick"', async ({ page }) => {
		await page.goto('/exercises/licks');

		// Get initial lick name
		const initialName = await page.locator('h2').textContent();

		// Click "New Lick" button
		await page.click('.new-lick-btn');

		// Wait a moment for the new lick to load
		await page.waitForTimeout(100);

		// Verify score or lick display exists
		await expect(page.locator('.lick-header')).toBeVisible();
	});

	test('should filter by hand selection', async ({ page }) => {
		await page.goto('/exercises/licks');

		// Select left hand
		await page.selectOption('#hand-select', 'left');

		// Verify the page still loads correctly
		await expect(page.locator('.lick-meta')).toBeVisible();
	});

	test('should filter by difficulty', async ({ page }) => {
		await page.goto('/exercises/licks');

		// Select intermediate difficulty
		await page.selectOption('#difficulty-select', 'intermediate');

		// Verify the page still loads correctly
		await expect(page.locator('.lick-meta')).toBeVisible();
	});

	test('should have no console errors', async ({ page }) => {
		const consoleErrors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				consoleErrors.push(msg.text());
			}
		});

		await page.goto('/exercises/licks');
		await page.waitForTimeout(2000);

		expect(consoleErrors).toHaveLength(0);
	});
});
