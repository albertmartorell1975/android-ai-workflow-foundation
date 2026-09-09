---
name: viewmodel-lifecycle-governance
description: Standard architectural rules for UI-driven state management and ViewModel testability.
---

# ViewModel Lifecycle Governance

## Lazy Initialization (UI-Driven)

To ensure maximum testability and resource efficiency, all active work in a `ViewModel` MUST be triggered by the UI rather than in the `init` block.

### Rationale
- **Predictable Tests**: Tests can instantiate the ViewModel, setup mocks, and verify states step-by-step before triggering work.
- **Resource Efficiency**: Coroutines and flows only start when the screen is actually visible.
- **Explicit Lifecycle**: The UI owns the "Start" event, making the data flow easier to trace.

### Patterns

#### ❌ BAD: Side effects in `init`
```kotlin
class DataViewModel(private val repository: DataRepository) : ViewModel() {
    init {
        viewModelScope.launch {
            repository.observeData().collect { /* ... */ }
        }
    }
}
```

#### ✅ GOOD: UI-driven trigger
```kotlin
class DataViewModel(private val repository: DataRepository) : ViewModel() {
    fun startObservation() {
        viewModelScope.launch {
            repository.observeData().collect { /* ... */ }
        }
    }
}

// In the Screen Composable:
LaunchedEffect(Unit) {
    viewModel.startObservation()
}
```
