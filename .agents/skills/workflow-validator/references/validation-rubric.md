# Feature Validation Rubric & Report Template (`workflow-validator`)

Use this rubric during independent validation and write the result to **`docs/features/<feature-id>/validator/validation-report.md`**.

---

## 1. Evaluation Rubric

| Category | Question | Pass Signal | Fail Signal |
| :--- | :--- | :--- | :--- |
| **Level 1: Spec & Correctness** | Does the implementation match `docs/features/<feature-id>/spec.md`? | All `Given/When/Then` scenarios and UI states (`Loading`, `Error`, `Empty`, `Success`) are implemented with real logic. | Behavior missing, stubbed with `TODO`/hardcoded fakes, or materially different from the spec. |
| **Level 2: Scope & Assets** | Did implementation stay inside `<feature-id>` (`WIP=1`) and follow asset rules? | Only relevant files changed; `ui/resources/` PNG/JPEGs converted to `.webp`; `ui/screens/` mockups untouched. | Adjacent features implemented opportunistically, or screen mockups converted to drawables. |
| **Level 2: Security** | Does the diff avoid Android and API security regressions? | Exported components guarded (`android-intent-security`), no hardcoded secrets, boundary inputs validated. | Unprotected exported components, Intent redirection risk, secrets committed, private data logged. |
| **Level 3: Tests & Compiler Evidence** | Are unit and Compose UI tests meaningful, and did `@compiler` pass? | Exact `@compiler` (`assembleDebug`, `lintDebug`, `testDebugUnitTest`) evidence recorded; unit & Compose UI tests assert real behavior. | Missing compiler evidence, failing checks hidden, or empty/trivial test assertions. |
| **Level 4: Runtime / User-Flow** | Was runtime behavior verified when an emulator/device is active? | Verified via `@android-cli` on active device, or explicitly documented as verified via Unit + Compose UI tests when headless. | Crash on launch or broken navigation flow on active emulator. |
| **Handoff Readiness** | Is the worktree state clean for `workflow-documenter`? | `feature_list.json` (`passing`) and `PROGRESS.md` match reality; no temporary build junk tracked. | State files contradict the diff or omit blockers. |

> **Important Note on Documentation**: Do NOT raise `revise` findings for missing KDoc or un-updated `ARCHITECTURE.md` / `README.md` / `spec.md` checkboxes. Those tasks belong exclusively to **`workflow-documenter`**, which runs *after* your `accept` verdict.

---

## 2. Severity & Verdict Guidance

### Severity Levels
- **Critical**: Unsafe, data-loss, security vulnerability, project does not compile, or feature is fundamentally wrong.
- **High**: An acceptance scenario fails, required unit/UI tests are missing/broken, or scope discipline is violated.
- **Medium**: Maintainability or edge-case gap likely to cause bugs or hurt future sessions.
- **Low**: Minor polish or non-blocking note.

### Verdict Rules
- **`accept`**: Zero `Critical` or `High` findings (and no unaddressed `Medium` bugs); verification evidence is complete.
- **`revise`**: Fixable `Critical`, `High`, or `Medium` findings exist. Requires a complete **`Implementation Repair Brief`**.
- **`block`**: Validation cannot continue, wrong feature implemented, missing spec, or unsafe repository state.

---

## 3. Mandatory Template for `docs/features/<feature-id>/validator/validation-report.md`

Always write `docs/features/<feature-id>/validator/validation-report.md` using this exact structure so **`workflow-implementer`** and **`workflow-orchestrator`** can parse it effortlessly:

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
| **3. Compiler Evidence & Test Quality** | `PASS` / `FAIL` | <Verified recorded `@compiler` evidence / Rerunnable checks & Unit/Compose UI test review> |
| **4. Runtime / Emulator Flow (`@android-cli`)** | `PASS` / `SKIPPED` / `FAIL` | <Emulator verification result or note that no active device was connected> |

---

## 2. Findings

*(If Verdict is `accept` and there are no findings, write: "No blocking or non-blocking findings identified.")*

### Finding 1: <Short Descriptive Title>
* **Severity**: `Critical` | `High` | `Medium` | `Low`
* **File / Evidence**: `<path/to/File.kt#L10-L25 or command output>`
* **Why it matters**: <Impact on correctness, Clean Architecture, security, or test reliability>
* **Required change**: <Concrete outcome required>
* **Suggested implementation steps**:
  1. <Step 1>
  2. <Step 2>
* **Verification after fix**:
  * `<Gradle command or test class to run>`

---

## 3. Security Assessment Summary
* **Status**: `No issues found` | `Notes recorded` | `Blocking security findings`
* **Details**: <Concise summary of `android-intent-security`, secrets, boundary validation, and privacy review>

---

## 4. Implementation Repair Brief (Required when Verdict is `revise` or `block`)

*(When Verdict is `accept`, write: "N/A — Feature accepted and ready for `workflow-documenter`.")*

### Goal
<One-sentence summary of what `workflow-implementer` must fix in the next pass.>

### Do (Ordered Steps for `workflow-implementer`)
1. **[File/Module]**: <Exact change to make>
2. **[File/Module]**: <Exact change to make>
3. **[Tests]**: <Exact unit or Compose UI test to add or update>

### Do Not
* Do not modify unrelated features or expand scope beyond `<feature-id>`.
* Do not alter files that already passed validation unless required by the steps above.

### Run (`@compiler`)
* `./gradlew assembleDebug lintDebug testDebugUnitTest`

### Update
* Update `feature_list.json` (`evidence`) and `PROGRESS.md` with the new verification results.
```
