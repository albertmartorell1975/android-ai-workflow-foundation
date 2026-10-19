# Feature-Based Modularization Strategy (Vertical Slicing)

This document outlines the evolutionary path from the project's current Layer-Based architecture to a highly scalable Feature-Based architecture (Vertical Slicing using Feature-First grouping).

## Why Transition?
The initial **Layer-Based** architecture (`:app`, `:data`, `:domain`, `:usecases`) serves as a strict shield to enforce Clean Architecture principles. However, as the project grows, adding a single feature requires modifying all horizontal modules. This leads to two major bottlenecks:
1. **Massive Cache Invalidations**: Touching a single file in the monolithic `:data` module forces a recompilation of the entire `:app`.
2. **Merge Conflicts**: Multiple teams or agents working on different domains will constantly collide in the same horizontal modules.

## The Target Architecture (Feature-First Grouping)

In a mature, vertically sliced project, the architecture shifts from Horizontal Layers to **Feature-First Grouping**. 

Instead of organizing the project by layers at the root, you organize it by **Features**. Each feature gets its own physical directory (e.g., `/characters`), and inside that directory, you deploy the 4 Clean Architecture layers as independent Gradle sub-modules.

### Modules vs. Packages: Why 4 Gradle Sub-Modules?

There are two ways to structure a feature, and it is crucial to understand the difference:

* **Option A: 4 Independent Gradle Sub-Modules (OUR MANDATORY STRATEGY)**
  Inside the physical `/characters/` directory, create 4 independent `build.gradle.kts` sub-modules:
  - `:characters:domain` (Pure Kotlin)
  - `:characters:usecases` (Pure Kotlin)
  - `:characters:data` (Android Library)
  - `:characters:presentation` (Android Library)
  > **Why Option A?**: Because Gradle treats each layer as an isolated project. If you edit a button style in `:characters:presentation`, Gradle **does not recompile `domain`, `usecases`, or `data`**.

* **Option B: 1 Single Gradle Module with Internal Packages (Antipattern for large apps)**
  A single `/feature-characters` folder with only 1 `build.gradle.kts` and 4 internal Kotlin packages (`domain/`, `usecases/`, `data/`, `presentation/`).
  > **Why NOT Option B?**: Because any change to UI or data forces Gradle to recompile the entire feature module, losing the superpower of *Compilation Avoidance*.

### Build-Time Superpower (Compilation Avoidance)
Because of how Gradle dependency graphs work, this structure optimizes build times drastically. 
If a developer modifies a Room DAO inside `:characters:data`:
- `:characters:domain` and `:characters:usecases` **DO NOT** recompile (they are upstream dependencies).
- `:basket:data` and `:basket:domain` **DO NOT** recompile (they are in parallel isolated graphs).
- Only `:characters:data` and `:app` (the assembler) are recompiled.

---

## The Dependency Graph (Who sees who)

To ensure massive scalability and prevent Circular Dependencies, the dependency flow must strictly be a directed acyclic graph (DAG) pointing downwards.

### Visual Architecture Diagram:

```text
                        +---------------------------+
                        |           :app            |
                        |       (Integrator)        |
                        +-------------+-------------+
                                      |
            +-------------------------+-------------------------+
            | (Nav & DI)                                        | (Nav & DI)
            v                                                   v
+-----------------------+                           +-----------------------+
|  FEATURE: CHARACTERS  |                           |    FEATURE: BASKET    |
|                       |                           |                       |
|  :char:presentation   |                           |  :basket:presentation |
|          |            |                           |          |            |
|          v            |                           |          v            |
|   :char:usecases      |                           |   :basket:usecases    |
|          |            |                           |          |            |
|          v            |                           |          v            |
|    :char:domain       |                           |    :basket:domain     |
|          ^            |                           |          ^            |
|          |            |                           |          |            |
|     :char:data        |                           |     :basket:data      |
+-----------+-----------+                           +-----------+-----------+
            |                                                   |
            +-------------------------+-------------------------+
                                      |
                                      v
                        +---------------------------+
                        |        CORE LAYER         |
                        | (:core:ds, :core:network) |
                        +---------------------------+
```

