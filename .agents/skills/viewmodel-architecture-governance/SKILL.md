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

1. **Mutually Exclusive Phases** (Initial, Success, Error, NeedsPermission): Use a `sealed interface`.
2. **Additive/Overlay States** (isLoading, Dialogs, FAB visibility): Use `Boolean` flags in the parent `data class`.

### Rationale for additive `isLoading`:
Using a boolean flag for loading instead of a branch in the `sealed interface` allows for **Data Continuity**. It ensures that if the user refreshes data (e.g., Pull-to-refresh), the existing data remains visible in the `Success` branch while a loader overlay is shown on top.

### Detailed Implementation Example

#### A. Modeling at the ViewModel
```kotlin
data class ScreenUiState(
    // 1. The primary phase of the screen (Exclusive)
    val content: MainContent = MainContent.Initial,
    
    // 2. Transitory or overlapping UI elements (Additive)
    val isLoading: Boolean = false,
    val isLoggingOut: Boolean = false,
)

sealed interface MainContent {
    data object Initial : MainContent
    data object NeedsLocation : MainContent
    data class Success(val data: DomainModel) : MainContent
    data class Error(val type: CustomError) : MainContent
}
```

### Hybrid Pattern Flexibility Clause

To ensure pragmatism without sacrificing architectural integrity, follow these rules when deciding how to structure your UI State:

1. **Mandatory Sealed Content**: If a screen involves an asynchronous lifecycle with mutually exclusive states (e.g., *Initial* phase, *Success* when data arrives, or *Error* if it fails), you **MUST** use a `sealed interface` for the `content` property.
2. **Root Data Class Recommendation**: Even if a screen currently lacks additive states (like dialogs or FABs), the root state should remain a `data class` wrapping the `content`. This ensures that adding additive UI layers in the future does not require a breaking change in the UI-ViewModel contract.
3. **Static Screens (KISS)**: For 100% static screens that do not load external data and only represent a single phase (e.g., a simple "About" screen or a purely local "Settings" form), a plain `data class` without a `sealed interface` is preferred to avoid overengineering.

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

### Final Verdict: Why it's worth it

Moving coroutine management to the ViewModel is a trade-off that favors **long-term stability** over initial simplicity.

**Key Benefits Summary:**
1. **Architectural Predictability**: The app's state depends on business logic rules, not on Composable lifecycle.
2. **Zombie-Bug Prevention**: `viewModelScope` automatically prevents memory leaks and crashes from outdated UI updates.
3. **KISS UI**: Screen composables are focused 100% on layout and tokens, free of "plumbing" code.
4. **Scalability**: New requirements (analytics, side-effects) can be added entirely within the ViewModel.

---

## 4. Action Idempotency & Mutex Guarding

To prevent redundant work or double side-effects, the ViewModel MUST ensure that its actions are idempotent. The `Mutex` is the preferred mechanism for this.

### The Three Guard Patterns:

#### A. The "Sequential" Pattern (`withLock`)
Use this when you want to ensure work never overlaps but eventually executes (e.g., manual refreshes or database writes that must be ordered).
- **Behavior**: Queues the next task if the lock is held.
```kotlin
private val loadMutex = Mutex()

fun onRefresh() {
    viewModelScope.launch {
        loadMutex.withLock { // Built-in try-finally
            performLoad()
        }
    }
}
```

#### B. The "Fast-Entry" Guard (`tryLock` + `finally`)
Use this for UI-driven initializations (e.g., `onStart`) that should be ignored if already active to avoid flickering.
- **Behavior**: Exits immediately if the lock is held.
```kotlin
private val loadMutex = Mutex()

fun onStart() {
    if (!loadMutex.tryLock()) return // Immediate exit
    viewModelScope.launch {
        try {
            performInitialLoad()
        } finally {
            loadMutex.unlock() // Mandatory manual release
        }
    }
}
```

#### C. The "Singleton Engine" Guard (`tryLock` without `unlock`)
Use this for background monitors, socket connections, or streams that must only be started once for the entire ViewModel lifetime.
- **Behavior**: Locks the door and "throws away the key".
```kotlin
private val monitoringMutex = Mutex()

fun startMonitoring() {
    if (!monitoringMutex.tryLock()) return // Lock forever
    viewModelScope.launch {
        repository.observeUpdates().collect { /* ... */ }
    }
}
```

### Rationale: The `try-finally` Mandate
When using manual locks (`tryLock`), a `finally` block is **MANDATORY** to prevent "Deadlocks". It ensures the lock is released even if the task fails or the coroutine is cancelled (e.g., screen rotation or navigating away).
