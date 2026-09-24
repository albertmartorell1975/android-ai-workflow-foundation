---
name: workflow-initializer
description: Initializes a new Android project with the AI-assisted development workflow seed. It sets up the governance files and guides the initial customization of agents and skills.
metadata:
  author: Albert Martorell Garcia
  version: 3.3.0
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

1. **List Mandatory Skills**: The agent MUST display the following list of core skills and shared guardrails that are now active in the project, providing a brief explanation for each:
   - **adaptive**: Adaptive layouts for all device form factors (phones, tablets, foldables).
   - **android-cli**: Expert usage of Android SDK command-line tools.
   - **android-intent-security**: Secure component communication and Intent redirection prevention.
   - **compiler**: Centralized project verification, compilation, and deployment engine.
   - **compose-focus-navigation**: D-pad, keyboard, and accessibility focus handling.
   - **compose-modifier-and-layout-style**: Idiomatic modifier chains and custom layout decisions.
   - **compose-recomposition-performance**: Investigation of jank and unnecessary UI updates.
   - **compose-side-effects**: Safe management of LaunchedEffect and side effects.
   - **compose-stability-diagnostics**: Performance diagnostics for parameter stability.
   - **compose-state-authoring**: Best practices for mutable state and remember blocks.
   - **compose-state-hoisting**: Principles for reactive UI state movement.
   - **compose-ui-testing-patterns**: Semantics assertions and interactive UI testing.
   - **dependency-manager**: Strict governance for libs.versions.toml and version catalogs.
   - **design-system-governance**: Material 3, A11y, and adaptive layout standards.
   - **edge-to-edge**: Adaptive edge-to-edge support and IME insets.
   - **foundation-evolve**: Automatic synchronization of skills back to the Foundation repo.
   - **git-governance**: Strict Git Flow branching model and commit conventions.
   - **kotlin-control-flow**: Clean branching and sealed type exhaustiveness.
   - **kotlin-coroutines-structured-concurrency**: Safe structured concurrency and leak prevention.
   - **kotlin-flow-state-event-modeling**: Professional StateFlow and SharedFlow management.
   - **kotlin-functions**: Choosing the right function type for every task.
   - **kotlin-style**: Strict adherence to Official Kotlin Coding Conventions.
   - **navigation-3**: Best practices for Jetpack Navigation 3.
   - **r8-analyzer**: Proguard/R8 optimization and app size management.
   - **testing-setup**: Unified strategy for Unit, UI, and Screenshot testing.
   - **viewmodel-architecture-governance**: Mandatory Passive Initialization and Hybrid UI State patterns.
   - **workflow-feature**: Standardized feature implementation workflow with granular checklists.
   - **workflow-initializer**: Current project setup and customization wizard.

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
   - **Architecture**: MVI, MVVM, or other?
   - **Dependency Injection**: Hilt (Recommended), Koin, or none?
   - **Persistence**: Room (Recommended), SQLDelight, or none?

