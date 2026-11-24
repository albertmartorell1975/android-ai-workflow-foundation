# Feature Validation Rubric & Report Template (`workflow-validator`)

Use this rubric during independent validation and return the structured evaluation in your output response to **`workflow-orchestrator`** (which persists it to `docs/features/<feature-id>/validator/validation-report.md` if needed). Do not write or edit files directly from `workflow-validator`.

---

## 1. Evaluation Rubric

| Category | Question | Pass Signal | Fail Signal |
| :--- | :--- | :--- | :--- |
| **Level 1: Spec & Correctness** | Does the implementation match `docs/features/<feature-id>/spec.md` without introducing spec-induced smells? | All `Given/When/Then` scenarios and UI states (`Loading`, `Error`, `Empty`, `Success`) are implemented with real logic; no unchallenged spec-smells. | Behavior missing, stubbed with `TODO`/hardcoded fakes, materially different from spec, or blindly implements dead code / unsafe workarounds. |
| **Level 2: Scope & Assets** | Did implementation stay inside `<feature-id>` (`WIP=1`) and follow asset rules? | Only relevant files changed; `ui/resources/` PNG/JPEGs converted to `.webp`; `ui/screens/` mockups untouched. | Adjacent features implemented opportunistically, or screen mockups converted to drawables. |
| **Level 2: Security** | Does the diff avoid Android and API security regressions? | Exported components guarded (`android-intent-security`), no hardcoded secrets, boundary inputs validated. | Unprotected exported components, Intent redirection risk, secrets committed, private data logged. |
| **Level 3: Tests, Lint & Architecture** | Are pure JVM unit tests meaningful, Lint XML clean, and all 17 Triggers satisfied? | Independent uncached `@compiler` evidence verified (incl. Lint XML inspection on modified/new files); all 17 REVISE Triggers pass; tests pass Per-Test Value & Falsifiability Audit within `0–6` Strict Test Budget. | Cached/unverified evidence, Lint/compiler warnings on touched files, any of the 17 Triggers violated, or any `DELETE`/`CONSOLIDATE` test. |
| **Level 4: Runtime / User-Flow** | Was runtime behavior verified when an emulator/device is active? | Acceptance Scenarios executed via `@android-cli` / `adb` on active device, or recorded as `SKIPPED (headless)` and verified via pure JVM tests + `@Preview`s. | Crash on launch, broken navigation flow, or SQLite/migration error on active emulator. |
| **Handoff Readiness** | Is the worktree state clean for `workflow-documenter`? | `feature_list.json` (`passing`) and `PROGRESS.md` match reality; no temporary build junk tracked. | State files contradict the diff or omit blockers. |

> **Important Note on Documentation**: Do NOT raise `revise` findings for missing KDoc or un-updated `ARCHITECTURE.md` / `README.md` / `spec.md` checkboxes. KDoc authoring belongs exclusively to **`workflow-documenter`** (Stage 4) and Markdown/spec updates belong to **`workflow-orchestrator`** (Stage 5), both running *after* your `accept` verdict.

> **Spec-Smell Escalation**: Literal compliance with `spec.md` does **NOT** excuse dead code, `@SuppressLint` workarounds, magic literals, or regressions against `CONSTRAINTS.md`. Raise a Blocking Finding if a hard guardrail is breached, or surface it under `Non-Blocking Code Review Observations` when a design trade-off in `spec.md` warrants human review.

---

## 2. Severity & Verdict Guidance

### Severity Levels
- **Critical**: Unsafe, data-loss, security vulnerability, project does not compile, or feature is fundamentally wrong.
- **High**: An acceptance scenario fails, required pure JVM unit tests are missing/broken, or scope/architecture discipline is violated.
- **Medium**: Maintainability, Lint/suppression, dead-code, magic-literal, dispatcher, or edge-case gap likely to cause bugs or hurt future sessions.
- **Low**: Minor polish, naming preference, subtle inconsistency, or cross-OS CI advisory (non-blocking — MUST still be surfaced under `Non-Blocking Code Review Observations`, never silently omitted).

### Verdict Rules
- **`accept`**: Zero `Critical`, `High`, or `Medium` findings; independent verification evidence and Adversarial Attempts Log are complete; `Non-Blocking Code Review Observations` section is explicitly populated.
- **`revise`**: Fixable `Critical`, `High`, or `Medium` findings exist (or any of the 17 Mandatory REVISE Triggers matched). Requires a complete **`Implementation Repair Brief`**.
- **`block`**: Validation cannot continue, wrong feature implemented, missing spec, or unsafe repository state.

---

## 3. Mandatory Output Structure (Returned to `workflow-orchestrator`)

