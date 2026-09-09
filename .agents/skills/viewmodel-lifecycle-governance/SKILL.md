---
name: viewmodel-lifecycle-governance
description: Standard architectural rules for UI-driven state management, lazy initialization, and efficient Flow-to-StateFlow conversion in ViewModels.
---

# ViewModel Lifecycle Governance

## 1. Lazy Initialization (UI-Driven)

To ensure maximum testability and resource efficiency, all **active work** in a `ViewModel` MUST be triggered by the UI rather than in the `init` block.

### Rationale
- **Predictable Tests**: Tests can configure mocks and verify states step-by-step before triggering work.
- **Resource Efficiency**: Coroutines and API calls only start when the screen is actually visible.
- **Explicit Lifecycle**: The UI owns the "Start" event, making the data flow easier to trace.

### Patterns

#### ❌ BAD: Side effects in `init`
```kotlin
class DataViewModel(private val repository: DataRepository) : ViewModel() {
    init {
        viewModelScope.launch {
            repository.loadInitialData() // ❌ Hard to test, starts immediately
        }
    }
}
```

#### ✅ GOOD: UI-driven trigger
```kotlin
class DataViewModel(private val repository: DataRepository) : ViewModel() {
    fun onStart() {
        viewModelScope.launch {
            repository.loadInitialData() // ✅ Triggered explicitly by UI
        }
    }
}

// In the Screen Composable:
LaunchedEffect(Unit) {
    viewModel.onStart()
}
```

---

## 2. Reactive Data Streams (`stateIn`)

For data that is naturally a `Flow` (Database observers, Real-time updates), avoid manual launches in `init` or `onStart`. Use the **`stateIn`** operator.

### The "Leiva Pattern"
Use `SharingStarted.WhileSubscribed(5000)` to ensure the flow is only active when needed, while handling configuration changes (like rotation) gracefully.

#### ❌ BAD: Manual collection in `init`
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

#### ✅ GOOD: Declarative `stateIn`
```kotlin
class StreamViewModel(repository: DataRepository) : ViewModel() {
    val data: StateFlow<List<Item>> = repository.observeData()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000), // ✅ Efficient lifecycle management
            initialValue = emptyList()
        )
}
```

### Why `WhileSubscribed(5000)`?
- **Rotation Safety**: If the screen rotates, the UI stops subscribing for a few milliseconds. The 5-second buffer keeps the flow alive during this gap, avoiding unnecessary restarts.
- **Battery Efficiency**: If the user leaves the app or navigates away, the flow stops after 5 seconds.
