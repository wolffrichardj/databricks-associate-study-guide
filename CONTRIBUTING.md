# Contributing

## Branching

- Branch from `main` using `codex/<short-description>` naming.
- Keep PRs focused and small when possible.

## Development Flow

1. `npm install`
2. `npm run dev`
3. Make changes
4. Run checks before commit:
   - `npm run typecheck`
   - `npm run lint`
   - `npm run test`
   - `npm run test:e2e`

## Pull Requests

- Include a clear summary of behavior changes.
- Include screenshots for major UI changes.
- Mention any data model or persistence key changes.
- Ensure CI is green.

## Test Standards

- Preserve minimum 80% unit/component coverage.
- Add unit tests for business logic changes.
- Add or update Playwright tests for user-facing flows.

## Merge Strategy

This repository is configured for **squash-only merges** via `.github/settings.yml` when the Probot Settings app (or equivalent repository-settings automation) is enabled in GitHub.

- `allow_squash_merge: true`
- `allow_merge_commit: false`
- `allow_rebase_merge: false`

If settings automation is not installed, an admin must enable these options manually in GitHub repository settings.

## Main Branch Protection Baseline

`main` protections are declared in `.github/settings.yml` and enforce CI health before merge:

- Pull requests are required to merge to `main`.
- The `CI / test` status check is required and must be up-to-date before merging.
- Force pushes are disabled.
- Branch deletion on `main` is disabled.
- Linear history is required (compatible with squash-only merges).
- Conversation resolution is required before merge.
- Auto-delete merged branches is enabled at the repository level.

These settings keep a lightweight review policy while preventing merges when base CI is failing or still pending.
