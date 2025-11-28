import type { ChordVoicing, Inversion, IntervalType } from './types/notes';
import {
	MidiToNote,
	NoteToMidi,
	DEFAULT_OCTAVE,
	DEFAULT_MIDDLE_C,
	INTERVAL_SEMITONES
} from './types/notes.constants';
import type { Chord, ChordType, MidiNote, Note, NoteFullName, NoteRole } from './types/types';

const inverseTriadChord = (
	notes: MidiNote[],
	inversion: Inversion,
	chordType: ChordType
): Chord => {
	switch (inversion) {
		case 0:
			return {
				root: notes[0],
				third: notes[1],
				fifth: notes[2],
				inversion: 0,
				chordType: chordType
			};
		case 1:
			return {
				root: notes[1],
				third: notes[2],
				fifth: (notes[0] + 12) as MidiNote,
				inversion: 1,
				chordType: chordType
			};
		case 2:
			return {
				root: notes[2],
				third: (notes[0] + 12) as MidiNote,
				fifth: (notes[1] + 12) as MidiNote,
				inversion: 2,
				chordType: chordType
			};
		case 3:
			// triads should not reach a 3rd inversion (handled earlier), but keep a safe
			// fallback that mirrors root position.
			return {
				root: notes[0],
				third: notes[1],
				fifth: notes[2],
				inversion: 0,
				chordType: chordType
			};
	}
};
const inverseSeventhChord = (
	notes: MidiNote[],
	inversion: Inversion,
	chordType: ChordType
): Chord => {
	switch (inversion) {
		case 0:
			return {
				root: notes[0],
				third: notes[1],
				fifth: notes[2],
				seventh: notes[3],
				inversion: 0,
				chordType: chordType
			};
		case 1:
			return {
				root: notes[1],
				third: notes[2],
				fifth: notes[3],
				seventh: (notes[0] + 12) as MidiNote,
				inversion: 1,
				chordType: chordType
			};
		case 2:
			return {
				root: notes[2],
				third: notes[3],
				fifth: (notes[0] + 12) as MidiNote,
				seventh: (notes[1] + 12) as MidiNote,
				inversion: 2,
				chordType: chordType
			};
		case 3:
			return {
				root: notes[3],
				third: (notes[0] + 12) as MidiNote,
				fifth: (notes[1] + 12) as MidiNote,
				seventh: (notes[2] + 12) as MidiNote,
				inversion: 3,
				chordType: chordType
			};
	}
};
export const chords = (
	rootMidi: MidiNote,
	chordType: ChordType,
	inversion: Inversion = 0
): Chord => {
	const second = (rootMidi + 2) as MidiNote;
	const minorThird = (rootMidi + 3) as MidiNote;
	const majorThird = (rootMidi + 4) as MidiNote;
	const fourth = (rootMidi + 5) as MidiNote;
	const flatFifth = (rootMidi + 6) as MidiNote;
	const perfectFifth = (rootMidi + 7) as MidiNote;
	const augmentedFifth = (rootMidi + 8) as MidiNote;
	const diminishedSeventh = (rootMidi + 9) as MidiNote;
	const minorSeventh = (rootMidi + 10) as MidiNote;
	const majorSeventh = (rootMidi + 11) as MidiNote;
	let chord = [] as MidiNote[];
	switch (chordType) {
		case 'major': {
			chord = [rootMidi, majorThird, perfectFifth] as MidiNote[];
			break;
		}
		case 'minor': {
			chord = [rootMidi, minorThird, perfectFifth] as MidiNote[];
			break;
		}
		case 'maj7': {
			chord = [rootMidi, majorThird, perfectFifth, majorSeventh] as MidiNote[];
			break;
		}
		case 'min7': {
			chord = [rootMidi, minorThird, perfectFifth, minorSeventh] as MidiNote[];
			break;
		}
		case '7':
		case 'dom7': {
			chord = [rootMidi, majorThird, perfectFifth, minorSeventh] as MidiNote[];
			break;
		}
		case 'diminished': {
			chord = [rootMidi, minorThird, flatFifth] as MidiNote[];
			break;
		}
		case 'augmented': {
			chord = [rootMidi, majorThird, augmentedFifth] as MidiNote[];
			break;
		}
		case 'sus2': {
			chord = [rootMidi, second, perfectFifth] as MidiNote[];
			break;
		}
		case 'sus4': {
			chord = [rootMidi, fourth, perfectFifth] as MidiNote[];
			break;
		}
		case 'dim7': {
			chord = [rootMidi, minorThird, flatFifth, diminishedSeventh] as MidiNote[];
			break;
		}
		case 'half-dim7': {
			chord = [rootMidi, minorThird, flatFifth, minorSeventh] as MidiNote[];
			break;
		}
		default: {
			chord = [rootMidi] as MidiNote[];
		}
	}
	if (chord.length === 3) {
		if (inversion === 3) {
			throw new Error(`Triad ${chordType} chords do not have a 3rd inversion`);
		}
		return inverseTriadChord(chord, inversion, chordType);
	} else {
		return inverseSeventhChord(chord, inversion, chordType);
	}
};

