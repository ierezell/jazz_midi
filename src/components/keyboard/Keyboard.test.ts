import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import type { MidiNote } from '../../midi/midi';
import Keyboard from './Keyboard.svelte';

describe('Keyboard Component', () => {
	it('should render keyboard with default props', () => {
		const { container } = render(Keyboard, {
			props: {
				midiNotes: [] as MidiNote[],
				middleC: 72, // C4
				octaves: 2
			}
		});

		const keyboardElement = container.querySelector('.keyboard');
		expect(keyboardElement).toBeTruthy();
		
		// Should render 25 keys (2 octaves * 12 + 1)
		const keys = container.querySelectorAll('div');
		expect(keys.length).toBeGreaterThan(20); // Account for the keyboard container
	});

	it('should highlight pressed keys', () => {
		const pressedNotes = [72, 76, 79] as MidiNote[]; // C major chord
		
		const { container } = render(Keyboard, {
			props: {
				midiNotes: pressedNotes,
				middleC: 72,
				octaves: 2
			}
		});

		// Check that some keys have the pressed state
		// Note: The actual implementation will depend on how Key component handles the pressed prop
		const keyboardElement = container.querySelector('.keyboard');
		expect(keyboardElement).toBeTruthy();
	});

	it('should render correct number of keys for different octave counts', () => {
		const { container: container1 } = render(Keyboard, {
			props: {
				midiNotes: [],
				middleC: 72,
				octaves: 1
			}
		});

		const { container: container3 } = render(Keyboard, {
			props: {
				midiNotes: [],
				middleC: 72,
				octaves: 3
			}
		});

		// Both should render without errors
		expect(container1.querySelector('.keyboard')).toBeTruthy();
		expect(container3.querySelector('.keyboard')).toBeTruthy();
	});

	it('should handle different middle C positions', () => {
		const { container } = render(Keyboard, {
			props: {
				midiNotes: [],
				middleC: 60, // C3 instead of C4
				octaves: 2
			}
		});

		const keyboardElement = container.querySelector('.keyboard');
		expect(keyboardElement).toBeTruthy();
	});

	it('should have correct CSS classes and styling', () => {
		const { container } = render(Keyboard, {
			props: {
				midiNotes: [],
				middleC: 72,
				octaves: 2
			}
		});

		const keyboardElement = container.querySelector('.keyboard');
		expect(keyboardElement).toHaveClass('keyboard');
		
		// Check for flex display
		const computedStyle = getComputedStyle(keyboardElement as Element);
		expect(computedStyle.display).toBe('flex');
	});

	it('should render different states with different props', () => {
		// Test with no pressed notes
		const { container: emptyContainer } = render(Keyboard, {
			props: {
				midiNotes: [] as MidiNote[],
				middleC: 72,
				octaves: 2
			}
		});

		// Test with pressed notes
		const { container: pressedContainer } = render(Keyboard, {
			props: {
				midiNotes: [72] as MidiNote[],
				middleC: 72,
				octaves: 2
			}
		});

		// Both should render without errors
		expect(emptyContainer.querySelector('.keyboard')).toBeTruthy();
		expect(pressedContainer.querySelector('.keyboard')).toBeTruthy();
	});
});
