---
name: BeatValidator and rhythm mode pattern
description: How rhythm mode is wired into chord/scale/progression exercises; where the beat check fires and BeatValidator lifecycle management
type: feedback
---

Rhythm mode integration pattern used across chords, scales, and two_five_ones exercises:

1. Imports: `BeatValidator` from `$lib/BeatValidator.js`, `rhythmPatterns` from `$lib/data/rhythmPatterns.js`, `BeatIndicator` from `$lib/../components/BeatIndicator.svelte`.

2. State: `withRhythmMode` (bool), `beatValidator` ($state<BeatValidator | null>), `currentBeat` (int), `selectedPatternId` (string), `selectedPattern` ($derived from patterns array).

3. Toggle function creates/destroys BeatValidator on mode change; passes `(beat) => { currentBeat = beat; }` as the onBeatChange callback.

4. Beat check placement: at the top of the note validation function, guarded by `withRhythmMode && beatValidator && currentNotes.length === 0` (for chord-at-a-time exercises) or just `rhythmicMode && scaleBeatValidator` (for per-note sequential exercises). Returns early with `{ isCorrect: false, message: \`Off beat! (\${beatResult.label})\`, collected: false, resetCollected: false }`when`!beatResult.isHit`.

5. Template: `<div class="rhythm-controls">` with checkbox toggle, pattern `<select>`, and `<BeatIndicator totalBeats={4} {currentBeat} hitPositions={selectedPattern.hits} isActive={...} />`.

6. For II-V-I (progressions): filter patterns by `p.isProgression === true`; fall back to all patterns sorted with blues-shells and jazz-charleston first if none have that flag. Both blues-shells and jazz-charleston have `isProgression: true` in their JSON.

**Why:** Beat check fires on the FIRST note of each chord (currentNotes.length === 0) to validate onset timing, not every note of a chord. For scales in sequential mode, every note is individually beat-checked.
