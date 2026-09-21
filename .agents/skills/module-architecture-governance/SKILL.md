---
name: module-architecture-governance
description: Automates the creation and configuration of project modules (domain, data, usecases, app) ensuring Clean Architecture and environment-specific version alignment.
metadata:
  author: Albert Martorell Garcia
  version: 1.0.0
  keywords: [architecture, multi-module, gradle, clean-architecture, java-compatibility, jvm-target]
---

# Module Architecture Specialist

This skill ensures that the project's multi-module structure remains healthy and strictly follows Clean Architecture boundaries.

> [!IMPORTANT]
> **Reference Values**: Versions like `minSdk`, `targetSdk`, or `JavaVersion` are **examples**. Agents MUST use the versions defined in the project's `libs.versions.toml`.

## Golden Rules (MANDATORY)

1. **The Trinity of Purity (STRICT)**: `:domain`, `:data`, and `:usecases` MUST be **pure Kotlin/JVM** modules. No `android {}` block allowed.
2. **Implementation Strategy**: All Android-specific implementation (Room, Retrofit) MUST reside in `:app` packages.
3. **No Hardcoded Strings**: All plugins applied via `alias(libs.plugins.[name])`.
4. **Local Ignoring Mandate (STRICT)**: Every module MUST have its own `.gitignore` file to ensure build artifacts are not tracked by Git.

---

## Individual Module Blueprints

### 1. The `:domain` Module (Pure Kotlin)
```kotlin
plugins {
    alias(libs.plugins.kotlin.jvm)
}

java {
    sourceCompatibility = JavaVersion.VERSION_[JAVA_VERSION]
    targetCompatibility = JavaVersion.VERSION_[JAVA_VERSION]
}

kotlin {
    compilerOptions { jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_[JAVA_VERSION]) }
}

dependencies {
    // Zero dependencies or pure Kotlin libraries like Coroutines.
}
```

### 2. The `:data` Module (Pure Kotlin Contracts)
```kotlin
plugins {
    alias(libs.plugins.kotlin.jvm)
}

java {
    sourceCompatibility = JavaVersion.VERSION_[JAVA_VERSION]
    targetCompatibility = JavaVersion.VERSION_[JAVA_VERSION]
}

kotlin {
    compilerOptions { jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_[JAVA_VERSION]) }
}

dependencies {
    implementation(project(":domain"))
    // add others potential dependencies
}
```

### 3. The `:usecases` Module (Pure Kotlin Orchestrator)
```kotlin
plugins {
    alias(libs.plugins.kotlin.jvm)
}

java {
    sourceCompatibility = JavaVersion.VERSION_[JAVA_VERSION]
    targetCompatibility = JavaVersion.VERSION_[JAVA_VERSION]
}

kotlin {
    compilerOptions { jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_[JAVA_VERSION]) }
}

dependencies {
    implementation(project(":domain"))
    implementation(project(":data"))
    // add others potential dependencies
}
```

### 4. The `:app` Module (Android Framework & UI)
```kotlin
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.compose)
    // add others potential plugins: alias(libs.plugins.hilt)
}

android {
    namespace = "[PACKAGE_NAME]"
    compileSdk = [COMPILE_SDK]

    defaultConfig {
        applicationId = "[PACKAGE_NAME]"
        minSdk = [MIN_SDK]
        targetSdk = [TARGET_SDK]
        versionCode = 1
        versionName = "1.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_[JAVA_VERSION]
        targetCompatibility = JavaVersion.VERSION_[JAVA_VERSION]
    }
}

dependencies {
    implementation(project(":domain"))
    implementation(project(":data"))
    implementation(project(":usecases"))

    // Android, Compose, and DI Libraries
    implementation(platform(libs.androidx.compose.bom))
    // ...
}
```

### 5. Standard Module `.gitignore`
**Responsibility**: Prevent build binaris from being tracked.
```text
/build
```

## Package Structure Example (`:app` module)

To satisfy the **Implementation Strategy** rule, the `:app` module must host all framework-specific code. This example shows how to organize implementations of contracts defined in the `:data` module.

```text
:app
└── src/main/java/com/martorell/albert/basketcoach
    ├── data
    │   ├── network
    │   │   ├── ApiServiceImpl.kt     // Concrete Retrofit implementation
    │   │   └── model/               // Network DTOs
    │   ├── database
    │   │   ├── AppDatabase.kt       // Room Database
    │   │   ├── dao/                 // Room DAOs
    │   │   └── entity/              // Room Entities
    │   └── repository
    │       └── BasketRepositoryImpl.kt // Implements interface from :data module
    ├── di
    │   ├── NetworkModule.kt         // Hilt Module for Retrofit
    │   ├── DatabaseModule.kt        // Hilt Module for Room
    │   └── RepositoryModule.kt      // Hilt Module to @Binds implementations
    ├── ui
    │   └── main/                    // Main screen (Compose + ViewModel)
    └── MainActivity.kt
```

## Operational Workflow

1. **Audit**: Verify SDK/Java versions in `libs.versions.toml`.
2. **Creation**: Apply the specific Blueprint to the new module's `build.gradle.kts` and create the local `.gitignore`.
3. **Registration**: Add `include(":module_name")` to `settings.gradle.kts`.
4. **Wiring**: Connect dependencies according to the blueprints above.
5. **Sync**: Mandatory Gradle Sync via `compiler` skill.
