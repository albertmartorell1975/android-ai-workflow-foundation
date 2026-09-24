# 🚀 Android AI Workflow Foundation v3.0.0

Exploring how AI agents can become part of a disciplined, human-supervised software engineering process.

**Android AI Workflow Foundation** is a modular development framework for Android projects. It provides a shared foundation of engineering standards, technical expertise, and governance while allowing projects to choose how AI agents collaborate during feature development.

The goal is not to automate software development completely. The developer remains responsible for architecture, technical decisions, review, and final validation.

---

## 🏗 Architecture

The Foundation separates the **shared Android engineering environment** from the **development workflow** used to orchestrate feature work.

```text
ANDROID AI FOUNDATION
        │
        ├── Shared Foundation
        │     ├── Engineering Governance
        │     ├── Android & Kotlin Expertise
        │     ├── Technical Guardrails
        │     └── Verification & Tooling
        │
        └── Development Workflow
              ├── Foundation Workflow
              │      └── Single-agent
              │
              └── AI Expert Workflow
                     └── Multi-agent
```

The same Foundation can therefore support different AI-assisted development methodologies while sharing the same engineering standards, technical expertise, and project governance.

The selected workflow determines **how feature development is organized**. The Foundation defines **the technical environment and constraints under which that work takes place**.

### Workflow Differences

The workflows use the same Foundation but organize feature development differently.

|                      | Foundation Workflow                    | AI Expert Workflow                                            |
| -------------------- | -------------------------------------- | ------------------------------------------------------------- |
| **Model**            | Single-agent                           | Multi-agent                                                   |
| **Orchestrator**     | `workflow-feature`                     | `feature-flow`                                                |
| **Planning**         | Main agent coordinates the feature     | `feature-spec` produces an implementation-ready specification |
| **Implementation**   | Main agent implements and verifies     | `feature-implementer` implements the approved specification   |
| **Validation**       | Verification through Foundation skills | Independent `feature-validator`                               |
| **Feedback loop**    | Direct agent-led workflow              | Explicit `implement → validate → revise` loop                 |
| **Project overhead** | Lower                                  | Higher, due to explicit roles and artifacts                   |
| **Initialization**   | Standard Foundation setup              | `build-brief` → `harness-starter`                             |

### Foundation Workflow

The Foundation Workflow uses a **single agent** to coordinate feature development while relying on the shared Foundation skills for engineering guidance, verification, and governance.

```text
Feature
  ↓
workflow-feature
  ↓
Plan → Implement → Verify
```

### AI Expert Workflow

The AI Expert Workflow uses a **multi-agent process** with explicit responsibilities for specification, implementation, and independent validation.

```text
Feature
  ↓
feature-flow
  ├── feature-spec
  ├── feature-implementer
  └── feature-validator
          ↓
     Accept / Revise
```

---

## 🛠 Installation & Setup

The Foundation uses a two-stage setup: **install the Foundation, then select and activate a development workflow**.

### Step 1: Install the Foundation

Run the following command from your project's root directory:

```bash
npx skills add albertmartorell1975/android-ai-workflow-foundation
```

This installs the shared Foundation skills into:

```text
.agents/skills/
```

These skills provide the common engineering capabilities, Android & Kotlin expertise, technical guardrails, verification, and Foundation governance.

### Step 2: Activate the Initializer

Open **Android Studio**, open the Agent chat, and type:

```text
Activate workflow-initializer
```

The initializer guides the project setup:

1. **Workflow Selection**
   Choose between the **Foundation Workflow** (single-agent) and the **AI Expert Workflow** (multi-agent).

2. **Workflow Activation**
   The selected workflow is recorded in:

   ```text
   .agents/workflow.json
   ```

   If the AI Expert Workflow is selected, its required workflow skills are installed from the catalog.

3. **Stack Diagnosis**
   Configure project-specific information such as architecture, persistence, dependency injection, and existing technical conventions.

4. **Optional Catalog Skills**
   Select additional technical or planning skills from `.agents/catalog/` when required.

### Step 3: AI Expert Project Initialization

Only when `ai-expert-workflow` is selected:

```text
build-brief
     ↓
harness-starter
     ↓
AI Expert project ready
```

* `build-brief` performs project and feature discovery.
* `harness-starter` creates the project harness from the confirmed discovery.

These skills are **not part of the normal feature cycle** and are not required before every feature.

### Result

After initialization, the project contains a customized Foundation environment:

```text
.agents/
├── skills/          # Active Foundation + selected workflow/catalog skills
├── catalog/         # Available optional skills and workflows
├── AGENTS.md        # Project-specific agent instructions
├── rules.md         # Project-specific workflow rules
└── workflow.json    # Selected development workflow
```

---

## 🧩 Managing Skills

The Foundation separates skills by **installation status** and **role**.

### 1. Shared Foundation Skills

Installed automatically under:

```text
.agents/skills/
```

These provide capabilities shared by both workflows.

Examples:

* `workflow-initializer`
* `compiler`
* `git-governance`
* `foundation-evolve`
* `dependency-manager`
* `testing-setup`
* `design-system-governance`
* `kotlin-style`
* `viewmodel-architecture-governance`
* Android, Kotlin, Compose, security, and platform expertise

### 2. Workflow Skills

Workflow-specific skills are installed according to the selected methodology.

#### Foundation Workflow

```text
workflow-feature
```

Provides the Foundation's native **single-agent feature workflow**.

#### AI Expert Workflow

```text
build-brief
harness-starter
feature-spec
feature-implementer
feature-validator
feature-flow
```

Provides the **multi-agent AI Expert workflow**.

When the AI Expert Workflow is active, `feature-flow` is the feature orchestration entry point and `workflow-feature` must not be used for feature orchestration.

### 3. Optional Catalog Skills

Additional skills remain available under:

```text
.agents/catalog/
```

They can be activated when the project requires specialized capabilities such as Hilt, Room governance, Firebase, CameraX, Perfetto, or other technical expertise.

---

## 🔄 Maintaining & Updating

### Syncing Active Skills

To receive the latest improvements for skills already installed in the project:

```bash
npx skills update
```

### Activating Catalog Skills

Catalog skills can be activated during `workflow-initializer` setup or later when the project requires them.

When activated, the skill becomes part of the project's active skill set.

The Foundation repository keeps the canonical catalog entry under:

```text
.agents/catalog/
```

The consuming project receives the activated skill under:

```text
.agents/skills/
```

### Evolving the Foundation

Use the `foundation-evolve` skill to promote useful skills and improvements discovered in working projects back into the Foundation.

---

## 🙏 Acknowledgments & Credits

This Foundation incorporates knowledge and methodologies from multiple sources:

* **Foundation Methodology:** Albert Martorell Garcia.
* **AI Expert Workflow:** Originally created by Antonio Leiva / Nino Ruano for the AI Expert course and integrated into this Foundation with permission.
* **External Expert Patterns:** Includes curated skills from experts such as Chris Banes.
* **Official Documentation:** Integrates knowledge and guidance from Google Android and Firebase documentation.

Included skills retain their original authorship and source metadata. Please respect the corresponding licenses and attribution requirements.

---

## 🎯 Core Principle

> **Same Foundation, different development methodology.**

The Foundation provides the shared engineering environment. The selected workflow determines how AI agents collaborate to build the software.

```text
ANDROID AI FOUNDATION
        │
        ├── Foundation Workflow
        │      └── Single-agent
        │
        └── AI Expert Workflow
               └── Multi-agent
```

In both approaches, the developer remains the highest-level supervisor, responsible for architecture, technical decisions, review, and final validation.
