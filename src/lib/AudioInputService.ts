
export class AudioInputService {
	private static instance: AudioInputService;
	private basicPitch: BasicPitch | null = null;
	private audioContext: AudioContext | null = null;
	private isRecording = false;
	private listeners: ((event: MIDIMessageEvent) => void)[] = [];
	private stream: MediaStream | null = null;
	private sourceNode: MediaStreamAudioSourceNode | null = null;
	private processorNode: ScriptProcessorNode | null = null;
	private audioBufferQueue: Float32Array[] = [];
	private isProcessing = false;

	// Smoothing / Hysteresis State
	private currentNote: number | null = null;
	private noteConfidence = 0;
	private readonly CONFIDENCE_THRESHOLD = 3; // Frames to confirm note
	private readonly SILENCE_THRESHOLD = 5; // Frames to confirm silence
	private silenceCounter = 0;

	private constructor() { }

	static getInstance(): AudioInputService {
		if (!AudioInputService.instance) {
			AudioInputService.instance = new AudioInputService();
		}
		return AudioInputService.instance;
	}

	private isStarting = false;

	async start(): Promise<void> {
		if (this.isRecording || this.isStarting) return;

		this.isStarting = true;
		try {
			if (!this.basicPitch) {
				// Dynamic import to avoid SSR issues
				const { BasicPitch } = await import('@spotify/basic-pitch');
				this.basicPitch = new BasicPitch(
					'https://unpkg.com/@spotify/basic-pitch@1.0.1/model/model.json'
				);
			}

			// Force 22050Hz as preferred by BasicPitch to avoid resampling overhead if possible
			const context = new AudioContext({ sampleRate: 22050 });
			await context.resume();

			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

			// Race condition check: If stop() was called while awaiting above
			if (!this.isStarting) {
				console.debug('AudioInputService: start() aborted');
				stream.getTracks().forEach(track => track.stop());
				context.close();
				return;
			}

			this.audioContext = context;
			this.stream = stream;
			this.sourceNode = this.audioContext.createMediaStreamSource(this.stream);

			// Use ScriptProcessor for capturing raw audio (Buffer size 4096 ~ 185ms at 22050Hz)
			// This provides a reasonable chunk size for pitch detection
			this.processorNode = this.audioContext.createScriptProcessor(4096, 1, 1);

			this.processorNode.onaudioprocess = (e) => {
				const inputData = e.inputBuffer.getChannelData(0);
				// Clone data because inputBuffer is reused
				this.audioBufferQueue.push(new Float32Array(inputData));
				this.processQueue();
			};

			this.sourceNode.connect(this.processorNode);
			this.processorNode.connect(this.audioContext.destination); // Needed for script processor to run

			this.isRecording = true;
			console.log('AudioInputService started');
		} catch (error) {
			console.error('Error starting audio input:', error);
			this.stop();
			throw error;
		} finally {
			this.isStarting = false;
		}
	}

	stop(): void {
		// Signal any pending start to abort
		this.isStarting = false;

		if (!this.isRecording) return;

		this.isRecording = false;

		if (this.processorNode) {
			this.processorNode.disconnect();
			this.processorNode = null;
		}

		if (this.sourceNode) {
			this.sourceNode.disconnect();
			this.sourceNode = null;
		}

		if (this.stream) {
			this.stream.getTracks().forEach(track => track.stop());
			this.stream = null;
		}

		if (this.audioContext) {
			this.audioContext.close();
			this.audioContext = null;
		}

		// Reset state
		this.currentNote = null;
		this.noteConfidence = 0;
		this.silenceCounter = 0;
		this.audioBufferQueue = [];
	}

	addListener(callback: (event: MIDIMessageEvent) => void): void {
		this.listeners.push(callback);
	}

	removeListener(callback: (event: MIDIMessageEvent) => void): void {
		this.listeners = this.listeners.filter((l) => l !== callback);
	}

