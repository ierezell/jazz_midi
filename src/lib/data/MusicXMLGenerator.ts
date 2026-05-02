/**
 * Generate MusicXML from note data for OSMD rendering
 * This allows any exercise to display notes using OSMD's professional rendering
 */

import type { MidiNote, Note, NoteFullName } from '../types/types';
import { NoteToMidi, MidiToNote } from '../types/notes.constants';

export interface MusicXMLNote {
	pitch: MidiNote;
	duration: number; // in divisions (quarter = 4)
	measure: number;
	beat: number;
	voice?: number;
	staff?: number; // 1 = upper, 2 = lower
	type?: 'note' | 'chord' | 'rest';
	velocity?: number; // MIDI velocity for playback/dynamics
}

export interface MusicXMLOptions {
	title?: string;
	composer?: string;
	tempo?: number;
	key?: Note;
	timeSignature?: { numerator: number; denominator: number };
	divisions?: number; // Pulses per quarter note
}

const DEFAULT_OPTIONS: MusicXMLOptions = {
	title: '',
	composer: '',
	tempo: 120,
	key: 'C',
	timeSignature: { numerator: 4, denominator: 4 },
	divisions: 4
};

/**
 * Generate a complete MusicXML document from notes
 */
export function generateMusicXML(notes: MusicXMLNote[], options: MusicXMLOptions = {}): string {
	const opts = { ...DEFAULT_OPTIONS, ...options };
	const { divisions } = opts;

	// Group notes by measure
	const measuresByNumber = new Map<number, MusicXMLNote[]>();
	for (const note of notes) {
		const measureNum = note.measure || 1;
		if (!measuresByNumber.has(measureNum)) {
			measuresByNumber.set(measureNum, []);
		}
		measuresByNumber.get(measureNum)!.push(note);
	}

	// Generate measure XML
	const measureXML: string[] = [];
	const sortedMeasures = Array.from(measuresByNumber.entries()).sort((a, b) => a[0] - b[0]);
	const safeDivisions = divisions ?? 4;

	for (const [measureNum, measureNotes] of sortedMeasures) {
		const measureContent = generateMeasure(
			measureNotes,
			measureNum,
			safeDivisions,
			measureNum === 1,
			opts
		);
		measureXML.push(measureContent);
	}

	// Build complete document
	return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <work>
    <work-title>${escapeXml(opts.title || 'Exercise')}</work-title>
  </work>
  <identification>
    <creator type="composer">${escapeXml(opts.composer || '')}</creator>
  </identification>
  <part-list>
    <score-part id="P1">
      <part-name display="no">Piano</part-name>
      <part-abbreviation display="no">Pno.</part-abbreviation>
      <score-instrument id="P1-I1">
        <instrument-name>Piano</instrument-name>
      </score-instrument>
      <midi-instrument id="P1-I1">
        <midi-channel>1</midi-channel>
        <midi-program>1</midi-program>
      </midi-instrument>
    </score-part>
  </part-list>
  <part id="P1">
${measureXML.join('\n')}
  </part>
</score-partwise>`;
}

/**
 * Generate XML for a single measure
 */
function generateMeasure(
	notes: MusicXMLNote[],
	measureNumber: number,
	divisions: number,
	isFirst: boolean,
	options: MusicXMLOptions
): string {
	const attributes = isFirst ? generateAttributes(options, divisions) : '';

	// Sort notes by beat
	const sortedNotes = notes.sort((a, b) => (a.beat || 0) - (b.beat || 0));

	// Group by voice and beat for proper chord handling
	const notesByVoice = new Map<number, MusicXMLNote[]>();
	for (const note of sortedNotes) {
		const voice = note.voice || 1;
		if (!notesByVoice.has(voice)) {
			notesByVoice.set(voice, []);
		}
		notesByVoice.get(voice)!.push(note);
	}

	// Generate note elements — each voice gets a <backup> between them
	const noteElements: string[] = [];
	const voices = Array.from(notesByVoice.keys()).sort((a, b) => a - b);
	for (let vi = 0; vi < voices.length; vi++) {
		const voice = voices[vi];
		const voiceNotes = notesByVoice.get(voice)!;
		// Backup to start of measure before each voice after the first
		if (vi > 0) {
			const totalDivisions = (options.timeSignature?.numerator ?? 4) * (divisions ?? 4);
			noteElements.push(`      <backup>\n        <duration>${totalDivisions}</duration>\n      </backup>`);
		}
		for (let i = 0; i < voiceNotes.length; i++) {
			const note = voiceNotes[i];
			const isChord = i > 0 && voiceNotes[i].beat === voiceNotes[i - 1].beat;
			noteElements.push(generateNoteElement(note, divisions, voice, isChord));
		}
	}

	// Add tempo marking to first measure
	let direction = '';
	if (isFirst && options.tempo) {
		direction = `    <direction placement="above">
      <direction-type>
        <metronome parentheses="no" default-x="-38.24" relative-y="20.00">
          <beat-unit>quarter</beat-unit>
          <per-minute>${options.tempo}</per-minute>
        </metronome>
      </direction-type>
      <sound tempo="${options.tempo}" />
    </direction>`;
	}

	return `    <measure number="${measureNumber}">
${attributes}${direction ? '\n' + direction : ''}
${noteElements.join('\n')}
    </measure>`;
}

/**
 * Generate attributes element (clef, key, time)
 */
function generateAttributes(options: MusicXMLOptions, divisions: number): string {
	const { key, timeSignature } = options;

	// Convert key to fifths
	const keyFifths = key ? noteToFifths(key) : 0;

	return `    <attributes>
      <divisions>${divisions}</divisions>
      <key>
        <fifths>${keyFifths}</fifths>
      </key>
      <time>
        <beats>${timeSignature?.numerator || 4}</beats>
        <beat-type>${timeSignature?.denominator || 4}</beat-type>
      </time>
      <clef number="1">
        <sign>G</sign>
        <line>2</line>
      </clef>
      <clef number="2">
        <sign>F</sign>
        <line>4</line>
      </clef>
      <staff-details number="1">
        <staff-lines>5</staff-lines>
      </staff-details>
      <staff-details number="2">
        <staff-lines>5</staff-lines>
      </staff-details>
    </attributes>
`;
}

/**
 * Generate a note element
 */
function generateNoteElement(
	note: MusicXMLNote,
	divisions: number,
	voice: number,
	isChord: boolean
): string {
	if (note.type === 'rest') {
		return `      <note>
        <rest />
        <duration>${note.duration}</duration>
        <voice>${voice}</voice>
        <type>${durationToType(note.duration, divisions)}</type>
      </note>`;
	}

	const pitch = midiToPitch(note.pitch);
	const notehead = note.velocity !== undefined ? velocityToNotehead(note.velocity) : '';
	const dynamics =
		note.velocity !== undefined
			? `<dynamics>${Math.round((note.velocity / 127) * 100)}</dynamics>`
			: '';

	return `      <note${isChord ? '><chord/>' : '>'}
        <pitch>
          <step>${pitch.step}</step>
          ${pitch.alter !== 0 ? `<alter>${pitch.alter}</alter>` : ''}
          <octave>${pitch.octave}</octave>
        </pitch>
        <duration>${note.duration}</duration>
        <voice>${voice}</voice>
        <type>${durationToType(note.duration, divisions)}</type>
        <staff>${note.staff || 1}</staff>
        ${notehead ? `<notehead>${notehead}</notehead>` : ''}
        ${dynamics}
      </note>`;
}

/**
 * Convert MIDI note number to pitch elements
 */
function midiToPitch(midi: MidiNote): { step: string; alter: number; octave: number } {
	const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
	const pc = midi % 12;
	const octave = Math.floor(midi / 12) - 1;
	const name = noteNames[pc];

	if (name.includes('#')) {
		return { step: name[0], alter: 1, octave };
	}
	return { step: name, alter: 0, octave };
}

/**
 * Convert duration to note type
 */
function durationToType(duration: number, divisions: number): string {
	const ratio = duration / divisions;

	if (ratio >= 4) return 'whole';
	if (ratio >= 2) return 'half';
	if (ratio >= 1) return 'quarter';
	if (ratio >= 0.5) return 'eighth';
	if (ratio >= 0.25) return '16th';
	if (ratio >= 0.125) return '32nd';
	return 'quarter';
}

/**
 * Convert note name to fifths for key signature
 */
function noteToFifths(note: Note): number {
	const fifthsMap: Record<string, number> = {
		Cb: -7,
		Gb: -6,
		Db: -5,
		Ab: -4,
		Eb: -3,
		Bb: -2,
		F: -1,
		C: 0,
		G: 1,
		D: 2,
		A: 3,
		E: 4,
		B: 5,
		'F#': 6,
		'C#': 7
	};
	return fifthsMap[note] ?? 0;
}

/**
 * Convert velocity to notehead shape for articulation
 */
function velocityToNotehead(velocity: number): string {
	if (velocity < 30) return 'x'; // Ghost note
	if (velocity < 50) return 'circle-x'; // Soft ghost
	if (velocity > 100) return 'diamond'; // Accent
	if (velocity > 110) return 'inverted triangle'; // Strong accent
	return '';
}

/**
 * Escape special XML characters
 */
function escapeXml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

/**
 * Helper to convert scale notes to MusicXML notes
 */
export function scaleToNotes(
	rootNote: Note,
	octave: number = 4,
	scaleType: 'major' | 'minor' | 'dorian' | 'mixolydian' = 'major'
): MusicXMLNote[] {
	const baseMidi = NoteToMidi[`${rootNote}${octave}` as keyof typeof NoteToMidi];
	if (baseMidi === undefined) return [];

	const intervals: Record<string, number[]> = {
		major: [0, 2, 4, 5, 7, 9, 11, 12],
		minor: [0, 2, 3, 5, 7, 8, 10, 12],
		dorian: [0, 2, 3, 5, 7, 9, 10, 12],
		mixolydian: [0, 2, 4, 5, 7, 9, 10, 12]
	};

	return intervals[scaleType].map((interval, index) => ({
		pitch: (baseMidi + interval) as MidiNote,
		duration: 4,
		measure: 1,
		beat: index,
		voice: 1,
		staff: 1
	}));
}

/**
 * Helper to convert chord to MusicXML notes
 */
export function chordToNotes(
	root: Note,
	quality: 'maj7' | 'min7' | '7' | 'min7b5' = 'maj7',
	octave: number = 4
): MusicXMLNote[] {
	const baseMidi = NoteToMidi[`${root}${octave}` as keyof typeof NoteToMidi];
	if (baseMidi === undefined) return [];

	const intervals: Record<string, number[]> = {
		maj7: [0, 4, 7, 11],
		min7: [0, 3, 7, 10],
		7: [0, 4, 7, 10],
		min7b5: [0, 3, 6, 10]
	};

	return intervals[quality].map((interval, index) => ({
		pitch: (baseMidi + interval) as MidiNote,
		duration: 4,
		measure: 1,
		beat: 0,
		voice: 1,
		staff: index < 2 ? 2 : 1 // Lower staff for bass notes
	}));
}

export const MusicXMLGenerator = {
	generateMusicXML,
	scaleToNotes,
	chordToNotes
};
