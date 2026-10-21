# Gradle Blueprints for Module Architecture

Use these blueprints when creating new modules in either **Layer-Based** (`:domain`, `:usecases`, `:data`, `:app`) or **Feature-First** (`:<feature>:domain`, `:<feature>:usecases`, `:<feature>:data`, `:<feature>:presentation` + `:core:*`) topologies.

Replace placeholders like `[JAVA_VERSION]`, `[PACKAGE_NAME]`, `[FEATURE]`, `[COMPILE_SDK]`, and `[MIN_SDK]` with the dynamically resolved values from the project.

---

## Part A: Horizontal Layer-Based Blueprints (`:domain`, `:usecases`, `:data`, `:app`)

### 1. The `:domain` Module (Pure Kotlin)
**File**: `domain/build.gradle.kts`
```kts
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
    // JSR-330 for framework-agnostic DI
    implementation(libs.javax.inject)
    // Add other pure Kotlin libraries here (e.g., Coroutines Core)
}
```

### 2. The `:usecases` Module (Pure Kotlin)
**File**: `usecases/build.gradle.kts`
```kts
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
    implementation(libs.javax.inject)
}
```

### 3. The `:data` Module (Data Infrastructure — Android Library, No UI)
**File**: `data/build.gradle.kts`
```kts
plugins {
    alias(libs.plugins.android.library)
    alias(libs.plugins.kotlin.android)
    // Add KSP if using Room or Hilt: alias(libs.plugins.ksp)
}

android {
    namespace = "[PACKAGE_NAME].data"
    compileSdk = [COMPILE_SDK]

    defaultConfig {
        minSdk = [MIN_SDK]
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_[JAVA_VERSION]
        targetCompatibility = JavaVersion.VERSION_[JAVA_VERSION]
    }
}

kotlin {
    compilerOptions { jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_[JAVA_VERSION]) }
}

dependencies {
    implementation(project(":domain"))
    implementation(libs.javax.inject)
    // Add Data layer libraries here: Room, Retrofit, DataStore, etc.
}
```

### 4. The `:app` Module (Layer-Based UI & DI Wiring)
**File**: `app/build.gradle.kts`
```kts
dependencies {
    implementation(project(":domain"))
    implementation(project(":data"))
    implementation(project(":usecases"))
}
```

---

## Part B: Vertical Feature-First Blueprints (`:<feature>:*` & `:core:*`)

In Feature-First topology, each feature directory `/<feature>/` contains 4 independent sub-modules:

### 1. `:<feature>:domain` (`<feature>/domain/build.gradle.kts`)
Same pure Kotlin blueprint as `:domain` above, with:
```kts
dependencies {
    implementation(project(":core:common"))
    implementation(libs.javax.inject)
}
```

### 2. `:<feature>:usecases` (`<feature>/usecases/build.gradle.kts`)
Same pure Kotlin blueprint as `:usecases` above, with:
```kts
dependencies {
    implementation(project(":<feature>:domain"))
    implementation(project(":core:common"))
    implementation(libs.javax.inject)
}
```

### 3. `:<feature>:data` (`<feature>/data/build.gradle.kts`)
Same Android Library blueprint as `:data` above (`namespace = "[PACKAGE_NAME].[FEATURE].data"`), with:
```kts
dependencies {
    implementation(project(":<feature>:domain"))
    implementation(project(":core:common"))
    implementation(project(":core:network"))   // When network is required
    implementation(project(":core:database"))  // When persistence is required
    implementation(libs.javax.inject)
}
```

### 4. `:<feature>:presentation` (`<feature>/presentation/build.gradle.kts`)
**Type**: Android Library with Jetpack Compose enabled
```kts
plugins {
    alias(libs.plugins.android.library)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    // Add KSP/Hilt if using Hilt ViewModels: alias(libs.plugins.ksp); alias(libs.plugins.hilt)
}

android {
    namespace = "[PACKAGE_NAME].[FEATURE].presentation"
    compileSdk = [COMPILE_SDK]

    defaultConfig {
        minSdk = [MIN_SDK]
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildFeatures {
        compose = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_[JAVA_VERSION]
        targetCompatibility = JavaVersion.VERSION_[JAVA_VERSION]
    }
}

kotlin {
    compilerOptions { jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_[JAVA_VERSION]) }
}

dependencies {
    implementation(project(":<feature>:usecases"))
    implementation(project(":<feature>:domain"))
    implementation(project(":core:designsystem"))
    implementation(project(":core:common"))
}
```

### 5. The `:app` Integrator Module (`app/build.gradle.kts` in Feature-First)
```kts
dependencies {
    // 1. Presentation modules for Root NavHost routing
    implementation(project(":<feature>:presentation"))

    // 2. Data modules for DI Repository bindings
    implementation(project(":<feature>:data"))

    // 3. Core Design System for AppTheme
    implementation(project(":core:designsystem"))
}
```

---

## Part C: Standard Module `.gitignore` (All Modules & Sub-Modules)
Every new module or sub-module MUST have this file to prevent tracking build artifacts:
**File**: `<module-path>/.gitignore`
```text
/build
```
