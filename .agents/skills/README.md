# Expert Skills Index

This index describes the Foundation's skills by **operational status** and **role**.

A skill has one canonical location in the Foundation repository:

* `.agents/skills/` → **Active Foundation Skills**, installed by default.
* `.agents/catalog/` → **Optional Catalog Skills**, available on demand.

The categories within each location describe the **role** of a skill, not its origin or installation status.

A catalog skill becomes active in a consuming project only when it is explicitly installed or activated.

---

## 1. Active Foundation Skills

Skills installed automatically under `.agents/skills/` when the Foundation is added to a project.
These provide the mandatory core multi-agent workflow engine and the shared technical standards.

### 1.1 Core Workflow Engine & Multi-Agent Pipeline
The operational backbone responsible for project discovery, harness state, `git worktree` subagent orchestration, compilation, and governance.

* **workflow-initializer**: Project bootstrapping, stack diagnosis, safety hooks, context exclusions, and provider-specific subagent setup (`.claude/agents/`, `.cursor/agents/`, Antigravity).
* **build-brief**: Guided product discovery for new apps, MVPs, or significant modules (`CONTEXT.md`, `docs/build-brief.md`, `docs/domain-model.md`, `DESIGN.md`).
* **harness-starter**: Derives and maintains the project startup harness (`AGENTS.md`, `PROGRESS.md`, `CONSTRAINTS.md`, `feature_list.json`, and `.github/workflows/gate.yml`) and unified feature folders (`docs/features/<feature-id>/`).
* **workflow-orchestrator** (🟣): Master multi-agent orchestrator supporting **Standalone Feature Mode**, **Backlog Queue Mode (`feature_list.json`)**, and **GitHub Delivery across 3 modes (`plan`, `execute`, `publish`)**, coordinating isolated hydrated `git worktree` subagents, bounded repair loops (`MAX_REPAIR_ATTEMPTS = 2`) with a Human Decision Gate (`needs_human_review`), atomic `@git-governance` commits, and structured PR publication.
* **workflow-planner** (🔵): Feature Planner and Specification Architect subagent that produces the unified feature contract at `docs/features/<feature-id>/spec.md`.
* **workflow-implementer** (🟡): Implementer subagent executing in an isolated `git worktree` to build Clean Architecture layers + tests and run `@compiler` verification.
* **workflow-validator** (🟢/🔴): Independent Validator subagent executing in an isolated `git worktree` across 4 validation levels and producing `docs/features/<feature-id>/validator/validation-report.md` with an `Implementation Repair Brief`.
* **workflow-documenter** (🔷): Documenter subagent executing in an isolated `git worktree` after validation acceptance to author English KDoc, update durable docs (`ARCHITECTURE.md`, `CONSTRAINTS.md`, `README.md`), and complete `spec.md`.
* **compiler**: Centralized project verification, compilation, Lint, and deployment engine.
* **git-governance**: Enforces Git Flow conventions, branching rules, atomic layer-specific Conventional Commits, idempotent GitHub PR publication, and parallel wave rebase reconciliation.
* **foundation-evolve**: Synchronizes useful skills and improvements from working projects back to the Foundation.

### 1.2 Shared Engineering Guardrails
Technical standards shared by the active Foundation environment across all subagents.

* **agent-safety-hooks**: Automated safety and context-size guards installed automatically during project setup (`block-rm-rf.js` to block destructive actions like `rm -rf`, `git reset --hard`, `git clean -f`, `gh pr merge`, or forced pushes, and `check-agents-size.js` to enforce the 10 KB `AGENTS.md` limit) tailored to your active AI provider (Gemini, Cursor, or Claude Code).
* **ai-context-exclusion**: Provider-agnostic AI context exclusion governance across Gemini, Cursor, and Claude Code.
* **dependency-manager**: Governance for `libs.versions.toml` and dependency compatibility.
* **design-system-governance**: Design System standards covering Material 3, accessibility, RTL, adaptive UI, and reusability.
* **kotlin-style**: Kotlin coding conventions, English KDoc standards, function ownership, and branch exhaustiveness.
* **module-architecture-governance**: Automation and standards for multi-module creation, Java/Kotlin alignment, and Clean Architecture enforcement (Layer-Based and Feature-First).
* **repository-pattern-governance**: Data layer, repository pattern, SSOT, and typed domain error governance (`DomainError`).
* **testing-setup**: Unified strategy for unit, UI behavior, and visual regression testing.
* **viewmodel-architecture-governance**: Architectural rules for ViewModels, Hybrid UI State, and Passive Initialization Mandate.

### 1.3 Android & System Patterns
Active technical knowledge for Android, Kotlin, Compose, and platform-specific engineering.

