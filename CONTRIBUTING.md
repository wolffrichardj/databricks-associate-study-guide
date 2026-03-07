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
