---
name: workflow-initializer
description: Initializes a new Android or KMP project with the AI-assisted development workflow seed. It sets up the governance files and guides the initial customization of agents and skills.
metadata:
  author: Albert Martorell Garcia
  version: 1.3.0
  keywords:
  - setup
  - initialization
  - workflow-seed
  - project-kickoff
---
# Workflow Initializer Specialist

This skill provides a structured process for setting up the AI-assisted workflow in a new Android or Kotlin Multiplatform (KMP) project. It ensures that the project starts with a solid architectural foundation and a clear collaboration protocol between humans and agents.

## Proactive Behavior
If you are loaded in a project where `.agents/rules.md` or `.agents/AGENTS.md` are missing, you MUST immediately notify the user and offer to perform the **PHASE 1: Deployment**.

## Initialization Process

### PHASE 1: Deployment
1. **Directory Setup**: Ensure the `.agents/` and `.agents/skills/` directories exist in the project root.
2. **Materialize Templates**: Create the `rules.md`, `AGENTS.md`, and `skills/README.md` files using the templates provided below.

### PHASE 2: Stack Discovery & Customization
The agent MUST ask the user about the project's specific technical choices:
- **Architecture**: MVI, MVVM, or other?
- **Dependency Injection**: Hilt, Koin, or Native?
- **Networking**: Retrofit, Ktor, or none?
- **Persistence**: Room, SQLDelight, or none?
- **Platform**: Android Only or KMP?

Based on these answers, the agent MUST:
1. **Update `AGENTS.md`**: Replace generic examples with the specific technologies chosen.
2. **Install Service Skills**: Recommend and install the corresponding specialized skills using `npx skills add`.

### PHASE 3: Git Baseline
1. **Initialize Git**: If not already initialized, perform `git init`.
2. **Branching Model**: Set up the `develop` and `main` branches according to `git-governance`.
3. **Commit Governance**: Ensure the user is aware of the commit naming conventions.

## Actionable Checklist for New Projects
- [ ] Create `.agents/` directory structure.
- [ ] Materialize `rules.md`, `AGENTS.md`, and `skills/README.md` templates.
- [ ] Perform **Stack Diagnosis** with the user.
- [ ] Customize Role Definitions in `AGENTS.md`.
- [ ] Install core skills: `workflow-feature`, `git-governance`, `to-plan`.
- [ ] Install stack-specific skills.
- [ ] Run `git status` to verify the baseline.

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

This document defines the specialized AI personas (Agents) designed to maintain the architectural integrity and code quality of the **[PROJECT_NAME]** project. 

---

## 1. The Domain Architect 🏛️
**Expertise**: Pure Business Logic & Domain-Driven Design (DDD) (e.g., 'ResultResponse', 'Either', 'CustomError' patterns).

- **Module Ownership**: `:domain`
- **Primary Responsibility**: Define entities that represent the "truth" of the business domain. Define the global **Error Handling** strategy.

---

## 2. The Use Case Specialist ⚙️
**Expertise**: Application Logic & Interactor Orchestration.

- **Module Ownership**: `:usecases`
- **Primary Responsibility**: Implement business rules by orchestrating Domain Entities and Repository interfaces defined in `:data`.

---

## 3. The Data Integrity Guardian 💾
**Expertise**: Persistence (e.g., Room, SQLDelight), Network (e.g., Retrofit, Ktor), Data Mapping, and Repository Implementation.

- **Module Ownership**: `:data` (Interfaces) and `:app` (specifically `framework/` or `data/` implementation packages).

---

## 4. The UI/UX Engineer 🎨
**Expertise**: UI Frameworks (Jetpack Compose, XML), Design Systems (Material 3), and State Management (e.g., MVI, MVVM).

- **Module Ownership**: `:app` (specifically `ui/` and `viewmodel/` or `presenter/` packages).

---

## 5. The DI Coordinator 💉
**Expertise**: Dependency Injection & Module Configuration (e.g., Hilt, Koin, KMP Native DI).

- **Module Ownership**: Implementation modules (e.g., `:app/di`).

---

## Mandatory Planning Protocol (GATEWAY)

1. **Gateway Diagnosis (STRICT)**: Every new feature MUST start with the Diagnosis phase defined in `.agents/rules.md`.
2. **Skill-Based Knowledge Retrieval (MANDATORY)**: Before proposing any solution, search and read relevant files inside `.agents/skills/`.
3. **Workflow Activation**: Only after prompt confirmation can the agent trigger the `workflow-feature` skill.

---

## General Quality & Verification Rules

1. **Notification Protocol**: Before changing governance files, notify and wait for approval.
2. **Definition of Done**: Task is done after mandatory verification and clean architecture compliance.
3. **Code Style**: All Kotlin code MUST adhere to Official Kotlin Coding Conventions.
```

### Template: skills/README.md
```markdown
# AI-Assisted Workflow - Expert Skills Index

This directory contains the collective intelligence for the project, organized into three specialized groups.

## 1. Core Project Skills (Workflow DNA)
Custom skills created to define this project's unique architecture and governance.

