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
		expect(units[0].id).toBe('basics-scales');
	});

	it('should get a specific unit by ID', () => {
		const unit = journeyService.getUnit('basics-scales');
		expect(unit).toBeDefined();
		expect(unit?.title).toBe('Major Scales');
	});

	it('should complete a lesson', () => {
		const unitId = 'basics-scales';
		const lessonId = 'c-major-scale';
		
		journeyService.completeLesson(unitId, lessonId, 3);
		
		const unit = journeyService.getUnit(unitId);
		const lesson = unit?.lessons.find(l => l.id === lessonId);
		
		expect(lesson?.completed).toBe(true);
		expect(lesson?.stars).toBe(3);
	});

	it('should generate correct lesson URL', () => {
		const unit = journeyService.getUnit('basics-scales')!;
		const lesson = unit.lessons[0];
		
		const url = journeyService.getLessonUrl(unit, lesson);
		
		expect(url).toContain(lesson.path);
		expect(url).toContain('unitId=basics-scales');
		expect(url).toContain('lessonId=c-major-scale');
	});

	it('should unlock next unit when current is completed', () => {
		const unit = journeyService.getUnit('basics-scales')!;
		
		// Complete all lessons
		unit.lessons.forEach(lesson => {
			journeyService.completeLesson(unit.id, lesson.id, 3);
		});
		
		const nextUnit = journeyService.getUnit('basics-chords');
		expect(nextUnit?.status).toBe('active');
	});
});
