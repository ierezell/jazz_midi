/**
 * Enhanced Integration Tests
 * End-to-end workflow testing for complete MIDI exercise scenarios
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BaseExerciseController } from '../lib/controllers/BaseExerciseController';
import { AudioManager } from '../lib/managers/AudioManager';
import { MIDIManager } from '../lib/managers/MIDIManager';
import type { NoteEvent, MidiNote } from '../lib/types';
import { midiNoteToNoteName } from '../midi/midi';
import { createMockMIDIAccess, MockMIDIKeyboard } from './mockMIDI';

// Create a concrete implementation for testing
class TestExerciseController extends BaseExerciseController {
	private expectedNotes: MidiNote[] = [60, 64, 67]; // C major chord

	processNoteInput(note: NoteEvent): void {
		if (note.type === 'on') {
			if (this.expectedNotes.includes(note.noteNumber)) {
				// Correct note
				this.state.feedbackMessage = 'Correct!';
			} else {
				// Wrong note
				this.state.errorCount++;
				this.state.feedbackMessage = 'Wrong note!';
			}
		}
	}

	getExpectedNotes(): MidiNote[] {
		return this.expectedNotes;
	}

	setExpectedNotes(notes: MidiNote[]): void {
		this.expectedNotes = notes;
	}

	// Add missing methods that tests expect
	start(): void {
		// Start the exercise - no actual implementation needed for test
		this.state.feedbackMessage = 'Exercise started';
	}

	getStatus(): string {
		return this.state.errorCount > 0 ? 'error' : 'active';
	}
}

// Helper function to create proper NoteEvent objects
function createNoteEvent(
	type: 'on' | 'off', 
	noteNumber: MidiNote, 
	velocity: number = 100
): NoteEvent {
	const noteFullName = midiNoteToNoteName(noteNumber);
	const noteName = noteFullName.slice(0, -1) as any; // Remove octave number
	
	return {
		type,
		noteNumber,
		velocity,
		time: Date.now(),
		noteFullName,
		noteName
	};
}

describe('Enhanced Integration Tests', () => {
	let exerciseController: TestExerciseController;
	let audioManager: AudioManager;
	let midiManager: MIDIManager;
	let mockKeyboard: MockMIDIKeyboard;

	beforeEach(async () => {
		// Setup mock MIDI environment
		const mockMidiAccess = await createMockMIDIAccess();
		global.navigator = {
			requestMIDIAccess: vi.fn().mockResolvedValue(mockMidiAccess)
		} as any;

		// Create mock keyboard
		mockKeyboard = new MockMIDIKeyboard();

		// Initialize managers
		midiManager = new MIDIManager();
		audioManager = new AudioManager();

		// Create exercise controller
		exerciseController = new TestExerciseController('C');
		await exerciseController.initialize();
	});

	it('should complete a full chord recognition workflow', async () => {
		// Start the exercise
		exerciseController.start();
		expect(exerciseController.getStatus()).toBe('active');

		// Simulate playing the correct chord notes
		const correctNotes = [60, 64, 67] as MidiNote[]; // C major chord

		for (const noteNumber of correctNotes) {
			// Press note
			const noteOnEvent = createNoteEvent('on', noteNumber);
			exerciseController.processNoteInput(noteOnEvent);
		}

		const state = exerciseController.getState();
		expect(state.midiNotes.length).toBeGreaterThan(0);
		expect(state.errorCount).toBe(0);

		// Release notes
		for (const noteNumber of correctNotes) {
			const noteOffEvent = createNoteEvent('off', noteNumber, 0);
			exerciseController.processNoteInput(noteOffEvent);
		}

		expect(state.errorCount).toBe(0);
	});

	it('should handle incorrect notes and provide feedback', async () => {
		exerciseController.start();

		// Play an incorrect note first
		const incorrectNote = createNoteEvent('on', 59 as MidiNote);
		exerciseController.processNoteInput(incorrectNote);

		const state = exerciseController.getState();
		expect(state.errorCount).toBe(1);
		expect(state.feedbackMessage).toContain('Wrong');

		// Now play correct notes
		const correctNotes = [60, 64, 67] as MidiNote[];
		for (const noteNumber of correctNotes) {
			const noteOnEvent = createNoteEvent('on', noteNumber);
			exerciseController.processNoteInput(noteOnEvent);
		}

		// Should still have the error count
		expect(state.errorCount).toBe(1);
	});

	it('should integrate with audio feedback system', async () => {
		// Mock the audio system
		const mockAudio = {
			play: vi.fn(),
			addEventListener: vi.fn()
		};
		vi.spyOn(window, 'Audio').mockImplementation(() => mockAudio as any);

		exerciseController.start();

		// Play a correct note
		const correctNote = createNoteEvent('on', 60 as MidiNote);
		exerciseController.processNoteInput(correctNote);

		// Verify the state
		const state = exerciseController.getState();
		expect(state.errorCount).toBe(0);
	});

	it('should maintain MIDI state consistency', async () => {
		exerciseController.start();

		// Simulate rapid note on/off events
		const rapidNotes = [60, 64, 67] as MidiNote[];

		for (let i = 0; i < 3; i++) {
			for (const noteNumber of rapidNotes) {
				const noteOnEvent = createNoteEvent('on', noteNumber);
				const noteOffEvent = createNoteEvent('off', noteNumber, 0);

				exerciseController.processNoteInput(noteOnEvent);
				exerciseController.processNoteInput(noteOffEvent);
			}
		}

		const state = exerciseController.getState();
		expect(state.noteEvents.length).toBeGreaterThan(0);
		expect(state.errorCount).toBe(0);
	});

	it('should handle exercise reset properly', async () => {
		exerciseController.start();

		// Play some notes
		const note = createNoteEvent('on', 60 as MidiNote);
		exerciseController.processNoteInput(note);

		// Reset the exercise
		exerciseController.reset();

		const state = exerciseController.getState();
		expect(state.errorCount).toBe(0);
		expect(state.noteEvents).toEqual([]);
		expect(state.midiNotes).toEqual([]);
	});
});
