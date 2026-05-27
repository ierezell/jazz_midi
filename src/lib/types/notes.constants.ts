import type { ChordType, MidiNote, Note, NoteFullName, NoteRole } from '$lib/types/types';
import type { ChordVoicing, Inversion, ScaleMode, IntervalType } from './notes';
export const MidiToNote: { [key in MidiNote]: NoteFullName } = {

	21: 'A0',
	22: 'A#0',
	23: 'B0',
	24: 'C1',
	25: 'C#1',
	26: 'D1',
	27: 'D#1',
	28: 'E1',
	29: 'F1',
	30: 'F#1',
	31: 'G1',
	32: 'G#1',
	33: 'A1',
	34: 'A#1',
	35: 'B1',
	36: 'C2',
	37: 'C#2',
	38: 'D2',
	39: 'D#2',
	40: 'E2',
	41: 'F2',
	42: 'F#2',
	43: 'G2',
	44: 'G#2',
	45: 'A2',
	46: 'A#2',
	47: 'B2',
	48: 'C3',
	49: 'C#3',
	50: 'D3',
	51: 'D#3',
	52: 'E3',
	53: 'F3',
	54: 'F#3',
	55: 'G3',
	56: 'G#3',
	57: 'A3',
	58: 'A#3',
	59: 'B3',
	60: 'C4',
	61: 'C#4',
	62: 'D4',
	63: 'D#4',
	64: 'E4',
	65: 'F4',
	66: 'F#4',
	67: 'G4',
	68: 'G#4',
	69: 'A4',
	70: 'A#4',
	71: 'B4',
	72: 'C5',
	73: 'C#5',
	74: 'D5',
	75: 'D#5',
	76: 'E5',
	77: 'F5',
	78: 'F#5',
	79: 'G5',
	80: 'G#5',
	81: 'A5',
	82: 'A#5',
	83: 'B5',
	84: 'C6',
	85: 'C#6',
	86: 'D6',
	87: 'D#6',
	88: 'E6',
	89: 'F6',
	90: 'F#6',
	91: 'G6',
	92: 'G#6', 93: 'A6',  94: 'A#6', 95: 'B6',
	96: 'C7',  97: 'C#7', 98: 'D7',  99: 'D#7', 100: 'E7', 101: 'F7',
	102: 'F#7', 103: 'G7', 104: 'G#7', 105: 'A7', 106: 'A#7', 107: 'B7',
	108: 'C8'
};
export const NoteToMidi: { [key in NoteFullName]: MidiNote } = {
	A0: 21, 'A#0': 22, Bb0: 22, B0: 23,
	C1: 24, 'C#1': 25, Db1: 25, D1: 26, 'D#1': 27, Eb1: 27, E1: 28, F1: 29,
	'F#1': 30, Gb1: 30, G1: 31, 'G#1': 32, Ab1: 32, A1: 33, 'A#1': 34, Bb1: 34, B1: 35,
	C2: 36, 'C#2': 37, Db2: 37, D2: 38, 'D#2': 39, Eb2: 39, E2: 40, F2: 41,
	'F#2': 42, Gb2: 42, G2: 43, 'G#2': 44, Ab2: 44, A2: 45, 'A#2': 46, Bb2: 46, B2: 47,
	C3: 48, 'C#3': 49, Db3: 49, D3: 50, 'D#3': 51, Eb3: 51, E3: 52, F3: 53,
	'F#3': 54, Gb3: 54, G3: 55, 'G#3': 56, Ab3: 56, A3: 57, 'A#3': 58, Bb3: 58, B3: 59,
	C4: 60, 'C#4': 61, Db4: 61, D4: 62, 'D#4': 63, Eb4: 63, E4: 64, F4: 65,
	'F#4': 66, Gb4: 66, G4: 67, 'G#4': 68, Ab4: 68, A4: 69, 'A#4': 70, Bb4: 70, B4: 71,
	C5: 72, 'C#5': 73, Db5: 73, D5: 74, 'D#5': 75, Eb5: 75, E5: 76, F5: 77,
	'F#5': 78, Gb5: 78, G5: 79, 'G#5': 80, Ab5: 80, A5: 81, 'A#5': 82, Bb5: 82, B5: 83,
	C6: 84, 'C#6': 85, Db6: 85, D6: 86, 'D#6': 87, Eb6: 87, E6: 88, F6: 89,
	'F#6': 90, Gb6: 90, G6: 91, 'G#6': 92, Ab6: 92, A6: 93, 'A#6': 94, Bb6: 94, B6: 95,
	C7: 96, 'C#7': 97, Db7: 97, D7: 98, 'D#7': 99, Eb7: 99, E7: 100, F7: 101,
	'F#7': 102, Gb7: 102, G7: 103, 'G#7': 104, Ab7: 104, A7: 105, 'A#7': 106, Bb7: 106, B7: 107,
	C8: 108
};
export const AllNotes: Note[] = [
	'C',
	'C#',
	'Db',
	'D',
	'D#',
	'Eb',
	'E',
	'F',
	'F#',
	'Gb',
	'G',
	'G#',
	'Ab',
	'A',
	'A#',
	'Bb',
	'B'
];
export const AllChordTypes: ChordType[] = [
	'major',
	'minor',
	'diminished',
	'augmented',
	'sus2',
	'sus4',
	'maj7',
	'min7',
	'7',
	'dom7',
	'half-dim7',
	'dim7'
];
export const AllInversions: Inversion[] = [0, 1, 2, 3];
export const AllThreeNotesChords: ChordType[] = [
	'major',
	'minor',
	'diminished',
	'augmented',
	'sus2',
	'sus4'
];

