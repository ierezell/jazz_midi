import type { MidiNote, Note, NoteFullName } from './types/types';
import type { ScaleMode } from '$lib/types/notes';
import { NoteToMidi, MidiToNote, SCALE_INTERVALS } from '$lib/types/notes.constants';

/**
 * Generate scale MIDI notes for a given root note, scale mode and hand mode.
 * Uses lower octaves (3 for right hand, 2 for left hand) to match the app's UI.
 */
export function generateExpectedNotesFor(
	selectedNote: Note,
	scaleMode: ScaleMode,
	handMode: boolean
): MidiNote[] {
	const octave = handMode ? '3' : '1';
	const rootMidi = NoteToMidi[(selectedNote + octave) as NoteFullName];
	return SCALE_INTERVALS[scaleMode].map((interval) => (rootMidi + interval) as MidiNote);
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
