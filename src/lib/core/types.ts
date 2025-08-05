/**
 * Comprehensive type definitions for the jazz MIDI application
 * Centralized, well-organized type system
 */

// Re-export core MIDI types
export type { Chord, ChordType, MidiNote, Note, NoteEvent, NoteFullName } from '../../midi/midi';

// Import for internal use
import type { ChordType, MidiNote, Note, NoteEvent, NoteFullName } from '../../midi/midi';

// ===== CORE TYPES =====

export interface ExerciseConfig {
	id: string;
	name: string;
	description: string;
	category: 'chords' | 'scales' | 'progressions' | 'ear-training';
	difficulty: 'beginner' | 'intermediate' | 'advanced';
	defaultSettings: ExerciseSettings;
}

export interface ExerciseSettings {
	key: Note;
	tempo: number;
	allowedMistakes: number;
	timeLimit?: number;
	showHints: boolean;
	enableMetronome: boolean;
	completed?: boolean;
}

export interface ExerciseResult {
	exerciseId: string;
	success: boolean;
	accuracy: number;
	timeElapsed: number;
	mistakes: number;
	score: number;
	timestamp: Date;
}

// ===== STATE MANAGEMENT =====

export interface BaseExerciseState {
	id: string;
	status: 'idle' | 'active' | 'paused' | 'completed' | 'failed';
	currentNotes: MidiNote[];
	expectedNotes: MidiNote[];
	completedNotes: MidiNote[];
	mistakes: number;
	startTime?: number;
	settings: ExerciseSettings;
	feedback: {
		message: string;
		type: 'info' | 'success' | 'warning' | 'error';
		visible: boolean;
	};
	ui: {
		showKeyboard: boolean;
		showNoteNames: boolean;
		showScore: boolean;
		debugMode: boolean;
	};
}

export interface ChordExerciseState extends BaseExerciseState {
	chord: {
		type: ChordType;
		inversion: 0 | 1 | 2 | 3;
		voicing: 'close' | 'open' | 'drop2' | 'drop3' | 'shell';
		position: 'root' | '1st' | '2nd' | '3rd';
	};
}

export interface ScaleExerciseState extends BaseExerciseState {
	scale: {
		type: 'major' | 'minor' | 'dorian' | 'mixolydian' | 'pentatonic';
		pattern: 'ascending' | 'descending' | 'both' | 'random';
		sequential: boolean;
		octaves: number;
	};
}

export interface ProgressionExerciseState extends BaseExerciseState {
	progression: {
		pattern: string[]; // e.g., ['ii', 'V', 'I']
		currentChord: number;
		style: 'classical' | 'jazz' | 'pop' | 'gospel';
		voicing: 'triads' | 'sevenths' | 'extensions';
	};
}

// ===== CONFIGURATION TYPES =====

export interface MIDIConfig {
	autoConnect: boolean;
	virtualKeyboard: {
		enabled: boolean;
		layout: 'piano' | 'chromatic' | 'isomorphic';
		size: 'compact' | 'normal' | 'large';
	};
	latency: {
		compensation: number;
		monitoring: boolean;
	};
	devices: {
		preferredInput?: string;
		preferredOutput?: string;
	};
}

export interface AudioConfig {
	enabled: boolean;
	volume: {
		master: number;
		feedback: number;
		metronome: number;
	};
	sounds: {
		success: string;
		error: string;
		metronome: string;
	};
	effects: {
		reverb: number;
		delay: number;
	};
}

export interface UIConfig {
	theme: 'light' | 'dark' | 'auto';
	layout: 'compact' | 'comfortable' | 'spacious';
	animations: boolean;
	accessibility: {
		highContrast: boolean;
		reducedMotion: boolean;
		screenReader: boolean;
	};
	keyboard: {
		showLabels: boolean;
		highlightPressed: boolean;
		size: 'small' | 'medium' | 'large';
		octaves: number;
		startOctave: number;
	};
}

// ===== EVENT TYPES =====

export interface MIDIEventHandlers {
	onNoteOn: (note: NoteEvent) => void;
	onNoteOff: (note: NoteEvent) => void;
	onControlChange: (control: number, value: number) => void;
	onError: (error: Error) => void;
}

