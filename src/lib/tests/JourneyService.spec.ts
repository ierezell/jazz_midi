import { describe, it, expect, beforeEach } from 'vitest';
import { JourneyService } from '../JourneyService';

describe('JourneyService', () => {
	let journeyService: JourneyService;

	beforeEach(() => {
		journeyService = JourneyService.getInstance();
	});

	it('should return all units', () => {
		const units = journeyService.getUnits();
		expect(units.length).toBeGreaterThan(0);
		expect(units[0].id).toBe('level-0');
	});

	it('should get a specific unit by ID', () => {
		const unit = journeyService.getUnit('level-0');
		expect(unit).toBeDefined();
		expect(unit?.title).toContain('Level 0');
	});

	it('should complete a lesson', () => {
		const unitId = 'level-0';
		const lessonId = 'l0-c-scale';
		
		journeyService.completeLesson(unitId, lessonId, 3);
		
		const unit = journeyService.getUnit(unitId);
		const lesson = unit?.lessons.find(l => l.id === lessonId);
		
		// Lesson requires 3 perfect completions to be marked as completed
		// We just did 1, so it should NOT be completed yet, but stars should be 3
		expect(lesson?.completed).toBe(false);
		expect(lesson?.stars).toBe(3);
		expect(lesson?.perfectCompletions).toBe(1);

		// Complete 2 more times
		journeyService.completeLesson(unitId, lessonId, 3);
		journeyService.completeLesson(unitId, lessonId, 3);
		
		expect(lesson?.completed).toBe(true);
	});

	it('should generate correct lesson URL', () => {
		const unit = journeyService.getUnit('level-0')!;
		const lesson = unit.lessons[0];
		
		const url = journeyService.getLessonUrl(unit, lesson);
		
		expect(url).toContain(lesson.path);
		expect(url).toContain('unitId=level-0');
		expect(url).toContain('lessonId=l0-c-scale');
	});

	it('should unlock next unit when current is completed', () => {
		const unit = journeyService.getUnit('level-0')!;
		
		// Complete all lessons
		unit.lessons.forEach(lesson => {
			// Each lesson needs 3 perfect completions (or 5 for flashcards)
			const required = lesson.requiredPerfectCompletions;
			for(let i=0; i<required; i++) {
				journeyService.completeLesson(unit.id, lesson.id, 3);
			}
		});
		
		const nextUnit = journeyService.getUnit('level-1');
		expect(nextUnit?.status).toBe('active');
	});
});
