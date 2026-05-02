/**
 * Rhythm patterns data.
 * Source-of-truth: static/rhythm/*.json — served as-is for OSMD/MIDI playback.
 * This file provides the typed catalogue used by exercise pages.
 */
import type { RhythmPattern } from '$lib/types/types';

export const rhythmPatterns: RhythmPattern[] = [
	{
		id: 'blues-shells',
		name: 'Blues Shells',
		description: 'Shell voicing comping pattern over a basic blues.',
		suggestedBpm: 80,
		timeSignature: '4/4',
		defaultChords: ['C7', 'F7', 'G7'],
		isProgression: true,
		measures: 1,
		hits: [
			{ beat: 1.0, hand: 'LH' }, { beat: 3.0, hand: 'LH' },
			{ beat: 2.0, hand: 'RH' }, { beat: 4.0, hand: 'RH' }
		]
	},
	{
		id: 'blues-shuffle',
		name: 'Blues Shuffle',
		description: 'Loping triplet feel. LH plays a walking shuffle pattern.',
		suggestedBpm: 90,
		timeSignature: '4/4',
		defaultChords: ['G7', 'C7', 'D7'],
		isProgression: true,
		measures: 1,
		hits: [
			{ beat: 1.0, hand: 'LH' }, { beat: 1.66, hand: 'LH' },
			{ beat: 2.0, hand: 'LH' }, { beat: 2.66, hand: 'LH' },
			{ beat: 3.0, hand: 'LH' }, { beat: 3.66, hand: 'LH' },
			{ beat: 4.0, hand: 'LH' }, { beat: 4.66, hand: 'LH' },
			{ beat: 1.0, hand: 'RH' }, { beat: 2.66, hand: 'RH' }, { beat: 4.0, hand: 'RH' }
		]
	},
	{
		id: 'country-waltz',
		name: 'Country Waltz',
		description: 'Alternating bass in 3/4. LH bass on beat 1, RH chords on 2 & 3.',
		suggestedBpm: 100,
		timeSignature: '3/4',
		defaultChords: ['C', 'G', 'F'],
		isProgression: true,
		measures: 1,
		hits: [
			{ beat: 1.0, hand: 'LH' },
			{ beat: 2.0, hand: 'RH' }, { beat: 3.0, hand: 'RH' }
		]
	},
	{
		id: 'funk-basic',
		name: 'Funk Stabs',
		description: 'Syncopated funk stabs. RH on the & of 2 and & of 4.',
		suggestedBpm: 95,
		timeSignature: '4/4',
		defaultChords: ['Em7', 'A7'],
		isProgression: true,
		measures: 1,
		hits: [
			{ beat: 1.0, hand: 'LH' }, { beat: 3.0, hand: 'LH' },
			{ beat: 2.5, hand: 'RH' }, { beat: 4.5, hand: 'RH' }
		]
	},
	{
		id: 'funk-root-chord',
		name: 'Funk Root-Chord',
		description: 'LH roots on beats 1 & 3, RH chord stabs on 2 & 4.',
		suggestedBpm: 95,
		timeSignature: '4/4',
		defaultChords: ['Cm7', 'F7'],
		isProgression: true,
		measures: 1,
		hits: [
			{ beat: 1.0, hand: 'LH' }, { beat: 3.0, hand: 'LH' },
			{ beat: 2.0, hand: 'RH' }, { beat: 4.0, hand: 'RH' }
		]
	},
	{
		id: 'herbie-funk',
		name: 'Herbie Hancock Funk',
		description: 'Advanced funk pattern inspired by Herbie Hancock.',
		suggestedBpm: 90,
		timeSignature: '4/4',
		defaultChords: ['Cm7', 'Fm7'],
		isProgression: true,
		measures: 2,
		hits: [
			{ beat: 1.0, hand: 'LH' }, { beat: 2.5, hand: 'LH' }, { beat: 4.0, hand: 'LH' },
			{ beat: 1.5, hand: 'RH' }, { beat: 3.0, hand: 'RH' }, { beat: 4.5, hand: 'RH' }
		]
	},
	{
		id: 'jazz-charleston',
		name: 'Jazz (Charleston)',
		description: 'Classic jazz Charleston rhythm: beat 1 and the & of 2.',
		suggestedBpm: 120,
		timeSignature: '4/4',
		defaultChords: ['Cmaj7', 'Am7', 'Dm7', 'G7'],
		isProgression: true,
		measures: 1,
		hits: [
			{ beat: 1.0, hand: 'LH' }, { beat: 3.0, hand: 'LH' },
			{ beat: 1.0, hand: 'RH' }, { beat: 2.5, hand: 'RH' }
		]
	},
	{
		id: 'latin-montuno',
		name: 'Latin (Montuno)',
		description: 'Cuban montuno pattern — syncopated two-bar phrase.',
		suggestedBpm: 110,
		timeSignature: '4/4',
		defaultChords: ['Cmaj7', 'G7'],
		isProgression: true,
		measures: 2,
		hits: [
			{ beat: 1.0, hand: 'LH' }, { beat: 2.0, hand: 'LH' }, { beat: 3.0, hand: 'LH' }, { beat: 4.0, hand: 'LH' },
			{ beat: 1.0, hand: 'RH' }, { beat: 1.5, hand: 'RH' }, { beat: 2.5, hand: 'RH' }, { beat: 3.0, hand: 'RH' }, { beat: 4.5, hand: 'RH' }
		]
	},
	{
		id: 'pop',
		name: 'Pop Groove',
		description: 'Standard pop pattern. LH bass on 1 & 3, RH chords on 2 & 4.',
		suggestedBpm: 105,
		timeSignature: '4/4',
		defaultChords: ['C', 'Am', 'F', 'G'],
		isProgression: false,
		measures: 1,
		hits: [
			{ beat: 1.0, hand: 'LH' }, { beat: 1.5, hand: 'LH' }, { beat: 2.0, hand: 'LH' }, { beat: 2.5, hand: 'LH' },
			{ beat: 3.0, hand: 'LH' }, { beat: 3.5, hand: 'LH' }, { beat: 4.0, hand: 'LH' }, { beat: 4.5, hand: 'LH' },
			{ beat: 2.0, hand: 'RH' }, { beat: 4.0, hand: 'RH' }
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
			{ beat: 1.0, hand: 'LH' }, { beat: 1.5, hand: 'LH' }, { beat: 2.0, hand: 'LH' }, { beat: 2.5, hand: 'LH' },
			{ beat: 3.0, hand: 'LH' }, { beat: 3.5, hand: 'LH' }, { beat: 4.0, hand: 'LH' }, { beat: 4.5, hand: 'LH' },
			{ beat: 1.0, hand: 'RH' }, { beat: 2.0, hand: 'RH' }, { beat: 3.0, hand: 'RH' }, { beat: 4.0, hand: 'RH' }
		]
	}
];
