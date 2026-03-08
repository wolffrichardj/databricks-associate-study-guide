# AGENTS.md

## Screenshot and preview requirements (mandatory)

When making code changes in this repository, the coding agent **must** include Playwright-generated screenshots as part of validation and reporting.

### When screenshots are required
- Required for every user-visible/front-end change.
- Strongly preferred for most other changes when a UI can still be rendered.
- Always required when preparing a PR.

### Minimum screenshot set
For each relevant run, capture and include:
1. **Weekly page** (main page)
2. **Quiz page** (main page)
3. **Quiz sample state** (a representative in-progress quiz view, not just quiz setup)

If a change only affects one page, still try to include the full set above when feasible so reviewers can quickly validate there are no regressions.

### Output requirements
- Include screenshot links in:
  - the PR description/body, and
  - the final output summary to the user.
- Use clear labels for each screenshot.
- If screenshots cannot be captured, explicitly state what was attempted, why it failed, and the exact command/tool step that failed.

### Preferred capture approach
- Use the Playwright browser tooling available in this environment.
- Start/attach to the local app, navigate to each page, and save artifacts with stable names.
- Reuse consistent viewport sizing to make before/after comparisons easier.

### Repo-verified local workflow and commands
- Use Node `>=22` (see `.nvmrc` and `package.json` engines), then run `npm install`.
- Start app locally with `npm run dev` (Vite default) or Playwright base URL flow on `http://127.0.0.1:4173`.
- Core validation commands:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run test`
  - `npm run test:e2e`
  - `npm run ci` (full local CI sequence)
- Existing E2E coverage in `e2e/app.spec.ts` verifies:
  - weekly checklist persistence after reload,
  - focused-topic quiz run to results,
  - overall-skills quiz run and `Start Over` reset behavior.
- For quiz sample screenshots, prefer this deterministic setup flow:
  - open `Quiz`,
  - set `data-testid="topic-select"` to `auto-loader`,
  - set `data-testid="question-count"` to `5`,
  - click `data-testid="start-quiz"`,
  - capture while `data-testid="quiz-player"` is visible.
- Primary navigation includes two tabs: **Weekly Plan** and **Quiz**.

## Product context requirements (mandatory)

Before implementing non-trivial changes, the coding agent must review the project specs for intent/scope alignment:

- Start at `specs/README.md`.
- Read `specs/application-goal.md` for mission and success criteria.
- Read `specs/feature-scope.md` for in-scope/out-of-scope boundaries.

If a requested change appears to conflict with the documented product goal or scope, call it out explicitly in PR notes and the final summary.
