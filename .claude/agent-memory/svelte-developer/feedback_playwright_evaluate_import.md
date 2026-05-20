---
name: Playwright page.evaluate dynamic import with browser URL path
description: Dynamic import('/src/lib/Foo.ts') inside page.evaluate causes TS "Cannot find module" errors — assign path to a const first so TypeScript doesn't statically resolve it
type: feedback
---

TypeScript statically resolves string literals in `import(...)` expressions even inside `page.evaluate()` callbacks. Using a browser-served URL like `'/src/lib/UserStatsService.ts'` as a literal triggers "Cannot find module" because TypeScript looks for it on the filesystem.

**Why:** Found in `tests/e2e/progression-flow.spec.ts` lines 7 and 11.

**How to apply:** Assign the path to a `const` variable first, then pass the variable to `import(/* @vite-ignore */ path)`. TypeScript will not statically resolve dynamic `import(variable)` expressions. The `/* @vite-ignore */` comment also suppresses any Vite warnings about unresolvable dynamic imports.
