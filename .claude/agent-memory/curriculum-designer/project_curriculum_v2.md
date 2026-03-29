---
name: Curriculum v2.0 design decisions
description: 12-unit curriculum written in March 2026; sequencing rationale and key decisions
type: project
---

Curriculum v2.0 written 2026-03-29. Replaced original 7-unit (level-0 to level-6) structure with 12 units (unit-1 to unit-12).

**Why:** Original curriculum had serious sequencing problems — scales appeared before intervals, 7th chords and shell voicings appeared before triads were established, ii-V-I and modal licks were mixed into the same unit with no gradation, and songs appeared at the end with no staging.

**How to apply:** When adding new lessons or units, follow this arc:
1. Note names → 2. Scales → 3. Intervals → 4. Triads → 5. 7th chords → 6. ii-V-I → 7. Blues rhythm → 8. Blues scale → 9. Lick vocabulary → 10. First songs → 11. Advanced songs → 12. Modal jazz

Key sequencing decisions:
- Intervals (Unit 3) before chords (Unit 4): chord construction is interval stacking
- Triads (Unit 4) before 7th chords (Unit 5): reduces cognitive load
- ii-V-I (Unit 6) after all chord types are established
- Rhythm/blues feel (Unit 7) after harmony units so grooves apply over known chords
- Songs only after lick vocabulary is established (Unit 10+)
- Modal content (Unit 12) last — requires ii-V-I fluency to be meaningful

Spaced repetition built in:
- Note names touch: Units 1, 3, 4
- C major scale appears at 60/90/120 BPM across Units 2, 4, 6
- ii-V-I revisited in Units 6, 9, 10, 11, 12
- Sight reading (partition) in Units 8 and 11
- Licks revisited at advanced difficulty in Units 11 and 12

Full design documentation at `src/lib/data/curriculum-design.ts`.
