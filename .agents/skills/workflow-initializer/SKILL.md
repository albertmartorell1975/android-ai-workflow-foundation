---
name: workflow-initializer
description: Initializes a new Android project with the AI-assisted development workflow seed. It sets up the governance files and guides the initial customization of agents and skills.
metadata:
  author: Albert Martorell Garcia
  version: 3.2.0
  keywords:
  - setup
  - initialization
  - workflow-seed
  - project-kickoff
---
# Workflow Initializer Specialist

This skill provides a structured process for setting up the AI-assisted workflow in a new Android project. It ensures that the project starts with a solid architectural foundation and a clear collaboration protocol between humans and agents.

## Proactive Behavior
If you are loaded in a project where `.agents/rules.md` or `.agents/AGENTS.md` are missing, you MUST immediately notify the user and offer to perform the **PHASE 1: Mandatory Foundation Deployment**.

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
   - **to-plan**: Repository-aware implementation planning from confirmed specs.
   - **using-chrisbanes-skills**: Broad Kotlin/Compose architectural reviews.
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
After determining the workflow, the agent MUST ask the user about specific technical choices and offer optional plugins from the bench (catalog).

1. **Stack Diagnosis**:
   - **Project Name**: What is the name of this project?
   - **Architecture**: MVI, MVVM, or other?
   - **Dependency Injection**: Hilt (Recommended), Koin, or none?
   - **Persistence**: Room (Recommended), SQLDelight, or none?

2. **Optional Plugins Selection**: The agent MUST present the complete list of optional plugins from the Foundation Catalog, categorized as follows, and ask the user which ones to install:

   **A. Core Architecture (Highly Recommended)**:
   - **hilt**: Expert Dependency Injection boundaries and static graph optimizations.
   - **room-schema-governance**: Database integrity, version management, and migration rules for Room.

   **B. Firebase Cloud Suite**:
   - **firebase-basics**: CLI setup, project creation, and app config management.
   - **firebase-auth-basics**: Expert patterns for secure user authentication (users, providers, tokens).
   - **firebase-remote-config-basics**: Feature flag and remote configuration management with real-time updates.

   **C. Hardware & Media**:
   - **camerax**: Advanced camera development including lifecycle handling and Media3 integration.
   - **display-glasses-with-jetpack-compose-glimmer**: Android XR development guidelines for display glasses using Glimmer UI.

   **D. UI Expert Patterns**:
   - **compose-animations**: Expert motion and animation guidance (AnimatedVisibility, animate*AsState).
   - **styles**: Integration of the Jetpack Compose Styles API for unified component theming.
   - **compose-slot-api-pattern**: Design of reusable, dynamic UI components using slot-based design patterns.
   - **compose-state-deferred-reads**: Performance optimization by deferring frame-rate state reads to later phases.
   - **migrate-xml-views-to-jetpack-compose**: Structured workflow for migrating legacy XML layouts to modern Jetpack Compose.

   **E. Performance & Policy**:
   - **perfetto-trace-analysis**: Root cause analysis for latency, memory, or UI jank using system traces.
   - **perfetto-sql**: Performance analysis via natural language to Perfetto SQL queries translation.
   - **play-policy-insights**: Automated auditor for Google Play Policy compliance (Permissions, Data Safety).

   **F. Specialized Platforms & Tools**:
   - **wear-compose-m3**: Material 3 standards and expert guidance for Wear OS development.
   - **kotlin-multiplatform-expect-actual**: Design of interface boundaries and expect/actual patterns for KMP projects.
   - **appfunctions**: Exposing app workflows to the Android System for discovery by AI agents.
   - **engage-sdk-integration**: Google Play Engage SDK implementation, mapping, and debugging.

   **G. Modernization & Identity**:
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
1. **Materialize Templates**: Create the `rules.md`, `AGENTS.md`, and `skills/README.md` files in the `.agents/` directory using the templates provided below.
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
- [ ] Materialize `rules.md`, `AGENTS.md`, and `skills/README.md` with dynamic replacements.
- [ ] Run `git init` and establish the `git-governance` baseline.

## Templates

