
export type MidiNote = 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 | 90 | 91 | 92 | 93 | 94 | 95 | 96 | 97 | 98 | 99 | 100 | 101 | 102 | 103 | 104 | 105 | 106 | 107 | 108 | 109 | 110 | 111 | 112 | 113 | 114 | 115 | 116 | 117 | 118 | 119 | 120 | 121 | 122 | 123 | 124 | 125 | 126 | 127 | 128;
export const AllMidiNotes: MidiNote[] = [
    24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
    36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
    48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
    60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
    72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83,
    84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95,
    96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107,
    108, 109, 110, 111, 112, 113, 114, 115, 116, 117,
    118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128]
export type NoteFullName =  "C0"| "C#0"| "Db0"| "D0"| "D#0"| "Eb0"| "E0"| "F0"| "F#0"| "Gb0"| "G0"| "G#0"| "Ab0"| "A0"| "A#0"| "Bb0"| "B0"|
"C1"| "C#1"| "Db1"| "D1"| "D#1"| "Eb1"| "E1"| "F1"| "F#1"| "Gb1"| "G1"| "G#1"| "Ab1"| "A1"| "A#1"| "Bb1"| "B1"|
"C2"| "C#2"| "Db2"| "D2"| "D#2"| "Eb2"| "E2"| "F2"| "F#2"| "Gb2"| "G2"| "G#2"| "Ab2"| "A2"| "A#2"| "Bb2"| "B2"|
"C3"| "C#3"| "Db3"| "D3"| "D#3"| "Eb3"| "E3"| "F3"| "F#3"| "Gb3"| "G3"| "G#3"| "Ab3"| "A3"| "A#3"| "Bb3"| "B3"|
"C4"| "C#4"| "Db4"| "D4"| "D#4"| "Eb4"| "E4"| "F4"| "F#4"| "Gb4"| "G4"| "G#4"| "Ab4"| "A4"| "A#4"| "Bb4"| "B4"|
"C5"| "C#5"| "Db5"| "D5"| "D#5"| "Eb5"| "E5"| "F5"| "F#5"| "Gb5"| "G5"| "G#5"| "Ab5"| "A5"| "A#5"| "Bb5"| "B5"|
"C6"| "C#6"| "Db6"| "D6"| "D#6"| "Eb6"| "E6"| "F6"| "F#6"| "Gb6"| "G6"| "G#6"| "Ab6"| "A6"| "A#6"| "Bb6"| "B6"|
"C7"| "C#7"| "Db7"| "D7"| "D#7"| "Eb7"| "E7"| "F7"| "F#7"| "Gb7"| "G7"| "G#7"| "Ab7"| "A7"| "A#7"| "Bb7"| "B7"|
"C8"| "C#8"| "Db8"| "D8"| "D#8"| "Eb8"| "E8"| "F8"| "F#8"| "Gb8"| "G8"| "G#8"
export const AllNotesFullName: NoteFullName[] = [
    "C0", "C#0", "Db0", "D0", "D#0", "Eb0", "E0", "F0", "F#0", "Gb0", "G0", "G#0", "Ab0", "A0", "A#0", "Bb0", "B0",
    "C1", "C#1", "Db1", "D1", "D#1", "Eb1", "E1", "F1", "F#1", "Gb1", "G1", "G#1", "Ab1", "A1", "A#1", "Bb1", "B1",
    "C2", "C#2", "Db2", "D2", "D#2", "Eb2", "E2", "F2", "F#2", "Gb2", "G2", "G#2", "Ab2", "A2", "A#2", "Bb2", "B2",
    "C3", "C#3", "Db3", "D3", "D#3", "Eb3", "E3", "F3", "F#3", "Gb3", "G3", "G#3", "Ab3", "A3", "A#3", "Bb3", "B3",
    "C4", "C#4", "Db4", "D4", "D#4", "Eb4", "E4", "F4", "F#4", "Gb4", "G4", "G#4", "Ab4", "A4", "A#4", "Bb4", "B4",
    "C5", "C#5", "Db5", "D5", "D#5", "Eb5", "E5", "F5", "F#5", "Gb5", "G5", "G#5", "Ab5", "A5", "A#5", "Bb5", "B5",
    "C6", "C#6", "Db6", "D6", "D#6", "Eb6", "E6", "F6", "F#6", "Gb6", "G6", "G#6", "Ab6", "A6", "A#6", "Bb6", "B6",
    "C7", "C#7", "Db7", "D7", "D#7", "Eb7", "E7", "F7", "F#7", "Gb7", "G7", "G#7", "Ab7", "A7", "A#7", "Bb7", "B7",
    "C8", "C#8", "Db8", "D8", "D#8", "Eb8", "E8", "F8", "F#8", "Gb8", "G8", "G#8", 
]

