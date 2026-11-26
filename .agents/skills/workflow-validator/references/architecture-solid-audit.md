# Clean Architecture, SOLID & Senior Code-Review Audit Checklist (`workflow-validator`)

During independent validation (Level 3 & Level 3.5), evaluate the implementation against these **18 Mechanical REVISE Triggers**. If any trigger matches, you MUST return verdict `REVISE` with the exact file path and line number in your `Implementation Repair Brief`.

---

## 18 Mandatory Architecture, SOLID & Senior Code-Review REVISE Triggers

| # | Invariant Area | Pass Condition | Mandatory REVISE Trigger (Fails Validation) |
| :-: | :--- | :--- | :--- |
| **1** | **Domain Purity** | `:domain` & `:usecases` contain pure Kotlin/JVM code only. | Any import of `android.*`, `androidx.*` (except Compose in presentation), Room, or Retrofit in `:domain` or `:usecases`. |
| **2** | **Single Responsibility (UseCases)** | Each UseCase has a single public `operator fun invoke(...)`. | Multiple public methods in one UseCase, business logic leaked into ViewModel/RepositoryImpl, or writing trivial unit tests (`*UseCaseTest`) for 1:1 pass-through UseCases. |
| **3** | **Dependency Inversion (DIP)** | ViewModels/UseCases inject Domain interfaces. | Directly injecting concrete `*Impl` classes or data sources into ViewModels or UseCases. |
| **4** | **DI Binding Hygiene (`hilt`)** | Classes with `@Inject constructor` bound via `@Binds` in `@Module abstract class`. | Using `@Provides` in `object` module for a class that has `@Inject constructor`. |
| **5** | **Visibility Encapsulation** | Implementation classes (`*Impl`), DAOs, Entities, and DTOs are `internal`; helper objects, classes, and constants used only within a single file are `private` (or `internal` if module-scoped). | Any `*Impl`, Room `@Entity`, Room `@Dao`, or network DTO declared `public` in `:data`, OR any new/modified `public` `object`, class, or helper constant referenced exclusively within its own file (must be `private const val` / `private` helper instead of leaking into the public API). |
| **6** | **Passive ViewModel** | ViewModel construction is completely passive. | Any `init { launch { ... } }` or coroutine launched in `init {}`. Must use declarative `stateIn` or explicit `onStart()`. |
| **7** | **Atomic UI State (UDF)** | UI state modified via `_state.update { copy(...) }`. | Using `_state.value = _state.value.copy(...)` (causes race conditions) or exposing MutableStateFlow publicly. |
| **8** | **Zero Resource Coupling in VM** | Errors exposed as typed `DomainError` in `content.Error(val error: DomainError)`. | ViewModel importing `R.string` or assembling user-facing error strings directly. |
| **9** | **Typed Domain Errors** | Repositories return `Result<T, DomainError>` or `Flow`. | Repository leaking raw `Throwable`, `HttpException`, `IOException`, or `SQLiteException` across the domain boundary. |
| **10** | **Model Hygiene (No Defaults/Nullables)** | DTOs, Entities, Domain models, and `*UiModel` are default-free (`= ...`) and non-nullable (`?`). | Adding Kotlin default values (`= null`, `= ""`, `= 0`) or unnecessary nullables to DTOs, Entities, Domain models, or `*UiModel` *(top-level `*UiState` initial state defaults and Room SQL `@ColumnInfo(defaultValue = "...")` annotations for migrated `NOT NULL` columns are permitted)*. |
| **11** | **UI Mapper Decoupling** | Display units (`" pts"`, `"% "`) resolved in Compose via `stringResource`. | UI Mapper concatenating hardcoded language units or returning dummy `0.0` fallbacks. |
| **12** | **Compose State & Previews** | Stateful `*Screen` separated from Stateless `*Content`. | Any new stateless composable missing `@Preview` or root layout hardcoding `.fillMaxSize()` on reusable components. |
| **13** | **Kotlin Style & Coroutine Safety** | Structured concurrency and official Kotlin layout conventions followed. | Catching broad `Exception`/`Throwable` in `suspend` functions without rethrowing `CancellationException`, defining domain/mapper extensions on `String`/primitives, or placing `companion object` above methods. |
| **14** | **Suppression & Lint Hygiene** | Compiler and Lint warnings are fixed at the root cause. | Introducing any new `@SuppressLint(...)` or `@Suppress(...)` annotation without explicit justification in `spec.md` or `pr-review.md` (e.g., silencing `MissingPermission` instead of checking permissions). |
| **15** | **Dead Code & Orphaned Resources** | Every new/modified symbol and resource in the diff is actively used, and superseded legacy docs scheduled in `spec.md` §5 are removed. | Introducing or leaving behind unused public/internal helper objects, classes, methods, extensions, imports, or orphaned XML resources (`strings.xml`, `colors.xml`, drawables) unreferenced anywhere in production code, or leaving superseded legacy docs scheduled for deletion in `spec.md` §5 behind. |
| **16** | **Named Constants (Zero Magic Literals)** | Protocol codes, thresholds, and repeated literals are named constants. | Using un-named magic numbers or repeated protocol/domain literals (e.g., HTTP status codes `401`/`403`, numeric thresholds, key strings) directly inside new/modified production logic. |
| **17** | **Main-Safe Room & Retrofit Dispatchers** | Explicit `withContext(...)` is reserved for blocking I/O or CPU work. | Wrapping already main-safe Room (`suspend` DAO methods, `Flow` queries, `withTransaction`) or Retrofit (`suspend`) calls in redundant `withContext(Dispatchers.IO)`. |
| **18** | **Process Death & Single-Activity State Restoration** | Non-root `NavHost` destinations and sub-graph `ViewModel`s cold-restore after OS LMK kill via `SavedStateHandle` (ID-only `@Serializable` routes), `rememberSaveable` (or `rememberNavBackStack` in Nav 3), and SSOT (Room/DataStore); critical drafts persist eagerly. | Any of: (a) **Single Entry Point Illusion** — non-root screen or sub-graph `ViewModel` depends on mutable RAM state in a `@Singleton`, `Application`, or `companion object` populated by a prior destination instead of route args (`SavedStateHandle`) + SSOT; (b) **Volatile User/Flow State** — user inputs, queries, active filters, selected tabs, or multi-step sub-graph drafts stored in plain `remember` (instead of `rememberSaveable`) or unbacked `MutableStateFlow` without `SavedStateHandle`/SSOT *(excludes purely ephemeral visual state like animations/tooltips or reactive Room-derived state)*; (c) **Unreliable Teardown Persistence** — saving critical state inside `ViewModel.onCleared()` or `Activity.onDestroy()` (never executed on cached LMK kill); (d) **`TransactionTooLargeException` Risk** — storing large lists, bitmaps, or full domain payloads inside `SavedStateHandle`, `rememberSaveable`, or Nav routes instead of primitive IDs/keys; (e) **Missing JVM Restoration Test** — a new/modified `ViewModel` using `SavedStateHandle` lacks pure JVM cold-restoration coverage instantiating it with a pre-populated `SavedStateHandle(mapOf(...))` (either as a dedicated `@Test` or integrated into a cohesive `*ViewModelTest` within the strict test budget); or (f) **Non-Saveable Nav 3 Stack** — using `remember { mutableStateListOf(...) }` instead of `rememberNavBackStack(...)`. |

