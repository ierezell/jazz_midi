function onMIDIMessage(event: MIDIMessageEvent): void {
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
  }
  
  // Called when MIDI access is successfully obtained.
  function onMIDISuccess(midiAccess: MIDIAccess): void {
    console.log('MIDI Access obtained.');
    // Iterate over all available MIDI inputs
    midiAccess.inputs.forEach((input) => {
      console.log(`Found MIDI Input: ${input.name}`);
      // Attach the onMIDIMessage callback to each input
      input.onmidimessage = onMIDIMessage;
    });
  
    // Optionally, you can add a statechange listener:
    midiAccess.onstatechange = (event) => {
      const port = event.port!;
      console.log(`MIDI port state changed: ${port.name} is now ${port.state}`);
    };
  }
  
  // Called if MIDI access request fails.
  function onMIDIFailure(error: any): void {
    console.error('Failed to get MIDI access:', error);
  }
  
  // Request MIDI access (without sysex in this example)
  navigator.requestMIDIAccess({ sysex: false })
    .then(onMIDISuccess)
    .catch(onMIDIFailure);
  