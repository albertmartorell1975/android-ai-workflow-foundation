# AI Workflow Foundation - Expert Skills Index

This directory contains the collective intelligence for the project, organized into three specialized groups.

## 1. Core Project Skills (Foundation DNA)
Custom skills created to define this project's unique architecture and governance.

- **compiler**: Centralized project verification and compilation engine. Handles Gradle Sync, Lint, Compilation, and Deployment.
- **dependency-manager**: Strict protocol for dependency management in the libs.versions.toml file to ensure compatibility and stability.
- **design-system-governance**: Codifies A11y, RTL, Adaptive, and Reusability standards for the Design System.
- **foundation-evolve**: Automates the synchronization of new skills from working projects back to this Foundation repository.
- **git-governance**: Defines a strict Git Flow branching model and commit conventions for AI agents.
- **hilt**: Official guidelines, clean architecture boundaries, static graph optimizations, and comprehensive multibinding patterns.
- **kotlin-style**: Strict adherence to Official Kotlin Coding Conventions (order of declarations, naming, formatting, **no control flow via exceptions**, and the **Magic Literal Prohibition**).
- **room-schema-governance**: Ensures database integrity, version management, and schema evolution rules for Room.
- **testing-setup**: Analyzes and creates a testing strategy for native Android apps (Unit, UI Behavior, and Visual Regression).
- **to-plan**: Repository-aware implementation planning for ready GitHub issues or confirmed specs.
- **viewmodel-architecture-governance**: Unified architectural rules for ViewModels, focusing on the Passive Initialization Mandate, the Hybrid UI State Pattern, and non-suspending UI Actions (internal coroutine management).
- **workflow-feature**: Analyzes the project and builds a standardized workflow for new features with granular checklists.
- **workflow-initializer**: Initializes a new project with the AI-assisted workflow seed, governance files, and customized agents.

## 2. Android CLI & System Skills
Expert guides downloaded via the Android CLI for system-level optimizations, tools, and best practices.

- **adaptive**: UI instructions to adapt apps to phones, tablets, foldables, laptops, TV, and XR.
- **android-cli**: Manual for the `android` command-line tool (project creation, emulators, screenshots, SDK management).
- **android-intent-security**: Best practices for secure communication between components via Intents.
- **edge-to-edge**: Migration to adaptive edge-to-edge support (status/navigation bar legibility, IME insets).
- **navigation-3**: Migration and patterns for Jetpack Navigation 3 (deep links, backstacks, Hilt/ViewModel integration).
- **r8-analyzer**: Analyzes build files and R8 keep rules to identify redundancies and optimize app size.

## 3. External Expert Skills
Expert patterns for Compose and Kotlin, managed via `npx skills` and tracked in `skills-lock.json`. These presently include skills from sources like **Chris Banes**.

- **compose-focus-navigation**: Focus handling for TV, keyboard, and D-pad navigation.
- **compose-modifier-and-layout-style**: Best practices for layout APIs, modifier chains, and custom layout decisions.
- **compose-recomposition-performance**: Investigation of jank, skippability, and unnecessary recompositions.
- **compose-side-effects**: Safe management of side effects (LaunchedEffect, snapshotFlow, navigation) in Compose.
- **compose-stability-diagnostics**: Analysis of parameter stability, skippability, and strong skipping behavior.
- **compose-state-authoring**: Best practices for state creation (remember, mutableStateListOf) in Composables.
- **compose-state-hoisting**: Principles for interactive UI state movement and coordination logic.
- **compose-ui-testing-patterns**: Patterns for UI tests, screenshot tests, and semantics assertions in Compose.
- **kotlin-control-flow**: Refined Kotlin branching (when, guard conditions, sealed types) for cleaner logic.
- **kotlin-coroutines-structured-concurrency**: Safe coroutine management (CoroutineScope, structured launch) to avoid leaks.
- **kotlin-flow-state-event-modeling**: Professional UI state and event management using StateFlow, SharedFlow, and Channels.
- **kotlin-functions**: Choosing the best Kotlin function type (top-level, extension, factory) for any receiver.
- **using-chrisbanes-skills**: Entry point for broad Kotlin/Compose reviews spanning multiple design concerns.

---
**Note**: All skills must be consulted following the *Mandatory Planning Protocol* defined in `AGENTS.md`.
