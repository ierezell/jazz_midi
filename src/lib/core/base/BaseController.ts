/**
 * Base Exercise Controller - Modern, extensible foundation
 * Replaces the old controller with improved architecture
 */

import type {
	BaseExerciseState,
	ExerciseConfig,
	ExerciseEventHandlers,
	ExerciseResult,
	ExerciseSettings,
	MIDIEventHandlers,
	MidiNote,
	NoteEvent
} from '../types';

export abstract class BaseExerciseController {
	protected state: BaseExerciseState;
	protected config: ExerciseConfig;
	protected eventHandlers: Partial<ExerciseEventHandlers> = {};
	protected midiHandlers: Partial<MIDIEventHandlers> = {};
	protected startTime: number = 0;
	protected isInitialized: boolean = false;

	constructor(config: ExerciseConfig) {
		this.config = config;
		this.state = this.createInitialState();
		this.setupEventHandlers();
	}

	// ===== ABSTRACT METHODS (Must be implemented by subclasses) =====

	/**
	 * Get the expected notes for the current exercise state
	 */
	abstract getExpectedNotes(): MidiNote[];

	/**
	 * Process incoming MIDI note input
	 */
	abstract processNoteInput(note: NoteEvent): void;

	/**
	 * Validate if the current state represents completion
	 */
	abstract isCompleted(): boolean;

	// ===== CORE LIFECYCLE METHODS =====

	/**
	 * Initialize the exercise
	 */
	async initialize(): Promise<boolean> {
		try {
			await this.onInitialize?.();
			this.isInitialized = true;
			this.notifyStateChange();
			return true;
		} catch (error) {
			console.error('Exercise initialization failed:', error);
			return false;
		}
	}

	/**
	 * Start the exercise
	 */
	start(): void {
		if (!this.isInitialized) {
			throw new Error('Exercise must be initialized before starting');
		}

		this.state.status = 'active';
		this.state.startTime = Date.now();
		this.startTime = this.state.startTime;

		this.eventHandlers.onStart?.();
		this.onStart?.();
		this.notifyStateChange();
	}

	/**
	 * Pause the exercise
	 */
	pause(): void {
		if (this.state.status === 'active') {
			this.state.status = 'paused';
			this.eventHandlers.onPause?.();
			this.onPause?.();
			this.notifyStateChange();
		}
	}

	/**
	 * Resume the exercise
	 */
	resume(): void {
		if (this.state.status === 'paused') {
			this.state.status = 'active';
			this.eventHandlers.onResume?.();
			this.onResume?.();
			this.notifyStateChange();
		}
	}

	/**
	 * Reset the exercise to initial state
	 */
	reset(): void {
		const oldSettings = this.state.settings;
		this.state = this.createInitialState();
		this.state.settings = oldSettings; // Preserve settings

		this.eventHandlers.onReset?.();
		this.onReset?.();
		this.notifyStateChange();
	}

	/**
	 * Complete the exercise
	 */
	protected complete(success: boolean): void {
		this.state.status = success ? 'completed' : 'failed';

		const result = this.createResult(success);
		this.eventHandlers.onComplete?.(result);
		this.onComplete?.(result);
		this.notifyStateChange();
	}

	/**
	 * Cleanup resources
	 */
	cleanup(): void {
		this.onCleanup?.();
		this.eventHandlers = {};
		this.midiHandlers = {};
	}

	// ===== STATE MANAGEMENT =====

	/**
	 * Get current state (immutable copy)
	 */
	getState(): BaseExerciseState {
		return { ...this.state };
	}

	/**
	 * Update exercise settings
	 */
	updateSettings(settings: Partial<ExerciseSettings>): void {
		this.state.settings = { ...this.state.settings, ...settings };
		this.onSettingsChange?.(this.state.settings);
		this.notifyStateChange();
	}

	/**
	 * Update UI state
	 */
	updateUI(uiState: Partial<BaseExerciseState['ui']>): void {
		this.state.ui = { ...this.state.ui, ...uiState };
		this.notifyStateChange();
	}

	/**
	 * Set feedback message
	 */
	setFeedback(message: string, type: BaseExerciseState['feedback']['type'] = 'info'): void {
		this.state.feedback = {
			message,
			type,
			visible: true
		};
		this.notifyStateChange();
	}

	/**
	 * Clear feedback message
	 */
	clearFeedback(): void {
		this.state.feedback.visible = false;
		this.notifyStateChange();
	}

	// ===== EVENT HANDLING =====

	/**
	 * Set exercise event handlers
	 */
	setEventHandlers(handlers: Partial<ExerciseEventHandlers>): void {
		this.eventHandlers = { ...this.eventHandlers, ...handlers };
	}

	/**
	 * Set MIDI event handlers
	 */
	setMIDIHandlers(handlers: Partial<MIDIEventHandlers>): void {
		this.midiHandlers = { ...this.midiHandlers, ...handlers };
	}

	// ===== MIDI NOTE PROCESSING =====

