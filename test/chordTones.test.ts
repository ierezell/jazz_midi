import { describe, expect, it } from 'vitest';
import {
	analyzeChordTone,
	createChordToneMapping,
	DEFAULT_CHORD_TONE_COLORS,
	getChordToneColor
} from '../src/lib/types/chordTones';
import type { MidiNote } from '../src/midi/midi';

describe('Chord Tone System', () => {
	const testChord = {
		root: 60 as MidiNote, // C4
		third: 64 as MidiNote, // E4
		fifth: 67 as MidiNote, // G4
		seventh: 71 as MidiNote // B4
	};

	it('should correctly identify chord tones', () => {
		expect(analyzeChordTone(60 as MidiNote, testChord)).toBe('root');
		expect(analyzeChordTone(64 as MidiNote, testChord)).toBe('third');
		expect(analyzeChordTone(67 as MidiNote, testChord)).toBe('fifth');
		expect(analyzeChordTone(71 as MidiNote, testChord)).toBe('seventh');
		expect(analyzeChordTone(62 as MidiNote, testChord)).toBe('none'); // D4 - not in chord
	});

	it('should work across different octaves', () => {
		expect(analyzeChordTone(72 as MidiNote, testChord)).toBe('root'); // C5
		expect(analyzeChordTone(76 as MidiNote, testChord)).toBe('third'); // E5
		expect(analyzeChordTone(48 as MidiNote, testChord)).toBe('root'); // C3
	});

	it('should return correct colors for chord tone roles', () => {
		expect(getChordToneColor('root')).toBe(DEFAULT_CHORD_TONE_COLORS.root);
		expect(getChordToneColor('third')).toBe(DEFAULT_CHORD_TONE_COLORS.third);
		expect(getChordToneColor('fifth')).toBe(DEFAULT_CHORD_TONE_COLORS.fifth);
		expect(getChordToneColor('seventh')).toBe(DEFAULT_CHORD_TONE_COLORS.seventh);
		expect(getChordToneColor('none')).toBe(DEFAULT_CHORD_TONE_COLORS.none);
	});

	it('should create correct chord tone mapping', () => {
		const mapping = createChordToneMapping(60 as MidiNote, 72 as MidiNote, testChord);

		expect(mapping.length).toBe(13); // 60 to 72 inclusive

		const rootNote = mapping.find((m) => m.noteNumber === 60);
		expect(rootNote?.role).toBe('root');
		expect(rootNote?.color).toBe(DEFAULT_CHORD_TONE_COLORS.root);

		const thirdNote = mapping.find((m) => m.noteNumber === 64);
		expect(thirdNote?.role).toBe('third');
		expect(thirdNote?.color).toBe(DEFAULT_CHORD_TONE_COLORS.third);

		const nonChordNote = mapping.find((m) => m.noteNumber === 62);
		expect(nonChordNote?.role).toBe('none');
		expect(nonChordNote?.color).toBe(DEFAULT_CHORD_TONE_COLORS.none);
	});

	it('should handle chords without seventh', () => {
		const triadChord = {
			root: 60 as MidiNote,
			third: 64 as MidiNote,
			fifth: 67 as MidiNote,
			seventh: undefined
		};

		expect(analyzeChordTone(60 as MidiNote, triadChord)).toBe('root');
		expect(analyzeChordTone(64 as MidiNote, triadChord)).toBe('third');
		expect(analyzeChordTone(67 as MidiNote, triadChord)).toBe('fifth');
		expect(analyzeChordTone(71 as MidiNote, triadChord)).toBe('none'); // No seventh in this chord
	});
});
