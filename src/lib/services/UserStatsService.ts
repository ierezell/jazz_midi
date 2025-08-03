/**
 * User Statistics Service
 * Manages user progress tracking, statistics, and achievements
 */

import type { ChordType, Note } from '../../midi/midi';
import type { ExerciseResult } from '../core/StateManager';

// ===== INTERFACES =====

export interface UserProfile {
	id: string;
	name: string;
	avatar?: string;
	createdAt: Date;
	lastActivity: Date;
	totalPracticeTime: number; // in minutes
	level: number;
	experiencePoints: number;
}

// Per-note/scale/chord progress tracking
export interface NoteProgress {
	note: Note;
	exerciseType: 'scale' | 'chord' | 'progression';
	chordType?: ChordType;
	attempts: number;
	successes: number;
	averageAccuracy: number;
	bestTime: number; // in seconds
	lastPracticed: Date;
	masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'mastered';
}

export interface UserStatistics {
	// Overall stats
	totalExercises: number;
	completedExercises: number;
	averageAccuracy: number;
	averageScore: number;
	totalPracticeTime: number; // in minutes
	currentStreak: number;
	longestStreak: number;

	// Per-note progress tracking
	noteProgress: Map<string, NoteProgress>; // key: note-exerciseType-chordType

	// Exercise type breakdown
	chordStats: ExerciseTypeStats;
	scaleStats: ExerciseTypeStats;
	progressionStats: ExerciseTypeStats;

	// Mastery tracking
	masteredChords: ChordMastery[];
	masteredScales: ScaleMastery[];
	masteredProgressions: ProgressionMastery[];

	// Recent activity
	recentSessions: SessionSummary[];
	improvementTrend: number; // positive = improving
}

export interface ExerciseTypeStats {
	attempted: number;
	completed: number;
	averageAccuracy: number;
	averageScore: number;
	bestScore: number;
	totalTime: number;
	masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface ChordMastery {
	root: Note;
	chordType: ChordType;
	masteryLevel: number; // 0-100
	attemptsCount: number;
	bestScore: number;
	averageAccuracy: number;
	lastPracticed: Date;
	isLearning: boolean;
	isMastered: boolean;
}

export interface ScaleMastery {
	root: Note;
	scaleType: 'major' | 'minor' | 'dorian' | 'mixolydian' | 'pentatonic';
	masteryLevel: number; // 0-100
	attemptsCount: number;
	bestScore: number;
	averageAccuracy: number;
	lastPracticed: Date;
	isLearning: boolean;
	isMastered: boolean;
}

export interface ProgressionMastery {
	key: Note;
	progressionType: 'ii-V-I' | 'I-vi-ii-V' | 'vi-ii-V-I' | 'rhythm-changes';
	masteryLevel: number; // 0-100
	attemptsCount: number;
	bestScore: number;
	averageAccuracy: number;
	lastPracticed: Date;
	isLearning: boolean;
	isMastered: boolean;
}

export interface SessionSummary {
	date: Date;
	duration: number; // in minutes
	exercisesCompleted: number;
	averageScore: number;
	topCategory: 'chords' | 'scales' | 'progressions';
	improvements: string[];
}

export interface Achievement {
	id: string;
	name: string;
	description: string;
	icon: string;
	unlockedAt?: Date;
	progress: number; // 0-100
	requirements: AchievementRequirement[];
}

export interface AchievementRequirement {
	type: 'exercise_count' | 'accuracy' | 'streak' | 'mastery' | 'time';
	target: number;
	current: number;
}

// ===== SERVICE CLASS =====

export class UserStatsService {
	private static instance: UserStatsService;
	private storageKey = 'jazz-midi-user-stats';
	private profileKey = 'jazz-midi-user-profile';
	private listeners: ((stats: UserStatistics) => void)[] = [];

	private profile: UserProfile;
	private statistics: UserStatistics;

	private constructor() {
		this.profile = this.loadProfile();
		this.statistics = this.loadStatistics();
	}

	static getInstance(): UserStatsService {
		if (!UserStatsService.instance) {
			UserStatsService.instance = new UserStatsService();
		}
		return UserStatsService.instance;
	}

	// ===== PROFILE MANAGEMENT =====

	getProfile(): UserProfile {
		return { ...this.profile };
	}

	updateProfile(updates: Partial<UserProfile>): void {
		this.profile = { ...this.profile, ...updates, lastActivity: new Date() };
		this.saveProfile();
	}

	// ===== STATISTICS ACCESS =====

	getStatistics(): UserStatistics {
		return { ...this.statistics };
	}

	// ===== EXERCISE RESULT PROCESSING =====

