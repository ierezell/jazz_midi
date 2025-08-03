/**
 * Centralized Configuration Manager
 * Manages all app settings in a type-safe, persistent way
 */

// Default configurations
export const DEFAULT_CONFIG = {
	midi: {
		autoConnect: true,
		virtualKeyboard: {
			enabled: true,
			layout: 'piano' as const,
			size: 'normal' as const
		},
		latency: {
			compensation: 0,
			monitoring: false
		}
	},

	audio: {
		enabled: true,
		volume: {
			master: 0.8,
			feedback: 0.6,
			metronome: 0.5
		},
		sounds: {
			success: '/sounds/ok.mp3',
			error: '/sounds/error.mp3',
			metronome: '/sounds/metronome.mp3'
		}
	},

	ui: {
		theme: 'auto' as const,
		layout: 'comfortable' as const,
		animations: true,
		accessibility: {
			highContrast: false,
			reducedMotion: false,
			screenReader: false
		},
		keyboard: {
			showLabels: false,
			highlightPressed: true,
			size: 'medium' as const,
			octaves: 2,
			startOctave: 4
		}
	},

	exercise: {
		errorThreshold: {
			showNoteNames: 3,
			showKeyboard: 6
		},
		autoProgress: false,
		showHints: true,
		defaultKey: 'C' as const,
		defaultTempo: 120
	}
} as const;

export type AppConfig = typeof DEFAULT_CONFIG;

class ConfigManager {
	private config: AppConfig;
	private storageKey = 'jazz-midi-config';
	private listeners: ((config: AppConfig) => void)[] = [];

	constructor() {
		this.config = this.loadConfig();
	}

	/**
	 * Load configuration from localStorage with fallback to defaults
	 */
	private loadConfig(): AppConfig {
		try {
			if (typeof localStorage !== 'undefined') {
				const stored = localStorage.getItem(this.storageKey);
				if (stored) {
					const parsed = JSON.parse(stored);
					return this.mergeWithDefaults(parsed);
				}
			}
		} catch (error) {
			console.warn('Failed to load config from localStorage:', error);
		}

		return { ...DEFAULT_CONFIG };
	}

	/**
	 * Merge stored config with defaults to handle new properties
	 */
	private mergeWithDefaults(stored: any): AppConfig {
		return {
			midi: { ...DEFAULT_CONFIG.midi, ...stored.midi },
			audio: { ...DEFAULT_CONFIG.audio, ...stored.audio },
			ui: { ...DEFAULT_CONFIG.ui, ...stored.ui },
			exercise: { ...DEFAULT_CONFIG.exercise, ...stored.exercise }
		};
	}

	/**
	 * Save configuration to localStorage
	 */
	private saveConfig(): void {
		try {
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem(this.storageKey, JSON.stringify(this.config));
			}
		} catch (error) {
			console.warn('Failed to save config to localStorage:', error);
		}
	}

	/**
	 * Get the current configuration
	 */
	getConfig(): AppConfig {
		return { ...this.config };
	}

	/**
	 * Get a specific section of the configuration
	 */
	getSection<T extends keyof AppConfig>(section: T): AppConfig[T] {
		return { ...this.config[section] };
	}

	/**
	 * Update configuration (partial updates supported)
	 */
	updateConfig(updates: Partial<AppConfig>): void {
		this.config = {
			...this.config,
			...updates
		};

		this.saveConfig();
		this.notifyListeners();
	}

	/**
	 * Update a specific section of the configuration
	 */
	updateSection<T extends keyof AppConfig>(section: T, updates: Partial<AppConfig[T]>): void {
		this.config[section] = {
			...this.config[section],
			...updates
		};

		this.saveConfig();
		this.notifyListeners();
	}

	/**
	 * Reset configuration to defaults
	 */
	resetToDefaults(): void {
		this.config = { ...DEFAULT_CONFIG };
		this.saveConfig();
		this.notifyListeners();
	}

	/**
	 * Reset a specific section to defaults
	 */
	resetSection<T extends keyof AppConfig>(section: T): void {
		this.config[section] = { ...DEFAULT_CONFIG[section] };
		this.saveConfig();
		this.notifyListeners();
	}

	/**
	 * Subscribe to configuration changes
	 */
	subscribe(listener: (config: AppConfig) => void): () => void {
		this.listeners.push(listener);

		// Return unsubscribe function
		return () => {
			const index = this.listeners.indexOf(listener);
			if (index > -1) {
				this.listeners.splice(index, 1);
			}
		};
	}

	/**
	 * Notify all listeners of config changes
	 */
	private notifyListeners(): void {
		this.listeners.forEach((listener) => {
			try {
				listener(this.config);
			} catch (error) {
				console.error('Error in config listener:', error);
			}
		});
	}

	/**
	 * Export configuration for backup
	 */
	exportConfig(): string {
		return JSON.stringify(this.config, null, 2);
	}

	/**
	 * Import configuration from JSON string
	 */
	importConfig(configJson: string): boolean {
		try {
			const imported = JSON.parse(configJson);
			const merged = this.mergeWithDefaults(imported);

			this.config = merged;
			this.saveConfig();
			this.notifyListeners();

			return true;
		} catch (error) {
			console.error('Failed to import config:', error);
			return false;
		}
	}

	/**
	 * Get configuration schema for validation
	 */
	getSchema(): Record<string, any> {
		return {
			midi: {
				autoConnect: 'boolean',
				virtualKeyboard: {
					enabled: 'boolean',
					layout: ['piano', 'chromatic', 'isomorphic'],
					size: ['compact', 'normal', 'large']
				},
				latency: {
					compensation: 'number',
					monitoring: 'boolean'
				}
			},
			audio: {
				enabled: 'boolean',
				volume: {
					master: 'number(0-1)',
					feedback: 'number(0-1)',
					metronome: 'number(0-1)'
				}
			},
			ui: {
				theme: ['light', 'dark', 'auto'],
				layout: ['compact', 'comfortable', 'spacious'],
				animations: 'boolean'
			},
			exercise: {
				errorThreshold: {
					showNoteNames: 'number',
					showKeyboard: 'number'
				},
				autoProgress: 'boolean',
				showHints: 'boolean'
			}
		};
	}
}

// Singleton instance
export const configManager = new ConfigManager();

// Convenience functions for common operations
export const getConfig = () => configManager.getConfig();
export const updateConfig = (updates: Partial<AppConfig>) => configManager.updateConfig(updates);
export const getMidiConfig = () => configManager.getSection('midi');
export const getAudioConfig = () => configManager.getSection('audio');
export const getUIConfig = () => configManager.getSection('ui');
export const getExerciseConfig = () => configManager.getSection('exercise');
