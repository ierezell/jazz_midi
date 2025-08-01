import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Web MIDI API
Object.defineProperty(navigator, 'requestMIDIAccess', {
	writable: true,
	value: vi.fn()
});

// Mock Audio Context
global.AudioContext = vi.fn().mockImplementation(() => ({
	createOscillator: vi.fn().mockReturnValue({
		connect: vi.fn(),
		start: vi.fn(),
		stop: vi.fn(),
		frequency: { value: 0 }
	}),
	createGain: vi.fn().mockReturnValue({
		connect: vi.fn(),
		gain: { value: 0 }
	}),
	destination: {}
}));
