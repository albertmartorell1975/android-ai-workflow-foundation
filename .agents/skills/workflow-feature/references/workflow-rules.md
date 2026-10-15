# Architectural & Scope Discipline

## Repository and Architectural Discipline

The workflow must be repository-aware. Before defining implementation steps, inspect the smallest sufficient amount of repository context required to make the workflow concrete.

Prefer:
* established module boundaries,
* existing abstractions,
* existing naming patterns,
* existing dependency injection patterns,
* existing testing seams,
* existing design-system components,
* existing persistence conventions,
* and adjacent feature implementations.

**Constraint:** Do not introduce a new architectural pattern when an established compatible pattern already exists. Do not invent files, classes, modules, endpoints, database schemas, or infrastructure that are not supported by the feature requirements or repository evidence.

## Scope Discipline

The generated workflow must remain focused on the requested feature. Do not expand the scope into:
* unrelated refactors,
* broad architecture migrations,
* unrelated documentation work,
* speculative future features,
* or general technical cleanup.

A small behavior-preserving refactor may be included only when it directly enables the requested feature and can be validated independently.

## Validation Awareness

The generated workflow must identify how the feature will be verified. Prefer the strongest practical verification supported by the repository, such as:
* unit tests,
* integration tests,
* UI tests,
* compiler verification,
* static analysis,
* screenshot or visual verification,
* manual verification,
* or other established project validation mechanisms.

Validation steps must be concrete enough for an implementation agent to execute.

## Documentation Sync Rule

Whenever changes affect `.agents/skills/`, the generated workflow MUST include running `git status .agents/skills/` and require synchronization of `.agents/skills/README.md`.

The workflow must not assume that repository documentation is automatically synchronized.# Skill Capabilities & Guards

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
   Strictly enforces the Documentation Sync rule from `.agents/AGENTS.md`. Every time a skill is added, modified, or removed, the agent MUST detect it via `git status .agents/skills/` and update `.agents/skills/README.md` accordingly.

8. **Governance Enforcement (MANDATORY)**
   Every generated `WORKFLOW_*.md` checklist MUST include:
    * At the START of every phase: `- [ ] **MANDATORY**: Consult \`AGENTS.md\` for role-specific constraints`
    * At the END of every phase:
        * `- [ ] **MANDATORY**: Execute \`compiler\` skill verification suite.`
        * `- [ ] **MANDATORY**: Request Commit & Push (Manual or via \`git-governance\` skill) before advancing.`

## Workflow File Creation Guard

`WORKFLOW_*.md` files belong exclusively to the Foundation workflow.

The agent MUST NOT create, update, regenerate, or otherwise modify a `WORKFLOW_*.md` file unless `.agents/workflow.json` contains:
```json
{
  "activeWorkflow": "foundation"
}
```

The existence of an old `WORKFLOW_*.md` file does not authorize its reuse or modification when another workflow is active.

If the active workflow is not `foundation`, any existing `WORKFLOW_*.md` file must be treated as legacy or unrelated workflow state and must not be modified by this skill.# Foundation Workflow Boundaries

The project may contain multiple workflow methodologies, but only one workflow may be active at a time.

When:
`activeWorkflow = foundation`
`workflow-feature` is the authoritative feature-planning and workflow-generation mechanism.

When:
`activeWorkflow != foundation`
`workflow-feature` MUST NOT participate in feature orchestration.

In particular, the Foundation workflow and alternative workflows such as `ai-expert-workflow` MUST NOT be executed concurrently for the same feature.

## Foundation Workflow Boundary Rule
This skill owns only the **Foundation feature workflow**. It does not define or orchestrate alternative workflow methodologies.

When the project uses `activeWorkflow = ai-expert-workflow`, the appropriate AI-expert-workflow skills must be used instead (`build-brief`, `harness-starter`, `feature-spec`, `feature-flow`, `feature-implementer`, `feature-validator`). This skill MUST NOT be used as a fallback planning mechanism when the AI-expert-workflow is active.

## Final Constraint
The agent must never use `workflow-feature` merely because the skill is installed. The active workflow configuration is authoritative.

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