2. **Optional Plugins Selection**: The agent MUST present the complete list of optional plugins from the Foundation Catalog, categorized as follows, and ask the user which ones to install:

   **A. Core Architecture**:
   - **hilt**: Expert Dependency Injection boundaries and static graph optimizations.
   - **room-schema-governance**: Database integrity, version management, and schema evolution rules for Room.

   **B. Workflow Plugins**:
   - **to-plan**: Repository-aware implementation planning around external issues or specifications.
   - **using-chrisbanes-skills**: Intelligent router to identify precise expert patterns for Kotlin and Compose.

   **C. Firebase Cloud Suite**:
   - **firebase-basics**: CLI setup, project creation, and app config management.
   - **firebase-auth-basics**: Expert patterns for secure user authentication (users, providers, tokens).
   - **firebase-remote-config-basics**: Feature flag and remote configuration management with real-time updates.

   **D. Hardware & Media**:
   - **camerax**: Advanced camera development including lifecycle handling and Media3 integration.
   - **display-glasses-with-jetpack-compose-glimmer**: Android XR development guidelines for display glasses using Glimmer UI.

   **E. UI Expert Patterns**:
   - **compose-animations**: Expert motion and animation guidance (AnimatedVisibility, animate*AsState).
   - **styles**: Integration of the Jetpack Compose Styles API for unified component theming.
   - **compose-slot-api-pattern**: Design of reusable, dynamic UI components using slot-based design patterns.
   - **compose-state-deferred-reads**: Performance optimization by deferring frame-rate state reads to later phases.
   - **migrate-xml-views-to-jetpack-compose**: Structured workflow for migrating legacy XML layouts to modern Jetpack Compose.

   **F. Performance & Policy**:
   - **perfetto-trace-analysis**: Root cause analysis for latency, memory, or UI jank using system traces.
   - **perfetto-sql**: Performance analysis via natural language to Perfetto SQL queries translation.
   - **play-policy-insights**: Automated auditor for Google Play Policy compliance (Permissions, Data Safety).

   **G. Specialized Platforms & Tools**:
   - **wear-compose-m3**: Material 3 standards and expert guidance for Wear OS development.
   - **kotlin-multiplatform-expect-actual**: Design of interface boundaries and expect/actual patterns for KMP projects.
   - **appfunctions**: Exposing app workflows to the Android System for discovery by AI agents.
   - **engage-sdk-integration**: Google Play Engage SDK implementation, mapping, and debugging.

   **H. Modernization & Identity**:
   - **verified-email**: Secure, OTP-less email verification via Android Credential Manager.
   - **agp-9-upgrade**: Migration protocol for upgrading to Android Gradle Plugin 9.0+.
   - **play-billing-library-version-upgrade**: Safe migration guide for the latest Google Play Billing Library versions.
   - **kotlin-types-value-class**: Optimized type safety and performance using @JvmInline value classes.

3. **General Plugin Installation**: For each selected standalone plugin, fetch its `SKILL.md` from GitHub (`https://raw.githubusercontent.com/albertmartorell1975/android-ai-workflow-foundation/main/.agents/catalog/[plugin-name]/SKILL.md`) and write it to `.agents/skills/[plugin-name]/SKILL.md`.

### Workflow Plugin Installation
When a complex workflow plugin is selected:
1. **Fetch Manifest**: Fetch the JSON manifest from GitHub (`https://raw.githubusercontent.com/albertmartorell1975/android-ai-workflow-foundation/main/.agents/catalog/workflows/[identifier].json`) using `read_url`.
2. **Resolve Dependencies**: Identify the `skills` list and `excludes` list from the manifest.
3. **Install Requirements**: For each skill in the `skills` list, fetch its `SKILL.md` from `.agents/catalog/` in the GitHub repo and write it locally to `.agents/skills/[skill-name]/SKILL.md`.
4. **Enforce Exclusions**: If the manifest contains an `excludes` list (e.g., `workflow-feature`), the agent MUST ensure those skills are NOT active or are explicitly disabled for feature orchestration.
5. **Active Workflow Setup**: Write the selected identifier to `.agents/workflow.json`.

### PHASE 4: Project Customization
1. **Materialize Templates**: Create `skills/README.md` files in the `.agents/` directory, and `AGENTS.md` in the project root directory using the templates provided below.
2. **Replacement**: During materialization, replace the following placeholders with values from the Stack Diagnosis:
   - `[PROJECT_NAME]` -> User's Project Name.
   - `[ARCHITECTURE]` -> MVVM or MVI.
   - `[DI_TOOL]` -> Hilt or Koin.
   - `[PERSISTENCE]` -> Room or SQLDelight.
3. **Git Baseline**: If not already initialized, perform `git init` and set up the `develop` and `main` branches according to `git-governance`.

## Actionable Checklist for New Projects
- [ ] Acknowledge mandatory foundation deployment.
- [ ] List all mandatory skills with brief descriptions.
- [ ] Perform **Workflow Comparison** and Selection.
- [ ] Persist selection in `workflow.json`.
- [ ] Install **Workflow Plugins** and resolve `skills/excludes` dependencies.
- [ ] Perform **Stack Diagnosis** with the user (Name, Arch, DI, DB).
- [ ] Present and install standalone **Optional Plugins** from the catalog.
- [ ] Materialize `AGENTS.md` (in project root), and `skills/README.md` with dynamic replacements.
- [ ] Run `git init` and establish the `git-governance` baseline.

## Templates

