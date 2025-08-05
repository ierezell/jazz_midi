<!--
    Improved Chord Exercise
    Clean, consolidated implementation using modern patterns
-->
<svelte:options runes={true} />

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import BaseExercise from '../../components/BaseExercise.svelte';
	import ChordToneToggle from '../../components/ChordToneToggle.svelte';
	import { audioManager } from '../../lib/managers/AudioManager';
	import { midiManager } from '../../lib/managers/MIDIManager';
	import type { ChordType, MidiNote, Note, NoteEvent, NoteFullName } from '../../lib/types';
	import { createChordToneMapping } from '../../lib/types';
	import { AllChordTypes, AllNotes, chords, NoteToMidi, type Chord } from '../../midi/midi';

	// ===== STATE =====

	let selectedNote: Note = $state('C');
	let chordType: ChordType = $state('maj7');
	let inversion: 0 | 1 | 2 | 3 = $state(0);
	let voicing: 'full' | 'left-hand' | 'right-hand' | 'split' = $state('full');

	let noteEvents: NoteEvent[] = $state([]);
	let currentNotes = $derived(noteEvents.map((e) => e.noteNumber));
	let mistakes = $state(0);
	let startTime = $state(0);
	let completed = $state(false);
	let debugMode = $state(false);
	let feedbackMessage = $state('');
	let showChordTones = $state(false);

	// Auto-enable helpers based on mistakes
	let showNoteNames = $derived(mistakes >= 3);
	let showKeyboard = $derived(mistakes >= 6);

	// ===== COMPUTED PROPERTIES =====

	/**
	 * Get the current chord
	 */
	let currentChord = $derived.by((): Chord => {
		const rootNote = (selectedNote + '4') as NoteFullName;
		const rootMidi = NoteToMidi[rootNote];
		return chords(rootMidi, chordType, inversion);
	});

	/**
	 * Get expected notes based on voicing
	 */
	let expectedNotes = $derived.by((): MidiNote[] => {
		const allChordNotes = [
			currentChord.root,
			currentChord.third,
			currentChord.fifth,
			currentChord.seventh
		].filter((note) => note !== undefined) as MidiNote[];

		switch (voicing) {
			case 'full':
				return allChordNotes;
			case 'left-hand':
				return [currentChord.root, currentChord.seventh].filter(
					(note) => note !== undefined
				) as MidiNote[];
			case 'right-hand':
				return [currentChord.third, currentChord.fifth];
			case 'split':
				const leftHand = [
					currentChord.root - 12,
					(currentChord.seventh || currentChord.root) - 12
				].filter((note) => note >= 24) as MidiNote[];
				const rightHand = [currentChord.third, currentChord.fifth];
				return [...leftHand, ...rightHand];
			default:
				return allChordNotes;
		}
	});

	/**
	 * Calculate optimal keyboard range
	 */
	let keyboardRange = $derived.by(() => {
		if (expectedNotes.length === 0) return { middleC: 60, octaves: 2 };

		const minNote = Math.min(...expectedNotes);
		const maxNote = Math.max(...expectedNotes);
		const minC = Math.floor((minNote - 12) / 12) * 12 + 12;
		const maxC = Math.ceil((maxNote + 12) / 12) * 12;
		const totalRange = maxC - minC;
		const octaves = Math.max(2, Math.ceil(totalRange / 12));
		const middleC = minC + Math.floor((octaves * 12) / 2) - 6;

		return {
			middleC: Math.max(24, middleC),
			octaves: Math.min(7, octaves)
		};
	});

	/**
	 * Check if exercise is completed
	 */
	let isCompleted = $derived.by(() => {
		if (expectedNotes.length === 0) return false;
		const sorted1 = [...currentNotes].sort();
		const sorted2 = [...expectedNotes].sort();
		return sorted1.length === sorted2.length && sorted1.every((note, i) => note === sorted2[i]);
	});

	/**
	 * Get chord display info
	 */
	let chordInfo = $derived.by(() => {
		const symbols: Record<ChordType, string> = {
			major: '',
			minor: 'm',
			maj7: 'maj7',
			min7: 'm7',
			'7': '7',
			dom7: '7',
			diminished: '°',
			dim7: '°7',
			'half-dim7': 'ø',
			augmented: '+',
			sus2: 'sus2',
			sus4: 'sus4'
		};

		return {
			name: `${selectedNote} ${chordType}`,
			symbol: selectedNote + symbols[chordType],
			voicing: voicing,
			inversion: inversion
		};
	});

	/**
	 * Create chord tone mapping for the keyboard
	 */
	let chordToneMapping = $derived.by(() => {
		const { middleC, octaves } = keyboardRange;
		const startNote = middleC - Math.floor(octaves / 2) * 12;
		const endNote = startNote + octaves * 12;

		return createChordToneMapping(startNote as MidiNote, endNote as MidiNote, {
			root: currentChord.root,
			third: currentChord.third,
			fifth: currentChord.fifth,
			seventh: currentChord.seventh
		});
	});

	// ===== EVENT HANDLERS =====

	function handleNoteOn(note: NoteEvent): void {
		noteEvents = [...noteEvents, note];

		if (expectedNotes.includes(note.noteNumber)) {
			showFeedback('Correct!', 'success');
			audioManager.playSound?.('success');
		} else {
			mistakes++;
			showFeedback('Try again!', 'error');
			audioManager.playSound?.('error');
		}

		if (isCompleted) {
			completeExercise();
		}
	}

	function handleNoteOff(note: NoteEvent): void {
		noteEvents = noteEvents.filter((e) => e.noteNumber !== note.noteNumber);
	}

	function showFeedback(message: string, type: 'success' | 'error' | 'info'): void {
		feedbackMessage = message;
		setTimeout(() => {
			feedbackMessage = '';
		}, 2000);
	}

	function completeExercise(): void {
		completed = true;
		const timeElapsed = Date.now() - startTime;
		const accuracy = Math.round(((expectedNotes.length - mistakes) / expectedNotes.length) * 100);

		showFeedback('Exercise completed!', 'success');
		audioManager.playSound?.('success');
	}

	function resetExercise(): void {
		noteEvents = [];
		mistakes = 0;
		completed = false;
		feedbackMessage = '';
		startTime = Date.now();
	}

	function handleNoteSelect(note: Note): void {
		selectedNote = note;
		resetExercise();
	}

	function handleChordTypeChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		chordType = target.value as ChordType;
		resetExercise();
	}

	function handleInversionChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		inversion = parseInt(target.value) as 0 | 1 | 2 | 3;
		resetExercise();
	}

	function handleVoicingChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		voicing = target.value as typeof voicing;
		resetExercise();
	}

	function handleChordToneToggle(show: boolean): void {
		showChordTones = show;
	}

	function toggleDebug(): void {
		debugMode = !debugMode;
	}

	// ===== LIFECYCLE =====

	onMount(async () => {
		await midiManager.initialize();
		midiManager.setEventHandlers({
			onNoteOn: handleNoteOn,
			onNoteOff: handleNoteOff
		});

		startTime = Date.now();
	});

	onDestroy(() => {
		midiManager.cleanup();
	});

	// Create exercise state for BaseExercise component
	let exerciseState = $derived({
		noteEvents,
		midiNotes: currentNotes,
		selectedNote,
		debugMode,
		errorCount: mistakes,
		showNoteNames,
		showKeyboard,
		feedbackMessage,
		completed: false
	});

	let scoreProps = $derived({
		title: chordInfo.symbol,
		showClefs: true
	});
