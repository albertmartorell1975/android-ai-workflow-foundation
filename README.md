# 🚀 Android AI Workflow Foundation

A standardized, AI-assisted development workflow seed for Android and KMP projects. Built on Clean Architecture, SOLID principles, and a strict Human-in-the-loop governance.

## 🛠 Installation

### Scenario A: New Projects (Full Setup)
1. Initialize your new Android or KMP project.
2. Run the installation command in the project's root directory:
```bash
npx skills add albertmartorell1975/android-ai-workflow-foundation -y
```
3. **Open Android Studio** and the Agent chat. The agent is proactive! It will detect the foundation and offer to initialize the project if it's not already deployed.
4. **Stack Discovery**: The agent will guide you through a diagnosis to configure your tech stack (MVI/MVVM, Hilt/Koin, etc.).

### Scenario B: Existing Projects (Add Capabilities)
If you already have a workflow but want to add these specific foundation skills:
1. Run the same command as above.
2. The tools will be added to your `.agents/skills/` folder without overwriting your project-specific configurations.

---

## 🔄 Maintaining & Updating

### 1. Modifying the Seed (The Foundation)
If you want to evolve your workflow (add new skills, change rules, etc.):
- Perform the changes in your local `android-ai-workflow-foundation` folder.
- Update the `package.json` if you added/removed skill files.
- Commit and push to GitHub.

### 2. Updating your Active Projects
To receive the latest improvements from this foundation in your active projects, simply run:
```bash
npx skills update
```
*Note: This command will update the skills' logic but will NOT overwrite your project-specific `AGENTS.md` file, preserving your project-level customizations.*

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
