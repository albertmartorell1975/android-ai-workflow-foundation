# 🚀 Android AI Workflow Foundation v1.0

Built on Clean Architecture, SOLID principles, and a modular 3-Group Skill Architecture, the foundation explores how AI agents can be structured and guided within an existing IDE to support software development while keeping engineering decisions under developer control.

This foundation is continuously evolving through experimentation and application to Android projects. The workflow, skills and guardrails are refined as new use cases and learnings emerge.

---

## 🛠 Installation

### Scenario A: New Projects (Full Setup)
1. Initialize your new Android or KMP project.
2. Run the following command in the project's root directory:
```bash
npx skills add albertmartorell1975/android-ai-workflow-foundation -y && echo ">>> SUCCESS: Core & Guardrails installed. NEXT STEP: Open Android Studio and say 'Activate workflow-initializer' to configure your Tech Stack and select optional Plugins (Firebase, CameraX, etc.) from the catalog."
```
3. **IMPORTANT**: Open **Android Studio** and the Agent chat, then type:
**"Activate workflow-initializer"**

### Scenario B: Existing Projects (Add Capabilities)
Run the same command. Version 1.0 will install the **Core** and **Guardrail** skills automatically, improving your existing project's quality without adding noise.

---

## 🔄 Maintaining & Updating

### 1. Syncing changes in your Projects (For Users)
To receive the latest improvements from the foundation in your active projects, run:
```bash
npx skills update
```

### 2. Evolving the Foundation (For Maintainers)
Use the **foundation-evolve** skill to automate the promotion of local skills to this repository.

---

## 📦 Modular Skill Architecture (v1.0)
To maximize AI performance and minimize context noise, skills are organized into three groups:

### 🟢 1. Core (Installed by Default)
The engine of the workflow: `workflow-initializer`, `workflow-feature`, `git-governance`, `compiler`, `foundation-evolve`.

### 🔵 2. Expert Guardrails (Installed by Default)
Professional quality standards for every project:
- **Architecture**: `hilt`, `testing-setup`, `compose-ui-testing-patterns`.
- **System**: `android-cli`, `r8-analyzer`, `adaptive`, `navigation-3`, `edge-to-edge`, `android-intent-security`.
- **Compose/Kotlin Quality**: `compose-stability`, `compose-state-hoisting`, `compose-state-authoring`, `kotlin-flow-modeling`, `kotlin-functions`.

### 🟡 3. On-Demand Plugins (Optional)
Specialized domains activated via the Wizard:
- `to-plan`, `firebase-*`, `camerax`, `compose-animations`, `kmp-expect-actual`, `perfetto-*`, `wear-compose`, `billing`, and more.

[See the Full Expert Skills Index for details](.agents/skills/README.md).

---

## 🙏 Acknowledgments & Credits

This workflow foundation orchestrates collective intelligence from several sources:
- **Core Methodology**: Developed by Albert Martorell Garcia.
- **External Expert Patterns**: Includes curated skills from experts like **Chris Banes**.
- **Official Documentation**: Integrates knowledge from **Google** Android and Firebase teams.

All included skills retain their original author metadata. Please respect the licenses and authorship of the included modules.
