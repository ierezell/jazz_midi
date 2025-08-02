/**
 * Base exercise controller that provides common functionality
 * for all jazz education exercises
 */

import { DEFAULT_MIDI_CONFIG } from '../config';
import { audioManager } from '../managers/AudioManager';
import { midiManager } from '../managers/MIDIManager';
import type {
    BaseExerciseState,
    ExerciseResult,
    MIDIEventHandlers,
    MidiNote,
    Note,
    NoteEvent
} from '../types';

export abstract class BaseExerciseController {
    protected state: BaseExerciseState;
    protected startTime: number = 0;
    protected noteBuffer: MidiNote[] = [];
    
    constructor(initialNote: Note = 'C') {
        this.state = {
            noteEvents: [],
            midiNotes: [],
            selectedNote: initialNote,
            debugMode: false,
            errorCount: 0,
            showNoteNames: false,
            showKeyboard: false,
            feedbackMessage: '',
        };
        
        this.setupMIDIHandlers();
    }

    /**
     * Setup MIDI event handlers
     */
    private setupMIDIHandlers(): void {
        const handlers: Partial<MIDIEventHandlers> = {
            onNoteOn: this.handleNoteOn.bind(this),
            onNoteOff: this.handleNoteOff.bind(this),
            onError: this.handleMIDIError.bind(this),
        };
        
        midiManager.setEventHandlers(handlers);
    }

    /**
     * Handle note on events
     */
    protected handleNoteOn(note: NoteEvent): void {
        // Add to note events
        this.state.noteEvents = [note, ...this.state.noteEvents];
        this.updateMidiNotes();
        
        // Start timing if this is the first note
        if (this.noteBuffer.length === 0) {
            this.startTime = Date.now();
        }
        
        // Let derived class handle exercise logic
        this.processNoteInput(note);
    }

    /**
     * Handle note off events
     */
    protected handleNoteOff(note: NoteEvent): void {
        // Remove from note events
        this.state.noteEvents = this.state.noteEvents.filter(
            event => event.noteNumber !== note.noteNumber || event.type !== 'on'
        );
        this.updateMidiNotes();
        
        // Let derived class handle if needed
        this.onNoteRelease?.(note);
    }

    /**
     * Update MIDI notes from events
     */
    private updateMidiNotes(): void {
        this.state.midiNotes = this.state.noteEvents
            .filter(event => event.type === 'on')
            .map(event => event.noteNumber);
    }

    /**
     * Handle MIDI errors
     */
    protected handleMIDIError(error: Error): void {
        console.error('Exercise MIDI Error:', error);
        this.setFeedback('MIDI connection error. Please check your device.', false);
    }

    /**
     * Set feedback message and play audio
     */
    protected setFeedback(message: string, isSuccess: boolean): void {
        this.state.feedbackMessage = message;
        
        if (isSuccess) {
            audioManager.playSuccess();
        } else {
            audioManager.playError();
            this.incrementErrorCount();
        }
    }

    /**
     * Increment error count and update hints
     */
    protected incrementErrorCount(): void {
        this.state.errorCount++;
        this.updateHints();
    }

    /**
     * Update hint visibility based on error count
     */
    private updateHints(): void {
        const config = DEFAULT_MIDI_CONFIG.errorThreshold;
        this.state.showNoteNames = this.state.errorCount >= config.showNoteNames;
        this.state.showKeyboard = this.state.errorCount >= config.showKeyboard;
    }

    /**
     * Reset exercise state
     */
    reset(): void {
        this.state.noteEvents = [];
        this.state.midiNotes = [];
        this.state.errorCount = 0;
        this.state.feedbackMessage = '';
        this.state.showNoteNames = false;
        this.state.showKeyboard = false;
        this.noteBuffer = [];
        this.startTime = 0;
        
        // Let derived class handle reset
        this.onReset?.();
    }

    /**
     * Toggle debug mode
     */
    toggleDebugMode(): void {
        this.state.debugMode = !this.state.debugMode;
        midiManager.toggleVirtualKeyboard(this.state.debugMode);
    }

    /**
     * Change selected note/key
     */
    setSelectedNote(note: Note): void {
        this.state.selectedNote = note;
        this.reset();
        this.onNoteChanged?.(note);
    }

    /**
     * Get current state
     */
    getState(): BaseExerciseState {
        return { ...this.state };
    }

    /**
     * Initialize the exercise
     */
    async initialize(): Promise<boolean> {
        const success = await midiManager.initialize();
        if (success) {
            this.onInitialized?.();
        }
        return success;
    }

    /**
     * Cleanup resources
     */
    cleanup(): void {
        midiManager.cleanup();
        this.onCleanup?.();
    }

    /**
     * Create exercise result
     */
    protected createResult(
        success: boolean,
        expectedNotes: MidiNote[],
        completedNotes: MidiNote[] = this.noteBuffer
    ): ExerciseResult {
        const timeElapsed = Date.now() - this.startTime;
        const accuracy = this.calculateAccuracy(expectedNotes, completedNotes);
        
        return {
            success,
            completedNotes,
            expectedNotes,
            accuracy,
            timeElapsed,
            errorsCount: this.state.errorCount,
        };
    }

    /**
     * Calculate accuracy percentage
     */
    private calculateAccuracy(expected: MidiNote[], completed: MidiNote[]): number {
        if (expected.length === 0) return 100;
        
        const correct = completed.filter(note => expected.includes(note)).length;
        return Math.round((correct / expected.length) * 100);
    }

    // Abstract methods that derived classes must implement
    abstract processNoteInput(note: NoteEvent): void;
    abstract getExpectedNotes(): MidiNote[];

    // Optional hooks for derived classes
    protected onNoteRelease?(note: NoteEvent): void;
    protected onReset?(): void;
    protected onNoteChanged?(note: Note): void;
    protected onInitialized?(): void;
    protected onCleanup?(): void;
}

/**
 * Chord exercise controller
 */
export abstract class BaseChordExerciseController extends BaseExerciseController {
    protected abstract getChordNotes(): MidiNote[];
    
    protected validateChord(playedNotes: MidiNote[]): boolean {
        const expectedNotes = this.getChordNotes();
        return this.arraysEqual(playedNotes.sort(), expectedNotes.sort());
    }
    
    protected arraysEqual(a: MidiNote[], b: MidiNote[]): boolean {
        return a.length === b.length && a.every((val, i) => val === b[i]);
    }
}

/**
 * Scale exercise controller  
 */
export abstract class BaseScaleExerciseController extends BaseExerciseController {
    protected sequential: boolean = true;
    
    protected validateScaleProgress(note: MidiNote): boolean {
        const expectedNotes = this.getExpectedNotes();
        
        if (this.sequential) {
            const expectedNote = expectedNotes[this.noteBuffer.length];
            return note === expectedNote;
        } else {
            return expectedNotes.includes(note);
        }
    }
    
    setSequentialMode(sequential: boolean): void {
        this.sequential = sequential;
        this.reset();
    }
}
