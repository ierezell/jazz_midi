/**
 * Core framework exports
 * Central hub for all core functionality
 */

// Core types and configuration
export * from './ConfigManager';
export * from './types';

// State management (selective export to avoid conflicts)
export {
	createChordExerciseState,
	createScaleExerciseState,
	ExerciseStateManager
} from './StateManager';

// Base classes
export * from './base/BaseController';

// Specific controllers
export * from './controllers/ChordController';

// Utilities
export * from '../utils/MusicTheoryUtils';

// Re-export existing managers for backward compatibility
export { audioManager } from '../managers/AudioManager';
export { midiManager } from '../managers/MIDIManager';
