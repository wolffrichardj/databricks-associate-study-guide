# Databricks Associate Study App

Local-first React + TypeScript app for Databricks Data Engineer Associate prep.

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

## Build notes and lessons learned

To see the lessons we learned and how we built and managed this codebase, go here: [LESSONS_LEARNED.md](./LESSONS_LEARNED.md).

