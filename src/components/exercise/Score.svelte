<svelte:options runes={true} />

<script lang="ts">
	/**
	 * Score.svelte - Unified OSMD-based score display component
	 *
	 * This component replaces:
	 * - OSMDScore.svelte
	 * - OSMDExerciseScore.svelte
	 * - MusicXMLScore.svelte
	 * - Old VexFlow-based Score.svelte
	 *
	 * Features:
	 * - MusicXML rendering via OSMD
	 * - ScoreProps support (leftHand/rightHand) with automatic MusicXML generation
	 * - Cursor tracking and note highlighting
	 * - Zoom controls
	 * - Annotation support
	 * - Loading and error states
	 */
	import { onMount, onDestroy, untrack } from 'svelte';
	import { generateMusicXML } from '$lib/data/MusicXMLGenerator';
	import type { AnnotationType } from '$lib/types/musicxml';
	import type { MidiNote, ScoreProps, NoteEvent, NoteFullName } from '$lib/types/types';
	import { NoteToMidi } from '$lib/types/notes.constants';

	interface Props {
		// MusicXML input (primary)
		musicXmlContent?: string;
		url?: string;

		// ScoreProps input (alternative - for exercises)
		scoreProps?: ScoreProps;

		// Note tracking
		collectedNotes?: Set<number>;
		playedNotes?: MidiNote[];
		upcomingNotes?: MidiNote[];
		cursorNote?: MidiNote | null;

		// Display options
		showCursor?: boolean;
		followCursor?: boolean;
		zoom?: number;

		// Annotations
		annotations?: AnnotationType[];

		// Callbacks
		onError?: (error: Error) => void;
		onLoad?: () => void;
	}

	let {
		musicXmlContent = '',
		url = '',
		scoreProps,
		collectedNotes = new Set(),
		playedNotes = [],
		upcomingNotes = [],
		cursorNote = null,
		showCursor = true,
		followCursor = true,
		zoom = 1.0,
		annotations = [],
		onError,
		onLoad
	}: Props = $props();

	let containerRef: HTMLDivElement;
	let osmdInstance: any = null;
	let isLoading = $state(true);
	let loadError = $state<string | null>(null);
	let cursorElement: HTMLElement | null = $state(null);
	// @svelte-ignore state_referenced_locally
	let currentZoom = $state(untrack(() => zoom));

	// Generate MusicXML from ScoreProps if provided
	function generateMusicXMLFromProps(): string {
		if (!scoreProps) return '';

		const notes: import('$lib/data/MusicXMLGenerator').MusicXMLNote[] = [];

		// Right hand (staff 1, voice 1): each inner array is one chord
		scoreProps.rightHand.forEach((chord, chordIndex) => {
			const measure = Math.floor(chordIndex / 4) + 1;
			const beat = (chordIndex % 4) + 1;
			chord.forEach((noteName) => {
				const midiNote = NoteToMidi[noteName as NoteFullName];
				if (midiNote !== undefined) {
					notes.push({ pitch: midiNote, duration: 4, measure, beat, voice: 1, staff: 1 });
				}
			});
		});

		// Left hand (staff 2, voice 2): each inner array is one chord
		scoreProps.leftHand.forEach((chord, chordIndex) => {
			const measure = Math.floor(chordIndex / 4) + 1;
			const beat = (chordIndex % 4) + 1;
			chord.forEach((noteName) => {
				const midiNote = NoteToMidi[noteName as NoteFullName];
				if (midiNote !== undefined) {
					notes.push({ pitch: midiNote, duration: 4, measure, beat, voice: 2, staff: 2 });
				}
			});
		});

		if (notes.length === 0) return '';

		return generateMusicXML(notes, { title: '', key: scoreProps.selectedNote, divisions: 4 });
	}

	// Get effective MusicXML content
	function getEffectiveMusicXML(): string {
		if (musicXmlContent) return musicXmlContent;
		if (url) return ''; // Will be loaded from URL
		if (scoreProps) return generateMusicXMLFromProps();
		return '';
	}

	onMount(async () => {
		if (!containerRef) return;

		const effectiveXML = getEffectiveMusicXML();
		if (!effectiveXML && !url?.trim()) {
			isLoading = false;
			return;
		}

		try {
			const osmdModule = (await import('opensheetmusicdisplay')) as any;
			const OpenSheetMusicDisplay = osmdModule.OpenSheetMusicDisplay;

			osmdInstance = new OpenSheetMusicDisplay(containerRef, {
				drawTitle: false,
				drawSubtitle: false,
				drawComposer: false,
				drawCredits: false,
				drawPartNames: false,
				drawPartAbbreviations: false,
				drawMetronomeMarks: true,
				drawMeasureNumbers: true,
				drawMeasureNumbersOnlyAtSystemStart: false,
				drawTimeSignatures: true,
				drawKeySignatures: true,
				drawClefs: true,
				drawNotes: true,
				drawChordSymbols: true,
				drawFingering: true,
				drawExpressions: true,
				drawDynamics: true,
				drawLyricist: false,
				autoResize: true,
				enableTransformationCanvas: false,
				defaultFontFamily: 'Bravura, Arial, sans-serif'
			});

			// Load content
			if (url?.trim()) {
				await osmdInstance.load(url);
			} else {
				await osmdInstance.load(effectiveXML);
			}

			// Apply annotations
			if (annotations.length > 0) {
				applyAnnotations(osmdInstance, annotations);
			}

			// Apply zoom
			osmdInstance.Zoom = currentZoom;

			await osmdInstance.render();

			// Initialize cursor if enabled
			if (showCursor) {
				initializeCursor();
			}

			isLoading = false;
			onLoad?.();
		} catch (error) {
			console.error('Error loading OSMD:', error);
			loadError = error instanceof Error ? error.message : 'Failed to load score';
			isLoading = false;
			onError?.(error instanceof Error ? error : new Error(String(error)));
		}
	});

	onDestroy(() => {
		if (osmdInstance) {
			osmdInstance.clear();
			osmdInstance = null;
		}
		if (cursorElement) {
			cursorElement.remove();
			cursorElement = null;
		}
	});

	// Re-render when content changes
	$effect(() => {
		if (osmdInstance && (musicXmlContent || url || scoreProps)) {
			isLoading = true;
			const effectiveXML = getEffectiveMusicXML();

			const loadPromise = url?.trim() ? osmdInstance.load(url) : osmdInstance.load(effectiveXML);

			loadPromise
				.then(async () => {
					if (annotations.length > 0) {
						applyAnnotations(osmdInstance!, annotations);
					}
					osmdInstance!.Zoom = currentZoom;
					await osmdInstance!.render();
					updateNoteHighlights();
					isLoading = false;
				})
				.catch((error: any) => {
					console.error('Error reloading score:', error);
					loadError = error instanceof Error ? error.message : 'Failed to reload score';
					isLoading = false;
					onError?.(error instanceof Error ? error : new Error(String(error)));
				});
		}
	});

	// Update cursor position when cursorNote changes
	$effect(() => {
		if (osmdInstance && cursorNote !== undefined) {
			updateCursorPosition(cursorNote);
			updateNoteHighlights();
		}
	});

	// Update when played/upcoming notes change
	$effect(() => {
		if (osmdInstance) {
			updateNoteHighlights();
		}
	});

	function initializeCursor() {
		if (!containerRef) return;

		cursorElement = document.createElement('div');
		cursorElement.className = 'osmd-cursor';
		cursorElement.style.cssText = `
			position: absolute;
			width: 4px;
			background: var(--color-primary, #58a6ff);
			border-radius: 2px;
			pointer-events: none;
			z-index: 100;
			transition: all 0.2s ease;
			opacity: 0;
		`;
		containerRef.appendChild(cursorElement);
	}

	function updateCursorPosition(note: MidiNote | null) {
		if (!cursorElement || !osmdInstance || !note) {
			if (cursorElement) cursorElement.style.opacity = '0';
			return;
		}

		const sheet = osmdInstance.Sheet;
		if (!sheet) return;

		// Search for note in all measures
		for (const measure of sheet.SourceMeasures || []) {
			for (const entry of measure.VerticalSourceStaffEntryContainers || []) {
				for (const osmdNote of entry.Notes || []) {
					if (osmdNote?.Pitch?.frequency) {
						const midiNote = Math.round(69 + 12 * Math.log2(osmdNote.Pitch.frequency / 440));
						if (midiNote === note && osmdNote.graphicalNote?.svgElement) {
							const svgEl = osmdNote.graphicalNote.svgElement;
							const rect = svgEl.getBoundingClientRect();
							const containerRect = containerRef.getBoundingClientRect();

							cursorElement.style.left = `${rect.left - containerRect.left}px`;
							cursorElement.style.top = `${rect.top - containerRect.top}px`;
							cursorElement.style.height = `${rect.height}px`;
							cursorElement.style.opacity = '1';

							if (followCursor) {
								svgEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
							}
							return;
						}
					}
				}
			}
		}
	}

	function updateNoteHighlights() {
		if (!osmdInstance) return;

		const sheet = osmdInstance.Sheet;
		if (!sheet) return;

		// Iterate through all graphical notes
		for (const measure of sheet.SourceMeasures || []) {
			for (const entry of measure.VerticalSourceStaffEntryContainers || []) {
				for (const note of entry.Notes || []) {
					if (note?.Pitch?.frequency && note.graphicalNote?.svgElement) {
						const midiNote = Math.round(69 + 12 * Math.log2(note.Pitch.frequency / 440));
						const svgEl = note.graphicalNote.svgElement;

						// Apply color based on state
						if (playedNotes.includes(midiNote as MidiNote)) {
							svgEl.style.fill = '#94a3b8'; // Gray for played
							svgEl.style.opacity = '0.6';
						} else if (upcomingNotes.includes(midiNote as MidiNote)) {
							svgEl.style.fill = '#22c55e'; // Green for upcoming/current
							svgEl.style.opacity = '1';
						} else {
							svgEl.style.fill = ''; // Default
							svgEl.style.opacity = '1';
						}
					}
				}
			}
		}
	}

	function applyAnnotations(osmd: any, annots: AnnotationType[]) {
		const sheet = osmd.Sheet;
		if (!sheet) return;

		for (const annotation of annots) {
			switch (annotation.type) {
				case 'ii-v-i':
					highlightTwoFiveOne(sheet, annotation.measures);
					break;
				case 'chord-inversion':
					annotateChordInversion(sheet, annotation.measure, annotation.voice, annotation.inversion);
					break;
				case 'root-third':
					annotateRootThird(sheet, annotation.measure, annotation.voice, annotation.showFifth);
					break;
			}
		}
	}

	function highlightTwoFiveOne(sheet: any, measures: number[]) {
		for (const measureIndex of measures) {
			if (measureIndex < sheet.SourceMeasures.length) {
				const measure = sheet.SourceMeasures[measureIndex];
				(measure as any).customLabel = 'II-V-I';
			}
		}
	}

	function annotateChordInversion(sheet: any, measure: number, voice: number, inversion: string) {
		if (measure < sheet.SourceMeasures.length) {
			const sourceMeasure = sheet.SourceMeasures[measure];
			// Implementation would add inversion labels
		}
	}

	function annotateRootThird(sheet: any, measure: number, voice: number, showFifth = false) {
		if (measure < sheet.SourceMeasures.length) {
			const sourceMeasure = sheet.SourceMeasures[measure];
			// Implementation would mark individual notes with their role
		}
	}

	// Public methods
	export function zoomIn() {
		currentZoom = Math.min(currentZoom * 1.2, 2.0);
		if (osmdInstance) {
			osmdInstance.Zoom = currentZoom;
			osmdInstance.render();
		}
	}

	export function zoomOut() {
		currentZoom = Math.max(currentZoom / 1.2, 0.5);
		if (osmdInstance) {
			osmdInstance.Zoom = currentZoom;
			osmdInstance.render();
		}
	}

	export function setZoom(newZoom: number) {
		currentZoom = Math.max(0.5, Math.min(2.0, newZoom));
		if (osmdInstance) {
			osmdInstance.Zoom = currentZoom;
			osmdInstance.render();
		}
	}

	export function getOSMDInstance() {
		return osmdInstance;
	}
