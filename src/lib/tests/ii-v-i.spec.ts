import { describe, it, expect } from 'vitest';
import { NoteToMidi, MidiToNote } from '../types/notes.constants';
import { chords } from '../MusicTheoryUtils';

// Simulate the ii-V-I progression logic similar to the TwoFiveOnes page
function getProgressionChords(rootNote: string) {
    const base = NoteToMidi[rootNote as keyof typeof NoteToMidi];
    const twoRoot = (base + 2) as number;
    const fiveRoot = (base + 7) as number;
    const oneRoot = base as number;

    const twoChord = chords(twoRoot as any, 'min7', 0 as any);
    const fiveChord = chords(fiveRoot as any, '7', 0 as any);
    const oneChord = chords(oneRoot as any, 'maj7', 0 as any);

    return [twoChord, fiveChord, oneChord];
}

describe('II-V-I progression helper logic', () => {
    it('C II-V-I progression generates expected notes for each chord', () => {
        const progression = getProgressionChords('C4');
        const expectedNames = progression.map((ch) => [ch.root, ch.third, ch.fifth, ch.seventh].filter(Boolean).map(n => (MidiToNote as any)[n as number]));
        // Ensure we have three chords and each chord has at least two notes
        expect(expectedNames.length).toBe(3);
        expect(expectedNames[0].length).toBeGreaterThanOrEqual(3);
        expect(expectedNames[1].length).toBeGreaterThanOrEqual(3);
        expect(expectedNames[2].length).toBeGreaterThanOrEqual(3);
    });

    it('Simulate completion across the three chords in order', () => {
        const chordsList = getProgressionChords('C4');
        let currentIndex = 0;

        function isChordComplete(currentNotes: number[], expectedNotes: number[]) {
            const correctNotes = currentNotes.filter((n) => expectedNotes.includes(n));
            return correctNotes.length === expectedNotes.length;
        }

        // simulate playing each chord fully
        for (let i = 0; i < chordsList.length; i++) {
            const expected = [chordsList[i].root, chordsList[i].third, chordsList[i].fifth, chordsList[i].seventh].filter(Boolean) as number[];
            // simulate current notes being exactly expected
            const current = [...expected];
            const complete = isChordComplete(current, expected);
            if (complete && currentIndex < 2) {
                currentIndex++;
            }
        }

        // after simulating all chords, we should be back at last chord index or completed progression
        expect(currentIndex).toBeGreaterThanOrEqual(2);
    });
});
