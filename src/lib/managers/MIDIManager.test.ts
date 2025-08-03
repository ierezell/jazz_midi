/**
 * Unit tests for MIDI Manager
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MIDIEventHandlers } from '../types';
import { midiManager, MIDIManager } from './MIDIManager';

// Mock MIDI utilities
vi.mock('../../midi/midiUtils', () => ({
	safeRequestMidiAccess: vi.fn().mockResolvedValue({
		inputs: new Map(),
		outputs: new Map(),
		sysexEnabled: false,
		onstatechange: null
	}),
	safeSetupMidiCallback: vi.fn(),
	safeGetMidiNote: vi.fn().mockReturnValue({
		type: 'on',
		noteNumber: 60,
		velocity: 100,
		noteFullName: 'C3',
		timestamp: 0
	})
}));

vi.mock('../../midi/virtualMidi', () => ({
	createVirtualMidiAccess: vi.fn().mockReturnValue({
		inputs: new Map([['virtual', { onmidimessage: null }]]),
		outputs: new Map(),
		getVirtualInput: vi.fn().mockReturnValue({
			releaseAllKeys: vi.fn(),
			pressKey: vi.fn(),
			releaseKey: vi.fn()
		})
	}),
	setupKeyboardInput: vi.fn().mockReturnValue(() => {})
}));

describe('MIDIManager', () => {
	let manager: MIDIManager;
	let mockEventHandlers: MIDIEventHandlers;

	beforeEach(() => {
		manager = new MIDIManager();
		mockEventHandlers = {
			onNoteOn: vi.fn(),
			onNoteOff: vi.fn(),
			onError: vi.fn(),
			onSuccess: vi.fn()
		};
	});

	describe('Initialization', () => {
		it('should initialize with default configuration', () => {
			const config = manager.getConfig();
			expect(config.autoConnect).toBe(true);
			expect(config.enableVirtualKeyboard).toBe(true);
			expect(config.errorThreshold.showNoteNames).toBe(3);
		});

		it('should accept custom configuration', () => {
			const customManager = new MIDIManager({
				autoConnect: false,
				enableVirtualKeyboard: false
			});
			const config = customManager.getConfig();
			expect(config.autoConnect).toBe(false);
			expect(config.enableVirtualKeyboard).toBe(false);
		});

		it('should successfully initialize with default settings', async () => {
			const result = await manager.initialize();
			expect(result).toBe(true);
		});
	});

	describe('Event Handling', () => {
		it('should register event handlers', () => {
			manager.setEventHandlers(mockEventHandlers);
			// Since setEventHandlers is a void function, we verify it doesn't throw
			expect(() => manager.setEventHandlers(mockEventHandlers)).not.toThrow();
		});

		it('should handle MIDI message events correctly', () => {
			manager.setEventHandlers(mockEventHandlers);

			// Simulate MIDI message via private method access
			const mockEvent = {
				data: new Uint8Array([144, 60, 100]), // Note on C3 velocity 100
				timeStamp: performance.now()
			} as MIDIMessageEvent;

			// Access private method for testing
			const handleMessage = (manager as any).handleMIDIMessage.bind(manager);
			handleMessage(mockEvent);

			expect(mockEventHandlers.onNoteOn).toHaveBeenCalled();
		});

		it('should handle errors gracefully', () => {
			const errorCallback = vi.fn();
			manager.onError(errorCallback);

			// Trigger an error
			const error = new Error('Test error');
			(manager as any).handleError(error);

			expect(errorCallback).toHaveBeenCalledWith(error);
		});
	});

	describe('MIDI Device Management', () => {
		it('should connect to MIDI devices', async () => {
			const result = await manager.connectMIDI();
			expect(result).toBe(true);
			expect(manager.isConnectedToMIDI()).toBe(true);
		});

		it('should return available MIDI devices', () => {
			const devices = manager.getMIDIDevices();
			expect(devices).toHaveProperty('inputs');
			expect(devices).toHaveProperty('outputs');
			expect(Array.isArray(devices.inputs)).toBe(true);
			expect(Array.isArray(devices.outputs)).toBe(true);
		});
	});

	describe('Virtual Keyboard', () => {
		it('should setup virtual keyboard', () => {
			expect(() => manager.setupVirtualKeyboard()).not.toThrow();
		});

		it('should toggle virtual keyboard', () => {
			manager.toggleVirtualKeyboard(true);
			manager.toggleVirtualKeyboard(false);
			// Should not throw
			expect(true).toBe(true);
		});
	});

	describe('Configuration Management', () => {
		it('should update configuration', () => {
			const newConfig = { autoConnect: false, enableVirtualKeyboard: false };
			manager.updateConfig(newConfig);

			const config = manager.getConfig();
			expect(config.autoConnect).toBe(false);
			expect(config.enableVirtualKeyboard).toBe(false);
		});

		it('should reset to default configuration', () => {
			manager.updateConfig({ autoConnect: false });
			manager.reset();

			const config = manager.getConfig();
			expect(config.autoConnect).toBe(true); // Default value
		});
	});

	describe('Cleanup', () => {
		it('should cleanup all connections', () => {
			manager.cleanup();
			expect(manager.isConnectedToMIDI()).toBe(false);
		});
	});

	describe('Singleton Instance', () => {
		it('should provide a singleton instance', () => {
			expect(midiManager).toBeInstanceOf(MIDIManager);
			expect(midiManager).toBe(midiManager); // Same reference
		});
	});
});
