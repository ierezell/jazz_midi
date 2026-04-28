import { loadAllSongs } from '$lib/MusicXMLLoader';
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
	// Create a simple fallback song with basic MusicXML
	const basicMusicXML = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="4.0">
  <work>
    <work-title>Autumn Leaves</work-title>
  </work>
  <identification>
    <creator type="composer">Traditional</creator>
  </identification>
  <part-list>
    <score-part id="P1">
      <part-name>Piano</part-name>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key>
          <fifths>0</fifths>
        </key>
        <time>
          <beats>4</beats>
          <beat-type>4</beat-type>
        </time>
        <clef>
          <sign>G</sign>
          <line>2</line>
        </clef>
      </attributes>
      <harmony>
        <root>
          <root-step>A</root-step>
        </root>
        <kind text="m7">minor-seventh</kind>
      </harmony>
      <note>
        <pitch>
          <step>C</step>
          <octave>4</octave>
        </pitch>
        <duration>4</duration>
        <type>whole</type>
      </note>
    </measure>
    <measure number="2">
      <harmony>
        <root>
          <root-step>D</root-step>
        </root>
        <kind text="7">dominant</kind>
      </harmony>
      <note>
        <pitch>
          <step>D</step>
          <octave>4</octave>
        </pitch>
        <duration>4</duration>
        <type>whole</type>
      </note>
    </measure>
    <measure number="3">
      <harmony>
        <root>
          <root-step>G</root-step>
        </root>
        <kind text="maj7">major-seventh</kind>
      </harmony>
      <note>
        <pitch>
          <step>G</step>
          <octave>4</octave>
        </pitch>
        <duration>4</duration>
        <type>whole</type>
      </note>
    </measure>
    <measure number="4">
      <harmony>
        <root>
          <root-step>C</root-step>
        </root>
        <kind text="maj7">major-seventh</kind>
      </harmony>
      <note>
        <pitch>
          <step>C</step>
          <octave>4</octave>
        </pitch>
        <duration>4</duration>
        <type>whole</type>
      </note>
    </measure>
  </part>
</score-partwise>`;

	return {
		id: 'autumn-leaves-fallback',
		filename: 'autumn-leaves-fallback.musicxml',
		title: 'Autumn Leaves',
		composer: 'Traditional',
		key: 'C',
		tempo: 120,
		url: '', // Fallback uses content, not URL
		content: basicMusicXML,
		chords: [
			{ measure: 0, beat: 0, root: 'Am', quality: 'm7', duration: 4 },
			{ measure: 1, beat: 0, root: 'D', quality: '7', duration: 4 },
			{ measure: 2, beat: 0, root: 'G', quality: 'maj7', duration: 4 },
			{ measure: 3, beat: 0, root: 'C', quality: 'maj7', duration: 4 }
		],
		melody: []
	};
}
