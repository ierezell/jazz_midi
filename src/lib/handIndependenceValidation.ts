import type { MidiNote, NoteEvent } from './types/types';
import type { ValidationResult } from './types/exercise-api';

export const LH_SPLIT = 60; // Middle C — notes below are left hand

export function midiToNoteName(midi: number): string {
	const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
	const octave = Math.floor(midi / 12) - 1;
	return `${names[midi % 12]}${octave}`;
}

export interface HandIndependenceState {
	lhCollected: Set<number>;
	rhProgress: number;
}

export function validateHandNote(
	event: NoteEvent,
	lhExpected: MidiNote[],
	rhExpected: MidiNote[],
	state: HandIndependenceState
): ValidationResult {
	const isLH = event.noteNumber < LH_SPLIT;

	if (isLH) {
		const noteClass = event.noteNumber % 12;
		const matchesExpected = lhExpected.some((n) => n % 12 === noteClass);

		if (matchesExpected) {
			state.lhCollected = new Set([...state.lhCollected, event.noteNumber]);
			const collectedClasses = new Set(Array.from(state.lhCollected).map((c) => c % 12));
			const remaining = lhExpected.filter((n) => !collectedClasses.has(n % 12)).length;
			const message =
				remaining > 0 ? `LH: ${collectedClasses.size}/${lhExpected.length} notes` : 'LH complete!';
			return { isCorrect: true, message, collected: true, resetCollected: false };
		}

		return {
			isCorrect: false,
			message: 'LH: Not an expected note',
			collected: false,
			resetCollected: false
		};
	} else {
		const nextNote = rhExpected[state.rhProgress];

		if (event.noteNumber === nextNote) {
			state.rhProgress++;
			return {
				isCorrect: true,
				message: `RH: Note ${state.rhProgress}/${rhExpected.length}`,
				collected: true,
				resetCollected: false
			};
		} else if (event.noteNumber > nextNote) {
			state.rhProgress = 0;
			return {
				isCorrect: false,
				message: 'RH: Wrong note — restart scale',
				collected: false,
				resetCollected: false
			};
		} else {
			return {
				isCorrect: false,
				message: `RH: Expected ${midiToNoteName(nextNote)}`,
				collected: false,
				resetCollected: false
			};
		}
	}
}

export function isHandIndependenceCompleted(
	lhExpected: MidiNote[],
	rhExpected: MidiNote[],
	state: HandIndependenceState
): boolean {
	const collectedClasses = new Set(Array.from(state.lhCollected).map((c) => c % 12));
	const lhDone = lhExpected.every((n) => collectedClasses.has(n % 12));
	const rhDone = state.rhProgress >= rhExpected.length;
	return lhDone && rhDone;
}
