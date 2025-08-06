import { MidiToNote, NoteToMidi } from './types/notes.constants';
import type { MIDIEventHandlers, MidiNote, Note, NoteEvent } from './types/types';

import { createVirtualMidiAccess, setupKeyboardInput, type VirtualMidiInput } from './virtualMidi';

import { AllChordTypes, AllMidiNotes, AllNotes } from './types/notes.constants';
export type { ChordType, MidiNote, Note, NoteEvent, NoteFullName } from './types/types';
export { AllChordTypes, AllMidiNotes, AllNotes, MidiToNote, NoteToMidi };

export class MIDIManager {
	public midiAccess: MIDIAccess | null = null;
	private virtualMidi: VirtualMidiInput | null = null;
	private keyboardCleanup: (() => void) | null = null;
	private eventHandlers: Partial<MIDIEventHandlers> = {};

	private errorCallbacks: ((error: Error) => void)[] = [];
	private debugMode = false;

	constructor() {}

	async initialize(): Promise<boolean> {
		try {
			await this.connectMIDI();
			return true;
		} catch (error) {
			this.handleError(error as Error);
			return false;
		}
	}

	async connectMIDI(): Promise<boolean> {
		try {
			this.midiAccess = await this.safeRequestMidiAccess({ sysex: false });
			if (!this.midiAccess) {
				throw new Error('Failed to obtain MIDI access');
			}
			this.safeSetupMidiCallback(
				this.midiAccess,
				this.handleMIDIMessage.bind(this),
				this.handleError.bind(this)
			);

			console.log('MIDI Manager: Connected to physical MIDI devices');
			return true;
		} catch (error) {
			this.handleError(error as Error);
			return false;
		}
	}

	private async safeRequestMidiAccess(options?: MIDIOptions): Promise<MIDIAccess | null> {
		try {
			if (!navigator.requestMIDIAccess) {
				console.warn('Web MIDI API not supported in this browser');
				return null;
			}
			const midiAccess = await navigator.requestMIDIAccess(options || { sysex: false });
			console.log('MIDI Access obtained successfully');
			return midiAccess;
		} catch (error) {
			console.error('Failed to obtain MIDI access:', error);
			return null;
		}
	}
	private safeSetupMidiCallback(
		midiAccess: MIDIAccess,
		callback: (event: MIDIMessageEvent) => void,
		errorCallback?: (error: Error) => void
	): void {
		try {
			midiAccess.inputs.forEach((input) => {
				const deviceInfo = `Input port [type:'${input.type}'] id:'${input.id}' manufacturer:'${input.manufacturer}' name:'${input.name}' version:'${input.version}'`;
				console.log(`Setting up MIDI input: ${deviceInfo}`);
				input.onmidimessage = (event) => {
					try {
						callback(event);
					} catch (error) {
						console.error('Error in MIDI message callback:', error);
						if (errorCallback) {
							errorCallback(error as Error);
						}
					}
				};
			});
			midiAccess.onstatechange = (event) => {
				const port = event.port!;
				console.log(`MIDI port state changed: ${port.name} is now ${port.state}`);
			};
		} catch (error) {
			console.error('Error setting up MIDI callback:', error);
			if (errorCallback) {
				errorCallback(error as Error);
			}
		}
	}

	setupVirtualKeyboard(): void {
		try {
			const virtualAccess = createVirtualMidiAccess('Virtual Debug Keyboard');
			this.virtualMidi = virtualAccess.getVirtualInput();
			this.keyboardCleanup = setupKeyboardInput(this.virtualMidi, this.debugMode);
			const virtualInput = Array.from(virtualAccess.inputs.values())[0];
			if (virtualInput) {
				virtualInput.onmidimessage = this.handleMIDIMessage.bind(this);
			}
			console.log('MIDI Manager: Virtual keyboard enabled');
		} catch (error) {
			this.handleError(error as Error);
		}
	}

