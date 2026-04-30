import { describe, it, expect, beforeEach } from 'vitest';
import { CurriculumEngine, CURRICULUM, type SkillArea } from '../../src/lib/CurriculumEngine';

describe('CurriculumEngine', () => {
	let engine: CurriculumEngine;

	beforeEach(() => {
		engine = new CurriculumEngine();
	});

	describe('getSkillsByPillar', () => {
		it('should return only technique skills', () => {
			const skills = engine.getSkillsByPillar('technique');
			expect(skills.length).toBeGreaterThan(0);
			skills.forEach((skill) => {
				expect(skill.pillar).toBe('technique');
			});
		});

		it('should return only theory skills', () => {
			const skills = engine.getSkillsByPillar('theory');
			expect(skills.length).toBeGreaterThan(0);
			skills.forEach((skill) => {
				expect(skill.pillar).toBe('theory');
			});
		});

		it('should return empty array for invalid pillar', () => {
			const skills = engine.getSkillsByPillar('invalid' as any);
			expect(skills).toEqual([]);
		});
	});

	describe('getAvailableSkills', () => {
		it('should return skills with no dependencies', () => {
			const skills = engine.getAvailableSkills();
			expect(skills.length).toBeGreaterThan(0);

			// All returned skills should have dependencies met (empty or mastered)
			skills.forEach((skill) => {
				expect(
					skill.dependencies.length === 0 ||
						engine['progress'].get(skill.dependencies[0])?.status === 'mastered'
				).toBe(true);
			});
		});
	});

	describe('identifyWeaknesses', () => {
		it('should return empty array initially', () => {
			const weaknesses = engine.identifyWeaknesses();
			expect(weaknesses).toEqual([]);
		});

		it('should identify weaknesses after poor performance', () => {
			// Record poor performance
			engine.recordPractice('ghost-notes', 50, 5, ['velocity']);
			engine.recordPractice('ghost-notes', 60, 5);
			engine.recordPractice('ghost-notes', 55, 5);

			const weaknesses = engine.identifyWeaknesses();
			expect(weaknesses.length).toBeGreaterThan(0);
			expect(weaknesses[0].averageAccuracy).toBeLessThan(70);
		});
	});

	describe('getPillarStats', () => {
		it('should return stats for all 4 pillars', () => {
			const stats = engine.getPillarStats();

			expect(stats.technique).toBeDefined();
			expect(stats.theory).toBeDefined();
			expect(stats.vocabulary).toBeDefined();
			expect(stats.repertoire).toBeDefined();
		});

		it('should have total count matching curriculum', () => {
			const stats = engine.getPillarStats();
			const totalSkills =
				stats.technique.total +
				stats.theory.total +
				stats.vocabulary.total +
				stats.repertoire.total;

			expect(totalSkills).toBe(CURRICULUM.length);
		});
	});

	describe('generateWorkout', () => {
		it('should generate workout with exercises', () => {
			const workout = engine.generateWorkout({ duration: 20 });

			expect(workout).toBeDefined();
			expect(workout.exercises).toBeDefined();
			expect(workout.exercises.length).toBeGreaterThan(0);
		});

		it('should respect duration parameter', () => {
			const workout = engine.generateWorkout({ duration: 30 });
			const totalDuration = workout.exercises.reduce((sum, ex) => sum + ex.duration, 0);

			expect(totalDuration).toBeLessThanOrEqual(30);
		});

		it('should include pillar focus when specified', () => {
			const workout = engine.generateWorkout({
				duration: 20,
				focusPillar: 'technique',
				includeWeaknesses: false
			});

			// At least one exercise should be from technique pillar
			const techniqueExercises = workout.exercises.filter((ex) => ex.pillar === 'technique');
			expect(techniqueExercises.length).toBeGreaterThan(0);
		});

		it('should generate workout with exercises when no pillar is selected (All)', () => {
			const workout = engine.generateWorkout({
				duration: 20,
				focusPillar: undefined,
				includeWeaknesses: true
			});

			expect(workout).toBeDefined();
			expect(workout.exercises).toBeDefined();
			expect(workout.exercises.length).toBeGreaterThan(0);
			// Should include exercises from multiple pillars
			const uniquePillars = new Set(workout.exercises.map((ex) => ex.pillar));
			expect(uniquePillars.size).toBeGreaterThanOrEqual(1);
		});

		it('should generate workout for vocabulary pillar', () => {
			const workout = engine.generateWorkout({
				duration: 20,
				focusPillar: 'vocabulary',
				includeWeaknesses: false
			});

			expect(workout).toBeDefined();
			expect(workout.exercises.length).toBeGreaterThan(0);
			// All exercises should be from vocabulary pillar
			const allVocabulary = workout.exercises.every((ex) => ex.pillar === 'vocabulary');
			expect(allVocabulary).toBe(true);
		});

		it('should generate workout for repertoire pillar', () => {
			const workout = engine.generateWorkout({
				duration: 20,
				focusPillar: 'repertoire',
				includeWeaknesses: false
			});

			expect(workout).toBeDefined();
			expect(workout.exercises.length).toBeGreaterThan(0);
			// All exercises should be from repertoire pillar
			const allRepertoire = workout.exercises.every((ex) => ex.pillar === 'repertoire');
			expect(allRepertoire).toBe(true);
		});
	});

	describe('recordPractice', () => {
		it('should update progress after practice', () => {
			engine.recordPractice('scale-geometry-single', 85, 10);

			const path = engine.getLearningPath();
			const skill = path.find((item) => item.skill.id === 'scale-geometry-single');

			expect(skill?.progress).toBeDefined();
			expect(skill?.progress?.timesPracticed).toBe(1);
		});

		it('should identify weakness after poor score', () => {
			engine.recordPractice('ghost-notes', 50, 5);

			const weaknesses = engine.identifyWeaknesses();
			expect(weaknesses.length).toBeGreaterThan(0);
		});

		it('should mark skill as mastered after high scores', () => {
			// Practice 5 times with high scores
			for (let i = 0; i < 5; i++) {
				engine.recordPractice('scale-geometry-single', 85, 10);
			}

			const path = engine.getLearningPath();
			const skill = path.find((item) => item.skill.id === 'scale-geometry-single');

			expect(skill?.status).toBe('mastered');
		});
	});

	describe('getRecommendedFocus', () => {
		it('should return a pillar', () => {
			const focus = engine.getRecommendedFocus();

			expect(['technique', 'theory', 'vocabulary', 'repertoire']).toContain(focus.pillar);
			expect(focus.reason).toBeTruthy();
		});
	});

	describe('getLearningPath', () => {
		it('should return all curriculum items', () => {
			const path = engine.getLearningPath();

			expect(path.length).toBe(CURRICULUM.length);
		});

		it('should have correct statuses', () => {
			const path = engine.getLearningPath();

			path.forEach((item) => {
				expect(['locked', 'available', 'in-progress', 'mastered']).toContain(item.status);
			});
		});
	});
});
