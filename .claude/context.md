# Jazz MIDI — Project Context

## Vision

Duolingo meets a jazz club. Gamified, motivating, fun — NOT sterile or corporate.
Target: beginners to experts who want to improvise and play jazz/elevator music on their own.

- **Beginners**: note names, intervals, scales, chords, rhythm — sometimes based on real songs.
- **Intermediate**: two-hand voicings, II-V-I, shell chords, left-hand comping + right-hand melody.
- **Experts**: free practice of licks, songs, progressions with full control.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Svelte 5 + SvelteKit 2 (static adapter) |
| Language | TypeScript 5 strict mode |
| Styling | Tailwind CSS 4 + Skeleton UI 4 |
| Music notation | OpenSheetMusicDisplay (OSMD) — renders MusicXML |
| MIDI input | Web MIDI API (`navigator.requestMIDIAccess`) |
| Mic pitch | `@spotify/basic-pitch` (lazy-loaded) |
| Audio feedback | HTML5 Audio API via `AudioManager` |
| State | Svelte 5 runes only (`$state`, `$derived`, `$effect`, `$props`) |
| Storage | `localStorage` — no backend, fully static |
| Unit tests | Vitest |
| E2E tests | Playwright |
| Build | Vite 8 |

## Project Structure

```
src/
  app.html                  — shell HTML
  routes/
    +layout.svelte          — global layout (nav, theme)
    +page.svelte            — home / dashboard
    login/                  — profile picker
    journey/                — curriculum map
    training/               — daily session
    exercises/              — The Gym + all exercise pages
      chords/               — chord voicing exercise
      scales/               — scale exercise
      dexterity/            — finger dexterity (Hanon, chromatic…)
      rhythm/               — rhythm / timing exercise
      intervals/            — interval recognition
      flashcards/           — note-name flash cards
      names/                — note name recognition
      partition/            — sight-reading (OSMD)
      licks/                — jazz lick practice
      two_five_ones/        — II-V-I progression
      song-chords/          — chord changes on real songs
      song-melody/          — melody on real songs
      song-rhythm/          — rhythm on real songs
      songs/                — full song practice
      hand_independence/    — LH/RH coordination
      hand-dynamics/        — velocity / touch control
      ghost-notes/          — ghost-note technique
      enclosure/            — bebop enclosure
      boogie/               — boogie-woogie pattern
      interval-mimicry/     — ear training / mimicry
    profile/                — stats, streak, heatmap
  components/
    exercise/
      BaseExercise.svelte   — CORE: MIDI loop, validation, scoring, sidebar, keyboard, score
      ExerciseSidebar.svelte— controls panel (root key, tempo, debug…)
      Score.svelte          — OSMD wrapper
      Keyboard.svelte       — visual piano keyboard
      BeatIndicator.svelte  — metronome beat display
      DebugPanel.svelte     — MIDI debug info
    LessonCompleteModal.svelte — stars / mastery modal after journey exercise
    NavigationBar.svelte
    Metronome.svelte
    MidiStatusPill.svelte
    MicInputControl.svelte
    NoteHeatmap.svelte / StreakCalendar.svelte / StatsWidget.svelte
  lib/
    MIDIManager.ts          — singleton: connects MIDI, dispatches NoteEvent
    MusicTheoryUtils.ts     — chord/scale/interval math (pure functions)
    musicValidation.ts      — beat-timing, voice-leading distance
    JourneyService.ts       — singleton: units, lessons, progress, training session
    UserStatsService.ts     — singleton: XP, streaks, note progress, mastery
    LoggingService.ts       — structured logger
    ThemeService.svelte.ts  — dark/light theme
    virtualMidi.ts          — keyboard-to-MIDI bridge (for testing / no-MIDI fallback)
    ScoreAnnotationUtils.ts — OSMD chord symbol annotations
    audio/
      AudioManager.ts       — play success/error sounds
      AudioOutputService.ts — audio device selection
      AudioInputService.ts  — mic → BasicPitch → MIDI events
    data/
      journeyUnits.ts       — all curriculum units & lessons (source of truth)
      licksData.ts          — lick definitions
      rhythmPatternsData.ts — rhythm patterns
      MusicXMLLoader.ts     — fetch + parse MusicXML via OSMD
    exercises/
      ExerciseController.ts — reusable exercise business logic (validation, scoring)
      TempoManager.ts       — metronome / beat tracking
      utils/                — BeatValidator, RhythmMode, VelocityValidator, LegatoCheck…
    types/
      notes.ts              — MidiNote, Note, ChordType, Inversion… (branded types)
      types.ts              — NoteEvent, ScoreProps, ExerciseType, KeyboardProps…
      exercise-api.ts       — ValidationResult, ExerciseAPI, BeatTiming, TempoValidation
      musicxml.ts           — MusicXMLSong, SongNote, SongChord, VelocityMap
      rhythm.ts             — RhythmPattern, BarData, RhythmConfig…
```

## App Sections

