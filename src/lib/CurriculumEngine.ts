import type { MusicXMLSong } from './types/musicxml';

// Curriculum Pillars
export type Pillar = 'technique' | 'theory' | 'vocabulary' | 'repertoire';

export interface SkillArea {
	id: string;
	name: string;
	pillar: Pillar;
	description: string;
	exercises: string[]; // Exercise route IDs
	difficulty: 'beginner' | 'intermediate' | 'advanced';
	dependencies: string[]; // Skill IDs that should be mastered first
}

// Complete curriculum definition
export const CURRICULUM: SkillArea[] = [
	// PILLAR 1: Technique & Mechanics
	{
		id: 'scale-geometry-single',
		name: 'Single Hand Scales',
		pillar: 'technique',
		description: '2-octave scales with one hand - foundation of keyboard fluency',
		exercises: ['/exercises/scales'],
		difficulty: 'beginner',
		dependencies: []
	},
	{
		id: 'scale-geometry-parallel',
		name: 'Parallel Motion Scales',
		pillar: 'technique',
		description: 'Both hands playing scales in parallel - builds coordination',
		exercises: ['/exercises/scales'],
		difficulty: 'intermediate',
		dependencies: ['scale-geometry-single']
	},
	{
		id: 'scale-geometry-thirds',
		name: 'Scales in 3rds',
		pillar: 'technique',
		description: 'Play scale in intervals of 3rd - advanced finger independence',
		exercises: ['/exercises/scales'],
		difficulty: 'advanced',
		dependencies: ['scale-geometry-parallel']
	},
	{
		id: 'ghost-notes',
		name: 'Ghost Note Articulation',
		pillar: 'technique',
		description: 'Soft downbeats (< 40 velocity), accented upbeats (> 80 velocity)',
		exercises: ['/exercises/ghost-notes'],
		difficulty: 'intermediate',
		dependencies: ['scale-geometry-single']
	},
	{
		id: 'hand-dynamics',
		name: 'Hand Independence - Dynamics',
		pillar: 'technique',
		description: 'LH soft comping (piano), RH strong melody (forte)',
		exercises: ['/exercises/hand-dynamics'],
		difficulty: 'intermediate',
		dependencies: ['scale-geometry-parallel']
	},
	{
		id: 'swing-accents',
		name: 'Swing Feel & Accents',
		pillar: 'technique',
		description: 'Long downbeats, short delayed upbeats with accent pattern',
		exercises: ['/exercises/rhythm'],
		difficulty: 'intermediate',
		dependencies: ['ghost-notes']
	},
	{
		id: 'legato-control',
		name: 'Legato & Connected Sound',
		pillar: 'technique',
		description: 'Note overlap monitoring for smooth jazz phrasing',
		exercises: ['/exercises/boogie'],
		difficulty: 'intermediate',
		dependencies: ['hand-dynamics']
	},

	// PILLAR 2: Theory & Ear Training
	{
		id: 'interval-mimicry',
		name: 'Interval Recognition',
		pillar: 'theory',
		description: 'Hear an interval, play it back - builds relative pitch',
		exercises: ['/exercises/interval-mimicry'],
		difficulty: 'beginner',
		dependencies: []
	},
	{
		id: 'chord-construction-7ths',
		name: '7th Chord Construction',
		pillar: 'theory',
		description: 'Build major7, minor7, dominant7, half-diminished chords',
		exercises: ['/exercises/chords'],
		difficulty: 'beginner',
		dependencies: ['interval-mimicry']
	},
	{
		id: 'shell-voicings',
		name: 'Shell Voicings (1-7, 1-3)',
		pillar: 'theory',
		description: 'Two-note voicings for comping - essential jazz sound',
		exercises: ['/exercises/chords'],
		difficulty: 'intermediate',
		dependencies: ['chord-construction-7ths']
	},
	{
		id: 'rootless-voicings',
		name: 'Rootless Voicings',
		pillar: 'theory',
		description: '3-7-9-13 voicings for advanced comping',
		exercises: ['/exercises/two_five_ones'],
		difficulty: 'advanced',
		dependencies: ['shell-voicings']
	},
	{
		id: 'diatonic-7ths',
		name: 'Diatonic 7th Chords',
		pillar: 'theory',
		description: 'Play Imaj7 → IIm7 → IIIm7 → etc. in all keys',
		exercises: ['/exercises/chords'],
		difficulty: 'intermediate',
		dependencies: ['chord-construction-7ths']
	},
	{
		id: 'enclosure-patterns',
		name: 'Enclosure Patterns',
		pillar: 'theory',
		description: 'Circle target tones: chromatic approach from below/above',
		exercises: ['/exercises/enclosure'],
		difficulty: 'advanced',
		dependencies: ['diatonic-7ths']
	},

	// PILLAR 3: Vocabulary & Patterns
	{
		id: 'ii-v-i-progression',
		name: 'ii-V-I Progressions',
		pillar: 'vocabulary',
		description: 'The cornerstone jazz progression - multiple voicing types',
		exercises: ['/exercises/two_five_ones'],
		difficulty: 'intermediate',
		dependencies: ['shell-voicings']
	},
	{
		id: 'turnarounds',
		name: 'Turnaround Patterns',
		pillar: 'vocabulary',
		description: 'I-VI-II-V and variation patterns',
		exercises: ['/exercises/two_five_ones'],
		difficulty: 'intermediate',
		dependencies: ['ii-v-i-progression']
	},
	{
		id: 'lick-transposition',
		name: 'Lick Transposition',
		pillar: 'vocabulary',
		description: 'Learn a lick, transpose through Circle of Fifths',
		exercises: ['/exercises/dexterity'],
		difficulty: 'advanced',
		dependencies: ['enclosure-patterns']
	},
	{
		id: 'rhythmic-morphing',
		name: 'Rhythmic Styles',
		pillar: 'vocabulary',
		description: 'Same lick: Straight 8ths → Swing → Bossa Nova',
		exercises: ['/exercises/rhythm'],
		difficulty: 'advanced',
		dependencies: ['swing-accents']
	},
	{
		id: 'guide-tones',
		name: 'Guide Tone Lines',
		pillar: 'vocabulary',
		description: '3-7 voice leading through chord progressions',
		exercises: ['/exercises/two_five_ones'],
		difficulty: 'intermediate',
		dependencies: ['shell-voicings']
	},

	// PILLAR 4: Repertoire (Weekly Standard replacement)
	{
		id: 'song-foundation',
		name: 'Song Foundation',
		pillar: 'repertoire',
		description: 'Bass notes and LH shells through chord changes',
		exercises: ['/exercises/hand_independence'],
		difficulty: 'intermediate',
		dependencies: ['ii-v-i-progression', 'hand-dynamics']
	},
	{
		id: 'melody-reading',
		name: 'Melody Reading',
		pillar: 'repertoire',
		description: 'Accurate melody reading with rhythmic precision',
		exercises: ['/exercises/flashcards'],
		difficulty: 'intermediate',
		dependencies: ['interval-mimicry']
	},
	{
		id: 'chord-melody',
		name: 'Chord-Melody Style',
		pillar: 'repertoire',
		description: 'Combine melody and harmony simultaneously',
		exercises: ['/exercises/hand_independence'],
		difficulty: 'advanced',
		dependencies: ['song-foundation', 'melody-reading']
	},
	{
		id: 'improvisation-chord-tones',
		name: 'Chord Tone Soloing',
		pillar: 'repertoire',
		description: 'Solo using only 1-3-5-7 of each chord',
		exercises: ['/exercises/intervals'],
		difficulty: 'intermediate',
		dependencies: ['diatonic-7ths']
	},
	{
		id: 'improvisation-enclosures',
		name: 'Enclosure Soloing',
		pillar: 'repertoire',
		description: 'Apply enclosure patterns to target tones in solos',
		exercises: ['/exercises/enclosure'],
		difficulty: 'advanced',
		dependencies: ['improvisation-chord-tones', 'enclosure-patterns']
	}
];

