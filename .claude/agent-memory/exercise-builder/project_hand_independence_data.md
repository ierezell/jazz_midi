---
name: Hand independence data format
description: JSON schema and TypeScript interface for hand independence levels in src/lib/data/hand_independence/
type: project
---

Data lives in `src/lib/data/hand_independence/`.

JSON schema fields:
- `id`, `title`, `level` (int), `description`, `instructions`
- `lhPattern`: either `number[]` (semitone offsets) or `{ beat: number; semitones: number[] }[]` for shell voicings at specific beat positions
- `rhPattern`: `number[]` (semitone offsets from rhStartMidi)
- `rootMidi`: MIDI note number for LH root
- `rhStartMidi`: MIDI note number for RH starting pitch
- `suggestedBpm`, `measures`

TypeScript barrel: `src/lib/data/hand_independence/handIndependenceData.ts` exports `HandIndependenceLevel` interface and `handIndependenceLevels` array.

Current levels:
- level1: Shell Voicings + Major Scale (bpm 80, C root)
- level2: Walking Bass + Pentatonic Melody (bpm 90, C root)

**How to apply:** When building the hand_independence exercise page, import `handIndependenceLevels` and use the `lhPattern`/`rhPattern` fields to generate expected MIDI notes relative to `rootMidi`/`rhStartMidi`.