---

## Static Grep Quick-Check for Validators

Run these rapid checks inside your worktree to catch violations in seconds:
```bash
# 1. Check for init launches in ViewModels:
git grep -n "init {" -- "*ViewModel.kt"

# 2. Check for R.string in ViewModels:
git grep -n "import.*\.R$" -- "*ViewModel.kt"

# 3. Check for mutable state value assignment:
git grep -n "_state\.value =" -- "*ViewModel.kt"

# 4. Check for public Impl classes:
git grep -n "class .*Impl" -- "*data/*" | grep -v "internal "

# 5. Check for default parameters in data/domain/UI models (excluding *UiState.kt):
git grep -n "= null\|= \"\"\|= 0" -- "*Model.kt" "*Entity.kt" "*Dto.kt"

# 6. Check for newly added Lint/compiler suppressions in the diff:
git diff <base>..HEAD -U0 | grep -E "^\+.*@Suppress(Lint)?\("

# 7. Check for redundant Dispatchers.IO wrappers in Room/Retrofit data sources:
git grep -n "withContext(Dispatchers\.IO)" -- "*Room*.kt" "*Dao*.kt" "*DataSource*.kt" "*RepositoryImpl.kt"

# 8. Check new/modified public objects in the diff for single-file-only usage (must be private/internal):
git diff <base>..HEAD -U0 | grep -E "^\+object "

# 9. Check for plain remember { mutableStateOf(...) } in Screens that might hold user input/filters (should be rememberSaveable or hoisted to SavedStateHandle/SSOT):
git diff <base>..HEAD -U0 -- "*Screen.kt" | grep -E "^\+.*remember\s*\{\s*mutableStateOf"

# 10. Check for onCleared() overrides (verify zero critical state persistence) and mutable RAM holders in Singletons:
git diff <base>..HEAD -U0 | grep -E "^\+.*override fun onCleared\(|^\+.*var .*MutableStateFlow"
```

