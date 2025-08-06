import type { MidiNote } from './midi';
export interface VirtualMidiOptions {
	velocity?: number;
	channel?: number;
}
export class VirtualMidiInput {
	private listeners: ((event: MIDIMessageEvent) => void)[] = [];
	private activeNotes: Set<MidiNote> = new Set();
	constructor(private options: VirtualMidiOptions = {}) {
		this.options = {
			velocity: 100,
			channel: 0,
			...options
		};
	}
	addEventListener(type: string, listener: (event: MIDIMessageEvent) => void) {
		if (type === 'midimessage') {
			this.listeners.push(listener);
		}
	}
	removeEventListener(type: string, listener: (event: MIDIMessageEvent) => void) {
		if (type === 'midimessage') {
			const index = this.listeners.indexOf(listener);
			if (index > -1) {
				this.listeners.splice(index, 1);
			}
		}
	}
	pressKey(note: MidiNote, velocity: number = this.options.velocity || 100) {
		if (this.activeNotes.has(note)) return;
		this.activeNotes.add(note);
		const message = this.createMidiMessage(0x90, note, velocity);
		this.dispatchMidiEvent(message);
	}
	releaseKey(note: MidiNote) {
		if (!this.activeNotes.has(note)) return;
		this.activeNotes.delete(note);
		const message = this.createMidiMessage(0x80, note, 0);
		this.dispatchMidiEvent(message);
	}
	toggleKey(note: MidiNote, velocity: number = this.options.velocity || 100) {
		if (this.activeNotes.has(note)) {
			this.releaseKey(note);
		} else {
			this.pressKey(note, velocity);
		}
	}
	releaseAllKeys() {
		for (const note of this.activeNotes) {
			this.releaseKey(note);
		}
	}
	getActiveNotes(): MidiNote[] {
		return Array.from(this.activeNotes);
	}
	playChord(notes: MidiNote[], velocity: number = this.options.velocity || 100) {
		notes.forEach((note) => this.pressKey(note, velocity));
	}
	stopChord(notes: MidiNote[]) {
		notes.forEach((note) => this.releaseKey(note));
	}
	private createMidiMessage(status: number, note: MidiNote, velocity: number): Uint8Array {
		return new Uint8Array([status | (this.options.channel || 0), note, velocity]);
	}
	private dispatchMidiEvent(data: Uint8Array) {
		const event = {
			data,
			timeStamp: performance.now(),
			type: 'midimessage'
		} as MIDIMessageEvent;
		this.listeners.forEach((listener) => listener(event));
	}
}
export function createVirtualMidiAccess(
	inputName: string = 'Virtual MIDI Keyboard'
): MIDIAccess & { getVirtualInput: () => VirtualMidiInput } {
	const virtualInput = new VirtualMidiInput();
	const mockInput = {
		id: 'virtual-midi-input',
		manufacturer: 'Virtual',
		name: inputName,
		type: 'input' as const,
		version: '1.0.0',
		state: 'connected' as const,
		connection: 'open' as const,
		onmidimessage: null as ((event: MIDIMessageEvent) => void) | null,
		onstatechange: null,
		addEventListener: virtualInput.addEventListener.bind(virtualInput),
		removeEventListener: virtualInput.removeEventListener.bind(virtualInput),
		dispatchEvent: () => false,
		open: () => Promise.resolve(mockInput as any),
		close: () => Promise.resolve(mockInput as any),
		_virtualInput: virtualInput
	} as unknown as MIDIInput & { _virtualInput: VirtualMidiInput };
	Object.defineProperty(mockInput, 'onmidimessage', {
		get() {
			return this._onmidimessage;
		},
		set(handler: ((event: MIDIMessageEvent) => void) | null) {
			this._onmidimessage = handler;
			if (handler) {
				virtualInput.addEventListener('midimessage', handler);
			}
		}
	});
	const inputs = new Map([['virtual-midi-input', mockInput]]);
	const outputs = new Map();
	const midiAccess = {
		inputs,
		outputs,
		sysexEnabled: false,
		onstatechange: null,
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false,
		getVirtualInput: () => virtualInput
	} as unknown as MIDIAccess & { getVirtualInput: () => VirtualMidiInput };
	return midiAccess;
}
let globalVirtualMidi: VirtualMidiInput | null = null;
export function getGlobalVirtualMidi(): VirtualMidiInput {
	if (!globalVirtualMidi) {
		globalVirtualMidi = new VirtualMidiInput();
	}
	return globalVirtualMidi;
}
export const keyboardToMidi: Record<string, MidiNote> = {
	z: 72,
	x: 74,
	c: 76,
	v: 77,
	b: 79,
	n: 81,
	m: 83,
	',': 84,
	'.': 86,
	'/': 88,
	s: 73,
	d: 75,
	g: 78,
	h: 80,
	j: 82,
	l: 85,
	';': 87,
	"'": 89,
	q: 84,
	w: 86,
	e: 88,
	r: 89,
	t: 91,
	y: 93,
	u: 95,
	i: 96,
	o: 98,
	p: 100,
	'[': 101,
	']': 103,
	'2': 73,
	'3': 75,
	'5': 78,
	'6': 80,
	'7': 82,
	'9': 85,
	'0': 87,
	'=': 90
};
export function setupKeyboardInput(virtualMidi: VirtualMidiInput, enableKeyboard: boolean = false) {
	const pressedKeys = new Set<string>();
	function handleKeyDown(event: KeyboardEvent) {
		if (!enableKeyboard) return;
		const key = event.key.toLowerCase();
		console.log('Key pressed:', key);
		if (keyboardToMidi[key] && !pressedKeys.has(key)) {
			pressedKeys.add(key);
			const midiNote = keyboardToMidi[key] as MidiNote;
			console.log(`Pressing MIDI note ${midiNote} for key '${key}'`);
			virtualMidi.pressKey(midiNote);
			event.preventDefault();
		}
	}
	function handleKeyUp(event: KeyboardEvent) {
		if (!enableKeyboard) return;
		const key = event.key.toLowerCase();
		if (keyboardToMidi[key] && pressedKeys.has(key)) {
			pressedKeys.delete(key);
			const midiNote = keyboardToMidi[key] as MidiNote;
			console.log(`Releasing MIDI note ${midiNote} for key '${key}'`);
			virtualMidi.releaseKey(midiNote);
			event.preventDefault();
		}
	}

	if (enableKeyboard) {
		console.log(
			'Virtual keyboard input setup complete. Available keys:',
			Object.keys(keyboardToMidi)
		);
	} else {
		console.log('Virtual keyboard input setup (keyboard disabled)');
	}

	document.addEventListener('keydown', handleKeyDown);
	document.addEventListener('keyup', handleKeyUp);
	return () => {
		console.log('Virtual keyboard input cleanup');
		document.removeEventListener('keydown', handleKeyDown);
		document.removeEventListener('keyup', handleKeyUp);
	};
}
