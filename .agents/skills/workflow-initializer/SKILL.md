---
name: workflow-initializer
description: Initializes a new or existing Android project with the unified Android AI Workflow Foundation multi-agent setup. Configures AGENTS.md, workflow.json, AI context exclusions, safety hooks, and provider-specific subagent definitions (implementer, validator, documenter) with git worktree isolation.
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

1. **List Active Core Skills**: Read `.agents/skills/README.md` to present a summary of the active Core Workflow Engine (`workflow-initializer`, `build-brief`, `harness-starter`, `workflow-orchestrator`, `workflow-feature`, `workflow-implementer`, `workflow-validator`, `workflow-documenter`, `compiler`, `git-governance`, `foundation-evolve`, `hook-creator`, `skill-creator`) and Shared Engineering Guardrails. If `.agents/skills/README.md` is missing, fetch it from `https://raw.githubusercontent.com/albertmartorell1975/android-ai-workflow-foundation/develop/.agents/skills/README.md`.
2. **Persist Workflow Configuration**: Write `.agents/workflow.json` with:
   ```json
   {
     "activeWorkflow": "foundation"
   }
   ```

### PHASE 2: Stack Discovery & Optional Plugins
Ask the user about their technical stack and offer optional catalog plugins:

1. **Stack Diagnosis**:
   - **Project Name**: What is the name of this project?
   - **AI Provider**: Which AI assistant / IDE provider do you use? (`Gemini` [Default] / `Cursor` / `Claude Code`)
   - **UI Architecture**: `MVI`, `MVVM` (Recommended), or other?
   - **Module Topology**: `Layer-Based` (`:domain`, `:usecases`, `:data`, `:app` — Default for PoCs/lean apps) or `Feature-First` (`:<feature>:domain`, `:<feature>:usecases`, `:<feature>:data`, `:<feature>:presentation` + `:core:*` + `:app` — Recommended for scalable multi-feature apps)?
   - **Dependency Injection**: `Hilt` (Recommended), `Koin`, or none?
   - **Persistence**: `Room` (Recommended), `SQLDelight`, or none?

2. **Optional Catalog Plugins Selection**:
   Read the **Optional Catalog Skills** section from `.agents/skills/README.md`. Present these categorized optional plugins (e.g., `hilt`, `room-schema-governance`, `firebase-*`, `camerax`, `wear-compose-m3`, `perfetto-trace-analysis`, `to-plan`, `using-chrisbanes-skills`) and ask which ones the user wishes to install.

3. **Optional Plugin Installation**: For each selected plugin, copy or fetch its `SKILL.md` from `.agents/catalog/[plugin-name]/SKILL.md` (`https://raw.githubusercontent.com/albertmartorell1975/android-ai-workflow-foundation/develop/.agents/catalog/[plugin-name]/SKILL.md`) and write it to `.agents/skills/[plugin-name]/SKILL.md`.

### PHASE 3: Project Customization & Subagent Setup
1. **Materialize `AGENTS.md`**: Create `AGENTS.md` in the project root by reading `.agents/skills/workflow-initializer/references/AGENTS_TEMPLATE.md` and replacing:
   - `[PROJECT_NAME]` -> User's Project Name.
   - `[AI_PROVIDER]` -> Gemini, Cursor, or Claude Code.
   - `[ARCHITECTURE]` -> MVVM or MVI.
   - `[MODULE_TOPOLOGY]` -> `Layer-Based (:domain, :usecases, :data, :app)` or `Feature-First (:<feature>:domain, :<feature>:usecases, :<feature>:data, :<feature>:presentation + :core:* + :app)`.
   - `[DI_TOOL]` -> Hilt, Koin, or None.
   - `[PERSISTENCE]` -> Room, SQLDelight, or None.
2. **Materialize Subagents & `.worktrees/` Ignore Rule**:
   - Read `.agents/skills/workflow-initializer/references/SUBAGENTS_TEMPLATE.md`.
   - Ensure `.worktrees/` is added to the project's `.gitignore`.
   - When materializing `workflow-implementer` (for **Claude Code** in `.claude/agents/workflow-implementer.md` or **Cursor** in `.cursor/agents/workflow-implementer.md`), check if `hilt`, `room-schema-governance`, or any `firebase-*` skills (`firebase-local-env-setup`, `firebase-auth-basics`, `firebase-remote-config`, `firebase-ai-logic`) are installed in `.agents/skills/` and uncomment/append them to the `skills:` list.
   - Materialize `workflow-validator` (with its lightweight audit skill set) and `workflow-documenter` (`model: inherit`, `isolation: worktree`).
   - If the selected AI Provider is **Gemini / Antigravity**, confirm that subagents are natively invoked via `invoke_subagent` (`Model: "inherit"`) using `.agents/skills/workflow-*/SKILL.md`.
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
- [ ] Write `.agents/workflow.json` (`"activeWorkflow": "foundation"`).
- [ ] Perform **Stack Diagnosis** with the user (Name, AI Provider, Arch, DI, DB).
- [ ] Present and install selected **Optional Catalog Plugins**.
- [ ] Materialize `AGENTS.md` from `references/AGENTS_TEMPLATE.md` with dynamic replacements.
- [ ] Add `.worktrees/` to `.gitignore` and materialize provider-specific subagents from `references/SUBAGENTS_TEMPLATE.md`.
- [ ] Delegate AI context exclusion creation to `ai-context-exclusion`.
- [ ] Delegate safety hooks creation to `agent-safety-hooks`.
- [ ] Verify Git baseline (`main` / `develop`) per `git-governance`.
