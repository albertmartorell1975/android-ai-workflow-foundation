---
name: workflow-initializer
description: Initializes a new Android or KMP project with the AI-assisted development workflow seed. It sets up the governance files and guides the initial customization of agents and skills.
metadata:
  author: Albert Martorell Garcia
  version: 2.0.0
  keywords:
  - setup
  - initialization
  - workflow-seed
  - project-kickoff
---
# Workflow Initializer Specialist

**IMPORTANT**: If this skill is loaded and the project root does not contain `.agents/rules.md` or `.agents/AGENTS.md`, you MUST immediately greet the user and say: 
> "I see the AI Workflow Foundation has been added but not yet initialized. Would you like me to start the **Initialization Wizard** now to set up your Tech Stack and activate optional plugins?"

This skill provides a structured process for setting up or updating the AI-assisted workflow in an Android or Kotlin Multiplatform (KMP) project. It ensures that the project starts with a solid architectural foundation and can evolve its capabilities over time.

## Proactive Behavior
If you are loaded in a project where `.agents/rules.md` or `.agents/AGENTS.md` are missing, you MUST immediately notify the user and offer to perform the **PHASE 1: Deployment**.

## Initialization & Update Process
*Note: This process can be triggered at project kickoff or later to add new capabilities.*

### PHASE 1: Deployment
1. **Directory Setup**: Ensure the `.agents/` and `.agents/skills/` directories exist in the project root.
2. **Materialize Templates**: Create the `rules.md`, `AGENTS.md`, and `skills/README.md` files using the templates provided below.

### PHASE 2: Stack Discovery & Plugin Selection
The agent MUST ask the user about the project's specific technical choices:
- **Architecture**: MVI, MVVM, or other?
- **Networking/Persistence**: Retrofit, Room, Ktor, etc.?
- **Platform**: Android Only or KMP?

**Plugin Selection**: Show the user the **On-Demand Plugins Catalog** (Group 3) below. All options start as UNSELECTED. The user must explicitly tell you which ones to "activate".

### PHASE 3: Plugin Selection & Activation
The agent MUST notify the user that CORE and GUARDRAIL skills have been successfully installed. 
Then, it MUST show the **On-Demand Plugins Catalog** (Group 3) below. 

For each plugin the user wants to activate:
1. Locate the plugin in the local `.agents/catalog/` directory.
2. Move the plugin's folder to the `.agents/skills/` directory.
3. Notify the user that the plugin is now active and ready to be used.

### PHASE 4: Git Baseline
1. **Initialize Git**: If not already initialized, perform `git init`.
2. **Branching Model**: Set up the `develop` and `main` branches according to `git-governance`.

## On-Demand Plugins Catalog (Group 3)
*These plugins are optional and only activated upon user request.*

- **Hardware & Media**: `camerax`
- **Migration**: `migrate-xml-views-to-jetpack-compose`
- **Firebase Stack**: `firebase-basics`, `firebase-auth-basics`, `firebase-remote-config-basics`
- **UI & Motion**: `styles`, `compose-animations`, `compose-slot-api-pattern`
- **Advanced Performance**: `compose-state-deferred-reads`, `perfetto-sql`, `perfetto-trace-analysis`
- **Specialized Platforms**: `wear-compose-m3`, `display-glasses-with-jetpack-compose-glimmer`, `kotlin-multiplatform-expect-actual`
- **Security & Identity**: `verified-email`, `engage-sdk-integration`
- **Planning & Strategy**: `to-plan`
- **Maintenance & Policy**: `play-policy-insights`, `agp-9-upgrade`, `appfunctions`, `play-billing-library-version-upgrade`, `kotlin-types-value-class`

## Actionable Checklist for New Projects
- [ ] Create `.agents/` directory structure.
- [ ] Materialize `rules.md`, `AGENTS.md`, and `skills/README.md` templates.
- [ ] Perform **Stack Diagnosis** and **Plugin Selection** with the user.
- [ ] Activate chosen Group 3 plugins.
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

Behaviors and Rules:

