# Jazz MIDI — Claude Code Context

## What this app is

A **Duolingo-style web app for learning jazz piano from scratch**. Users progress through a structured curriculum of exercises (note names, intervals, chords, scales, licks, rhythms, II-V-I progressions, songs) with XP, streaks, stars, and unlockable units — exactly like Duolingo but for jazz improvisation.

**Tech stack**: Svelte 5 + SvelteKit 2 + TypeScript 5 + Tailwind CSS 4 + Skeleton UI 4 + VexFlow 5 + Web MIDI API + BasicPitch (mic pitch detection) + Vitest + Playwright

**Static app** — no backend, all data in localStorage.

## Vision

The app should feel like **Duolingo meets a jazz club**: gamified, motivating, fun, visually polished — NOT sterile or corporate. Target audience: people who want to learn jazz piano with zero prior jazz knowledge (some piano background OK).

## Commands

```bash
npm run dev       # dev server
npm run build     # production build (MUST pass before shipping)
npm run check     # TypeScript + Svelte type check (MUST pass)
npm run test      # Vitest unit tests (MUST pass)
npx playwright test  # E2E tests
```

**Always run `npm run check && npm run test` after any code change.**

## Key architecture

| Pattern | Where |
|---------|-------|
| Singleton services | `src/lib/JourneyService.ts`, `src/lib/UserStatsService.ts` |
| Exercise wrapper | `src/components/BaseExercise.svelte` — all exercises use this |
| MIDI input | `src/lib/MIDIManager.ts` singleton |
| Music theory | `src/lib/core/`, `src/lib/MusicTheoryUtils.ts` |
| Types | `src/lib/types/types.ts`, `notes.ts`, `notes.constants.ts` |
| Exercise data | `src/lib/data/` (licks, rhythms, songs as JSON/TS) |
| Routes | `src/routes/exercises/[type]/+page.svelte` |

## Known bugs (TOFIX.md)

- [ ] **Dark mode toggle does nothing** — `ThemeToggle.svelte` broken
- [ ] **White text on white background** — contrast/color system broken
- [ ] **Nav bar overlap on scroll** (Journey page) — z-index / sticky issue
- [ ] **Random exercise picks from wrong level** — JourneyService bug
- [ ] **Gym page UI** — all black on white, no visual appeal
- [ ] **Tooltips too vague** — need exercise-specific help text

## Planned features (TODO.md)

- [ ] Velocity sensitivity for MIDI notes (soft/loud practice)
- [ ] Strict beat mode (must play exactly on the beat)
- [ ] Swing metronome
- [ ] More dexterity exercises
- [ ] Additional teacher-recommended exercises

## Improvement roadmap

### Phase 1 — Bug fixes (do first)
1. Fix dark mode (ThemeToggle + CSS variables)
2. Fix white-on-white contrast
3. Fix nav bar scroll overlap
4. Fix random exercise selection

### Phase 2 — UI/UX polish
5. Design system: semantic color tokens, consistent spacing
6. Gym page visual redesign
7. Mobile responsive layout
8. Accessibility audit (WCAG AA)
9. Better exercise tooltips

### Phase 3 — Features
10. Velocity MIDI support
11. Swing metronome
12. Strict beat mode
13. More exercises (dexterity, teacher exercises)

### Phase 4 — Quality
14. Full test coverage for all exercise flows
15. E2E tests for complete user journey
16. Performance: VexFlow lazy loading, bundle size

## Agent team

| Agent | Use for |
|-------|---------|
| `jazz-music-expert` | Music theory correctness, MIDI mappings, scales/chords/intervals |
| `svelte-developer` | Svelte 5 components, routing, TypeScript, SvelteKit |
| `exercise-builder` | New exercises, adding licks/patterns, BaseExercise integration |
| `qa-inspector` | Running tests, verifying build, QA pass |
| `ui-designer` | Visual design, dark mode, design system, gamification |
| `mobile-developer` | Responsive layout, touch interactions, mobile UX |
| `debugger` | Root cause analysis for bugs |
| `curriculum-designer` | Learning progression, exercise ordering, pedagogical design |
| `accessibility-fixer` | WCAG contrast, keyboard nav, screen reader support |
| `performance-engineer` | MIDI latency, VexFlow perf, bundle size |

## Code conventions

- **Svelte 5 runes only**: `$state`, `$derived`, `$effect`, `$props` — no legacy `writable()`
- TypeScript strict mode — no `any`
- Exercises: keep page thin, logic in `src/lib/`
- Music data: MIDI note 60 = C4, enharmonic equivalence must be handled
- Tests: write tests alongside features, not after

## User journey (must always work)

```
/login → pick/create profile
  → / (home) → see: daily exercises, unit progress, weakness recommendations
  → /journey → full curriculum map, locked/active/completed lessons
  → /exercises → "The Gym" — free practice of any exercise
  → /exercises/[type] → exercise page → complete → stars + XP → back
  → /profile → stats, streak calendar, note heatmap
```
