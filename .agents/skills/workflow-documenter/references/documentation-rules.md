# Concise, High-Signal KDoc Rules (`workflow-documenter`)

## 1. Anti-Bloat & Conciseness Mandate (`kotlin-style`)

KDoc exists to help human reviewers understand **non-obvious contracts and invariants** — never to pad Pull Request diffs with boilerplate that repeats Kotlin signatures. All KDoc MUST be written in **English** and obey these four strict caps:

1. **1–3 Sentence Summary Cap**:
   - Keep every KDoc block to **1–3 concise sentences** explaining *why* the type/function exists, its domain invariant, state-restoration behavior, or `DomainError` contract.
   - Prefer a **single-line KDoc** (`/** Resolves [WeatherCondition] from an OpenWeather condition code. */`) whenever one sentence suffices.
2. **`public` Contracts Only (Zero `internal` / `private` / `@Preview` KDoc)**:
   - Document **only `public`** classes, interfaces, enums, sealed hierarchies, and root reusable functions.
   - **NEVER** add KDoc to `private` or `internal` declarations (`internal class *RepositoryImpl`, `internal object *Primitives`, DTOs, Room `@Entity`/`@Dao`, `*Mapper`), `@Preview` composables, or `*Test.kt` files.
3. **Zero Obvious `@param` / `@property` / `@return` Tags**:
   - **STRICTLY FORBIDDEN** to emit `@param` or `@property` tags for self-explanatory names or standard Android/Compose parameters (`modifier`, `text`, `color`, `style`, `shape`, `enabled`, `onClick`, `onDismissRequest`, `content`, `icon`, `title`, `message`, `label`, `id`, `name`, `state`, `fontWeight`, `textAlign`, `overflow`, `maxLines`).
   - Add `@param`, `@property`, or `@return` **ONLY** when documenting a non-obvious unit (e.g., Celsius vs. Kelvin, milliseconds), numeric range/threshold, Process Death / `SavedStateHandle` key constraint, or `Result<T, DomainError>` failure mapping.
4. **Zero Copy-Paste Across Delegating Wrappers / Overloads**:
   - When an `object` or file defines thin convenience wrappers/overloads that delegate 1:1 to a documented base function (e.g., typography scale helpers `DisplayLarge`..`LabelSmall` delegating to a base `Text` wrapper, or secondary/tertiary button wrappers), document the base composable/container **once** and **omit KDoc completely** on the 1:1 delegating wrappers.

### Good (Concise, High-Signal — +4 lines)
```kotlin
/**
 * Base design-system text composable enforcing theme typography tokens with optional weight override.
 */
@Composable
fun AppText(text: String, style: TextStyle, modifier: Modifier = Modifier, ...)
```

### Bad (PR-Inflating Boilerplate — Forbidden)
```kotlin
/**
 * Renders [text] using the `displayLarge` typography token.
 *
 * @param text String content to display.
 * @param modifier Modifier applied to the text layout.
 * @param color Foreground color override...
 * @param maxLines Maximum number of lines...
 */
```

---

## 2. Zero Code & Zero Markdown Mutation Guardrails

When adding KDoc to `.kt` files:
- Edit only around class, interface, function, and property headers.
- **Never** modify imports, package declarations, annotations (`@HiltViewModel`, `@Composable`, `@Inject`), parameter defaults, or function bodies.
- Preserve all existing comments and KDoc that are still accurate.
- **Never** modify Markdown (`.md`) or JSON files (`spec.md`, `ARCHITECTURE.md`, `CONSTRAINTS.md`, `README.md`, `PROGRESS.md`, `feature_list.json`). Updating project Markdown documentation and harness state is the exclusive responsibility of **`workflow-orchestrator`** during Stage 5 Consolidation.
