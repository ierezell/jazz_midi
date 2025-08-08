import type { ChordVoicing, Inversion } from './types/notes';
import { MidiToNote, NoteToMidi } from './types/notes.constants';
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
				root: (notes[1] - 12) as MidiNote,
				third: notes[2],
				fifth: notes[0],
				inversion: 1,
				chordType: chordType
			};
		case 2:
			return {
				root: (notes[2] - 12) as MidiNote,
				third: (notes[0] - 12) as MidiNote,
				fifth: notes[1],
				inversion: 2,
				chordType: chordType
			};
		case 3:
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
				root: (notes[1] - 12) as MidiNote,
				third: notes[2],
				fifth: notes[3],
				seventh: notes[0],
				inversion: 1,
				chordType: chordType
			};
		case 2:
			return {
				root: (notes[2] - 12) as MidiNote,
				third: (notes[3] - 12) as MidiNote,
				fifth: notes[0],
				seventh: notes[1],
				inversion: 2,
				chordType: chordType
			};
		case 3:
			return {
				root: (notes[3] - 12) as MidiNote,
				third: notes[0],
				fifth: notes[1],
				seventh: notes[2],
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
		case 'major':
			chord = [rootMidi, majorThird, perfectFifth] as MidiNote[];
			break;
		case 'minor':
			chord = [rootMidi, minorThird, perfectFifth] as MidiNote[];
			break;
		case 'maj7':
			chord = [rootMidi, majorThird, perfectFifth, majorSeventh] as MidiNote[];
			break;
		case 'min7':
			chord = [rootMidi, minorThird, perfectFifth, minorSeventh] as MidiNote[];
			break;
		case '7':
		case 'dom7':
			chord = [rootMidi, majorThird, perfectFifth, minorSeventh] as MidiNote[];
			break;
		case 'diminished':
			chord = [rootMidi, minorThird, flatFifth] as MidiNote[];
			break;
		case 'augmented':
			chord = [rootMidi, majorThird, augmentedFifth] as MidiNote[];
			break;
		case 'sus2':
			chord = [rootMidi, second, perfectFifth] as MidiNote[];
			break;
		case 'sus4':
			chord = [rootMidi, fourth, perfectFifth] as MidiNote[];
			break;
		case 'dim7':
			chord = [rootMidi, minorThird, flatFifth, diminishedSeventh] as MidiNote[];
			break;
		case 'half-dim7':
			chord = [rootMidi, minorThird, flatFifth, minorSeventh] as MidiNote[];
			break;
		default:
			chord = [rootMidi] as MidiNote[];
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

export function generateChordNotesDataFromChord(
	chord: Chord,
	voicing: ChordVoicing
): {
	leftHand: NoteFullName[][];
	rightHand: NoteFullName[][];
} {
	const allChordNotes = [chord.root, chord.third, chord.fifth, chord.seventh].filter(
		(note) => note !== undefined
	) as MidiNote[];

	switch (voicing) {
		case 'full':
			// All notes in right hand as a single chord
			const fullResult = {
				leftHand: [],
				rightHand: [allChordNotes.map((midi) => MidiToNote[midi])]
			};
			return fullResult;
		case 'left-hand':
			const leftOnly = [chord.root, chord.seventh].filter(
				(note) => note !== undefined
			) as MidiNote[];
			return {
				leftHand: [leftOnly.map((midi) => MidiToNote[midi])],
				rightHand: []
			};
		case 'right-hand':
			const rightOnly = [chord.third, chord.fifth];
			return {
				leftHand: [],
				rightHand: [rightOnly.map((midi) => MidiToNote[midi])]
			};
		case 'split':
			const leftHand = [chord.root - 12, (chord.seventh || chord.root) - 12].filter(
				(note) => note >= 24
			) as MidiNote[];
			const rightHand = [chord.third, chord.fifth];
			return {
				leftHand: [leftHand.map((midi) => MidiToNote[midi])],
				rightHand: [rightHand.map((midi) => MidiToNote[midi])]
			};
		default:
			return {
				leftHand: [],
				rightHand: [allChordNotes.map((midi) => MidiToNote[midi])]
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
	const rootNote = (selectedNote + '4') as NoteFullName;
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
		return { middleC: 60, octaves: minOctaves };
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
	const difference = normalizedNote - (rootNumber % 12);
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
