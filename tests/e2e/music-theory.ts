/**
 * Pure music-theory helpers for Playwright E2E tests.
 * No SvelteKit / Vite `$lib` imports – everything is self-contained so that
 * Node / Playwright can execute this file without any bundler.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const ALL_NOTES = [
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
] as const;
export type Note = (typeof ALL_NOTES)[number];

/** Semitone offset from C for each note name */
export const NOTE_OFFSET: Record<string, number> = {
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

/**
 * MIDI number for <Note><Octave> using the app's octave labels.
 *
 * IMPORTANT: This repo labels MIDI 60 as "C3" (see `src/lib/types/notes.constants.ts`),
 * so the octave math is offset by +1 compared to the common "C4 = 60" convention.
 * Example: "C3" → 60
 */
export function midiFromName(note: string, octave: number): number {
	const offset = NOTE_OFFSET[note];
	if (offset === undefined) throw new Error(`Unknown note: ${note}`);
	return (octave + 2) * 12 + offset;
}

/**
 * The app uses DEFAULT_OCTAVE = '3' for all chord/scale root notes.
 * This matches the constant in src/lib/types/notes.constants.ts.
 */
export const APP_DEFAULT_OCTAVE = 3;

/** Default octave used by the app for root notes (always 3). */
export function defaultOctave(_note?: string): number {
	return APP_DEFAULT_OCTAVE;
}

/** Root MIDI note for a given note name using the app's octave convention */
export function rootMidi(note: string): number {
	return midiFromName(note, defaultOctave(note));
}

// ---------------------------------------------------------------------------
// Scale helpers
// ---------------------------------------------------------------------------

export const SCALE_INTERVALS: Record<string, number[]> = {
	Maj: [0, 2, 4, 5, 7, 9, 11, 12],
	Min: [0, 2, 3, 5, 7, 8, 10, 12],
	Blues: [0, 3, 5, 6, 7, 10, 12],
	HarMin: [0, 2, 3, 5, 7, 8, 11, 12],
	MelMin: [0, 2, 3, 5, 7, 9, 11, 12],
	Dor: [0, 2, 3, 5, 7, 9, 10, 12],
	Phr: [0, 1, 3, 5, 7, 8, 10, 12],
	Lyd: [0, 2, 4, 6, 7, 9, 11, 12],
	Mix: [0, 2, 4, 5, 7, 9, 10, 12],
	Loc: [0, 1, 3, 5, 6, 8, 10, 12]
};

export function scaleNotes(note: string, mode: string): number[] {
	const root = rootMidi(note);
	const intervals = SCALE_INTERVALS[mode];
	if (!intervals) throw new Error(`Unknown scale mode: ${mode}`);
	return intervals.map((i) => root + i);
}

// ---------------------------------------------------------------------------
// Chord helpers
// ---------------------------------------------------------------------------

/** Matches `ChordType` in `src/lib/types/notes.ts` / `AllChordTypes` in the app. */
export const CHORD_INTERVALS: Record<string, (number | undefined)[]> = {
	// [root, third, fifth, seventh]
	major: [0, 4, 7, undefined],
	minor: [0, 3, 7, undefined],
	diminished: [0, 3, 6, undefined],
	augmented: [0, 4, 8, undefined],
	sus2: [0, 2, 7, undefined],
	sus4: [0, 5, 7, undefined],
	maj7: [0, 4, 7, 11],
	min7: [0, 3, 7, 10],
	'7': [0, 4, 7, 10],
	dom7: [0, 4, 7, 10],
	'half-dim7': [0, 3, 6, 10],
	dim7: [0, 3, 6, 9]
};

/** Returns the MIDI notes for a chord (root position, right-hand voicing) */
export function chordNotes(note: string, type: string): number[] {
	const root = rootMidi(note);
	const intervals = CHORD_INTERVALS[type];
	if (!intervals) throw new Error(`Unknown chord type: ${type}`);
	return intervals.filter((i): i is number => i !== undefined).map((i) => root + i);
}

// ---------------------------------------------------------------------------
// Interval helpers
// ---------------------------------------------------------------------------

export const INTERVAL_SEMITONES: Record<string, number> = {
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

export function intervalNotes(note: string, interval: string): [number, number] {
	const isHighNote = ['G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'].includes(note);
	const octave = isHighNote ? 2 : 3;
	const root = midiFromName(note, octave);
	const semitones = INTERVAL_SEMITONES[interval];
	if (semitones === undefined) throw new Error(`Unknown interval: ${interval}`);
	return [root, root + semitones];
}

// ---------------------------------------------------------------------------
// II-V-I helpers
// ---------------------------------------------------------------------------

export function twoFiveOneChords(note: string): number[][] {
	const one = rootMidi(note);
	const two = one + 2;
	const five = one + 7;
	return [
		chordNotesFromRoot(two, 'min7'),
		chordNotesFromRoot(five, 'dom7'),
		chordNotesFromRoot(one, 'maj7')
	];
}

function chordNotesFromRoot(root: number, type: string): number[] {
	const intervals = CHORD_INTERVALS[type];
	if (!intervals) throw new Error(`Unknown chord type: ${type}`);
	return intervals.filter((i): i is number => i !== undefined).map((i) => root + i);
}
