import type { Note } from '../types/types';

export interface RhythmHit {
	beat: number; // 1-indexed beat position (e.g., 1.0, 1.5, 2.0, 2.25)
	hand: 'LH' | 'RH';
}

export interface RhythmPattern {
	id: string;
	name: string;
	description: string;
	suggestedBpm: number;
	timeSignature: '4/4' | '6/8' | '3/4';
	defaultChords: string[]; // e.g., ["Cmaj7", "Fmaj7"]
	hits: RhythmHit[];
	isProgression: boolean;
	measures: number; // Duration of the pattern in measures
}

export const rhythmPatterns: RhythmPattern[] = [
	{
		id: 'pop',
		name: 'Pop Groove',
		description: 'LH: Whole-note octaves. RH: Syncopated quarter-note feel (1, 2, 2.5, 4).',
		suggestedBpm: 100,
		timeSignature: '4/4',
		defaultChords: ['F', 'Am', 'G', 'Dm'],
		isProgression: true,
		measures: 1,
		hits: [
			{ beat: 1.0, hand: 'LH' },
			{ beat: 1.0, hand: 'RH' },
			{ beat: 2.0, hand: 'RH' },
			{ beat: 2.5, hand: 'RH' },
			{ beat: 4.0, hand: 'RH' }
		]
	},
	{
		id: 'rock',
		name: 'Rock Driving',
		description: 'LH: Driving eighth-note octaves. RH: Steady chords.',
		suggestedBpm: 120,
		timeSignature: '4/4',
		defaultChords: ['C', 'F', 'Bb', 'Eb'],
		isProgression: true,
		measures: 1,
		hits: [
			{ beat: 1.0, hand: 'LH' }, { beat: 1.5, hand: 'LH' },
			{ beat: 2.0, hand: 'LH' }, { beat: 2.5, hand: 'LH' },
			{ beat: 3.0, hand: 'LH' }, { beat: 3.5, hand: 'LH' },
			{ beat: 4.0, hand: 'LH' }, { beat: 4.5, hand: 'LH' },
			{ beat: 1.0, hand: 'RH' },
			{ beat: 2.0, hand: 'RH' },
			{ beat: 3.0, hand: 'RH' },
			{ beat: 4.0, hand: 'RH' }
		]
	},
	{
		id: 'jazz-charleston',
		name: 'Jazz (Charleston)',
		description: 'The classic Charleston rhythm. RH hits on 1 and the "and" of 2.',
		suggestedBpm: 140,
		timeSignature: '4/4',
		defaultChords: ['Dm7', 'G7', 'Cmaj7'],
		isProgression: true,
		measures: 1,
		hits: [
			{ beat: 1.0, hand: 'LH' },
			{ beat: 1.0, hand: 'RH' },
			{ beat: 2.5, hand: 'RH' }
		]
	},
	{
		id: 'funk-basic',
		name: 'Funk Stabs',
		description: 'Syncopated RH "chanks" on 16th-note off-beats.',
		suggestedBpm: 95,
		timeSignature: '4/4',
		defaultChords: ['Cm7', 'F9'],
		isProgression: true,
		measures: 1,
		hits: [
			{ beat: 1.0, hand: 'LH' },
			{ beat: 1.25, hand: 'RH' },
			{ beat: 2.0, hand: 'LH' },
			{ beat: 2.75, hand: 'RH' },
			{ beat: 3.0, hand: 'LH' },
			{ beat: 4.0, hand: 'RH' },
			{ beat: 4.5, hand: 'RH' }
		]
	},
	{
		id: 'herbie-funk',
		name: 'Herbie Hancock Funk',
		description: 'G minor funk blues. Syncopated LH bassline and RH hits on the "and" of 1.',
		suggestedBpm: 105,
		timeSignature: '4/4',
		defaultChords: ['Gm7', 'C7', 'D7'],
		isProgression: true,
		measures: 2,
		hits: [
			// Measure 1
			{ beat: 1.0, hand: 'LH' },
			{ beat: 1.5, hand: 'RH' },
			{ beat: 2.0, hand: 'LH' },
			{ beat: 2.5, hand: 'LH' },
			{ beat: 3.0, hand: 'LH' },
			{ beat: 4.5, hand: 'RH' },
			// Measure 2
			{ beat: 5.0, hand: 'LH' },
			{ beat: 6.0, hand: 'RH' },
			{ beat: 7.5, hand: 'RH' },
			{ beat: 8.0, hand: 'LH' }
		]
	},
	{
		id: 'latin-montuno',
		name: 'Latin (Montuno)',
		description: 'Highly syncopated Montuno pattern focusing on off-beats.',
		suggestedBpm: 120,
		timeSignature: '4/4',
		defaultChords: ['Cm', 'Ebaug', 'Eb', 'Ebaug'],
		isProgression: true,
		measures: 2,
		hits: [
			{ beat: 1.5, hand: 'RH' },
			{ beat: 2.0, hand: 'RH' },
			{ beat: 2.5, hand: 'RH' },
			{ beat: 3.5, hand: 'RH' },
			{ beat: 4.0, hand: 'RH' },
			{ beat: 4.5, hand: 'RH' },
			{ beat: 5.5, hand: 'RH' },
			{ beat: 6.0, hand: 'RH' },
			{ beat: 6.5, hand: 'RH' },
			{ beat: 7.5, hand: 'RH' },
			{ beat: 8.0, hand: 'RH' },
			{ beat: 8.5, hand: 'RH' }
		]
	},
	{
		id: 'blues-shuffle',
		name: 'Blues Shuffle',
		description: 'Loping triplet feel. LH plays a walking shuffle pattern.',
		suggestedBpm: 90,
		timeSignature: '4/4', // Handled with triplet feel logic usually, but we'll use 8th notes here
		defaultChords: ['G7', 'C7', 'D7'],
		isProgression: true,
		measures: 1,
		hits: [
			{ beat: 1.0, hand: 'LH' }, { beat: 1.66, hand: 'LH' },
			{ beat: 2.0, hand: 'LH' }, { beat: 2.66, hand: 'LH' },
			{ beat: 3.0, hand: 'LH' }, { beat: 3.66, hand: 'LH' },
			{ beat: 4.0, hand: 'LH' }, { beat: 4.66, hand: 'LH' },
			{ beat: 1.0, hand: 'RH' },
			{ beat: 2.66, hand: 'RH' },
			{ beat: 4.0, hand: 'RH' }
		]
	},
	{
		id: 'country-waltz',
		name: 'Country Waltz',
		description: 'Boom-chick-chick feel in 6/8. LH alternates Root and Fifth.',
		suggestedBpm: 110,
		timeSignature: '6/8',
		defaultChords: ['F', 'C/E', 'D7'],
		isProgression: true,
		measures: 1,
		hits: [
			{ beat: 1.0, hand: 'LH' },
			{ beat: 2.0, hand: 'RH' },
			{ beat: 3.0, hand: 'RH' },
			{ beat: 4.0, hand: 'LH' }, // Fifth
			{ beat: 5.0, hand: 'RH' },
			{ beat: 6.0, hand: 'RH' }
		]
	},
	{
		id: 'blues-shells',
		name: 'Blues Shells',
		description: 'LH: Root-Fifth walking. RH: Root-3-7 Shell voicings on beats 2 and 4.',
		suggestedBpm: 80,
		timeSignature: '4/4',
		defaultChords: ['G7', 'C7', 'G7', 'D7'],
		isProgression: true,
		measures: 1,
		hits: [
			{ beat: 1.0, hand: 'LH' }, 
			{ beat: 2.0, hand: 'LH' }, { beat: 2.0, hand: 'RH' },
			{ beat: 3.0, hand: 'LH' },
			{ beat: 4.0, hand: 'LH' }, { beat: 4.0, hand: 'RH' }
		]
	},
	{
		id: 'funk-root-chord',
		name: 'Funk Root-Chord',
		description: 'LH: Punchy roots on 1 and 3. RH: 16th-note chord stabs on the "e" and "a".',
		suggestedBpm: 90,
		timeSignature: '4/4',
		defaultChords: ['E9', 'A13'],
		isProgression: true,
		measures: 1,
		hits: [
			{ beat: 1.0, hand: 'LH' },
			{ beat: 1.25, hand: 'RH' },
			{ beat: 1.75, hand: 'RH' },
			{ beat: 3.0, hand: 'LH' },
			{ beat: 3.25, hand: 'RH' },
			{ beat: 3.75, hand: 'RH' }
		]
	}
];
