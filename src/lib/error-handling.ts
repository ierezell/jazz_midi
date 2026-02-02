/**
 * Error handling utilities for music theory calculations
 * Provides safe fallbacks and proper error logging
 */

import type { MidiNote, Note, NoteFullName } from './types/types';
import { NoteToMidi } from './types/notes.constants';

export class MusicTheoryError extends Error {
    constructor(
        message: string,
        public readonly context?: Record<string, unknown>
    ) {
        super(message);
        this.name = 'MusicTheoryError';
    }
}

/**
 * Safely converts a note name to MIDI number with fallback
 */
export function safeNoteToMidi(noteName: NoteFullName): MidiNote {
    try {
        const midiNote = NoteToMidi[noteName];
        if (midiNote === undefined) {
            throw new MusicTheoryError(`Unknown note: ${noteName}`, { noteName });
        }

        return midiNote;
    } catch (error) {
        console.error('Failed to convert note to MIDI:', error);
        // Fallback to middle C
        return 60 as MidiNote;
    }
}

/**
 * Validates MIDI note is in valid range
 */
export function validateMidiNote(note: number): note is MidiNote {
    return Number.isInteger(note) && note >= 0 && note <= 127;
}

/**
 * Constrains MIDI note to specified range
 */
export function constrainToRange(
    note: number,
    min: MidiNote,
    max: MidiNote
): MidiNote {
    if (!validateMidiNote(note)) {
        console.error(`Invalid MIDI note: ${note}, defaulting to min: ${min}`);
        return min;
    }

    if (note < min) return min;
    if (note > max) return max;
    return note as MidiNote;
}

/**
 * Safe array access with fallback
 */
export function safeArrayAccess<T>(
    array: ReadonlyArray<T>,
    index: number,
    fallback: T
): T {
    if (index < 0 || index >= array.length) {
        console.warn(`Array index ${index} out of bounds (length: ${array.length})`);
        return fallback;
    }
    return array[index];
}

/**
 * Wraps a calculation with error handling
 */
export function safeCalculation<T>(
    calculation: () => T,
    fallback: T,
    context?: string
): T {
    try {
        return calculation();
    } catch (error) {
        console.error(`Calculation failed${context ? ` in ${context}` : ''}:`, error);
        return fallback;
    }
}
