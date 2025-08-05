import type { ChordToneRole } from './chordTones';

export type NoteFullName = `${string}${number}`;
export type Note = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';
export type MidiNote = number;
export type ChordType = 'maj7' | 'min7' | 'dom7' | 'half-dim7' | 'dim7';
export type NoteEvent = {
    noteNumber: MidiNote;
    velocity: number;
    timestamp: number;
    type: 'noteon' | 'noteoff';
};

export interface ExerciseResult {
    score: number;
    mistakes: number;
    timeElapsed: number;
    completed: boolean;
}

export interface BaseExerciseState {
    noteEvents: NoteEvent[];
    midiNotes: MidiNote[];
    selectedNote: Note;
    debugMode: boolean;
    errorCount: number;
    showNoteNames: boolean;
    showKeyboard: boolean;
    feedbackMessage: string;
    completed: boolean;
}

export interface ChordExerciseState extends BaseExerciseState {
    chord: {
        type: ChordType;
        voicing: string;
        inversion: 0 | 1 | 2 | 3;
    };
}

export interface ScaleExerciseState extends BaseExerciseState {
    scale: Note[];
}

export type AnyExerciseState = ChordExerciseState | ScaleExerciseState;

export interface ChordToneInfo {
    noteNumber: MidiNote;
    role: ChordToneRole;
}
