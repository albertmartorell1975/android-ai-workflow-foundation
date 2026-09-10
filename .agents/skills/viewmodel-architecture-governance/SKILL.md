---
name: viewmodel-architecture-governance
description: Unified architectural rules for ViewModels, focusing on the Passive Initialization Mandate and the Hybrid UI State Pattern.
---

# ViewModel Architecture Governance

This skill centralizes architectural mandates for ViewModels to ensure consistency, testability, and resource efficiency across the project.

## 1. Passive Initialization Mandate

The `ViewModel` constructor and `init` block MUST remain **passive**. It is strictly forbidden to launch coroutines or start data collection during construction.

### Rationale
- **Testability**: Mocks and test rules must be configured *before* any work starts. If `init` launches work, the test cannot control the starting conditions.
- **Resource Efficiency**: Avoid wasting CPU/Battery if the ViewModel is instantiated but the UI is not yet visible.
- **Predictability**: Ensures the UI is observing the state before the first emission occurs, avoiding missed events.

### Strategies to stay passive:

#### A. For Imperative Actions (One-shot loads, manual triggers)
Expose a dedicated function (e.g., `onStart()`) and trigger it explicitly from the UI when ready.

**❌ BAD (Active constructor)**
```kotlin
class FeatureViewModel(private val repository: DataRepository) : ViewModel() {
    init {
        // ❌ Starts immediately. Hard to mock 'repository' in tests.
        viewModelScope.launch { repository.loadInitialData() }
    }
}
```

**✅ GOOD (UI-driven)**
```kotlin
class FeatureViewModel(private val repository: DataRepository) : ViewModel() {
    fun onStart() {
        viewModelScope.launch { 
            _state.update { it.copy(isLoading = true) }
            repository.loadInitialData() 
            _state.update { it.copy(isLoading = false) }
        }
    }
}

// In the Screen Composable (Wiring):
LaunchedEffect(Unit) {
    viewModel.onStart() // ✅ Triggered explicitly
}
```

#### B. For Reactive Data Streams (Database observers, Config flows)
Avoid manual collection in `init`. Use the **Declarative State Pattern** with the `stateIn` operator.

**❌ BAD (Manual collection in init)**
```kotlin
class StreamViewModel(private val repository: DataRepository) : ViewModel() {
    private val _data = MutableStateFlow(emptyList<Item>())
    val data = _data.asStateFlow()

    init {
        // ❌ Manual management, redundant boilerplate, starts immediately.
        viewModelScope.launch {
            repository.observeData().collect { _data.value = it }
        }
    }
}
```

**✅ GOOD (Declarative stateIn)**
```kotlin
class StreamViewModel(repository: DataRepository) : ViewModel() {
    // ✅ Flow is converted to StateFlow lazily. 
    // It only starts when the UI subscribes.
    val data: StateFlow<List<Item>> = repository.observeData()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000), // ✅ Rotation-safe
            initialValue = emptyList()
        )
}
```

### Benefits for Unit Testing
With a passive constructor, your tests become deterministic:
```kotlin
@Test
fun `when screen starts, data is loaded`() = runTest {
    // 1. Setup mocks (Possible because init is passive)
    coEvery { repository.loadData() } returns successResult
    
    // 2. Instantiate ViewModel
    val viewModel = MyViewModel(repository)
    
    // 3. Trigger work manually
    viewModel.onStart()
    
    // 4. Verify results
    assertEquals(expectedState, viewModel.state.value)
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