### /journey — Curriculum Map
Locked/active/completed units. Each unit has lessons (exercises). Stars + mastery (N perfect runs). Progress persisted in `localStorage` via `JourneyService`.

### /training — Daily Practice
`JourneyService.generateTraining(unitId)` picks 3-5 unmastered lessons. After each exercise the student is returned here with `?unitId=&lessonId=&stars=`. Session ends when all lessons are done.

### /exercises — The Gym
Free practice of any exercise type. Full sidebar controls (root key, tempo, voicing…). No mastery tracking, no modal — just play.

### /profile — Stats
XP, streak calendar, note heatmap, missed notes/chords, mastery levels.

## Core Exercise Pattern

Every exercise page:
1. Renders `<BaseExercise>` with four callbacks:
   - `generateExpectedNotes(selectedNote) → MidiNote[]`
   - `generateScoreProps(selectedNote) → ScoreProps`
   - `validateNoteEvent(selectedNote, event, expected, current) → ValidationResult`
   - `isCompleted(current, expected) → boolean`
2. `BaseExercise` owns the MIDI loop, scoring, sidebar, keyboard hint, OSMD score, and the `LessonCompleteModal`.
3. Journey mode is detected via `?unitId=&lessonId=` URL params → shows modal, hides sidebar.
4. Gym mode → sidebar visible, no modal.

### ValidationResult contract
```ts
type ValidationResult = {
  isCorrect: boolean;
  message: string;
  collected: boolean;      // true = add note to collectedNotes set
  resetCollected: boolean; // true = clear collectedNotes (wrong chord → restart)
  resetMistakes?: boolean;
};
```

### ExerciseAPI (exposed to child snippets)
```ts
interface ExerciseAPI {
  selectedNote, currentNotes, expectedNotes, mistakes, completed,
  collectedNotes, debugMode, feedbackMessage, showNotesRoles,
  tempoMode, toggleDebug, showFeedback, toggleTempoMode,
  handleTick, completeExercise
}
```

## Music Data Conventions

- **MIDI note numbers**: C4 = 60 (standard). All internal logic uses `MidiNote` (branded number type).
- **Note names**: `Note` = `'C' | 'C#' | 'Db' | … | 'B'` (pitch class, no octave).
- **Full names**: `NoteFullName` = `'C4'`, `'F#3'`, etc.
- **Enharmonic equivalents** must be handled (C# = Db).
- **Chord math**: `chords(rootMidi, chordType, inversion)` → `Chord` object.
- **Voicings**: `full-right`, `full-left`, `1735`, `1537`, `rootless-a`, `rootless-b`, `shell`, `guide-tones`.
- **Inversions**: `0` = root, `1` = 1st, `2` = 2nd, `3` = 3rd.
- MusicXML files live in `static/` (served at runtime); JSON metadata mirrors them in `docs/`.

## Journey Data Model

```ts
Unit { id, title, difficulty, lessons[], status: 'locked'|'active'|'completed' }
Lesson { id, title, path, pillar, params, completed, stars, perfectCompletions, requiredPerfectCompletions }
Pillar = 'technique' | 'theory' | 'vocabulary' | 'repertoire'
```

Progress saved to `localStorage` key `journey_progress_v2`.

## Coding Rules

- **Svelte 5 runes only** — no `writable()`, no `onMount` for reactive state.
- **No `any`** — TypeScript strict mode throughout.
- **KISS / DRY / SOLID** — keep pages thin, push logic into `src/lib/`.
- **No SSR** — static site; always guard browser APIs with `if (browser)` or `typeof window !== 'undefined'`.
- Heavy libs (OSMD, BasicPitch) must be **lazy-imported** (`await import(…)`) to keep initial bundle small.
- Exercise pages must **not** import each other — share only through `src/lib/`.

## Dev Commands

```bash
npm run dev           # Vite dev server → http://localhost:5173
npm run build         # production static build → docs/
npm run check         # svelte-check + tsc (must pass before merge)
npm run test          # Vitest unit tests
npx playwright test   # E2E browser tests
```

**Gate**: `npm run check && npm run test && npx playwright test` must all pass before shipping.

## Testing Conventions

- Unit tests: `tests/unit/` — pure logic, music theory, validators.
- E2E tests: `tests/e2e/` — full user flows via Playwright.
- MIDI injection in E2E: `window.__dispatchMidi(new Uint8Array([0x90, note, velocity]))`.
- Seed profile helper: `seedProfile(context)` sets up `localStorage` before each test.
- Each exercise should have an E2E test that plays notes as a student would.

## Key Singletons

| Singleton | Import | Responsibility |
|---|---|---|
| `midiManager` | `$lib/MIDIManager` | MIDI device access, event dispatch |
| `journeyService` | `$lib/JourneyService` | Curriculum state, training session |
| `userStatsService` | `$lib/UserStatsService` | XP, streaks, note/chord stats |
| `audioManager` | `$lib/audio/AudioManager` | Play success / error sounds |
| `audioInputService` | `$lib/audio/AudioInputService` | Mic → pitch → MIDI |