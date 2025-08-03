/**
 * Enhanced Musical Utilities
 * Consolidates and improves music theory operations
 */

import {
	AllNotes,
	chords,
	majorScales,
	minorScales,
	NoteToMidi,
	type ChordType,
	type MidiNote,
	type Note,
	type NoteFullName
} from '../../midi/midi';

// ===== CHORD UTILITIES =====

export class ChordUtils {
	/**
	 * Get chord notes with voicing applied
	 */
	static getChordNotes(
		root: Note,
		type: ChordType,
		inversion: 0 | 1 | 2 | 3 = 0,
		voicing: 'close' | 'open' | 'drop2' | 'drop3' | 'shell' = 'close',
		octave: number = 4
	): MidiNote[] {
		const rootNote = (root + octave) as NoteFullName;
		const rootMidi = NoteToMidi[rootNote];
		const chord = chords(rootMidi, type, inversion);

		let notes = [chord.root, chord.third, chord.fifth, chord.seventh].filter(
			(note) => note !== undefined
		) as MidiNote[];

		return this.applyVoicing(notes, voicing);
	}

	/**
	 * Apply voicing transformations to chord notes
	 */
	private static applyVoicing(notes: MidiNote[], voicing: string): MidiNote[] {
		switch (voicing) {
			case 'close':
				return notes;

			case 'open':
				// Spread notes across larger intervals
				return notes.map((note, index) => (index > 1 ? ((note + 12) as MidiNote) : note));

			case 'drop2':
				if (notes.length >= 3) {
					const result = [...notes];
					result[notes.length - 2] = (result[notes.length - 2] - 12) as MidiNote;
					return result.sort((a, b) => a - b);
				}
				return notes;

			case 'drop3':
				if (notes.length >= 4) {
					const result = [...notes];
					result[notes.length - 3] = (result[notes.length - 3] - 12) as MidiNote;
					return result.sort((a, b) => a - b);
				}
				return notes;

			case 'shell':
				// Root, third, seventh (omit fifth)
				return notes.filter((_, index) => index !== 2);

			default:
				return notes;
		}
	}

	/**
	 * Get chord symbol notation
	 */
	static getChordSymbol(root: Note, type: ChordType): string {
		const symbols: Record<ChordType, string> = {
			major: '',
			minor: 'm',
			maj7: 'maj7',
			min7: 'm7',
			'7': '7',
			diminished: '°',
			augmented: '+',
			sus2: 'sus2',
			sus4: 'sus4'
		};

		return root + symbols[type];
	}

	/**
	 * Get chord quality description
	 */
	static getChordQuality(type: ChordType): string {
		const qualities: Record<ChordType, string> = {
			major: 'Major Triad',
			minor: 'Minor Triad',
			maj7: 'Major Seventh',
			min7: 'Minor Seventh',
			'7': 'Dominant Seventh',
			diminished: 'Diminished',
			augmented: 'Augmented',
			sus2: 'Suspended Second',
			sus4: 'Suspended Fourth'
		};

		return qualities[type];
	}

	/**
	 * Generate common jazz chord progressions
	 */
	static getJazzProgressions(): Record<string, ChordType[]> {
		return {
			'ii-V-I': ['min7', '7', 'maj7'] as ChordType[],
			'vi-ii-V-I': ['min7', 'min7', '7', 'maj7'] as ChordType[],
			'I-vi-ii-V': ['maj7', 'min7', 'min7', '7'] as ChordType[],
			'iii-vi-ii-V': ['min7', 'min7', 'min7', '7'] as ChordType[],
			'Giant Steps': ['maj7', '7', 'maj7', '7'] as ChordType[]
		};
	}
}

// ===== SCALE UTILITIES =====

export class ScaleUtils {
	/**
	 * Get scale notes for a given root and scale type
	 */
	static getScaleNotes(
		root: Note,
		type: 'major' | 'minor' = 'major',
		octave: number = 4,
		octaves: number = 1
	): MidiNote[] {
		const scales = type === 'major' ? majorScales : minorScales;
		const scale = scales[root];

		let result: MidiNote[] = [];

		for (let oct = 0; oct < octaves; oct++) {
			const scaleInOctave = scale
				.slice(0, 8) // One octave
				.map((noteName) => {
					const targetOctave = octave + oct;
					const fullName = (noteName.slice(0, -1) + targetOctave) as NoteFullName;
					return NoteToMidi[fullName];
				});

			result = result.concat(scaleInOctave);
		}

		return result;
	}

