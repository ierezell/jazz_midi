import type { MidiNote, NoteEvent } from './types/types';
import type { BeatTiming, TempoValidation } from './types/exercise-api';

/**
 * Pure function to validate if a note event is on beat
 * @returns Error message if off-beat, null if valid
 */
export function validateNoteTiming(
    event: NoteEvent,
    lastTick: BeatTiming,
    config: TempoValidation,
    bpm: number
): string | null {
    if (!config.enabled) return null;

    const now = event.timestamp;
    const interval = (60 / bpm) * 1000;
    const timeSinceLastTick = now - lastTick.timestamp;
    const timeToNextTick = interval - timeSinceLastTick;
    const distance = Math.min(timeSinceLastTick, timeToNextTick);

    if (config.requireDownbeat && !lastTick.isDownbeat) {
        return 'Play chords on the first beat of each measure!';
    }

    if (distance > config.toleranceMs) {
        return 'Off beat! Try to play on the beat.';
    }

    return null;
}

/**
 * Check if all expected notes have been collected
 */
export function areAllNotesCollected(
    collectedNotes: ReadonlySet<MidiNote>,
    expectedNotes: ReadonlyArray<MidiNote>,
    strictOctave: boolean = true
): boolean {
    if (!strictOctave) {
        const collectedClasses = new Set([...collectedNotes].map((n) => n % 12));
        const expectedClasses = new Set(expectedNotes.map((n) => n % 12));
        return (
            collectedClasses.size === expectedClasses.size &&
            [...expectedClasses].every((c) => collectedClasses.has(c))
        );
    }

    const uniqueExpected = new Set(expectedNotes);
    return (
        collectedNotes.size === uniqueExpected.size &&
        [...uniqueExpected].every((note) => collectedNotes.has(note))
    );
}

/**
 * Calculate total semitone distance between two chord voicings
 */
export function calculateVoiceLeadingDistance(
    fromNotes: ReadonlyArray<MidiNote>,
    toNotes: ReadonlyArray<MidiNote>
): number {
    if (fromNotes.length === 0 || toNotes.length === 0) return Infinity;

    return toNotes.reduce((total, newNote) => {
        const minDistance = Math.min(...fromNotes.map((oldNote) => Math.abs(newNote - oldNote)));
        return total + minDistance;
    }, 0);
}
