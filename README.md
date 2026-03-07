# Databricks Associate Study App

Lightweight React + TypeScript study app for Databricks Data Engineer Associate preparation.

## Features

- Weekly study execution tracker (Day 0 to Day 7) with checkboxes and local persistence.
- Focused Topic quiz mode for domain/topic-specific practice.
- Dive Into the Test mode for mixed, exam-weighted practice.
- Weak-topic detection with prioritized study links to official Databricks resources.
- Resume active quiz sessions on the same device.
- Global Reset Program action to clear all tracked state.

## Tech Stack

- React 19 + Vite + TypeScript
- Vitest + Testing Library (unit/component)
- Playwright (E2E)
- GitHub Actions CI

## Local Setup

1. Use Node version in `.nvmrc` (`nvm use`).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` - run Vite dev server
- `npm run build` - typecheck + production build
- `npm run typecheck` - TypeScript project check
- `npm run lint` - ESLint
- `npm run test` - Vitest with coverage gate (>=80%)
- `npm run test:watch` - Vitest watch mode
- `npm run test:e2e` - Playwright tests
- `npm run ci` - full local CI sequence

## Testing Expectations

- Unit/component coverage threshold is enforced at 80% (lines/functions/branches/statements).
- E2E validates weekly tracker persistence, focused mode flow, overall mode flow, and reset behavior.
- Mobile + desktop are covered by Playwright projects.

## Data and Persistence

- All study content, resources, and question bank are local TypeScript/JSON-style data files in `src/data/`.
- App state is stored in local storage under a versioned key for same-device resume.
- No backend/auth is used in v1.

## CI

GitHub Actions workflow runs:

1. `npm ci`
2. `npx playwright install --with-deps chromium`
3. `npm run typecheck`
4. `npm run lint`
5. `npm run test`
6. `npm run test:e2e -- --project=chromium`
