# Feature Slicing & Harness Quality Check

Reference for `@harness-starter` when deriving `feature_list.json` and validating the generated harness.

---

## 1. Feature Slicing

`feature_list.json` must contain **session-sized slices**: user-visible or system-verifiable behavior that one focused pipeline run (`workflow-planner -> workflow-implementer -> workflow-validator -> workflow-documenter`) can complete and verify. No epics, no low-level chores.

Split a feature when:
- Its title joins multiple domains with "and" / "/" / commas.
- Verification needs multiple independent screens, endpoints, jobs, or integrations.
- It cannot be verified with one small scenario plus the standard repo gate.

Sizing guidance:
- Full MVP from `@build-brief`: roughly 10–30 features, not 4–5 broad epics.
- Existing project with a lightweight harness: only the requested slices.

State rules:
- At most one feature `in_progress` initially (prefer all `not_started` unless work is already active).
- `depends_on` expresses execution prerequisites. `@workflow-orchestrator` only schedules a feature when every dependency is `accepted`, has no pending PR review feedback, and is merged into `develop`.

---

## 2. Missing Technical Commands

If the Android app is not bootstrapped yet, record in `PROGRESS.md` that product bootstrap is pending, list the expected `@compiler` gate (`./gradlew testDebugUnitTest lintDebug --parallel --build-cache --configuration-cache`), and make bootstrap the first feature in `feature_list.json`.

---

## 3. Quality Check (Before Finishing)

- [ ] `AGENTS.md` answers: what the project is, how to start, how to verify, and how the multi-agent pipeline works — provider-agnostic and **≤ 120 lines / 6 KB (6,144 bytes)**.
- [ ] `feature_list.json` is valid JSON.
- [ ] Every feature has `id`, `area`, `title`, `user_visible_behavior`, `depends_on`, `status`, optional `require_review_after`, `verification`, `evidence`, `notes`.
- [ ] Every `depends_on` entry references an existing `id`, is not self-referencing, and creates no cycle.
- [ ] `PROGRESS.md` names the standard startup and verification paths.
- [ ] `.github/workflows/gate.yml` exists (or an existing CI workflow was preserved).
- [ ] `docs/features/<feature-id>/{ui/screens,ui/resources,validator}/` exist for every feature.
