# Feature Slicing & Harness Quality Check

Reference for `@harness-starter` when deriving `feature_list.json` and validating the generated harness.

---

## 1. Feature Slicing (Atomic, Human-Reviewable PR Units)

`feature_list.json` must contain **atomic, human-reviewable slices**: each entry maps `1:1` to a single focused Pull Request that `workflow-planner -> workflow-implementer -> workflow-validator -> workflow-documenter` can verify **and** a human engineer can review without cognitive overload. Do not set rigid file or line-count caps; instead, enforce semantic atomicity (no epics, no cross-cutting mega-slices, no low-level chores).

Split a feature into ordered sub-slices chained via `depends_on` when:
- Its title or behavior joins multiple domains, screens, or user flows with "and" / "/" / commas (e.g., split `auth-splash-login` into `auth-splash` and `auth-login`; split list + unrelated modal flows when each has distinct state/logic).
- It mixes **foundational contract/infrastructure changes** (e.g., error hierarchy, database migration, theme tokens, navigation shell) with **broad multi-screen consumer adoption** — slice the contract/foundation first, then slice consumer adoption downstream.
- It updates an entire catalog of UI/Design System components at once — group into cohesive component families (e.g., actions & typography vs. inputs & feedback vs. navigation & cards) rather than one monolithic alignment PR.
- Verification requires multiple independent screens, endpoints, jobs, or integrations that could be verified and reviewed separately.

Scope assessment exclusions & anti-piggybacking:
- **Exclude non-code & harness artifacts from scope breadth**: graphic icons/assets (`*.webp`, `*.png`, vector XML), Roborazzi golden snapshots (`**/snapshots/*.png`), Room schema exports (`**/schemas/*.json`), and harness files (`docs/features/**`, `PROGRESS.md`, `feature_list.json`) do not make a slice "too broad" on their own.
- **Zero Piggybacking**: never attach follow-up cleanups from earlier PRs onto a functional feature's `notes`. Resolve review items inside their own PR's `review-fix` loop or register a dedicated small `refactor`/`chore` slice.

Sizing guidance:
- Full MVP from `@build-brief`: roughly 12–35 atomic slices, never 4–5 broad epics.
- Existing project with a lightweight harness: only the requested slices, decomposed cleanly where needed.

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
