import { describe, it, expect } from 'vitest';
import {
	generateExpectedNotesFor,
	validateSequentialNote,
	isSequenceComplete
} from '$lib/scaleExercise';
import type { MidiNote } from '$lib/types/types';

describe('Scale exercise - sequential play', () => {
	it('completes when the correct notes are played in order', () => {
		// Simulate a C major scale played with the right hand (octave 3 in app)
		const expected = generateExpectedNotesFor('C', 'Maj', true);

		// Start with an empty played sequence and simulate pressing each expected note
		let playedSequence: MidiNote[] = [];
		let result: { isCorrect: boolean; message: string; newSequence: MidiNote[] } = {
			isCorrect: false,
			message: '',
			newSequence: []
		};

		for (let i = 0; i < expected.length; i++) {
			const note = expected[i];
			result = validateSequentialNote(expected, playedSequence, note);
			// If a wrong note occurs the test should fail here
			expect(result.isCorrect).toBe(true);
			playedSequence = result.newSequence;
		}

		// After playing all notes, the sequence should be complete
		expect(isSequenceComplete(expected, playedSequence)).toBe(true);
		expect(result.message).toMatch(/Perfect scale/i);
	});

	it('generates correct notes for Left Hand (octave 2)', () => {
		const expected = generateExpectedNotesFor('C', 'Maj', false);
		// C2 is 48. C Major scale: 48, 50, 52, 53, 55, 57, 59, 60
		expect(expected[0]).toBe(48);
		expect(expected[expected.length - 1]).toBe(60);
		expect(expected.length).toBe(8);
	});
});
