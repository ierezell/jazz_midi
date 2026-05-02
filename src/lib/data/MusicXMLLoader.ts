/**
 * Utility to load MusicXML files using OpenSheetMusicDisplay
 * Songs are stored in the static/songs folder and fetched at runtime
 */

import type { MusicXMLSong, SongChord, SongNote, VelocityMap } from '../types/musicxml';

export type { MusicXMLSong };

/**
 * Minimal structural type for OSMD's untyped sheet object.
 * OSMD doesn't ship full TypeScript declarations for these internal types.
 */
type OsmdSheet = {
	Title?: { text?: string };
	Composer?: { text?: string };
	SourceMeasures: OsmdMeasure[];
	SheetPlaybackSetting?: { Tempo?: number };
	DefaultStartTempoInBpm?: number;
	keySignature?: number;
};
type OsmdMeasure = {
	VerticalSourceStaffEntryContainers?: OsmdEntry[];
	KeySignatureInstruction?: { Key?: number };
};
type OsmdEntry = {
	ChordSymbolContainer?: { ChordSymbol?: { RootPitch?: unknown; Kind?: unknown } };
	Notes?: OsmdNote[];
};
type OsmdNote = {
	Pitch?: { frequency?: number };
	Length?: { realValue?: number };
	Staff?: { StaffId?: number };
	Notehead?: { label?: string };
	Parent?: { Parent?: { Dynamics?: Array<{ text?: string }> } };
	MIDIVelocity?: number;
};

// Base URL for static songs
const SONGS_BASE_URL = '/songs';

// Known song files (we'd typically generate this from the filesystem)
// For now, we'll fetch the list dynamically or use a hardcoded list
const KNOWN_SONGS = [
	// Add your song filenames here or implement a manifest.json approach
];

/**
 * Get the public URL for a song file
 * Usage: const url = getSongUrl('song.mxl');
 *        var loadPromise = osmd.load(url);
 */
export function getSongUrl(filename: string): string {
	return `${SONGS_BASE_URL}/${filename}`;
}

/**
 * Load basic metadata for all available songs
 * Uses a manifest or directory listing approach
 */
export async function loadAllSongs(): Promise<MusicXMLSong[]> {
	// Try to fetch a manifest file, or return fallback songs
	try {
		const response = await fetch(`${SONGS_BASE_URL}/manifest.json`);
		if (response.ok) {
			const files: string[] = await response.json();
			// Filter to only .musicxml and .xml files (.mxl needs special handling)
			const validFiles = files.filter((f) => f.endsWith('.musicxml') || f.endsWith('.xml'));
			return validFiles.map((filename) => createSongMetadata(filename));
		}
	} catch {
		// Manifest doesn't exist, use fallback approach
	}

	// Return empty array or fallback songs
	// In production, you'd scan the directory server-side
	return [];
}

/**
 * Create song metadata from filename
 */
function createSongMetadata(filename: string): MusicXMLSong {
	const id = filename.replace(/\.(mxl|musicxml|xml)$/i, '').replace(/[^a-zA-Z0-9]/g, '_');
	const title = filename.replace(/\.(mxl|musicxml|xml)$/i, '').replace(/[_-]/g, ' ');

	return {
		id,
		filename,
		title,
		url: getSongUrl(filename),
		content: '', // Loaded by OSMD
		chords: [],
		melody: []
	};
}

/**
 * Get URL and metadata for a specific song
 * Usage: const { url } = loadSong('song.mxl');
 *        var loadPromise = osmd.load(url);
 */
export function loadSong(filename: string): { url: string; filename: string; id: string } {
	const id = filename.replace(/\.(mxl|musicxml|xml)$/i, '').replace(/[^a-zA-Z0-9]/g, '_');
	return {
		url: getSongUrl(filename),
		filename,
		id
	};
}

/**
 * Fetch and parse a MusicXML file
 * For use when you need the content before OSMD loads it
 */
export async function fetchSong(filename: string): Promise<string | null> {
	try {
		const response = await fetch(getSongUrl(filename));
		if (!response.ok) {
			return null;
		}
		return await response.text();
	} catch (error) {
		console.error(`Failed to fetch ${filename}:`, error);
		return null;
	}
}

/**
 * Parse song data from an OSMD instance after loading
 * Call this after osmd.load() completes and osmd.render() or similar has processed
 */
export function parseFromOSMD(osmd: { Sheet: OsmdSheet }, filename: string): MusicXMLSong | null {
	try {
		const sheet = osmd.Sheet;
		if (!sheet) return null;

		// Extract metadata from OSMD sheet
		const title = sheet.Title?.text?.toString() || filename.replace(/\.(mxl|musicxml|xml)$/i, '');
		const composer = sheet.Composer?.text?.toString();

		// Get key from first measure's key signature
		let key = 'C';
		if (sheet.SourceMeasures.length > 0) {
			const firstMeasure = sheet.SourceMeasures[0];
			// Key information is in the measure's key signature
			const keyInstruction = firstMeasure?.KeySignatureInstruction;
			if (keyInstruction?.Key !== undefined) {
				key = getKeyFromFifths(keyInstruction.Key);
			}
		}

		// Get tempo from sheet
		const tempo = sheet.DefaultStartTempoInBpm || 120;

		// Extract chords from OSMD's harmony elements
		const chords = extractChordsFromOSMD(sheet);

		// Extract melody notes
		const melody = extractMelodyFromOSMD(sheet);

		const id = filename.replace(/\.(mxl|musicxml|xml)$/i, '').replace(/[^a-zA-Z0-9]/g, '_');

		return {
			id,
			filename,
			title: title.trim(),
			composer: composer?.trim(),
			key,
			tempo,
			chords,
			melody,
			content: '', // Content is managed by OSMD
			style: detectStyle(filename, composer || '')
		};
	} catch (error) {
		console.error(`Error parsing from OSMD for ${filename}:`, error);
		return null;
	}
}

