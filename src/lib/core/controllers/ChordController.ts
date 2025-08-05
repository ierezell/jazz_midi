/**
 * Chord Exercise Controller
 * Handles chord recognition and voicing exercises
 */

import { chords, NoteToMidi } from '../../../midi/midi';
import type {
	ChordType,
	MidiNote,
	Note,
	NoteEvent,
	NoteFullName
} from '../../types';
import { BaseExerciseController } from '../base/BaseController';
import type { ChordExerciseState, ExerciseConfig } from '../types';

export class ChordExerciseController extends BaseExerciseController {
	declare protected state: ChordExerciseState;

	constructor(config: ExerciseConfig) {
		super(config);
		// Extend the base state with chord-specific properties
		this.state = {
			...this.state,
			chord: {
				type: 'maj7',
				inversion: 0,
				voicing: 'close',
				position: 'root'
			}
		} as ChordExerciseState;
	}

	// ===== ABSTRACT METHOD IMPLEMENTATIONS =====

	getExpectedNotes(): MidiNote[] {
		const rootNote = (this.state.settings.key + '4') as NoteFullName;
		const rootMidi = NoteToMidi[rootNote];

		const chord = chords(rootMidi, this.state.chord.type, this.state.chord.inversion);

		// Apply voicing logic
		return this.applyVoicing(
			[chord.root, chord.third, chord.fifth, chord.seventh].filter(
				(note) => note !== undefined
			) as MidiNote[]
		);
	}

	processNoteInput(note: NoteEvent): void {
		const expectedNotes = this.getExpectedNotes();

		if (expectedNotes.includes(note.noteNumber)) {
			// Correct note
			if (!this.state.completedNotes.includes(note.noteNumber)) {
				this.state.completedNotes.push(note.noteNumber);
				this.setFeedback('Correct!', 'success');
			}
		} else {
			// Incorrect note
			this.recordMistake(note.noteNumber);
		}

		// Update expected notes in state
		this.state.expectedNotes = expectedNotes;
	}

	isCompleted(): boolean {
		const expectedNotes = this.getExpectedNotes();
		return this.arraysEqual(this.state.completedNotes, expectedNotes);
	}

	// ===== CHORD-SPECIFIC METHODS =====

	/**
	 * Set chord type
	 */
	setChordType(type: ChordType): void {
		this.state.chord.type = type;
		this.reset();
	}

	/**
	 * Set chord inversion
	 */
	setInversion(inversion: 0 | 1 | 2 | 3): void {
		this.state.chord.inversion = inversion;
		this.reset();
	}

	/**
	 * Set voicing type
	 */
	setVoicing(voicing: ChordExerciseState['chord']['voicing']): void {
		this.state.chord.voicing = voicing;
		this.reset();
	}

	/**
	 * Get chord information for display
	 */
	getChordInfo(): {
		name: string;
		symbol: string;
		notes: string[];
		voicing: string;
	} {
		const rootNote = this.state.settings.key;
		const chordSymbol = this.getChordSymbol(rootNote, this.state.chord.type);
		const expectedNotes = this.getExpectedNotes();

		return {
			name: `${rootNote} ${this.state.chord.type}`,
			symbol: chordSymbol,
			notes: expectedNotes.map((note) => {
				// Convert MIDI note back to note name
				const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
				return noteNames[note % 12];
			}),
			voicing: this.state.chord.voicing
		};
	}

	// ===== PRIVATE HELPER METHODS =====

	/**
	 * Apply voicing rules to chord notes
	 */
	private applyVoicing(chordNotes: MidiNote[]): MidiNote[] {
		switch (this.state.chord.voicing) {
			case 'close':
				return chordNotes; // Notes as they are (close voicing)

			case 'open':
				// Spread notes across larger interval
				return chordNotes.map((note, index) => (index > 1 ? ((note + 12) as MidiNote) : note));

			case 'drop2':
				// Drop the second highest note by an octave
				if (chordNotes.length >= 3) {
					const result = [...chordNotes];
					result[chordNotes.length - 2] = (result[chordNotes.length - 2] - 12) as MidiNote;
					return result.sort((a, b) => a - b);
				}
				return chordNotes;

			case 'drop3':
				// Drop the third highest note by an octave
				if (chordNotes.length >= 4) {
					const result = [...chordNotes];
					result[chordNotes.length - 3] = (result[chordNotes.length - 3] - 12) as MidiNote;
					return result.sort((a, b) => a - b);
				}
				return chordNotes;

			case 'shell':
				// Only root, third, and seventh (omit fifth)
				return chordNotes.filter((_, index) => index !== 2);

			default:
				return chordNotes;
		}
	}

	/**
	 * Get chord symbol notation
	 */
	private getChordSymbol(root: Note, type: ChordType): string {
		const symbols: Record<ChordType, string> = {
			major: '',
			minor: 'm',
			maj7: 'maj7',
			min7: 'm7',
			'7': '7',
			dom7: '7',
			diminished: '°',
			'dim7': '°7',
			'half-dim7': 'ø',
			augmented: '+',
			sus2: 'sus2',
			sus4: 'sus4'
		};

		return root + symbols[type];
	}

	// ===== EXERCISE VARIATIONS =====

	/**
	 * Generate random chord progression
	 */
	generateRandomProgression(): ChordType[] {
		const commonProgressions: ChordType[][] = [
			['maj7', 'min7', '7', 'maj7'], // I-vi-V-I
			['min7', '7', 'maj7'], // ii-V-I
			['maj7', '7', 'maj7'], // I-V-I
			['min7', 'min7', '7', 'maj7'] // vi-ii-V-I
		];

		return commonProgressions[Math.floor(Math.random() * commonProgressions.length)];
	}

	/**
	 * Start chord progression exercise
	 */
	startProgressionExercise(progression: ChordType[]): void {
		// Implementation for progression exercises
		// This would extend the base functionality
		console.log('Starting progression exercise:', progression);
	}
}
