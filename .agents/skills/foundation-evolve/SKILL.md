---
name: foundation-evolve
description: Automates the synchronization of new or modified skills from a working project to the AI Workflow Foundation repository.
metadata:
  author: Albert Martorell Garcia
  version: 1.0.0
  keywords:
  - automation
  - maintenance
  - foundation
  - synchronization
---
# Foundation Evolution Specialist

This skill automates the process of promoting locally developed skills to the official Foundation repository.

## Operational Workflow

When the user asks to "evolve the foundation" with a specific skill:

1. **Target Identification**: Locate the Foundation repository at `/Users/AlbertMartorell/Development/Android/android-ai-workflow-foundation`.
2. **Skill Extraction**: Copy the requested skill folder from the current project's `.agents/skills/[skill-name]` to the Foundation's `.agents/skills/` directory.
3. **Manifest Update**: Update the Foundation's `package.json` to include the new skill in the `agent-skills.skills` object.
4. **Commit & Push**:
   - Enter the Foundation directory.
   - Execute `git add .`.
   - Execute `git commit -m "feat(skills): add/update [skill-name] expert skill via automation" `.
   - Execute `git push origin main`.
5. **Completion**: Notify the user that the foundation has evolved.
