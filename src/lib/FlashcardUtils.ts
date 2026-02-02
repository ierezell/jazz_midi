import {
	AllNotes,
	NoteToMidi,
	DEFAULT_OCTAVE,
	INTERVAL_SEMITONES,
	SCALE_INTERVALS,
	AllScaleModes
} from './types/notes.constants';
import type { MidiNote, Note, ChordType } from './types/types';
import type { ScaleMode } from './types/notes';
import { chords, calculateInterval } from './MusicTheoryUtils';

export type FlashCardType = 'note' | 'interval' | 'chord' | 'scale' | 'II-V-I';

export interface FlashCard {
	type: FlashCardType;
	prompt: string;
	subtext?: string;
	expectedNotes: MidiNote[];
	config?: {
		chordType?: ChordType;
		inversion?: number;
		scaleMode?: ScaleMode;
		intervalName?: string;
		[key: string]: unknown;
	};
}

export function generateRandomCard(root: Note, forcedType?: FlashCardType): FlashCard {
	const types: FlashCardType[] = ['note', 'interval', 'chord', 'scale', 'II-V-I'];
	const type = forcedType || types[Math.floor(Math.random() * types.length)];

	const rootMidi = NoteToMidi[`${root}${DEFAULT_OCTAVE}` as keyof typeof NoteToMidi];

	if (type === 'note') {
		return {
			type: 'note',
			prompt: root,
			subtext: 'Play the note',
			expectedNotes: [rootMidi]
		};
	} else if (type === 'interval') {
		const intervals = Object.keys(INTERVAL_SEMITONES) as (keyof typeof INTERVAL_SEMITONES)[];
		const interval = intervals[Math.floor(Math.random() * intervals.length)];
		const targetMidi = calculateInterval(root, interval);
		return {
			type: 'interval',
			prompt: `${root} + ${interval}`,
			subtext: 'Play the interval (Root + Note)',
			expectedNotes: [rootMidi, targetMidi]
		};
	} else if (type === 'chord') {
		const chordTypes: ChordType[] = ['major', 'minor', 'maj7', 'min7', 'dom7'];
		const chordType = chordTypes[Math.floor(Math.random() * chordTypes.length)];
		const chord = chords(rootMidi, chordType);
		const notes = [chord.root, chord.third, chord.fifth];
		if (chord.seventh) notes.push(chord.seventh);

		return {
			type: 'chord',
			prompt: `${root} ${chordType}`,
			subtext: 'Play the chord',
			expectedNotes: notes as MidiNote[],
			config: { chordType }
		};
	} else if (type === 'scale') {
		const modes: ScaleMode[] = AllScaleModes;
		const mode = modes[Math.floor(Math.random() * modes.length)];
		const intervals = SCALE_INTERVALS[mode];
		const notes = intervals.map((interval: number) => (rootMidi + interval) as MidiNote);

		return {
			type: 'scale',
			prompt: `${root} ${mode} Scale`,
			subtext: 'Play the scale',
			expectedNotes: notes,
			config: { mode }
		};
	} else {
		// II-V-I
		// II: min7 (offset +2 from root of I)
		// V: dom7 (offset +7 from root of I)
		// I: maj7 (root)
		// Wait, if root is the Key (I), then:
		// II = Root + 2 semitones (min7)
		// V = Root + 7 semitones (dom7)
		// I = Root (maj7)

		// Let's assume 'root' passed here is the Key (I).
		const iiRoot = (rootMidi + 2) as MidiNote;
		const vRoot = (rootMidi + 7) as MidiNote;
		const iRoot = rootMidi;

		const iiChord = chords(iiRoot, 'min7');
		const vChord = chords(vRoot, 'dom7');
		const iChord = chords(iRoot, 'maj7');

		const iiNotes = [iiChord.root, iiChord.third, iiChord.fifth, iiChord.seventh!];
		const vNotes = [vChord.root, vChord.third, vChord.fifth, vChord.seventh!];
		const iNotes = [iChord.root, iChord.third, iChord.fifth, iChord.seventh!];

		// For a flashcard, maybe we expect them to play all chords in sequence?
		// Or just the notes? BaseExercise expects a set of notes.
		// If we want them to play chords in sequence, BaseExercise might need 'progression' logic support where expectedNotes changes.
		// But for now, let's just ask for the I chord or maybe all notes?
		// Actually, `BaseExercise` with `exerciseType='progression'` isn't fully implemented for sequential detection in a single "Flashcard" mode easily without state.
		// But `Random` page used `TwoFiveOnesPage` which handles it.
		// If we are merging into `Flashcards` page which uses `BaseExercise` directly, we might need to simplify or upgrade `BaseExercise`.
		// However, `Flashcards` page currently just checks if `expectedNotes` are held.
		// Holding 12 notes at once is impossible.
		// So for II-V-I in Flashcard mode (simple), let's just ask for the I chord or maybe just one chord from it?
		// OR, we stick to "Random" page approach where it renders the specific component.
		// The user asked to MERGE Flashcards and Random.
		// Random page renders `ChordsPage`, `ScalesPage`, `TwoFiveOnesPage`.
		// `Flashcards` page renders `BaseExercise`.
		// To merge, `Flashcards` page should probably become a "Container" that renders the appropriate sub-component (like Random did), OR `BaseExercise` needs to handle all.
		// Given `BaseExercise` is generic, maybe we can just use `BaseExercise` for everything if we provide the right props.
		// But `TwoFiveOnes` has specific logic for progression steps.
		// Let's look at `TwoFiveOnesPage` to see how it works.
		// If it uses `BaseExercise` internally, we are good.
		// If not, we might need to wrap it.

		// For now, let's implement II-V-I as just the I chord for the "Simple Flashcard" mode,
		// OR better, let's make `Flashcards` page capable of rendering the specific Exercise Components like `Random` did.
		// The user said "Flashcards and random should be the same page. Please merge them. The goal is to flash exercices randomly."
		// This implies the "Random" behavior (switching components) is desired, but maybe with the "Flashcard" UI (Prompt -> Hint).
		// `Random` page already had a "Prompt" (Description) and "New" button.
		// So `Flashcards` page should probably adopt the `Random` page architecture but maybe use `BaseExercise` features if possible.
		// But `ChordsPage`, `ScalesPage` etc likely wrap `BaseExercise`.

		// Let's assume for this `generateRandomCard` function, we are generating data for a "Simple" flashcard (one step).
		// If we want full progression, we might need a different approach.
		// Let's return the notes for the I chord for now to be safe, or maybe the II-V-I notes combined if we want to test "knowing the notes"? No that's messy.
		// Let's stick to simple types for `generateRandomCard` for now, and handle `II-V-I` by delegating to the `TwoFiveOnes` component in the Page if type is II-V-I.
		// So `expectedNotes` here might be ignored if the Page handles it.
		return {
			type: 'II-V-I',
			prompt: `${root} II-V-I`,
			subtext: 'Play the progression',
			expectedNotes: [], // Handled by component
			config: { key: root }
		};
	}
}