### Template: AGENTS.md
```markdown
# Instructions for Agents

Project Overview

[Describe the project purpose, target platform, domain, and main goals.]

Read First
[mandatory project context document]
[mandatory project scope or brief]
[mandatory domain or technical document]

Read additional documentation only when relevant:

[technical discovery / architecture document]
[design document]
[AI / prompt document]
[dataset or domain data]
.agents/skills/ — when a task is covered by a relevant governance or implementation skill.

## Workflow Governance

`.agents/workflow.json` is the authoritative source for the selected workflow.

Supported workflows:

* `foundation` → Native Android Workflow → `workflow-feature`
* `ai-expert-workflow` → AI Expert Workflow → `feature-flow`

Only the selected workflow may orchestrate feature development. Do not invoke or mix the alternative workflow.

`WORKFLOW_FEATURE.md` may only be created when `activeWorkflow = foundation` and the `workflow-feature` prerequisites are satisfied.

## Project Initialization

**ONLY when `activeWorkflow = ai-expert-workflow`:**

* `build-brief` and `harness-starter` are project-initialization skills.
* Use them when initializing or rebuilding the AI Expert project harness.
* They are not required before every feature.

## Startup Workflow

Before writing code:

1. Confirm the working directory with `pwd`.
2. Read `.agents/workflow.json` and identify `activeWorkflow`.
3. Follow the startup and prerequisite rules of the selected workflow.

### Foundation Workflow

When `activeWorkflow = foundation`:

* Follow the startup and prerequisite steps defined by `workflow-feature`.
* Do not apply AI Expert startup steps.

### AI Expert Workflow

When `activeWorkflow = ai-expert-workflow`:

1. Read `PROGRESS.md` for the current verified state and next step.
2. Read `feature_list.json` and select the first ready unfinished feature in list order.
3. Run `./init.sh`.
4. If baseline verification fails, fix the baseline before starting new feature work.


## Working Rules

* Work on one feature at a time.
* Keep changes within the selected feature scope unless a narrow supporting fix is required.
* Follow the git automation rules of the active workflow.
* Never push changes without explicit user authorization.
* Do not perform git operations outside the active workflow's defined process.
* Follow applicable project skills and their detailed rules; do not duplicate them here.
* Apply **KISS**: prefer the simplest solution that satisfies the MVP requirement.
* Do not invent requirements, domain data, or unsupported team insights. State clearly when information is unknown or unverifiable.
* Keep durable project state in repository files rather than relying on chat history.

## Required Artifacts

The required artifacts depend on the selected workflow.

For the AI Expert Workflow:

* `feature_list.json` — feature state.
* `PROGRESS.md` — verified state and session progress.
* `init.sh` — standard startup and verification path.

The Foundation Workflow may use different artifacts defined by `workflow-feature`.

## Definition of Done

A feature is complete only when:

* The target behaviour is implemented.
* Required verification has actually run.
* The selected workflow's acceptance criteria are satisfied.
* Required project state and documentation are updated.
* The repository can be safely continued using the selected workflow.

## End Of Session

Before ending a session:

1. Update the required project state for the selected workflow.
2. Record unresolved risks or blockers.
3. Leave the repository ready for the next agent session.

```