// Student weakness tracking
export interface WeaknessProfile {
	skillId: string;
	missedAttempts: number;
	averageAccuracy: number;
	lastPracticed: Date;
	struggleAreas: string[]; // Specific sub-skills
}

export interface StudentProgress {
	skillId: string;
	status: 'locked' | 'available' | 'in-progress' | 'mastered';
	accuracy: number; // 0-100
	timesPracticed: number;
	totalTimeMinutes: number;
	lastScore: number;
	bestScore: number;
}

export interface WorkoutSession {
	id: string;
	date: Date;
	duration: number; // minutes
	exercises: WorkoutExercise[];
	focusPillar?: Pillar;
	weaknessBased: boolean;
}

export interface WorkoutExercise {
	skillId: string;
	skillName: string;
	pillar: Pillar;
	duration: number; // minutes
	difficulty: string;
	purpose: 'strength' | 'weakness' | 'foundation' | 'repertoire';
	route: string;
}

export class CurriculumEngine {
	private progress: Map<string, StudentProgress> = new Map();
	private weaknesses: Map<string, WeaknessProfile> = new Map();
	private workoutHistory: WorkoutSession[] = [];

	// Get all skills for a pillar
	getSkillsByPillar(pillar: Pillar): SkillArea[] {
		return CURRICULUM.filter((s) => s.pillar === pillar);
	}

