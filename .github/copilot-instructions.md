# GitHub Copilot Instructions for Jazz MIDI

## Project Overview

This is a jazz education web application built with Svelte 5 that helps musicians practice jazz theory through interactive MIDI keyboard exercises. The app focuses on chord recognition, scale practice, and jazz harmony concepts like two-five-one progressions.

It's a STATIC WEBSITE. It does not require a server, server-side rendering or database, and all data is handled client-side.

## Key Technologies

- **Frontend**: Svelte 5 with TypeScript
- **MIDI**: Web MIDI API for real-time MIDI keyboard input
- **Music Notation**: VexFlow for displaying musical scores
- **Audio**: HTML5 Audio API for feedback sounds
- **Styling**: Vanilla CSS with component-scoped styles

## Core Features

1. **Chord Practice**: Interactive chord recognition with visual keyboard and score display
2. **Scale Practice**: Major/minor scale exercises with MIDI input validation
3. **Two-Five-One Progressions**: Jazz harmonic sequence practice
4. **Virtual Keyboard**: Visual representation of piano keys with note highlighting
5. **Musical Score Display**: Staff notation using VexFlow
6. **Real-time MIDI Input**: Connect physical MIDI keyboards for practice

## Code Architecture

### MIDI System (`src/midi/midi.ts`)

- Comprehensive MIDI note type definitions (24-128)
- Note name mappings (C0-G#8) with enharmonic equivalents
- Chord generation functions for jazz chord types (maj7, min7, dom7, etc.)
- Scale generation for major/minor scales
- MIDI event handling and note parsing

### Component Structure

- `Keyboard.svelte`: Virtual piano keyboard with note highlighting
- `Key.svelte`: Individual piano key component with visual state
- `Score.svelte`: Musical staff notation display using VexFlow
- `MidiDisplay.svelte`: MIDI device connection status

### Routes

- `/`: Home page with MIDI setup
- `/chords`: Chord recognition practice
- `/scales`: Scale practice exercises
- `/two_five_ones`: Jazz progression practice

## Coding Guidelines

### TypeScript Usage

- Use strict typing for all MIDI-related data (`MidiNote`, `NoteFullName`, `ChordType`)
- Leverage union types for musical concepts (notes, chord types, scale types)
- Type all component props and state properly

### Svelte 5 Patterns

- Use `$state()` for reactive variables
- Use `$derived()` for computed values
- Use `$props()` for component props with destructuring
- Enable runes with `<svelte:options runes={true} />`

### MIDI Integration

- Always check for Web MIDI API support
- Handle MIDI access permissions gracefully
- Process both note-on and note-off events
- Maintain note state for polyphonic input

### Musical Logic

- Use MIDI note numbers (0-127) as the primary representation
- Convert to note names only for display purposes
- Handle enharmonic equivalents (C# = Db)
- Support various jazz chord extensions and alterations

### Component Design

- Keep components focused on single musical concepts
- Pass MIDI data down through props
- Use reactive statements for real-time updates
- Implement proper cleanup for MIDI listeners

### Performance Considerations

- Debounce rapid MIDI events when needed
- Use efficient note lookup tables
- Minimize DOM updates in keyboard rendering
- Cache audio elements for feedback sounds

### Error Handling

- Gracefully handle missing MIDI devices
- Provide fallback UI for non-MIDI usage
- Log MIDI errors for debugging
- Show user-friendly error messages

## Future Development Areas

- Mobile touch keyboard support
- Advanced chord voicings and inversions
- Metronome and timing exercises
- MIDI file import/export
- Practice session tracking
- Adaptive difficulty based on performance

When suggesting code changes or new features, prioritize:

1. Musical accuracy and proper jazz theory implementation
2. Responsive, real-time MIDI interaction
3. Clean, typed code following Svelte 5 patterns
4. Accessible, intuitive user interface design
5. Performance optimization for smooth audio/visual feedback
