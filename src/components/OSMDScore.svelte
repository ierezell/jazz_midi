<svelte:options runes={true} />

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { AnnotationType } from '$lib/types/musicxml';
	import type { MidiNote } from '$lib/types/types';

	interface Props {
		musicXmlContent?: string;
		url?: string;
		annotations?: AnnotationType[];
		onError?: (error: Error) => void;
		// Cursor/playback support
		cursorNote?: MidiNote | null; // Current note to highlight
		playedNotes?: MidiNote[]; // Notes already played (grayed out)
		upcomingNotes?: MidiNote[]; // Notes to play (highlighted)
		// Display options
		showCursor?: boolean;
		followCursor?: boolean;
		zoom?: number;
	}

	let { 
		musicXmlContent = '', 
		url = '', 
		annotations = [], 
		onError,
		cursorNote = null,
		playedNotes = [],
		upcomingNotes = [],
		showCursor = true,
		followCursor = true,
		zoom = 1.0
	}: Props = $props();

	let containerRef: HTMLDivElement;
	let osmdInstance: any = null;
	let isLoading = $state(true);
	let loadError = $state<string | null>(null);
	let cursorElement: HTMLElement | null = $state(null);

	onMount(async () => {
		if (!containerRef || (!musicXmlContent && !url?.trim())) {
			isLoading = false;
			return;
		}

		try {
			const osmdModule = await import('opensheetmusicdisplay') as any;
			const OpenSheetMusicDisplay = osmdModule.OpenSheetMusicDisplay;

			osmdInstance = new OpenSheetMusicDisplay(containerRef, {
				drawingParameters: {
					drawTitle: true,
					drawSubtitle: true,
					drawComposer: true,
					drawMetronomeMarks: true,
					drawPartNames: true,
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
					drawArticulation: true,
					drawRests: true,
					drawRythmicNotation: true,
					drawSlurs: true,
					drawTies: true,
					// Custom colors for played/upcoming notes
					defaultColorNoteHead: '#000000',
					defaultColorStem: '#000000',
					defaultColorRest: '#000000',
				},
				autoResize: true,
				enableTransformationCanvas: false,
				rules: {
					defaultFontFamily: 'Bravura, Arial, sans-serif',
					defaultFontSize: 16,
				}
			});

			// Load content
			if (url?.trim()) {
				await osmdInstance.load(url);
			} else {
				await osmdInstance.load(musicXmlContent);
			}

			// Apply annotations
			if (annotations.length > 0) {
				applyAnnotations(osmdInstance, annotations);
			}

			await osmdInstance.render();
			
			// Initialize cursor if enabled
			if (showCursor) {
				initializeCursor();
			}
			
			isLoading = false;
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
	});

	// Update cursor position when cursorNote changes
	$effect(() => {
		if (osmdInstance && cursorNote !== undefined) {
			updateCursorPosition(cursorNote);
			updateNoteHighlights();
		}
	});

	// Update zoom
	$effect(() => {
		if (osmdInstance && zoom !== undefined) {
			osmdInstance.Zoom = zoom;
			osmdInstance.render();
		}
	});

	function initializeCursor() {
		if (!containerRef) return;
		
		// Create cursor element
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

		// Find the note in OSMD's graphical sheet
		const sheet = osmdInstance.Sheet;
		if (!sheet) return;

		// Search for note in all measures
		for (const measure of sheet.SourceMeasures || []) {
			for (const entry of measure.VerticalSourceStaffEntryContainers || []) {
				for (const osmdNote of entry.Notes || []) {
					if (osmdNote?.Pitch?.frequency) {
						const midiNote = Math.round(69 + 12 * Math.log2(osmdNote.Pitch.frequency / 440));
						if (midiNote === note && osmdNote.graphicalNote?.svgElement) {
							// Position cursor at the note
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
			// Implementation would mark notes with their role
		}
	}

	// Public methods exposed to parent
	export function zoomIn() {
		if (osmdInstance) {
			osmdInstance.Zoom *= 1.2;
			osmdInstance.render();
		}
	}

	export function zoomOut() {
		if (osmdInstance) {
			osmdInstance.Zoom /= 1.2;
			osmdInstance.render();
		}
	}

	export function getOSMDInstance() {
		return osmdInstance;
	}
</script>

<div class="osmd-score-wrapper">
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
	
	<div 
		bind:this={containerRef} 
		class="osmd-container"
		class:loading={isLoading}
	></div>
</div>

<style>
	.osmd-score-wrapper {
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
		to { transform: rotate(360deg); }
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
</style>
