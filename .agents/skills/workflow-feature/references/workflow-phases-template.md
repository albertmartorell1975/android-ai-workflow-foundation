# Workflow Patterns & Template

## ROLE AND GOAL
Act as an expert Software Engineering Workflow Generator and Prompt Engineer. Your primary goal is to refine initial feature ideas into highly structured, actionable, and technically precise development workflows using modern prompt engineering best practices.

The output must be consistent with the current repository structure, `.agents/AGENTS.md`, established architectural patterns, project naming conventions, pragmatic testing strategy, and the active Foundation workflow configuration.

---

## PHASE 1: MANDATORY PRE-DIAGNOSIS
Before generating the final workflow, the agent MUST verify that:
1. The workflow configuration has already been validated and `activeWorkflow` is `foundation`.
2. The **Necessary Questions** have been answered or assumptions have been explicitly accepted.
3. This skill acts as the implementation executor of the **Optimized Prompt** generated in the previous step.

The agent MUST NOT skip the pre-diagnosis phase merely because the requested feature appears technically simple.

---

## PHASE 2: WORKFLOW GENERATION

Once context is sufficient, construct a comprehensive technical workflow covering all required architectural layers.

### 2.1 UI/UX Layer
Identify whether UI changes are needed. When applicable, describe:
* UI/UX requirements.
* Dedicated feature design folders under `docs/ui/<feature-id>/screens/` and `docs/ui/<feature-id>/resources/` (ensure these folders exist; if they already exist, do NOT recreate or overwrite existing files).
* Graphic asset conversion: raw PNG/JPEG graphic assets located in `docs/ui/<feature-id>/resources/` MUST be converted into optimized `.webp` format in `app/src/main/res/drawable/ic_<name>.webp`.
* Exclusion rule: full-screen mockups (`docs/ui/<feature-id>/screens/<screen>/screen.png`) serve as visual reference layout guides ONLY and MUST NOT be converted into drawable resources.
* Loading, error, empty, and success states, navigation implications, accessibility considerations, design-system requirements, mockup or screenshot needs.

Do not invent UI requirements that are not supported by the feature request or repository context.

### 2.2 API Layer
When an API is involved, define: HTTP methods, routes, request parameters, JSON schemas, authentication requirements, and error contracts. If the feature does not involve an API, explicitly state that no API changes are required.

### 2.3 Persistence Layer
When persistence is involved, detail: storage requirements, database schema changes, entities, DAO/repository changes, migrations, and persistence validation. If persistence is not involved, explicitly state that no persistence changes are required.

### 2.4 Implementation Description
Write a concise technical overview of the feature architecture explaining: affected modules, relevant layers, primary data flow, important interfaces, integration points, dependency direction, and architectural constraints. Use existing repository patterns whenever possible.

### 2.5 Granular Actionable Checklist
Create a step-by-step implementation checklist organized logically according to the project's architecture. Typical ordering may include:
`Schema / Models → Domain → Data → UseCase → UI → Integration → Testing → Validation`
Split work into small, independently understandable steps.

#### Governance Requirements
Every generated workflow phase MUST include at its beginning:
`- [ ] **MANDATORY**: Consult \`AGENTS.md\` for role-specific constraints`
Every generated workflow phase MUST include at its end:
`- [ ] **MANDATORY**: Execute \`compiler\` skill verification suite.`
`- [ ] **MANDATORY**: Request Commit & Push (Manual or via \`git-governance\` skill) before advancing.`

#### Testing Tasks
Include specific unit-testing tasks only when testing analysis identifies a meaningful unit-test requirement. Identify the target component, behavior being tested, test boundary, and any conventions. Do not create unnecessary tests solely to satisfy a template.

---

## PHASE 3: OUTPUT FORMAT & STRUCTURE (The Template)

The final workflow MUST be saved as a new file at the project root named:
`WORKFLOW_[FEATURE_NAME_IN_UPPER_SNAKE_CASE].md`

The output must exactly follow this Markdown structure:

```markdown
### 1. Idea Diagnosis & Assumptions
* **Objective:** Brief analysis of what is being built.
* **Identified Ambiguities / Assumptions:** Key technical decisions that were clarified or explicitly accepted.
* **Testing Requirement:** Identify which components require unit tests and why.

### 2. Necessary Questions
[If critical information is missing, up to three targeted technical questions. Otherwise, state no additional questions remain.]

### 3. Optimized Technical Workflow

# Feature: [Feature Name]

## Technical Overview
[Concise technical description]

## Layer Breakdown

### UI/UX
[Requirements and UI specifications]

### API Design
[Describe API endpoints, methods, and schemas. If not, state "No API changes required".]

### Persistence
[Database, model, or storage updates. If not, state "No persistence changes required".]

## Actionable Implementation Checklist

- [ ] **Database / Models:** ...
- [ ] **Domain:** ...
- [ ] **Data:** ...
- [ ] **UseCase:** ...
- [ ] **UI:** ...
- [ ] **UI Design Assets & Folders:** Ensure `docs/ui/<feature-id>/screens/` and `docs/ui/<feature-id>/resources/` exist (do NOT recreate if existing). Convert raw graphic assets in `docs/ui/<feature-id>/resources/` (PNG/JPEG) to `app/src/main/res/drawable/ic_<name>.webp` (screen mockups in `screens/` excluded).
- [ ] **Testing & Integration:** ...
- [ ] **Documentation Sync (MANDATORY):** Run `git status .agents/skills/` and update `.agents/skills/README.md` if there are any changes in the expert skills directory.
- [ ] **Compiler Verification (MANDATORY):** Execute the `compiler` skill verification suite.
- [ ] **Commit & Push (MANDATORY):** Request Commit & Push manually or via `git-governance` before advancing.

## Documentation & References
For more details on how to interact with the system or define journeys, refer to:
- [Interacting with the Workflow](.agents/skills/workflow-feature/references/interact.md)
- [Defining Feature Journeys](.agents/skills/workflow-feature/references/journeys.md)
- [Pragmatic Testing Strategy](.agents/skills/workflow-feature/references/testing.md)
```