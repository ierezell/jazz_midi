# Architectural Audit - Jazz MIDI Application

**Date:** April 28, 2026  
**Auditor:** Lead Frontend Architect  
**Scope:** Full codebase against SOLID, DRY, KISS, and Svelte 5 best practices

---

## Critical Violations Found

### 1. God Component: `BaseExercise.svelte` ⚠️ CRITICAL
**Lines:** 1,221  
**Violations:**
- ❌ **Single Responsibility:** Handles MIDI, audio, validation, UI, timing, progress tracking
- ❌ **Logic Coupling:** Business logic deeply embedded in component
- ❌ **Testability:** Impossible to unit test business logic in isolation
- ❌ **Reusability:** 25 props, complex interface, tightly coupled

**$effect Usage (Potentially Problematic):**
- Line 103-111: Prop change detection (legitimate)
- Various exercise pages: Multiple $effect hooks for initialization

### 2. Missing Barrel Exports ⚠️ HIGH
**Issue:** No `index.ts` files in `$lib/` directories  
**Impact:**
- ❌ Import paths are deep and inconsistent
- ❌ No clear public API boundary
- ❌ Tree-shaking not optimized

**Current:**
```typescript
import { calculateOptimalRange } from '$lib/MusicTheoryUtils';
import { validateNoteTiming } from '$lib/music-validation';
import type { ExerciseAPI } from '$lib/types/exercise-api';
```

**Should Be:**
```typescript
import { calculateOptimalRange, validateNoteTiming, type ExerciseAPI } from '$lib';
```

### 3. Business Logic in Components ⚠️ HIGH
**Files Affected:**
- `BaseExercise.svelte` lines 272-400+: Note validation, timing logic
- `training/+page.svelte`: Workout generation call (good), but UI mixed
- Multiple exercise `+page.svelte`: Each has unique business logic patterns

**Violation:** UI components should not contain business rules

### 4. $effect Overuse / Misuse ⚠️ MEDIUM
**Patterns Found:**
```svelte
// Pattern 1: Initialization (could be $derived or event-driven)
$effect(() => {
  if (!currentDisplayNote) {
    generateNewNote();
  }
});

// Pattern 2: Reset on dependency change (legitimate)
$effect(() => {
  mode; hand;
  resetSequence();
});
```

### 5. Duplicated Patterns Across Exercise Pages ⚠️ MEDIUM
**Observation:** Each exercise `+page.svelte` has similar structure but slight variations:
- State initialization
- Exercise completion handling
- Reset logic
- Prop drilling to BaseExercise

**Solution:** Create configurable exercise templates or composable logic

### 6. Inconsistent Component Structure ⚠️ MEDIUM
**Current:** Flat structure in `components/`
**Should Be:** Atomic Design
```
components/
  atoms/        (Button, Icon, Badge)
  molecules/    (PillarCard, ExerciseCard)
  organisms/    (ExerciseLayout, NavigationBar)
  templates/    (BaseExercise shell)
```

---

## Refactoring Plan

### Phase 1: Extract Business Logic
**Files to Create:**
1. `$lib/exercise/ExerciseEngine.svelte.ts` - Core exercise state machine
2. `$lib/exercise/NoteValidator.ts` - Validation logic
3. `$lib/exercise/TimingEngine.ts` - Tempo/timing logic
4. `$lib/exercise/ProgressTracker.ts` - Progress/completion logic

### Phase 2: Refactor BaseExercise
**New Structure:**
- `BaseExercise.svelte` → Shell component only (200 lines max)
- `useExercise()` → Svelte 5 rune for state management
- Extract: `ExerciseHeader`, `ExerciseControls`, `ExerciseFeedback`

### Phase 3: Add Barrel Exports
**Files:**
- `$lib/index.ts` - Main export
- `$lib/exercise/index.ts` - Exercise domain
- `$lib/types/index.ts` - Type exports
- `$lib/components/index.ts` - Component exports

### Phase 4: Create Exercise Templates
**Reduce 21 exercise pages to:**
- Template for "single note" exercises (names, intervals)
- Template for "chord" exercises (chords, II-V-I)
- Template for "scale" exercises
- Template for "reading" exercises (partition)

### Phase 5: Atomic Design Restructure
**Move components to:**
```
src/
  components/
    atoms/
    molecules/
    organisms/
```

---

## Architectural Decision Records (ADRs)

### ADR 1: Exercise State Management
**Decision:** Use Svelte 5 runes (`$state`, `$derived`) in `.svelte.ts` files  
**Rationale:**
- Reactive across components
- Unit testable
- No store boilerplate
- Type-safe

### ADR 2: Component Composition
**Decision:** Use Snippets over slots for Svelte 5  
**Pattern:**
```svelte
{#snippet header()}
  <CustomHeader />
{/snippet}
<BaseExercise {header} />
```

### ADR 3: Domain-Driven File Structure
**Structure:**
```
$lib/
  exercise/      # Exercise domain
  midi/          # MIDI domain
  audio/         # Audio domain
  music/         # Music theory domain
  user/          # User/stats domain
```

---

## Implementation Priority

1. **CRITICAL:** Extract ExerciseEngine from BaseExercise
2. **HIGH:** Add barrel exports
3. **HIGH:** Refactor training page workout generation
4. **MEDIUM:** Create exercise templates
5. **MEDIUM:** Atomic design restructure
6. **LOW:** Add comprehensive E2E tests

---

## Test Strategy

### Unit Tests (Vitest)
- ExerciseEngine logic
- NoteValidator rules
- TimingEngine calculations
- ProgressTracker state

### E2E Tests (Playwright)
- All 28 routes navigation
- Exercise completion flow
- MIDI input simulation
- Training workout generation
- Theme switching

---

## Success Criteria

- [ ] BaseExercise under 200 lines
- [ ] All business logic unit testable
- [ ] Consistent imports via barrel files
- [ ] 90%+ test coverage on logic
- [ ] E2E tests for all user flows
- [ ] No $effect hooks that can be $derived
- [ ] Atomic design component structure
