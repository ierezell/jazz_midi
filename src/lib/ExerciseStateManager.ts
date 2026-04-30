/**
 * ExerciseStateManager - Centralized state management for exercises
 * Extracted from BaseExercise to follow Single Responsibility Principle
 */

import type { MidiNote, Note, NoteEvent } from './types/types';
import { userStatsService } from './UserStatsService';
import { logger } from './LoggingService';

export interface ExerciseState {
	noteEvents: NoteEvent[];
	mistakes: number;
	collectedNotes: Set<MidiNote>;
	completed: boolean;
	startTime: number;
	feedbackMessage: string;
	lastVelocity: number;
}

export interface ExerciseConfig {
	exerciseType: string;
	progressiveHints: boolean;
	stopOnMistake: boolean;
	expectedCount: number;
}

export class ExerciseStateManager {
	private state: ExerciseState;
	private config: ExerciseConfig;
	private onStateChange?: (state: ExerciseState) => void;
	private onComplete?: () => void;
	private onMistake?: (note: NoteEvent) => void;

	// Hint thresholds
	static readonly SCORE_SHOW_AFTER_MISTAKES = 1;
	static readonly KEYBOARD_SHOW_AFTER_MISTAKES = 3;
	static readonly EXPECTED_NOTES_SHOW_AFTER_MISTAKES = 3;

	constructor(config: ExerciseConfig) {
		this.config = config;
		this.state = this.getInitialState();
	}

	private getInitialState(): ExerciseState {
		return {
			noteEvents: [],
			mistakes: 0,
			collectedNotes: new Set(),
			completed: false,
			startTime: Date.now(),
			feedbackMessage: '',
			lastVelocity: 0
		};
	}

	setCallbacks(callbacks: {
		onStateChange?: (state: ExerciseState) => void;
		onComplete?: () => void;
		onMistake?: (note: NoteEvent) => void;
	}): void {
		this.onStateChange = callbacks.onStateChange;
		this.onComplete = callbacks.onComplete;
		this.onMistake = callbacks.onMistake;
	}

	addNoteEvent(event: NoteEvent): void {
		this.state.noteEvents = [...this.state.noteEvents, event];
		this.state.lastVelocity = event.velocity;
		this.notifyStateChange();
	}

	removeNoteEvent(noteNumber: number): void {
		this.state.noteEvents = this.state.noteEvents.filter((e) => e.noteNumber !== noteNumber);
		this.notifyStateChange();
	}

	recordMistake(note?: NoteEvent): void {
		this.state.mistakes++;
		if (note && this.onMistake) {
			this.onMistake(note);
		}
		this.notifyStateChange();
	}

	collectNote(noteNumber: MidiNote): void {
		this.state.collectedNotes.add(noteNumber);
		this.notifyStateChange();
	}

	resetCollected(): void {
		this.state.collectedNotes = new Set();
		this.notifyStateChange();
	}

	showFeedback(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
		this.state.feedbackMessage = `${type} : ${message}`;
		this.notifyStateChange();

		// Auto-clear after 5 seconds
		setTimeout(() => {
			if (this.state.feedbackMessage === `${type} : ${message}`) {
				this.state.feedbackMessage = '';
				this.notifyStateChange();
			}
		}, 5000);
	}

	markComplete(): void {
		this.state.completed = true;
		this.onComplete?.();
		this.notifyStateChange();
	}

	reset(preserveFeedback = false): void {
		const previousFeedback = this.state.feedbackMessage;
		this.state = this.getInitialState();
		if (preserveFeedback) {
			this.state.feedbackMessage = previousFeedback;
		}
		this.notifyStateChange();
	}

	getCurrentNotes(): MidiNote[] {
		return this.state.noteEvents.map((e) => e.noteNumber);
	}

	getProgressPercentage(expectedNotes: MidiNote[]): number {
		if (expectedNotes.length === 0) return 0;
		const uniqueExpected = [...new Set(expectedNotes)];
		return Math.round((this.state.collectedNotes.size / uniqueExpected.length) * 100);
	}