	private async processQueue() {
		if (this.isProcessing || this.audioBufferQueue.length === 0 || !this.basicPitch || !this.audioContext) return;

		this.isProcessing = true;

		try {
			while (this.audioBufferQueue.length > 0) {
				const rawData = this.audioBufferQueue.shift();
				if (!rawData) continue;

				// Create AudioBuffer for BasicPitch
				const audioBuffer = this.audioContext.createBuffer(1, rawData.length, this.audioContext.sampleRate);
				audioBuffer.copyToChannel(rawData as any, 0);

				// Evaluate model
				// evaluateModel(audioBuffer, onFrames, onNote)
				await this.basicPitch.evaluateModel(
					audioBuffer,
					(frames: number[][], onsets: number[][], contours: number[][]) => {
						// frames is [time][pitch_index]
						// We need to find the dominant pitch in these frames
						let maxConfidence = 0;
						let bestPitchIndex = -1;

						// Iterate over all time steps in this chunk
						for (let t = 0; t < frames.length; t++) {
							for (let p = 0; p < frames[t].length; p++) {
								if (frames[t][p] > maxConfidence) {
									maxConfidence = frames[t][p];
									bestPitchIndex = p;
								}
							}
						}

						if (maxConfidence > 0.3) { // Threshold
							const midiNote = bestPitchIndex + 21; // Approximation: BasicPitch output usually starts at MIDI 21 (A0)
							this.handleDetectedNote(midiNote);
						} else {
							this.handleSilence();
						}
					},
					(note: any) => {
						// Ignore note events for real-time low-latency, rely on frames
					}
				);
			}
		} catch (err) {
			console.error("Error processing audio chunk:", err);
		} finally {
			this.isProcessing = false;
		}
	}

	private handleSilence() {
		this.silenceCounter++;
		if (this.silenceCounter > this.SILENCE_THRESHOLD) {
			if (this.activeNote !== null) {
				this.sendNoteOff(this.activeNote);
			}
			this.currentNote = null;
			this.noteConfidence = 0;
		}
	}

	private handleDetectedNote(pitch: number) {
		const midiNote = Math.round(pitch);

		// Smoothing Logic
		if (midiNote === this.currentNote) {
			this.noteConfidence++;
			this.silenceCounter = 0;
		} else {
			// New note detected
			if (this.currentNote === null) {
				// Was silent, potential new note
				this.currentNote = midiNote; // Tentatively set
				this.noteConfidence = 1;
			} else {
				// Was playing another note. 
				// If confidence in new note is low, ignore (it might be a glitch).
				// But we need to switch eventually.
				// For now, let's just reset confidence.
				this.currentNote = midiNote;
				this.noteConfidence = 1;
			}
		}

		// Trigger Note On if confidence reached
		if (this.noteConfidence >= this.CONFIDENCE_THRESHOLD) {
			// If we were already playing this note, do nothing (sustain)
			// If we were playing a DIFFERENT confirmed note, we should have killed it?
			// Actually, we need to track what we *sent* to the listeners.
			this.sendNoteOn(midiNote);
		}
	}

	// Track what is currently "sounding" to the outside world
	private activeNote: number | null = null;

	private sendNoteOn(note: number) {
		if (this.activeNote === note) return; // Already playing

		if (this.activeNote !== null) {
			this.sendNoteOff(this.activeNote);
		}

		this.activeNote = note;
		this.notifyListeners(note, 100, true);
	}

	private sendNoteOff(note: number) {
		if (this.activeNote !== note) return;

		this.activeNote = null;
		this.notifyListeners(note, 0, false);
	}

	// We need a way to detect silence if no notes are found in a chunk.
	// Since evaluateModel returns notes, if it returns NOTHING, we need to increment silence counter.
	// But `evaluateModel` calls the callback `onNote`. 
	// We can wrap the call to know if any note was detected.

	private notifyListeners(note: number, velocity: number, isOn: boolean): void {
		const status = isOn ? 0x90 : 0x80;
		const data = new Uint8Array([status, note, velocity]);
		const event = new MIDIMessageEvent('midimessage', { data });

		this.listeners.forEach((listener) => listener(event));
	}
}

export const audioInputService = AudioInputService.getInstance();
