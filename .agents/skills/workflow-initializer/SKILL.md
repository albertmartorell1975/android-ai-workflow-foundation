---
name: workflow-initializer
description: Initializes a new Android or KMP project with the AI-assisted development workflow seed. It sets up the governance files and guides the initial customization of agents and skills.
metadata:
  author: Albert Martorell Garcia
  version: 1.2.0
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

This directory contains the collective intelligence for the project, organized into specialized groups.

## 1. Core Project Skills (Workflow DNA)
- **compiler**: Project verification and compilation engine.
- **git-governance**: Git Flow branching model and commit conventions.
- **workflow-feature**: Standardized workflow for new features.
- **testing-setup**: Testing strategy for native Android apps.
- **hilt**: Dependency Injection guidelines.

## 2. Android CLI & System Skills
- **android-cli**: Manual for the `android` command-line tool.
- **r8-analyzer**: R8 keep rules optimization.
- **perfetto-sql**: SQL queries for Perfetto traces.
- **adaptive**: UI instructions for adaptive layouts.
- **camerax**: Guidance for Android camera development.
- **navigation-3**: Jetpack Navigation 3 patterns.
- **appfunctions**: Exposing app workflows to the system.
- **edge-to-edge**: Adaptive edge-to-edge support.
- **play-policy-insights**: Google Play Policy auditor.

## 3. External Expert Skills
Expert patterns for Compose and Kotlin, managed via `npx skills`.
```
