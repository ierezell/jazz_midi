/**
 * TempoManager - Handles timing validation and beat tracking
 * Extracted from BaseExercise for modularity
 */

import type { NoteEvent } from './types/types';
import { validateNoteTiming } from './music-validation';
import type { BeatTiming, TempoValidation } from './types/exercise-api';

export interface TempoConfig {
	enabled: boolean;
	toleranceMs: number;
	requireDownbeat: boolean;
	perNoteTiming: boolean;
}

export class TempoManager {
	private currentBpm = 120;
	private lastTickTime = 0;
	private lastBeatNumber = 0;
	private wasDownbeat = false;
	private _strictBeat = false;
	private _tempoMode = false;

	private readonly STRICT_TOLERANCE_MS = 50;
	private readonly NORMAL_TOLERANCE_MS = 150;

	get toleranceMs(): number {
		return this._strictBeat ? this.STRICT_TOLERANCE_MS : this.NORMAL_TOLERANCE_MS;
	}

	get bpm(): number {
		return this.currentBpm;
	}

	set bpm(value: number) {
		this.currentBpm = value;
	}

	get isTempoMode(): boolean {
		return this._tempoMode;
	}

	set tempoMode(value: boolean) {
		this._tempoMode = value;
	}

	get isStrictBeat(): boolean {
		return this._strictBeat;
	}

	set strictBeat(value: boolean) {
		this._strictBeat = value;
	}

	handleTick(beatNumber: number, isDownbeat: boolean): void {
		this.lastTickTime = Date.now();
		this.lastBeatNumber = beatNumber;
		this.wasDownbeat = isDownbeat;
	}

	validateNoteTiming(
		note: NoteEvent,
		exerciseType: string,
		collectedCount: number,
		config: { perNoteTiming: boolean }
	): { valid: boolean; error?: string } {
		if (!this.tempoMode) {
			return { valid: true };
		}

		const lastBeat: BeatTiming = {
			timestamp: this.lastTickTime,
			beatNumber: this.lastBeatNumber,
			isDownbeat: this.wasDownbeat
		};

		const tempoConfig: TempoValidation = {
			enabled: true,
			toleranceMs: this.toleranceMs,
			requireDownbeat:
				exerciseType === 'chord' ||
				exerciseType === 'progression' ||
				exerciseType === 'II-V-I'
		};

		// Determine if we should check timing for this note
		const shouldCheckTiming =
			exerciseType === 'partition' ||
			exerciseType === 'rhythm' ||
			config.perNoteTiming === true ||
			collectedCount === 0;

		if (!shouldCheckTiming) {
			return { valid: true };
		}

		const errorMessage = validateNoteTiming(note, lastBeat, tempoConfig, this.currentBpm);

		if (errorMessage) {
			return { valid: false, error: errorMessage };
		}

		return { valid: true };
	}

	getBeatStatus(): { lastTick: number; beatNumber: number; isDownbeat: boolean } {
		return {
			lastTick: this.lastTickTime,
			beatNumber: this.lastBeatNumber,
			isDownbeat: this.wasDownbeat
		};
	}

	reset(): void {
		this.lastTickTime = 0;
		this.lastBeatNumber = 0;
		this.wasDownbeat = false;
	}
}

// Factory function
export function createTempoManager(): TempoManager {
	return new TempoManager();
}