/**
 * Extract chords from OSMD sheet
 */
function extractChordsFromOSMD(sheet: OsmdSheet): SongChord[] {
	const chords: SongChord[] = [];

	// OSMD stores chord symbols in the measure's vertical containers
	sheet.SourceMeasures.forEach((measure: OsmdMeasure, measureIndex: number) => {
		// Access chord symbols through the measure's staff entries
		const staffEntries = measure?.VerticalSourceStaffEntryContainers || [];

		staffEntries.forEach((entry: any, entryIndex: number) => {
			// Look for chord symbols in the entry
			const chordSymbol = entry?.ChordSymbolContainer?.ChordSymbol;
			if (chordSymbol) {
				chords.push({
					measure: measureIndex,
					beat: entryIndex,
					root: chordSymbol.RootPitch?.toString() || 'C',
					quality: chordSymbol.Kind?.toString() || '',
					duration: 4
				});
			}
		});
	});

	return chords;
}

/**
 * Extract melody notes from OSMD sheet
 */
function extractMelodyFromOSMD(sheet: OsmdSheet): SongNote[] {
	const notes: SongNote[] = [];

	sheet.SourceMeasures.forEach((measure: OsmdMeasure, measureIndex: number) => {
		const staffEntries = measure?.VerticalSourceStaffEntryContainers || [];

		staffEntries.forEach((entry: any, entryIndex: number) => {
			// Access notes through the entry
			const notesList = entry?.Notes || [];

			notesList.forEach((note: any) => {
				if (note?.Pitch?.frequency !== undefined) {
					// Convert frequency to MIDI note number
					const midiNote = Math.round(69 + 12 * Math.log2(note.Pitch.frequency / 440));

					// Extract velocity/dynamics if available
					const velocity = extractNoteVelocity(note);

					notes.push({
						measure: measureIndex,
						beat: entryIndex,
						pitch: midiNote,
						duration: note.Length?.realValue ? Math.round(note.Length.realValue * 4) : 4,
						expectedVelocity: velocity?.expected,
						velocityMin: velocity?.min,
						velocityMax: velocity?.max,
						velocityHint: velocity?.hint,
						staff: note.Staff?.StaffId || 1
					});
				}
			});
		});
	});

	return notes;
}

/**
 * Convert key signature (fifths) to key name
 */