</script>

<div class="score-wrapper">
	<div class="score-toolbar">
		<div class="zoom-controls">
			<button class="zoom-btn" onclick={zoomOut} title="Zoom out">−</button>
			<span class="zoom-level">{Math.round(currentZoom * 100)}%</span>
			<button class="zoom-btn" onclick={zoomIn} title="Zoom in">+</button>
		</div>
		{#if isLoading}
			<span class="loading-indicator">Loading...</span>
		{/if}
	</div>

	<div class="score-container">
		{#if isLoading}
			<div class="loading-overlay">
				<div class="spinner"></div>
				<p>Loading score...</p>
			</div>
		{/if}

		{#if loadError}
			<div class="error-overlay">
				<p>⚠️ {loadError}</p>
			</div>
		{/if}

		<div bind:this={containerRef} class="osmd-container" class:loading={isLoading}></div>
	</div>
</div>

<style>
	.score-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
	}

	.score-toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem;
		background: var(--color-surface);
		border-radius: 8px;
	}

	.zoom-controls {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.zoom-btn {
		width: 28px;
		height: 28px;
		border-radius: 4px;
		border: 1px solid var(--color-border);
		background: var(--color-surface-raised);
		color: var(--color-text);
		cursor: pointer;
		font-size: 1rem;
		line-height: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.zoom-btn:hover {
		background: var(--color-primary);
		color: white;
	}

	.zoom-level {
		font-size: 0.875rem;
		color: var(--color-text-muted);
		min-width: 3rem;
		text-align: center;
	}

	.loading-indicator {
		font-size: 0.875rem;
		color: var(--color-text-muted);
		font-style: italic;
	}

	.score-container {
		position: relative;
		width: 100%;
		min-height: 300px;
		background: white;
		border-radius: 8px;
		border: 1px solid var(--color-border);
		overflow: hidden;
	}

	.osmd-container {
		width: 100%;
		min-height: 300px;
	}

	.osmd-container :global(svg) {
		max-width: 100%;
		height: auto;
	}

	.loading-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.9);
		z-index: 10;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid var(--color-border);
		border-top-color: var(--color-primary);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.error-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(248, 81, 73, 0.1);
		z-index: 10;
		padding: 2rem;
		text-align: center;
		color: var(--color-error);
	}

	:global(.osmd-cursor) {
		box-shadow: 0 0 8px rgba(88, 166, 255, 0.6);
	}

	@media (max-width: 768px) {
		.score-container {
			min-height: 200px;
		}

		.osmd-container {
			min-height: 200px;
		}
	}
</style>
