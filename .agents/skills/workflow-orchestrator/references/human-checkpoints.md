# Human Checkpoints & Human Decision Gate

This reference defines the two Human-in-the-Loop mechanisms of `@workflow-orchestrator`: proactive checkpoints (`require_review_after`) and the reactive Human Decision Gate (`needs_human_review`).

---

## 1. Proactive Checkpoints (`require_review_after`)

Configured per feature in `feature_list.json` or requested ad-hoc in the prompt:

- `null` / omitted: fully autonomous.
- `"planner"`: pause after `spec.md` is written.
- `"implementer"`: pause after `status: passing`, before validation.
- `"validator"`: pause after `accept`, before documentation and consolidation.
- Array (e.g. `["planner", "validator"]`): pause at several stages for critical features.
- Unrecognized values are treated permissively as `null`.

**Recommended pattern**: `"require_review_after": "planner"` to approve `spec.md`, let the core loop run autonomously, then review the resulting GitHub Pull Request (see [PR Review Loop](pr-review-loop.md)).

When a checkpointed stage completes, pause, show the stage summary with clickable artifact links, and offer:

1. **`[Approve & Proceed]`** — continue to the next stage.
2. **`[Human Guidance / Hint]`** — re-run the stage or pass guidance to the next one.
3. **`[Manual Worktree Edits]`** — the developer edits/tests in the active worktree, then signals resume.
4. **`[Abort / Defer]`** — suspend the feature, preserving worktree state.

---

## 2. Reactive Human Decision Gate (`needs_human_review`)

The Implementer ⇄ Validator repair loop is bounded by `MAX_REPAIR_ATTEMPTS = 2`. If still unresolved, stop autonomous looping, preserve `.worktrees/impl-<feature-id>`, set status to `needs_human_review`, and offer:

1. **Override** — commit manual edits and proceed to the Documenter.
2. **Human Hint** — reset `repair_attempts = 1` and re-run the Implementer with the hint.
3. **Re-plan** — discard the implementer worktree and return to Stage 1 (`workflow-planner`).
4. **Cancel** — discard the implementer worktree and keep `needs_human_review`.

See [Worktree Lifecycle](worktree-lifecycle.md), Step C, for the exact commands of each pathway.
