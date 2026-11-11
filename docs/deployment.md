# Deployment

`npm run build` generates standard Astro static output in `dist/`.
`npm run check` validates the site and runs a credential-free Wrangler deployment dry run.
Pull requests and merge groups run the Checks workflow without Cloudflare credentials.
The Deploy workflow checks and deploys the same generated files when `main` changes, and supports manual runs from `main`.
GitHub serializes deployment runs without interrupting an active deployment.

## Credentials

Create a GitHub `production` environment restricted to the `main` branch.
Store `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` in Doppler project `yasunobu-dev`, config `prd`.
Create a read-only [Doppler Service Token](https://docs.doppler.com/docs/service-tokens) limited to that config and store it as the GitHub `production` environment secret `DOPPLER_TOKEN`.
The workflow fetches both Cloudflare values after successful checks and passes them only to the deployment step.

Use an API token scoped to the existing `yasunobu-homepage` Worker with [Editor access](https://developers.cloudflare.com/workers/authorization/workers/#routes-and-custom-domains).
Replace the Cloudflare token in Doppler before it expires.
Rotate the Doppler Service Token in the GitHub environment before its expiry.
The existing `yasunobu-homepage` Worker must already serve the `sakashita.yasunobu.dev` Custom Domain.
Wrangler [preserves dashboard-managed routes](https://developers.cloudflare.com/workers/wrangler/configuration/#source-of-truth) because `wrangler.jsonc` omits route keys and sets `workers_dev` to false.
The deployment token needs no zone permissions.

## Cutover

Configure the production environment and deployment token before merging the workflow.
Before the first Actions deployment, [disconnect Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/#disconnecting-builds) under the Worker's Settings, Builds, Disconnect to prevent competing deployments.
Disconnecting builds leaves the deployed site available.
After merging, confirm the Deploy workflow succeeds and verify the page and response headers at `https://sakashita.yasunobu.dev`.
Remove the repository from the Cloudflare GitHub App's access and revoke the former build token when no other deployment needs them.