export function getVoicedChordNotes(chord: Chord, voicing: ChordVoicing): MidiNote[] {
	const allChordNotes = [chord.root, chord.third, chord.fifth, chord.seventh].filter(
		(note) => note !== undefined
	) as MidiNote[];

	// Calculate 9th (Root + 14 semitones)
	const ninth = (chord.root + 14) as MidiNote;

	switch (voicing) {
		case 'full-right':
			return allChordNotes;
		case 'full-left':
			return allChordNotes.map((n) => (n - 12) as MidiNote).filter((n) => n >= 24);
		case '1735':
			return [
				(chord.root - 12) as MidiNote,
				((chord.seventh || chord.root) - 12) as MidiNote,
				chord.third,
				chord.fifth
			].filter((n) => n !== undefined && n >= 24) as MidiNote[];
		case '1537':
			return [
				(chord.root - 12) as MidiNote,
				(chord.fifth - 12) as MidiNote,
				chord.third,
				chord.seventh || chord.root
			].filter((n) => n !== undefined && n >= 24) as MidiNote[];
		case 'rootless-a':
			// Type A: 3, 5, 7, 9
			return [chord.third, chord.fifth, chord.seventh, ninth].filter(
				(n) => n !== undefined
			) as MidiNote[];
		case 'rootless-b':
			// Type B: 7, 9, 3, 5
			return [
				chord.seventh,
				ninth,
				(chord.third + 12) as MidiNote,
				(chord.fifth + 12) as MidiNote
			].filter((n) => n !== undefined) as MidiNote[];
		default:
			return allChordNotes;
	}
}

export function generateChordNotesDataFromChord(
	chord: Chord,
	voicing: ChordVoicing
): {
	leftHand: NoteFullName[][];
	rightHand: NoteFullName[][];
} {
	const voicedNotes = getVoicedChordNotes(chord, voicing);

	switch (voicing) {
		case 'full-right':
			return {
				leftHand: [],
				rightHand: [voicedNotes.map((midi) => MidiToNote[midi])]
			};
		case 'full-left':
			return {
				leftHand: [voicedNotes.map((midi) => MidiToNote[midi])],
				rightHand: []
			};
		case '1735':
		case '1537': {
			// First 2 notes left, next 2 right
			const left = voicedNotes.slice(0, 2);
			const right = voicedNotes.slice(2);
			return {
				leftHand: [left.map((midi) => MidiToNote[midi])],
				rightHand: [right.map((midi) => MidiToNote[midi])]
			};
		}
		case 'rootless-a':
		case 'rootless-b': {
			return {
				leftHand: [],
				rightHand: [voicedNotes.map((midi) => MidiToNote[midi])]
			};
		}
		default:
			return {
				leftHand: [],
				rightHand: [voicedNotes.map((midi) => MidiToNote[midi])]
			};
	}
}

export function generateChordNotesData(
	selectedNote: Note,
	chordType: ChordType,
	inversion: Inversion,
	voicing: ChordVoicing
): {
	leftHand: NoteFullName[][];
	rightHand: NoteFullName[][];
} {
	const rootNote = (selectedNote + DEFAULT_OCTAVE) as NoteFullName;
	const rootMidi = NoteToMidi[rootNote];
	const currentChord = chords(rootMidi, chordType, inversion);

	return generateChordNotesDataFromChord(currentChord, voicing);
}

export function calculateOptimalRange(
	notes: MidiNote[],
	minOctaves: number = 2,
	maxOctaves: number = 7
): { middleC: number; octaves: number } {
	if (notes.length === 0) {
		return { middleC: DEFAULT_MIDDLE_C, octaves: minOctaves };
	}
	const minNote = Math.min(...notes);
	const maxNote = Math.max(...notes);
	const minC = Math.floor((minNote - 12) / 12) * 12 + 12;
	const maxC = Math.ceil((maxNote + 12) / 12) * 12;
	const totalRange = maxC - minC;
	const octaves = Math.max(minOctaves, Math.min(maxOctaves, Math.ceil(totalRange / 12)));
	const middleC = minC + Math.floor((octaves * 12) / 2) - 6;
	return {
		middleC: Math.max(24, middleC),
		octaves
	};
}

export function getNoteRole(noteNumber: MidiNote, rootNumber: MidiNote): NoteRole | 'unknown' {
	// Yeah... I should do noteNumber: Note, rootNumber: Note and convert here....
	const normalizedNote = noteNumber % 12;
	const difference = (normalizedNote - (rootNumber % 12) + 12) % 12;
	switch (difference) {
		case 0:
			return 'root';
		case 4:
			return 'third';
		case 7:
			return 'fifth';
		case 11:
			return 'seventh';
		case 2:
			return 'ninth';
		case 5:
			return 'eleventh';
		case 9:
			return 'thirteenth';
		default:
			return 'unknown';
	}
}

/**
 * Calculate the MIDI note number for a given interval from a root note
 * @param rootNote - The root note (without octave)
 * @param intervalType - The type of interval
 * @param octave - The octave for the root note (defaults to '3')
 * @returns Array of MIDI notes [root, interval] or just [interval] based on includeRoot
 */
export function calculateInterval(
	rootNote: Note,
	intervalType: IntervalType,
	octave: string = DEFAULT_OCTAVE
): MidiNote {
	const rootNoteName = (rootNote + octave) as NoteFullName;
	const rootMidi = NoteToMidi[rootNoteName];
	const intervalSemitones = INTERVAL_SEMITONES[intervalType];
	const targetMidi = (rootMidi + intervalSemitones) as MidiNote;

	return targetMidi;
}
