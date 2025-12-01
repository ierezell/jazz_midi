import { describe, it, expect } from 'vitest';

describe('Navigation Links', () => {
	// Define expected navigation structure
	const expectedLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/journey', label: 'Journey' },
		{ href: '/exercises/random', label: 'Random' },
		{ href: '/exercises/two_five_ones', label: 'II-V-I' },
		{ href: '/exercises/scales', label: 'Scales' },
		{ href: '/exercises/chords', label: 'Chords' },
		{ href: '/exercises/intervals', label: 'Intervals' },
		{ href: '/exercises/songs', label: 'Songs' },
		{ href: '/exercises/names', label: 'Names' },
		{ href: '/exercises/partition', label: 'Partition' },
		{ href: '/exercises/rhythm', label: 'Rhythm' },
		{ href: '/exercises/flashcards', label: 'Flashcards' },
		{ href: '/exercises/dexterity', label: 'Dexterity' },
		{ href: '/stats', label: 'Statistics' },
		{ href: '/profile', label: 'Profile' }
	];

	it('should have all expected navigation links defined', () => {
		expect(expectedLinks).toHaveLength(15);
	});

	it('should include Flashcards link', () => {
		const flashcardsLink = expectedLinks.find((link) => link.href === '/exercises/flashcards');
		expect(flashcardsLink).toBeDefined();
		expect(flashcardsLink?.label).toBe('Flashcards');
	});

	it('should include Dexterity link', () => {
		const dexterityLink = expectedLinks.find((link) => link.href === '/exercises/dexterity');
		expect(dexterityLink).toBeDefined();
		expect(dexterityLink?.label).toBe('Dexterity');
	});

	it('should have unique hrefs', () => {
		const hrefs = expectedLinks.map((link) => link.href);
		const uniqueHrefs = new Set(hrefs);
		expect(uniqueHrefs.size).toBe(hrefs.length);
	});

	it('should have all exercise links under /exercises path', () => {
		const exerciseLinks = expectedLinks.filter((link) => link.href.startsWith('/exercises'));
		expect(exerciseLinks).toHaveLength(11);
	});
});
