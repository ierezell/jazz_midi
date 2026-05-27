import { describe, it, expect } from 'vitest';
import {
    generateMusicXML,
    scaleToNotes,
    chordToNotes,
    type MusicXMLNote,
    type MusicXMLOptions
} from '../../src/lib/data/MusicXMLGenerator';
import type { MidiNote } from '../../src/lib/types/types';

// ─── helpers ────────────────────────────────────────────────────────────────

/** Count <pitch> elements — one per non-rest note. */
function countPitches(xml: string) {
    return (xml.match(/<pitch>/g) ?? []).length;
}

/** Count <note> opening tags (includes rest-notes). */
function countNotes(xml: string) {
    return (xml.match(/<note[ >]/g) ?? []).length;
}

/** Count <chord/> self-closing tags (stacked notes on same beat). */
function countChords(xml: string) {
    return (xml.match(/<chord\/>/g) ?? []).length;
}

/** Extract <staves>N</staves> value. */
function stavesValue(xml: string): number {
    const m = xml.match(/<staves>(\d+)<\/staves>/);
    return m ? parseInt(m[1]) : -1;
}

/** Collect all <sign> values (clef signs). */
function clefSigns(xml: string): string[] {
    return Array.from(xml.matchAll(/<sign>([A-Z]+)<\/sign>/g), (m) => m[1]);
}

/** True if measure N is declared. */
function hasMeasure(xml: string, n: number) {
    return xml.includes(`<measure number="${n}">`);
}

/** Extract all <fifths>N</fifths>. */
function fifthsValue(xml: string): number {
    const m = xml.match(/<fifths>(-?\d+)<\/fifths>/);
    return m ? parseInt(m[1]) : 0;
}

/** Build N notes in single treble staff (sequential beats, auto-wrapped to measures). */
function makeNotes(count: number, startMidi: number = 60): MusicXMLNote[] {
    const notes: MusicXMLNote[] = [];
    for (let i = 0; i < count; i++) {
        notes.push({
            pitch: ((startMidi + (i % 12)) as MidiNote),
            duration: 4,
            measure: Math.floor(i / 4) + 1,
            beat: (i % 4) + 1,
            voice: 1,
            staff: 1
        });
    }
    return notes;
}

// ─── basic structure ────────────────────────────────────────────────────────

describe('generateMusicXML — document structure', () => {
    it('produces valid XML declaration and score-partwise root', () => {
        const xml = generateMusicXML(makeNotes(1));
        expect(xml).toMatch(/^<\?xml version="1\.0"/);
        expect(xml).toContain('<score-partwise');
        expect(xml).toContain('</score-partwise>');
    });

    it('uses Exercise as fallback when title is empty string', () => {
        // The generator falls back to 'Exercise' when title is '' (falsy)
        const xml = generateMusicXML(makeNotes(1), { title: '' });
        expect(xml).toContain('<work-title>Exercise</work-title>');
    });

    it('includes custom title', () => {
        const xml = generateMusicXML(makeNotes(1), { title: 'My Exercise' });
        expect(xml).toContain('<work-title>My Exercise</work-title>');
    });

    it('escapes XML special chars in title', () => {
        const xml = generateMusicXML(makeNotes(1), { title: 'A & B < C > D' });
        expect(xml).toContain('A &amp; B &lt; C &gt; D');
    });

    it('has a single <part id="P1"> element', () => {
        const xml = generateMusicXML(makeNotes(4));
        const parts = xml.match(/<part id="P1">/g) ?? [];
        expect(parts).toHaveLength(1);
    });
});

// ─── note counts ─────────────────────────────────────────────────────────────

