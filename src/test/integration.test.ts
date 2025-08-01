import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MidiNote, NoteEvent } from '../midi/midi';
import { chords, getScale } from '../midi/midi';
import { FrequencyCalculator, IntervalCalculator, safeGetMidiNote } from '../midi/midiUtils';
import { MockMIDIKeyboard } from '../test/mockMIDI';

describe('MIDI Integration Tests', () => {
	let mockKeyboard: MockMIDIKeyboard;
	let capturedEvents: NoteEvent[];

	beforeEach(() => {
		mockKeyboard = new MockMIDIKeyboard();
		capturedEvents = [];
		
		// Set up event capture
		mockKeyboard.addNoteEventCallback((event) => {
			capturedEvents.push(event);
		});
	});

	describe('Complete MIDI Workflow', () => {
		it('should handle a complete musical performance', async () => {
			// 1. Play a C major chord
			const cMajorChord = chords(72 as MidiNote, 'major');
			const chordNotes = [cMajorChord.root, cMajorChord.third, cMajorChord.fifth];
			
			mockKeyboard.playChord(chordNotes, 100);
			
			// Verify chord was captured
			expect(capturedEvents).toHaveLength(3);
			expect(capturedEvents.every(e => e.type === 'on')).toBe(true);
			expect(capturedEvents.map(e => e.noteNumber)).toEqual(expect.arrayContaining(chordNotes));

			// 2. Play a melody
			const melody = [
				{ note: 72 as MidiNote, duration: 100 }, // C
				{ note: 74 as MidiNote, duration: 100 }, // D
				{ note: 76 as MidiNote, duration: 100 }, // E
				{ note: 77 as MidiNote, duration: 100 }  // F
			];

			mockKeyboard.releaseAllKeys();
			capturedEvents.length = 0; // Clear events

			await mockKeyboard.playSequence(melody);

			// Should have captured note on/off for each note
			expect(capturedEvents).toHaveLength(8); // 4 notes * 2 events each
			
			const noteOnEvents = capturedEvents.filter(e => e.type === 'on');
			const noteOffEvents = capturedEvents.filter(e => e.type === 'off');
			
			expect(noteOnEvents).toHaveLength(4);
			expect(noteOffEvents).toHaveLength(4);
		});

		it('should handle chord progressions correctly', () => {
			// Test a ii-V-I progression in C major
			const dMinor = chords(62 as MidiNote, 'minor'); // D minor
			const g7 = chords(67 as MidiNote, '7'); // G7
			const cMajor = chords(72 as MidiNote, 'major'); // C major

			const progression = [dMinor, g7, cMajor];

			progression.forEach((chord, index) => {
				capturedEvents.length = 0; // Clear previous events
				
				const chordNotes = [chord.root, chord.third, chord.fifth];
				if (chord.seventh) chordNotes.push(chord.seventh);
				
				mockKeyboard.playChord(chordNotes, 100);
				
				expect(capturedEvents).toHaveLength(chordNotes.length);
				expect(capturedEvents.every(e => e.type === 'on')).toBe(true);
				
				mockKeyboard.releaseAllKeys();
			});
		});
	});

	describe('Scale Performance Tests', () => {
		it('should play major scales correctly', () => {
			const cMajorScale = getScale(72 as MidiNote, [2, 2, 1, 2, 2, 2, 1]);
			
			cMajorScale.slice(0, 8).forEach((noteName, index) => {
				const midiNote = 72 + [0, 2, 4, 5, 7, 9, 11, 12][index] as MidiNote;
				
				capturedEvents.length = 0;
				mockKeyboard.pressKey(midiNote, 100);
				
				expect(capturedEvents).toHaveLength(1);
				expect(capturedEvents[0].noteFullName).toBe(noteName);
				expect(capturedEvents[0].type).toBe('on');
				
				mockKeyboard.releaseKey(midiNote);
			});
		});
	});

	describe('Advanced MIDI Features', () => {
		it('should handle control change messages', () => {
			const callback = vi.fn();
			mockKeyboard.setMIDICallback(callback);

			// Test sustain pedal
			mockKeyboard.sendControlChange(64, 127); // Sustain on
			mockKeyboard.sendControlChange(64, 0);   // Sustain off

			expect(callback).toHaveBeenCalledTimes(2);
			
			// Verify control change message format
			const firstCall = callback.mock.calls[0][0];
			expect(firstCall.data[0]).toBe(0xB0); // Control change on channel 0
			expect(firstCall.data[1]).toBe(64);   // Sustain pedal controller
			expect(firstCall.data[2]).toBe(127);  // Value
		});

		it('should handle different MIDI channels', () => {
			capturedEvents.length = 0;

			// Play same note on different channels
			mockKeyboard.pressKey(60 as MidiNote, 100, 0); // Channel 0
			mockKeyboard.pressKey(60 as MidiNote, 100, 1); // Channel 1

			expect(capturedEvents).toHaveLength(2);
			expect(capturedEvents.every(e => e.noteNumber === 60)).toBe(true);
		});

		it('should handle velocity sensitivity', () => {
			const velocities = [32, 64, 96, 127];
			
			velocities.forEach(velocity => {
				capturedEvents.length = 0;
				mockKeyboard.pressKey(60 as MidiNote, velocity);
				
				expect(capturedEvents).toHaveLength(1);
				expect(capturedEvents[0].velocity).toBe(velocity);
				
				mockKeyboard.releaseKey(60 as MidiNote);
			});
		});
	});

	describe('Error Handling Integration', () => {
		it('should gracefully handle invalid MIDI messages', () => {
			const callback = vi.fn();
			mockKeyboard.setMIDICallback((event) => {
				const result = safeGetMidiNote(event);
				callback(result);
			});

			// This should work fine
			mockKeyboard.pressKey(60 as MidiNote, 100);
			expect(callback).toHaveBeenCalledWith(expect.objectContaining({
				noteNumber: 60,
				type: 'on'
			}));

			// Test invalid velocity (this should be caught by MockMIDIKeyboard validation)
			expect(() => mockKeyboard.pressKey(60 as MidiNote, 200)).toThrow();
		});
	});

	describe('Musical Theory Integration', () => {
		it('should demonstrate frequency calculations', () => {
			// Play A4 (440 Hz)
			mockKeyboard.pressKey(69 as MidiNote, 100);
			
			expect(capturedEvents).toHaveLength(1);
			expect(capturedEvents[0].noteNumber).toBe(69);
			
			// Calculate frequency
			const frequency = FrequencyCalculator.midiToFrequency(69 as MidiNote);
			expect(frequency).toBeCloseTo(440, 1);
		});

		it('should demonstrate interval calculations', () => {
			const c4 = 72 as MidiNote;
			const e4 = 76 as MidiNote;
			
			// Play major third interval
			mockKeyboard.pressKey(c4, 100);
			mockKeyboard.pressKey(e4, 100);
			
			expect(capturedEvents).toHaveLength(2);
			
			// Calculate interval
			const interval = IntervalCalculator.getInterval(c4, e4);
			expect(interval).toBe(4); // Major third
			
			const intervalName = IntervalCalculator.getIntervalName(interval);
			expect(intervalName).toBe('majorThird');
		});

		it('should handle chord inversions correctly', () => {
			// Test C major chord in different inversions
			const inversions = [0, 1, 2] as const;
			
			inversions.forEach(inversion => {
				const chord = chords(72 as MidiNote, 'major', inversion);
				const chordNotes = [chord.root, chord.third, chord.fifth];
				
				capturedEvents.length = 0;
				mockKeyboard.playChord(chordNotes, 100);
				
				expect(capturedEvents).toHaveLength(3);
				expect(chord.inversion).toBe(inversion);
				
				mockKeyboard.releaseAllKeys();
			});
		});
	});

	describe('Performance and Timing', () => {
		it('should handle rapid note sequences', async () => {
			const rapidSequence = Array.from({ length: 20 }, (_, i) => ({
				note: (60 + i % 12) as MidiNote,
				duration: 10, // Very short duration
				velocity: 100
			}));

			capturedEvents.length = 0;
			await mockKeyboard.playSequence(rapidSequence);

			// Should capture all note events
			expect(capturedEvents).toHaveLength(40); // 20 notes * 2 events each
			
			// Verify timing is reasonable
			const timestamps = capturedEvents.map(e => e.time);
			expect(Math.max(...timestamps) - Math.min(...timestamps)).toBeGreaterThan(0);
		});

		it('should handle simultaneous note releases', () => {
			// Press multiple keys
			const notes = [60, 64, 67] as MidiNote[];
			notes.forEach(note => mockKeyboard.pressKey(note, 100));
			
			expect(mockKeyboard.getPressedKeys()).toHaveLength(3);
			
			capturedEvents.length = 0;
			mockKeyboard.releaseAllKeys();
			
			expect(capturedEvents).toHaveLength(3);
			expect(capturedEvents.every(e => e.type === 'off')).toBe(true);
			expect(mockKeyboard.getPressedKeys()).toHaveLength(0);
		});
	});
});
