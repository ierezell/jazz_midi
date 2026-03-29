---
name: BaseExercise props and extension points
description: Key props of BaseExercise.svelte, how defaultBpm threads to Metronome, and perNoteTiming flag
type: project
---

BaseExercise (`src/components/BaseExercise.svelte`) key props:

- `defaultBpm?: number` — passed as `initialBpm` to the internal `<Metronome>` component. Added to support lick exercises seeding the metronome with the lick's suggestedBpm.
- `perNoteTiming?: boolean` — when true, BaseExercise applies per-note beat timing validation in addition to exercise-level validation.
- `showTempoControl?: boolean` — shows/hides the Tempo Mode toggle and Metronome.
- `timingModeLabel?: string` — label on the Tempo Mode button.
- `exerciseType?: ExerciseType` — affects score display logic (partition type always shows score).

Metronome is rendered at line ~533 inside the `{#if tempoMode}` block with `<Metronome onTick={handleTick} initialBpm={defaultBpm} />`.

**How to apply:** When creating a new exercise that has a natural tempo (licks, rhythm exercises), pass `defaultBpm={suggestedBpm}` to BaseExercise so the metronome starts at the right speed.
