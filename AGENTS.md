# Instructions for Agents - Android AI Workflow Foundation

This document defines the operating rules, repository structure, maintenance protocols, and Definition of Done for AI coding agents developing and maintaining the **Android AI Workflow Foundation** framework repository itself.

## Project Overview

The **Android AI Workflow Foundation** is a modular multi-workflow framework for Android development. This repository hosts the core workflow engine (`workflow-initializer`, `compiler`, `git-governance`, `foundation-evolve`), shared technical guardrails, optional catalog skills, and framework documentation.

## Read First

Before modifying skills, catalog plugins, templates, or documentation, consult:

* `README.md` — Framework architecture, installation, workflow models, and skill management.
* `docs/overview.md` — Architectural design, modular layers, and workflow routing model.
* `docs/workflow comparison.md` — Detailed comparison between Foundation Workflow and AI Expert Workflow.
* `.agents/skills/README.md` — Canonical index of Active Foundation Skills and Optional Catalog Skills.
* `.agents/workflow.json` — Current workflow configuration for repository maintenance.

## Repository Structure & Modules

- `.agents/skills/` — Active Foundation Skills (installed by default in consuming projects).
- `.agents/catalog/` — Optional Catalog Skills and Workflow Plugins (available on demand).
- `.agents/catalog/workflows/` — JSON manifests for complex workflow plugins (e.g. `ai-expert-workflow.json`).
- `docs/` — Framework design, architecture overview, and methodology comparison documentation.
- `package.json` — NPM package manifest and registry mapping for core skills (`agent-skills.skills`).

## Startup Workflow & Branching

1. **Working Branch**: Always confirm active branch using `git branch --show-current`. Development MUST take place on `develop` or a `feature/*` branch.
2. **Context Inspection**: Read `README.md` and `.agents/skills/README.md` to verify skill categories before creating or moving skills.
3. **Repository Check**: Verify `git status` to ensure a clean working tree before starting changes.

## Working Rules & Skill Maintenance Protocols

* **Git Policy**: Never execute `git push` or `git merge` without explicit user authorization. Follow Conventional Commits (`feat(skills): ...`, `docs(governance): ...`, `fix(compiler): ...`).
* **File Modification Guardrail**: ALWAYS use native IDE tools (`replace_file_content` or `write_file`) for code/markdown modifications. NEVER use shell commands like `sed`, `awk`, or `cat >` to edit files to prevent IDE desync and data loss.
* **Language & Comments**: All documentation, KDoc comments, commit messages, and skill instructions **MUST be written in English**.
* **Skill Isolation (The Single Responsibility Principle for Agents)**: Each skill must be self-contained. A skill governing the UI layer (e.g., ViewModels) must not contain rules for the Data layer (e.g., Repositories). If a concept is dense, use the `references/` subfolder (Optionally extracted via `.md` files) to keep the main `SKILL.md` orchestrational and lightweight.
* **Template Integrity**: When modifying `SKILL.md` files that generate templates (like `workflow-initializer`), ensure that nested markdown is properly escaped and bounded by valid code blocks (e.g., ` ```markdown `). Do not break the runtime execution flow of the initializer.
* **Skill Modification Protocol**: Whenever adding, modifying, or deleting a skill:
  1. Update the skill's `SKILL.md` (and optional `references/` or `agents/openai.yaml` subfolders).
  2. Update the Foundation's Skills Index at `.agents/skills/README.md`.
  3. If it is a **Core Skill** (installed by default), register it in `package.json` under `agent-skills.skills`.
  4. If it affects project templates, synchronize the template section inside `workflow-initializer/SKILL.md`.
* **KISS & Truthfulness**: Prefer simple, modular solutions. Never invent non-existent APIs or unverified framework rules.

## Definition of Done (DoD)

A maintenance or feature task on the Foundation repository is complete only when:

1. Target skill, manifest, or documentation changes are implemented following Foundation standards.
2. All JSON/YAML files (`package.json`, `workflow.json`, `*.yaml`, `*.json`) pass syntax validation.
3. `.agents/skills/README.md` and `workflow-initializer/SKILL.md` templates are synchronized if skills were modified.
4. All file references and Markdown links across `docs/` and `README.md` are valid and resolvable.
5. No unintended changes remain, and the working tree is ready for user review via `@git-governance`.

## End of Session Protocol

Before concluding a session on the Foundation repository:

1. Verify the repository working tree with `git status`.
2. Ensure no stray or temporary files remain untracked.
3. Record unresolved questions or open tasks in the session handoff summary.