	recordExerciseResult(result: ExerciseResult): void {
		this.updateOverallStats(result);
		this.updateTypeStats(result);
		this.updateMastery(result);
		this.updateStreak(result);
		this.checkAchievements();

		this.profile.lastActivity = new Date();
		this.profile.experiencePoints += this.calculateExperiencePoints(result);
		this.profile.level = this.calculateLevel(this.profile.experiencePoints);

		this.saveStatistics();
		this.saveProfile();
		this.notifyListeners();
	}

	// ===== MASTERY TRACKING =====

	getChordMastery(root: Note, chordType: ChordType): ChordMastery | null {
		return (
			this.statistics.masteredChords.find((m) => m.root === root && m.chordType === chordType) ||
			null
		);
	}

	getScaleMastery(root: Note, scaleType: ScaleMastery['scaleType']): ScaleMastery | null {
		return (
			this.statistics.masteredScales.find((m) => m.root === root && m.scaleType === scaleType) ||
			null
		);
	}

	getProgressionMastery(
		key: Note,
		progressionType: ProgressionMastery['progressionType']
	): ProgressionMastery | null {
		return (
			this.statistics.masteredProgressions.find(
				(m) => m.key === key && m.progressionType === progressionType
			) || null
		);
	}

	// ===== ACHIEVEMENTS =====

	getAchievements(): Achievement[] {
		return this.getDefaultAchievements().map((achievement) => {
			const progress = this.calculateAchievementProgress(achievement);
			return {
				...achievement,
				progress,
				unlockedAt: progress >= 100 ? this.profile.lastActivity : undefined
			};
		});
	}

	// ===== SESSION TRACKING =====

	startSession(): void {
		// Track session start for time calculation
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('jazz-midi-session-start', Date.now().toString());
		}
	}

	endSession(): void {
		if (typeof localStorage !== 'undefined') {
			const startTime = localStorage.getItem('jazz-midi-session-start');
			if (startTime) {
				const duration = (Date.now() - parseInt(startTime)) / (1000 * 60); // minutes
				this.recordSession(duration);
				localStorage.removeItem('jazz-midi-session-start');
			}
		}
	}

	// ===== EXPORT/IMPORT =====

	exportData(): string {
		return JSON.stringify(
			{
				profile: this.profile,
				statistics: this.statistics,
				exportDate: new Date(),
				version: '1.0'
			},
			null,
			2
		);
	}

	importData(data: string): boolean {
		try {
			const imported = JSON.parse(data);
			if (imported.profile && imported.statistics) {
				this.profile = { ...this.profile, ...imported.profile };
				this.statistics = { ...this.statistics, ...imported.statistics };
				this.saveProfile();
				this.saveStatistics();
				this.notifyListeners();
				return true;
			}
		} catch (error) {
			console.error('Failed to import user data:', error);
		}
		return false;
	}

	// ===== LISTENERS =====

	subscribe(listener: (stats: UserStatistics) => void): () => void {
		this.listeners.push(listener);
		return () => {
			const index = this.listeners.indexOf(listener);
			if (index > -1) {
				this.listeners.splice(index, 1);
			}
		};
	}

	// ===== PRIVATE METHODS =====

	private loadProfile(): UserProfile {
		try {
			if (typeof localStorage !== 'undefined') {
				const stored = localStorage.getItem(this.profileKey);
				if (stored) {
					const parsed = JSON.parse(stored);
					return {
						...parsed,
						createdAt: new Date(parsed.createdAt),
						lastActivity: new Date(parsed.lastActivity)
					};
				}
			}
		} catch (error) {
			console.warn('Failed to load user profile:', error);
		}

		return this.createDefaultProfile();
	}

	private loadStatistics(): UserStatistics {
		try {
			if (typeof localStorage !== 'undefined') {
				const stored = localStorage.getItem(this.storageKey);
				if (stored) {
					const parsed = JSON.parse(stored);
					return {
						...parsed,
						masteredChords:
							parsed.masteredChords?.map((m: any) => ({
								...m,
								lastPracticed: new Date(m.lastPracticed)
							})) || [],
						masteredScales:
							parsed.masteredScales?.map((m: any) => ({
								...m,
								lastPracticed: new Date(m.lastPracticed)
							})) || [],
						masteredProgressions:
							parsed.masteredProgressions?.map((m: any) => ({
								...m,
								lastPracticed: new Date(m.lastPracticed)
							})) || [],
						recentSessions:
							parsed.recentSessions?.map((s: any) => ({
								...s,
								date: new Date(s.date)
							})) || []
					};
				}
			}
		} catch (error) {
			console.warn('Failed to load user statistics:', error);
		}

		return this.createDefaultStatistics();
	}

