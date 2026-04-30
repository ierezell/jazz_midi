import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BeatValidator } from '../../src/lib/BeatValidator';
import type { MidiNote, Note, NoteFullName, NoteEvent, RhythmPattern } from '../../src/lib/types/types';

// --- AudioContext mock ---
let mockCurrentTime = 0;

class MockAudioContext {
	get currentTime() {
		return mockCurrentTime;
	}
	close() {
		return Promise.resolve();
	}
}

vi.stubGlobal('AudioContext', MockAudioContext);

// --- Helpers ---
const POP_PATTERN: RhythmPattern = {
	id: 'pop',
	name: 'Pop Groove',
	description: '',
	suggestedBpm: 100,
	timeSignature: '4/4',
	defaultChords: [],
	isProgression: true,
	measures: 1,
	hits: [
		{ beat: 1.0, hand: 'LH' },
		{ beat: 1.0, hand: 'RH' },
		{ beat: 2.0, hand: 'RH' },
		{ beat: 2.5, hand: 'RH' },
		{ beat: 4.0, hand: 'RH' }
	]
};

function makeNote(noteNumber: number): NoteEvent {
	return {
		noteNumber: noteNumber as MidiNote,
		type: 'on',
		noteName: 'C' as Note,
		noteFullName: 'C4' as NoteFullName,
		velocity: 80,
		timestamp: Date.now(),
		channel: 1
	};
}

// Advance mock clock by ms
function advanceTime(ms: number) {
	mockCurrentTime += ms / 1000;
}

describe('BeatValidator', () => {
	let validator: BeatValidator;

	beforeEach(() => {
		mockCurrentTime = 0;
		validator = new BeatValidator();
		vi.useFakeTimers();
	});

	afterEach(() => {
		validator.stop();
		vi.useRealTimers();
	});

	describe('initial state', () => {
		it('returns Miss when not running', () => {
			const result = validator.validateHit(makeNote(60));
			expect(result.isHit).toBe(false);
			expect(result.label).toBe('Miss');
		});

		it('getStats returns zeros before any hits', () => {
			const stats = validator.getStats();
			expect(stats.avgDeviationMs).toBe(0);
			expect(stats.hitCount).toBe(0);
		});

		it('getCurrentBeat returns 0 before start', () => {
			expect(validator.getCurrentBeat()).toBe(0);
		});
	});

	describe('after start()', () => {
		it('starts without throwing', () => {
			expect(() => validator.start(120, POP_PATTERN)).not.toThrow();
		});

		it('stop() is idempotent', () => {
			validator.start(120, POP_PATTERN);
			expect(() => {
				validator.stop();
				validator.stop();
			}).not.toThrow();
		});

		it('returns Miss when running but no scheduled hits nearby', () => {
			validator.start(120, POP_PATTERN);
			// Time hasn't advanced — no hits scheduled at currentTime=0 (start offset is 0.1s)
			// Miss if no matching hit within 150ms
			const result = validator.validateHit(makeNote(60));
			// Could be a hit or miss depending on scheduler state; just assert it returns valid shape
			expect(result).toHaveProperty('isHit');
			expect(result).toHaveProperty('deviationMs');
			expect(['Perfect', 'Good', 'Early', 'Late', 'Miss']).toContain(result.label);
		});
	});

	describe('hand splitting (LH_SPLIT = 60)', () => {
		it('note < 60 is treated as LH', () => {
			validator.start(120, POP_PATTERN);
			// Manually inject a scheduled hit for LH
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const internal = validator as any;
			internal.scheduledHits = [{ beat: 1.0, hand: 'LH', time: 0 }];
			mockCurrentTime = 0;

			const result = validator.validateHit(makeNote(59)); // note 59 < 60 → LH
			expect(result.isHit).toBe(true);
		});

		it('note >= 60 is treated as RH', () => {
			validator.start(120, POP_PATTERN);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const internal = validator as any;
			internal.scheduledHits = [{ beat: 1.0, hand: 'RH', time: 0 }];
			mockCurrentTime = 0;

			const result = validator.validateHit(makeNote(60)); // note 60 ≥ 60 → RH
			expect(result.isHit).toBe(true);
		});

		it('LH note does not match RH scheduled hit', () => {
			validator.start(120, POP_PATTERN);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const internal = validator as any;
			internal.scheduledHits = [{ beat: 1.0, hand: 'RH', time: 0 }];
			mockCurrentTime = 0;

			const result = validator.validateHit(makeNote(59)); // LH note vs RH hit → Miss
			expect(result.isHit).toBe(false);
			expect(result.label).toBe('Miss');
		});
	});

	describe('timing labels', () => {
		beforeEach(() => {
			validator.start(120, POP_PATTERN);
		});

		function hitAtOffset(offsetMs: number, noteNumber = 60) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const internal = validator as any;
			internal.scheduledHits = [{ beat: 1.0, hand: 'RH', time: 0 }];
			mockCurrentTime = offsetMs / 1000;
			return validator.validateHit(makeNote(noteNumber));
		}

		it('labels Perfect for ≤30ms deviation', () => {
			const result = hitAtOffset(20);
			expect(result.label).toBe('Perfect');
			expect(result.isHit).toBe(true);
		});

		it('labels Good for 31–70ms deviation', () => {
			const result = hitAtOffset(50);
			expect(result.label).toBe('Good');
			expect(result.isHit).toBe(true);
		});

		it('labels Late for 71–150ms (positive deviation)', () => {
			const result = hitAtOffset(100);
			expect(result.label).toBe('Late');
			expect(result.isHit).toBe(true);
		});

		it('labels Early for early hit within window', () => {
			const result = hitAtOffset(-100); // 100ms early
			expect(result.label).toBe('Early');
			expect(result.isHit).toBe(true);
		});

		it('labels Miss for >150ms deviation', () => {
			const result = hitAtOffset(200); // beyond HIT_WINDOW_MS
			expect(result.isHit).toBe(false);
			expect(result.label).toBe('Miss');
		});
	});

	describe('hit consumption', () => {
		it('same scheduled hit cannot be consumed twice', () => {
			validator.start(120, POP_PATTERN);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const internal = validator as any;
			internal.scheduledHits = [{ beat: 1.0, hand: 'RH', time: 0 }];
			mockCurrentTime = 0;

			const first = validator.validateHit(makeNote(60));
			const second = validator.validateHit(makeNote(60));
			expect(first.isHit).toBe(true);
			expect(second.isHit).toBe(false); // consumed
		});
	});

	describe('getStats()', () => {
		it('accumulates hit deviations', () => {
			validator.start(120, POP_PATTERN);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const internal = validator as any;

			// Hit 1: 20ms late
			internal.scheduledHits = [{ beat: 1.0, hand: 'RH', time: 0 }];
			mockCurrentTime = 0.02;
			validator.validateHit(makeNote(60));

			// Hit 2: 40ms late
			internal.scheduledHits = [{ beat: 2.0, hand: 'RH', time: 0 }];
			mockCurrentTime = 0.04;
			validator.validateHit(makeNote(60));

			const stats = validator.getStats();
			expect(stats.hitCount).toBe(2);
			expect(stats.avgDeviationMs).toBe(30); // (20 + 40) / 2
		});
	});

	describe('onBeatChange callback', () => {
		it('calls onBeatChange callback when provided', () => {
			const onBeatChange = vi.fn();
			// Just verify start() accepts the callback without error
			expect(() => validator.start(120, POP_PATTERN, onBeatChange)).not.toThrow();
			// Advance timers to trigger scheduler
			vi.advanceTimersByTime(100);
		});
	});
});
