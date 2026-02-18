import { test, expect } from '@playwright/test';

test.describe('Progression Flow', () => {
    test('should update profile, journey and recommendations after practice progress', async ({ page }) => {
        await page.goto('/login');
        await page.evaluate(async () => {
            const { userStatsService } = await import('/src/lib/UserStatsService.ts');
            userStatsService.createProfile('E2E Jazz Student');
        });
        await page.evaluate(async () => {
            const { userStatsService } = await import('/src/lib/UserStatsService.ts');

            userStatsService.recordExerciseResult({
                exerciseId: '/exercises/scales',
                exerciseType: 'scale',
                success: true,
                accuracy: 95,
                timeElapsed: 12_000,
                mistakes: 1,
                score: 90,
                timestamp: new Date()
            });

            userStatsService.trackMissedNote('D4', 'scale');
            userStatsService.updateProfile({ experiencePoints: 90 });

            localStorage.setItem(
                'journey_progress_v2',
                JSON.stringify([
                    {
                        id: 'level-0',
                        status: 'active',
                        lessons: [
                            {
                                id: 'l0-c-scale',
                                completed: false,
                                stars: 3,
                                perfectCompletions: 1
                            }
                        ]
                    }
                ])
            );
        });

        await page.reload();

        await page.goto('/journey');
        await expect(page.locator('a.lesson-card:has-text("C Major Scale")').first()).toBeVisible();
        await expect(page.locator('.mastery-value:has-text("1/3 Perfect")')).toBeVisible();

        await page.goto('/profile');
        await expect(page.locator('.profile-meta')).toContainText(/([1-9]\d*)\s*XP/i);
    });
});
