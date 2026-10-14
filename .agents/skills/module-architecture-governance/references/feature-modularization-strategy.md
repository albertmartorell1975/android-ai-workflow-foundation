# Feature-Based Modularization Strategy

This document outlines the evolutionary path from the project's current Layer-Based architecture to a highly scalable Feature-Based architecture.

## Why Transition?
The initial **Layer-Based** architecture (`:app`, `:data`, `:domain`, `:usecases`) serves as a strict, didactic shield to enforce Clean Architecture principles (e.g., preventing UI code from leaking into Domain).
However, as the project and team grow, this model scales poorly. Adding a single feature requires modifying all four horizontal modules, leading to:
1.  **Massive Rebuilds**: Touching `:data` or `:domain` invalidates the build cache for the entire app.
2.  **Merge Conflicts**: Multiple teams working on different features will constantly collide in the same horizontal modules.

The **Feature-Based** architecture (Vertical Slicing) solves this by encapsulating business domains into independent modules.

## The Target Architecture (Feature-Based)

In a mature, vertically sliced project, the modules are categorized as follows:

### 1. `:feature:[name]` Modules
Self-contained modules representing a specific slice of the app (e.g., `:feature:login`, `:feature:characters`, `:feature:basket`).
*   **Internal Structure**: A feature module contains its own UI (Compose), its own specific UseCases, and its own Presentation logic (ViewModels).
*   **Dependencies**: Feature modules depend on `:core` modules and `:domain` modules, but **NEVER** depend on other `:feature` modules directly.

### 2. `:core:[name]` Modules
Infrastructure and shared utilities used across multiple features (e.g., `:core:network`, `:core:database`, `:core:designsystem`, `:core:testing`).
*   **Rule**: Core modules must be independent and agnostic of business logic. `:core:network` provides the Retrofit client, but doesn't know about `Character` or `BasketMatch`.

### 3. `:domain:[name]` and `:data:[name]` Modules (Optional Granularity)
For extremely large apps, even the horizontal layers are vertically sliced.
*   Instead of one monolithic `:data`, you have `:data:characters` and `:data:basket`.
*   These provide the specific Repositories and DAOs for that domain, utilizing `:core:network` and `:core:database`.

## Advanced Implementation Details (For Agents)

When transitioning a project to Feature Modules, agents MUST implement or consider the following enterprise patterns:

### 1. Inter-Feature Communication (Data Sharing)
If `:feature:basket` needs to know about `Character` models from `:feature:characters`, they CANNOT depend on each other.
*   **Solution**: Extract the shared models and repository interfaces into a common underlying module, such as `:core:model` or a specific `:domain:characters`. Both feature modules will then depend on this shared lower-level module. Communication flows downwards in a "V" shape, never horizontally.

### 2. Decoupled Navigation (Compose Navigation)
Features must remain oblivious to the existence of other features. 
*   **Solution**: Feature modules should never call `navController.navigate("other_feature_route")` directly. 
*   Instead, feature modules expose their UI via extension functions on `NavGraphBuilder` and use callback lambdas for navigation events: `fun NavGraphBuilder.loginScreen(onLoginSuccess: () -> Unit)`.
*   The `:app` module, being the integrator, wires these callbacks together inside the main `NavHost` (e.g., `onLoginSuccess = { navController.navigate("home") }`).

### 3. Gradle Convention Plugins (Build Logic)
Creating 20 feature modules means duplicating `android {}`, `compose`, and Java version configurations 20 times.
*   **Solution**: In a mature Feature-Based architecture, agents should recommend or utilize **Gradle Convention Plugins** (typically placed in a `build-logic` included build). 
*   A feature module's `build.gradle.kts` should be reduced to applying a single plugin: `alias(libs.plugins.project.feature.compose)`. This plugin internally applies the Android Library plugin, configures the JDK baseline (Java 17/21), sets Compose options, and adds common DI dependencies.

## Transition Process (How to Migrate)

When instructed to transition a feature to the Feature-Based model, the agent MUST follow these steps:

1.  **Create the Feature Module**: Generate a new Android Library module (e.g., `:feature:characters`).
2.  **Isolate UI & Presentation**: Move the specific Compose screens and ViewModels for that feature from `:app` into the new `:feature` module.
3.  **Resolve Dependencies**: 
    *   The `:feature` module will need to depend on the horizontal `:domain` and `:usecases` (if they haven't been split yet).
    *   Add `:feature` dependencies to the `:app` module so they can be wired into the main navigation graph.
4.  **Extract Core Libraries (If applicable)**: Move generic infrastructure (like Hilt network modules, Retrofit builders, Base themes) out of `:app` and into dedicated `:core:network` or `:core:designsystem` modules.
5.  **Fix Navigation (Crucial)**:
    *   To prevent circular dependencies, `:feature:A` cannot depend on `:feature:B` just to navigate to it.
    *   **Solution**: Navigation routes must be decoupled. Use a central Navigation graph in `:app`, or define Navigation Route interfaces/sealed classes in a `:core:navigation` module that all features depend on.

## Golden Rules for Feature Modules
1.  **No Feature-to-Feature Dependencies**: A feature module must never include another feature module in its `build.gradle.kts`.
2.  **App as the Integrator**: The `:app` module becomes incredibly thin. Its only job is to wire Dependency Injection components, initialize the Application class, and assemble the Navigation Graph tying the independent features together.

## Feature-Based Package Structure Example

When transitioned, the project structure shifts from horizontal layers to vertical slices:

```text
:core:network
└── src/main/java/com/martorell/albert/core/network
    ├── RetrofitClient.kt
    └── NetworkModule.kt             // Hilt module for generic network

:feature:characters                  // Self-contained Vertical Slice
└── src/main/java/com/martorell/albert/feature/characters
    ├── data/
    │   ├── CharactersApi.kt         // Specific API for this feature
    │   └── CharactersRepositoryImpl.kt 
    ├── domain/
    │   ├── Character.kt             // Model
    │   └── CharactersRepository.kt  // Interface
    ├── presentation/
    │   ├── CharactersViewModel.kt
    │   └── CharactersScreen.kt      // Compose UI
    └── di/
        └── CharactersModule.kt      // Hilt bindings for this feature

:app
└── src/main/java/com/martorell/albert/basketcoach
    ├── navigation/
    │   └── AppNavHost.kt            // Glues :feature:characters and others together
    └── MainActivity.kt              // Entry point
```