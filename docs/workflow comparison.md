# Foundation and AI Expert Workflows

The Android AI Workflow Foundation separates **shared engineering governance** from the **method used to develop a feature**.

A project can use the Foundation's native workflow or an alternative workflow plugin, while keeping the same underlying engineering rules, technical skills, and human supervision.

The main difference between the two workflows is not whether the project is new or existing, nor whether the feature is small or large.

The key question is:

> **Do we want to solve the task with a single AI agent, or do we want to distribute the work across multiple specialized AI agents?**

Both approaches remain **human-supervised**.

---

## 1. The Shared Foundation

Regardless of the selected workflow, the project uses the same Foundation layer for common engineering concerns such as:

* Architecture and coding rules.
* Android and Kotlin practices.
* Dependency management.
* Testing and verification.
* Git governance.
* Security and technical guardrails.
* Project-specific instructions and context.

The selected workflow only determines **how feature work is organized and delegated**.

This separation allows the Foundation to support different development methodologies without forcing every project to follow the same process.

---

# 2. Foundation Workflow

The Foundation Workflow is a **centralized, single-agent approach**.

The same AI agent owns the feature workflow from analysis through implementation and verification.

```text
Human
  │
  ▼
AI Agent
  ├── Analyze
  ├── Plan
  ├── Design the solution
  ├── Implement
  └── Verify
  │
  ▼
Human Review
```

The `workflow-feature` skill acts as the native Workflow Architect. It analyzes the feature in the context of the current repository, architecture, and governance rules, and generates a persistent implementation roadmap.

The emphasis is on **continuity of context and centralized responsibility**.

### Typical characteristics

* One agent maintains the complete context of the feature.
* Planning and implementation are part of one continuous workflow.
* Architectural decisions remain centralized.
* The process has relatively little handoff overhead.
* The resulting workflow is persistent and repository-aware.

The Foundation Workflow is not limited to small tasks. It can also be used for complete, substantial features when one agent can reasonably own the full lifecycle.

---

# 3. AI Expert Workflow

The AI Expert Workflow is a **spec-driven, multi-agent approach**.

A main workflow orchestrator coordinates several specialized agents, each responsible for a different stage of the feature lifecycle.

```text
Human
  │
  ▼
Workflow Orchestrator
  │
  ├── Planner
  │      └── Defines what should be built
  │
  ├── Implementer
  │      └── Implements the approved specification
  │
  └── Validator
         └── Independently checks the result
  │
  ▼
Human Review
```

The workflow separates responsibilities into explicit stages:

```text
Discovery
    ↓
Specification
    ↓
Implementation
    ↓
Independent Validation
```

The six workflow skills provide the supporting lifecycle:

```text
build-brief
    ↓
harness-starter
    ↓
feature-spec
    ↓
feature-flow
    ├── planner
    ├── implementer
    └── validator
```

The important characteristic is not simply that there are more agents.

The important characteristic is that **responsibilities are intentionally separated between specialized roles**, with explicit handoffs and independent validation.

---

# 4. The Role of the Human

The multi-agent workflow does not remove the human from the process.

In both approaches, the human remains the **highest-level orchestrator and supervisor**.

The difference is what happens between the human and the final result.

### Foundation Workflow

```text
Human
  ↓
Single Agent
  ↓
Result
  ↓
Human Review
```

### AI Expert Workflow

```text
Human
  ↓
Workflow
  ↓
Planner → Implementer → Validator
  ↓
Human Review
```

The human may also intervene between stages when necessary.

For example:

```text
Human
  ↓
Planner
  ↓
Human Review / Correction
  ↓
Implementer
  ↓
Human Intervention
  ↓
Validator
  ↓
Human Final Review
```

Therefore, the difference is **not human vs. autonomous AI**.

It is:

> **single-agent execution vs. multi-agent specialization under human supervision.**

---

# 5. Advantages and Trade-offs

Neither workflow is universally better. Each optimizes for different characteristics.

| Aspect                                 | Foundation Workflow | AI Expert Workflow            |
| -------------------------------------- | ------------------- | ----------------------------- |
| Context continuity                     | Very high           | Lower across agent boundaries |
| Process simplicity                     | High                | Lower                         |
| Execution overhead                     | Lower               | Higher                        |
| Computational cost                     | Lower               | Higher                        |
| Planning/implementation continuity     | High                | Explicitly separated          |
| Role specialization                    | Limited             | High                          |
| Independent validation                 | Lower               | Higher                        |
| Traceability between stages            | Moderate            | High                          |
| Risk of handoff misunderstandings      | Low                 | Higher                        |
| Ease of maintaining the workflow       | High                | Lower                         |
| Potential for independent perspectives | Lower               | Higher                        |
| Suitability for formalized processes   | Moderate            | High                          |

---

# 6. Foundation Workflow — Strengths

## Continuity of Context

The same agent maintains the complete reasoning context:

```text
Requirement
    ↓
Analysis
    ↓
Architecture
    ↓
Implementation
    ↓
Verification
```

There is no need to transform every transition into a formal handoff.

This can make the workflow efficient when the feature is well understood and the repository already provides clear architectural patterns.

## Simplicity

There is less infrastructure to coordinate.

The workflow does not need to manage several specialized agents, intermediate contracts, or additional handoff states.

## Lower Overhead

Using one agent generally means:

* fewer agent executions,
* fewer handoffs,
* fewer intermediate artifacts,
* less coordination,
* and usually lower computational cost.

## Centralized Architectural Responsibility

