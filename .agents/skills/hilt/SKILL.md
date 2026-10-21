---
name: hilt
description: Official guidelines, clean architecture boundaries, static graph optimizations, and comprehensive multibinding patterns for the project.
version: 1.1.0
ecosystem: Android, Kotlin, Dagger, Hilt, Jetpack Compose
keywords:
  - hilt
  - dagger
  - dependency-injection
  - multibinding
  - clean-architecture
  - jetpack-compose
  - workmanager
  - fcm
  - testing
---

## Prerequisites
* Project MUST use Jetpack Compose as its UI toolkit.
* Project MUST be configured with Dagger Hilt for Dependency Injection.
* Project MUST use Kotlin Symbol Processing (KSP) or Kapt for incremental annotation processing.

---

## 1. Clean Architecture Boundaries

To preserve strict layer isolation in the project, Hilt dependencies must conform to the following architectural rules:

* **The `:domain` Module**: This module must remain completely agnostic of Hilt, Dagger, or any Android framework classes (such as `Context`). No DI annotations are allowed in this module. All domain entities, use-case contracts, and repository interfaces are defined here purely.
* **The `:usecases` Module**: Business use cases or interactors must resolve their domain repository dependencies purely via **constructor injection** using the `@Inject` annotation. They are not allowed to declare modules or access Android context.
* **The `:data` Module**: This module contains repository implementations, network service adapters, and local databases. Hilt modules with `@Binds` or `@Provides` reside here to wire repository interfaces to their concrete implementations.
* **The `:app` Module**: Serves as the central orchestrator (`@HiltAndroidApp`). Registers application-level Android entry points (`@AndroidEntryPoint` or `@HiltViewModel`), and initializes system components like WorkManager and Firebase Cloud Messaging (FCM).

---

## 2. Structural Module Guidelines & Optimizations

Combining interface bindings (`@Binds`) and dynamic provider declarations (`@Provides`) in the same Hilt module is a major anti-pattern that slows compiler performance.

* **Strict Isolation**: Abstract modules must exclusively contain `@Binds`. Kotlin `object` modules must exclusively contain `@Provides`.
* **No Companion Objects**: Never embed a `companion object` containing `@Provides` methods inside an abstract class.
* **Explicit Annotations**: You MUST use the `@param:` target prefix (e.g., `@param:ApplicationContext`) for qualifiers in constructors.

> **See [Module Optimizations](references/module-optimizations.md)** for exact canonical examples of correct vs wrong module declarations.

---

## 3. Advanced Multibindings Patterns

Multibindings allow multiple independent modules to contribute elements or entries into a single injectable collection (a `Set` or `Map`).

* **Sets and Maps**: Use `@IntoSet`, `@ElementsIntoSet`, or `@IntoMap` (with keys like `@StringKey`) to decouple feature implementations from the central coordinator.
* **The Wildcard Gotcha**: You MUST annotate Kotlin collection injection targets with `@JvmSuppressWildcards` (e.g., `Set<@JvmSuppressWildcards AppInitializer>`).
* **Factory Scoping Trap**: Centralized registry classes (like `ViewModelProvider.Factory`) that consume multibound collections from child subcomponents must be left unscoped or marked `@Reusable` to avoid runtime crashes.

> **See [Multibinding Patterns](references/multibinding-patterns.md)** for detailed strategies and runtime workarounds.

---

## 4. Jetpack Integrations (WorkManager & FCM)

Certain Android framework components require specific boilerplate to function with Hilt:
* **WorkManager**: Use `@HiltWorker` and `@AssistedInject`. Disable the default WorkManager initializer in the Manifest and implement `Configuration.Provider` in the Application class.
* **FCM / Services**: Use field injection (`@Inject lateinit var`) on an `@AndroidEntryPoint` service. Injected properties cannot be private.

> **See [Jetpack Integrations](references/jetpack-integrations.md)** for exact configuration code for WorkManager and FCM.

---

## 5. Testing with Hilt

Hilt testing follows specific rules to avoid bloating compile times and slowing down test execution. This skill integrates closely with the global testing guidelines in `@testing-setup`.

* **Unit Tests**: DO NOT use Hilt for standard unit tests. Use manual constructor injection with Fakes/Mocks.
* **Integration Tests**: Prefer `@TestInstallIn` over `@UninstallModules` to replace real bindings with Fakes, as it shares the component graph across tests and speeds up execution.
* **Boilerplate**: Use `@HiltAndroidTest`, `HiltAndroidRule`, and `HiltTestApplication`.

> **See [Hilt Testing Rules](references/hilt-testing-rules.md)** for concrete test setups and the correct usage of `@BindValue`.

---

## 6. Verification Checklist

The automated assistant or developer MUST verify compliance with this checklist before committing changes to the dependency injection graph:

| Checklist Item | Verification Criteria |
| :--- | :--- |
| **Strict Module Isolation** | Mappings are abstract using `@Binds`. Creations use Kotlin `object` and `@Provides`. They never coexist in the same class. |
| **Companion Object Exclusion** | No abstract Hilt module contains an inner `companion object`. |
| **Wildcard Suppression** | Every Set or Map multibinding injection target contains `@JvmSuppressWildcards`. |
| **Empty Multibindings** | Set or Map multibindings that may be empty are abstractly declared using `@Multibinds`. |
| **Factory Scoping Check** | Coordinators injecting subcomponent-dependent multibound maps are `@Reusable` or completely unscoped. |
| **Worker DI Configuration** | Background workers are annotated with `@HiltWorker` and use `@AssistedInject`. |
| **Testing Isolation** | Unit tests do not use Hilt. Integration tests prefer `@TestInstallIn` over `@UninstallModules`. |