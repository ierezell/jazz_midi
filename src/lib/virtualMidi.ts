import type { MidiNote } from '$lib/types/notes';
export interface VirtualMidiOptions {
	velocity?: number;
	channel?: number;
}
export class VirtualMidiInput {
	private listeners: ((event: MIDIMessageEvent) => void)[] = [];
	private activeNotes: Set<MidiNote> = new Set();
	private currentOctave: number = 4; // Start at octave 4
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

	setOctave(octave: number) {
		this.currentOctave = Math.max(0, Math.min(8, octave)); // Clamp between 0-8
	}

	getOctave(): number {
		return this.currentOctave;
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

// Base keyboard layout (semitones from C)
const keyboardLayout: Record<string, number> = {
	// Lower row - white keys (C octave)
	z: 0, // C
	x: 2, // D
	c: 4, // E
	v: 5, // F
	b: 7, // G
	n: 9, // A
	m: 11, // B
	',': 12, // C (next octave)
	'.': 14, // D (next octave)
	'/': 16, // E (next octave)
	// Lower row - black keys
	s: 1, // C#
	d: 3, // D#
	g: 6, // F#
	h: 8, // G#
	j: 10, // A#
	l: 13, // C# (next octave)
	';': 15, // D# (next octave)
	"'": 17, // F# (next octave)
	// Upper row - white keys (next octave)
	q: 12, // C (next octave)
	w: 14, // D (next octave)
	e: 16, // E (next octave)
	r: 17, // F (next octave)
	t: 19, // G (next octave)
	y: 21, // A (next octave)
	u: 23, // B (next octave)
	i: 24, // C (two octaves up)
	o: 26, // D (two octaves up)
	p: 28, // E (two octaves up)
	'[': 29, // F (two octaves up)
	']': 31, // G (two octaves up)
	// Number row - black keys
	'2': 1, // C#
	'3': 3, // D#
	'5': 6, // F#
	'6': 8, // G#
	'7': 10, // A#
	'9': 13, // C# (next octave)
	'0': 15, // D# (next octave)
	'=': 20 // G# (next octave)
};

// Generate dynamic keyboard mapping based on octave
export function getKeyboardToMidi(baseOctave: number): Record<string, MidiNote> {
	const mapping: Record<string, MidiNote> = {};
	const baseNote = baseOctave * 12 + 12; // Convert octave to MIDI (C0 = 12, C1 = 24, etc.)

	for (const [key, semitone] of Object.entries(keyboardLayout)) {
		const midiNote = baseNote + semitone;
		if (midiNote >= 24 && midiNote <= 127) {
			// Valid MIDI range
			mapping[key] = midiNote as MidiNote;
		}
	}

	return mapping;
}

export function setupKeyboardInput(virtualMidi: VirtualMidiInput, enableKeyboard: boolean = false) {
	const pressedKeys = new Set<string>();

	function handleKeyDown(event: KeyboardEvent) {
		if (!enableKeyboard) return;
		const key = event.key.toLowerCase();
		console.debug('Key pressed:', key);

		// Get current keyboard mapping based on selected octave
		const keyboardToMidi = getKeyboardToMidi(virtualMidi.getOctave());

		if (keyboardToMidi[key] && !pressedKeys.has(key)) {
			pressedKeys.add(key);
			const midiNote = keyboardToMidi[key] as MidiNote;
			console.debug(
				`Pressing MIDI note ${midiNote} for key '${key}' (octave ${virtualMidi.getOctave()})`
			);
			virtualMidi.pressKey(midiNote);
			event.preventDefault();
		}
	}

	function handleKeyUp(event: KeyboardEvent) {
		if (!enableKeyboard) return;
		const key = event.key.toLowerCase();

		// Get current keyboard mapping based on selected octave
		const keyboardToMidi = getKeyboardToMidi(virtualMidi.getOctave());

		if (keyboardToMidi[key] && pressedKeys.has(key)) {
			pressedKeys.delete(key);
			const midiNote = keyboardToMidi[key] as MidiNote;
			console.debug(
				`Releasing MIDI note ${midiNote} for key '${key}' (octave ${virtualMidi.getOctave()})`
			);
			virtualMidi.releaseKey(midiNote);
			event.preventDefault();
		}
	}

	if (enableKeyboard) {
		console.debug(
			'Virtual keyboard input setup complete. Available keys:',
			Object.keys(keyboardLayout),
			'Base octave:',
			virtualMidi.getOctave()
		);
	} else {
		console.debug('Virtual keyboard input setup (keyboard disabled)');
	}

	document.addEventListener('keydown', handleKeyDown);
	document.addEventListener('keyup', handleKeyUp);
	return () => {
		console.debug('Virtual keyboard input cleanup');
		document.removeEventListener('keydown', handleKeyDown);
		document.removeEventListener('keyup', handleKeyUp);
	};
}
