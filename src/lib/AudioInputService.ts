import { BasicPitch } from '@spotify/basic-pitch';

export class AudioInputService {
	private static instance: AudioInputService;
	private basicPitch: BasicPitch;
	private audioContext: AudioContext | null = null;
	private isRecording = false;
	private listeners: ((note: number, velocity: number, isOn: boolean) => void)[] = [];

	private constructor() {
		// Initialize BasicPitch with the model URL
		this.basicPitch = new BasicPitch(
			'https://unpkg.com/@spotify/basic-pitch@1.0.1/model/model.json'
		);
	}

	static getInstance(): AudioInputService {
		if (!AudioInputService.instance) {
			AudioInputService.instance = new AudioInputService();
		}
		return AudioInputService.instance;
	}

	async start(): Promise<void> {
		if (this.isRecording) return;

		try {
			this.audioContext = new AudioContext();
			await this.audioContext.resume();

			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

			this.isRecording = true;

			// TODO: Implement real-time processing using AudioWorklet or ScriptProcessor
			// The evaluateModel method expects an AudioBuffer (file), not a stream.
			// For now, we just open the mic stream but don't process notes to avoid errors.
			console.warn('Real-time audio processing with BasicPitch is pending implementation.');

			/*
			await this.basicPitch.evaluateModel(
				this.audioContext, // Error: Expects AudioBuffer
				(frames, onsets, contours) => {},
				(note) => {
					this.notifyListeners(Math.round(note.pitch), 100, true);
					setTimeout(() => {
						this.notifyListeners(Math.round(note.pitch), 0, false);
					}, note.duration * 1000);
				}
			);
			*/
		} catch (error) {
			console.error('Error starting audio input:', error);
			throw error;
		}
	}

	stop(): void {
		if (!this.isRecording) return;

		this.isRecording = false;
		if (this.audioContext) {
			this.audioContext.close();
			this.audioContext = null;
		}
	}

	addListener(callback: (note: number, velocity: number, isOn: boolean) => void): void {
		this.listeners.push(callback);
	}

	removeListener(callback: (note: number, velocity: number, isOn: boolean) => void): void {
		this.listeners = this.listeners.filter((l) => l !== callback);
	}

	private notifyListeners(note: number, velocity: number, isOn: boolean): void {
		this.listeners.forEach((listener) => listener(note, velocity, isOn));
	}
}

export const audioInputService = AudioInputService.getInstance();