export const MidiToNote: { [key in MidiNote]: NoteFullName } = {
    24: "C0", 25: "C#0", 26: "D0", 27: "D#0", 28: "E0", 29: "F0", 30: "F#0", 31: "G0", 32: "G#0", 33: "A0", 34: "A#0", 35: "B0",
    36: "C1", 37: "C#1", 38: "D1", 39: "D#1", 40: "E1", 41: "F1", 42: "F#1", 43: "G1", 44: "G#1", 45: "A1", 46: "A#1", 47: "B1",
    48: "C2", 49: "C#2", 50: "D2", 51: "D#2", 52: "E2", 53: "F2", 54: "F#2", 55: "G2", 56: "G#2", 57: "A2", 58: "A#2", 59: "B2",
    60: "C3", 61: "C#3", 62: "D3", 63: "D#3", 64: "E3", 65: "F3", 66: "F#3", 67: "G3", 68: "G#3", 69: "A3", 70: "A#3", 71: "B3",
    72: "C4", 73: "C#4", 74: "D4", 75: "D#4", 76: "E4", 77: "F4", 78: "F#4", 79: "G4", 80: "G#4", 81: "A4", 82: "A#4", 83: "B4",
    84: "C5", 85: "C#5", 86: "D5", 87: "D#5", 88: "E5", 89: "F5", 90: "F#5", 91: "G5", 92: "G#5", 93: "A5", 94: "A#5", 95: "B5",
    96: "C6", 97: "C#6", 98: "D6", 99: "D#6", 100: "E6", 101: "F6", 102: "F#6", 103: "G6", 104: "G#6", 105: "A6", 106: "A#6", 107: "B6",
    108: "C7", 109: "C#7", 110: "D7", 111: "D#7", 112: "E7", 113: "F7", 114: "F#7", 115: "G7", 116: "G#7", 117: "A7", 118: "A#7", 119: "B7",
    120: "C8", 121: "C#8", 122: "D8", 123: "D#8", 124: "E8", 125: "F8", 126: "F#8", 127: "G8", 128: "G#8",
}