	private safeGetMidiNote(event: MIDIMessageEvent): NoteEvent | null {
		try {
			if (!event.data || event.data.length < 3) {
				console.warn('Invalid MIDI message data');
				return null;
			}
			const [status, noteNumber, velocity] = event.data;
			const command = status & 0xf0;
			const channel = status & 0x0f;
			if (command !== 0x90 && command !== 0x80) {
				return null;
			}
			if (noteNumber < 24 || noteNumber > 127) {
				console.warn(`MIDI note ${noteNumber} out of valid range (24-127)`);
				return null;
			}
			const midiNote = noteNumber as MidiNote;
			const noteFullName = MidiToNote[midiNote];
			if (!noteFullName) {
				console.error(`No note name found for MIDI note ${midiNote}`);
				return null;
			}
			const isNoteOn = command === 0x90 && velocity > 0;
			return {
				noteNumber: midiNote,
				type: isNoteOn ? 'on' : 'off',
				noteFullName,
				noteName: noteFullName.slice(0, -1) as Note,
				velocity: velocity || 0,
				timestamp: event.timeStamp || performance.now(),
				channel
			};
		} catch (error) {
			console.error('Error parsing MIDI message:', error);
			return null;
		}
	}

	private handleMIDIMessage(event: MIDIMessageEvent): void {
		try {
			const noteEvent = this.safeGetMidiNote(event);
			if (!noteEvent) {
				return;
			}
			if (noteEvent.type === 'on' && this.eventHandlers.onNoteOn) {
				this.eventHandlers.onNoteOn(noteEvent);
			} else if (noteEvent.type === 'off' && this.eventHandlers.onNoteOff) {
				this.eventHandlers.onNoteOff(noteEvent);
			}
		} catch (error) {
			this.handleError(error as Error);
		}
	}

	setEventHandlers(handlers: Partial<MIDIEventHandlers>): void {
		this.eventHandlers = { ...this.eventHandlers, ...handlers };
	}

	private handleError(error: Error): void {
		console.error('MIDI Manager Error:', error);
		this.errorCallbacks.forEach((callback) => {
			try {
				callback(error);
			} catch (callbackError) {
				console.error('Error in error callback:', callbackError);
			}
		});
		if (this.eventHandlers.onError) {
			this.eventHandlers.onError(error);
		}
	}

	private cleanupVirtualKeyboard(): void {
		if (this.keyboardCleanup) {
			this.keyboardCleanup();
			this.keyboardCleanup = null;
		}
		if (this.virtualMidi) {
			this.virtualMidi.releaseAllKeys();
			this.virtualMidi = null;
		}
	}

	getMIDIDevices(): { inputs: MIDIInput[]; outputs: MIDIOutput[] } {
		if (!this.midiAccess) {
			return { inputs: [], outputs: [] };
		}
		return {
			inputs: Array.from(this.midiAccess.inputs.values()),
			outputs: Array.from(this.midiAccess.outputs.values())
		};
	}

	cleanup(): void {
		this.cleanupVirtualKeyboard();
		if (this.midiAccess) {
			this.midiAccess.inputs.forEach((input) => {
				input.onmidimessage = null;
			});
			this.midiAccess.onstatechange = null;
		}

		this.eventHandlers = {};
		this.errorCallbacks = [];
		console.log('MIDI Manager: Cleaned up all connections');
	}

	enableDebugMode(): void {
		this.debugMode = true;
		if (!this.virtualMidi) {
			this.setupVirtualKeyboard();
		} else {
			// Recreate keyboard input with debug mode enabled
			if (this.keyboardCleanup) {
				this.keyboardCleanup();
			}
			this.keyboardCleanup = setupKeyboardInput(this.virtualMidi, this.debugMode);
		}
	}

	disableDebugMode(): void {
		this.debugMode = false;
		if (this.virtualMidi && this.keyboardCleanup) {
			// Recreate keyboard input with debug mode disabled
			this.keyboardCleanup();
			this.keyboardCleanup = setupKeyboardInput(this.virtualMidi, this.debugMode);
		}
	}

	resetExercise(): void {
		this.eventHandlers = {};
		if (this.virtualMidi) {
			this.virtualMidi.releaseAllKeys();
		}
	}
}

export const midiManager = new MIDIManager();
