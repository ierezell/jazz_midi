export class AudioManager {
	private audioElements: Map<string, HTMLAudioElement> = new Map();
	private enabled = true;
	// Whether audio playback has been unlocked by a user gesture
	private unlocked = false;
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
		// If playback hasn't been unlocked by a user gesture, skip attempting to play
		if (!this.unlocked) {
			console.warn(
				`Audio playback blocked: user gesture required to enable sound. Call audioManager.unlock() from a user interaction.`
			);
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

	/**
	 * Attempt to unlock audio playback. Must be called from a user gesture (click/keydown).
	 * Returns true if unlocking succeeded and audio can be played.
	 */
	async unlock(): Promise<boolean> {
		if (this.unlocked) return true;
		try {
			// Try to play any preloaded audio at zero volume briefly to unlock playback
			const audio = this.audioElements.get('success') ?? Array.from(this.audioElements.values())[0];
			if (!audio) {
				// Nothing to play – consider unlocked
				this.unlocked = true;
				return true;
			}
			const previousVolume = audio.volume;
			audio.volume = 0;
			// Some browsers require a play() call from a user gesture to allow future autoplay
			await audio.play();
			audio.pause();
			audio.currentTime = 0;
			audio.volume = previousVolume;
			this.unlocked = true;
			this.enabled = true;
			console.debug('AudioManager: audio unlocked by user gesture');
			return true;
		} catch (error) {
			// If the play() call failed, keep unlocked=false and return false
			console.warn('AudioManager: unlock failed (user gesture required):', error);
			this.enabled = false;
			this.unlocked = false;
			return false;
		}
	}

	needsUserGesture(): boolean {
		return !this.unlocked;
	}
}

export const audioManager = new AudioManager();