### Template: skills/README.md
```markdown
# Expert Skills Index

This index describes the Foundation's skills by **operational status** and **role**.

A skill has one canonical location in the Foundation repository:

* `.agents/skills/` → **Active Foundation Skills**, installed by default.
* `.agents/catalog/` → **Optional Skills & Workflows**, available on demand.

The categories within each location describe the **role** of a skill, not its origin or installation status.

A catalog skill becomes active in a consuming project only when it is explicitly installed or activated.

---

## 1. Active Foundation Skills

Skills installed automatically under `.agents/skills/` when the Foundation is added to a project. 
These provide the mandatory core engine and the shared technical standards.

### 1.1 Core Workflow Engine
The operational backbone responsible for project lifecycle, automation, and governance.

* **compiler**: Centralized project verification, compilation, and deployment engine.
* **foundation-evolve**: Synchronizes useful skills and improvements from working projects back to the Foundation.
* **git-governance**: Enforces Git Flow conventions, branching rules, and commit practices.
* **workflow-feature**: Foundation-native single-agent feature workflow.
* **workflow-initializer**: Project bootstrapping, stack diagnosis, customization, plugin management, and workflow selection.

### 1.2 Shared Engineering Guardrails
Technical standards shared by the active Foundation environment regardless of the selected development workflow.

* **dependency-manager**: Governance for `libs.versions.toml` and dependency compatibility.
* **design-system-governance**: Design System standards covering Material 3, accessibility, RTL, adaptive UI, and reusability.
* **kotlin-style**: Kotlin coding conventions, project-specific style rules, and Magic Literal prevention.
* **testing-setup**: Unified strategy for unit, UI behavior, and visual regression testing.
* **viewmodel-architecture-governance**: Architectural rules for ViewModels, UI state, and initialization patterns.

### 1.3 Android & System Patterns
Active technical knowledge for Android, Kotlin, Compose, and platform-specific engineering.

Examples include:

* **adaptive**: Adaptive UI across phones, tablets, foldables, laptops, TV, and XR.
* **android-cli**: Android CLI commands, SDK management, emulators, and related tooling.
* **android-intent-security**: Secure communication between Android components.
* **compose-focus-navigation**: Focus handling for TV, keyboard, and D-pad navigation.
* **compose-modifier-and-layout-style**: Compose layout APIs, modifier chains, and custom layout decisions.
* **compose-recomposition-performance**: Analysis of recomposition and UI performance issues.
* **compose-side-effects**: Safe handling of Compose side effects.
* **compose-stability-diagnostics**: Performance diagnostics for parameter stability.
* **compose-state-authoring**: Patterns for creating and managing Compose state.
* **compose-state-hoisting**: State ownership and coordination patterns.
* **compose-ui-testing-patterns**: Compose UI, screenshot, and semantics testing patterns.
* **edge-to-edge**: Modern system bar and IME inset handling.
* **kotlin-control-flow**: Kotlin branching and control-flow patterns.
* **kotlin-coroutines-structured-concurrency**: Structured coroutine design and lifecycle safety.
* **kotlin-flow-state-event-modeling**: State, event, and Flow modelling patterns.
* **kotlin-functions**: Choosing the right function type for every task.
* **navigation-3**: Jetpack Navigation 3 patterns and integration.
* **r8-analyzer**: Proguard/R8 optimization and app size management.

---

## 2. Optional Catalog Skills & Workflows

The catalog contains skills and workflows that are **not installed by default**. 
They are activated when a project requires a specialized capability.

### 2.1 Methodology Workflows
Alternative development methodologies.

#### AI Expert Workflow
A multi-agent development workflow originally created by **Antonio Leiva / Nino Ruano** for the **AI Expert** course.
When active, it replaces `workflow-feature` as the feature orchestration methodology.

### 2.2 Planning & Routing Plugins
Extensions to the development workflow for specific project management or architectural discovery needs.

* **to-plan**: Repository-aware implementation planning around external issues or specifications.
* **using-chrisbanes-skills**: Intelligent router to identify precise expert patterns for Kotlin and Compose based on Chris Banes' best practices.

### 2.3 Technology & Expert Plugins
Optional technical capabilities that depend on the specific project stack.

* **hilt**: Dependency Injection boundaries and optimizations.
* **room-schema-governance**: Room database integrity and schema evolution.
* **firebase-* Suite**: CLI setup, Auth patterns, and Remote Config management.
* **camerax**: Camera and Media3 integration patterns.
* **wear-compose-m3**: Material 3 patterns for Wear OS.
* **perfetto-trace-analysis**: Performance and trace analysis.
* **verified-email**: Email verification using Android Credential Manager.
* **agp-9-upgrade**: Android Gradle Plugin 9 migration guidance.

---

## Operational Distinction

```text
.agents/skills/   → Active Skills (Installed by default)
.agents/catalog/  → Optional Plugins (Available on demand)
```

---

## Credits & Provenance

The Foundation incorporates knowledge from:
* **Foundation Methodology**: Albert Martorell Garcia.
* **AI Expert Workflow**: **Antonio Leiva** / **Nino Ruano**.
* **Expert Patterns**: **Chris Banes** and others.
* **Official Docs**: Google Android & Firebase.
