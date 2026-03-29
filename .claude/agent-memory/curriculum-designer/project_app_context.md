---
name: Jazz MIDI app context
description: Overview of what the app is and how the curriculum system works
type: project
---

Duolingo-style web app for learning jazz piano. Static SvelteKit app, no backend, all progress in localStorage.

Curriculum lives entirely in `src/lib/JourneyService.ts` as a `private units: Unit[]` array inside the `JourneyService` class.

**Why:** There is no separate journey data file — the units array IS the curriculum. Any curriculum changes must be made directly in `JourneyService.ts`.

**How to apply:** When reviewing or redesigning the curriculum, edit the `private units` array in `JourneyService.ts`. The `curriculum-design.ts` file in `src/lib/data/` is documentation/comments only.

Progress is persisted to `localStorage` under key `journey_progress_v2`. When unit IDs change, existing user progress will not carry over (IDs were changed from `level-0..6` to `unit-1..12` in v2.0).

Exercise routes that exist (confirmed by file glob):
- `/exercises/names` — note name identification
- `/exercises/flashcards` — rapid-fire flash cards
- `/exercises/scales` — params: root, mode, bpm
- `/exercises/intervals` — interval identification
- `/exercises/chords` — params: root, quality, voicing
- `/exercises/two_five_ones` — params: key
- `/exercises/rhythm` — params: patternId
- `/exercises/licks` — params: lickId
- `/exercises/dexterity` — params: mode (five-finger/chromatic/thirds)
- `/exercises/boogie` — no params
- `/exercises/hand_independence` — params: level (1-4)
- `/exercises/songs` — params: song (snake_case)
- `/exercises/partition` — sight reading, no params
