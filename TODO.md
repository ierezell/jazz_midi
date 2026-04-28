# 📜 Jazz Piano Learning Platform: Curriculum Blueprint

## 🏗️ Core Architecture: The "Modular Day"
Every lesson follows a 4-pillar sequence. The complexity of each pillar is determined by the **Root Note (X)** and the user’s progress in the **Circle of Fifths**.

---

## 🎹 Pillar 1: Technique & Mechanics
*Goal: Build physical dexterity and "Jazz Touch" via MIDI velocity and timing.*

### 1.1 Scale Geometry
* **Progressive Drills:**
    1.  **Single Hand:** Right hand, then Left hand (2 octaves).
    2.  **Parallel Motion:** Both hands together.
    3.  **Interval Logic:** Play scale in 3rds (e.g., C-E, D-F, E-G).
* **Validation:** Increase target BPM (Tempo) as accuracy improves.

### 1.2 Velocity & Articulation
* **The Ghost Note Challenge:** Play 8th-note scales. Downbeats = Velocity < 40; Upbeats ("ands") = Velocity > 80.
* **Independence Drill:** * LH: Play chord shells at Velocity 40–50 (Piano).
    * RH: Play melody/scale at Velocity 90–100 (Forte).
* **Swing Accents:** Validate that the "and" of every beat is slightly louder and slightly delayed (Swing Offset).

---

## 🧠 Pillar 2: Theory & Ear Training
*Goal: Mental mapping of the keyboard and auditory recognition.*

### 2.1 Interval & Chord Construction
* **Interval Mimicry:** Browser plays a random interval within Key X; user must play it back instantly.
* **Voicing Construction:**
    * **Step 1:** Build 7th chords ($1-3-5-7$).
    * **Step 2:** Build Shells ($1-7$ and $1-3$).
    * **Step 3:** Build Rootless/Extensions (e.g., "Play $X7(\#11)$").

### 2.2 Functional Navigation
* **Diatonic 7ths:** Play all 7th chords within Key X ($Imaj7 \rightarrow IIm7 \rightarrow IIIm7 \dots$).
* **The Enclosure Drill:** Practice "circling" target tones. 
    * *Example:* To target the 3rd ($E$) of $C$, play $D \rightarrow F\# \rightarrow E$.

---

## 🎷 Pillar 3: Vocabulary & Patterns
*Goal: Internalizing jazz "DNA" and transposition.*

### 3.1 Harmonic Patterns
* **The $ii-V-I$ Loop:** Practice the progression in Key X using:
    * Standard 7th positions.
    * Inversions (Smooth voice leading).
    * Rootless "Bud Powell" voicings.

### 3.2 Lick Library
* **The Transposition Loop:** 1.  Learn a 2-bar lick in Key X.
    2.  **Challenge:** Immediately transpose and play it in the next key of the Circle of Fifths.
* **Rhythmic Morphing:** Play one lick in three distinct styles:
    * **Straight 8ths** (Latin/Fusion feel).
    * **Swing** (Traditional Jazz feel).
    * **Bossa Nova** (Syncopated Brazilian feel).

---

## 🎵 Pillar 4: The Weekly Standard
*Goal: Apply all pillars to a real song over a 7-day cycle.*

| Day | Focus Area | Objective |
| :--- | :--- | :--- |
| **Mon** | **Foundation** | Bass notes and LH Shells ($1-7$ or $1-3$). |
| **Tue** | **The Head** | Reading and playing the melody with accurate timing. |
| **Wed** | **Arpeggiation** | Play $1-3-5-7$ arpeggios over the song's chord changes. |
| **Thu** | **Full Harmony** | Implement 2-hand voicings or Rootless shapes. |
| **Fri** | **Guided Improvisation** | Solo using only Chord Tones or the "Enclosure" method. |
| **Sat** | **Performance** | Play the full arrangement (Melody + LH Chords). |
| **Sun** | **Review** | Speed trial or recording for the "Progress Portfolio." |

---

## 🛠️ MIDI Technical Requirements for Validation
1.  **Note Accuracy:** Compare MIDI Note-On data against the correct array.
2.  **Velocity Heatmap:** Give the user a visual color-coded report (Blue = Soft, Red = Hard) to visualize their "Ghost Notes."
3.  **Swing Ratio:** Calculate the ratio of the "long" downbeat to the "short" upbeat.
4.  **Legato Check:** Monitor Note-Off timing; ensure notes overlap slightly for a "connected" jazz sound.




# NEW FEATURES : 
Add a feature for audio to midi with https://github.com/spotify/basic-pitch-ts to be able to use microphone instead of a midi instrument.