---

## Pragmatic Testing & Triviality Audit (Mandatory `REVISE` Triggers)

Whenever `*Test.kt` files are added or modified, apply these two filters before evaluating `accept`:

### 1. Mechanical Red Flags (Automatic `REVISE` -> `DELETE`)
- **Unplanned test file**: A `*Test.kt` file created outside `docs/features/<feature-id>/spec.md` (unless requested in a Repair/PR-review brief) with no high-value logic.
- **1:1 Pass-Through UseCase**: Target `*UseCase.kt` has zero branches (`if`, `when`, `?:`, `try/catch`, collection ops, or multi-repo orchestration) -> any `*UseCaseTest` MUST be deleted.
- **Model / Constant / 1:1 Mapper**: Subject under test is a `data class` without custom methods, `*PreviewData`, or a mapper copying fields 1:1 with zero fallback/computation.
- **Mirror / Tautology Test**: Test stubs a `Fake*` with value `X` and asserts `X` back without any transformation, calculation, or state-machine transition (`Loading -> Error -> Retry`).
- **Cross-Layer Duplicate**: Same business rule or calculation already tested in `:domain` or `:data` and re-tested in `:usecases` or `*ViewModelTest`.

### 2. Binary Keep Decision Tree (Every `@Test` Must Satisfy >= 1)
A `@Test` is `KEEP` **only** if it exercises at least one of:
1. **Branch or boundary**: `if` / `when` / `?:`, division by zero, empty list, HTTP/DB error path.
2. **Non-trivial transformation / math**: formula, JSON/text parsing, `Throwable -> DomainError` mapping, `*UiMapper` formatting/grouping.
3. **Orchestration / fallback**: >1 data source, cache-then-network, retry policy.
4. **ViewModel state-machine transitions or `SavedStateHandle` cold-restoration (Trigger #18)**: `Loading -> Error -> Retry -> Loading -> Success` asserting intermediate transitions (not only final state), or instantiating a `ViewModel` with pre-populated `SavedStateHandle(mapOf(...))` to verify process-death restoration (dedicated or integrated into a cohesive `*ViewModelTest` within the strict test budget).

If **none** of the 4 apply -> **`DELETE` (`REVISE`)**. If multiple `@Test`s test different inputs to the same pure function -> **`CONSOLIDATE` (`REVISE`)** into 1–2 cohesive `@Test`s.
