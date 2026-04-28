# Manual Feature Testing Checklist - Jazz MIDI App

## Test Environment
- **URL:** http://localhost:5173
- **Browser:** Chrome/Chromium
- **Date:** April 28, 2026

---

## 1. Navigation & Layout

### Header Navigation
- [ ] Jazz MIDI logo navigates to Home
- [ ] Journey link works
- [ ] Gym (Exercises) link works
- [ ] Training link works
- [ ] Profile link works
- [ ] Active state shows correctly on each page
- [ ] Mobile hamburger menu (if applicable)

### Theme Toggle
- [ ] Theme toggle button visible in header
- [ ] Click switches between light/dark mode
- [ ] Theme persists on page reload

### MIDI Status
- [ ] MIDI status pill visible in header
- [ ] Shows "No MIDI" or connected device name

---

## 2. Home Page (Dashboard) `/`

### User Profile Section
- [ ] User name displays correctly
- [ ] Experience points shown
- [ ] Level indicator visible

### Statistics Widget
- [ ] Total exercises completed shown
- [ ] Average accuracy displayed
- [ ] Current streak visible
- [ ] Best streak shown

### Active Unit
- [ ] Current unit name displays
- [ ] Unit description visible
- [ ] Progress bar shows completion %

### Today's Lessons
- [ ] Lesson cards display
- [ ] Lesson status icons (locked/available/completed)
- [ ] Clicking lesson navigates to exercise

### Daily Practice
- [ ] "Start Daily Practice" button visible
- [ ] Click navigates to random lesson from active unit

### Weakness Recommendations
- [ ] Weakness section displays when weaknesses exist
- [ ] Recommendation links work
- [ ] No section shown if no weaknesses (expected)

---

## 3. Journey Page `/journey`

### Units Display
- [ ] All 5 units displayed
- [ ] Unit cards show:
  - [ ] Title
  - [ ] Description
  - [ ] Icon
  - [ ] Status (locked/active/completed)
  - [ ] Progress bar

### Unit Interactions
- [ ] Clicking active unit shows lessons
- [ ] Locked units show lock icon
- [ ] Completed units show checkmark

### Lessons Within Unit
- [ ] Lessons list displays
- [ ] Each lesson shows:
  - [ ] Name
  - [ ] Type icon
  - [ ] Status
- [ ] Clicking lesson navigates to exercise

### Practice Mode
- [ ] "Start Practice" button works on active unit
- [ ] Selects random available lesson

---

## 4. Exercises Hub `/exercises`

### Exercise Categories Grid
- [ ] All exercise categories displayed:
  - [ ] Rhythm
  - [ ] Note Names
  - [ ] Intervals
  - [ ] Scales
  - [ ] Chords
  - [ ] Two Five Ones
  - [ ] Flashcards
  - [ ] Songs
  - [ ] Licks
  - [ ] Partition Reading
  - [ ] Dexterity
  - [ ] Boogie
  - [ ] Enclosure
  - [ ] Ghost Notes
  - [ ] Hand Dynamics
  - [ ] Hand Independence
  - [ ] Interval Mimicry
  - [ ] Song Chords
  - [ ] Song Melody
  - [ ] Song Rhythm

### Category Cards
- [ ] Each card shows:
  - [ ] Title
  - [ ] Description
  - [ ] Icon
  - [ ] Difficulty badge
  - [ ] Color coding
- [ ] Clicking card navigates to exercise

---

## 5. Individual Exercise Pages `/exercises/[type]`

### Common Exercise UI
- [ ] Exercise title displays
- [ ] Description visible
- [ ] Back button to exercises hub
- [ ] Breadcrumb navigation

### Score Display
- [ ] Music staff renders
- [ ] Notes display correctly
- [ ] No OSMD rendering errors

### MIDI Input
- [ ] MIDI input accepted
- [ ] Note validation works
- [ ] Correct feedback displayed
- [ ] Incorrect feedback displayed

### Controls
- [ ] BPM control (if applicable)
- [ ] Metronome toggle
- [ ] Restart button
- [ ] Help/info button

### Completion
- [ ] Progress tracked
- [ ] Completion screen shows
- [ ] Stats updated
- [ ] Navigate to next exercise option

---

## 6. Training Page `/training` ⭐ CRITICAL

### Pillar Stats Overview
- [ ] 4 pillars displayed:
  - [ ] Technique
  - [ ] Theory
  - [ ] Vocabulary
  - [ ] Repertoire
- [ ] Each shows:
  - [ ] Icon
  - [ ] Name
  - [ ] Description
  - [ ] Progress stats
  - [ ] Mastery/total ratio
  - [ ] Average accuracy

