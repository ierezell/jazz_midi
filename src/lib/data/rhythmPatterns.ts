import type { RhythmPattern } from '$lib/types/types';

// Import rhythm patterns from JSON files
import pop from './rhythm/pop.json';
import rock from './rhythm/rock.json';
import jazzCharleston from './rhythm/jazz-charleston.json';
import funkBasic from './rhythm/funk-basic.json';
import herbieFunk from './rhythm/herbie-funk.json';
import latinMontuno from './rhythm/latin-montuno.json';
import bluesShuffle from './rhythm/blues-shuffle.json';
import countryWaltz from './rhythm/country-waltz.json';
import bluesShells from './rhythm/blues-shells.json';
import funkRootChord from './rhythm/funk-root-chord.json';

export const rhythmPatterns: RhythmPattern[] = [
	pop as RhythmPattern,
	rock as RhythmPattern,
	jazzCharleston as RhythmPattern,
	funkBasic as RhythmPattern,
	herbieFunk as RhythmPattern,
	latinMontuno as RhythmPattern,
	bluesShuffle as RhythmPattern,
	countryWaltz as RhythmPattern,
	bluesShells as RhythmPattern,
	funkRootChord as RhythmPattern
];
