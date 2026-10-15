# Action Idempotency & Concurrency Guarding

To prevent redundant work, double network requests, or corrupted data from rapid user inputs (e.g., "double-clicking" a submit button), the ViewModel MUST ensure that its actions are idempotent.

There are two primary ways to guard actions: **UDF State Guarding** and **Mutex Guarding**.

### The Rule of Thumb
1. Does your state change with data you already have in memory? → Use `MutableStateFlow.update` (See [Hybrid UI State](hybrid-ui-state.md)).
2. To calculate the new state, do you have to do a fetch, a delay, or call a `suspend` function before saving it? → Use a `Mutex` wrapping the block to prevent simultaneous executions.

## 1. UDF State Guard (Primary Approach)

For most standard UI interactions (like button clicks triggering a network call), checking the current UI state is the preferred, most idiomatic approach. Since UI events are dispatched on the Main Thread, checking the state synchronously before launching a coroutine provides sufficient idempotency against rapid user clicks.

Use this approach when the action already has a visual representation in the UI state (e.g., `isLoading`).

```kotlin
fun onSubmit() {
    // 1. Synchronous state check (Idempotency Guard)
    if (_state.value.isLoading) return
    
    viewModelScope.launch {
        _state.update { it.copy(isLoading = true) }
        repository.submitData() // Side-effect
        _state.update { it.copy(isLoading = false) }
    }
}
```

## 2. Mutex Guarding (Complex / Suspending Operations)

A `Mutex` provides strict, thread-safe, coroutine-level concurrency control. 

**When to use a Mutex:**
- **Suspending Operations**: The lambda inside `MutableStateFlow.update` cannot contain `suspend` calls. If calculating the new state requires downloading data or a DB read, you must use a Mutex to protect the entire "download + update" transaction.
- **Cross-thread invocations**: The function might be called concurrently from background threads (e.g., a callback from a system service, Bluetooth, or WorkManager).
- **Queueing / Sequential work**: You need to ensure requests don't overlap, but you *must not drop* subsequent requests. You want them to wait in line.
- **Invisible operations**: The operation does not map to a boolean in the UI state (e.g., a silent analytics flush or token refresh).

### Example: The "Sequential" Pattern (`withLock`)
Use this when you want to ensure work never overlaps but eventually executes. If the user pulls to refresh three times quickly, three coroutines are launched. The Mutex ensures they execute one by one (or you can use `tryLock` to drop the redundant ones).

```kotlin
private val refreshMutex = Mutex()

fun refreshMessages() {
    viewModelScope.launch {
        // If a coroutine is already executing the code inside, 
        // the second coroutine will wait here (non-blocking).
        refreshMutex.withLock {
            _uiState.update { it.copy(isRefreshing = true) }
            
            try {
                // ASYNCHRONOUS OPERATION (Cannot be done inside a .update)
                val newMessages = repository.downloadMessages() 
                
                // Once we have the data, we update the state
                _uiState.update { it.copy(messages = newMessages, isRefreshing = false) }
            } catch (e: Exception) {
                _uiState.update { it.copy(isRefreshing = false) }
            }
        } // The Mutex is automatically released here at the end of the block
    }
}
```

### Other Mutex Guard Patterns:

#### The "Fast-Entry" Guard (`tryLock` + `finally`)
Use this when you want to drop redundant calls strictly and thread-safely without relying on UI state. Exits immediately if the lock is held.
```kotlin
private val syncMutex = Mutex()

fun onSilentBackgroundSync() {
    // Immediate exit if already syncing
    if (!syncMutex.tryLock()) return 
    
    viewModelScope.launch {
        try {
            repository.performHeavySync()
        } finally {
            syncMutex.unlock() // Mandatory manual release
        }
    }
}
```

#### The "Singleton Engine" Guard (`tryLock` without `unlock`)
Use this for background monitors, socket connections, or streams that must only be started once for the entire ViewModel lifetime. Locks the door and "throws away the key".
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
When using manual locks (`tryLock`), a `finally` block is **MANDATORY** to prevent "Deadlocks". It ensures the lock is released even if the task fails or the coroutine is cancelled (e.g., navigating away cancels `viewModelScope`, raising a `CancellationException`).