/**
 * ExerciseController - Business logic for exercise management
 * Extracted from BaseExercise.svelte to follow Single Responsibility Principle
 * Handles: note validation, scoring, progress tracking, completion detection
 */

import { userStatsService } from './UserStatsService';
import { audioManager } from './AudioManager';
import { logger } from './LoggingService';
import type { MidiNote, Note, NoteEvent } from './types/types';
import type { ValidationResult } from './types/exercise-api';

export interface ExerciseControllerConfig {
	exerciseType: string;
	prompt?: string;
	progressiveHints: boolean;
	stopOnMistake: boolean;
	perNoteTiming: boolean;
}

export interface ExerciseState {
	currentNotes: MidiNote[];
	collectedNotes: Set<MidiNote>;
	mistakes: number;
	completed: boolean;
	feedbackMessage: string;
}

export type StateCallback = (state: ExerciseState) => void;
export type CompleteCallback = (accuracy: number, timeElapsed: number) => void;

export class ExerciseController {
	private config: ExerciseControllerConfig;
	private selectedNote: Note = 'C';
	private noteEvents: NoteEvent[] = [];
	private collectedNotes: Set<MidiNote> = new Set();
	private mistakes = 0;
	private completed = false;
	private feedbackMessage = '';
	private startTime = Date.now();
	
	private onStateChange?: StateCallback;
	private onComplete?: CompleteCallback;
	private validateNoteCallback?: (
		selectedNote: Note,
		event: NoteEvent,
		expectedNotes: MidiNote[],
		currentNotes: MidiNote[]
	) => ValidationResult;

	constructor(config: ExerciseControllerConfig) {
		this.config = config;
	}

	setCallbacks(
		onStateChange: StateCallback,
		onComplete: CompleteCallback,
		validateNoteCallback: ExerciseController['validateNoteCallback']
	): void {
		this.onStateChange = onStateChange;
		this.onComplete = onComplete;
		this.validateNoteCallback = validateNoteCallback;
	}

	setSelectedNote(note: Note): void {
		this.selectedNote = note;
	}

	getSelectedNote(): Note {
		return this.selectedNote;
	}

	handleNoteOn(
		note: NoteEvent,
		isOffBeat: boolean,
		expectedNotes: MidiNote[]
	): { isCorrect: boolean; shouldComplete: boolean } {
		this.noteEvents = [...this.noteEvents, note];
		const currentNotes = this.noteEvents.map((e) => e.noteNumber);

		if (!this.validateNoteCallback) {
			logger.error('No validation callback set', undefined, 'ExerciseController');
			return { isCorrect: false, shouldComplete: false };
		}

		const result = this.validateNoteCallback(
			this.selectedNote,
			note,
			expectedNotes,
			currentNotes
		);

		if (result.resetCollected) {
			this.collectedNotes = new Set();
		}

		if ('resetMistakes' in result && result.resetMistakes) {
			this.mistakes = 0;
		}

		if (result.collected && !isOffBeat) {
			this.collectedNotes.add(note.noteNumber);
		}

		if (result.isCorrect && !isOffBeat) {
			this.showFeedback(result.message, 'success');
		} else if (!isOffBeat) {
			this.mistakes++;
			this.showFeedback(result.message, 'error');
			audioManager.playError();
			this.trackMissedNote(note);
		}

		if (this.config.stopOnMistake && !result.isCorrect) {
			this.showFeedback('Mistake! Take your time...', 'error');
		}

		this.notifyStateChange();

		return {
			isCorrect: result.isCorrect,
			shouldComplete: this.checkCompletion(currentNotes, expectedNotes)
		};
	}

	handleNoteOff(note: NoteEvent): void {
		this.noteEvents = this.noteEvents.filter((e) => e.noteNumber !== note.noteNumber);
		this.notifyStateChange();
	}

