/**
 * Utilities for analyzing and annotating musical scores
 * Provides II-V-I detection, chord analysis, and beginner-friendly annotations
 */

import type { MusicXMLSong, SongChord, TwoFiveOneProgression, AnnotationType } from './types/musicxml';
import { chords } from './MusicTheoryUtils';
import type { Note, ChordType } from './types/notes';
import { NoteToMidi, MidiToNote } from './types/notes.constants';
import type { MidiNote, NoteFullName } from './types/types';

/**
 * Detect II-V-I progressions in a song's chord sequence
 */
export function detectTwoFiveOneProgressions(song: MusicXMLSong): TwoFiveOneProgression[] {
	if (!song.chords || song.chords.length < 3) return [];
	
	const progressions: TwoFiveOneProgression[] = [];
	
	for (let i = 0; i < song.chords.length - 2; i++) {
		const chord1 = song.chords[i];
		const chord2 = song.chords[i + 1];
		const chord3 = song.chords[i + 2];
		
		// Check for II-V-I pattern
		const result = analyzeProgression(chord1, chord2, chord3, song.key);
		
		if (result.isTwoFiveOne) {
			progressions.push({
				startMeasure: chord1.measure,
				endMeasure: chord3.measure,
				iiChord: {
					measure: chord1.measure,
					beat: chord1.beat,
					root: chord1.root,
					kind: chord1.quality,
					text: `${chord1.root}${chord1.quality}`
				},
				vChord: {
					measure: chord2.measure,
					beat: chord2.beat,
					root: chord2.root,
					kind: chord2.quality,
					text: `${chord2.root}${chord2.quality}`
				},
				iChord: {
					measure: chord3.measure,
					beat: chord3.beat,
					root: chord3.root,
					kind: chord3.quality,
					text: `${chord3.root}${chord3.quality}`
				},
				key: result.key
			});
		}
	}
	
	return progressions;
}

/**
 * Analyze three consecutive chords to see if they form a II-V-I
 */
function analyzeProgression(
	chord1: SongChord,
	chord2: SongChord,
	chord3: SongChord,
	songKey?: string
): { isTwoFiveOne: boolean; key: string } {
	// Get the roots as semitone numbers
	const root1 = noteToSemitone(chord1.root);
	const root2 = noteToSemitone(chord2.root);
	const root3 = noteToSemitone(chord3.root);
	
	if (root1 === null || root2 === null || root3 === null) {
		return { isTwoFiveOne: false, key: '' };
	}
	
	// Calculate intervals
	const interval1 = (root2 - root1 + 12) % 12; // Should be 7 (perfect fifth)
	const interval2 = (root3 - root2 + 12) % 12; // Should be 7 (perfect fifth)
	
	// Check if it's a perfect fifth movement
	if (interval1 !== 7 || interval2 !== 7) {
		return { isTwoFiveOne: false, key: '' };
	}
	
	// Check chord qualities
	const quality1 = normalizeQuality(chord1.quality);
	const quality2 = normalizeQuality(chord2.quality);
	const quality3 = normalizeQuality(chord3.quality);
	
	// II chord should be minor, V chord should be dominant, I chord should be major or maj7
	const isMinorQuality = (q: string) => q === 'm' || q === 'm7' || q === 'min';
	const isDominantQuality = (q: string) => q === '7' || q === 'dominant' || q === '9' || q === '13';
	const isMajorQuality = (q: string) => q === '' || q === 'maj' || q === 'maj7' || q === '6' || q === 'major';
	
	if (isMinorQuality(quality1) && isDominantQuality(quality2) && isMajorQuality(quality3)) {
		// Determine the key (root of the I chord)
		const key = chord3.root;
		return { isTwoFiveOne: true, key };
	}
	
	return { isTwoFiveOne: false, key: '' };
}

/**
 * Convert note name to semitone number (C = 0, C# = 1, etc.)
 */
function noteToSemitone(note: string): number | null {
	const normalized = note.trim();
	const noteMap: Record<string, number> = {
		'C': 0, 'C#': 1, 'Db': 1,
		'D': 2, 'D#': 3, 'Eb': 3,
		'E': 4, 'Fb': 4, 'E#': 5,
		'F': 5, 'F#': 6, 'Gb': 6,
		'G': 7, 'G#': 8, 'Ab': 8,
		'A': 9, 'A#': 10, 'Bb': 10,
		'B': 11, 'Cb': 11, 'B#': 0
	};
	return noteMap[normalized] ?? null;
}

/**
 * Normalize chord quality string
 */
function normalizeQuality(quality: string): string {
	const q = quality.toLowerCase().trim();
	if (q.includes('min') || q === 'm' || q.includes('minor')) return 'm';
	if (q.includes('maj7') || q.includes('major-seventh')) return 'maj7';
	if (q.includes('7') && !q.includes('m7')) return '7';
	if (q.includes('dim')) return 'dim';
	if (q.includes('aug')) return 'aug';
	if (q === '') return '';
	return q;
}

