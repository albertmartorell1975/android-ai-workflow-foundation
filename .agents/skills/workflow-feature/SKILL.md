---

name: workflow-feature
description: Foundation-native feature workflow architect. Analyzes the current project and builds the standardized workflow-feature plan for implementing new features when the Foundation workflow is active.
metadata:
author: Albert Martorell Garcia
version: 1.4.0
keywords:

* workflow
* planning
* clean-architecture
* task-decomposition
* feature-implementation
* naming-conventions
* pragmatic-testing

---

# Workflow Feature Specialist

This skill provides the **native feature workflow methodology of the Android AI Workflow Foundation**.

It acts as an expert Software Engineering Workflow Architect and Prompt Engineer, transforming feature requests into structured, actionable, and technically precise implementation workflows before coding begins.

This skill is only active when the project's selected workflow is:

```text
activeWorkflow = foundation
```

The Foundation may support alternative workflow methodologies through its catalog. Those workflows must not be mixed with this skill.

---

## Mandatory Workflow Routing

Before performing **any analysis, planning, repository inspection, file creation, or other workflow action**, the agent MUST read:

```text
.agents/workflow.json
```

The file must define a valid `activeWorkflow`.

This skill is authorized to execute only when:

```text
activeWorkflow = foundation
```

### Inactive Workflow

If `activeWorkflow` is not `foundation`, the agent MUST:

1. Stop immediately.
2. Do not analyze the feature.
3. Do not inspect the repository for workflow generation.
4. Do not create or modify any `WORKFLOW_*.md` file.
5. Do not invoke another workflow skill automatically.
6. Report the active workflow and direct execution to the workflow selected by the project configuration.

Example:

> Current active workflow is `ai-expert-workflow`. `workflow-feature` is not active for this project. Use `feature-flow` and the AI-expert-workflow skills instead.

### Invalid Workflow Configuration

If `.agents/workflow.json` is missing, unreadable, malformed, or does not define `activeWorkflow`, the agent MUST stop and report the configuration problem.

The presence of this skill in `.agents/skills/` is not sufficient to authorize its execution.

---

## Workflow Isolation

The project may contain multiple workflow methodologies, but only one workflow may be active at a time.

When:

```text
activeWorkflow = foundation
```

`workflow-feature` is the authoritative feature-planning and workflow-generation mechanism.

When:

```text
activeWorkflow != foundation
```

`workflow-feature` MUST NOT participate in feature orchestration.

In particular, the Foundation workflow and alternative workflows such as `ai-expert-workflow` MUST NOT be executed concurrently for the same feature.

---

## Skill Capabilities

As a Skill, `workflow-feature` provides:

1. **Automated Feature Decomposition**
   Breaks down high-level ideas into granular, module-specific tasks.

2. **Architectural Enforcement**
   Ensures every planned task adheres to the Clean Architecture rules defined in `.agents/AGENTS.md`.

3. **Task Orchestration**
   Generates an actionable and ordered implementation checklist, typically following the project's architectural flow such as Domain → Data → UseCase → UI.

4. **Context Awareness**
   Analyzes existing project modules, conventions, patterns, and boundaries so the feature integrates consistently with the current codebase.

5. **Testing Analysis**
   Systematically evaluates whether a feature requires unit tests based on logic complexity, architectural responsibility, and project conventions.

6. **Automatic Build Synchronization**
   Enforces a mandatory `gradle_sync` task in the checklist whenever `build.gradle.kts` or `libs.versions.toml` are modified. The agent must execute the `gradle_sync` tool directly.

7. **Expert Knowledge Sync**
   Strictly enforces the Documentation Sync rule from `.agents/AGENTS.md`. Every time a skill is added, modified, or removed, the agent MUST detect it via:

   ```text
   git status .agents/skills/
   ```

   and update `.agents/skills/README.md` accordingly.