	/**
	 * Handle note on events
	 */
	protected handleNoteOn(note: NoteEvent): void {
		// Add to current notes if not already present
		if (!this.state.currentNotes.includes(note.noteNumber)) {
			this.state.currentNotes.push(note.noteNumber);
		}

		// Process the note input
		this.processNoteInput(note);

		// Check for completion
		if (this.isCompleted()) {
			this.complete(true);
		}

		this.notifyStateChange();
	}

	/**
	 * Handle note off events
	 */
	protected handleNoteOff(note: NoteEvent): void {
		// Remove from current notes
		const index = this.state.currentNotes.indexOf(note.noteNumber);
		if (index > -1) {
			this.state.currentNotes.splice(index, 1);
		}

		this.onNoteRelease?.(note);
		this.notifyStateChange();
	}

	/**
	 * Handle MIDI errors
	 */
	protected handleMIDIError(error: Error): void {
		console.error('MIDI Error in exercise:', error);
		this.setFeedback(`MIDI Error: ${error.message}`, 'error');
	}

	// ===== UTILITY METHODS =====

	/**
	 * Record a mistake
	 */
	protected recordMistake(note: MidiNote): void {
		this.state.mistakes++;
		this.eventHandlers.onMistake?.(note);
		this.onMistake?.(note);

		// Auto-enable hints based on mistake count
		if (this.state.mistakes >= this.state.settings.allowedMistakes) {
			this.state.ui.showNoteNames = true;
			this.state.ui.showKeyboard = true;
		}

		this.setFeedback(`Incorrect note. Try again!`, 'warning');
		this.notifyStateChange();
	}

	/**
	 * Check if arrays of MIDI notes are equal (order-independent)
	 */
	protected arraysEqual(a: MidiNote[], b: MidiNote[]): boolean {
		if (a.length !== b.length) return false;
		const sortedA = [...a].sort();
		const sortedB = [...b].sort();
		return sortedA.every((note, index) => note === sortedB[index]);
	}

	/**
	 * Calculate exercise progress (0-100)
	 */
	protected calculateProgress(): number {
		const expected = this.getExpectedNotes();
		const completed = this.state.completedNotes;

		if (expected.length === 0) return 0;
		return Math.round((completed.length / expected.length) * 100);
	}

	// ===== PRIVATE METHODS =====

	/**
	 * Create initial state
	 */
	private createInitialState(): BaseExerciseState {
		return {
			id: this.config.id,
			status: 'idle',
			currentNotes: [],
			expectedNotes: [],
			completedNotes: [],
			mistakes: 0,
			settings: { ...this.config.defaultSettings },
			feedback: {
				message: '',
				type: 'info',
				visible: false
			},
			ui: {
				showKeyboard: false,
				showNoteNames: false,
				showScore: true,
				debugMode: false
			}
		};
	}

	/**
	 * Create exercise result
	 */
	private createResult(success: boolean): ExerciseResult {
		const timeElapsed = Date.now() - this.startTime;
		const expectedNotes = this.getExpectedNotes();
		const accuracy = this.calculateAccuracy(expectedNotes, this.state.completedNotes);
		const score = this.calculateScore(accuracy, timeElapsed, this.state.mistakes);

		return {
			exerciseId: this.config.id,
			success,
			accuracy,
			timeElapsed,
			mistakes: this.state.mistakes,
			score,
			timestamp: new Date()
		};
	}

	/**
	 * Calculate accuracy percentage
	 */
	private calculateAccuracy(expected: MidiNote[], completed: MidiNote[]): number {
		if (expected.length === 0) return 100;
		const correct = completed.filter((note) => expected.includes(note)).length;
		return Math.round((correct / expected.length) * 100);
	}

	/**
	 * Calculate exercise score
	 */
	private calculateScore(accuracy: number, timeElapsed: number, mistakes: number): number {
		// Base score from accuracy
		let score = accuracy;

		// Time bonus (faster = better, but cap the bonus)
		const timeBonus = Math.max(0, Math.min(20, 60000 - timeElapsed) / 3000);
		score += timeBonus;

		// Mistake penalty
		const mistakePenalty = mistakes * 5;
		score -= mistakePenalty;

		return Math.max(0, Math.min(100, Math.round(score)));
	}

	/**
	 * Setup default event handlers
	 */
	private setupEventHandlers(): void {
		this.midiHandlers = {
			onNoteOn: this.handleNoteOn.bind(this),
			onNoteOff: this.handleNoteOff.bind(this),
			onError: this.handleMIDIError.bind(this)
		};
	}

	/**
	 * Notify external listeners of state changes
	 */
	private notifyStateChange(): void {
		const progress = this.calculateProgress();
		this.eventHandlers.onProgress?.(progress);
	}

	// ===== OPTIONAL HOOKS (Can be overridden by subclasses) =====

	protected onInitialize?(): Promise<void>;
	protected onStart?(): void;
	protected onPause?(): void;
	protected onResume?(): void;
	protected onReset?(): void;
	protected onComplete?(result: ExerciseResult): void;
	protected onCleanup?(): void;
	protected onMistake?(note: MidiNote): void;
	protected onNoteRelease?(note: NoteEvent): void;
	protected onSettingsChange?(settings: ExerciseSettings): void;
}
