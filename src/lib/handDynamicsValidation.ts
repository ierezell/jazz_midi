import type { MidiNote, NoteEvent } from './types/types';
import type { ValidationResult } from './types/exercise-api';

export type Hand = 'LH' | 'RH';

export interface HandDynamicsState {
	// Separate tracking for each hand
	lhNotesPlayed: number;
	lhCorrectDynamics: number;
	rhNotesPlayed: number;
	rhCorrectDynamics: number;
	// Velocity history for visualization
	lhVelocities: number[];
	rhVelocities: number[];
	// Current "balance" score
	balanceScore: number; // 0-100, how well balanced the hands are
	// Violation tracking
	lhTooLoudCount: number;
	rhTooLoudCount: number;
	// Last played hand for pattern-based exercises
	lastHand: Hand | null;
}

export interface HandDynamicsConfig {
	// Target velocity ranges for each hand
	lhTargetMin: number; // e.g., 30 (soft)
	lhTargetMax: number; // e.g., 50 (piano)
	rhTargetMin: number; // e.g., 80 (forte)
	rhTargetMax: number; // e.g., 110 (fortissimo)
	// Tolerance for "correct" dynamics
	tolerance: number;
	// Notes assigned to each hand
	lhNotes: MidiNote[];
	rhNotes: MidiNote[];
}

export function createHandDynamicsState(): HandDynamicsState {
	return {
		lhNotesPlayed: 0,
		lhCorrectDynamics: 0,
		rhNotesPlayed: 0,
		rhCorrectDynamics: 0,
		lhVelocities: [],
		rhVelocities: [],
		balanceScore: 0,
		lhTooLoudCount: 0,
		rhTooLoudCount: 0,
		lastHand: null
	};
}

export function getHandForNote(note: MidiNote, config: HandDynamicsConfig): Hand | null {
	// Check if note is in LH range
	if (config.lhNotes.includes(note)) return 'LH';
	// Check if note is in RH range
	if (config.rhNotes.includes(note)) return 'RH';
	// Determine by MIDI note range as fallback
	if (note < 60) return 'LH'; // Below middle C = LH
	return 'RH'; // Middle C and above = RH
}

export interface HandDynamicsResult {
	isCorrect: boolean;
	message: string;
	collected: boolean;
	resetCollected: boolean;
	hand: Hand | null;
	feedback: string;
}

