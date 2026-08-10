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

### 1. Syncing changes in your Projects (For Users)
To receive the latest improvements from the foundation in your active projects, run:
```bash
npx skills update
```
*Note: This command updates the logic inside `.agents/skills/` but will **never** overwrite your project-specific `AGENTS.md` or `rules.md` files.*

### 2. Evolving the Foundation (For Maintainers)
To add a new skill to this seed and propagate it to all your projects:
1. **Develop local skill**: Create and test your new skill at `.agents/skills/[skill-name]/SKILL.md` in your working project.
2. **Copy to Foundation**: Copy the skill directory to your local `android-ai-workflow-foundation/.agents/skills/` folder.
3. **Update Manifest**: Add the new skill path to `package.json` under the `agent-skills.skills` section.
4. **Commit & Push**:
```bash
git add .
git commit -m "feat(skills): add [skill-name] expert skill"
git push origin main
```
5. **Update Projects**: Run `npx skills update` in any other project to receive the new skill.

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
- **Expert Curated Skills**: Access to a library of best-practice skills for Compose, Hilt, Firebase, and more.

## 🙏 Acknowledgments & Credits

This workflow foundation orchestrates collective intelligence from several sources:
- **Core Methodology**: Developed by Albert Martorell Garcia.
- **External Expert Patterns**: Includes curated skills and patterns from renowned community experts, such as **Chris Banes** (especially regarding Compose performance and stability).
- **Official Documentation**: Integrates knowledge based on official Android and Firebase best practices from **Google**.

All included skills retain their original author metadata in the YAML frontmatter. If you use this seed, please respect the licenses and authorship of the included modules.