### Pillar Selection
- [ ] Click pillar card → selects that pillar
- [ ] "Recommended" badge shows on suggested pillar
- [ ] Click updates `selectedPillar` state

### Recommendation Banner
- [ ] Shows "Today's Focus" with pillar name
- [ ] Shows reason for recommendation
- [ ] "Start Recommended Workout" button works

### Weaknesses Section
- [ ] Displays if weaknesses exist
- [ ] Shows up to 3 weak areas
- [ ] Each shows:
  - [ ] Skill name
  - [ ] Pillar
  - [ ] Accuracy percentage
  - [ ] Practice button
- [ ] "Practice" button navigates to exercise

### Workout Generator ⭐ CRITICAL TEST
- [ ] Duration slider (10-60 min) works
- [ ] Shows selected duration
- [ ] Pillar filter buttons:
  - [ ] "All" button (default, selected when `selectedPillar` is undefined)
  - [ ] Individual pillar buttons
  - [ ] Active state shows correctly
- [ ] **GENERATE ALL WORKOUT** ⭐:
  - [ ] Select "All" (no pillar filter)
  - [ ] Click "Generate X-Min Workout"
  - [ ] **Workout generates with exercises** ✅
  - [ ] Shows exercise list
  - [ ] Each exercise has:
    - [ ] Number
    - [ ] Name
    - [ ] Pillar color
    - [ ] Duration
    - [ ] Difficulty
    - [ ] Purpose (weakness/foundation)
    - [ ] Start button
- [ ] **GENERATE FILTERED WORKOUT** ⭐:
  - [ ] Select specific pillar
  - [ ] Click "Generate X-Min Workout"
  - [ ] Workout generates with pillar-specific exercises

### Current Workout Display
- [ ] Shows personalized workout
- [ ] Displays total duration
- [ ] Shows "Targets Weaknesses" tag if applicable
- [ ] Exercise list with:
  - [ ] Exercise number
  - [ ] Exercise name
  - [ ] Pillar badge
  - [ ] Difficulty badge
  - [ ] Duration
  - [ ] Purpose tag
  - [ ] Play/Start button
- [ ] Clicking "Start" navigates to exercise
- [ ] "Close" button hides workout

### Curriculum Path
- [ ] Shows full curriculum path
- [ ] Displays unlocked skills
- [ ] Shows mastery status
- [ ] Practice buttons work

---

## 7. Profile Page `/profile`

### User Info
- [ ] Profile name displays
- [ ] Edit profile option
- [ ] Avatar/icon shown

### Statistics Dashboard
- [ ] Total practice time
- [ ] Total exercises completed
- [ ] Current streak
- [ ] Best streak
- [ ] Overall accuracy

### Achievements
- [ ] Achievement badges displayed
- [ ] Locked achievements shown
- [ ] Unlock criteria visible

### Weakness Analysis
- [ ] Heatmap of missed notes
- [ ] Weak areas listed
- [ ] Recommendations with links

### Practice History
- [ ] Recent activity list
- [ ] Date/time of practice
- [ ] Exercise name
- [ ] Score/accuracy

---

## 8. Login Page `/login`

### Login Form
- [ ] Name input field
- [ ] Submit button
- [ ] Validation messages

### Post-Login
- [ ] Redirects to home
- [ ] Profile created/updated

---

## 9. About Page `/about`

### Content
- [ ] App description
- [ ] Features list
- [ ] How to use guide
- [ ] MIDI setup instructions

---

## 10. Error Handling

### 404 Page
- [ ] Navigate to non-existent route
- [ ] 404 page displays
- [ ] Link back to home works

### Console Errors
- [ ] Check browser console
- [ ] No JavaScript errors
- [ ] No warnings (except expected ones)

---

## Test Results Summary

| Category | Status | Notes |
|----------|--------|-------|
| Navigation | ⬜ | |
| Home Page | ⬜ | |
| Journey | ⬜ | |
| Exercises Hub | ⬜ | |
| Individual Exercises | ⬜ | |
| Training | ⬜ | **CRITICAL** |
| Profile | ⬜ | |
| Login | ⬜ | |
| About | ⬜ | |
| Error Handling | ⬜ | |

**Overall Status:** ⬜ PASS / ⬜ FAIL

---

## Known Issues

*Document any issues found during testing*

1. 
2. 
3. 

---

## Sign-off

**Tester:** _______________  
**Date:** _______________  
**Result:** ⬜ All features working  
         ⬜ Issues found (documented above)
