/**
 * Barrel file for $lib exports
 * Provides clean public API boundary
 */

// Types
export type {
	Note,
	MidiNote,
	NoteEvent,
	ScoreProps,
	ExerciseType,
	KeyboardProps,
	ExerciseStatistics,
	ExerciseResult,
	MIDIEventHandlers,
	RhythmHit,
	RhythmPattern,
	Lick
} from './types/types';

export type {
	Unit,
	Lesson,
	DailyPracticeItem,
	DailyPracticeRoutine
} from './JourneyService';

export type {
	Pillar,
	WorkoutSession,
	WorkoutExercise
} from './CurriculumEngine';

// Services
export { userStatsService } from './UserStatsService';
export { journeyService } from './JourneyService';
export { curriculumEngine } from './CurriculumEngine';

// Exercise Engine
export { createExerciseEngine, type ExerciseEngine } from './exercise/ExerciseEngine.svelte';
export {
	SCORE_SHOW_AFTER_MISTAKES,
	KEYBOARD_SHOW_AFTER_MISTAKES,
	EXPECTED_NOTES_SHOW_AFTER_MISTAKES,
	STRICT_TOLERANCE_MS,
	NORMAL_TOLERANCE_MS,
	type ExerciseState,
	type ExerciseConfig,
	type TempoState,
	type FeedbackState
} from './exercise/ExerciseEngine.svelte';

// Managers
export { midiManager } from './MIDIManager';
export { audioManager } from './AudioManager';

// Music Theory Utils
export {
	calculateOptimalRange,
	getNoteRole,
	chords,
	getVoicedChordNotes,
	generateChordNotesDataFromChord,
	generateChordNotesData,
	calculateOptimalInversion,
	calculateInterval
} from './MusicTheoryUtils';

// Validation
export { validateNoteTiming } from './music-validation';

// Note Constants
export {
	AllNotes,
	NoteToMidi,
	MidiToNote,
	DEFAULT_OCTAVE
} from './types/notes.constants';
