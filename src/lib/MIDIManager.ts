import { MidiToNote, NoteToMidi } from './types/notes.constants';
import type { MIDIEventHandlers, MidiNote, Note, NoteEvent } from './types/types';
import { writable, type Writable } from 'svelte/store';

import { createVirtualMidiAccess, setupKeyboardInput, type VirtualMidiInput } from './virtualMidi';
import { audioInputService } from './audio/AudioInputService';
import { logger } from './LoggingService';

class MIDIManager {
	public midiAccess: MIDIAccess | null = null;
	private virtualMidi: VirtualMidiInput | null = null;
	private keyboardCleanup: (() => void) | null = null;
	private eventHandlers: Partial<MIDIEventHandlers> = {};

	private errorCallbacks: ((error: Error) => void)[] = [];
	private debugMode = false;
	private audioInputEnabled = false;

	public midiState: Writable<{ inputs: MIDIInput[]; outputs: MIDIOutput[] }> = writable({
		inputs: [],
		outputs: []
	});

	constructor() {
		// Subscribe to audio input events
		audioInputService.addListener((event) => {
			this.handleMIDIMessage(event);
		});
	}

	async initialize(): Promise<boolean> {
		try {
			// Ensure Playwright's MIDI injection hook exists after hydration.
			// The constructor runs during SSR too, so we install it here (client-only).
			this.ensurePlaywrightMidiDispatchHook();

			await this.connectMIDI();
			this.setupAudioInput();
			return true;
		} catch (error) {
			this.handleError(error as Error);
			return false;
		}
	}

	public ensurePlaywrightMidiDispatchHook(): void {
		if (typeof window === 'undefined') return;
		const w = window as Window & { __dispatchMidi?: (data: Uint8Array) => void };
		if (typeof w.__dispatchMidi === 'function') return;

		w.__dispatchMidi = (data: Uint8Array) => {
			const event = {
				data,
				timeStamp: performance.now(),
				type: 'midimessage'
			} as MIDIMessageEvent;
			this.handleMIDIMessage(event);
		};
	}

	async connectMIDI(): Promise<boolean> {
		try {
			this.midiAccess = await this.safeRequestMidiAccess({ sysex: false });
			if (!this.midiAccess) {
				this.midiState.set({ inputs: [], outputs: [] });
				// MIDI unavailable — running in fallback mode (virtual keyboard/audio only).
				return false;
			}
			this.safeSetupMidiCallback(
				this.midiAccess,
				this.handleMIDIMessage.bind(this),
				this.handleError.bind(this)
			);

			this.updateMidiState();
			return true;
		} catch (error) {
			logger.warn('Could not initialize MIDI devices. Fallback mode enabled.', error, 'MIDI');
			return false;
		}
	}

	private async safeRequestMidiAccess(options?: MIDIOptions): Promise<MIDIAccess | null> {
		try {
			if (!navigator.requestMIDIAccess) {
				logger.warn('Web MIDI API not supported in this browser', undefined, 'MIDI');
				return null;
			}
			const midiAccess = await navigator.requestMIDIAccess(options || { sysex: false });
			return midiAccess;
		} catch (error) {
			logger.warn('Failed to obtain MIDI access', error, 'MIDI');
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
				input.onmidimessage = (event) => {
					try {
						callback(event);
					} catch (error) {
						logger.error('Error in MIDI message callback', error, 'MIDI');
						if (errorCallback) {
							errorCallback(error as Error);
						}
					}
				};
			});
			midiAccess.onstatechange = (event) => {
				const port = event.port!;
				this.updateMidiState();
			};
		} catch (error) {
			logger.error('Error setting up MIDI callback', error, 'MIDI');
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
		} catch (error) {
			this.handleError(error as Error);
		}
	}

	setDebugMode(enabled: boolean): void {
		this.debugMode = enabled;
		if (this.virtualMidi) {
			// Cleanup existing keyboard setup
			if (this.keyboardCleanup) {
				this.keyboardCleanup();
				this.keyboardCleanup = null;
			}
			// Setup keyboard input with new debug mode
			this.keyboardCleanup = setupKeyboardInput(this.virtualMidi, this.debugMode);
		}
	}

	private setupAudioInput(): void {
		audioInputService.addListener((event: MIDIMessageEvent) => {
			if (!this.audioInputEnabled) return;
			this.handleMIDIMessage(event);
		});
	}

	async setAudioInput(enabled: boolean): Promise<void> {
		this.audioInputEnabled = enabled;
		if (enabled) {
			await audioInputService.start();
		} else {
			audioInputService.stop();
		}
	}

	getVirtualMidi(): VirtualMidiInput | null {
		return this.virtualMidi;
	}

	private safeGetMidiNote(event: MIDIMessageEvent): NoteEvent | null {
		try {
			if (!event.data || event.data.length < 3) {
				logger.warn('Invalid MIDI message data', undefined, 'MIDI');
				return null;
			}
			const [status, noteNumber, velocity] = event.data;
			const command = status & 0xf0;
			const channel = status & 0x0f;
			if (command !== 0x90 && command !== 0x80) {
				return null;
			}
			if (noteNumber < 24 || noteNumber > 127) {
				logger.warn(`MIDI note ${noteNumber} out of valid range (24-127)`, undefined, 'MIDI');
				return null;
			}
			const midiNote = noteNumber as MidiNote;
			const noteFullName = MidiToNote[midiNote];
			if (!noteFullName) {
				logger.error(`No note name found for MIDI note ${midiNote}`, undefined, 'MIDI');
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
		logger.error('MIDI Manager Error', error, 'MIDI');
		this.errorCallbacks.forEach((callback) => {
			try {
				callback(error);
			} catch (callbackError) {
				logger.error('Error in error callback', callbackError, 'MIDI');
			}
		});
		if (this.eventHandlers.onError) {
			this.eventHandlers.onError(error);
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
		if (this.keyboardCleanup) {
			this.keyboardCleanup();
			this.keyboardCleanup = null;
		}
		if (this.virtualMidi) {
			this.virtualMidi.releaseAllKeys();
			this.virtualMidi = null;
		}
		if (this.midiAccess) {
			this.midiAccess.inputs.forEach((input) => {
				input.onmidimessage = null;
			});
			this.midiAccess.onstatechange = null;
		}

		this.eventHandlers = {};
		this.errorCallbacks = [];
	}

	private updateMidiState(): void {
		if (this.midiAccess) {
			this.midiState.set({
				inputs: Array.from(this.midiAccess.inputs.values()),
				outputs: Array.from(this.midiAccess.outputs.values())
			});
		}
	}
}

export const midiManager = new MIDIManager();
