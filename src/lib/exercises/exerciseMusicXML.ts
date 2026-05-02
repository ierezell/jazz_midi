/**
 * Exercise MusicXML Loader
 * 
 * Utility to load MusicXML files for exercises via OSMD.
 * All exercises should use MusicXML format for score rendering.
 */

import type { AnnotationType } from '../types/musicxml';

export interface ExerciseMusicXMLData {
	content: string;
	url: string;
	annotations?: AnnotationType[];
}

/**
 * Load MusicXML content for a lick exercise
 */
export async function loadLickMusicXML(lickId: string): Promise<ExerciseMusicXMLData> {
	const url = `/licks/${lickId}.musicxml`;
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to load lick MusicXML: ${response.status}`);
	}
	return {
		content: await response.text(),
		url
	};
}

/**
 * Load MusicXML content for a rhythm pattern
 */
export async function loadRhythmMusicXML(patternId: string): Promise<ExerciseMusicXMLData> {
	const url = `/rhythm/${patternId}.musicxml`;
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to load rhythm MusicXML: ${response.status}`);
	}
	return {
		content: await response.text(),
		url
	};
}

/**
 * Load MusicXML content for hand independence exercise
 */
export async function loadHandIndependenceMusicXML(levelId: string): Promise<ExerciseMusicXMLData> {
	const url = `/hand_independence/${levelId}.musicxml`;
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to load hand independence MusicXML: ${response.status}`);
	}
	return {
		content: await response.text(),
		url
	};
}

/**
 * Load MusicXML content for a song
 */
export async function loadSongMusicXML(songId: string): Promise<ExerciseMusicXMLData> {
	const url = `/songs/${songId}.musicxml`;
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to load song MusicXML: ${response.status}`);
	}
	return {
		content: await response.text(),
		url
	};
}

/**
 * Check if MusicXML version exists for a given exercise
 */
export async function hasMusicXML(basePath: string, id: string): Promise<boolean> {
	try {
		const response = await fetch(`${basePath}/${id}.musicxml`, { method: 'HEAD' });
		return response.ok;
	} catch {
		return false;
	}
}

/**
 * Get the MusicXML URL for an exercise
 * This is the primary method - exercises should always use MusicXML
 */
export function getMusicXMLUrl(category: 'licks' | 'rhythm' | 'hand_independence' | 'songs', id: string): string {
	return `/${category}/${id}.musicxml`;
}

/**
 * Load any exercise MusicXML by category and ID
 */
export async function loadExerciseMusicXML(
	category: 'licks' | 'rhythm' | 'hand_independence' | 'songs',
	id: string
): Promise<ExerciseMusicXMLData> {
	switch (category) {
		case 'licks':
			return loadLickMusicXML(id);
		case 'rhythm':
			return loadRhythmMusicXML(id);
		case 'hand_independence':
			return loadHandIndependenceMusicXML(id);
		case 'songs':
			return loadSongMusicXML(id);
		default:
			throw new Error(`Unknown exercise category: ${category}`);
	}
}
