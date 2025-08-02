/**
 * Audio feedback management system
 * Handles loading, playing, and managing audio feedback sounds
 */

import { AUDIO_CONFIG } from '../config';
import type { AudioFeedback } from '../types';

export class AudioManager {
    private audioElements: Map<string, HTMLAudioElement> = new Map();
    private enabled = true;
    private volume = AUDIO_CONFIG.volume.default;

    constructor() {
        this.preloadSounds();
    }

    /**
     * Preload audio files
     */
    private async preloadSounds(): Promise<void> {
        try {
            await this.loadSound('success', AUDIO_CONFIG.sounds.success);
            await this.loadSound('error', AUDIO_CONFIG.sounds.error);
        } catch (error) {
            console.warn('Failed to preload some audio files:', error);
        }
    }

    /**
     * Load a sound file
     */
    private async loadSound(name: string, path: string): Promise<void> {
        return new Promise((resolve, reject) => {
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

    /**
     * Play a sound
     */
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
            // Reset audio to beginning
            audio.currentTime = 0;
            
            // Apply volume override if provided
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

    /**
     * Play success sound
     */
    async playSuccess(): Promise<void> {
        await this.playSound('success', AUDIO_CONFIG.volume.success);
    }

    /**
     * Play error sound
     */
    async playError(): Promise<void> {
        await this.playSound('error', AUDIO_CONFIG.volume.error);
    }

    /**
     * Set master volume
     */
    setVolume(volume: number): void {
        this.volume = Math.max(0, Math.min(1, volume));
        
        // Update volume for all loaded sounds
        this.audioElements.forEach(audio => {
            audio.volume = this.volume;
        });
    }

    /**
     * Enable or disable audio
     */
    setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }

    /**
     * Check if audio is enabled
     */
    isEnabled(): boolean {
        return this.enabled;
    }

    /**
     * Get available sounds
     */
    getAvailableSounds(): string[] {
        return Array.from(this.audioElements.keys());
    }

    /**
     * Add custom sound
     */
    async addSound(name: string, path: string): Promise<void> {
        await this.loadSound(name, path);
    }

    /**
     * Remove a sound
     */
    removeSound(name: string): void {
        const audio = this.audioElements.get(name);
        if (audio) {
            audio.pause();
            audio.src = '';
            this.audioElements.delete(name);
        }
    }

    /**
     * Stop all currently playing sounds
     */
    stopAll(): void {
        this.audioElements.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    }

    /**
     * Get audio feedback object for component use
     */
    getAudioFeedback(): AudioFeedback {
        return {
            success: this.audioElements.get('success') || null,
            error: this.audioElements.get('error') || null,
            enabled: this.enabled,
        };
    }

    /**
     * Cleanup resources
     */
    cleanup(): void {
        this.stopAll();
        this.audioElements.clear();
    }
}

// Singleton instance
export const audioManager = new AudioManager();
