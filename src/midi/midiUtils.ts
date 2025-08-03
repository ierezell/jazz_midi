// Enhanced MIDI utilities with better error handling and validation

import {
	type ChordType,
	type MidiNote,
	type Note,
	type NoteEvent,
	type NoteFullName,
	MidiToNote,
	NoteToMidi
} from './midi';

/**
 * Validates if a number is a valid MIDI note
 */
export function isValidMidiNote(note: number): note is MidiNote {
	return Number.isInteger(note) && note >= 24 && note <= 128;
}

/**
 * Validates if a string is a valid note name
 */
export function isValidNote(note: string): note is Note {
	const validNotes = [
		'C',
		'C#',
		'Db',
		'D',
		'D#',
		'Eb',
		'E',
		'F',
		'F#',
		'Gb',
		'G',
		'G#',
		'Ab',
		'A',
		'A#',
		'Bb',
		'B'
	];
	return validNotes.includes(note);
}

/**
 * Safely converts MIDI note to note name with validation
 */
export function safeGetNoteName(midiNote: number): NoteFullName | null {
	if (!isValidMidiNote(midiNote)) {
		return null;
	}
	return MidiToNote[midiNote];
}

/**
 * Safely converts note name to MIDI note with validation
 */
export function safeGetMidiFromNote(noteName: string): MidiNote | null {
	if (!(noteName in NoteToMidi)) {
		return null;
	}
	return NoteToMidi[noteName as NoteFullName];
}

/**
 * Enhanced error handling for MIDI access
 */
export async function safeRequestMidiAccess(options?: MIDIOptions): Promise<MIDIAccess | null> {
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

/**
 * Enhanced MIDI callback setup with error handling
 */
export function safeSetupMidiCallback(
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

/**
 * Enhanced MIDI message parsing with better error handling
 */
export function safeGetMidiNote(event: MIDIMessageEvent): NoteEvent | null {
	try {
		if (!event.data || event.data.length < 3) {
			console.warn('Invalid MIDI message data');
			return null;
		}

		const data = event.data;
		const command = data[0] >> 4;
		const channel = data[0] & 0x0f;
		const noteNumber = data[1];
		const velocity = data[2];

		// Validate note number range
		if (!isValidMidiNote(noteNumber)) {
			console.warn(`Invalid MIDI note number: ${noteNumber}`);
			return null;
		}

		// Validate velocity range
		if (velocity < 0 || velocity > 127) {
			console.warn(`Invalid MIDI velocity: ${velocity}`);
			return null;
		}

		let noteType: 'on' | 'off' = 'off';
		if (command === 9 && velocity > 0) {
			noteType = 'on';
		} else if (command === 8 || (command === 9 && velocity === 0)) {
			noteType = 'off';
		} else {
			// Not a note message, but not an error
			return null;
		}

		const noteFullName = MidiToNote[noteNumber as MidiNote];
		const noteName = noteFullName.slice(0, -1) as Note;

		return {
			noteNumber: noteNumber as MidiNote,
			noteFullName,
			noteName,
			velocity,
			time: event.timeStamp,
			type: noteType
		};
	} catch (error) {
		console.error('Error parsing MIDI message:', error);
		return null;
	}
}

/**
 * Frequency calculation utilities
 */
export class FrequencyCalculator {
	private static A4_FREQUENCY = 440; // Hz
	private static A4_MIDI_NOTE = 69; // A4 = MIDI note 69

	/**
	 * Convert MIDI note to frequency in Hz
	 */
	static midiToFrequency(midiNote: MidiNote): number {
		return this.A4_FREQUENCY * Math.pow(2, (midiNote - this.A4_MIDI_NOTE) / 12);
	}

	/**
	 * Convert frequency to nearest MIDI note
	 */
	static frequencyToMidi(frequency: number): MidiNote | null {
		if (frequency <= 0) return null;

		const midiNote = Math.round(12 * Math.log2(frequency / this.A4_FREQUENCY) + this.A4_MIDI_NOTE);

		if (isValidMidiNote(midiNote)) {
			return midiNote as MidiNote;
		}

		return null;
	}
}

/**
 * Musical interval utilities
 */
export class IntervalCalculator {
	private static intervals = {
		unison: 0,
		minorSecond: 1,
		majorSecond: 2,
		minorThird: 3,
		majorThird: 4,
		perfectFourth: 5,
		tritone: 6,
		perfectFifth: 7,
		minorSixth: 8,
		majorSixth: 9,
		minorSeventh: 10,
		majorSeventh: 11,
		octave: 12
	};

	/**
	 * Get interval between two MIDI notes in semitones
	 */
	static getInterval(note1: MidiNote, note2: MidiNote): number {
		return Math.abs(note2 - note1);
	}

	/**
	 * Add interval to a MIDI note
	 */
	static addInterval(baseNote: MidiNote, interval: number): MidiNote | null {
		const result = baseNote + interval;
		if (isValidMidiNote(result)) {
			return result as MidiNote;
		}
		return null;
	}

	/**
	 * Get common interval names
	 */
	static getIntervalName(semitones: number): string {
		const intervalEntry = Object.entries(this.intervals).find(
			([_, value]) => value === semitones % 12
		);
		return intervalEntry ? intervalEntry[0] : `interval_${semitones}`;
	}
}

/**
 * Chord progression utilities
 */
export class ChordProgressionBuilder {
	/**
	 * Generate common chord progressions
	 */
	static generateProgression(
		key: Note,
		progression: number[]
	): { root: Note; chordType: ChordType }[] {
		const majorScale = [0, 2, 4, 5, 7, 9, 11]; // Major scale intervals
		const scaleChords: ChordType[] = [
			'major',
			'minor',
			'minor',
			'major',
			'major',
			'minor',
			'diminished'
		];

		const baseNote = safeGetMidiFromNote(`${key}4`);
		if (!baseNote) return [];

		return progression.map((degree) => {
			const scaleDegree = (degree - 1) % 7;
			const interval = majorScale[scaleDegree];
			const chordRoot = IntervalCalculator.addInterval(baseNote, interval);

			if (!chordRoot) return { root: key, chordType: 'major' as ChordType };

			const rootNoteName = safeGetNoteName(chordRoot);
			if (!rootNoteName) return { root: key, chordType: 'major' as ChordType };

			return {
				root: rootNoteName.slice(0, -1) as Note,
				chordType: scaleChords[scaleDegree]
			};
		});
	}

	/**
	 * Common progressions
	 */
	static readonly commonProgressions = {
		I_V_vi_IV: [1, 5, 6, 4], // C-G-Am-F in C major
		ii_V_I: [2, 5, 1], // Jazz turnaround
		I_vi_ii_V: [1, 6, 2, 5], // Circle of fifths
		vi_IV_I_V: [6, 4, 1, 5] // Pop progression
	};
}

/**
 * Performance monitoring for MIDI processing
 */
export class MIDIPerformanceMonitor {
	private static eventCounts = new Map<string, number>();
	private static lastResetTime = Date.now();

	static recordEvent(eventType: string): void {
		const current = this.eventCounts.get(eventType) || 0;
		this.eventCounts.set(eventType, current + 1);
	}

	static getStatistics(): { [key: string]: number } {
		const stats: { [key: string]: number } = {};
		const elapsed = (Date.now() - this.lastResetTime) / 1000; // seconds

		this.eventCounts.forEach((count, eventType) => {
			stats[`${eventType}_total`] = count;
			stats[`${eventType}_per_second`] = count / elapsed;
		});

		return stats;
	}

	static reset(): void {
		this.eventCounts.clear();
		this.lastResetTime = Date.now();
	}
}
