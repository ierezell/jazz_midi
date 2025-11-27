import type { PageLoad } from './$types';

// List of song filenames - add new songs here
const songFiles = ['autumn-leaves', 'blue-bossa', 'all-the-things-you-are'];

export const load: PageLoad = async () => {
	// Dynamically import each song
	const songPromises = songFiles.map(filename => 
		import(`$lib/data/songs/${filename}.json`)
	);
	
	const songModules = await Promise.all(songPromises);
	const songs = songModules.map(module => module.default);
	
	return {
		songs
	};
};
