# Jazz Licks Exercise

## Overview

The Licks exercise helps you practice jazz vocabulary and develop finger mechanics through classic musical phrases from various styles like blues, bebop, latin, funk, and more.

## Features

- **Multiple Styles**: Blues, bebop, latin, rock, country, funk, boogie, and jazz
- **Hand-specific Practice**: Filter by left hand, right hand, or both hands
- **Difficulty Levels**: Beginner, intermediate, and advanced licks
- **Visual Feedback**: Musical score display, progress bar, and real-time note validation
- **Metronome Support**: Practice with tempo control
- **BPM Suggestions**: Each lick comes with a suggested tempo

## Adding New Licks

To add a new lick to the library:

### 1. Create a JSON file

Create a new file in `src/lib/data/licks/` with this structure:

```json
{
	"id": "unique-lick-id",
	"name": "Lick Display Name",
	"description": "Brief description of the lick and its style",
	"category": "blues",
	"hand": "left",
	"difficulty": "beginner",
	"suggestedBpm": 100,
	"notes": ["C2", "E2", "G2", "A2"],
	"tags": ["walking-bass", "swing"]
}
```

#### Field Reference:

- **id**: Unique identifier (kebab-case recommended)
- **name**: Display name shown to users
- **description**: Brief explanation of the lick
- **category**: One of: `blues`, `bebop`, `latin`, `rock`, `country`, `funk`, `boogie`, `jazz`
- **hand**: `left`, `right`, or `both`
- **difficulty**: `beginner`, `intermediate`, or `advanced`
- **suggestedBpm**: Recommended tempo (number)
- **notes**: Array of note names with octaves (e.g., `["C4", "D4", "E4"]`)
- **tags**: Optional array of descriptive tags

### 2. Import in licksData.ts

Add your lick to `src/lib/data/licksData.ts`:

```typescript
import yourNewLick from './licks/your-new-lick.json';

export const licks: Lick[] = [
	// ... existing licks
	yourNewLick as Lick
];
```

### 3. Test Your Lick

1. Navigate to `/exercises/licks`
2. Select the appropriate filters (hand, difficulty)
3. Click "New Lick" until your lick appears
4. Verify the notes display correctly on the score
5. Play through the lick to confirm validation works

## Current Licks Library

### Blues
- **Blues Walking Bass** (Left, Beginner) - Classic root-3rd-5th-6th pattern
- **Blues Shuffle Lick** (Right, Beginner) - Shuffle pattern with chromatic approach

### Bebop
- **Bebop Scale Run** (Right, Intermediate) - Dominant scale with chromatic passing tone
- **Bebop Enclosure** (Right, Advanced) - Chromatic enclosure technique

### Boogie
- **Boogie Woogie Right Hand** (Right, Beginner) - Classic triplet pattern

### Latin
- **Latin Montuno Bass** (Left, Intermediate) - Traditional montuno pattern

### Country
- **Country Alternating Bass** (Left, Beginner) - Stride-style alternating bass

### Funk
- **Funk Sixteenth Bass** (Left, Advanced) - Syncopated sixteenth note pattern

### Jazz
- **Stride Piano Left Hand** (Left, Intermediate) - Classic stride alternating pattern

## Tips for Creating Good Licks

1. **Keep it focused**: 8-16 notes is ideal for finger mechanics practice
2. **Use realistic ranges**: 
   - Left hand: C1-C4
   - Right hand: C4-C6
3. **Match difficulty to complexity**:
   - Beginner: Simple patterns, mostly stepwise motion
   - Intermediate: Some jumps, chromatic passages
   - Advanced: Large intervals, fast passages, complex rhythms
4. **Set appropriate BPM**:
   - Slow (60-100): Good for learning patterns
   - Medium (100-130): Standard practice tempo
   - Fast (130+): Performance tempo
5. **Add helpful tags**: Include style markers like "chromatic", "swing", "syncopated"

## Future Enhancements

Potential features to add:

- [ ] Rhythm notation display
- [ ] Audio playback of the lick
- [ ] Transposition to different keys
- [ ] Loop mode for repetition practice
- [ ] Performance recording and playback
- [ ] Integration with Journey mode
- [ ] User-created licks library
- [ ] Import from MIDI files
- [ ] Import from MusicXML/MuseScore files
