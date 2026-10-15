---
name: workflow-feature
description: Foundation-native feature workflow architect. Analyzes the current project and builds the standardized workflow-feature plan for implementing new features when the Foundation workflow is active.
metadata:
  author: Albert Martorell Garcia
  version: 1.4.0
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

This skill provides the **native feature workflow methodology of the Android AI Workflow Foundation**.

It acts as an expert Software Engineering Workflow Architect and Prompt Engineer, transforming feature requests into structured, actionable, and technically precise implementation workflows before coding begins.

## 1. Mandatory Workflow Routing

Before performing **any analysis, planning, repository inspection, file creation, or other workflow action**, the agent MUST read: `.agents/workflow.json`.

This skill is authorized to execute ONLY when:
`activeWorkflow = foundation`

### Inactive or Invalid Workflow
If `activeWorkflow` is missing, malformed, or is NOT `foundation` (e.g., `ai-expert-workflow`), the agent MUST:
1. Stop immediately. Do not analyze, inspect the repository, or create/modify any `WORKFLOW_*.md` file.
2. Report the active workflow and direct execution to the workflow selected by the project configuration.

> **See [Workflow Rules & Governance](references/workflow-rules.md)** for constraints vs. alternative workflows, capabilities, boundaries, and scope discipline.

## 2. Workflow Generation Phases & Template

When executing as the active workflow, the agent acts as a Workflow Generator following strict phases:
* **PHASE 1: Mandatory Pre-Diagnosis** - Verify configuration and context before jumping into code.
* **PHASE 2: Workflow Generation** - Architect the UI, API, Persistence, and create an actionable checklist following project layers.
* **PHASE 3: Output Format** - Save the workflow as `WORKFLOW_[FEATURE_NAME_IN_UPPER_SNAKE_CASE].md` adhering exactly to the standard template.

> **See [Workflow Phases & Template](references/workflow-phases-template.md)** for the exact breakdown of layers, governance checklist requirements, and the Markdown output template that MUST be used.

---
*(Note: The references `interact.md`, `journeys.md`, and `testing.md` found in the references folder are passive user guides and do not dictate active agent behavior).*