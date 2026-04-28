import type { MidiNote, Note, NoteEvent } from './types/types';
import type { ValidationResult } from './types/exercise-api';

export interface GhostNoteState {
	notesPlayed: number;
	ghostNotesCorrect: number;
	accentNotesCorrect: number;
	beatPosition: number; // 0 = downbeat, 1 = upbeat (and)
}

export interface GhostNoteConfig {
	ghostVelocityMax: number; // Velocity must be < this for ghost notes (downbeats)
	accentVelocityMin: number; // Velocity must be > this for accented notes (upbeats)
	scaleNotes: MidiNote[];
}

export function createGhostNoteState(): GhostNoteState {
	return {
		notesPlayed: 0,
		ghostNotesCorrect: 0,
		accentNotesCorrect: 0,
		beatPosition: 0
	};
}

export function getExpectedGhostNote(
	selectedNote: Note,
	octave: number = 4
): MidiNote[] {
	const baseNotes: Record<Note, number> = {
		'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
		'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
		'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
	};
	
	const baseNote = baseNotes[selectedNote];
	if (baseNote === undefined) return [];
	
	const baseMidi = (octave + 1) * 12 + baseNote;
	
	// Generate 2-octave major scale
	const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11];
	const notes: MidiNote[] = [];
	
	for (let oct = 0; oct < 2; oct++) {
		for (const interval of majorScaleIntervals) {
			notes.push((baseMidi + oct * 12 + interval) as MidiNote);
		}
	}
	// Add the top C
	notes.push((baseMidi + 24) as MidiNote);
	
	return notes;
}

export function validateGhostNote(
	event: NoteEvent,
	config: GhostNoteConfig,
	state: GhostNoteState
): ValidationResult {
	const { velocity } = event;
	const isDownbeat = state.beatPosition === 0;
	const isGhostNoteBeat = isDownbeat; // Downbeats = ghost notes (soft)
	const isAccentBeat = !isDownbeat; // Upbeats = accented (loud)
	
	// Check velocity constraints
	const isGhostCorrect = isGhostNoteBeat && velocity < config.ghostVelocityMax;
	const isAccentCorrect = isAccentBeat && velocity >= config.accentVelocityMin;
	const velocityCorrect = isGhostCorrect || isAccentCorrect;
	
	// Track progress
	state.notesPlayed++;
	if (isGhostCorrect) state.ghostNotesCorrect++;
	if (isAccentCorrect) state.accentNotesCorrect++;
	
	// Toggle beat position for next note
	state.beatPosition = state.beatPosition === 0 ? 1 : 0;
	
	// Check if note is in the scale
	const isCorrectNote = config.scaleNotes.includes(event.noteNumber);
	
	if (!isCorrectNote) {
		return {
			isCorrect: false,
			message: `Wrong note! Expected scale note.`,
			collected: false,
			resetCollected: false
		};
	}
	
	if (!velocityCorrect) {
		const expected = isGhostNoteBeat 
			? `Ghost note (velocity < ${config.ghostVelocityMax})` 
			: `Accent (velocity >= ${config.accentVelocityMin})`;
		return {
			isCorrect: false,
			message: `Wrong articulation! ${expected}. You played: ${velocity}`,
			collected: false,
			resetCollected: false
		};
	}
	
	return {
		isCorrect: true,
		message: isGhostNoteBeat 
			? `Ghost note! (${velocity})` 
			: `Accent! (${velocity})`,
		collected: true,
		resetCollected: false
	};
}

export function isGhostNoteChallengeCompleted(
	config: GhostNoteConfig,
	state: GhostNoteState,
	targetNotes: number = 16
): boolean {
	return state.notesPlayed >= targetNotes;
}

export function getGhostNoteAccuracy(state: GhostNoteState): number {
	if (state.notesPlayed === 0) return 0;
	const totalCorrect = state.ghostNotesCorrect + state.accentNotesCorrect;
	return Math.round((totalCorrect / state.notesPlayed) * 100);
}
