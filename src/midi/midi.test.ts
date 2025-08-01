import { describe, expect, it } from 'vitest';
import {
    type MidiNote,
    AllChordTypes,
    AllMidiNotes,
    AllNotes,
    MidiToNote,
    NoteToMidi,
    chords,
    getMidiNote,
    getScale,
    majorScales,
    minorScales,
    noteFullNameToNote
} from '../midi/midi';

describe('MIDI Module', () => {
	describe('Type Guards and Constants', () => {
		it('should have correct MIDI note range', () => {
			expect(AllMidiNotes[0]).toBe(24);
			expect(AllMidiNotes[AllMidiNotes.length - 1]).toBe(128);
			expect(AllMidiNotes).toHaveLength(105); // 24 to 128 inclusive
		});

		it('should have correct note names', () => {
			expect(AllNotes).toContain('C');
			expect(AllNotes).toContain('C#');
			expect(AllNotes).toContain('Db');
			expect(AllNotes).toHaveLength(17); // All chromatic notes with enharmonics
		});

		it('should have all chord types', () => {
			expect(AllChordTypes).toContain('major');
			expect(AllChordTypes).toContain('minor');
			expect(AllChordTypes).toContain('maj7');
			expect(AllChordTypes).toContain('min7');
			expect(AllChordTypes).toContain('7');
			expect(AllChordTypes).toContain('diminished');
			expect(AllChordTypes).toContain('augmented');
			expect(AllChordTypes).toContain('sus2');
			expect(AllChordTypes).toContain('sus4');
		});
	});

	describe('Note Conversion Functions', () => {
		it('should convert MIDI numbers to note names correctly', () => {
			expect(MidiToNote[60]).toBe('C3');
			expect(MidiToNote[72]).toBe('C4'); // Middle C
			expect(MidiToNote[69]).toBe('A3'); // A440
		});

		it('should convert note names to MIDI numbers correctly', () => {
			expect(NoteToMidi['C3']).toBe(60);
			expect(NoteToMidi['C4']).toBe(72);
			expect(NoteToMidi['A3']).toBe(69);
		});

		it('should handle enharmonic equivalents', () => {
			expect(NoteToMidi['C#4']).toBe(NoteToMidi['Db4']);
			expect(NoteToMidi['F#4']).toBe(NoteToMidi['Gb4']);
		});

		it('should extract note from full note name', () => {
			expect(noteFullNameToNote('C4')).toBe('C');
			expect(noteFullNameToNote('C#4')).toBe('C#');
			expect(noteFullNameToNote('Db4')).toBe('Db');
		});
	});

	describe('Scale Generation', () => {
		it('should generate major scale correctly', () => {
			const cMajor = getScale(72 as MidiNote, [2, 2, 1, 2, 2, 2, 1]);
			// The scale function generates multiple octaves, so let's just check the first octave
			expect(cMajor.slice(0, 8)).toEqual(['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']);
		});

		it('should generate minor scale correctly', () => {
			const aMinor = getScale(69 as MidiNote, [2, 1, 2, 2, 1, 2, 2]);
			// Check first octave
			expect(aMinor.slice(0, 8)).toEqual(['A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4']);
		});

		it('should throw error for out of range MIDI notes', () => {
			expect(() => getScale(23 as MidiNote, [2, 2, 1, 2, 2, 2, 1])).toThrow();
			expect(() => getScale(129 as MidiNote, [2, 2, 1, 2, 2, 2, 1])).toThrow();
		});

		it('should have precomputed major scales', () => {
			expect(majorScales['C']).toBeDefined();
			expect(majorScales['C'][0]).toBe('C0');
			expect(majorScales['C'][1]).toBe('D0');
		});

		it('should have precomputed minor scales', () => {
			expect(minorScales['A']).toBeDefined();
			expect(minorScales['A'][0]).toBe('A0');
			expect(minorScales['A'][1]).toBe('B0');
		});
	});

	describe('Chord Generation', () => {
		it('should generate major chord correctly', () => {
			const cMajor = chords(72 as MidiNote, 'major');
			expect(cMajor.root).toBe(72);
			expect(cMajor.third).toBe(76); // E
			expect(cMajor.fifth).toBe(79); // G
			expect(cMajor.chordType).toBe('major');
			expect(cMajor.inversion).toBe(0);
		});

		it('should generate minor chord correctly', () => {
			const cMinor = chords(72 as MidiNote, 'minor');
			expect(cMinor.root).toBe(72);
			expect(cMinor.third).toBe(75); // Eb
			expect(cMinor.fifth).toBe(79); // G
			expect(cMinor.chordType).toBe('minor');
		});

		it('should generate seventh chords correctly', () => {
			const cMaj7 = chords(72 as MidiNote, 'maj7');
			expect(cMaj7.root).toBe(72);
			expect(cMaj7.third).toBe(76);
			expect(cMaj7.fifth).toBe(79);
			expect(cMaj7.seventh).toBe(83); // B
			expect(cMaj7.chordType).toBe('maj7');
		});

		it('should generate diminished chord correctly', () => {
			const cDim = chords(72 as MidiNote, 'diminished');
			expect(cDim.root).toBe(72);
			expect(cDim.third).toBe(75); // Eb
			expect(cDim.fifth).toBe(78); // Gb
			expect(cDim.seventh).toBe(81); // A (diminished 7th)
		});

		it('should handle chord inversions', () => {
			const cMajor1st = chords(72 as MidiNote, 'major', 1);
			expect(cMajor1st.inversion).toBe(1);
			expect(cMajor1st.root).toBe(76); // E becomes root
		});

		it('should handle sus chords', () => {
			const cSus2 = chords(72 as MidiNote, 'sus2');
			expect(cSus2.third).toBe(74); // D (2nd)
			
			const cSus4 = chords(72 as MidiNote, 'sus4');
			expect(cSus4.third).toBe(77); // F (4th)
		});
	});

	describe('MIDI Message Parsing', () => {
		it('should parse note on message correctly', () => {
			const mockEvent = {
				data: new Uint8Array([0x90, 60, 100]), // Note on, C4, velocity 100
				timeStamp: Date.now()
			} as MIDIMessageEvent;

			const noteEvent = getMidiNote(mockEvent);
			expect(noteEvent.noteNumber).toBe(60);
			expect(noteEvent.type).toBe('on');
			expect(noteEvent.noteFullName).toBe('C3');
			expect(noteEvent.noteName).toBe('C');
			expect(noteEvent.velocity).toBe(100);
		});

		it('should parse note off message correctly', () => {
			const mockEvent = {
				data: new Uint8Array([0x80, 60, 0]), // Note off, C4
				timeStamp: Date.now()
			} as MIDIMessageEvent;

			const noteEvent = getMidiNote(mockEvent);
			expect(noteEvent.noteNumber).toBe(60);
			expect(noteEvent.type).toBe('off');
			expect(noteEvent.velocity).toBe(0);
		});

		it('should handle note on with zero velocity as note off', () => {
			const mockEvent = {
				data: new Uint8Array([0x90, 60, 0]), // Note on with velocity 0
				timeStamp: Date.now()
			} as MIDIMessageEvent;

			const noteEvent = getMidiNote(mockEvent);
			expect(noteEvent.type).toBe('off');
		});

		it('should handle different MIDI channels', () => {
			const mockEvent = {
				data: new Uint8Array([0x91, 60, 100]), // Note on, channel 1
				timeStamp: Date.now()
			} as MIDIMessageEvent;

			const noteEvent = getMidiNote(mockEvent);
			expect(noteEvent.type).toBe('on');
			expect(noteEvent.noteNumber).toBe(60);
		});
	});

	describe('Musical Theory Validation', () => {
		it('should maintain consistent note relationships', () => {
			// Test that chromatic intervals work correctly
			const c4 = 72;
			const cSharp4 = c4 + 1;
			const d4 = c4 + 2;
			
			expect(MidiToNote[cSharp4 as MidiNote]).toBe('C#4');
			expect(MidiToNote[d4 as MidiNote]).toBe('D4');
		});

		it('should validate chord intervals', () => {
			const cMajor = chords(72 as MidiNote, 'major');
			// Major chord intervals: Root, Major 3rd (4 semitones), Perfect 5th (7 semitones)
			expect(cMajor.third - cMajor.root).toBe(4);
			expect(cMajor.fifth - cMajor.root).toBe(7);
		});

		it('should validate scale intervals', () => {
			const cMajorScale = getScale(72 as MidiNote, [2, 2, 1, 2, 2, 2, 1]);
			const intervals = [];
			for (let i = 1; i < cMajorScale.length; i++) {
				const prevNote = NoteToMidi[cMajorScale[i - 1]];
				const currNote = NoteToMidi[cMajorScale[i]];
				intervals.push(currNote - prevNote);
			}
			expect(intervals.slice(0, 7)).toEqual([2, 2, 1, 2, 2, 2, 1]);
		});
	});
});