export interface ExerciseEventHandlers {
	onStart: () => void;
	onComplete: (result: ExerciseResult) => void;
	onMistake: (note: MidiNote) => void;
	onProgress: (progress: number) => void;
	onReset: () => void;
	onPause: () => void;
	onResume: () => void;
}

// ===== COMPONENT PROPS =====

export interface KeyboardProps {
	notes: MidiNote[];
	highlightedNotes?: MidiNote[];
	pressedNotes?: MidiNote[];
	interactive: boolean;
	showLabels: boolean;
	octaves: number;
	startOctave: number;
	onNotePress?: (note: MidiNote) => void;
	onNoteRelease?: (note: MidiNote) => void;
}

export interface ScoreProps {
	clef: 'treble' | 'bass' | 'both';
	notes: NoteFullName[][];
	measures: number;
	timeSignature: string;
	keySignature: string;
	title?: string;
	tempo?: number;
}

export interface ExerciseControlsProps {
	state: BaseExerciseState;
	config: ExerciseConfig;
	onStart: () => void;
	onStop: () => void;
	onReset: () => void;
	onSettingsChange: (settings: Partial<ExerciseSettings>) => void;
}

// ===== VALIDATION TYPES =====

export interface ValidationRule<T = any> {
	name: string;
	validate: (value: T) => boolean;
	message: string;
}

export interface ValidationResult {
	valid: boolean;
	errors: string[];
	warnings: string[];
}

// ===== PERFORMANCE MONITORING =====

export interface PerformanceMetrics {
	midiLatency: number;
	audioLatency: number;
	frameRate: number;
	memoryUsage: number;
	eventProcessingTime: number;
}

export interface TimingAnalysis {
	accuracy: number; // How close to expected timing
	consistency: number; // How consistent the timing is
	tempo: number; // Detected tempo
}

// ===== UTILITY TYPES =====

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ===== FACTORY TYPES =====

export interface ExerciseFactory {
	create(config: ExerciseConfig): any; // Will be properly typed when BaseExerciseController is created
	getAvailableTypes(): string[];
	validateConfig(config: ExerciseConfig): ValidationResult;
}

export interface ComponentFactory {
	createKeyboard(props: KeyboardProps): any;
	createScore(props: ScoreProps): any;
	createControls(props: ExerciseControlsProps): any;
}

// ===== SERVICE INTERFACES =====

export interface MIDIService {
	initialize(): Promise<boolean>;
	connect(): Promise<boolean>;
	disconnect(): void;
	sendNote(note: MidiNote, velocity: number): void;
	setEventHandlers(handlers: Partial<MIDIEventHandlers>): void;
	getDevices(): { inputs: MIDIInput[]; outputs: MIDIOutput[] };
	isConnected(): boolean;
}

export interface AudioService {
	initialize(): Promise<boolean>;
	playSound(type: 'success' | 'error' | 'metronome', volume?: number): void;
	setVolume(type: string, volume: number): void;
	startMetronome(bpm: number): void;
	stopMetronome(): void;
	isEnabled(): boolean;
}

export interface ExerciseService {
	getExercise(id: string): ExerciseConfig | null;
	getAllExercises(): ExerciseConfig[];
	getExercisesByCategory(category: string): ExerciseConfig[];
	saveResult(result: ExerciseResult): void;
	getResults(exerciseId?: string): ExerciseResult[];
	getStatistics(): ExerciseStatistics;
}

// ===== STATISTICS =====

export interface ExerciseStatistics {
	totalExercises: number;
	completedExercises: number;
	averageAccuracy: number;
	averageScore: number;
	timeSpent: number; // in minutes
	favoriteExercises: string[];
	improvementTrend: number; // positive = improving
}

// ===== IMPORT/EXPORT INTERFACES =====

export interface ExportableData {
	exercises: ExerciseConfig[];
	results: ExerciseResult[];
	settings: {
		midi: MIDIConfig;
		audio: AudioConfig;
		ui: UIConfig;
	};
	statistics: ExerciseStatistics;
	version: string;
	exportDate: Date;
}

// Re-export important types from MIDI module for convenience
