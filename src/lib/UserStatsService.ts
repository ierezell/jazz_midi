import type { ChordType, ExerciseResult, Note } from './types/types';
export interface UserProfile {
	id: string;
	name: string;
	avatar?: string;
	createdAt: Date;
	lastActivity: Date;
	totalPracticeTime: number;
	level: number;
	experiencePoints: number;
}
export interface NoteProgress {
	note: Note;
	exerciseType: 'scale' | 'chord' | 'progression' | 'partition' | 'rhythm';
	chordType?: ChordType;
	attempts: number;
	successes: number;
	averageAccuracy: number;
	bestTime: number;
	lastPracticed: Date;
	masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'mastered';
}
export interface MissedNote {
	count: number;
	lastMissed: Date;
	exerciseType: string;
}

export interface DayStats {
	date: string; // ISO date string for consistent key format
	exercisesCompleted: number;
	practiceTime: number; // in minutes
}

export interface UserStatistics {
	totalExercises: number;
	completedExercises: number;
	averageAccuracy: number;
	averageScore: number;
	totalPracticeTime: number;
	currentStreak: number;
	longestStreak: number;
	noteProgress: Map<string, NoteProgress>;
	missedNotes: Map<string, MissedNote>; // Track missed notes
	missedChords: Map<string, MissedNote>; // Track missed chords
	practiceCalendar: Map<string, DayStats>; // Track daily practice
	chordStats: ExerciseTypeStats;
	scaleStats: ExerciseTypeStats;
	progressionStats: ExerciseTypeStats;
	partitionStats: ExerciseTypeStats;
	rhythmStats: ExerciseTypeStats;
	masteredChords: ChordMastery[];
	masteredScales: ScaleMastery[];
	masteredProgressions: ProgressionMastery[];
	recentSessions: SessionSummary[];
	improvementTrend: number;
}
export interface ExerciseTypeStats {
	attempted: number;
	completed: number;
	averageAccuracy: number;
	averageScore: number;
	bestScore: number;
	totalTime: number;
	masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
	avgDeviationMs?: number;
}
export interface ChordMastery {
	root: Note;
	chordType: ChordType;
	masteryLevel: number;
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
	masteryLevel: number;
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
	masteryLevel: number;
	attemptsCount: number;
	bestScore: number;
	averageAccuracy: number;
	lastPracticed: Date;
	isLearning: boolean;
	isMastered: boolean;
}
export interface SessionSummary {
	date: Date;
	duration: number;
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
	progress: number;
	requirements: AchievementRequirement[];
}
export interface AchievementRequirement {
	type: 'exercise_count' | 'accuracy' | 'streak' | 'mastery' | 'time';
	target: number;
	current: number;
}
export class UserStatsService {
	private static instance: UserStatsService;
	// Helper to determine if a usable localStorage is available (works in SSR-safe way)
	private static hasLocalStorage(): boolean {
		try {
			// globalThis used to support various environments
			if (typeof globalThis === 'undefined') return false;
			// Ensure localStorage exists and has the expected API
			// Some test/SSR harnesses may inject a non-standard object.
			// Check that getItem/setItem/removeItem are functions.
			// Accessing localStorage may throw in some restricted environments, so guard in try/catch.
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const ls: any = (globalThis as any).localStorage;
			return (
				!!ls &&
				typeof ls.getItem === 'function' &&
				typeof ls.setItem === 'function' &&
				typeof ls.removeItem === 'function'
			);
		} catch (e) {
			return false;
		}
	}
	// Returns a storage-like object with getItem/setItem/removeItem.
	// If the environment provides a working localStorage, return it.
	// Otherwise provide an in-memory Map fallback so calls are safe in SSR/tests.
	private static _memoryStorage: Map<string, string> | null = null;
	// Cache whether we've already detected storage so we log once
	private static _storageResolved = false;
	private static _usingRealLocalStorage = false;
	private static getStorage(): {
		getItem(key: string): string | null;
		setItem(key: string, value: string): void;
		removeItem(key: string): void;
	} {
		try {
			// prefer real localStorage when available and functional
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const ls: any = (globalThis as any).localStorage;
			if (
				ls &&
				typeof ls.getItem === 'function' &&
				typeof ls.setItem === 'function' &&
				typeof ls.removeItem === 'function'
			) {
				if (!UserStatsService._storageResolved) {
					UserStatsService._usingRealLocalStorage = true;
					UserStatsService._storageResolved = true;
					console.info('UserStatsService: using real localStorage');
				}
				return ls as typeof ls;
			}
			// If there is a localStorage-like object but missing methods, log once
			if (!UserStatsService._storageResolved && ls) {
				UserStatsService._usingRealLocalStorage = false;
				UserStatsService._storageResolved = true;
				console.warn(
					'UserStatsService: localStorage object detected but missing expected methods — using in-memory fallback'
				);
			}
		} catch (e) {
			// accessing localStorage may throw in some environments — log once
			if (!UserStatsService._storageResolved) {
				UserStatsService._usingRealLocalStorage = false;
				UserStatsService._storageResolved = true;
				console.info(
					'UserStatsService: accessing localStorage threw an error — using in-memory fallback'
				);
			}
		}
		// create in-memory storage if needed
		if (!UserStatsService._memoryStorage)
			UserStatsService._memoryStorage = new Map<string, string>();
		if (!UserStatsService._storageResolved) {
			UserStatsService._usingRealLocalStorage = false;
			UserStatsService._storageResolved = true;
			// Only log if we're in the browser (not during SSR)
			if (typeof window !== 'undefined') {
				console.info('UserStatsService: no localStorage available — using in-memory fallback');
			}
		}
		return {
			getItem(key: string) {
				return UserStatsService._memoryStorage!.has(key)
					? UserStatsService._memoryStorage!.get(key)!
					: null;
			},
			setItem(key: string, value: string) {
				UserStatsService._memoryStorage!.set(key, value);
			},
			removeItem(key: string) {
				UserStatsService._memoryStorage!.delete(key);
			}
		};
	}
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
	getProfile(): UserProfile {
		return { ...this.profile };
	}
	updateProfile(updates: Partial<UserProfile>): void {
		this.profile = { ...this.profile, ...updates, lastActivity: new Date() };
		this.saveProfile();
	}

