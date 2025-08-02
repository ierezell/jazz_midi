<!-- 
    Refactored Chord Exercise
    Uses the new base components and controllers for cleaner, more maintainable code
-->
<svelte:options runes={true} />

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import BaseExercise from '../../components/BaseExercise.svelte';
	import { BaseChordExerciseController } from '../../lib/controllers/BaseExerciseController';
	import type { ChordExerciseState } from '../../lib/types';
	import { ChordUtils } from '../../lib/utils/musicalUtils';
	import {
		AllChordTypes,
		type ChordType,
		type MidiNote,
		type Note,
		type NoteEvent,
		type NoteFullName
	} from '../../midi/midi';

	// Chord-specific exercise controller
	class ChordExerciseController extends BaseChordExerciseController {
		private chordType: ChordType = 'maj7';
		private inversion: 0 | 1 | 2 | 3 = 0;
		private voicingMode: 'full' | 'left-hand' | 'right-hand' | 'split' = 'full';

		setChordType(type: ChordType): void {
			this.chordType = type;
			this.reset();
		}

		setInversion(inv: 0 | 1 | 2 | 3): void {
			this.inversion = inv;
			this.reset();
		}

		setVoicingMode(mode: 'full' | 'left-hand' | 'right-hand' | 'split'): void {
			this.voicingMode = mode;
			this.reset();
		}

		getChordNotes(): MidiNote[] {
			const chord = ChordUtils.generateChord(this.state.selectedNote, this.chordType, {
				inversion: this.inversion
			});

			return this.getVoicingNotes(chord);
		}

		private getVoicingNotes(chord: any): MidiNote[] {
			const allNotes = ChordUtils.getChordNotes(chord);

			switch (this.voicingMode) {
				case 'full':
					return allNotes;
				case 'left-hand':
					return [chord.root, chord.seventh].filter((n) => n != null);
				case 'right-hand':
					return [chord.third, chord.fifth].filter((n) => n != null);
				case 'split':
					const leftHand = [chord.root - 12, (chord.seventh || chord.root) - 12].filter(
						(n) => n >= 24
					);
					const rightHand = [chord.third, chord.fifth].filter((n) => n != null);
					return [...leftHand, ...rightHand];
				default:
					return allNotes;
			}
		}

		getExpectedNotes(): MidiNote[] {
			return this.getChordNotes();
		}

		processNoteInput(note: NoteEvent): void {
			// Check if we have all the notes for this chord
			const expectedNotes = this.getExpectedNotes();
			const currentNotes = this.state.midiNotes;

			if (this.validateChord(currentNotes)) {
				const result = this.createResult(true, expectedNotes, currentNotes);
				this.setFeedback('Perfect! Correct chord! 🎵✨', true);
				this.reset();
			} else if (currentNotes.length >= expectedNotes.length) {
				// Too many notes or wrong notes
				this.setFeedback('Not quite right. Try again! 🎹', false);
			}
		}

		getState(): ChordExerciseState {
			return {
				...super.getState(),
				selectedChordType: this.chordType,
				selectedInversion: this.inversion,
				voicingMode: this.voicingMode
			};
		}
	}

	// Initialize controller
	let controller = new ChordExerciseController();
	let exerciseState = $state(controller.getState());

	// Update state when controller changes
	$effect(() => {
		exerciseState = controller.getState();
	});

	// Get current chord information
	let currentChord = $derived(() => {
		return ChordUtils.generateChord(exerciseState.selectedNote, exerciseState.selectedChordType, {
			inversion: exerciseState.selectedInversion
		});
	});

	let expectedNotes = $derived(controller.getExpectedNotes());
	let chordSymbol = $derived(() =>
		ChordUtils.getChordSymbol(exerciseState.selectedNote, exerciseState.selectedChordType)
	);

	// Score configuration for chord display
	let scoreProps = $derived(() => {
		const chord = currentChord();
		const notes = controller.getExpectedNotes();

		// Convert to note names for score display
		const noteNames = notes.map((note) => {
			const noteName = note.toString(); // This would need proper conversion
			return (noteName + '4') as NoteFullName; // Simplified
		});

		if (exerciseState.voicingMode === 'split') {
			return {
				leftHandNotes: [noteNames.slice(0, 2)],
				rightHandNotes: [noteNames.slice(2)],
				title: `${chordSymbol} - Split Voicing`
			};
		} else {
			return {
				rightHandNotes: [noteNames],
				title: `${chordSymbol} - ${exerciseState.voicingMode} voicing`
			};
		}
	});

	// Event handlers
	function handleNoteSelect(note: Note): void {
		controller.setSelectedNote(note);
		exerciseState = controller.getState();
	}

	function handleDebugToggle(): void {
		controller.toggleDebugMode();
		exerciseState = controller.getState();
	}

	function handleReset(): void {
		controller.reset();
		exerciseState = controller.getState();
	}

	function handleChordTypeChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		controller.setChordType(target.value as ChordType);
		exerciseState = controller.getState();
	}

	function handleInversionChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		controller.setInversion(parseInt(target.value) as 0 | 1 | 2 | 3);
		exerciseState = controller.getState();
	}

	function handleVoicingChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		controller.setVoicingMode(target.value as 'full' | 'left-hand' | 'right-hand' | 'split');
		exerciseState = controller.getState();
	}

	// Lifecycle
	onMount(async () => {
		await controller.initialize();
		exerciseState = controller.getState();
	});

	onDestroy(() => {
		controller.cleanup();
	});
</script>

