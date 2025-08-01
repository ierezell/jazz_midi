import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type MidiNote } from '../midi/midi';
import { MockMIDIKeyboard, createMockMIDIAccess, mockWebMIDIAPI } from './mockMIDI';

describe('Mock MIDI Keyboard', () => {
	let mockKeyboard: MockMIDIKeyboard;

	beforeEach(() => {
		mockKeyboard = new MockMIDIKeyboard();
	});

	describe('Basic Functionality', () => {
		it('should create a mock keyboard with default input device', () => {
			const midiAccess = mockKeyboard.getMIDIAccess();
			expect(midiAccess.inputs.size).toBe(1);
			
			const defaultInput = Array.from(midiAccess.inputs.values())[0];
			expect(defaultInput.name).toBe('Mock MIDI Keyboard');
			expect(defaultInput.type).toBe('input');
			expect(defaultInput.state).toBe('connected');
		});

		it('should handle MIDI callback setup', () => {
			const callback = vi.fn();
			mockKeyboard.setMIDICallback(callback);
			
			const midiAccess = mockKeyboard.getMIDIAccess();
			const input = Array.from(midiAccess.inputs.values())[0];
			expect(input.onmidimessage).toBe(callback);
		});
	});

	describe('Key Press Simulation', () => {
		it('should simulate key press and release', () => {
			const callback = vi.fn();
			mockKeyboard.setMIDICallback(callback);

			// Press C4 (MIDI note 72)
			mockKeyboard.pressKey(72 as MidiNote, 100);
			expect(callback).toHaveBeenCalledTimes(1);
			expect(mockKeyboard.getPressedKeys()).toContain(72);

			// Release C4
			mockKeyboard.releaseKey(72 as MidiNote);
			expect(callback).toHaveBeenCalledTimes(2);
			expect(mockKeyboard.getPressedKeys()).not.toContain(72);
		});

		it('should validate velocity range', () => {
			expect(() => mockKeyboard.pressKey(72 as MidiNote, -1)).toThrow('Velocity must be between 0 and 127');
			expect(() => mockKeyboard.pressKey(72 as MidiNote, 128)).toThrow('Velocity must be between 0 and 127');
		});

		it('should validate channel range', () => {
			expect(() => mockKeyboard.pressKey(72 as MidiNote, 100, -1)).toThrow('Channel must be between 0 and 15');
			expect(() => mockKeyboard.pressKey(72 as MidiNote, 100, 16)).toThrow('Channel must be between 0 and 15');
		});

		it('should track multiple pressed keys', () => {
			mockKeyboard.pressKey(60 as MidiNote); // C3
			mockKeyboard.pressKey(64 as MidiNote); // E3
			mockKeyboard.pressKey(67 as MidiNote); // G3

			const pressedKeys = mockKeyboard.getPressedKeys();
			expect(pressedKeys).toHaveLength(3);
			expect(pressedKeys).toContain(60);
			expect(pressedKeys).toContain(64);
			expect(pressedKeys).toContain(67);
		});

		it('should release all keys', () => {
			mockKeyboard.pressKey(60 as MidiNote);
			mockKeyboard.pressKey(64 as MidiNote);
			mockKeyboard.pressKey(67 as MidiNote);

			expect(mockKeyboard.getPressedKeys()).toHaveLength(3);

			mockKeyboard.releaseAllKeys();
			expect(mockKeyboard.getPressedKeys()).toHaveLength(0);
		});
	});

	describe('Chord Simulation', () => {
		it('should play and release chords', () => {
			const callback = vi.fn();
			mockKeyboard.setMIDICallback(callback);

			const cMajorChord = [60, 64, 67] as MidiNote[]; // C, E, G
			
			mockKeyboard.playChord(cMajorChord, 100);
			expect(callback).toHaveBeenCalledTimes(3);
			expect(mockKeyboard.getPressedKeys()).toHaveLength(3);

			mockKeyboard.releaseChord(cMajorChord);
			expect(callback).toHaveBeenCalledTimes(6);
			expect(mockKeyboard.getPressedKeys()).toHaveLength(0);
		});
	});

	describe('Note Event Processing', () => {
		it('should process note events correctly', () => {
			const noteEvents: any[] = [];
			mockKeyboard.addNoteEventCallback((event) => noteEvents.push(event));

			mockKeyboard.pressKey(72 as MidiNote, 100); // C4
			mockKeyboard.releaseKey(72 as MidiNote);

			expect(noteEvents).toHaveLength(2);
			
			const noteOn = noteEvents[0];
			expect(noteOn.type).toBe('on');
			expect(noteOn.noteNumber).toBe(72);
			expect(noteOn.noteFullName).toBe('C4');
			expect(noteOn.noteName).toBe('C');
			expect(noteOn.velocity).toBe(100);

			const noteOff = noteEvents[1];
			expect(noteOff.type).toBe('off');
			expect(noteOff.noteNumber).toBe(72);
		});
	});

	describe('Control Change Messages', () => {
		it('should send control change messages', () => {
			const callback = vi.fn();
			mockKeyboard.setMIDICallback(callback);

			// Send sustain pedal down (CC 64, value 127)
			mockKeyboard.sendControlChange(64, 127);
			expect(callback).toHaveBeenCalledWith(
				expect.objectContaining({
					data: new Uint8Array([0xB0, 64, 127])
				})
			);
		});

		it('should validate control change parameters', () => {
			expect(() => mockKeyboard.sendControlChange(-1, 127)).toThrow('Controller number must be between 0 and 127');
			expect(() => mockKeyboard.sendControlChange(128, 127)).toThrow('Controller number must be between 0 and 127');
			expect(() => mockKeyboard.sendControlChange(64, -1)).toThrow('Controller value must be between 0 and 127');
			expect(() => mockKeyboard.sendControlChange(64, 128)).toThrow('Controller value must be between 0 and 127');
		});
	});

	describe('Device Management', () => {
		it('should add input devices', () => {
			const newDevice = mockKeyboard.addInputDevice({
				name: 'Test Device',
				manufacturer: 'Test Manufacturer'
			});

			expect(newDevice.name).toBe('Test Device');
			expect(newDevice.manufacturer).toBe('Test Manufacturer');
			expect(mockKeyboard.getMIDIAccess().inputs.size).toBe(2);
		});

		it('should remove input devices', () => {
			const device = mockKeyboard.addInputDevice({ name: 'Temp Device' });
			expect(mockKeyboard.getMIDIAccess().inputs.size).toBe(2);

			const removed = mockKeyboard.removeInputDevice(device.id);
			expect(removed).toBe(true);
			expect(mockKeyboard.getMIDIAccess().inputs.size).toBe(1);
		});

		it('should simulate device state changes', () => {
			const stateChangeCallback = vi.fn();
			const midiAccess = mockKeyboard.getMIDIAccess();
			midiAccess.onstatechange = stateChangeCallback;

			const device = mockKeyboard.addInputDevice({ name: 'Test Device' });
			mockKeyboard.setDeviceState(device.id, 'disconnected');

			expect(stateChangeCallback).toHaveBeenCalledWith(
				expect.objectContaining({
					port: expect.objectContaining({
						id: device.id,
						state: 'disconnected'
					})
				})
			);
		});
	});

	describe('Sequence Playing', () => {
		it('should play note sequences', async () => {
			const noteEvents: any[] = [];
			mockKeyboard.addNoteEventCallback((event) => noteEvents.push(event));

			const sequence = [
				{ note: 60 as MidiNote, duration: 10, velocity: 100 },
				{ note: 64 as MidiNote, duration: 10, velocity: 100 },
				{ note: 67 as MidiNote, duration: 10, velocity: 100 }
			];

			await mockKeyboard.playSequence(sequence);

			// Should have note on and note off for each note
			expect(noteEvents).toHaveLength(6);
			expect(noteEvents.filter(e => e.type === 'on')).toHaveLength(3);
			expect(noteEvents.filter(e => e.type === 'off')).toHaveLength(3);
		});
	});
});

describe('Mock MIDI API Integration', () => {
	it('should create mock MIDI access', async () => {
		const midiAccess = await createMockMIDIAccess();
		expect(midiAccess.inputs.size).toBe(1);
		expect(midiAccess.sysexEnabled).toBe(false);
	});

	it('should mock the Web MIDI API', () => {
		const mockKeyboard = mockWebMIDIAPI();
		expect(navigator.requestMIDIAccess).toBeDefined();
		
		// Test that the mocked function returns our mock keyboard's access
		navigator.requestMIDIAccess().then(access => {
			expect(access).toBe(mockKeyboard.getMIDIAccess());
		});
	});
});
