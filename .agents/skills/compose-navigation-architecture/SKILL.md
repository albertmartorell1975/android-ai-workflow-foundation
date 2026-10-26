---
name: compose-navigation-architecture
description: Codifies the standard Jetpack Compose Navigation architecture using the AppState and Destinations pattern. Enforces Type-Safe navigation, hoisting of NavHostController, and decoupled UI screens.
metadata:
  author: Albert Martorell Garcia
  version: 1.1.0
  keywords:
  - navigation
  - compose
  - appstate
  - destinations
  - architecture
---
# Compose Navigation Architecture Governance

This skill centralizes all architectural mandates for Jetpack Compose Navigation to ensure consistency, testability, and decoupled UI layers across all Android projects.

## 1. The AppState Pattern Mandate

The application MUST govern its navigation and global state via the **`AppState`** pattern. This prevents the root `@Composable` from becoming bloated with logic and isolates lifecycle and navigation boundaries.

- **Encapsulation**: Create an `AppState` class (e.g., `<AppName>AppState`) that holds the `NavHostController`, global `SnackbarHostState`, and `CoroutineScope`.
- **Window Size Classes**: The `AppState` MUST observe and expose `WindowSizeClass` or orientation states to drive adaptive layouts passively.
- **Factory Function**: Provide a `@Composable fun remember<AppName>AppState(...)` to instantiate and remember this state across recompositions.

> **See [AppState & Type-Safe Destinations](references/app-state-and-destinations.md)** for full implementation templates.

## 2. Destinations & Type-Safe Navigation

Navigation routes MUST be strongly typed. String-based navigation (Navigation 1.0/2.0) is forbidden.

- **Kotlin Serialization**: Use `kotlinx.serialization` and type-safe Navigation APIs (`@Serializable` objects and data classes).
- **Destinations Object/File**: Define all global routes in a centralized `Destinations.kt` file, or within feature-specific modules if following a multi-module feature topology.
- **AppState Methods**: The `AppState` class MUST expose specific, intent-driven navigation functions (e.g., `fun navigateToChat(chatId: String)`) rather than exposing the raw `NavController.navigate()` to the UI.

## 3. Top-Level Navigation & Tab/Rail Management

When the application includes top-level navigation chrome (such as a `NavigationBar`, `NavigationRail`, or `NavigationDrawer`), it MUST follow a standardized, state-preserving pattern:

- **`TopLevelRoute` Data Class**: Represent top-level tabs/rail items using `TopLevelRoute<T : Any>(@param:StringRes val titleRes: Int, val route: T, val icon: ImageVector)` rather than mixing UI icons into route definitions.
- **`AppState` Ownership (`NAV_OPTIONS`)**: Declare the list of top-level routes inside the `companion object` of `<AppName>AppState`.
- **Hierarchy-Aware Active Tab Selection**: Determine whether a top-level destination is selected via `currentDestination?.hierarchy?.any { it.hasRoute(route::class) } == true`.
- **State-Preserving Tab Switching (`navigatePoppingUpToStartDestination`)**: Switching between top-level destinations MUST pop up to `graph.findStartDestination().id` with `saveState = true`, `launchSingleTop = true`, and `restoreState = true`.

> **See [Top-Level Navigation & Tab/Rail Management](references/top-level-navigation.md)** for exact code implementations.

## 4. Passive UI Screens (No NavController Injection)

UI Screens (e.g., `DashboardScreen`, `LoginScreen`) MUST remain agnostic of the navigation framework.

- **Forbidden Injection**: NEVER pass the `NavHostController` or `AppState` into a screen-level `@Composable`.
- **Callback Driven**: Screens MUST communicate navigation intents upwards via simple lambda callbacks (e.g., `onNavigateToSettings: () -> Unit`).
- **Testability**: This ensures screens can be rendered in `@Preview` or tested in isolation without mocking a `NavHostController`.

## 5. Package Structure

All navigation-related structural files MUST be encapsulated within a designated package, separating them from generic UI components.

- **Location**: Place `AppState`, `Destinations`, `TopLevelRoute`, and the root `NavHost` setup inside a `navigation` or `ui.navigation` package within `:app` or the appropriate feature module (`:<feature>:presentation`).
