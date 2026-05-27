import type { ChordType, ExerciseResult, ExerciseType, Note } from './types/types';
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
	exerciseType: ExerciseType;
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
	private static _memoryStorage: Map<string, string> | null = null;

	/** Returns localStorage when available, falls back to an in-memory Map (SSR / tests). */
	private static getStorage(): Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> {
		try {
			// Use window.localStorage for reliable browser detection
			// (typeof localStorage check can be optimized away by Vite's SSR transform)
			if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
		} catch {
			// localStorage access throws in some environments (e.g. sandboxed iframes)
		}
		if (!UserStatsService._memoryStorage) {
			UserStatsService._memoryStorage = new Map<string, string>();
		}
		const mem = UserStatsService._memoryStorage;
		return {
			getItem: (key) => mem.get(key) ?? null,
			setItem: (key, value) => { mem.set(key, value); },
			removeItem: (key) => { mem.delete(key); }
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
	/** Re-read profile and statistics from storage (fixes stale SSR singleton in browser). */
	refreshFromStorage(): void {
		// Always read directly from window.localStorage in browser context.
		// getStorage() may return the in-memory fallback if the singleton was created during SSR
		// and getStorage() is evaluated in Node.js scope even when called from browser onMount.
		if (typeof window !== 'undefined') {
			try {
				const rawProfile = window.localStorage.getItem(this.profileKey);
				if (rawProfile) {
					const parsed = JSON.parse(rawProfile);
					this.profile = { ...parsed, createdAt: new Date(parsed.createdAt), lastActivity: new Date(parsed.lastActivity) };
				} else {
					this.profile = this.createDefaultProfile();
				}
				// Reload statistics via loadStatistics which calls getStorage() —
				// may still use in-memory fallback, but stats are less critical for display
				this.statistics = this.loadStatistics();
				return;
			} catch {
				// Fall through to getStorage() path
			}
		}
		this.profile = this.loadProfile();
		this.statistics = this.loadStatistics();
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

				const hydrateMap = <K, V>(data: unknown): Map<K, V> => {
					if (!data) return new Map<K, V>();
					if (Array.isArray(data)) return new Map<K, V>(data);
					if (typeof data === 'object') {
						return new Map<K, V>(Object.entries(data) as [K, V][]);
					}
					return new Map<K, V>();
				};

				interface SerializedMastery {
					lastPracticed: string | Date;
					[key: string]: unknown;
				}

				interface SerializedSession {
					date: string | Date;
					[key: string]: unknown;
				}

				return {
					...parsed,
					noteProgress: hydrateMap(parsed.noteProgress),
					missedNotes: hydrateMap(parsed.missedNotes),
					missedChords: hydrateMap(parsed.missedChords),
					practiceCalendar: hydrateMap(parsed.practiceCalendar),
					masteredChords:
						((parsed.masteredChords as SerializedMastery[] | undefined)?.map((m) => ({
							...m,
							lastPracticed: new Date(m.lastPracticed)
						})) as ChordMastery[]) || [],
					masteredScales:
						((parsed.masteredScales as SerializedMastery[] | undefined)?.map((m) => ({
							...m,
							lastPracticed: new Date(m.lastPracticed)
						})) as ScaleMastery[]) || [],
					masteredProgressions:
						((parsed.masteredProgressions as SerializedMastery[] | undefined)?.map((m) => ({
							...m,
							lastPracticed: new Date(m.lastPracticed)
						})) as ProgressionMastery[]) || [],
					recentSessions:
						((parsed.recentSessions as SerializedSession[] | undefined)?.map((s) => ({
							...s,
							date: new Date(s.date)
						})) as SessionSummary[]) || []
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
				((stats.avgDeviationMs || 0) * (deviationCount - 1) + result.avgDeviationMs) /
				deviationCount;
		}

		stats.masteryLevel = this.calculateMasteryLevel(stats);
	}
	private updateMastery(result: ExerciseResult): void {
		// Update the masteryLevel of every NoteProgress entry that matches the
		// exercise type in this result, using the entry's own accuracy/attempt data.
		for (const [key, progress] of this.statistics.noteProgress.entries()) {
			if (progress.exerciseType !== result.exerciseType) continue;

			const accuracy = progress.averageAccuracy;
			const attempts = progress.attempts;

			let newLevel: NoteProgress['masteryLevel'];
			if (accuracy >= 90 && attempts >= 5) {
				newLevel = 'mastered';
			} else if (accuracy >= 75 && attempts >= 3) {
				newLevel = 'advanced';
			} else if (accuracy >= 60 && attempts >= 2) {
				newLevel = 'intermediate';
			} else {
				newLevel = 'beginner';
			}

			if (progress.masteryLevel !== newLevel) {
				progress.masteryLevel = newLevel;
				this.statistics.noteProgress.set(key, progress);
			}
		}
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
			case 'interval':
				return this.statistics.scaleStats;
			case 'II-V-I':
			case 'progression':
				return this.statistics.progressionStats;
			case 'note':
			case 'partition':
				return this.statistics.partitionStats;
			case 'rhythm':
				return this.statistics.rhythmStats;
			case 'hand_independence':
			case 'dexterity':
				return this.statistics.rhythmStats;
			default:
				// Fallback — never crash exercise completion due to stats
				return this.statistics.partitionStats;
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
	private checkAchievements(): void {
		// Achievements are not stored in UserStatistics — they are computed on-demand
		// by getAchievements() which calls calculateAchievementProgress() against the
		// current stats snapshot. Adding a persistent achievements[] field to
		// UserStatistics would be the right place to record unlock timestamps and
		// notify the user when a new achievement is earned (e.g., via notifyListeners).
		// For now, no action is needed here; getAchievements() handles progress display.
	}
	updateNoteProgress(
		note: Note,
		exerciseType: ExerciseType,
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
		exerciseType: ExerciseType,
		chordType?: ChordType
	): NoteProgress | undefined {
		const key = this.generateProgressKey(note, exerciseType, chordType);
		return this.statistics.noteProgress.get(key);
	}
	getProgressByType(
		exerciseType: ExerciseType
	): NoteProgress[] {
		return Array.from(this.statistics.noteProgress.values()).filter(
			(progress) => progress.exerciseType === exerciseType
		);
	}
	private generateProgressKey(
		note: Note,
		exerciseType: ExerciseType,
		chordType?: ChordType
	): string {
		return chordType ? `${note}-${exerciseType}-${chordType}` : `${note}-${exerciseType}`;
	}
	private supabaseUserId: string | null = null;

	setSupabaseUser(userId: string | null): void {
		this.supabaseUserId = userId;
	}

	/** Load profile + all stats from normalized Supabase tables. */
	async loadFromSupabase(userId: string): Promise<void> {
		this.supabaseUserId = userId;
		const { supabase } = await import('./supabaseClient');

		const [profileResult, statsResult, etStatsResult, noteProgResult,
			missedNotesResult, missedChordsResult, calendarResult,
			chordResult, scaleResult, progressionResult, sessionsResult] = await Promise.all([
				supabase.from('profiles').select('*').eq('id', userId).single(),
				supabase.from('user_stats').select('*').eq('user_id', userId).single(),
				supabase.from('exercise_type_stats').select('*').eq('user_id', userId),
				supabase.from('note_progress').select('*').eq('user_id', userId),
				supabase.from('missed_notes').select('*').eq('user_id', userId),
				supabase.from('missed_chords').select('*').eq('user_id', userId),
				supabase.from('practice_calendar').select('*').eq('user_id', userId),
				supabase.from('chord_mastery').select('*').eq('user_id', userId),
				supabase.from('scale_mastery').select('*').eq('user_id', userId),
				supabase.from('progression_mastery').select('*').eq('user_id', userId),
				supabase.from('practice_sessions').select('*').eq('user_id', userId)
					.order('session_date', { ascending: false }).limit(10)
			]);

		if (profileResult.data) {
			const p = profileResult.data;
			this.profile = {
				id: userId,
				name: p.name,
				avatar: p.avatar ?? undefined,
				createdAt: new Date(p.created_at),
				lastActivity: new Date(p.last_activity),
				totalPracticeTime: Number(p.total_practice_time),
				level: p.level,
				experiencePoints: p.experience_points
			};
			this.saveProfile();
		}

		const s = statsResult.data;
		const etMap = new Map((etStatsResult.data ?? []).map(r => [r.exercise_type, r]));
		const toTypeStats = (type: string): ExerciseTypeStats => {
			const r = etMap.get(type);
			return r ? {
				attempted: r.attempted, completed: r.completed,
				averageAccuracy: Number(r.average_accuracy), averageScore: Number(r.average_score),
				bestScore: Number(r.best_score), totalTime: Number(r.total_time),
				masteryLevel: r.mastery_level as ExerciseTypeStats['masteryLevel'],
				avgDeviationMs: r.avg_deviation_ms ? Number(r.avg_deviation_ms) : undefined
			} : this.createDefaultTypeStats();
		};

		this.statistics = {
			totalExercises: s?.total_exercises ?? 0,
			completedExercises: s?.completed_exercises ?? 0,
			averageAccuracy: Number(s?.average_accuracy ?? 0),
			averageScore: Number(s?.average_score ?? 0),
			totalPracticeTime: Number(s?.total_practice_time ?? 0),
			currentStreak: s?.current_streak ?? 0,
			longestStreak: s?.longest_streak ?? 0,
			improvementTrend: Number(s?.improvement_trend ?? 0),
			chordStats: toTypeStats('chord'),
			scaleStats: toTypeStats('scale'),
			progressionStats: toTypeStats('II-V-I'),
			partitionStats: toTypeStats('partition'),
			rhythmStats: toTypeStats('rhythm'),
			noteProgress: new Map((noteProgResult.data ?? []).map(r => [r.note_key, {
				note: r.note as never, exerciseType: r.exercise_type as never,
				chordType: r.chord_type, attempts: r.attempts, successes: r.successes,
				averageAccuracy: Number(r.average_accuracy), bestTime: Number(r.best_time),
				lastPracticed: new Date(r.last_practiced),
				masteryLevel: r.mastery_level as NoteProgress['masteryLevel']
			}])),
			missedNotes: new Map((missedNotesResult.data ?? []).map(r => [r.note_key, {
				count: r.count, lastMissed: new Date(r.last_missed), exerciseType: r.exercise_type
			}])),
			missedChords: new Map((missedChordsResult.data ?? []).map(r => [r.chord_key, {
				count: r.count, lastMissed: new Date(r.last_missed), exerciseType: r.exercise_type
			}])),
			practiceCalendar: new Map((calendarResult.data ?? []).map(r => [r.practice_date, {
				date: r.practice_date, exercisesCompleted: r.exercises_completed,
				practiceTime: Number(r.practice_time)
			}])),
			masteredChords: (chordResult.data ?? []).map(r => ({
				root: r.root as never, chordType: r.chord_type as never,
				masteryLevel: r.mastery_level, attemptsCount: r.attempts_count,
				bestScore: Number(r.best_score), averageAccuracy: Number(r.average_accuracy),
				lastPracticed: new Date(r.last_practiced),
				isLearning: r.is_learning, isMastered: r.is_mastered
			})),
			masteredScales: (scaleResult.data ?? []).map(r => ({
				root: r.root as never, scaleType: r.scale_type as never,
				masteryLevel: r.mastery_level, attemptsCount: r.attempts_count,
				bestScore: Number(r.best_score), averageAccuracy: Number(r.average_accuracy),
				lastPracticed: new Date(r.last_practiced),
				isLearning: r.is_learning, isMastered: r.is_mastered
			})),
			masteredProgressions: (progressionResult.data ?? []).map(r => ({
				key: r.key as never, progressionType: r.progression_type as never,
				masteryLevel: r.mastery_level, attemptsCount: r.attempts_count,
				bestScore: Number(r.best_score), averageAccuracy: Number(r.average_accuracy),
				lastPracticed: new Date(r.last_practiced),
				isLearning: r.is_learning, isMastered: r.is_mastered
			})),
			recentSessions: (sessionsResult.data ?? []).map(r => ({
				date: new Date(r.session_date), duration: Number(r.duration),
				exercisesCompleted: r.exercises_completed, averageScore: Number(r.average_score),
				topCategory: r.top_category as never, improvements: r.improvements ?? []
			}))
		};
		this.saveStatistics();
		this.notifyListeners();
	}

	private saveProfile(): void {
		try {
			const storage = UserStatsService.getStorage();
			storage.setItem(this.profileKey, JSON.stringify(this.profile));
			this.syncProfileToSupabase();
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
			this.syncStatsToSupabase();
		} catch (error) {
			console.warn('Failed to save user statistics:', error);
		}
	}
	private syncProfileToSupabase(): void {
		if (!this.supabaseUserId) return;
		const userId = this.supabaseUserId;
		const p = this.profile;
		import('./supabaseClient').then(({ supabase }) => {
			supabase.from('profiles').upsert({
				id: userId, name: p.name, avatar: p.avatar ?? null,
				level: p.level, experience_points: p.experiencePoints,
				total_practice_time: Math.round(p.totalPracticeTime),
				last_activity: p.lastActivity.toISOString()
			}).then(({ error }) => {
				if (error) console.warn('Supabase profile sync:', error.message);
			});
		});
	}
	private syncStatsToSupabase(): void {
		if (!this.supabaseUserId) return;
		const userId = this.supabaseUserId;
		const s = this.statistics;
		const now = new Date().toISOString();
		import('./supabaseClient').then(({ supabase }) => {
			const typeStatRow = (type: string, stats: ExerciseTypeStats) => ({
				user_id: userId, exercise_type: type,
				attempted: stats.attempted, completed: stats.completed,
				average_accuracy: stats.averageAccuracy, average_score: stats.averageScore,
				best_score: stats.bestScore, total_time: stats.totalTime,
				mastery_level: stats.masteryLevel,
				avg_deviation_ms: stats.avgDeviationMs ?? null, updated_at: now
			});
			Promise.all([
				supabase.from('user_stats').upsert({
					user_id: userId, updated_at: now,
					total_exercises: s.totalExercises, completed_exercises: s.completedExercises,
					average_accuracy: s.averageAccuracy, average_score: s.averageScore,
					total_practice_time: s.totalPracticeTime,
					current_streak: s.currentStreak, longest_streak: s.longestStreak,
					improvement_trend: s.improvementTrend
				}),
				supabase.from('exercise_type_stats').upsert([
					typeStatRow('chord', s.chordStats), typeStatRow('scale', s.scaleStats),
					typeStatRow('II-V-I', s.progressionStats), typeStatRow('partition', s.partitionStats),
					typeStatRow('rhythm', s.rhythmStats)
				]),
				s.practiceCalendar.size > 0 ? supabase.from('practice_calendar').upsert(
					Array.from(s.practiceCalendar.entries()).map(([date, d]) => ({
						user_id: userId, practice_date: date,
						exercises_completed: d.exercisesCompleted, practice_time: d.practiceTime
					}))
				) : Promise.resolve({ error: null }),
				s.masteredChords.length > 0 ? supabase.from('chord_mastery').upsert(
					s.masteredChords.map(m => ({
						user_id: userId, root: m.root, chord_type: m.chordType,
						mastery_level: m.masteryLevel, attempts_count: m.attemptsCount,
						best_score: m.bestScore, average_accuracy: m.averageAccuracy,
						last_practiced: m.lastPracticed.toISOString(),
						is_learning: m.isLearning, is_mastered: m.isMastered
					}))
				) : Promise.resolve({ error: null }),
				s.masteredScales.length > 0 ? supabase.from('scale_mastery').upsert(
					s.masteredScales.map(m => ({
						user_id: userId, root: m.root, scale_type: m.scaleType,
						mastery_level: m.masteryLevel, attempts_count: m.attemptsCount,
						best_score: m.bestScore, average_accuracy: m.averageAccuracy,
						last_practiced: m.lastPracticed.toISOString(),
						is_learning: m.isLearning, is_mastered: m.isMastered
					}))
				) : Promise.resolve({ error: null }),
				s.masteredProgressions.length > 0 ? supabase.from('progression_mastery').upsert(
					s.masteredProgressions.map(m => ({
						user_id: userId, key: m.key, progression_type: m.progressionType,
						mastery_level: m.masteryLevel, attempts_count: m.attemptsCount,
						best_score: m.bestScore, average_accuracy: m.averageAccuracy,
						last_practiced: m.lastPracticed.toISOString(),
						is_learning: m.isLearning, is_mastered: m.isMastered
					}))
				) : Promise.resolve({ error: null }),
				s.noteProgress.size > 0 ? supabase.from('note_progress').upsert(
					Array.from(s.noteProgress.entries()).map(([key, np]) => ({
						user_id: userId, note_key: key, note: np.note, exercise_type: np.exerciseType,
						chord_type: np.chordType ?? null, attempts: np.attempts, successes: np.successes,
						average_accuracy: np.averageAccuracy, best_time: np.bestTime,
						last_practiced: np.lastPracticed.toISOString(), mastery_level: np.masteryLevel
					}))
				) : Promise.resolve({ error: null }),
				s.missedNotes.size > 0 ? supabase.from('missed_notes').upsert(
					Array.from(s.missedNotes.entries()).map(([key, mn]) => ({
						user_id: userId, note_key: key, exercise_type: mn.exerciseType,
						count: mn.count, last_missed: mn.lastMissed.toISOString()
					}))
				) : Promise.resolve({ error: null }),
				s.missedChords.size > 0 ? supabase.from('missed_chords').upsert(
					Array.from(s.missedChords.entries()).map(([key, mc]) => ({
						user_id: userId, chord_key: key, exercise_type: mc.exerciseType,
						count: mc.count, last_missed: mc.lastMissed.toISOString()
					}))
				) : Promise.resolve({ error: null })
			]).then(results => {
				const err = results.find(r => r?.error);
				if (err?.error) console.warn('Supabase stats sync:', err.error.message);
			});
		});
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
	getMostMissedChords(
		limit: number = 5
	): Array<{ chord: string; count: number; lastMissed: Date; exerciseType: string }> {
		// Ensure missedChords is initialized as a Map for SSR safety
		if (!(this.statistics.missedChords instanceof Map)) {
			this.statistics.missedChords = new Map<string, MissedNote>();
		}

		return Array.from(this.statistics.missedChords.entries())
			.map(([chord, data]) => ({
				chord,
				count: data.count,
				lastMissed: data.lastMissed,
				exerciseType: data.exerciseType
			}))
			.sort((a, b) => b.count - a.count)
			.slice(0, limit);
	}

	// Get recommendations based on weaknesses
	getWeaknessRecommendations(): Array<{
		weakness: string;
		recommendedExercise: string;
		path: string;
	}> {
		const recommendations: Array<{ weakness: string; recommendedExercise: string; path: string }> =
			[];
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

		return {
			current: currentStreak,
			longest: Math.max(longestStreak, this.statistics.longestStreak)
		};
	}
}
export const userStatsService = UserStatsService.getInstance();

