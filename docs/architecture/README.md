# Browser-local study architecture

The app keeps practice account-free by giving React's `App` one state owner and isolating browser persistence in `storage.ts`. That makes selection and UI behavior easy to inspect, but progress depends on this browser origin/profile: storage failures have no recovery UI, and clearing storage loses progress.

![Study architecture: learner and React views feed App; App calls quiz helpers, imports the question bank and delegates localStorage I/O to the storage adapter.](study-app.svg)

[Download the interactive diagram](https://raw.githubusercontent.com/wolffrichardj/databricks-associate-study-guide/main/docs/architecture/study-app.html) and open the saved `.html` file in a browser. GitHub displays HTML source/downloads; this link is not a hosted app. The standalone viewer has light/dark themes, clickable source citations and clean exports. It needs no app server; source links require internet access.

## Follow one study session

1. `main.tsx` mounts `App`. `App` initializes state through `loadState`, restores the selected tab from `?view=`, and saves persisted state whenever that React state changes. Weekly Plan checkboxes send callbacks to `App`, which applies `markWeeklyTask` and passes updated state back as props.
2. The question bank is a TypeScript import. Module evaluation expands each checked-in template into five suffix variants, preserving the answer and choices. There is no runtime question download, Databricks connection or model call. `App` passes bank + configuration + recent exposure into `createSession`; the helper returns selected IDs, empty answers and an index. `App` resolves those IDs against its in-memory bank map for `QuizPlayer`.
3. Focused selection filters by topic/domain and deduplicates IDs. Overall-skills selection uses configured domain weights, rounded quotas and fallback. Both cap size to available unique IDs and apply recent-exposure preference and template diversification. These heuristics do not guarantee exact domain ratios, unseen questions or distinct concepts. An explicit seed repeats selected IDs only for the same ordered bank/configuration/exposure; the UI uses `Date.now()`, and `startedAt` also uses the clock.
4. Answer/next callbacks replace active-session values in `App`; the save effect writes them through the adapter. Finish scores answers, merges topic performance and calls the in-memory `completeSession` transform. The next save persists the summary/performance/exposure and clears the active session. `lastResult` itself is transient; a completed results panel is not restored after reload.
5. Weak topics require at least three attempts and accuracy below 70%. Recommendations join local topic/resource metadata and rank by `(1 − accuracy) × domain weight`. Results and study links provide feedback; they do not establish exam readiness or learner outcomes.

## Control and I/O ownership

All runtime boxes execute in the browser. Arrows describe calls/data dependencies, not deployed services. The selection arrow carries the bank as well as configuration and exposure; helpers never read browser storage themselves.

| Owner | Reads | Produces or writes | Source at the inspected revision |
| --- | --- | --- | --- |
| React entry and `App` | State from adapter; bundled bank; UI callbacks | React state/props; URL tab via `history.replaceState`; calls selection/scoring and adapter | [entry](https://github.com/wolffrichardj/databricks-associate-study-guide/blob/3b3799d5ba469fc5ed937fd09e90395302773277/src/main.tsx#L1-L10); [initialization/effects](https://github.com/wolffrichardj/databricks-associate-study-guide/blob/3b3799d5ba469fc5ed937fd09e90395302773277/src/App.tsx#L61-L81); [handlers](https://github.com/wolffrichardj/databricks-associate-study-guide/blob/3b3799d5ba469fc5ed937fd09e90395302773277/src/App.tsx#L166-L282) |
| Weekly/setup/player/results components | Props and local content metadata | Intent callbacks; rendered controls, explanations and resource links | [component wiring](https://github.com/wolffrichardj/databricks-associate-study-guide/blob/3b3799d5ba469fc5ed937fd09e90395302773277/src/App.tsx#L351-L395); [WeeklyPlanView](https://github.com/wolffrichardj/databricks-associate-study-guide/blob/3b3799d5ba469fc5ed937fd09e90395302773277/src/components/WeeklyPlanView.tsx#L10-L59); [QuizPlayer](https://github.com/wolffrichardj/databricks-associate-study-guide/blob/3b3799d5ba469fc5ed937fd09e90395302773277/src/components/QuizPlayer.tsx#L13-L86) |
| `questions.ts` | Checked-in templates and topic labels | In-memory `QUIZ_QUESTIONS`, five variants per template | [bank construction](https://github.com/wolffrichardj/databricks-associate-study-guide/blob/3b3799d5ba469fc5ed937fd09e90395302773277/src/data/questions.ts#L802-L841) |
| `quiz.ts` / `recommendations.ts` | Explicit arguments plus bundled domain/topic/resource metadata | Session, score, cumulative performance, ranked resource values; no I/O | [selection](https://github.com/wolffrichardj/databricks-associate-study-guide/blob/3b3799d5ba469fc5ed937fd09e90395302773277/src/lib/quiz.ts#L15-L268); [scoring/performance](https://github.com/wolffrichardj/databricks-associate-study-guide/blob/3b3799d5ba469fc5ed937fd09e90395302773277/src/lib/quiz.ts#L270-L410); [recommendations](https://github.com/wolffrichardj/databricks-associate-study-guide/blob/3b3799d5ba469fc5ed937fd09e90395302773277/src/lib/recommendations.ts#L1-L23) |
| `storage.ts` | `localStorage.getItem` and state arguments | `saveState` calls `setItem`; `resetState` immediately saves defaults. Other helpers return new state to `App` | [actual I/O](https://github.com/wolffrichardj/databricks-associate-study-guide/blob/3b3799d5ba469fc5ed937fd09e90395302773277/src/lib/storage.ts#L37-L76); [state transforms](https://github.com/wolffrichardj/databricks-associate-study-guide/blob/3b3799d5ba469fc5ed937fd09e90395302773277/src/lib/storage.ts#L78-L125) |

## Why keep state and persistence separate?

One React owner keeps weekly progress, quiz callbacks and feedback coherent without adding accounts or a server. In-memory selection/scoring helpers accept explicit values, so tests can exercise the duplicate-ID and oversized-pool cases independently of UI or storage. The adapter provides a small, inspectable I/O boundary. This is a useful small-app design; it does not demonstrate a deployed data platform.

The cost is intentionally visible. The `databricks-study-app/v1` record retains weekly progress, the active session (IDs, answers, index and configuration), up to 30 completed summaries, cumulative topic performance and the latest 25 exposure IDs. Setup configuration and the detailed `lastResult` live outside that record. There is no cross-device sync, backup service or explicit cross-tab conflict protocol.

## Failure and trust boundaries

- [Loading](https://github.com/wolffrichardj/databricks-associate-study-guide/blob/3b3799d5ba469fc5ed937fd09e90395302773277/src/lib/storage.ts#L37-L76) falls back to defaults for absent data, version mismatch and exceptions inside JSON parsing/hydration. `getItem` is outside the `try`, and `setItem` has no catch: denied/quota-failed storage is not a handled recovery path. Correct-version state is partially hydrated, not fully schema validated.
- A persisted ID can outlive a bank change. [QuizPlayer](https://github.com/wolffrichardj/databricks-associate-study-guide/blob/3b3799d5ba469fc5ed937fd09e90395302773277/src/components/QuizPlayer.tsx#L21-L32) shows “Question not found in current bank”; there is no migration/reconciliation flow. [Scoring](https://github.com/wolffrichardj/databricks-associate-study-guide/blob/3b3799d5ba469fc5ed937fd09e90395302773277/src/lib/quiz.ts#L289-L309) skips missing objects, while the [denominator](https://github.com/wolffrichardj/databricks-associate-study-guide/blob/3b3799d5ba469fc5ed937fd09e90395302773277/src/lib/quiz.ts#L358-L367) remains the session ID count.
- Start Study Over writes defaults, then React saves the reset state again. Clearing origin storage also loses local progress. Neither operation is cloud recovery.
- Answer keys ship with the client. This is transparent practice feedback, not a secure assessment. Resource links navigate to study material; they are not integrations with those services.
- The existing [build notes](../../LESSONS_LEARNED.md) describe an agent-assisted workflow. This diagram was AI-assisted and checked against the cited source. It makes no claim of sole line authorship, measured AI productivity, official endorsement, current exam alignment, question reuse licensing or certification success. The original source snapshot has no root license file; the renderer notice below does not license the study content.

## What the tests establish

- [Quiz unit tests](https://github.com/wolffrichardj/databricks-associate-study-guide/blob/3b3799d5ba469fc5ed937fd09e90395302773277/src/test/quiz.test.ts#L5-L143): focused membership, requested size, duplicate-ID regression, recent exposure, template variety, oversized requests and bank ID/topic checks. These are bounded fixtures, not exhaustive distribution or content-quality proofs.
- [Component tests](https://github.com/wolffrichardj/databricks-associate-study-guide/blob/3b3799d5ba469fc5ed937fd09e90395302773277/src/test/components.test.tsx#L8-L79) and [App tests](https://github.com/wolffrichardj/databricks-associate-study-guide/blob/3b3799d5ba469fc5ed937fd09e90395302773277/src/test/App.test.tsx#L6-L99): setup behavior, checklist remount persistence, quiz completion, reset, capped-count warning and URL tab restoration.
- [Playwright](https://github.com/wolffrichardj/databricks-associate-study-guide/blob/3b3799d5ba469fc5ed937fd09e90395302773277/e2e/app.spec.ts#L1-L57): weekly reload persistence, focused quiz to results, overall-skills completion/reset on desktop and mobile viewport projects. They do not prove real-device acceptance, production hosting, storage-denial recovery or certification outcomes.

## Artifact and source revision

Source inspection is pinned to `3b3799d5ba469fc5ed937fd09e90395302773277`, not a claim that these links track future changes. [candidate.json](candidate.json) contains repository-relative paths and line citations. [artifact-manifest.json](artifact-manifest.json) records portable SHA-256 hashes for the unchanged finalized candidate, standalone HTML and clean preview. It is a publication manifest, not an Archify strict-provenance sidecar or CI attestation.

The exact original `*.delivery.json` and full finalize/browser receipts are retained privately because Archify embeds host-specific absolute paths. They are deliberately not published. A downloaded HTML file remains usable, but a strict provenance check requires local regeneration to produce a matching sidecar at your output path. Do not manufacture or sanitize a sidecar and call it original evidence.

## Regenerate and inspect

Use Node 22 and an existing Archify installation (skill metadata version 3.2). From a checkout root, set `ARCHIFY` to that installation's `bin/archify.mjs`; the renderer is not an app dependency. No automatic install/update is performed.

```bash
node "$ARCHIFY" finalize architecture docs/architecture/candidate.json \
  docs/architecture/study-app.html --repo-root . --quality showcase \
  --out-dir /tmp/study-architecture-review --json
node "$ARCHIFY" visual-check docs/architecture/study-app.html \
  --out-dir /tmp/study-architecture-visual --summary --require-provenance
```

Inspect both themes before accepting the result. In the viewer, choose **Export → SVG/PNG** for a clean diagram-only preview; do not screenshot the viewer toolbar. Recompute manifest hashes only after accepting the new bytes. Keep host-specific generated sidecars out of public commits. If source behavior changes, inspect the new source, update `meta.repository.revision` and ranges, then finalize again; do not simply relabel old evidence.

The checked-in HTML bundles the [Archify](https://github.com/tt-a1i/archify) renderer/viewer. Its MIT notice is reproduced in [ARCHIFY-LICENSE.txt](ARCHIFY-LICENSE.txt), including the Archify and Cocoon AI copyright notices. This attribution applies to the bundled renderer, not an assertion of licensing for all repository content.
