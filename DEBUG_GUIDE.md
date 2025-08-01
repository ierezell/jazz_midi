# Jazz MIDI Debug Mode - User Guide

## 🎹 Interactive Testing Without MIDI Hardware

This Jazz MIDI application now includes a comprehensive debug mode that allows you to test all functionality without a physical MIDI keyboard.

## How to Enable Debug Mode

1. **Navigate to any practice page** (Chords, Scales, or Two-Five-Ones)
2. **Click the "🎹 Enable Debug Mode" button** in the page header
3. **The debug panel will appear** in the top-right corner

## Debug Features

### 🖱️ Interactive Virtual Keyboard
- **Click piano keys** to simulate MIDI note input
- **Real-time visual feedback** with highlighted keys
- **Support for multiple simultaneous notes** (polyphonic input)

### ⌨️ Computer Keyboard as MIDI Controller
When debug mode is active, your computer keyboard becomes a piano:

**Lower Row (White Keys):**
- `Z` = C4 (Middle C)
- `X` = D4
- `C` = E4
- `V` = F4
- `B` = G4
- `N` = A4
- `M` = B4

**Lower Row (Black Keys):**
- `S` = C#4
- `D` = D#4
- `G` = F#4
- `H` = G#4
- `J` = A#4

**Upper Row (Higher Octave):**
- `Q` = C5
- `W` = D5
- `E` = E5
- `R` = F5
- `T` = G5
- `Y` = A5
- `U` = B5

**Upper Row (Black Keys):**
- `2` = C#5
- `3` = D#5
- `5` = F#5
- `6` = G#5
- `7` = A#5

### 🎛️ Debug Panel Controls

**Virtual MIDI Controls:**
- **Root Note Selector**: Choose the chord/scale root
- **Octave Selector**: Select octave (3-6)
- **Chord Type Selector**: Pick from all jazz chord types

**Quick Actions:**
- **Play [Chord]**: Instantly play the selected chord
- **Stop All Notes**: Release all currently pressed keys
- **Play [Scale]**: Play a major scale sequence
- **Random Note**: Play a random note for testing

**Status Information:**
- **Active Notes Count**: Shows how many notes are currently pressed
- **Virtual MIDI Status**: Confirms virtual MIDI connection

## Testing Workflows

### 🎯 Chord Practice Testing
1. Enable debug mode
2. Select a chord (e.g., Cmaj7)
3. Use the debug panel "Play Cmaj7" button to instantly test the correct answer
4. Or manually click the keyboard keys: C, E, G, B
5. Or use computer keyboard: `Z` + `C` + `B` + `M`

### 🎵 Scale Practice Testing
1. Navigate to scales page with debug mode enabled
2. Select a scale (e.g., C major)
3. Use the debug panel "Play C Scale" to hear the sequence
4. Or manually play the scale using keyboard or clicks

### 🎼 Two-Five-One Testing
1. Enable debug mode on the progressions page
2. Test each chord in the progression separately
3. Use quick actions to play full chords instantly

## Keyboard Shortcuts Reference

The debug panel displays a quick reference of keyboard shortcuts. Keep it visible while practicing for easy reference.

## Troubleshooting Debug Mode

**Debug Panel Not Appearing:**
- Make sure you clicked "Enable Debug Mode"
- Check browser console for any JavaScript errors

**Computer Keyboard Not Working:**
- Ensure the page has focus (click somewhere on the page)
- Try toggling debug mode off and on again

**Virtual Keyboard Not Responding:**
- Verify debug mode is enabled
- Check that the virtual keyboard shows clickable styling (cursor changes to pointer)

## Performance Notes

- Debug mode is optimized for smooth performance
- Virtual MIDI events use the same processing as real MIDI
- All audio feedback and visual responses work identically
- No network requests are made in debug mode

## Development Benefits

This debug system allows developers and testers to:
- ✅ Test all musical functionality without hardware
- ✅ Quickly verify chord recognition logic
- ✅ Debug audio feedback systems
- ✅ Test responsive design on different screen sizes
- ✅ Demonstrate the app to users without MIDI keyboards
- ✅ Create automated tests for musical logic

## Switching Back to Real MIDI

- Simply click "Hide Debug" in the debug panel
- Or refresh the page to return to normal MIDI mode
- Real MIDI devices will be detected automatically when available

Enjoy testing your jazz skills with the enhanced debug capabilities! 🎵
