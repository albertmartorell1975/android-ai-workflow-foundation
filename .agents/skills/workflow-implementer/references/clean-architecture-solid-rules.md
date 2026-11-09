# Clean Architecture & SOLID Implementation Invariants

These non-negotiable rules govern all code written by `workflow-implementer`. Always apply these rules before writing code:

---

## 1. Clean Architecture Layer Boundaries
* **Pure Domain & UseCases**: `:domain` and `:usecases` (or `:<feature>:domain`) MUST be pure Kotlin/JVM modules. Zero imports of Android framework (`android.*`, `Context`), Room, Retrofit, or Jetpack Compose. `javax.inject.Inject` is the only framework annotation permitted.
* **Strict Directed Flow**: `UI -> ViewModel -> UseCase -> Repository (Interface in Domain) <- RepositoryImpl (Data) -> DataSources`. ViewModels MUST NEVER import or inject DataSources directly.

---

## 2. SOLID Principles Applied to Android
* **SRP (Single Responsibility)**:
  - Each `UseCase` has exactly ONE public method (`suspend operator fun invoke(...)` or `operator fun invoke(...)`) executing a single business interaction. Do not write trivial unit tests (`*UseCaseTest`) for 1:1 pass-through UseCases.
  - ViewModels only orchestrate UI state; they never perform domain calculations or multi-step data transformations, delegating business logic to UseCases and model conversions to Mappers.
  - Repository implementations only coordinate SSOT and data source fetch/cache policies; they delegate data transformation to pure mappers.
* **OCP & Polymorphism**: Use `sealed interface` / `sealed class` for UI states, UI events, and domain errors. Use exhaustive `when` without blanket `else ->` branches.
* **ISP (Interface Segregation)**: Interface contracts must be small and cohesive. Avoid bloated `*Repository` interfaces.
* **DIP (Dependency Inversion)**: ViewModels and UseCases MUST depend on abstractions (interfaces defined in `:domain`), never on concrete `*Impl` classes or concrete data sources.

---

## 3. Dependency Injection (`hilt`)
* **Constructor Injection**: Always use `@Inject constructor(...)` for classes you author.
* **Interface Binding**: Always bind interfaces using `@Binds abstract fun bind*(impl: *Impl): *` inside `@Module abstract class`. Never use `@Provides` for classes with an `@Inject constructor`.
* **Visibility Discipline**: All implementation classes (`*Impl`), Room Entities, DAOs, and Network DTOs MUST be declared `internal` so external modules cannot bypass domain interfaces.

---

## 4. ViewModel Governance (`viewmodel-architecture-governance`)
* **Passive Initialization Mandate**: `init {}` blocks MUST NOT launch coroutines or trigger loads. Use `stateIn(SharingStarted.WhileSubscribed(5_000))` for reactive streams or an explicit `onStart()`/action for one-shot events.
* **Hybrid UI State**: `data class *UiState(val isLoading: Boolean = false, val content: Content = Content.Loading)` with `sealed interface Content { object Loading, data class Success, data class Error(val error: DomainError) }`.
* **Atomic Updates**: Always use `_state.update { it.copy(...) }`. Never use `_state.value = _state.value.copy(...)`.
* **Zero Resource Coupling**: ViewModels MUST NOT import `R.string` or build user-facing strings. Expose `DomainError` in Error state or `UiText` for transient messages.

---

## 5. Repository Pattern & Error Handling (`repository-pattern-governance`)
* **Typed Domain Errors**: Repositories MUST return `Result<T, DomainError>` or `Flow<Result<T, DomainError>>`.
* **No Leaked Exceptions**: Technical exceptions (`IOException`, `HttpException`, `SQLiteException`) MUST be caught in `:data` via `safeCall` and mapped to typed `DomainError`. Never catch `CancellationException`.

---

## 6. Model Design (DTOs, Entities, Domain, UI Models)
* **Zero Defaults & Zero Unnecessary Nullables on Data/Domain/UI Models**: DTOs, Entities, Domain Models, and nested `*UiModel` classes MUST NOT declare default values (`= ...`) or nullable types (`?`) unless nullability is an explicit business requirement. *(Exception: Only the top-level screen state container `*UiState` may define initial default values such as `val isLoading: Boolean = false, val content: Content = Content.Loading`).*
* **Boundary Isolation**: DTOs stay in `:data/network`, Entities stay in `:data/local`, Domain models stay in `:domain`, and UI models stay in `:app`/`:presentation`.

---

## 7. Mappers
* **Sole Authority**: Mappers are the exclusive authority for default fallback values and data normalization.
* **Data Mappers**: Pure extension functions or factory classes in `:data` (`Dto -> Entity -> Domain`).
* **UI Mappers**: Dedicated `internal class *UiMapper` in presentation layer. MUST NOT hardcode language units (`" pts"`, `"%"`). Provide raw formatted numbers or `@StringRes` arguments for resolution via `stringResource`.

---

## 8. Jetpack Compose Best Practices (`compose-*` & `design-system-governance`)
* **State Hoisting (`*Screen` vs `*Content`)**: Separate the stateful route composable (`*Screen`, which collects `uiState` via `collectAsStateWithLifecycle()` and wires callbacks) from the stateless UI composable (`*Content(uiState: *UiState, onAction: (...) -> Unit, modifier: Modifier = Modifier)`).
* **Modifier Hygiene**: Every reusable or stateless composable MUST accept `modifier: Modifier = Modifier` as its first optional parameter, apply it to its root layout node once, and never hardcode `.fillMaxSize()` on reusable components.
* **Mandatory Previews**: Provide `@Preview` (or project-standard `@BcThemePreview`) functions covering `Loading`, `Success`, and `Error` states on the stateless `*Content` composable.

---

## 9. Kotlin Style & Coroutine Safety (`kotlin-style` & `kotlin-coroutines-structured-concurrency`)
* **Coroutine Cancellation Safety**: Never catch broad `Exception` or `Throwable` in `suspend` functions without immediately rethrowing `CancellationException` (`if (e is CancellationException) throw e`).
* **No Domain/Mapper Extensions on Primitives or `String`**: Do not pollute global completion with `fun String.toX()` or `fun Int.toY()`; scope conversions to the specific DTO/Entity/Domain class or dedicated Mapper.
* **Class Layout Order**: Keep class members ordered strictly as: Properties -> `init` blocks -> Public functions -> Private functions -> `companion object` at the very bottom.
