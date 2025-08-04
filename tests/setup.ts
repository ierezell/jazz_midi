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

// Mock HTMLAudioElement
(global as any).HTMLAudioElement = class MockAudio {
	src = '';
	volume = 1;
	currentTime = 0;
	paused = true;

	play = vi.fn().mockResolvedValue(undefined);
	pause = vi.fn();
	load = vi.fn();
	addEventListener = vi.fn();
	removeEventListener = vi.fn();

	constructor(src?: string) {
		this.src = src || '';
	}
};

// Mock Audio constructor
(global as any).Audio = (global as any).HTMLAudioElement;

// Mock window.matchMedia for responsive testing
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn()
	}))
});
