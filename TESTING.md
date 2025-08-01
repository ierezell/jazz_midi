# Jazz MIDI - Testing Guide

This document provides a comprehensive guide on how to use the testing infrastructure, including the mock MIDI keyboard and test utilities.

## Overview

The Jazz MIDI project now includes:
- **Comprehensive test suite** for all MIDI functionality
- **Mock MIDI keyboard** for testing without physical hardware
- **Enhanced MIDI utilities** with better error handling
- **Integration tests** demonstrating real-world usage

## Mock MIDI Keyboard

The `MockMIDIKeyboard` class provides a complete simulation of a MIDI keyboard for testing purposes.

### Basic Usage

```typescript
import { MockMIDIKeyboard } from './src/test/mockMIDI';
import { getMidiNote } from './src/midi/midi';

// Create a mock keyboard
const mockKeyboard = new MockMIDIKeyboard();

// Set up MIDI message handling
mockKeyboard.setMIDICallback((event) => {
  const noteEvent = getMidiNote(event);
  console.log(`Note ${noteEvent.type}: ${noteEvent.noteFullName}`);
});

// Simulate pressing C4
mockKeyboard.pressKey(72 as MidiNote, 100);

// Simulate releasing C4
mockKeyboard.releaseKey(72 as MidiNote);
```

### Advanced Features

#### Playing Chords

```typescript
import { chords } from './src/midi/midi';

// Generate a C major chord
const cMajor = chords(72 as MidiNote, 'major');
const chordNotes = [cMajor.root, cMajor.third, cMajor.fifth];

// Play the chord
mockKeyboard.playChord(chordNotes, 100);

// Release the chord
mockKeyboard.releaseChord(chordNotes);
```

#### Playing Sequences

```typescript
// Define a melody
const melody = [
  { note: 72 as MidiNote, duration: 500, velocity: 100 }, // C4
  { note: 74 as MidiNote, duration: 500, velocity: 100 }, // D4
  { note: 76 as MidiNote, duration: 500, velocity: 100 }, // E4
  { note: 77 as MidiNote, duration: 500, velocity: 100 }  // F4
];

// Play the melody
await mockKeyboard.playSequence(melody);
```

#### Control Changes

```typescript
// Send sustain pedal down
mockKeyboard.sendControlChange(64, 127);

// Send sustain pedal up
mockKeyboard.sendControlChange(64, 0);
```

#### Multiple MIDI Devices

```typescript
// Add another MIDI input device
const newDevice = mockKeyboard.addInputDevice({
  name: 'My Custom MIDI Device',
  manufacturer: 'Test Company'
});

// Simulate device connection/disconnection
mockKeyboard.setDeviceState(newDevice.id, 'disconnected');
```

## Enhanced MIDI Utilities

The new `midiUtils.ts` module provides safer and more robust MIDI handling:

### Safe MIDI Access

```typescript
import { safeRequestMidiAccess, safeSetupMidiCallback } from './src/midi/midiUtils';

// Safely request MIDI access with error handling
const midiAccess = await safeRequestMidiAccess();
if (midiAccess) {
  safeSetupMidiCallback(midiAccess, (event) => {
    // Handle MIDI messages
  }, (error) => {
    // Handle errors
    console.error('MIDI error:', error);
  });
}
```

### Frequency Calculations

```typescript
import { FrequencyCalculator } from './src/midi/midiUtils';

// Convert MIDI note to frequency
const frequency = FrequencyCalculator.midiToFrequency(69 as MidiNote); // 440 Hz (A4)

// Convert frequency to MIDI note
const midiNote = FrequencyCalculator.frequencyToMidi(440); // 69 (A4)
```

### Interval Calculations

```typescript
import { IntervalCalculator } from './src/midi/midiUtils';

// Calculate interval between two notes
const interval = IntervalCalculator.getInterval(60 as MidiNote, 64 as MidiNote); // 4 (major third)

// Add interval to a note
const newNote = IntervalCalculator.addInterval(60 as MidiNote, 7); // 67 (perfect fifth up from C)

// Get interval name
const intervalName = IntervalCalculator.getIntervalName(4); // 'majorThird'
```

### Chord Progressions

