---
name: workflow-initializer
description: Initializes a new Android project with the AI-assisted development workflow seed. It sets up the governance files and guides the initial customization of agents and skills.
metadata:
  author: Albert Martorell Garcia
  version: 1.1.0
  keywords:
  - setup
  - initialization
  - workflow-seed
  - project-kickoff
---
# Workflow Initializer Specialist

This skill provides a structured process for setting up the AI-assisted workflow in a new Android project. It ensures that the project starts with a solid architectural foundation and a clear collaboration protocol between humans and agents.

## Proactive Behavior
If you are loaded in a project where `AGENTS.md` is missing, you MUST immediately notify the user and offer to perform the **PHASE 1: Mandatory Foundation Deployment**.

## Initialization Process

### PHASE 1: Mandatory Foundation Deployment
When this skill is activated, the agent MUST first acknowledge the core foundation already installed via `npx skills`. 

1. **List Mandatory Skills**: The agent MUST display the list of core skills and shared guardrails that are now active in the project. Read `.agents/skills/README.md` to present a high-level summary of these installed skills. If the file is missing, fetch it first from `https://raw.githubusercontent.com/albertmartorell1975/android-ai-workflow-foundation/develop/.agents/skills/README.md`.

### PHASE 2: Development Workflow Selection
After foundation deployment and before Stack Diagnosis, the agent MUST determine the active development workflow.

1. **Workflow Comparison**: Present a clear comparison between available workflows:
   - **Foundation Workflow (`foundation`)**:
     - *Best for*: Lean projects and standard feature development.
     - *Orchestrator*: `workflow-feature`.
     - *Methodology*: Direct implementation through Domain -> Data -> UseCase -> UI layers.
   - **AI Expert Workflow (`ai-expert-workflow`)**:
     - *Best for*: Highly structured agentic development and complex project discovery.
     - *Orchestrator*: `feature-flow`.
     - *Methodology*: Formalized lifecycle (Build Brief -> Harness Starter -> Feature Spec -> Implementation -> Validator).

2. **Persistence**: The selected workflow MUST be persisted in `.agents/workflow.json`.
   - If the file exists, ask the user if they wish to switch.
   - If a non-foundation workflow is selected, trigger the **Workflow Plugin Installation** logic.

### PHASE 3: Stack Discovery & Optional Plugins
After determining the workflow, the agent MUST ask the user about specific technical choices and offer optional plugins from the catalog.

1. **Stack Diagnosis**:
   - **Project Name**: What is the name of this project?
   - **AI Provider**: Which AI assistant / IDE provider do you use? (Gemini [Default] / Cursor / Claude Code)
   - **Architecture**: MVI, MVVM, or other?
   - **Dependency Injection**: Hilt (Recommended), Koin, or none?
   - **Persistence**: Room (Recommended), SQLDelight, or none?

2. **Optional Plugins Selection**: 
   Read the **Optional Catalog Skills & Workflows** section from `.agents/skills/README.md`. Present these categorized optional plugins to the user and ask which ones they wish to install.

3. **General Plugin Installation**: For each selected standalone plugin, fetch its `SKILL.md` from GitHub (`https://raw.githubusercontent.com/albertmartorell1975/android-ai-workflow-foundation/develop/.agents/catalog/[plugin-name]/SKILL.md`) and write it to `.agents/skills/[plugin-name]/SKILL.md`.

### Workflow Plugin Installation
When a complex workflow plugin is selected:
1. **Fetch Manifest**: Fetch the JSON manifest from GitHub (`https://raw.githubusercontent.com/albertmartorell1975/android-ai-workflow-foundation/develop/.agents/catalog/workflows/[identifier].json`) using `read_url`.
2. **Resolve Dependencies**: Identify the `skills` list and `excludes` list from the manifest.
3. **Install Requirements**: For each skill in the `skills` list, fetch its `SKILL.md` from `.agents/catalog/` in the GitHub repo and write it locally to `.agents/skills/[skill-name]/SKILL.md`.
4. **Enforce Exclusions**: If the manifest contains an `excludes` list (e.g., `workflow-feature`), the agent MUST ensure those skills are NOT active or are explicitly disabled for feature orchestration.
5. **Active Workflow Setup**: Write the selected identifier to `.agents/workflow.json`.

### PHASE 4: Project Customization
1. **Materialize Governance Templates**: Create `AGENTS.md` in the project root directory by reading `.agents/skills/workflow-initializer/references/AGENTS_TEMPLATE.md`. Ensure `.agents/skills/README.md` is present and up to date by downloading it from the GitHub repository URL if necessary.
2. **AI Context Exclusion & Safety Hooks Setup**:
   - Delegate context exclusion creation directly to the `ai-context-exclusion` skill, passing the selected AI Provider (or defaulting to `Gemini` if omitted or unrecognized) to materialize the required file (`.aiexclude`, `.cursorignore`, or `.claude/settings.json`).
   - Delegate safety hooks setup to the `agent-safety-hooks` skill, passing the selected AI Provider to materialize both the hook configuration and script into the provider's official hook locations (`.claude/settings.json` + `.claude/hooks/block-rm-rf.js`, `.agents/hooks.json` + `.agents/hooks/block-rm-rf.js`, or `.cursor/hooks.json` + `.cursor/hooks/block-rm-rf.js`).
3. **Replacement**: During materialization of `AGENTS.md`, replace the following placeholders with values from the Stack Diagnosis:
   - `[PROJECT_NAME]` -> User's Project Name.
   - `[ARCHITECTURE]` -> MVVM or MVI.
   - `[DI_TOOL]` -> Hilt or Koin.
   - `[PERSISTENCE]` -> Room or SQLDelight.
4. **Git Baseline**: If not already initialized, perform `git init` and set up the `develop` and `main` branches according to `git-governance`.

## Actionable Checklist for New Projects
- [ ] Acknowledge mandatory foundation deployment.
- [ ] List all mandatory skills by parsing `.agents/skills/README.md`.
- [ ] Perform **Workflow Comparison** and Selection.
- [ ] Persist selection in `workflow.json`.
- [ ] Install **Workflow Plugins** and resolve `skills/excludes` dependencies.
- [ ] Perform **Stack Diagnosis** with the user (Name, AI Provider, Arch, DI, DB).
- [ ] Present and install standalone **Optional Plugins** from the catalog (using `.agents/skills/README.md`).
- [ ] Materialize `AGENTS.md` (in project root) from `references/AGENTS_TEMPLATE.md` with dynamic replacements.
- [ ] Delegate AI context exclusion creation (`.aiexclude`, `.cursorignore`, or `.claude/settings.json`) to `ai-context-exclusion` skill (using `Gemini` as fallback if empty/unrecognized).
- [ ] Delegate safety hooks creation (`.claude/settings.json` + `.claude/hooks/`, `.agents/hooks.json` + `.agents/hooks/`, or `.cursor/hooks.json` + `.cursor/hooks/`) to `agent-safety-hooks` skill.
- [ ] Run `git init` and establish the `git-governance` baseline.
