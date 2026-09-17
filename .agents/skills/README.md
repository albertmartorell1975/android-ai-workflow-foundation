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

They provide the common engineering environment shared by all projects and workflows.

### 1.1 Core Workflow

The operational backbone responsible for project initialization, workflow orchestration, planning, automation, and governance.

* **compiler**: Centralized project verification, compilation, and deployment engine.
* **foundation-evolve**: Synchronizes useful skills and improvements from working projects back to the Foundation.
* **git-governance**: Enforces Git Flow conventions, branching rules, and commit practices.
* **to-plan**: Repository-aware implementation planning from confirmed requirements.
* **workflow-feature**: Foundation-native single-agent feature workflow.
* **workflow-initializer**: Project bootstrapping, stack diagnosis, customization, plugin management, and workflow selection.

### 1.2 Shared Engineering Guardrails

Technical standards shared by the active Foundation environment regardless of the selected development workflow.

* **dependency-manager**: Governance for `libs.versions.toml` and dependency compatibility.
* **design-system-governance**: Design System standards covering Material 3, accessibility, RTL, adaptive UI, and reusability.
* **kotlin-style**: Kotlin coding conventions, project-specific style rules, and Magic Literal prevention.
* **testing-setup**: Unified strategy for unit, UI behavior, and visual regression testing.
* **viewmodel-architecture-governance**: Architectural rules for ViewModels, UI state, and initialization patterns.

### 1.3 Android & Expert Skills

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
* **using-chrisbanes-skills**: Entry point for broader Kotlin and Compose expert reviews.

The complete active set is defined by the skills physically installed under `.agents/skills/`.

> External origin does not imply optional status. A skill created by an external expert can still be an active Foundation skill when it is installed under `.agents/skills/`.

---

## 2. Optional Catalog Skills & Workflows

The catalog contains skills and workflows that are **not installed by default**.

They can be activated when a project requires a specialized capability or a different development methodology.

### 2.1 Workflow Plugins

Complete alternative development methodologies.

#### AI Expert Workflow

A multi-agent development workflow originally created by **Antonio Leiva / Nino Ruano** for the **AI Expert** course and integrated and adapted for use in other projects with the author's permission.

It consists of:

* **build-brief**: Guided project and feature discovery.
* **harness-starter**: Creates the minimal project harness from the confirmed discovery.
* **feature-spec**: Creates implementation-ready feature specifications.
* **feature-implementer**: Implements the approved specification.
* **feature-validator**: Independently validates the implementation.
* **feature-flow**: Orchestrates the workflow and coordinates the specialized agents.

When the AI Expert Workflow is active, it replaces `workflow-feature` as the feature orchestration methodology.

### 2.2 Technology & Expert Plugins

Optional technical capabilities that depend on the specific project or technology stack.

Examples include:

* **hilt**: Dependency Injection boundaries and optimizations.
* **room-schema-governance**: Room database integrity and schema evolution.
* **firebase-basics**: Firebase project and CLI fundamentals.
* **firebase-auth-basics**: Firebase authentication patterns.
* **firebase-remote-config-basics**: Remote configuration and feature flags.
* **camerax**: Camera and Media3 integration patterns.
* **wear-compose-m3**: Material 3 patterns for Wear OS.
* **perfetto-trace-analysis**: Performance and trace analysis.
* **verified-email**: Email verification using Android Credential Manager.
* **agp-9-upgrade**: Android Gradle Plugin 9 migration guidance.

The complete optional set is available under `.agents/catalog/`.

---

## Active Skills vs. Catalog

The operational distinction is:

```text
.agents/skills/
    ↓
Active Foundation Skills
    ↓
Installed by default
    ↓
Shared project capabilities
```

```text
.agents/catalog/
    ↓
Optional Skills & Workflows
    ↓
Activated on demand
    ↓
Project-specific capabilities or alternative methodologies
```

The same skill does not belong to both locations in the Foundation repository.

For example:

```text
Foundation repository
.agents/catalog/hilt/
        │
        │ activate / install
        ▼
Consuming project
.agents/skills/hilt/
```

After activation, the skill becomes part of that project's active skill set, but it remains a catalog skill in the Foundation repository.

---

## Role vs. Origin

A skill's **role**, **location**, and **origin** are separate concepts.

For example, a skill can be:

```text
Location: .agents/skills/
Role: Android & Expert Skill
Origin: Chris Banes
Status: Active
```

Likewise, another skill can be:

```text
Location: .agents/catalog/
Role: Technology Plugin
Origin: Foundation / external expert
Status: Optional
```

Authorship or external provenance does not determine whether a skill is active or optional.

---

## Credits & Provenance

The Foundation incorporates knowledge and methodologies from multiple sources.

* **Foundation Methodology:** Albert Martorell Garcia.
* **AI Expert Workflow:** **Antonio Leiva** y **Nino Ruano**, originally created for the AI Expert course.
* **External Expert Patterns:** Includes curated skills from experts such as **Chris Banes**.
* **Official Documentation:** Integrates knowledge and guidance from Google Android and Firebase documentation.

Included skills retain their original authorship and source metadata. Please respect the corresponding licenses and attribution requirements.

---

**Note:** Active skills must follow the *Mandatory Planning Protocol* defined in `AGENTS.md`.
