import type { ChordType, Inversion, MidiNote, Note, NoteFullName } from './notes';

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
	inversion: Inversion;
	chordType: ChordType;
};

export type NoteRole = 'root' | 'third' | 'fifth' | 'seventh' | 'ninth' | 'eleventh' | 'thirteenth';

export interface ScoreProps {
	leftHand: NoteFullName[][];
	rightHand: NoteFullName[][];
	selectedNote: Note;
}

// export interface MIDIConfig {
// 	deviceId?: string;
// 	channel: number;
// 	velocity: {
// 		min: number;
// 		max: number;
// 	};
// 	sustainPedal: boolean;
// 	sysex: boolean;
// 	autoConnect: boolean;
// 	virtualKeyboard: {
// 		enabled: boolean;
// 		layout: 'piano' | 'chromatic' | 'isomorphic';
// 		size: 'compact' | 'normal' | 'large';
// 	};
// 	latency: {
// 		compensation: number;
// 		monitoring: boolean;
// 	};
// 	devices: {
// 		preferredInput?: string;
// 		preferredOutput?: string;
// 	};
// }
// export interface AudioConfig {
// 	enabled: boolean;
// 	volume: {
// 		master: number;
// 		feedback: number;
// 		metronome: number;
// 	};
// 	sounds: {
// 		success: string;
// 		error: string;
// 		metronome: string;
// 	};
// 	effects: {
// 		reverb: number;
// 		delay: number;
// 	};
// }
// export interface UIConfig {
// 	theme: 'light' | 'dark' | 'auto';
// 	showKeyboard: boolean;
// 	showNoteNames: boolean;
// 	keyboardLayout: 'piano' | 'chromatic';
// 	animations: boolean;
// }
// export interface KeyboardConfiguration {
// 	middleC: MidiNote;
// 	octaves: number;
// 	startNote?: MidiNote;
// 	endNote?: MidiNote;
// 	showLabels: boolean;
// 	interactive: boolean;
// 	chordTones: boolean;
// }
// export type MIDIConfiguration = MIDIConfig;
// export type ExerciseConfiguration = ExerciseConfig;
// export interface AudioFeedback {
// 	success: HTMLAudioElement | null;
// 	error: HTMLAudioElement | null;
// 	enabled: boolean;
// }
// export interface AppState {
// 	midiAccess: MIDIAccess | null;
// 	configuration: MIDIConfig;
// 	currentExercise: string | null;
// 	audioFeedback: AudioFeedback;
// }
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
		inversion: Inversion;
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
	midiNotes: MidiNote[];
	middleC: number;
	octaves: number;
	debugMode: boolean;
	noteRoles: { [key: number]: NoteRole };
	expectedNotes: MidiNote[];
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
