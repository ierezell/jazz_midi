---
name: Landscape mobile CSS approach
description: How to add landscape orientation fixes — append @media blocks to existing <style> sections, never create new files
type: feedback
---

Append `@media (orientation: landscape) and (max-height: 500px)` blocks at the end of each component's existing `<style>` section rather than creating separate CSS files or utility classes.

**Why:** This keeps landscape overrides co-located with the component styles they modify, avoids global side-effects, and is the simplest additive change that doesn't touch component logic.

**How to apply:** When adding landscape fixes to a Svelte component, read the file first to locate the closing `</style>` tag line number, then use Edit to insert the media block just before `</style>`. Always run `npm run check` after all edits to confirm 0 errors.
