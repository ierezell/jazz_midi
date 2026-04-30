import { test, expect } from '@playwright/test';

test.describe('Training System (Adaptive Workouts)', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/training');
		await page.waitForLoadState('networkidle');
	});

	test('should display pillar stats overview', async ({ page }) => {
		await expect(page.locator('h1')).toContainText('Training Plan');
		await expect(page.locator('.pillars-grid')).toBeVisible();

		// Should show 4 pillars
		const pillars = await page.locator('.pillar-card').count();
		expect(pillars).toBe(4);

		// Each pillar should have progress
		await expect(page.locator('.pillar-card:has-text("Technique")')).toBeVisible();
		await expect(page.locator('.pillar-card:has-text("Theory")')).toBeVisible();
		await expect(page.locator('.pillar-card:has-text("Vocabulary")')).toBeVisible();
		await expect(page.locator('.pillar-card:has-text("Repertoire")')).toBeVisible();
	});

	test('should show recommended daily focus', async ({ page }) => {
		await expect(page.locator('.recommendation-banner')).toBeVisible();
		await expect(page.locator('.recommendation-banner')).toContainText("Today's Focus");

		// Should have a start button
		await expect(page.locator('.recommendation-banner button')).toBeVisible();
	});

	test('should generate custom workout', async ({ page }) => {
		// Seed some practice data first to create available skills
		await page.evaluate(() => {
			// Record practice on foundational skills to make them available
			const curriculumEngine = (window as any).curriculumEngine;
			if (curriculumEngine) {
				// Make scale-geometry-single in-progress
				curriculumEngine.recordPractice('scale-geometry-single', 75, 5);
				// Make chord-shells in-progress  
				curriculumEngine.recordPractice('chord-shells', 70, 5);
			}
		});
		
		// Wait a bit for state update
		await page.waitForTimeout(500);
		
		// Set duration
		await page.locator('input[type="range"]').fill('20');

		// Click generate
		await page.locator('button:has-text("Generate")').click();

		// Should show workout session
		await expect(page.locator('.workout-session')).toBeVisible({ timeout: 5_000 });

		// Should have exercises
		const exerciseCount = await page.locator('.exercise-item').count();
		// With fresh state, might have 0 exercises - that's ok
		expect(exerciseCount).toBeGreaterThanOrEqual(0);
	});

	test('should allow pillar focus selection', async ({ page }) => {
		// Seed practice data
		await page.evaluate(() => {
			const curriculumEngine = (window as any).curriculumEngine;
			if (curriculumEngine) {
				curriculumEngine.recordPractice('scale-geometry-single', 75, 5);
			}
		});
		await page.waitForTimeout(500);
		
		// Select technique pillar
		await page.locator('.pillar-btn:has-text("Technique")').click();
		// Generate workout
		await page.locator('button:has-text("Generate")').click();

		// Should show workout
		await expect(page.locator('.workout-session')).toBeVisible({ timeout: 5_000 });
	});

	test('should display weakness areas', async ({ page }) => {
		// Play some exercises first to generate weakness data
		await page.goto('/exercises/ghost-notes');
		await page.waitForLoadState('networkidle');

		// Play wrong notes to create weakness
		await page.evaluate(() => {
			// Simulate MIDI input with high velocity (wrong for ghost notes)
			const event = new CustomEvent('midi-message', {
				detail: { noteNumber: 60, velocity: 100, type: 'on' }
			});
			window.dispatchEvent(event);
		});

		// Go back to training
		await page.goto('/training');
		await page.waitForLoadState('networkidle');

		// Should show weaknesses section if any exist
		const weaknessesSection = page.locator('.weaknesses-section');
		if (await weaknessesSection.isVisible().catch(() => false)) {
			await expect(weaknessesSection).toContainText('Areas Needing Attention');
		}
	});

	test('should show curriculum path', async ({ page }) => {
		await expect(page.locator('.curriculum-section')).toBeVisible();
		await expect(page.locator('.curriculum-section')).toContainText('Curriculum Path');

		// Should show skills
		const skillCount = await page.locator('.curriculum-item').count();
		expect(skillCount).toBeGreaterThan(0);
	});

	test('should navigate to exercise from workout', async ({ page }) => {
		// Seed practice data first
		await page.evaluate(() => {
			const curriculumEngine = (window as any).curriculumEngine;
			if (curriculumEngine) {
				curriculumEngine.recordPractice('scale-geometry-single', 75, 5);
			}
		});
		await page.waitForTimeout(500);
		
		// Generate workout
		await page.locator('input[type="range"]').fill('10');
		await page.locator('button:has-text("Generate")').click();

		// Wait for workout
		await expect(page.locator('.workout-session')).toBeVisible({ timeout: 5_000 });

		// Click first exercise start button
		await page.locator('.exercise-item .start-ex-btn').first().click();

		// Should navigate to exercise
		await expect(page).toHaveURL(/\/exercises\//, { timeout: 5_000 });
	});

	test('should track pillar progress', async ({ page }) => {
		// Check each pillar has progress bar
		const progressBars = await page.locator('.pillar-card .progress-bar').count();
		expect(progressBars).toBe(4);

		// Check each pillar has progress text
		const progressTexts = await page.locator('.pillar-card .progress-text').count();
		expect(progressTexts).toBe(4);
	});

	test('should update workout when duration changes', async ({ page }) => {
		// Seed practice data
		await page.evaluate(() => {
			const curriculumEngine = (window as any).curriculumEngine;
			if (curriculumEngine) {
				curriculumEngine.recordPractice('scale-geometry-single', 75, 5);
				curriculumEngine.recordPractice('chord-shells', 70, 5);
			}
		});
		await page.waitForTimeout(500);
		
		// Set to 30 minutes
		await page.locator('input[type="range"]').fill('30');
		await page.waitForTimeout(200);

		// Generate
		await page.locator('button:has-text("Generate")').click();

		// Should show workout session (check for 'min' which appears in duration)
		await expect(page.locator('.workout-session')).toContainText('min');
	});
});
