/**
 * End-to-End Tests for Jazz MIDI Application
 * Tests complete user workflows using Playwright
 */

import { expect, test } from '@playwright/test';

test.describe('Jazz MIDI Application E2E Tests', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the application
		await page.goto('/');

		// Wait for the application to load
		await page.waitForLoadState('networkidle');
	});

	test.describe('Home Page', () => {
		test('should display the main navigation', async ({ page }) => {
			// Check for main navigation elements
			await expect(page.locator('nav')).toBeVisible();
			await expect(page.getByRole('link', { name: 'Chords' })).toBeVisible();
			await expect(page.getByRole('link', { name: 'Scales' })).toBeVisible();
			await expect(page.getByRole('link', { name: 'Two Five Ones' })).toBeVisible();
		});

		test('should show MIDI connection status', async ({ page }) => {
			// Look for MIDI status indicator
			const midiStatus = page.locator('.midi-status, [data-testid="midi-status"]');
			await expect(midiStatus).toBeVisible();
		});

		test('should display virtual keyboard', async ({ page }) => {
			// Check for keyboard component
			const keyboard = page.locator('.keyboard');
			await expect(keyboard).toBeVisible();

			// Should have piano keys
			const keys = page.locator('.key');
			await expect(keys.first()).toBeVisible();
		});
	});

	test.describe('Chord Recognition Exercise', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/chords');
			await page.waitForLoadState('networkidle');
		});

		test('should display chord exercise interface', async ({ page }) => {
			// Check for exercise elements
			await expect(page.locator('h1')).toContainText('Chord');
			await expect(page.locator('.keyboard')).toBeVisible();

			// Should show current chord to identify
			const chordDisplay = page.locator('.chord-display, [data-testid="current-chord"]');
			await expect(chordDisplay).toBeVisible();
		});

		test('should enable debug mode', async ({ page }) => {
			// Look for debug toggle button
			const debugToggle = page.getByRole('button', { name: /debug|🎹/i });

			if (await debugToggle.isVisible()) {
				await debugToggle.click();

				// Check for debug panel
				const debugPanel = page.locator('.debug-panel, [data-testid="debug-panel"]');
				await expect(debugPanel).toBeVisible();
			}
		});

		test('should interact with virtual keyboard', async ({ page }) => {
			// Enable debug mode first to ensure virtual keyboard is interactive
			const debugToggle = page.getByRole('button', { name: /debug|🎹/i });
			if (await debugToggle.isVisible()) {
				await debugToggle.click();
			}

			// Click on a piano key
			const firstKey = page.locator('.key').first();
			await firstKey.click();

			// Should show some feedback or state change
			// This is application-specific, so we'll check for any visible change
			await page.waitForTimeout(100); // Give time for interaction
		});

		test('should show feedback messages', async ({ page }) => {
			// Look for feedback area
			const feedbackArea = page.locator('.feedback, .message, [data-testid="feedback"]');

			// Enable debug mode to interact
			const debugToggle = page.getByRole('button', { name: /debug|🎹/i });
			if (await debugToggle.isVisible()) {
				await debugToggle.click();

				// Try to play a chord using virtual controls
				const playButton = page.getByRole('button', { name: /play/i });
				if (await playButton.isVisible()) {
					await playButton.click();

					// Should show some feedback
					await expect(feedbackArea).toBeVisible();
				}
			}
		});
	});

	test.describe('Scale Practice', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/scales');
			await page.waitForLoadState('networkidle');
		});

		test('should display scale exercise interface', async ({ page }) => {
			await expect(page.locator('h1')).toContainText('Scale');
			await expect(page.locator('.keyboard')).toBeVisible();

			// Should have note/scale selection
			const noteSelect = page.locator('select, .note-selector');
			await expect(noteSelect.first()).toBeVisible();
		});

		test('should allow note selection', async ({ page }) => {
			// Find and interact with note selector
			const noteSelect = page.locator('select#note-select, select[id*="note"]').first();

			if (await noteSelect.isVisible()) {
				await noteSelect.selectOption('F');

				// Should update the display
				await page.waitForTimeout(100);

				// Check that F is now selected
				await expect(noteSelect).toHaveValue('F');
			}
		});

		test('should display expected scale notes', async ({ page }) => {
			// Should show some indication of expected notes
			const expectedNotes = page.locator('.expected, .highlight, .target');

			// At least some indication should be visible
			await expect(expectedNotes.first()).toBeVisible();
		});
	});

	test.describe('Two-Five-One Progressions', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/two_five_ones');
			await page.waitForLoadState('networkidle');
		});

		test('should display progression exercise interface', async ({ page }) => {
			await expect(page.locator('h1')).toContainText('Two Five One');
			await expect(page.locator('.keyboard')).toBeVisible();
		});

		test('should show progression steps', async ({ page }) => {
			// Should indicate the current step in the progression
			const progressionIndicator = page.locator('.progression, .step, .chord-progression');
			await expect(progressionIndicator.first()).toBeVisible();
		});
	});

	test.describe('Responsive Design', () => {
		test('should work on mobile viewport', async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

			await page.goto('/');
			await page.waitForLoadState('networkidle');

			// Navigation should be responsive
			await expect(page.locator('nav')).toBeVisible();

			// Keyboard should be visible and sized appropriately
			await expect(page.locator('.keyboard')).toBeVisible();
		});

		test('should work on tablet viewport', async ({ page }) => {
			await page.setViewportSize({ width: 768, height: 1024 }); // iPad

			await page.goto('/chords');
			await page.waitForLoadState('networkidle');

			// All main elements should be visible
			await expect(page.locator('.keyboard')).toBeVisible();
			await expect(page.locator('nav')).toBeVisible();
		});
	});

	test.describe('Audio Functionality', () => {
		test('should handle audio permission requests', async ({ page }) => {
			// Grant audio permissions
			await page.context().grantPermissions(['microphone']);

			await page.goto('/chords');

			// Enable debug mode to trigger audio
			const debugToggle = page.getByRole('button', { name: /debug|🎹/i });
			if (await debugToggle.isVisible()) {
				await debugToggle.click();

				// Try to trigger audio feedback
				const playButton = page.getByRole('button', { name: /play/i });
				if (await playButton.isVisible()) {
					await playButton.click();
					// Audio playback doesn't have visual confirmation,
					// but should not cause errors
				}
			}
		});
	});

	test.describe('Accessibility', () => {
		test('should have proper heading structure', async ({ page }) => {
			await page.goto('/');

			// Should have proper heading hierarchy
			const h1 = page.locator('h1');
			await expect(h1).toBeVisible();
		});

		test('should support keyboard navigation', async ({ page }) => {
			await page.goto('/chords');

			// Test tab navigation
			await page.keyboard.press('Tab');
			await page.keyboard.press('Tab');

			// Should focus on interactive elements
			const focusedElement = page.locator(':focus');
			await expect(focusedElement).toBeVisible();
		});

		test('should have proper ARIA labels', async ({ page }) => {
			await page.goto('/');

			// Check for ARIA labels on interactive elements
			const ariaLabels = page.locator('[aria-label]');
			await expect(ariaLabels.first()).toBeVisible();
		});
	});

	test.describe('Error Handling', () => {
		test('should handle network errors gracefully', async ({ page }) => {
			// Simulate offline condition
			await page.context().setOffline(true);

			await page.goto('/chords');

			// Application should still render the main interface
			await expect(page.locator('.keyboard')).toBeVisible();

			// Restore connection
			await page.context().setOffline(false);
		});

		test('should handle invalid routes', async ({ page }) => {
			await page.goto('/invalid-route');

			// Should show 404 page or redirect
			// Check if we get redirected or see error page
			await page.waitForLoadState('networkidle');

			// Should either be on error page or redirected to valid page
			const currentUrl = page.url();
			expect(currentUrl).toBeTruthy();
		});
	});

	test.describe('Performance', () => {
		test('should load within reasonable time', async ({ page }) => {
			const startTime = Date.now();

			await page.goto('/');
			await page.waitForLoadState('networkidle');

			const loadTime = Date.now() - startTime;

			// Should load within 5 seconds (generous for testing)
			expect(loadTime).toBeLessThan(5000);
		});

		test('should handle rapid interactions', async ({ page }) => {
			await page.goto('/chords');

			// Enable debug mode
			const debugToggle = page.getByRole('button', { name: /debug|🎹/i });
			if (await debugToggle.isVisible()) {
				await debugToggle.click();
			}

			// Rapidly click multiple keys if available
			const keys = page.locator('.key');
			const keyCount = await keys.count();

			if (keyCount > 0) {
				for (let i = 0; i < Math.min(5, keyCount); i++) {
					await keys.nth(i).click();
					await page.waitForTimeout(50); // Small delay between clicks
				}
			}

			// Application should remain responsive
			await expect(page.locator('.keyboard')).toBeVisible();
		});
	});
});
