export const e2eConfig = {
	baseURL: 'http://localhost:4173',
	timeout: 30000,
	browsers: ['chromium', 'firefox', 'webkit'],
	mobile: ['iPhone', 'Pixel'],
	tests: {
		smoke: ['home', 'navigation', 'basic-interaction'],
		regression: ['chord-exercise', 'scale-exercise', 'progression-exercise'],
		accessibility: ['keyboard-nav', 'screen-reader', 'aria-compliance'],
		performance: ['load-time', 'interaction-speed', 'memory-usage'],
		responsive: ['mobile', 'tablet', 'desktop']
	}
};
