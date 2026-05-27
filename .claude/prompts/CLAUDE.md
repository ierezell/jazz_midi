# Jazz MIDI — Claude Code Context

## What this app is

A **Duolingo-style web app for learning jazz piano from scratch**. Users progress through a structured curriculum of exercises (note names, intervals, chords, scales, licks, rhythms, II-V-I progressions, songs) with XP, streaks, stars, and unlockable units — exactly like Duolingo but for jazz improvisation.

**Tech stack**: Svelte 5 + SvelteKit 2 + TypeScript 5 + Tailwind CSS 4 + Skeleton UI 4 + OpenSheetMusicDisplay + Web MIDI API + BasicPitch (mic pitch detection) + Vitest + Playwright

**Static app** — no backend, all data in localStorage.

## Vision

The app should feel like **Duolingo meets a jazz club**: gamified, motivating, fun, visually polished — NOT sterile or corporate. Target audience: people who want to learn jazz piano with almost no knowledge (some piano background OK).

## Commands

```bash
pnpm dev          # dev server
pnpm build        # production build (MUST pass before shipping)
pnpm check        # TypeScript + Svelte type check (MUST pass)
pnpm test         # Vitest unit tests (MUST pass)
pnpm exec playwright test  # E2E tests
```

**Always run `npm run check && npm run test && npx playwright` after any code change.**

## Code conventions

- **Svelte 5 runes only**: `$state`, `$derived`, `$effect`, `$props` — no legacy `writable()`
- TypeScript strict mode — no `any`
- Exercises: keep page thin, logic in `src/lib/`
- Music data: MIDI note 60 = C4, enharmonic equivalence must be handled
- Tests: write tests alongside features, not after also write UI/browser test via playwright

## User journey (must always work)

```
/login → pick/create profile
  → / (home) → see: daily exercises, unit progress, weakness recommendations
  → /journey → full curriculum map, locked/active/completed lessons
  → /training → One daily session of training.
  → /exercises → "The Gym" — free practice of any exercise
  → /exercises/[type] → exercise page → complete → stars + XP → back
  → /profile → stats, streak calendar, note heatmap
```


## TODO 
Please do a complete review and audit of the codebase. 
Then fix all the code smells, red flags, we want to adhere to KISS, DRY, SOLID, lean principles.
Remove, merge or fix duplicated or spaghetti code it has to be clean and simple to maintain. 


#### Ensure that the flow is: 
##### For exercises: 
- Load the exercise or song via mxml or json and that this creates the same data structure 
- Use the loaded to create the needed exercise
- Ensure that we show the score via OSMD, that the UI and experience is perfect (showing a cursor, responsiveness, audio feedback etc...)
- Ensure that we can optionally ask the student to play on the beat and validate that.
- Ensure that the exercise is tested as if a student was playing (playwright).

##### For training: 
- Ensure that it follows the strength and weaknesses of the current student
- Ensure that it follows a learning plan
- Ensure the whole flow via tests like if you where a student: 
  - Land on the training page
  - Start the first exercise, succeed after tries
  - All stats, progressions are updated
  - The next exercise follows
  - Up to all exercises completed 
  - Summary of training day
- Then the next day I want to connect again and that the website propose me again exercises/training that will lead me to be able to play over songs, or do elevator music by my own.

##### For journey: 
- Ensure we follow a classic path of learning
- Ensure exercises are diverse, Fun, and motivate me to learn
- Learning to read music
- Learning intervals
- Learning scales
- Learning chords
- Increasing difficulty to gain fluidity
- Learning II-V-I 
- Learning the circle of fifths
- Learning muscle memory for left and right hand
- Then ensure the student have the minimum muscle memory (like chords, scales, licks) to progress to the next level.
- You can base it on songs to ensure it stays fun.


#### Tests
Ensure all tests via playwright to mimic the behavior of a student. 
Start your lessons, play piano, ensure we got all the feedback, pop-up, progression, flow, continuity that a end user, student would expect.
Ensure score render properly with the correct notes, that it's visible, responsive, that triggers like on exercise end complete etc...
We need to test the full flow, from login to daily completion via all the exercises, redirection etc...

#### Codebase
Please do a complete review and audit of the codebase. 
Then fix all the code smells, red flags, we want to adhere to KISS, DRY, SOLID, lean principles.
Remove, merge or fix duplicated or spaghetti code, abstractions and similar concepts. 
It has to be clean and simple to maintain.
