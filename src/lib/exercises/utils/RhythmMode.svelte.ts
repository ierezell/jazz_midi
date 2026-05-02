import { BeatValidator, type BeatValidationResult } from './BeatValidator.js';
import type { NoteEvent, RhythmPattern } from '../../types/types.js';

/**
 * Reusable rhythm-mode state for exercise pages.
 * Wraps BeatValidator with reactive Svelte 5 state so any exercise
 * can opt-in to rhythmic validation without duplicating boilerplate.
 *
 * Usage:
 *   const rhythm = new RhythmMode(rhythmPatterns);
 *   // in template: bind:checked={rhythm.active} onchange={() => rhythm.toggle()}
 *   // in validator: const hit = rhythm.validateHit(event); if (hit && !hit.isHit) ...
 */
export class RhythmMode {
	#active = $state(false);
	#validator = $state<BeatValidator | null>(null);
	#currentBeat = $state(0);
	#selectedPatternId = $state('');
	#patterns: RhythmPattern[];

	constructor(patterns: RhythmPattern[]) {
		this.#patterns = patterns;
		if (patterns.length > 0) this.#selectedPatternId = patterns[0].id;
	}

	get active(): boolean {
		return this.#active;
	}

	get currentBeat(): number {
		return this.#currentBeat;
	}

	get patterns(): RhythmPattern[] {
		return this.#patterns;
	}

	get selectedPatternId(): string {
		return this.#selectedPatternId;
	}

	set selectedPatternId(id: string) {
		this.#selectedPatternId = id;
	}

	get selectedPattern(): RhythmPattern {
		return this.#patterns.find((p) => p.id === this.#selectedPatternId) ?? this.#patterns[0];
	}

	toggle(): void {
		this.#active = !this.#active;
		if (this.#active) {
			this.#validator = new BeatValidator();
			this.#validator.start(this.selectedPattern.suggestedBpm, this.selectedPattern, (beat) => {
				this.#currentBeat = beat;
			});
		} else {
			this.stop();
		}
	}

	/** Returns the beat validation result if rhythm mode is active, otherwise null. */
	validateHit(event: NoteEvent): BeatValidationResult | null {
		if (!this.#active || !this.#validator) return null;
		return this.#validator.validateHit(event);
	}

	stop(): void {
		this.#validator?.stop();
		this.#validator = null;
		this.#active = false;
		this.#currentBeat = 0;
	}
}
