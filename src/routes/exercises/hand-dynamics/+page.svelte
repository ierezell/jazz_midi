<svelte:options runes={true} />

<script lang="ts">
	import type { MidiNote, Note, NoteEvent, NoteFullName, ScoreProps } from '$lib/types/types';
	import type { ValidationResult } from '$lib/types/exercise-api';
	import BaseExercise from '../../../components/BaseExercise.svelte';
	import {
		validateHandDynamics,
		isHandDynamicsCompleted,
		getDynamicsFeedback,
		getAverageVelocities,
		createHandDynamicsState,
		type HandDynamicsState
	} from '$lib/handDynamicsValidation';
	import { MidiToNote } from '$lib/types/notes.constants';

	const LH_TARGET = { min: 30, max: 50 };
	const RH_TARGET = { min: 80, max: 110 };
	const LH_SHELLS: MidiNote[] = [36, 46, 48, 58] as MidiNote[];
	const RH_SCALE: MidiNote[] = [60, 62, 64, 65, 67, 69, 71, 72] as MidiNote[];

	let state: HandDynamicsState = $state(createHandDynamicsState());

	function resetState() { state = createHandDynamicsState(); }

	function generateExpectedNotes(): MidiNote[] {
		return [...LH_SHELLS, ...RH_SCALE];
	}

	function generateScoreProps(): ScoreProps {
		return {
			selectedNote: 'C' as Note,
			leftHand: [LH_SHELLS.map((n) => MidiToNote[n] as NoteFullName)],
			rightHand: [RH_SCALE.map((n) => MidiToNote[n] as NoteFullName)]
		};
	}

	function validateNoteEvent(_selectedNote: Note, event: NoteEvent): ValidationResult {
		const result = validateHandDynamics(event, {
			lhTargetMin: LH_TARGET.min, lhTargetMax: LH_TARGET.max,
			rhTargetMin: RH_TARGET.min, rhTargetMax: RH_TARGET.max,
			tolerance: 5, lhNotes: LH_SHELLS, rhNotes: RH_SCALE
		}, state);
		
		if (result.isCorrect) {
			return {
				isCorrect: true, message: result.message,
				collected: true, resetCollected: false
			};
		} else {
			return {
				isCorrect: false, message: result.message,
				collected: false, resetCollected: false
			};
		}
	}

	function isCompleted(): boolean {
		return isHandDynamicsCompleted(state, 8);
	}

	let averages = $derived(getAverageVelocities(state));
	let feedback = $derived(getDynamicsFeedback(state));
	let lhAcc = $derived(state.lhNotesPlayed > 0 ? Math.round((state.lhCorrectDynamics / state.lhNotesPlayed) * 100) : 0);
	let rhAcc = $derived(state.rhNotesPlayed > 0 ? Math.round((state.rhCorrectDynamics / state.rhNotesPlayed) * 100) : 0);
</script>

<BaseExercise
	randomMode={false}
	generateExpectedNotes={() => generateExpectedNotes()}
	generateScoreProps={() => generateScoreProps()}
	{validateNoteEvent}
	{isCompleted}
	onReset={resetState}
	onComplete={() => {}}
	description="Master jazz dynamics: LH soft (piano), RH strong (forte). Practice shell voicings with LH and melody with RH."
	initialNote="C"
	exerciseType="hand_independence"
	showTempoControl={true}
	prompt={feedback}
>
	{#snippet children(_api)}
		<div class="hand-dynamics-content">
			<div class="meters card-premium">
				<h3>🔊 Hand Loudness Meters</h3>
				
				<div class="meter-row">
					<span class="hand-label">👈 LH (Comping)</span>
					<div class="meter-bar">
						<div class="zone soft"></div>
						<div class="zone target"></div>
						<div class="zone loud"></div>
						<div class="indicator" style="left: {(averages.lh / 127) * 100}%"></div>
					</div>
					<span class="value">{averages.lh}</span>
					<span class="accuracy" class:good={lhAcc >= 70}>{lhAcc}%</span>
				</div>

				<div class="meter-row">
					<span class="hand-label">👉 RH (Melody)</span>
					<div class="meter-bar">
						<div class="zone soft"></div>
						<div class="zone target"></div>
						<div class="zone loud"></div>
						<div class="indicator rh" style="left: {(averages.rh / 127) * 100}%"></div>
					</div>
					<span class="value">{averages.rh}</span>
					<span class="accuracy" class:good={rhAcc >= 70}>{rhAcc}%</span>
				</div>
			</div>

			<div class="stats-grid">
				<div class="stat-card">
					<span class="stat-label">LH Notes</span>
					<span class="stat-value">{state.lhNotesPlayed}</span>
				</div>
				<div class="stat-card">
					<span class="stat-label">RH Notes</span>
					<span class="stat-value">{state.rhNotesPlayed}</span>
				</div>
				<div class="stat-card">
					<span class="stat-label">LH Too Loud</span>
					<span class="stat-value warn">{state.lhTooLoudCount}</span>
				</div>
				<div class="stat-card">
					<span class="stat-label">Balance Score</span>
					<span class="stat-value" class:good={state.balanceScore >= 70}>{state.balanceScore}</span>
				</div>
			</div>
		</div>
	{/snippet}
</BaseExercise>

<style>
	.hand-dynamics-content { display: flex; flex-direction: column; gap: 1.5rem; }
	.meters { padding: 1.5rem; }
	.meters h3 { margin: 0 0 1rem 0; color: var(--color-text); }
	.meter-row { display: grid; grid-template-columns: 120px 1fr 50px 50px; align-items: center; gap: 1rem; margin-bottom: 1rem; }
	.hand-label { font-weight: 600; color: var(--color-text); }
	.meter-bar { position: relative; height: 30px; background: var(--color-surface-raised); border-radius: 4px; overflow: hidden; }
	.zone { position: absolute; height: 100%; }
	.zone.soft { left: 0; width: 23%; background: rgba(96, 165, 250, 0.3); }
	.zone.target { left: 23%; width: 20%; background: rgba(34, 197, 94, 0.3); }
	.zone.loud { left: 40%; width: 60%; background: rgba(248, 113, 113, 0.3); }
	.indicator { position: absolute; top: 0; width: 4px; height: 100%; background: var(--color-primary); transition: left 0.2s; }
	.indicator.rh { background: var(--color-secondary); }
	.value { font-weight: 700; color: var(--color-text); text-align: center; }
	.accuracy { font-weight: 700; color: var(--color-error); text-align: center; }
	.accuracy.good { color: var(--color-success); }
	.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
	.stat-card { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1rem; background: var(--color-surface-raised); border-radius: 8px; border: 1px solid var(--color-border); }
	.stat-label { font-size: 0.85rem; color: var(--color-text-muted); }
	.stat-value { font-size: 1.5rem; font-weight: 700; color: var(--color-text); }
	.stat-value.good { color: var(--color-success); }
	.stat-value.warn { color: var(--color-warn); }
</style>
