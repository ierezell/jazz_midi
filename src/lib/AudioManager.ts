export class AudioManager {
	private audioElements: Map<string, HTMLAudioElement> = new Map();
	private enabled = true;
	private volume = 0.7;

	constructor() {
		this.preloadSounds();
	}

	private async preloadSounds(): Promise<void> {
		try {
			await this.loadSound('success', '/src/lib/sounds/ok.mp3');
			await this.loadSound('error', '/src/lib/sounds/error.mp3');
		} catch (error) {
			console.warn('Failed to preload some audio files:', error);
		}
	}

	private async loadSound(name: string, path: string): Promise<void> {
		return new Promise((resolve, reject) => {
			if (typeof Audio === 'undefined') {
				resolve();
				return;
			}
			const audio = new Audio();
			audio.addEventListener('canplaythrough', () => {
				this.audioElements.set(name, audio);
				resolve();
			});
			audio.addEventListener('error', (e) => {
				console.warn(`Failed to load sound "${name}" from ${path}:`, e);
				reject(e);
			});
			audio.preload = 'auto';
			audio.volume = this.volume;
			audio.src = path;
		});
	}

	async playSound(soundName: string, volumeOverride?: number): Promise<void> {
		if (!this.enabled) {
			return;
		}
		const audio = this.audioElements.get(soundName);
		if (!audio) {
			console.warn(`Sound "${soundName}" not found`);
			return;
		}
		try {
			audio.currentTime = 0;
			if (volumeOverride !== undefined) {
				audio.volume = Math.max(0, Math.min(1, volumeOverride));
			} else {
				audio.volume = this.volume;
			}
			await audio.play();
		} catch (error) {
			console.warn(`Failed to play sound "${soundName}":`, error);
		}
	}

	async playSuccess(): Promise<void> {
		await this.playSound('success', 0.8);
	}

	async playError(): Promise<void> {
		await this.playSound('error', 0.6);
	}
}

export const audioManager = new AudioManager();
