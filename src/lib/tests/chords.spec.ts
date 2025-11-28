import { describe, it, expect } from 'vitest';
import { chords, generateChordNotesDataFromChord } from '../MusicTheoryUtils';
import { NoteToMidi, MidiToNote } from '../types/notes.constants';

describe('Chord generation', () => {
	it('Cmaj7 root produces C4 E4 G4 B4', () => {
		const root = NoteToMidi['C4'];
		const c = chords(root as any, 'maj7', 0 as any);
		const names = [c.root, c.third, c.fifth, c.seventh]
			.filter(Boolean)
			.map((n) => (MidiToNote as any)[n as number]);
		expect(names).toEqual(['C4', 'E4', 'G4', 'B4']);
	});

	it('C major triad contains the pitch classes C E G (order-insensitive)', () => {
		const root = NoteToMidi['C4'];
		const triad = chords(root as any, 'major', 0 as any);
		const classes = new Set([triad.root % 12, triad.third % 12, triad.fifth % 12]);
		const expected = new Set([NoteToMidi['C4'] % 12, NoteToMidi['E4'] % 12, NoteToMidi['G4'] % 12]);
		expect(classes).toEqual(expected);
	});

	it('1735 voicing produces left and right hand arrays and they reference correct notes', () => {
		const root = NoteToMidi['C4'];
		const c = chords(root as any, 'maj7', 0 as any);
		const voicings = generateChordNotesDataFromChord(c as any, '1735');
		// expect both sides arrays to exist and to contain note names
		expect(Array.isArray(voicings.leftHand)).toBeTruthy();
		expect(Array.isArray(voicings.rightHand)).toBeTruthy();
		expect(voicings.leftHand.flat().length).toBeGreaterThanOrEqual(1);
		expect(voicings.rightHand.flat().length).toBeGreaterThanOrEqual(1);
	});

	it('Cmaj7 inversions produce correct voicings for C3', () => {
		const root = NoteToMidi['C3'];
		// root position
		const r0 = chords(root as any, 'maj7', 0 as any);
		const names0 = [r0.root, r0.third, r0.fifth, r0.seventh]
			.filter(Boolean)
			.map((n) => (MidiToNote as any)[n as number]);
		expect(names0).toEqual(['C3', 'E3', 'G3', 'B3']);

		// 1st inversion
		const r1 = chords(root as any, 'maj7', 1 as any);
		const names1 = [r1.root, r1.third, r1.fifth, r1.seventh]
			.filter(Boolean)
			.map((n) => (MidiToNote as any)[n as number]);
		expect(names1).toEqual(['E3', 'G3', 'B3', 'C4']);

		// 2nd inversion
		const r2 = chords(root as any, 'maj7', 2 as any);
		const names2 = [r2.root, r2.third, r2.fifth, r2.seventh]
			.filter(Boolean)
			.map((n) => (MidiToNote as any)[n as number]);
		expect(names2).toEqual(['G3', 'B3', 'C4', 'E4']);

		// 3rd inversion
		const r3 = chords(root as any, 'maj7', 3 as any);
		const names3 = [r3.root, r3.third, r3.fifth, r3.seventh]
			.filter(Boolean)
			.map((n) => (MidiToNote as any)[n as number]);
		expect(names3).toEqual(['B3', 'C4', 'E4', 'G4']);
	});

	it('C major triad inversions produce correct voicings for C3 and invalid 3rd inversion throws', () => {
		const root = NoteToMidi['C3'];
		const t0 = chords(root as any, 'major', 0 as any);
		const t0names = [t0.root, t0.third, t0.fifth].map((n) => (MidiToNote as any)[n as number]);
		expect(t0names).toEqual(['C3', 'E3', 'G3']);

		const t1 = chords(root as any, 'major', 1 as any);
		const t1names = [t1.root, t1.third, t1.fifth].map((n) => (MidiToNote as any)[n as number]);
		expect(t1names).toEqual(['E3', 'G3', 'C4']);

		const t2 = chords(root as any, 'major', 2 as any);
		const t2names = [t2.root, t2.third, t2.fifth].map((n) => (MidiToNote as any)[n as number]);
		expect(t2names).toEqual(['G3', 'C4', 'E4']);

		// 3rd inversion is invalid for triads and should throw
		expect(() => chords(root as any, 'major', 3 as any)).toThrow();
	});

	it('new voicings produce correct left/right hand mappings for C4 maj7', () => {
		const root = NoteToMidi['C4'];
		const c = chords(root as any, 'maj7', 0 as any);

		// full-right -> all notes in right hand
		const fr = generateChordNotesDataFromChord(c as any, 'full-right');
		expect(fr.leftHand.flat().length).toBe(0);
		expect(fr.rightHand.flat()).toEqual(['C4', 'E4', 'G4', 'B4']);

		// full-left -> all notes in left hand
		const fl = generateChordNotesDataFromChord(c as any, 'full-left');
		expect(fl.rightHand.flat().length).toBe(0);
		expect(fl.leftHand.flat()).toEqual(['C3', 'E3', 'G3', 'B3']);

		// 1735 -> 1 & 7 in left (lowered), 3 & 5 in right
		const v1735 = generateChordNotesDataFromChord(c as any, '1735');
		expect(v1735.leftHand.flat()).toEqual(['C3', 'B3']);
		expect(v1735.rightHand.flat()).toEqual(['E4', 'G4']);

		// 1537 -> 1 & 5 in left (lowered), 3 & 7 in right
		const v1537 = generateChordNotesDataFromChord(c as any, '1537');
		expect(v1537.leftHand.flat()).toEqual(['C3', 'G3']);
		expect(v1537.rightHand.flat()).toEqual(['E4', 'B4']);
	});
});
