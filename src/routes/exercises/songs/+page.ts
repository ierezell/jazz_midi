import type { PageLoad } from './$types';

// Song filename → normalised key (underscores, no hyphens)
const songFiles: { filename: string; key: string }[] = [
	{ filename: 'autumn-leaves', key: 'autumn_leaves' },
	{ filename: 'blue-bossa', key: 'blue_bossa' },
	{ filename: 'all-the-things-you-are', key: 'all_the_things_you_are' },
	{ filename: 'fly-me-to-the-moon', key: 'fly_me_to_the_moon' },
	{ filename: 'misty', key: 'misty' },
	{ filename: 'summertime', key: 'summertime' },
	{ filename: 'so-what', key: 'so_what' }
];

export const load: PageLoad = async ({ url }) => {
	const songParam = url.searchParams.get('song') ?? '';

	const songPromises = songFiles.map((s) => import(`$lib/data/songs/${s.filename}.json`));
	const songModules = await Promise.all(songPromises);
	const songs = songModules.map((module) => module.default);

	// Find the pre-selected index based on the ?song= param
	const initialIndex = Math.max(
		0,
		songFiles.findIndex((s) => s.key === songParam)
	);

	return { songs, initialIndex };
};