describe('generateMusicXML — note counts', () => {
    it('4 notes → 4 pitches', () => {
        expect(countPitches(generateMusicXML(makeNotes(4)))).toBe(4);
    });

    it('6 notes → 6 pitches', () => {
        expect(countPitches(generateMusicXML(makeNotes(6)))).toBe(6);
    });

    it('15 notes → 15 pitches', () => {
        expect(countPitches(generateMusicXML(makeNotes(15)))).toBe(15);
    });

    it('23 notes → 23 pitches', () => {
        expect(countPitches(generateMusicXML(makeNotes(23)))).toBe(23);
    });

    it('1 note → 1 pitch', () => {
        expect(countPitches(generateMusicXML(makeNotes(1)))).toBe(1);
    });

    it('empty notes → minimal XML with no pitches', () => {
        const xml = generateMusicXML([]);
        expect(countPitches(xml)).toBe(0);
    });
});

// ─── measure wrapping ────────────────────────────────────────────────────────

describe('generateMusicXML — measures', () => {
    it('4 notes → only measure 1', () => {
        const xml = generateMusicXML(makeNotes(4));
        expect(hasMeasure(xml, 1)).toBe(true);
        expect(hasMeasure(xml, 2)).toBe(false);
    });

    it('5 notes → measures 1 and 2', () => {
        const xml = generateMusicXML(makeNotes(5));
        expect(hasMeasure(xml, 1)).toBe(true);
        expect(hasMeasure(xml, 2)).toBe(true);
    });

    it('12 notes → measures 1–3', () => {
        const xml = generateMusicXML(makeNotes(12));
        expect(hasMeasure(xml, 1)).toBe(true);
        expect(hasMeasure(xml, 2)).toBe(true);
        expect(hasMeasure(xml, 3)).toBe(true);
        expect(hasMeasure(xml, 4)).toBe(false);
    });

    it('23 notes → measures 1–6', () => {
        const xml = generateMusicXML(makeNotes(23));
        for (let m = 1; m <= 6; m++) expect(hasMeasure(xml, m)).toBe(true);
    });

    it('attributes only appear in measure 1', () => {
        const xml = generateMusicXML(makeNotes(8));
        const firstMeasureEnd = xml.indexOf('</measure>');
        const firstMeasure = xml.slice(0, firstMeasureEnd);
        expect(firstMeasure).toContain('<attributes>');
        // second measure should not restate attributes
        const rest = xml.slice(firstMeasureEnd + 9);
        expect(rest).not.toContain('<attributes>');
    });
});

// ─── single staff (treble) ───────────────────────────────────────────────────

describe('generateMusicXML — single treble staff', () => {
    const opts: MusicXMLOptions = { staves: 1, clef: 'treble' };

    it('staves=1', () => {
        expect(stavesValue(generateMusicXML(makeNotes(4), opts))).toBe(1);
    });

    it('clef sign is G', () => {
        const signs = clefSigns(generateMusicXML(makeNotes(4), opts));
        expect(signs).toEqual(['G']);
    });

    it('no bass clef F sign present', () => {
        const xml = generateMusicXML(makeNotes(4), opts);
        expect(clefSigns(xml)).not.toContain('F');
    });

    it('4 notes, single staff → 4 pitches', () => {
        expect(countPitches(generateMusicXML(makeNotes(4), opts))).toBe(4);
    });

    it('15 notes, single staff → 15 pitches', () => {
        expect(countPitches(generateMusicXML(makeNotes(15), opts))).toBe(15);
    });
});

// ─── single staff (bass) ────────────────────────────────────────────────────

describe('generateMusicXML — single bass staff', () => {
    const opts: MusicXMLOptions = { staves: 1, clef: 'bass' };

    it('staves=1', () => {
        expect(stavesValue(generateMusicXML(makeNotes(4, 36), opts))).toBe(1);
    });

    it('clef sign is F', () => {
        const signs = clefSigns(generateMusicXML(makeNotes(4, 36), opts));
        expect(signs).toEqual(['F']);
    });

    it('no treble clef G sign present', () => {
        const xml = generateMusicXML(makeNotes(4, 36), opts);
        expect(clefSigns(xml)).not.toContain('G');
    });

    it('6 bass notes → 6 pitches', () => {
        expect(countPitches(generateMusicXML(makeNotes(6, 36), opts))).toBe(6);
    });
});