function getKeyFromFifths(fifths: number): string {
	const keys = ['Cb', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#'];
	const index = fifths + 7;
	return keys[Math.max(0, Math.min(keys.length - 1, index))] || 'C';
}

/**
 * Extract velocity/dynamics information from a note
 * MusicXML can contain dynamics markings that we convert to velocity ranges
 */
function extractNoteVelocity(note: OsmdNote):
	| {
			expected?: number;
			min?: number;
			max?: number;
			hint?: 'ghost' | 'soft' | 'medium' | 'loud' | 'accent';
	  }
	| undefined {
	// Check for dynamics in the note's notehead or parent measure
	const notehead = note?.Notehead?.label;
	const dynamics = note?.Parent?.Parent?.Dynamics?.[0]; // Measure-level dynamics

	// Parse notehead shapes for articulation hints
	if (notehead) {
		switch (notehead.toLowerCase()) {
			case 'x': // Cross notehead = ghost note
				return { expected: 30, min: 0, max: 40, hint: 'ghost' };
			case 'circle-x': // Circle-x = accented ghost
				return { expected: 35, min: 20, max: 45, hint: 'ghost' };
			case 'diamond': // Diamond = accent
				return { expected: 100, min: 80, max: 127, hint: 'accent' };
			case 'inverted triangle': // Marcato = strong accent
				return { expected: 110, min: 90, max: 127, hint: 'accent' };
		}
	}

	// Parse dynamics markings (p, mp, mf, f, ff, etc.)
	if (dynamics) {
		const dynamicText = dynamics?.text?.toLowerCase() || dynamics?.toString()?.toLowerCase() || '';

		// Standard dynamic markings with velocity ranges
		const dynamicMap: Record<
			string,
			{
				expected: number;
				min: number;
				max: number;
				hint: 'ghost' | 'soft' | 'medium' | 'loud' | 'accent';
			}
		> = {
			pppp: { expected: 10, min: 0, max: 15, hint: 'ghost' },
			ppp: { expected: 20, min: 10, max: 30, hint: 'ghost' },
			pp: { expected: 35, min: 25, max: 45, hint: 'ghost' },
			p: { expected: 50, min: 40, max: 60, hint: 'soft' },
			mp: { expected: 65, min: 55, max: 75, hint: 'soft' },
			mf: { expected: 80, min: 70, max: 90, hint: 'medium' },
			f: { expected: 100, min: 90, max: 110, hint: 'loud' },
			ff: { expected: 115, min: 105, max: 127, hint: 'accent' },
			fff: { expected: 120, min: 110, max: 127, hint: 'accent' },
			ffff: { expected: 127, min: 120, max: 127, hint: 'accent' }
		};

		for (const [mark, velocity] of Object.entries(dynamicMap)) {
			if (dynamicText.includes(mark)) {
				return velocity;
			}
		}
	}

	// Check note's own velocity (MIDI velocity from MusicXML)
	const midiVelocity = note?.MIDIVelocity;
	if (midiVelocity !== undefined && midiVelocity > 0) {
		// Convert MIDI velocity (0-1 or 0-127) to our scale
		const normalizedVel =
			midiVelocity <= 1 ? Math.round(midiVelocity * 127) : Math.round(midiVelocity);
		const hint =
			normalizedVel < 40
				? 'ghost'
				: normalizedVel < 70
					? 'soft'
					: normalizedVel < 90
						? 'medium'
						: normalizedVel < 110
							? 'loud'
							: 'accent';
		return {
			expected: normalizedVel,
			min: Math.max(0, normalizedVel - 15),
			max: Math.min(127, normalizedVel + 15),
			hint
		};
	}

	return undefined;
}

/**
 * Build a velocity map from a song's notes
 * This can be used by the VelocityValidator
 */
export function buildVelocityMap(song: MusicXMLSong): VelocityMap {
	const notes = new Map<number, { min?: number; max?: number; hint?: string }>();

	if (song.melody) {
		for (const note of song.melody) {
			if (note.velocityMin !== undefined || note.velocityMax !== undefined) {
				notes.set(note.pitch, {
					min: note.velocityMin,
					max: note.velocityMax,
					hint: note.velocityHint
				});
			}
		}
	}

	// Determine global settings based on note distribution
	const upperStaffNotes = song.melody?.filter((n) => n.staff === 1 || n.pitch >= 60) || [];
	const lowerStaffNotes = song.melody?.filter((n) => n.staff === 2 || n.pitch < 60) || [];

	const hasGhostNotes = Array.from(notes.values()).some((n) => n.hint === 'ghost');
	const hasAccents = Array.from(notes.values()).some((n) => n.hint === 'accent');

	return {
		notes,
		globalSettings: {
			lhMax: lowerStaffNotes.length > 0 ? 50 : undefined,
			rhMin: upperStaffNotes.length > 0 ? 80 : undefined,
			mode: hasGhostNotes || hasAccents ? 'ghost-accent' : 'per-note'
		}
	};
}

/**
 * Detect style from filename or composer
 */
function detectStyle(filename: string, composer: string): string | undefined {
	const text = (filename + ' ' + composer).toLowerCase();

	if (text.includes('blues') || text.includes('b.b. king') || text.includes('robert johnson')) {
		return 'blues';
	}
	if (
		text.includes('jazz') ||
		text.includes('swing') ||
		text.includes('ellington') ||
		text.includes('monk')
	) {
		return 'jazz';
	}
	if (text.includes('bossa') || text.includes('samba') || text.includes('jobim')) {
		return 'bossa-nova';
	}
	if (text.includes('latin') || text.includes('salsa') || text.includes('tango')) {
		return 'latin';
	}
	if (text.includes('funk') || text.includes('soul') || text.includes('r&b')) {
		return 'funk';
	}
	if (text.includes('rock') || text.includes('pop')) {
		return 'rock/pop';
	}
	if (text.includes('classical') || text.includes('mozart') || text.includes('beethoven')) {
		return 'classical';
	}

	return undefined;
}

/**
 * Get a random selection of songs
 */
export function getRandomSongs(songs: MusicXMLSong[], count: number): MusicXMLSong[] {
	const shuffled = [...songs].sort(() => Math.random() - 0.5);
	return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Filter songs by style
 */
export function filterSongsByStyle(songs: MusicXMLSong[], style: string): MusicXMLSong[] {
	return songs.filter((s) => s.style?.toLowerCase().includes(style.toLowerCase()));
}

/**
 * Filter songs by difficulty (based on complexity)
 */
export function filterSongsByDifficulty(
	songs: MusicXMLSong[],
	difficulty: 'easy' | 'medium' | 'hard'
): MusicXMLSong[] {
	return songs.filter((song) => {
		if (!song.chords) return false;

		const chordCount = song.chords.length;
		const uniqueChords = new Set(song.chords.map((c) => c.root + c.quality)).size;

		switch (difficulty) {
			case 'easy':
				return chordCount <= 8 && uniqueChords <= 4;
			case 'medium':
				return chordCount <= 16 && uniqueChords <= 8;
			case 'hard':
				return chordCount > 16 || uniqueChords > 8;
			default:
				return true;
		}
	});
}

