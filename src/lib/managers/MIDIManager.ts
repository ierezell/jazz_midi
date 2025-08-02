/**
 * Centralized MIDI management system
 * Handles MIDI access, virtual keyboards, and event processing
 */

import {
    safeGetMidiNote,
    safeRequestMidiAccess,
    safeSetupMidiCallback
} from '../../midi/midiUtils';
import {
    createVirtualMidiAccess,
    setupKeyboardInput,
    type VirtualMidiInput
} from '../../midi/virtualMidi';
import { DEFAULT_MIDI_CONFIG } from '../config';
import type { MIDIConfiguration, MIDIEventHandlers } from '../types';

export class MIDIManager {
    private midiAccess: MIDIAccess | null = null;
    private virtualMidi: VirtualMidiInput | null = null;
    private keyboardCleanup: (() => void) | null = null;
    private eventHandlers: Partial<MIDIEventHandlers> = {};
    private config: MIDIConfiguration;
    private isConnected = false;
    private errorCallbacks: ((error: Error) => void)[] = [];

    constructor(config: Partial<MIDIConfiguration> = {}) {
        this.config = { ...DEFAULT_MIDI_CONFIG, ...config };
    }

    /**
     * Initialize MIDI system
     */
    async initialize(): Promise<boolean> {
        try {
            if (this.config.autoConnect) {
                await this.connectMIDI();
            }
            
            if (this.config.enableVirtualKeyboard) {
                this.setupVirtualKeyboard();
            }
            
            return true;
        } catch (error) {
            this.handleError(error as Error);
            return false;
        }
    }

    /**
     * Connect to physical MIDI devices
     */
    async connectMIDI(): Promise<boolean> {
        try {
            this.midiAccess = await safeRequestMidiAccess({ sysex: false });
            
            if (!this.midiAccess) {
                throw new Error('Failed to obtain MIDI access');
            }

            safeSetupMidiCallback(
                this.midiAccess, 
                this.handleMIDIMessage.bind(this),
                this.handleError.bind(this)
            );

            this.isConnected = true;
            console.log('MIDI Manager: Connected to physical MIDI devices');
            return true;
        } catch (error) {
            this.handleError(error as Error);
            return false;
        }
    }

    /**
     * Setup virtual MIDI keyboard for debugging/testing
     */
    setupVirtualKeyboard(): void {
        try {
            const virtualAccess = createVirtualMidiAccess('Virtual Debug Keyboard');
            this.virtualMidi = virtualAccess.getVirtualInput();
            
            // Setup computer keyboard input
            this.keyboardCleanup = setupKeyboardInput(this.virtualMidi);
            
            // Connect virtual MIDI to the same event handler
            const virtualInput = Array.from(virtualAccess.inputs.values())[0];
            if (virtualInput) {
                virtualInput.onmidimessage = this.handleMIDIMessage.bind(this);
            }
            
            console.log('MIDI Manager: Virtual keyboard enabled');
        } catch (error) {
            this.handleError(error as Error);
        }
    }

    /**
     * Handle incoming MIDI messages
     */
    private handleMIDIMessage(event: MIDIMessageEvent): void {
        try {
            const noteEvent = safeGetMidiNote(event);
            
            if (!noteEvent) {
                return; // Not a note event or invalid
            }

            // Call appropriate event handler
            if (noteEvent.type === 'on' && this.eventHandlers.onNoteOn) {
                this.eventHandlers.onNoteOn(noteEvent);
            } else if (noteEvent.type === 'off' && this.eventHandlers.onNoteOff) {
                this.eventHandlers.onNoteOff(noteEvent);
            }
        } catch (error) {
            this.handleError(error as Error);
        }
    }

    /**
     * Register event handlers
     */
    setEventHandlers(handlers: Partial<MIDIEventHandlers>): void {
        this.eventHandlers = { ...this.eventHandlers, ...handlers };
    }

    /**
     * Add error callback
     */
    onError(callback: (error: Error) => void): void {
        this.errorCallbacks.push(callback);
    }

    /**
     * Handle errors
     */
    private handleError(error: Error): void {
        console.error('MIDI Manager Error:', error);
        
        this.errorCallbacks.forEach(callback => {
            try {
                callback(error);
            } catch (callbackError) {
                console.error('Error in error callback:', callbackError);
            }
        });

        if (this.eventHandlers.onError) {
            this.eventHandlers.onError(error);
        }
    }

    /**
     * Toggle virtual keyboard
     */
    toggleVirtualKeyboard(enabled: boolean): void {
        if (enabled && !this.virtualMidi) {
            this.setupVirtualKeyboard();
        } else if (!enabled && this.virtualMidi) {
            this.cleanupVirtualKeyboard();
        }
    }

    /**
     * Cleanup virtual keyboard
     */
    private cleanupVirtualKeyboard(): void {
        if (this.keyboardCleanup) {
            this.keyboardCleanup();
            this.keyboardCleanup = null;
        }
        
        if (this.virtualMidi) {
            this.virtualMidi.releaseAllKeys();
            this.virtualMidi = null;
        }
    }

    /**
     * Get connection status
     */
    isConnectedToMIDI(): boolean {
        return this.isConnected;
    }

    /**
     * Get available MIDI devices
     */
    getMIDIDevices(): { inputs: MIDIInput[]; outputs: MIDIOutput[] } {
        if (!this.midiAccess) {
            return { inputs: [], outputs: [] };
        }

        return {
            inputs: Array.from(this.midiAccess.inputs.values()),
            outputs: Array.from(this.midiAccess.outputs.values()),
        };
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig: Partial<MIDIConfiguration>): void {
        this.config = { ...this.config, ...newConfig };
    }

    /**
     * Get current configuration
     */
    getConfig(): MIDIConfiguration {
        return { ...this.config };
    }

    /**
     * Cleanup all MIDI connections
     */
    cleanup(): void {
        this.cleanupVirtualKeyboard();
        
        if (this.midiAccess) {
            // Remove event listeners
            this.midiAccess.inputs.forEach(input => {
                input.onmidimessage = null;
            });
            this.midiAccess.onstatechange = null;
        }
        
        this.isConnected = false;
        this.eventHandlers = {};
        this.errorCallbacks = [];
        
        console.log('MIDI Manager: Cleaned up all connections');
    }

    /**
     * Reset to default configuration
     */
    reset(): void {
        this.cleanup();
        this.config = { ...DEFAULT_MIDI_CONFIG };
    }
}

// Singleton instance for app-wide use
export const midiManager = new MIDIManager();
