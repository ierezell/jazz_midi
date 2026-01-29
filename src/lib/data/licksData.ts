import type { Lick } from '$lib/types/types';

// Import licks from JSON files
import bluesWalkingBass from './licks/blues-walking-bass.json';
import boogieRightHand from './licks/boogie-right-hand.json';
import bebopScaleRun from './licks/bebop-scale-run.json';
import latinMontunoBass from './licks/latin-montuno-bass.json';
import bluesShuffleRight from './licks/blues-shuffle-right.json';
import countryAlternatingBass from './licks/country-alternating-bass.json';
import funkSixteenthBass from './licks/funk-sixteenth-bass.json';
import bebopEnclosure from './licks/bebop-enclosure.json';
import strideLeftHand from './licks/stride-left-hand.json';

export const licks: Lick[] = [
	bluesWalkingBass as Lick,
	boogieRightHand as Lick,
	bebopScaleRun as Lick,
	latinMontunoBass as Lick,
	bluesShuffleRight as Lick,
	countryAlternatingBass as Lick,
	funkSixteenthBass as Lick,
	bebopEnclosure as Lick,
	strideLeftHand as Lick
];

export const getLicksByHand = (hand: 'left' | 'right' | 'both'): Lick[] => {
	return licks.filter((lick) => lick.hand === hand || lick.hand === 'both');
};

export const getLicksByCategory = (category: string): Lick[] => {
	return licks.filter((lick) => lick.category === category);
};

export const getLicksByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): Lick[] => {
	return licks.filter((lick) => lick.difficulty === difficulty);
};
