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
	Pillar,
	TrainingSession
} from './JourneyService';

// Services
export { userStatsService } from './UserStatsService';
export { journeyService } from './JourneyService';

// Exercise Engine
export {
	createExerciseController,
	type ExerciseControllerConfig,
	type ExerciseState
} from './exercises/ExerciseController';
export { createTempoManager, type TempoConfig } from './exercises/TempoManager';
export { type ExerciseMusicXMLData, loadLickMusicXML } from './exercises/exerciseMusicXML';

// Validators (lib-level only — exercise-specific validators live in their route's page.ts)
export { type GhostNoteState, validateGhostNote, isGhostNoteChallengeCompleted, getExpectedGhostNote, createGhostNoteState } from './exercises/utils/ghostNoteValidation';

// Managers
export { midiManager } from './MIDIManager';
export { audioManager } from './audio/AudioManager';
export { audioOutputService } from './audio/AudioOutputService';
export { audioInputService } from './audio/AudioInputService';

// Data
export { loadAllSongs, getSongUrl } from './data/MusicXMLLoader';
export { generateMusicXML } from './data/MusicXMLGenerator';

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
export { validateNoteTiming } from './musicValidation';

// Note Constants
export {
	AllNotes,
	NoteToMidi,
	MidiToNote,
	NOTE_TO_CHROMA,
	DEFAULT_OCTAVE
} from './types/notes.constants';


