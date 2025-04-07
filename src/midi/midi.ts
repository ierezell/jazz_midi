
export type MidiNote = 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 | 90 | 91 | 92 | 93 | 94 | 95 | 96 | 97 | 98 | 99 | 100 | 101 | 102 | 103 | 104 | 105 | 106 | 107 | 108 | 109 | 110 | 111 | 112 | 113 | 114 | 115 | 116 | 117 | 118 | 119 | 120 | 121 | 122 | 123 | 124 | 125 | 126 | 127 | 128;
export type NoteFullName = "C0" | "C#0" | "D0" | "D#0" | "E0" | "F0" | "F#0" | "G0" | "G#0" | "A0" | "A#0" | "B0" | "C1" | "C#1" | "D1" | "D#1" | "E1" | "F1" | "F#1" | "G1" | "G#1" | "A1" | "A#1" | "B1" | "C2" | "C#2" | "D2" | "D#2" | "E2" | "F2" | "F#2" | "G2" | "G#2" | "A2" | "A#2" | "B2" | "C3" | "C#3" | "D3" | "D#3" | "E3" | "F3" | "F#3" | "G3" | "G#3" | "A3" | "A#3" | "B3" | "C4" | "C#4" | "D4" | "D#4" | "E4" | "F4" | "F#4" | "G4" | "G#4" | "A4" | "A#4" | "B4" | "C5" | "C#5" | "D5" | "D#5" | "E5" | "F5" | "F#5" | "G5" | "G#5" | "A5" | "A#5" | "B5" | "C6" | "C#6" | "D6" | "D#6" | "E6" | "F6" | "F#6" | "G6" | "G#6" | "A6" | "A#6" | "B6" | "C7" | "C#7" | "D7" | "D#7" | "E7" | "F7" | "F#7" | "G7" | "G#7" | "A7" | "A#7" | "B7"| "C8"| "C#8"| "D8"| "D#8"| "E8"| "F8"| "F#8"| "G8"| "G#8";
export const MidiConversion: { [key in MidiNote]: NoteFullName } = {
    24: "C0",
    25: "C#0",
    26: "D0",
    27: "D#0",
    28: "E0",   
    29: "F0",
    30: "F#0",
    31: "G0",
    32: "G#0",
    33: "A0",
    34: "A#0",
    35: "B0",
    36: "C1",
    37: "C#1",
    38: "D1",
    39: "D#1",
    40: "E1",
    41: "F1",
    42: "F#1",
    43: "G1",
    44: "G#1",
    45: "A1",
    46: "A#1",
    47: "B1",
    48: "C2",
    49: "C#2",
    50: "D2",
    51: "D#2",
    52: "E2",
    53: "F2",
    54: "F#2",
    55: "G2",
    56: "G#2",
    57: "A2",
    58: "A#2",
    59: "B2",
    60: "C3",
    61: "C#3",
    62: "D3",
    63: "D#3",
    64: "E3",
    65: "F3",
    66: "F#3",
    67: "G3",
    68: "G#3",
    69: "A3",
    70: "A#3",
    71: "B3",
    72: "C4",
    73: "C#4",
    74: "D4",
    75: "D#4",
    76: "E4",
    77: "F4",
    78: "F#4",
    79: "G4",
    80: "G#4",
    81: "A4",
    82: "A#4",
    83: "B4",
    84: "C5",
    85: "C#5",
    86: "D5",
    87: "D#5",
    88: "E5",
    89: "F5",
    90: "F#5",
    91: "G5",
    92: "G#5",
    93: "A5",
    94: "A#5",
    95: "B5",
    96: "C6",
    97: "C#6",
    98: "D6",
    99: "D#6",
    100: "E6",
    101: "F6",
    102: "F#6",
    103: "G6",
    104: "G#6",
    105: "A6",
    106: "A#6",
    107: "B6",
    108: "C7",
    109: "C#7",
    110: "D7",
    111: "D#7",
    112: "E7",
    113: "F7",
    114: "F#7",
    115: "G7",
    116: "G#7",
    117: "A7",
    118: "A#7",
    119: "B7",
    120: "C8",
    121: "C#8",
    122: "D8",
    123: "D#8",
    124: "E8",
    125: "F8",
    126: "F#8",
    127: "G8",
    128: "G#8",
}

export type Note = "Ab"| "A"| "A#"| "Bb"| "B"| "C"| "C#"| "Db"| "D"| "D#"| "Eb"| "E"| "F"| "F#"| "Gb"| "G"| "G#";
export type NoteEvent = {
    noteNumber: MidiNote;
    type: "on" | "off";
    noteFullName: NoteFullName;
    noteName: Note;
    velocity: number;
    time: number;
}

export type MIDICallback = (event: MIDIMessageEvent) => NoteEvent;

export function getMidiNote(event: MIDIMessageEvent): NoteEvent {
    // Mozilla doc : https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API
    // Doc high level : https://webaudio.github.io/web-midi-api/
    // Spec :  https://drive.google.com/file/d/1ewRrvMEFRPlKon6nfSCxqnTMEu70sz0c/view
    //
    //      C  C  C  C  C  C  C  C   C   C
    // Middle C is note number 60 (MIDI note number)
    // 0 12 24 36 48 60 72 84 96 108 120 127
    //     |     piano range      |    
    
    const data = event.data!; // Uint8Array of MIDI message bytes
    // The first byte is the status byte:
    //   - The upper 4 bits represent the command.
    //   - The lower 4 bits represent the channel.
    const command = data[0] >> 4;
    const channel = data[0] & 0x0f;
    const noteNumber = data[1];
    const velocity = data[2];

    // According to MIDI specs:
    //  - 9 (0x9) means Note On (if velocity > 0)
    //  - 8 (0x8) means Note Off
    // Additionally, some devices send a Note On with velocity 0 to indicate Note Off.
    let noteType: "on" | "off" = "off";
    if (command === 9 && velocity > 0) {
        console.log(`Note On: Channel ${channel + 1}, Note ${noteNumber}, Velocity ${velocity}`);
        noteType = "on";
    } else if (command === 8 || (command === 9 && velocity === 0)) {
        console.log(`Note Off: Channel ${channel + 1}, Note ${noteNumber}`);
        noteType = "off";
    } else {
        console.log(`Other MIDI message: [${Array.from(data).join(", ")}]`);
    }

    return {
        noteNumber: noteNumber as MidiNote,
        noteFullName: MidiConversion[noteNumber as MidiNote] as NoteFullName,
        noteName: MidiConversion[noteNumber as MidiNote].slice(0,-1) as Note,
        velocity: velocity,
        time: event.timeStamp,
        type:noteType,
    }
}




export async function RequestMidiAccess(): Promise<MIDIAccess> {
    // Request access in the browser to MIDI devices.
    // Then plug the callback on every input device.
    let midiAccess: MIDIAccess = await navigator.requestMIDIAccess({ sysex: false })
    console.log('MIDI Access obtained.');
    return midiAccess
}

export function ChangeMidiCallback(midiAccess: MIDIAccess, midiCallback: MIDICallback): void {
    midiAccess.inputs.forEach((input) => {
        let infos = `Input port [type:'${input.type}']` + ` id:'${input.id}'` + ` manufacturer:'${input.manufacturer}'` + ` name:'${input.name}'` + ` version:'${input.version}'`
        console.log(`Found MIDI Input: ${infos}`);
        input.onmidimessage = midiCallback;
    });

    midiAccess.onstatechange = (event) => {
        const port = event.port!;
        console.log(`MIDI port state changed: ${port.name} is now ${port.state}`);
    };
}


