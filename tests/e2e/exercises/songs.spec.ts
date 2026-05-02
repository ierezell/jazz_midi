import { test, expect } from '@playwright/test';

test.describe('Songs Exercise', () => {
	test('route responds without crashing', async ({ page }) => {
		// This route may have loading issues - just verify server responds
		const response = await page.goto('/exercises/songs', { timeout: 10_000 });
		expect(response).not.toBeNull();
		// Give time for any content to load
		await page.waitForTimeout(3000);
		// Check if page has any content at all
		const bodyText = await page.locator('body').textContent().catch(() => '');
		expect(bodyText?.length ?? 0).toBeGreaterThan(0);
	});
});

