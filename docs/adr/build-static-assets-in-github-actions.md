---
date: 2026-11-11
status: accepted
---

# Build static assets in GitHub Actions

## Context

The homepage contains only prerendered HTML.
Builds need to run in GitHub Actions with fewer Cloudflare permissions.

## Decision

Use [Astro static output](https://docs.astro.build/en/guides/deploy/#building-your-site-locally) without an adapter.
GitHub Actions checks and deploys `dist/` with Wrangler when `main` changes.
Only the deployment step receives the Cloudflare API token.
Doppler stores the Cloudflare account ID and token.
GitHub holds a read-only [Service Token](https://docs.doppler.com/docs/service-tokens) for the deployment config.

Keep the existing Custom Domain outside the deployment configuration.
[Wrangler preserves dashboard-managed routes](https://developers.cloudflare.com/workers/wrangler/configuration/#source-of-truth) when the configuration omits route keys and sets `workers_dev` to false.
Scope the deployment token to the existing Worker with [Editor access](https://developers.cloudflare.com/workers/authorization/workers/#routes-and-custom-domains).

## Alternatives

Workers Builds provides integrated deployment but requires Cloudflare repository access.
Running `cf build` in Actions retains the provider-specific build format.

## Consequences

Rotate the Cloudflare and Doppler tokens before they expire.
Disconnect Workers Builds during cutover.
Reconsider the adapter if the site needs request-time rendering.

## Confirmation

Require `npm run check`, workflow lint, and secret scanning before publication.
The [deployment guide](../deployment.md) defines credential setup and production cutover.
