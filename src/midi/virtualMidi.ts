import type { MidiNote } from './midi';

/**
 * Virtual MIDI system for testing without physical MIDI keyboard
 * Provides the same interface as real MIDI events
 */

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

    /**
     * Add a MIDI message event listener
     */
    addEventListener(type: string, listener: (event: MIDIMessageEvent) => void) {
        if (type === 'midimessage') {
            this.listeners.push(listener);
        }
    }

    /**
     * Remove a MIDI message event listener
     */
    removeEventListener(type: string, listener: (event: MIDIMessageEvent) => void) {
        if (type === 'midimessage') {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        }
    }

    /**
     * Simulate pressing a key (note on)
     */
    pressKey(note: MidiNote, velocity: number = this.options.velocity || 100) {
        if (this.activeNotes.has(note)) return; // Prevent duplicate press
        
        this.activeNotes.add(note);
        const message = this.createMidiMessage(0x90, note, velocity); // Note On
        this.dispatchMidiEvent(message);
    }

    /**
     * Simulate releasing a key (note off)
     */
    releaseKey(note: MidiNote) {
        if (!this.activeNotes.has(note)) return; // Can't release unpressed key
        
        this.activeNotes.delete(note);
        const message = this.createMidiMessage(0x80, note, 0); // Note Off
        this.dispatchMidiEvent(message);
    }

    /**
     * Toggle a key (press if released, release if pressed)
     */
    toggleKey(note: MidiNote, velocity: number = this.options.velocity || 100) {
        if (this.activeNotes.has(note)) {
            this.releaseKey(note);
        } else {
            this.pressKey(note, velocity);
        }
    }

    /**
     * Release all currently pressed keys
     */
    releaseAllKeys() {
        for (const note of this.activeNotes) {
            this.releaseKey(note);
        }
    }

    /**
     * Get currently pressed notes
     */
    getActiveNotes(): MidiNote[] {
        return Array.from(this.activeNotes);
    }

    /**
     * Play a chord (press multiple notes simultaneously)
     */
    playChord(notes: MidiNote[], velocity: number = this.options.velocity || 100) {
        notes.forEach(note => this.pressKey(note, velocity));
    }

    /**
     * Stop a chord (release multiple notes)
     */
    stopChord(notes: MidiNote[]) {
        notes.forEach(note => this.releaseKey(note));
    }

    private createMidiMessage(status: number, note: MidiNote, velocity: number): Uint8Array {
        return new Uint8Array([
            status | (this.options.channel || 0), // Status byte with channel
            note,                                 // Note number
            velocity                             // Velocity
        ]);
    }

    private dispatchMidiEvent(data: Uint8Array) {
        // Create a mock MIDIMessageEvent
        const event = {
            data,
            timeStamp: performance.now(),
            type: 'midimessage'
        } as MIDIMessageEvent;

        // Dispatch to all listeners
        this.listeners.forEach(listener => listener(event));
    }
}

/**
 * Creates a virtual MIDI access object that mimics the Web MIDI API
 */
export function createVirtualMidiAccess(inputName: string = "Virtual MIDI Keyboard"): MIDIAccess & { getVirtualInput: () => VirtualMidiInput } {
    const virtualInput = new VirtualMidiInput();
    
    // Create a mock MIDIInput with all required properties
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
        // Add the virtual input reference for external control
        _virtualInput: virtualInput
    } as unknown as MIDIInput & { _virtualInput: VirtualMidiInput };

    // Add a setter for onmidimessage to properly connect the handler
    Object.defineProperty(mockInput, 'onmidimessage', {
        get() { return this._onmidimessage; },
        set(handler: ((event: MIDIMessageEvent) => void) | null) {
            this._onmidimessage = handler;
            if (handler) {
                virtualInput.addEventListener('midimessage', handler);
            }
        }
    });

    // Create inputs map
    const inputs = new Map([['virtual-midi-input', mockInput]]);
    const outputs = new Map();

    // Create mock MIDIAccess with all required properties
    const midiAccess = {
        inputs,
        outputs,
        sysexEnabled: false,
        onstatechange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
        // Add method to get the virtual input for external control
        getVirtualInput: () => virtualInput
    } as unknown as MIDIAccess & { getVirtualInput: () => VirtualMidiInput };

    return midiAccess;
}

/**
 * Global virtual MIDI instance for debugging
 */
let globalVirtualMidi: VirtualMidiInput | null = null;

export function getGlobalVirtualMidi(): VirtualMidiInput {
    if (!globalVirtualMidi) {
        globalVirtualMidi = new VirtualMidiInput();
    }
    return globalVirtualMidi;
}

/**
 * Utility function to convert computer keyboard keys to MIDI notes
 * Maps QWERTY keyboard to piano keys with standard piano layout
 * Lower row (zxcv...) = C5-C6 (white keys) + black keys to match UI display
 * Upper row (qwer...) = C6-C7 (white keys) + black keys  
 * Number row (123...) = black keys for both octaves
 */
export const keyboardToMidi: Record<string, MidiNote> = {
    // Lower row - White keys (C5 octave) - matches UI keyboard display
    'z': 72,  // C5 (changed from C4 to match UI display)
    'x': 74,  // D5
    'c': 76,  // E5
    'v': 77,  // F5
    'b': 79,  // G5
    'n': 81,  // A5
    'm': 83,  // B5
    ',': 84,  // C6
    '.': 86,  // D6
    '/': 88,  // E6
    
    // Lower row - Black keys (C5 octave)
    's': 73,  // C#5
    'd': 75,  // D#5
    'g': 78,  // F#5
    'h': 80,  // G#5
    'j': 82,  // A#5
    'l': 85,  // C#6
    ';': 87,  // D#6
    "'": 89, // F#6
    
    // Upper row - White keys (C6 octave)
    'q': 84,  // C6
    'w': 86,  // D6
    'e': 88,  // E6
    'r': 89,  // F6
    't': 91,  // G6
    'y': 93,  // A6
    'u': 95,  // B6
    'i': 96,  // C7
    'o': 98,  // D7
    'p': 100, // E7
    '[': 101, // F7
    ']': 103, // G7
    
    // Number row - Black keys for both octaves
    '2': 73,  // C#5
    '3': 75,  // D#5
    '5': 78,  // F#5
    '6': 80,  // G#5
    '7': 82,  // A#5
    '9': 85,  // C#6
    '0': 87,  // D#6
    '=': 90,  // F#6
};

/**
 * Setup computer keyboard as MIDI input
 */
export function setupKeyboardInput(virtualMidi: VirtualMidiInput) {
    const pressedKeys = new Set<string>();

    function handleKeyDown(event: KeyboardEvent) {
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
        const key = event.key.toLowerCase();
        if (keyboardToMidi[key] && pressedKeys.has(key)) {
            pressedKeys.delete(key);
            const midiNote = keyboardToMidi[key] as MidiNote;
            console.log(`Releasing MIDI note ${midiNote} for key '${key}'`);
            virtualMidi.releaseKey(midiNote);
            event.preventDefault();
        }
    }

    console.log('Virtual keyboard input setup complete. Available keys:', Object.keys(keyboardToMidi));
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Return cleanup function
    return () => {
        console.log('Virtual keyboard input cleanup');
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
    };
}
