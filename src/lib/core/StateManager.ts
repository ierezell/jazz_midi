/**
 * Exercise State Manager
 * Centralized state management for all exercise types
 */

import type { ChordType, MidiNote, Note, NoteEvent } from '../../midi/midi';

// ===== EXERCISE STATE INTERFACES =====

export interface ExerciseSettings {
	key: Note;
	tempo: number;
	allowedMistakes: number;
	timeLimit?: number;
	showHints: boolean;
	enableMetronome: boolean;
}

export interface ExerciseState {
	id: string;
	type: 'chord' | 'scale' | 'progression';
	status: 'idle' | 'active' | 'paused' | 'completed' | 'failed';

	// Note tracking
	currentNotes: MidiNote[];
	expectedNotes: MidiNote[];
	completedNotes: MidiNote[];
	noteEvents: NoteEvent[];

	// Progress tracking
	mistakes: number;
	startTime?: number;
	endTime?: number;

	// Settings
	settings: ExerciseSettings;

	// UI state
	ui: {
		showKeyboard: boolean;
		showNoteNames: boolean;
		showScore: boolean;
		debugMode: boolean;
	};

	// Feedback
	feedback: {
		message: string;
		type: 'info' | 'success' | 'warning' | 'error';
		visible: boolean;
	};
}

export interface ChordExerciseState extends ExerciseState {
	type: 'chord';
	chord: {
		type: ChordType;
		inversion: 0 | 1 | 2 | 3;
		voicing: 'close' | 'open' | 'drop2' | 'drop3' | 'shell';
	};
}

export interface ScaleExerciseState extends ExerciseState {
	type: 'scale';
	scale: {
		type: 'major' | 'minor';
		pattern: 'ascending' | 'descending' | 'both';
		sequential: boolean;
		octaves: number;
	};
}

export interface ProgressionExerciseState extends ExerciseState {
	type: 'progression';
	progression: {
		pattern: string[];
		currentChord: number;
		style: 'jazz' | 'classical' | 'pop';
	};
}

export type AnyExerciseState = ChordExerciseState | ScaleExerciseState | ProgressionExerciseState;

// ===== RESULT INTERFACE =====

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

// ===== STATE MANAGER CLASS =====

export class ExerciseStateManager {
	private state: AnyExerciseState;
	private listeners: ((state: AnyExerciseState) => void)[] = [];

	constructor(initialState: AnyExerciseState) {
		this.state = { ...initialState };
	}

	// ===== STATE ACCESS =====

	getState(): AnyExerciseState {
		return { ...this.state };
	}

	getStatus() {
		return this.state.status;
	}

	isActive(): boolean {
		return this.state.status === 'active';
	}

	isCompleted(): boolean {
		return this.state.status === 'completed' || this.state.status === 'failed';
	}

	// ===== STATE UPDATES =====

	updateState(updates: Partial<ExerciseState>): void {
		this.state = { ...this.state, ...updates } as AnyExerciseState;
		this.notifyListeners();
	}

	updateSettings(settings: Partial<ExerciseSettings>): void {
		this.state.settings = { ...this.state.settings, ...settings };
		this.notifyListeners();
	}

	updateUI(ui: Partial<ExerciseState['ui']>): void {
		this.state.ui = { ...this.state.ui, ...ui };
		this.notifyListeners();
	}

	setFeedback(message: string, type: ExerciseState['feedback']['type']): void {
		this.state.feedback = {
			message,
			type,
			visible: true
		};
		this.notifyListeners();
	}

	clearFeedback(): void {
		this.state.feedback.visible = false;
		this.notifyListeners();
	}

	// ===== NOTE MANAGEMENT =====

	addNoteEvent(note: NoteEvent): void {
		this.state.noteEvents = [...this.state.noteEvents, note];

		if (note.type === 'on') {
			if (!this.state.currentNotes.includes(note.noteNumber)) {
				this.state.currentNotes = [...this.state.currentNotes, note.noteNumber];
			}
		} else {
			this.state.currentNotes = this.state.currentNotes.filter((n) => n !== note.noteNumber);
		}

		this.notifyListeners();
	}

	setExpectedNotes(notes: MidiNote[]): void {
		this.state.expectedNotes = [...notes];
		this.notifyListeners();
	}

	addCompletedNote(note: MidiNote): void {
		if (!this.state.completedNotes.includes(note)) {
			this.state.completedNotes = [...this.state.completedNotes, note];
			this.notifyListeners();
		}
	}

	// ===== EXERCISE LIFECYCLE =====

	start(): void {
		this.state.status = 'active';
		this.state.startTime = Date.now();
		this.state.mistakes = 0;
		this.state.currentNotes = [];
		this.state.completedNotes = [];
		this.state.noteEvents = [];
		this.clearFeedback();
		this.notifyListeners();
	}

	pause(): void {
		if (this.state.status === 'active') {
			this.state.status = 'paused';
			this.notifyListeners();
		}
	}

	resume(): void {
		if (this.state.status === 'paused') {
			this.state.status = 'active';
			this.notifyListeners();
		}
	}

	complete(success: boolean): ExerciseResult {
		this.state.status = success ? 'completed' : 'failed';
		this.state.endTime = Date.now();

		const result = this.createResult(success);
		this.notifyListeners();

		return result;
	}

