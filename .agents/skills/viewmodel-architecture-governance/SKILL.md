---
name: viewmodel-architecture-governance
description: Unified architectural rules for ViewModels, focusing on the Passive Initialization Mandate and the Hybrid UI State Pattern.
---

# ViewModel Architecture Governance

This skill centralizes all architectural mandates for ViewModels to ensure consistency, testability, and resource efficiency.

## 1. Passive Initialization Mandate

The `ViewModel` constructor and `init` block MUST remain **passive**. It is strictly forbidden to launch coroutines or start data collection during construction.

- **Imperative Actions (One-shot loads, manual triggers)**: Expose a dedicated function (e.g., `onStart()`) and trigger it from the UI.
- **Reactive Data Streams (Database observers, Config flows)**: Avoid manual collection in `init`. Use the **Declarative State Pattern** with the `stateIn` operator.

> **See [Passive Initialization Mandate](references/passive-initialization.md)** for code examples and testing benefits.

## 2. UI State Modeling (The Hybrid Pattern)

To ensure a robust interface, use the **Hybrid Model**: a `data class` for global coordination and a `sealed interface` for mutually exclusive content.

- **Mutually Exclusive Phases** (Initial, Success, Error, NeedsPermission): Use a `sealed interface` for the `content` property.
- **Additive/Overlay States** (isLoading, Dialogs, FAB visibility): Use `Boolean` flags in the parent `data class`.
- **Atomic State Updates (UDF)**: You MUST use `MutableStateFlow.update { ... }` to modify the state. NEVER use `_state.value = _state.value.copy(...)` to prevent state race conditions.
- **Strict Default-Free & Non-Nullable UI Models (Mappers as Sole Authority)**: UI data models (`*UiModel`) nested inside `Success` states MUST NOT declare default parameter values (`= ...`) or nullable fields (`?`). UI Mappers/Factories are the sole authority for formatting and fallback resolution, guaranteeing compile-time fail-fast safety when UI models evolve.

> **See [Hybrid UI State](references/hybrid-ui-state.md)** for detailed implementation examples and the Flexibility Clause.

## 3. UI Actions & Coroutine Management

To ensure a clean separation of concerns and a passive UI, the **ViewModel MUST manage its own coroutines** for any UI-triggered actions.

- **Non-suspending UI Actions**: Functions exposed by the ViewModel for UI events (clicks, form submissions) MUST NOT be `suspend` functions. They should launch work internally using `viewModelScope`.
- **Passive UI**: Screen composables should only notify the ViewModel and not handle `rememberCoroutineScope`.

> **See [UI Actions & Coroutine Management](references/ui-actions-coroutines.md)** for implementation patterns and rationale.

## 4. Action Idempotency & Concurrency Guarding

To prevent redundant work or double side-effects, the ViewModel MUST ensure that its actions are idempotent.

Choose the appropriate guard pattern:
- **UDF State Guarding**: Check `if (state.value.isLoading) return`. The primary and preferred approach for standard UI interactions (Main Thread events).
- **Mutex Guarding**: Reserved for complex concurrency. Use `withLock` for sequential queueing, `tryLock` + `finally` for thread-safe fast-entry, or `tryLock` without `unlock` for singleton engines.

> **See [Concurrency Guarding Patterns](references/mutex-guarding.md)** for exact code implementations and when to use Mutex vs UDF.