# GitHub Copilot Instructions for Jazz MIDI

Keep the code as concise as possible, avoid duplicates, create common logic.
Try as much as possible to modify existing code instead of creating new one.
DO NOT CREATE +page-new.svelte or +page-old.svelte, directly modify files.

## User

The website is made to be rendered on a mobile, landscape format.
The UI has to be compact.

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

1. **Practice**: Interactive exercises with visual keyboard and score display
2. **Musical Score Display**: Staff notation using VexFlow
3. **Real-time MIDI Input**: Connect physical MIDI keyboards for practice

## Coding Guidelines

### TypeScript Usage

- Use strict typing
- Type all component props and state properly

### Svelte 5 Patterns

- Use `$state()` for reactive variables
- Use `$derived()` for computed values
- Use `$props()` for component props with destructuring
- Enable runes with `<svelte:options runes={true} />`

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

- Advanced chord voicings and inversions
- Metronome and timing exercises
- MIDI file import/export
- Practice session tracking
- Adaptive difficulty based on performance

When suggesting code changes or new features, prioritize:

1. Simplicity and clarity
2. Reusability of components and functions
3. Clean, typed code following Svelte 5 patterns
4. Accessible, intuitive user interface design
5. Performance optimization for smooth audio/visual feedback
