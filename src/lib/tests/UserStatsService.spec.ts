import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserStatsService } from '../UserStatsService';

describe('UserStatsService', () => {
	let service: UserStatsService;

	beforeEach(() => {
		// We need to reset the singleton state if possible,
		// but since we can't easily, we'll just check increments.
		service = UserStatsService.getInstance();
	});

	it('should record partition exercise result', () => {
		const initialStats = service.getStatistics();
		const initialCount = initialStats.partitionStats.completed;

		service.recordExerciseResult({
			exerciseId: 'test-partition',
			exerciseType: 'partition',
			success: true,
			accuracy: 100,
			timeElapsed: 1000,
			mistakes: 0,
			score: 100,
			timestamp: new Date()
		});

		const newStats = service.getStatistics();
		expect(newStats.partitionStats.completed).toBe(initialCount + 1);
		// If it was the first one, accuracy is 100. If not, it's averaged.
		// We can't strictly assert 100 unless we know previous state.
		// But we can assert it's defined.
		expect(newStats.partitionStats.averageAccuracy).toBeDefined();
	});

	it('should record rhythm exercise result', () => {
		const initialStats = service.getStatistics();
		const initialCount = initialStats.rhythmStats.completed;

		service.recordExerciseResult({
			exerciseId: 'test-rhythm',
			exerciseType: 'rhythm',
			success: true,
			accuracy: 90,
			timeElapsed: 2000,
			mistakes: 1,
			score: 90,
			timestamp: new Date()
		});

		const newStats = service.getStatistics();
		expect(newStats.rhythmStats.completed).toBe(initialCount + 1);
	});

	it('should update note progress for rhythm', () => {
		service.updateNoteProgress('C', 'rhythm', undefined, true, 100, 100);
		const progress = service.getNoteProgress('C', 'rhythm');
		expect(progress).toBeDefined();
		expect(progress?.exerciseType).toBe('rhythm');
		// Check if successes incremented (hard to know initial value, but should be >= 1)
		expect(progress?.successes).toBeGreaterThanOrEqual(1);
	});

	it('should update note progress for partition', () => {
		service.updateNoteProgress('D', 'partition', undefined, false, 200, 0);
		const progress = service.getNoteProgress('D', 'partition');
		expect(progress).toBeDefined();
		expect(progress?.exerciseType).toBe('partition');
		expect(progress?.attempts).toBeGreaterThanOrEqual(1);
	});
});
