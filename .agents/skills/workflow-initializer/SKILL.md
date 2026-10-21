---
name: workflow-initializer
description: Initializes a new or existing Android project with the unified Android AI Workflow Foundation multi-agent setup. Configures AGENTS.md, AI context exclusions, safety hooks, and provider-specific subagent definitions (implementer, validator, documenter) with git worktree isolation.
metadata:
  author: Albert Martorell Garcia
  version: 2.1.0
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

### PHASE 2: Stack Auto-Detection & Interactive Selection
The Foundation uses opinionated, industry-standard engineering defaults (**MVVM with Hybrid UI State**, **Hilt** for DI, **Room** for local database, and **Firebase** suite). Do not quiz the user about tech stack defaults, but **NEVER guess, assume, or bypass asking the user for the target AI Provider or optional catalog plugins**.

1. **Project Auto-Inspection**:
   - **Project Name**: Read `rootProject.name` from `settings.gradle.kts` (or fallback to root directory name).
   - **Module Topology**: Inspect existing modules:
     * If `:domain`, `:usecases`, `:data`, or `:app` exist -> **`Layer-Based`** (`:domain`, `:usecases`, `:data`, `:app`).
     * If feature submodules exist (e.g. `:<feature>:presentation`) -> **`Feature-First`** (`:<feature>:*` + `:core:*` + `:app`).
     * If bootstrapping a brand-new project without modules yet -> Default to **`Layer-Based`** (or suggest `Feature-First` if the user is planning a large multi-feature enterprise app).
   - **Tooling Inspection (GitHub CLI)**:
     * Run `gh --version` (and `gh auth status` if found).
     * If `gh` is installed and authenticated -> Report ready for automated PR creation in `publish` mode.
     * If `gh` is missing or unauthenticated -> Report that `gh` is required for automated PR generation, and include Question 3 in the prompt below.

2. **MANDATORY User Prompt (Target AI Provider & Catalog Plugins)**:
   > [!CAUTION]
   > **CRITICAL EXECUTION RULE — HARD STOPPING GATE**
   > After auto-inspecting the repository and listing the active skills, **YOU MUST IMMEDIATELY STOP CALLING TOOLS AND END YOUR TURN**.
   > **DO NOT** execute Phase 3 in the same turn.
   > **DO NOT** create `AGENTS.md`.
   > **DO NOT** create or write subagents (`workflow-planner.md`, `workflow-implementer.md`, etc.).
   > **DO NOT** configure context exclusions or safety hooks.
   > You MUST first send the message with Question 1 (AI Provider) and Question 2 (Optional Catalog Plugins) and **WAIT** for the user's explicit response. Any execution that creates Phase 3 files without explicit user response to these two questions is a critical failure.
   > Even if you detect that you are executing inside Android Studio, Gemini, Antigravity, Cursor, or Claude Code, **NEVER silently assume or auto-select the provider based on the current execution environment**. The AI assistant running the initialization session might not be the primary AI provider the developer plans to use for ongoing project development.

   Present the auto-detected project findings and ask the user:
   - **Question 1: Target AI Provider (MANDATORY)**: Ask the user to explicitly select their target AI environment:
     1. `Gemini / Antigravity` (generates `.agents/agents/`, `.aiexclude`, `.agents/hooks.json`)
     2. `Cursor` (generates `.cursor/agents/`, `.cursorignore`, `.cursor/hooks.json`)
     3. `Claude Code` (generates `.claude/agents/`, `.claude/settings.json`)
   - **Question 2: Optional Catalog Plugins (MANDATORY)**:
     Present the categorized optional plugins and ask the user to select which ones to install:
     * **Architecture & Planning**: `to-plan`, `using-chrisbanes-skills`
     * **Hardware & System**: `camerax`, `wear-compose-m3`, `verified-email`, `agp-9-upgrade`, `play-billing-library-version-upgrade`, `play-policy-insights`
     * **Compose & UI**: `compose-animations`, `compose-stability-diagnostics`, `compose-recomposition-performance`, `compose-focus-navigation`, `compose-slot-api-pattern`, `compose-state-deferred-reads`
     * **Kotlin & Profiling**: `kotlin-control-flow`, `kotlin-functions`, `kotlin-multiplatform-expect-actual`, `kotlin-types-value-class`, `perfetto-trace-analysis`, `perfetto-sql`, `r8-analyzer`, `migrate-xml-views-to-jetpack-compose`, `hook-creator`, `skill-creator`
     Ask: *"Which optional plugins would you like to install? (List their names separated by commas, or reply 'None')*
   - **Question 3: GitHub CLI Installation (Conditional)**:
     If `gh` was not detected during auto-inspection, ask:
     *"GitHub CLI (`gh`) is not installed. Would you like me to install it now via your system package manager (`winget` / `brew` / `apt`) to enable zero-touch Pull Request delivery in publish mode? (Yes / No)"*

   *End your turn here. Wait for the user's explicit response before proceeding to PHASE 3.*

3. **Optional Plugin Installation**: For each selected plugin, copy or fetch its `SKILL.md` from `.agents/catalog/[plugin-name]/SKILL.md` (`https://raw.githubusercontent.com/albertmartorell1975/android-ai-workflow-foundation/develop/.agents/catalog/[plugin-name]/SKILL.md`) and write it to `.agents/skills/[plugin-name]/SKILL.md`. If the user answered "None", skip this step.
4. **GitHub CLI Setup (If Requested)**: If the user answered "Yes" to Question 3, execute the platform-appropriate command (`winget install --id GitHub.cli` on Windows, `brew install gh` on macOS, `sudo apt install gh` on Linux). Once installed, instruct the user to run `gh auth login` in a new terminal to complete the one-time authentication.

