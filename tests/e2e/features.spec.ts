/**
 * Simplified Feature Tests
 * Basic smoke tests for key user-facing features
 */

import { test, expect } from '@playwright/test';

test.describe('Core Features', () => {
  test('home page loads with navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav').first()).toBeVisible();
  });

  test('key routes are accessible', async ({ page }) => {
    const routes = ['/journey', '/exercises', '/training', '/about', '/profile'];
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator('h1')).toBeVisible();
    }
  });

  test('exercise pages load', async ({ page }) => {
    const exercises = ['/exercises/chords', '/exercises/scales', '/exercises/intervals'];
    for (const exercise of exercises) {
      await page.goto(exercise);
      await expect(page.locator('.exercise-main')).toBeVisible();
    }
  });

  test('theme toggle exists', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[aria-label="Toggle Theme"]')).toBeVisible();
  });

  test('training page has workout controls', async ({ page }) => {
    await page.goto('/training');
    await expect(page.locator('button:has-text("Generate")')).toBeVisible();
    await expect(page.locator('input[type="range"]')).toBeVisible();
  });
});
