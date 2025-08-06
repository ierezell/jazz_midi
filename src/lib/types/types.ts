import type { ChordType, MidiNote, Note, NoteFullName } from './notes';

// Re-export types from notes module
export type { ChordType, MidiNote, Note, NoteFullName } from './notes';

export type NoteEvent = {
	noteNumber: MidiNote;
	type: 'on' | 'off';
	noteFullName: NoteFullName;
	noteName: Note;
	velocity: number;
	timestamp: number;
	channel: number;
};
export type Chord = {
	root: MidiNote;
	third: MidiNote;
	fifth: MidiNote;
	seventh?: MidiNote;
	inversion: 0 | 1 | 2 | 3;
	chordType: ChordType;
};
export type ChordToneColors = {
	root: string;
	third: string;
	fifth: string;
	seventh: string;
	extension: string;
	tension: string;
	none: string;
};
export const DEFAULT_CHORD_TONE_COLORS: ChordToneColors = {
	root: '#e74c3c',
	third: '#f39c12',
	fifth: '#3498db',
	seventh: '#9b59b6',
	extension: '#2ecc71',
	tension: '#DDA0DD',
	none: 'transparent'
};
export type ChordToneRole =
	| 'root'
	| 'third'
	| 'fifth'
	| 'seventh'
	| 'extension'
	| 'tension'
	| 'none';

export type ChordToneInfo = {
	midiNote: MidiNote;
	noteNumber: MidiNote;
	role: ChordToneRole;
	color: string;
};
export interface BaseKeyboardProps {
	midiNotes: MidiNote[];
	middleC: number;
	octaves: number;
	interactive?: boolean;
	showLabels?: boolean;
	chordToneInfo?: ChordToneInfo[];
	showChordTones?: boolean;
}
export interface BaseScoreProps {
	leftHandNotes?: NoteFullName[][];
	rightHandNotes?: NoteFullName[][];
	title?: string;
	showClefs?: boolean;
}
export interface MIDIConfig {
	deviceId?: string;
	channel: number;
	velocity: {
		min: number;
		max: number;
	};
	sustainPedal: boolean;
	sysex: boolean;
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
	showKeyboard: boolean;
	showNoteNames: boolean;
	keyboardLayout: 'piano' | 'chromatic';
	animations: boolean;
}
export interface KeyboardConfiguration {
	middleC: MidiNote;
	octaves: number;
	startNote?: MidiNote;
	endNote?: MidiNote;
	showLabels: boolean;
	interactive: boolean;
	chordTones: boolean;
}
export type MIDIConfiguration = MIDIConfig;
export type ExerciseConfiguration = ExerciseConfig;
export interface AudioFeedback {
	success: HTMLAudioElement | null;
	error: HTMLAudioElement | null;
	enabled: boolean;
}
export interface AppState {
	midiAccess: MIDIAccess | null;
	configuration: MIDIConfig;
	currentExercise: string | null;
	audioFeedback: AudioFeedback;
}
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
	exerciseType: 'chord' | 'scale' | 'progression';
	success: boolean;
	accuracy: number;
	timeElapsed: number;
	mistakes: number;
	score: number;
	timestamp: Date;
}
export interface BaseExerciseState {
	id: string;
	type: 'chord' | 'scale' | 'progression';
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
	midiNotes: MidiNote[];
	selectedNote: Note;
	debugMode: boolean;
	errorCount: number;
	showNoteNames: boolean;
	showKeyboard: boolean;
	feedbackMessage: string;
	noteEvents: NoteEvent[];
	completed: boolean;
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
		pattern: string[];
		currentChord: number;
		style: 'classical' | 'jazz' | 'pop' | 'gospel';
		voicing: 'triads' | 'sevenths' | 'extensions';
	};
}

export type AnyExerciseState = ChordExerciseState | ScaleExerciseState | ProgressionExerciseState;
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
export interface PerformanceMetrics {
	midiLatency: number;
	audioLatency: number;
	frameRate: number;
	memoryUsage: number;
	eventProcessingTime: number;
}
export interface TimingAnalysis {
	accuracy: number;
	consistency: number;
	tempo: number;
}
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export interface ExerciseFactory {
	create(config: ExerciseConfig): any;
	getAvailableTypes(): string[];
	validateConfig(config: ExerciseConfig): ValidationResult;
}
export interface ComponentFactory {
	createKeyboard(props: KeyboardProps): any;
	createScore(props: ScoreProps): any;
	createControls(props: ExerciseControlsProps): any;
}
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
export interface ExerciseStatistics {
	totalExercises: number;
	completedExercises: number;
	averageAccuracy: number;
	averageScore: number;
	timeSpent: number;
	favoriteExercises: string[];
	improvementTrend: number;
}
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
