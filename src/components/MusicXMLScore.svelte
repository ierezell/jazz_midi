<script lang="ts">
	/**
	 * @deprecated Use OSMDScore.svelte instead for enhanced OSMD rendering
	 * This component is the base OSMD wrapper. OSMDScore.svelte provides:
	 * - Cursor tracking
	 * - Note highlighting (played/upcoming)
	 * - Zoom controls
	 * - Better mobile support
	 * @see OSMDScore.svelte
	 */
	import { onMount, onDestroy } from 'svelte';
	import type { AnnotationType } from '$lib/types/musicxml';

	interface Props {
		musicXmlContent?: string;
		url?: string;
		annotations?: AnnotationType[];
		onError?: (error: Error) => void;
	}

	let { musicXmlContent = '', url = '', annotations = [], onError }: Props = $props();

	let containerRef: HTMLDivElement;
	let osmdInstance: any = null; // OpenSheetMusicDisplay - typed as any for dynamic import
	let isLoading = $state(true);
	let loadError = $state<string | null>(null);

	onMount(async () => {
		if (!containerRef || (!musicXmlContent && !url?.trim())) return;

		try {
			// Dynamic import of opensheetmusicdisplay - cast to any to avoid build-time resolution
			const osmdModule = (await import('opensheetmusicdisplay')) as any;
			const OpenSheetMusicDisplay = osmdModule.OpenSheetMusicDisplay;

			osmdInstance = new OpenSheetMusicDisplay(containerRef, {
				drawingParameters: {
					drawTitle: true,
					drawSubtitle: true,
					drawComposer: true,
					drawLyricist: true,
					drawMetronomeMarks: true,
					drawPartNames: true,
					drawMeasureNumbers: true,
					drawMeasureNumbersOnlyAtSystemStart: false,
					drawTimeSignatures: true,
					drawKeySignatures: true,
					drawClefs: true,
					drawStaffLines: true,
					drawNotes: true,
					drawChordSymbols: true,
					drawFingering: true,
					drawPedals: true,
					drawExpressions: true,
					drawDynamics: true,
					drawArticulation: true,
					drawRests: true,
					drawRythmicNotation: true,
					drawSlurs: true,
					drawTies: true,
					drawChords: true,
					drawMicrotones: true,
					defaultColorNoteHead: '#000000',
					defaultColorStem: '#000000',
					defaultColorRest: '#000000',
					defaultColorLabel: '#000000'
				},
				enableTransformationCanvas: false,
				autoResize: true,
				rules: {
					defaultFontFamily: 'Bravura, Arial, sans-serif',
					defaultFontSize: 16,
					defaultColorNoteHead: '#000000',
					defaultColorStem: '#000000',
					defaultColorRest: '#000000',
					defaultColorLabel: '#000000'
				}
			});

			// Load from URL if provided and non-empty, otherwise use content
			if (url?.trim()) {
				await osmdInstance.load(url);
			} else {
				await osmdInstance.load(musicXmlContent);
			}

			// Apply annotations if any
			if (annotations.length > 0) {
				applyAnnotations(osmdInstance, annotations);
			}

			await osmdInstance.render();
			isLoading = false;
		} catch (error) {
			console.error('Error loading MusicXML:', error);
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

	// Re-render when musicXmlContent or url changes
	$effect(() => {
		if (osmdInstance && (musicXmlContent || url?.trim())) {
			isLoading = true;
			const loadPromise = url?.trim() ? osmdInstance.load(url) : osmdInstance.load(musicXmlContent);

			loadPromise
				.then(async () => {
					if (annotations.length > 0) {
						applyAnnotations(osmdInstance!, annotations);
					}
					await osmdInstance!.render();
					isLoading = false;
				})
				.catch((error: any) => {
					console.error('Error reloading MusicXML:', error);
					loadError = error instanceof Error ? error.message : 'Failed to reload score';
					isLoading = false;
					onError?.(error instanceof Error ? error : new Error(String(error)));
				});
		}
	});

	function applyAnnotations(
		osmd: any, // OpenSheetMusicDisplay
		annots: AnnotationType[]
	) {
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

	function highlightTwoFiveOne(
		sheet: any, // MusicSheet
		measures: number[]
	) {
		// Add visual highlighting for II-V-I progressions
		// This would typically involve coloring measures or adding brackets
		for (const measureIndex of measures) {
			if (measureIndex < sheet.SourceMeasures.length) {
				const measure = sheet.SourceMeasures[measureIndex];
				// Add custom label or color
				(measure as any).customLabel = 'II-V-I';
			}
		}
	}

	function annotateChordInversion(
		sheet: any, // MusicSheet
		measure: number,
		voice: number,
		inversion: string
	) {
		// Add inversion annotation to chord
		if (measure < sheet.SourceMeasures.length) {
			const sourceMeasure = sheet.SourceMeasures[measure];
			// Find the vertical container for the specified voice
			// This is a simplified version - actual implementation would need to
			// access the graphical staff entry and add a label
		}
	}

	function annotateRootThird(
		sheet: any, // MusicSheet
		measure: number,
		voice: number,
		showFifth = false
	) {
		// Add root/third labels to notes
		if (measure < sheet.SourceMeasures.length) {
			const sourceMeasure = sheet.SourceMeasures[measure];
			// Implementation would mark individual notes with their role
		}
	}
</script>

<div class="musicxml-score-container">
	{#if isLoading}
		<div class="loading-indicator">
			<div class="spinner"></div>
			<p>Loading score...</p>
		</div>
	{/if}

	{#if loadError}
		<div class="error-message">
			<p>Error loading score: {loadError}</p>
		</div>
	{/if}

	<div bind:this={containerRef} class="osmd-container" class:loading={isLoading}></div>
</div>

<style>
	.musicxml-score-container {
		width: 100%;
		min-height: 300px;
		background: white;
		border-radius: 8px;
		border: 1px solid #e1e5e9;
		overflow: hidden;
	}

	.osmd-container {
		width: 100%;
		min-height: 300px;
	}

	.osmd-container.loading {
		opacity: 0.5;
	}

	.loading-indicator {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		gap: 1rem;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #e1e5e9;
		border-top: 4px solid var(--color-primary, #58a6ff);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.error-message {
		padding: 1rem;
		background: rgba(248, 81, 73, 0.1);
		border: 1px solid var(--color-error, #f85149);
		border-radius: 8px;
		margin: 1rem;
		color: var(--color-error, #f85149);
	}

	@media (max-width: 768px) {
		.musicxml-score-container {
			min-height: 200px;
		}

		.osmd-container {
			min-height: 200px;
		}
	}
</style>