// ─── grand staff (2 staves) ──────────────────────────────────────────────────

describe('generateMusicXML — grand staff (2 staves)', () => {
    /** Build notes across both staves: even indices on staff 1, odd on staff 2. */
    function makeGrandNotes(count: number): MusicXMLNote[] {
        return Array.from({ length: count }, (_, i) => ({
            pitch: (60 + (i % 7)) as MidiNote,
            duration: 4,
            measure: Math.floor(i / 4) + 1,
            beat: (i % 4) + 1,
            voice: i % 2 === 0 ? 1 : 2,
            staff: i % 2 === 0 ? 1 : 2
        }));
    }

    const opts: MusicXMLOptions = { staves: 2 };

    it('staves=2', () => {
        expect(stavesValue(generateMusicXML(makeGrandNotes(8), opts))).toBe(2);
    });

    it('both G and F clef signs present', () => {
        const signs = clefSigns(generateMusicXML(makeGrandNotes(8), opts));
        expect(signs).toContain('G');
        expect(signs).toContain('F');
    });

    it('4 grand notes → 4 pitches', () => {
        expect(countPitches(generateMusicXML(makeGrandNotes(4), opts))).toBe(4);
    });

    it('23 grand notes → 23 pitches', () => {
        expect(countPitches(generateMusicXML(makeGrandNotes(23), opts))).toBe(23);
    });

    it('default opts produce grand staff', () => {
        // Default staves=2
        const xml = generateMusicXML(makeGrandNotes(4));
        expect(stavesValue(xml)).toBe(2);
    });
});

// ─── chord stacking ──────────────────────────────────────────────────────────

describe('generateMusicXML — chord stacking', () => {
    /** Two notes at beat 1 of measure 1, same voice → second gets <chord/>. */
    function makeChord(pitches: number[]): MusicXMLNote[] {
        return pitches.map((p, i) => ({
            pitch: p as MidiNote,
            duration: 4,
            measure: 1,
            beat: 1,
            voice: 1,
            staff: 1
        }));
    }

    it('chord of 3 notes → 2 <chord/> tags', () => {
        const xml = generateMusicXML(makeChord([60, 64, 67]));
        expect(countChords(xml)).toBe(2);
    });

    it('chord of 4 notes → 3 <chord/> tags', () => {
        const xml = generateMusicXML(makeChord([60, 64, 67, 71]));
        expect(countChords(xml)).toBe(3);
    });

    it('chord of 4 notes → 4 pitches', () => {
        const xml = generateMusicXML(makeChord([60, 64, 67, 71]));
        expect(countPitches(xml)).toBe(4);
    });

    it('two separate beats → no <chord/> tags', () => {
        const xml = generateMusicXML([
            { pitch: 60 as MidiNote, duration: 4, measure: 1, beat: 1, voice: 1, staff: 1 },
            { pitch: 64 as MidiNote, duration: 4, measure: 1, beat: 2, voice: 1, staff: 1 }
        ]);
        expect(countChords(xml)).toBe(0);
    });
});

// ─── key signatures ──────────────────────────────────────────────────────────

describe('generateMusicXML — key signatures', () => {
    const cases: Array<[string, number]> = [
        ['C', 0],
        ['G', 1],
        ['D', 2],
        ['F', -1],
        ['Bb', -2],
        ['Eb', -3],
        ['Ab', -4],
        ['B', 5],
        ['F#', 6]
    ];

    it.each(cases)('key %s → fifths=%d', (key, fifths) => {
        const xml = generateMusicXML(makeNotes(1), { key: key as any });
        expect(fifthsValue(xml)).toBe(fifths);
    });
});

// ─── duration types ──────────────────────────────────────────────────────────

