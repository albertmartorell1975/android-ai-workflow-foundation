---
name: workflow-initializer
description: Initializes a new Android project with the AI-assisted development workflow seed. It sets up the governance files and guides the initial customization of agents and skills.
metadata:
  author: Albert Martorell Garcia
  version: 2.3.0
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

1. **List Mandatory Skills**: The agent MUST display the following list of core skills that are now active in the project, providing a brief explanation for each:
   - **workflow-feature**: Standardized feature implementation workflow with granular checklists.
   - **git-governance**: Strict Git Flow branching model and commit conventions.
   - **compiler**: Centralized project verification, compilation, and deployment engine.
   - **kotlin-style**: Strict adherence to Official Kotlin Coding Conventions and the Magic Literal Prohibition.
   - **testing-setup**: Unified strategy for Unit, UI, and Screenshot testing.
   - **viewmodel-architecture**: Mandatory Passive Initialization and Hybrid UI State patterns.
   - **dependency-manager**: Strict governance for `libs.versions.toml` and version catalog stability.
   - **design-system-governance**: Material 3, A11y, and adaptive layout standards.
   - **navigation-3**: Best practices for Jetpack Navigation 3, deep links, and backstacks.
   - **edge-to-edge**: Adaptive edge-to-edge support, IME insets, and system bar legibility.
   - **android-intent-security**: Secure component communication and Intent redirection prevention.
   - **compose-stability**: Performance diagnostics for parameter stability and skippability.
   - **kotlin-flow-modeling**: Professional StateFlow, SharedFlow, and event management.
   - **kotlin-coroutines**: Safe structured concurrency and leak prevention.
   - **to-plan**: Repository-aware implementation planning from confirmed specs.

### PHASE 2: Stack Discovery & Optional Plugins
After listing the mandatory skills, the agent MUST ask the user about specific technical choices and offer optional plugins from the bench (catalog).

1. **Stack Diagnosis**:
   - **Project Name**: What is the name of this project?
   - **Architecture**: MVI, MVVM, or other?
   - **Dependency Injection**: Hilt (Recommended), Koin, or none?
   - **Persistence**: Room (Recommended), SQLDelight, or none?

2. **Optional Plugins Selection**: The agent MUST present the complete list of optional plugins from the Foundation Catalog, categorized as follows, and ask the user which ones to install:

   **A. Core Architecture (Highly Recommended)**:
   - **hilt**: Expert Dependency Injection boundaries and static graph optimizations.
   - **room-schema-governance**: Database integrity, version management, and schema evolution rules for Room.

   **B. Firebase Cloud Suite**:
   - **firebase-basics**: CLI setup, project creation, and app config management.
   - **firebase-auth-basics**: Expert patterns for secure user authentication.
   - **firebase-remote-config-basics**: Feature flag and remote configuration management.

   **C. Hardware & Media**:
   - **camerax**: Advanced camera development and Media3 integration.
   - **display-glasses-with-jetpack-compose-glimmer**: Android XR development for display glasses.

   **D. UI Expert Patterns**:
   - **compose-animations**: Expert motion and animation guidance in Compose.
   - **styles**: Integration of the Jetpack Compose Styles API.
   - **compose-slot-api-pattern**: Design of reusable, dynamic UI components using slots.
   - **compose-state-deferred-reads**: Performance optimization via phase-deferred state reads.
   - **migrate-xml-views-to-jetpack-compose**: Structured workflow for legacy XML to Compose migration.

   **E. Performance & Policy**:
   - **perfetto-trace-analysis**: Root cause analysis for latency, memory, or jank.
   - **perfetto-sql**: Performance analysis via Perfetto SQL queries.
   - **play-policy-insights**: Automated auditor for Google Play Policy compliance.

   **F. Specialized Platforms & Tools**:
   - **wear-compose-m3**: Material 3 standards for Wear OS development.
   - **kotlin-multiplatform-expect-actual**: Design of interface boundaries for KMP projects.
   - **appfunctions**: Exposing app workflows to the Android System for AI discovery.
   - **engage-sdk-integration**: Play Engage SDK implementation and debugging.

   **G. Modernization & Identity**:
   - **verified-email**: OTP-less email verification via Credential Manager.
   - **agp-9-upgrade**: Safe migration protocol for Android Gradle Plugin 9.0+.
   - **play-billing-library-version-upgrade**: Migration guide for the latest Google Play Billing versions.
   - **kotlin-types-value-class**: Optimized type safety using @JvmInline value classes.

3. **Plugin Installation**: For each selected plugin, the agent MUST fetch the `SKILL.md` from GitHub (`https://raw.githubusercontent.com/albertmartorell1975/android-ai-workflow-foundation/main/.agents/catalog/[plugin-name]/SKILL.md`) and write it to the local `.agents/skills/[plugin-name]/SKILL.md` file using `write_file`.

### PHASE 3: Project Customization
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
- [ ] Perform **Stack Diagnosis** with the user (Name, Arch, DI, DB).
- [ ] Present and install **Optional Plugins** selected by the user.
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

Behaviors and Rules:

1) Idea Diagnosis and Clarification:
   a) When a user provides an idea, identify the main objective of the request.
   b) Detect any ambiguous phrases or missing information.
   c) Ask up to 3 targeted questions to fill the gaps.

2) Prompt Generation:
   a) Construct an 'Optimized Prompt' including: Role, Task, Context, Audience, Output Format, Constraints, and Quality Criteria.

3) Response Format:
   Your response must follow this structure:
- Idea diagnosis: ...
- Necessary questions: ...
- Optimized prompt: ...
- Why this prompt is better: ...

4) Proactivity and Initialization:
   a) If you detect that the `workflow-initializer` skill is present but the root directory is missing `.agents/rules.md` or `.agents/AGENTS.md`, you MUST immediately offer to initialize the project.
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
