import { describe, it, expect } from 'vitest';
import { chords, generateChordNotesDataFromChord } from '../MusicTheoryUtils';
import { NoteToMidi } from '../types/notes.constants';

describe('MusicTheoryUtils', () => {
    it('1735 voicing produces two hands and combined note count equals chord', () => {
        const rootMidi = 72; // C4 in this codebase
        const chord = chords(rootMidi, 'maj7', 0);
        const data = generateChordNotesDataFromChord(chord, '1735');
        // ensure both hands arrays exist
        expect(Array.isArray(data.leftHand)).toBeTruthy();
        expect(Array.isArray(data.rightHand)).toBeTruthy();

        // combined count equals number of chord notes (4 for maj7)
        const total = data.leftHand.flat().length + data.rightHand.flat().length;
        expect(total).toBe(4);
    });
});
