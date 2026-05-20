/**
 * JourneyService unit tests
 * Replaces the old CurriculumEngine.spec.ts tests after CurriculumEngine was merged into JourneyService.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// $app/environment is a SvelteKit virtual module; mock it before JourneyService is imported.
// vi.mock is hoisted to the top of the file by Vitest's transform.
vi.mock('$app/environment', () => ({ browser: true, dev: true, building: false, version: 'test' }));

import { JourneyService, type Pillar } from '../../src/lib/JourneyService';

// Bypass the singleton to get a fresh instance each test; clear localStorage
// so loadProgress() doesn't carry over state from previous tests.
function freshService(): JourneyService {
	localStorage.removeItem('journey_progress_v2');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(JourneyService as any).instance = undefined;
	return JourneyService.getInstance();
}

describe('JourneyService', () => {
let service: JourneyService;

beforeEach(() => {
service = freshService();
});

it('loads 12 units', () => {
const units = service.getUnits();
expect(units.length).toBe(12);
});

it('unit 1 is active by default', () => {
const unit1 = service.getUnit('unit-1');
expect(unit1?.status).toBe('active');
});

it('all other units start locked', () => {
const units = service.getUnits();
const locked = units.filter((u) => u.id !== 'unit-1');
expect(locked.every((u) => u.status === 'locked')).toBe(true);
});

it('every lesson has a pillar', () => {
const valid: Pillar[] = ['technique', 'theory', 'vocabulary', 'repertoire'];
for (const unit of service.getUnits()) {
for (const lesson of unit.lessons) {
expect(valid).toContain(lesson.pillar);
}
}
});

it('every unit has a difficulty', () => {
for (const unit of service.getUnits()) {
expect(['beginner', 'intermediate', 'advanced']).toContain(unit.difficulty);
}
});

describe('generateTraining', () => {
it('returns a session for unit-1', () => {
const session = service.generateTraining('unit-1');
expect(session).toBeDefined();
expect(session!.lessons.length).toBeGreaterThan(0);
expect(session!.lessons.length).toBeLessThanOrEqual(4);
});

it('session estimatedMinutes is positive', () => {
const session = service.generateTraining('unit-1');
expect(session!.estimatedMinutes).toBeGreaterThan(0);
});

it('no more than 2 lessons from a single pillar per session', () => {
const session = service.generateTraining('unit-1');
const counts: Record<string, number> = {};
for (const l of session!.lessons) {
counts[l.pillar] = (counts[l.pillar] ?? 0) + 1;
}
for (const count of Object.values(counts)) {
expect(count).toBeLessThanOrEqual(2);
}
});

it('prioritises unmastered lessons', () => {
// Complete all lessons in unit-1 except one
const unit = service.getUnit('unit-1')!;
const last = unit.lessons[unit.lessons.length - 1];
for (const lesson of unit.lessons) {
if (lesson.id !== last.id) {
lesson.completed = true;
lesson.stars = 3;
lesson.perfectCompletions = lesson.requiredPerfectCompletions;
}
}
const session = service.generateTraining('unit-1');
// The unmastered lesson should be first
expect(session!.lessons[0].id).toBe(last.id);
});

it('returns undefined for non-existent unit', () => {
expect(service.generateTraining('unit-99')).toBeUndefined();
});
});

describe('getPillarProgress', () => {
it('returns totals across all units', () => {
const progress = service.getPillarProgress();
const total = Object.values(progress).reduce((s, p) => s + p.total, 0);
expect(total).toBeGreaterThan(0);
});

it('starts with 0 mastered', () => {
const progress = service.getPillarProgress();
for (const p of Object.values(progress)) {
expect(p.mastered).toBe(0);
}
});
});

describe('completeLesson', () => {
it('unlocks unit-2 when all unit-1 lessons are completed', () => {
const unit = service.getUnit('unit-1')!;
for (const lesson of unit.lessons) {
// Fill to 3 perfect completions
for (let i = 0; i < lesson.requiredPerfectCompletions; i++) {
service.completeLesson('unit-1', lesson.id, 3);
}
}
expect(service.getUnit('unit-1')!.status).toBe('completed');
expect(service.getUnit('unit-2')!.status).toBe('active');
});
});

describe('getPracticeLesson', () => {
it('returns a lesson from the given unit', () => {
const result = service.getPracticeLesson('unit-1');
expect(result).toBeDefined();
expect(result!.unit.id).toBe('unit-1');
});

it('returns undefined for locked unit (no lessons reachable)', () => {
// unit-12 is locked but still has lessons � getPracticeLesson still works
const result = service.getPracticeLesson('unit-12');
expect(result).toBeDefined();
});
});
});

