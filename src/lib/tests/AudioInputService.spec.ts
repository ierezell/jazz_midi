import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AudioInputService, audioInputService } from '../AudioInputService';

// Mock the BasicPitch library
vi.mock('@spotify/basic-pitch', () => {
	const MockBasicPitch = vi.fn().mockImplementation(function (this: any, modelUrl: string) {
		console.log('MockBasicPitch constructor called with:', modelUrl);
		this.modelUrl = modelUrl;
		this.evaluateModel = vi.fn();
		return this;
	});

	return {
		BasicPitch: MockBasicPitch
	};
});

describe('AudioInputService', () => {
	let service: AudioInputService;

	beforeEach(() => {
		service = AudioInputService.getInstance();
		(service as any).isRecording = false;
		(service as any).basicPitch = null;
		(service as any).audioContext = null;
	});

	it('should be a singleton', () => {
		const instance2 = AudioInputService.getInstance();
		expect(service).toBe(instance2);
	});

	it('should use the correct model URL', async () => {
		// Mock AudioContext
		vi.stubGlobal('AudioContext', vi.fn(function() {
			return {
				resume: vi.fn().mockResolvedValue(undefined),
				close: vi.fn()
			};
		}));

		await service.start();

		// Access the private basicPitch property to verify the URL
		const basicPitchInstance = (service as any).basicPitch;
		expect(basicPitchInstance.modelUrl).toBe(
			'https://unpkg.com/@spotify/basic-pitch@1.0.1/model/model.json'
		);
	});

	it('should not use the old broken model URL', async () => {
		// Mock AudioContext
		vi.stubGlobal('AudioContext', vi.fn(function() {
			return {
				resume: vi.fn().mockResolvedValue(undefined),
				close: vi.fn()
			};
		}));

		await service.start();

		const basicPitchInstance = (service as any).basicPitch;
		expect(basicPitchInstance.modelUrl).not.toContain('basic-pitch-model');
	});

	it('should initialize with empty listeners', () => {
		const listeners = (service as any).listeners;
		expect(listeners).toBeDefined();
		expect(Array.isArray(listeners)).toBe(true);
	});

	it('should allow adding listeners', () => {
		const mockListener = vi.fn();
		service.addListener(mockListener);
		const listeners = (service as any).listeners;
		expect(listeners).toContain(mockListener);
	});

	it('should allow removing listeners', () => {
		const mockListener = vi.fn();
		service.addListener(mockListener);
		service.removeListener(mockListener);
		const listeners = (service as any).listeners;
		expect(listeners).not.toContain(mockListener);
	});

	it('should not be recording initially', () => {
		const isRecording = (service as any).isRecording;
		expect(isRecording).toBe(false);
	});
});
