# Songs

This folder contains chord progressions for jazz standards and other songs used in the Songs exercise.

Location: `src/lib/data/songs/`

## Adding a New Song

To add a new song, create a JSON file in this folder with the following format:

```json
{
	"name": "Song Name",
	"composer": "Composer Name",
	"key": "Song Key (e.g., Cm, Bb, F#)",
	"chords": [
		{ "note": "C", "type": "maj7" },
		{ "note": "A", "type": "min7" },
		{ "note": "D", "type": "half-dim7" },
		{ "note": "G", "type": "7" }
	]
}
```

### Fields

- **name** (required): The song title
- **composer** (optional): The composer's name
- **key** (optional): The key of the song
- **chords** (required): Array of chord objects with:
  - **note**: Root note (C, C#, Db, D, D#, Eb, E, F, F#, Gb, G, G#, Ab, A, A#, Bb, B)
  - **type**: Chord type (see below)

### Available Chord Types

- `major` - Major triad
- `minor` - Minor triad
- `diminished` - Diminished triad
- `augmented` - Augmented triad
- `sus2` - Suspended 2nd
- `sus4` - Suspended 4th
- `maj7` - Major 7th
- `min7` - Minor 7th
- `7` or `dom7` - Dominant 7th
- `half-dim7` - Half-diminished 7th (m7♭5)
- `dim7` - Fully diminished 7th

### After Adding a Song

After creating your JSON file:

1. Add the filename (without `.json`) to the `songFiles` array in `src/routes/exercises/songs/+page.ts`:

```typescript
const songFiles = ['autumn-leaves', 'blue-bossa', 'all-the-things-you-are', 'your-song-name'];
```

That's it! The song will automatically appear in the dropdown on the Songs exercise page.

## Current Songs

1. **Autumn Leaves** - Joseph Kosma (Gm)
2. **Blue Bossa** - Kenny Dorham (Cm)
3. **All The Things You Are** - Jerome Kern (Ab, partial)