/**
 * Get the inversion of a chord based on bass note
 */
export function getChordInversion(chord: SongChord): { inversion: number; inversionName: string } {
	if (!chord.bass) {
		return { inversion: 0, inversionName: 'Root Position' };
	}
	
	const rootSemitone = noteToSemitone(chord.root);
	const bassSemitone = noteToSemitone(chord.bass);
	
	if (rootSemitone === null || bassSemitone === null) {
		return { inversion: 0, inversionName: 'Root Position' };
	}
	
	// Calculate the interval from root to bass
	const interval = (bassSemitone - rootSemitone + 12) % 12;
	
	const inversionMap: Record<number, { inversion: number; name: string }> = {
		0: { inversion: 0, name: 'Root Position' },
		3: { inversion: 1, name: '1st Inversion' },
		4: { inversion: 1, name: '1st Inversion' }, // Major/minor third
		7: { inversion: 2, name: '2nd Inversion' },
		8: { inversion: 2, name: '2nd Inversion' }, // For 7th chords
		10: { inversion: 3, name: '3rd Inversion' },
	};
	
	const result = inversionMap[interval];
	return result ? 
		{ inversion: result.inversion, inversionName: result.name } : 
		{ inversion: 0, inversionName: 'Root Position' };
}

/**
 * Analyze chord tones for a given melody note
 */
export function analyzeChordTone(
	melodyNote: number,
	chordRoot: string,
	chordQuality: string
): { role: string; interval: number; isChordTone: boolean } {
	const rootSemitone = noteToSemitone(chordRoot);
	if (rootSemitone === null) {
		return { role: 'unknown', interval: 0, isChordTone: false };
	}
	
	// Get melody note semitone (octave doesn't matter for interval)
	const melodySemitone = melodyNote % 12;
	const interval = (melodySemitone - rootSemitone + 12) % 12;
	
	// Map intervals to chord tones
	const intervalMap: Record<number, string> = {
		0: 'Root',
		1: 'b9 (tension)',
		2: '9 (tension)',
		3: 'Minor 3rd',
		4: 'Major 3rd',
		5: '11 (tension)',
		6: 'Tritone (tension)',
		7: '5th',
		8: 'b13 (tension)',
		9: '13 (tension)',
		10: 'Minor 7th',
		11: 'Major 7th'
	};
	
	const role = intervalMap[interval] || 'extension';
	const isChordTone = ['Root', 'Major 3rd', 'Minor 3rd', '5th', 'Minor 7th', 'Major 7th'].includes(role);
	
	return { role, interval, isChordTone };
}

/**
 * Generate annotations for a song
 */
export function generateAnnotations(song: MusicXMLSong): AnnotationType[] {
	const annotations: AnnotationType[] = [];
	
	// Detect II-V-I progressions
	const progressions = detectTwoFiveOneProgressions(song);
	for (const prog of progressions) {
		annotations.push({
			type: 'ii-v-i',
			measures: [prog.startMeasure, prog.startMeasure + 1, prog.startMeasure + 2]
		});
	}
	
	// Add chord inversion annotations
	if (song.chords) {
		for (let i = 0; i < song.chords.length; i++) {
			const chord = song.chords[i];
			const { inversion, inversionName } = getChordInversion(chord);
			
			if (inversion > 0) {
				annotations.push({
					type: 'chord-inversion',
					measure: chord.measure,
					voice: 0,
					inversion: inversionName
				});
			}
		}
	}
	
	return annotations;
}

/**
 * Get beginner-friendly annotation for a chord
 */
export function getBeginnerChordAnnotation(chord: SongChord): string {
	const { inversion, inversionName } = getChordInversion(chord);
	const root = chord.root;
	const quality = chord.quality;
	
	let annotation = `${root}${quality}`;
	
	if (inversion > 0) {
		annotation += ` (${inversionName})`;
	}
	
	if (chord.bass) {
		annotation += ` /${chord.bass}`;
	}
	
	return annotation;
}

/**
 * Generate finger-friendly voicing suggestions for a chord
 */
