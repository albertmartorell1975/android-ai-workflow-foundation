# Interacting with the Workflow Skill

This document describes how to effectively interact with the `workflow-feature` skill to ensure the best results during the feature planning phase.

## Triggering the Skill
To start a new feature workflow, provide a clear description of the feature to the AI. Example:
> "I want to implement a new feature that allows users to save their favorite cities and view them in a list."

## Common Pitfalls (Ambiguity vs. Precision)
To get a high-quality workflow, avoid vague requests. The more specific the input, the more granular the checklist.

| Vague Request (Low Quality) | Precise Request (High Quality) |
| :--- | :--- |
| "I want a login screen." | "I want a login with Firebase Auth that persists the user token in Room for offline access." |
| "Add a search bar." | "Add a search bar in the HomeScreen that filters the city list in real-time using a StateFlow." |
| "Show notifications." | "Send a push notification via Firebase when the current temperature exceeds a threshold from Remote Config." |

## Refinement Process
The AI will analyze your request and may ask all the necessary clarification questions. Providing detailed answers here is crucial as it shapes the entire technical design.

### Customizing Granularity
You can always ask for more detail in specific stages of the generated workflow.
- *Example*: "The checklist for the Data Layer is too broad. Please break down step 2 into smaller tasks for Room migrations."

## Modifying the Workflow
If the generated `WORKFLOW_[FEATURE_NAME].md` needs changes, you can ask the agent to refine specific sections:
- "Add a new endpoint for deleting favorites to the API Design section."
- "Include Room migrations in the Persistence layer."

## Closure Rules
A planning session using this skill is only considered **complete** when:
1. The `WORKFLOW_[FEATURE_NAME].md` file has been created at the root.
2. All implementation tasks are listed as empty checkboxes `[ ]`, ready for the developer to track progress.
3. The technical overview aligns with the **Zero Leakage** policy defined in `AGENTS.md`.