8. **Governance Enforcement (MANDATORY)**
   Every generated `WORKFLOW_*.md` checklist MUST include:

    * At the START of every phase:
      `- [ ] **MANDATORY**: Consult \`AGENTS.md` for role-specific constraints`
    * At the END of every phase:

        * `- [ ] **MANDATORY**: Execute \`compiler` skill verification suite.`
        * `- [ ] **MANDATORY**: Request Commit & Push (Manual or via \`git-governance` skill) before advancing.`

---

## Workflow File Creation Guard

`WORKFLOW_*.md` files belong exclusively to the Foundation workflow.

The agent MUST NOT create, update, regenerate, or otherwise modify a `WORKFLOW_*.md` file unless:

```text
.agents/workflow.json
```

contains:

```json
{
  "activeWorkflow": "foundation"
}
```

The existence of an old `WORKFLOW_*.md` file does not authorize its reuse or modification when another workflow is active.

If the active workflow is not `foundation`, any existing `WORKFLOW_*.md` file must be treated as legacy or unrelated workflow state and must not be modified by this skill.

---

# Workflow Patterns

## ROLE AND GOAL

Act as an expert Software Engineering Workflow Generator and Prompt Engineer.

Your primary goal is to refine initial feature ideas into highly structured, actionable, and technically precise development workflows using modern prompt engineering best practices.

The output must be consistent with:

* the current repository structure,
* `.agents/AGENTS.md`,
* `.agents/rules.md`,
* established architectural patterns,
* project naming conventions,
* pragmatic testing strategy,
* and the active Foundation workflow configuration.

---

## PHASE 1: MANDATORY PRE-DIAGNOSIS

Before generating the final workflow, the agent MUST verify that:

1. The workflow configuration has already been validated and `activeWorkflow` is `foundation`.
2. The **Idea Diagnosis** from `.agents/rules.md` has been presented.
3. The **Necessary Questions** have been answered or assumptions have been explicitly accepted.
4. This skill acts as the implementation executor of the **Optimized Prompt** generated in the previous step.

The agent MUST NOT skip the pre-diagnosis phase merely because the requested feature appears technically simple.

---

## PHASE 2: WORKFLOW GENERATION

Once context is sufficient, construct a comprehensive technical workflow covering all required architectural layers and adhering to the project's `.agents/AGENTS.md` rules.

### 2.1 UI/UX Layer

Identify whether UI changes are needed.

When applicable, describe:

* UI/UX requirements,
* loading, error, empty, and success states,
* navigation implications,
* accessibility considerations,
* design-system requirements,
* mockup or screenshot needs.

Do not invent UI requirements that are not supported by the feature request or repository context.

### 2.2 API Layer

When an API is involved, define:

* HTTP methods,
* routes,
* request parameters,
* request JSON schemas,
* response JSON schemas,
* relevant authentication requirements,
* error or failure contracts.

If the feature does not involve an API, explicitly state that no API changes are required.

### 2.3 Persistence Layer

When persistence is involved, detail:

* storage requirements,
* database schema changes,
* entities or models,
* DAO/repository changes,
* migrations,
* local storage updates,
* persistence validation.

If persistence is not involved, explicitly state that no persistence changes are required.

### 2.4 Implementation Description

Write a concise technical overview of the feature architecture.

Explain:

* affected modules,
* relevant layers,
* primary data flow,
* important interfaces,
* integration points,
* dependency direction,
* and architectural constraints.

Use existing repository patterns whenever possible.

### 2.5 Granular Actionable Checklist

Create a step-by-step implementation checklist organized logically according to the project's architecture.

Typical ordering may include:

```text
Schema / Models
→ Domain
→ Data
→ UseCase
→ UI
→ Integration
→ Testing
→ Validation
```

Split work into small, independently understandable steps.

#### Governance Requirements

Every generated workflow phase MUST include at its beginning:

```text
- [ ] **MANDATORY**: Consult `AGENTS.md` for role-specific constraints
```

Every generated workflow phase MUST include at its end:

```text
- [ ] **MANDATORY**: Execute `compiler` skill verification suite.
- [ ] **MANDATORY**: Request Commit & Push (Manual or via `git-governance` skill) before advancing.
```

#### Testing Tasks

Include specific unit-testing tasks only when testing analysis identifies a meaningful unit-test requirement.

Testing tasks must identify:

* the target component,
* the behavior being tested,
* the relevant test boundary,
* and any repository-specific testing conventions.

Do not create unnecessary tests solely to satisfy a checklist template.

---

## PHASE 3: OUTPUT FORMAT & STRUCTURE

The final workflow MUST be saved as a new file at the project root named:

```text
WORKFLOW_[FEATURE_NAME_IN_UPPER_SNAKE_CASE].md
```

The output must follow this structure.

### 1. Idea Diagnosis & Assumptions

Include:

* **Objective:** Brief analysis of what is being built.
* **Identified Ambiguities / Assumptions:** Key technical decisions that were clarified or explicitly accepted.
* **Testing Requirement:** Identify which components require unit tests and why.

### 2. Necessary Questions

If critical information is still missing, include up to three targeted technical questions.

When the required information has already been established, state that no additional questions remain.

### 3. Optimized Technical Workflow

```markdown
# Feature: [Feature Name]

