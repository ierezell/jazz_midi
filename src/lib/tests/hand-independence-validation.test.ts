import { describe, it, expect, beforeEach } from 'vitest';
import {
	validateHandNote,
	isHandIndependenceCompleted,
	midiToNoteName,
	LH_SPLIT,
	type HandIndependenceState
} from '../handIndependenceValidation';
import type { MidiNote, Note, NoteFullName, NoteEvent } from '../types/types';

// Level 1 data (mirrors hand_independence page)
const L1_LH: MidiNote[] = [36, 58] as MidiNote[]; // C2, Bb3
const L1_RH: MidiNote[] = [60, 62, 64, 65, 67, 69, 71, 72] as MidiNote[]; // C4–C5

function makeEvent(noteNumber: number): NoteEvent {
	return {
		noteNumber: noteNumber as MidiNote,
		type: 'on',
		noteName: 'C' as Note,
		noteFullName: 'C4' as NoteFullName,
		velocity: 80,
		timestamp: Date.now(),
		channel: 1
	};
}

function freshState(): HandIndependenceState {
	return { lhCollected: new Set(), rhProgress: 0 };
}

describe('midiToNoteName', () => {
	it('converts MIDI 60 to C4', () => {
		expect(midiToNoteName(60)).toBe('C4');
	});

	it('converts MIDI 36 to C2', () => {
		expect(midiToNoteName(36)).toBe('C2');
	});

	it('converts MIDI 61 to C#4', () => {
		expect(midiToNoteName(61)).toBe('C#4');
	});

	it('converts MIDI 69 to A4', () => {
		expect(midiToNoteName(69)).toBe('A4');
	});
});

describe('LH_SPLIT constant', () => {
	it('is 60 (middle C)', () => {
		expect(LH_SPLIT).toBe(60);
	});
});

describe('validateHandNote — Left Hand', () => {
	let state: HandIndependenceState;

	beforeEach(() => {
		state = freshState();
	});

	it('accepts a note whose pitch class matches an LH expected note', () => {
		// C2 = MIDI 36. Pitch class 0 = C. Playing C2 should match.
		const result = validateHandNote(makeEvent(36), L1_LH, L1_RH, state);
		expect(result.isCorrect).toBe(true);
		expect(result.collected).toBe(true);
	});

	it('accepts same pitch class in a different octave (enharmonic)', () => {
		// C3 = MIDI 48. Pitch class 0 — matches C2 in lhExpected
		const result = validateHandNote(makeEvent(48), L1_LH, L1_RH, state);
		expect(result.isCorrect).toBe(true);
	});

	it('rejects an LH note with unmatched pitch class', () => {
		// D2 = MIDI 38. Pitch class 2 — not in [C, Bb]
		const result = validateHandNote(makeEvent(38), L1_LH, L1_RH, state);
		expect(result.isCorrect).toBe(false);
		expect(result.message).toContain('Not an expected note');
	});

	it('accumulates collected notes in state', () => {
		validateHandNote(makeEvent(36), L1_LH, L1_RH, state); // C2
		expect(state.lhCollected.has(36)).toBe(true);
	});

	it('reports progress message with count', () => {
		const result = validateHandNote(makeEvent(36), L1_LH, L1_RH, state);
		expect(result.message).toMatch(/LH:/);
	});

	it('reports "LH complete!" when all pitch classes collected', () => {
		validateHandNote(makeEvent(36), L1_LH, L1_RH, state); // C — pitch class 0
		const result = validateHandNote(makeEvent(58), L1_LH, L1_RH, state); // Bb3 — pitch class 10
		expect(result.message).toBe('LH complete!');
	});

	it('does not reset rhProgress when LH note plays', () => {
		state.rhProgress = 3;
		validateHandNote(makeEvent(36), L1_LH, L1_RH, state);
		expect(state.rhProgress).toBe(3);
	});
});