**Graph Rules:**
1. **Arrows go DOWN**: A module can only see the modules the arrow points to.
2. **NO Horizontal Communication**: `:basket:domain` and `:characters:domain` MUST NEVER communicate directly. Features are completely isolated.
3. **App knows Everything**: The `:app` module sits at the very top. It sees the presentation layers (for Navigation) and the data layers (for DI Repositories wiring).
4. **Core knows Nothing**: Core modules sit at the very bottom. They do not depend on any feature modules.

---

## Module Roles: `:core` vs `:app` (The Integrator)

A critical mistake in modularization is putting "common" or shared code into the `:app` module. Doing so causes **Circular Dependencies** because `:app` must depend on features to assemble the final app, but features would need to depend on `:app` to access the common code.

### The `:core` Modules (Atomic Toolboxes)
`:core` is NOT a monolithic module with 4 layers inside. It is a set of **specialized, domain-agnostic modules**. Each feature layer connects strictly to the `:core` toolbox it needs:

```text
========================================================================================
 FEATURE LAYER                                MATCHING CORE TOOLBOX
========================================================================================
 :characters:presentation  -----------------> :core:designsystem / :core:ui (Theme, Buttons)
 :characters:domain        -----------------> :core:common / :core:model (Result, DomainError)
 :characters:data          -----------------> :core:network / :core:database (Retrofit, Room)
========================================================================================
```

*   **WHAT TO INCLUDE**: Design systems (`:core:designsystem` for custom buttons, typography, Compose themes), base network configurations (`:core:network` for Retrofit/Ktor clients), base database setup (`:core:database`), or generic pure Kotlin utilities (`:core:common`).
*   **WHAT TO AVOID**: Business logic, feature-specific models, or anything tied to a specific domain.

### Layer Access Rules to `:core` (Gradle & Imports)

#### 1. `:characters:domain` (Pure Kotlin)

Gradle setup in `build.gradle.kts`:
```kts
dependencies {
    implementation(project(":core:common"))
}
```

Kotlin imports:
```kotlin
import com.example.core.common.error.DomainError
import com.example.core.common.result.Result
```
* **Forbidden**: No Retrofit (`:core:network`), No Room (`:core:database`), No Compose (`:core:designsystem`).

#### 2. `:characters:usecases` (Pure Kotlin)

Gradle setup in `build.gradle.kts`:
```kts
dependencies {
    implementation(project(":characters:domain"))
    implementation(project(":core:common"))
}
```

Kotlin imports:
```kotlin
import com.example.characters.domain.model.Character
import com.example.characters.domain.repository.CharactersRepository
```
* **Forbidden**: No UI, No Network, No Database.

#### 3. `:characters:data` (Android Library)

Gradle setup in `build.gradle.kts`:
```kts
dependencies {
    implementation(project(":characters:domain"))
    implementation(project(":core:network"))
    implementation(project(":core:database"))
}
```

Kotlin imports:
```kotlin
import com.example.characters.domain.repository.CharactersRepository
import com.example.core.database.AppDatabase
import com.example.core.network.RetrofitBuilder
```
* **Forbidden**: No UI components (`:core:designsystem`).

#### 4. `:characters:presentation` (Android Library - UI & ViewModels)

Gradle setup in `build.gradle.kts`:
```kts
dependencies {
    implementation(project(":characters:usecases"))
    implementation(project(":core:designsystem"))
}
```

Kotlin imports:
```kotlin
import com.example.characters.usecases.GetCharactersUseCase
import com.example.core.designsystem.components.PrimaryButton
import com.example.core.designsystem.theme.AppTheme
```
* **Forbidden**: No Network (`:core:network`), No Database (`:core:database`).

---

