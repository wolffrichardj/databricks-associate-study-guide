# Databricks Associate Study App

Interactive Databricks Data Engineer Associate study app with a weekly plan, focused and mixed quizzes, and weak-topic recommendations.

## Suggested GitHub repository description

Use this in **GitHub → Settings/About → Description**:

> Interactive Databricks Data Engineer Associate study app with a weekly plan, quizzes, and weak-topic recommendations.

## What it does

- Tracks Day 0–Day 7 weekly study completion with local persistence.
- Runs focused-topic and mixed/exam-style quiz sessions.
- Shows weak-topic recommendations from quiz performance.
- Lets users resume active quizzes and reset all local study state.

## Stack

- React 19, Vite, TypeScript
- Vitest + Testing Library
- Playwright (E2E)
- ESLint + Prettier

## Quick start

```bash
nvm use
npm install
npm run dev
```

## Quality checks

```bash
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run ci
```

> Note: `npm run test:e2e` skips locally when Playwright browser binaries are unavailable; CI still enforces full E2E execution.

## Scope notes

- Local-only storage (no backend/auth in v1).
- Weekly checklist and Quiz are the two core app experiences.
