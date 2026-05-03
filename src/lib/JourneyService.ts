import { userStatsService } from './UserStatsService';
import { browser } from '$app/environment';
import { JOURNEY_UNITS } from './data/journeyUnits';

// --- Shared Types -------------------------------------------------------------

export type Pillar = 'technique' | 'theory' | 'vocabulary' | 'repertoire';

export interface Lesson {
id: string;
title: string;
type: 'exercise' | 'theory';
path: string;
pillar: Pillar;
/** URL query params forwarded to the exercise page */
params?: Record<string, string>;
completed: boolean;
stars: number; // 0-3
perfectCompletions: number;
requiredPerfectCompletions: number;
}

export interface Unit {
id: string;
title: string;
description: string;
difficulty: 'beginner' | 'intermediate' | 'advanced';
lessons: Lesson[];
status: 'locked' | 'active' | 'completed';
color: string;
}

// --- Training Session ---------------------------------------------------------

/** A focused practice block generated from one unit's lessons. */
export interface TrainingSession {
unitId: string;
unitTitle: string;
difficulty: 'beginner' | 'intermediate' | 'advanced';
/** Ordered lessons for this session (3-5 items, unmastered first) */
lessons: Lesson[];
/** Rough estimate: 4 min per exercise */
estimatedMinutes: number;
}

// --- JourneyService -----------------------------------------------------------

export class JourneyService {
private static instance: JourneyService;
private units: Unit[] = JOURNEY_UNITS.map((u) => ({
		...u,
		lessons: u.lessons.map((l) => ({ ...l }))
	}));

private constructor() {
this.loadProgress();
}

static getInstance(): JourneyService {
if (!JourneyService.instance) {
JourneyService.instance = new JourneyService();
}
return JourneyService.instance;
}

// --- Unit / Lesson Access -------------------------------------------------

getUnits(): Unit[] {
return this.units;
}

getUnit(unitId: string): Unit | undefined {
return this.units.find((u) => u.id === unitId);
}

getActiveUnit(): Unit | undefined {
return this.units.find((u) => u.status === 'active');
}

// --- Progress -------------------------------------------------------------

completeLesson(unitId: string, lessonId: string, stars: number = 3): void {
const unit = this.units.find((u) => u.id === unitId);
if (!unit) return;
const lesson = unit.lessons.find((l) => l.id === lessonId);
if (!lesson) return;

if (stars === 3) {
lesson.perfectCompletions = (lesson.perfectCompletions || 0) + 1;
}
if (lesson.perfectCompletions >= lesson.requiredPerfectCompletions) {
lesson.completed = true;
}
lesson.stars = Math.max(lesson.stars, stars);

this.checkUnitCompletion(unit);
this.saveProgress();
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

/** Mastery progress across the 4 learning pillars, optionally scoped to one unit. */
getPillarProgress(unitId?: string): Record<Pillar, { total: number; mastered: number }> {
const result: Record<Pillar, { total: number; mastered: number }> = {
technique: { total: 0, mastered: 0 },
theory: { total: 0, mastered: 0 },
vocabulary: { total: 0, mastered: 0 },
repertoire: { total: 0, mastered: 0 }
};
const units = unitId ? this.units.filter((u) => u.id === unitId) : this.units;
for (const unit of units) {
for (const lesson of unit.lessons) {
result[lesson.pillar].total++;
if (lesson.completed) result[lesson.pillar].mastered++;
}
}
return result;
}

// --- Training Generation --------------------------------------------------

/**
 * Build a focused training session from a unit.
 * Prioritises unmastered lessons and balances pillars.
 */
generateTraining(unitId: string): TrainingSession | undefined {
const unit = this.units.find((u) => u.id === unitId);
if (!unit) return undefined;

const SESSION_SIZE = 4;
const sorted = [...unit.lessons].sort((a, b) => {
const aMastered = a.completed ? 1 : 0;
const bMastered = b.completed ? 1 : 0;
if (aMastered !== bMastered) return aMastered - bMastered;
return a.stars - b.stars;
});

// Balance pillars: at most 2 lessons per pillar per session
const selected: Lesson[] = [];
const pillarCounts: Record<Pillar, number> = {
technique: 0, theory: 0, vocabulary: 0, repertoire: 0
};
for (const lesson of sorted) {
if (selected.length >= SESSION_SIZE) break;
if (pillarCounts[lesson.pillar] < 2) {
selected.push(lesson);
pillarCounts[lesson.pillar]++;
}
}
// Fill remaining if needed (pillar balance relaxed)
for (const lesson of sorted) {
if (selected.length >= SESSION_SIZE) break;
if (!selected.includes(lesson)) selected.push(lesson);
}

return {
unitId: unit.id,
unitTitle: unit.title,
difficulty: unit.difficulty,
lessons: selected,
estimatedMinutes: selected.length * 4
};
}

// --- Navigation ----------------------------------------------------------

/** Build the full URL for a lesson, including context params. */
getLessonUrl(unit: Unit, lesson: Lesson): string {
const params = new URLSearchParams(lesson.params ?? {});
params.set('unitId', unit.id);
params.set('lessonId', lesson.id);
return `${lesson.path}?${params.toString()}`;
}

/** Pick one lesson to practice from a unit (random unmastered, or any if all mastered). */
getPracticeLesson(unitId: string): { unit: Unit; lesson: Lesson } | undefined {
const unit = this.units.find((u) => u.id === unitId);
if (!unit) return undefined;
const unmastered = unit.lessons.filter(
(l) => (l.perfectCompletions || 0) < l.requiredPerfectCompletions
);
const pool = unmastered.length > 0 ? unmastered : unit.lessons;
if (pool.length === 0) return undefined;
return { unit, lesson: pool[Math.floor(Math.random() * pool.length)] };
}

// --- Persistence ---------------------------------------------------------

private saveProgress(): void {
if (!browser) return;
const progress = this.units.map((u) => ({
id: u.id,
status: u.status,
lessons: u.lessons.map((l) => ({
id: l.id,
completed: l.completed,
stars: l.stars,
perfectCompletions: l.perfectCompletions
}))
}));
localStorage.setItem('journey_progress_v2', JSON.stringify(progress));
}

private loadProgress(): void {
if (!browser) return;
const saved = localStorage.getItem('journey_progress_v2');
if (!saved) return;
try {
type SavedUnit = {
id: string;
status: 'locked' | 'active' | 'completed';
lessons: { id: string; completed: boolean; stars: number; perfectCompletions?: number }[];
};
const progress = JSON.parse(saved) as SavedUnit[];
for (const savedUnit of progress) {
const unit = this.units.find((u) => u.id === savedUnit.id);
if (!unit) continue;
unit.status = savedUnit.status;
for (const savedLesson of savedUnit.lessons) {
const lesson = unit.lessons.find((l) => l.id === savedLesson.id);
if (lesson) {
lesson.completed = savedLesson.completed;
lesson.stars = savedLesson.stars;
lesson.perfectCompletions = savedLesson.perfectCompletions ?? 0;
}
}
}
} catch (e) {
console.error('Failed to load journey progress', e);
}
}

private checkUnitCompletion(unit: Unit): void {
if (!unit.lessons.every((l) => l.completed)) return;
unit.status = 'completed';
const idx = this.units.indexOf(unit);
if (idx !== -1 && idx < this.units.length - 1) {
const next = this.units[idx + 1];
if (next.status === 'locked') next.status = 'active';
}
}
}

export const journeyService = JourneyService.getInstance();