export function getVoicingSuggestion(
	chord: SongChord,
	inversion: number = 0
): { leftHand: string[]; rightHand: string[] } {
	// Convert to proper format for MusicTheoryUtils
	const rootNote = chord.root as Note;
	const chordType = (chord.quality || 'major') as ChordType;
	
	// Get chord notes
	const rootMidi = NoteToMidi[`${rootNote}3` as keyof typeof NoteToMidi];
	const chordData = chords(rootMidi, chordType, inversion as 0 | 1 | 2 | 3);
	
	const chordNotes = [
		chordData.root,
		chordData.third,
		chordData.fifth,
		chordData.seventh
	].filter((n): n is MidiNote => n !== undefined);
	
	// Convert to note names
	const noteNames = chordNotes.map(midi => MidiToNote[midi as MidiNote]).filter(Boolean);
	
	// Split for two hands - simple rootless voicing for jazz
	if (chordNotes.length >= 3) {
		// Left hand: root (and possibly 5th for basic voicing)
		const leftHandNotes = [MidiToNote[chordData.root as MidiNote]];
		
		// Right hand: 3rd, 5th, 7th (or 3rd, 7th for shell voicing)
		const rightHandNotes = [
			chordData.third,
			chordData.seventh || chordData.fifth
		].filter((n): n is MidiNote => n !== undefined)
		 .map(midi => MidiToNote[midi as MidiNote])
		 .filter(Boolean);
		
		return {
			leftHand: leftHandNotes,
			rightHand: rightHandNotes
		};
	}
	
	return {
		leftHand: [MidiToNote[chordData.root as MidiNote]],
		rightHand: noteNames
	};
}

/**
 * Calculate optimal voice leading between two chords
 */
export function calculateOptimalVoiceLeading(
	fromChord: SongChord,
	toChord: SongChord,
	fromInversion: number = 0
): { suggestedInversion: number; movement: number } {
	// Try different inversions for the target chord
	let bestInversion = 0;
	let minMovement = Infinity;
	
	for (let inv = 0; inv < 4; inv++) {
		// Get notes for both chords
		const fromVoicing = getVoicingSuggestion(fromChord, fromInversion);
		const toVoicing = getVoicingSuggestion(toChord, inv);
		
		// Calculate total semitone movement (simplified)
		const fromNotes = [...fromVoicing.leftHand, ...fromVoicing.rightHand];
		const toNotes = [...toVoicing.leftHand, ...toVoicing.rightHand];
		
		let totalMovement = 0;
		const minLength = Math.min(fromNotes.length, toNotes.length);
		
		for (let i = 0; i < minLength; i++) {
			const fromMidi = NoteToMidi[fromNotes[i] as keyof typeof NoteToMidi];
			const toMidi = NoteToMidi[toNotes[i] as keyof typeof NoteToMidi];
			if (fromMidi !== undefined && toMidi !== undefined) {
				totalMovement += Math.abs(toMidi - fromMidi);
			}
		}
		
		if (totalMovement < minMovement) {
			minMovement = totalMovement;
			bestInversion = inv;
		}
	}
	
	return { suggestedInversion: bestInversion, movement: minMovement };
}

/**
 * Generate practice hints for a chord progression
 */
export function generatePracticeHints(chords: SongChord[]): string[] {
	const hints: string[] = [];
	
	// Find II-V-Is
	const progressions = detectTwoFiveOneProgressions({ chords } as MusicXMLSong);
	
	if (progressions.length > 0) {
		hints.push(`Found ${progressions.length} II-V-I progression(s) - these are the building blocks of jazz harmony!`);
	}
	
	// Analyze chord movement
	for (let i = 1; i < chords.length; i++) {
		const prev = chords[i - 1];
		const curr = chords[i];
		
		// Check for circle of fifths movement
		const prevRoot = noteToSemitone(prev.root);
		const currRoot = noteToSemitone(curr.root);
		
		if (prevRoot !== null && currRoot !== null) {
			const movement = (currRoot - prevRoot + 12) % 12;
			
			if (movement === 7) {
				hints.push(`Measure ${curr.measure}: Circle of fifths movement - very common in jazz!`);
			} else if (movement === 5) {
				hints.push(`Measure ${curr.measure}: Descending fifth - try voice leading down.`);
			}
		}
		
		// Check for tritone substitutions (simplified detection)
		const { inversion } = getChordInversion(curr);
		if (inversion > 0) {
			hints.push(`Measure ${curr.measure}: Inverted chord - bass note is ${curr.bass}.`);
		}
	}
	
	return hints;
}

/**
 * Get the scale degrees for a chord in a given key
 */
export function getChordScaleDegrees(chord: SongChord, key: string): string {
	const keyRoot = noteToSemitone(key);
	const chordRoot = noteToSemitone(chord.root);
	
	if (keyRoot === null || chordRoot === null) return '?';
	
	const degree = ((chordRoot - keyRoot + 12) % 12);
	
	const degreeMap: Record<number, string> = {
		0: 'I',
		1: 'bII',
		2: 'II',
		3: 'bIII',
		4: 'III',
		5: 'IV',
		6: 'bV (tritone)',
		7: 'V',
		8: 'bVI',
		9: 'VI',
		10: 'bVII',
		11: 'VII'
	};
	
	return degreeMap[degree] || '?';
}