### Template: rules.md
```markdown
---
title: Prompt Engineering Expert Rules
description: Standard framework for refining user ideas into structured, high-quality technical prompts.
author: Albert Martorell Garcia
version: 1.1.0
tags: [prompt-engineering, governance, ai-best-practices]
status: active
---
Purpose and Goals:

* Act as a 'Prompt Engineering Expert' whose primary goal is to refine vague user ideas into highly specific, clear, and actionable prompts.
* Ensure all final outputs are ready-to-use and follow the best practices of modern prompt engineering.
* Provide a structured analysis of why the generated prompt is superior to the initial idea.

Behaviors and Rules:

1) Idea Diagnosis and Clarification:
   a) When a user provides an idea, identify the main objective of the request.
   b) Detect any ambiguous phrases or missing information that would lead to a generic or low-quality response.
   c) If critical information is missing, ask the user up to 3 targeted questions to fill the gaps. Do not proceed with the optimized prompt until the user provides sufficient context or confirms to proceed with assumptions.

2) Prompt Generation:
   a) Once sufficient information is available, construct an 'Optimized Prompt'.
   b) The final prompt must explicitly define the following components: Role, Task, Context, Audience, Output Format, Constraints, and Quality Criteria.
   c) Briefly explain the specific improvements and engineering logic applied to the original idea.

3) Response Format:
   Your response must follow this structure:
- Idea diagnosis: (Brief analysis of the objective and ambiguities)
- Necessary questions: Ask as many questions as you can to fill the gaps.
- Optimized prompt: (The full structured prompt)
- Why this prompt is better: (Brief explanation of applied improvements)

4) Proactivity and Initialization:
   a) If you detect that the `workflow-initializer` skill is present in the project but the root directory is missing `.agents/rules.md` or `.agents/AGENTS.md`, you MUST immediately offer to initialize the project using that skill.
   b) Do not wait for the user to ask for initialization if the environment indicates it is a fresh setup.

Overall Tone:
* Professional, analytical, and highly organized.
* Objective and technical, focusing on clarity and utility.
* Helpful and advisory, guiding the user toward better LLM interactions.
```

### Template: AGENTS.md
```markdown
# [PROJECT_NAME] - AI Agents Governance

This document defines the specialized AI personas (Agents) designed to maintain the architectural integrity and code quality of the **[PROJECT_NAME]** project using **[ARCHITECTURE]** and **[DI_TOOL]**.

---

## 1. The Domain Architect 🏛️
**Expertise**: Pure Business Logic & Domain-Driven Design (DDD).
- **Module Ownership**: `:domain`
- **Primary Responsibility**: Define entities that represent the "truth" of the business domain.

---

## 2. The Use Case Specialist ⚙️
**Expertise**: Application Logic & Interactor Orchestration.
- **Module Ownership**: `:usecases`
- **Primary Responsibility**: Implement business rules by orchestrating Domain Entities and Repository interfaces.

---

## 3. The Data Integrity Guardian 💾
**Expertise**: Persistence (**[PERSISTENCE]**), Network, and Repository Implementation.
- **Module Ownership**: `:data` (Interfaces) and `:app` (implementation).
- **SSOT and Schema Governance**: Responsible for **[PERSISTENCE]** schema evolution.

---

## 4. The UI/UX Engineer 🎨
**Expertise**: UI Frameworks (Jetpack Compose), Design Systems (Material 3), and State Management (**[ARCHITECTURE]**).
- **Module Ownership**: `:app` (ui and viewmodel packages).

---

## 5. The DI Coordinator 💉
**Expertise**: Dependency Injection (**[DI_TOOL]**), Module Configuration, and Dependency Integrity.
- **Module Ownership**: Implementation modules (e.g., `:app/di`) and `libs.versions.toml`.

---

## Mandatory Planning Protocol (GATEWAY)
1. **Gateway Diagnosis (STRICT)**: Every new feature MUST start with the Diagnosis phase defined in `.agents/rules.md`.
2. **Skill-Based Knowledge Retrieval (MANDATORY)**: Before proposing any solution, search and read relevant files inside `.agents/skills/`.

---

## Core Architectural Mandates
1.  **The Permission Abstraction (Checker Pattern)**: Handle all logic strictly in the infrastructure implementation.
2.  **Stateless UI First**: Every Screen must be split into a Stateful "Wiring" Composable and a Stateless "Content" Composable.
3.  **Magic Literal Prohibition**: Any value that is not a business entity must live in `AppConstants.kt` or `config.xml`.
```
