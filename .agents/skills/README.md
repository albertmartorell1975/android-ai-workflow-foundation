# Expert Skills Index

This index describes the Foundation's skills by **operational status** and **role**.

A skill has one canonical location in the Foundation repository:

* `.agents/skills/` → **Active Foundation Skills**, installed by default.
* `.agents/catalog/` → **Optional Skills & Workflows**, available on demand.

The categories within each location describe the **role** of a skill, not its origin or installation status.

A catalog skill becomes active in a consuming project only when it is explicitly installed or activated.

---

## 1. Active Foundation Skills

Skills installed automatically under `.agents/skills/` when the Foundation is added to a project. 
These provide the mandatory core engine and the shared technical standards.

### 1.1 Core Workflow Engine
The operational backbone responsible for project lifecycle, automation, and governance.

* **compiler**: Centralized project verification, compilation, and deployment engine.
* **foundation-evolve**: Synchronizes useful skills and improvements from working projects back to the Foundation.
* **git-governance**: Enforces Git Flow conventions, branching rules, and commit practices.
* **workflow-feature**: Foundation-native single-agent feature workflow.
* **workflow-initializer**: Project bootstrapping, stack diagnosis, customization, plugin management, and workflow selection.

### 1.2 Shared Engineering Guardrails
Technical standards shared by the active Foundation environment regardless of the selected development workflow.

* **dependency-manager**: Governance for `libs.versions.toml` and dependency compatibility.
* **design-system-governance**: Design System standards covering Material 3, accessibility, RTL, adaptive UI, and reusability.
* **kotlin-style**: Kotlin coding conventions, project-specific style rules, and Magic Literal prevention.
* **testing-setup**: Unified strategy for unit, UI behavior, and visual regression testing.
* **viewmodel-architecture-governance**: Architectural rules for ViewModels, UI state, and initialization patterns.

### 1.3 Android & System Patterns
Active technical knowledge for Android, Kotlin, Compose, and platform-specific engineering.

Examples include:

* **adaptive**: Adaptive UI across phones, tablets, foldables, laptops, TV, and XR.
* **android-cli**: Android CLI commands, SDK management, emulators, and related tooling.
* **android-intent-security**: Secure communication between Android components.
* **compose-focus-navigation**: Focus handling for TV, keyboard, and D-pad navigation.
* **compose-modifier-and-layout-style**: Compose layout APIs, modifier chains, and custom layout decisions.
* **compose-recomposition-performance**: Analysis of recomposition and UI performance issues.
* **compose-side-effects**: Safe handling of Compose side effects.
* **compose-stability-diagnostics**: Compose parameter stability and skippability analysis.
* **compose-state-authoring**: Patterns for creating and managing Compose state.
* **compose-state-hoisting**: State ownership and coordination patterns.
* **compose-ui-testing-patterns**: Compose UI, screenshot, and semantics testing patterns.
* **edge-to-edge**: Modern system bar and IME inset handling.
* **kotlin-control-flow**: Kotlin branching and control-flow patterns.
* **kotlin-coroutines-structured-concurrency**: Structured coroutine design and lifecycle safety.
* **kotlin-flow-state-event-modeling**: State, event, and Flow modelling patterns.
* **kotlin-functions**: Kotlin function and extension design.
* **navigation-3**: Jetpack Navigation 3 patterns and integration.
* **r8-analyzer**: R8/ProGuard analysis and application-size optimization.

The complete active set is defined by the skills physically installed under `.agents/skills/`.

> External origin does not imply optional status. A skill created by an external expert can still be an active Foundation skill when it is installed under `.agents/skills/`.

---

## 2. Optional Catalog Skills & Workflows

The catalog contains skills and workflows that are **not installed by default**. 
They are activated when a project requires a specialized capability.

### 2.1 Methodology Workflows
Alternative development methodologies.

#### AI Expert Workflow
A multi-agent development workflow originally created by **Antonio Leiva / Nino Ruano** for the **AI Expert** course.
When active, it replaces `workflow-feature` as the feature orchestration methodology.

### 2.2 Planning & Routing Plugins
Extensions to the development workflow for specific project management or architectural discovery needs.

* **to-plan**: Repository-aware implementation planning around external issues or specifications.
* **using-chrisbanes-skills**: Intelligent router to identify precise expert patterns for Kotlin and Compose based on Chris Banes' best practices.

### 2.3 Technology & Expert Plugins
Optional technical capabilities that depend on the specific project stack.

* **hilt**: Dependency Injection boundaries and optimizations.
* **room-schema-governance**: Room database integrity and schema evolution.
* **firebase-* Suite**: CLI setup, Auth patterns, and Remote Config management.
* **camerax**: Camera and Media3 integration patterns.
* **wear-compose-m3**: Material 3 patterns for Wear OS.
* **perfetto-trace-analysis**: Performance and trace analysis.
* **verified-email**: Email verification using Android Credential Manager.
* **agp-9-upgrade**: Android Gradle Plugin 9 migration guidance.

The complete optional set is available under `.agents/catalog/`.

---

## Operational Distinction

```text
.agents/skills/   → Active Skills (Installed by default)
.agents/catalog/  → Optional Plugins (Available on demand)
```

---

## Credits & Provenance

The Foundation incorporates knowledge from:
* **Foundation Methodology**: Albert Martorell Garcia.
* **AI Expert Workflow**: **Antonio Leiva** / **Nino Ruano**.
* **Expert Patterns**: **Chris Banes** and others.
* **Official Docs**: Google Android & Firebase.

Included skills retain their original authorship and source metadata. Please respect the corresponding licenses and attribution requirements.

---
**Note**: Active skills must follow the *Mandatory Planning Protocol* defined in `AGENTS.md`.
