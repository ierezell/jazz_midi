/**
 * Musical calculation utilities
 * Centralized logic for chord generation, scale calculations, and progressions
 */

import {
	chords,
	majorScales,
	MidiToNote,
	minorScales,
	NoteToMidi,
	type Chord,
	type ChordType,
	type MidiNote,
	type Note,
	type NoteFullName
} from '../../midi/midi';

/**
 * Enhanced chord utilities
 */
export class ChordUtils {
	/**
	 * Generate chord with specific voicing options
	 */
	static generateChord(
		root: Note,
		chordType: ChordType,
		options: {
			inversion?: 0 | 1 | 2 | 3;
			octave?: number;
			voicing?: 'close' | 'open' | 'drop2' | 'drop3';
		} = {}
	): Chord {
		const { inversion = 0, octave = 4 } = options;
		const rootMidi = NoteToMidi[`${root}${octave}` as NoteFullName];

		let baseChord = chords(rootMidi, chordType, inversion);

		// Apply voicing if specified
		if (options.voicing && options.voicing !== 'close') {
			baseChord = this.applyVoicing(baseChord, options.voicing);
		}

		return baseChord;
	}

	/**
	 * Apply specific voicing to a chord
	 */
	private static applyVoicing(chord: Chord, voicing: 'open' | 'drop2' | 'drop3'): Chord {
		const notes = [chord.root, chord.third, chord.fifth, chord.seventh].filter(
			(n) => n !== undefined
		) as MidiNote[];

		switch (voicing) {
			case 'open':
				// Spread notes across wider range
				return {
					...chord,
					third: (chord.third + 12) as MidiNote,
					seventh: chord.seventh ? ((chord.seventh + 12) as MidiNote) : undefined
				};

			case 'drop2':
				// Drop second highest note an octave
				if (notes.length >= 3) {
					const sortedNotes = [...notes].sort((a, b) => a - b);
					const secondHighest = sortedNotes[sortedNotes.length - 2];

					if (chord.third === secondHighest) {
						return { ...chord, third: (chord.third - 12) as MidiNote };
					} else if (chord.fifth === secondHighest) {
						return { ...chord, fifth: (chord.fifth - 12) as MidiNote };
					}
				}
				break;

			case 'drop3':
				// Drop third highest note an octave
				if (notes.length >= 4) {
					const sortedNotes = [...notes].sort((a, b) => a - b);
					const thirdHighest = sortedNotes[sortedNotes.length - 3];

					if (chord.third === thirdHighest) {
						return { ...chord, third: (chord.third - 12) as MidiNote };
					} else if (chord.fifth === thirdHighest) {
						return { ...chord, fifth: (chord.fifth - 12) as MidiNote };
					}
				}
				break;
		}

		return chord;
	}

	/**
	 * Get chord notes as array
	 */
	static getChordNotes(chord: Chord): MidiNote[] {
		return [chord.root, chord.third, chord.fifth, chord.seventh].filter(
			(note) => note !== undefined
		) as MidiNote[];
	}

	/**
	 * Get chord symbol
	 */
	static getChordSymbol(root: Note, chordType: ChordType): string {
		const symbols: Record<ChordType, string> = {
			major: '',
			minor: 'm',
			maj7: 'maj7',
			min7: 'm7',
			'7': '7',
			dom7: '7',
			diminished: 'dim',
			'dim7': '°7',
			'half-dim7': 'ø',
			augmented: 'aug',
			sus2: 'sus2',
			sus4: 'sus4'
		};

		return `${root}${symbols[chordType]}`;
	}

	/**
	 * Analyze played notes to identify chord
	 */
	static identifyChord(notes: MidiNote[]): { root: Note; chordType: ChordType } | null {
		if (notes.length < 3) return null;

		const sortedNotes = [...notes].sort((a, b) => a - b);
		const intervals = sortedNotes.slice(1).map((note) => note - sortedNotes[0]);

		// Common chord patterns (intervals from root)
		const chordPatterns: Record<string, ChordType> = {
			'4,7': 'major',
			'3,7': 'minor',
			'4,7,11': 'maj7',
			'3,7,10': 'min7',
			'4,7,10': '7',
			'3,6': 'diminished',
			'4,8': 'augmented',
			'2,7': 'sus2',
			'5,7': 'sus4'
		};

		const pattern = intervals.join(',');
		const chordType = chordPatterns[pattern];

		if (chordType) {
			const rootNote = MidiToNote[sortedNotes[0]].slice(0, -1) as Note;
			return { root: rootNote, chordType };
		}

		return null;
	}
}

/**
 * Scale utilities
 */
export class ScaleUtils {
	/**
	 * Get scale notes for a specific key and scale type
	 */
	static getScaleNotes(root: Note, scaleType: 'major' | 'minor' = 'major'): NoteFullName[] {
		return scaleType === 'major' ? majorScales[root] : minorScales[root];
	}

