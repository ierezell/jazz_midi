class AudioOutputService {
	devices = $state<MediaDeviceInfo[]>([]);
	selectedDeviceId = $state<string>('');
	isSinkIdSupported =
		typeof (HTMLAudioElement.prototype as unknown as Record<string, unknown>)['setSinkId'] ===
		'function';

	private registeredElements = new Set<HTMLAudioElement>();

	constructor() {
		if (typeof localStorage !== 'undefined') {
			this.selectedDeviceId = localStorage.getItem('audio_output_device_id') ?? '';
		}
		if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
			navigator.mediaDevices.addEventListener('devicechange', () => this.refreshDevices());
		}
	}

	async refreshDevices(): Promise<void> {
		if (typeof navigator === 'undefined' || !navigator.mediaDevices) return;
		const all = await navigator.mediaDevices.enumerateDevices();
		this.devices = all.filter((d) => d.kind === 'audiooutput');
		// If saved device no longer exists, fall back to system default
		if (this.selectedDeviceId && !this.devices.find((d) => d.deviceId === this.selectedDeviceId)) {
			this.selectedDeviceId = '';
			localStorage.removeItem('audio_output_device_id');
		}
	}

	async selectDevice(deviceId: string): Promise<void> {
		this.selectedDeviceId = deviceId;
		if (deviceId) {
			localStorage.setItem('audio_output_device_id', deviceId);
		} else {
			localStorage.removeItem('audio_output_device_id');
		}
		for (const el of this.registeredElements) {
			await this.applySinkId(el);
		}
	}

	registerElement(el: HTMLAudioElement): void {
		this.registeredElements.add(el);
		this.applySinkId(el);
	}

	unregisterElement(el: HTMLAudioElement): void {
		this.registeredElements.delete(el);
	}

	private async applySinkId(el: HTMLAudioElement): Promise<void> {
		if (!this.isSinkIdSupported) return;
		try {
			await (el as HTMLAudioElement & { setSinkId(id: string): Promise<void> }).setSinkId(
				this.selectedDeviceId || ''
			);
		} catch (e) {
			console.warn('setSinkId failed:', e);
		}
	}
}

export const audioOutputService = new AudioOutputService();
