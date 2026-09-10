---
name: viewmodel-architecture-governance
description: Unified architectural rules for ViewModels, focusing on the Passive Initialization Mandate and the Hybrid UI State Pattern.
---

# ViewModel Architecture Governance

This skill centralizes all architectural mandates for ViewModels to ensure consistency, testability, and resource efficiency.

## 1. Passive Initialization Mandate

The `ViewModel` constructor and `init` block MUST remain **passive**. It is strictly forbidden to launch coroutines or start data collection during construction.

### Rationale
- **Testability**: Mocks and test rules must be configured *before* any work starts. If `init` launches work, the test cannot control the starting conditions.
- **Resource Efficiency**: Avoid wasting CPU/Battery if the ViewModel is instantiated (e.g., in a backstack) but the UI is not yet visible.
- **Predictability**: Ensures the UI is observing the state before the first emission occurs, avoiding missed events.

### Strategies to stay passive:

#### A. For Imperative Actions (One-shot loads, manual triggers)
Expose a dedicated function (e.g., `onStart()` or `loadData()`) and trigger it from the UI.

**❌ BAD (Active constructor)**
```kotlin
class CityViewModel(private val repository: WeatherRepository) : ViewModel() {
    init {
        // ❌ Starts immediately upon instantiation. Hard to mock 'repository' in tests.
        viewModelScope.launch { repository.loadCurrentWeather() }
    }
}
```

**✅ GOOD (UI-driven)**
```kotlin
class CityViewModel(private val repository: WeatherRepository) : ViewModel() {
    fun onStart() {
        viewModelScope.launch { 
            _state.update { it.copy(isLoading = true) }
            repository.loadCurrentWeather() 
            _state.update { it.copy(isLoading = false) }
        }
    }
}

// In the Screen Composable (Wiring):
LaunchedEffect(Unit) {
    viewModel.onStart() // ✅ Triggered explicitly when the UI is ready
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

To ensure a robust interface, use the **Hybrid Model**: a `data class` for global coordination and a `sealed interface` for mutually exclusive content.

### Mandate: Separate "Base Content" from "Additive UI Layers"

1. **Mutually Exclusive States** (Loading, Success, Error): Use a `sealed interface`.
2. **Additive States** (Dialogs, Overlays, FAB visibility): Use `Boolean` flags in the parent `data class`.

### Detailed Implementation Example

#### A. Modeling at the ViewModel
```kotlin
data class ScreenUiState(
    // 1. The primary phase of the screen (Exclusive)
    val content: MainContent = MainContent.Loading,
    
    // 2. Transitory or overlapping UI elements (Additive)
    val isLoggingOut: Boolean = false,
    val showFab: Boolean = false
)

sealed interface MainContent {
    object Loading : MainContent
    data class Success(val city: CityWeatherDomain) : MainContent
    data class Error(val type: CustomError) : MainContent
}
```

#### B. Implementation at the UI (Stateless Content)
```kotlin
@Composable
fun CityWeatherContent(state: ScreenUiState) {
    Box(modifier = Modifier.fillMaxSize()) {
        // 1. Handle primary content with a clean 'when'
        when (val content = state.content) {
            is MainContent.Loading -> CircularProgressIndicator()
            is MainContent.Success -> WeatherDetails(content.city)
            is MainContent.Error -> ErrorView(content.type)
        }

        // 2. Overlap additive elements based on independent flags
        if (state.isLoggingOut) {
            LogoutDialog(onConfirm = { /* ... */ })
        }
    }
}
```

---

## 3. UI Actions & Coroutine Management

To ensure a clean separation of concerns and a passive UI, the **ViewModel MUST manage its own coroutines** for any UI-triggered actions.

### Mandate: Non-suspending UI Actions
Functions exposed by the ViewModel for UI events (clicks, form submissions) MUST NOT be `suspend` functions. They should launch work internally using `viewModelScope`.

### Rationale
- **Passive UI**: The UI should only "notify" the ViewModel that an event happened. It should not be responsible for managing coroutine scopes (`rememberCoroutineScope`) or handling the lifecycle of an operation.
- **Lifecycle Safety**: `viewModelScope` is automatically cancelled when the ViewModel is cleared (e.g., navigating away). This ensures that background work like database writes or network calls doesn't leak or continue unnecessarily if the UI is no longer relevant.
- **Atomic State Consistency**: By launching the coroutine inside the ViewModel, you can atomically manage the sequence of `Loading -> Result -> Success/Error` states in a single block of code, ensuring the UI state is always synchronized with the operation's progress.
- **Centralized Error Mapping**: Allows for a unified `try-catch` strategy or specialized error handlers within the ViewModel, preventing raw exceptions from reaching the UI layer and ensuring they are correctly mapped to `CustomError` or `UiText`.
- **Reduced UI Boilerplate**: Eliminates the need for `rememberCoroutineScope` and nested `scope.launch` calls in screen composables, keeping the UI focused strictly on layout and tokens.
- **Testing**: Actions become easier to verify. You simply call the function in a test and observe the resulting state changes without needing to mock or provide external coroutine contexts.

### Implementation Example

**❌ BAD (UI-managed scope)**
```kotlin
// ViewModel
suspend fun deleteItem(id: String) {
    repository.delete(id)
}

// UI
val scope = rememberCoroutineScope()
Button(onClick = { scope.launch { viewModel.deleteItem(id) } }) { ... }
```

**✅ GOOD (ViewModel-managed scope)**
```kotlin
// ViewModel
fun deleteItem(id: String) {
    viewModelScope.launch {
        _state.update { it.copy(isDeleting = true) }
        repository.delete(id)
        _state.update { it.copy(isDeleting = false) }
    }
}

// UI (Stateless & Clean)
Button(onClick = { viewModel.deleteItem(id) }) { ... }
```

### Testing Benefits
By moving the scope to the ViewModel, your unit tests can use `StandardTestDispatcher` to precisely control execution and verify intermediate states (like `isDeleting = true`).

### Common Pitfalls & Considerations

While ViewModel-managed coroutines are preferred, be aware of the following:

- **One-shot UI Effects (Navigation/Snackbars)**: Since the UI doesn't "await" the result, you must use an "Event" stream (e.g., `Channel<Event>`) to signal the UI layer to perform these actions after an async task completes.
- **Critical Background Work**: `viewModelScope` is cancelled when the user navigates away. For tasks that MUST complete (e.g., database synchronization), delegate the work to a Repository using an `applicationScope` or `WorkManager`.
- **UI Responsiveness**: Since the function is non-suspending, you must be diligent in updating the `isLoading` state immediately within the launched coroutine to provide visual feedback.

### Final Verdict: Why it's worth it

Moving coroutine management to the ViewModel is a trade-off that favors **long-term stability** over initial simplicity.

**Key Benefits Summary:**
1. **Architectural Predictability**: The app's state depends on business logic rules, not on Composable lifecycle.
2. **Zombie-Bug Prevention**: `viewModelScope` automatically prevents memory leaks and crashes from outdated UI updates.
3. **KISS UI**: Screen composables are focused 100% on layout and tokens, free of "plumbing" code.
4. **Scalability**: New requirements (analytics, side-effects) can be added entirely within the ViewModel.
