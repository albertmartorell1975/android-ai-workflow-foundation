# Instructions for Agents

## Project Overview

This repository contains the **Android AI Workflow Foundation**, a modular multi-workflow development framework for Android projects. It provides a shared foundation of engineering standards, technical expertise, and governance while supporting both native single-agent (Foundation) and multi-agent (AI Expert) workflows.

## Read First

* `README.md` — framework overview, architecture, installation, workflow differences, and usage guide.
* `docs/overview.md` — architectural design, modular layers, and workflow routing model.
* `docs/workflow comparison.md` — detailed comparison between Foundation Workflow and AI Expert Workflow.
* `.agents/skills/README.md` — expert skills index (active foundation skills vs. optional catalog skills).

Read additional documentation only when relevant:

* `.agents/skills/` — active foundation skills and technical guardrails.
* `.agents/catalog/` — optional catalog skills and workflow plugins.

## Workflow Governance

`.agents/workflow.json` is the authoritative source for the selected workflow.

Supported workflows:

* `foundation` → Native Android Workflow → `workflow-feature`
* `ai-expert-workflow` → AI Expert Workflow → `feature-flow`

Only the selected workflow may orchestrate feature development. Do not invoke or mix the alternative workflow.

`WORKFLOW_FEATURE.md` may only be created when `activeWorkflow = foundation` and the `workflow-feature` prerequisites are satisfied.

## Project Initialization

**ONLY when `activeWorkflow = ai-expert-workflow`:**

* `build-brief` and `harness-starter` are project-initialization skills.
* Use them when initializing or rebuilding the AI Expert project harness.
* They are not required before every feature.

## Startup Workflow

Before writing code:

1. Confirm the working directory with `pwd`.
2. Read `.agents/workflow.json` and identify `activeWorkflow`.
3. Follow the startup and prerequisite rules of the selected workflow.

### Foundation Workflow

When `activeWorkflow = foundation`:

* Follow the startup and prerequisite steps defined by `workflow-feature`.
* Do not apply AI Expert startup steps.

### AI Expert Workflow

When `activeWorkflow = ai-expert-workflow`:

1. Read `PROGRESS.md` for the current verified state and next step.
2. Read `feature_list.json` and select the first ready unfinished feature in list order.
3. Run `./init.sh`.
4. If baseline verification fails, fix the baseline before starting new feature work.

## Working Rules

* Work on one feature or task at a time.
* Keep changes within the selected feature scope unless a narrow supporting fix is required.
* Follow the git automation rules of the active workflow.
* Never push changes without explicit user authorization.
* Do not perform git operations outside the active workflow's defined process.
* Follow applicable project skills and their detailed rules; do not duplicate them here.
* Apply **KISS**: prefer the simplest solution that satisfies the requirement.
* Do not invent requirements, domain data, or unsupported team insights. State clearly when information is unknown or unverifiable.
* Keep durable project state in repository files rather than relying on chat history.

## Required Artifacts

The required artifacts depend on the selected workflow.

For the AI Expert Workflow:

* `feature_list.json` — feature state.
* `PROGRESS.md` — verified state and session progress.
* `init.sh` — standard startup and verification path.

The Foundation Workflow may use different artifacts defined by `workflow-feature`.

## Definition of Done

A feature is complete only when:

* The target behaviour is implemented.
* Required verification has actually run.
* The selected workflow's acceptance criteria are satisfied.
* Required project state and documentation are updated.
* The repository can be safely continued using the selected workflow.

## End Of Session

Before ending a session:

1. Update the required project state for the selected workflow.
2. Record unresolved risks or blockers.
3. Leave the repository ready for the next agent session.
