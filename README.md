# 🚀 Android AI Workflow Foundation

A standardized, AI-assisted development workflow seed for Android and KMP projects. Built on Clean Architecture, SOLID principles, and a strict Human-in-the-loop governance.

## 🛠 Installation

### Scenario A: New Projects (Full Setup)
1. Initialize your new Android or KMP project.
2. Run the following command in the project's root directory:
```bash
npx skills add albertmartorell1975/android-ai-workflow-foundation -y && echo "--- SUCCESS: Foundation installed. Next step: Open Android Studio and say: Activate workflow-initializer ---"
```
3. **Open Android Studio** and the Agent chat.
4. **Initial Trigger**: Type **"Activate workflow-initializer"** to start the setup. The agent will guide you through the stack diagnosis and auto-deploy your governance files (`rules.md` and `AGENTS.md`).

### Scenario B: Existing Projects (Add Capabilities)
If you already have a workflow but want to add these specific foundation skills, run the same command. The tools will be added to your `.agents/skills/` folder without overwriting your existing root configurations.

---

## 🔄 Maintaining & Updating

### 1. Updating the Foundation (For Maintainers)
If you add, remove, or modify a skill in the foundation repository:
1. Modify the files in the `.agents/skills/` directory.
2. If you added a **new skill file**, update the `package.json` to include it.
3. Commit and push your changes to GitHub.

### 2. Syncing changes in your Projects (For Users)
To receive the latest improvements from the foundation in your active projects, run:
```bash
npx skills update
```
*Note: This command updates the logic inside `.agents/skills/` but will **never** overwrite your project-specific `AGENTS.md` or `rules.md` files.*

---

## 🛡 Governance Features
- **Gateway Protocol**: Agents never code without a human-approved plan (Diagnosis -> Questions -> Optimized Prompt).
- **Atomic Commits**: Standardized Git Flow and module-scoped commit naming.
- **Clean Architecture Enforcement**: Strict boundaries between Domain, Data, UseCases, and UI layers.

## 📦 Skills Included
- **workflow-initializer**: Auto-deployment of AI governance and stack setup.
- **workflow-feature**: Automated Clean Architecture implementation checklists.
- **git-governance**: Enforced Git Flow and commit conventions.
- **to-plan**: Repository-aware implementation planning.
