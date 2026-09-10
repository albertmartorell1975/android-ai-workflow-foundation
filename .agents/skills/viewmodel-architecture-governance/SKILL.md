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

### Mandate: Separate "Base Content" from "Additive UI Layers"

1. **Mutually Exclusive States** (Loading, Success, Error): Use a `sealed interface`.
2. **Additive States** (Dialogs, Overlays, Snackbars): Use `Boolean` flags in the parent `data class`.

### Detailed Implementation Example

#### A. Modeling at the ViewModel
```kotlin
data class ScreenUiState(
    // 1. The primary phase of the screen (Exclusive)
    val content: MainContent = MainContent.Loading,
    
    // 2. Transitory or overlapping UI elements (Additive)
    val isOverlayVisible: Boolean = false,
    val showFab: Boolean = false
)

sealed interface MainContent {
    object Loading : MainContent
    data class Success(val data: DomainModel) : MainContent
    data class Error(val message: String) : MainContent
}
```

#### B. Implementation at the UI (Stateless Content)
```kotlin
@Composable
fun FeatureContent(state: ScreenUiState) {
    Box(modifier = Modifier.fillMaxSize()) {
        // 1. Handle primary content with a clean 'when'
        when (val content = state.content) {
            is MainContent.Loading -> LoadingView()
            is MainContent.Success -> DataView(content.data)
            is MainContent.Error -> ErrorView(content.message)
        }

        // 2. Overlap additive elements based on independent flags
        if (state.isOverlayVisible) {
            ConfirmationDialog()
        }
    }
}
```

### Why this is better?
- **Continuity**: The background data stays visible under dialogs or overlays.
- **Safety**: The compiler ensures all primary states are handled.
- **Predictability**: Prevents "Impossible States" (e.g. showing error and loading at once).