export const NoteToMidi: { [key in NoteFullName]: MidiNote } = {
    "C0": 24, "C#0": 25, "Db0": 25, "D0": 26, "D#0": 27, "Eb0": 27, "E0": 28, "F0": 29, "F#0": 30, "Gb0": 30, "G0": 31, "G#0": 32, "Ab0": 32, "A0": 33, "A#0": 34, "Bb0": 34, "B0": 35,
    "C1": 36, "C#1": 37, "Db1": 37, "D1": 38, "D#1": 39, "Eb1": 39, "E1": 40, "F1": 41, "F#1": 42, "Gb1": 42, "G1": 43, "G#1": 44, "Ab1": 44, "A1": 45, "A#1": 46, "Bb1": 46, "B1": 47,
    "C2": 48, "C#2": 49, "Db2": 49, "D2": 50, "D#2": 51, "Eb2": 51, "E2": 52, "F2": 53, "F#2": 54, "Gb2": 54, "G2": 55, "G#2": 56, "Ab2": 56, "A2": 57,"A#2" :58,"Bb2" :58,"B2" :59,
    "C3": 60, "C#3": 61, "Db3": 61, "D3": 62, "D#3": 63, "Eb3": 63, "E3": 64, "F3": 65, "F#3": 66, "Gb3": 66, "G3": 67, "G#3": 68, "Ab3": 68, "A3": 69,"A#3" :70,"Bb3" :70,"B3" :71,
    "C4": 72, "C#4": 73, "Db4": 73, "D4": 74, "D#4": 75, "Eb4": 75, "E4": 76, "F4": 77, "F#4": 78, "Gb4": 78, "G4": 79, "G#4": 80, "Ab4": 80, "A4": 81,"A#4" :82,"Bb4" :82,"B4" :83,
    "C5": 84, "C#5": 85, "Db5": 85, "D5": 86, "D#5": 87, "Eb5": 87, "E5": 88, "F5": 89, "F#5": 90, "Gb5": 90, "G5": 91, "G#5": 92, "Ab5": 92, "A5": 93,"A#5" :94,"Bb5" :94,"B5" :95,
    "C6": 96, "C#6": 97, "Db6": 97, "D6": 98, "D#6": 99, "Eb6": 99, "E6": 100, "F6": 101, "F#6": 102, "Gb6": 102, "G6": 103, "G#6": 104, "Ab6": 104, "A6": 105,"A#6" :106,"Bb6" :106,"B6" :107,
    "C7": 108, "C#7": 109, "Db7": 109, "D7": 110, "D#7": 111, "Eb7": 111, "E7": 112, "F7": 113, "F#7": 114, "Gb7": 114, "G7": 115, "G#7": 116, "Ab7": 116, "A7": 117,"A#7" :118,"Bb7" :118,"B7" :119,
    "C8": 120, "C#8": 121, "Db8": 121, "D8": 122, "D#8": 123, "Eb8": 123, "E8": 124, "F8": 125, "F#8": 126, "Gb8": 126, "G8": 127, "G#8": 128,
}

export type Note = "C" | "C#" | "Db" | "D" | "D#" | "Eb" | "E" | "F" | "F#" | "Gb" | "G" | "G#" | "Ab" | "A" | "A#" | "Bb" | "B" ;
export const AllNotes: Note[] = [
    "C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B"
]
export const noteFullNameToNote = (noteFullName: NoteFullName): Note => noteFullName.slice(0, -1) as Note;

export function getScale(rootMidi: MidiNote, intervals: number[]): NoteFullName[] {
    if (rootMidi < 24 || rootMidi > 127) {
        throw new Error("Midi note out of range (24-127)");
    }

    let scaleMidiNotes = [rootMidi];
    let currentMidi = rootMidi;
    let allPianoInterval = Array(10).fill(intervals).flat();
    for (const step of allPianoInterval) {
        currentMidi = currentMidi + step;
        if (currentMidi > 127) {
            break;
        }
        scaleMidiNotes.push(currentMidi as MidiNote);
    }

    const scaleNotes = scaleMidiNotes.map(midi => {
        return MidiToNote[midi];
    });

    return scaleNotes;
}

export const majorScales = AllNotes.reduce((acc, value) => {
    acc[value] = getScale(NoteToMidi[(value + "0") as NoteFullName], [2, 2, 1, 2, 2, 2, 1]);
    return acc;
}, {} as { [key in Note]: NoteFullName[] });


export const minorScales = AllNotes.reduce((acc, value) => {
    acc[value] = getScale(NoteToMidi[(value + "0") as NoteFullName], [2, 1, 2, 2, 1, 2, 1]);
    return acc;
}, {} as { [key in Note]: NoteFullName[] });

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
        noteType = "on";
    } else if (command === 8 || (command === 9 && velocity === 0)) {
        noteType = "off";
    } else {
        console.log(`Other MIDI message: [${Array.from(data).join(", ")}]`);
    }

    return {
        noteNumber: noteNumber as MidiNote,
        noteFullName: MidiToNote[noteNumber as MidiNote] as NoteFullName,
        noteName: MidiToNote[noteNumber as MidiNote].slice(0, -1) as Note,
        velocity: velocity,
        time: event.timeStamp,
        type: noteType,
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