<BaseExercise
	{exerciseState}
	exerciseTitle="Jazz Chord Practice"
	exerciseDescription="Practice playing jazz chords with different voicings and inversions"
	{expectedNotes}
	{scoreProps}
	onNoteSelect={handleNoteSelect}
	onDebugToggle={handleDebugToggle}
	onReset={handleReset}
	customControls={true}
>
	<!-- Custom chord-specific controls -->
	<div class="chord-controls">
		<div class="control-group">
			<label for="chord-type">Chord Type:</label>
			<select
				id="chord-type"
				value={exerciseState.selectedChordType}
				onchange={handleChordTypeChange}
			>
				{#each AllChordTypes as chordType}
					<option value={chordType}>{chordType}</option>
				{/each}
			</select>
		</div>

		<div class="control-group">
			<label for="inversion">Inversion:</label>
			<select
				id="inversion"
				value={exerciseState.selectedInversion.toString()}
				onchange={handleInversionChange}
			>
				<option value="0">Root Position</option>
				<option value="1">1st Inversion</option>
				<option value="2">2nd Inversion</option>
				<option value="3">3rd Inversion</option>
			</select>
		</div>

		<div class="control-group">
			<label for="voicing">Voicing:</label>
			<select id="voicing" value={exerciseState.voicingMode} onchange={handleVoicingChange}>
				<option value="full">Full Chord</option>
				<option value="left-hand">Left Hand (1-7)</option>
				<option value="right-hand">Right Hand (3-5)</option>
				<option value="split">Split Hands</option>
			</select>
		</div>

		<div class="control-group">
			<button onclick={handleDebugToggle} class="debug-btn">
				{exerciseState.debugMode ? 'Disable' : 'Enable'} Virtual Keyboard
			</button>
			<button onclick={handleReset} class="reset-btn"> New Chord </button>
		</div>
	</div>

	<!-- Chord information display -->
	<div class="chord-info">
		<h3>Current Challenge: {chordSymbol}</h3>
		<div class="chord-details">
			<span
				>Inversion: {exerciseState.selectedInversion === 0
					? 'Root Position'
					: `${exerciseState.selectedInversion}${
							exerciseState.selectedInversion === 1
								? 'st'
								: exerciseState.selectedInversion === 2
									? 'nd'
									: 'rd'
						} Inversion`}</span
			>
			<span>Voicing: {exerciseState.voicingMode}</span>
			<span>Notes needed: {expectedNotes.length}</span>
		</div>
	</div>

	<!-- Practice tips -->
	{#if exerciseState.errorCount >= 2}
		<div class="practice-tips">
			<h4>💡 Practice Tips:</h4>
			<ul>
				<li>Start with root position chords before trying inversions</li>
				<li>Practice chord progressions to develop muscle memory</li>
				<li>Listen to the harmonic quality of each chord type</li>
				{#if exerciseState.voicingMode === 'split'}
					<li>
						Split voicings are common in jazz piano - left hand plays 1-7, right hand plays 3-5
					</li>
				{/if}
			</ul>
		</div>
	{/if}
</BaseExercise>

<style>
	.chord-controls {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
		align-items: center;
		padding: 1rem;
		background: var(--color-bg-secondary, #f8f9fa);
		border-radius: 8px;
		margin-bottom: 1rem;
	}

	.control-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.control-group label {
		font-weight: 500;
		color: var(--color-text, #333);
		white-space: nowrap;
	}

	select {
		padding: 0.5rem;
		border: 1px solid var(--color-border, #ccc);
		border-radius: 4px;
		background: white;
		font-size: 1rem;
		min-width: 120px;
	}

	button {
		padding: 0.5rem 1rem;
		border: 1px solid var(--color-border, #ccc);
		border-radius: 4px;
		background: var(--color-bg, white);
		color: var(--color-text, #333);
		cursor: pointer;
		font-size: 1rem;
		transition: all 0.2s ease;
	}

	button:hover {
		background: var(--color-bg-hover, #f0f0f0);
		border-color: var(--color-border-hover, #999);
	}

	.debug-btn {
		background: var(--color-debug, #e3f2fd);
		border-color: var(--color-debug-border, #2196f3);
	}

	.reset-btn {
		background: var(--color-success, #e8f5e8);
		border-color: var(--color-success-border, #4caf50);
	}

	.chord-info {
		text-align: center;
		padding: 1rem;
		background: var(--color-bg, white);
		border: 1px solid var(--color-border, #e1e5e9);
		border-radius: 8px;
		margin-bottom: 1rem;
	}

	.chord-info h3 {
		margin: 0 0 0.5rem 0;
		color: var(--color-accent, #2196f3);
		font-size: 1.5rem;
	}

	.chord-details {
		display: flex;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
		font-size: 0.9rem;
		color: var(--color-text-secondary, #666);
	}

	.practice-tips {
		background: var(--color-info-bg, #e3f2fd);
		border: 1px solid var(--color-info-border, #2196f3);
		border-radius: 8px;
		padding: 1rem;
		margin-top: 1rem;
	}

	.practice-tips h4 {
		margin: 0 0 0.5rem 0;
		color: var(--color-info, #1976d2);
	}

	.practice-tips ul {
		margin: 0;
		padding-left: 1.5rem;
	}

	.practice-tips li {
		margin-bottom: 0.25rem;
		color: var(--color-text-secondary, #666);
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.chord-controls {
			flex-direction: column;
			gap: 0.5rem;
		}

		.control-group {
			width: 100%;
			justify-content: space-between;
		}

		select {
			min-width: 100px;
		}

		.chord-details {
			flex-direction: column;
			gap: 0.25rem;
		}
	}
</style>
