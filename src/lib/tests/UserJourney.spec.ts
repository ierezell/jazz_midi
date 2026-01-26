import { describe, it, expect, beforeEach, vi } from 'vitest';
import { userStatsService } from '../UserStatsService';
import { journeyService } from '../JourneyService';

describe('User Journey Integration', () => {
	beforeEach(() => {
		// Reset services and storage before each test
		localStorage.clear();
		vi.clearAllMocks();

		// Reset service states (assuming they have reset methods or we can re-instantiate if they weren't singletons, 
		// but they are singletons. We rely on them reading from localStorage on init or having a way to reset).
		// Since they are singletons, we might need to manually reset their internal state if they don't expose a reset.
		// UserStatsService has createProfile which resets stats.
		// JourneyService loads from storage.

		// Force reload from empty storage
		userStatsService['loadProfile']();
		userStatsService['loadStatistics']();
		journeyService['loadProgress']();
	});

	it('should complete the full onboarding and practice flow', () => {
		// 1. Initial State: No Profile
		expect(userStatsService.getProfile().name).toBe('Jazz Student');
		// In the real app, this triggers a redirect to /login. 
		// Here we verify the condition that triggers it.
		expect(userStatsService.getProfile().experiencePoints).toBe(0);

		// 2. User Creates Profile (Login Page)
		const userName = 'Test User';
		userStatsService.createProfile(userName);

		const profile = userStatsService.getProfile();
		expect(profile.name).toBe(userName);
		expect(profile.id).toBeDefined();
		expect(profile.level).toBe(1);

		// 3. User views Dashboard and sees active unit (Dashboard Page)
		const units = journeyService.getUnits();
		const activeUnit = units.find(u => u.status === 'active');
		expect(activeUnit).toBeDefined();
		expect(activeUnit?.id).toBe('unit-1'); // Assuming unit-1 is first

		// 4. User starts a lesson (Daily Practice)
		const lessonToPractice = journeyService.getPracticeLesson(activeUnit!.id);
		expect(lessonToPractice).toBeDefined();

		// 5. User completes the lesson (BaseExercise component logic)
		// The component calls:
		// a. userStatsService.recordExerciseResult
		// b. journeyService.completeLesson

		const lessonId = lessonToPractice!.lesson.id;
		const exerciseType = 'scale'; // Example

		userStatsService.recordExerciseResult({
			exerciseId: lessonId,
			exerciseType,
			success: true,
			accuracy: 95,
			timeElapsed: 10000,
			mistakes: 1,
			score: 90,
			timestamp: new Date()
		});

		journeyService.completeLesson(activeUnit!.id, lessonId, 3); // 3 stars

		// 6. Verify Progress Updates

		// Stats should update
		const updatedProfile = userStatsService.getProfile();
		expect(updatedProfile.experiencePoints).toBeGreaterThan(0);
		expect(userStatsService.getStatistics().completedExercises).toBe(1);

		// Journey should update
		const updatedUnits = journeyService.getUnits();
		const updatedLesson = updatedUnits.find(u => u.id === activeUnit!.id)?.lessons.find(l => l.id === lessonId);
		expect(updatedLesson?.stars).toBe(3);
		expect(updatedLesson?.perfectCompletions).toBe(1);

		// If it was the last lesson, next unit might unlock (depending on logic)
		// But for this test, we just verify the single lesson progress.
	});

	it('should recommend weaknesses after failures', () => {
		// 1. Create Profile
		userStatsService.createProfile('Weakness Tester');

		// 2. Simulate failing some chords/notes
		// The app calls updateNoteProgress
		userStatsService.updateNoteProgress('C', 'chord', 'maj7', false, 1, 0);
		userStatsService.updateNoteProgress('C', 'chord', 'maj7', false, 1, 0);
		userStatsService.updateNoteProgress('D', 'partition', undefined, false, 1, 0);

		// 3. Get Recommendations
		const recommendations = userStatsService.getWeaknessRecommendations();

		// 4. Verify recommendations exist
		expect(recommendations.length).toBeGreaterThan(0);
		// Should recommend based on Cmaj7 or D note
		const hasChordRec = recommendations.some(r => r.weakness.includes('Chord'));
		const hasNoteRec = recommendations.some(r => r.weakness.includes('Note'));
		expect(hasChordRec || hasNoteRec).toBe(true);
	});
});
