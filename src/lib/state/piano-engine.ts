/**
 * Piano Engine State Manager
 * Encapsulates MIDI input state and note timing logic
 * UI components react to state changes, not manipulate state directly
 */

import type { MidiNote, NoteEvent } from '../types/types';

export interface PianoEngineState {
    readonly pressedNotes: ReadonlySet<MidiNote>;
    readonly noteHistory: ReadonlyArray<NoteEvent>;
    readonly lastNoteTimestamp: number | null;
    readonly isRecording: boolean;
}

export interface PianoEngineConfig {
    readonly enableRecording: boolean;
    readonly maxHistorySize: number;
}

/**
 * Manages piano/MIDI input state with immutable updates
 */
export class PianoEngine {
    private state: PianoEngineState = {
        pressedNotes: new Set(),
        noteHistory: [],
        lastNoteTimestamp: null,
        isRecording: false
    };

    private listeners: Set<(state: PianoEngineState) => void> = new Set();

    constructor(private readonly config: PianoEngineConfig) { }

    /**
     * Get current immutable state
     */
    getState(): PianoEngineState {
        return this.state;
    }

    /**
     * Subscribe to state changes
     */
    subscribe(listener: (state: PianoEngineState) => void): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    /**
     * Handle note-on event (pure state update)
     */
    noteOn(event: NoteEvent): void {
        const newPressed = new Set(this.state.pressedNotes);
        newPressed.add(event.noteNumber as MidiNote);

        const newHistory = this.config.enableRecording
            ? [...this.state.noteHistory, event].slice(-this.config.maxHistorySize)
            : this.state.noteHistory;

        this.updateState({
            pressedNotes: newPressed,
            noteHistory: newHistory,
            lastNoteTimestamp: event.timestamp ?? performance.now(),
            isRecording: this.state.isRecording
        });
    }

    /**
     * Handle note-off event (pure state update)
     */
    noteOff(noteNumber: MidiNote): void {
        const newPressed = new Set(this.state.pressedNotes);
        newPressed.delete(noteNumber);

        this.updateState({
            ...this.state,
            pressedNotes: newPressed
        });
    }

    /**
     * Start recording note history
     */
    startRecording(): void {
        this.updateState({
            ...this.state,
            isRecording: true,
            noteHistory: []
        });
    }

    /**
     * Stop recording and return history
     */
    stopRecording(): ReadonlyArray<NoteEvent> {
        const history = this.state.noteHistory;
        this.updateState({
            ...this.state,
            isRecording: false
        });
        return history;
    }

    /**
     * Reset all state
     */
    reset(): void {
        this.updateState({
            pressedNotes: new Set(),
            noteHistory: [],
            lastNoteTimestamp: null,
            isRecording: false
        });
    }

    /**
     * Get notes pressed within time window (ms)
     */
    getNotesInWindow(windowMs: number): ReadonlyArray<NoteEvent> {
        const now = performance.now();
        return this.state.noteHistory.filter(event => {
            const timestamp = event.timestamp ?? 0;
            return now - timestamp <= windowMs;
        });
    }

    /**
     * Check if specific notes are currently pressed
     */
    areNotesPressed(notes: ReadonlyArray<MidiNote>): boolean {
        return notes.every(note => this.state.pressedNotes.has(note));
    }

    /**
     * Pure state update with notification
     */
    private updateState(newState: PianoEngineState): void {
        this.state = newState;
        this.notifyListeners();
    }

    /**
     * Notify all subscribers of state change
     */
    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.state));
    }
}

/**
 * Factory for creating piano engine instances
 */
export function createPianoEngine(config?: Partial<PianoEngineConfig>): PianoEngine {
    const defaultConfig: PianoEngineConfig = {
        enableRecording: true,
        maxHistorySize: 1000
    };

    return new PianoEngine({ ...defaultConfig, ...config });
}
