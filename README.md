# 🚀 Android AI Workflow Foundation v3.0.0

Exploring how AI agents can become part of a disciplined, human-supervised software engineering process.

**Android AI Workflow Foundation** is a modular development framework for Android projects. It provides a shared foundation of engineering standards, technical expertise, and governance while allowing projects to choose how AI agents collaborate during feature development.

The goal is not to automate software development completely. The developer remains responsible for architecture, technical decisions, review, and final validation.

---

## 🏗 Architecture

The Foundation separates three concerns:

```text
Foundation Core
      │
      ├── Project Initialization
      ├── Engineering Governance
      ├── Android & Kotlin Expertise
      └── Technical Guardrails
                │
                ▼
        Workflow Selection
          ┌─────┴─────┐
          │           │
     Foundation    AI Expert
      Workflow     Workflow
     Single Agent  Multi-Agent
```

The same Foundation can therefore support different AI-assisted development methodologies while sharing the same engineering standards, technical expertise, and project governance.

The selected workflow determines **how feature development is organized**. The Foundation Core defines **the technical environment and constraints under which that work takes place**.

---

## 🛠 Installation & Setup

The Foundation uses a two-step setup process. The same process works for both **new** and **existing** Android projects.

### Step 1: Install the Foundation

Run the following command from your project's root directory:

```bash
npx skills add albertmartorell1975/android-ai-workflow-foundation
```

This installs the **Active Foundation Skills** into:

```text
.agents/skills/
```

These skills provide the Foundation's core workflow capabilities, shared engineering guardrails, and Android & Kotlin expertise.

### Step 2: Activate the Initializer

Open **Android Studio**, open the Agent chat, and type:

```text
Activate workflow-initializer
```

The initializer will guide you through the project setup:

1. **Workflow Selection**
   Choose between the **Foundation Workflow** (single-agent) and the **AI Expert Workflow** (multi-agent).

2. **Stack Diagnosis**
   Analyze the project context and configure project-specific information such as architecture, persistence, dependency injection, and existing technical conventions.

3. **Catalog Activation**
   Select optional skills and workflow plugins from `.agents/catalog/` according to the project's needs.

The selected workflow is stored in:

```text
.agents/workflow.json
```

### Result

After initialization, the project has a customized Foundation environment:

```text
.agents/
├── skills/          # Active Foundation + selected catalog skills
├── catalog/         # Available optional skills and workflows
├── AGENTS.md        # Project-specific agent instructions
├── rules.md         # Project-specific workflow rules
└── workflow.json    # Active development workflow
```

The Foundation provides the shared engineering environment, while the selected workflow determines how feature development is organized.

---

## 🧩 Managing Skills

The Foundation separates skills by their **operational status** and **role**.

### 1. Active Foundation Skills

These skills are installed automatically under:

```text
.agents/skills/
```

They provide the common capabilities shared by all projects and workflows.

#### Core Workflow

Skills responsible for project initialization, workflow management, automation, and Foundation governance.

* **workflow-initializer**: Project bootstrapping, stack diagnosis, customization, catalog management, and workflow selection.
* **workflow-feature**: Foundation-native single-agent feature workflow.
* **compiler**: Centralized project verification, compilation, and deployment.
* **git-governance**: Git Flow conventions, branching rules, and commit practices.
* **foundation-evolve**: Synchronizes useful skills and improvements from working projects back into the Foundation.

#### Shared Engineering Guardrails

Technical standards shared across the active Foundation environment regardless of the selected workflow.

* **dependency-manager**: Dependency and version-catalog governance.
* **design-system-governance**: Design System standards for Material 3, accessibility, RTL, adaptive UI, and reusability.
* **kotlin-style**: Kotlin coding conventions and project-specific style rules.
* **testing-setup**: Testing strategy covering Unit, UI Behavior, and Visual Regression testing.
* **viewmodel-architecture-governance**: Architectural rules for ViewModels and UI state.

#### Android & Expert Skills

Active technical expertise for Android, Kotlin, Compose, and platform-specific engineering.

Examples include:

