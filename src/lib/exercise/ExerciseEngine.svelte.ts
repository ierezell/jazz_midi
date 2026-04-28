/**
 * ExerciseEngine - Core exercise state management
 * Extracted from BaseExercise.svelte for testability and reusability
 * 
 * Follows Svelte 5 runes pattern for reactive state
 */

import type { Note, MidiNote, NoteEvent, ExerciseResult, ExerciseType } from '$lib/types/types';

// Constants
export const SCORE_SHOW_AFTER_MISTAKES = 1;
export const KEYBOARD_SHOW_AFTER_MISTAKES = 3;
export const EXPECTED_NOTES_SHOW_AFTER_MISTAKES = 3;
export const STRICT_TOLERANCE_MS = 50;
export const NORMAL_TOLERANCE_MS = 150;

// Types
export interface ExerciseState {
	selectedNote: Note;
	noteEvents: NoteEvent[];
	mistakes: number;
	collectedNotes: Set<MidiNote>;
	completed: boolean;
	startTime: number;
	lastVelocity: number;
}

export interface ExerciseConfig {
	exerciseType: ExerciseType;
	progressiveHints: boolean;
	showScore: boolean | undefined;
	perNoteTiming: boolean;
	defaultBpm: number;
}

export interface TempoState {
	tempoMode: boolean;
	strictBeat: boolean;
	currentBpm: number;
	lastTickTime: number;
	lastBeatNumber: number;
	wasDownbeat: boolean;
}

export interface FeedbackState {
	message: string;
	showNotesRoles: boolean;
	stopOnMistake: boolean;
}