1) Idea Diagnosis and Clarification:
   a) When a user provides an idea, identify the main objective of the request.
   b) Detect any ambiguous phrases or missing information.
   c) Ask up to 3 targeted questions to fill the gaps.

2) Prompt Generation:
   a) Construct an 'Optimized Prompt' including: Role, Task, Context, Audience, Output Format, Constraints, and Quality Criteria.

4) Proactivity and Initialization:
   a) If you detect that the `workflow-initializer` skill is present but the root directory is missing `.agents/rules.md` or `.agents/AGENTS.md`, you MUST immediately offer to initialize the project.
```

### Template: AGENTS.md
```markdown
# [PROJECT_NAME] - AI Agents Governance

This document defines the specialized AI personas (Agents) designed to maintain the architectural integrity and code quality of the **[PROJECT_NAME]** project. 

---

## 1. The Domain Architect 🏛️
- **Module Ownership**: `:domain`
- **Primary Responsibility**: Define entities and Error Handling strategy.

---

## 2. The Use Case Specialist ⚙️
- **Module Ownership**: `:usecases`
- **Primary Responsibility**: Implement business rules and orchestrate repositories.

---

## 3. The Data Integrity Guardian 💾
- **Module Ownership**: `:data` (Interfaces) and implementation packages.
- **Primary Responsibility**: Manage persistence and network flow.

---

## 4. The UI/UX Engineer 🎨
- **Module Ownership**: `:app` (ui and viewmodel packages).
- **Primary Responsibility**: Create reactive UI following the project's design system.

---

## 5. The DI Coordinator 💉
- **Module Ownership**: Implementation modules (di packages).
- **Primary Responsibility**: Wire the project using Dependency Injection.

---

## Mandatory Planning Protocol (GATEWAY)
1. **Gateway Diagnosis (STRICT)**: Every new feature MUST start with the Diagnosis phase.
2. **Skill-Based Knowledge Retrieval**: Search and read relevant files inside `.agents/skills/`.
3. **Workflow Activation**: Only after prompt confirmation trigger `workflow-feature`.
```

### Template: skills/README.md
```markdown
# AI-Assisted Workflow - Expert Skills Index

This directory contains the collective intelligence for the project, organized into specialized groups.

## 1. Core Project Skills (Workflow DNA)
- **compiler**: Project verification and compilation engine.
- **git-governance**: Git Flow branching model and commit conventions.
- **workflow-feature**: Standardized workflow for new features.
- **testing-setup**: Testing strategy for native Android apps.
- **hilt**: Dependency Injection guidelines.
- **foundation-evolve**: Automation to evolve the Foundation repository.

## 2. Expert Guardrails (System & Quality)
- **android-cli**: Manual for the `android` command-line tool.
- **r8-analyzer**: R8 keep rules optimization.
- **adaptive**: UI instructions for adaptive layouts.
- **navigation-3**: Jetpack Navigation 3 patterns.
- **edge-to-edge**: Adaptive edge-to-edge support.
- **compose-stability-diagnostics**: Chris Banes' performance diagnostics.
- **compose-recomposition-performance**: Jank visual correction.
- **compose-state-hoisting**: State coordination patterns.
- **compose-side-effects**: Safe LaunchedEffect management.
- **compose-modifier-and-layout-style**: Efficient modifier chains.
- **compose-state-authoring**: Best practices in state creation.
- **kotlin-flow-state-event-modeling**: MVI with StateFlow.
- **kotlin-control-flow**: Clean control flow (guard, when).
- **kotlin-coroutines-structured-concurrency**: Safe concurrency.
- **kotlin-functions**: Top-level vs Extension decision.
- **using-chrisbanes-skills**: Banes' design review entry point.
- **compose-focus-navigation**: D-pad and accessibility focus.
- **android-intent-security**: Protection against Intent Redirection.
- **compose-ui-testing-patterns**: Patterns for testable UI.

## 3. On-Demand Plugins
*Optional skills activated via the workflow-initializer wizard.*
```
