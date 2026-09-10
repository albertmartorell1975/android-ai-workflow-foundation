---
name: viewmodel-architecture-governance
description: Unified architectural rules for ViewModels, covering passive initialization, Hybrid UI state modeling, and efficient declarative streams.
---

# ViewModel Architecture Governance

This skill centralizes architectural mandates for ViewModels to ensure maximum testability, resource efficiency, and state consistency across the project.

## 1. Passive Initialization Mandate

The `ViewModel` constructor and `init` block MUST remain **passive**. It is strictly forbidden to launch coroutines or start data collection (imperative or reactive) during construction.

### Rationale
- **Predictable Testing**: Tests can configure mocks and establish initial conditions before any side effect occurs.
- **Resource Efficiency**: Work only starts when the UI is actually visible and needs the data.
- **Avoid Race Conditions**: Ensures the UI is ready to receive state updates or events before the ViewModel starts emitting them.

### Correct Patterns
- **For Imperative Work (API, GPS)**: Trigger explicitly from the UI via a lifecycle-aware event (e.g., `LaunchedEffect(Unit)`) calling a ViewModel function.
- **For Reactive Streams**: Use the `stateIn` operator instead of manual collection in `init`.

---

## 2. UI State Modeling (The Hybrid Pattern)

To ensure a robust and clean interface between the ViewModel and the UI, use the **Hybrid Model**: a combination of a `data class` for global coordination and a `sealed interface` for mutually exclusive content.

### Rationale

| Approach | ✅ Pros | ❌ Cons |
| :--- | :--- | :--- |
| **Data Class** | Easy updates via `.copy()`, persists background data during loading. | Risk of "Impossible States" (e.g., `loading` and `error` simultaneously). |
| **Sealed Class** | Zero impossible states, clean `when` block in UI. | Verbose updates, loss of context/data during transitions. |
| **Hybrid Model** | **Combines both**: safety for main content, ease of use for overlays/dialogs. | Requires careful separation of main vs. additive state. |

### Implementation Strategy
1. **Global `data class`**: For additive flags that can coexist (overlays, dialogs, snackbars).
2. **Sealed `MainContent`**: For the primary states of the screen (Loading, Success, Error).

```kotlin
data class ScreenUiState(
    val content: MainContent = MainContent.Loading, // Mutually exclusive (Safe)
    val isOverlayVisible: Boolean = false,          // Additive (Independent)
)

sealed interface MainContent {
    object Loading : MainContent
    data class Success(val data: DomainModel) : MainContent
    data class Error(val message: String) : MainContent
}
```

---

## 3. Declarative State Streams (`stateIn`)

For data that is naturally a `Flow` (Database, Config), avoid manual `launch { collect { ... } }`. Use the **Declarative State Pattern**.

### Mandate
Use the **`stateIn`** operator with **`SharingStarted.WhileSubscribed(5000)`**.

### Rationale
- **Rotation Safety**: The 5-second buffer keeps the stream alive during the gap of a screen rotation, avoiding unnecessary restarts.
- **Battery Efficiency**: If the user leaves the app, the flow stops automatically after 5 seconds.
- **Boilerplate Reduction**: Eliminates manual state management and collection loops.

### Correct Pattern
```kotlin
class StreamViewModel(repository: DataRepository) : ViewModel() {
    val data: StateFlow<List<Item>> = repository.observeData()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )
}
```
