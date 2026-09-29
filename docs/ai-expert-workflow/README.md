# AI Expert Workflow Overview

This document provides a comprehensive overview of the **AI Expert Workflow** (`activeWorkflow = ai-expert-workflow`) configured in the **BasketCoach** repository. It details the relationship between the 6 core workflow skills, the two-phase lifecycle, generated artifacts, status transitions, and operating rules.

---

## 1. Workflow Architecture & Lifecycle Diagram

```mermaid
flowchart TD
    classDef init fill:#1D2E54,color:#fff,stroke:#1D2E54;
    classDef flow fill:#F15A24,color:#fff,stroke:#F15A24;
    classDef sub fill:#008C45,color:#fff,stroke:#008C45;
    classDef doc fill:#f5f5f5,color:#1a1a1a,stroke:#ccc;

    subgraph PHASE1 ["Phase 1: Project Discovery & Harness Initialization"]
        A["$build-brief"]:::init -->|1. Product discovery interview| B["CONTEXT.md<br/>docs/build-brief.md<br/>docs/domain-model.md<br/>docs/risks-and-open-questions.md<br/>DESIGN.md"]:::doc
        B --> C["$harness-starter"]:::init
        C -->|2. Minimal agent harness setup| D["AGENTS.md<br/>feature_list.json<br/>PROGRESS.md<br/>init.sh"]:::doc
    end

    subgraph PHASE2 ["Phase 2: Iterative Feature Lifecycle (WIP = 1)"]
        D --> E["$feature-flow (Main Orchestrator Agent)"]:::flow
        
        E -->|Launches Subagent 1| F["planner subagent<br/>($feature-spec)"]:::sub
        F -->|Generates technical contract| G["docs/specs/<feature-id>.md"]:::doc
        
        G -->|Launches Subagent 2| H["implementer subagent<br/>($feature-implementer)"]:::sub
        H -->|Writes code, tests & self-verifies| I["Source Code + Tests<br/>Status: 'passing' in feature_list.json<br/>PROGRESS.md updated"]:::doc
        
        I -->|Launches Subagent 3| J["validator subagent<br/>($feature-validator)"]:::sub
        J -->|Verdict: 'revise' / 'block'| K["Implementation Repair Brief"]:::doc
        K -->|Routes repair back| H
        
        J -->|Verdict: 'accept'| L["$feature-flow Orchestrator"]:::flow
        L -->|1. Updates status to 'accepted'<br/>2. Staged Conventional Commit<br/>3. User handoff & test steps| M["Git Commit<br/>feat: complete <feature-id>"]:::doc
    end
```

---

## 2. Subagent Architecture & Role Separation

In **Phase 2**, the main agent runs **`$feature-flow`** as the **Main Orchestrator**. Rather than executing all tasks in a single context, the orchestrator delegates each step to an independent, specialized **subagent**:

1. **`planner` subagent** (wraps `$feature-spec`):
   * **Role:** Analyzes the repository and writes the technical specification `docs/specs/<feature-id>.md`.
   * **Boundary:** Does not write application code.
2. **`implementer` subagent** (wraps `$feature-implementer`):
   * **Role:** Reads the spec, implements code and tests, self-verifies, and sets status to `passing`.
   * **Boundary:** Does not perform final independent validation and never creates git commits or sets status to `accepted`.
3. **`validator` subagent** (wraps `$feature-validator`):
   * **Role:** Independently evaluates diff, tests, security, and quality against the spec.
   * **Boundary:** Does not write broad fixes; returns a verdict (`accept`, `revise`, or `block`). If `revise`, generates an executable repair brief for the `implementer` subagent.

---

## 3. Skills & Generated Artifacts Reference

### Phase 1: Discovery & Harness Setup

| Skill | Primary Role | Core Generated Artifacts | Optional / Secondary Artifacts |
| :--- | :--- | :--- | :--- |
| **`$build-brief`** | Guided interview to clarify product scope, target users, domain glossary, and visual design before coding. | • `CONTEXT.md` (Domain glossary)<br/>• `docs/build-brief.md` (Problem, users, goals, MVP slice)<br/>• `docs/domain-model.md` (Entities & lifecycle states)<br/>• `docs/risks-and-open-questions.md` (Risks & assumptions) | • `DESIGN.md` (Visual design & tokens, required when UI exists)<br/>• `docs/technical-discovery.md`<br/>• `docs/user-and-access-model.md`<br/>• `docs/mvp-scope.md`<br/>• `docs/design/concepts/*.png`<br/>• `docs/adr/*.md` |
| **`$harness-starter`** | Creates the minimal 4-file startup harness for coding agents to work autonomously after discovery. | • `AGENTS.md` (Repository operating rules & landing page)<br/>• `feature_list.json` (Session-sized feature list)<br/>• `PROGRESS.md` (Verified state & session log)<br/>• `init.sh` (Repository startup & verification script) | *Creates ONLY these 4 files.* Does not modify product code or create extra checklists. |

