import type { NoteEvent } from '../../types/types';
import type { VelocityValidationResult, VelocityMap, SongExercise } from '../../types/musicxml';

export type VelocityMode = 'per-note' | 'hand-based' | 'ghost-accent' | 'off';

export interface VelocityValidatorConfig {
	mode: VelocityMode;
	// Per-note constraints (pitch -> velocity limits)
	perNoteConstraints?: Map<number, { min?: number; max?: number; hint?: string }>;
	// Hand-based constraints
	lhVelocityMax?: number; // Default: 50
	rhVelocityMin?: number; // Default: 80
	staffSplitNote?: number; // Default: 60 (middle C)
	// Ghost-accent pattern
	ghostVelocityMax?: number; // Default: 40
	accentVelocityMin?: number; // Default: 80
	// Global constraints
	globalMin?: number;
	globalMax?: number;
}

export class VelocityValidator {
	private config: VelocityValidatorConfig;
	private beatPosition: number = 0; // For ghost-accent mode
	private validationHistory: VelocityValidationResult[] = [];

	constructor(config: Partial<VelocityValidatorConfig> = {}) {
		this.config = {
			mode: config.mode ?? 'off',
			lhVelocityMax: config.lhVelocityMax ?? 50,
			rhVelocityMin: config.rhVelocityMin ?? 80,
			staffSplitNote: config.staffSplitNote ?? 60,
			ghostVelocityMax: config.ghostVelocityMax ?? 40,
			accentVelocityMin: config.accentVelocityMin ?? 80,
			globalMin: config.globalMin,
			globalMax: config.globalMax,
			perNoteConstraints: config.perNoteConstraints
		};
	}

	/**
	 * Validate a single note's velocity
	 */
	validate(event: NoteEvent, staff?: number): VelocityValidationResult {
		if (this.config.mode === 'off') {
			return {
				pitch: event.noteNumber,
				playedVelocity: event.velocity,
				isValid: true,
				deviation: 0,
				feedback: 'Velocity check disabled'
			};
		}

		let result: VelocityValidationResult;

		switch (this.config.mode) {
			case 'per-note':
				result = this.validatePerNote(event);
				break;
			case 'hand-based':
				result = this.validateHandBased(event, staff);
				break;
			case 'ghost-accent':
				result = this.validateGhostAccent(event);
				break;
			default:
				result = {
					pitch: event.noteNumber,
					playedVelocity: event.velocity,
					isValid: true,
					deviation: 0,
					feedback: 'Unknown validation mode'
				};
		}

		this.validationHistory.push(result);
		if (this.validationHistory.length > 50) {
			this.validationHistory.shift();
		}

		return result;
	}

	private validatePerNote(event: NoteEvent): VelocityValidationResult {
		const constraints = this.config.perNoteConstraints?.get(event.noteNumber);
		const { velocity } = event;

		if (!constraints) {
			// No specific constraints, use global if set
			if (this.config.globalMin !== undefined && velocity < this.config.globalMin) {
				return {
					pitch: event.noteNumber,
					playedVelocity: velocity,
					minVelocity: this.config.globalMin,
					isValid: false,
					deviation: this.config.globalMin - velocity,
					feedback: `Too soft! Minimum: ${this.config.globalMin}`
				};
			}
			if (this.config.globalMax !== undefined && velocity > this.config.globalMax) {
				return {
					pitch: event.noteNumber,
					playedVelocity: velocity,
					maxVelocity: this.config.globalMax,
					isValid: false,
					deviation: velocity - this.config.globalMax,
					feedback: `Too loud! Maximum: ${this.config.globalMax}`
				};
			}
			return {
				pitch: event.noteNumber,
				playedVelocity: velocity,
				isValid: true,
				deviation: 0,
				feedback: 'OK'
			};
		}

		const { min, max, hint } = constraints;

		if (min !== undefined && velocity < min) {
			return {
				pitch: event.noteNumber,
				playedVelocity: velocity,
				minVelocity: min,
				isValid: false,
				deviation: min - velocity,
				feedback: hint ? `${hint} - too soft!` : `Too soft! Minimum: ${min}`
			};
		}

		if (max !== undefined && velocity > max) {
			return {
				pitch: event.noteNumber,
				playedVelocity: velocity,
				maxVelocity: max,
				isValid: false,
				deviation: velocity - max,
				feedback: hint ? `${hint} - too loud!` : `Too loud! Maximum: ${max}`
			};
		}

		return {
			pitch: event.noteNumber,
			playedVelocity: velocity,
			expectedVelocity: min !== undefined && max !== undefined ? (min + max) / 2 : undefined,
			minVelocity: min,
			maxVelocity: max,
			isValid: true,
			deviation: 0,
			feedback: hint ? `${hint} ✓` : 'Perfect!'
		};
	}

