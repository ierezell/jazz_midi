import { userStatsService } from './UserStatsService';
import { browser } from '$app/environment';

export interface Lesson {
	id: string;
	title: string;
	type: 'exercise' | 'theory';
	path: string;
	params?: Record<string, string>;
	completed: boolean;
	stars: number; // 0-3
}

export interface Unit {
	id: string;
	title: string;
	description: string;
	lessons: Lesson[];
	status: 'locked' | 'active' | 'completed';
	color: string;
}

export class JourneyService {
	private static instance: JourneyService;

	// Hardcoded curriculum for now
	private units: Unit[] = [
		{
			id: 'basics-scales',
			title: 'Major Scales',
			description: 'Start with the building blocks of jazz: The Major Scale.',
			status: 'active',
			color: 'bg-blue-500',
			lessons: [
				{
					id: 'c-major-scale',
					title: 'C Major Scale',
					type: 'exercise',
					path: '/exercises/scales',
					params: { root: 'C', mode: 'Maj' },
					completed: false,
					stars: 0
				},
				{
					id: 'g-major-scale',
					title: 'G Major Scale',
					type: 'exercise',
					path: '/exercises/scales',
					params: { root: 'G', mode: 'Maj' },
					completed: false,
					stars: 0
				},
				{
					id: 'f-major-scale',
					title: 'F Major Scale',
					type: 'exercise',
					path: '/exercises/scales',
					params: { root: 'F', mode: 'Maj' },
					completed: false,
					stars: 0
				}
			]
		},
		{
			id: 'basics-chords',
			title: 'Basic Chords',
			description: 'Learn the fundamental 7th chords.',
			status: 'locked',
			color: 'bg-green-500',
			lessons: [
				{
					id: 'c-maj7',
					title: 'C Major 7',
					type: 'exercise',
					path: '/exercises/chords',
					params: { root: 'C', quality: 'maj7' },
					completed: false,
					stars: 0
				},
				{
					id: 'g-dom7',
					title: 'G Dominant 7',
					type: 'exercise',
					path: '/exercises/chords',
					params: { root: 'G', quality: 'dom7' },
					completed: false,
					stars: 0
				},
				{
					id: 'd-min7',
					title: 'D Minor 7',
					type: 'exercise',
					path: '/exercises/chords',
					params: { root: 'D', quality: 'min7' },
					completed: false,
					stars: 0
				}
			]
		},
		{
			id: 'ii-v-i',
			title: 'II-V-I Progression',
			description: 'The most important progression in Jazz.',
			status: 'locked',
			color: 'bg-purple-500',
			lessons: [
				{
					id: 'ii-v-i-c',
					title: 'II-V-I in C',
					type: 'exercise',
					path: '/exercises/two_five_ones',
					params: { key: 'C' },
					completed: false,
					stars: 0
				}
			]
		}
	];

	private constructor() {
		this.loadProgress();
	}

	static getInstance(): JourneyService {
		if (!JourneyService.instance) {
			JourneyService.instance = new JourneyService();
		}
		return JourneyService.instance;
	}

	getUnits(): Unit[] {
		return this.units;
	}

	getUnit(unitId: string): Unit | undefined {
		return this.units.find((u) => u.id === unitId);
	}

	completeLesson(unitId: string, lessonId: string, stars: number = 3) {
		const unit = this.units.find((u) => u.id === unitId);
		if (!unit) return;

		const lesson = unit.lessons.find((l) => l.id === lessonId);
		if (!lesson) return;

		// If already completed, don't award full XP again, but maybe update stars?
		const isFirstCompletion = !lesson.completed;
		
		lesson.completed = true;
		lesson.stars = Math.max(lesson.stars, stars);

		this.checkUnitCompletion(unit);
		this.saveProgress();

		// Sync with UserStatsService
		if (isFirstCompletion) {
			userStatsService.recordExerciseResult({
				exerciseId: lessonId,
				exerciseType: 'scale', // Defaulting to scale for now, should be dynamic based on lesson type
				success: true,
				accuracy: 100, // Assumed perfect for journey completion for now
				score: 100,
				timeElapsed: 0,
				mistakes: 0,
				timestamp: new Date()
			});
		}
	}

	getStats() {
		const stats = userStatsService.getStatistics();
		const profile = userStatsService.getProfile();
		return {
			level: profile.level,
			xp: profile.experiencePoints,
			streak: stats.currentStreak
		};
	}

	private checkUnitCompletion(unit: Unit) {
		const allCompleted = unit.lessons.every((l) => l.completed);
		if (allCompleted) {
			unit.status = 'completed';
			this.unlockNextUnit(unit.id);
		}
	}

	private unlockNextUnit(currentUnitId: string) {
		const index = this.units.findIndex((u) => u.id === currentUnitId);
		if (index !== -1 && index < this.units.length - 1) {
			const nextUnit = this.units[index + 1];
			if (nextUnit.status === 'locked') {
				nextUnit.status = 'active';
			}
		}
	}



	// Simple persistence using localStorage for now
	private saveProgress() {
		if (!browser || typeof localStorage === 'undefined') return;
		
		const progress = this.units.map(u => ({
			id: u.id,
			status: u.status,
			lessons: u.lessons.map(l => ({
				id: l.id,
				completed: l.completed,
				stars: l.stars
			}))
		}));
		
		localStorage.setItem('journey_progress', JSON.stringify(progress));
	}

	private loadProgress() {
		if (!browser || typeof localStorage === 'undefined') return;

		const saved = localStorage.getItem('journey_progress');
		if (!saved) return;

		try {
			const progress = JSON.parse(saved);
			// Merge saved progress with current structure
			progress.forEach((savedUnit: any) => {
				const unit = this.units.find(u => u.id === savedUnit.id);
				if (unit) {
					unit.status = savedUnit.status;
					savedUnit.lessons.forEach((savedLesson: any) => {
						const lesson = unit.lessons.find(l => l.id === savedLesson.id);
						if (lesson) {
							lesson.completed = savedLesson.completed;
							lesson.stars = savedLesson.stars;
						}
					});
				}
			});
		} catch (e) {
			console.error('Failed to load journey progress', e);
		}
	}
	
	// Helper to generate the URL for a lesson
	getLessonUrl(unit: Unit, lesson: Lesson): string {
		const params = new URLSearchParams();
		if (lesson.params) {
			Object.entries(lesson.params).forEach(([k, v]) => params.append(k, v));
		}
		// Add context so the exercise knows where to return/update
		params.append('unitId', unit.id);
		params.append('lessonId', lesson.id);
		
		return `${lesson.path}?${params.toString()}`;
	}
}

export const journeyService = JourneyService.getInstance();