describe('generateMusicXML — duration types', () => {
    function makeNote(duration: number): MusicXMLNote[] {
        return [{ pitch: 60 as MidiNote, duration, measure: 1, beat: 1, voice: 1, staff: 1 }];
    }

    const divs = 4; // 4 divisions per quarter note

    it('duration=4 (quarter) → type quarter', () => {
        expect(generateMusicXML(makeNote(4), { divisions: divs })).toContain('<type>quarter</type>');
    });

    it('duration=8 (half) → type half', () => {
        expect(generateMusicXML(makeNote(8), { divisions: divs })).toContain('<type>half</type>');
    });

    it('duration=16 (whole) → type whole', () => {
        expect(generateMusicXML(makeNote(16), { divisions: divs })).toContain('<type>whole</type>');
    });

    it('duration=2 (eighth) → type eighth', () => {
        expect(generateMusicXML(makeNote(2), { divisions: divs })).toContain('<type>eighth</type>');
    });

    it('duration=1 (16th) → type 16th', () => {
        expect(generateMusicXML(makeNote(1), { divisions: divs })).toContain('<type>16th</type>');
    });
});

// ─── pitch conversion ────────────────────────────────────────────────────────

describe('generateMusicXML — pitch encoding', () => {
    function pitchOf(midi: number, key?: string) {
        const xml = generateMusicXML(
            [{ pitch: midi as MidiNote, duration: 4, measure: 1, beat: 1, voice: 1, staff: 1 }],
            { staves: 1, clef: 'treble', key: (key as any) ?? 'C' }
        );
        // Extract first <pitch> block
        const m = xml.match(/<pitch>([\s\S]*?)<\/pitch>/);
        return m ? m[0] : '';
    }

    it('MIDI 60 (C4) → step C, alter 0, octave 4', () => {
        const p = pitchOf(60);
        expect(p).toContain('<step>C</step>');
        expect(p).toContain('<octave>4</octave>');
        expect(p).not.toContain('<alter>');
    });

    it('MIDI 69 (A4) → step A, octave 4', () => {
        const p = pitchOf(69);
        expect(p).toContain('<step>A</step>');
        expect(p).toContain('<octave>4</octave>');
    });

    it('MIDI 61 (C#4) → step C, alter 1, octave 4', () => {
        const p = pitchOf(61);
        expect(p).toContain('<step>C</step>');
        expect(p).toContain('<alter>1</alter>');
        expect(p).toContain('<octave>4</octave>');
    });

    it('MIDI 72 (C5) → octave 5', () => {
        const p = pitchOf(72);
        expect(p).toContain('<octave>5</octave>');
    });

    it('MIDI 36 (C2) → step C, octave 2', () => {
        const p = pitchOf(36);
        expect(p).toContain('<step>C</step>');
        expect(p).toContain('<octave>2</octave>');
    });

    it('MIDI 21 (A0) → step A, octave 0', () => {
        const p = pitchOf(21);
        expect(p).toContain('<step>A</step>');
        expect(p).toContain('<octave>0</octave>');
    });

    it('MIDI 108 (C8) → step C, octave 8', () => {
        const p = pitchOf(108);
        expect(p).toContain('<step>C</step>');
        expect(p).toContain('<octave>8</octave>');
    });
});

// ─── scaleToNotes helper ─────────────────────────────────────────────────────

