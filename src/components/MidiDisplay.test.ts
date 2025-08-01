import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { createMockMIDIAccess } from '../test/mockMIDI';
import MidiDisplay from './MidiDisplay.svelte';

describe('MidiDisplay Component', () => {
	it('should render with no MIDI access', () => {
		const { container, getByText } = render(MidiDisplay, {
			props: {
				midiAccess: null
			}
		});

		expect(getByText('MIDI Inputs')).toBeTruthy();
		expect(getByText('No MIDI inputs available.')).toBeTruthy();
	});

	it('should render with mock MIDI access', async () => {
		const mockMidiAccess = await createMockMIDIAccess();
		
		const { container, getByText } = render(MidiDisplay, {
			props: {
				midiAccess: mockMidiAccess as unknown as MIDIAccess
			}
		});

		expect(getByText('MIDI Inputs')).toBeTruthy();
		expect(getByText('Mock MIDI Keyboard')).toBeTruthy();
	});

	it('should display multiple MIDI inputs', async () => {
		const mockMidiAccess = await createMockMIDIAccess();
		
		// Add another mock device
		mockMidiAccess.inputs.set('device2', {
			id: 'device2',
			name: 'Second MIDI Device',
			manufacturer: 'Test',
			version: '1.0',
			type: 'input',
			state: 'connected',
			connection: 'open',
			onmidimessage: null
		});

		const { getByText } = render(MidiDisplay, {
			props: {
				midiAccess: mockMidiAccess as unknown as MIDIAccess
			}
		});

		expect(getByText('Mock MIDI Keyboard')).toBeTruthy();
		expect(getByText('Second MIDI Device')).toBeTruthy();
	});

	it('should have correct styling', () => {
		const { container } = render(MidiDisplay, {
			props: {
				midiAccess: null
			}
		});

		const divElement = container.querySelector('div');
		expect(divElement).toBeTruthy();
		
		// Check for expected CSS structure
		const h2Element = container.querySelector('h2');
		expect(h2Element).toBeTruthy();
		expect(h2Element?.textContent).toBe('MIDI Inputs');
	});
});
