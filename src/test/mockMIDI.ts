import { type MidiNote, type NoteEvent, getMidiNote } from '../midi/midi';

export interface MockMIDIDevice {
	id: string;
	name: string;
	manufacturer: string;
	version: string;
	type: 'input' | 'output';
	state: 'connected' | 'disconnected';
	connection: 'open' | 'closed' | 'pending';
}

export interface MockMIDIInput extends MockMIDIDevice {
	type: 'input';
	onmidimessage: ((event: MIDIMessageEvent) => void) | null;
}

export interface MockMIDIOutput extends MockMIDIDevice {
	type: 'output';
	send: (data: Uint8Array, timestamp?: number) => void;
}

export interface MockMIDIAccess {
	inputs: Map<string, MockMIDIInput>;
	outputs: Map<string, MockMIDIOutput>;
	sysexEnabled: boolean;
	onstatechange: ((event: MIDIConnectionEvent) => void) | null;
}

/**
 * Mock MIDI keyboard for testing MIDI functionality without physical hardware
 */
export class MockMIDIKeyboard {
	private inputs: Map<string, MockMIDIInput> = new Map();
	private outputs: Map<string, MockMIDIOutput> = new Map();
	private pressedKeys: Set<MidiNote> = new Set();
	private midiAccess: MockMIDIAccess;
	private eventCallbacks: ((event: NoteEvent) => void)[] = [];

	constructor() {
		// Create a default mock input device
		const defaultInput: MockMIDIInput = {
			id: 'mock-keyboard-input',
			name: 'Mock MIDI Keyboard',
			manufacturer: 'Jazz MIDI Test',
			version: '1.0.0',
			type: 'input',
			state: 'connected',
			connection: 'open',
			onmidimessage: null
		};

		this.inputs.set(defaultInput.id, defaultInput);

		this.midiAccess = {
			inputs: this.inputs,
			outputs: this.outputs,
			sysexEnabled: false,
			onstatechange: null
		};
	}

	/**
	 * Get the mock MIDI access object
	 */
	getMIDIAccess(): MockMIDIAccess {
		return this.midiAccess;
	}

	/**
	 * Set a callback for MIDI message events
	 */
	setMIDICallback(callback: (event: MIDIMessageEvent) => void): void {
		this.inputs.forEach(input => {
			input.onmidimessage = callback;
		});
	}

	/**
	 * Add a callback for processed note events
	 */
	addNoteEventCallback(callback: (event: NoteEvent) => void): void {
		this.eventCallbacks.push(callback);
	}

	/**
	 * Simulate pressing a key
	 */
	pressKey(noteNumber: MidiNote, velocity: number = 100, channel: number = 0): void {
		if (velocity < 0 || velocity > 127) {
			throw new Error('Velocity must be between 0 and 127');
		}
		if (channel < 0 || channel > 15) {
			throw new Error('Channel must be between 0 and 15');
		}

		this.pressedKeys.add(noteNumber);
		const message = this.createMIDIMessage(0x90 | channel, noteNumber, velocity);
		this.sendMIDIMessage(message);
	}

	/**
	 * Simulate releasing a key
	 */
	releaseKey(noteNumber: MidiNote, channel: number = 0): void {
		if (channel < 0 || channel > 15) {
			throw new Error('Channel must be between 0 and 15');
		}

		this.pressedKeys.delete(noteNumber);
		const message = this.createMIDIMessage(0x80 | channel, noteNumber, 0);
		this.sendMIDIMessage(message);
	}

	/**
	 * Release all currently pressed keys
	 */
	releaseAllKeys(): void {
		const keysToRelease = Array.from(this.pressedKeys);
		keysToRelease.forEach(key => this.releaseKey(key));
	}

	/**
	 * Get currently pressed keys
	 */
	getPressedKeys(): MidiNote[] {
		return Array.from(this.pressedKeys);
	}

