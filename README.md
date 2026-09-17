# 🚀 Android AI Workflow Foundation v1.0

Exploring how AI agents can become part of a disciplined software engineering process.

Android AI Workflow Foundation is a structured, AI-assisted development workflow for Android and KMP projects.

It provides a reusable set of workflows, skills and technical guardrails that help AI agents operate within established engineering practices, including Clean Architecture, SOLID, testing, code quality and project-specific technical constraints.

The goal is not to automate software development completely, but to establish a human-supervised development model where AI can assist with implementation while the developer remains responsible for architecture, technical decisions and final validation.

The foundation is continuously evolving through experimentation and real-world Android projects. Each application is used as a feedback loop to validate the workflow, discover limitations and refine the skills and guardrails.

---

## 🛠 Installation

### Scenario A: New Projects (Full Setup)
1. Initialize your new Android project.
2. Run the following command in the project's root directory:
```bash
npx skills add albertmartorell1975/android-ai-workflow-foundation && echo ">>> SUCCESS: Core & Guardrails installed. NEXT STEP: Open Android Studio and say 'Activate workflow-initializer' to configure your Tech Stack and select optional Plugins (Firebase, CameraX, etc.) from the catalog."
```
3. **IMPORTANT**: Open **Android Studio** and the Agent chat, then type:
**"Activate workflow-initializer"**

### Scenario B: Existing Projects (Add Capabilities)
Run the same command. Version 1.0 will install the **Core** and **Guardrail** skills automatically, improving your existing project's quality without adding noise.

---

## 📦 Modular Skill Architecture (Multi-Workflow)
To maximize AI performance and minimize context noise, the foundation is now a **multi-workflow framework**. You can choose your preferred methodology during initialization.

### 🏟️ 1. The Field: `.agents/skills/` (Starters)
These skills are **installed automatically** via `npx skills add`. They represent the engine and the shared Android guardrails.
- **Core Engine**: `workflow-initializer`, `workflow-feature`, `git-governance`, `compiler`, `to-plan`.
- **Expert Guardrails**: `testing-setup`, `viewmodel-architecture-governance`, `kotlin-style`, `design-system-governance`, etc.
- **System & Compose Patterns**: `android-cli`, `r8-analyzer`, `navigation-3`, `edge-to-edge`, `compose-stability`, etc.

### 🪑 2. The Bench: `.agents/catalog/` (Substitutes)
On-demand plugins and specialized workflows:
- **Workflows**: `ai-expert-workflow` (DevExpert).
- **Architecture**: `hilt`, `room-schema-governance`.
- **Plugins**: `firebase-*`, `camerax`, `wear-compose-m3`, `perfetto-*`, `verified-email`, etc.

---

## 🛠 How to Select a Workflow
During the `Activate workflow-initializer` process, you will be asked to select an **Active Workflow**:

1. **Foundation Workflow**: The native, lean Android AI Workflow Foundation methodology.
2. **AI Expert Workflow**: A complete AI expert development workflow.

The selection is persisted in `.agents/workflow.json` and automatically installs all necessary dependencies.

---

## 🔄 Maintaining & Updating

### 1. Syncing active Skills
To receive the latest improvements for the skills already "on the field" in your active projects, run:
```bash
npx skills update
```

### 2. Refreshing the Catalog
The catalog skills are fetched directly from GitHub during on-demand installation, ensuring you always get the latest expert patterns without having to manage them manually.

### 3. Evolving the Foundation (For Maintainers)
Use the **foundation-evolve** skill to promote local project skills to either the `skills/` (mandatory) or `catalog/` (optional) directories in this repository.


---

## 🙏 Acknowledgments & Credits

This workflow foundation orchestrates collective intelligence from several sources:
- **Core Methodology**: Developed by Albert Martorell Garcia.
- **External Expert Patterns**: Includes curated skills from experts like **Chris Banes**.
- **Official Documentation**: Integrates knowledge from **Google** Android and Firebase teams.

All included skills retain their original author metadata. Please respect the licenses and authorship of the included modules.
