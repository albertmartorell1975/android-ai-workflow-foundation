---
name: compose-navigation-architecture
description: Codifies the standard Jetpack Compose Navigation architecture using the AppState and Destinations pattern. Enforces Type-Safe navigation, hoisting of NavHostController, and decoupled UI screens.
metadata:
  author: Albert Martorell Garcia
  version: 1.0.0
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

## 2. Destinations & Type-Safe Navigation

Navigation routes MUST be strongly typed. String-based navigation (Navigation 1.0/2.0) is forbidden.

- **Kotlin Serialization**: Use `kotlinx.serialization` and the `Navigation 3` type-safe APIs (`@Serializable` objects and data classes).
- **Destinations Object/File**: Define all global routes in a centralized `Destinations.kt` file, or within feature-specific modules if following a multi-module feature topology.
- **AppState Methods**: The `AppState` class MUST expose specific, intent-driven navigation functions (e.g., `fun navigateToChat(chatId: String)`) rather than exposing the raw `NavController.navigate()` to the UI. This encapsulates navigation logic like `popUpTo` or `launchSingleTop`.

## 3. Passive UI Screens (No NavController Injection)

UI Screens (e.g., `DashboardScreen`, `LoginScreen`) MUST remain agnostic of the navigation framework.

- **Forbidden Injection**: NEVER pass the `NavHostController` or `AppState` into a screen-level `@Composable`.
- **Callback Driven**: Screens MUST communicate navigation intents upwards via simple lambda callbacks (e.g., `onNavigateToSettings: () -> Unit`).
- **Testability**: This ensures screens can be rendered in `@Preview` or tested in isolation without mocking a complex `NavHostController`.

## 4. Package Structure

All navigation-related structural files MUST be encapsulated within a designated package, separating them from generic UI components.

- **Location**: Place `AppState`, `Destinations`, and the root `NavHost` setup inside a `navigation` or `ui.navigation` package within the `:app` or appropriate feature module (`:<feature>:presentation`).

## Example Implementation Structure

```kotlin
// 1. Destinations.kt
@Serializable
object DashboardRoute

@Serializable
data class ChatRoute(val chatId: String)

// 2. <AppName>AppState.kt (e.g., RickAndMortyAppState.kt)
@Stable
class MyAppState(
    val navController: NavHostController,
    val coroutineScope: CoroutineScope
) {
    val currentDestination: NavDestination?
        @Composable get() = navController.currentBackStackEntryAsState().value?.destination

    fun navigateToChat(chatId: String) {
        navController.navigate(ChatRoute(chatId)) {
            launchSingleTop = true
        }
    }
}

@Composable
fun rememberMyAppState(
    navController: NavHostController = rememberNavController(),
    coroutineScope: CoroutineScope = rememberCoroutineScope()
): MyAppState {
    return remember(navController, coroutineScope) {
        MyAppState(navController, coroutineScope)
    }
}

// 3. Navigation.kt
@Composable
fun Navigation(appState: MyAppState) {
    NavHost(
        navController = appState.navController,
        startDestination = DashboardRoute
    ) {
        composable<DashboardRoute> {
            DashboardScreen(
                onNavigateToChat = { chatId -> appState.navigateToChat(chatId) }
            )
        }
        composable<ChatRoute> {
            // ...
        }
    }
}

// 4. MainActivity.kt
@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val appState = rememberMyAppState()
            
            MyApplicationTheme {
                // Global Scaffolds, Snackbars, or adaptive navigation elements can wrap the navigation here
                Scaffold { paddingValues ->
                    Box(modifier = Modifier.padding(paddingValues)) {
                        Navigation(appState = appState)
                    }
                }
            }
        }
    }
}
```
