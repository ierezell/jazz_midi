import type { NoteEvent } from '../../types/types';

export interface LegatoNote {
	noteNumber: number;
	onTime: number;
	offTime: number | null;
	velocity: number;
}

export interface LegatoAnalysis {
	totalNotes: number;
	legatoNotes: number;
	staccatoNotes: number;
	overlapPercentage: number;
	avgOverlapMs: number;
	legatoScore: number; // 0-100
}

export class LegatoCheck {
	private activeNotes: Map<number, LegatoNote> = new Map();
	private completedNotes: LegatoNote[] = [];
	private maxHistory = 50;

	onNoteOn(event: NoteEvent): void {
		const note: LegatoNote = {
			noteNumber: event.noteNumber,
			onTime: event.timestamp,
			offTime: null,
			velocity: event.velocity
		};

		this.activeNotes.set(event.noteNumber, note);
	}

	onNoteOff(event: NoteEvent): void {
		const note = this.activeNotes.get(event.noteNumber);
		if (note) {
			note.offTime = event.timestamp;
			this.completedNotes.push(note);
			this.activeNotes.delete(event.noteNumber);

			// Keep history bounded
			if (this.completedNotes.length > this.maxHistory) {
				this.completedNotes.shift();
			}
		}
	}

	getAnalysis(): LegatoAnalysis {
		if (this.completedNotes.length < 2) {
			return {
				totalNotes: 0,
				legatoNotes: 0,
				staccatoNotes: 0,
				overlapPercentage: 0,
				avgOverlapMs: 0,
				legatoScore: 0
			};
		}

		let legatoCount = 0;
		let staccatoCount = 0;
		let totalOverlap = 0;
		let overlapCount = 0;

		// Sort by on time
		const sorted = [...this.completedNotes].sort((a, b) => a.onTime - b.onTime);

		for (let i = 0; i < sorted.length; i++) {
			const note = sorted[i];
			if (!note.offTime) continue;

			// Check overlap with next note (for sequence legato)
			if (i < sorted.length - 1) {
				const nextNote = sorted[i + 1];

				// Legato: next note starts before current note ends
				if (nextNote.onTime < note.offTime) {
					legatoCount++;
					const overlap = note.offTime - nextNote.onTime;
					totalOverlap += overlap;
					overlapCount++;
				} else {
					staccatoCount++;
				}
			}
		}

		const totalAnalyzed = legatoCount + staccatoCount;
		const overlapPercentage =
			totalAnalyzed > 0 ? Math.round((legatoCount / totalAnalyzed) * 100) : 0;

		const avgOverlap = overlapCount > 0 ? Math.round(totalOverlap / overlapCount) : 0;

		// Legato score based on overlap percentage and amount
		// Ideal overlap for jazz legato is 20-100ms
		let score = overlapPercentage;
		if (avgOverlap > 0 && avgOverlap < 20) {
			// Too little overlap - penalize slightly
			score = Math.round(score * 0.8);
		} else if (avgOverlap > 200) {
			// Too much overlap - penalize
			score = Math.round(score * 0.7);
		}

		return {
			totalNotes: this.completedNotes.length,
			legatoNotes: legatoCount,
			staccatoNotes: staccatoCount,
			overlapPercentage,
			avgOverlapMs: avgOverlap,
			legatoScore: Math.min(100, score)
		};
	}

	isLegato(): boolean {
		const analysis = this.getAnalysis();
		return analysis.legatoScore >= 70;
	}

	getFeedback(): string {
		const analysis = this.getAnalysis();

		if (analysis.totalNotes < 2) {
			return 'Play more notes to analyze legato...';
		}

		if (analysis.legatoScore >= 80) {
			return `Excellent legato! ${analysis.overlapPercentage}% overlap, avg ${analysis.avgOverlapMs}ms`;
		} else if (analysis.legatoScore >= 60) {
			return `Good legato. Try more overlap (${analysis.avgOverlapMs}ms → 50-100ms)`;
		} else if (analysis.legatoScore >= 40) {
			return `Staccato-heavy. Hold notes longer for connected sound`;
		} else {
			return `Very staccato. Focus on overlapping notes for jazz legato`;
		}
	}

	reset(): void {
		this.activeNotes.clear();
		this.completedNotes = [];
	}

	// Get real-time legato status for current playing
	getRealTimeStatus(): { isLegato: boolean; activeNoteCount: number } {
		return {
			isLegato: this.isLegato(),
			activeNoteCount: this.activeNotes.size
		};
	}
}

export const legatoCheck = new LegatoCheck();
