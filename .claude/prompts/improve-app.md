# Master Improvement Prompt

Use this prompt to kick off a comprehensive improvement sprint on the app.
Copy-paste it into the Claude Code chat when you want a full pass.

---

You are working on a **Duolingo-style jazz piano learning app** (see CLAUDE.md for full context).

Work through the following improvement areas **in order**, using the appropriate sub-agents for each. After each phase, run `npm run check && npm run test` and fix any regressions before moving on.

---

## Phase 1 — Bug Fixes (blockers)

Use the **@debugger** agent to investigate and fix each of these:

1. **Dark mode is completely broken** — `ThemeToggle.svelte` changes nothing visually. Find the root cause: does it set a class on `<html>`? Do CSS variables respond to it? Fix it end-to-end so toggling dark mode actually changes the visual appearance across ALL pages and components.

2. **White text on white background** — audit all Svelte components for elements where text or icons are white but the background is also white or very light. Fix every instance. Use Grep to find `text-white`, `fill-white`, `text-gray-100` etc. applied without a dark background.

3. **Nav bar scroll overlap** — on the Journey page, scrolling causes content text to slide under the navigation bar. Fix the nav bar z-index, position sticky/fixed, and ensure pages have enough top padding to account for nav height.

4. **Random exercise picks from wrong level** — the "practice a random exercise from this level" feature on the Journey page picks from ALL exercises, not just the current unit's exercises. Fix the selection logic in `JourneyService.ts`.

After each fix: run `npm run check && npm run test`. Add a regression test.

---

## Phase 2 — UI/UX Polish

Use the **@ui-designer** agent for all visual work.

5. **Build a proper design system** — define semantic CSS custom properties in `src/styles/global.css`:
   - `--color-primary`, `--color-primary-hover`
   - `--color-surface`, `--color-surface-raised`, `--color-surface-overlay`
   - `--color-on-surface`, `--color-on-surface-muted`
   - `--color-success`, `--color-error`, `--color-warning`
   - Dark mode variants under `[data-theme="dark"]` or `.dark`
   - Replace hardcoded colors in components with these tokens.

6. **Gym page redesign** (`src/routes/exercises/+page.svelte`) — currently all black text on white. Redesign it to feel engaging:
   - Color-coded exercise cards by category (rhythm=orange, theory=blue, harmony=purple, etc.)
   - Icon + name + short description on each card
   - Hover animation with subtle lift/glow
   - Difficulty badge (Beginner / Intermediate / Advanced)
   - Keep it mobile-friendly (grid that reflows to 1 column on small screens)

7. **Journey page polish** — make it feel like Duolingo's path:
   - Completed lessons: filled star, checkmark, desaturated
   - Active lesson: highlighted, pulsing or glowing border
   - Locked lessons: greyed out with lock icon
   - Unit headers with color and progress bar
   - Smooth scroll, no overlap with nav

8. **Exercise completion feel** — when a user finishes an exercise with 3 stars:
   - Trigger neoconfetti (already installed)
   - Show XP gain animation (number floats up and fades)
   - Star fill animation on the completion modal
   - Sound cue (short success tone via Web Audio API)

9. **Exercise feedback messages** — update all tooltip/help text to be exercise-specific. Format: `"Struggling? After 3 mistakes, [specific hint for this exercise type] will appear."`

---

## Phase 3 — Mobile & Accessibility

Use **@mobile-developer** for layout, **@accessibility-fixer** for a11y.

10. **Mobile layout audit** — test every page at 375px (iPhone SE) and 768px (iPad):
    - Navigation should use the hamburger menu correctly
    - Exercise pages must not require horizontal scroll
    - Piano keyboard needs touch-optimized key sizes
    - Score/VexFlow notation must be readable (zoom or responsive sizing)
    - Buttons and tap targets minimum 44px

11. **Accessibility audit** — fix WCAG AA violations:
    - All text: minimum 4.5:1 contrast ratio
    - All icon-only buttons: add `aria-label`
    - All exercise feedback: use `aria-live` regions
    - Add `prefers-reduced-motion` media query for all animations
    - Ensure full keyboard navigation works on all pages

---

## Phase 4 — Features

Use **@exercise-builder** and **@jazz-music-expert** together.

12. **Velocity sensitivity** — add MIDI velocity (0-127) tracking to `MIDIManager.ts`. Display the velocity value during practice. Add a "dynamics exercise" that asks the user to play notes softly (velocity < 64) or loudly (velocity > 96).

13. **Swing metronome** — add a swing toggle to the metronome. When enabled, eighth notes are played with swing ratio (2:1, i.e., long-short feel). Visualize it in `Metronome.svelte`.

14. **Strict beat mode** — add a mode where the user MUST play on the beat (within ±50ms tolerance instead of ±150ms). Add visual beat indicator that flashes on each beat.

15. **Curriculum review** — ask the **@curriculum-designer** agent to:
    - Review current lesson ordering in `JourneyService.ts`
    - Identify gaps in the curriculum
    - Propose 3-5 new exercises that would help a complete beginner
    - Ensure II-V-I progressions appear at the right difficulty level

---

## Phase 5 — Code Quality & Tests

Use **@qa-inspector** for test runs, **@svelte-developer** for refactoring.

16. **Test coverage** — write unit tests for any exercise that doesn't have them. Priority:
    - Every exercise validation function
    - JourneyService unlock logic
    - UserStatsService stats recording
    - Music theory functions in `src/lib/core/`

17. **E2E coverage** — ensure Playwright tests cover:
    - Full user journey: login → exercise → completion → stats update
    - Journey unlock flow: completing all lessons in a unit unlocks the next
    - Dark mode: toggle persists across page navigation

18. **Refactoring pass** — identify and fix:
    - Any `console.log` statements left in production code
    - Any `TODO` or `FIXME` comments in the code
    - Any unused imports or dead code
    - Any `any` types that can be replaced with proper TypeScript

---

## Definition of Done

Before considering any phase complete:
- [ ] `npm run build` passes
- [ ] `npm run check` passes (zero TypeScript errors)
- [ ] `npm run test` passes (all unit tests green)
- [ ] No console errors on any page
- [ ] No `any` types introduced
- [ ] Dark mode works on the changed pages
- [ ] Mobile layout works at 375px

---

## Quick single-task prompts

For targeted work, use these shorter prompts:

**Fix all known bugs:**
```
Use the @debugger agent to work through every item in TOFIX.md. Fix each one,
run tests after each fix, and confirm it's resolved.
```

**Full visual redesign:**
```
Use the @ui-designer agent to implement a complete design system for this app.
Start with the color tokens in global.css, then apply them to every component.
Make it look like Duolingo: colorful, gamified, polished.
```

**QA pass:**
```
Use the @qa-inspector agent to run a complete QA pass: check, test, build,
then report all failures as BLOCKERS or WARNINGS.
```

**Add a new exercise:**
```
Use the @exercise-builder agent with @jazz-music-expert to add a [EXERCISE NAME]
exercise. It should teach [CONCEPT] to [BEGINNER/INTERMEDIATE] students.
Place it in the curriculum after [PREREQUISITE].
```
