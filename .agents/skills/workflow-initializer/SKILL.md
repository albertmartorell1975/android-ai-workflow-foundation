---
name: workflow-initializer
description: Initializes a new or existing Android project with the unified Android AI Workflow Foundation multi-agent setup. Configures AGENTS.md, AI context exclusions, safety hooks, and provider-specific subagent definitions (implementer, validator, documenter) with git worktree isolation.
metadata:
  author: Albert Martorell Garcia
  version: 2.0.0
  keywords:
    - setup
    - initialization
    - multi-agent
    - git-worktree
    - project-kickoff
---

# Workflow Initializer Specialist (`workflow-initializer`)

This skill provides a structured process for setting up the **Unified Android AI Workflow Foundation** in a new or existing Android project. It configures the core workflow engine, technical guardrails, safety hooks, and multi-agent worktree definitions.

## Proactive Behavior
If you are loaded in a project where `AGENTS.md` is missing, you MUST immediately notify the user and offer to perform **PHASE 1: Mandatory Foundation Deployment**.

## Initialization Process

### PHASE 1: Mandatory Foundation Deployment
When this skill is activated, acknowledge the core foundation installed under `.agents/skills/`:

1. **List Active Core Skills**: Read `.agents/skills/README.md` to present a summary of the active Core Workflow Engine (`workflow-initializer`, `build-brief`, `harness-starter`, `workflow-orchestrator`, `workflow-planner`, `workflow-implementer`, `workflow-validator`, `workflow-documenter`, `compiler`, `git-governance`, `foundation-evolve`, `hook-creator`, `skill-creator`) and Shared Engineering Guardrails (Architecture, Compose, Kotlin, Testing, Hilt, Room, Firebase). If `.agents/skills/README.md` is missing, fetch it from `https://raw.githubusercontent.com/albertmartorell1975/android-ai-workflow-foundation/develop/.agents/skills/README.md`.

### PHASE 2: Stack Auto-Detection & Optional Plugins
The Foundation uses opinionated, industry-standard engineering defaults (**MVVM with Hybrid UI State**, **Hilt** for DI, **Room** for local database, and **Firebase** suite). Avoid interrogating the user with unnecessary questionnaires.

1. **Project Auto-Inspection**:
   - **Project Name**: Read `rootProject.name` from `settings.gradle.kts` (or fallback to root directory name).
   - **Module Topology**: Inspect existing modules:
     * If `:domain`, `:usecases`, `:data`, or `:app` exist -> **`Layer-Based`** (`:domain`, `:usecases`, `:data`, `:app`).
     * If feature submodules exist (e.g. `:<feature>:presentation`) -> **`Feature-First`** (`:<feature>:*` + `:core:*` + `:app`).
     * If bootstrapping a brand-new project without modules yet -> Default to **`Layer-Based`** (or suggest `Feature-First` if the user is planning a large multi-feature enterprise app).
   - **AI Provider Confirmation**: Confirm the active AI assistant / IDE provider (`Gemini / Antigravity` [Default] / `Cursor` / `Claude Code`) to ensure provider files land in the correct location (`.agents/agents/`, `.cursor/agents/`, or `.claude/agents/`).

2. **Optional Catalog Plugins Selection**:
   Read the **Optional Catalog Skills** section from `.agents/skills/README.md`. Present these categorized optional plugins (e.g., `camerax`, `wear-compose-m3`, `perfetto-trace-analysis`, `to-plan`, `using-chrisbanes-skills`, `compose-animations`, `compose-stability-diagnostics`, `compose-recomposition-performance`, `compose-focus-navigation`, `kotlin-control-flow`, `kotlin-functions`) and ask which ones the user wishes to install.

3. **Optional Plugin Installation**: For each selected plugin, copy or fetch its `SKILL.md` from `.agents/catalog/[plugin-name]/SKILL.md` (`https://raw.githubusercontent.com/albertmartorell1975/android-ai-workflow-foundation/develop/.agents/catalog/[plugin-name]/SKILL.md`) and write it to `.agents/skills/[plugin-name]/SKILL.md`.

