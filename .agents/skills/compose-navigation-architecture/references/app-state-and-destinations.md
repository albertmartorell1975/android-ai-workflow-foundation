# AppState & Type-Safe Destinations Implementation

## 1. `Destinations.kt`

Define all routes using `@Serializable` objects (for argument-free destinations) or `@Serializable data class` (for destinations with parameters):

```kotlin
package com.example.app.ui.navigation

import kotlinx.serialization.Serializable

@Serializable
object DashboardRoute

@Serializable
object AnalysisRoute

@Serializable
data class ChatRoute(val chatId: String)
```

---

## 2. `<AppName>AppState.kt`

Encapsulate `NavHostController`, `CoroutineScope`, and `SnackbarHostState` inside a `@Stable` state holder with a `@Composable` factory (`remember<AppName>AppState`):

```kotlin
package com.example.app.ui.navigation

import androidx.compose.material3.SnackbarHostState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Stable
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.navigation.NavDestination
import androidx.navigation.NavHostController
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import kotlinx.coroutines.CoroutineScope

@Stable
class MyAppState(
    val navController: NavHostController,
    val coroutineScope: CoroutineScope,
    val snackbarHostState: SnackbarHostState
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
    coroutineScope: CoroutineScope = rememberCoroutineScope(),
    snackbarHostState: SnackbarHostState = remember { SnackbarHostState() }
): MyAppState {
    return remember(navController, coroutineScope, snackbarHostState) {
        MyAppState(
            navController = navController,
            coroutineScope = coroutineScope,
            snackbarHostState = snackbarHostState
        )
    }
}
```

---

## 3. `Navigation.kt` & `MainActivity.kt`

Screens remain completely agnostic of `NavHostController` and `MyAppState`, communicating upwards exclusively via lambda callbacks:

```kotlin
// Navigation.kt
@Composable
fun Navigation(
    appState: MyAppState,
    modifier: Modifier = Modifier
) {
    NavHost(
        navController = appState.navController,
        startDestination = DashboardRoute,
        modifier = modifier
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

// MainActivity.kt
@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val appState = rememberMyAppState()

            MyApplicationTheme {
                Scaffold(
                    snackbarHost = { SnackbarHost(appState.snackbarHostState) }
                ) { paddingValues ->
                    Navigation(
                        appState = appState,
                        modifier = Modifier.padding(paddingValues)
                    )
                }
            }
        }
    }
}
```
