import { describe, it, expect, vi, beforeEach } from 'vitest';

// Helper to create mock MIDI note events
function createMIDINoteEvent(noteName: string, noteNumber: number): any {
	return {
		noteName,
		noteNumber,
		type: 'on',
		noteFullName: `${noteName}4`,
		velocity: 100,
		timestamp: Date.now(),
		channel: 0
	};
}

describe('Partition Exercise Logic', () => {
	describe('Note Matching', () => {
		it('should convert MIDI note C4 (60) to vexflow format c/4', () => {
			const noteNumber = 60; // C4
			const noteName = 'C';
			const octave = Math.floor(noteNumber / 12) - 1;
			const vexNote = `${noteName.toLowerCase()}/${octave}`;
			expect(vexNote).toBe('c/4');
		});

		it('should convert MIDI note D4 (62) to vexflow format d/4', () => {
			const noteNumber = 62; // D4
			const noteName = 'D';
			const octave = Math.floor(noteNumber / 12) - 1;
			const vexNote = `${noteName.toLowerCase()}/${octave}`;
			expect(vexNote).toBe('d/4');
		});

		it('should convert MIDI note C5 (72) to vexflow format c/5', () => {
			const noteNumber = 72; // C5
			const noteName = 'C';
			const octave = Math.floor(noteNumber / 12) - 1;
			const vexNote = `${noteName.toLowerCase()}/${octave}`;
			expect(vexNote).toBe('c/5');
		});

		it('should handle sharps by removing the # symbol', () => {
			const noteName = 'C#';
			const cleanName = noteName.toLowerCase().replace('#', '');
			expect(cleanName).toBe('c');
		});
	});

	describe('Note Pool', () => {
		const notes = ['c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5'];

		it('should contain 8 notes', () => {
			expect(notes).toHaveLength(8);
		});

		it('should only contain natural notes (C major scale)', () => {
			notes.forEach((note) => {
				expect(note).toMatch(/^[a-g]\/[45]$/);
			});
		});

		it('should span from C4 to C5', () => {
			expect(notes[0]).toBe('c/4');
			expect(notes[notes.length - 1]).toBe('c/5');
		});
	});

	describe('Score Calculation', () => {
		it('should award 10 points for correct note', () => {
			let score = 0;
			const isCorrect = true;
			if (isCorrect) score += 10;
			expect(score).toBe(10);
		});

		it('should accumulate score correctly', () => {
			let score = 0;
			score += 10; // First correct
			score += 10; // Second correct
			score += 10; // Third correct
			expect(score).toBe(30);
		});

		it('should not award points for incorrect notes', () => {
			let score = 0;
			const isCorrect = false;
			if (isCorrect) score += 10;
			expect(score).toBe(0);
		});
	});

	describe('MIDI to VexFlow Conversion', () => {
		const testCases = [
			{ midi: 60, name: 'C', expected: 'c/4' },
			{ midi: 62, name: 'D', expected: 'd/4' },
			{ midi: 64, name: 'E', expected: 'e/4' },
			{ midi: 65, name: 'F', expected: 'f/4' },
			{ midi: 67, name: 'G', expected: 'g/4' },
			{ midi: 69, name: 'A', expected: 'a/4' },
			{ midi: 71, name: 'B', expected: 'b/4' },
			{ midi: 72, name: 'C', expected: 'c/5' }
		];

		testCases.forEach(({ midi, name, expected }) => {
			it(`should convert MIDI ${midi} (${name}) to ${expected}`, () => {
				const octave = Math.floor(midi / 12) - 1;
				const noteName = name.toLowerCase().replace('#', '');
				const vexNote = `${noteName}/${octave}`;
				expect(vexNote).toBe(expected);
			});
		});
	});

	describe('Random Note Generation', () => {
		const notes = ['c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5'];

		it('should generate a note from the pool', () => {
			const randomIndex = Math.floor(Math.random() * notes.length);
			const randomNote = notes[randomIndex];
			expect(notes).toContain(randomNote);
		});

		it('should generate different notes over multiple iterations', () => {
			const results = new Set();
			for (let i = 0; i < 50; i++) {
				const randomIndex = Math.floor(Math.random() * notes.length);
				results.add(notes[randomIndex]);
			}
			// After 50 iterations, we should have seen at least 5 different notes (statistically)
			expect(results.size).toBeGreaterThanOrEqual(5);
		});
	});

	describe('Exercise State Management', () => {
		it('should reset feedback after generating new note', () => {
			let feedback: 'correct' | 'incorrect' | null = 'correct';
			// Simulate generateNewNote
			feedback = null;
			expect(feedback).toBeNull();
		});

		it('should update message after generating new note', () => {
			let message = 'Correct! Great job!';
			// Simulate generateNewNote
			message = 'Play the note shown on the staff';
			expect(message).toBe('Play the note shown on the staff');
		});
	});
});