	createProfile(name: string): void {
		this.profile = {
			...this.createDefaultProfile(),
			id: crypto.randomUUID(),
			name,
			createdAt: new Date(),
			lastActivity: new Date()
		};
		this.saveProfile();
		// Reset statistics for new profile
		this.statistics = this.createDefaultStatistics();
		this.saveStatistics();
		this.notifyListeners();
	}
	getStatistics(): UserStatistics {
		return { ...this.statistics };
	}
	recordExerciseResult(result: ExerciseResult): void {
		this.updateOverallStats(result);
		this.updateTypeStats(result);
		this.updateMastery(result);
		this.updateStreak(result);
		this.updateDailyPractice(result);
		this.checkAchievements();
		this.profile.lastActivity = new Date();
		this.profile.experiencePoints += this.calculateExperiencePoints(result);
		this.profile.level = this.calculateLevel(this.profile.experiencePoints);
		this.saveStatistics();
		this.saveProfile();
		this.notifyListeners();
	}
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
	startSession(): void {
		const storage = UserStatsService.getStorage();
		storage.setItem('jazz-midi-session-start', Date.now().toString());
	}
	endSession(): void {
		const storage = UserStatsService.getStorage();
		const startTime = storage.getItem('jazz-midi-session-start');
		if (startTime) {
			const duration = (Date.now() - parseInt(startTime)) / (1000 * 60);
			this.recordSession(duration);
			storage.removeItem('jazz-midi-session-start');
		}
	}
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
	subscribe(listener: (stats: UserStatistics) => void): () => void {
		this.listeners.push(listener);
		return () => {
			const index = this.listeners.indexOf(listener);
			if (index > -1) {
				this.listeners.splice(index, 1);
			}
		};
	}
	private loadProfile(): UserProfile {
		try {
			const storage = UserStatsService.getStorage();
			const stored = storage.getItem(this.profileKey);
			if (stored) {
				const parsed = JSON.parse(stored);
				return {
					...parsed,
					createdAt: new Date(parsed.createdAt),
					lastActivity: new Date(parsed.lastActivity)
				};
			}
		} catch (error) {
			console.warn('Failed to load user profile:', error);
		}
		return this.createDefaultProfile();
	}
	private loadStatistics(): UserStatistics {
		try {
			const storage = UserStatsService.getStorage();
			const stored = storage.getItem(this.storageKey);
			if (stored) {
				const parsed = JSON.parse(stored);

				// Helper to rehydrate Maps from array of entries
				const hydrateMap = <K, V>(data: any): Map<K, V> => {
					if (!data) return new Map<K, V>();
					if (Array.isArray(data)) return new Map<K, V>(data);
					// Handle cases where might be stored as plain object (legacy/fallback)
					if (typeof data === 'object') return new Map<K, V>(Object.entries(data) as any);
					return new Map<K, V>();
				};

				return {
					...parsed,
					noteProgress: hydrateMap(parsed.noteProgress),
					missedNotes: hydrateMap(parsed.missedNotes),
					missedChords: hydrateMap(parsed.missedChords),
					practiceCalendar: hydrateMap(parsed.practiceCalendar),
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
			missedNotes: new Map<string, MissedNote>(),
			missedChords: new Map<string, MissedNote>(),
			practiceCalendar: new Map<string, DayStats>(),
			chordStats: this.createDefaultTypeStats(),
			scaleStats: this.createDefaultTypeStats(),
			progressionStats: this.createDefaultTypeStats(),
			partitionStats: this.createDefaultTypeStats(),
			rhythmStats: this.createDefaultTypeStats(),
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
		const total = this.statistics.totalExercises;
		this.statistics.averageAccuracy =
			(this.statistics.averageAccuracy * (total - 1) + result.accuracy) / total;
		this.statistics.averageScore =
			(this.statistics.averageScore * (total - 1) + result.score) / total;
		this.statistics.totalPracticeTime += result.timeElapsed / (1000 * 60);
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

		if (result.avgDeviationMs !== undefined) {
			const deviationCount = stats.completed; // Approximation
			stats.avgDeviationMs =
				((stats.avgDeviationMs || 0) * (deviationCount - 1) + result.avgDeviationMs) / deviationCount;
		}

		stats.masteryLevel = this.calculateMasteryLevel(stats);
	}
	private updateMastery(result: ExerciseResult): void { }
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
			case 'partition':
				return this.statistics.partitionStats;
			case 'rhythm':
				return this.statistics.rhythmStats;
			default:
				throw new Error(`Unknown exercise type: ${type}`);
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
			exercisesCompleted: 0,
			averageScore: 0,
			topCategory: 'chords',
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
	private checkAchievements(): void { }
	updateNoteProgress(
		note: Note,
		exerciseType: 'scale' | 'chord' | 'progression' | 'partition' | 'rhythm',
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
		progress.averageAccuracy =
			(progress.averageAccuracy * (progress.attempts - 1) + accuracy) / progress.attempts;
		if (timeSpent < progress.bestTime) {
			progress.bestTime = timeSpent;
		}
		progress.lastPracticed = new Date();
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
		this.notifyListeners();
	}
	getNoteProgress(
		note: Note,
		exerciseType: 'scale' | 'chord' | 'progression' | 'partition' | 'rhythm',
		chordType?: ChordType
	): NoteProgress | undefined {
		const key = this.generateProgressKey(note, exerciseType, chordType);
		return this.statistics.noteProgress.get(key);
	}
	getProgressByType(
		exerciseType: 'scale' | 'chord' | 'progression' | 'partition' | 'rhythm'
	): NoteProgress[] {
		return Array.from(this.statistics.noteProgress.values()).filter(
			(progress) => progress.exerciseType === exerciseType
		);
	}
	private generateProgressKey(
		note: Note,
		exerciseType: 'scale' | 'chord' | 'progression' | 'partition' | 'rhythm',
		chordType?: ChordType
	): string {
		return chordType ? `${note}-${exerciseType}-${chordType}` : `${note}-${exerciseType}`;
	}
	private saveProfile(): void {
		try {
			const storage = UserStatsService.getStorage();
			storage.setItem(this.profileKey, JSON.stringify(this.profile));
		} catch (error) {
			console.warn('Failed to save user profile:', error);
		}
	}
	private saveStatistics(): void {
		try {
			const storage = UserStatsService.getStorage();

			// Convert Maps to arrays for serialization
			const serializableStats = {
				...this.statistics,
				noteProgress: Array.from(this.statistics.noteProgress.entries()),
				missedNotes: Array.from(this.statistics.missedNotes.entries()),
				missedChords: Array.from(this.statistics.missedChords.entries()),
				practiceCalendar: Array.from(this.statistics.practiceCalendar.entries())
			};

			storage.setItem(this.storageKey, JSON.stringify(serializableStats));
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

	// Track missed note
	trackMissedNote(noteKey: string, exerciseType: string): void {
		const existing = this.statistics.missedNotes.get(noteKey);
		if (existing) {
			existing.count++;
			existing.lastMissed = new Date();
		} else {
			this.statistics.missedNotes.set(noteKey, {
				count: 1,
				lastMissed: new Date(),
				exerciseType
			});
		}
		this.saveStatistics();
		this.notifyListeners();
	}

	// Track missed chord
	trackMissedChord(chordKey: string, exerciseType: string): void {
		const existing = this.statistics.missedChords.get(chordKey);
		if (existing) {
			existing.count++;
			existing.lastMissed = new Date();
		} else {
			this.statistics.missedChords.set(chordKey, {
				count: 1,
				lastMissed: new Date(),
				exerciseType
			});
		}
		this.saveStatistics();
		this.notifyListeners();
	}

	// Get most missed notes (top N)
	getMostMissedNotes(limit: number = 12): Array<{ note: string; count: number; lastMissed: Date }> {
		// Ensure missedNotes is initialized as a Map for SSR safety
		if (!(this.statistics.missedNotes instanceof Map)) {
			this.statistics.missedNotes = new Map<string, MissedNote>();
		}

		return Array.from(this.statistics.missedNotes.entries())
			.map(([note, data]) => ({ note, count: data.count, lastMissed: data.lastMissed }))
			.sort((a, b) => b.count - a.count)
			.slice(0, limit);
	}

	// Get most missed chords (top N)
	getMostMissedChords(limit: number = 5): Array<{ chord: string; count: number; lastMissed: Date; exerciseType: string }> {
		// Ensure missedChords is initialized as a Map for SSR safety
		if (!(this.statistics.missedChords instanceof Map)) {
			this.statistics.missedChords = new Map<string, MissedNote>();
		}

		return Array.from(this.statistics.missedChords.entries())
			.map(([chord, data]) => ({ chord, count: data.count, lastMissed: data.lastMissed, exerciseType: data.exerciseType }))
			.sort((a, b) => b.count - a.count)
			.slice(0, limit);
	}

	// Get recommendations based on weaknesses
	getWeaknessRecommendations(): Array<{ weakness: string; recommendedExercise: string; path: string }> {
		const recommendations: Array<{ weakness: string; recommendedExercise: string; path: string }> = [];
		const missedNotes = this.getMostMissedNotes(3);
		const missedChords = this.getMostMissedChords(3);

		// Recommend scale practice for missed notes
		missedNotes.forEach(({ note }) => {
			// Extract just the note name (e.g., "C" from "C3")
			const noteName = note.replace(/[0-9]/g, '');
			recommendations.push({
				weakness: `Note: ${note}`,
				recommendedExercise: `${noteName} Major Scale`,
				path: `/exercises/scales?root=${noteName}&mode=Maj`
			});
		});

		// Recommend chord practice for missed chords
		missedChords.forEach(({ chord }) => {
			recommendations.push({
				weakness: `Chord: ${chord}`,
				recommendedExercise: `${chord} Practice`,
				path: `/exercises/chords?root=C&quality=maj7`
			});
		});

		return recommendations.slice(0, 5); // Return top 5 recommendations
	}

	// Update daily practice stats
	private updateDailyPractice(result: ExerciseResult): void {
		const today = new Date();
		const dateKey = today.toISOString().split('T')[0]; // YYYY-MM-DD format

		const existing = this.statistics.practiceCalendar.get(dateKey);
		if (existing) {
			existing.exercisesCompleted++;
			existing.practiceTime += result.timeElapsed / (1000 * 60); // Convert to minutes
		} else {
			this.statistics.practiceCalendar.set(dateKey, {
				date: dateKey,
				exercisesCompleted: 1,
				practiceTime: result.timeElapsed / (1000 * 60)
			});
		}
	}

	// Get practice calendar data for the last N days
	getPracticeCalendar(days: number = 84): DayStats[] {
		const result: DayStats[] = [];
		const today = new Date();

		// Ensure practiceCalendar is initialized as a Map
		if (!(this.statistics.practiceCalendar instanceof Map)) {
			this.statistics.practiceCalendar = new Map<string, DayStats>();
		}

		for (let i = days - 1; i >= 0; i--) {
			const date = new Date(today);
			date.setDate(date.getDate() - i);
			const dateKey = date.toISOString().split('T')[0];

			const dayData = this.statistics.practiceCalendar.get(dateKey);
			if (dayData) {
				result.push(dayData);
			} else {
				// Add empty day
				result.push({
					date: dateKey,
					exercisesCompleted: 0,
					practiceTime: 0
				});
			}
		}

		return result;
	}

	// Calculate current practice streak
	getPracticeStreak(): { current: number; longest: number } {
		const today = new Date();
		let currentStreak = 0;
		let longestStreak = 0;
		let tempStreak = 0;

		// Check if today has activity
		const todayKey = today.toISOString().split('T')[0];
		const hasToday = this.statistics.practiceCalendar.has(todayKey);

		// Count backwards from today
		for (let i = 0; i < 365; i++) {
			const date = new Date(today);
			date.setDate(date.getDate() - i);
			const dateKey = date.toISOString().split('T')[0];

			if (this.statistics.practiceCalendar.has(dateKey)) {
				if (i === 0 || tempStreak > 0) {
					tempStreak++;
					if (currentStreak === 0) {
						currentStreak = tempStreak;
					}
				} else {
					break;
				}
				longestStreak = Math.max(longestStreak, tempStreak);
			} else if (i === 0) {
				// If today has no activity, start counting from yesterday
				continue;
			} else {
				// Break in streak
				if (tempStreak > 0) {
					longestStreak = Math.max(longestStreak, tempStreak);
					tempStreak = 0;
				}
			}
		}

		return { current: currentStreak, longest: Math.max(longestStreak, this.statistics.longestStreak) };
	}
}
export const userStatsService = UserStatsService.getInstance();
