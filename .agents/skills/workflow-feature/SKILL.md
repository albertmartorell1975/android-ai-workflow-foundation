---
name: 🟢 [CORE] workflow-feature
description: Analyzes the current project and builds a standardized workflow for implementing new features. Generates a feature-specific Markdown file (e.g., WORKFLOW_NAME.md) with granular checklists.
metadata:
  author: Albert Martorell Garcia
  version: 1.3.0
  keywords:
  - workflow
  - planning
  - clean-architecture
  - task-decomposition
  - feature-implementation
  - naming-conventions
  - pragmatic-testing
---
# Workflow Feature Specialist

This skill provides a structured methodology for implementing new features in the **MeteoMartoCompose** project. It acts as an expert Software Engineering Workflow Architect and Prompt Engineer, ensuring every feature is properly analyzed and planned before coding begins.

## Overview

The `workflow-feature` skill is a specialized automation and architectural enforcement component. It acts as the project's **Workflow Architect**, responsible for transforming feature requests into structured technical plans. When activated, it guides the developer through a rigorous design process and generates a persistent `WORKFLOW_FEATURE.md` roadmap to track implementation across all architectural layers.

## Skill Capabilities

As a Skill, `workflow-feature` provides:
1. **Automated Feature Decomposition**: Breaks down high-level ideas into granular, module-specific tasks.
2. **Architectural Enforcement**: Ensures every planned task adheres to the Clean Architecture rules defined in `.agents/AGENTS.md`.
3. **Task Orchestration**: Generates an actionable and ordered implementation checklist (Domain -> Data -> UseCase -> UI).
4. **Context Awareness**: Analyzes existing project modules and patterns to ensure new features integrate seamlessly.
5. **Testing Analysis**: Systematically evaluates whether a feature requires Unit Tests based on logic complexity.
6. **Automatic Build Synchronization**: Enforces a mandatory `gradle_sync` task in the checklist whenever `build.gradle.kts` or `libs.versions.toml` are modified. The agent must execute the `gradle_sync` tool directly.
7. **Expert Knowledge Sync**: Strictly enforces the "Documentation Sync" rule from `.agents/AGENTS.md`. Every time a skill is added, modified, or removed, the agent MUST detect it via `git status .agents/skills/` and update `.agents/skills/README.md` accordingly.

## Workflow Patterns

### ROLE AND GOAL
Act as an expert Software Engineering Workflow Generator and Prompt Engineer. Your primary goal is to refine initial feature ideas into highly structured, actionable, and technically precise development workflows using modern prompt engineering best practices.

---

### PHASE 1: MANDATORY PRE-DIAGNOSIS (via .agents/rules.md)
Before generating the final workflow, the agent MUST verify that:
1. The **Idea Diagnosis** from `.agents/rules.md` has been presented.
2. The **Necessary Questions** have been answered or assumptions accepted.
3. This skill acts as the implementation executor of the **Optimized Prompt** generated in the previous step.

---

### PHASE 2: WORKFLOW GENERATION (Technical Execution)
Once context is sufficient, construct a comprehensive technical workflow covering all required architectural layers, adhering to the project's **AGENTS.md** rules:

1. **UI/UX Layer**:
    - Identify if UI changes are needed.
    - Describe UI/UX requirements, states (loading, error, success), and mockup/screenshot needs.

2. **API Layer**:
    - Define exact endpoints: HTTP methods, routes, and JSON schemas for Requests and Responses.

3. **Persistence Layer**:
    - Detail data storage needs, database schema changes, ORM models, or local storage.

4. **Implementation Description**:
    - Write a clear, concise technical overview of the feature architecture.

5. **Granular Actionable Checklist**:
    - Create a step-by-step implementation checklist organized logically (e.g., Schema -> API Contract -> UI implementation). Split the job in small steps to be easier to accomplish the feature goals.
    - **Testing Tasks**: Include specific unit testing tasks ONLY if flagged during the Testing Analysis phase.

---

### PHASE 3: OUTPUT FORMAT & STRUCTURE
Your final response MUST follow this exact structure and be saved as a new file at the project root named **`WORKFLOW_[FEATURE_NAME_IN_UPPER_SNAKE_CASE].md`**:

#### 1. Idea Diagnosis & Assumptions
- **Objective:** (Brief analysis of what is being built)
- **Identified Ambiguities / Assumptions:** (Key technical decisions assumed or clarified)
- **Testing Requirement:** (Identify which components require Unit Tests and why)

#### 2. Necessary Questions (If applicable)
- *(Up to 3 targeted technical questions if critical info is missing)*

#### 3. Optimized Technical Workflow (`WORKFLOW_[FEATURE_NAME].md`)

# Feature: [Feature Name]

## Technical Overview
[Concise technical description]

## Layer Breakdown

### UI/UX
[Requirements and UI specs]

### API Design
| Method | Route | Description | Request Body | Response Body |
|--------|-------|-------------|--------------|---------------|
|        |       |             |              |               |

### Persistence
[Database/model/storage updates]

## Actionable Implementation Checklist
- [ ] **Database / Models:** ...
- [ ] [Steps based on Clean Architecture flow: Domain -> Data -> UseCase -> UI]
- [ ] **Testing & Integration:** [Include specific unit tests for identified components]
- [ ] **Documentation Sync (MANDATORY):** Run `git status .agents/skills/` and update `.agents/skills/README.md` if there are any changes in the expert skills directory.

## Documentation & References
For more details on how to interact with the system or define journeys, refer to:
- [Interacting with the Workflow](references/interact.md)
- [Defining Feature Journeys](references/journeys.md)
- [Pragmatic Testing Strategy](references/testing.md)
