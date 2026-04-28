---
name: SvelteKit resolve() overload cast pattern
description: resolve() from $app/paths uses overloaded signatures keyed on literal string unions; plain string values require a two-step cast
type: feedback
---

`resolve()` from `$app/paths` is overloaded — each route literal gets its own overload. The generated `RouteId` and `Pathname` types are **unions of all route literal strings**, not plain `string`.

When you have a runtime `string` that you know is a valid route (e.g., from `getLessonUrl()` which returns `string`, or from `getWeaknessRecommendations()` which returns `path: string`), TypeScript cannot narrow a wide `string` or even `Pathname` (the full union) into a specific overload's argument type.

**Pattern that works:**

```ts
import type { RouteId } from '$app/types';
resolve(path as unknown as RouteId);
```

The two-step cast through `unknown` is the idiomatic TypeScript replacement for `as any` when you need a forced cast to a specific type. It's strictly better than `as any` because you name the target type.

**Why:** `as Pathname` alone does not work — casting `string` to the full `Pathname` union still leaves TypeScript unable to pick a single overload from the union-typed argument. The overload resolver sees `[Pathname]` (a union tuple) and can't unify it with `[route: "/specific-path/"]`.

**How to apply:** Anywhere `resolve(dynamicStringPath)` is called where `dynamicStringPath` is typed as `string` (not a specific string literal), use `resolve(dynamicStringPath as unknown as RouteId)`.
