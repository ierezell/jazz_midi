// Example: Complete MIDI Application with Testing
// This file demonstrates how to use all the new improvements

import { chords, getMidiNote, getScale, type MidiNote, type NoteEvent } from './src/midi/midi';
import {
	ChordProgressionBuilder,
	FrequencyCalculator,
	IntervalCalculator,
	safeRequestMidiAccess,
	safeSetupMidiCallback
} from './src/midi/midiUtils';
import { MockMIDIKeyboard } from './src/test/mockMIDI';

// Example 1: Setting up a real MIDI application
export async function setupRealMIDIApplication() {
	// Safely request MIDI access
	const midiAccess = await safeRequestMidiAccess();

	if (!midiAccess) {
		console.log('MIDI not available, using mock keyboard for demo');
		return setupMockMIDIDemo();
	}

	// Set up MIDI callback with error handling
	safeSetupMidiCallback(
		midiAccess,
		(event) => {
			const noteEvent = getMidiNote(event);
			handleNoteEvent(noteEvent);
		},
		(error) => {
			console.error('MIDI Error:', error);
		}
	);

	return midiAccess;
}

// Example 2: Mock MIDI demonstration
export function setupMockMIDIDemo() {
	const mockKeyboard = new MockMIDIKeyboard();

	// Set up event handling
	mockKeyboard.addNoteEventCallback(handleNoteEvent);

	// Demonstrate various features
	demonstrateChords(mockKeyboard);
	demonstrateScales(mockKeyboard);
	demonstrateProgressions(mockKeyboard);

	return mockKeyboard;
}

// Example 3: Note event handler
function handleNoteEvent(noteEvent: NoteEvent) {
	console.log(
		`🎵 ${noteEvent.type.toUpperCase()}: ${noteEvent.noteFullName} (vel: ${noteEvent.velocity})`
	);

	// Calculate frequency for the note
	const frequency = FrequencyCalculator.midiToFrequency(noteEvent.noteNumber);
	console.log(`   Frequency: ${frequency.toFixed(2)} Hz`);

	// If it's a note on event, show some music theory info
	if (noteEvent.type === 'on') {
		showMusicTheoryInfo(noteEvent.noteNumber);
	}
}

// Example 4: Music theory information
function showMusicTheoryInfo(midiNote: MidiNote) {
	// Show intervals from C
	const cNote = 60 as MidiNote; // Middle C
	const interval = IntervalCalculator.getInterval(cNote, midiNote);
	const intervalName = IntervalCalculator.getIntervalName(interval);
	console.log(`   Interval from C: ${intervalName} (${interval} semitones)`);
}

// Example 5: Chord demonstration
async function demonstrateChords(mockKeyboard: MockMIDIKeyboard) {
	console.log('\n🎹 Demonstrating Chords:');

	const chordTypes = ['major', 'minor', 'maj7', 'min7', '7'] as const;

	for (const chordType of chordTypes) {
		const chord = chords(60 as MidiNote, chordType); // C chords
		const chordNotes = [chord.root, chord.third, chord.fifth];
		if (chord.seventh) chordNotes.push(chord.seventh);

		console.log(`Playing C ${chordType}:`);
		mockKeyboard.playChord(chordNotes, 100);

		await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms
		mockKeyboard.releaseAllKeys();
		await new Promise((resolve) => setTimeout(resolve, 200)); // Brief pause
	}
}

// Example 6: Scale demonstration
async function demonstrateScales(mockKeyboard: MockMIDIKeyboard) {
	console.log('\n🎼 Demonstrating Scales:');

	// Major scale
	const cMajorScale = getScale(60 as MidiNote, [2, 2, 1, 2, 2, 2, 1]);
	console.log('C Major Scale:');

	for (let i = 0; i < 8; i++) {
		const midiNote = (60 + [0, 2, 4, 5, 7, 9, 11, 12][i]) as MidiNote;
		mockKeyboard.pressKey(midiNote, 80);
		await new Promise((resolve) => setTimeout(resolve, 300));
		mockKeyboard.releaseKey(midiNote);
	}

	await new Promise((resolve) => setTimeout(resolve, 500));

	// Minor scale
	console.log('A Natural Minor Scale:');
	const aMinorScale = getScale(57 as MidiNote, [2, 1, 2, 2, 1, 2, 2]);

	for (let i = 0; i < 8; i++) {
		const midiNote = (57 + [0, 2, 3, 5, 7, 8, 10, 12][i]) as MidiNote;
		mockKeyboard.pressKey(midiNote, 80);
		await new Promise((resolve) => setTimeout(resolve, 300));
		mockKeyboard.releaseKey(midiNote);
	}
}

