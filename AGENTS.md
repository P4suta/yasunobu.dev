# Working on the homepage

Reply in Japanese and write repository artifacts in English.
Follow the [contribution guide](CONTRIBUTING.md) for issue scope, tool versions, commit conventions, and checks.

Read the [static deployment decision](docs/adr/build-static-assets-in-github-actions.md) before changing how the site builds or deploys.
Fetch Cloudflare credentials from Doppler only after the deployment checks pass.

Before reporting completion or pushing, inspect the diff and affected workflows.
Run `mise x -- just check`.
Report the checks that ran and their results.
Wait for an explicit request before committing, pushing, requesting review, replying to or resolving review threads, or merging.
