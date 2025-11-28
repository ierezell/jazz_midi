import { describe, it, expect } from 'vitest';
import { SCALE_INTERVALS } from '../types/notes.constants';

describe('SCALE_INTERVALS', () => {
	it('includes the octave (12) for Maj, Min and Blues', () => {
		expect(SCALE_INTERVALS.Maj[SCALE_INTERVALS.Maj.length - 1]).toBe(12);
		expect(SCALE_INTERVALS.Min[SCALE_INTERVALS.Min.length - 1]).toBe(12);
		expect(SCALE_INTERVALS.Blues[SCALE_INTERVALS.Blues.length - 1]).toBe(12);
	});
});
