# 📜 Jazz Piano Learning Platform: Curriculum Blueprint

## 🏗️ Core Architecture: The "Modular Day"

Every lesson follows a 4-pillar sequence. The complexity of each pillar is determined by the **Root Note (X)** and the user’s progress in the **Circle of Fifths**.

---

## 🎹 Pillar 1: Technique & Mechanics

_Goal: Build physical dexterity and "Jazz Touch" via MIDI velocity and timing._

### 1.1 Scale Geometry

- **Progressive Drills:**
  1.  **Single Hand:** Right hand, then Left hand (2 octaves).
  2.  **Parallel Motion:** Both hands together.
  3.  **Interval Logic:** Play scale in 3rds (e.g., C-E, D-F, E-G).
- **Validation:** Increase target BPM (Tempo) as accuracy improves.

### 1.2 Velocity & Articulation

- **The Ghost Note Challenge:** Play 8th-note scales. Downbeats = Velocity < 40; Upbeats ("ands") = Velocity > 80.
- **Independence Drill:** \* LH: Play chord shells at Velocity 40–50 (Piano).
  - RH: Play melody/scale at Velocity 90–100 (Forte).
- **Swing Accents:** Validate that the "and" of every beat is slightly louder and slightly delayed (Swing Offset).

---

## 🧠 Pillar 2: Theory & Ear Training

_Goal: Mental mapping of the keyboard and auditory recognition._

### 2.1 Interval & Chord Construction

- **Interval Mimicry:** Browser plays a random interval within Key X; user must play it back instantly.
- **Voicing Construction:**
  - **Step 1:** Build 7th chords ($1-3-5-7$).
  - **Step 2:** Build Shells ($1-7$ and $1-3$).
  - **Step 3:** Build Rootless/Extensions (e.g., "Play $X7(\#11)$").

### 2.2 Functional Navigation

- **Diatonic 7ths:** Play all 7th chords within Key X ($Imaj7 \rightarrow IIm7 \rightarrow IIIm7 \dots$).
- **The Enclosure Drill:** Practice "circling" target tones.
  - _Example:_ To target the 3rd ($E$) of $C$, play $D \rightarrow F\# \rightarrow E$.

---

## 🎷 Pillar 3: Vocabulary & Patterns

_Goal: Internalizing jazz "DNA" and transposition._

### 3.1 Harmonic Patterns

- **The $ii-V-I$ Loop:** Practice the progression in Key X using:
  - Standard 7th positions.
  - Inversions (Smooth voice leading).
  - Rootless "Bud Powell" voicings.

### 3.2 Lick Library

- **The Transposition Loop:** 1. Learn a 2-bar lick in Key X. 2. **Challenge:** Immediately transpose and play it in the next key of the Circle of Fifths.
- **Rhythmic Morphing:** Play one lick in three distinct styles:
  - **Straight 8ths** (Latin/Fusion feel).
  - **Swing** (Traditional Jazz feel).
  - **Bossa Nova** (Syncopated Brazilian feel).

---

## 🎵 Pillar 4: The Weekly Standard

_Goal: Apply all pillars to a real song over a 7-day cycle._

| Day     | Focus Area               | Objective                                               |
| :------ | :----------------------- | :------------------------------------------------------ |
| **Mon** | **Foundation**           | Bass notes and LH Shells ($1-7$ or $1-3$).              |
| **Tue** | **The Head**             | Reading and playing the melody with accurate timing.    |
| **Wed** | **Arpeggiation**         | Play $1-3-5-7$ arpeggios over the song's chord changes. |
| **Thu** | **Full Harmony**         | Implement 2-hand voicings or Rootless shapes.           |
| **Fri** | **Guided Improvisation** | Solo using only Chord Tones or the "Enclosure" method.  |
| **Sat** | **Performance**          | Play the full arrangement (Melody + LH Chords).         |
| **Sun** | **Review**               | Speed trial or recording for the "Progress Portfolio."  |

---

## 🛠️ MIDI Technical Requirements for Validation

1.  **Note Accuracy:** Compare MIDI Note-On data against the correct array.
2.  **Velocity Heatmap:** Give the user a visual color-coded report (Blue = Soft, Red = Hard) to visualize their "Ghost Notes."
3.  **Swing Ratio:** Calculate the ratio of the "long" downbeat to the "short" upbeat.
4.  **Legato Check:** Monitor Note-Off timing; ensure notes overlap slightly for a "connected" jazz sound.

## ✅ COMPLETED FEATURES

