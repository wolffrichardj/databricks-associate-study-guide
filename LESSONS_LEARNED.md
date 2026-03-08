# Lessons Learned

This document captures what we learned while building and delivering this project.

## Entries
- [2026-03-08 — Mobile-first cloud-agent workflow](#2026-03-08--mobile-first-cloud-agent-workflow)

## 2026-03-08 — Mobile-first cloud-agent workflow

### Background
We used a mobile-first delivery approach for execution (prompting and objective definition from mobile), working through cloud coding agents and GitHub Actions to ship and validate outcomes.

### Lessons learned
1. **Start with delivery to an ephemeral/demo environment before deep code review.**
   - We learned this after trying to read and review too much code from a phone when the real goal was to validate whether the delivered outcome matched the objective.
   - Starting with preview delivery keeps the process objective-first: confirm behavior/output quality first, then do deeper code review when needed.
   - This reduces friction when reviewing PRs on a mobile screen and improves confidence that refinements are based on real output.

2. **Request deterministic tests and screenshot capture up front.**
   - Ensuring quality should be the starting point whether delivery is human-led or agent-led.
   - Ask for concrete, deterministic tests that prove the objective was met and guard against hidden expectations.
   - Require screenshot generation/storage on each iteration so first cuts can be reviewed quickly and UX can be refined with traceable evidence.
   - This creates trust in outcomes even when environments are imperfect.

3. **Treat PR automation capability as a tool-selection criterion.**
   - Tools differ in how well they create PRs, update existing PRs, or apply follow-up changes to the same branch.
   - Reliability can be inconsistent (including intermittent apply/update failures), which can materially impact delivery flow.
   - Keep experimenting with mobile and agentic tools frequently because capabilities evolve quickly.
   - Maintain a continuous learning/testing posture so both process and tool choice improve for speed and accuracy.

### How we built
- Worked from mobile-first execution: operating through Codex, Jules, and GitHub mobile/web experiences from a phone-first workflow.
- Defined objective-driven outcomes first, then used cloud agents to implement and iterate quickly.
- Used asynchronous working loops: receive notifications, review progress, add refinements (including quick/voice-driven adjustments), and continue without being desk-bound.
- Used GitHub Actions as the validation and delivery path.
- Repeated an outcome-check loop: deliver, verify tests/screenshots, then refine.

### LLM reflection on lessons and build approach
- From an LLM perspective, outcome-first prompting consistently improved iteration quality. Requests that specified acceptance checks (tests + screenshots + target behavior) produced more reliable results than requests focused only on implementation details.
- The strongest process pattern was pairing deterministic checks with previewable artifacts. When both were present, feedback cycles were faster and less ambiguous, especially on mobile.
- PR workflow reliability was a meaningful throughput factor. When PR update/create behavior was inconsistent, context-switching overhead increased, which slowed overall delivery despite good coding velocity.
- A practical refinement is to standardize a “delivery contract” for each request: objective, constraints, deterministic validations, screenshot requirements, and branch/PR expectations. This reduces interpretation gaps and improves repeatability across tools.