// Example 7: Chord progression demonstration
async function demonstrateProgressions(mockKeyboard: MockMIDIKeyboard) {
	console.log('\n🎵 Demonstrating Chord Progressions:');

	// Generate I-V-vi-IV progression in C
	const progression = ChordProgressionBuilder.generateProgression('C', [1, 5, 6, 4]);

	console.log('I-V-vi-IV Progression in C Major:');

	for (const chordInfo of progression) {
		console.log(`Playing ${chordInfo.root} ${chordInfo.chordType}`);

		// Convert to actual MIDI notes (simplified - using C4 as base)
		const rootMidi = 60 as MidiNote; // This would need proper conversion
		const chord = chords(rootMidi, chordInfo.chordType);
		const chordNotes = [chord.root, chord.third, chord.fifth];
		if (chord.seventh) chordNotes.push(chord.seventh);

		mockKeyboard.playChord(chordNotes, 90);
		await new Promise((resolve) => setTimeout(resolve, 800));
		mockKeyboard.releaseAllKeys();
		await new Promise((resolve) => setTimeout(resolve, 200));
	}
}

// Example 8: Jazz ii-V-I progression
export async function playJazzProgression(mockKeyboard: MockMIDIKeyboard) {
	console.log('\n🎺 Jazz ii-V-I Progression in C Major:');

	// Dm7 - G7 - Cmaj7
	const dm7 = chords(62 as MidiNote, 'min7'); // D minor 7
	const g7 = chords(67 as MidiNote, '7'); // G dominant 7
	const cmaj7 = chords(60 as MidiNote, 'maj7'); // C major 7

	const jazzChords = [dm7, g7, cmaj7];
	const chordNames = ['Dm7', 'G7', 'Cmaj7'];

	for (let i = 0; i < jazzChords.length; i++) {
		const chord = jazzChords[i];
		const name = chordNames[i];

		console.log(`Playing ${name}`);

		const notes = [chord.root, chord.third, chord.fifth];
		if (chord.seventh) notes.push(chord.seventh);

		mockKeyboard.playChord(notes, 85);
		await new Promise((resolve) => setTimeout(resolve, 1000));
		mockKeyboard.releaseAllKeys();
		await new Promise((resolve) => setTimeout(resolve, 200));
	}
}

// Example 9: Performance testing
export async function performanceTest() {
	console.log('\n⚡ Performance Test:');

	const mockKeyboard = new MockMIDIKeyboard();
	let eventCount = 0;

	mockKeyboard.addNoteEventCallback(() => {
		eventCount++;
	});

	const startTime = performance.now();

	// Play rapid sequence
	const rapidSequence = Array.from({ length: 100 }, (_, i) => ({
		note: (60 + (i % 12)) as MidiNote,
		duration: 10,
		velocity: 100
	}));

	await mockKeyboard.playSequence(rapidSequence);

	const endTime = performance.now();
	const duration = endTime - startTime;

	console.log(`Played 100 notes in ${duration.toFixed(2)}ms`);
	console.log(
		`Captured ${eventCount} events (${((eventCount / duration) * 1000).toFixed(2)} events/sec)`
	);
}

// Example 10: Main demonstration function
/**
 * Complete demonstration of the Jazz MIDI library functionality
 */
async function runCompleteDemo() {
	console.log('🎼 Jazz MIDI - Complete Demo');
	console.log('================================');

	// Try to set up real MIDI, fall back to mock
	const midiSystem = await setupRealMIDIApplication();

	if (midiSystem instanceof MockMIDIKeyboard) {
		console.log('\n🎹 Running Mock MIDI Demo...');

		// Run all demonstrations
		await demonstrateChords(midiSystem);
		await demonstrateScales(midiSystem);
		await demonstrateProgressions(midiSystem);
		await playJazzProgression(midiSystem);
		await performanceTest();

		console.log('\n✅ Demo completed successfully!');
		console.log('\nTo run tests: npm test');
		console.log('To see test UI: npm run test:ui');
	} else {
		console.log('\n🎹 Real MIDI device connected! Play some notes...');
	}
}

// For direct execution (if running as a script)
// if (import.meta.main) {
//   runCompleteDemo().catch(console.error);
// }

// Export for use in other modules
export { runCompleteDemo };