describe('validateHandNote — Right Hand', () => {
	let state: HandIndependenceState;

	beforeEach(() => {
		state = freshState();
	});

	it('accepts the first RH note in sequence (C4 = 60)', () => {
		const result = validateHandNote(makeEvent(60), L1_LH, L1_RH, state);
		expect(result.isCorrect).toBe(true);
		expect(state.rhProgress).toBe(1);
	});

	it('advances rhProgress on each correct note', () => {
		for (let i = 0; i < L1_RH.length; i++) {
			const result = validateHandNote(makeEvent(L1_RH[i]), L1_LH, L1_RH, state);
			expect(result.isCorrect).toBe(true);
			expect(state.rhProgress).toBe(i + 1);
		}
	});

	it('rejects a note that skips ahead and resets progress', () => {
		// First note correct
		validateHandNote(makeEvent(60), L1_LH, L1_RH, state); // C4
		// Skip to E4 (MIDI 64) skipping D4 (62)
		const result = validateHandNote(makeEvent(64), L1_LH, L1_RH, state);
		expect(result.isCorrect).toBe(false);
		expect(result.message).toContain('restart scale');
		expect(state.rhProgress).toBe(0);
	});

	it('rejects a note that is too low without resetting progress', () => {
		validateHandNote(makeEvent(60), L1_LH, L1_RH, state); // C4 correct
		const progressBefore = state.rhProgress; // 1
		// Play B3 (MIDI 59) — lower than next expected D4 (62)
		const result = validateHandNote(makeEvent(59), L1_LH, L1_RH, state);
		expect(result.isCorrect).toBe(false);
		expect(state.rhProgress).toBe(progressBefore); // unchanged
	});

	it('includes expected note name in rejection message for too-low note', () => {
		// Advance to expecting D4 (MIDI 62), then play C4 (60) — valid RH note but below next expected
		validateHandNote(makeEvent(60), L1_LH, L1_RH, state); // play C4, rhProgress → 1
		const result = validateHandNote(makeEvent(60), L1_LH, L1_RH, state); // C4 < D4 expected
		expect(result.isCorrect).toBe(false);
		expect(result.message).toContain('D4'); // next expected note name
	});

	it('does not affect lhCollected when RH note plays', () => {
		state.lhCollected = new Set([36]);
		validateHandNote(makeEvent(60), L1_LH, L1_RH, state);
		expect(state.lhCollected.has(36)).toBe(true);
	});
});

describe('isHandIndependenceCompleted', () => {
	it('returns false when neither hand is complete', () => {
		const state = freshState();
		expect(isHandIndependenceCompleted(L1_LH, L1_RH, state)).toBe(false);
	});

	it('returns false when only LH is complete', () => {
		const state: HandIndependenceState = {
			lhCollected: new Set([36, 58]),
			rhProgress: 0
		};
		expect(isHandIndependenceCompleted(L1_LH, L1_RH, state)).toBe(false);
	});

	it('returns false when only RH is complete', () => {
		const state: HandIndependenceState = {
			lhCollected: new Set(),
			rhProgress: L1_RH.length
		};
		expect(isHandIndependenceCompleted(L1_LH, L1_RH, state)).toBe(false);
	});

	it('returns true when both hands are complete', () => {
		const state: HandIndependenceState = {
			lhCollected: new Set([36, 58]),
			rhProgress: L1_RH.length
		};
		expect(isHandIndependenceCompleted(L1_LH, L1_RH, state)).toBe(true);
	});

	it('uses pitch class matching for LH completion check', () => {
		// Using C3 (48) instead of C2 (36) — same pitch class 0
		const state: HandIndependenceState = {
			lhCollected: new Set([48, 58]), // C3 instead of C2 — still pitch class 0
			rhProgress: L1_RH.length
		};
		expect(isHandIndependenceCompleted(L1_LH, L1_RH, state)).toBe(true);
	});

	it('works with Level 2 data', () => {
		const L2_LH: MidiNote[] = [36, 40, 43, 47] as MidiNote[];
		const L2_RH: MidiNote[] = [60, 64, 67, 69, 72] as MidiNote[];
		const state: HandIndependenceState = {
			lhCollected: new Set([36, 40, 43, 47]),
			rhProgress: L2_RH.length
		};
		expect(isHandIndependenceCompleted(L2_LH, L2_RH, state)).toBe(true);
	});
});

describe('full exercise flow (L1)', () => {
	it('completes exercise after playing all notes correctly', () => {
		const state = freshState();

		// Play both LH notes
		validateHandNote(makeEvent(36), L1_LH, L1_RH, state); // C2
		validateHandNote(makeEvent(58), L1_LH, L1_RH, state); // Bb3

		// Play all RH notes in order
		for (const note of L1_RH) {
			validateHandNote(makeEvent(note), L1_LH, L1_RH, state);
		}

		expect(isHandIndependenceCompleted(L1_LH, L1_RH, state)).toBe(true);
	});

	it('is not complete after partial LH + full RH', () => {
		const state = freshState();
		validateHandNote(makeEvent(36), L1_LH, L1_RH, state); // only one LH note
		for (const note of L1_RH) {
			validateHandNote(makeEvent(note), L1_LH, L1_RH, state);
		}
		expect(isHandIndependenceCompleted(L1_LH, L1_RH, state)).toBe(false);
	});
});