	/**
	 * Simulate playing a chord
	 */
	playChord(notes: MidiNote[], velocity: number = 100, channel: number = 0): void {
		notes.forEach(note => this.pressKey(note, velocity, channel));
	}

	/**
	 * Simulate releasing a chord
	 */
	releaseChord(notes: MidiNote[], channel: number = 0): void {
		notes.forEach(note => this.releaseKey(note, channel));
	}

	/**
	 * Simulate playing a sequence of notes
	 */
	async playSequence(
		notes: { note: MidiNote; duration: number; velocity?: number }[],
		channel: number = 0
	): Promise<void> {
		for (const { note, duration, velocity = 100 } of notes) {
			this.pressKey(note, velocity, channel);
			await new Promise(resolve => setTimeout(resolve, duration));
			this.releaseKey(note, channel);
		}
	}

	/**
	 * Simulate control change messages (for testing controllers like sustain pedal)
	 */
	sendControlChange(controller: number, value: number, channel: number = 0): void {
		if (controller < 0 || controller > 127) {
			throw new Error('Controller number must be between 0 and 127');
		}
		if (value < 0 || value > 127) {
			throw new Error('Controller value must be between 0 and 127');
		}
		if (channel < 0 || channel > 15) {
			throw new Error('Channel must be between 0 and 15');
		}

		const message = this.createMIDIMessage(0xB0 | channel, controller, value);
		this.sendMIDIMessage(message);
	}

	/**
	 * Add a new mock input device
	 */
	addInputDevice(device: Partial<MockMIDIInput>): MockMIDIInput {
		const fullDevice: MockMIDIInput = {
			id: device.id || `mock-input-${Date.now()}`,
			name: device.name || 'Mock Input Device',
			manufacturer: device.manufacturer || 'Jazz MIDI Test',
			version: device.version || '1.0.0',
			type: 'input',
			state: device.state || 'connected',
			connection: device.connection || 'open',
			onmidimessage: null
		};

		this.inputs.set(fullDevice.id, fullDevice);
		return fullDevice;
	}

	/**
	 * Remove a mock input device
	 */
	removeInputDevice(id: string): boolean {
		return this.inputs.delete(id);
	}

	/**
	 * Simulate device connection/disconnection
	 */
	setDeviceState(id: string, state: 'connected' | 'disconnected'): void {
		const device = this.inputs.get(id);
		if (device) {
			device.state = state;
			if (this.midiAccess.onstatechange) {
				// Create a mock connection event
				const event = {
					port: device
				} as unknown as MIDIConnectionEvent;
				this.midiAccess.onstatechange(event);
			}
		}
	}

	private createMIDIMessage(status: number, data1: number, data2: number): MIDIMessageEvent {
		return {
			data: new Uint8Array([status, data1, data2]),
			timeStamp: performance.now()
		} as MIDIMessageEvent;
	}

	private sendMIDIMessage(message: MIDIMessageEvent): void {
		// Send to all input devices
		this.inputs.forEach(input => {
			if (input.onmidimessage && input.state === 'connected') {
				input.onmidimessage(message);
			}
		});

		// Process and send to note event callbacks
		try {
			const noteEvent = getMidiNote(message);
			this.eventCallbacks.forEach(callback => callback(noteEvent));
		} catch (error) {
			console.warn('Error processing MIDI message:', error);
		}
	}
}

/**
 * Factory function to create a mock MIDI access object
 */
export function createMockMIDIAccess(): Promise<MockMIDIAccess> {
	const keyboard = new MockMIDIKeyboard();
	return Promise.resolve(keyboard.getMIDIAccess());
}

/**
 * Mock the Web MIDI API navigator.requestMIDIAccess function
 */
export function mockWebMIDIAPI(): MockMIDIKeyboard {
	const keyboard = new MockMIDIKeyboard();
	
	// Replace the navigator.requestMIDIAccess function
	Object.defineProperty(navigator, 'requestMIDIAccess', {
		writable: true,
		value: () => Promise.resolve(keyboard.getMIDIAccess())
	});

	return keyboard;
}
