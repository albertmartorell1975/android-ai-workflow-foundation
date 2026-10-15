# UI Actions & Coroutine Management

To ensure a clean separation of concerns and a passive UI, the **ViewModel MUST manage its own coroutines** for any UI-triggered actions.

## Mandate: Non-suspending UI Actions
Functions exposed by the ViewModel for UI events (clicks, form submissions) MUST NOT be `suspend` functions. They should launch work internally using `viewModelScope`.

### Rationale
- **Passive UI**: The UI should only "notify" the ViewModel that an event happened. It should not be responsible for managing coroutine scopes (`rememberCoroutineScope`) or handling the lifecycle of an operation.
- **Lifecycle Safety**: `viewModelScope` is automatically cancelled when the ViewModel is cleared (e.g., navigating away). This ensures that background work like database writes or network calls doesn't leak or continue unnecessarily if the UI is no longer relevant.
- **Atomic State Consistency**: By launching the coroutine inside the ViewModel, you can atomically manage the sequence of `Loading -> Result -> Success/Error` states in a single block of code, ensuring the UI state is always synchronized with the operation's progress.
- **Centralized Error Mapping**: Allows for a unified `try-catch` strategy or specialized error handlers within the ViewModel, preventing raw exceptions from reaching the UI layer and ensuring they are correctly mapped to `CustomError` or `UiText`.
- **Reduced UI Boilerplate**: Eliminates the need for `rememberCoroutineScope` and nested `scope.launch` calls in screen composables, keeping the UI focused strictly on layout and tokens.
- **Testing**: Actions become easier to verify. You simply call the function in a test and observe the resulting state changes without needing to mock or provide external coroutine contexts.

## Implementation Example

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

## Testing Benefits
By moving the scope to the ViewModel, your unit tests can use `StandardTestDispatcher` to precisely control execution and verify intermediate states (like `isDeleting = true`).

## Final Verdict: Why it's worth it

Moving coroutine management to the ViewModel is a trade-off that favors **long-term stability** over initial simplicity.

**Key Benefits Summary:**
1. **Architectural Predictability**: The app's state depends on business logic rules, not on Composable lifecycle.
2. **Zombie-Bug Prevention**: `viewModelScope` automatically prevents memory leaks and crashes from outdated UI updates.
3. **KISS UI**: Screen composables are focused 100% on layout and tokens, free of "plumbing" code.
4. **Scalability**: New requirements (analytics, side-effects) can be added entirely within the ViewModel.