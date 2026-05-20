import { describe, it, expect, beforeEach } from 'vitest';
import { VelocityValidator } from '../../src/lib/exercises/utils/VelocityValidator';
import type { NoteEvent } from '../../src/lib/types/types';

describe('VelocityValidator', () => {
	let validator: VelocityValidator;
	const mockNoteEvent = (note: number, velocity: number): NoteEvent => ({
		noteNumber: note as any,
		velocity,
		type: 'on',
		noteName: 'C',
		noteFullName: 'C4',
		timestamp: Date.now(),
		channel: 1
	});

	describe('mode: off', () => {
		beforeEach(() => {
			validator = new VelocityValidator({ mode: 'off' });
		});

		it('should always return valid when off', () => {
			const result = validator.validate(mockNoteEvent(60, 100));

			expect(result.isValid).toBe(true);
			expect(result.feedback).toBe('Velocity check disabled');
		});
	});

	describe('mode: ghost-accent', () => {
		beforeEach(() => {
			validator = new VelocityValidator({
				mode: 'ghost-accent',
				ghostVelocityMax: 40,
				accentVelocityMin: 80
			});
		});

		it('should accept ghost note on downbeat (velocity < 40)', () => {
			const result = validator.validate(mockNoteEvent(60, 30));

			expect(result.isValid).toBe(true);
			expect(result.feedback).toContain('Ghost note');
		});

		it('should reject loud note on downbeat', () => {
			const result = validator.validate(mockNoteEvent(60, 90));

			expect(result.isValid).toBe(false);
			expect(result.feedback).toContain('Ghost note');
		});

		it('should accept accent on upbeat (velocity >= 80)', () => {
			// First note sets downbeat
			validator.validate(mockNoteEvent(60, 30));

			// Second note is upbeat
			const result = validator.validate(mockNoteEvent(62, 90));

			expect(result.isValid).toBe(true);
			expect(result.feedback).toContain('Accent');
		});

		it('should reject soft note on upbeat', () => {
			// First note sets downbeat
			validator.validate(mockNoteEvent(60, 30));

			// Second note is upbeat
			const result = validator.validate(mockNoteEvent(62, 50));

			expect(result.isValid).toBe(false);
			expect(result.feedback).toContain('Accent');
		});
	});

	describe('mode: hand-based', () => {
		beforeEach(() => {
			validator = new VelocityValidator({
				mode: 'hand-based',
				lhVelocityMax: 50,
				rhVelocityMin: 80,
				staffSplitNote: 60
			});
		});

		it('should accept soft LH note (below middle C, velocity <= 50)', () => {
			const result = validator.validate(mockNoteEvent(48, 40), 2); // LH

			expect(result.isValid).toBe(true);
			expect(result.feedback).toContain('LH');
		});

		it('should reject loud LH note', () => {
			const result = validator.validate(mockNoteEvent(48, 90), 2); // LH

			expect(result.isValid).toBe(false);
			expect(result.feedback).toContain('LH too loud');
		});

		it('should accept strong RH note (above middle C, velocity >= 80)', () => {
			const result = validator.validate(mockNoteEvent(72, 100), 1); // RH

			expect(result.isValid).toBe(true);
			expect(result.feedback).toContain('RH');
		});

		it('should reject soft RH note', () => {
			const result = validator.validate(mockNoteEvent(72, 50), 1); // RH

			expect(result.isValid).toBe(false);
			expect(result.feedback).toContain('RH too soft');
		});

		it('should determine hand from note range when staff not provided', () => {
			// Low note should be treated as LH
			const result = validator.validate(mockNoteEvent(48, 90));

			expect(result.isValid).toBe(false);
			expect(result.feedback).toContain('LH too loud');
		});
	});

	describe('mode: per-note', () => {
		beforeEach(() => {
			const perNoteConstraints = new Map([
				[60, { min: 30, max: 50, hint: 'ghost' }],
				[64, { min: 80, max: 110, hint: 'accent' }]
			]);

			validator = new VelocityValidator({
				mode: 'per-note',
				perNoteConstraints
			});
		});

		it('should validate note within constraints', () => {
			const result = validator.validate(mockNoteEvent(60, 40));

			expect(result.isValid).toBe(true);
			expect(result.feedback).toContain('ghost');
		});

		it('should reject note below min velocity', () => {
			const result = validator.validate(mockNoteEvent(60, 20));

			expect(result.isValid).toBe(false);
			expect(result.minVelocity).toBe(30);
		});

		it('should reject note above max velocity', () => {
			const result = validator.validate(mockNoteEvent(60, 60));

			expect(result.isValid).toBe(false);
			expect(result.maxVelocity).toBe(50);
		});

		it('should use global constraints when no per-note constraint', () => {
			validator.updateConfig({ globalMin: 50, globalMax: 100 });

			// Note 62 has no constraint, should use global
			const result = validator.validate(mockNoteEvent(62, 40));

			expect(result.isValid).toBe(false);
		});
	});

	describe('getStats', () => {
		beforeEach(() => {
			validator = new VelocityValidator({ mode: 'ghost-accent' });
		});

		it('should return zero stats initially', () => {
			const stats = validator.getStats();

			expect(stats.total).toBe(0);
			expect(stats.accuracy).toBe(0);
		});

		it('should calculate accuracy correctly', () => {
			// 2 correct, 1 incorrect
			validator.validate(mockNoteEvent(60, 30)); // Correct ghost
			validator.validate(mockNoteEvent(62, 90)); // Correct accent
			validator.validate(mockNoteEvent(64, 90)); // Incorrect (should be ghost)

			const stats = validator.getStats();

			expect(stats.total).toBe(3);
			expect(stats.valid).toBe(2);
			expect(stats.invalid).toBe(1);
			expect(stats.accuracy).toBe(67); // 2/3 = 67%
		});
	});

	describe('fromExerciseSettings', () => {
		it('should create off validator when disabled', () => {
			const validator = VelocityValidator.fromExerciseSettings({
				enableVelocityCheck: false,
				velocityMode: 'ghost-accent'
			});

			const result = validator.validate(mockNoteEvent(60, 100));
			expect(result.isValid).toBe(true);
			expect(result.feedback).toBe('Velocity check disabled');
		});

		it('should use provided settings', () => {
			const validator = VelocityValidator.fromExerciseSettings({
				enableVelocityCheck: true,
				velocityMode: 'hand-based',
				lhVelocityMax: 60,
				rhVelocityMin: 90
			});

			// Check settings applied
			const result = validator.validate(mockNoteEvent(48, 70), 2);
			expect(result.isValid).toBe(false); // 70 > 60
		});
	});
});

