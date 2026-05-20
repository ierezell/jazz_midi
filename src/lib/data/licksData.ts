/**
 * Lick catalogue.
 * Source-of-truth: static/licks/*.json — served for OSMD/MIDI playback.
 * This file provides the typed catalogue used by exercise pages.
 */
import type { Lick } from '$lib/types/types';

export const licks: Lick[] = [
	{
		id: 'bebop-enclosure',
		name: 'Bebop Enclosure',
		description: 'Chromatic enclosure resolving to the root.',
		category: 'bebop',
		hand: 'right',
		difficulty: 'advanced',
		suggestedBpm: 130,
		notes: ['B3', 'Db4', 'C4', 'A3', 'B3', 'G3'],
		tags: ['bebop', 'chromatic', 'enclosure']
	},
	{
		id: 'bebop-scale-run',
		name: 'Bebop Scale Run',
		description: 'Classic bebop dominant scale with chromatic passing tone.',
		category: 'bebop',
		hand: 'right',
		difficulty: 'intermediate',
		suggestedBpm: 140,
		notes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'Bb4', 'B4', 'C5'],
		tags: ['bebop', 'chromatic', 'dominant']
	},
	{
		id: 'blues-shuffle-right',
		name: 'Blues Shuffle Lick',
		description: 'Classic blues shuffle pattern with double-stops.',
		category: 'blues',
		hand: 'right',
		difficulty: 'beginner',
		suggestedBpm: 90,
		notes: ['C4', 'E4', 'F4', 'F#4', 'G4', 'F#4', 'F4', 'E4'],
		tags: ['blues', 'shuffle', 'chromatic']
	},
	{
		id: 'blues-walking-bass',
		name: 'Blues Walking Bass',
		description: 'Classic blues walking bass line in C.',
		category: 'blues',
		hand: 'left',
		difficulty: 'beginner',
		suggestedBpm: 85,
		notes: ['C2', 'E2', 'G2', 'Bb2', 'C3', 'Bb2', 'G2', 'E2'],
		tags: ['blues', 'walking-bass']
	},
	{
		id: 'boogie-right-hand',
		name: 'Boogie Woogie Riff',
		description: 'Right-hand boogie woogie riff over a blues.',
		category: 'boogie',
		hand: 'right',
		difficulty: 'beginner',
		suggestedBpm: 120,
		notes: ['C4', 'E4', 'G4', 'Bb4', 'C5', 'Bb4', 'G4', 'E4'],
		tags: ['boogie', 'blues']
	},
	{
		id: 'country-alternating-bass',
		name: 'Country Alternating Bass',
		description: 'Root-fifth alternating bass in country style.',
		category: 'country',
		hand: 'left',
		difficulty: 'beginner',
		suggestedBpm: 100,
		notes: ['C2', 'G2', 'C2', 'G2', 'F2', 'C3', 'F2', 'C3'],
		tags: ['country', 'alternating-bass']
	},
	{
		id: 'dorian-mode-run',
		name: 'Dorian Mode Run',
		description: 'Ascending and descending Dorian mode run.',
		category: 'jazz',
		hand: 'right',
		difficulty: 'intermediate',
		suggestedBpm: 120,
		notes: ['D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5'],
		tags: ['dorian', 'mode', 'jazz']
	},
	{
		id: 'funk-sixteenth-bass',
		name: 'Funk Sixteenth Bass',
		description: 'Syncopated sixteenth-note funk bass line.',
		category: 'funk',
		hand: 'left',
		difficulty: 'advanced',
		suggestedBpm: 95,
		notes: ['C2', 'C2', 'Eb2', 'F2', 'G2', 'F2', 'Eb2', 'C2'],
		tags: ['funk', 'sixteenth-note', 'syncopation']
	},
	{
		id: 'funky-bass-line',
		name: 'Funky Bass Line',
		description: 'A classic funky bass line with ghost notes.',
		category: 'funk',
		hand: 'left',
		difficulty: 'intermediate',
		suggestedBpm: 90,
		notes: ['C2', 'C2', 'G2', 'Ab2', 'G2', 'C2', 'C2', 'G2'],
		tags: ['funk', 'ghost-notes', 'bass']
	},
	{
		id: 'gospel-chord-run',
		name: 'Gospel Chord Run',
		description: 'Ascending gospel chord run with passing tones.',
		category: 'jazz',
		hand: 'right',
		difficulty: 'intermediate',
		suggestedBpm: 80,
		notes: ['C4', 'E4', 'G4', 'B4', 'D5', 'B4', 'G4', 'E4'],
		tags: ['gospel', 'chords', 'passing-tones']
	},
	{
		id: 'jazz-turnaround-lh',
		name: 'Jazz Turnaround LH',
		description: 'Left-hand stride turnaround pattern.',
		category: 'jazz',
		hand: 'left',
		difficulty: 'intermediate',
		suggestedBpm: 110,
		notes: ['C3', 'G3', 'E3', 'Bb3', 'A3', 'Eb3', 'D3', 'G2'],
		tags: ['jazz', 'turnaround', 'stride']
	},
	{
		id: 'latin-montuno-bass',
		name: 'Latin Montuno Bass',
		description: 'Cuban montuno bass line.',
		category: 'latin',
		hand: 'left',
		difficulty: 'intermediate',
		suggestedBpm: 110,
		notes: ['C2', 'G2', 'C3', 'G2', 'F2', 'C3', 'F2', 'C3'],
		tags: ['latin', 'montuno', 'bass']
	},
	{
		id: 'minor-blues-head',
		name: 'Minor Blues Head',
		description: 'Head melody for a minor blues in C.',
		category: 'blues',
		hand: 'right',
		difficulty: 'advanced',
		suggestedBpm: 80,
		notes: ['Eb4', 'G4', 'Bb4', 'Ab4', 'G4', 'Eb4', 'D4', 'C4'],
		tags: ['blues', 'minor', 'head']
	},
	{
		id: 'pentatonic-blues-riff',
		name: 'Pentatonic Blues Riff',
		description: 'Simple blues pentatonic riff.',
		category: 'blues',
		hand: 'right',
		difficulty: 'beginner',
		suggestedBpm: 90,
		notes: ['C4', 'Eb4', 'F4', 'G4', 'Bb4', 'C5'],
		tags: ['blues', 'pentatonic']
	},
	{
		id: 'stride-left-hand',
		name: 'Stride Left Hand',
		description: 'Classic stride piano left hand pattern.',
		category: 'jazz',
		hand: 'left',
		difficulty: 'intermediate',
		suggestedBpm: 100,
		notes: ['C2', 'G3', 'E3', 'C2', 'F2', 'A3', 'F3', 'C2'],
		tags: ['jazz', 'stride']
	},
	{
		id: 'swing-eighth-riff',
		name: 'Swing Eighth Riff',
		description: 'Classic swing eighth-note riff.',
		category: 'bebop',
		hand: 'right',
		difficulty: 'intermediate',
		suggestedBpm: 130,
		notes: ['G4', 'A4', 'Bb4', 'C5', 'A4', 'G4', 'E4', 'C4'],
		tags: ['swing', 'bebop', 'eighth-notes']
	},
	{
		id: 'whole-tone-lick',
		name: 'Whole Tone Lick',
		description: 'Dreamy whole-tone scale lick.',
		category: 'bebop',
		hand: 'right',
		difficulty: 'advanced',
		suggestedBpm: 120,
		notes: ['C4', 'D4', 'E4', 'F#4', 'G#4', 'A#4', 'C5'],
		tags: ['whole-tone', 'jazz', 'chromatic']
	}
];