### The `:app` Module (How it connects to Features)

The `:app` module sits at the very top of the dependency graph. It connects to features through **two specific layers**:

1. **`:characters:presentation`**: To assemble the root `NavHost` and display the screens.
2. **`:characters:data`**: To wire Dependency Injection (Hilt/Koin) so that repository implementations (`CharactersRepositoryImpl`) can be bound to domain interfaces (`CharactersRepository`).

```kts
// app/build.gradle.kts
dependencies {
    // 1. UI & Navigation Layer Connection
    implementation(project(":characters:presentation"))
    implementation(project(":basket:presentation"))

    // 2. Dependency Injection / Data Layer Wiring
    implementation(project(":characters:data"))
    implementation(project(":basket:data"))
}
```

* **WHAT TO INCLUDE IN `:app`**:
    1. Entry points (`MainActivity`, `Application` class).
    2. Global Dependency Injection wiring (`@HiltAndroidApp`, Koin `startKoin`).
    3. The root `NavHost` (orchestrating routing between completely isolated features).
    4. Third-party SDK initialization (Firebase, Crashlytics, Analytics).
* **WHAT TO AVOID IN `:app`**: Common UI components, shared utilities, shared string resources, or any business logic.

---

## Feature-First Package Structure Example

Notice how the package names match the directory structure perfectly (`com.example.[feature].[layer]`):

```text
:core:network                        // Shared infrastructure
└── src/main/java/com/example/core/network

/characters                          // Feature Directory (Not a module itself)
├── :characters:domain               // Pure Kotlin
│   └── src/main/java/com/example/characters/domain
│       ├── model/Character.kt
│       └── repository/CharactersRepository.kt
│
├── :characters:usecases             // Pure Kotlin
│   └── src/main/java/com/example/characters/usecases
│       └── GetCharactersUseCase.kt
│
├── :characters:data                 // Android Library
│   └── src/main/java/com/example/characters/data
│       ├── network/CharactersApi.kt
│       └── repository/CharactersRepositoryImpl.kt // Depends on :core:network & :characters:domain
│
└── :characters:presentation         // Android Library
    └── src/main/java/com/example/characters/presentation
        ├── CharactersViewModel.kt   // Depends on :characters:usecases
        └── CharactersScreen.kt      

:app                                 // Android App (Integrator)
└── src/main/java/com/example/app
    ├── navigation/AppNavHost.kt     // Glues :characters:presentation and others together
    └── MainActivity.kt
```

## Advanced Implementation Patterns

### 1. Inter-Feature Communication
If `:basket` needs models from `:characters`, they CANNOT depend on each other horizontally.
*   **Solution**: Extract the shared models into a common underlying `:core:model:characters` or similar module. Communication flows downwards, never sideways.

### 2. Decoupled Navigation
Features must remain oblivious to the existence of other features.
*   **Solution**: Expose the UI via extension functions on `NavGraphBuilder` using callback lambdas for navigation events: `fun NavGraphBuilder.charactersScreen(onCharacterClick: (String) -> Unit)`.
*   The `:app` module acts as the integrator, wiring these callbacks inside the main `NavHost`.

## Golden Rules
1. **No Feature-to-Feature Dependencies**: A feature's sub-module (e.g., `:characters:presentation`) must never include another feature's sub-module (e.g., `:basket:presentation`).
2. **App as Integrator**: The `:app` module must remain thin, responsible only for Dependency Injection wiring and the Navigation Graph.
3. **App Connects Only to Presentation & Data**: In `app/build.gradle.kts`, `:app` includes `implementation(project(":feature:presentation"))` for Navigation and `implementation(project(":feature:data"))` for DI bindings.
4. **Strict Layer-to-Core Matching**: Presentation connects to `:core:designsystem`, Data connects to `:core:network`/`:core:database`, Domain connects to `:core:common`. Cross-layer leaks (e.g., Presentation directly depending on `:core:network`) are strictly forbidden.
