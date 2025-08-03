import { describe, expect, it } from 'vitest';
import type { MidiNote } from '../../midi/midi';
import { ChordUtils, LayoutUtils, ProgressionUtils, ScaleUtils } from './musicalUtils';

describe('ChordUtils', () => {
	describe('generateChord', () => {
		it('should generate a basic major chord', () => {
			const chord = ChordUtils.generateChord('C', 'major');
			expect(chord.chordType).toBe('major');
			expect(chord.inversion).toBe(0);
		});

		it('should generate chord with inversion', () => {
			const chord = ChordUtils.generateChord('C', 'major', { inversion: 1 });
			expect(chord.inversion).toBe(1);
		});

		it('should generate chord in different octave', () => {
			const chord1 = ChordUtils.generateChord('C', 'major', { octave: 3 });
			const chord2 = ChordUtils.generateChord('C', 'major', { octave: 4 });
			expect(chord2.root).toBe(chord1.root + 12);
		});
	});

	describe('getChordSymbol', () => {
		it('should return correct symbols for different chord types', () => {
			expect(ChordUtils.getChordSymbol('C', 'major')).toBe('C');
			expect(ChordUtils.getChordSymbol('C', 'minor')).toBe('Cm');
			expect(ChordUtils.getChordSymbol('C', 'maj7')).toBe('Cmaj7');
			expect(ChordUtils.getChordSymbol('F', '7')).toBe('F7');
		});
	});

	describe('identifyChord', () => {
		it('should identify major chord', () => {
			const notes: MidiNote[] = [60, 64, 67]; // C, E, G
			const result = ChordUtils.identifyChord(notes);
			expect(result?.root).toBe('C');
			expect(result?.chordType).toBe('major');
		});

		it('should identify minor chord', () => {
			const notes: MidiNote[] = [60, 63, 67]; // C, Eb, G
			const result = ChordUtils.identifyChord(notes);
			expect(result?.root).toBe('C');
			expect(result?.chordType).toBe('minor');
		});

		it('should return null for insufficient notes', () => {
			const notes: MidiNote[] = [60, 64]; // Only two notes
			const result = ChordUtils.identifyChord(notes);
			expect(result).toBeNull();
		});
	});
});

describe('ScaleUtils', () => {
	describe('getScaleNotes', () => {
		it('should return C major scale notes', () => {
			const scale = ScaleUtils.getScaleNotes('C', 'major');
			expect(scale).toContain('C0');
			expect(scale).toContain('D0');
			expect(scale).toContain('E0');
			expect(scale).toContain('F0');
			expect(scale).toContain('G0');
			expect(scale).toContain('A0');
			expect(scale).toContain('B0');
		});

		it('should return A minor scale notes', () => {
			const scale = ScaleUtils.getScaleNotes('A', 'minor');
			expect(scale).toContain('A0');
			expect(scale).toContain('B0');
			expect(scale).toContain('C1');
		});
	});

	describe('getScaleDegrees', () => {
		it('should return major scale degrees', () => {
			const degrees = ScaleUtils.getScaleDegrees('major');
			expect(degrees).toEqual(['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']);
		});

		it('should return minor scale degrees', () => {
			const degrees = ScaleUtils.getScaleDegrees('minor');
			expect(degrees).toEqual(['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII']);
		});
	});

	describe('getScaleChords', () => {
		it('should return correct chord types for major scale', () => {
			const chords = ScaleUtils.getScaleChords('C', 'major');
			expect(chords).toEqual(['maj7', 'min7', 'min7', 'maj7', '7', 'min7', 'diminished']);
		});
	});
});

describe('ProgressionUtils', () => {
	describe('generateProgression', () => {
		it('should generate ii-V-I progression', () => {
			const progression = ProgressionUtils.generateProgression('C', 'ii-V-I');
			expect(progression).toHaveLength(3);
			expect(progression[0].degree).toBe('ii');
			expect(progression[1].degree).toBe('V');
			expect(progression[2].degree).toBe('I');
		});

		it('should have correct chord types for ii-V-I', () => {
			const progression = ProgressionUtils.generateProgression('C', 'ii-V-I');
			expect(progression[0].chordType).toBe('min7'); // ii
			expect(progression[1].chordType).toBe('7'); // V
			expect(progression[2].chordType).toBe('maj7'); // I
		});
	});
});

describe('LayoutUtils', () => {
	describe('calculateKeyboardRange', () => {
		it('should return default range for empty notes', () => {
			const range = LayoutUtils.calculateKeyboardRange([]);
			expect(range.middleC).toBe(60);
			expect(range.octaves).toBe(2);
		});

		it('should calculate appropriate range for given notes', () => {
			const notes: MidiNote[] = [48, 60, 72]; // C3, C4, C5
			const range = LayoutUtils.calculateKeyboardRange(notes);
			expect(range.octaves).toBeGreaterThanOrEqual(2);
			expect(range.middleC).toBeGreaterThanOrEqual(24);
		});

		it('should not exceed maximum octaves', () => {
			const notes: MidiNote[] = [24, 127]; // Extreme range
			const range = LayoutUtils.calculateKeyboardRange(notes);
			expect(range.octaves).toBeLessThanOrEqual(7);
		});
	});

	describe('splitHandsForDisplay', () => {
		it('should split notes at middle C by default', () => {
			const notes: MidiNote[] = [48, 60, 72]; // C3, C4, C5
			const split = LayoutUtils.splitHandsForDisplay(notes);
			expect(split.leftHand).toEqual([48]);
			expect(split.rightHand).toEqual([60, 72]);
		});

		it('should split notes at custom split point', () => {
			const notes: MidiNote[] = [48, 60, 72];
			const split = LayoutUtils.splitHandsForDisplay(notes, 65);
			expect(split.leftHand).toEqual([48, 60]);
			expect(split.rightHand).toEqual([72]);
		});
	});
});

describe('Integration Tests', () => {
	it('should create a complete chord exercise scenario', () => {
		// Generate a C major 7 chord
		const chord = ChordUtils.generateChord('C', 'maj7');
		const chordNotes = ChordUtils.getChordNotes(chord);

		// Calculate keyboard layout
		const layout = LayoutUtils.calculateKeyboardRange(chordNotes);

		// Verify we have a reasonable layout
		expect(layout.octaves).toBeGreaterThan(0);
		expect(layout.middleC).toBeGreaterThanOrEqual(24);

		// Verify chord symbol
		const symbol = ChordUtils.getChordSymbol('C', 'maj7');
		expect(symbol).toBe('Cmaj7');
	});

	it('should create a complete scale exercise scenario', () => {
		// Get C major scale
		const scale = ScaleUtils.getScaleNotes('C', 'major');

		// Verify we have 7 unique note names in the scale
		const uniqueNotes = Array.from(new Set(scale.map((note: any) => note.slice(0, -1))));
		expect(uniqueNotes).toHaveLength(7);

		// Get chord types for the scale
		const chordTypes = ScaleUtils.getScaleChords('C', 'major');
		expect(chordTypes).toHaveLength(7);
	});

	it('should create a complete progression scenario', () => {
		// Generate ii-V-I in C
		const progression = ProgressionUtils.generateProgression('C', 'ii-V-I');

		// Create chords for each step
		const chords = progression.map((step: any) =>
			ChordUtils.generateChord(step.root, step.chordType)
		);

		expect(chords).toHaveLength(3);
		expect(chords[0].chordType).toBe('min7'); // ii7
		expect(chords[1].chordType).toBe('7'); // V7
		expect(chords[2].chordType).toBe('maj7'); // Imaj7
	});
});
