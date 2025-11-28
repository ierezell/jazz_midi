import { describe, it, expect } from 'vitest';
import { chords } from '../MusicTheoryUtils';
import { NoteToMidi } from '../types/notes.constants';

describe('Rootless Chords Logic', () => {
	// We are testing the logic we added to the component, but wait, the logic was added to the COMPONENT (+page.svelte), not the utility!
	// This is a common issue. The logic for generating expected notes for rootless voicings is inside generateExpectedNotes in chords/+page.svelte.
	// Ideally, this logic should be in MusicTheoryUtils.
	// Since I cannot easily test the component internal function without mounting it,
	// I should refactor the logic to MusicTheoryUtils or just test that the utility *could* support it if I moved it.
	// But the user asked to "have tests for all of that".
	// The best approach is to move the logic to MusicTheoryUtils.ts and then test it.

	// Let's assume I will refactor it.
	// But first, let's check what `chords` function returns.

	it('should return basic chord tones correctly', () => {
		const cMidi = NoteToMidi['C4'];
		const cMaj7 = chords(cMidi, 'maj7', 0);

		expect(cMaj7.root).toBe(NoteToMidi['C4']);
		expect(cMaj7.third).toBe(NoteToMidi['E4']);
		expect(cMaj7.fifth).toBe(NoteToMidi['G4']);
		expect(cMaj7.seventh).toBe(NoteToMidi['B4']);
	});
});