* **adaptive**: Adaptive UI across phones, tablets, foldables, laptops, TV, and XR.
* **android-cli**: Android CLI commands, SDK management, emulators, and related tooling.
* **android-intent-security**: Secure communication between Android components and Intent Redirection prevention.
* **compose-modifier-and-layout-style**: Compose layout APIs, modifier chains, and custom layout decisions.
* **compose-side-effects**: Safe handling of Compose side effects.
* **compose-state-authoring**: Patterns for creating and managing Compose state.
* **compose-state-hoisting**: State ownership and coordination patterns.
* **compose-ui-testing-patterns**: Compose UI, screenshot, and semantics testing patterns.
* **edge-to-edge**: Modern system bar and IME inset handling.
* **kotlin-coroutines-structured-concurrency**: Structured coroutine design and lifecycle safety.
* **kotlin-flow-state-event-modeling**: State, event, and Flow modelling patterns.
* **navigation-3**: Jetpack Navigation 3 patterns and integration.

### 1.4 Stack Essentials (DI, Persistence & Cloud)
* **hilt**: Dependency Injection boundaries and optimizations.
* **room-schema-governance**: Room database integrity and schema evolution.
* **firebase-basics**: Firebase CLI setup, emulators, and project configuration.
* **firebase-auth-basics**: Firebase Authentication integration patterns.
* **firebase-remote-config-basics**: Firebase Remote Config and parameter governance.

The complete active set is defined by the 37 skills physically installed under `.agents/skills/`.

> External origin does not imply optional status. A skill created by an external expert can still be an active Foundation skill when it is installed under `.agents/skills/`.

---

## 2. Optional Catalog Skills

The catalog (`.agents/catalog/`) contains specialized technology, profiling, diagnostic, and planning skills that are **not installed by default**.
They are activated when a project requires a specific library, tool, or capability on demand.

### 2.1 Planning & Routing Plugins
* **to-plan**: Repository-aware implementation planning around external issues or specifications.
* **using-chrisbanes-skills**: Intelligent router to identify precise expert patterns for Kotlin and Compose based on Chris Banes' best practices.

### 2.2 Technology & Library Plugins
* **camerax**: Camera and Media3 integration patterns.
* **wear-compose-m3**: Material 3 patterns for Wear OS.
* **verified-email**: Email verification using Android Credential Manager.
* **agp-9-upgrade**: Android Gradle Plugin 9 migration guidance.
* **play-billing-library-version-upgrade**: Google Play Billing migration.
* **play-policy-insights**: Google Play Policy audit and compliance.

### 2.3 Diagnostic, Profiling & Specialized Plugins
* **compose-focus-navigation**: Focus handling for TV, keyboard, and D-pad navigation.
* **compose-recomposition-performance**: Analysis of recomposition and UI performance issues.
* **compose-stability-diagnostics**: Compose parameter stability and skippability compiler reports.
* **compose-animations**: Compose motion, transitions, and animation APIs.
* **compose-slot-api-pattern**: Reusable slot-based component API design.
* **compose-state-deferred-reads**: Frame-rate deferred reads and back-writing fixes.
* **perfetto-trace-analysis**: Root cause analysis of latency, memory, or jank from Perfetto traces.
* **perfetto-sql**: Natural language to Perfetto SQL query generation.
* **r8-analyzer**: R8/ProGuard analysis and application-size optimization.
* **kotlin-control-flow**: Detailed Kotlin branching, when expressions, and guard conditions.
* **kotlin-functions**: Semantic ownership for member, top-level, and extension functions.
* **kotlin-multiplatform-expect-actual**: KMP source set boundaries and expect/actual designs.
* **kotlin-types-value-class**: Value class vs data class decisions and stability.
* **migrate-xml-views-to-jetpack-compose**: Step-by-step migration from legacy XML Views to Compose.
* **hook-creator**: Tool to create custom lifecycle hooks across Claude Code, Gemini, and Cursor.
* **skill-creator**: Tool to author, evaluate, and benchmark new skills.

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
* **Foundation Methodology & Clean Architecture Guardrails**: Albert Martorell Garcia.
* **Harness & Multi-Agent Spec/Validator Patterns**: **Antonio Leiva** / **Nino Ruano** (AI Expert course, integrated and unified with permission).
* **Expert Patterns**: **Chris Banes** and others.
* **Official Docs**: Google Android & Firebase.

Included skills retain their original authorship and source metadata. Please respect the corresponding licenses and attribution requirements.

---
**Note**: Active skills must follow the *Mandatory Planning Protocol* defined in `AGENTS.md`.
