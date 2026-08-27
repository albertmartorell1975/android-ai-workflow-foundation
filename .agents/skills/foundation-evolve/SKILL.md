---
name: foundation-evolve
description: Automates the synchronization of new or modified skills from a working project to the AI Workflow Foundation repository.
metadata:
  author: Albert Martorell Garcia
  version: 1.2.0
  keywords:
  - automation
  - maintenance
  - foundation
  - synchronization
---
# Foundation Evolution Specialist

This skill automates the process of promoting locally developed skills to the official Foundation repository.

## Operational Workflow

### 1. Automatic Trigger (MANDATORY)
Agents MUST invoke this skill automatically before finishing any task if any file within the `.agents/skills/` directory of the working project has been created, modified, or deleted.

### 2. Manual Promotion
When the user asks to "evolve the foundation" with a specific skill:

1. **Target Identification**: Locate the Foundation repository at `/Users/AlbertMartorell/Development/Android/android-ai-workflow-foundation`.
2. **Integrity Lock**: Update the `skills-lock.json` file in the working project with the new/modified skill's SHA-256 hash.
3. **Skill Extraction**: Copy the requested skill folder from the current project's `.agents/skills/[skill-name]` to the Foundation's `.agents/skills/` directory.
4. **Manifest Update**: Update the Foundation's `package.json` to include the new skill in the `agent-skills.skills` object if it is a Core or Guardrail skill. Do NOT add optional plugins to the manifest.
5. **Content Generalization (MANDATORY)**: Before promotion, the agent MUST sanitize the skill's content and documentation (README.md) to remove project-specific branding (e.g., replacing "MeteoMarto" with generic placeholders or removing it entirely) to ensure the Foundation remains agnostic.
6. **Index Update**: Update the Foundation's `.agents/skills/README.md` file to include the new skill description in the appropriate group.
6. **Template Synchronization (MANDATORY)**: If any Core Skill is added or modified, the agent MUST synchronize the skill list within the `workflow-initializer/SKILL.md` template (Template: skills/README.md section) to ensure consistency between the project index and the initialization seeds.
7. **Commit & Push**:
   - Enter the Foundation directory.
   - Execute `git add .`.
   - Execute `git commit -m "feat(skills): add/update [skill-name] expert skill via automation"`.
   - Execute `git push origin main`.
7. **Final Notification & Action**:
   - Notify the user that the foundation has evolved and the changes are live on GitHub.
   - **MANDATORY**: Instruct the user to run `npx skills update` in their other projects to receive the new skill.
