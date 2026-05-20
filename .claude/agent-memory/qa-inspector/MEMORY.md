# QA Inspector Memory Index

- [Baseline QA Findings 2026-03-28](qa-baseline-2026-03-28.md) — Run 1 had 20 type errors + 3 failing unit tests (octave offset); Runs 2 & 3 (commit 600bef6) fully green: 0 type errors, 82/82 tests pass, build passes
- [Deep Audit Findings 2026-03-29](qa-audit-2026-03-29.md) — 7 logic bugs found: getTypeStats crash for hand_independence/dexterity (BLOCKER), lick lickId URL param ignored (BLOCKER), hand_independence levels 3-4 not implemented, boogie/names exercises never call onComplete, getNoteRole wrong for minor chords, accuracy formula broken for sequential exercises
