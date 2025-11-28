import { userStatsService } from './UserStatsService';

export interface Level {
	id: number;
	name: string;
	description: string;
	requirements: LevelRequirement[];
	unlockedExercises: string[];
}

export interface LevelRequirement {
	type: 'xp' | 'exercise_count' | 'mastery';
	target: number;
	description: string;
}

export class JourneyService {
	private static instance: JourneyService;

	private levels: Level[] = [
		{
			id: 1,
			name: 'Beginner',
			description: 'Start your jazz journey with basic chords and scales.',
			requirements: [{ type: 'xp', target: 0, description: 'Start the game' }],
			unlockedExercises: ['/exercises/chords', '/exercises/scales']
		},
		{
			id: 2,
			name: 'Intermediate',
			description: 'Learn about intervals and simple progressions.',
			requirements: [
				{ type: 'xp', target: 500, description: 'Earn 500 XP' },
				{ type: 'exercise_count', target: 10, description: 'Complete 10 exercises' }
			],
			unlockedExercises: ['/exercises/intervals', '/exercises/two_five_ones']
		},
		{
			id: 3,
			name: 'Advanced',
			description: 'Master complex chords and reading partitions.',
			requirements: [
				{ type: 'xp', target: 2000, description: 'Earn 2000 XP' },
				{ type: 'mastery', target: 5, description: 'Master 5 chords' }
			],
			unlockedExercises: ['/exercises/partition', '/exercises/songs']
		}
	];

	private constructor() {}

	static getInstance(): JourneyService {
		if (!JourneyService.instance) {
			JourneyService.instance = new JourneyService();
		}
		return JourneyService.instance;
	}

	getCurrentLevel(): Level {
		const profile = userStatsService.getProfile();
		// Simple logic: find the highest level where requirements are met
		// For now, we just use the profile level which is calculated from XP
		// But we should probably verify requirements

		return this.levels.find((l) => l.id === profile.level) || this.levels[0];
	}

	getNextLevel(): Level | null {
		const current = this.getCurrentLevel();
		return this.levels.find((l) => l.id === current.id + 1) || null;
	}

	getLevelProgress(level: Level): number {
		const profile = userStatsService.getProfile();
		const stats = userStatsService.getStatistics();

		let totalProgress = 0;
		let requirementCount = 0;

		for (const req of level.requirements) {
			requirementCount++;
			let current = 0;
			switch (req.type) {
				case 'xp':
					current = profile.experiencePoints;
					break;
				case 'exercise_count':
					current = stats.completedExercises;
					break;
				case 'mastery':
					current = stats.masteredChords.filter((c) => c.isMastered).length;
					break;
			}
			if (req.target === 0) {
				totalProgress += 1;
			} else {
				totalProgress += Math.min(1, current / req.target);
			}
		}

		return requirementCount > 0 ? (totalProgress / requirementCount) * 100 : 100;
	}

	isExerciseUnlocked(path: string): boolean {
		const currentLevel = this.getCurrentLevel();
		// Check if exercise is in current or previous levels
		for (const level of this.levels) {
			if (level.id <= currentLevel.id && level.unlockedExercises.includes(path)) {
				return true;
			}
		}
		return false;
	}
}

export const journeyService = JourneyService.getInstance();
