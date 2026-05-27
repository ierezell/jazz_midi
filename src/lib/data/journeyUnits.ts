import type { Unit } from '../JourneyService';

export const JOURNEY_UNITS: Unit[] = [
  {
    id: 'unit-1',
    title: 'Unit 1: The Atom of Jazz',
    description: 'Master Curriculum - Unit 1: The Atom of Jazz',
    difficulty: 'beginner',
    status: 'active',
    color: 'bg-sky-500',
    lessons: [
      {
        id: 'u1-note-recognition',
        title: `Note Recognition (C, F, G)`,
        type: 'exercise',
        path: '/exercises/flashcards',
        pillar: 'theory',
        params: {type:'note',rootKey:['C','F','G'],randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 5
      },
      {
        id: 'u1-major-intervals',
        title: `Major Intervals (2nd, 3rd, 4th, 5th, 6th, 7th)`,
        type: 'exercise',
        path: '/exercises/intervals',
        pillar: 'theory',
        params: {intervalType:['major2nd','major3rd','perfect4th','perfect5th','major6th','major7th'],randomMode:'false'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u1-perfect-intervals',
        title: `Perfect Intervals (4th, 5th, Octave)`,
        type: 'exercise',
        path: '/exercises/intervals',
        pillar: 'theory',
        params: {intervalType:['perfect4th','perfect5th','perfect8ve'],randomMode:'false'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u1-intervals-ear',
        title: `Ear Training: Interval Recognition`,
        type: 'exercise',
        path: '/exercises/interval-mimicry',
        pillar: 'theory',
        params: {randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u1-chromatic-warmup-rh',
        title: `Warm-up: Chromatic Scale Right Hand`,
        type: 'exercise',
        path: '/exercises/scales',
        pillar: 'technique',
        params: {scaleMode:'Chromatic',handMode:'right',octaves:'1',direction:'up',bpm:'60',sequentialMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u1-chromatic-warmup-lh',
        title: `Warm-up: Chromatic Scale Left Hand`,
        type: 'exercise',
        path: '/exercises/scales',
        pillar: 'technique',
        params: {scaleMode:'Chromatic',handMode:'left',octaves:'1',direction:'up',bpm:'60',sequentialMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u1-sight-reading-bass',
        title: `Sight Reading: Bass Clef (C3-C4)`,
        type: 'exercise',
        path: '/exercises/partition',
        pillar: 'theory',
        params: {range:['C3','C4'],randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
    ]
  },
  {
    id: 'unit-2',
    title: 'Unit 2: The Architecture of Harmony',
    description: 'Master Curriculum - Unit 2: The Architecture of Harmony',
    difficulty: 'beginner',
    status: 'locked',
    color: 'bg-sky-500',
    lessons: [
      {
        id: 'u2-major-triads-root',
        title: `Major Triads: Root Position (C, F, G)`,
        type: 'exercise',
        path: '/exercises/chords',
        pillar: 'theory',
        params: {voicing:'full-right',chordType:'major',inversion:'0',rootKey:['C','F','G'],randomMode:'false'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u2-minor-triads-root',
        title: `Minor Triads: Root Position (C, F, G)`,
        type: 'exercise',
        path: '/exercises/chords',
        pillar: 'theory',
        params: {voicing:'full-right',chordType:'minor',inversion:'0',rootKey:['C','F','G'],randomMode:'false'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u2-triads-inversions',
        title: `Triads: All Inversions`,
        type: 'exercise',
        path: '/exercises/chords',
        pillar: 'theory',
        params: {voicing:'full-right',chordType:['major','minor'],inversion:[0,1,2],randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u2-triads-ear',
        title: `Ear Training: Triad Quality (Maj/Min)`,
        type: 'exercise',
        path: '/exercises/flashcards',
        pillar: 'theory',
        params: {allowedChordTypes:['major','minor'],allowedCardTypes:'chord'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 5
      },
      {
        id: 'u2-shell-voicings-rh',
        title: `Shell Voicings: Root + 7th (Right Hand)`,
        type: 'exercise',
        path: '/exercises/chords',
        pillar: 'technique',
        params: {voicing:'shell',chordType:['maj7','min7','dom7'],inversion:'0',randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u2-shell-voicings-lh',
        title: `Shell Voicings: Root + 7th (Left Hand)`,
        type: 'exercise',
        path: '/exercises/chords',
        pillar: 'technique',
        params: {voicing:'full-left',chordType:['maj7','min7','dom7'],inversion:'0',randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u2-ii-v-i-shell',
        title: `II-V-I Progression: Shell Voicings`,
        type: 'exercise',
        path: '/exercises/two_five_ones',
        pillar: 'vocabulary',
        params: {voicing:'shell',inversion:'0',randomMode:'true',bpm:'70'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
    ]
  },
  {
    id: 'unit-3',
    title: 'Unit 3: The Pulse of Rhythm',
    description: 'Master Curriculum - Unit 3: The Pulse of Rhythm',
    difficulty: 'beginner',
    status: 'locked',
    color: 'bg-sky-500',
    lessons: [
      {
        id: 'u3-quarter-notes',
        title: `Quarter Notes: On the Beat`,
        type: 'exercise',
        path: '/exercises/rhythm',
        pillar: 'technique',
        params: {patternId:'pop',bpm:'80'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u3-swing-8ths',
        title: `Swing Feel: Jazz Charleston`,
        type: 'exercise',
        path: '/exercises/rhythm',
        pillar: 'technique',
        params: {patternId:'jazz-charleston',bpm:'80'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u3-syncopation',
        title: `Syncopation: Funk Stabs`,
        type: 'exercise',
        path: '/exercises/rhythm',
        pillar: 'technique',
        params: {patternId:'funk-basic',bpm:'80'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u3-metronome-2-4',
        title: `Metronome: Click on 2 & 4`,
        type: 'exercise',
        path: '/exercises/rhythm',
        pillar: 'technique',
        params: {patternId:'jazz-charleston',bpm:'80'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u3-rhythm-scales',
        title: `Major Scales with Rhythm (C, F, G)`,
        type: 'exercise',
        path: '/exercises/scales',
        pillar: 'technique',
        params: {scaleMode:'Maj',rootKey:['C','F','G'],handMode:'right',octaves:'1',sequentialMode:'true',bpm:'80'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'rhythm-pack-1',
        title: `Rhythm Pack 1: Basic Subdivisions`,
        type: 'exercise',
        path: '/exercises/rhythm',
        pillar: 'technique',
        params: {patternId:'pop',bpm:'80'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'rhythm-pack-2',
        title: `Rhythm Pack 2: Syncopation`,
        type: 'exercise',
        path: '/exercises/rhythm',
        pillar: 'technique',
        params: {patternId:'funk-basic',bpm:'90'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'rhythm-pack-3',
        title: `Rhythm Pack 3: Triplets`,
        type: 'exercise',
        path: '/exercises/rhythm',
        pillar: 'technique',
        params: {patternId:'latin-montuno',bpm:'100'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
    ]
  },
  {
    id: 'unit-4',
    title: 'Unit 4: The Root (Blues)',
    description: 'Master Curriculum - Unit 4: The Root (Blues)',
    difficulty: 'beginner',
    status: 'locked',
    color: 'bg-sky-500',
    lessons: [
      {
        id: 'u4-blues-scale-c',
        title: `Blues Scale: C (Right Hand)`,
        type: 'exercise',
        path: '/exercises/scales',
        pillar: 'technique',
        params: {scaleMode:'Blues',rootKey:'C',handMode:'right',octaves:'1',direction:'up-down',bpm:'75',sequentialMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u4-blues-scale-f',
        title: `Blues Scale: F (Right Hand)`,
        type: 'exercise',
        path: '/exercises/scales',
        pillar: 'technique',
        params: {scaleMode:'Blues',rootKey:'F',handMode:'right',octaves:'1',direction:'up-down',bpm:'75',sequentialMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u4-blues-scale-bb',
        title: `Blues Scale: Bb (Right Hand)`,
        type: 'exercise',
        path: '/exercises/scales',
        pillar: 'technique',
        params: {scaleMode:'Blues',rootKey:'Bb',handMode:'right',octaves:'1',direction:'up-down',bpm:'75',sequentialMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u4-blues-shuffle',
        title: `Blues Shuffle Rhythm`,
        type: 'exercise',
        path: '/exercises/rhythm',
        pillar: 'technique',
        params: {patternId:'blues-shuffle',bpm:'90'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u4-blues-licks-beginner',
        title: `Blues Licks: Beginner`,
        type: 'exercise',
        path: '/exercises/licks',
        pillar: 'vocabulary',
        params: {category:'blues',difficulty:'beginner'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u4-12-bar-voicings',
        title: `12-Bar Blues: Shell Voicings`,
        type: 'exercise',
        path: '/exercises/chords',
        pillar: 'theory',
        params: {chordType:'dom7',voicing:'shell',inversion:'0',rootKey:'C',randomMode:'false'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'csp-4-pentatonic-scales',
        title: `Creative Scale Practice 4: Pentatonic Patterns`,
        type: 'exercise',
        path: '/exercises/scales',
        pillar: 'technique',
        params: {scaleMode:'PentatonicMajor',handMode:'right',octaves:'2',direction:'up-down',sequentialMode:'true',bpm:'100',randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'csp-5-blues-scales',
        title: `Creative Scale Practice 5: Blues Scale Patterns`,
        type: 'exercise',
        path: '/exercises/scales',
        pillar: 'technique',
        params: {scaleMode:'Blues',handMode:'right',octaves:'2',direction:'up-down',sequentialMode:'true',bpm:'100',randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'pentatonic-rh-vol1',
        title: `Pentatonic Exercises: Right Hand Vol 1`,
        type: 'exercise',
        path: '/exercises/scales',
        pillar: 'technique',
        params: {scaleMode:'PentatonicMajor',handMode:'right',octaves:'2',direction:'up-down',sequentialMode:'true',bpm:'100',randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'pentatonic-rh-vol2',
        title: `Pentatonic Exercises: Right Hand Vol 2`,
        type: 'exercise',
        path: '/exercises/scales',
        pillar: 'technique',
        params: {scaleMode:'PentatonicMinor',handMode:'right',octaves:'2',direction:'up-down',sequentialMode:'true',bpm:'100',randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'pentatonic-lh',
        title: `Pentatonic Exercises: Left Hand`,
        type: 'exercise',
        path: '/exercises/scales',
        pillar: 'technique',
        params: {scaleMode:'PentatonicMajor',handMode:'left',octaves:'2',direction:'up-down',sequentialMode:'true',bpm:'90',randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'blues-lines',
        title: `Blues Lines: Essential Patterns`,
        type: 'exercise',
        path: '/exercises/licks',
        pillar: 'vocabulary',
        params: {category:'blues',difficulty:'intermediate'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'blues-time',
        title: `Blues Time: Rhythmic Patterns`,
        type: 'exercise',
        path: '/exercises/rhythm',
        pillar: 'technique',
        params: {patternId:'blues-shuffle',bpm:'90'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'blues-voicings',
        title: `Blues Voicings: Shell & Spread`,
        type: 'exercise',
        path: '/exercises/chords',
        pillar: 'theory',
        params: {voicing:'shell',chordType:'dom7',inversion:'0',randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
    ]
  },
  {
    id: 'unit-5',
    title: 'Unit 5: Diatonic Systems',
    description: 'Master Curriculum - Unit 5: Diatonic Systems',
    difficulty: 'advanced',
    status: 'locked',
    color: 'bg-sky-500',
    lessons: [
      {
        id: 'u5-major-scale-c',
        title: `Major Scale: C (Hands Separate)`,
        type: 'exercise',
        path: '/exercises/scales',
        pillar: 'technique',
        params: {scaleMode:'Maj',rootKey:'C',handMode:'right',octaves:'1',direction:'up-down',sequentialMode:'true',bpm:'80'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u5-major-scale-f',
        title: `Major Scale: F (Hands Separate)`,
        type: 'exercise',
        path: '/exercises/scales',
        pillar: 'technique',
        params: {scaleMode:'Maj',rootKey:'F',handMode:'right',octaves:'1',direction:'up-down',sequentialMode:'true',bpm:'80'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u5-major-scale-bb',
        title: `Major Scale: Bb (Hands Separate)`,
        type: 'exercise',
        path: '/exercises/scales',
        pillar: 'technique',
        params: {scaleMode:'Maj',rootKey:'Bb',handMode:'right',octaves:'1',direction:'up-down',sequentialMode:'true',bpm:'80'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u5-major-scales-both-hands',
        title: `Major Scales: Both Hands (C, F, Bb)`,
        type: 'exercise',
        path: '/exercises/scales',
        pillar: 'technique',
        params: {scaleMode:'Maj',rootKey:['C','F','Bb'],handMode:'both',octaves:'1',direction:'up-down',sequentialMode:'true',bpm:'70'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u5-diatonic-triads-c',
        title: `Diatonic Triads: Key of C`,
        type: 'exercise',
        path: '/exercises/chords',
        pillar: 'theory',
        params: {voicing:'full-right',chordType:['major','minor'],rootKey:['C','D','E','F','G','A','B'],inversion:'0',randomMode:'false'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u5-diatonic-7ths-c',
        title: `Diatonic 7th Chords: Key of C`,
        type: 'exercise',
        path: '/exercises/chords',
        pillar: 'theory',
        params: {voicing:'shell',chordType:['maj7','min7','dom7'],rootKey:['C','D','E','F','G','A','B'],inversion:'0',randomMode:'false'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'ccp-1-chord-sequences',
        title: `Creative Chord Practice 1: Basic Sequences`,
        type: 'exercise',
        path: '/exercises/chords',
        pillar: 'theory',
        params: {voicing:'shell',chordType:['maj7','min7','dom7'],inversion:'0',randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'ccp-2-chord-inversions',
        title: `Creative Chord Practice 2: Inversion Mastery`,
        type: 'exercise',
        path: '/exercises/chords',
        pillar: 'theory',
        params: {voicing:'shell',chordType:['maj7','min7','dom7'],inversion:[0,1,2],randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'csp-1-major-scales',
        title: `Creative Scale Practice 1: Major Scale Patterns`,
        type: 'exercise',
        path: '/exercises/scales',
        pillar: 'technique',
        params: {scaleMode:'Maj',handMode:'right',octaves:'2',direction:'up-down',sequentialMode:'true',bpm:'80',randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
    ]
  },
  {
    id: 'unit-6',
    title: 'Unit 6: Essential Jazz Standards',
    description: 'Master Curriculum - Unit 6: Essential Jazz Standards',
    difficulty: 'advanced',
    status: 'locked',
    color: 'bg-sky-500',
    lessons: [
      {
        id: 'u6-autumn-leaves-chords',
        title: `Autumn Leaves: Minor ii-V-i (Shell Voicings)`,
        type: 'exercise',
        path: '/exercises/song-chords',
        pillar: 'repertoire',
        params: {songId:'autumn-leaves',voicing:'shell',inversion:'0'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u6-autumn-leaves-melody',
        title: `Autumn Leaves: Melody with LH Shells`,
        type: 'exercise',
        path: '/exercises/partition',
        pillar: 'repertoire',
        params: {mode:'melody-lh',songId:'autumn-leaves',range:'C3,C5'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u6-summertime-chords',
        title: `Summertime: Modal Chords (Shell Voicings)`,
        type: 'exercise',
        path: '/exercises/song-chords',
        pillar: 'repertoire',
        params: {songId:'summertime',voicing:'shell',inversion:'0'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u6-misty-chords',
        title: `Misty: Ballad Chords (Shell Voicings)`,
        type: 'exercise',
        path: '/exercises/song-chords',
        pillar: 'repertoire',
        params: {songId:'misty',voicing:'shell',inversion:'0'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'song-quiet-nights-voicings',
        title: `Quiet Nights: Modal Voicings`,
        type: 'exercise',
        path: '/exercises/song-chords',
        pillar: 'repertoire',
        params: {songId:'quiet-nights',voicing:'shell',inversion:'0'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
    ]
  },
  {
    id: 'unit-7',
    title: 'Unit 7: The Journey on the Train',
    description: 'Master Curriculum - Unit 7: The Journey on the Train',
    difficulty: 'advanced',
    status: 'locked',
    color: 'bg-sky-500',
    lessons: [
      {
        id: 'u7-train-chords-shell',
        title: `Take the A Train: Shell Voicings`,
        type: 'exercise',
        path: '/exercises/song-chords',
        pillar: 'repertoire',
        params: {songId:'take-the-a-train',voicing:'shell',inversion:'0'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u7-train-enclosures',
        title: `Enclosures: Target 3rds & 7ths`,
        type: 'exercise',
        path: '/exercises/enclosure',
        pillar: 'vocabulary',
        params: {randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u7-train-triplets',
        title: `Triplets & Turns: Dexterity`,
        type: 'exercise',
        path: '/exercises/dexterity',
        pillar: 'vocabulary',
        params: {mode:'thirds',hand:'right'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u7-train-licks',
        title: `Take the A Train: Vocabulary Licks`,
        type: 'exercise',
        path: '/exercises/licks',
        pillar: 'vocabulary',
        params: {category:'jazz',difficulty:'intermediate'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
    ]
  },
  {
    id: 'unit-8',
    title: 'Unit 8: The Velvet Doll',
    description: 'Master Curriculum - Unit 8: The Velvet Doll',
    difficulty: 'advanced',
    status: 'locked',
    color: 'bg-sky-500',
    lessons: [
      {
        id: 'u8-doll-chords-drop2',
        title: `Satin Doll: Drop 2 Voicings`,
        type: 'exercise',
        path: '/exercises/song-chords',
        pillar: 'repertoire',
        params: {songId:'satin-doll',voicing:'rootless-a',inversion:'0'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u8-drop2-practice',
        title: `Drop 2 Voicings: Major 7th Chords`,
        type: 'exercise',
        path: '/exercises/chords',
        pillar: 'theory',
        params: {voicing:'rootless-a',chordType:'maj7',inversion:[0,1,2,3],randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u8-drop2-minor',
        title: `Drop 2 Voicings: Minor 7th Chords`,
        type: 'exercise',
        path: '/exercises/chords',
        pillar: 'theory',
        params: {voicing:'rootless-a',chordType:'min7',inversion:[0,1,2,3],randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u8-doll-rhythm',
        title: `Satin Doll: Rhythmic Comping`,
        type: 'exercise',
        path: '/exercises/rhythm',
        pillar: 'technique',
        params: {patternId:'jazz-charleston',bpm:'120'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'ccp-3-rootless-voicings',
        title: `Creative Chord Practice 3: Rootless Voicings`,
        type: 'exercise',
        path: '/exercises/chords',
        pillar: 'theory',
        params: {voicing:'rootless-a',chordType:['maj7','min7','dom7'],inversion:[0,1,2],randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'ccp-4-spread-voicings',
        title: `Creative Chord Practice 4: Spread Voicings`,
        type: 'exercise',
        path: '/exercises/chords',
        pillar: 'theory',
        params: {voicing:'1735',chordType:['maj7','min7'],inversion:'0',randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
    ]
  },
  {
    id: 'unit-9',
    title: 'Unit 9: There Will Be Another',
    description: 'Master Curriculum - Unit 9: There Will Be Another',
    difficulty: 'advanced',
    status: 'locked',
    color: 'bg-sky-500',
    lessons: [
      {
        id: 'u9-another-chords',
        title: `There Will Be Another You: Shell Voicings`,
        type: 'exercise',
        path: '/exercises/song-chords',
        pillar: 'repertoire',
        params: {songId:'there-will-never-be-another-you',voicing:'shell',inversion:'0'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u9-locked-hands-maj7',
        title: `Locked Hands: Major 7th Chords`,
        type: 'exercise',
        path: '/exercises/chords',
        pillar: 'theory',
        params: {voicing:'full-right',chordType:'maj7',inversion:'0',randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u9-locked-hands-min7',
        title: `Locked Hands: Minor 7th Chords`,
        type: 'exercise',
        path: '/exercises/chords',
        pillar: 'theory',
        params: {voicing:'full-right',chordType:'min7',inversion:'0',randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
    ]
  },
  {
    id: 'unit-10',
    title: 'Unit 10: Rhythmic Independence',
    description: 'Master Curriculum - Unit 10: Rhythmic Independence',
    difficulty: 'advanced',
    status: 'locked',
    color: 'bg-sky-500',
    lessons: [
      {
        id: 'u10-hand-independence-1',
        title: `Hand Independence: Level 1 (Shell + Scale)`,
        type: 'exercise',
        path: '/exercises/hand_independence',
        pillar: 'technique',
        params: {level:'1'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u10-hand-independence-2',
        title: `Hand Independence: Level 2 (Walking Bass)`,
        type: 'exercise',
        path: '/exercises/hand_independence',
        pillar: 'technique',
        params: {level:'2'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u10-dorian-scales',
        title: `Dorian Scales (All Keys)`,
        type: 'exercise',
        path: '/exercises/scales',
        pillar: 'theory',
        params: {scaleMode:'Dorian',handMode:'right',octaves:'1',direction:'up-down',sequentialMode:'true',bpm:'80',randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u10-mixolydian-scales',
        title: `Mixolydian Scales (All Keys)`,
        type: 'exercise',
        path: '/exercises/scales',
        pillar: 'theory',
        params: {scaleMode:'Mixolydian',handMode:'right',octaves:'1',direction:'up-down',sequentialMode:'true',bpm:'80',randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'csp-2-dorian-scales',
        title: `Creative Scale Practice 2: Dorian Patterns`,
        type: 'exercise',
        path: '/exercises/scales',
        pillar: 'technique',
        params: {scaleMode:'Dorian',handMode:'right',octaves:'2',direction:'up-down',sequentialMode:'true',bpm:'90',randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'csp-3-mixolydian-scales',
        title: `Creative Scale Practice 3: Mixolydian Patterns`,
        type: 'exercise',
        path: '/exercises/scales',
        pillar: 'technique',
        params: {scaleMode:'Mixolydian',handMode:'right',octaves:'2',direction:'up-down',sequentialMode:'true',bpm:'90',randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
    ]
  },
  {
    id: 'unit-11',
    title: 'Unit 11: Reharmonization & Contemporary Harmony',
    description: 'Master Curriculum - Unit 11: Reharmonization & Contemporary Harmony',
    difficulty: 'advanced',
    status: 'locked',
    color: 'bg-sky-500',
    lessons: [
      {
        id: 'u11-tritone-subs',
        title: `Tritone Substitutions: Dominant 7ths`,
        type: 'exercise',
        path: '/exercises/two_five_ones',
        pillar: 'theory',
        params: {voicing:'rootless-a',inversion:'0',randomMode:'true',bpm:'80'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u11-ii-v-subs',
        title: `II-V Substitutions`,
        type: 'exercise',
        path: '/exercises/two_five_ones',
        pillar: 'theory',
        params: {voicing:'rootless-b',inversion:'0',randomMode:'true',bpm:'80'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u11-minor-major-7',
        title: `Minor-Major 7th Chords`,
        type: 'exercise',
        path: '/exercises/chords',
        pillar: 'vocabulary',
        params: {voicing:'rootless-a',chordType:'minMaj7',inversion:'0',randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u11-altered-dominants',
        title: `Altered Dominant Chords`,
        type: 'exercise',
        path: '/exercises/chords',
        pillar: 'vocabulary',
        params: {voicing:'rootless-a',chordType:'7alt',inversion:'0',randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'ccp-5-altered-chords',
        title: `Creative Chord Practice 5: Altered Dominants`,
        type: 'exercise',
        path: '/exercises/chords',
        pillar: 'theory',
        params: {voicing:'rootless-a',chordType:'7alt',inversion:[0,1,2],randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'ccp-6-polychords',
        title: `Creative Chord Practice 6: Polychords`,
        type: 'exercise',
        path: '/exercises/chords',
        pillar: 'theory',
        params: {voicing:'full-right',chordType:['maj7','min7'],inversion:'0',randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'ccp-7-contemporary-voicings',
        title: `Creative Chord Practice 7: Contemporary Voicings`,
        type: 'exercise',
        path: '/exercises/chords',
        pillar: 'theory',
        params: {voicing:'rootless-b',chordType:['maj7','min7','dom7'],inversion:[0,1,2],randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
    ]
  },
  {
    id: 'unit-12',
    title: 'Unit 12: American Roots',
    description: 'Master Curriculum - Unit 12: American Roots',
    difficulty: 'advanced',
    status: 'locked',
    color: 'bg-sky-500',
    lessons: [
      {
        id: 'u12-gospel-cadences',
        title: `Gospel Cadences: 2-5-1 with Extensions`,
        type: 'exercise',
        path: '/exercises/two_five_ones',
        pillar: 'theory',
        params: {voicing:'full-right',inversion:'0',randomMode:'true',bpm:'70'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u12-stride-lh',
        title: `Stride Piano: Left Hand Pattern`,
        type: 'exercise',
        path: '/exercises/hand_independence',
        pillar: 'technique',
        params: {level:'2'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u12-boogie-woogie',
        title: `Boogie Woogie Patterns`,
        type: 'exercise',
        path: '/exercises/rhythm',
        pillar: 'technique',
        params: {patternId:'blues-shuffle',bpm:'90'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'gospel-basics',
        title: `Gospel Piano: Basic Cadences`,
        type: 'exercise',
        path: '/exercises/two_five_ones',
        pillar: 'theory',
        params: {voicing:'full-right',inversion:'0',randomMode:'true',bpm:'70'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'gospel-chord-runs',
        title: `Gospel Piano: Chord Runs`,
        type: 'exercise',
        path: '/exercises/licks',
        pillar: 'vocabulary',
        params: {category:'jazz',difficulty:'intermediate'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'stride-basics',
        title: `Stride Piano: Basic Pattern`,
        type: 'exercise',
        path: '/exercises/hand_independence',
        pillar: 'technique',
        params: {level:'2'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'stride-advanced',
        title: `Stride Piano: Advanced Patterns`,
        type: 'exercise',
        path: '/exercises/hand_independence',
        pillar: 'technique',
        params: {level:'2'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
    ]
  },
  {
    id: 'unit-13',
    title: 'Unit 13: Brazilian & Afro-Cuban',
    description: 'Master Curriculum - Unit 13: Brazilian & Afro-Cuban',
    difficulty: 'advanced',
    status: 'locked',
    color: 'bg-sky-500',
    lessons: [
      {
        id: 'u13-latin-montuno',
        title: `Latin Montuno: Cuban Pattern`,
        type: 'exercise',
        path: '/exercises/rhythm',
        pillar: 'technique',
        params: {patternId:'latin-montuno',bpm:'110'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u13-herbie-funk',
        title: `Herbie Hancock Funk`,
        type: 'exercise',
        path: '/exercises/rhythm',
        pillar: 'technique',
        params: {patternId:'herbie-funk',bpm:'90'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'latin-bossa-nova',
        title: `Latin Rhythms: Bossa Nova`,
        type: 'exercise',
        path: '/exercises/rhythm',
        pillar: 'technique',
        params: {patternId:'latin-montuno',bpm:'110'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'latin-samba',
        title: `Latin Rhythms: Samba`,
        type: 'exercise',
        path: '/exercises/rhythm',
        pillar: 'technique',
        params: {patternId:'latin-montuno',bpm:'120'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'latin-baiao',
        title: `Latin Rhythms: Baião`,
        type: 'exercise',
        path: '/exercises/rhythm',
        pillar: 'technique',
        params: {patternId:'latin-montuno',bpm:'110'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'latin-partido-alto',
        title: `Latin Rhythms: Partido Alto`,
        type: 'exercise',
        path: '/exercises/rhythm',
        pillar: 'technique',
        params: {patternId:'latin-montuno',bpm:'110'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
    ]
  },
  {
    id: 'unit-14',
    title: 'Unit 14: Rhythm Changes Mastery',
    description: 'Master Curriculum - Unit 14: Rhythm Changes Mastery',
    difficulty: 'advanced',
    status: 'locked',
    color: 'bg-sky-500',
    lessons: [
      {
        id: 'u14-rhythm-changes-a',
        title: `Rhythm Changes: A Section (I-VI-II-V)`,
        type: 'exercise',
        path: '/exercises/two_five_ones',
        pillar: 'theory',
        params: {voicing:'rootless-a',inversion:'0',randomMode:'true',bpm:'100'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u14-rhythm-changes-bridge',
        title: `Rhythm Changes: Bridge (III-VI-II-V)`,
        type: 'exercise',
        path: '/exercises/two_five_ones',
        pillar: 'theory',
        params: {voicing:'rootless-b',inversion:'0',randomMode:'true',bpm:'100'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u14-rhythm-licks',
        title: `Rhythm Changes: Bebop Lines`,
        type: 'exercise',
        path: '/exercises/licks',
        pillar: 'vocabulary',
        params: {category:'bebop',difficulty:'advanced'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'song-oleo-voicings',
        title: `Oleo: Chord Voicings`,
        type: 'exercise',
        path: '/exercises/song-chords',
        pillar: 'repertoire',
        params: {songId:'oleo',voicing:'rootless-a',inversion:'0'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'song-oleo-lines',
        title: `Oleo: Bebop Lines`,
        type: 'exercise',
        path: '/exercises/licks',
        pillar: 'vocabulary',
        params: {category:'bebop',difficulty:'advanced'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
    ]
  },
  {
    id: 'unit-15',
    title: 'Unit 15: The Bebop Architects',
    description: 'Master Curriculum - Unit 15: The Bebop Architects',
    difficulty: 'advanced',
    status: 'locked',
    color: 'bg-sky-500',
    lessons: [
      {
        id: 'u15-bebop-scales',
        title: `Bebop Scales: Major & Dominant`,
        type: 'exercise',
        path: '/exercises/scales',
        pillar: 'theory',
        params: {scaleMode:['BebopMajor','BebopDominant'],handMode:'right',octaves:'1',direction:'up-down',sequentialMode:'true',bpm:'100',randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u15-parker-licks',
        title: `Charlie Parker Style: Blues Licks`,
        type: 'exercise',
        path: '/exercises/licks',
        pillar: 'vocabulary',
        params: {category:'bebop',difficulty:'advanced'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u15-transcription-study',
        title: `Transcription: Sight Reading Advanced`,
        type: 'exercise',
        path: '/exercises/partition',
        pillar: 'repertoire',
        params: {range:['C3','C6'],randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'csp-6-bebop-scales',
        title: `Creative Scale Practice 6: Bebop Scale Patterns`,
        type: 'exercise',
        path: '/exercises/scales',
        pillar: 'technique',
        params: {scaleMode:['BebopMajor','BebopDominant'],handMode:'right',octaves:'2',direction:'up-down',sequentialMode:'true',bpm:'110',randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'csp-7-whole-tone-scales',
        title: `Creative Scale Practice 7: Whole Tone Patterns`,
        type: 'exercise',
        path: '/exercises/scales',
        pillar: 'technique',
        params: {scaleMode:'WholeTone',handMode:'right',octaves:'2',direction:'up-down',sequentialMode:'true',bpm:'100',randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'transcription-parker',
        title: `Transcription: Charlie Parker Style`,
        type: 'exercise',
        path: '/exercises/partition',
        pillar: 'repertoire',
        params: {range:['C3','C6'],randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'transcription-monk',
        title: `Transcription: Thelonious Monk Style`,
        type: 'exercise',
        path: '/exercises/partition',
        pillar: 'repertoire',
        params: {range:['C3','C6'],randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'transcription-golson',
        title: `Transcription: Benny Golson Style`,
        type: 'exercise',
        path: '/exercises/partition',
        pillar: 'repertoire',
        params: {range:['C3','C6'],randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
    ]
  },
  {
    id: 'unit-16',
    title: 'Unit 16: The Art of the Ballad',
    description: 'Master Curriculum - Unit 16: The Art of the Ballad',
    difficulty: 'advanced',
    status: 'locked',
    color: 'bg-sky-500',
    lessons: [
      {
        id: 'u16-ballad-rubato',
        title: `Ballad Playing: Pop Groove`,
        type: 'exercise',
        path: '/exercises/rhythm',
        pillar: 'technique',
        params: {patternId:'pop',bpm:'60'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u16-ballad-voicings',
        title: `Ballad Voicings: Spread Voicings`,
        type: 'exercise',
        path: '/exercises/chords',
        pillar: 'theory',
        params: {voicing:'1735',chordType:['maj7','min7'],inversion:'0',randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u16-melody-decoration',
        title: `Melody Decoration: Turns & Graces`,
        type: 'exercise',
        path: '/exercises/dexterity',
        pillar: 'vocabulary',
        params: {mode:'chromatic',hand:'right'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'song-when-i-fall-in-love-voicings',
        title: `When I Fall In Love: Ballad Voicings`,
        type: 'exercise',
        path: '/exercises/song-chords',
        pillar: 'repertoire',
        params: {songId:'when-i-fall-in-love',voicing:'1735',inversion:'0'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
    ]
  },
  {
    id: 'unit-17',
    title: 'Unit 17: Transcription Analysis',
    description: 'Master Curriculum - Unit 17: Transcription Analysis',
    difficulty: 'advanced',
    status: 'locked',
    color: 'bg-sky-500',
    lessons: [
      {
        id: 'u17-sight-reading-advanced',
        title: `Advanced Sight Reading: Full Range`,
        type: 'exercise',
        path: '/exercises/partition',
        pillar: 'repertoire',
        params: {range:['C2','C6'],randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 3
      },
      {
        id: 'u17-flashcards-mixed',
        title: `Mixed Flashcards: All Skills`,
        type: 'exercise',
        path: '/exercises/flashcards',
        pillar: 'theory',
        params: {allowedCardTypes:['note','interval','chord','scale','II-V-I'],randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 10
      },
      {
        id: 'u17-comprehensive-review',
        title: `Comprehensive Review: All Units`,
        type: 'exercise',
        path: '/exercises/flashcards',
        pillar: 'theory',
        params: {allowedCardTypes:['note','interval','chord','scale','II-V-I'],allowedChordTypes:['major','minor','maj7','min7','dom7'],randomMode:'true'},
        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: 15
      },
    ]
  },
];
