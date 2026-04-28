/**
 * Types for rhythm exercise mode with bar-by-bar practice
 */

import type { MidiNote } from './types';

export type MistakeMode = 'auto-restart' | 'wait-for-key';

export interface BarData {
	index: number;
	expectedNotes: MidiNote[];
	expectedBeats: number[]; // Which beats to play on (1.0, 1.5, 2.0, etc.)
	chordName?: string;
	melodyNotes?: MidiNote[];
}

export interface RhythmExerciseState {
	currentBar: number;
	bars: BarData[];
	mistakeMode: MistakeMode;
	isPaused: boolean;
	autoRestartCountdown: number; // seconds remaining for auto-restart
}

export interface RhythmValidationResult {
	isCorrect: boolean;
	isOnTime: boolean;
	message: string;
	shouldRestartBar: boolean;
	shouldPause: boolean;
}

export interface RhythmConfig {
	tempo: number;
	timeSignature: { numerator: number; denominator: number };
	swing: boolean;
	mistakeMode: MistakeMode;
	autoRestartDelay: number; // seconds before auto-restart (default 4)
}