---

### Phase 2: Iterative Feature Lifecycle

| Skill | Primary Role | Core Generated / Updated Artifacts | Key Operating Rules |
| :--- | :--- | :--- | :--- |
| **`$feature-flow`** | **Main Orchestrator:** Manages the feature pipeline by coordinating Planner → Implementer → Validator subagents until a feature reaches `accept`. | • Coordinates subagents (`feature-spec`, `feature-implementer`, `feature-validator`).<br/>• Persists `accepted` status & validator evidence in `feature_list.json`.<br/>• Creates Conventional Commit (`feat: complete <feature-id>`).<br/>• Delivers final user handoff (What changed, How to test locally, Verdict, Commit, Next step). | • Subagents never commit; only the orchestrator commits upon acceptance.<br/>• Stages strictly feature-related files.<br/>• Runs in until-accepted mode by default. |
| **`$feature-spec`** | **Planner Subagent:** Converts a session-sized feature entry into an implementation-ready technical contract. | • `docs/specs/<feature-id>.md` | • Target: 100–250 lines.<br/>• Includes Given/When/Then acceptance scenarios, repo research, expected file changes, visual design impact, durable doc impact, verification plan, and validator checklist. |
| **`$feature-implementer`** | **Implementer Subagent:** Writes code, tests, and self-verifies against the spec contract. | • Application source code & tests.<br/>• Updates `feature_list.json` (`in_progress` → `passing`).<br/>• Updates `PROGRESS.md` with implementation summary & exact evidence.<br/>• Updates durable docs (`ARCHITECTURE.md`, `CONSTRAINTS.md`, `DESIGN.md`). | • Never sets status to `accepted` (only `passing`).<br/>• Self-verification is mandatory but does not replace independent validation.<br/>• Updates `init.sh` if baseline verification changes. |
| **`$feature-validator`** | **Independent QA Subagent:** Evaluates code, tests, security, and docs against the spec and quality rubrics. | • Returns verdict: `accept`, `revise`, or `block`.<br/>• Generates **Implementation Repair Brief** if verdict is `revise` or `block`.<br/>• Optionally creates `docs/validations/<feature-id>.md`. | • Applies `validation-rubric.md` and feature-scoped `security-checklist.md`.<br/>• Re-runs verification checks (`init.sh`, unit tests, E2E checks).<br/>• Evaluates durable doc accuracy and code boundaries. |

---

## 4. Feature State Machine & Conventions

| Status | Meaning | Set By |
| :--- | :--- | :--- |
| `not_started` | Feature is defined in `feature_list.json` and dependency-ready, but work has not begun. | `$harness-starter` |
| `in_progress` | Feature is actively being planned or implemented in the current session. | `$feature-implementer` |
| `passing` | Implementation and self-verification are complete with recorded evidence. Ready for independent validation. | `$feature-implementer` |
| `accepted` | Independent validator returned `accept` and the orchestrator persisted acceptance and created a commit. | `$feature-flow` (Orchestrator) |
| `blocked` | Implementation or validation cannot proceed due to blocking ambiguity, dependency, or security flaw. | `$feature-implementer` / `$feature-validator` |

---

## 5. Core Control Artifacts Summary

1. **`feature_list.json`**: Machine-readable feature tracking file. Each entry contains `id`, `area`, `title`, `user_visible_behavior`, `depends_on`, `status`, `verification`, `evidence`, and `notes`.
2. **`PROGRESS.md`**: Living document recording the verified baseline state, execution log, session history, and unresolved risks/blockers.
3. **`init.sh`**: Standard non-blocking verification gate for the repository. Must execute fast, automated checks (e.g., `./gradlew testDebugUnitTest --quiet`) and exit 0 on success or non-zero on failure. Must not start blocking dev servers.
4. **`AGENTS.md`**: Landing page and routing rules for agents working on the project.
5. **Durable Docs (`ARCHITECTURE.md`, `CONSTRAINTS.md`, `DESIGN.md`)**: Updated alongside code whenever durable knowledge (boundaries, operational MUST/MUST NOT rules, or UI tokens) is established or changed.
