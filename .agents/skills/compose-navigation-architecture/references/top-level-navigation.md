# Top-Level Navigation & Tab/Rail Management

When an application uses top-level navigation chrome (`NavigationBar`, `NavigationRail`, or `NavigationDrawer`), it MUST separate route definitions from navigation item metadata, preserve state when switching tabs, and inspect the full destination hierarchy for active selection.

---

## 1. `TopLevelRoute` & `navigatePoppingUpToStartDestination`

Avoid coupling `Destinations` with UI icons or raw enums. Instead, define a strongly typed `TopLevelRoute<T : Any>` and a state-preserving `NavHostController` extension:

```kotlin
package com.example.app.ui.navigation

import androidx.annotation.StringRes
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController

data class TopLevelRoute<T : Any>(
    @param:StringRes val titleRes: Int,
    val route: T,
    val icon: ImageVector
)

fun NavHostController.navigatePoppingUpToStartDestination(route: Any) {
    navigate(route) {
        popUpTo(graph.findStartDestination().id) {
            saveState = true
        }
        launchSingleTop = true
        restoreState = true
    }
}
```

---

## 2. `NAV_OPTIONS` and Hierarchy Selection in `AppState`

Declare `NAV_OPTIONS` in the `companion object` of `<AppName>AppState` and inspect `currentDestination?.hierarchy` so nested sub-graphs or child routes keep their parent tab selected:

```kotlin
@Stable
class MyAppState(
    val navController: NavHostController,
    val coroutineScope: CoroutineScope,
    val snackbarHostState: SnackbarHostState
) {
    companion object {
        val NAV_OPTIONS = listOf(
            TopLevelRoute(
                titleRes = R.string.nav_dashboard,
                route = DashboardRoute,
                icon = Icons.Filled.Dashboard
            ),
            TopLevelRoute(
                titleRes = R.string.nav_analysis,
                route = AnalysisRoute,
                icon = Icons.Filled.Insights
            ),
            TopLevelRoute(
                titleRes = R.string.nav_chat,
                route = ChatRoute,
                icon = Icons.Filled.Forum
            )
        )
    }

    val currentDestination: NavDestination?
        @Composable get() = navController.currentBackStackEntryAsState().value?.destination

    @Composable
    fun isRouteSelected(route: Any): Boolean =
        currentDestination?.hierarchy?.any { it.hasRoute(route::class) } == true

    fun onNavItemClick(route: Any) {
        navController.navigatePoppingUpToStartDestination(route)
    }
}
```

---

## 3. Consuming `NAV_OPTIONS` in a `NavigationRail` or `NavigationBar`

Pass the options, selection state, and click callback from the root App Shell into the stateless navigation bar/rail component:

```kotlin
NavigationRail {
    MyAppState.NAV_OPTIONS.forEach { topLevelRoute ->
        val selected = appState.isRouteSelected(topLevelRoute.route)
        NavigationRailItem(
            selected = selected,
            onClick = { appState.onNavItemClick(topLevelRoute.route) },
            icon = {
                Icon(
                    imageVector = topLevelRoute.icon,
                    contentDescription = stringResource(topLevelRoute.titleRes)
                )
            },
            label = { Text(text = stringResource(topLevelRoute.titleRes)) }
        )
    }
}
```
