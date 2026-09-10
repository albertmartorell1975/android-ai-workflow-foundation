---
name: viewmodel-architecture-governance
description: Unified architectural rules for ViewModels, covering initialization, UI state modeling (Hybrid Pattern), and efficient reactive streams.
---

# ViewModel Architecture Governance

This skill centralizes architectural mandates for ViewModels to ensure consistency, testability, and performance across the project.

## 1. Lazy Initialization (UI-Driven)

To ensure maximum testability and resource efficiency, all **active work** (API calls, GPS start, intensive collection) MUST be triggered by the UI rather than in the `init` block.

### Rationale
- **Predictable Tests**: Tests can setup mocks before triggering work.
- **Resource Efficiency**: Work only starts when the screen is actually visible.

### Pattern
```kotlin
class FeatureViewModel(private val repository: DataRepository) : ViewModel() {
    fun onStart() {
        viewModelScope.launch {
            repository.loadData()
        }
    }
}

// In the Screen Composable:
LaunchedEffect(Unit) {
    viewModel.onStart()
}
```

---

## 2. UI State Modeling (The Hybrid Pattern)

To avoid "State Explosion" and "Impossible States" while maintaining easy partial updates and continuous background ddata, use a combination of `data class` and `sealed interface`.

### Mandatory Structure
1. **Global `data class`**: For additive flags that can coexist (overlays, dialogs, snackbars).
2. **Sealed `MainContent`**: For the mutually exclusive primary states of the screen.

### Pattern
```kotlin
data class ScreenUiState(
    val content: MainContent = MainContent.Loading, // Mutually exclusive
    val isDialogVisible: Boolean = false,           // Additive flag
    val isLoadingOverlay: Boolean = false           // Additive flag
)

sealed interface MainContent {
    object Loading : MainContent
    data class Success(val data: DomainModel) : MainContent
    data class Error(val message: String) : MainContent
}
```

---

## 3. Reactive Data Streams (`stateIn`)

For data that is naturally a `Flow` (Database observers, Configuration), avoid manual collection. Use the **Declarative State Pattern** with `stateIn`.

### Mandate
Use `SharingStarted.WhileSubscribed(5000)` to handle configuration changes (like rotation) without restarting the flow, while saving resources when the app is in the background.

### Pattern
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
