/**
 * Types for MusicXML processing and annotations
 */

export type AnnotationType =
	| { type: 'ii-v-i'; measures: number[] }
	| { type: 'chord-inversion'; measure: number; voice: number; inversion: string }
	| { type: 'root-third'; measure: number; voice: number; showFifth?: boolean };

export interface MusicXMLSong {
	id: string;
	filename: string;
	title: string;
	composer?: string;
	year?: string;
	key?: string;
	tempo?: number;
	style?: string;
	url?: string; // URL for OSMD to load
	content: string; // The MusicXML content as string
	chords?: SongChord[];
	melody?: SongNote[];
}

export interface SongChord {
	measure: number;
	beat: number;
	root: string;
	quality: string;
	bass?: string; // For slash chords
	duration: number;
}

export interface SongNote {
	measure: number;
	beat: number;
	pitch: number; // MIDI note number
	duration: number;
	isChordTone?: boolean;
	// Velocity expectations for dynamic training
	expectedVelocity?: number; // 0-127, expected MIDI velocity
	velocityMin?: number; // Minimum acceptable velocity
	velocityMax?: number; // Maximum acceptable velocity
	velocityHint?: 'ghost' | 'soft' | 'medium' | 'loud' | 'accent';
	staff?: number; // 1=upper, 2=lower (for hand-specific velocity)
}

export interface ParsedMusicXML {
	title: string;
	composer?: string;
	key: string;
	timeSignature: { numerator: number; denominator: number };
	tempo: number;
	measures: Measure[];
	chordSymbols: ChordSymbol[];
}

export interface Measure {
	index: number;
	notes: NoteData[];
	chords: ChordSymbol[];
}

export interface NoteData {
	pitch: number;
	step: string;
	octave: number;
	alter?: number; // -1 for flat, 1 for sharp
	duration: number;
	isRest: boolean;
	voice: number;
	staff: number;
}

export interface ChordSymbol {
	measure: number;
	beat: number;
	root: string;
	kind: string;
	bass?: string;
	text?: string;
}

export type SongExerciseType = 'chords' | 'melody' | 'full';

export interface SongExercise {
	songId: string;
	exerciseType: SongExerciseType;
	settings: {
		voicing?: 'full' | 'shell' | 'rootless';
		inversion?: number;
		arpeggio?: boolean;
		rhythmMode?: boolean;
		mistakeMode?: 'auto-restart' | 'wait-for-key';
		// Velocity/loudness validation settings
		enableVelocityCheck?: boolean; // Opt-in to velocity validation
		velocityMode?: 'per-note' | 'hand-based' | 'ghost-accent' | 'off';
		globalVelocityMin?: number; // Default minimum for all notes
		globalVelocityMax?: number; // Default maximum for all notes
		lhVelocityMax?: number; // Max for left hand (default: 50)
		rhVelocityMin?: number; // Min for right hand (default: 80)
	};
}

// Analysis results for II-V-I detection
export interface TwoFiveOneProgression {
	startMeasure: number;
	endMeasure: number;
	iiChord: ChordSymbol;
	vChord: ChordSymbol;
	iChord: ChordSymbol;
	key: string;
}

// Velocity validation result for a single note
export interface VelocityValidationResult {
	pitch: number;
	playedVelocity: number;
	expectedVelocity?: number;
	minVelocity?: number;
	maxVelocity?: number;
	isValid: boolean;
	deviation: number; // How far from expected (0 = perfect)
	feedback: string; // Human-readable feedback
}

// Velocity map for an entire song/exercise
export interface VelocityMap {
	notes: Map<number, { min?: number; max?: number; hint?: string }>; // pitch -> velocity constraints
	globalSettings?: {
		lhMax?: number;
		rhMin?: number;
		mode?: 'ghost-accent' | 'hand-based' | 'per-note';
	};
}
