import type { MidiNote, Note } from './notes';

/**
 * Result returned by exercise validation functions
 */
export type ValidationResult = {
	readonly isCorrect: boolean;
	readonly message: string;
	readonly collected: boolean;
	readonly resetCollected: boolean;
	readonly resetMistakes?: boolean;
};

/**
 * Exercise API exposed to child components
 */
export interface ExerciseAPI {
	readonly selectedNote: Note;
	readonly currentNotes: ReadonlyArray<MidiNote>;
	readonly expectedNotes: ReadonlyArray<MidiNote>;
	readonly mistakes: number;
	readonly completed: boolean;
	readonly collectedNotes: ReadonlySet<MidiNote>;
	readonly debugMode: boolean;
	readonly feedbackMessage: string;
	readonly showNotesRoles: boolean;
	readonly tempoMode: boolean;
	readonly toggleDebug: () => void;
	readonly showFeedback: (message: string, type: 'success' | 'error' | 'info') => void;
	readonly toggleTempoMode: () => void;
	readonly handleTick: (timestamp: number, beatNumber: number, isDownbeat: boolean) => void;
	readonly completeExercise: (extra?: Partial<import('./types').ExerciseResult>) => void;
}

/**
 * Beat timing information for rhythm validation
 */
export interface BeatTiming {
	readonly timestamp: number;
	readonly beatNumber: number;
	readonly isDownbeat: boolean;
}

/**
 * Tempo validation configuration
 */
export interface TempoValidation {
	readonly enabled: boolean;
	readonly toleranceMs: number;
	readonly requireDownbeat: boolean;
}