	private trackMissedNote(note: NoteEvent): void {
		const mappedType =
			this.config.exerciseType === 'II-V-I'
				? 'progression'
				: this.config.exerciseType === 'note' || this.config.exerciseType === 'interval'
					? 'chord'
					: this.config.exerciseType;

		if (mappedType !== 'rhythm') {
			userStatsService.trackMissedNote(note.noteName, mappedType);
			if (mappedType === 'chord' || mappedType === 'progression') {
				const chordKey = `${this.selectedNote}-${this.config.prompt ?? this.config.exerciseType ?? 'unknown'}`;
				userStatsService.trackMissedChord(chordKey, mappedType);
			}
		}

		// Track note progress
		userStatsService.updateNoteProgress(
			note.noteName,
			mappedType as 'chord' | 'scale' | 'progression' | 'partition' | 'rhythm',
			undefined,
			false,
			0,
			0
		);
	}

	private checkCompletion(currentNotes: MidiNote[], expectedNotes: MidiNote[]): boolean {
		// Default implementation - can be overridden
		if (expectedNotes.length === 0) return false;
		
		// Check if all expected notes have been collected
		const uniqueExpected = [...new Set(expectedNotes)];
		const allCollected = uniqueExpected.every(note => this.collectedNotes.has(note));
		
		if (allCollected && !this.completed) {
			this.completeExercise();
			return true;
		}
		return false;
	}

	private completeExercise(): void {
		this.completed = true;
		const timeElapsed = Date.now() - this.startTime;
		const expectedCount = this.collectedNotes.size;
		const accuracy =
			expectedCount > 0
				? Math.max(0, Math.round(((expectedCount - this.mistakes) / expectedCount) * 100))
				: 0;

		this.showFeedback(`Exercise completed! Accuracy: ${accuracy}%`, 'success');
		audioManager.playSound?.('success');

		this.recordExerciseResult(accuracy, timeElapsed);
		this.onComplete?.(accuracy, timeElapsed);
	}

	private recordExerciseResult(accuracy: number, timeElapsed: number): void {
		if (!this.config.exerciseType) return;

		const resultType: 'chord' | 'scale' | 'progression' | 'partition' | 'rhythm' =
			this.config.exerciseType === 'II-V-I'
				? 'progression'
				: this.config.exerciseType === 'note' || this.config.exerciseType === 'interval'
					? 'chord'
					: (this.config.exerciseType as 'chord' | 'scale' | 'progression' | 'partition' | 'rhythm');

		userStatsService.recordExerciseResult({
			exerciseId: window.location.pathname,
			exerciseType: resultType,
			success: true,
			accuracy,
			timeElapsed,
			mistakes: this.mistakes,
			score: Math.max(0, 100 - this.mistakes * 10),
			timestamp: new Date()
		});
	}

	showFeedback(message: string, type: 'success' | 'error' | 'info'): void {
		this.feedbackMessage = `${type} : ${message}`;
		this.notifyStateChange();

		// Auto-clear after 5 seconds
		setTimeout(() => {
			if (this.feedbackMessage === `${type} : ${message}`) {
				this.feedbackMessage = '';
				this.notifyStateChange();
			}
		}, 5000);
	}

	reset(): void {
		this.noteEvents = [];
		this.collectedNotes = new Set();
		this.mistakes = 0;
		this.completed = false;
		this.feedbackMessage = '';
		this.startTime = Date.now();
		this.notifyStateChange();
	}

	getCurrentNotes(): MidiNote[] {
		return this.noteEvents.map((e) => e.noteNumber);
	}

	getProgressPercentage(expectedNotes: MidiNote[]): number {
		if (expectedNotes.length === 0) return 0;
		const uniqueExpected = [...new Set(expectedNotes)];
		return Math.round((this.collectedNotes.size / uniqueExpected.length) * 100);
	}

	getMistakes(): number {
		return this.mistakes;
	}

	isCompleted(): boolean {
		return this.completed;
	}

	getState(): ExerciseState {
		return {
			currentNotes: this.getCurrentNotes(),
			collectedNotes: new Set(this.collectedNotes),
			mistakes: this.mistakes,
			completed: this.completed,
			feedbackMessage: this.feedbackMessage
		};
	}

	private notifyStateChange(): void {
		this.onStateChange?.(this.getState());
	}
}

// Factory function
export function createExerciseController(config: ExerciseControllerConfig): ExerciseController {
	return new ExerciseController(config);
}
