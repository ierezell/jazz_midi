/**
 * Centralized type definitions for the jazz MIDI application
 */

import type {
    Chord,
    ChordType,
    MidiNote,
    Note,
    NoteEvent,
    NoteFullName
} from '../../midi/midi';

export type {
    Chord, ChordType, MidiNote, Note, NoteEvent, NoteFullName
};

// UI State Types
export interface BaseExerciseState {
    noteEvents: NoteEvent[];
    midiNotes: MidiNote[];
    selectedNote: Note;
    debugMode: boolean;
    errorCount: number;
    showNoteNames: boolean;
    showKeyboard: boolean;
    feedbackMessage: string;
}

export interface ChordExerciseState extends BaseExerciseState {
    selectedChordType: ChordType;
    selectedInversion: 0 | 1 | 2 | 3;
    voicingMode: 'full' | 'left-hand' | 'right-hand' | 'split';
}

export interface ScaleExerciseState extends BaseExerciseState {
    sequentialMode: boolean;
}

export interface ProgressionExerciseState extends BaseExerciseState {
    currentChordIndex: number;
}

// MIDI Configuration Types
export interface MIDIConfiguration {
    autoConnect: boolean;
    enableVirtualKeyboard: boolean;
    errorThreshold: {
        showNoteNames: number;
        showKeyboard: number;
    };
    feedback: {
        enableSounds: boolean;
        enableVisual: boolean;
    };
}

// Keyboard Configuration Types
export interface KeyboardConfiguration {
    defaultOctaves: number;
    defaultMiddleC: number;
    adaptiveRange: boolean;
    showLabels: boolean;
    keySize: {
        width: number;
        height: number;
    };
}

// Exercise Configuration Types
export interface ExerciseConfiguration {
    name: string;
    description: string;
    defaultKey: Note;
    allowedKeys: Note[];
    progressionRules?: {
        allowRepeats: boolean;
        requireSequential: boolean;
        timeoutMs?: number;
    };
}

// Audio Feedback Types
export interface AudioFeedback {
    success: HTMLAudioElement | null;
    error: HTMLAudioElement | null;
    enabled: boolean;
}

// Component Props Types
export interface BaseKeyboardProps {
    midiNotes: MidiNote[];
    middleC: number;
    octaves: number;
    interactive?: boolean;
    showLabels?: boolean;
}

export interface BaseScoreProps {
    leftHandNotes?: NoteFullName[][];
    rightHandNotes?: NoteFullName[][];
    title?: string;
    showClefs?: boolean;
}

// Exercise Result Types
export interface ExerciseResult {
    success: boolean;
    completedNotes: MidiNote[];
    expectedNotes: MidiNote[];
    accuracy: number;
    timeElapsed: number;
    errorsCount: number;
}

// Common Event Types
export interface MIDIEventHandlers {
    onNoteOn: (note: NoteEvent) => void;
    onNoteOff: (note: NoteEvent) => void;
    onError: (error: Error) => void;
    onSuccess: (result: ExerciseResult) => void;
}

// Store Types
export interface AppState {
    midiAccess: MIDIAccess | null;
    configuration: MIDIConfiguration;
    currentExercise: string | null;
    audioFeedback: AudioFeedback;
}
