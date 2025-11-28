import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JourneyService } from '../JourneyService';
import { userStatsService } from '../UserStatsService';

describe('JourneyService', () => {
	let journeyService: JourneyService;

	beforeEach(() => {
		// Reset singleton if possible, or just get instance
		journeyService = JourneyService.getInstance();

		// Mock userStatsService
		vi.spyOn(userStatsService, 'getProfile').mockReturnValue({
			id: 'test',
			name: 'Test User',
			createdAt: new Date(),
			lastActivity: new Date(),
			totalPracticeTime: 0,
			level: 1,
			experiencePoints: 0
		});

		vi.spyOn(userStatsService, 'getStatistics').mockReturnValue({
			totalExercises: 0,
			completedExercises: 0,
			averageAccuracy: 0,
			averageScore: 0,
			totalPracticeTime: 0,
			currentStreak: 0,
			longestStreak: 0,
			noteProgress: new Map(),
			chordStats: {
				attempted: 0,
				completed: 0,
				averageAccuracy: 0,
				averageScore: 0,
				bestScore: 0,
				totalTime: 0,
				masteryLevel: 'beginner'
			},
			scaleStats: {
				attempted: 0,
				completed: 0,
				averageAccuracy: 0,
				averageScore: 0,
				bestScore: 0,
				totalTime: 0,
				masteryLevel: 'beginner'
			},
			progressionStats: {
				attempted: 0,
				completed: 0,
				averageAccuracy: 0,
				averageScore: 0,
				bestScore: 0,
				totalTime: 0,
				masteryLevel: 'beginner'
			},
			partitionStats: {
				attempted: 0,
				completed: 0,
				averageAccuracy: 0,
				averageScore: 0,
				bestScore: 0,
				totalTime: 0,
				masteryLevel: 'beginner'
			},
			rhythmStats: {
				attempted: 0,
				completed: 0,
				averageAccuracy: 0,
				averageScore: 0,
				bestScore: 0,
				totalTime: 0,
				masteryLevel: 'beginner'
			},
			masteredChords: [],
			masteredScales: [],
			masteredProgressions: [],
			recentSessions: [],
			improvementTrend: 0
		});
	});

	it('should return the correct initial level', () => {
		const level = journeyService.getCurrentLevel();
		expect(level.id).toBe(1);
		expect(level.name).toBe('Beginner');
	});

	it('should return the next level', () => {
		const next = journeyService.getNextLevel();
		expect(next).toBeDefined();
		expect(next?.id).toBe(2);
	});

	it('should calculate level progress', () => {
		const level = journeyService.getCurrentLevel();
		const progress = journeyService.getLevelProgress(level);
		// Level 1 has 0 XP requirement, so progress should be 100% or 0% depending on logic?
		// Actually requirements are: type: 'xp', target: 0. current is 0. 0/0 is NaN but logic handles it?
		// Let's check logic: totalProgress += Math.min(1, current / req.target);
		// If target is 0, division by zero -> Infinity -> min(1, Infinity) = 1.
		// So progress should be 100%?
		// Wait, if target is 0, it means "start game".
		expect(progress).toBe(100);
	});

	it('should check if exercise is unlocked', () => {
		expect(journeyService.isExerciseUnlocked('/exercises/chords')).toBe(true);
		expect(journeyService.isExerciseUnlocked('/exercises/partition')).toBe(false); // Level 3
	});
});