	getAccuracy(): number {
		const expectedCount = this.config.expectedCount;
		if (expectedCount === 0) return 0;
		return Math.max(0, Math.round(((expectedCount - this.state.mistakes) / expectedCount) * 100));
	}

	getElapsedTime(): number {
		return Date.now() - this.state.startTime;
	}

	shouldShowScore(): boolean {
		if (!this.config.progressiveHints) return true;
		if (this.config.exerciseType === 'partition') return true;
		return this.state.mistakes >= ExerciseStateManager.SCORE_SHOW_AFTER_MISTAKES;
	}

	shouldShowKeyboard(debugMode: boolean): boolean {
		if (debugMode) return true;
		if (!this.config.progressiveHints) return true;
		return this.state.mistakes >= ExerciseStateManager.KEYBOARD_SHOW_AFTER_MISTAKES;
	}

	shouldShowExpected(): boolean {
		if (!this.config.progressiveHints) return true;
		return this.state.mistakes >= ExerciseStateManager.EXPECTED_NOTES_SHOW_AFTER_MISTAKES;
	}

	getHelpMessage(): string {
		if (!this.config.progressiveHints || this.state.completed) return '';
		if (this.config.exerciseType === 'partition') return '';

		const scoreVisible = this.shouldShowScore();
		const keyboardVisible = this.shouldShowKeyboard(false);
		const expectedVisible = this.shouldShowExpected();

		if (!scoreVisible) {
			if (this.state.mistakes === 0) return '';
			const remaining = ExerciseStateManager.SCORE_SHOW_AFTER_MISTAKES - this.state.mistakes;
			return `Struggling? Sheet music will appear after ${remaining} more mistake${remaining === 1 ? '' : 's'}.`;
		}

		if (!keyboardVisible) {
			const remaining = ExerciseStateManager.KEYBOARD_SHOW_AFTER_MISTAKES - this.state.mistakes;
			return `Sheet music is now visible. Keyboard will appear after ${remaining} more mistake${remaining === 1 ? '' : 's'}.`;
		}

		if (!expectedVisible) {
			const remaining = ExerciseStateManager.EXPECTED_NOTES_SHOW_AFTER_MISTAKES - this.state.mistakes;
			return `Keyboard is now visible. Expected notes will appear after ${remaining} more mistake${remaining === 1 ? '' : 's'}.`;
		}

		return 'All hints are visible. Keep practicing!';
	}

	trackMissedNote(note: NoteEvent, exerciseType: string): void {
		const mappedType =
			exerciseType === 'II-V-I'
				? 'progression'
				: exerciseType === 'note' || exerciseType === 'interval'
					? 'chord'
					: exerciseType;

		if (mappedType !== 'rhythm') {
			userStatsService.trackMissedNote(note.noteName, mappedType);
		}
	}

	recordExerciseResult(exerciseType: string, accuracy: number, timeElapsed: number): void {
		if (!exerciseType) return;

		const resultType: 'chord' | 'scale' | 'progression' | 'partition' | 'rhythm' =
			exerciseType === 'II-V-I'
				? 'progression'
				: exerciseType === 'note' || exerciseType === 'interval'
					? 'chord'
					: (exerciseType as 'chord' | 'scale' | 'progression' | 'partition' | 'rhythm');

		userStatsService.recordExerciseResult({
			exerciseId: window.location.pathname,
			exerciseType: resultType,
			success: true,
			accuracy,
			timeElapsed,
			mistakes: this.state.mistakes,
			score: Math.max(0, 100 - this.state.mistakes * 10),
			timestamp: new Date()
		});
	}

	getState(): Readonly<ExerciseState> {
		return { ...this.state };
	}

	private notifyStateChange(): void {
		this.onStateChange?.({ ...this.state });
	}
}

// Factory function for creating state managers
export function createExerciseStateManager(config: ExerciseConfig): ExerciseStateManager {
	return new ExerciseStateManager(config);
}