- [x] Audio-to-MIDI using @spotify/basic-pitch (microphone input as MIDI alternative)
- [x] Ghost Note Challenge - Velocity validation exercise (soft downbeats, accented upbeats)
- [x] Interval Mimicry - Ear training (browser plays interval, user plays back)
- [x] Enclosure Drill - Bebop target tone circling patterns
- [x] **Adaptive Training System** - Replaces Weekly Standard with curriculum-based recommendations:
  - `CurriculumEngine` defines 25+ skills across 4 pillars (Technique/Theory/Vocabulary/Repertoire)
  - Weakness identification based on accuracy < 70%
  - Personalized workout generation (40% weaknesses, 30% foundation, 30% repertoire)
  - Pillar balance tracking with recommended daily focus
  - Skill dependency tree (must master basics before advanced)
- [x] Velocity Heatmap - Visual feedback (Blue=Soft, Red=Hard) for ghost note visualization
- [x] Legato Check - Note overlap monitoring for "connected" jazz sound
- [x] Hand Dynamics - Per-hand velocity training with loudness meters (LH soft, RH strong)
- [x] **MusicXML Velocity Support** - Any exercise can opt-in to velocity validation via MusicXML:
  - Parse dynamics markings (p, mp, mf, f, ff) from MusicXML files
  - Support notehead shapes (x=ghost, diamond=accent) for articulation
  - Per-note velocity constraints with min/max ranges
  - `VelocityValidator` class with modes: 'per-note', 'hand-based', 'ghost-accent', 'off'
  - `SongExercise.settings.enableVelocityCheck` to opt-in
  - `buildVelocityMap()` to extract velocity data from any song
- [x] **Unified OSMD Score System** - All exercises now use OpenSheetMusicDisplay:
  - `MusicXMLGenerator.ts` - Converts note arrays to MusicXML format for OSMD rendering
  - `OSMDScore.svelte` - Unified component with cursor tracking, note highlighting, zoom
  - Old exercises can pass notes to OSMD via `generateMusicXML()`
  - Supports: mobile display, note cursor, played/upcoming note highlighting
  - Annotations: II-V-I highlighting, chord inversions, root-third labels

## 🚧 PARTIAL / EXISTING FEATURES

- [~] Swing Accents - Tempo mode exists, could add swing offset validation
- [~] ii-V-I Loop - Exists as `two_five_ones` exercise

## 🔲 REMAINING IMPLEMENTATION GAPS

### Pillar 1: Technique & Mechanics

- [ ] Scale Geometry - Progressive drills (Single Hand → Parallel Motion → 3rds)
- [ ] Ghost Note Challenge could be enhanced with real-time feedback

### Pillar 2: Theory & Ear Training

- [ ] Voicing Construction - Step-by-step 7th chords → Shells → Rootless
- [ ] Diatonic 7ths Navigation - I → II → III chord progression exercise

### Pillar 3: Vocabulary & Patterns

- [ ] Lick Transposition Loop - Auto-transpose to next Circle of Fifths key
- [ ] Rhythmic Morphing - Same lick: Straight 8ths / Swing / Bossa Nova styles

### Pillar 4: Repertoire (via Training System)

- [x] Adaptive workout system - **COMPLETED** via `/training` route
- [ ] Progress Portfolio with audio recording capability

### MIDI Validation Technical Requirements

- [x] Velocity validation from MusicXML - **COMPLETED** via `VelocityValidator`
- [ ] Swing Ratio calculation (long downbeat / short upbeat ratio)
- [ ] Enhanced Legato Check integration into exercises

### MusicXML Velocity Features

MusicXML files can now include velocity expectations that any exercise can use:

```xml
<!-- Dynamics markings are automatically parsed -->
<direction>
  <direction-type>
    <dynamics><p/></dynamics>  <!-- Soft: velocity 40-60 -->
  </direction-type>
</direction>

<!-- Notehead shapes for articulation -->
<note>
  <pitch><step>C</step><octave>4</octave></pitch>
  <notehead>x</notehead>  <!-- Ghost note: velocity < 40 -->
</note>

<note>
  <pitch><step>G</step><octave>4</octave></pitch>
  <notehead>diamond</notehead>  <!-- Accent: velocity > 80 -->
</note>
```

**Exercise Integration:**

```typescript
// Any exercise can enable velocity validation
const exercise: SongExercise = {
	songId: 'my-song',
	exerciseType: 'melody',
	settings: {
		enableVelocityCheck: true, // Opt-in!
		velocityMode: 'per-note', // 'per-note' | 'hand-based' | 'ghost-accent'
		lhVelocityMax: 50, // Optional override
		rhVelocityMin: 80 // Optional override
	}
};

// Use the validator
const validator = VelocityValidator.fromExerciseSettings(exercise.settings);
const result = validator.validate(noteEvent, staff);
// result: { isValid, feedback, deviation, ... }
```