export const AllNoteRole: NoteRole[] = [
	'root',
	'third',
	'fifth',
	'seventh',
	'ninth',
	'eleventh',
	'thirteenth'
];

export const AllChordVoicings: ChordVoicing[] = [
	'full-right',
	'full-left',
	'1735',
	'1537',
	'rootless-a',
	'rootless-b'
];

export const AllScaleModes: ScaleMode[] = [
	'Maj',
	'Min',
	'Blues',
	'HarMin',
	'MelMin',
	'Pentatonic',
	'PentatonicMin',
	'Dorian',
	'Chromatic',
];

// Middle C = C4 = MIDI 60 (standard convention)
export const DEFAULT_OCTAVE = '4';
export const DEFAULT_MIDDLE_C: MidiNote = NoteToMidi['C4'];

export const DEFAULT_NOTE_ROLE_COLORS: Record<NoteRole, string> = {
	root: '#e74c3c',
	third: '#f39c12',
	fifth: '#3498db',
	seventh: '#9b59b6',
	ninth: '#2ecc71',
	eleventh: '#DDA0DD',
	thirteenth: '#9b59b6'
};

export const SCALE_INTERVALS: Record<ScaleMode, number[]> = {
	// Include the octave (12) so scales start on the root and can end on the octave
	Maj: [0, 2, 4, 5, 7, 9, 11, 12],
	Min: [0, 2, 3, 5, 7, 8, 10, 12],
	Blues: [0, 3, 5, 6, 7, 10, 12],
	HarMin: [0, 2, 3, 5, 7, 8, 11, 12],
	MelMin: [0, 2, 3, 5, 7, 9, 11, 12],
	Pentatonic: [0, 2, 4, 7, 9, 12],
	PentatonicMin: [0, 3, 5, 7, 10, 12],
	Dorian: [0, 2, 3, 5, 7, 9, 10, 12],
	Chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
};

export const AllIntervals: IntervalType[] = [
	'unison',
	'minor2nd',
	'major2nd',
	'minor3rd',
	'major3rd',
	'perfect4th',
	'tritone',
	'perfect5th',
	'minor6th',
	'major6th',
	'minor7th',
	'major7th',
	'octave'
];

/** Semitone offset (0–11) for each Note name, handling enharmonic equivalents. */
export const NOTE_TO_CHROMA: Record<import('./notes').Note, number> = {
	C: 0,
	'C#': 1,
	Db: 1,
	D: 2,
	'D#': 3,
	Eb: 3,
	E: 4,
	F: 5,
	'F#': 6,
	Gb: 6,
	G: 7,
	'G#': 8,
	Ab: 8,
	A: 9,
	'A#': 10,
	Bb: 10,
	B: 11
};

export const INTERVAL_SEMITONES: Record<IntervalType, number> = {
	unison: 0,
	minor2nd: 1,
	major2nd: 2,
	minor3rd: 3,
	major3rd: 4,
	perfect4th: 5,
	tritone: 6,
	perfect5th: 7,
	minor6th: 8,
	major6th: 9,
	minor7th: 10,
	major7th: 11,
	octave: 12
};

export const INTERVAL_NAMES: Record<IntervalType, string> = {
	unison: 'Unison',
	minor2nd: 'Minor 2nd',
	major2nd: 'Major 2nd',
	minor3rd: 'Minor 3rd',
	major3rd: 'Major 3rd',
	perfect4th: 'Perfect 4th',
	tritone: 'Tritone',
	perfect5th: 'Perfect 5th',
	minor6th: 'Minor 6th',
	major6th: 'Major 6th',
	minor7th: 'Minor 7th',
	major7th: 'Major 7th',
	octave: 'Octave'
};
