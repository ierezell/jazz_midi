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

export type ExerciseType = 'chord' | 'scale' | 'II-V-I' | 'note' | 'interval' | 'partition' | 'progression' | 'rhythm';
export const allExerciseType: ExerciseType[] = ['chord', 'scale', 'II-V-I', 'note', 'interval', 'partition', 'progression', 'rhythm'];
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
	exerciseType: 'chord' | 'scale' | 'progression' | 'partition' | 'rhythm';
	success: boolean;
	accuracy: number;
	timeElapsed: number;
	mistakes: number;
	score: number;
	timestamp: Date;
	avgDeviationMs?: number;
}

export interface MIDIEventHandlers {
	onNoteOn: (note: NoteEvent) => void;
	onNoteOff: (note: NoteEvent) => void;
	onControlChange: (control: number, value: number) => void;
	onError: (error: Error) => void;
}

export interface RhythmHit {
	beat: number; // 1-indexed beat position (e.g., 1.0, 1.5, 2.0, 2.25)
	hand: 'LH' | 'RH';
}

export interface RhythmPattern {
	id: string;
	name: string;
	description: string;
	suggestedBpm: number;
	timeSignature: '4/4' | '6/8' | '3/4';
	defaultChords: string[]; // e.g., ["Cmaj7", "Fmaj7"]
	hits: RhythmHit[];
	isProgression: boolean;
	measures: number; // Duration of the pattern in measures
}

export interface Lick {
	id: string;
	name: string;
	description: string;
	category: 'blues' | 'bebop' | 'latin' | 'rock' | 'country' | 'funk' | 'boogie' | 'jazz';
	hand: 'left' | 'right' | 'both';
	difficulty: 'beginner' | 'intermediate' | 'advanced';
	suggestedBpm: number;
	notes: NoteFullName[]; // Sequence of notes to play
	tags?: string[]; // e.g., ["walking-bass", "shuffle", "chromatic"]
}