	// Get skills by difficulty
	getSkillsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): SkillArea[] {
		return CURRICULUM.filter((s) => s.difficulty === difficulty);
	}

	// Get available skills (dependencies met)
	getAvailableSkills(): SkillArea[] {
		return CURRICULUM.filter((skill) => {
			const progress = this.progress.get(skill.id);
			if (progress?.status === 'mastered') return false;

			// Check all dependencies are mastered
			return skill.dependencies.every((depId) => {
				const depProgress = this.progress.get(depId);
				return depProgress?.status === 'mastered';
			});
		});
	}

	// Identify weaknesses (accuracy < 70%)
	identifyWeaknesses(): WeaknessProfile[] {
		return Array.from(this.weaknesses.values())
			.filter((w) => w.averageAccuracy < 70)
			.sort((a, b) => a.averageAccuracy - b.averageAccuracy);
	}

	// Calculate pillar balance
	getPillarStats(): Record<Pillar, { mastered: number; total: number; averageAccuracy: number }> {
		const stats: Record<Pillar, { mastered: number; total: number; sumAccuracy: number }> = {
			technique: { mastered: 0, total: 0, sumAccuracy: 0 },
			theory: { mastered: 0, total: 0, sumAccuracy: 0 },
			vocabulary: { mastered: 0, total: 0, sumAccuracy: 0 },
			repertoire: { mastered: 0, total: 0, sumAccuracy: 0 }
		};

		for (const skill of CURRICULUM) {
			const progress = this.progress.get(skill.id);
			stats[skill.pillar].total++;
			if (progress?.status === 'mastered') {
				stats[skill.pillar].mastered++;
			}
			if (progress) {
				stats[skill.pillar].sumAccuracy += progress.accuracy;
			}
		}

		return {
			technique: {
				mastered: stats.technique.mastered,
				total: stats.technique.total,
				averageAccuracy: Math.round(stats.technique.sumAccuracy / stats.technique.total) || 0
			},
			theory: {
				mastered: stats.theory.mastered,
				total: stats.theory.total,
				averageAccuracy: Math.round(stats.theory.sumAccuracy / stats.theory.total) || 0
			},
			vocabulary: {
				mastered: stats.vocabulary.mastered,
				total: stats.vocabulary.total,
				averageAccuracy: Math.round(stats.vocabulary.sumAccuracy / stats.vocabulary.total) || 0
			},
			repertoire: {
				mastered: stats.repertoire.mastered,
				total: stats.repertoire.total,
				averageAccuracy: Math.round(stats.repertoire.sumAccuracy / stats.repertoire.total) || 0
			}
		};
	}

	// Generate personalized workout
	generateWorkout(options: {
		duration: number; // total minutes
		focusPillar?: Pillar;
		includeWeaknesses?: boolean;
	}): WorkoutSession {
		const { duration, focusPillar, includeWeaknesses = true } = options;
		const exercises: WorkoutExercise[] = [];
		let remainingTime = duration;

		// 40% of time on weaknesses (if enabled)
		if (includeWeaknesses) {
			const weaknesses = this.identifyWeaknesses().slice(0, 2);
			for (const weakness of weaknesses) {
				if (remainingTime < 5) break;

				const skill = CURRICULUM.find((s) => s.id === weakness.skillId);
				if (skill) {
					exercises.push({
						skillId: skill.id,
						skillName: skill.name,
						pillar: skill.pillar,
						duration: Math.min(10, remainingTime * 0.4),
						difficulty: skill.difficulty,
						purpose: 'weakness',
						route: skill.exercises[0]
					});
					remainingTime -= 10;
				}
			}
		}

		// 30% on foundational skills from focus pillar (or all pillars if no focus)
		if (remainingTime > 5) {
			const foundationSkills = this.getAvailableSkills()
				.filter((s) => (focusPillar ? s.pillar === focusPillar : true))
				.slice(0, focusPillar ? 1 : 2);

			for (const skill of foundationSkills) {
				exercises.push({
					skillId: skill.id,
					skillName: skill.name,
					pillar: skill.pillar,
					duration: Math.min(8, remainingTime * 0.3),
					difficulty: skill.difficulty,
					purpose: 'foundation',
					route: skill.exercises[0]
				});
				remainingTime -= 8;
			}
		}

		// 30% on repertoire / strength building from focus pillar (or repertoire if no focus)
		const strengthSkills = this.getAvailableSkills()
			.filter((s) => (focusPillar ? s.pillar === focusPillar : s.pillar === 'repertoire'))
			.slice(0, 1);

		for (const skill of strengthSkills) {
			if (remainingTime < 5) break;
			exercises.push({
				skillId: skill.id,
				skillName: skill.name,
				pillar: skill.pillar,
				duration: remainingTime,
				difficulty: skill.difficulty,
				purpose: 'strength',
				route: skill.exercises[0]
			});
		}

		const session: WorkoutSession = {
			id: `workout-${Date.now()}`,
			date: new Date(),
			duration: exercises.reduce((sum, e) => sum + e.duration, 0),
			exercises,
			focusPillar,
			weaknessBased: includeWeaknesses
		};

		this.workoutHistory.push(session);
		return session;
	}

	// Record practice session
	recordPractice(
		skillId: string,
		score: number,
		timeMinutes: number,
		missedNotes?: string[]
	): void {
		const existing = this.progress.get(skillId) || {
			skillId,
			status: 'available',
			accuracy: 0,
			timesPracticed: 0,
			totalTimeMinutes: 0,
			lastScore: 0,
			bestScore: 0
		};

		existing.timesPracticed++;
		existing.totalTimeMinutes += timeMinutes;
		existing.lastScore = score;
		existing.bestScore = Math.max(existing.bestScore, score);

		// Update accuracy with exponential moving average
		existing.accuracy = Math.round(existing.accuracy * 0.7 + score * 0.3);

		// Update status
		if (existing.accuracy >= 80 && existing.timesPracticed >= 5) {
			existing.status = 'mastered';
		} else if (existing.timesPracticed > 0) {
			existing.status = 'in-progress';
		}

		this.progress.set(skillId, existing);

		// Update weakness profile if poor performance
		if (score < 70) {
			const weakness = this.weaknesses.get(skillId) || {
				skillId,
				missedAttempts: 0,
				averageAccuracy: 100,
				lastPracticed: new Date(),
				struggleAreas: []
			};

			weakness.missedAttempts++;
			weakness.averageAccuracy = Math.round(weakness.averageAccuracy * 0.7 + score * 0.3);
			weakness.lastPracticed = new Date();
			if (missedNotes) {
				weakness.struggleAreas = [...new Set([...weakness.struggleAreas, ...missedNotes])].slice(
					0,
					5
				);
			}

			this.weaknesses.set(skillId, weakness);
		}
	}

	// Get recommended daily focus based on pillar balance
	getRecommendedFocus(): { pillar: Pillar; reason: string } {
		const stats = this.getPillarStats();

		// Find weakest pillar
		let weakest: Pillar = 'technique';
		let lowestAvg = 100;

		for (const [pillar, stat] of Object.entries(stats)) {
			if (stat.averageAccuracy < lowestAvg) {
				lowestAvg = stat.averageAccuracy;
				weakest = pillar as Pillar;
			}
		}

		if (lowestAvg < 50) {
			return {
				pillar: weakest,
				reason: `Your ${weakest} skills need attention (${lowestAvg}% avg)`
			};
		}

		// Find pillar with fewest mastered skills
		let leastMastered: Pillar = 'technique';
		let lowestRatio = 1;

		for (const [pillar, stat] of Object.entries(stats)) {
			const ratio = stat.mastered / stat.total;
			if (ratio < lowestRatio) {
				lowestRatio = ratio;
				leastMastered = pillar as Pillar;
			}
		}

		if (lowestRatio < 0.3) {
			return {
				pillar: leastMastered,
				reason: `Build your ${leastMastered} foundation (${Math.round(lowestRatio * 100)}% complete)`
			};
		}

		return { pillar: 'repertoire', reason: 'Time to apply your skills to real songs!' };
	}

	// Get learning path visualization
	getLearningPath(): {
		skill: SkillArea;
		status: 'locked' | 'available' | 'in-progress' | 'mastered';
		progress?: StudentProgress;
	}[] {
		return CURRICULUM.map((skill) => {
			const progress = this.progress.get(skill.id);
			let status: 'locked' | 'available' | 'in-progress' | 'mastered' = 'locked';

			if (progress?.status === 'mastered') {
				status = 'mastered';
			} else if (progress?.status === 'in-progress') {
				status = 'in-progress';
			} else if (
				skill.dependencies.every((depId) => this.progress.get(depId)?.status === 'mastered')
			) {
				status = 'available';
			}

			return { skill, status, progress };
		});
	}
}

export const curriculumEngine = new CurriculumEngine();
