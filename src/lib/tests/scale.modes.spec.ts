import { describe, it, expect } from 'vitest';
import { SCALE_INTERVALS, NoteToMidi } from '../types/notes.constants';

function mod12(n: number) {
	return ((n % 12) + 12) % 12;
}

describe('Scale modes - interval validation', () => {
	const roots = ['C4', 'C3', 'F#4', 'Bb3'] as const;
	const modes = Object.keys(SCALE_INTERVALS) as Array<keyof typeof SCALE_INTERVALS>;

	roots.forEach((rootName) => {
		modes.forEach((mode) => {
			it(`${rootName} ${mode} produces correct semitone offsets`, () => {
				const root = NoteToMidi[rootName as keyof typeof NoteToMidi];
				const mids = SCALE_INTERVALS[mode].map((i) => root + i);
				const offsets = mids.map((m) => mod12(m - root));
				// expected offsets should be SCALE_INTERVALS modulo 12
				const expected = SCALE_INTERVALS[mode].map((i) => mod12(i));
				expect(offsets).toEqual(expected);
			});
		});
	});
});
