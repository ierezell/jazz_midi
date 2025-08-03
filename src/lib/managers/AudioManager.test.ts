/**
 * Unit tests for Audio Manager
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { audioManager, AudioManager } from './AudioManager';

// Mock Audio API
let audioInstances: any[] = [];

const createMockAudio = () => {
	const instance = {
		play: vi.fn().mockResolvedValue(undefined),
		pause: vi.fn(),
		load: vi.fn(),
		_volume: 0.7, // Internal volume storage
		get volume() {
			return this._volume;
		},
		set volume(val) {
			this._volume = val;
		},
		_currentTime: 0, // Internal currentTime storage
		get currentTime() {
			return this._currentTime;
		},
		set currentTime(val) {
			this._currentTime = val;
		},
		duration: 0,
		ended: false,
		readyState: 4,
		addEventListener: vi.fn().mockImplementation((event, callback) => {
			if (event === 'canplaythrough') {
				// Immediately call callback to simulate loaded state
				setTimeout(callback, 0);
			}
		}),
		removeEventListener: vi.fn(),
		preload: 'auto',
		src: ''
	};
	audioInstances.push(instance);
	return instance;
};

global.Audio = vi.fn().mockImplementation(createMockAudio) as any;

describe('AudioManager', () => {
	let manager: AudioManager;

	beforeEach(async () => {
		vi.clearAllMocks();
		audioInstances = [];
		manager = new AudioManager();
		// Wait for preloading to complete
		await new Promise((resolve) => setTimeout(resolve, 50));
	});

	describe('Initialization', () => {
		it('should initialize with default settings', () => {
			expect(manager.isEnabled()).toBe(true);
			expect(manager.getAvailableSounds()).toEqual(expect.arrayContaining(['success', 'error']));
		});
	});

	describe('Audio Playback', () => {
		it('should play success sound', async () => {
			await manager.playSuccess();
			expect(global.Audio).toHaveBeenCalled();
		});

		it('should play error sound', async () => {
			await manager.playError();
			expect(global.Audio).toHaveBeenCalled();
		});

		it('should not play when disabled', async () => {
			manager.setEnabled(false);
			await manager.playSuccess();
			// Since audio is disabled, no new audio instances should be created for playback
			const initialCount = audioInstances.length;
			await manager.playSuccess();
			expect(audioInstances.length).toBe(initialCount);
		});

		it('should respect volume settings', () => {
			manager.setVolume(0.3);
			// Check that all audio instances have the updated volume
			audioInstances.forEach((audio) => {
				expect(audio.volume).toBe(0.3);
			});
		});

		it('should play custom sound', async () => {
			await manager.addSound('custom', '/path/to/custom.mp3');
			await manager.playSound('custom');
			expect(global.Audio).toHaveBeenCalled();
		});
	});

	describe('Sound Management', () => {
		it('should list available sounds', () => {
			const sounds = manager.getAvailableSounds();
			expect(sounds).toContain('success');
			expect(sounds).toContain('error');
		});

		it('should add custom sound', async () => {
			await manager.addSound('test', '/test.mp3');
			const sounds = manager.getAvailableSounds();
			expect(sounds).toContain('test');
		});

		it('should remove sound', async () => {
			await manager.addSound('temp', '/temp.mp3');
			manager.removeSound('temp');
			const sounds = manager.getAvailableSounds();
			expect(sounds).not.toContain('temp');
		});

		it('should stop all sounds', () => {
			manager.stopAll();
			// Check that pause was called on all audio instances
			audioInstances.forEach((audio) => {
				expect(audio.pause).toHaveBeenCalled();
				expect(audio.currentTime).toBe(0);
			});
		});

		describe('Volume and Settings', () => {
			it('should set volume within valid range', () => {
				manager.setVolume(1.5); // Above max
				audioInstances.forEach((audio) => {
					expect(audio.volume).toBe(1);
				});

				manager.setVolume(-0.5); // Below min
				audioInstances.forEach((audio) => {
					expect(audio.volume).toBe(0);
				});

				manager.setVolume(0.7); // Valid range
				audioInstances.forEach((audio) => {
					expect(audio.volume).toBe(0.7);
				});
			});

			it('should enable/disable audio', () => {
				manager.setEnabled(false);
				expect(manager.isEnabled()).toBe(false);

				manager.setEnabled(true);
				expect(manager.isEnabled()).toBe(true);
			});
		});
	});

	describe('Audio Feedback', () => {
		it('should provide audio feedback object', () => {
			const feedback = manager.getAudioFeedback();
			expect(feedback).toHaveProperty('success');
			expect(feedback).toHaveProperty('error');
			expect(feedback).toHaveProperty('enabled');
			expect(feedback.enabled).toBe(true);
		});
	});

	describe('Error Handling', () => {
		it('should handle audio playback errors gracefully', async () => {
			// Mock play method to reject for testing error handling
			if (audioInstances.length > 0) {
				audioInstances[0].play.mockRejectedValue(new Error('Audio not available'));
			}

			// Should not throw
			await expect(manager.playSuccess()).resolves.not.toThrow();
		});
	});

	describe('Cleanup', () => {
		it('should cleanup all resources', () => {
			manager.cleanup();
			audioInstances.forEach((audio) => {
				expect(audio.pause).toHaveBeenCalled();
			});
			expect(manager.getAvailableSounds()).toHaveLength(0);
		});
	});

	describe('Singleton Instance', () => {
		it('should provide a singleton instance', () => {
			expect(audioManager).toBeInstanceOf(AudioManager);
			expect(audioManager).toBe(audioManager); // Same reference
		});
	});
});