</script>

<!-- ===== TEMPLATE ===== -->

<div class="chord-exercise">
	<!-- Header -->
	<header class="exercise-header">
		<h1>Jazz Chord Practice</h1>
		<p class="description">Practice playing jazz chords with different voicings and inversions</p>
	</header>

	<!-- Feedback -->
	{#if feedbackMessage}
		<div class="feedback" role="alert">
			{feedbackMessage}
		</div>
	{/if}

	<!-- Exercise Info -->
	<div class="chord-info">
		<h2 class="chord-display">{chordInfo.symbol}</h2>
		<div class="chord-details">
			<span>Voicing: {chordInfo.voicing}</span>
			<span
				>Inversion: {chordInfo.inversion === 0
					? 'Root'
					: chordInfo.inversion === 1
						? '1st'
						: chordInfo.inversion === 2
							? '2nd'
							: '3rd'}</span
			>
		</div>
	</div>

	<!-- Controls -->
	<div class="controls">
		<div class="control-group">
			<label for="note-select">Key:</label>
			<select
				id="note-select"
				value={selectedNote}
				onchange={(e) => handleNoteSelect((e.target as HTMLSelectElement).value as Note)}
			>
				{#each AllNotes as note}
					<option value={note}>{note}</option>
				{/each}
			</select>
		</div>

		<div class="control-group">
			<label for="chord-type">Chord Type:</label>
			<select id="chord-type" value={chordType} onchange={handleChordTypeChange}>
				{#each AllChordTypes as type}
					<option value={type}>{type}</option>
				{/each}
			</select>
		</div>

		<div class="control-group">
			<label for="inversion">Inversion:</label>
			<select id="inversion" value={inversion} onchange={handleInversionChange}>
				<option value={0}>Root</option>
				<option value={1}>1st</option>
				<option value={2}>2nd</option>
				<option value={3}>3rd</option>
			</select>
		</div>

		<div class="control-group">
			<label for="voicing">Voicing:</label>
			<select id="voicing" value={voicing} onchange={handleVoicingChange}>
				<option value="full">Full</option>
				<option value="left-hand">Left Hand</option>
				<option value="right-hand">Right Hand</option>
				<option value="split">Split</option>
			</select>
		</div>

		<div class="control-group">
			<button onclick={resetExercise}>Reset</button>
			<button onclick={toggleDebug}>
				{debugMode ? 'Hide' : 'Show'} Debug
			</button>
		</div>

		<div class="control-group chord-tone-controls">
			<ChordToneToggle {showChordTones} onToggle={handleChordToneToggle} />
		</div>
	</div>

	<!-- Main Exercise using BaseExercise component -->
	<BaseExercise
		{exerciseState}
		exerciseTitle="Current Chord"
		{expectedNotes}
		{scoreProps}
		keyboardProps={{
			midiNotes: currentNotes,
			middleC: keyboardRange.middleC,
			octaves: keyboardRange.octaves,
			interactive: debugMode,
			showLabels: showNoteNames,
			chordToneInfo: chordToneMapping,
			showChordTones: showChordTones
		}}
		onDebugToggle={toggleDebug}
		onReset={resetExercise}
		customControls={true}
	>
		<!-- Custom status display -->
		<div class="exercise-status">
			<div class="progress">
				Progress: {Math.round(
					(currentNotes.filter((n) => expectedNotes.includes(n)).length / expectedNotes.length) *
						100
				)}%
			</div>
			<div class="mistakes">
				Mistakes: {mistakes}
			</div>
			{#if completed}
				<div class="completion">🎉 Exercise Completed!</div>
			{/if}
		</div>
	</BaseExercise>
</div>

<style>
	.chord-exercise {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		font-family: system-ui, sans-serif;
	}

	.exercise-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.exercise-header h1 {
		color: #2c3e50;
		margin-bottom: 0.5rem;
	}

	.description {
		color: #7f8c8d;
		font-size: 1.1rem;
	}

	.feedback {
		padding: 1rem;
		margin: 1rem 0;
		border-radius: 0.5rem;
		text-align: center;
		font-weight: 500;
		background-color: #e8f5e8;
		color: #2d5d2d;
		border: 1px solid #a8d8a8;
	}

	.chord-info {
		text-align: center;
		margin: 2rem 0;
	}

	.chord-display {
		font-size: 3rem;
		font-weight: bold;
		color: #3498db;
		margin-bottom: 0.5rem;
	}

	.chord-details {
		display: flex;
		justify-content: center;
		gap: 2rem;
		color: #7f8c8d;
		font-size: 1.1rem;
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
		margin: 2rem 0;
		padding: 1rem;
		background-color: #f8f9fa;
		border-radius: 0.5rem;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: center;
	}

	.control-group label {
		font-weight: 500;
		color: #495057;
	}

	.control-group select,
	.control-group button {
		padding: 0.5rem;
		border: 1px solid #ced4da;
		border-radius: 0.25rem;
		background-color: white;
		min-width: 120px;
	}

	.control-group button {
		background-color: #007bff;
		color: white;
		cursor: pointer;
		border: none;
	}

	.control-group button:hover {
		background-color: #0056b3;
	}

	.chord-tone-controls {
		grid-column: 1 / -1; /* Span across all columns */
		justify-self: center;
	}

	.exercise-status {
		display: flex;
		justify-content: center;
		gap: 2rem;
		margin: 1rem 0;
		padding: 1rem;
		background-color: #f1f3f4;
		border-radius: 0.5rem;
		font-weight: 500;
	}

	.completion {
		color: #28a745;
		font-size: 1.2rem;
	}

	@media (max-width: 768px) {
		.chord-exercise {
			padding: 1rem;
		}

		.chord-details {
			flex-direction: column;
			gap: 0.5rem;
		}

		.controls {
			flex-direction: column;
			align-items: center;
		}

		.control-group {
			width: 100%;
			max-width: 200px;
		}

		.exercise-status {
			flex-direction: column;
			text-align: center;
			gap: 0.5rem;
		}
	}
</style>
