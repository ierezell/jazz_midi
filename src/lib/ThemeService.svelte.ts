import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

class ThemeService {
	#theme = $state<Theme>('dark');

	constructor() {
		if (browser) {
			const saved = localStorage.getItem('theme') as Theme;
			if (saved) {
				this.#theme = saved;
			} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
				this.#theme = 'light';
			}
			this.applyTheme();
		}
	}

	get theme() {
		return this.#theme;
	}

	toggleTheme() {
		this.#theme = this.#theme === 'light' ? 'dark' : 'light';
		if (browser) {
			localStorage.setItem('theme', this.#theme);
			this.applyTheme();
		}
	}

	private applyTheme() {
		if (browser) {
			document.documentElement.setAttribute('data-theme', this.#theme);
			if (this.#theme === 'dark') {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	}
}

export const themeService = new ThemeService();
