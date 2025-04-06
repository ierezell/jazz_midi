
type Note = ["Ab", "A", "A#", "Bb", "B", "C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#"];
type NoteEvent = {
    noteNumber: number;
    noteFullName: string;
    noteName: string;
    velocity: number;
}
type MIDICallback = (event: MIDIMessageEvent) => NoteEvent;

export function onMIDIMessage(event: MIDIMessageEvent): NoteEvent {
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
    if (command === 9 && velocity > 0) {
        console.log(`Note On: Channel ${channel + 1}, Note ${noteNumber}, Velocity ${velocity}`);
    } else if (command === 8 || (command === 9 && velocity === 0)) {
        console.log(`Note Off: Channel ${channel + 1}, Note ${noteNumber}`);
    } else {
        console.log(`Other MIDI message: [${Array.from(data).join(", ")}]`);
    }

    return {
        noteNumber: noteNumber,
        noteFullName: noteNumber.toString(),
        noteName: noteNumber.toString(),
        velocity: velocity,
    }
}




export async function MIDIInit(midiCallback: MIDICallback): Promise<MIDIAccess> {
    // Request access in the browser to MIDI devices.
    // Then plug the callback on every input device.
    let midiAccess: MIDIAccess = await navigator.requestMIDIAccess({ sysex: false })
    console.log('MIDI Access obtained.');

    midiAccess.inputs.forEach((input) => {
        let infos = `Input port [type:'${input.type}']` + ` id:'${input.id}'` + ` manufacturer:'${input.manufacturer}'` + ` name:'${input.name}'` + ` version:'${input.version}'`
        console.log(`Found MIDI Input: ${infos}`);
        input.onmidimessage = midiCallback;
    });

    midiAccess.onstatechange = (event) => {
        const port = event.port!;
        console.log(`MIDI port state changed: ${port.name} is now ${port.state}`);
    };
    return midiAccess
}


