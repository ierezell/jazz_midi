/**
 * Comprehensive Feature Tests
 * Tests all user-facing features across the application
 */

import { test, expect } from '@playwright/test';

// Feature 1: Navigation
test.describe('Navigation Features', () => {
  test('navigate through all main sections', async ({ page }) => {
    await page.goto('/');
    
    // Home page
    await expect(page.locator('h1')).toContainText('Jazz');
    
    // Navigate to Journey
    await page.click('text=Journey');
    await expect(page.url()).toContain('/journey');
    await expect(page.locator('h1')).toContainText('Journey');
    
    // Navigate to Exercises
    await page.click('text=Gym');
    await expect(page.url()).toContain('/exercises');
    await expect(page.locator('h1')).toContainText('Exercise');
    
    // Navigate to Training
    await page.click('text=Training');
    await expect(page.url()).toContain('/training');
    await expect(page.locator('h1')).toContainText('Training');
  });

  test('mobile navigation works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Open hamburger menu
    await page.click('[aria-label="Open menu"]');
    await expect(page.locator('.mobile-menu')).toBeVisible();
    
    // Navigate via mobile menu
    await page.click('.mobile-menu a:has-text("Journey")');
    await expect(page.url()).toContain('/journey');
  });
});

// Feature 2: Theme Toggle
test.describe('Theme Feature', () => {
  test('toggle theme', async ({ page }) => {
    await page.goto('/');
    
    // Check initial theme
    const initialTheme = await page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );
    
    // Toggle theme
    await page.click('[aria-label="Toggle theme"]');
    
    // Verify theme changed
    const newTheme = await page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );
    expect(newTheme).not.toBe(initialTheme);
  });

  test('theme persists across navigation', async ({ page }) => {
    await page.goto('/');
    await page.click('[aria-label="Toggle theme"]');
    
    const theme = await page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );
    
    await page.click('text=Journey');
    await page.waitForTimeout(500);
    
    const persistedTheme = await page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );
    expect(persistedTheme).toBe(theme);
  });
});

// Feature 3: Training Page - Workout Generation
test.describe('Training Features', () => {
  test('generate workout with "All" pillars', async ({ page }) => {
    await page.goto('/training');
    
    // Ensure "All" is selected
    await page.click('button:has-text("All")');
    
    // Generate workout
    await page.click('button:has-text("Generate")');
    
    // Verify workout appears
    await expect(page.locator('.workout-session')).toBeVisible();
    
    // Verify exercises are listed
    const exerciseCount = await page.locator('.exercise-item').count();
    expect(exerciseCount).toBeGreaterThan(0);
  });

  test('generate workout with specific pillar', async ({ page }) => {
    await page.goto('/training');
    
    // Select technique pillar
    await page.click('button:has-text("Technique")');
    
    // Generate workout
    await page.click('button:has-text("Generate")');
    
    // Verify workout appears
    await expect(page.locator('.workout-session')).toBeVisible();
    
    // Verify technique exercises
    const techniqueCount = await page.locator('.exercise-item:has-text("technique")').count();
    expect(techniqueCount).toBeGreaterThan(0);
  });

  test('change workout duration', async ({ page }) => {
    await page.goto('/training');
    
    // Change duration to 30 minutes
    await page.fill('input[type="range"]', '30');
    
    // Generate workout
    await page.click('button:has-text("Generate")');
    
    // Verify 30 minutes shown
    await expect(page.locator('.workout-meta')).toContainText('30 min');
  });

  test('start exercise from workout', async ({ page }) => {
    await page.goto('/training');
    await page.click('button:has-text("Generate")');
    
    // Click first exercise start button
    await page.click('.exercise-item button:has(Play)');
    
    // Verify navigation to exercise
    await expect(page.url()).toContain('/exercises/');
  });
});

