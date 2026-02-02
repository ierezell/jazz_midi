import type { ChordVoicing, Inversion, IntervalType } from './types/notes';
import {
	MidiToNote,
	NoteToMidi,
	DEFAULT_OCTAVE,
	DEFAULT_MIDDLE_C,
	INTERVAL_SEMITONES
} from './types/notes.constants';
import type { Chord, ChordType, MidiNote, Note, NoteFullName, NoteRole } from './types/types';
import { calculateVoiceLeadingDistance } from './music-validation';

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

/**
 * Interval builders - pure functions for calculating intervals
 */
const intervals = {
	second: (root: MidiNote) => (root + 2) as MidiNote,
	minorThird: (root: MidiNote) => (root + 3) as MidiNote,
	majorThird: (root: MidiNote) => (root + 4) as MidiNote,
	fourth: (root: MidiNote) => (root + 5) as MidiNote,
	flatFifth: (root: MidiNote) => (root + 6) as MidiNote,
	perfectFifth: (root: MidiNote) => (root + 7) as MidiNote,
	augmentedFifth: (root: MidiNote) => (root + 8) as MidiNote,
	diminishedSeventh: (root: MidiNote) => (root + 9) as MidiNote,
	minorSeventh: (root: MidiNote) => (root + 10) as MidiNote,
	majorSeventh: (root: MidiNote) => (root + 11) as MidiNote
} as const;

/**
 * Chord type to intervals mapping - pure data structure
 */
const CHORD_INTERVALS: Record<ChordType, ReadonlyArray<(root: MidiNote) => MidiNote>> = {
	major: [intervals.majorThird, intervals.perfectFifth],
	minor: [intervals.minorThird, intervals.perfectFifth],
	maj7: [intervals.majorThird, intervals.perfectFifth, intervals.majorSeventh],
	min7: [intervals.minorThird, intervals.perfectFifth, intervals.minorSeventh],
	'7': [intervals.majorThird, intervals.perfectFifth, intervals.minorSeventh],
	dom7: [intervals.majorThird, intervals.perfectFifth, intervals.minorSeventh],
	diminished: [intervals.minorThird, intervals.flatFifth],
	augmented: [intervals.majorThird, intervals.augmentedFifth],
	sus2: [intervals.second, intervals.perfectFifth],
	sus4: [intervals.fourth, intervals.perfectFifth],
	dim7: [intervals.minorThird, intervals.flatFifth, intervals.diminishedSeventh],
	'half-dim7': [intervals.minorThird, intervals.flatFifth, intervals.minorSeventh]
};

/**
 * Constrains MIDI note to C3-C4 range (48-60) for optimal playability
 * Pure function - no side effects
 */
function constrainToOptimalRange(midi: MidiNote): MidiNote {
	let constrained = midi;
	while (constrained > 60) constrained = (constrained - 12) as MidiNote;
	while (constrained < 48) constrained = (constrained + 12) as MidiNote;
	return constrained;
}

/**
 * Generates a chord from root, type, and inversion
 * Pure function - same inputs always produce same output
 */
export function chords(
	rootMidi: MidiNote,
	chordType: ChordType,
	inversion: Inversion = 0
): Chord {
	const constrainedRoot = constrainToOptimalRange(rootMidi);

	// Build chord notes using interval functions
	const intervalFns = CHORD_INTERVALS[chordType] ?? [];
	const chord = [constrainedRoot, ...intervalFns.map(fn => fn(constrainedRoot))];

	// Validate inversion for triads
	if (chord.length === 3 && inversion === 3) {
		throw new Error(`Triad ${chordType} chords do not have a 3rd inversion`);
	}

	return chord.length === 3
		? inverseTriadChord(chord as MidiNote[], inversion, chordType)
		: inverseSeventhChord(chord as MidiNote[], inversion, chordType);
}


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

	const range = maxNote - minNote;
	// Ensure minimal buffer around the notes (at least 1 octave total span if single note)
	// Add 1 octave of padding generally
	const octavesNeeded = Math.ceil(range / 12) + 1;
	const octaves = Math.max(minOctaves, Math.min(maxOctaves, octavesNeeded));

	const center = (minNote + maxNote) / 2;

	// Keyboard logic: start = middleC - floor(octaves/2)*12
	// We want start to be roughly center - totalSpan/2
	// So proposedStart = center - (octaves * 12) / 2
	const proposedStart = center - (octaves * 12) / 2;

	// Snap start to nearest C <= proposedStart to make the keyboard look standard
	const snappedStart = Math.floor(proposedStart / 12) * 12;

	// Reverse calculate the middleC that results in this start
	const middleC = snappedStart + Math.floor(octaves / 2) * 12;

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
 * Calculate the optimal inversion for voice leading
 * Finds the inversion that minimizes total semitone movement from the previous chord
 * @param rootMidi - The root MIDI note of the new chord
 * @param chordType - The type of chord
 * @param previousChordNotes - Array of MIDI notes from the previous chord
 * @returns The optimal inversion (0-3)
 */
export function calculateOptimalInversion(
	rootMidi: MidiNote,
	chordType: ChordType,
	previousChordNotes: ReadonlyArray<MidiNote>
): Inversion {
	if (previousChordNotes.length === 0) return 0;

	const possibleInversions: ReadonlyArray<Inversion> = chordType.includes('7')
		? ([0, 1, 2, 3] as const)
		: ([0, 1, 2] as const);

	let bestInversion: Inversion = 0;
	let minDistance = Infinity;

	for (const inversion of possibleInversions) {
		try {
			const chord = chords(rootMidi, chordType, inversion);
			const chordNotes = [chord.root, chord.third, chord.fifth, chord.seventh].filter(
				(n): n is MidiNote => n !== undefined
			);

			const distance = calculateVoiceLeadingDistance(previousChordNotes, chordNotes);

			if (distance < minDistance) {
				minDistance = distance;
				bestInversion = inversion;
			}
		} catch {
			continue;
		}
	}

	return bestInversion;
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
