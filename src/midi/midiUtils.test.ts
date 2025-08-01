import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MidiNote } from './midi';
import {
    ChordProgressionBuilder,
    FrequencyCalculator,
    IntervalCalculator,
    isValidMidiNote,
    isValidNote,
    MIDIPerformanceMonitor,
    safeGetMidiFromNote,
    safeGetMidiNote,
    safeGetNoteName,
    safeRequestMidiAccess
} from './midiUtils';

describe('MIDI Utils', () => {
	describe('Validation Functions', () => {
		it('should validate MIDI notes correctly', () => {
			expect(isValidMidiNote(60)).toBe(true);
			expect(isValidMidiNote(127)).toBe(true);
			expect(isValidMidiNote(24)).toBe(true);
			expect(isValidMidiNote(128)).toBe(true);
			
			expect(isValidMidiNote(23)).toBe(false);
			expect(isValidMidiNote(129)).toBe(false);
			expect(isValidMidiNote(-1)).toBe(false);
			expect(isValidMidiNote(60.5)).toBe(false);
		});

		it('should validate note names correctly', () => {
			expect(isValidNote('C')).toBe(true);
			expect(isValidNote('C#')).toBe(true);
			expect(isValidNote('Db')).toBe(true);
			expect(isValidNote('B')).toBe(true);
			
			expect(isValidNote('X')).toBe(false);
			expect(isValidNote('C##')).toBe(false);
			expect(isValidNote('')).toBe(false);
		});
	});

	describe('Safe Conversion Functions', () => {
		it('should safely convert MIDI to note name', () => {
			expect(safeGetNoteName(60)).toBe('C3');
			expect(safeGetNoteName(69)).toBe('A3');
			expect(safeGetNoteName(23)).toBe(null); // Invalid MIDI note
			expect(safeGetNoteName(129)).toBe(null); // Invalid MIDI note
		});

		it('should safely convert note name to MIDI', () => {
			expect(safeGetMidiFromNote('C3')).toBe(60);
			expect(safeGetMidiFromNote('A3')).toBe(69);
			expect(safeGetMidiFromNote('InvalidNote')).toBe(null);
		});
	});

	describe('Safe MIDI Access', () => {
		it('should handle missing Web MIDI API gracefully', async () => {
			// Skip this test as mocking navigator is complex in test environment
			const mockNavigator = {
				requestMIDIAccess: undefined
			};
			
			// Test our function with a navigator that doesn't have requestMIDIAccess
			const originalConsoleWarn = console.warn;
			console.warn = vi.fn();
			
			// Simulate missing API by temporarily replacing navigator
			const originalNav = global.navigator;
			// @ts-ignore
			global.navigator = mockNavigator;
			
			const result = await safeRequestMidiAccess();
			expect(result).toBe(null);
			expect(console.warn).toHaveBeenCalledWith('Web MIDI API not supported in this browser');
			
			// Restore
			global.navigator = originalNav;
			console.warn = originalConsoleWarn;
		});

		it('should handle MIDI access errors gracefully', async () => {
			const mockError = new Error('MIDI access denied');
			navigator.requestMIDIAccess = vi.fn().mockRejectedValue(mockError);

			const result = await safeRequestMidiAccess();
			expect(result).toBe(null);
		});
	});

	describe('Safe MIDI Message Parsing', () => {
		it('should parse valid MIDI messages', () => {
			const mockEvent = {
				data: new Uint8Array([0x90, 60, 100]),
				timeStamp: Date.now()
			} as MIDIMessageEvent;

			const result = safeGetMidiNote(mockEvent);
			expect(result).toBeTruthy();
			expect(result?.noteNumber).toBe(60);
			expect(result?.type).toBe('on');
			expect(result?.velocity).toBe(100);
		});

		it('should handle invalid MIDI messages', () => {
			// Invalid data array
			const invalidEvent1 = {
				data: new Uint8Array([0x90]), // Too short
				timeStamp: Date.now()
			} as MIDIMessageEvent;

			const result1 = safeGetMidiNote(invalidEvent1);
			expect(result1).toBe(null);

			// Invalid note number
			const invalidEvent2 = {
				data: new Uint8Array([0x90, 200, 100]), // Note 200 is out of range
				timeStamp: Date.now()
			} as MIDIMessageEvent;

			const result2 = safeGetMidiNote(invalidEvent2);
			expect(result2).toBe(null);

			// Invalid velocity
			const invalidEvent3 = {
				data: new Uint8Array([0x90, 60, 200]), // Velocity 200 is out of range
				timeStamp: Date.now()
			} as MIDIMessageEvent;

			const result3 = safeGetMidiNote(invalidEvent3);
			expect(result3).toBe(null);
		});

		it('should handle non-note MIDI messages', () => {
			const controlChangeEvent = {
				data: new Uint8Array([0xB0, 64, 127]), // Control change
				timeStamp: Date.now()
			} as MIDIMessageEvent;

			const result = safeGetMidiNote(controlChangeEvent);
			expect(result).toBe(null); // Should return null for non-note messages
		});
	});

	describe('Frequency Calculator', () => {
		it('should convert MIDI notes to frequencies correctly', () => {
			expect(FrequencyCalculator.midiToFrequency(69 as MidiNote)).toBeCloseTo(440, 1); // A4
			expect(FrequencyCalculator.midiToFrequency(60 as MidiNote)).toBeCloseTo(261.63, 1); // C4
			expect(FrequencyCalculator.midiToFrequency(81 as MidiNote)).toBeCloseTo(880, 1); // A5
		});

		it('should convert frequencies to MIDI notes correctly', () => {
			expect(FrequencyCalculator.frequencyToMidi(440)).toBe(69); // A4
			expect(FrequencyCalculator.frequencyToMidi(261.63)).toBe(60); // C4
			expect(FrequencyCalculator.frequencyToMidi(0)).toBe(null); // Invalid frequency
			expect(FrequencyCalculator.frequencyToMidi(-1)).toBe(null); // Invalid frequency
		});
	});

	describe('Interval Calculator', () => {
		it('should calculate intervals correctly', () => {
			expect(IntervalCalculator.getInterval(60 as MidiNote, 64 as MidiNote)).toBe(4); // Major third
			expect(IntervalCalculator.getInterval(60 as MidiNote, 67 as MidiNote)).toBe(7); // Perfect fifth
		});

		it('should add intervals correctly', () => {
			expect(IntervalCalculator.addInterval(60 as MidiNote, 4)).toBe(64); // C + major third = E
			expect(IntervalCalculator.addInterval(60 as MidiNote, 7)).toBe(67); // C + perfect fifth = G
			expect(IntervalCalculator.addInterval(120 as MidiNote, 20)).toBe(null); // Would exceed range
		});

		it('should identify interval names', () => {
			expect(IntervalCalculator.getIntervalName(0)).toBe('unison');
			expect(IntervalCalculator.getIntervalName(4)).toBe('majorThird');
			expect(IntervalCalculator.getIntervalName(7)).toBe('perfectFifth');
			expect(IntervalCalculator.getIntervalName(12)).toBe('unison'); // 12 % 12 = 0
			expect(IntervalCalculator.getIntervalName(13)).toBe('minorSecond'); // 13 % 12 = 1
		});
	});

	describe('Chord Progression Builder', () => {
		it('should generate common progressions', () => {
			const progression = ChordProgressionBuilder.generateProgression('C', [1, 5, 6, 4]);
			expect(progression).toHaveLength(4);
			expect(progression[0].root).toBe('C');
			expect(progression[0].chordType).toBe('major');
		});

		it('should have predefined common progressions', () => {
			expect(ChordProgressionBuilder.commonProgressions.I_V_vi_IV).toEqual([1, 5, 6, 4]);
			expect(ChordProgressionBuilder.commonProgressions.ii_V_I).toEqual([2, 5, 1]);
		});
	});

	describe('Performance Monitor', () => {
		beforeEach(() => {
			MIDIPerformanceMonitor.reset();
		});

		it('should record and retrieve statistics', () => {
			MIDIPerformanceMonitor.recordEvent('noteOn');
			MIDIPerformanceMonitor.recordEvent('noteOn');
			MIDIPerformanceMonitor.recordEvent('noteOff');

			const stats = MIDIPerformanceMonitor.getStatistics();
			expect(stats.noteOn_total).toBe(2);
			expect(stats.noteOff_total).toBe(1);
			expect(stats.noteOn_per_second).toBeGreaterThan(0);
		});

		it('should reset statistics', () => {
			MIDIPerformanceMonitor.recordEvent('noteOn');
			MIDIPerformanceMonitor.reset();

			const stats = MIDIPerformanceMonitor.getStatistics();
			expect(Object.keys(stats)).toHaveLength(0);
		});
	});
});
