import type { ChordType, Inversion, MidiNote, Note, NoteFullName, Chord } from './notes';

// Re-export types from notes module
export type { ChordType, MidiNote, Note, NoteFullName, IntervalType, Chord } from './notes';

export type NoteEvent = {
	noteNumber: MidiNote;
	type: 'on' | 'off';
	noteFullName: NoteFullName;
	noteName: Note;
	velocity: number;
	timestamp: number;
	channel: number;
};
export type NoteRole = 'root' | 'third' | 'fifth' | 'seventh' | 'ninth' | 'eleventh' | 'thirteenth';

export interface ScoreProps {
	leftHand: NoteFullName[][];
	rightHand: NoteFullName[][];
	selectedNote: Note;
}

export type ExerciseType = 'chord' | 'scale' | 'II-V-I';
export const allExerciseType: ExerciseType[] = ['chord', 'scale', 'II-V-I'];
export interface KeyboardProps {
	midiNotes: MidiNote[];
	middleC: number;
	octaves: number;
	debugMode: boolean;
	noteRoles: { [key: number]: NoteRole };
	expectedNotes: MidiNote[];
	showExpected: boolean;
}

export interface ExerciseStatistics {
	totalExercises: number;
	completedExercises: number;
	averageAccuracy: number;
	averageScore: number;
	timeSpent: number;
	favoriteExercises: string[];
	improvementTrend: number;
}

export interface ExerciseResult {
	exerciseId: string;
	exerciseType: 'chord' | 'scale' | 'progression';
	success: boolean;
	accuracy: number;
	timeElapsed: number;
	mistakes: number;
	score: number;
	timestamp: Date;
}

export interface MIDIEventHandlers {
	onNoteOn: (note: NoteEvent) => void;
	onNoteOff: (note: NoteEvent) => void;
	onControlChange: (control: number, value: number) => void;
	onError: (error: Error) => void;
}