	/**
	 * Get scale degrees (Roman numerals)
	 */
	static getScaleDegrees(scaleType: 'major' | 'minor' = 'major'): string[] {
		return scaleType === 'major'
			? ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']
			: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];
	}

	/**
	 * Get chords for each scale degree
	 */
	static getScaleChords(root: Note, scaleType: 'major' | 'minor' = 'major'): ChordType[] {
		return scaleType === 'major'
			? ['maj7', 'min7', 'min7', 'maj7', '7', 'min7', 'diminished']
			: ['min7', 'diminished', 'maj7', 'min7', 'min7', 'maj7', '7'];
	}

	/**
	 * Generate mode from parent scale
	 */
	static getMode(
		root: Note,
		mode: 'ionian' | 'dorian' | 'phrygian' | 'lydian' | 'mixolydian' | 'aeolian' | 'locrian'
	): NoteFullName[] {
		const modeIntervals: Record<string, number[]> = {
			ionian: [2, 2, 1, 2, 2, 2, 1], // Major
			dorian: [2, 1, 2, 2, 2, 1, 2], // Minor with raised 6th
			phrygian: [1, 2, 2, 2, 1, 2, 2], // Minor with lowered 2nd
			lydian: [2, 2, 2, 1, 2, 2, 1], // Major with raised 4th
			mixolydian: [2, 2, 1, 2, 2, 1, 2], // Major with lowered 7th
			aeolian: [2, 1, 2, 2, 1, 2, 2], // Natural minor
			locrian: [1, 2, 2, 1, 2, 2, 2] // Minor with lowered 2nd and 5th
		};

		const intervals = modeIntervals[mode];
		const rootMidi = NoteToMidi[`${root}0` as NoteFullName];

		let scaleMidiNotes = [rootMidi];
		let currentMidi = rootMidi;

		for (const interval of intervals) {
			currentMidi = currentMidi + interval;
			if (currentMidi > 127) break;
			scaleMidiNotes.push(currentMidi as MidiNote);
		}

		return scaleMidiNotes.map((midi) => MidiToNote[midi]);
	}
}

/**
 * Progression utilities
 */
export class ProgressionUtils {
	/**
	 * Generate common jazz progressions
	 */
	static generateProgression(
		key: Note,
		progressionType: 'ii-V-I' | 'I-vi-ii-V' | 'vi-ii-V-I' | 'I-V-vi-IV' | 'rhythm-changes'
	): Array<{ degree: string; root: Note; chordType: ChordType }> {
		const progressions: Record<string, number[]> = {
			'ii-V-I': [2, 5, 1],
			'I-vi-ii-V': [1, 6, 2, 5],
			'vi-ii-V-I': [6, 2, 5, 1],
			'I-V-vi-IV': [1, 5, 6, 4],
			'rhythm-changes': [1, 6, 2, 5, 1, 6, 2, 5] // Simplified
		};

		const degrees = progressions[progressionType];
		const scaleChords = ScaleUtils.getScaleChords(key, 'major');
		const scaleDegrees = ScaleUtils.getScaleDegrees('major');
		const scaleNotes = ScaleUtils.getScaleNotes(key, 'major');

		return degrees.map((degree) => {
			const chordType = scaleChords[degree - 1];
			const rootNote = scaleNotes[degree - 1].slice(0, -1) as Note;
			const degreeSymbol = scaleDegrees[degree - 1];

			return {
				degree: degreeSymbol,
				root: rootNote,
				chordType
			};
		});
	}

	/**
	 * Get next logical chord in a progression
	 */
	static getNextChord(
		currentChord: { root: Note; chordType: ChordType },
		progressionType: 'ii-V-I' | 'circle-of-fifths' | 'chromatic'
	): { root: Note; chordType: ChordType } | null {
		// This would implement logic for suggesting next chords
		// Based on common jazz progressions and voice leading
		// Implementation would be quite complex, so returning null for now
		return null;
	}
}

/**
 * Voice leading utilities
 */
export class VoiceLeadingUtils {
	/**
	 * Calculate voice leading between two chords
	 */
	static calculateVoiceLeading(
		chord1: Chord,
		chord2: Chord
	): {
		movements: Array<{ from: MidiNote; to: MidiNote; interval: number }>;
		totalMovement: number;
	} {
		const notes1 = ChordUtils.getChordNotes(chord1);
		const notes2 = ChordUtils.getChordNotes(chord2);

		// Simple nearest-voice assignment (could be improved with Hungarian algorithm)
		const movements = notes1.map((note1, index) => {
			const note2 = notes2[index] || notes2[notes2.length - 1];
			return {
				from: note1,
				to: note2,
				interval: note2 - note1
			};
		});

		const totalMovement = movements.reduce((sum, mov) => sum + Math.abs(mov.interval), 0);

		return { movements, totalMovement };
	}

	/**
	 * Find optimal voicing for smooth voice leading
	 */
	static findOptimalVoicing(previousChord: Chord, nextChord: Chord): Chord {
		// This would implement logic to find the best inversion/voicing
		// for smooth voice leading. Complex algorithm.
		return nextChord;
	}
}

/**
 * Range and layout utilities
 */
export class LayoutUtils {
	/**
	 * Calculate optimal keyboard range for given notes
	 */
	static calculateKeyboardRange(notes: MidiNote[]): { middleC: number; octaves: number } {
		if (notes.length === 0) {
			return { middleC: 60, octaves: 2 };
		}

		const minNote = Math.min(...notes);
		const maxNote = Math.max(...notes);

		// Find C notes that encompass the range
		const minC = Math.floor((minNote - 12) / 12) * 12 + 12;
		const maxC = Math.ceil((maxNote + 12) / 12) * 12;

		const totalRange = maxC - minC;
		const octaves = Math.max(2, Math.ceil(totalRange / 12));
		const middleC = Math.max(24, minC + Math.floor((octaves * 12) / 2) - 6);

		return {
			middleC: Math.max(24, middleC),
			octaves: Math.min(7, octaves)
		};
	}

	/**
	 * Split notes for left and right hand display
	 */
	static splitHandsForDisplay(
		notes: MidiNote[],
		splitPoint: MidiNote = 60 // Middle C
	): { leftHand: MidiNote[]; rightHand: MidiNote[] } {
		return {
			leftHand: notes.filter((note) => note < splitPoint),
			rightHand: notes.filter((note) => note >= splitPoint)
		};
	}
}
