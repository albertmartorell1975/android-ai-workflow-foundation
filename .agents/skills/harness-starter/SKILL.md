---
name: harness-starter
description: Create or update the minimal startup harness for an Android repository after product discovery or on an existing project before feature implementation. Use when the user asks to use harness-starter, prepare the initial repo harness, create AGENTS/progress/feature list, CI gate, or move from discovery docs to a coding-agent-ready repository. The skill reads existing discovery docs (or inspects an existing Android repository), derives AGENTS.md, PROGRESS.md, CONSTRAINTS.md, feature_list.json, and .github/workflows/gate.yml, and sets up the unified docs/features/<feature-id>/ directories.
---

# Origin

Originally created by Antonio Leiva / Nino Ruano for the AI Expert course.
Integrated and adapted for Android AI Workflow Foundation with permission.

# Harness Starter

Create or update the smallest useful repository harness so any orchestrator or subagent can answer: what is this project, how do I start and verify it, what is the next ready feature, and what constraints apply.

## Hard Rules

- Do not implement product code, initialize frameworks, install dependencies, or modify application source.
- Do not reopen product discovery unless asked, or unless there are neither discovery docs nor a codebase to inspect.
- Only create/update these artifacts:
  - `AGENTS.md`, `PROGRESS.md`, `CONSTRAINTS.md` (if durable rules exist), `feature_list.json`
  - `.github/workflows/gate.yml`
  - `docs/features/<feature-id>/{ui/screens,ui/resources,validator}/` (never recreate existing folders)
- Read existing files first and update conservatively; never overwrite useful human-authored content.
- Preserve the repository's document language and style (infer from discovery docs; ask only without evidence).

## `AGENTS.md` Discipline

- If `workflow-initializer` already materialized `AGENTS.md`, enrich the project summary and Read First references without overwriting Foundation governance rules.
- Keep it a short, provider-agnostic routing map: target < 100 lines, **hard cap 120 lines / 6 KB**. Move detail into `CONSTRAINTS.md`, `ARCHITECTURE.md`, or skills.

## Inputs To Read First

1. Discovery docs when present: `CONTEXT.md`, `docs/build-brief.md` (or `docs/product-brief.md`), `docs/domain-model.md`, `docs/risks-and-open-questions.md`, `DESIGN.md`; optional `docs/user-and-access-model.md`, `docs/technical-discovery.md`, `docs/mvp-scope.md`, `docs/adr/*.md`.
2. Existing repository structure: `settings.gradle.kts`, `gradle/libs.versions.toml`, modules, `AGENTS.md`.

If neither exists, ask whether to run `@build-brief` first or accept a brief list of target features.

## Workflow

1. **Inspect** which target files exist and preserve their intent.
2. **Derive** each artifact from **[Artifact Templates](references/artifact-templates.md)**:
   - `AGENTS.md` — landing page and workflow routing.
   - `.github/workflows/gate.yml` — headless CI gate (`testDebugUnitTest` + `lintDebug`) on PRs to `develop`/`main`; JDK 17 by default, 21 for `jvmToolchain(21)` or SDK 36+. Created **once**; an existing CI workflow is preserved untouched.
   - `PROGRESS.md`, `CONSTRAINTS.md`, `feature_list.json` (with optional `require_review_after`).
   - Feature folders for every feature id.
3. **Slice** features into session-sized units and wire `depends_on` per **[Feature Slicing & Quality Check](references/feature-slicing.md)**.
4. **Verify** with the quality checklist in the same reference before finishing.

## Teaching Note

Emphasize the progression:

`Build Brief -> Harness Starter (feature_list.json + PROGRESS.md) -> Workflow Orchestrator (Planner -> Implementer -> Validator -> Documenter)`