	private createDefaultProfile(): UserProfile {
		return {
			id: crypto.randomUUID(),
			name: 'Jazz Student',
			createdAt: new Date(),
			lastActivity: new Date(),
			totalPracticeTime: 0,
			level: 1,
			experiencePoints: 0
		};
	}

	private createDefaultStatistics(): UserStatistics {
		return {
			totalExercises: 0,
			completedExercises: 0,
			averageAccuracy: 0,
			averageScore: 0,
			totalPracticeTime: 0,
			currentStreak: 0,
			longestStreak: 0,
			noteProgress: new Map<string, NoteProgress>(),
			chordStats: this.createDefaultTypeStats(),
			scaleStats: this.createDefaultTypeStats(),
			progressionStats: this.createDefaultTypeStats(),
			masteredChords: [],
			masteredScales: [],
			masteredProgressions: [],
			recentSessions: [],
			improvementTrend: 0
		};
	}

	private createDefaultTypeStats(): ExerciseTypeStats {
		return {
			attempted: 0,
			completed: 0,
			averageAccuracy: 0,
			averageScore: 0,
			bestScore: 0,
			totalTime: 0,
			masteryLevel: 'beginner'
		};
	}

	private updateOverallStats(result: ExerciseResult): void {
		this.statistics.totalExercises++;
		if (result.success) {
			this.statistics.completedExercises++;
		}

		// Update averages
		const total = this.statistics.totalExercises;
		this.statistics.averageAccuracy =
			(this.statistics.averageAccuracy * (total - 1) + result.accuracy) / total;
		this.statistics.averageScore =
			(this.statistics.averageScore * (total - 1) + result.score) / total;

		this.statistics.totalPracticeTime += result.timeElapsed / (1000 * 60); // convert to minutes
	}

	private updateTypeStats(result: ExerciseResult): void {
		const stats = this.getTypeStats(result.exerciseType);

		stats.attempted++;
		if (result.success) {
			stats.completed++;
		}

		const total = stats.attempted;
		stats.averageAccuracy = (stats.averageAccuracy * (total - 1) + result.accuracy) / total;
		stats.averageScore = (stats.averageScore * (total - 1) + result.score) / total;
		stats.bestScore = Math.max(stats.bestScore, result.score);
		stats.totalTime += result.timeElapsed / (1000 * 60);

		// Update mastery level based on performance
		stats.masteryLevel = this.calculateMasteryLevel(stats);
	}

	private updateMastery(result: ExerciseResult): void {
		// This would update specific chord/scale/progression mastery
		// Implementation depends on having exercise details in result
		// For now, this is a placeholder
	}

	private updateStreak(result: ExerciseResult): void {
		if (result.success && result.accuracy >= 80) {
			this.statistics.currentStreak++;
			this.statistics.longestStreak = Math.max(
				this.statistics.longestStreak,
				this.statistics.currentStreak
			);
		} else {
			this.statistics.currentStreak = 0;
		}
	}

	private getTypeStats(type: ExerciseResult['exerciseType']): ExerciseTypeStats {
		switch (type) {
			case 'chord':
				return this.statistics.chordStats;
			case 'scale':
				return this.statistics.scaleStats;
			case 'progression':
				return this.statistics.progressionStats;
		}
	}

	private calculateMasteryLevel(stats: ExerciseTypeStats): ExerciseTypeStats['masteryLevel'] {
		if (stats.averageScore >= 90 && stats.attempted >= 100) return 'expert';
		if (stats.averageScore >= 80 && stats.attempted >= 50) return 'advanced';
		if (stats.averageScore >= 70 && stats.attempted >= 20) return 'intermediate';
		return 'beginner';
	}

	private calculateExperiencePoints(result: ExerciseResult): number {
		let points = result.score;
		if (result.success) points += 10;
		if (result.accuracy >= 100) points += 20;
		if (result.mistakes === 0) points += 15;
		return points;
	}

	private calculateLevel(xp: number): number {
		return Math.floor(xp / 1000) + 1;
	}

	private recordSession(duration: number): void {
		const session: SessionSummary = {
			date: new Date(),
			duration,
			exercisesCompleted: 0, // Would need to track during session
			averageScore: 0, // Would need to track during session
			topCategory: 'chords', // Would need to track during session
			improvements: []
		};

		this.statistics.recentSessions.unshift(session);
		if (this.statistics.recentSessions.length > 10) {
			this.statistics.recentSessions.pop();
		}
	}