describe('scaleToNotes', () => {
    it('C major scale (octave 4) → 8 notes', () => {
        const notes = scaleToNotes('C', 4, 'major');
        expect(notes).toHaveLength(8);
    });

    it('C major starts at MIDI 60 (C4)', () => {
        const notes = scaleToNotes('C', 4, 'major');
        expect(notes[0].pitch).toBe(60);
    });

    it('C major ends at MIDI 72 (C5 = octave higher)', () => {
        const notes = scaleToNotes('C', 4, 'major');
        expect(notes[7].pitch).toBe(72);
    });

    it('C minor scale → 8 notes with flattened 3rd (Eb)', () => {
        const notes = scaleToNotes('C', 4, 'minor');
        expect(notes).toHaveLength(8);
        // Eb4 = 63
        expect(notes[2].pitch).toBe(63);
    });

    it('C dorian → third is D (minor third = 63)', () => {
        const notes = scaleToNotes('C', 4, 'dorian');
        expect(notes[2].pitch).toBe(63); // Eb = 63
    });

    it('G major (octave 4) starts at MIDI 67', () => {
        const notes = scaleToNotes('G', 4, 'major');
        expect(notes[0].pitch).toBe(67);
    });

    it('unknown root returns empty array', () => {
        const notes = scaleToNotes('X' as any, 4, 'major');
        expect(notes).toHaveLength(0);
    });

    it('generated notes produce valid XML with 8 pitches', () => {
        const notes = scaleToNotes('C', 4, 'major');
        const xml = generateMusicXML(notes, { staves: 1, clef: 'treble' });
        expect(countPitches(xml)).toBe(8);
    });
});

// ─── chordToNotes helper ─────────────────────────────────────────────────────

describe('chordToNotes', () => {
    it('Cmaj7 at octave 4 → 4 notes', () => {
        expect(chordToNotes('C', 'maj7', 4)).toHaveLength(4);
    });

    it('Cmaj7 root is MIDI 60', () => {
        expect(chordToNotes('C', 'maj7', 4)[0].pitch).toBe(60);
    });

    it('Cmaj7 intervals: root 0, third +4, fifth +7, seventh +11', () => {
        const notes = chordToNotes('C', 'maj7', 4);
        const pitches = notes.map((n) => n.pitch);
        expect(pitches).toEqual([60, 64, 67, 71]);
    });

    it('Cmin7 intervals: root 0, minor-third +3, fifth +7, minor-seventh +10', () => {
        const notes = chordToNotes('C', 'min7', 4);
        const pitches = notes.map((n) => n.pitch);
        expect(pitches).toEqual([60, 63, 67, 70]);
    });

    it('C7 (dominant) intervals: +0 +4 +7 +10', () => {
        const notes = chordToNotes('C', '7', 4);
        const pitches = notes.map((n) => n.pitch);
        expect(pitches).toEqual([60, 64, 67, 70]);
    });

    it('Cmin7b5 intervals: +0 +3 +6 +10', () => {
        const notes = chordToNotes('C', 'min7b5', 4);
        const pitches = notes.map((n) => n.pitch);
        expect(pitches).toEqual([60, 63, 66, 70]);
    });

    it('Gmaj7 at octave 4 → root is MIDI 67', () => {
        expect(chordToNotes('G', 'maj7', 4)[0].pitch).toBe(67);
    });

    it('unknown root returns empty array', () => {
        expect(chordToNotes('X' as any, 'maj7', 4)).toHaveLength(0);
    });

    it('chord notes produce valid XML', () => {
        const notes = chordToNotes('C', 'maj7', 4);
        const xml = generateMusicXML(notes, { staves: 2 });
        expect(countPitches(xml)).toBe(4);
    });
});

// ─── tempo marking ───────────────────────────────────────────────────────────

describe('generateMusicXML — tempo', () => {
    it('tempo 120 appears in first measure direction', () => {
        const xml = generateMusicXML(makeNotes(4), { tempo: 120 });
        expect(xml).toContain('<per-minute>120</per-minute>');
        expect(xml).toContain('tempo="120"');
    });

    it('no tempo direction when tempo omitted', () => {
        const xml = generateMusicXML(makeNotes(4), { tempo: undefined });
        expect(xml).not.toContain('<per-minute>');
    });
});

// ─── rest notes ──────────────────────────────────────────────────────────────

describe('generateMusicXML — rest notes', () => {
    it('rest note produces <rest /> element without <pitch>', () => {
        const xml = generateMusicXML([
            { pitch: 60 as MidiNote, duration: 4, measure: 1, beat: 1, voice: 1, staff: 1, type: 'rest' }
        ]);
        expect(xml).toContain('<rest />');
        expect(countPitches(xml)).toBe(0);
    });
});

