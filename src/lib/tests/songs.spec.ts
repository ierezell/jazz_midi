import { describe, it, expect } from 'vitest';
import { getSongUrl, loadSong } from '../MusicXMLLoader';

describe('MusicXML Songs loading', () => {
	it('should generate correct song URLs', () => {
		const url = getSongUrl('test.mxl');
		expect(url).toBe('/songs/test.mxl');
	});

	it('should load song metadata', () => {
		const song = loadSong('autumn-leaves.mxl');

		expect(song.url).toBe('/songs/autumn-leaves.mxl');
		expect(song.filename).toBe('autumn-leaves.mxl');
		expect(song.id).toBe('autumn_leaves');
	});

	it('should sanitize song IDs', () => {
		const song1 = loadSong('song with spaces.mxl');
		expect(song1.id).toBe('song_with_spaces');

		const song2 = loadSong('Song-Name.mxl');
		expect(song2.id).toBe('Song_Name');

		const song3 = loadSong('A.B. Quintanilla - Song.mxl');
		expect(song3.id).toContain('_');
	});
});
