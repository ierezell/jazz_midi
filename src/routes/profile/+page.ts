import { userStatsService } from '$lib/UserStatsService';
import type { PageLoad } from './$types';
export const load: PageLoad = async () => {
	const profile = userStatsService.getProfile();
	const statistics = userStatsService.getStatistics();
	const achievements = userStatsService.getAchievements();
	return {
		profile,
		statistics,
		achievements
	};
};
