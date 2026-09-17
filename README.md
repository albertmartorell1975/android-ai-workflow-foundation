# 🚀 Android AI Workflow Foundation v3.0.0

Exploring how AI agents can become part of a disciplined software engineering process.

Android AI Workflow Foundation is a modular, structured development framework for Android projects. It allows developers to choose between different agentic methodologies while sharing a common core of Android expert guardrails.

The goal is not to automate software development completely, but to establish a human-supervised development model where AI can assist with implementation while the developer remains responsible for architecture, technical decisions and final validation.

---

## 🏗 Modular Multi-Workflow Architecture

The foundation is organized as a pluggable system that scales with your project needs:

### 🟢 1. Core Engine (Motor)
The essential skills that manage the foundation itself. Installed automatically via `npx skills add`.
- `workflow-initializer`, `workflow-feature`, `foundation-evolve`, `git-governance`, `compiler`, `to-plan`.

### 🔵 2. Shared Expert Guardrails
Professional quality standards shared across all workflows. Installed automatically via `npx skills add` to ensure architectural integrity:
- **Style & Architecture**: `kotlin-style`, `viewmodel-architecture-governance`, `testing-setup`, `design-system-governance`, `dependency-manager`.
- **System & Compose**: `android-*`, `compose-*`, `edge-to-edge`, `navigation-3`, `r8-analyzer`, `adaptive`.

### 🟡 3. Workflow & Architecture Selection
During initialization (`workflow-initializer`), the foundation allows you to select your preferred methodology and tools:

*   **Workflows**: Choose between the native **Foundation Workflow** or the **AI Expert Workflow** (optional plugin).
*   **Architecture**: Opt-in to specialized plugins like **Hilt** or **Room Schema Governance**.
*   **Domain Plugins**: Activate on-demand plugins for **Firebase**, **CameraX**, **Perfetto**, and more.

---

## 🛠 Installation

### Scenario A: New Projects (Full Setup)
1. Initialize your new Android project.
2. Run the following command in the project's root directory:
```bash
npx skills add albertmartorell1975/android-ai-workflow-foundation && echo ">>> SUCCESS: Motor installed. NEXT STEP: Open Android Studio and say 'Activate workflow-initializer' to deploy Guardrails and select your Workflow."
```
3. **IMPORTANT**: Open **Android Studio** and the Agent chat, then type:
**"Activate workflow-initializer"**

### Scenario B: Existing Projects (Add Capabilities)
Run the same command. Version 3.0.0 will install the **Motor** skills. Then, run the **workflow-initializer** to deploy the **Guardrails** and select or migrate your workflow.

---

## 🛠 How to Install Optional Plugins & Workflows
If your project needs a specialized skill or a different workflow from the catalog, you have two ways to "bring them to the field":

1.  **The Wizard (Recommended)**: Run `Activate workflow-initializer` in Android Studio. During the setup, the agent will present the complete catalog and install your choices automatically.
2.  **On-Demand Chat**: At any time, simply ask the agent: *"Install the [plugin-name] plugin from the catalog"*. The agent will fetch the latest expert patterns from GitHub and set them up for you.

---

## 🔄 Maintaining & Updating

### 1. Syncing active Skills
To receive the latest improvements for the skills already active in your projects (Motor and Guardrails), run:
```bash
npx skills update
```

### 2. Refreshing the Catalog
Catalog skills and workflows are fetched directly from GitHub during on-demand installation, ensuring you always get the latest expert knowledge without manual management.

### 3. Evolving the Foundation (For Maintainers)
Use the **foundation-evolve** skill to promote local project skills to either the `skills/` (mandatory) or `catalog/` (optional) directories in this repository.


---

## 🙏 Acknowledgments & Credits

This workflow foundation orchestrates collective intelligence from several sources:
- **Core Methodology**: Developed by Albert Martorell Garcia.
- **External Expert Patterns**: Includes curated skills from experts like **Chris Banes**.
- **AI Expert Workflow**: Developed by **Antonio Leiva / DevExpert** for the **AI Expert** course.
- **Official Documentation**: Integrates knowledge from **Google** Android and Firebase teams.

All included skills retain their original author metadata. Please respect the licenses and authorship of the included modules.
