import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase: any = null;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('Warning: Missing Supabase URL or Service Role Key in environment variables. Will skip DB upsert and only generate journeyUnits.ts.');
} else {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

const CUSTOM_EXERCISES = [
  // ==========================================
  // PART 1: THE FOUNDATION (Units 1 - 4)
  // ==========================================

  // UNIT 1: The Atom of Jazz - Intervals & Ear Training
  { 
    id: 'u1-note-recognition', title: 'Note Recognition (C, F, G)', unit: 1, category: 'theory', difficulty: 'beginner', pillar: 'theory',
    path: '/exercises/flashcards', requiredPerfectCompletions: 5, 
    params: { type: 'note', rootKey: ['C', 'F', 'G'], randomMode: 'true' } 
  },
  { 
    id: 'u1-major-intervals', title: 'Major Intervals (2nd, 3rd, 4th, 5th, 6th, 7th)', unit: 1, category: 'theory', difficulty: 'beginner', pillar: 'theory',
    path: '/exercises/intervals', requiredPerfectCompletions: 3, 
    params: { intervalType: ['major2nd', 'major3rd', 'perfect4th', 'perfect5th', 'major6th', 'major7th'], randomMode: 'false' } 
  },
  { 
    id: 'u1-perfect-intervals', title: 'Perfect Intervals (4th, 5th, Octave)', unit: 1, category: 'theory', difficulty: 'beginner', pillar: 'theory',
    path: '/exercises/intervals', requiredPerfectCompletions: 3, 
    params: { intervalType: ['perfect4th', 'perfect5th', 'perfect8ve'], randomMode: 'false' } 
  },
  { 
    id: 'u1-intervals-ear', title: 'Ear Training: Interval Recognition', unit: 1, category: 'theory', difficulty: 'beginner', pillar: 'theory',
    path: '/exercises/interval-mimicry', requiredPerfectCompletions: 3, 
    params: { randomMode: 'true' } 
  },
  { 
    id: 'u1-chromatic-warmup-rh', title: 'Warm-up: Chromatic Scale Right Hand', unit: 1, category: 'technique', difficulty: 'beginner', pillar: 'technique',
    path: '/exercises/scales', requiredPerfectCompletions: 3, 
    params: { scaleMode: 'Chromatic', handMode: 'right', octaves: '1', direction: 'up', bpm: '60', sequentialMode: 'true' } 
  },
  { 
    id: 'u1-chromatic-warmup-lh', title: 'Warm-up: Chromatic Scale Left Hand', unit: 1, category: 'technique', difficulty: 'beginner', pillar: 'technique',
    path: '/exercises/scales', requiredPerfectCompletions: 3, 
    params: { scaleMode: 'Chromatic', handMode: 'left', octaves: '1', direction: 'up', bpm: '60', sequentialMode: 'true' } 
  },
  { 
    id: 'u1-sight-reading-bass', title: 'Sight Reading: Bass Clef (C3-C4)', unit: 1, category: 'exercise', difficulty: 'beginner', pillar: 'theory',
    path: '/exercises/partition', requiredPerfectCompletions: 3, 
    params: { range: ['C3', 'C4'], randomMode: 'true' } 
  },

  // UNIT 2: The Architecture of Harmony - Triads & Shell Voicings
  { 
    id: 'u2-major-triads-root', title: 'Major Triads: Root Position (C, F, G)', unit: 2, category: 'theory', difficulty: 'beginner', pillar: 'theory',
    path: '/exercises/chords', requiredPerfectCompletions: 3, 
    params: { voicing: 'full-right', chordType: 'major', inversion: '0', rootKey: ['C', 'F', 'G'], randomMode: 'false' } 
  },
  { 
    id: 'u2-minor-triads-root', title: 'Minor Triads: Root Position (C, F, G)', unit: 2, category: 'theory', difficulty: 'beginner', pillar: 'theory',
    path: '/exercises/chords', requiredPerfectCompletions: 3, 
    params: { voicing: 'full-right', chordType: 'minor', inversion: '0', rootKey: ['C', 'F', 'G'], randomMode: 'false' } 
  },
  { 
    id: 'u2-triads-inversions', title: 'Triads: All Inversions', unit: 2, category: 'theory', difficulty: 'beginner', pillar: 'theory',
    path: '/exercises/chords', requiredPerfectCompletions: 3, 
    params: { voicing: 'full-right', chordType: ['major', 'minor'], inversion: [0, 1, 2], randomMode: 'true' } 
  },
  { 
    id: 'u2-triads-ear', title: 'Ear Training: Triad Quality (Maj/Min)', unit: 2, category: 'theory', difficulty: 'beginner', pillar: 'theory',
    path: '/exercises/flashcards', requiredPerfectCompletions: 5, 
    params: { allowedChordTypes: ['major', 'minor'], allowedCardTypes: 'chord' } 
  },
  { 
    id: 'u2-shell-voicings-rh', title: 'Shell Voicings: Root + 7th (Right Hand)', unit: 2, category: 'technique', difficulty: 'beginner', pillar: 'technique',
    path: '/exercises/chords', requiredPerfectCompletions: 3, 
    params: { voicing: 'shell', chordType: ['maj7', 'min7', 'dom7'], inversion: '0', randomMode: 'true' } 
  },
  { 
    id: 'u2-shell-voicings-lh', title: 'Shell Voicings: Root + 7th (Left Hand)', unit: 2, category: 'technique', difficulty: 'beginner', pillar: 'technique',
    path: '/exercises/chords', requiredPerfectCompletions: 3, 
    params: { voicing: 'full-left', chordType: ['maj7', 'min7', 'dom7'], inversion: '0', randomMode: 'true' } 
  },
  { 
    id: 'u2-ii-v-i-shell', title: 'II-V-I Progression: Shell Voicings', unit: 2, category: 'theory', difficulty: 'beginner', pillar: 'vocabulary',
    path: '/exercises/two_five_ones', requiredPerfectCompletions: 3, 
    params: { voicing: 'shell', inversion: '0', randomMode: 'true', bpm: '70' } 
  },

  // UNIT 3: The Pulse of Rhythm - Swing & Syncopation
  { 
    id: 'u3-quarter-notes', title: 'Quarter Notes: On the Beat', unit: 3, category: 'rhythm', difficulty: 'beginner', pillar: 'technique',
    path: '/exercises/rhythm', requiredPerfectCompletions: 3, 
    params: { patternId: 'pop', bpm: '80' } 
  },
  { 
    id: 'u3-swing-8ths', title: 'Swing Feel: Jazz Charleston', unit: 3, category: 'rhythm', difficulty: 'beginner', pillar: 'technique',
    path: '/exercises/rhythm', requiredPerfectCompletions: 3, 
    params: { patternId: 'jazz-charleston', bpm: '80' } 
  },
  { 
    id: 'u3-syncopation', title: 'Syncopation: Funk Stabs', unit: 3, category: 'rhythm', difficulty: 'beginner', pillar: 'technique',
    path: '/exercises/rhythm', requiredPerfectCompletions: 3, 
    params: { patternId: 'funk-basic', bpm: '80' } 
  },
  { 
    id: 'u3-metronome-2-4', title: 'Metronome: Click on 2 & 4', unit: 3, category: 'rhythm', difficulty: 'beginner', pillar: 'technique',
    path: '/exercises/rhythm', requiredPerfectCompletions: 3, 
    params: { patternId: 'jazz-charleston', bpm: '80' } 
  },
  { 
    id: 'u3-rhythm-scales', title: 'Major Scales with Rhythm (C, F, G)', unit: 3, category: 'technique', difficulty: 'beginner', pillar: 'technique',
    path: '/exercises/scales', requiredPerfectCompletions: 3, 
    params: { scaleMode: 'Maj', rootKey: ['C', 'F', 'G'], handMode: 'right', octaves: '1', sequentialMode: 'true', bpm: '80' } 
  },

  // UNIT 4: The Root - Blues Foundation
  { 
    id: 'u4-blues-scale-c', title: 'Blues Scale: C (Right Hand)', unit: 4, category: 'theory', difficulty: 'beginner', pillar: 'technique',
    path: '/exercises/scales', requiredPerfectCompletions: 3, 
    params: { scaleMode: 'Blues', rootKey: 'C', handMode: 'right', octaves: '1', direction: 'up-down', bpm: '75', sequentialMode: 'true' } 
  },
  { 
    id: 'u4-blues-scale-f', title: 'Blues Scale: F (Right Hand)', unit: 4, category: 'theory', difficulty: 'beginner', pillar: 'technique',
    path: '/exercises/scales', requiredPerfectCompletions: 3, 
    params: { scaleMode: 'Blues', rootKey: 'F', handMode: 'right', octaves: '1', direction: 'up-down', bpm: '75', sequentialMode: 'true' } 
  },
  { 
    id: 'u4-blues-scale-bb', title: 'Blues Scale: Bb (Right Hand)', unit: 4, category: 'theory', difficulty: 'beginner', pillar: 'technique',
    path: '/exercises/scales', requiredPerfectCompletions: 3, 
    params: { scaleMode: 'Blues', rootKey: 'Bb', handMode: 'right', octaves: '1', direction: 'up-down', bpm: '75', sequentialMode: 'true' } 
  },
  { 
    id: 'u4-blues-shuffle', title: 'Blues Shuffle Rhythm', unit: 4, category: 'rhythm', difficulty: 'beginner', pillar: 'technique',
    path: '/exercises/rhythm', requiredPerfectCompletions: 3, 
    params: { patternId: 'blues-shuffle', bpm: '90' } 
  },
  { 
    id: 'u4-blues-licks-beginner', title: 'Blues Licks: Beginner', unit: 4, category: 'lick', difficulty: 'beginner', pillar: 'vocabulary',
    path: '/exercises/licks', requiredPerfectCompletions: 3, 
    params: { category: 'blues', difficulty: 'beginner' } 
  },
  { 
    id: 'u4-12-bar-voicings', title: '12-Bar Blues: Shell Voicings', unit: 4, category: 'theory', difficulty: 'beginner', pillar: 'theory',
    path: '/exercises/chords', requiredPerfectCompletions: 3, 
    params: { chordType: 'dom7', voicing: 'shell', inversion: '0', rootKey: 'C', randomMode: 'false' } 
  },

  // ==========================================
  // PART 2: THE VAULT LIBRARY
  // ==========================================

  // UNIT 5: Diatonic Systems - Major Scale & Diatonic Harmony
  { 
    id: 'u5-major-scale-c', title: 'Major Scale: C (Hands Separate)', unit: 5, category: 'technique', difficulty: 'beginner', pillar: 'technique',
    path: '/exercises/scales', requiredPerfectCompletions: 3, 
    params: { scaleMode: 'Maj', rootKey: 'C', handMode: 'right', octaves: '1', direction: 'up-down', sequentialMode: 'true', bpm: '80' } 
  },
  { 
    id: 'u5-major-scale-f', title: 'Major Scale: F (Hands Separate)', unit: 5, category: 'technique', difficulty: 'beginner', pillar: 'technique',
    path: '/exercises/scales', requiredPerfectCompletions: 3, 
    params: { scaleMode: 'Maj', rootKey: 'F', handMode: 'right', octaves: '1', direction: 'up-down', sequentialMode: 'true', bpm: '80' } 
  },
  { 
    id: 'u5-major-scale-bb', title: 'Major Scale: Bb (Hands Separate)', unit: 5, category: 'technique', difficulty: 'beginner', pillar: 'technique',
    path: '/exercises/scales', requiredPerfectCompletions: 3, 
    params: { scaleMode: 'Maj', rootKey: 'Bb', handMode: 'right', octaves: '1', direction: 'up-down', sequentialMode: 'true', bpm: '80' } 
  },
  { 
    id: 'u5-major-scales-both-hands', title: 'Major Scales: Both Hands (C, F, Bb)', unit: 5, category: 'technique', difficulty: 'intermediate', pillar: 'technique',
    path: '/exercises/scales', requiredPerfectCompletions: 3, 
    params: { scaleMode: 'Maj', rootKey: ['C', 'F', 'Bb'], handMode: 'both', octaves: '1', direction: 'up-down', sequentialMode: 'true', bpm: '70' } 
  },
  { 
    id: 'u5-diatonic-triads-c', title: 'Diatonic Triads: Key of C', unit: 5, category: 'theory', difficulty: 'beginner', pillar: 'theory',
    path: '/exercises/chords', requiredPerfectCompletions: 3, 
    params: { voicing: 'full-right', chordType: ['major', 'minor'], rootKey: ['C', 'D', 'E', 'F', 'G', 'A', 'B'], inversion: '0', randomMode: 'false' } 
  },
  { 
    id: 'u5-diatonic-7ths-c', title: 'Diatonic 7th Chords: Key of C', unit: 5, category: 'theory', difficulty: 'intermediate', pillar: 'theory',
    path: '/exercises/chords', requiredPerfectCompletions: 3, 
    params: { voicing: 'shell', chordType: ['maj7', 'min7', 'dom7'], rootKey: ['C', 'D', 'E', 'F', 'G', 'A', 'B'], inversion: '0', randomMode: 'false' } 
  },

  // UNIT 6: Essential Jazz Standards - First Repertoire
  { 
    id: 'u6-autumn-leaves-chords', title: 'Autumn Leaves: Minor ii-V-i (Shell Voicings)', unit: 6, category: 'song', difficulty: 'intermediate', pillar: 'repertoire',
    path: '/exercises/song-chords', requiredPerfectCompletions: 3, 
    params: { songId: 'autumn-leaves', voicing: 'shell', inversion: '0' } 
  },
  { 
    id: 'u6-autumn-leaves-melody', title: 'Autumn Leaves: Melody with LH Shells', unit: 6, category: 'song', difficulty: 'intermediate', pillar: 'repertoire',
    path: '/exercises/partition', requiredPerfectCompletions: 3, 
    params: { mode: 'melody-lh', songId: 'autumn-leaves', range: 'C3,C5' } 
  },
  { 
    id: 'u6-summertime-chords', title: 'Summertime: Modal Chords (Shell Voicings)', unit: 6, category: 'song', difficulty: 'intermediate', pillar: 'repertoire',
    path: '/exercises/song-chords', requiredPerfectCompletions: 3, 
    params: { songId: 'summertime', voicing: 'shell', inversion: '0' } 
  },
  { 
    id: 'u6-misty-chords', title: 'Misty: Ballad Chords (Shell Voicings)', unit: 6, category: 'song', difficulty: 'intermediate', pillar: 'repertoire',
    path: '/exercises/song-chords', requiredPerfectCompletions: 3, 
    params: { songId: 'misty', voicing: 'shell', inversion: '0' } 
  },

  // UNIT 7: The Journey on the Train - Comping & Vocabulary
  { 
    id: 'u7-train-chords-shell', title: 'Take the A Train: Shell Voicings', unit: 7, category: 'song', difficulty: 'intermediate', pillar: 'repertoire',
    path: '/exercises/song-chords', requiredPerfectCompletions: 3, 
    params: { songId: 'take-the-a-train', voicing: 'shell', inversion: '0' } 
  },
  { 
    id: 'u7-train-enclosures', title: 'Enclosures: Target 3rds & 7ths', unit: 7, category: 'technique', difficulty: 'intermediate', pillar: 'vocabulary',
    path: '/exercises/enclosure', requiredPerfectCompletions: 3, 
    params: { randomMode: 'true' } 
  },
  { 
    id: 'u7-train-triplets', title: 'Triplets & Turns: Dexterity', unit: 7, category: 'technique', difficulty: 'intermediate', pillar: 'vocabulary',
    path: '/exercises/dexterity', requiredPerfectCompletions: 3, 
    params: { mode: 'thirds', hand: 'right' } 
  },
  { 
    id: 'u7-train-licks', title: 'Take the A Train: Vocabulary Licks', unit: 7, category: 'lick', difficulty: 'intermediate', pillar: 'vocabulary',
    path: '/exercises/licks', requiredPerfectCompletions: 3, 
    params: { category: 'jazz', difficulty: 'intermediate' } 
  },

  // UNIT 8: The Velvet Doll - Drop 2 Voicings
  { 
    id: 'u8-doll-chords-drop2', title: 'Satin Doll: Drop 2 Voicings', unit: 8, category: 'song', difficulty: 'intermediate', pillar: 'repertoire',
    path: '/exercises/song-chords', requiredPerfectCompletions: 3, 
    params: { songId: 'satin-doll', voicing: 'rootless-a', inversion: '0' } 
  },
  { 
    id: 'u8-drop2-practice', title: 'Drop 2 Voicings: Major 7th Chords', unit: 8, category: 'theory', difficulty: 'intermediate', pillar: 'theory',
    path: '/exercises/chords', requiredPerfectCompletions: 3, 
    params: { voicing: 'rootless-a', chordType: 'maj7', inversion: [0, 1, 2, 3], randomMode: 'true' } 
  },
  { 
    id: 'u8-drop2-minor', title: 'Drop 2 Voicings: Minor 7th Chords', unit: 8, category: 'theory', difficulty: 'intermediate', pillar: 'theory',
    path: '/exercises/chords', requiredPerfectCompletions: 3, 
    params: { voicing: 'rootless-a', chordType: 'min7', inversion: [0, 1, 2, 3], randomMode: 'true' } 
  },
  { 
    id: 'u8-doll-rhythm', title: 'Satin Doll: Rhythmic Comping', unit: 8, category: 'rhythm', difficulty: 'intermediate', pillar: 'technique',
    path: '/exercises/rhythm', requiredPerfectCompletions: 3, 
    params: { patternId: 'jazz-charleston', bpm: '120' } 
  },

  // UNIT 9: There Will Be Another - Locked Hands
  { 
    id: 'u9-another-chords', title: 'There Will Be Another You: Shell Voicings', unit: 9, category: 'song', difficulty: 'advanced', pillar: 'repertoire',
    path: '/exercises/song-chords', requiredPerfectCompletions: 3, 
    params: { songId: 'there-will-never-be-another-you', voicing: 'shell', inversion: '0' } 
  },
  { 
    id: 'u9-locked-hands-maj7', title: 'Locked Hands: Major 7th Chords', unit: 9, category: 'theory', difficulty: 'advanced', pillar: 'theory',
    path: '/exercises/chords', requiredPerfectCompletions: 3, 
    params: { voicing: 'full-right', chordType: 'maj7', inversion: '0', randomMode: 'true' } 
  },
  { 
    id: 'u9-locked-hands-min7', title: 'Locked Hands: Minor 7th Chords', unit: 9, category: 'theory', difficulty: 'advanced', pillar: 'theory',
    path: '/exercises/chords', requiredPerfectCompletions: 3, 
    params: { voicing: 'full-right', chordType: 'min7', inversion: '0', randomMode: 'true' } 
  },

  // UNIT 10: Rhythmic Independence - Hand Independence
  { 
    id: 'u10-hand-independence-1', title: 'Hand Independence: Level 1 (Shell + Scale)', unit: 10, category: 'rhythm', difficulty: 'intermediate', pillar: 'technique',
    path: '/exercises/hand_independence', requiredPerfectCompletions: 3, 
    params: { level: '1' } 
  },
  { 
    id: 'u10-hand-independence-2', title: 'Hand Independence: Level 2 (Walking Bass)', unit: 10, category: 'rhythm', difficulty: 'intermediate', pillar: 'technique',
    path: '/exercises/hand_independence', requiredPerfectCompletions: 3, 
    params: { level: '2' } 
  },
  { 
    id: 'u10-dorian-scales', title: 'Dorian Scales (All Keys)', unit: 10, category: 'technique', difficulty: 'intermediate', pillar: 'theory',
    path: '/exercises/scales', requiredPerfectCompletions: 3, 
    params: { scaleMode: 'Dorian', handMode: 'right', octaves: '1', direction: 'up-down', sequentialMode: 'true', bpm: '80', randomMode: 'true' } 
  },
  { 
    id: 'u10-mixolydian-scales', title: 'Mixolydian Scales (All Keys)', unit: 10, category: 'technique', difficulty: 'intermediate', pillar: 'theory',
    path: '/exercises/scales', requiredPerfectCompletions: 3, 
    params: { scaleMode: 'Mixolydian', handMode: 'right', octaves: '1', direction: 'up-down', sequentialMode: 'true', bpm: '80', randomMode: 'true' } 
  },

  // UNIT 11: Reharmonization & Contemporary Harmony
  { 
    id: 'u11-tritone-subs', title: 'Tritone Substitutions: Dominant 7ths', unit: 11, category: 'theory', difficulty: 'advanced', pillar: 'theory',
    path: '/exercises/two_five_ones', requiredPerfectCompletions: 3, 
    params: { voicing: 'rootless-a', inversion: '0', randomMode: 'true', bpm: '80' } 
  },
  { 
    id: 'u11-ii-v-subs', title: 'II-V Substitutions', unit: 11, category: 'theory', difficulty: 'advanced', pillar: 'theory',
    path: '/exercises/two_five_ones', requiredPerfectCompletions: 3, 
    params: { voicing: 'rootless-b', inversion: '0', randomMode: 'true', bpm: '80' } 
  },
  { 
    id: 'u11-minor-major-7', title: 'Minor-Major 7th Chords', unit: 11, category: 'theory', difficulty: 'advanced', pillar: 'vocabulary',
    path: '/exercises/chords', requiredPerfectCompletions: 3, 
    params: { voicing: 'rootless-a', chordType: 'minMaj7', inversion: '0', randomMode: 'true' } 
  },
  { 
    id: 'u11-altered-dominants', title: 'Altered Dominant Chords', unit: 11, category: 'theory', difficulty: 'advanced', pillar: 'vocabulary',
    path: '/exercises/chords', requiredPerfectCompletions: 3, 
    params: { voicing: 'rootless-a', chordType: '7alt', inversion: '0', randomMode: 'true' } 
  },

  // UNIT 12: American Roots - Gospel & Stride
  { 
    id: 'u12-gospel-cadences', title: 'Gospel Cadences: 2-5-1 with Extensions', unit: 12, category: 'theory', difficulty: 'intermediate', pillar: 'theory',
    path: '/exercises/two_five_ones', requiredPerfectCompletions: 3, 
    params: { voicing: 'full-right', inversion: '0', randomMode: 'true', bpm: '70' } 
  },
  { 
    id: 'u12-stride-lh', title: 'Stride Piano: Left Hand Pattern', unit: 12, category: 'technique', difficulty: 'advanced', pillar: 'technique',
    path: '/exercises/hand_independence', requiredPerfectCompletions: 3, 
    params: { level: '2' } 
  },
  { 
    id: 'u12-boogie-woogie', title: 'Boogie Woogie Patterns', unit: 12, category: 'rhythm', difficulty: 'intermediate', pillar: 'technique',
    path: '/exercises/rhythm', requiredPerfectCompletions: 3, 
    params: { patternId: 'blues-shuffle', bpm: '90' } 
  },

  // UNIT 13: Brazilian & Afro-Cuban Rhythms
  { 
    id: 'u13-latin-montuno', title: 'Latin Montuno: Cuban Pattern', unit: 13, category: 'rhythm', difficulty: 'intermediate', pillar: 'technique',
    path: '/exercises/rhythm', requiredPerfectCompletions: 3, 
    params: { patternId: 'latin-montuno', bpm: '110' } 
  },
  { 
    id: 'u13-herbie-funk', title: 'Herbie Hancock Funk', unit: 13, category: 'rhythm', difficulty: 'advanced', pillar: 'technique',
    path: '/exercises/rhythm', requiredPerfectCompletions: 3, 
    params: { patternId: 'herbie-funk', bpm: '90' } 
  },

  // UNIT 14: Rhythm Changes Mastery
  { 
    id: 'u14-rhythm-changes-a', title: 'Rhythm Changes: A Section (I-VI-II-V)', unit: 14, category: 'theory', difficulty: 'advanced', pillar: 'theory',
    path: '/exercises/two_five_ones', requiredPerfectCompletions: 3, 
    params: { voicing: 'rootless-a', inversion: '0', randomMode: 'true', bpm: '100' } 
  },
  { 
    id: 'u14-rhythm-changes-bridge', title: 'Rhythm Changes: Bridge (III-VI-II-V)', unit: 14, category: 'theory', difficulty: 'advanced', pillar: 'theory',
    path: '/exercises/two_five_ones', requiredPerfectCompletions: 3, 
    params: { voicing: 'rootless-b', inversion: '0', randomMode: 'true', bpm: '100' } 
  },
  { 
    id: 'u14-rhythm-licks', title: 'Rhythm Changes: Bebop Lines', unit: 14, category: 'lick', difficulty: 'advanced', pillar: 'vocabulary',
    path: '/exercises/licks', requiredPerfectCompletions: 3, 
    params: { category: 'bebop', difficulty: 'advanced' } 
  },

  // UNIT 15: The Bebop Architects - Transcriptions
  { 
    id: 'u15-bebop-scales', title: 'Bebop Scales: Major & Dominant', unit: 15, category: 'technique', difficulty: 'advanced', pillar: 'theory',
    path: '/exercises/scales', requiredPerfectCompletions: 3, 
    params: { scaleMode: ['BebopMajor', 'BebopDominant'], handMode: 'right', octaves: '1', direction: 'up-down', sequentialMode: 'true', bpm: '100', randomMode: 'true' } 
  },
  { 
    id: 'u15-parker-licks', title: 'Charlie Parker Style: Blues Licks', unit: 15, category: 'lick', difficulty: 'advanced', pillar: 'vocabulary',
    path: '/exercises/licks', requiredPerfectCompletions: 3, 
    params: { category: 'bebop', difficulty: 'advanced' } 
  },
  { 
    id: 'u15-transcription-study', title: 'Transcription: Sight Reading Advanced', unit: 15, category: 'transcription', difficulty: 'advanced', pillar: 'repertoire',
    path: '/exercises/partition', requiredPerfectCompletions: 3, 
    params: { range: ['C3', 'C6'], randomMode: 'true' } 
  },

  // UNIT 16: The Art of the Ballad
  { 
    id: 'u16-ballad-rubato', title: 'Ballad Playing: Pop Groove', unit: 16, category: 'rhythm', difficulty: 'intermediate', pillar: 'technique',
    path: '/exercises/rhythm', requiredPerfectCompletions: 3, 
    params: { patternId: 'pop', bpm: '60' } 
  },
  { 
    id: 'u16-ballad-voicings', title: 'Ballad Voicings: Spread Voicings', unit: 16, category: 'theory', difficulty: 'intermediate', pillar: 'theory',
    path: '/exercises/chords', requiredPerfectCompletions: 3, 
    params: { voicing: '1735', chordType: ['maj7', 'min7'], inversion: '0', randomMode: 'true' } 
  },
  { 
    id: 'u16-melody-decoration', title: 'Melody Decoration: Turns & Graces', unit: 16, category: 'technique', difficulty: 'advanced', pillar: 'vocabulary',
    path: '/exercises/dexterity', requiredPerfectCompletions: 3, 
    params: { mode: 'chromatic', hand: 'right' } 
  },

  // UNIT 17: Transcription Analysis & Performance
  { 
    id: 'u17-sight-reading-advanced', title: 'Advanced Sight Reading: Full Range', unit: 17, category: 'transcription', difficulty: 'advanced', pillar: 'repertoire',
    path: '/exercises/partition', requiredPerfectCompletions: 3, 
    params: { range: ['C2', 'C6'], randomMode: 'true' } 
  },
  { 
    id: 'u17-flashcards-mixed', title: 'Mixed Flashcards: All Skills', unit: 17, category: 'theory', difficulty: 'advanced', pillar: 'theory',
    path: '/exercises/flashcards', requiredPerfectCompletions: 10, 
    params: { allowedCardTypes: ['note', 'interval', 'chord', 'scale', 'II-V-I'], randomMode: 'true' } 
  },
  { 
    id: 'u17-comprehensive-review', title: 'Comprehensive Review: All Units', unit: 17, category: 'exercise', difficulty: 'advanced', pillar: 'theory',
    path: '/exercises/flashcards', requiredPerfectCompletions: 15, 
    params: { allowedCardTypes: ['note', 'interval', 'chord', 'scale', 'II-V-I'], allowedChordTypes: ['major', 'minor', 'maj7', 'min7', 'dom7'], randomMode: 'true' } 
  },

  // ==========================================
  // PART 3: CREATIVE PRACTICE SERIES (From PDFs)
  // ==========================================

  // CREATIVE CHORD PRACTICE 1-7
  { 
    id: 'ccp-1-chord-sequences', title: 'Creative Chord Practice 1: Basic Sequences', unit: 5, category: 'theory', difficulty: 'beginner', pillar: 'theory',
    path: '/exercises/chords', requiredPerfectCompletions: 3, 
    params: { voicing: 'shell', chordType: ['maj7', 'min7', 'dom7'], inversion: '0', randomMode: 'true' } 
  },
  { 
    id: 'ccp-2-chord-inversions', title: 'Creative Chord Practice 2: Inversion Mastery', unit: 5, category: 'theory', difficulty: 'intermediate', pillar: 'theory',
    path: '/exercises/chords', requiredPerfectCompletions: 3, 
    params: { voicing: 'shell', chordType: ['maj7', 'min7', 'dom7'], inversion: [0, 1, 2], randomMode: 'true' } 
  },
  { 
    id: 'ccp-3-rootless-voicings', title: 'Creative Chord Practice 3: Rootless Voicings', unit: 8, category: 'theory', difficulty: 'intermediate', pillar: 'theory',
    path: '/exercises/chords', requiredPerfectCompletions: 3, 
    params: { voicing: 'rootless-a', chordType: ['maj7', 'min7', 'dom7'], inversion: [0, 1, 2], randomMode: 'true' } 
  },
  { 
    id: 'ccp-4-spread-voicings', title: 'Creative Chord Practice 4: Spread Voicings', unit: 8, category: 'theory', difficulty: 'intermediate', pillar: 'theory',
    path: '/exercises/chords', requiredPerfectCompletions: 3, 
    params: { voicing: '1735', chordType: ['maj7', 'min7'], inversion: '0', randomMode: 'true' } 
  },
  { 
    id: 'ccp-5-altered-chords', title: 'Creative Chord Practice 5: Altered Dominants', unit: 11, category: 'theory', difficulty: 'advanced', pillar: 'theory',
    path: '/exercises/chords', requiredPerfectCompletions: 3, 
    params: { voicing: 'rootless-a', chordType: '7alt', inversion: [0, 1, 2], randomMode: 'true' } 
  },
  { 
    id: 'ccp-6-polychords', title: 'Creative Chord Practice 6: Polychords', unit: 11, category: 'theory', difficulty: 'advanced', pillar: 'theory',
    path: '/exercises/chords', requiredPerfectCompletions: 3, 
    params: { voicing: 'full-right', chordType: ['maj7', 'min7'], inversion: '0', randomMode: 'true' } 
  },
  { 
    id: 'ccp-7-contemporary-voicings', title: 'Creative Chord Practice 7: Contemporary Voicings', unit: 11, category: 'theory', difficulty: 'advanced', pillar: 'theory',
    path: '/exercises/chords', requiredPerfectCompletions: 3, 
    params: { voicing: 'rootless-b', chordType: ['maj7', 'min7', 'dom7'], inversion: [0, 1, 2], randomMode: 'true' } 
  },

  // CREATIVE SCALE PRACTICE 1-7
  { 
    id: 'csp-1-major-scales', title: 'Creative Scale Practice 1: Major Scale Patterns', unit: 5, category: 'technique', difficulty: 'beginner', pillar: 'technique',
    path: '/exercises/scales', requiredPerfectCompletions: 3, 
    params: { scaleMode: 'Maj', handMode: 'right', octaves: '2', direction: 'up-down', sequentialMode: 'true', bpm: '80', randomMode: 'true' } 
  },
  { 
    id: 'csp-2-dorian-scales', title: 'Creative Scale Practice 2: Dorian Patterns', unit: 10, category: 'technique', difficulty: 'intermediate', pillar: 'technique',
    path: '/exercises/scales', requiredPerfectCompletions: 3, 
    params: { scaleMode: 'Dorian', handMode: 'right', octaves: '2', direction: 'up-down', sequentialMode: 'true', bpm: '90', randomMode: 'true' } 
  },
  { 
    id: 'csp-3-mixolydian-scales', title: 'Creative Scale Practice 3: Mixolydian Patterns', unit: 10, category: 'technique', difficulty: 'intermediate', pillar: 'technique',
    path: '/exercises/scales', requiredPerfectCompletions: 3, 
    params: { scaleMode: 'Mixolydian', handMode: 'right', octaves: '2', direction: 'up-down', sequentialMode: 'true', bpm: '90', randomMode: 'true' } 
  },
  { 
    id: 'csp-4-pentatonic-scales', title: 'Creative Scale Practice 4: Pentatonic Patterns', unit: 4, category: 'technique', difficulty: 'intermediate', pillar: 'technique',
    path: '/exercises/scales', requiredPerfectCompletions: 3, 
    params: { scaleMode: 'PentatonicMajor', handMode: 'right', octaves: '2', direction: 'up-down', sequentialMode: 'true', bpm: '100', randomMode: 'true' } 
  },
  { 
    id: 'csp-5-blues-scales', title: 'Creative Scale Practice 5: Blues Scale Patterns', unit: 4, category: 'technique', difficulty: 'intermediate', pillar: 'technique',
    path: '/exercises/scales', requiredPerfectCompletions: 3, 
    params: { scaleMode: 'Blues', handMode: 'right', octaves: '2', direction: 'up-down', sequentialMode: 'true', bpm: '100', randomMode: 'true' } 
  },
  { 
    id: 'csp-6-bebop-scales', title: 'Creative Scale Practice 6: Bebop Scale Patterns', unit: 15, category: 'technique', difficulty: 'advanced', pillar: 'technique',
    path: '/exercises/scales', requiredPerfectCompletions: 3, 
    params: { scaleMode: ['BebopMajor', 'BebopDominant'], handMode: 'right', octaves: '2', direction: 'up-down', sequentialMode: 'true', bpm: '110', randomMode: 'true' } 
  },
  { 
    id: 'csp-7-whole-tone-scales', title: 'Creative Scale Practice 7: Whole Tone Patterns', unit: 15, category: 'technique', difficulty: 'advanced', pillar: 'technique',
    path: '/exercises/scales', requiredPerfectCompletions: 3, 
    params: { scaleMode: 'WholeTone', handMode: 'right', octaves: '2', direction: 'up-down', sequentialMode: 'true', bpm: '100', randomMode: 'true' } 
  },

  // SONG STUDY WORKSHEETS
  { 
    id: 'song-oleo-voicings', title: 'Oleo: Chord Voicings', unit: 14, category: 'song', difficulty: 'advanced', pillar: 'repertoire',
    path: '/exercises/song-chords', requiredPerfectCompletions: 3, 
    params: { songId: 'oleo', voicing: 'rootless-a', inversion: '0' } 
  },
  { 
    id: 'song-oleo-lines', title: 'Oleo: Bebop Lines', unit: 14, category: 'lick', difficulty: 'advanced', pillar: 'vocabulary',
    path: '/exercises/licks', requiredPerfectCompletions: 3, 
    params: { category: 'bebop', difficulty: 'advanced' } 
  },
  { 
    id: 'song-quiet-nights-voicings', title: 'Quiet Nights: Modal Voicings', unit: 6, category: 'song', difficulty: 'intermediate', pillar: 'repertoire',
    path: '/exercises/song-chords', requiredPerfectCompletions: 3, 
    params: { songId: 'quiet-nights', voicing: 'shell', inversion: '0' } 
  },
  { 
    id: 'song-when-i-fall-in-love-voicings', title: 'When I Fall In Love: Ballad Voicings', unit: 16, category: 'song', difficulty: 'intermediate', pillar: 'repertoire',
    path: '/exercises/song-chords', requiredPerfectCompletions: 3, 
    params: { songId: 'when-i-fall-in-love', voicing: '1735', inversion: '0' } 
  },

  // PENTATONIC EXERCISES
  { 
    id: 'pentatonic-rh-vol1', title: 'Pentatonic Exercises: Right Hand Vol 1', unit: 4, category: 'technique', difficulty: 'intermediate', pillar: 'technique',
    path: '/exercises/scales', requiredPerfectCompletions: 3, 
    params: { scaleMode: 'PentatonicMajor', handMode: 'right', octaves: '2', direction: 'up-down', sequentialMode: 'true', bpm: '100', randomMode: 'true' } 
  },
  { 
    id: 'pentatonic-rh-vol2', title: 'Pentatonic Exercises: Right Hand Vol 2', unit: 4, category: 'technique', difficulty: 'intermediate', pillar: 'technique',
    path: '/exercises/scales', requiredPerfectCompletions: 3, 
    params: { scaleMode: 'PentatonicMinor', handMode: 'right', octaves: '2', direction: 'up-down', sequentialMode: 'true', bpm: '100', randomMode: 'true' } 
  },
  { 
    id: 'pentatonic-lh', title: 'Pentatonic Exercises: Left Hand', unit: 4, category: 'technique', difficulty: 'intermediate', pillar: 'technique',
    path: '/exercises/scales', requiredPerfectCompletions: 3, 
    params: { scaleMode: 'PentatonicMajor', handMode: 'left', octaves: '2', direction: 'up-down', sequentialMode: 'true', bpm: '90', randomMode: 'true' } 
  },

  // BLUES EXERCISES
  { 
    id: 'blues-lines', title: 'Blues Lines: Essential Patterns', unit: 4, category: 'lick', difficulty: 'intermediate', pillar: 'vocabulary',
    path: '/exercises/licks', requiredPerfectCompletions: 3, 
    params: { category: 'blues', difficulty: 'intermediate' } 
  },
  { 
    id: 'blues-time', title: 'Blues Time: Rhythmic Patterns', unit: 4, category: 'rhythm', difficulty: 'intermediate', pillar: 'technique',
    path: '/exercises/rhythm', requiredPerfectCompletions: 3, 
    params: { patternId: 'blues-shuffle', bpm: '90' } 
  },
  { 
    id: 'blues-voicings', title: 'Blues Voicings: Shell & Spread', unit: 4, category: 'theory', difficulty: 'intermediate', pillar: 'theory',
    path: '/exercises/chords', requiredPerfectCompletions: 3, 
    params: { voicing: 'shell', chordType: 'dom7', inversion: '0', randomMode: 'true' } 
  },

  // RHYTHM PACK EXERCISES
  { 
    id: 'rhythm-pack-1', title: 'Rhythm Pack 1: Basic Subdivisions', unit: 3, category: 'rhythm', difficulty: 'beginner', pillar: 'technique',
    path: '/exercises/rhythm', requiredPerfectCompletions: 3, 
    params: { patternId: 'pop', bpm: '80' } 
  },
  { 
    id: 'rhythm-pack-2', title: 'Rhythm Pack 2: Syncopation', unit: 3, category: 'rhythm', difficulty: 'intermediate', pillar: 'technique',
    path: '/exercises/rhythm', requiredPerfectCompletions: 3, 
    params: { patternId: 'funk-basic', bpm: '90' } 
  },
  { 
    id: 'rhythm-pack-3', title: 'Rhythm Pack 3: Triplets', unit: 3, category: 'rhythm', difficulty: 'intermediate', pillar: 'technique',
    path: '/exercises/rhythm', requiredPerfectCompletions: 3, 
    params: { patternId: 'latin-montuno', bpm: '100' } 
  },

  // LATIN RHYTHMS
  { 
    id: 'latin-bossa-nova', title: 'Latin Rhythms: Bossa Nova', unit: 13, category: 'rhythm', difficulty: 'intermediate', pillar: 'technique',
    path: '/exercises/rhythm', requiredPerfectCompletions: 3, 
    params: { patternId: 'latin-montuno', bpm: '110' } 
  },
  { 
    id: 'latin-samba', title: 'Latin Rhythms: Samba', unit: 13, category: 'rhythm', difficulty: 'advanced', pillar: 'technique',
    path: '/exercises/rhythm', requiredPerfectCompletions: 3, 
    params: { patternId: 'latin-montuno', bpm: '120' } 
  },
  { 
    id: 'latin-baiao', title: 'Latin Rhythms: Baião', unit: 13, category: 'rhythm', difficulty: 'advanced', pillar: 'technique',
    path: '/exercises/rhythm', requiredPerfectCompletions: 3, 
    params: { patternId: 'latin-montuno', bpm: '110' } 
  },
  { 
    id: 'latin-partido-alto', title: 'Latin Rhythms: Partido Alto', unit: 13, category: 'rhythm', difficulty: 'advanced', pillar: 'technique',
    path: '/exercises/rhythm', requiredPerfectCompletions: 3, 
    params: { patternId: 'latin-montuno', bpm: '110' } 
  },

  // GOSPEL PIANO
  { 
    id: 'gospel-basics', title: 'Gospel Piano: Basic Cadences', unit: 12, category: 'theory', difficulty: 'intermediate', pillar: 'theory',
    path: '/exercises/two_five_ones', requiredPerfectCompletions: 3, 
    params: { voicing: 'full-right', inversion: '0', randomMode: 'true', bpm: '70' } 
  },
  { 
    id: 'gospel-chord-runs', title: 'Gospel Piano: Chord Runs', unit: 12, category: 'lick', difficulty: 'intermediate', pillar: 'vocabulary',
    path: '/exercises/licks', requiredPerfectCompletions: 3, 
    params: { category: 'jazz', difficulty: 'intermediate' } 
  },

  // STRIDE PIANO
  { 
    id: 'stride-basics', title: 'Stride Piano: Basic Pattern', unit: 12, category: 'technique', difficulty: 'advanced', pillar: 'technique',
    path: '/exercises/hand_independence', requiredPerfectCompletions: 3, 
    params: { level: '2' } 
  },
  { 
    id: 'stride-advanced', title: 'Stride Piano: Advanced Patterns', unit: 12, category: 'technique', difficulty: 'advanced', pillar: 'technique',
    path: '/exercises/hand_independence', requiredPerfectCompletions: 3, 
    params: { level: '2' } 
  },

  // TRANSCRIPTIONS
  { 
    id: 'transcription-parker', title: 'Transcription: Charlie Parker Style', unit: 15, category: 'transcription', difficulty: 'advanced', pillar: 'repertoire',
    path: '/exercises/partition', requiredPerfectCompletions: 3, 
    params: { range: ['C3', 'C6'], randomMode: 'true' } 
  },
  { 
    id: 'transcription-monk', title: 'Transcription: Thelonious Monk Style', unit: 15, category: 'transcription', difficulty: 'advanced', pillar: 'repertoire',
    path: '/exercises/partition', requiredPerfectCompletions: 3, 
    params: { range: ['C3', 'C6'], randomMode: 'true' } 
  },
  { 
    id: 'transcription-golson', title: 'Transcription: Benny Golson Style', unit: 15, category: 'transcription', difficulty: 'advanced', pillar: 'repertoire',
    path: '/exercises/partition', requiredPerfectCompletions: 3, 
    params: { range: ['C3', 'C6'], randomMode: 'true' } 
  },
];

async function run() {
  console.log('Seeding Proprietary Exercises into Supabase...');
  
  const dbRecords = [];
  const unitsData: any[] = Array.from({ length: 18 }, () => []);

  for (const ex of CUSTOM_EXERCISES) {
    dbRecords.push({
      id: ex.id,
      name: ex.title,
      description: `Proprietary curriculum exercise`,
      category: ex.category,
      difficulty: ex.difficulty,
      tier: 'free', 
      storage_path: 'internal', 
      metadata: { 
        path: ex.path,
        params: ex.params,
        source: 'proprietary_curriculum' 
      }
    });

    unitsData[ex.unit].push(ex);
  }

  // Upsert into Supabase
  if (supabase) {
    console.log(`Preparing to upsert ${dbRecords.length} records into content_catalog...`);
    const BATCH_SIZE = 50;
    for (let i = 0; i < dbRecords.length; i += BATCH_SIZE) {
      const batch = dbRecords.slice(i, i + BATCH_SIZE);
      const { error } = await supabase.from('content_catalog').upsert(batch, { onConflict: 'id' });
      if (error) console.error(`Error inserting batch ${i / BATCH_SIZE + 1}:`, error);
    }
  } else {
    console.log(`Skipping DB upsert because Supabase credentials are missing.`);
  }

  // Generate journeyUnits.ts
  let journeyContent = `import type { Unit } from '../JourneyService';\n\nexport const JOURNEY_UNITS: Unit[] = [\n`;
  const unitTitles = [
    "", "Unit 1: The Atom of Jazz", "Unit 2: The Architecture of Harmony", "Unit 3: The Pulse of Rhythm", "Unit 4: The Root (Blues)", 
    "Unit 5: Diatonic Systems", "Unit 6: Essential Jazz Standards", "Unit 7: The Journey on the Train",
    "Unit 8: The Velvet Doll", "Unit 9: There Will Be Another", "Unit 10: Rhythmic Independence",
    "Unit 11: Reharmonization & Contemporary Harmony", "Unit 12: American Roots", "Unit 13: Brazilian & Afro-Cuban",
    "Unit 14: Rhythm Changes Mastery", "Unit 15: The Bebop Architects", "Unit 16: The Art of the Ballad",
    "Unit 17: Transcription Analysis"
  ];
  
  for (let i = 1; i <= 17; i++) {
    journeyContent += `  {\n    id: 'unit-${i}',\n    title: '${unitTitles[i]}',\n    description: 'Master Curriculum - ${unitTitles[i]}',\n    difficulty: '${i < 5 ? 'beginner' : 'advanced'}',\n    status: '${i === 1 ? 'active' : 'locked'}',\n    color: 'bg-sky-500',\n    lessons: [\n`;
    
    for (const exercise of unitsData[i]) {
      const paramsStr = JSON.stringify(exercise.params).replace(/"([^"]+)":/g, '$1:').replace(/"/g, "'");
      
      journeyContent += `      {\n        id: '${exercise.id}',\n        title: \`${exercise.title.replace(/`/g, "'")}\`,\n        type: 'exercise',\n        path: '${exercise.path}',\n        pillar: '${exercise.pillar}',\n        params: ${paramsStr},\n        completed: false, stars: 0, perfectCompletions: 0, requiredPerfectCompletions: ${exercise.requiredPerfectCompletions}\n      },\n`;
    }
    
    journeyContent += `    ]\n  },\n`;
  }
  journeyContent += `];\n`;

  fs.writeFileSync(path.join(__dirname, '../src/lib/data/journeyUnits.ts'), journeyContent);
  console.log('Successfully generated journeyUnits.ts with exhaustive Svelte parameters!');
}

run().catch(console.error);