- **compiler**: Centralized project verification and compilation engine. Handles Gradle Sync, Lint, Compilation, and Deployment.
- **git-governance**: Defines a strict Git Flow branching model and commit conventions for AI agents.
- **workflow-feature**: Analyzes the project and builds a standardized workflow for new features with granular checklists and mandatory documentation sync enforcement.
- **testing-setup**: Analyzes and creates a testing strategy for native Android apps (Unit, UI, Screenshot, and E2E).
- **hilt**: Official guidelines, clean architecture boundaries, static graph optimizations, and comprehensive multibinding patterns for the project.

## 2. Android CLI & System Skills
Expert guides for system-level optimizations, tools, and best practices.

- **android-cli**: Manual for the `android` command-line tool (project creation, emulators, screenshots, SDK management).
- **r8-analyzer**: Analyzes build files and R8 keep rules to identify redundancies and optimize app size.
- **perfetto-sql**: Translates natural language into SQL queries for Android Perfetto performance traces.
- **adaptive**: UI instructions to adapt apps to phones, tablets, foldables, laptops, TV, and XR.
- **camerax**: Technical guidance for Android camera development with CameraX.
- **navigation-3**: Migration and patterns for Jetpack Navigation 3 (deep links, backstacks, Hilt/ViewModel integration).
- **agp-9-upgrade**: Migration protocol for upgrading projects to Android Gradle Plugin version 9.
- **appfunctions**: Exposes app workflows to the Android system for discovery by AI agents.
- **edge-to-edge**: Migration to adaptive edge-to-edge support (status/navigation bar legibility, IME insets).
- **play-policy-insights**: Automated auditor for Google Play Policy compliance (Permissions, Data Safety, Privacy).
- **perfetto-trace-analysis**: Analyzes Perfetto traces to find root causes of latency, memory, or jank.
- **android-intent-security**: Best practices for secure communication between components via Intents.
- **play-billing-library-version-upgrade**: Migration guide for the latest Google Play Billing Library versions.
- **display-glasses-with-jetpack-compose-glimmer**: Guidelines for developing Android XR apps for display glasses.
- **migrate-xml-views-to-jetpack-compose**: Structured workflow for migrating legacy XML layouts to Jetpack Compose.
- **wear-compose-m3**: Expert guidance for Wear OS development using Compose Material3.
- **verified-email**: Implementation of secure, OTP-less email verification flow via Credential Manager.
- **engage-sdk-integration**: Integration and debugging for the Google Play Engage SDK.

## 3. External Expert Skills
Expert patterns for Compose and Kotlin, managed via `npx skills`.

- **kotlin-functions**: Choosing the best Kotlin function type (top-level, extension, factory) for any receiver.
- **firebase-basics**: Foundational Firebase CLI setup, project creation, and app configuration management.
- **firebase-auth-basics**: Expert patterns for setting up and managing Firebase Authentication (users, providers, tokens).
- **firebase-remote-config-basics**: Managing feature flags, loading strategies, and real-time updates via Firebase Remote Config.
- **compose-animations**: Expert guidance on Motion and Animations in Compose (AnimatedVisibility, animate*AsState).
- **kotlin-flow-state-event-modeling**: Professional UI state and event management using StateFlow, SharedFlow, and Channels.
- **compose-side-effects**: Safe management of side effects (LaunchedEffect, snapshotFlow, navigation) in Compose.
- **compose-state-authoring**: Best practices for state creation (remember, mutableStateListOf) in Composables.
- **compose-stability-diagnostics**: Analysis of parameter stability, skippability, and strong skipping behavior.
- **compose-slot-api-pattern**: Design of reusable components using slots for highly dynamic content.
- **kotlin-types-value-class**: Optimized type declarations using @JvmInline value classes for type safety and performance.
- **compose-focus-navigation**: Focus handling for TV, keyboard, and D-pad navigation.
- **compose-state-deferred-reads**: Performance optimization by deferring frame-rate state reads to later phases.
- **compose-ui-testing-patterns**: Patterns for UI tests, screenshot tests, and semantics assertions in Compose.
- **compose-modifier-and-layout-style**: Best practices for layout APIs, modifier chains, and custom layout decisions.
- **compose-recomposition-performance**: Investigation of jank, skippability, and unnecessary recompositions.
- **kotlin-control-flow**: Refined Kotlin branching (when, guard conditions, sealed types) for cleaner logic.
- **kotlin-coroutines-structured-concurrency**: Safe coroutine management (CoroutineScope, structured launch) to avoid leaks.
- **kotlin-multiplatform-expect-actual**: Design of interface boundaries for Kotlin Multiplatform projects.
- **compose-state-hoisting**: Principles for interactive UI state movement and coordination logic.
- **to-plan**: Repository-aware implementation planning for ready GitHub issues or confirmed specs.
- **using-chrisbanes-skills**: Entry point for broad Kotlin/Compose reviews spanning multiple design concerns.

---
**Note**: All skills must be consulted following the *Mandatory Planning Protocol* defined in `AGENTS.md`.
```