	private getDefaultAchievements(): Achievement[] {
		return [
			{
				id: 'first-chord',
				name: 'First Chord',
				description: 'Complete your first chord exercise',
				icon: '🎵',
				progress: 0,
				requirements: [{ type: 'exercise_count', target: 1, current: 0 }]
			},
			{
				id: 'chord-master',
				name: 'Chord Master',
				description: 'Complete 100 chord exercises',
				icon: '🎼',
				progress: 0,
				requirements: [{ type: 'exercise_count', target: 100, current: 0 }]
			},
			{
				id: 'perfect-accuracy',
				name: 'Perfect Performance',
				description: 'Achieve 100% accuracy in an exercise',
				icon: '⭐',
				progress: 0,
				requirements: [{ type: 'accuracy', target: 100, current: 0 }]
			},
			{
				id: 'practice-streak',
				name: 'Practice Makes Perfect',
				description: 'Maintain a 7-day practice streak',
				icon: '🔥',
				progress: 0,
				requirements: [{ type: 'streak', target: 7, current: 0 }]
			}
		];
	}

	private calculateAchievementProgress(achievement: Achievement): number {
		// Calculate progress based on current statistics
		// This is a simplified implementation
		switch (achievement.id) {
			case 'first-chord':
				return this.statistics.chordStats.completed > 0 ? 100 : 0;
			case 'chord-master':
				return Math.min(100, (this.statistics.chordStats.completed / 100) * 100);
			case 'perfect-accuracy':
				return this.statistics.averageAccuracy >= 100 ? 100 : 0;
			case 'practice-streak':
				return Math.min(100, (this.statistics.currentStreak / 7) * 100);
			default:
				return 0;
		}
	}

	private checkAchievements(): void {
		// Check for newly unlocked achievements
		// Could trigger notifications/celebrations
	}

	/**
	 * Update progress for a specific note/exercise combination
	 */
	updateNoteProgress(
		note: Note, 
		exerciseType: 'scale' | 'chord' | 'progression',
		chordType: ChordType | undefined,
		success: boolean,
		timeSpent: number,
		accuracy: number
	): void {
		const key = this.generateProgressKey(note, exerciseType, chordType);
		let progress = this.statistics.noteProgress.get(key);

		if (!progress) {
			progress = {
				note,
				exerciseType,
				chordType,
				attempts: 0,
				successes: 0,
				averageAccuracy: 0,
				bestTime: Infinity,
				lastPracticed: new Date(),
				masteryLevel: 'beginner'
			};
		}

		progress.attempts++;
		if (success) {
			progress.successes++;
		}
		progress.averageAccuracy = ((progress.averageAccuracy * (progress.attempts - 1)) + accuracy) / progress.attempts;
		if (timeSpent < progress.bestTime) {
			progress.bestTime = timeSpent;
		}
		progress.lastPracticed = new Date();

		// Update mastery level based on recent performance
		const successRate = progress.successes / progress.attempts;
		if (successRate >= 0.95 && progress.averageAccuracy >= 95) {
			progress.masteryLevel = 'mastered';
		} else if (successRate >= 0.8 && progress.averageAccuracy >= 80) {
			progress.masteryLevel = 'advanced';
		} else if (successRate >= 0.6 && progress.averageAccuracy >= 60) {
			progress.masteryLevel = 'intermediate';
		} else {
			progress.masteryLevel = 'beginner';
		}

		this.statistics.noteProgress.set(key, progress);
		this.saveStatistics();
	}

	/**
	 * Get progress for a specific note/exercise combination
	 */
	getNoteProgress(
		note: Note, 
		exerciseType: 'scale' | 'chord' | 'progression',
		chordType?: ChordType
	): NoteProgress | undefined {
		const key = this.generateProgressKey(note, exerciseType, chordType);
		return this.statistics.noteProgress.get(key);
	}

	/**
	 * Get all progress entries for a specific exercise type
	 */
	getProgressByType(exerciseType: 'scale' | 'chord' | 'progression'): NoteProgress[] {
		return Array.from(this.statistics.noteProgress.values())
			.filter(progress => progress.exerciseType === exerciseType);
	}

	private generateProgressKey(
		note: Note, 
		exerciseType: 'scale' | 'chord' | 'progression',
		chordType?: ChordType
	): string {
		return chordType ? `${note}-${exerciseType}-${chordType}` : `${note}-${exerciseType}`;
	}

	private saveProfile(): void {
		try {
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem(this.profileKey, JSON.stringify(this.profile));
			}
		} catch (error) {
			console.warn('Failed to save user profile:', error);
		}
	}

	private saveStatistics(): void {
		try {
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem(this.storageKey, JSON.stringify(this.statistics));
			}
		} catch (error) {
			console.warn('Failed to save user statistics:', error);
		}
	}

	private notifyListeners(): void {
		this.listeners.forEach((listener) => {
			try {
				listener(this.statistics);
			} catch (error) {
				console.error('Error in stats listener:', error);
			}
		});
	}
}

// Export singleton instance
export const userStatsService = UserStatsService.getInstance();
