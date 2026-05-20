# Agent Memory Index

- [TypeScript: open index signature widens named props](feedback_ts_index_signature.md) — avoid `[key: string]: unknown` on interfaces that have typed named properties; use discriminated unions instead
- [Playwright: dynamic import paths inside page.evaluate](feedback_playwright_evaluate_import.md) — browser-URL import paths cause TS errors; assign to a `const` first so TypeScript won't statically resolve them
- [SvelteKit resolve() overload cast pattern](feedback_sveltekit_resolve_cast.md) — `resolve(str as unknown as RouteId)` is the correct replacement for `resolve(str as any)`; `as Pathname` alone does not satisfy the overloaded signature