export function validateHandDynamics(
	event: NoteEvent,
	config: HandDynamicsConfig,
	state: HandDynamicsState
): HandDynamicsResult {
	const hand = getHandForNote(event.noteNumber, config);
	const { velocity } = event;

	if (!hand) {
		return {
			isCorrect: false,
			message: 'Unknown hand assignment!',
			collected: false,
			resetCollected: false,
			hand: null,
			feedback: 'error'
		};
	}

	state.lastHand = hand;

	// Track velocity for visualization
	if (hand === 'LH') {
		state.lhVelocities.push(velocity);
		if (state.lhVelocities.length > 20) state.lhVelocities.shift();
		state.lhNotesPlayed++;
	} else {
		state.rhVelocities.push(velocity);
		if (state.rhVelocities.length > 20) state.rhVelocities.shift();
		state.rhNotesPlayed++;
	}

	// Check if velocity is in target range
	let isCorrect = false;
	let message = '';
	let feedback = 'neutral';

	if (hand === 'LH') {
		// LH should be soft (piano)
		if (velocity >= config.lhTargetMin && velocity <= config.lhTargetMax) {
			isCorrect = true;
			state.lhCorrectDynamics++;
			message = `LH soft ✓ (${velocity})`;
			feedback = 'good';
		} else if (velocity > config.lhTargetMax) {
			// LH too loud - this is the main training goal!
			state.lhTooLoudCount++;
			const excess = velocity - config.lhTargetMax;
			message = `LH too loud! (${velocity}) - Keep it soft!`;
			feedback = 'lh_too_loud';
		} else {
			// LH too soft
			message = `LH too soft (${velocity})`;
			feedback = 'lh_too_soft';
		}
	} else {
		// RH should be strong (forte)
		if (velocity >= config.rhTargetMin && velocity <= config.rhTargetMax) {
			isCorrect = true;
			state.rhCorrectDynamics++;
			message = `RH strong ✓ (${velocity})`;
			feedback = 'good';
		} else if (velocity < config.rhTargetMin) {
			// RH too soft
			message = `RH too soft (${velocity}) - Lead with melody!`;
			feedback = 'rh_too_soft';
		} else {
			// RH too loud (not as critical as LH being too loud)
			state.rhTooLoudCount++;
			message = `RH very strong (${velocity})`;
			feedback = 'neutral';
		}
	}

	// Calculate balance score
	const lhAvg =
		state.lhVelocities.length > 0
			? state.lhVelocities.reduce((a, b) => a + b, 0) / state.lhVelocities.length
			: 0;
	const rhAvg =
		state.rhVelocities.length > 0
			? state.rhVelocities.reduce((a, b) => a + b, 0) / state.rhVelocities.length
			: 0;

	// Ideal: LH around 40, RH around 90
	// Balance score based on how close we are to ideal separation
	const idealSeparation = 50; // 90 - 40
	const actualSeparation = rhAvg - lhAvg;
	const separationScore = Math.max(0, 100 - Math.abs(actualSeparation - idealSeparation) * 2);

	// Also factor in correctness
	const totalNotes = state.lhNotesPlayed + state.rhNotesPlayed;
	const correctNotes = state.lhCorrectDynamics + state.rhCorrectDynamics;
	const correctnessScore = totalNotes > 0 ? (correctNotes / totalNotes) * 100 : 0;

	state.balanceScore = Math.round((separationScore + correctnessScore) / 2);

	return {
		isCorrect,
		message,
		collected: isCorrect,
		resetCollected: false,
		hand,
		feedback
	};
}

export function isHandDynamicsCompleted(
	state: HandDynamicsState,
	minNotesPerHand: number = 8
): boolean {
	return state.lhNotesPlayed >= minNotesPerHand && state.rhNotesPlayed >= minNotesPerHand;
}

export function getDynamicsFeedback(state: HandDynamicsState): string {
	if (state.lhNotesPlayed < 3 || state.rhNotesPlayed < 3) {
		return 'Play with both hands - LH soft, RH strong';
	}

	const lhAccuracy =
		state.lhNotesPlayed > 0 ? (state.lhCorrectDynamics / state.lhNotesPlayed) * 100 : 0;
	const rhAccuracy =
		state.rhNotesPlayed > 0 ? (state.rhCorrectDynamics / state.rhNotesPlayed) * 100 : 0;

	if (state.lhTooLoudCount > state.lhNotesPlayed * 0.3) {
		return '🔇 LH is overpowering! Practice playing piano with left hand.';
	}

	if (lhAccuracy > 80 && rhAccuracy > 80) {
		return '🎹 Excellent dynamics! LH soft, RH strong - perfect jazz balance!';
	} else if (lhAccuracy > 60 && rhAccuracy > 60) {
		return '👍 Good balance. Keep LH softer than RH.';
	} else if (lhAccuracy < 50) {
		return '🎹 LH too loud! Practice ghost notes with left hand.';
	} else if (rhAccuracy < 50) {
		return '🎵 RH needs more presence. Lead with melody!';
	}

	return 'Balance your hands: LH piano, RH forte';
}

export function getAverageVelocities(state: HandDynamicsState): { lh: number; rh: number } {
	const lhAvg =
		state.lhVelocities.length > 0
			? Math.round(state.lhVelocities.reduce((a, b) => a + b, 0) / state.lhVelocities.length)
			: 0;
	const rhAvg =
		state.rhVelocities.length > 0
			? Math.round(state.rhVelocities.reduce((a, b) => a + b, 0) / state.rhVelocities.length)
			: 0;
	return { lh: lhAvg, rh: rhAvg };
}
