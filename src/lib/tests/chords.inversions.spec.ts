import { describe, it, expect } from 'vitest';
import { chords } from '../MusicTheoryUtils';
import { NoteToMidi } from '../types/notes.constants';

describe('Chord inversion and triad constraints', () => {
	it('triad triad 3rd inversion throws', () => {
		const root = NoteToMidi['C4'];
		expect(() => chords(root as any, 'major', 3 as any)).toThrow();
	});

	it('maj7 inversion mapping yields correct root pitch classes', () => {
		const root = NoteToMidi['C4'];
		const c0 = chords(root as any, 'maj7', 0 as any);
		const c1 = chords(root as any, 'maj7', 1 as any);
		const c2 = chords(root as any, 'maj7', 2 as any);
		const c3 = chords(root as any, 'maj7', 3 as any);
		// check that each inversion contains the same pitch classes as the original chord
		const baseNotes = [c0.root, c0.third, c0.fifth, c0.seventh].filter(
			(n) => n != null
		) as number[];
		const baseSet = new Set(baseNotes.map((n) => n % 12));
		[c1, c2, c3].forEach((inv) => {
			const invNotes = [inv.root, inv.third, inv.fifth, inv.seventh].filter(
				(n) => n != null
			) as number[];
			const invSet = new Set(invNotes.map((n) => n % 12));
			expect(invSet).toEqual(baseSet);
		});
	});
});
