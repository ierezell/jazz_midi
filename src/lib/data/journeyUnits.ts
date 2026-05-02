import type { Unit } from '../JourneyService';

/**
 * Journey curriculum — 12 units progressing from complete beginner to advanced jazz.
 *
 * Pedagogical ordering:
 *   1. Note names & keyboard geography
 *   2. Intervals (prerequisite for understanding scales)
 *   3. Major scales + staff reading
 *   4. Minor & pentatonic scales (gateway to improvisation)
 *   5. Triads
 *   6. 7th chords + shell voicings
 *   7. Blues — the root of jazz (first real improvisation)
 *   8. ii–V–I — the cornerstone of jazz harmony
 *   9. Jazz rhythm, swing feel & hand independence
 *  10. Bebop vocabulary — enclosures, licks, turnarounds
 *  11. Songs I — first jazz standards
 *  12. Modal jazz & mastery — So What, rootless voicings, circle of 5ths
 *
 * Each lesson specifies:
 *  - pillar:  technique | theory | vocabulary | repertoire
 *  - params:  URL query params forwarded to the exercise page
 */
export const JOURNEY_UNITS: Unit[] = [

// ------------------------------------------------------------------
// UNIT 1 — BEGINNER — First Steps
// Goal: Know all 12 note names, find them on the keyboard and staff.
// ------------------------------------------------------------------
{
id: 'unit-1',
title: 'Unit 1: First Steps',
description: 'Learn every key on the piano — white and black — and feel your first beat.',
difficulty: 'beginner',
status: 'active',
color: 'bg-sky-500',
lessons: [
{
id: 'u1-white-keys',
title: 'White Key Names (C–B)',
type: 'exercise',
path: '/exercises/names',
pillar: 'theory',
params: { range: 'C4,B4' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u1-black-keys',
title: 'Black Key Names (Sharps & Flats)',
type: 'exercise',
path: '/exercises/names',
pillar: 'theory',
params: { range: 'C4,B4', includeBlackKeys: 'true' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u1-treble-staff',
title: 'Notes on the Treble Staff',
type: 'exercise',
path: '/exercises/partition',
pillar: 'theory',
params: { range: 'C4,G4', randomMode: 'false' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u1-five-finger',
title: 'Five-Finger Position (Middle C)',
type: 'exercise',
path: '/exercises/dexterity',
pillar: 'technique',
params: { mode: 'five-finger', root: 'C', bpm: '60' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u1-quarter-rhythm',
title: 'Quarter-Note Groove',
type: 'exercise',
path: '/exercises/rhythm',
pillar: 'technique',
params: { patternId: 'rock', bpm: '60' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 2
},
{
id: 'u1-flashcards',
title: 'Flash Card Drill — All Notes',
type: 'exercise',
path: '/exercises/flashcards',
pillar: 'theory',
params: { type: 'note-names' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
}
]
},

// ------------------------------------------------------------------
// UNIT 2 — BEGINNER — Intervals
// Goal: Hear and measure the distance between any two notes.
// WHY HERE: Intervals are the prerequisite for understanding scales
// and chords — teach them before scales, not after.
// ------------------------------------------------------------------
{
id: 'unit-2',
title: 'Unit 2: Intervals',
description: 'Hear and measure the distance between notes — the DNA of every scale and chord.',
difficulty: 'beginner',
status: 'locked',
color: 'bg-teal-500',
lessons: [
{
id: 'u2-half-whole',
title: 'Half Step & Whole Step (m2 / M2)',
type: 'exercise',
path: '/exercises/intervals',
pillar: 'theory',
params: { intervalType: 'minor2nd,major2nd', randomMode: 'false', rightHandMode: 'true' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u2-thirds',
title: 'Major & Minor 3rds',
type: 'exercise',
path: '/exercises/intervals',
pillar: 'theory',
params: { intervalType: 'minor3rd,major3rd', randomMode: 'false', rightHandMode: 'true' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u2-perfect4-5',
title: 'Perfect 4th & 5th',
type: 'exercise',
path: '/exercises/intervals',
pillar: 'theory',
params: { intervalType: 'perfect4th,perfect5th', randomMode: 'false', rightHandMode: 'true' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u2-sixths-sevenths-octave',
title: 'Major 6th, 7th & Octave',
type: 'exercise',
path: '/exercises/intervals',
pillar: 'theory',
params: { intervalType: 'major6th,major7th,octave', randomMode: 'false', rightHandMode: 'true' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u2-interval-ear',
title: 'Interval Ear Training',
type: 'exercise',
path: '/exercises/interval-mimicry',
pillar: 'theory',
params: { randomMode: 'true' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u2-eighth-rhythm',
title: 'Eighth-Note Groove',
type: 'exercise',
path: '/exercises/rhythm',
pillar: 'technique',
params: { patternId: 'pop', bpm: '70' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 2
}
]
},

// ------------------------------------------------------------------
// UNIT 3 — BEGINNER — Major Scales & Staff Reading
// Goal: Play C, G, F major scales one octave; read across the staff.
// ------------------------------------------------------------------
{
id: 'unit-3',
title: 'Unit 3: Major Scales',
description: 'Play C, G and F major scales fluently and start reading music on the staff.',
difficulty: 'beginner',
status: 'locked',
color: 'bg-green-500',
lessons: [
{
id: 'u3-c-major',
title: 'C Major Scale (RH, 60 BPM)',
type: 'exercise',
path: '/exercises/scales',
pillar: 'technique',
params: { root: 'C', scaleMode: 'Maj', bpm: '60', rightHandMode: 'true', strictTempo: 'false' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u3-g-major',
title: 'G Major Scale (RH, 60 BPM)',
type: 'exercise',
path: '/exercises/scales',
pillar: 'technique',
params: { root: 'G', scaleMode: 'Maj', bpm: '60', rightHandMode: 'true', strictTempo: 'false' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u3-f-major',
title: 'F Major Scale (RH, 60 BPM)',
type: 'exercise',
path: '/exercises/scales',
pillar: 'technique',
params: { root: 'F', scaleMode: 'Maj', bpm: '60', rightHandMode: 'true', strictTempo: 'false' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u3-staff-reading',
title: 'Staff Reading — Full Octave (C4–C5)',
type: 'exercise',
path: '/exercises/partition',
pillar: 'theory',
params: { range: 'C4,C5', randomMode: 'false' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u3-chromatic',
title: 'Chromatic Scale — All 12 Notes',
type: 'exercise',
path: '/exercises/scales',
pillar: 'technique',
params: { root: 'C', scaleMode: 'Chromatic', bpm: '60', rightHandMode: 'true' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 2
}
]
},

// ------------------------------------------------------------------
// UNIT 4 — BEGINNER → INTERMEDIATE — Minor & Pentatonic
// Goal: Natural minor, harmonic minor, major & minor pentatonic.
// WHY HERE: Pentatonic is the gateway to jazz improvisation —
// it must come before blues, chords, and any soloing work.
// ------------------------------------------------------------------
{
id: 'unit-4',
title: 'Unit 4: Minor & Pentatonic',
description: 'Discover the minor sound and pentatonic scales — your gateway to jazz improvisation.',
difficulty: 'beginner',
status: 'locked',
color: 'bg-emerald-500',
lessons: [
{
id: 'u4-a-natural-minor',
title: 'A Natural Minor Scale (RH)',
type: 'exercise',
path: '/exercises/scales',
pillar: 'technique',
params: { root: 'A', scaleMode: 'Min', bpm: '70', rightHandMode: 'true' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u4-a-harmonic-minor',
title: 'A Harmonic Minor — the raised 7th',
type: 'exercise',
path: '/exercises/scales',
pillar: 'technique',
params: { root: 'A', scaleMode: 'HarMin', bpm: '70', rightHandMode: 'true' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u4-c-pentatonic',
title: 'C Major Pentatonic (5 magic notes)',
type: 'exercise',
path: '/exercises/scales',
pillar: 'technique',
params: { root: 'C', scaleMode: 'Pentatonic', bpm: '70', rightHandMode: 'true' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u4-a-minor-pentatonic',
title: 'A Minor Pentatonic',
type: 'exercise',
path: '/exercises/scales',
pillar: 'technique',
params: { root: 'A', scaleMode: 'PentatonicMin', bpm: '70', rightHandMode: 'true' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u4-pentatonic-improv',
title: 'First Improvisation — Pentatonic',
type: 'exercise',
path: '/exercises/dexterity',
pillar: 'vocabulary',
params: { mode: 'improv', root: 'C', scaleMode: 'Pentatonic', bpm: '70' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 2
}
]
},

// ------------------------------------------------------------------
// UNIT 5 — INTERMEDIATE — Triads
// Goal: Major, minor, diminished triads in root position + inversions.
// ------------------------------------------------------------------
{
id: 'unit-5',
title: 'Unit 5: Triads',
description: 'Build and play major, minor and diminished triads — the foundation of all chords.',
difficulty: 'intermediate',
status: 'locked',
color: 'bg-lime-500',
lessons: [
{
id: 'u5-major-triads',
title: 'Major Triads — C, G, F, D (root position)',
type: 'exercise',
path: '/exercises/chords',
pillar: 'theory',
params: { chordType: 'maj', note: 'C', voicing: 'root', randomMode: 'false', bpm: '60' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u5-minor-triads',
title: 'Minor Triads — Dm, Em, Am (root position)',
type: 'exercise',
path: '/exercises/chords',
pillar: 'theory',
params: { chordType: 'min', note: 'D', voicing: 'root', randomMode: 'false', bpm: '60' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u5-dim-triad',
title: 'Diminished Triad (Bdim) — the tension chord',
type: 'exercise',
path: '/exercises/chords',
pillar: 'theory',
params: { chordType: 'dim', note: 'B', voicing: 'root', randomMode: 'false', bpm: '60' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u5-diatonic-triads',
title: 'Diatonic Triads in C Major (I–VII)',
type: 'exercise',
path: '/exercises/chords',
pillar: 'theory',
params: { chordType: 'diatonic-triads', note: 'C', voicing: 'root', bpm: '70' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u5-triad-inversions',
title: 'Triad Inversions (1st & 2nd)',
type: 'exercise',
path: '/exercises/chords',
pillar: 'technique',
params: { chordType: 'maj', note: 'C', voicing: 'close', bpm: '60' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
}
]
},

// ------------------------------------------------------------------
// UNIT 6 — INTERMEDIATE — 7th Chords
// Goal: maj7, min7, dom7, half-dim + shell voicings.
// ------------------------------------------------------------------
{
id: 'unit-6',
title: 'Unit 6: 7th Chords',
description: 'Add the 7th to every chord — the core sound of jazz harmony.',
difficulty: 'intermediate',
status: 'locked',
color: 'bg-yellow-500',
lessons: [
{
id: 'u6-cmaj7',
title: 'Cmaj7 (root position)',
type: 'exercise',
path: '/exercises/chords',
pillar: 'theory',
params: { chordType: 'maj7', note: 'C', voicing: 'root', randomMode: 'false', bpm: '60' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u6-dm7-g7',
title: 'Dm7 and G7 (root position)',
type: 'exercise',
path: '/exercises/chords',
pillar: 'theory',
params: { chordType: 'min7,dom7', note: 'D', voicing: 'root', randomMode: 'false', bpm: '60' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u6-bm7b5',
title: 'Bm7♭5 (half-diminished)',
type: 'exercise',
path: '/exercises/chords',
pillar: 'theory',
params: { chordType: 'halfDim7', note: 'B', voicing: 'root', randomMode: 'false', bpm: '60' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u6-shell-voicings',
title: 'Shell Voicings (1–3–7)',
type: 'exercise',
path: '/exercises/chords',
pillar: 'vocabulary',
params: { chordType: 'maj7,min7,dom7', voicing: 'shell', randomMode: 'true', bpm: '70' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u6-diatonic-7ths',
title: 'Diatonic 7th Chords in C (all 7)',
type: 'exercise',
path: '/exercises/chords',
pillar: 'theory',
params: { chordType: 'diatonic-7ths', note: 'C', voicing: 'root', bpm: '70' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u6-seventh-flashcards',
title: 'Flash Cards — 7th Chord Symbols',
type: 'exercise',
path: '/exercises/flashcards',
pillar: 'theory',
params: { type: 'chords', chordTypes: 'maj7,min7,dom7' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
}
]
},

// ------------------------------------------------------------------
// UNIT 7 — INTERMEDIATE — The Blues
// Goal: Blues scale, blues shuffle, classic licks — first real improv.
// WHY HERE: The blues is the root of all jazz. Teach it before ii-V-I
// so students improvise freely before tackling complex harmony.
// ------------------------------------------------------------------
{
id: 'unit-7',
title: 'Unit 7: The Blues',
description: 'The blues is the root of all jazz. Learn the scale, the form, and improvise.',
difficulty: 'intermediate',
status: 'locked',
color: 'bg-red-500',
lessons: [
{
id: 'u7-blues-scale-c',
title: 'C Blues Scale (RH)',
type: 'exercise',
path: '/exercises/scales',
pillar: 'technique',
params: { root: 'C', scaleMode: 'Blues', bpm: '80', rightHandMode: 'true' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u7-blues-scale-bb',
title: 'Bb Blues Scale — the jazz standard key',
type: 'exercise',
path: '/exercises/scales',
pillar: 'technique',
params: { root: 'Bb', scaleMode: 'Blues', bpm: '75', rightHandMode: 'true' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u7-blues-shuffle',
title: 'Blues Shuffle Rhythm',
type: 'exercise',
path: '/exercises/rhythm',
pillar: 'technique',
params: { patternId: 'blues-shuffle', bpm: '80' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u7-blues-licks',
title: 'Classic Blues Licks',
type: 'exercise',
path: '/exercises/licks',
pillar: 'vocabulary',
params: { category: 'blues', difficulty: 'beginner' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u7-sight-reading',
title: 'Sight-Reading — Simple Melodies',
type: 'exercise',
path: '/exercises/partition',
pillar: 'theory',
params: { range: 'C4,C5', randomMode: 'false' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
}
]
},

// ------------------------------------------------------------------
// UNIT 8 — INTERMEDIATE — ii-V-I
// Goal: The cornerstone progression of jazz + guide tones + voice leading.
// ------------------------------------------------------------------
{
id: 'unit-8',
title: 'Unit 8: ii-V-I',
description: 'Master the cornerstone progression of jazz harmony.',
difficulty: 'intermediate',
status: 'locked',
color: 'bg-orange-500',
lessons: [
{
id: 'u8-251-c',
title: 'ii-V-I in C (shell voicings)',
type: 'exercise',
path: '/exercises/two_five_ones',
pillar: 'vocabulary',
params: { key: 'C', voicing: 'shell', randomMode: 'false', bpm: '70' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u8-251-g',
title: 'ii-V-I in G (shell voicings)',
type: 'exercise',
path: '/exercises/two_five_ones',
pillar: 'vocabulary',
params: { key: 'G', voicing: 'shell', randomMode: 'false', bpm: '70' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u8-251-f',
title: 'ii-V-I in F (shell voicings)',
type: 'exercise',
path: '/exercises/two_five_ones',
pillar: 'vocabulary',
params: { key: 'F', voicing: 'shell', randomMode: 'false', bpm: '70' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u8-guide-tones',
title: 'Guide Tones (3rds & 7ths through ii-V-I)',
type: 'exercise',
path: '/exercises/two_five_ones',
pillar: 'vocabulary',
params: { key: 'C', voicing: 'guide-tones', bpm: '70' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u8-charleston',
title: 'Charleston Rhythm Pattern',
type: 'exercise',
path: '/exercises/rhythm',
pillar: 'technique',
params: { patternId: 'jazz-charleston', bpm: '80' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u8-minor-intervals-fc',
title: 'Flash Cards — Minor 2nd & 3rd',
type: 'exercise',
path: '/exercises/intervals',
pillar: 'theory',
params: { intervalType: 'minor2nd,minor3rd', randomMode: 'true', rightHandMode: 'true' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
}
]
},

// ------------------------------------------------------------------
// UNIT 9 — INTERMEDIATE — Swing Feel & Hand Independence
// Goal: Walking bass, swing comping, both hands working together.
// ------------------------------------------------------------------
{
id: 'unit-9',
title: 'Unit 9: Swing & Jazz Feel',
description: 'Develop the rhythmic feel and hand independence that define jazz piano.',
difficulty: 'intermediate',
status: 'locked',
color: 'bg-rose-500',
lessons: [
{
id: 'u9-walking-bass',
title: 'Walking Bass + Shell Voicings',
type: 'exercise',
path: '/exercises/rhythm',
pillar: 'technique',
params: { patternId: 'blues-shells', bpm: '80', strictTempo: 'true' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u9-hand-independence-1',
title: 'Hand Independence — Level 1',
type: 'exercise',
path: '/exercises/hand_independence',
pillar: 'technique',
params: { level: '1' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u9-hand-independence-2',
title: 'Hand Independence — Level 2',
type: 'exercise',
path: '/exercises/hand_independence',
pillar: 'technique',
params: { level: '2' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u9-boogie',
title: 'Boogie Woogie Bass Line',
type: 'exercise',
path: '/exercises/boogie',
pillar: 'technique',
params: { root: 'C', bpm: '80' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u9-251-bb',
title: 'ii-V-I in Bb — the jazz key',
type: 'exercise',
path: '/exercises/two_five_ones',
pillar: 'vocabulary',
params: { key: 'Bb', voicing: 'shell', randomMode: 'false', bpm: '80' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
}
]
},

// ------------------------------------------------------------------
// UNIT 10 — ADVANCED — Bebop Vocabulary
// Goal: Dorian mode, jazz licks, enclosures, turnarounds, close voicings.
// ------------------------------------------------------------------
{
id: 'unit-10',
title: 'Unit 10: Bebop Vocabulary',
description: 'Build a bebop vocabulary with enclosures, jazz licks, and target-tone soloing.',
difficulty: 'advanced',
status: 'locked',
color: 'bg-amber-500',
lessons: [
{
id: 'u10-dorian',
title: 'D Dorian Mode (all octaves)',
type: 'exercise',
path: '/exercises/scales',
pillar: 'theory',
params: { root: 'D', scaleMode: 'Dorian', bpm: '90', rightHandMode: 'false' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u10-bebop-licks',
title: 'Bebop Licks (ii-V-I)',
type: 'exercise',
path: '/exercises/licks',
pillar: 'vocabulary',
params: { category: 'bebop', difficulty: 'intermediate' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u10-enclosures',
title: 'Enclosure Patterns',
type: 'exercise',
path: '/exercises/dexterity',
pillar: 'vocabulary',
params: { mode: 'enclosure', bpm: '90' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u10-turnaround',
title: 'Turnaround Patterns (I-VI-ii-V)',
type: 'exercise',
path: '/exercises/two_five_ones',
pillar: 'vocabulary',
params: { key: 'C', voicing: 'shell', mode: 'turnaround', bpm: '90' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u10-close-voicings',
title: '4-Note Close Voicings',
type: 'exercise',
path: '/exercises/chords',
pillar: 'vocabulary',
params: { chordType: 'maj7,min7,dom7', voicing: 'close', randomMode: 'true', bpm: '80' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
}
]
},

// ------------------------------------------------------------------
// UNIT 11 — ADVANCED — Songs I: First Standards
// Goal: Apply everything to essential jazz standards.
// ------------------------------------------------------------------
{
id: 'unit-11',
title: 'Unit 11: Songs I — Standards',
description: 'Apply everything you know to classic jazz standards.',
difficulty: 'advanced',
status: 'locked',
color: 'bg-purple-500',
lessons: [
{
id: 'u11-fly-me-melody',
title: 'Fly Me To The Moon — Melody',
type: 'exercise',
path: '/exercises/song-melody',
pillar: 'repertoire',
params: { songId: 'fly-me-to-the-moon' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u11-fly-me-chords',
title: 'Fly Me To The Moon — Chords',
type: 'exercise',
path: '/exercises/song-chords',
pillar: 'repertoire',
params: { songId: 'fly-me-to-the-moon', voicing: 'shell' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u11-autumn-leaves',
title: 'Autumn Leaves — Shell Chords',
type: 'exercise',
path: '/exercises/song-chords',
pillar: 'repertoire',
params: { songId: 'autumn-leaves', voicing: 'shell' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u11-all-the-things',
title: 'All The Things You Are — Chords',
type: 'exercise',
path: '/exercises/song-chords',
pillar: 'repertoire',
params: { songId: 'all-the-things-you-are', voicing: 'close' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u11-blue-bossa',
title: 'Blue Bossa — Latin Rhythm',
type: 'exercise',
path: '/exercises/song-rhythm',
pillar: 'repertoire',
params: { songId: 'blue-bossa', patternId: 'latin-montuno' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u11-251-all-keys',
title: 'ii-V-I in 5 Keys (random)',
type: 'exercise',
path: '/exercises/two_five_ones',
pillar: 'vocabulary',
params: { voicing: 'shell', randomMode: 'true', bpm: '90' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
}
]
},

// ------------------------------------------------------------------
// UNIT 12 — ADVANCED — Modal Jazz & Mastery
// Goal: Stride, rootless voicings, modal improvisation, circle of 5ths.
// ------------------------------------------------------------------
{
id: 'unit-12',
title: 'Unit 12: Modal Jazz & Mastery',
description: 'The summit: stride piano, rootless voicings, modal improv, and the full circle of 5ths.',
difficulty: 'advanced',
status: 'locked',
color: 'bg-fuchsia-500',
lessons: [
{
id: 'u12-stride',
title: 'Stride Piano Pattern',
type: 'exercise',
path: '/exercises/hand_independence',
pillar: 'technique',
params: { level: '3', style: 'stride' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u12-rootless-voicings',
title: 'Rootless Voicings — Introduction',
type: 'exercise',
path: '/exercises/chords',
pillar: 'vocabulary',
params: { chordType: 'maj7,dom7', voicing: 'rootless', note: 'C', bpm: '70' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u12-d-dorian',
title: 'D Dorian — Full Modal Improvisation',
type: 'exercise',
path: '/exercises/scales',
pillar: 'theory',
params: { root: 'D', scaleMode: 'Dorian', bpm: '110', randomMode: 'true' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u12-eb-dorian',
title: 'Eb Dorian — Modal Modulation',
type: 'exercise',
path: '/exercises/scales',
pillar: 'theory',
params: { root: 'Eb', scaleMode: 'Dorian', bpm: '110', randomMode: 'true' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u12-so-what',
title: 'So What — Full Song',
type: 'exercise',
path: '/exercises/songs',
pillar: 'repertoire',
params: { songId: 'so-what' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
},
{
id: 'u12-circle-of-fifths',
title: 'Circle of 5ths — All Keys Workout',
type: 'exercise',
path: '/exercises/two_five_ones',
pillar: 'vocabulary',
params: { mode: 'circle-of-fifths', voicing: 'rootless', bpm: '100' },
completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 5
}
]
}
];