	private validateHandBased(event: NoteEvent, staff?: number): VelocityValidationResult {
		const { noteNumber, velocity } = event;

		// Determine hand from staff or note range
		const isLeftHand =
			staff === 2 || (staff === undefined && noteNumber < (this.config.staffSplitNote ?? 60));

		if (isLeftHand) {
			const max = this.config.lhVelocityMax ?? 50;
			if (velocity > max) {
				return {
					pitch: noteNumber,
					playedVelocity: velocity,
					maxVelocity: max,
					isValid: false,
					deviation: velocity - max,
					feedback: `👈 LH too loud! Keep it soft (< ${max})`
				};
			}
			return {
				pitch: noteNumber,
				playedVelocity: velocity,
				maxVelocity: max,
				isValid: true,
				deviation: 0,
				feedback: '👈 LH soft ✓'
			};
		} else {
			const min = this.config.rhVelocityMin ?? 80;
			if (velocity < min) {
				return {
					pitch: noteNumber,
					playedVelocity: velocity,
					minVelocity: min,
					isValid: false,
					deviation: min - velocity,
					feedback: `👉 RH too soft! Lead with melody (> ${min})`
				};
			}
			return {
				pitch: noteNumber,
				playedVelocity: velocity,
				minVelocity: min,
				isValid: true,
				deviation: 0,
				feedback: '👉 RH strong ✓'
			};
		}
	}

	private validateGhostAccent(event: NoteEvent): VelocityValidationResult {
		const { noteNumber, velocity } = event;
		const isDownbeat = this.beatPosition === 0;

		// Toggle beat position for next note
		this.beatPosition = this.beatPosition === 0 ? 1 : 0;

		if (isDownbeat) {
			// Ghost note - should be soft
			const max = this.config.ghostVelocityMax ?? 40;
			if (velocity >= max) {
				return {
					pitch: noteNumber,
					playedVelocity: velocity,
					maxVelocity: max,
					isValid: false,
					deviation: velocity - max,
					feedback: `👻 Ghost note too loud! Keep it < ${max}`
				};
			}
			return {
				pitch: noteNumber,
				playedVelocity: velocity,
				maxVelocity: max,
				isValid: true,
				deviation: 0,
				feedback: '👻 Ghost note ✓'
			};
		} else {
			// Accent - should be loud
			const min = this.config.accentVelocityMin ?? 80;
			if (velocity < min) {
				return {
					pitch: noteNumber,
					playedVelocity: velocity,
					minVelocity: min,
					isValid: false,
					deviation: min - velocity,
					feedback: `💥 Accent too soft! Make it > ${min}`
				};
			}
			return {
				pitch: noteNumber,
				playedVelocity: velocity,
				minVelocity: min,
				isValid: true,
				deviation: 0,
				feedback: '💥 Accent ✓'
			};
		}
	}

	/**
	 * Get statistics from validation history
	 */
	getStats(): {
		total: number;
		valid: number;
		invalid: number;
		accuracy: number;
		avgDeviation: number;
	} {
		const total = this.validationHistory.length;
		if (total === 0) {
			return { total: 0, valid: 0, invalid: 0, accuracy: 0, avgDeviation: 0 };
		}

		const valid = this.validationHistory.filter((r) => r.isValid).length;
		const invalid = total - valid;
		const accuracy = Math.round((valid / total) * 100);
		const avgDeviation = Math.round(
			this.validationHistory.reduce((sum, r) => sum + r.deviation, 0) / total
		);

		return { total, valid, invalid, accuracy, avgDeviation };
	}

	/**
	 * Reset validation state
	 */
	reset(): void {
		this.beatPosition = 0;
		this.validationHistory = [];
	}

	/**
	 * Update configuration dynamically
	 */
	updateConfig(config: Partial<VelocityValidatorConfig>): void {
		this.config = { ...this.config, ...config };
	}

	/**
	 * Create validator from SongExercise settings
	 */
	static fromExerciseSettings(settings: SongExercise['settings']): VelocityValidator {
		const mode = settings.enableVelocityCheck ? (settings.velocityMode ?? 'hand-based') : 'off';

		return new VelocityValidator({
			mode,
			lhVelocityMax: settings.lhVelocityMax,
			rhVelocityMin: settings.rhVelocityMin,
			globalMin: settings.globalVelocityMin,
			globalMax: settings.globalVelocityMax
		});
	}

	/**
	 * Build per-note constraints from a VelocityMap
	 */
	static buildConstraintsFromMap(
		velocityMap: VelocityMap
	): Map<number, { min?: number; max?: number; hint?: string }> {
		return velocityMap.notes;
	}
}

export const velocityValidator = new VelocityValidator();
