# Instructions for Agents - Android AI Workflow Foundation

This document defines the operating rules, repository structure, maintenance protocols, and Definition of Done for AI coding agents developing and maintaining the **Android AI Workflow Foundation** framework repository itself.

## Project Overview

The **Android AI Workflow Foundation** is a unified, provider-agnostic multi-agent workflow framework for Android development. This repository hosts the core multi-agent workflow engine (`workflow-initializer`, `build-brief`, `harness-starter`, `workflow-orchestrator`, `workflow-planner`, `workflow-implementer`, `workflow-validator`, `workflow-documenter`, `compiler`, `git-governance`, `foundation-evolve`), shared technical guardrails, optional catalog skills (`hook-creator`, `skill-creator`, `camerax`, `wear-compose-m3`, etc.), and framework documentation.

## Read First

Before modifying skills, catalog plugins, templates, or documentation, consult:

* `README.md` — Framework architecture, installation, visual role badges, human-in-the-loop philosophy, execution modes, and multi-provider adaptation.
* `docs/overview.md` — Complete architectural design, modular layers, execution modes, and the 5-role `git worktree` pipeline.
* `.agents/skills/README.md` — Canonical index of Active Foundation Skills and Optional Catalog Skills.

## Repository Structure & Modules

- `.agents/skills/` — Active Foundation Skills (installed by default in consuming projects).
- `.agents/catalog/` — Optional Catalog Skills (technology, profiling, and authoring plugins available on demand).
- `docs/` — Framework design, architecture overview, and pipeline documentation.
- `package.json` — NPM package manifest and registry mapping for core skills (`agent-skills.skills`).

## Startup Workflow & Branching

1. **Working Branch**: Always confirm active branch using `git branch --show-current`. Development MUST take place on `develop` or a `feature/*` branch.
2. **Context Inspection**: Read `README.md` and `.agents/skills/README.md` to verify skill categories before creating or moving skills.
3. **Repository Check**: Verify `git status` to ensure a clean working tree before starting changes.

## Working Rules & Skill Maintenance Protocols

* **Git Policy**: Never execute `git push` or `git merge` without explicit user authorization. Follow Conventional Commits (`feat(skills): ...`, `docs(governance): ...`, `fix(compiler): ...`).
* **File Modification Guardrail**: ALWAYS use the native file-editing tools of the active AI provider for code/markdown modifications—NEVER use shell commands like `sed`, `awk`, or `cat >` to edit files (prevents IDE desync and data loss):
  - **Antigravity / Gemini**: `edit_file` and `write_file`.
  - **Claude Code**: `Edit` and `Write`.
  - **Cursor**: `edit_file` (or `replace_file_content`).
* **Language & Comments**: All documentation, KDoc comments, commit messages, and skill instructions **MUST be written in English**.
* **Skill Isolation (The Single Responsibility Principle for Agents)**: Each skill must be self-contained. A skill governing the UI layer (e.g., ViewModels) must not contain rules for the Data layer (e.g., Repositories). If a concept is dense, use the `references/` subfolder (extracted via `.md` files) to keep the main `SKILL.md` orchestrational and lightweight.
* **Template Integrity**: When modifying `SKILL.md` files that generate templates (like `workflow-initializer`), ensure that nested markdown is properly escaped and bounded by valid code blocks (e.g., ` ```markdown `). Do not break the runtime execution flow of the initializer.
* **Skill Modification Protocol**: Whenever adding, modifying, or deleting a skill:
  1. Update the skill's `SKILL.md` (and optional `references/` or `agents/openai.yaml` subfolders).
  2. Update the Foundation's Skills Index at `.agents/skills/README.md`.
  3. If it is a **Core Skill** (installed by default), register it in `package.json` under `agent-skills.skills`.
  4. If it affects project templates or subagent instructions (`workflow-planner`, `workflow-implementer`, `workflow-validator`, `workflow-documenter`), synchronize `workflow-initializer/SKILL.md` and its provider-specific templates under `.agents/skills/workflow-initializer/references/` (`AGENTS_TEMPLATE.md`, `SUBAGENTS_TEMPLATE.md`, `SUBAGENT_SKILLS.json`, and `subagents/{claude,cursor,gemini}.md`).
* **KISS & Truthfulness**: Prefer simple, modular solutions. Never invent non-existent APIs or unverified framework rules.

## Definition of Done (DoD)

A maintenance or feature task on the Foundation repository is complete only when:

1. Target skill, manifest, or documentation changes are implemented following Foundation standards.
2. All JSON/YAML files (`package.json`, `*.yaml`, `*.json`) pass syntax validation.
3. `.agents/skills/README.md` and `workflow-initializer` templates (`references/`) are synchronized if skills or subagents were modified.
4. All file references and Markdown links across `docs/` and `README.md` are valid and resolvable.
5. No unintended changes remain, and the working tree is ready for user review via `@git-governance`.

## End of Session Protocol

Before concluding a session on the Foundation repository:

1. Verify the repository working tree with `git status`.
2. Ensure no stray or temporary files remain untracked.
3. Record unresolved questions or open tasks in the session handoff summary.
