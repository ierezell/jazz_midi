import type { MidiNote, Note, NoteFullName } from './types/types';
import type { ScaleMode } from '$lib/types/notes';
import { NoteToMidi, MidiToNote, SCALE_INTERVALS } from '$lib/types/notes.constants';

/**
 * Generate scale MIDI notes for a given root note, scale mode and hand mode.
 * Uses lower octaves (3 for right hand, 2 for left hand) to match the app's UI.
 */
export type HandMode = 'left' | 'right' | 'both';

/**
 * Generate scale MIDI notes for a given root note, scale mode and hand mode.
 * Uses lower octaves (3 for right hand, 2 for left hand) to match the app's UI.
 */
export function generateExpectedNotesFor(
	selectedNote: Note,
	scaleMode: ScaleMode,
	handMode: HandMode | boolean
): MidiNote[] {
	// Backwards compatibility for boolean
	let mode: HandMode = 'right';
	if (typeof handMode === 'boolean') {
		mode = handMode ? 'right' : 'left';
	} else {
		mode = handMode;
	}

	const intervals = SCALE_INTERVALS[scaleMode];
	const notes: MidiNote[] = [];

	if (mode === 'left' || mode === 'both') {
		const rootMidi = NoteToMidi[(selectedNote + '2') as NoteFullName]; // Octave 2 for Left
		notes.push(...intervals.map((interval) => (rootMidi + interval) as MidiNote));
	}

	if (mode === 'right' || mode === 'both') {
		const rootMidi = NoteToMidi[(selectedNote + '3') as NoteFullName]; // Octave 3 for Right
		notes.push(...intervals.map((interval) => (rootMidi + interval) as MidiNote));
	}
	
	// If both, we might want to interleave them or just have them sequential?
	// For now, let's sort them by pitch?
	// Or if we want "C2, C3, D2, D3", we should interleave.
	if (mode === 'both') {
		notes.sort((a, b) => a - b);
	}

	return notes;
}

/**
 * Validate a single sequential note play attempt.
 * Returns whether the note was correct, a user-facing message and the updated sequence.
 */
export function validateSequentialNote(
	expectedNotes: MidiNote[],
	playedSequence: MidiNote[],
	noteNumber: MidiNote
): { isCorrect: boolean; message: string; newSequence: MidiNote[] } {
	const nextExpectedIndex = playedSequence.length;
	const expectedNote = expectedNotes[nextExpectedIndex];

	if (noteNumber === expectedNote) {
		const newSequence = [...playedSequence, noteNumber];
		if (newSequence.length === expectedNotes.length) {
			return { isCorrect: true, message: 'Perfect scale! 🎵✨', newSequence };
		}
		return {
			isCorrect: true,
			message: `Good! Note ${nextExpectedIndex + 1}/${expectedNotes.length}`,
			newSequence
		};
	}

	const expectedNoteName = MidiToNote[expectedNote]?.slice(0, -1) || expectedNote.toString();
	return {
		isCorrect: false,
		message: `Wrong note! Expected ${expectedNoteName} (note ${nextExpectedIndex + 1})`,
		newSequence: []
	};
}

export function isSequenceComplete(expectedNotes: MidiNote[], playedSequence: MidiNote[]): boolean {
	return (
		playedSequence.length === expectedNotes.length &&
		playedSequence.every((note, index) => note === expectedNotes[index])
	);
}
