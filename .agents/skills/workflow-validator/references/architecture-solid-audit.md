# Clean Architecture & SOLID Audit Checklist (`workflow-validator`)

During independent validation (Level 3 & Level 3.5), evaluate the implementation against these **13 Mechanical REVISE Triggers**. If any trigger matches, you MUST return verdict `REVISE` with the exact file path and line number in your `Implementation Repair Brief`.

---

## 13 Mandatory Architecture & SOLID REVISE Triggers

| # | Invariant Area | Pass Condition | Mandatory REVISE Trigger (Fails Validation) |
| :-: | :--- | :--- | :--- |
| **1** | **Domain Purity** | `:domain` & `:usecases` contain pure Kotlin/JVM code only. | Any import of `android.*`, `androidx.*` (except Compose in presentation), Room, or Retrofit in `:domain` or `:usecases`. |
| **2** | **Single Responsibility (UseCases)** | Each UseCase has a single public `operator fun invoke(...)`. | Multiple public methods in one UseCase, business logic leaked into ViewModel/RepositoryImpl, or writing trivial unit tests (`*UseCaseTest`) for 1:1 pass-through UseCases. |
| **3** | **Dependency Inversion (DIP)** | ViewModels/UseCases inject Domain interfaces. | Directly injecting concrete `*Impl` classes or data sources into ViewModels or UseCases. |
| **4** | **DI Binding Hygiene (`hilt`)** | Classes with `@Inject constructor` bound via `@Binds` in `@Module abstract class`. | Using `@Provides` in `object` module for a class that has `@Inject constructor`. |
| **5** | **Visibility Encapsulation** | Implementation classes (`*Impl`), DAOs, Entities, and DTOs are `internal`. | Any `*Impl`, Room `@Entity`, Room `@Dao`, or network DTO declared `public` in `:data`. |
| **6** | **Passive ViewModel** | ViewModel construction is completely passive. | Any `init { launch { ... } }` or coroutine launched in `init {}`. Must use declarative `stateIn` or explicit `onStart()`. |
| **7** | **Atomic UI State (UDF)** | UI state modified via `_state.update { copy(...) }`. | Using `_state.value = _state.value.copy(...)` (causes race conditions) or exposing MutableStateFlow publicly. |
| **8** | **Zero Resource Coupling in VM** | Errors exposed as typed `DomainError` in `content.Error(val error: DomainError)`. | ViewModel importing `R.string` or assembling user-facing error strings directly. |
| **9** | **Typed Domain Errors** | Repositories return `Result<T, DomainError>` or `Flow`. | Repository leaking raw `Throwable`, `HttpException`, `IOException`, or `SQLiteException` across the domain boundary. |
| **10** | **Model Hygiene (No Defaults/Nullables)** | DTOs, Entities, Domain models, and `*UiModel` are default-free (`= ...`) and non-nullable (`?`). | Adding default values (`= null`, `= ""`, `= 0`) or unnecessary nullables to DTOs, Entities, Domain models, or `*UiModel` *(top-level `*UiState` initial state defaults are permitted)*. |
| **11** | **UI Mapper Decoupling** | Display units (`" pts"`, `"% "`) resolved in Compose via `stringResource`. | UI Mapper concatenating hardcoded language units or returning dummy `0.0` fallbacks. |
| **12** | **Compose State & Previews** | Stateful `*Screen` separated from Stateless `*Content`. | Any new stateless composable missing `@Preview` (`@BcThemePreview`) or root layout hardcoding `.fillMaxSize()` on reusable components. |
| **13** | **Kotlin Style & Coroutine Safety** | Structured concurrency and official Kotlin layout conventions followed. | Catching broad `Exception`/`Throwable` in `suspend` functions without rethrowing `CancellationException`, defining domain/mapper extensions on `String`/primitives, or placing `companion object` above methods. |

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
```
