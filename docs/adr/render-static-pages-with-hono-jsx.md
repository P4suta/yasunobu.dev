---
date: 2026-11-23
status: accepted
---

# Render static pages with Hono JSX

## Context

`astro check` accepts only TypeScript 5 and 6.
[TypeScript 7](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/) lacks the stable API that template language tools need, while `tsc` checks `.tsx` itself.
The Content Security Policy allows no scripts.

## Decision

Write pages as `.tsx` with [Hono JSX](https://hono.dev/docs/guides/jsx), compiled by `tsc`.
A build script copies `public/` and writes each route to `dist/` with the [static site generation helper](https://hono.dev/docs/helpers/ssg).

## Alternatives

Checking with `tsc --noEmit` alone leaves `.astro` templates unchecked.
Astro's TypeScript 7 support needs the beta TypeScript 7.1.
Solid needs Babel and targets client-side reactivity.
Preact needs a custom route-to-file writer.

## Consequences

HTML validation requires self-closing void elements, which Hono emits, and catches unknown tag names, which Hono's types accept.
`npm run dev` serves one build without reloading.
Reconsider when the site needs client-side scripts.

## Confirmation

`test/homepage-output.test.ts` checks the generated files.
`mise x -- just check` type-checks with TypeScript 7 and validates the HTML.
