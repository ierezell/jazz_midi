import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Key from './Key.svelte';

describe('Key Component', () => {
	it('should render a natural key correctly', () => {
		const { container } = render(Key, {
			props: {
				noteNum: 60, // C (natural key)
				pressed: false,
				keyWidth: 30,
				keyHeight: 120
			}
		});

		const keyElement = container.querySelector('div');
		expect(keyElement).toBeTruthy();
		expect(keyElement).toHaveClass('natural');
		expect(keyElement).not.toHaveClass('accidental');
		expect(keyElement).not.toHaveClass('pressed');
	});

	it('should render an accidental key correctly', () => {
		const { container } = render(Key, {
			props: {
				noteNum: 61, // C# (accidental key)
				pressed: false,
				keyWidth: 30,
				keyHeight: 120
			}
		});

		const keyElement = container.querySelector('div');
		expect(keyElement).toBeTruthy();
		expect(keyElement).toHaveClass('accidental');
		expect(keyElement).not.toHaveClass('natural');
	});

	it('should show pressed state correctly', () => {
		const { container } = render(Key, {
			props: {
				noteNum: 60,
				pressed: true,
				keyWidth: 30,
				keyHeight: 120
			}
		});

		const keyElement = container.querySelector('div');
		expect(keyElement).toHaveClass('pressed');
	});

	it('should calculate key type correctly for different notes', () => {
		// Test natural keys (C, D, E, F, G, A, B)
		const naturalNotes = [0, 2, 4, 5, 7, 9, 11]; // C, D, E, F, G, A, B
		naturalNotes.forEach(note => {
			const { container } = render(Key, {
				props: { noteNum: note, pressed: false, keyWidth: 30, keyHeight: 120 }
			});
			const keyElement = container.querySelector('div');
			expect(keyElement).toHaveClass('natural');
		});

		// Test accidental keys (C#, D#, F#, G#, A#)
		const accidentalNotes = [1, 3, 6, 8, 10]; // C#, D#, F#, G#, A#
		accidentalNotes.forEach(note => {
			const { container } = render(Key, {
				props: { noteNum: note, pressed: false, keyWidth: 30, keyHeight: 120 }
			});
			const keyElement = container.querySelector('div');
			expect(keyElement).toHaveClass('accidental');
		});
	});

	it('should apply correct styling dimensions', () => {
		const { container } = render(Key, {
			props: {
				noteNum: 60,
				pressed: false,
				keyWidth: 30,
				keyHeight: 120
			}
		});

		const keyElement = container.querySelector('div') as HTMLElement;
		const style = keyElement.getAttribute('style');
		
		expect(style).toContain('--width: 30px');
		expect(style).toContain('--height: 120px');
	});

	it('should apply bias for accidental keys', () => {
		// Test C# which should have negative bias
		const { container: container1 } = render(Key, {
			props: {
				noteNum: 1, // C# (noteNum % 12 = 1)
				pressed: false,
				keyWidth: 30,
				keyHeight: 120
			}
		});

		const keyElement1 = container1.querySelector('div') as HTMLElement;
		const style1 = keyElement1.getAttribute('style');
		expect(style1).toContain('translate(-2.5px)'); // -keyWidth / 12

		// Test D# which should have positive bias
		const { container: container2 } = render(Key, {
			props: {
				noteNum: 3, // D# (noteNum % 12 = 3)
				pressed: false,
				keyWidth: 30,
				keyHeight: 120
			}
		});

		const keyElement2 = container2.querySelector('div') as HTMLElement;
		const style2 = keyElement2.getAttribute('style');
		expect(style2).toContain('translate(2.5px)'); // keyWidth / 12
	});

	it('should handle different octaves correctly', () => {
		// Test the same note type in different octaves
		const { container: container1 } = render(Key, {
			props: {
				noteNum: 60, // C4
				pressed: false,
				keyWidth: 30,
				keyHeight: 120
			}
		});

		const { container: container2 } = render(Key, {
			props: {
				noteNum: 72, // C5 (same note type, different octave)
				pressed: false,
				keyWidth: 30,
				keyHeight: 120
			}
		});

		const key1 = container1.querySelector('div');
		const key2 = container2.querySelector('div');

		// Both should be natural keys since they're both C
		expect(key1).toHaveClass('natural');
		expect(key2).toHaveClass('natural');
	});
});
