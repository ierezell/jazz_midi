---
name: Baseline QA Findings 2026-03-28
description: QA run history — initial baseline had 20 type errors and 3 failing unit tests; second run (same date, later commit) is fully green across all three gates
type: project
---

## Run 1 (earlier commit, 2026-03-28) — PARTIAL FAILURES

### Type check: 20 ERRORS (exit 1)

All errors were in `src/routes/exercises/flashcards/+page.svelte` lines 226-248.
Two categories:

1. `currentCard.config` is possibly `undefined` (8 errors) — config is not narrowed before access.
2. Property types are `unknown` or `number` instead of the expected concrete types (`ChordType`, `Inversion`, `ChordVoicing`, `Note`, `ScaleMode`) — likely because `config` is typed as a generic/loose object.

Two additional errors in `tests/e2e/progression-flow.spec.ts` lines 7 and 11:
- `Cannot find module '/src/lib/UserStatsService.ts'` — the E2E test uses a dynamic `import()` with an absolute path that TypeScript cannot resolve at check-time.

### Unit tests: 3 FAILED / 79 passed (20 test files, 82 total tests)

1. `src/lib/tests/rootless.spec.ts > Rootless Chords Logic > should return basic chord tones correctly`
   - Expected `root` = 72 (C4, MIDI), got 60 (C3, MIDI). Off by exactly one octave.

2. `src/lib/tests/chords.spec.ts > Chord generation > Cmaj7 root produces C4 E4 G4 B4`
   - Expected `['C4','E4','G4','B4']`, got `['C3','E3','G3','B3']`. Off by exactly one octave.

3. `src/lib/tests/chords.spec.ts > Chord generation > new voicings produce correct left/right hand mappings for C4 maj7`
   - Same octave-offset failure: expected C4 in right hand, got C3.

Root cause: chord generation placed root notes one octave too low — a MIDI base-octave offset constant was wrong.

### Build: PASSED (exit 0)

---

## Run 2 (later commit 600bef6, 2026-03-28) — ALL GREEN

### Type check: PASSED (exit 0)
`svelte-check found 0 errors and 0 warnings`
- All 20 flashcards type errors resolved.
- E2E progression-flow import error resolved.

### Unit tests: PASSED — 82/82 (exit 0)
All 20 test files, all 82 tests pass.
- rootless.spec.ts octave offset bug: FIXED
- chords.spec.ts octave offset bugs: FIXED

### Build: PASSED (exit 0)
- SSR: 3853 modules, built in ~40s
- Client: 5193 modules, built in ~25s
- Output written to `docs/` via @sveltejs/adapter-static

#### Persistent warnings (benign, carry-forward)
- `[esbuild css minify] "file" is not a known CSS property` — appears in both SSR and client build. Caused by a Tailwind arbitrary class `[file:line]` leaking into the minified CSS. Not a runtime error; esbuild suggests "flex" as the intended property. Track for cleanup.

#### Large chunks (same as baseline, no regressions)
- `wr6S8XWn.js`: 1,128 kB raw / 691 kB gzip
- `CAYENW2a.js`: 1,040 kB raw / 264 kB gzip

---

## Run 3 (commit 600bef6, 2026-03-28) — ALL GREEN

### Type check: PASSED (exit 0)
`svelte-check found 0 errors and 0 warnings`

### Unit tests: PASSED — 82/82 (exit 0)
All 20 test files, all 82 tests pass. Module count unchanged from Run 2.

### Build: PASSED (exit 0)
- SSR: 3858 modules, built in ~98s
- Client: 5199 modules, built in ~58s
- Output written to `docs/` via @sveltejs/adapter-static
- Persistent CSS minify warning present (same as Run 2, benign)
- Large chunk sizes stable: `wr6S8XWn.js` 1,128 kB / `CAYENW2a.js` 1,040 kB

---

## Known flaky patterns (still applicable)

- E2E `progression-flow.spec.ts` historically used `page.evaluate(() => import('/src/lib/UserStatsService.ts'))` — absolute path caused type-check failure. Was fixed before Run 2. Watch for recurrence if E2E tests are modified.
- The two large JS chunks (~1 MB each) are a bundle-size warning, not a blocker — likely the MIDI/audio library. Flag if they grow further.
