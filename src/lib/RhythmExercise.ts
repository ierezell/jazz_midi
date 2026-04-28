/**
 * Rhythm exercise logic for bar-by-bar practice with mistake handling
 */

import type { BarData, RhythmConfig, RhythmValidationResult, MistakeMode } from './types/rhythm';
import type { MidiNote, NoteEvent } from './types/types';
import { validateNoteTiming } from './music-validation';
import type { TempoValidation, BeatTiming } from './types/exercise-api';

/**
 * Create bars from chord progression or melody data
 */
export function createBarsFromChords(
	chords: { root: string; quality: string; duration: number }[],
	notesPerBar: number = 4
): BarData[] {
	return chords.map((chord, index) => ({
		index,
		expectedNotes: [], // Will be populated based on voicing settings
		expectedBeats: Array.from({ length: notesPerBar }, (_, i) => i + 1),
		chordName: `${chord.root}${chord.quality}`,
		melodyNotes: []
	}));
}

/**
 * Create bars from melody notes
 */
export function createBarsFromMelody(
	melody: { pitch: number; beat: number; measure: number }[],
	timeSignature: { numerator: number; denominator: number } = { numerator: 4, denominator: 4 }
): BarData[] {
	// Group notes by measure
	const notesByMeasure = new Map<number, typeof melody>();

	for (const note of melody) {
		const existing = notesByMeasure.get(note.measure) || [];
		existing.push(note);
		notesByMeasure.set(note.measure, existing);
	}

	// Create bars from grouped notes
	return Array.from(notesByMeasure.entries())
		.sort((a, b) => a[0] - b[0])
		.map(([measureIndex, notes]) => ({
			index: measureIndex,
			expectedNotes: notes.map((n) => n.pitch as MidiNote),
			expectedBeats: notes.map((n) => n.beat),
			melodyNotes: notes.map((n) => n.pitch as MidiNote)
		}));
}

/**
 * Validate a note played during rhythm exercise
 */
export function validateRhythmNote(
	event: NoteEvent,
	currentBar: BarData,
	playedNotes: Set<MidiNote>,
	config: RhythmConfig,
	lastBeat: BeatTiming,
	currentBpm: number
): RhythmValidationResult {
	// Check timing if enabled
	if (config.tempo > 0) {
		const tempoConfig: TempoValidation = {
			enabled: true,
			toleranceMs: 150,
			requireDownbeat: false
		};

		const timingError = validateNoteTiming(event, lastBeat, tempoConfig, currentBpm);

		if (timingError) {
			return {
				isCorrect: false,
				isOnTime: false,
				message: timingError,
				shouldRestartBar: config.mistakeMode === 'auto-restart',
				shouldPause: config.mistakeMode === 'wait-for-key'
			};
		}
	}

	// Check if note is expected
	const isExpected = currentBar.expectedNotes.includes(event.noteNumber);

	if (!isExpected) {
		return {
			isCorrect: false,
			isOnTime: true,
			message: 'Wrong note!',
			shouldRestartBar: config.mistakeMode === 'auto-restart',
			shouldPause: config.mistakeMode === 'wait-for-key'
		};
	}

	// Note is correct and on time
	return {
		isCorrect: true,
		isOnTime: true,
		message: 'Good!',
		shouldRestartBar: false,
		shouldPause: false
	};
}

/**
 * Check if current bar is complete
 */
export function isBarComplete(
	currentBar: BarData,
	playedNotes: Set<MidiNote>,
	playedBeats: Set<number>
): boolean {
	// For chord-based bars, check if all expected notes have been played
	if (currentBar.expectedNotes.length > 0) {
		const uniqueExpected = [...new Set(currentBar.expectedNotes)];
		const playedCount = uniqueExpected.filter((n) => playedNotes.has(n)).length;
		return playedCount === uniqueExpected.length;
	}

	// For rhythm-based bars, check if all beats have been hit
	if (currentBar.expectedBeats.length > 0) {
		return playedBeats.size >= currentBar.expectedBeats.length;
	}

	return false;
}

/**
 * Get countdown message for auto-restart mode
 */
export function getAutoRestartMessage(remainingSeconds: number): string {
	if (remainingSeconds > 3) {
		return `Mistake! Restarting from previous bar in ${remainingSeconds}...`;
	} else if (remainingSeconds > 0) {
		return `Restarting in ${remainingSeconds}... Get ready!`;
	}
	return 'Restarting now!';
}

/**
 * Get instruction message for wait-for-key mode
 */
export function getWaitForKeyMessage(): string {
	return 'Mistake! Press any key to restart from the beginning of this bar.';
}

/**
 * Calculate which bar to restart to after a mistake
 */
export function getRestartBarIndex(
	currentBarIndex: number,
	bars: BarData[],
	lookbackBars: number = 1
): number {
	// Restart from previous bar (or earlier if at the beginning)
	const restartIndex = Math.max(0, currentBarIndex - lookbackBars);
	return restartIndex;
}

/**
 * Format bar progress for display
 */
export function formatBarProgress(
	currentBarIndex: number,
	totalBars: number,
	playedNotes: Set<MidiNote>,
	currentBar: BarData
): string {
	const barNumber = currentBarIndex + 1;

	if (currentBar.chordName) {
		const progress = playedNotes.size;
		const total = currentBar.expectedNotes.length || 4;
		return `Bar ${barNumber}/${totalBars} - ${currentBar.chordName} (${progress}/${total} notes)`;
	}

	return `Bar ${barNumber}/${totalBars}`;
}

/**
 * Generate rhythm exercise from song data
 */
export function generateRhythmExerciseFromSong(
	chords: { root: string; quality: string; duration: number; measure: number }[],
	config: Partial<RhythmConfig> = {}
): { bars: BarData[]; config: RhythmConfig } {
	// Group chords by measure
	const chordsByMeasure = new Map<number, typeof chords>();

	for (const chord of chords) {
		const existing = chordsByMeasure.get(chord.measure) || [];
		existing.push(chord);
		chordsByMeasure.set(chord.measure, existing);
	}

	// Create bars
	const sortedMeasures = Array.from(chordsByMeasure.keys()).sort((a, b) => a - b);
	const bars: BarData[] = sortedMeasures.map((measureIndex, barIndex) => {
		const measureChords = chordsByMeasure.get(measureIndex) || [];
		const firstChord = measureChords[0];

		return {
			index: barIndex,
			expectedNotes: [], // Populated later with actual chord notes
			expectedBeats: [1, 2, 3, 4], // Standard 4/4
			chordName: firstChord ? `${firstChord.root}${firstChord.quality}` : undefined,
			melodyNotes: []
		};
	});

	const fullConfig: RhythmConfig = {
		tempo: config.tempo || 120,
		timeSignature: config.timeSignature || { numerator: 4, denominator: 4 },
		swing: config.swing ?? true,
		mistakeMode: config.mistakeMode || 'auto-restart',
		autoRestartDelay: config.autoRestartDelay || 4
	};

	return { bars, config: fullConfig };
}

/**
 * Audio cues for rhythm exercise
 */
export function getBeatAudioCue(
	beatNumber: number,
	isDownbeat: boolean,
	config: RhythmConfig
): { frequency: number; duration: number; volume: number } {
	if (isDownbeat) {
		return { frequency: 1200, duration: 0.1, volume: 0.7 };
	}

	if (config.swing && beatNumber % 1 !== 0) {
		// Swing eighth notes
		return { frequency: 800, duration: 0.05, volume: 0.3 };
	}

	return { frequency: 1000, duration: 0.08, volume: 0.5 };
}