	/**
	 * Get scale degree names
	 */
	static getScaleDegreeNames(): string[] {
		return ['Root', '2nd', '3rd', '4th', '5th', '6th', '7th', 'Octave'];
	}

	/**
	 * Get mode names
	 */
	static getModeNames(): string[] {
		return [
			'Ionian (Major)',
			'Dorian',
			'Phrygian',
			'Lydian',
			'Mixolydian',
			'Aeolian (Minor)',
			'Locrian'
		];
	}

	/**
	 * Generate scale patterns
	 */
	static getScalePatterns(): Record<string, string> {
		return {
			ascending: 'Play notes from low to high',
			descending: 'Play notes from high to low',
			arpeggiated: 'Play chord tones (1, 3, 5, 7)',
			sequential: 'Play each note in sequence',
			random: 'Play notes in any order'
		};
	}
}

// ===== KEYBOARD UTILITIES =====

export class KeyboardUtils {
	/**
	 * Calculate optimal keyboard range for given notes
	 */
	static calculateOptimalRange(
		notes: MidiNote[],
		minOctaves: number = 2,
		maxOctaves: number = 7
	): { middleC: number; octaves: number } {
		if (notes.length === 0) {
			return { middleC: 60, octaves: minOctaves };
		}

		const minNote = Math.min(...notes);
		const maxNote = Math.max(...notes);

		// Find C notes that encompass the range
		const minC = Math.floor((minNote - 12) / 12) * 12 + 12;
		const maxC = Math.ceil((maxNote + 12) / 12) * 12;

		const totalRange = maxC - minC;
		const octaves = Math.max(minOctaves, Math.min(maxOctaves, Math.ceil(totalRange / 12)));

		// Center the range
		const middleC = minC + Math.floor((octaves * 12) / 2) - 6;

		return {
			middleC: Math.max(24, middleC),
			octaves
		};
	}

	/**
	 * Get keyboard layout configuration
	 */
	static getKeyboardLayouts(): Record<string, any> {
		return {
			piano: {
				whiteKeyWidth: 30,
				blackKeyWidth: 20,
				whiteKeyHeight: 120,
				blackKeyHeight: 80
			},
			compact: {
				whiteKeyWidth: 20,
				blackKeyWidth: 14,
				whiteKeyHeight: 80,
				blackKeyHeight: 55
			},
			large: {
				whiteKeyWidth: 40,
				blackKeyWidth: 26,
				whiteKeyHeight: 150,
				blackKeyHeight: 100
			}
		};
	}
}

// ===== VALIDATION UTILITIES =====

export class ValidationUtils {
	/**
	 * Validate MIDI note range
	 */
	static isValidMidiNote(note: number): note is MidiNote {
		return note >= 24 && note <= 128 && Number.isInteger(note);
	}

	/**
	 * Validate note name
	 */
	static isValidNote(note: string): note is Note {
		return AllNotes.includes(note as Note);
	}

	/**
	 * Validate chord type
	 */
	static isValidChordType(type: string): type is ChordType {
		const validTypes: ChordType[] = [
			'major',
			'minor',
			'maj7',
			'min7',
			'7',
			'diminished',
			'augmented',
			'sus2',
			'sus4'
		];
		return validTypes.includes(type as ChordType);
	}

	/**
	 * Check if arrays of MIDI notes are equal (order-independent)
	 */
	static arraysEqual(a: MidiNote[], b: MidiNote[]): boolean {
		if (a.length !== b.length) return false;
		const sortedA = [...a].sort();
		const sortedB = [...b].sort();
		return sortedA.every((note, index) => note === sortedB[index]);
	}

	/**
	 * Check if note sequence is in order
	 */
	static isSequential(notes: MidiNote[]): boolean {
		for (let i = 1; i < notes.length; i++) {
			if (notes[i] <= notes[i - 1]) {
				return false;
			}
		}
		return true;
	}
}

// ===== PERFORMANCE UTILITIES =====

