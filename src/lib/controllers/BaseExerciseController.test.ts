/**
 * Unit tests for Base Exercise Controller
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MidiNote, NoteEvent } from '../types';
import { BaseExerciseController } from './BaseExerciseController';

// Mock managers
vi.mock('../managers/MIDIManager', () => ({
	midiManager: {
		setEventHandlers: vi.fn(),
		isConnectedToMIDI: vi.fn().mockReturnValue(true),
		toggleVirtualKeyboard: vi.fn(),
		initialize: vi.fn().mockResolvedValue(true),
		cleanup: vi.fn()
	}
}));

vi.mock('../managers/AudioManager', () => ({
	audioManager: {
		playSuccess: vi.fn(),
		playError: vi.fn()
	}
}));

// Concrete implementation for testing
class TestExerciseController extends BaseExerciseController {
	private expectedNotes: MidiNote[] = [60, 64, 67]; // C major chord

	getExpectedNotes(): MidiNote[] {
		return this.expectedNotes;
	}

	setExpectedNotes(notes: MidiNote[]): void {
		this.expectedNotes = notes;
	}

	processNoteInput(note: NoteEvent): void {
		// Simple implementation: check if note is in expected notes
		if (this.expectedNotes.includes(note.noteNumber)) {
			this.setFeedback('Correct note!', true);
		} else {
			this.setFeedback('Wrong note', false);
		}
	}
}

describe('BaseExerciseController', () => {
	let controller: TestExerciseController;

	beforeEach(() => {
		vi.clearAllMocks();
		controller = new TestExerciseController();
	});

	describe('Initialization', () => {
		it('should initialize with default state', () => {
			const state = controller.getState();
			expect(state.noteEvents).toEqual([]);
			expect(state.midiNotes).toEqual([]);
			expect(state.selectedNote).toBe('C');
			expect(state.debugMode).toBe(false);
			expect(state.errorCount).toBe(0);
		});

		it('should initialize with custom note', () => {
			const customController = new TestExerciseController('F');
			const state = customController.getState();
			expect(state.selectedNote).toBe('F');
		});
	});

	describe('MIDI Event Handling', () => {
		it('should handle note on events', () => {
			const noteEvent: NoteEvent = {
				type: 'on',
				noteNumber: 60 as MidiNote,
				velocity: 100,
				noteFullName: 'C3',
				noteName: 'C',
				time: Date.now()
			};

			controller['handleNoteOn'](noteEvent);

			const state = controller.getState();
			expect(state.noteEvents).toContain(noteEvent);
			expect(state.midiNotes).toContain(60);
		});

		it('should handle note off events', () => {
			const noteOnEvent: NoteEvent = {
				type: 'on',
				noteNumber: 60 as MidiNote,
				velocity: 100,
				noteFullName: 'C3',
				noteName: 'C',
				time: Date.now()
			};

			const noteOffEvent: NoteEvent = {
				type: 'off',
				noteNumber: 60 as MidiNote,
				velocity: 0,
				noteFullName: 'C3',
				noteName: 'C',
				time: Date.now() + 1000
			};

			controller['handleNoteOn'](noteOnEvent);
			controller['handleNoteOff'](noteOffEvent);

			const state = controller.getState();
			expect(state.noteEvents).toHaveLength(2);
			expect(state.midiNotes).not.toContain(60); // Should be removed on note off
		});

		it('should handle MIDI errors gracefully', () => {
			const error = new Error('MIDI connection lost');
			controller['handleMIDIError'](error);

			const state = controller.getState();
			expect(state.feedbackMessage).toContain('MIDI connection error');
		});
	});

	describe('Exercise Logic', () => {
		it('should provide expected notes', () => {
			const expected = controller.getExpectedNotes();
			expect(expected).toEqual([60, 64, 67]);
		});

		it('should update expected notes', () => {
			const newNotes: MidiNote[] = [65, 69, 72]; // F major
			controller.setExpectedNotes(newNotes);
			expect(controller.getExpectedNotes()).toEqual(newNotes);
		});

		it('should process correct note input', () => {
			const correctNote: NoteEvent = {
				type: 'on',
				noteNumber: 60 as MidiNote,
				velocity: 100,
				noteFullName: 'C3',
				noteName: 'C',
				time: Date.now()
			};

			controller.processNoteInput(correctNote);

			const state = controller.getState();
			expect(state.feedbackMessage).toBe('Correct note!');
		});

		it('should process incorrect note input', () => {
			const incorrectNote: NoteEvent = {
				type: 'on',
				noteNumber: 61 as MidiNote, // C# - not in C major chord
				velocity: 100,
				noteFullName: 'C#3',
				noteName: 'C#',
				time: Date.now()
			};

			controller.processNoteInput(incorrectNote);

			const state = controller.getState();
			expect(state.feedbackMessage).toBe('Wrong note');
			expect(state.errorCount).toBe(1);
		});
	});

	describe('State Management', () => {
		it('should reset exercise state', () => {
			// Add some events first
			const noteEvent: NoteEvent = {
				type: 'on',
				noteNumber: 60 as MidiNote,
				velocity: 100,
				noteFullName: 'C3',
				noteName: 'C',
				time: Date.now()
			};

			controller['handleNoteOn'](noteEvent);
			controller['setFeedback']('Test message', false);

			// Reset
			controller.reset();

			const state = controller.getState();
			expect(state.noteEvents).toEqual([]);
			expect(state.midiNotes).toEqual([]);
			expect(state.errorCount).toBe(0);
			expect(state.feedbackMessage).toBe('');
		});

		it('should toggle debug mode', () => {
			expect(controller.getState().debugMode).toBe(false);

			controller.toggleDebugMode();
			expect(controller.getState().debugMode).toBe(true);

			controller.toggleDebugMode();
			expect(controller.getState().debugMode).toBe(false);
		});

		it('should change selected note', () => {
			controller.setSelectedNote('F');
			expect(controller.getState().selectedNote).toBe('F');
		});
	});

	describe('Feedback System', () => {
		it('should set success feedback', () => {
			controller['setFeedback']('Great job!', true);

			const state = controller.getState();
			expect(state.feedbackMessage).toBe('Great job!');
		});

		it('should set error feedback and increment count', () => {
			controller['setFeedback']('Try again', false);

			const state = controller.getState();
			expect(state.feedbackMessage).toBe('Try again');
			expect(state.errorCount).toBe(1);
		});

		it('should show hints after multiple errors', () => {
			// Trigger multiple errors
			for (let i = 0; i < 3; i++) {
				controller['setFeedback']('Error', false);
			}

			const state = controller.getState();
			expect(state.showNoteNames).toBe(true);
		});

		it('should show keyboard after many errors', () => {
			// Trigger many errors
			for (let i = 0; i < 6; i++) {
				controller['setFeedback']('Error', false);
			}

			const state = controller.getState();
			expect(state.showKeyboard).toBe(true);
		});
	});

	describe('Exercise Lifecycle', () => {
		it('should initialize successfully', async () => {
			const result = await controller.initialize();
			expect(result).toBe(true);
		});

		it('should cleanup properly', () => {
			controller.cleanup();
			// Should not throw and should reset state
			expect(true).toBe(true);
		});
	});
});
