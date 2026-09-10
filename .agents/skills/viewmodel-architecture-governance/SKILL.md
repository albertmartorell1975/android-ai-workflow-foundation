---
name: viewmodel-architecture-governance
description: Unified architectural rules for ViewModels, focusing on the Passive Initialization Mandate and the Hybrid UI State Pattern.
---

# ViewModel Architecture Governance

This skill centralizes architectural mandates for ViewModels to ensure consistency, testability, and resource efficiency across the project.

## 1. Passive Initialization Mandate

The `ViewModel` constructor and `init` block MUST remain **passive**. It is strictly forbidden to launch coroutines or start data collection during construction.

### Rationale
- **Testability**: Mocks and test rules must be configured *before* any work starts.
- **Resource Efficiency**: Avoid wasting CPU/Battery if the ViewModel is instantiated but the UI is not yet visible.
- **Race Conditions**: Ensures the UI is observing the state before the first emission occurs.

### Strategies to stay passive:

#### A. For Imperative Actions (One-shot loads, manual triggers)
Use a **UI-driven trigger**. The ViewModel exposes a function that the UI calls when ready (e.g., via `LaunchedEffect`).

**❌ BAD (Active constructor)**
```kotlin
class FeatureViewModel(private val repository: DataRepository) : ViewModel() {
    init {
        viewModelScope.launch { 
            repository.loadInitialData() // ❌ Starts immediately, hard to test
        }
    }
}
```

**✅ GOOD (UI-driven)**
```kotlin
class FeatureViewModel(private val repository: DataRepository) : ViewModel() {
    fun onStart() {
        viewModelScope.launch { 
            repository.loadInitialData() // ✅ Triggered explicitly by the UI
        }
    }
}
```

#### B. For Reactive Data Streams (Database observers, Config flows)
Use the **Declarative State Pattern** with `stateIn`. This is the preferred way to handle asynchronous data as it is lazily started by the UI subscription.

**❌ BAD (Manual collection in init)**
```kotlin
class StreamViewModel(private val repository: DataRepository) : ViewModel() {
    private val _data = MutableStateFlow(emptyList<Item>())
    val data = _data.asStateFlow()

    init {
        viewModelScope.launch {
            repository.observeData().collect { _data.value = it } // ❌ Manual management
        }
    }
}
```

**✅ GOOD (Declarative stateIn)**
```kotlin
class StreamViewModel(repository: DataRepository) : ViewModel() {
    val data: StateFlow<List<Item>> = repository.observeData()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000), // ✅ Lazy & Rotation-safe
            initialValue = emptyList()
        )
}
```

---

## 2. UI State Modeling (The Hybrid Pattern)

To ensure a robust interface between the ViewModel and the UI, use the **Hybrid Model**: a `data class` for global coordination and a `sealed interface` for mutually exclusive content.

### Rationale

| Approach | ✅ Pros | ❌ Cons |
| :--- | :--- | :--- |
| **Data Class** | Easy updates via `.copy()`, persists background data. | Risk of "Impossible States" (e.g. Loading + Error). |
| **Sealed Class** | Zero impossible states, clean UI `when` block. | Verbose updates, loss of context in transitions. |
| **Hybrid Model** | **Combines safety for main content with ease of use.** | Requires separation of main vs additive state. |

### Implementation Pattern
```kotlin
data class ScreenUiState(
    val content: MainContent = MainContent.Loading, // Mutually exclusive (Safe)
    val isOverlayVisible: Boolean = false,          // Additive flag (Independent)
)

sealed interface MainContent {
    object Loading : MainContent
    data class Success(val data: DomainModel) : MainContent
    data class Error(val message: String) : MainContent
}
```
