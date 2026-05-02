import type { NoteEvent, RhythmPattern } from '../../types/types.js';

export interface BeatValidationResult {
	isHit: boolean;
	deviationMs: number;
	label: 'Perfect' | 'Good' | 'Early' | 'Late' | 'Miss';
}

const LH_SPLIT_NOTE = 60;
const HIT_WINDOW_MS = 150;
const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD_SEC = 0.1;

interface ScheduledHit {
	beat: number; // float beat position from pattern
	hand: 'LH' | 'RH';
	time: number; // AudioContext time in seconds when this hit is expected
}

export class BeatValidator {
	private audioCtx: AudioContext | null = null;
	private pattern: RhythmPattern | null = null;
	private bpm = 120;
	private currentBeat = 0; // float beat position (e.g. 0.0, 0.5, 1.0...)
	private nextNoteTime = 0;
	private scheduledHits: ScheduledHit[] = [];
	private timerID: ReturnType<typeof setTimeout> | null = null;
	private isRunning = false;
	private deviations: number[] = [];
	private onBeatChange?: (beat: number) => void;

	start(bpm: number, pattern: RhythmPattern, onBeatChange?: (beat: number) => void): void {
		this.stop();
		this.bpm = bpm;
		this.pattern = pattern;
		this.currentBeat = 0;
		this.deviations = [];
		this.scheduledHits = [];
		this.onBeatChange = onBeatChange;
		this.audioCtx = new AudioContext();
		this.nextNoteTime = this.audioCtx.currentTime + 0.1;
		this.isRunning = true;
		this.scheduler();
	}

	stop(): void {
		this.isRunning = false;
		if (this.timerID !== null) {
			clearTimeout(this.timerID);
			this.timerID = null;
		}
		if (this.audioCtx) {
			this.audioCtx.close().catch(() => {});
			this.audioCtx = null;
		}
	}

	getCurrentBeat(): number {
		return this.currentBeat;
	}

	getStats(): { avgDeviationMs: number; hitCount: number } {
		const avg =
			this.deviations.length > 0
				? this.deviations.reduce((a, b) => a + b, 0) / this.deviations.length
				: 0;
		return { avgDeviationMs: Math.round(avg), hitCount: this.deviations.length };
	}

	validateHit(event: NoteEvent): BeatValidationResult {
		if (!this.audioCtx || !this.isRunning) {
			return { isHit: false, deviationMs: 0, label: 'Miss' };
		}
		const hand: 'LH' | 'RH' = event.noteNumber < LH_SPLIT_NOTE ? 'LH' : 'RH';
		const nowSec = this.audioCtx.currentTime;
		const windowSec = HIT_WINDOW_MS / 1000;

		// Find the closest scheduled hit for this hand within the window
		let closest: ScheduledHit | null = null;
		let closestDiff = Infinity;
		for (const hit of this.scheduledHits) {
			if (hit.hand !== hand) continue;
			const diff = Math.abs(hit.time - nowSec);
			if (diff < closestDiff && diff <= windowSec) {
				closestDiff = diff;
				closest = hit;
			}
		}

		if (!closest) {
			return { isHit: false, deviationMs: 0, label: 'Miss' };
		}

		const deviationMs = Math.round((nowSec - closest.time) * 1000);
		const absDeviation = Math.abs(deviationMs);
		this.deviations.push(absDeviation);

		// Remove consumed hit to prevent double-counting
		this.scheduledHits = this.scheduledHits.filter((h) => h !== closest);

		let label: BeatValidationResult['label'];
		if (absDeviation <= 30) label = 'Perfect';
		else if (absDeviation <= 70) label = 'Good';
		else if (deviationMs < 0) label = 'Early';
		else label = 'Late';

		return { isHit: true, deviationMs, label };
	}

	private scheduler(): void {
		if (!this.isRunning || !this.audioCtx || !this.pattern) return;

		const secondsPerBeat = 60 / this.bpm;
		const secondsPerSubdivision = secondsPerBeat / 4; // 16th notes
		const patternLengthBeats = this.pattern.measures * 4;

		while (this.nextNoteTime < this.audioCtx.currentTime + SCHEDULE_AHEAD_SEC) {
			// Convert currentBeat (subdivision index) to float beat position
			const beatFloat = (this.currentBeat % (patternLengthBeats * 4)) / 4 + 1;

			// Schedule any pattern hits at this beat position
			for (const hit of this.pattern.hits) {
				const hitBeatNormalized = hit.beat; // e.g. 1.0, 1.5, 2.0
				const diff = Math.abs(hitBeatNormalized - beatFloat);
				if (diff < 0.01) {
					this.scheduledHits.push({
						beat: hitBeatNormalized,
						hand: hit.hand,
						time: this.nextNoteTime
					});
				}
			}

			// Notify beat change on whole beats
			if (this.currentBeat % 4 === 0 && this.onBeatChange) {
				const wholeBeat = Math.floor(beatFloat);
				this.onBeatChange(wholeBeat);
			}

			this.currentBeat++;
			this.nextNoteTime += secondsPerSubdivision;
		}

		// Clean up old hits (more than 500ms in the past)
		const cutoff = this.audioCtx.currentTime - 0.5;
		this.scheduledHits = this.scheduledHits.filter((h) => h.time > cutoff);

		this.timerID = setTimeout(() => this.scheduler(), LOOKAHEAD_MS);
	}
}
