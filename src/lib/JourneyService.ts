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

	// New Mastery Fields
	perfectCompletions: number;
	requiredPerfectCompletions: number;
	bpm?: number; // Optional tempo requirement
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

	// Updated Curriculum based on User Request
	private units: Unit[] = [
		{
			id: 'level-0',
			title: 'Level 0: Foundations',
			description: 'Learn the basics: Reading, Names, Intervals, and Flash Cards.',
			status: 'active',
			color: 'bg-blue-500',
			lessons: [
				{
					id: 'l0-c-scale',
					title: 'C Major Scale',
					type: 'exercise',
					path: '/exercises/scales',
					params: { root: 'C', mode: 'Maj' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'l0-notes',
					title: 'Note Identification',
					type: 'exercise',
					path: '/exercises/names',
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 5
				},
				{
					id: 'l0-dexterity',
					title: 'Finger Dexterity',
					type: 'exercise',
					path: '/exercises/dexterity',
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'l0-intervals',
					title: 'Intervals',
					type: 'exercise',
					path: '/exercises/intervals',
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'l0-flashcards',
					title: 'Flash Cards',
					type: 'exercise',
					path: '/exercises/flashcards',
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 5
				}
			]
		},
		{
			id: 'level-1',
			title: 'Level 1: Major Scales (Slow)',
			description: 'C, G, and F Major Scales at a slow tempo.',
			status: 'locked',
			color: 'bg-green-500',
			lessons: [
				{
					id: 'l1-c-scale',
					title: 'C Major Scale (60 BPM)',
					type: 'exercise',
					path: '/exercises/scales',
					params: { root: 'C', mode: 'Maj', bpm: '60' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3,
					bpm: 60
				},
				{
					id: 'l1-g-scale',
					title: 'G Major Scale (60 BPM)',
					type: 'exercise',
					path: '/exercises/scales',
					params: { root: 'G', mode: 'Maj', bpm: '60' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3,
					bpm: 60
				},
				{
					id: 'l1-f-scale',
					title: 'F Major Scale (60 BPM)',
					type: 'exercise',
					path: '/exercises/scales',
					params: { root: 'F', mode: 'Maj', bpm: '60' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3,
					bpm: 60
				}
			]
		},
		{
			id: 'level-2',
			title: 'Level 2: Medium Tempo & Chords',
			description: 'Scales at medium tempo and basic chords.',
			status: 'locked',
			color: 'bg-yellow-500',
			lessons: [
				{
					id: 'l2-c-scale',
					title: 'C Major Scale (90 BPM)',
					type: 'exercise',
					path: '/exercises/scales',
					params: { root: 'C', mode: 'Maj', bpm: '90' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3,
					bpm: 90
				},
				{
					id: 'l2-c-chords',
					title: 'C Major Chords',
					type: 'exercise',
					path: '/exercises/chords',
					params: { root: 'C', quality: 'maj7' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				// Add more G and F scale/chord exercises as needed
			]
		},
		{
			id: 'level-3',
			title: 'Level 3: Faster & Split Chords',
			description: 'Pick up the pace and learn split chord voicings.',
			status: 'locked',
			color: 'bg-orange-500',
			lessons: [
				{
					id: 'l3-c-scale-fast',
					title: 'C Major Scale (120 BPM)',
					type: 'exercise',
					path: '/exercises/scales',
					params: { root: 'C', mode: 'Maj', bpm: '120' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3,
					bpm: 120
				},
				{
					id: 'l3-split-chords',
					title: 'Split Chords (1735)',
					type: 'exercise',
					path: '/exercises/chords',
					params: { voicing: '1735' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				}
			]
		},
		{
			id: 'level-4',
			title: 'Level 4: II-V-I',
			description: 'Master the II-V-I progression.',
			status: 'locked',
			color: 'bg-red-500',
			lessons: [
				{
					id: 'l4-ii-v-i-c',
					title: 'II-V-I in C',
					type: 'exercise',
					path: '/exercises/two_five_ones',
					params: { key: 'C' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				}
			]
		},
		{
			id: 'level-5',
			title: 'Level 5: Songs',
			description: 'Apply your skills to real jazz standards.',
			status: 'locked',
			color: 'bg-purple-500',
			lessons: [
				{
					id: 'l5-autumn-leaves',
					title: 'Autumn Leaves',
					type: 'exercise',
					path: '/exercises/songs',
					params: { song: 'autumn_leaves' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 1
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

		// Logic for Mastery:
		// If 3 stars (perfect), increment perfectCompletions
		if (stars === 3) {
			lesson.perfectCompletions = (lesson.perfectCompletions || 0) + 1;
		}

		// Mark as completed if we hit the requirement
		// OR if it was already marked completed (don't un-complete it)
		if (lesson.perfectCompletions >= lesson.requiredPerfectCompletions) {
			lesson.completed = true;
		}

		lesson.stars = Math.max(lesson.stars, stars);

		this.checkUnitCompletion(unit);
		this.saveProgress();

		// Sync with UserStatsService
		userStatsService.recordExerciseResult({
			exerciseId: lessonId,
			exerciseType: 'scale', // Should be dynamic
			success: true,
			accuracy: stars === 3 ? 100 : stars === 2 ? 80 : 50,
			score: stars * 33,
			timeElapsed: 0,
			mistakes: stars === 3 ? 0 : 3,
			timestamp: new Date()
		});
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
				stars: l.stars,
				perfectCompletions: l.perfectCompletions
			}))
		}));

		localStorage.setItem('journey_progress_v2', JSON.stringify(progress));
	}

	private loadProgress() {
		if (!browser || typeof localStorage === 'undefined') return;

		const saved = localStorage.getItem('journey_progress_v2');
		if (!saved) return;

		try {
			interface SavedLesson {
				id: string;
				completed: boolean;
				stars: number;
				perfectCompletions?: number;
			}

			interface SavedUnit {
				id: string;
				status: 'locked' | 'active' | 'completed';
				lessons: SavedLesson[];
			}

			const progress = JSON.parse(saved) as SavedUnit[];
			// Merge saved progress with current structure
			progress.forEach((savedUnit) => {
				const unit = this.units.find(u => u.id === savedUnit.id);
				if (unit) {
					unit.status = savedUnit.status;
					savedUnit.lessons.forEach((savedLesson) => {
						const lesson = unit.lessons.find(l => l.id === savedLesson.id);
						if (lesson) {
							lesson.completed = savedLesson.completed;
							lesson.stars = savedLesson.stars;
							lesson.perfectCompletions = savedLesson.perfectCompletions ?? 0;
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

	getPracticeLesson(unitId: string): { unit: Unit, lesson: Lesson } | undefined {
		const unit = this.units.find(u => u.id === unitId);
		if (!unit) return undefined;

		// User expects "Practice random exercise from THIS level"
		// So we strictly scope to the target unit.

		// 1. Find unmastered lessons in the target unit
		const unmastered = unit.lessons.filter(l => (l.perfectCompletions || 0) < l.requiredPerfectCompletions);

		if (unmastered.length > 0) {
			const randomIndex = Math.floor(Math.random() * unmastered.length);
			return { unit, lesson: unmastered[randomIndex] };
		}

		// 2. If all mastered, just pick any random lesson from this unit
		if (unit.lessons.length > 0) {
			const randomLesson = unit.lessons[Math.floor(Math.random() * unit.lessons.length)];
			return { unit, lesson: randomLesson };
		}

		return undefined;
	}
}

export const journeyService = JourneyService.getInstance();