// ─── real exercise scenarios ─────────────────────────────────────────────────

describe('generateMusicXML — exercise scenarios', () => {
    it('8-note scale (C major) → single treble staff, 8 pitches, all in measure 1', () => {
        // scaleToNotes assigns all notes to measure:1 by design (arpeggio/chord display)
        const notes = scaleToNotes('C', 4, 'major');
        const xml = generateMusicXML(notes, { staves: 1, clef: 'treble', key: 'C' });
        expect(countPitches(xml)).toBe(8);
        expect(stavesValue(xml)).toBe(1);
        expect(clefSigns(xml)).toEqual(['G']);
        expect(hasMeasure(xml, 1)).toBe(true);
    });

    it('grand-staff chord (Cmaj7, both staves) → staves=2, 4 pitches', () => {
        const notes = chordToNotes('C', 'maj7', 4);
        const xml = generateMusicXML(notes, { staves: 2, key: 'C' });
        expect(stavesValue(xml)).toBe(2);
        expect(clefSigns(xml)).toContain('G');
        expect(clefSigns(xml)).toContain('F');
        expect(countPitches(xml)).toBe(4);
    });

    it('partition-style: 12 sequential treble notes across 3 measures', () => {
        const xml = generateMusicXML(makeNotes(12), { staves: 1, clef: 'treble' });
        expect(countPitches(xml)).toBe(12);
        expect(hasMeasure(xml, 3)).toBe(true);
        expect(hasMeasure(xml, 4)).toBe(false);
    });

    it('lick: 6 right-hand notes → treble staff, 6 pitches', () => {
        const notes = makeNotes(6).map((n) => ({ ...n, staff: 1, voice: 1 }));
        const xml = generateMusicXML(notes, { staves: 1, clef: 'treble' });
        expect(countPitches(xml)).toBe(6);
        expect(stavesValue(xml)).toBe(1);
    });

    it('bass-only pattern: 6 left-hand notes → bass staff, 6 pitches', () => {
        const notes = makeNotes(6, 36).map((n) => ({ ...n, staff: 1, voice: 1 }));
        const xml = generateMusicXML(notes, { staves: 1, clef: 'bass' });
        expect(countPitches(xml)).toBe(6);
        expect(clefSigns(xml)).toEqual(['F']);
    });

    it('intervals: 2-note chord (C4 + E4) → 2 pitches, 1 chord tag', () => {
        const notes: MusicXMLNote[] = [
            { pitch: 60 as MidiNote, duration: 4, measure: 1, beat: 1, voice: 1, staff: 1 },
            { pitch: 64 as MidiNote, duration: 4, measure: 1, beat: 1, voice: 1, staff: 1 }
        ];
        const xml = generateMusicXML(notes, { staves: 1, clef: 'treble' });
        expect(countPitches(xml)).toBe(2);
        expect(countChords(xml)).toBe(1);
    });

    it('hand independence: grand staff with right scale + left shell', () => {
        // Right hand: C major scale C4-C5 (staff 1)
        const rhNotes = scaleToNotes('C', 4, 'major').map((n, i) => ({
            ...n,
            staff: 1 as 1 | 2,
            voice: 1,
            measure: Math.floor(i / 4) + 1,
            beat: (i % 4) + 1
        }));
        // Left hand: just C2 and Bb3 as a chord (staff 2)
        const lhNotes: MusicXMLNote[] = [
            { pitch: 36 as MidiNote, duration: 4, measure: 1, beat: 1, voice: 2, staff: 2 },
            { pitch: 58 as MidiNote, duration: 4, measure: 1, beat: 1, voice: 2, staff: 2 }
        ];
        const xml = generateMusicXML([...rhNotes, ...lhNotes], { staves: 2, key: 'C' });
        expect(stavesValue(xml)).toBe(2);
        expect(countPitches(xml)).toBe(10); // 8 RH + 2 LH
    });
});
