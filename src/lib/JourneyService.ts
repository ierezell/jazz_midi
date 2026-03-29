import { userStatsService } from './UserStatsService';
import { browser } from '$app/environment';

export interface Lesson {
	id: string;
	title: string;
	type: 'exercise' | 'theory';
	path: string;
	params?: Record<string, string>;
	completed: boolean;
	stars: number; // 0-3

	// New Mastery Fields
	perfectCompletions: number;
	requiredPerfectCompletions: number;
	bpm?: number; // Optional tempo requirement
}

export interface Unit {
	id: string;
	title: string;
	description: string;
	lessons: Lesson[];
	status: 'locked' | 'active' | 'completed';
	color: string;
}

export class JourneyService {
	private static instance: JourneyService;

	// ============================================================
	// CURRICULUM v2.0 — 12 Units: Zero → Jazz Improvisation
	// See src/lib/data/curriculum-design.ts for full rationale.
	// ============================================================
	private units: Unit[] = [

		// ── UNIT 1 ─ First Steps ────────────────────────────────
		// Milestone: Know all 12 note names and their keyboard positions.
		{
			id: 'unit-1',
			title: 'Unit 1: First Steps',
			description: 'Learn the names of all the keys on the piano — white and black.',
			status: 'active',
			color: 'bg-sky-500',
			lessons: [
				{
					id: 'u1-white-keys',
					title: 'White Key Names (C–B)',
					type: 'exercise',
					path: '/exercises/names',
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u1-black-keys',
					title: 'Black Key Names (Sharps & Flats)',
					type: 'exercise',
					path: '/exercises/names',
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u1-keyboard-layout',
					title: 'Five-Finger Position (Middle C)',
					type: 'exercise',
					path: '/exercises/dexterity',
					params: { mode: 'five-finger' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u1-quarter-rhythm',
					title: 'Quarter-Note Groove',
					type: 'exercise',
					path: '/exercises/rhythm',
					params: { patternId: 'rock' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 2
				},
				{
					id: 'u1-flashcards',
					title: 'Flash Card Drill — All Notes',
					type: 'exercise',
					path: '/exercises/flashcards',
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 5
				}
			]
		},

		// ── UNIT 2 ─ Scales: The Foundation ─────────────────────
		// Milestone: Play C, G, and F major scales with correct fingering at 60 BPM.
		{
			id: 'unit-2',
			title: 'Unit 2: Scales — The Foundation',
			description: 'C, G, and F major scales at 60 BPM. Build finger memory.',
			status: 'locked',
			color: 'bg-green-500',
			lessons: [
				{
					id: 'u2-c-scale-60',
					title: 'C Major Scale (60 BPM)',
					type: 'exercise',
					path: '/exercises/scales',
					params: { root: 'C', mode: 'Maj', bpm: '60' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3,
					bpm: 60
				},
				{
					id: 'u2-five-finger-warmup',
					title: 'Five-Finger Warmup',
					type: 'exercise',
					path: '/exercises/dexterity',
					params: { mode: 'five-finger' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u2-g-scale-60',
					title: 'G Major Scale (60 BPM)',
					type: 'exercise',
					path: '/exercises/scales',
					params: { root: 'G', mode: 'Maj', bpm: '60' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3,
					bpm: 60
				},
				{
					id: 'u2-f-scale-60',
					title: 'F Major Scale (60 BPM)',
					type: 'exercise',
					path: '/exercises/scales',
					params: { root: 'F', mode: 'Maj', bpm: '60' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3,
					bpm: 60
				},
				{
					id: 'u2-eighth-rhythm',
					title: 'Eighth-Note Pop Groove',
					type: 'exercise',
					path: '/exercises/rhythm',
					params: { patternId: 'pop' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 2
				},
				{
					id: 'u2-flashcards-all',
					title: 'Flash Cards — All 12 Notes',
					type: 'exercise',
					path: '/exercises/flashcards',
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 5
				}
			]
		},

		// ── UNIT 3 ─ Hearing Distance: Intervals ────────────────
		// Milestone: Identify and play any interval from a unison to an octave.
		{
			id: 'unit-3',
			title: 'Unit 3: Intervals — Hearing Distance',
			description: 'Learn intervals from 2nds to octaves. The grammar of music.',
			status: 'locked',
			color: 'bg-teal-500',
			lessons: [
				{
					id: 'u3-intervals-small',
					title: 'Unison, 2nds, and 3rds',
					type: 'exercise',
					path: '/exercises/intervals',
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u3-intervals-mid',
					title: '4ths and 5ths',
					type: 'exercise',
					path: '/exercises/intervals',
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u3-intervals-large',
					title: '6ths, 7ths, and Octave',
					type: 'exercise',
					path: '/exercises/intervals',
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u3-chromatic',
					title: 'Chromatic Scale — All 12 Notes',
					type: 'exercise',
					path: '/exercises/dexterity',
					params: { mode: 'chromatic' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u3-intervals-mix',
					title: 'Interval Mix Quiz',
					type: 'exercise',
					path: '/exercises/intervals',
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				}
			]
		},

		// ── UNIT 4 ─ Chords I: Triads ───────────────────────────
		// Milestone: Play major and minor triads (root position) in C, G, F.
		{
			id: 'unit-4',
			title: 'Unit 4: Triads — Your First Chords',
			description: 'Major and minor triads in C, G, and F. Harmony starts here.',
			status: 'locked',
			color: 'bg-lime-500',
			lessons: [
				{
					id: 'u4-c-major-triad',
					title: 'C Major Triad',
					type: 'exercise',
					path: '/exercises/chords',
					params: { root: 'C', quality: 'major' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u4-g-major-triad',
					title: 'G Major Triad',
					type: 'exercise',
					path: '/exercises/chords',
					params: { root: 'G', quality: 'major' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u4-f-major-triad',
					title: 'F Major Triad',
					type: 'exercise',
					path: '/exercises/chords',
					params: { root: 'F', quality: 'major' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u4-minor-triads',
					title: 'Minor Triads (Am, Dm, Em)',
					type: 'exercise',
					path: '/exercises/chords',
					params: { root: 'A', quality: 'minor' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u4-diatonic-triads-c',
					title: 'Diatonic Triads in C',
					type: 'exercise',
					path: '/exercises/chords',
					params: { root: 'C', quality: 'diatonic' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u4-c-scale-90',
					title: 'C Major Scale (90 BPM)',
					type: 'exercise',
					path: '/exercises/scales',
					params: { root: 'C', mode: 'Maj', bpm: '90' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3,
					bpm: 90
				}
			]
		},

		// ── UNIT 5 ─ Chords II: The Jazz Sound ──────────────────
		// Milestone: Play maj7, min7, dom7, and half-dim chords; hear the difference.
		{
			id: 'unit-5',
			title: 'Unit 5: 7th Chords — The Jazz Sound',
			description: 'Add the 7th — now everything sounds jazzy. Cmaj7, Dm7, G7, and more.',
			status: 'locked',
			color: 'bg-yellow-500',
			lessons: [
				{
					id: 'u5-cmaj7',
					title: 'Cmaj7 — The Major 7th Sound',
					type: 'exercise',
					path: '/exercises/chords',
					params: { root: 'C', quality: 'maj7' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u5-dm7',
					title: 'Dm7 — The Minor 7th Sound',
					type: 'exercise',
					path: '/exercises/chords',
					params: { root: 'D', quality: 'min7' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u5-g7',
					title: 'G7 — The Dominant 7th Sound',
					type: 'exercise',
					path: '/exercises/chords',
					params: { root: 'G', quality: 'dom7' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u5-half-dim',
					title: 'Bm7b5 — Half-Diminished',
					type: 'exercise',
					path: '/exercises/chords',
					params: { root: 'B', quality: 'half-dim' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u5-diatonic-7ths-c',
					title: '7th Chords in C (All Diatonic)',
					type: 'exercise',
					path: '/exercises/chords',
					params: { root: 'C', quality: 'diatonic7' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u5-shell-root-7',
					title: 'Shell Voicings: Root + 7th (LH)',
					type: 'exercise',
					path: '/exercises/chords',
					params: { root: 'C', quality: 'maj7', voicing: 'shell' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u5-intervals-7ths',
					title: 'Interval Review: 7ths by Ear',
					type: 'exercise',
					path: '/exercises/intervals',
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				}
			]
		},

		// ── UNIT 6 ─ The Big One: ii-V-I ────────────────────────
		// Milestone: Play ii-V-I in C, G, and F with both hands.
		{
			id: 'unit-6',
			title: 'Unit 6: ii-V-I — The Heart of Jazz',
			description: 'Dm7 → G7 → Cmaj7. The most important three chords in jazz.',
			status: 'locked',
			color: 'bg-orange-500',
			lessons: [
				{
					id: 'u6-ii-v-i-listen',
					title: 'Hear the ii-V-I Resolution',
					type: 'exercise',
					path: '/exercises/chords',
					params: { root: 'C', quality: 'ii-v-i-intro' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u6-ii-v-i-c-rh',
					title: 'ii-V-I in C — Right Hand',
					type: 'exercise',
					path: '/exercises/two_five_ones',
					params: { key: 'C' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u6-shell-full',
					title: 'Shell Voicings: Root + 3rd + 7th',
					type: 'exercise',
					path: '/exercises/chords',
					params: { root: 'C', quality: 'maj7', voicing: 'guide-tones' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u6-ii-v-i-g',
					title: 'ii-V-I in G',
					type: 'exercise',
					path: '/exercises/two_five_ones',
					params: { key: 'G' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u6-ii-v-i-f',
					title: 'ii-V-I in F',
					type: 'exercise',
					path: '/exercises/two_five_ones',
					params: { key: 'F' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u6-charleston-rhythm',
					title: 'Charleston Rhythm on ii-V-I',
					type: 'exercise',
					path: '/exercises/rhythm',
					params: { patternId: 'jazz-charleston' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u6-g-scale-90',
					title: 'G Major Scale (90 BPM)',
					type: 'exercise',
					path: '/exercises/scales',
					params: { root: 'G', mode: 'Maj', bpm: '90' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3,
					bpm: 90
				}
			]
		},

		// ── UNIT 7 ─ Feel: Swing & Blues Rhythm ─────────────────
		// Milestone: Play a blues shuffle and jazz comping pattern with both hands.
		{
			id: 'unit-7',
			title: 'Unit 7: Feel — Swing & Blues',
			description: 'Grooves, shuffles, and the boogie. This is where jazz breathes.',
			status: 'locked',
			color: 'bg-red-500',
			lessons: [
				{
					id: 'u7-blues-shuffle',
					title: 'Blues Shuffle Rhythm',
					type: 'exercise',
					path: '/exercises/rhythm',
					params: { patternId: 'blues-shuffle' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u7-blues-walking-bass',
					title: 'Blues Walking Bass Lick',
					type: 'exercise',
					path: '/exercises/licks',
					params: { lickId: 'blues-walking-bass' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u7-blues-shells-rhythm',
					title: 'Blues Shells: Root-Fifth + Voicings',
					type: 'exercise',
					path: '/exercises/rhythm',
					params: { patternId: 'blues-shells' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u7-pentatonic-blues-riff',
					title: 'Pentatonic Blues Riff',
					type: 'exercise',
					path: '/exercises/licks',
					params: { lickId: 'pentatonic-blues-riff' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u7-hand-independence-1',
					title: 'Hand Independence: Shells + Scale',
					type: 'exercise',
					path: '/exercises/hand_independence',
					params: { level: '1' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u7-boogie',
					title: 'Boogie-Woogie Pattern',
					type: 'exercise',
					path: '/exercises/boogie',
					params: {},
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				}
			]
		},

		// ── UNIT 8 ─ Improvisation I: Blues Scale ────────────────
		// Milestone: Improvise a short phrase over the blues using the blues scale.
		{
			id: 'unit-8',
			title: 'Unit 8: Improv I — The Blues Scale',
			description: 'The six notes that built jazz and rock. C and G blues scales.',
			status: 'locked',
			color: 'bg-rose-600',
			lessons: [
				{
					id: 'u8-c-blues-scale',
					title: 'C Blues Scale',
					type: 'exercise',
					path: '/exercises/scales',
					params: { root: 'C', mode: 'Blues' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u8-g-blues-scale',
					title: 'G Blues Scale',
					type: 'exercise',
					path: '/exercises/scales',
					params: { root: 'G', mode: 'Blues' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u8-blues-shuffle-right',
					title: 'Blues Shuffle Right-Hand Lick',
					type: 'exercise',
					path: '/exercises/licks',
					params: { lickId: 'blues-shuffle-right' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u8-minor-blues-head',
					title: 'Minor Blues Head',
					type: 'exercise',
					path: '/exercises/licks',
					params: { lickId: 'minor-blues-head' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u8-hand-independence-2',
					title: 'Hand Independence: Walking Bass + Melody',
					type: 'exercise',
					path: '/exercises/hand_independence',
					params: { level: '2' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u8-sight-reading',
					title: 'Sight Reading: Lead Sheet Basics',
					type: 'exercise',
					path: '/exercises/partition',
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u8-f-scale-120',
					title: 'F Major Scale (120 BPM)',
					type: 'exercise',
					path: '/exercises/scales',
					params: { root: 'F', mode: 'Maj', bpm: '120' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3,
					bpm: 120
				}
			]
		},

		// ── UNIT 9 ─ Improvisation II: Jazz Licks & Vocabulary ──
		// Milestone: Have 5 memorised jazz phrases ready to use over a ii-V-I.
		{
			id: 'unit-9',
			title: 'Unit 9: Improv II — Jazz Licks',
			description: 'Learn 5 essential jazz phrases. Bebop, swing, enclosures.',
			status: 'locked',
			color: 'bg-amber-500',
			lessons: [
				{
					id: 'u9-swing-eighth-riff',
					title: 'Swing Eighth-Note Riff',
					type: 'exercise',
					path: '/exercises/licks',
					params: { lickId: 'swing-eighth-riff' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u9-jazz-turnaround-lh',
					title: 'ii-V-I Turnaround Left Hand',
					type: 'exercise',
					path: '/exercises/licks',
					params: { lickId: 'jazz-turnaround-lh' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u9-bebop-scale-run',
					title: 'Bebop Scale Run',
					type: 'exercise',
					path: '/exercises/licks',
					params: { lickId: 'bebop-scale-run' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u9-bebop-enclosure',
					title: 'Bebop Enclosure Lick',
					type: 'exercise',
					path: '/exercises/licks',
					params: { lickId: 'bebop-enclosure' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u9-dorian-mode-run',
					title: 'Dorian Mode Run (ii chord)',
					type: 'exercise',
					path: '/exercises/licks',
					params: { lickId: 'dorian-mode-run' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u9-hand-independence-3',
					title: 'Hand Independence: Chord Melody',
					type: 'exercise',
					path: '/exercises/hand_independence',
					params: { level: '3' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u9-ii-v-i-d',
					title: 'ii-V-I in D major',
					type: 'exercise',
					path: '/exercises/two_five_ones',
					params: { key: 'D' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				}
			]
		},

		// ── UNIT 10 ─ Songs I: First Standards ──────────────────
		// Milestone: Play Fly Me To The Moon and Autumn Leaves with chord changes.
		{
			id: 'unit-10',
			title: 'Unit 10: Songs I — First Standards',
			description: 'Real jazz tunes. Fly Me, Autumn Leaves, Summertime, Blue Bossa.',
			status: 'locked',
			color: 'bg-purple-500',
			lessons: [
				{
					id: 'u10-fly-me',
					title: 'Fly Me To The Moon',
					type: 'exercise',
					path: '/exercises/songs',
					params: { song: 'fly_me_to_the_moon' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 1
				},
				{
					id: 'u10-autumn-leaves',
					title: 'Autumn Leaves',
					type: 'exercise',
					path: '/exercises/songs',
					params: { song: 'autumn_leaves' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 1
				},
				{
					id: 'u10-summertime',
					title: 'Summertime',
					type: 'exercise',
					path: '/exercises/songs',
					params: { song: 'summertime' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u10-latin-montuno-rhythm',
					title: 'Latin Montuno Rhythm',
					type: 'exercise',
					path: '/exercises/rhythm',
					params: { patternId: 'latin-montuno' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u10-blue-bossa',
					title: 'Blue Bossa',
					type: 'exercise',
					path: '/exercises/songs',
					params: { song: 'blue_bossa' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u10-gospel-chord-run',
					title: 'Gospel Chord Run Lick',
					type: 'exercise',
					path: '/exercises/licks',
					params: { lickId: 'gospel-chord-run' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u10-ii-v-i-bb',
					title: 'ii-V-I in Bb',
					type: 'exercise',
					path: '/exercises/two_five_ones',
					params: { key: 'Bb' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				}
			]
		},

		// ── UNIT 11 ─ Songs II: Standards + Hand Mastery ────────
		// Milestone: Play All The Things You Are and Misty with a steady LH comp.
		{
			id: 'unit-11',
			title: 'Unit 11: Songs II — Standards & Mastery',
			description: 'All The Things You Are, Misty, stride piano, and Herbie grooves.',
			status: 'locked',
			color: 'bg-violet-600',
			lessons: [
				{
					id: 'u11-all-the-things',
					title: 'All The Things You Are',
					type: 'exercise',
					path: '/exercises/songs',
					params: { song: 'all_the_things_you_are' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u11-misty',
					title: 'Misty',
					type: 'exercise',
					path: '/exercises/songs',
					params: { song: 'misty' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u11-hand-independence-4',
					title: 'Hand Independence: Stride Piano',
					type: 'exercise',
					path: '/exercises/hand_independence',
					params: { level: '4' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 5
				},
				{
					id: 'u11-herbie-funk',
					title: 'Herbie Hancock Funk Groove',
					type: 'exercise',
					path: '/exercises/rhythm',
					params: { patternId: 'herbie-funk' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 5
				},
				{
					id: 'u11-whole-tone-lick',
					title: 'Whole Tone Lick',
					type: 'exercise',
					path: '/exercises/licks',
					params: { lickId: 'whole-tone-lick' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 5
				},
				{
					id: 'u11-funky-bass-line',
					title: 'Funky Bass Line',
					type: 'exercise',
					path: '/exercises/licks',
					params: { lickId: 'funky-bass-line' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u11-sight-reading-8ths',
					title: 'Sight Reading: Eighth-Note Melodies',
					type: 'exercise',
					path: '/exercises/partition',
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				}
			]
		},

		// ── UNIT 12 ─ Modal Jazz & Free Vocabulary ───────────────
		// Milestone: Improvise over So What; understand Dorian and Mixolydian.
		{
			id: 'unit-12',
			title: 'Unit 12: Modal Jazz — So What',
			description: 'D Dorian, G Mixolydian, So What, and all 12 ii-V-I keys.',
			status: 'locked',
			color: 'bg-fuchsia-600',
			lessons: [
				{
					id: 'u12-d-dorian',
					title: 'D Dorian Scale',
					type: 'exercise',
					path: '/exercises/scales',
					params: { root: 'D', mode: 'Dorian' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u12-g-mixolydian',
					title: 'G Mixolydian Scale',
					type: 'exercise',
					path: '/exercises/scales',
					params: { root: 'G', mode: 'Mixolydian' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u12-so-what',
					title: 'So What',
					type: 'exercise',
					path: '/exercises/songs',
					params: { song: 'so_what' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u12-latin-montuno-lick',
					title: 'Latin Montuno Bass Lick',
					type: 'exercise',
					path: '/exercises/licks',
					params: { lickId: 'latin-montuno-bass' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				},
				{
					id: 'u12-funk-16th-bass',
					title: 'Funk 16th-Note Bass Lick',
					type: 'exercise',
					path: '/exercises/licks',
					params: { lickId: 'funk-sixteenth-bass' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 5
				},
				{
					id: 'u12-minor-blues-head',
					title: 'Minor Blues Head (Advanced)',
					type: 'exercise',
					path: '/exercises/licks',
					params: { lickId: 'minor-blues-head' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 5
				},
				{
					id: 'u12-ii-v-i-all-keys',
					title: 'ii-V-I — The Full Cycle',
					type: 'exercise',
					path: '/exercises/two_five_ones',
					params: { key: 'cycle' },
					completed: false,
					stars: 0,
					perfectCompletions: 0,
					requiredPerfectCompletions: 3
				}
			]
		}
	];

	private constructor() {
		this.loadProgress();
	}

	static getInstance(): JourneyService {
		if (!JourneyService.instance) {
			JourneyService.instance = new JourneyService();
		}
		return JourneyService.instance;
	}

	getUnits(): Unit[] {
		return this.units;
	}

	getUnit(unitId: string): Unit | undefined {
		return this.units.find((u) => u.id === unitId);
	}

	completeLesson(unitId: string, lessonId: string, stars: number = 3) {
		const unit = this.units.find((u) => u.id === unitId);
		if (!unit) return;

		const lesson = unit.lessons.find((l) => l.id === lessonId);
		if (!lesson) return;

		// Logic for Mastery:
		// If 3 stars (perfect), increment perfectCompletions
		if (stars === 3) {
			lesson.perfectCompletions = (lesson.perfectCompletions || 0) + 1;
		}

		// Mark as completed if we hit the requirement
		// OR if it was already marked completed (don't un-complete it)
		if (lesson.perfectCompletions >= lesson.requiredPerfectCompletions) {
			lesson.completed = true;
		}

		lesson.stars = Math.max(lesson.stars, stars);

		this.checkUnitCompletion(unit);
		this.saveProgress();
	}

	getStats() {
		const stats = userStatsService.getStatistics();
		const profile = userStatsService.getProfile();
		return {
			level: profile.level,
			xp: profile.experiencePoints,
			streak: stats.currentStreak
		};
	}

	private checkUnitCompletion(unit: Unit) {
		const allCompleted = unit.lessons.every((l) => l.completed);
		if (allCompleted) {
			unit.status = 'completed';
			this.unlockNextUnit(unit.id);
		}
	}

	private unlockNextUnit(currentUnitId: string) {
		const index = this.units.findIndex((u) => u.id === currentUnitId);
		if (index !== -1 && index < this.units.length - 1) {
			const nextUnit = this.units[index + 1];
			if (nextUnit.status === 'locked') {
				nextUnit.status = 'active';
			}
		}
	}

	// Simple persistence using localStorage for now
	private saveProgress() {
		if (!browser || typeof localStorage === 'undefined') return;

		const progress = this.units.map(u => ({
			id: u.id,
			status: u.status,
			lessons: u.lessons.map(l => ({
				id: l.id,
				completed: l.completed,
				stars: l.stars,
				perfectCompletions: l.perfectCompletions
			}))
		}));

		localStorage.setItem('journey_progress_v2', JSON.stringify(progress));
	}

	private loadProgress() {
		if (!browser || typeof localStorage === 'undefined') return;

		const saved = localStorage.getItem('journey_progress_v2');
		if (!saved) return;

		try {
			interface SavedLesson {
				id: string;
				completed: boolean;
				stars: number;
				perfectCompletions?: number;
			}

			interface SavedUnit {
				id: string;
				status: 'locked' | 'active' | 'completed';
				lessons: SavedLesson[];
			}

			const progress = JSON.parse(saved) as SavedUnit[];
			// Merge saved progress with current structure
			progress.forEach((savedUnit) => {
				const unit = this.units.find(u => u.id === savedUnit.id);
				if (unit) {
					unit.status = savedUnit.status;
					savedUnit.lessons.forEach((savedLesson) => {
						const lesson = unit.lessons.find(l => l.id === savedLesson.id);
						if (lesson) {
							lesson.completed = savedLesson.completed;
							lesson.stars = savedLesson.stars;
							lesson.perfectCompletions = savedLesson.perfectCompletions ?? 0;
						}
					});
				}
			});
		} catch (e) {
			console.error('Failed to load journey progress', e);
		}
	}

	// Helper to generate the URL for a lesson
	getLessonUrl(unit: Unit, lesson: Lesson): string {
		const params = new URLSearchParams();
		if (lesson.params) {
			Object.entries(lesson.params).forEach(([k, v]) => params.append(k, v));
		}
		// Add context so the exercise knows where to return/update
		params.append('unitId', unit.id);
		params.append('lessonId', lesson.id);

		return `${lesson.path}?${params.toString()}`;
	}

	getPracticeLesson(unitId: string): { unit: Unit, lesson: Lesson } | undefined {
		const unit = this.units.find(u => u.id === unitId);
		if (!unit) return undefined;

		// User expects "Practice random exercise from THIS level"
		// So we strictly scope to the target unit.

		// 1. Find unmastered lessons in the target unit
		const unmastered = unit.lessons.filter(l => (l.perfectCompletions || 0) < l.requiredPerfectCompletions);

		if (unmastered.length > 0) {
			const randomIndex = Math.floor(Math.random() * unmastered.length);
			return { unit, lesson: unmastered[randomIndex] };
		}

		// 2. If all mastered, just pick any random lesson from this unit
		if (unit.lessons.length > 0) {
			const randomLesson = unit.lessons[Math.floor(Math.random() * unit.lessons.length)];
			return { unit, lesson: randomLesson };
		}

		return undefined;
	}
}

export const journeyService = JourneyService.getInstance();
