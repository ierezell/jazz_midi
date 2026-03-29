---
name: TypeScript open index signature widens named props
description: An index signature like [key: string]: unknown on an interface causes all named properties to resolve as unknown — use discriminated unions per variant instead
type: feedback
---

Using `[key: string]: unknown` on an interface (e.g., `FlashCard.config`) makes TypeScript widen every named property (e.g., `chordType`, `root`, `mode`) to `unknown`, because the index signature must be compatible with all values. Even properties typed as `ChordType` become `ChordType | unknown` = `unknown`.

**Why:** This was discovered fixing the `FlashCard` interface where `config` had `chordType?: ChordType` alongside `[key: string]: unknown`, causing 20 TypeScript errors in `+page.svelte`.

**How to apply:** When a union of config shapes is needed, model it as a discriminated union of interfaces (one per variant, each with required typed fields) rather than a single interface with optional fields and an index signature. Svelte 5 template `{#if card.type === 'chord'}` blocks correctly narrow discriminated unions.
