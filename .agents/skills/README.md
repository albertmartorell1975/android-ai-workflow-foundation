# AI-Assisted Workflow - Expert Skills Index

This directory contains the collective intelligence for the project, organized into three specialized groups.

## 1. Core Project Skills (Workflow DNA)
Custom skills created to define this project's unique architecture and governance.

- **compiler**: Centralized project verification and compilation engine. Handles Gradle Sync, Lint, Compilation, and Deployment.
- **git-governance**: Defines a strict Git Flow branching model and commit conventions for AI agents.
- **workflow-feature**: Analyzes the project and builds a standardized workflow for new features with granular checklists and mandatory documentation sync enforcement.
- **testing-setup**: Analyzes and creates a testing strategy for native Android apps (Unit, UI, Screenshot, and E2E).
- **hilt**: Official guidelines, clean architecture boundaries, static graph optimizations, and comprehensive multibinding patterns for the project.

## 2. Android CLI & System Skills
Expert guides for system-level optimizations, tools, and best practices.

- **android-cli**: Manual for the `android` command-line tool (project creation, emulators, screenshots, SDK management).
- **r8-analyzer**: Analyzes build files and R8 keep rules to identify redundancies and optimize app size.
- **perfetto-sql**: Translates natural language into SQL queries for Android Perfetto performance traces.
- **adaptive**: UI instructions to adapt apps to phones, tablets, foldables, laptops, TV, and XR.
- **camerax**: Technical guidance for Android camera development with CameraX.
- **navigation-3**: Migration and patterns for Jetpack Navigation 3 (deep links, backstacks, Hilt/ViewModel integration).
- **agp-9-upgrade**: Migration protocol for upgrading projects to Android Gradle Plugin version 9.
- **appfunctions**: Exposes app workflows to the Android system for discovery by AI agents.
- **edge-to-edge**: Migration to adaptive edge-to-edge support (status/navigation bar legibility, IME insets).
- **play-policy-insights**: Automated auditor for Google Play Policy compliance (Permissions, Data Safety, Privacy).
- **perfetto-trace-analysis**: Analyzes Perfetto traces to find root causes of latency, memory, or jank.
- **android-intent-security**: Best practices for secure communication between components via Intents.
- **play-billing-library-version-upgrade**: Migration guide for the latest Google Play Billing Library versions.
- **display-glasses-with-jetpack-compose-glimmer**: Guidelines for developing Android XR apps for display glasses.
- **migrate-xml-views-to-jetpack-compose**: Structured workflow for migrating legacy XML layouts to Jetpack Compose.
- **wear-compose-m3**: Expert guidance for Wear OS development using Compose Material3.
- **verified-email**: Implementation of secure, OTP-less email verification flow via Credential Manager.
- **engage-sdk-integration**: Integration and debugging for the Google Play Engage SDK.

## 3. External Expert Skills
Expert patterns for Compose and Kotlin, managed via `npx skills`.

- **kotlin-functions**: Choosing the best Kotlin function type (top-level, extension, factory) for any receiver.
- **firebase-basics**: Foundational Firebase CLI setup, project creation, and app configuration management.
- **firebase-auth-basics**: Expert patterns for setting up and managing Firebase Authentication (users, providers, tokens).
- **firebase-remote-config-basics**: Managing feature flags, loading strategies, and real-time updates via Firebase Remote Config.
- **compose-animations**: Expert guidance on Motion and Animations in Compose (AnimatedVisibility, animate*AsState).
- **kotlin-flow-state-event-modeling**: Professional UI state and event management using StateFlow, SharedFlow, and Channels.
- **compose-side-effects**: Safe management of side effects (LaunchedEffect, snapshotFlow, navigation) in Compose.
- **compose-state-authoring**: Best practices for state creation (remember, mutableStateListOf) in Composables.
- **compose-stability-diagnostics**: Analysis of parameter stability, skippability, and strong skipping behavior.
- **compose-slot-api-pattern**: Design of reusable components using slots for highly dynamic content.
- **kotlin-types-value-class**: Optimized type declarations using @JvmInline value classes for type safety and performance.
- **compose-focus-navigation**: Focus handling for TV, keyboard, and D-pad navigation.
- **compose-state-deferred-reads**: Performance optimization by deferring frame-rate state reads to later phases.
- **compose-ui-testing-patterns**: Patterns for UI tests, screenshot tests, and semantics assertions in Compose.
- **compose-modifier-and-layout-style**: Best practices for layout APIs, modifier chains, and custom layout decisions.
- **compose-recomposition-performance**: Investigation of jank, skippability, and unnecessary recompositions.
- **kotlin-control-flow**: Refined Kotlin branching (when, guard conditions, sealed types) for cleaner logic.
- **kotlin-coroutines-structured-concurrency**: Safe coroutine management (CoroutineScope, structured launch) to avoid leaks.
- **kotlin-multiplatform-expect-actual**: Design of interface boundaries for Kotlin Multiplatform projects.
- **compose-state-hoisting**: Principles for interactive UI state movement and coordination logic.
- **to-plan**: Repository-aware implementation planning for ready GitHub issues or confirmed specs.
- **using-chrisbanes-skills**: Entry point for broad Kotlin/Compose reviews spanning multiple design concerns.

---
**Note**: All skills must be consulted following the *Mandatory Planning Protocol* defined in `AGENTS.md`.

- **error-handling**: Expert guidance for consistent error handling using ResultResponse and CustomError patterns.
