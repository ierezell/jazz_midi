import level1 from './level1-shells-scale.json' assert { type: 'json' };
import level2 from './level2-walking-melody.json' assert { type: 'json' };
import level3 from './level3-chord-melody.json' assert { type: 'json' };
import level4 from './level4-stride-pattern.json' assert { type: 'json' };

export interface HandIndependenceLevel {
  id: string;
  title: string;
  level: number;
  description: string;
  lhPattern: number[] | { beat: number; semitones: number[] }[];
  rhPattern: number[];
  rootMidi: number;
  rhStartMidi: number;
  suggestedBpm: number;
  measures: number;
  instructions: string;
}

export const handIndependenceLevels: HandIndependenceLevel[] = [
  level1 as HandIndependenceLevel,
  level2 as HandIndependenceLevel,
  level3 as HandIndependenceLevel,
  level4 as HandIndependenceLevel,
];