Always format your validation response using this exact structure so **`workflow-orchestrator`** and **`workflow-implementer`** can use it directly:

```markdown
# Validation Report: <feature-id>

> 🟢 / 🔴 **Validator**: `[VALIDATOR · workflow-validator]`
> **Verdict**: `accept` | `revise` | `block`
> **Spec Contract**: `docs/features/<feature-id>/spec.md`
> **Iteration**: <1, 2, ...>

---

## 1. 4-Level Validation Matrix

| Validation Level | Status (`PASS` / `FAIL` / `SKIPPED`) | Summary & Evidence |
| :--- | :--- | :--- |
| **1. Spec Contract & Acceptance Scenarios** | `PASS` / `FAIL` | <Summary of Given/When/Then scenarios and UI asset checks> |
| **2. Security & Scope Discipline** | `PASS` / `FAIL` | <Summary of `android-intent-security`, secrets, boundary inputs, and `WIP=1` scope check> |
| **3. Compiler Evidence, Lint & Architecture** | `PASS` / `FAIL` | <Uncached `@compiler` checks, Lint XML inspection, 17-Trigger audit & Pure JVM unit test review> |
| **4. Runtime / Emulator Flow (`@android-cli`)** | `PASS` / `SKIPPED` / `FAIL` | <Emulator verification result or note that no active device was connected> |

---

## 2. Findings

### 2.1 Blocking Findings (Critical / High / Medium)
*(If Verdict is `accept`, write: "No blocking findings identified.")*

#### Finding 1: <Short Descriptive Title>
* **Severity**: `Critical` | `High` | `Medium`
* **File / Evidence**: `<path/to/File.kt#L10-L25 or command output>`
* **Why it matters**: <Impact on correctness, Clean Architecture, security, or maintainability>
* **Required change**: <Concrete outcome required>
* **Suggested implementation steps**:
  1. <Step 1>
  2. <Step 2>
* **Verification after fix**:
  * `<Gradle command or test class to run>`

### 2.2 Non-Blocking Code Review Observations (Low / Spec-Smells / Cross-OS Risks)
*(MANDATORY even when Verdict is `accept`. Surface every minor inconsistency, naming concern, potential Linux-vs-Windows CI/rendering risk, or `spec.md` trade-off without rationalizing it away. Write "None observed after adversarial diff inspection." only if genuinely zero.)*

* **Observation 1 (`<File.kt#L..>`)**: <Concrete detail, why a senior reviewer might care, and optional suggestion>

---

## 3. Security Assessment Summary
* **Status**: `No issues found` | `Notes recorded` | `Blocking security findings`
* **Details**: <Concise summary of `android-intent-security`, secrets, boundary validation, and privacy review>

---

## 3.1 Per-Test Value & Falsifiability Audit *(Required when `*Test.kt` added/modified)*

| `@Test` | Subject & Real Complexity | Production Line That Breaks If Inverted | Verdict (`KEEP` / `CONSOLIDATE` / `DELETE`) |
| :--- | :--- | :--- | :--- |
| `<ClassTest.method>` | `<Branch / Math / Error Mapping / State Machine>` | `<File.kt#L..>` | `KEEP` / `CONSOLIDATE` / `DELETE` |

*(If no `*Test.kt` files were added/modified, write: "N/A — 0 unit tests added/modified (verified boilerplate-only / UI-only slice).")*

---

## 3.2 Adversarial Attempts Log *(Mandatory before any `accept`)*

1. **Attempt — <What you tried to break>**: <Concrete probe / input / XML check / runtime test> -> **Result**: `PASS` / `FAIL` (<exact evidence>)

---

## 4. Implementation Repair Brief (Required when Verdict is `revise` or `block`)

*(When Verdict is `accept`, write: "N/A — Feature accepted and ready for `workflow-documenter`.")*

### Goal
<One-sentence summary of what `workflow-implementer` must fix in the next pass.>

### Do (Ordered Steps for `workflow-implementer`)
1. **[File/Module]**: <Exact change to make>
2. **[File/Module]**: <Exact change to make>
3. **[Tests]**: <Exact pure JVM unit test to add or update>

### Do Not
* Do not modify unrelated features or expand scope beyond `<feature-id>`.
* Do not alter files that already passed validation unless required by the steps above.

### Run (`@compiler`)
* `./gradlew assemble<Flavor>Debug lint<Flavor>Debug test<Flavor>DebugUnitTest` *(or `./gradlew assembleDebug lintDebug testDebugUnitTest` for non-flavored projects)*

### Update
* Update `feature_list.json` (`evidence`) and `PROGRESS.md` with the new verification results.
```