	reset(): void {
		const settings = this.state.settings;
		const ui = this.state.ui;

		this.state = {
			...this.state,
			status: 'idle',
			currentNotes: [],
			expectedNotes: [],
			completedNotes: [],
			noteEvents: [],
			mistakes: 0,
			startTime: undefined,
			endTime: undefined,
			settings,
			ui,
			feedback: {
				message: '',
				type: 'info',
				visible: false
			}
		};

		this.notifyListeners();
	}

	// ===== MISTAKE HANDLING =====

	recordMistake(note?: MidiNote): void {
		this.state.mistakes++;

		// Auto-enable helpers based on mistake threshold
		if (this.state.mistakes >= 3) {
			this.state.ui.showNoteNames = true;
		}
		if (this.state.mistakes >= 6) {
			this.state.ui.showKeyboard = true;
		}

		this.notifyListeners();
	}

	// ===== CALCULATION METHODS =====

	calculateProgress(): number {
		if (this.state.expectedNotes.length === 0) return 0;

		const correctNotes = this.state.currentNotes.filter((note) =>
			this.state.expectedNotes.includes(note)
		);

		return Math.round((correctNotes.length / this.state.expectedNotes.length) * 100);
	}

	calculateAccuracy(): number {
		if (this.state.expectedNotes.length === 0) return 100;

		const totalNotesPlayed = this.state.noteEvents.filter((e) => e.type === 'on').length;
		if (totalNotesPlayed === 0) return 0;

		const correctNotes = this.state.completedNotes.length;
		return Math.round((correctNotes / totalNotesPlayed) * 100);
	}

	getTimeElapsed(): number {
		if (!this.state.startTime) return 0;
		const endTime = this.state.endTime || Date.now();
		return endTime - this.state.startTime;
	}

	// ===== VALIDATION =====

	validateChord(): boolean {
		const current = [...this.state.currentNotes].sort();
		const expected = [...this.state.expectedNotes].sort();

		return (
			current.length === expected.length && current.every((note, index) => note === expected[index])
		);
	}

	validateScaleProgress(sequential: boolean = false): boolean {
		if (!sequential) {
			return this.validateChord(); // Same as chord validation
		}

		// For sequential validation, check if notes were played in order
		const noteOnEvents = this.state.noteEvents
			.filter((e) => e.type === 'on')
			.map((e) => e.noteNumber);

		for (let i = 0; i < noteOnEvents.length; i++) {
			if (noteOnEvents[i] !== this.state.expectedNotes[i]) {
				return false;
			}
		}

		return noteOnEvents.length === this.state.expectedNotes.length;
	}

	// ===== LISTENERS =====

	subscribe(listener: (state: AnyExerciseState) => void): () => void {
		this.listeners.push(listener);

		return () => {
			const index = this.listeners.indexOf(listener);
			if (index > -1) {
				this.listeners.splice(index, 1);
			}
		};
	}

	private notifyListeners(): void {
		this.listeners.forEach((listener) => {
			try {
				listener(this.state);
			} catch (error) {
				console.error('Error in state listener:', error);
			}
		});
	}

	// ===== RESULT CREATION =====

	private createResult(success: boolean): ExerciseResult {
		const timeElapsed = this.getTimeElapsed();
		const accuracy = this.calculateAccuracy();
		const score = this.calculateScore(accuracy, timeElapsed, this.state.mistakes);

		return {
			exerciseId: this.state.id,
			exerciseType: this.state.type,
			success,
			accuracy,
			timeElapsed,
			mistakes: this.state.mistakes,
			score,
			timestamp: new Date()
		};
	}

	private calculateScore(accuracy: number, timeElapsed: number, mistakes: number): number {
		// Base score from accuracy
		let score = accuracy;

		// Time bonus (faster = better, but cap the bonus)
		const timeBonus = Math.max(0, Math.min(20, (60000 - timeElapsed) / 3000));
		score += timeBonus;

		// Mistake penalty
		const mistakePenalty = mistakes * 5;
		score -= mistakePenalty;

		return Math.max(0, Math.min(100, Math.round(score)));
	}
}

// ===== FACTORY FUNCTIONS =====

export function createChordExerciseState(
	id: string,
	settings: ExerciseSettings
): ChordExerciseState {
	return {
		id,
		type: 'chord',
		status: 'idle',
		currentNotes: [],
		expectedNotes: [],
		completedNotes: [],
		noteEvents: [],
		mistakes: 0,
		settings,
		ui: {
			showKeyboard: false,
			showNoteNames: false,
			showScore: true,
			debugMode: false
		},
		feedback: {
			message: '',
			type: 'info',
			visible: false
		},
		chord: {
			type: 'maj7',
			inversion: 0,
			voicing: 'close'
		}
	};
}

export function createScaleExerciseState(
	id: string,
	settings: ExerciseSettings
): ScaleExerciseState {
	return {
		id,
		type: 'scale',
		status: 'idle',
		currentNotes: [],
		expectedNotes: [],
		completedNotes: [],
		noteEvents: [],
		mistakes: 0,
		settings,
		ui: {
			showKeyboard: false,
			showNoteNames: false,
			showScore: true,
			debugMode: false
		},
		feedback: {
			message: '',
			type: 'info',
			visible: false
		},
		scale: {
			type: 'major',
			pattern: 'ascending',
			sequential: true,
			octaves: 1
		}
	};
}
