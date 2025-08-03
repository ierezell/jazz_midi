/**
 * Chord tone coloring system for visual feedback
 */

import type { MidiNote } from '../../midi/midi';

export type ChordToneRole = 'root' | 'third' | 'fifth' | 'seventh' | 'extension' | 'none';

export interface ChordToneInfo {
	noteNumber: MidiNote;
	role: ChordToneRole;
	color: string;
}

export interface ChordToneColors {
	root: string;
	third: string;
	fifth: string;
	seventh: string;
	extension: string;
	none: string;
}

export const DEFAULT_CHORD_TONE_COLORS: ChordToneColors = {
	root: '#e74c3c', // Red - strong, foundational
	third: '#f39c12', // Orange - warm, defines major/minor
	fifth: '#3498db', // Blue - stable, supportive
	seventh: '#9b59b6', // Purple - adds color and sophistication
	extension: '#2ecc71', // Green - adds complexity
	none: 'transparent' // No coloring for non-chord tones
};

/**
 * Analyze which chord tone role a note plays in the current chord
 */
export function analyzeChordTone(
	noteNumber: MidiNote,
	chordNotes: { root: MidiNote; third: MidiNote; fifth: MidiNote; seventh?: MidiNote }
): ChordToneRole {
	// Normalize note to within one octave for comparison
	const normalizedNote = noteNumber % 12;
	const rootNormalized = chordNotes.root % 12;
	const thirdNormalized = chordNotes.third % 12;
	const fifthNormalized = chordNotes.fifth % 12;
	const seventhNormalized = chordNotes.seventh ? chordNotes.seventh % 12 : null;

	if (normalizedNote === rootNormalized) return 'root';
	if (normalizedNote === thirdNormalized) return 'third';
	if (normalizedNote === fifthNormalized) return 'fifth';
	if (seventhNormalized !== null && normalizedNote === seventhNormalized) return 'seventh';

	return 'none';
}

/**
 * Get color for a chord tone role
 */
export function getChordToneColor(
	role: ChordToneRole,
	colors: ChordToneColors = DEFAULT_CHORD_TONE_COLORS
): string {
	return colors[role];
}

/**
 * Create chord tone info array for all notes in a range
 */
export function createChordToneMapping(
	startNote: MidiNote,
	endNote: MidiNote,
	chordNotes: { root: MidiNote; third: MidiNote; fifth: MidiNote; seventh?: MidiNote },
	colors: ChordToneColors = DEFAULT_CHORD_TONE_COLORS
): ChordToneInfo[] {
	const mapping: ChordToneInfo[] = [];

	for (let noteNumber = startNote; noteNumber <= endNote; noteNumber++) {
		const role = analyzeChordTone(noteNumber as MidiNote, chordNotes);
		const color = getChordToneColor(role, colors);

		mapping.push({
			noteNumber: noteNumber as MidiNote,
			role,
			color
		});
	}

	return mapping;
}