One agent can maintain a consistent view of the whole feature and its architectural consequences.

This can be valuable when decisions are tightly connected and splitting them across roles would create unnecessary coordination.

---

# 7. Foundation Workflow — Trade-offs

## Limited Separation of Responsibilities

The same agent may:

1. design the solution,
2. implement it,
3. and evaluate its own result.

This provides continuity, but it also reduces the independence between those activities.

## Less Independent Validation

Even with strong verification rules, the agent validating the result already knows the decisions that led to the implementation.

That can make it harder to detect problems that another independent agent might question.

## Less Explicit Process Boundaries

Planning, implementation, and validation are more tightly connected.

This is efficient, but less suitable when the project specifically wants to study or enforce independent stages.

---

# 8. AI Expert Workflow — Strengths

## Separation of Responsibilities

The workflow creates clear boundaries:

```text
Planner
   ↓
"What should be built?"

Implementer
   ↓
"How should it be implemented according to the specification?"

Validator
   ↓
"Was it implemented correctly?"
```

The agent making the implementation plan is not necessarily the agent writing the code, and the validator is independent from the implementation role.

## Independent Validation

The validator provides a second perspective.

This can help identify:

* missing requirements,
* incomplete implementation,
* deviations from the specification,
* architectural problems,
* missing evidence,
* and validation gaps.

## Explicit Handoffs

Each phase produces an artifact that can be reviewed before the next phase begins.

This makes the process more traceable and easier to audit.

## Suitable for Experimenting with Agentic Development

The workflow is particularly useful when the development process itself is part of the objective.

It provides an explicit example of how specialized AI agents can collaborate under human supervision.

---

# 9. AI Expert Workflow — Trade-offs

## More Complexity

The workflow itself becomes a system that must be maintained.

There are more moving parts:

```text
Workflow
   ↓
Planner
   ↓
Specification
   ↓
Implementer
   ↓
Evidence
   ↓
Validator
```

## More Handoffs

Context must be transferred correctly between stages.

Poorly defined specifications or incomplete evidence can create misunderstandings between agents.

## Higher Overhead

A feature may require several agent executions instead of one.

This can mean:

* more tokens,
* more execution time,
* more intermediate artifacts,
* and more opportunities for coordination problems.

## Potential for Inconsistency

A planner may understand a requirement one way, the implementer another way, and the validator yet another way.

The workflow therefore depends heavily on the quality of:

* specifications,
* progress tracking,
* evidence,
* and handoff contracts.

---

# 10. When to Use Each Workflow

The choice should not be based on a rigid rule such as:

> "Foundation is for existing projects and AI Expert is for new projects."

Both workflows can be used in new or existing projects.

Likewise, the Foundation Workflow is not limited to small or isolated features.

A better decision rule is based on **how the task should be executed**.

## Use the Foundation Workflow when:

* One agent can effectively own the feature from analysis to implementation.
* The project architecture and constraints are already reasonably understood.
* The feature can be handled as a continuous workflow.
* Minimizing coordination overhead is valuable.
* Centralized architectural responsibility is desirable.
* The human prefers to supervise one main AI execution flow.

Typical example:

```text
Existing Android project
        ↓
New feature
        ↓
One agent analyzes + plans + implements + verifies
        ↓
Human review
```

## Use the AI Expert Workflow when:

* The work benefits from explicit separation of responsibilities.
* Planning should be formalized into an implementation-ready specification.
* Implementation should be performed by a dedicated agent.
* Independent validation is valuable.
* Clear handoffs and intermediate artifacts are important.
* The AI development process itself is part of the experiment or objective.
* The human wants to supervise several specialized agents rather than one agent owning the complete feature lifecycle.

Typical example:

```text
Feature or project
        ↓
Planner
        ↓
Human review
        ↓
Implementer
        ↓
Validator
        ↓
Human review
```

---

# 11. New vs. Existing Projects

Project age is a secondary consideration.

### New Projects

A new project may benefit from the AI Expert Workflow when there is substantial uncertainty around:

* product scope,
* technical requirements,
* initial project structure,
* feature boundaries,
* or the development process itself.

However, a new project can still use the Foundation Workflow when the requirements and technical direction are already clear.

### Existing Projects

An existing project may benefit from the Foundation Workflow when the architecture and conventions are already established and the feature can be handled efficiently by one agent.

However, an existing project can also use the AI Expert Workflow when a feature is complex enough to justify explicit specification, specialization, and independent validation.

Therefore:

> **Project maturity does not determine the workflow. The desired development model does.**

---

# 12. Practical Decision Rule

A simple way to choose is:

> **Use the Foundation Workflow when one agent can efficiently own the task end to end.**

> **Use the AI Expert Workflow when the task benefits from separating planning, implementation, and validation across specialized agents.**

This is not a ranking.

It is a choice between two different execution models.

---

# 13. The Core Idea

The Foundation provides the common engineering environment:

```text
                ANDROID AI WORKFLOW FOUNDATION
                           │
             ┌─────────────┴─────────────┐
             │                           │
       Foundation Workflow         AI Expert Workflow
          (single agent)             (multi-agent)
             │                           │
             ▼                           ▼
       workflow-feature       planner / implementer /
                              validator / feature-flow
             │                           │
             └─────────────┬─────────────┘
                           │
                           ▼
                Shared Foundation Core
             Governance · Android · Testing
              Git · Architecture · Security
```

The two workflows therefore do not represent two different foundations.

They represent **two ways of organizing AI-assisted development on top of the same Foundation**.

> **Same Foundation, different development methodology.**