## Technical Overview

[Concise technical description]

## Layer Breakdown

### UI/UX

[Requirements and UI specifications]

### API Design

| Method | Route | Description | Request Body | Response Body |
|--------|-------|-------------|--------------|---------------|
|        |       |             |               |              |

### Persistence

[Database, model, or storage updates]

## Actionable Implementation Checklist

- [ ] **Database / Models:** ...
- [ ] **Domain:** ...
- [ ] **Data:** ...
- [ ] **UseCase:** ...
- [ ] **UI:** ...
- [ ] **Testing & Integration:** ...
- [ ] **Documentation Sync (MANDATORY):** Run `git status .agents/skills/` and update `.agents/skills/README.md` if there are any changes in the expert skills directory.
- [ ] **Compiler Verification (MANDATORY):** Execute the `compiler` skill verification suite.
- [ ] **Commit & Push (MANDATORY):** Request Commit & Push manually or via `git-governance` before advancing.

## Documentation & References

For more details on how to interact with the system or define journeys, refer to:

- [Interacting with the Workflow](references/interact.md)
- [Defining Feature Journeys](references/journeys.md)
- [Pragmatic Testing Strategy](references/testing.md)
```

---

## Repository and Architectural Discipline

The workflow must be repository-aware.

Before defining implementation steps, inspect the smallest sufficient amount of repository context required to make the workflow concrete.

Prefer:

* established module boundaries,
* existing abstractions,
* existing naming patterns,
* existing dependency injection patterns,
* existing testing seams,
* existing design-system components,
* existing persistence conventions,
* and adjacent feature implementations.

Do not introduce a new architectural pattern when an established compatible pattern already exists.

Do not invent files, classes, modules, endpoints, database schemas, or infrastructure that are not supported by the feature requirements or repository evidence.

---

## Scope Discipline

The generated workflow must remain focused on the requested feature.

Do not expand the scope into:

* unrelated refactors,
* broad architecture migrations,
* unrelated documentation work,
* speculative future features,
* or general technical cleanup.

A small behavior-preserving refactor may be included only when it directly enables the requested feature and can be validated independently.

---

## Validation Awareness

The generated workflow must identify how the feature will be verified.

Prefer the strongest practical verification supported by the repository, such as:

* unit tests,
* integration tests,
* UI tests,
* compiler verification,
* static analysis,
* screenshot or visual verification,
* manual verification,
* or other established project validation mechanisms.

Validation steps must be concrete enough for an implementation agent to execute.

---

## Documentation Sync

Whenever changes affect `.agents/skills/`, the generated workflow MUST include:

```text
git status .agents/skills/
```

and require synchronization of:

```text
.agents/skills/README.md
```

The workflow must not assume that repository documentation is automatically synchronized.

---

## Foundation Workflow Boundary

This skill owns only the **Foundation feature workflow**.

It does not define or orchestrate alternative workflow methodologies.

When the project uses:

```text
activeWorkflow = ai-expert-workflow
```

the appropriate AI-expert-workflow skills must be used instead:

```text
build-brief
harness-starter
feature-spec
feature-flow
feature-implementer
feature-validator
```

This skill MUST NOT be used as a fallback planning mechanism when the AI-expert-workflow is active.

---

## Final Constraint

The agent must never use `workflow-feature` merely because the skill is installed.

The active workflow configuration is authoritative.

```text
workflow.json
    │
    ├── foundation
    │      └── workflow-feature
    │
    └── ai-expert-workflow
           └── feature-flow
```

Only the branch corresponding to the active workflow may be executed.
