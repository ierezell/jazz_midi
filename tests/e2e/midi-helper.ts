import type { Page } from '@playwright/test';

/** Wait for the app's MIDI dispatch hook to become available (set during hydration) */
async function waitForMidiHook(page: Page, timeout = 10000): Promise<void> {
	await page.waitForFunction(
		() =>
			typeof (window as any).__dispatchMidi === 'function' &&
			(window as any).__midiExerciseReady === true,
		{ timeout }
	);
}

export async function dispatchMidi(page: Page, status: number, data1: number, data2: number) {
	await waitForMidiHook(page);
	await page.evaluate(
		({ status, data1, data2 }) => {
			(window as any).__dispatchMidi(new Uint8Array([status, data1, data2]));
		},
		{ status, data1, data2 }
	);
}

export async function pressMidiNote(page: Page, note: number, channel = 0, velocity = 100) {
	await dispatchMidi(page, 0x90 | channel, note, velocity);
}

export async function releaseMidiNote(page: Page, note: number, channel = 0) {
	await dispatchMidi(page, 0x80 | channel, note, 0);
}

export async function playMidiNote(page: Page, note: number, durationMs = 50, channel = 0, velocity = 100) {
	await pressMidiNote(page, note, channel, velocity);
	if (durationMs > 0) {
		await page.waitForTimeout(durationMs);
	}
	await releaseMidiNote(page, note, channel);
}

export async function playMidiSequence(page: Page, notes: number[], delayMs = 100) {
	for (const note of notes) {
		await playMidiNote(page, note, delayMs / 2);
		await page.waitForTimeout(delayMs / 2);
	}
}

export async function playMidiChord(page: Page, notes: number[], durationMs = 100) {
	await waitForMidiHook(page);
	// Press all notes simultaneously
	for (const note of notes) {
		await pressMidiNote(page, note);
	}
	if (durationMs > 0) {
		await page.waitForTimeout(durationMs);
	}
	// Release all notes
	for (const note of notes) {
		await releaseMidiNote(page, note);
	}
}