### PHASE 3: Project Customization & Subagent Setup
1. **Materialize `AGENTS.md`**: Create `AGENTS.md` in the project root by reading `.agents/skills/workflow-initializer/references/AGENTS_TEMPLATE.md` and replacing:
   - `[PROJECT_NAME]` -> Detected or confirmed Project Name.
   - `[AI_PROVIDER]` -> Gemini, Cursor, or Claude Code.
   - `[MODULE_TOPOLOGY]` -> `Layer-Based (:domain, :usecases, :data, :app)` or `Feature-First (:<feature>:domain, :<feature>:usecases, :<feature>:data, :<feature>:presentation + :core:* + :app)`.
2. **Materialize Subagents & `.worktrees/` Ignore Rule**:
   - Ensure `.worktrees/` is added to the project's `.gitignore`.
   - Read the Single Source of Truth for skills from `.agents/skills/workflow-initializer/references/SUBAGENT_SKILLS.json`.
   - Read `.agents/skills/workflow-initializer/references/SUBAGENTS_TEMPLATE.md`.
   - Determine the active skills for `workflow-implementer`:
     * Start with the base list from `SUBAGENT_SKILLS.json` for `workflow-implementer`.
     * If any optional catalog plugins were installed into `.agents/skills/` during Phase 2, append their names to the implementer skills list.
   - Substitute the placeholders (`[INJECT_PLANNER_SKILLS]`, `[INJECT_IMPLEMENTER_SKILLS]`, `[INJECT_VALIDATOR_SKILLS]`, `[INJECT_DOCUMENTER_SKILLS]`) in the template with the lists, formatted correctly for the chosen provider:
     * For **Antigravity**, format as: `  - skills/<skill-name>`
     * For **Claude Code**, format as: `  - <skill-name>`
     * For **Cursor**, format as: `- <skill-name>`
   - Materialize the four subagent files (`workflow-planner`, `workflow-implementer`, `workflow-validator`, `workflow-documenter`) into the correct provider directory (`.agents/agents/`, `.claude/agents/`, or `.cursor/agents/`).
3. **AI Context Exclusion & Safety Hooks Setup**:
   - Delegate context exclusion creation to the `ai-context-exclusion` skill, passing the selected AI Provider (defaulting to `Gemini` if omitted) to materialize `.aiexclude`, `.cursorignore`, or `.claude/settings.json`.
   - Delegate safety hooks setup to the `agent-safety-hooks` skill, passing the selected AI Provider to materialize the hook configuration and script into the provider's official location (`.claude/settings.json` + `.claude/hooks/block-rm-rf.js`, `.agents/hooks.json` + `.agents/hooks/block-rm-rf.js`, or `.cursor/hooks.json` + `.cursor/hooks/block-rm-rf.js`).
4. **Git Baseline & Next Step Guidance**:
   - If not already initialized, run `git init` and establish the `main` and `develop` branches according to `git-governance`.
   - Guide the user on the two entry modes available next:
     * **New Product / Full Backlog Mode**: Run `@build-brief` -> `@harness-starter` -> `@workflow-orchestrator`.
     * **Existing Project / Standalone Feature Mode**: Run `@harness-starter` (for an initial backlog) or invoke `@workflow-orchestrator` directly with a feature request.

## Actionable Checklist for Project Setup
- [ ] Acknowledge mandatory foundation deployment and list active skills from `.agents/skills/README.md`.
- [ ] Auto-detect Project Name and Module Topology from repository files.
- [ ] Confirm active AI Provider (`Gemini`, `Cursor`, `Claude Code`).
- [ ] Present and install selected **Optional Catalog Plugins** (if requested).
- [ ] Materialize `AGENTS.md` from `references/AGENTS_TEMPLATE.md` with dynamic replacements.
- [ ] Add `.worktrees/` to `.gitignore` and materialize provider-specific subagents from `references/SUBAGENTS_TEMPLATE.md` using `SUBAGENT_SKILLS.json` + installed catalog plugins.
- [ ] Delegate AI context exclusion creation to `ai-context-exclusion`.
- [ ] Delegate safety hooks creation to `agent-safety-hooks`.
- [ ] Verify Git baseline (`main` / `develop`) per `git-governance`.
