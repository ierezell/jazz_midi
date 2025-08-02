/**
 * Centralized configuration system for the jazz MIDI application
 */

import type {
    ExerciseConfiguration,
    KeyboardConfiguration,
    MIDIConfiguration
} from '../types';

// Default configurations
export const DEFAULT_MIDI_CONFIG: MIDIConfiguration = {
    autoConnect: true,
    enableVirtualKeyboard: true,
    errorThreshold: {
        showNoteNames: 3,
        showKeyboard: 6,
    },
    feedback: {
        enableSounds: true,
        enableVisual: true,
    },
};

export const DEFAULT_KEYBOARD_CONFIG: KeyboardConfiguration = {
    defaultOctaves: 2,
    defaultMiddleC: 60,
    adaptiveRange: true,
    showLabels: false,
    keySize: {
        width: 30,
        height: 120,
    },
};

// Exercise configurations
export const CHORD_EXERCISE_CONFIG: ExerciseConfiguration = {
    name: 'Chord Practice',
    description: 'Practice jazz chord recognition and voicings',
    defaultKey: 'C',
    allowedKeys: ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'B', 'E', 'A', 'D', 'G'],
    progressionRules: {
        allowRepeats: true,
        requireSequential: false,
        timeoutMs: 30000,
    },
};

export const SCALE_EXERCISE_CONFIG: ExerciseConfiguration = {
    name: 'Scale Practice',
    description: 'Practice major and minor scales',
    defaultKey: 'C',
    allowedKeys: ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'F', 'Bb', 'Eb', 'Ab', 'Db'],
    progressionRules: {
        allowRepeats: false,
        requireSequential: true,
        timeoutMs: 60000,
    },
};

export const PROGRESSION_EXERCISE_CONFIG: ExerciseConfiguration = {
    name: 'II-V-I Practice',
    description: 'Practice jazz chord progressions',
    defaultKey: 'C',
    allowedKeys: ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'B', 'E', 'A', 'D', 'G'],
    progressionRules: {
        allowRepeats: false,
        requireSequential: true,
        timeoutMs: 45000,
    },
};

// Audio paths
export const AUDIO_CONFIG = {
    sounds: {
        success: '/src/lib/sounds/ok.mp3',
        error: '/src/lib/sounds/error.mp3',
    },
    volume: {
        default: 0.7,
        success: 0.8,
        error: 0.6,
    },
};

// Visual feedback colors
export const VISUAL_CONFIG = {
    colors: {
        success: 'hsl(140, 89%, 45%)',
        error: 'hsl(0, 84%, 56%)',
        highlight: 'hsl(165, 92%, 48%)',
        neutral: 'hsl(0, 0%, 85%)',
    },
    durations: {
        feedbackMs: 2000,
        highlightMs: 500,
        transitionMs: 200,
    },
};

// Keyboard layout configurations
export const KEYBOARD_LAYOUTS = {
    full: {
        octaves: 7,
        startNote: 24,
        showAllKeys: true,
    },
    practice: {
        octaves: 2,
        startNote: 48,
        showAllKeys: true,
    },
    compact: {
        octaves: 1,
        startNote: 60,
        showAllKeys: false,
    },
} as const;

export type KeyboardLayoutName = keyof typeof KEYBOARD_LAYOUTS;

// Configuration merger utility
export function mergeConfig<T extends Record<string, any>>(
    defaultConfig: T,
    userConfig: Partial<T>
): T {
    const result = { ...defaultConfig, ...userConfig };
    
    // Deep merge nested objects
    for (const key in defaultConfig) {
        if (
            typeof defaultConfig[key] === 'object' &&
            defaultConfig[key] !== null &&
            !Array.isArray(defaultConfig[key]) &&
            userConfig[key]
        ) {
            result[key] = {
                ...defaultConfig[key],
                ...userConfig[key],
            };
        }
    }
    
    return result;
}

// Configuration validation
export function validateConfig(config: any): boolean {
    try {
        // Basic validation - can be extended
        if (typeof config !== 'object' || config === null) {
            return false;
        }
        
        // Validate MIDI config if present
        if (config.midi && typeof config.midi.autoConnect !== 'boolean') {
            return false;
        }
        
        // Validate keyboard config if present
        if (config.keyboard && typeof config.keyboard.defaultOctaves !== 'number') {
            return false;
        }
        
        return true;
    } catch {
        return false;
    }
}

// Environment-specific configurations
export const ENV_CONFIG = {
    development: {
        debug: true,
        verboseLogging: true,
        showPerformanceMetrics: true,
    },
    production: {
        debug: false,
        verboseLogging: false,
        showPerformanceMetrics: false,
    },
} as const;

// Get current environment config
export function getEnvConfig() {
    const isDev = import.meta.env.DEV;
    return isDev ? ENV_CONFIG.development : ENV_CONFIG.production;
}