* **adaptive**
* **android-cli**
* **android-intent-security**
* **compose-focus-navigation**
* **compose-modifier-and-layout-style**
* **compose-recomposition-performance**
* **compose-side-effects**
* **compose-stability-diagnostics**
* **compose-state-authoring**
* **compose-state-hoisting**
* **compose-ui-testing-patterns**
* **edge-to-edge**
* **kotlin-control-flow**
* **kotlin-coroutines-structured-concurrency**
* **kotlin-flow-state-event-modeling**
* **kotlin-functions**
* **navigation-3**
* **r8-analyzer**
* **using-chrisbanes-skills**

The complete active set is defined by the skills physically installed under `.agents/skills/`.

> A skill's external origin does not make it optional. Once installed under `.agents/skills/`, it is part of the active Foundation environment.

---

### 2. Optional Catalog Skills & Workflows

The catalog contains skills and complete workflows that are **not installed by default**.

They are maintained under:

```text
.agents/catalog/
```

and can be activated when a project requires additional capabilities.

#### Workflow Plugins

Alternative development methodologies.

##### AI Expert Workflow

A multi-agent development workflow originally created by **Antonio Leiva / Nino Ruano** for the **AI Expert** course and integrated and adapted for use in other projects with permission.

It consists of:

* **build-brief**: Guided project and feature discovery.
* **harness-starter**: Creates the minimal project harness from the confirmed discovery.
* **feature-spec**: Creates implementation-ready feature specifications.
* **feature-implementer**: Implements the approved specification.
* **feature-validator**: Independently validates the implementation.
* **feature-flow**: Orchestrates the workflow and coordinates the specialized agents.

When the AI Expert Workflow is active, it replaces `workflow-feature` as the feature orchestration methodology.

#### Planning & Project Management

Optional planning capabilities for projects that need repository-aware planning around external issues or confirmed specifications.

* **to-plan**: Produces a repository-aware implementation plan from a ready GitHub issue or an explicitly confirmed specification.

#### Technology & Expert Plugins

Optional technical capabilities that depend on the project's technology stack or specific needs.

Examples include:

* **hilt**
* **room-schema-governance**
* **firebase-basics**
* **firebase-auth-basics**
* **firebase-remote-config-basics**
* **camerax**
* **wear-compose-m3**
* **perfetto-trace-analysis**
* **verified-email**
* **agp-9-upgrade**

The complete optional set is available under `.agents/catalog/`.

---

## 🔄 Maintaining & Updating

### Syncing Active Skills

To receive the latest improvements for skills already installed in the project:

```bash
npx skills update
```

### Activating Catalog Skills

Catalog skills and workflows can be activated during `workflow-initializer` setup or requested later when the project requires them.

When a catalog skill is activated, it becomes part of the project's active skill set.

The Foundation repository keeps the original catalog entry under:

```text
.agents/catalog/
```

The consuming project receives the activated skill under:

```text
.agents/skills/
```

### Evolving the Foundation

Use the `foundation-evolve` skill to promote useful skills and improvements discovered in working projects back into the Foundation.

The Foundation distinguishes between:

```text
.agents/skills/       Active Foundation skills
.agents/catalog/      Optional skills and workflows
```

A skill has one canonical location in the Foundation repository.

---

## 🙏 Acknowledgments & Credits

This Foundation incorporates knowledge and methodologies from multiple sources:

* **Foundation Methodology:** Albert Martorell Garcia.
* **AI Expert Workflow:** Originally created by **Antonio Leiva / Nino Ruano** for the AI Expert course and integrated into this Foundation with permission.
* **External Expert Patterns:** Includes curated skills from experts such as **Chris Banes**.
* **Official Documentation:** Integrates knowledge and guidance from Google Android and Firebase documentation.

Included skills retain their original authorship and source metadata. Please respect the corresponding licenses and attribution requirements.

---

## Core Principle

> **Same Foundation, different development methodology.**

The Foundation provides a shared engineering environment, while the selected workflow determines how AI agents collaborate to build the software.

```text
Shared Foundation
        │
        ├── Foundation Workflow
        │      └── Single-agent
        │
        └── AI Expert Workflow
               └── Multi-agent
```

In both approaches, the developer remains the highest-level supervisor, responsible for architecture, technical decisions, review, and final validation.
