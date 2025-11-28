import { describe, it, expect } from 'vitest';
import { NoteToMidi } from '../types/notes.constants';

describe('Enharmonic mappings', () => {
	it('C#4 and Db4 map to the same MIDI note', () => {
		expect(NoteToMidi['C#4']).toBe(NoteToMidi['Db4']);
	});

	it('A#4 and Bb4 map to the same MIDI note', () => {
		expect(NoteToMidi['A#4']).toBe(NoteToMidi['Bb4']);
	});
});