export class PerformanceUtils {
	/**
	 * Calculate timing accuracy
	 */
	static calculateTimingAccuracy(
		actualTimes: number[],
		expectedTimes: number[],
		tolerance: number = 100 // ms
	): number {
		if (actualTimes.length !== expectedTimes.length) {
			return 0;
		}

		let correctCount = 0;
		for (let i = 0; i < actualTimes.length; i++) {
			const diff = Math.abs(actualTimes[i] - expectedTimes[i]);
			if (diff <= tolerance) {
				correctCount++;
			}
		}

		return (correctCount / actualTimes.length) * 100;
	}

	/**
	 * Calculate tempo from note timings
	 */
	static calculateTempo(noteTimes: number[]): number {
		if (noteTimes.length < 2) return 0;

		const intervals = [];
		for (let i = 1; i < noteTimes.length; i++) {
			intervals.push(noteTimes[i] - noteTimes[i - 1]);
		}

		const averageInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
		return Math.round(60000 / averageInterval); // BPM
	}

	/**
	 * Analyze performance consistency
	 */
	static analyzeConsistency(intervals: number[]): {
		consistency: number;
		variance: number;
		standardDeviation: number;
	} {
		if (intervals.length === 0) {
			return { consistency: 0, variance: 0, standardDeviation: 0 };
		}

		const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
		const variance =
			intervals.reduce((sum, interval) => {
				return sum + Math.pow(interval - mean, 2);
			}, 0) / intervals.length;

		const standardDeviation = Math.sqrt(variance);
		const consistency = Math.max(0, 100 - (standardDeviation / mean) * 100);

		return {
			consistency: Math.round(consistency),
			variance: Math.round(variance),
			standardDeviation: Math.round(standardDeviation)
		};
	}
}

// ===== PROGRESSION UTILITIES =====

export class ProgressionUtils {
	/**
	 * Generate chord progression in a key
	 */
	static generateProgression(
		key: Note,
		pattern: string,
		mode: 'major' | 'minor' = 'major'
	): { root: Note; type: ChordType }[] {
		const romanNumerals = pattern.split('-');
		const scaleNotes = this.getScaleNotes(key, mode);

		return romanNumerals.map((numeral) => {
			const degree = this.parseRomanNumeral(numeral);
			const chordRoot = scaleNotes[degree - 1];
			const chordType = this.getChordTypeFromDegree(degree, mode);

			return { root: chordRoot, type: chordType };
		});
	}

	/**
	 * Parse roman numeral to scale degree
	 */
	private static parseRomanNumeral(numeral: string): number {
		const map: Record<string, number> = {
			I: 1,
			ii: 2,
			iii: 3,
			IV: 4,
			V: 5,
			vi: 6,
			vii: 7
		};
		return map[numeral] || 1;
	}

	/**
	 * Get chord type based on scale degree
	 */
	private static getChordTypeFromDegree(degree: number, mode: 'major' | 'minor'): ChordType {
		if (mode === 'major') {
			const types: ChordType[] = ['maj7', 'min7', 'min7', 'maj7', '7', 'min7', 'min7'];
			return types[degree - 1];
		} else {
			const types: ChordType[] = ['min7', 'min7', 'maj7', 'min7', 'min7', 'maj7', '7'];
			return types[degree - 1];
		}
	}

	/**
	 * Get scale notes for progression
	 */
	private static getScaleNotes(root: Note, mode: 'major' | 'minor'): Note[] {
		const noteIndex = AllNotes.indexOf(root);
		const intervals = mode === 'major' ? [2, 2, 1, 2, 2, 2, 1] : [2, 1, 2, 2, 1, 2, 2];

		const result: Note[] = [root];
		let currentIndex = noteIndex;

		for (const interval of intervals.slice(0, 6)) {
			currentIndex = (currentIndex + interval) % 12;
			result.push(AllNotes[currentIndex]);
		}

		return result;
	}
}

// ===== CONSOLIDATED EXPORT =====

export const MusicTheoryUtils = {
	Chord: ChordUtils,
	Scale: ScaleUtils,
	Keyboard: KeyboardUtils,
	Validation: ValidationUtils,
	Performance: PerformanceUtils,
	Progression: ProgressionUtils
};
