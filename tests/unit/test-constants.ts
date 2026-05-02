// Import and re-export constants from src/lib/types/notes.constants.ts for tests
import {
  MidiToNote,
  NoteToMidi,
  AllNotes,
  AllChordTypes,
  AllInversions,
  AllScaleModes,
  SCALE_INTERVALS,
  INTERVAL_SEMITONES,
  DEFAULT_OCTAVE,
  DEFAULT_MIDDLE_C,
  AllIntervals,
  INTERVAL_NAMES
} from '../../src/lib/types/notes.constants';

export {
  MidiToNote,
  NoteToMidi,
  AllNotes,
  AllChordTypes,
  AllInversions,
  AllScaleModes,
  SCALE_INTERVALS,
  INTERVAL_SEMITONES,
  DEFAULT_OCTAVE,
  DEFAULT_MIDDLE_C,
  AllIntervals,
  INTERVAL_NAMES
};

// Re-export from MusicTheoryUtils.ts - actual exports from that file
export {
  chords,
  getVoicedChordNotes,
  generateChordNotesDataFromChord,
  generateChordNotesData,
  calculateOptimalRange,
  getNoteRole,
  calculateOptimalInversion,
  calculateInterval
} from '../../src/lib/MusicTheoryUtils';

// Test-specific helpers
export const ALL_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const CHORD_INTERVALS: Record<string, number[]> = {
  major: [0, 4, 7], minor: [0, 3, 7], diminished: [0, 3, 6],
  augmented: [0, 4, 8], sus2: [0, 2, 7], sus4: [0, 5, 7],
  maj7: [0, 4, 7, 11], min7: [0, 3, 7, 10], '7': [0, 4, 7, 10],
  dom7: [0, 4, 7, 10], 'half-dim7': [0, 3, 6, 10], dim7: [0, 3, 6, 9]
};

export const LATIN_TO_ENGLISH: Record<string, string> = {
  Do: 'C', 'Do#': 'C#', Reb: 'Db', Re: 'D', 'Re#': 'D#',
  Mib: 'Eb', Mi: 'E', Fa: 'F', 'Fa#': 'F#', Solb: 'Gb',
  Sol: 'G', 'Sol#': 'G#', Lab: 'Ab', La: 'A', 'La#': 'A#',
  Sib: 'Bb', Si: 'B'
};

export function midiFromName(note: string, octave: number): number {
  const fullName = `${note}${octave}` as keyof typeof NoteToMidi;
  return NoteToMidi[fullName] ?? 60;
}

export function getScaleNotesFromRoot(rootNote: string, mode: keyof typeof SCALE_INTERVALS): number[] {
  const intervals = SCALE_INTERVALS[mode];
  if (!intervals) return [];
  const rootMidi = midiFromName(rootNote, 3);
  return intervals.map((interval: number) => rootMidi + interval);
}

export function getChordNotesFromRoot(rootNote: string, chordType: string): number[] {
  const formula = CHORD_INTERVALS[chordType] ?? CHORD_INTERVALS.major;
  const rootMidi = midiFromName(rootNote, 3);
  return formula.map((interval: number) => rootMidi + interval);
}

export const TEST_ROUTES = {
  scales: '/exercises/scales',
  chords: '/exercises/chords',
  intervals: '/exercises/intervals',
  names: '/exercises/names',
  partition: '/exercises/partition',
  twoFiveOnes: '/exercises/two_five_ones',
  songs: '/exercises/songs',
  licks: '/exercises/licks'
};

