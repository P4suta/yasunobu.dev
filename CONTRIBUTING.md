# Contributing to yasunobu.dev

## Run the homepage locally

Before trusting the checkout, review the tool versions in `mise.toml`.
Install the pinned tools and dependencies, then build the site and serve it with Wrangler.

```sh
mise trust
mise install
mise x -- npm ci
mise x -- npm run dev
```

The development server listens at `http://localhost:8787` and applies the headers from `public/_headers`.
Choose another port with `mise x -- npm run dev -- --port <port>`.
Restart the server to rebuild after a change.
Pages in `src/pages/` are [Hono JSX](https://hono.dev/docs/guides/jsx) components, and `src/app.tsx` assigns their routes.
The build writes each route to `dist/` and copies static assets from `public/`.

## Prepare a change

Use an open issue to record the change and how to verify it.
Keep each pull request within the issue's scope.
Before implementing a consequential architecture decision, record it under `docs/adr/`.

Write documentation, code comments, issues, and pull requests in English, with one sentence per source line.
Write commit messages in English and follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
The accepted commit types and subject length limit appear in `committed.toml`.

Check for a custom hooks directory with `git config --get core.hooksPath`.
If Git uses its default hooks directory, install the hooks with `mise x -- lefthook install`.
Configure a shared dispatcher to invoke Lefthook for the hooks defined in `lefthook.yml`.
A dispatcher that already invokes Lefthook loads the project configuration automatically.
The hooks check formatting and secrets in staged changes, validate the commit message, and run the project checks before push.

## Verify a change

Run the same check command used by GitHub Actions.

```sh
mise x -- just check
```

The repository checks validate the hook configuration, lint the workflows, and scan for secrets in the history reachable from `HEAD`.
By default, commit message validation covers the current revision and skips merge commits.
To check the commit messages on a branch, run `mise x -- just check origin/main..HEAD`.
Pull requests and merge groups check every non-merge commit in the range from the base to the tested revision.

The site checks validate formatting and types, run the tests, build the site, and validate the generated HTML.
The checks include a dependency audit and a Wrangler deployment dry run.
The deployment job fetches production credentials after the checks pass on `main`.
The [deployment guide](docs/deployment.md) describes the production environment and domain.
