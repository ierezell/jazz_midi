<script lang="ts">
  interface BeatHit { beat: number; hand: 'LH' | 'RH'; }
  interface Props {
    totalBeats?: number;
    currentBeat?: number;
    hitPositions?: BeatHit[];
    isActive?: boolean;
  }
  let { totalBeats = 4, currentBeat = 0, hitPositions = [], isActive = false }: Props = $props();

  function beatsForPosition(pos: number): BeatHit[] {
    return hitPositions.filter(h => Math.floor(h.beat) === pos + 1);
  }
</script>

<div class="beat-indicator" class:active={isActive} aria-label="Beat indicator">
  {#each Array(totalBeats) as _, i}
    {@const hits = beatsForPosition(i)}
    <div class="beat-cell">
      <div class="beat-dot" class:current={isActive && currentBeat === i + 1}></div>
      <div class="hit-markers">
        {#each hits as hit}
          <span class="hit-dot {hit.hand.toLowerCase()}" title="{hit.hand} beat {i + 1}"></span>
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
.beat-indicator {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  justify-content: center;
  padding: 0.5rem;
}
.beat-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.beat-dot {
  width: 14px; height: 14px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background: var(--color-surface);
  transition: background 0.08s, transform 0.08s;
}
.beat-dot.current {
  background: var(--color-primary);
  border-color: var(--color-primary);
  transform: scale(1.35);
}
.hit-markers { display: flex; gap: 2px; min-height: 8px; }
.hit-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  display: inline-block;
}
.hit-dot.lh { background: var(--color-level-3, #3b82f6); }
.hit-dot.rh { background: var(--color-level-5, #f59e0b); }
</style>
