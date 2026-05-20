import { loadAllSongs } from '$lib/data/MusicXMLLoader';
import type { MusicXMLSong } from '$lib/types/musicxml';

export const load = async () => {
	const songs = await loadAllSongs();

	// Fallback if no songs loaded
	if (songs.length === 0) {
		return {
			songs: [getFallbackSong()]
		};
	}

	return { songs };
};

function getFallbackSong(): MusicXMLSong {
	return {
		id: 'fallback',
		filename: 'fallback.mxl',
		title: 'Autumn Leaves',
		composer: 'Joseph Kosma',
		key: 'E minor',
		tempo: 120,
		style: 'jazz',
		url: '', // Fallback uses content, not URL
		chords: [
			{ measure: 0, beat: 0, root: 'Am', quality: 'm7', duration: 8 },
			{ measure: 2, beat: 0, root: 'D', quality: '7', duration: 8 },
			{ measure: 4, beat: 0, root: 'G', quality: 'Maj7', duration: 8 }
		],
		melody: [
			{ measure: 0, beat: 0, pitch: 69, duration: 2 },
			{ measure: 0, beat: 2, pitch: 71, duration: 2 },
			{ measure: 1, beat: 0, pitch: 72, duration: 4 }
		],
		content: `<score-partwise version="3.1">
			<part-list><score-part id="P1"><part-name>Piano</part-name></score-part></part-list>
			<part id="P1"><measure number="1"><attributes><divisions>1</divisions><time><beats>4</beats><beat-type>4</beat-type></time></attributes><note><pitch><step>A</step><octave>4</octave></pitch><duration>2</duration><type>half</type></note></measure></part>
		</score-partwise>`
	};
}
