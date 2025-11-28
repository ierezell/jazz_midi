import { describe, it, expect } from 'vitest';

describe('Songs data loading', () => {
	it('should load song data from JSON files', async () => {
		// This tests that we can import the song JSON files
		const autumnLeaves = await import('$lib/data/songs/autumn-leaves.json');

		expect(autumnLeaves.default).toBeDefined();
		expect(autumnLeaves.default.name).toBe('Autumn Leaves');
		expect(autumnLeaves.default.chords).toBeDefined();
		expect(autumnLeaves.default.chords.length).toBeGreaterThan(0);
	});

	it('should have valid chord structure', async () => {
		const autumnLeaves = await import('$lib/data/songs/autumn-leaves.json');
		const song = autumnLeaves.default;

		song.chords.forEach((chord: any) => {
			expect(chord.note).toBeDefined();
			expect(chord.type).toBeDefined();
			expect(typeof chord.note).toBe('string');
			expect(typeof chord.type).toBe('string');
		});
	});

	it('should load multiple songs', async () => {
		const autumnLeaves = await import('$lib/data/songs/autumn-leaves.json');
		const blueBossa = await import('$lib/data/songs/blue-bossa.json');
		const allTheThings = await import('$lib/data/songs/all-the-things-you-are.json');

		expect(autumnLeaves.default.name).toBe('Autumn Leaves');
		expect(blueBossa.default.name).toBe('Blue Bossa');
		expect(allTheThings.default.name).toBe('All The Things You Are');
	});
});