```typescript
import { ChordProgressionBuilder } from './src/midi/midiUtils';

// Generate a I-V-vi-IV progression in C major
const progression = ChordProgressionBuilder.generateProgression('C', [1, 5, 6, 4]);
// Returns: [
//   { root: 'C', chordType: 'major' },
//   { root: 'G', chordType: 'major' },
//   { root: 'A', chordType: 'minor' },
//   { root: 'F', chordType: 'major' }
// ]
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests with coverage
```bash
npm run test:coverage
```

## Test Structure

### Unit Tests
- `src/midi/midi.test.ts` - Core MIDI functionality
- `src/midi/midiUtils.test.ts` - Enhanced MIDI utilities
- `src/test/mockMIDI.test.ts` - Mock MIDI keyboard functionality

### Integration Tests
- `src/test/integration.test.ts` - End-to-end scenarios

## Example Test Scenarios

### Testing a Musical Performance

```typescript
import { MockMIDIKeyboard } from './src/test/mockMIDI';
import { chords, getScale } from './src/midi/midi';

describe('Musical Performance', () => {
  let mockKeyboard: MockMIDIKeyboard;
  let capturedEvents: NoteEvent[];

  beforeEach(() => {
    mockKeyboard = new MockMIDIKeyboard();
    capturedEvents = [];
    mockKeyboard.addNoteEventCallback((event) => {
      capturedEvents.push(event);
    });
  });

  it('should play a jazz progression', async () => {
    // ii-V-I progression in C major
    const dMin7 = chords(62 as MidiNote, 'min7');
    const g7 = chords(67 as MidiNote, '7');
    const cMaj7 = chords(72 as MidiNote, 'maj7');

    // Play each chord
    [dMin7, g7, cMaj7].forEach(chord => {
      const notes = [chord.root, chord.third, chord.fifth];
      if (chord.seventh) notes.push(chord.seventh);
      
      mockKeyboard.playChord(notes, 100);
      mockKeyboard.releaseAllKeys();
    });

    // Verify the progression was played
    expect(capturedEvents.length).toBeGreaterThan(0);
  });
});
```

### Testing Scale Practice

```typescript
it('should practice scales', () => {
  const cMajorScale = getScale(72 as MidiNote, [2, 2, 1, 2, 2, 2, 1]);
  
  // Play scale ascending
  cMajorScale.slice(0, 8).forEach((noteName, index) => {
    const midiNote = 72 + [0, 2, 4, 5, 7, 9, 11, 12][index] as MidiNote;
    mockKeyboard.pressKey(midiNote, 100);
    mockKeyboard.releaseKey(midiNote);
  });

  // Verify all notes were played
  const playedNotes = capturedEvents
    .filter(e => e.type === 'on')
    .map(e => e.noteFullName);
  
  expect(playedNotes).toEqual(['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']);
});
```

## Performance Monitoring

Track MIDI performance with the built-in monitor:

```typescript
import { MIDIPerformanceMonitor } from './src/midi/midiUtils';

// Record events
MIDIPerformanceMonitor.recordEvent('noteOn');
MIDIPerformanceMonitor.recordEvent('noteOff');

// Get statistics
const stats = MIDIPerformanceMonitor.getStatistics();
console.log(`Notes per second: ${stats.noteOn_per_second}`);

// Reset for new session
MIDIPerformanceMonitor.reset();
```

## Best Practices

1. **Always use the mock keyboard for tests** - Don't rely on physical MIDI devices
2. **Test error conditions** - Use invalid MIDI values to ensure robust error handling
3. **Test timing** - Use async sequences to verify timing-sensitive functionality
4. **Capture events** - Use event callbacks to verify expected behavior
5. **Clean up** - Always release keys and reset state between tests

## Troubleshooting

### Common Issues

1. **Tests running too slowly**: Reduce duration times in `playSequence` calls
2. **Event capture not working**: Ensure callbacks are set up before triggering events
3. **MIDI validation errors**: Check that note numbers are in valid range (24-128)
4. **Timing issues**: Use `await` with async operations like `playSequence`

### Debugging

Enable debug logging:

```typescript
// In your test setup
console.log = vi.fn(); // Mock console to capture logs
```

Check captured events:

```typescript
console.log('Captured events:', capturedEvents);
```

Verify mock keyboard state:

```typescript
console.log('Pressed keys:', mockKeyboard.getPressedKeys());
```
