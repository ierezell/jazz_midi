/**
 * Centralized exports for the improved jazz MIDI library
 */

// Type definitions
export * from './types';

// Configuration
export * from './config';

// Managers
export { audioManager } from './managers/AudioManager';
export { midiManager } from './managers/MIDIManager';

// Controllers
export {
    BaseChordExerciseController, BaseExerciseController, BaseScaleExerciseController
} from './controllers/BaseExerciseController';

// Utilities
export {
    ChordUtils, LayoutUtils, ProgressionUtils, ScaleUtils, VoiceLeadingUtils
} from './utils/musicalUtils';

// Re-export MIDI utilities for convenience
export {
    AllChordTypes, AllNotes, ChangeMidiCallback,
    chords, getMidiNote, majorScales, MidiToNote, minorScales, NoteToMidi, RequestMidiAccess, type Chord, type ChordType, type MidiNote,
    type Note, type NoteEvent, type NoteFullName
} from '../midi/midi';

export {
    ChordProgressionBuilder, FrequencyCalculator,
    IntervalCalculator, isValidMidiNote,
    isValidNote, MIDIPerformanceMonitor, safeGetMidiFromNote, safeGetMidiNote, safeGetNoteName, safeRequestMidiAccess,
    safeSetupMidiCallback
} from '../midi/midiUtils';

export {
    createVirtualMidiAccess,
    setupKeyboardInput,
    type VirtualMidiInput
} from '../midi/virtualMidi';