// Exercise Engine State
export function createExerciseEngine(
	initialNote: Note,
	config: ExerciseConfig
) {
	// Core state
	let selectedNote = $state<Note>(initialNote);
	let noteEvents = $state<NoteEvent[]>([]);
	let mistakes = $state(0);
	let collectedNotes = $state<Set<MidiNote>>(new Set());
	let lastVelocity = $state(0);
	let startTime = $state(0);
	let completed = $state(false);

	// Debug/UI state
	let debugMode = $state(false);
	let feedbackMessage = $state('');
	let showNotesRoles = $state(false);
	let stopOnMistake = $state(false);

	// Tempo state
	let tempoMode = $state(false);
	let strictBeat = $state(false);
	let beatFlash = $state(false);
	let lastTickTime = $state(0);
	let currentBpm = $state(config.defaultBpm ?? 120);
	let lastBeatNumber = $state(0);
	let wasDownbeat = $state(false);

	// Derived state
	const currentNotes = $derived(noteEvents.map((e) => e.noteNumber));
	
	const toleranceMs = $derived(strictBeat ? STRICT_TOLERANCE_MS : NORMAL_TOLERANCE_MS);

	const showScoreState = $derived.by(() => {
		if (config.showScore === false) return false;
		if (config.exerciseType === 'partition') return true;
		if (config.progressiveHints) {
			return mistakes >= SCORE_SHOW_AFTER_MISTAKES;
		}
		return config.showScore ?? true;
	});

	const showKeyboard = $derived(
		debugMode || (config.progressiveHints && mistakes >= KEYBOARD_SHOW_AFTER_MISTAKES)
	);

	const showExpected = $derived.by(() => {
		return mistakes >= EXPECTED_NOTES_SHOW_AFTER_MISTAKES;
	});

	function getProgressPercentage(expectedNotes: MidiNote[]): number {
		if (expectedNotes.length === 0) return 0;
		const uniqueExpected = [...new Set(expectedNotes)];
		return Math.round((collectedNotes.size / uniqueExpected.length) * 100);
	}

	const helpMessage = $derived.by(() => {
		if (!config.progressiveHints || completed) return '';
		if (config.exerciseType === 'partition') return '';

		const scoreVisible = mistakes >= SCORE_SHOW_AFTER_MISTAKES;
		const keyboardVisible = mistakes >= KEYBOARD_SHOW_AFTER_MISTAKES;
		const expectedNotesVisible = mistakes >= EXPECTED_NOTES_SHOW_AFTER_MISTAKES;

		if (!scoreVisible) {
			if (mistakes === 0) return '';
			const remaining = SCORE_SHOW_AFTER_MISTAKES - mistakes;
			return `Struggling? Sheet music will appear after ${remaining} more mistake${remaining === 1 ? '' : 's'}.`;
		}

		if (!keyboardVisible) {
			const remaining = KEYBOARD_SHOW_AFTER_MISTAKES - mistakes;
			return `Sheet music is now visible. Keyboard will appear after ${remaining} more mistake${remaining === 1 ? '' : 's'}.`;
		}

		if (!expectedNotesVisible) {
			const remaining = EXPECTED_NOTES_SHOW_AFTER_MISTAKES - mistakes;
			return `Keyboard is now visible. Expected notes will appear after ${remaining} more mistake${remaining === 1 ? '' : 's'}.`;
		}

		return 'All hints are visible. Keep practicing!';
	});

	// Actions
	function resetExercise() {
		noteEvents = [];
		mistakes = 0;
		collectedNotes = new Set();
		completed = false;
		startTime = Date.now();
		feedbackMessage = '';
	}

	function setSelectedNote(note: Note) {
		selectedNote = note;
	}

	function addNoteEvent(event: NoteEvent) {
		noteEvents = [...noteEvents, event];
	}

	function removeNoteEvent(noteNumber: MidiNote) {
		noteEvents = noteEvents.filter((e) => e.noteNumber !== noteNumber);
	}

	function recordMistake() {
		mistakes++;
	}

	function collectNote(note: MidiNote) {
		collectedNotes = new Set([...collectedNotes, note]);
	}

	function markCompleted() {
		completed = true;
	}

	function setFeedback(message: string) {
		feedbackMessage = message;
	}

	function toggleDebug() {
		debugMode = !debugMode;
	}

	function toggleTempoMode() {
		tempoMode = !tempoMode;
	}

	function toggleStopOnMistake() {
		stopOnMistake = !stopOnMistake;
	}

	function toggleNotesRoles() {
		showNotesRoles = !showNotesRoles;
	}

	function handleTick(beatNumber: number, isDownbeat: boolean) {
		lastTickTime = Date.now();
		lastBeatNumber = beatNumber;
		wasDownbeat = isDownbeat;
		beatFlash = true;
		setTimeout(() => beatFlash = false, 100);
	}

	function setBpm(bpm: number) {
		currentBpm = bpm;
	}

	// Initialize
	function initialize() {
		startTime = Date.now();
		resetExercise();
	}

	return {
		// State (readonly)
		get selectedNote() { return selectedNote; },
		get noteEvents() { return noteEvents; },
		get mistakes() { return mistakes; },
		get collectedNotes() { return collectedNotes; },
		get completed() { return completed; },
		get startTime() { return startTime; },
		get lastVelocity() { return lastVelocity; },
		get debugMode() { return debugMode; },
		get feedbackMessage() { return feedbackMessage; },
		get showNotesRoles() { return showNotesRoles; },
		get stopOnMistake() { return stopOnMistake; },
		get tempoMode() { return tempoMode; },
		get strictBeat() { return strictBeat; },
		get beatFlash() { return beatFlash; },
		get lastTickTime() { return lastTickTime; },
		get currentBpm() { return currentBpm; },
		get lastBeatNumber() { return lastBeatNumber; },
		get wasDownbeat() { return wasDownbeat; },

		// Derived
		currentNotes,
		toleranceMs,
		showScoreState,
		showKeyboard,
		showExpected,
		helpMessage,

		// Actions
		setSelectedNote,
		resetExercise,
		addNoteEvent,
		removeNoteEvent,
		recordMistake,
		collectNote,
		markCompleted,
		setFeedback,
		toggleDebug,
		toggleTempoMode,
		toggleStopOnMistake,
		toggleNotesRoles,
		handleTick,
		setBpm,
		initialize,
		getProgressPercentage
	};
}

export type ExerciseEngine = ReturnType<typeof createExerciseEngine>;