### PHASE 3: Project Customization & Subagent Setup
> [!IMPORTANT]
> **PREREQUISITE**: You may ONLY execute Phase 3 after the user has responded to Question 1 (AI Provider) and Question 2 (Optional Catalog Plugins) from Phase 2.

1. **Materialize `AGENTS.md`**: Create `AGENTS.md` in the project root by reading `.agents/skills/workflow-initializer/references/AGENTS_TEMPLATE.md` and replacing:
   - `[PROJECT_NAME]` -> Detected or confirmed Project Name.
   - `[AI_PROVIDER]` -> User-selected AI Provider (`Gemini`, `Cursor`, or `Claude Code`).
   - `[MODULE_TOPOLOGY]` -> `Layer-Based (:domain, :usecases, :data, :app)` or `Feature-First (:<feature>:domain, :<feature>:usecases, :<feature>:data, :<feature>:presentation + :core:* + :app)`.
2. **Materialize Subagents & `.worktrees/` Ignore Rule**:
   - Ensure `.worktrees/` is added to the project's `.gitignore`.
   - Read the Single Source of Truth for skills from `.agents/skills/workflow-initializer/references/SUBAGENT_SKILLS.json`.
   - Read `.agents/skills/workflow-initializer/references/SUBAGENTS_TEMPLATE.md`.
   - Determine the active skills for subagents:
     * For each subagent (`workflow-planner`, `workflow-implementer`, `workflow-validator`, `workflow-documenter`), take the baseline list from `SUBAGENT_SKILLS.json`.
     * For `workflow-implementer`, append any optional catalog plugins installed into `.agents/skills/` during Phase 2.
     * Filter all subagent skill lists to only include skills that are actually physically installed under `.agents/skills/` (preventing dangling references if the developer chose to install a custom subset of skills during `npx skills add`).
   - Substitute the placeholders (`[INJECT_PLANNER_SKILLS]`, `[INJECT_IMPLEMENTER_SKILLS]`, `[INJECT_VALIDATOR_SKILLS]`, `[INJECT_DOCUMENTER_SKILLS]`) in the template with the filtered lists, formatted correctly for the chosen provider:
     * For **Antigravity**, format as: `  - skills/<skill-name>`
     * For **Claude Code**, format as: `  - <skill-name>`
     * For **Cursor**, format as: `- <skill-name>`
   - Materialize the four subagent files (`workflow-planner`, `workflow-implementer`, `workflow-validator`, `workflow-documenter`) into the correct provider directory (`.agents/agents/`, `.claude/agents/`, or `.cursor/agents/`).
3. **AI Context Exclusion & Safety Hooks Setup**:
   - Delegate context exclusion creation to the `ai-context-exclusion` skill, passing the user-selected AI Provider to materialize `.aiexclude`, `.cursorignore`, or `.claude/settings.json`.
   - Delegate safety hooks setup to the `agent-safety-hooks` skill, passing the user-selected AI Provider to materialize the hook configuration and script into the provider's official location (`.claude/settings.json` + `.claude/hooks/{block-rm-rf.js, check-agents-size.js}`, `.agents/hooks.json` + `.agents/hooks/{block-rm-rf.js, check-agents-size.js}`, or `.cursor/hooks.json` + `.cursor/hooks/{block-rm-rf.js, check-agents-size.js}`).
4. **Git Baseline & Next Step Guidance**:
   - If not already initialized, run `git init` and establish the `main` and `develop` branches according to `git-governance`.
   - Guide the user on the two entry modes available next:
     * **New Product / Full Backlog Mode**: Run `@build-brief` -> `@harness-starter` -> `@workflow-orchestrator`.
     * **Existing Project / Standalone Feature Mode**: Run `@harness-starter` (for an initial backlog) or invoke `@workflow-orchestrator` directly with a feature request.

## Actionable Checklist for Project Setup
- [ ] Acknowledge mandatory foundation deployment and list active skills from `.agents/skills/README.md`.
- [ ] Auto-detect Project Name and Module Topology from repository files.
- [ ] Inspect GitHub CLI (`gh`) status and offer proactive installation if missing.
- [ ] Stop execution turn and prompt user: confirm target AI Provider (`Gemini`, `Cursor`, `Claude Code`) and catalog plugins selection — NEVER assume.
- [ ] Install selected **Optional Catalog Plugins** (if requested by user).
- [ ] Materialize `AGENTS.md` from `references/AGENTS_TEMPLATE.md` with dynamic replacements.
- [ ] Add `.worktrees/` to `.gitignore` and materialize provider-specific subagents from `references/SUBAGENTS_TEMPLATE.md` using `SUBAGENT_SKILLS.json` + installed catalog plugins.
- [ ] Delegate AI context exclusion creation to `ai-context-exclusion` with user-selected AI Provider.
- [ ] Delegate safety hooks creation to `agent-safety-hooks` with user-selected AI Provider.
- [ ] Verify Git baseline (`main` / `develop`) per `git-governance`.
