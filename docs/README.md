# Development and deployment

The [contribution guide](../CONTRIBUTING.md) covers the local development server and `mise x -- just check`, which runs the same checks as GitHub Actions.
GitHub Actions deploys `main` to [sakashita.yasunobu.dev](https://sakashita.yasunobu.dev) after those checks pass.
The [deployment guide](deployment.md) covers Doppler credentials and the production workflow.

## Architecture decisions

- [Build static assets in GitHub Actions](adr/build-static-assets-in-github-actions.md)
- [Render static pages with Hono JSX](adr/render-static-pages-with-hono-jsx.md)