// Feature 4: Journey
test.describe('Journey Features', () => {
  test('view learning units', async ({ page }) => {
    await page.goto('/journey');
    
    // Verify units displayed
    const unitCount = await page.locator('.unit-card').count();
    expect(unitCount).toBeGreaterThan(0);
  });

  test('start practice from unit', async ({ page }) => {
    await page.goto('/journey');
    
    // Click practice button on active unit
    await page.click('button:has-text("Practice")');
    
    // Should navigate to an exercise
    await expect(page.url()).toContain('/exercises/');
  });

  test('view lessons in unit', async ({ page }) => {
    await page.goto('/journey');
    
    // Click on active unit
    await page.click('.unit-card:has(.active)');
    
    // Lessons should be visible
    await expect(page.locator('.lesson-item').first()).toBeVisible();
  });
});

// Feature 5: Exercises
test.describe('Exercise Features', () => {
  test('view all exercise categories', async ({ page }) => {
    await page.goto('/exercises');
    
    const categories = [
      'Rhythm',
      'Scales',
      'Chords',
      'Intervals',
      'Flashcards',
      'Songs'
    ];
    
    for (const category of categories) {
      await expect(page.locator(`text=${category}`)).toBeVisible();
    }
  });

  test('navigate to specific exercise', async ({ page }) => {
    await page.goto('/exercises');
    
    // Click on scales
    await page.click('text=Scales');
    await expect(page.url()).toContain('/exercises/scales');
    
    // Verify exercise loads
    await expect(page.locator('.exercise-container')).toBeVisible();
  });

  test('exercise with MIDI interaction', async ({ page }) => {
    // This would require mocking MIDI access
    // Simplified version checks exercise UI exists
    await page.goto('/exercises/names');
    
    await expect(page.locator('.keyboard')).toBeVisible();
    await expect(page.locator('.score')).toBeVisible();
  });
});

// Feature 6: Home Page
test.describe('Home Features', () => {
  test('view user statistics', async ({ page }) => {
    await page.goto('/');
    
    // Stats widget should be visible
    await expect(page.locator('.stats-widget')).toBeVisible();
  });

  test('start daily practice', async ({ page }) => {
    await page.goto('/');
    
    await page.click('button:has-text("Start Daily Practice")');
    
    // Should navigate to an exercise
    await expect(page.url()).toContain('/exercises/');
  });

  test('view active unit', async ({ page }) => {
    await page.goto('/');
    
    // Active unit section should be visible
    await expect(page.locator('.active-unit')).toBeVisible();
  });
});

// Feature 7: Profile
test.describe('Profile Features', () => {
  test('view profile information', async ({ page }) => {
    await page.goto('/profile');
    
    await expect(page.locator('h1')).toContainText('Profile');
    await expect(page.locator('.stats-dashboard')).toBeVisible();
  });

  test('view achievements', async ({ page }) => {
    await page.goto('/profile');
    
    await expect(page.locator('.achievements')).toBeVisible();
  });

  test('view practice history', async ({ page }) => {
    await page.goto('/profile');
    
    await expect(page.locator('.practice-history')).toBeVisible();
  });
});

// Feature 8: Error Handling
test.describe('Error Handling', () => {
  test('404 page for unknown routes', async ({ page }) => {
    await page.goto('/nonexistent-route');
    
    await expect(page.locator('text=404')).toBeVisible();
    await expect(page.locator('a:has-text("Go Home")')).toBeVisible();
  });

  test('no console errors on page load', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    expect(errors).toHaveLength(0);
  });
});

// Feature 9: Login
test.describe('Login Features', () => {
  test('login form', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="name"]', 'Test User');
    await page.click('button[type="submit"]');
    
    // Should redirect to home
    await expect(page.url()).toBe('/');
  });
});

// Feature 10: About
test.describe('About Features', () => {
  test('about page content', async ({ page }) => {
    await page.goto('/about');
    
    await expect(page.locator('h1')).toContainText('About');
    await expect(page.locator('.about-content')).toBeVisible();
  });
});
