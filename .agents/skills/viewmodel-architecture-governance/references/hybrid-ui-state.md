# UI State Modeling (The Hybrid Pattern)

To ensure a robust interface, use the **Hybrid Model**: a `data class` for global coordination and a `sealed interface` for mutually exclusive content.

## Mandate 1: Separate "Base Content" from "Additive UI Layers"

1. **Mutually Exclusive Phases** (Initial, Success, Error, NeedsPermission): Use a `sealed interface`.
2. **Additive/Overlay States** (isLoading, Dialogs, FAB visibility): Use `Boolean` flags in the parent `data class`.

### Rationale for additive `isLoading`:
Using a boolean flag for loading instead of a branch in the `sealed interface` allows for **Data Continuity**. It ensures that if the user refreshes data (e.g., Pull-to-refresh), the existing data remains visible in the `Success` branch while a loader overlay is shown on top.

## Mandate 2: Atomic State Updates (UDF)

When updating the state, you MUST use `MutableStateFlow.update { ... }`. You MUST NEVER use `_state.value = _state.value.copy(...)`.

### Rationale:
`MutableStateFlow.update` uses a thread-safe Compare-And-Swap (CAS) operation. If multiple coroutines attempt to modify the state concurrently, `.update` ensures no intermediate states are overwritten and lost (a state race condition).

**When to use `.update`:**
Use `.update` when the state modification is synchronous and immediate. You read the current state, change a value based on it, and emit the new state atomically.

**✅ GOOD (Atomic Update)**
```kotlin
data class ProfileUiState(val isFollowing: Boolean = false)

fun toggleFollow() {
    // 1. .update is atomic and thread-safe.
    // If the button is pressed 5 times quickly, no click is lost.
    _state.update { currentState -> 
        currentState.copy(isFollowing = !currentState.isFollowing) 
    }
    
    // 2. Then fire the background network request
    viewModelScope.launch {
        repository.updateFollowStatus(_state.value.isFollowing)
    }
}
```

**❌ BAD (State Race Condition Risk)**
```kotlin
// If called concurrently, one update will overwrite the other
_state.value = _state.value.copy(count = _state.value.count + 1)
```

## Detailed Implementation Example

### A. Modeling at the ViewModel
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
    data class Error(val error: DomainError) : MainContent
}
```

### Hybrid Pattern Flexibility Clause

To ensure pragmatism without sacrificing architectural integrity, follow these rules when deciding how to structure your UI State:

1. **Mandatory Sealed Content**: If a screen involves an asynchronous lifecycle with mutually exclusive states (e.g., *Initial* phase, *Success* when data arrives, or *Error* if it fails), you **MUST** use a `sealed interface` for the `content` property.
2. **Root Data Class Recommendation**: Even if a screen currently lacks additive states (like dialogs or FABs), the root state should remain a `data class` wrapping the `content`. This ensures that adding additive UI layers in the future does not require a breaking change in the UI-ViewModel contract.
3. **Static Screens (KISS)**: For 100% static screens that do not load external data and only represent a single phase (e.g., a simple "About" screen or a purely local "Settings" form), a plain `data class` without a `sealed interface` is preferred to avoid overengineering.

### B. Implementation at the UI (Stateless Content)
```kotlin
@Composable
fun CityWeatherContent(state: ScreenUiState) {
    Box(modifier = Modifier.fillMaxSize()) {
        // 1. Handle primary content with a clean 'when'
        when (val content = state.content) {
            is MainContent.Loading -> CircularProgressIndicator()
            is MainContent.Success -> WeatherDetails(content.city)
            is MainContent.Error -> ErrorView(message = content.error.toUiText())
        }

        // 2. Overlap additive elements based on independent flags
        if (state.isLoggingOut) {
            LogoutDialog(onConfirm = { /* ... */ })
        }
    }
}
```
