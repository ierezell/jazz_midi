import { describe, it, expect } from 'vitest';
import { SCALE_INTERVALS, NoteToMidi, MidiToNote } from '../types/notes.constants';

describe('C Major scale generation', () => {
    it('C major (root C4) produces C4 D4 E4 F4 G4 A4 B4 C5', () => {
        const root = NoteToMidi['C4'];
        const mids = SCALE_INTERVALS.Maj.map((i) => (root + i));
        const names = mids.map((m) => (MidiToNote as any)[m]);
        expect(names).toEqual(['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']);
    });

    it('C major in lower octave (root C3) produces C3 D3 E3 F3 G3 A3 B3 C4', () => {
        const root = NoteToMidi['C3'];
        const mids = SCALE_INTERVALS.Maj.map((i) => (root + i));
        const names = mids.map((m) => (MidiToNote as any)[m]);
        expect(names).toEqual(['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4']);
    });
});
