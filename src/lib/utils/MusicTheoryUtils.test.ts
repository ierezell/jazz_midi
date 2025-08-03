/**
 * Unit tests for Music Theory Utils - Testing available methods
 */

import { describe, expect, it } from 'vitest';
import { ChordUtils, MusicTheoryUtils } from './MusicTheoryUtils';

describe('MusicTheoryUtils', () => {
	describe('ChordUtils', () => {
		it('should get chord notes', () => {
			const notes = ChordUtils.getChordNotes('C', 'major');
			expect(notes).toHaveLength(3);
			expect(notes).toContain(72); // C4
			expect(notes).toContain(76); // E4
			expect(notes).toContain(79); // G4
		});

		it('should get chord symbol', () => {
			expect(ChordUtils.getChordSymbol('C', 'major')).toBe('C');
			expect(ChordUtils.getChordSymbol('C', 'minor')).toBe('Cm');
			expect(ChordUtils.getChordSymbol('C', 'maj7')).toBe('Cmaj7');
		});

		it('should get chord quality', () => {
			const quality = ChordUtils.getChordQuality('major');
			expect(quality).toBe('Major Triad');

			const minorQuality = ChordUtils.getChordQuality('minor');
			expect(minorQuality).toBe('Minor Triad');
		});

		it('should apply different voicings', () => {
			const closeVoicing = ChordUtils.getChordNotes('C', 'maj7', 0, 'close');
			const openVoicing = ChordUtils.getChordNotes('C', 'maj7', 0, 'open');
			const shellVoicing = ChordUtils.getChordNotes('C', 'maj7', 0, 'shell');

			expect(closeVoicing).not.toEqual(openVoicing);
			expect(shellVoicing.length).toBe(3); // Root, third, seventh (no fifth)
		});

		it('should handle different chord types', () => {
			const major = ChordUtils.getChordNotes('C', 'major');
			const minor = ChordUtils.getChordNotes('C', 'minor');
			const dom7 = ChordUtils.getChordNotes('C', '7');

			expect(major).not.toEqual(minor);
			expect(dom7.length).toBe(4); // Seventh chord has 4 notes
		});

		it('should handle chord inversions', () => {
			const root = ChordUtils.getChordNotes('C', 'major', 0);
			const first = ChordUtils.getChordNotes('C', 'major', 1);
			const second = ChordUtils.getChordNotes('C', 'major', 2);

			expect(root).not.toEqual(first);
			expect(first).not.toEqual(second);
		});
	});

	describe('ValidationUtils (Basic)', () => {
		it('should validate basic inputs', () => {
			// Test that the utility classes exist and can be instantiated
			expect(typeof ChordUtils.getChordNotes).toBe('function');
			expect(typeof ChordUtils.getChordSymbol).toBe('function');
		});
	});

	describe('Integration Tests', () => {
		it('should work with different note ranges', () => {
			const lowC = ChordUtils.getChordNotes('C', 'major', 0, 'close', 2);
			const highC = ChordUtils.getChordNotes('C', 'major', 0, 'close', 6);

			expect(lowC[0]).toBeLessThan(highC[0]); // Lower octave
		});

		it('should handle jazz chord progressions', () => {
			// Test a ii-V-I progression
			const dm7 = ChordUtils.getChordNotes('D', 'min7');
			const g7 = ChordUtils.getChordNotes('G', '7');
			const cmaj7 = ChordUtils.getChordNotes('C', 'maj7');

			expect(dm7.length).toBe(4);
			expect(g7.length).toBe(4);
			expect(cmaj7.length).toBe(4);
		});
	});

	describe('Consolidated API', () => {
		it('should provide access to chord utilities', () => {
			expect(MusicTheoryUtils.Chord).toBe(ChordUtils);
		});

		it('should maintain consistent API', () => {
			// Test that the consolidated API works the same as direct access
			const directChord = ChordUtils.getChordNotes('C', 'major');
			const apiChord = MusicTheoryUtils.Chord.getChordNotes('C', 'major');

			expect(directChord).toEqual(apiChord);
		});
	});
});
