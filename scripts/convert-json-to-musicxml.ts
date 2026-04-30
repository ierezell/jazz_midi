/**
 * Convert JSON exercise files to MusicXML format
 * Usage: npx tsx scripts/convert-json-to-musicxml.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { NoteToMidi } from '../src/lib/types/notes.constants.js';
import type { MidiNote, Note, NoteFullName } from '../src/lib/types/types.js';

interface LickData {
	id: string;
	name: string;
	description?: string;
	category?: string;
	hand?: string;
	difficulty?: string;
	suggestedBpm?: number;
	notes: string[];
	tags?: string[];
}

interface RhythmHit {
	beat: number;
	hand: 'LH' | 'RH';
}

interface RhythmData {
	id: string;
	name: string;
	description?: string;
	suggestedBpm?: number;
	timeSignature?: string;
	defaultChords?: string[];
	isProgression?: boolean;
	measures?: number;
	hits: RhythmHit[];
}

interface HandIndependenceData {
	id: string;
	title: string;
	level: number;
	description?: string;
	lhPattern?: Array<{ beat: number; semitones: number[] }>;
	rhPattern?: number[];
	rootMidi?: number;
	rhStartMidi?: number;
	suggestedBpm?: number;
	measures?: number;
	instructions?: string;
}

interface SongData {
	name: string;
	composer?: string;
	year?: number;
	key?: string;
	description?: string;
	chords?: Array<{ note: string; type: string }>;
}

function noteNameToMidi(noteName: string): MidiNote {
	const midi = NoteToMidi[noteName as NoteFullName];
	if (midi === undefined) {
		console.warn(`Unknown note: ${noteName}, defaulting to C4`);
		return 60;
	}
	return midi as MidiNote;
}

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

function escapeXml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function durationToType(duration: number, divisions: number): string {
	const ratio = duration / divisions;
	if (ratio >= 4) return 'whole';
	if (ratio >= 2) return 'half';
	if (ratio >= 1) return 'quarter';
	if (ratio >= 0.5) return 'eighth';
	if (ratio >= 0.25) return '16th';
	return 'quarter';
}

interface MusicXMLNote {
	pitch: MidiNote;
	duration: number;
	measure: number;
	beat: number;
	voice?: number;
	staff?: number;
	type?: 'note' | 'chord' | 'rest';
}

function generateNoteElement(note: MusicXMLNote, divisions: number, voice: number, isChord: boolean): string {
	const pitch = midiToPitch(note.pitch);
	return `      <note${isChord ? '><chord/>' : '>'}
        <pitch>
          <step>${pitch.step}</step>
          <alter>${pitch.alter}</alter>
          <octave>${pitch.octave}</octave>
        </pitch>
        <duration>${note.duration}</duration>
        <voice>${voice}</voice>
        <type>${durationToType(note.duration, divisions)}</type>
        <staff>${note.staff || 1}</staff>
      </note>`;
}

function generateMusicXML(notes: MusicXMLNote[], options: {
	title?: string;
	composer?: string;
	tempo?: number;
	key?: string;
	timeSignature?: { numerator: number; denominator: number };
} = {}): string {
	const opts = {
		title: 'Exercise',
		composer: 'Jazz Piano Platform',
		tempo: 120,
		key: 'C',
		timeSignature: { numerator: 4, denominator: 4 },
		...options
	};

	const divisions = 4;

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

	for (const [measureNum, measureNotes] of sortedMeasures) {
		const isFirst = measureNum === 1;
		
		// Generate attributes for first measure
		const keyFifths: Record<string, number> = {
			Cb: -7, Gb: -6, Db: -5, Ab: -4, Eb: -3, Bb: -2, F: -1,
			C: 0, G: 1, D: 2, A: 3, E: 4, B: 5, 'F#': 6, 'C#': 7
		};
		const fifths = keyFifths[opts.key] ?? 0;

		const attributes = isFirst ? `    <attributes>
      <divisions>${divisions}</divisions>
      <key>
        <fifths>${fifths}</fifths>
      </key>
      <time>
        <beats>${opts.timeSignature.numerator}</beats>
        <beat-type>${opts.timeSignature.denominator}</beat-type>
      </time>
      <clef number="1">
        <sign>G</sign>
        <line>2</line>
      </clef>
      <clef number="2">
        <sign>F</sign>
        <line>4</line>
      </clef>
    </attributes>
` : '';

		// Add tempo to first measure
		const direction = isFirst && opts.tempo ? `    <direction placement="above">
      <direction-type>
        <metronome parentheses="no">
          <beat-unit>quarter</beat-unit>
          <per-minute>${opts.tempo}</per-minute>
        </metronome>
      </direction-type>
      <sound tempo="${opts.tempo}" />
    </direction>
` : '';

		// Sort notes and generate elements
		const sortedNotes = measureNotes.sort((a, b) => (a.beat || 0) - (b.beat || 0));
		const noteElements: string[] = [];
		
		for (let i = 0; i < sortedNotes.length; i++) {
			const note = sortedNotes[i];
			const isChord = i > 0 && sortedNotes[i].beat === sortedNotes[i - 1].beat;
			noteElements.push(generateNoteElement(note, divisions, note.voice || 1, isChord));
		}

		measureXML.push(`    <measure number="${measureNum}">
${attributes}${direction}${noteElements.join('\n')}
    </measure>`);
	}

	return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <work>
    <work-title>${escapeXml(opts.title)}</work-title>
  </work>
  <identification>
    <creator type="composer">${escapeXml(opts.composer)}</creator>
  </identification>
  <part-list>
    <score-part id="P1">
      <part-name>Piano</part-name>
      <part-abbreviation>Pno.</part-abbreviation>
    </score-part>
  </part-list>
  <part id="P1">
${measureXML.join('\n')}
  </part>
</score-partwise>`;
}

// Convert lick JSON to MusicXML
function convertLick(data: LickData): string {
	const notes: MusicXMLNote[] = data.notes.map((noteName, index) => {
		const midi = noteNameToMidi(noteName);
		// Distribute notes across measures (4 beats per measure)
		const measure = Math.floor(index / 4) + 1;
		const beat = (index % 4) + 1;
		return {
			pitch: midi,
			duration: 4, // quarter note
			measure,
			beat,
			voice: 1,
			staff: data.hand === 'left' ? 2 : 1
		};
	});

	return generateMusicXML(notes, {
		title: data.name,
		composer: 'Jazz Piano Platform',
		tempo: data.suggestedBpm || 120,
		key: 'C'
	});
}

// Convert rhythm JSON to MusicXML
function convertRhythm(data: RhythmData): string {
	const divisions = 4;
	const [numBeats] = (data.timeSignature || '4/4').split('/').map(Number);
	
	// Group hits by beat to create chords
	const beatGroups = new Map<number, { beat: number; hand: 'LH' | 'RH' }[]>();
	for (const hit of data.hits) {
		const roundedBeat = Math.floor(hit.beat);
		if (!beatGroups.has(roundedBeat)) {
			beatGroups.set(roundedBeat, []);
		}
		beatGroups.get(roundedBeat)!.push(hit);
	}

	const notes: MusicXMLNote[] = [];
	
	// Create notes from beat groups
	for (let measure = 1; measure <= (data.measures || 1); measure++) {
		for (let beat = 1; beat <= numBeats; beat++) {
			const globalBeat = (measure - 1) * numBeats + beat;
			const hits = beatGroups.get(globalBeat) || [];
			
			for (const hit of hits) {
				// For rhythm, use C3 for LH hits and C4 for RH hits as placeholders
				const midi = hit.hand === 'LH' ? 48 : 60;
				const duration = hit.hand === 'LH' ? divisions : Math.floor(divisions / 2);
				
				notes.push({
					pitch: midi as MidiNote,
					duration,
					measure,
					beat,
					voice: hit.hand === 'LH' ? 2 : 1,
					staff: hit.hand === 'LH' ? 2 : 1
				});
			}
		}
	}

	return generateMusicXML(notes, {
		title: data.name,
		composer: 'Jazz Piano Platform',
		tempo: data.suggestedBpm || 120,
		key: 'C',
		timeSignature: { numerator: numBeats, denominator: 4 }
	});
}

// Convert hand independence JSON to MusicXML
function convertHandIndependence(data: HandIndependenceData): string {
	const notes: MusicXMLNote[] = [];
	const measures = data.measures || 2;
	const rootMidi = data.rootMidi || 48;
	const rhStartMidi = data.rhStartMidi || 60;

	// LH pattern notes (can be array of objects with beat/semitones, or array of semitones)
	if (data.lhPattern) {
		for (let measure = 1; measure <= measures; measure++) {
			// Check if first element is an object with beat/semitones
			const firstHit = data.lhPattern[0];
			if (firstHit && typeof firstHit === 'object' && 'beat' in firstHit) {
				// Format: [{ beat: number, semitones: number[] }, ...]
				for (const hit of data.lhPattern as Array<{ beat: number; semitones: number[] }>) {
					const beat = hit.beat;
					// Create chord for each semitone interval
					for (const interval of hit.semitones) {
						notes.push({
							pitch: (rootMidi + interval) as MidiNote,
							duration: 4,
							measure,
							beat,
							voice: 2,
							staff: 2
						});
					}
				}
			} else {
				// Format: number[] - array of semitones distributed across beats
				const semitones = (data.lhPattern as unknown) as number[];
				for (let i = 0; i < semitones.length; i++) {
					const beat = i + 1;
					notes.push({
						pitch: (rootMidi + semitones[i]) as MidiNote,
						duration: 4,
						measure,
						beat,
						voice: 2,
						staff: 2
					});
				}
			}
		}
	}

	// RH pattern notes (scale/melody)
	if (data.rhPattern) {
		let noteIndex = 0;
		for (let measure = 1; measure <= measures; measure++) {
			for (let beat = 1; beat <= 4 && noteIndex < data.rhPattern.length; beat++) {
				const interval = data.rhPattern[noteIndex];
				notes.push({
					pitch: (rhStartMidi + interval) as MidiNote,
					duration: 4,
					measure,
					beat,
					voice: 1,
					staff: 1
				});
				noteIndex++;
			}
		}
	}

	return generateMusicXML(notes, {
		title: data.title,
		composer: 'Jazz Piano Platform',
		tempo: data.suggestedBpm || 80,
		key: 'C'
	});
}

// Convert song JSON to MusicXML (lead sheet style)
function convertSong(data: SongData): string {
	// Convert chord symbols to notes
	const notes: MusicXMLNote[] = [];
	
	if (data.chords) {
		const chordIntervals: Record<string, number[]> = {
			'maj7': [0, 4, 7, 11],
			'min7': [0, 3, 7, 10],
			'7': [0, 4, 7, 10],
			'maj': [0, 4, 7],
			'min': [0, 3, 7],
			'dim': [0, 3, 6],
			'aug': [0, 4, 8],
			'half-dim7': [0, 3, 6, 10],
			'dim7': [0, 3, 6, 9]
		};

		data.chords.forEach((chord, index) => {
			const rootNote = chord.note as Note;
			const rootMidi = NoteToMidi[`${rootNote}3` as keyof typeof NoteToMidi] || 48;
			const intervals = chordIntervals[chord.type] || chordIntervals['maj7'];
			const measure = Math.floor(index / 2) + 1;
			const beat = (index % 2) * 2 + 1; // Beats 1 and 3

			for (const interval of intervals) {
				notes.push({
					pitch: (rootMidi + interval) as MidiNote,
					duration: 8, // half note
					measure,
					beat,
					voice: 1,
					staff: 1
				});
			}
		});
	}

	return generateMusicXML(notes, {
		title: data.name,
		composer: data.composer || 'Unknown',
		tempo: 120,
		key: (data.key || 'C').replace('m', '') as Note
	});
}

// Process all JSON files in a directory
function processDirectory(inputDir: string, outputDir: string) {
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	const files = fs.readdirSync(inputDir);
	
	for (const file of files) {
		if (!file.endsWith('.json')) continue;
		if (file === 'manifest.json') continue; // Skip manifest files
		
		const inputPath = path.join(inputDir, file);
		const outputPath = path.join(outputDir, file.replace('.json', '.musicxml'));
		
		try {
			const content = fs.readFileSync(inputPath, 'utf-8');
			const data = JSON.parse(content);
			
			let musicxml: string;
			
			// Determine type and convert
			if (inputDir.includes('licks')) {
				musicxml = convertLick(data as LickData);
			} else if (inputDir.includes('rhythm')) {
				musicxml = convertRhythm(data as RhythmData);
			} else if (inputDir.includes('hand_independence')) {
				musicxml = convertHandIndependence(data as HandIndependenceData);
			} else if (inputDir.includes('songs')) {
				musicxml = convertSong(data as SongData);
			} else {
				console.log(`  Skipping ${file} - unknown type`);
				continue;
			}
			
			fs.writeFileSync(outputPath, musicxml, 'utf-8');
			console.log(`  ✓ Converted ${file} → ${path.basename(outputPath)}`);
		} catch (err) {
			console.error(`  ✗ Failed to convert ${file}:`, err);
		}
	}
}

// Main
console.log('Converting JSON exercise files to MusicXML...\n');

const baseDir = path.resolve(process.cwd(), 'static');

// Process licks
console.log('Processing licks...');
processDirectory(path.join(baseDir, 'licks'), path.join(baseDir, 'licks'));

// Process rhythm patterns
console.log('\nProcessing rhythm patterns...');
processDirectory(path.join(baseDir, 'rhythm'), path.join(baseDir, 'rhythm'));

// Process hand independence
console.log('\nProcessing hand independence...');
processDirectory(path.join(baseDir, 'hand_independence'), path.join(baseDir, 'hand_independence'));

// Process songs (metadata-only JSON files)
console.log('\nProcessing songs...');
processDirectory(path.join(baseDir, 'songs'), path.join(baseDir, 'songs'));

console.log('\n✓ Conversion complete!');
