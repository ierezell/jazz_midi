<svelte:options runes={true} />

<script lang="ts">
	import type { ChordVoicing, Inversion, ScaleMode } from '$lib/types/notes';
	import {
		AllChordTypes,
		AllChordVoicings,
		AllInversions,
		AllNotes,
		AllScaleModes
	} from '$lib/types/notes.constants';
	import { allExerciseType, type ChordType, type ExerciseType, type Note } from '$lib/types/types';

	const {
		showPopup,
		allowedNotes,
		allowedChordTypes,
		allowedInversions,
		allowedScaleModes,
		allowedVoicings,
		allowedExerciseTypes,
		onUpdate,
		onClose
	}: {
		showPopup: boolean;
		allowedNotes: Note[];
		allowedChordTypes: ChordType[];
		allowedInversions: Inversion[];
		allowedScaleModes: ScaleMode[];
		allowedVoicings: ChordVoicing[];
		allowedExerciseTypes: ExerciseType[];
		onUpdate: (type: string, value: string[]) => void;
		onClose: () => void;
	} = $props();

	function handleUpdate(type: string, key: string, checked: boolean) {
		let currentArray: any[] = [];
		switch (type) {
			case 'allowedExerciseTypes':
				currentArray = [...allowedExerciseTypes];
				break;
			case 'allowedNotes':
				currentArray = [...allowedNotes];
				break;
			case 'allowedChordTypes':
				currentArray = [...allowedChordTypes];
				break;
			case 'allowedInversions':
				currentArray = [...allowedInversions];
				break;
			case 'allowedScaleModes':
				currentArray = [...allowedScaleModes];
				break;
			case 'allowedVoicings':
				currentArray = [...allowedVoicings];
				break;
		}

		if (checked) {
			currentArray.push(key);
		} else if (currentArray.length > 1) {
			const index = currentArray.indexOf(key);
			if (index > -1) {
				currentArray.splice(index, 1);
			}
		}
		onUpdate(type, currentArray.sort());
	}

	function handleClickOutside(event: KeyboardEvent | MouseEvent) {
		if (
			(event instanceof MouseEvent &&
				(event.target as HTMLElement).classList.contains('popup-overlay')) ||
			(event instanceof KeyboardEvent && event.key === 'Escape')
		) {
			onClose();
		}
	}
</script>

{#if showPopup}
	<div
		class="popup-overlay"
		role="dialog"
		aria-modal="true"
		aria-label="Configure exercises"
		tabindex="0"
		onclick={(e) => handleClickOutside(e)}
		onkeydown={(e) => handleClickOutside(e)}
	>
		<div class="popup-content">
			<button type="button" class="close-btn" aria-label="Close" onclick={() => onClose()}>×</button
			>
			<h2>Exercise Configuration</h2>

			<div class="config-grid">
				<div class="config-section">
					<h3>Exercise Types</h3>
					<div class="checkbox-grid">
						{#each allExerciseType as type}
							<label class="checkbox-label">
								<input
									type="checkbox"
									checked={allowedExerciseTypes.includes(type)}
									onchange={(e) =>
										handleUpdate('allowedExerciseTypes', type, e.currentTarget.checked)}
								/>
								<span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
							</label>
						{/each}
					</div>
				</div>

				<div class="config-section">
					<h3>Notes</h3>
					<div class="checkbox-grid">
						{#each AllNotes as note}
							<label class="checkbox-label">
								<input
									type="checkbox"
									checked={allowedNotes.includes(note)}
									onchange={(e) => handleUpdate('allowedNotes', note, e.currentTarget.checked)}
								/>
								<span>{note}</span>
							</label>
						{/each}
					</div>
				</div>

				<div class="config-section">
					<h3>Chord Types</h3>
					<div class="checkbox-grid">
						{#each AllChordTypes as chordType}
							<label class="checkbox-label">
								<input
									type="checkbox"
									checked={allowedChordTypes.includes(chordType)}
									onchange={(e) =>
										handleUpdate('allowedChordTypes', chordType, e.currentTarget.checked)}
								/>
								<span>{chordType}</span>
							</label>
						{/each}
					</div>
				</div>

				<div class="config-section">
					<h3>Inversions</h3>
					<div class="checkbox-grid">
						{#each AllInversions as inv}
							<label class="checkbox-label">
								<input
									type="checkbox"
									checked={allowedInversions.includes(inv)}
									onchange={(e) =>
										handleUpdate('allowedInversions', inv.toString(), e.currentTarget.checked)}
								/>
								<span
									>{inv === 0
										? 'Root'
										: `${inv}${inv === 1 ? 'st' : inv === 2 ? 'nd' : 'rd'}`}</span
								>
							</label>
						{/each}
					</div>
				</div>

				<div class="config-section">
					<h3>Scale Modes</h3>
					<div class="checkbox-grid">
						{#each AllScaleModes as mode}
							<label class="checkbox-label">
								<input
									type="checkbox"
									checked={allowedScaleModes.includes(mode)}
									onchange={(e) => handleUpdate('allowedScaleModes', mode, e.currentTarget.checked)}
								/>
								<span>{mode}</span>
							</label>
						{/each}
					</div>
				</div>

				<div class="config-section">
					<h3>Voicings</h3>
					<div class="checkbox-grid">
						{#each AllChordVoicings as voicing}
							<label class="checkbox-label">
								<input
									type="checkbox"
									checked={allowedVoicings.includes(voicing)}
									onchange={(e) =>
										handleUpdate('allowedVoicings', voicing, e.currentTarget.checked)}
								/>
								<span>{voicing.charAt(0).toUpperCase() + voicing.slice(1)}</span>
							</label>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.popup-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.popup-content {
		background: white;
		padding: 1.5rem;
		border-radius: 8px;
		max-width: 90%;
		max-height: 90%;
		overflow-y: auto;
		position: relative;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.close-btn {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		border: none;
		background: none;
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		color: #666;
	}

	h2 {
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
		color: #333;
	}

	h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1rem;
		color: #666;
	}

	.config-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.config-section {
		background: #f8f9fa;
		padding: 0.75rem;
		border-radius: 6px;
	}

	.checkbox-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		background: white;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		border: 1px solid #dee2e6;
		font-size: 0.875rem;
		cursor: pointer;
	}

	.checkbox-label:hover {
		background: #f0f0f0;
	}

	@media (orientation: landscape) and (max-height: 600px) {
		.popup-content {
			display: flex;
			flex-direction: column;
			padding: 1rem;
		}

		.config-grid {
			grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
			gap: 0.5rem;
		}

		.config-section {
			padding: 0.5rem;
		}

		h2 {
			font-size: 1rem;
			margin-bottom: 0.5rem;
		}

		h3 {
			font-size: 0.875rem;
		}

		.checkbox-label {
			padding: 0.15rem 0.35rem;
			font-size: 0.75rem;
		}
	}
</style>
