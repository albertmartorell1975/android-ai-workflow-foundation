# Level 4 Runtime, Activity Recreation & Process Death Probes (`workflow-validator`)

Execute this runbook whenever `spec.md` declares `UI Involved: yes` and an emulator/device is active. If no device is active (or `UI Involved: no`), record Level 4 as `SKIPPED (headless)` and note that behavior was verified via Pure JVM tests, static Trigger #18 audit, and `@Preview`s. This never blocks the pipeline.

---

## 1. Pre-Conditions & Black-Box User Flows (`@android-cli`)

1. Verify that the pre-installed application is launched, or deploy the hydrated APK artifact located at `app/build/outputs/apk/` using `android run --apks=<path>` *(retry `android` / `adb` commands with `BypassSandbox: true` if blocked by sandbox local socket restrictions)*.
2. Execute the `Given / When / Then` Acceptance Scenarios of `docs/features/<feature-id>/spec.md` as black-box `android-cli` journeys (`android layout --diff`, `android screen capture` saving any temporary captures under git-ignored `app/build/outputs/`; see `android-cli` references `journeys.md` and `interact.md`) and verify the flow without crashes.

---

## 2. Building the Mandatory Probe Checklist

Lifecycle & Process Death runtime probes are **MANDATORY across EVERY stateful screen, non-root route, and critical persistable interactive state** touched by the feature when an emulator is active *(mark `N/A — stateless component/token slice` only for pure Design System slices)*:

- Build the **Probe Checklist** from `spec.md` Section 4 (*Process Death & State Restoration*) cross-checked against `git diff`:
  - Include **every distinct stateful destination and critical persistable state** introduced or modified by the feature (e.g., list screen with active search/filter/tab, each non-root detail or sub-graph route, active form/draft input, or open stateful modal/sheet when `spec.md` expects it to survive).
  - **Do NOT probe** purely ephemeral network-error or loading overlays (those belong to pure JVM tests and Section 3.5 State Machine Audit).
  - **Shared Navigation Infrastructure Rule**: If the feature modifies `MainActivity`, `NavHost`, or `AppState`, include the root destination plus at least one existing non-root destination to verify global backstack restoration.
- Running only a single probe on one screen is **insufficient** when a feature spans multiple screens or stateful flows.

---

## 3. Probe 4A — Activity Destruction (*Don't keep activities*)

Tests `MainActivity` + Compose `setContent` teardown/recreation while `ViewModelStore` stays alive (simulating system picker/OAuth return or low-RAM Activity eviction):

1. Enable once at the start of the pass:
   ```bash
   adb shell settings put global always_finish_activities 1
   ```
2. **Repeat for every screen/state in the Probe Checklist**:
   - Navigate into that screen and set up its active UI state.
   - Clear logs: `adb logcat -c`.
   - Background via `adb shell input keyevent KEYCODE_HOME`.
   - Resume from Recents (`adb shell input keyevent KEYCODE_APP_SWITCH` + tap app card via `@android-cli`).
   - Verify via `android layout` and `adb logcat -d AndroidRuntime:E JavaBinder:E *:S` that `rememberSaveable` state survives, zero crashes or Binder transaction errors occur, and `LaunchedEffect` does not trigger duplicate loads or reset valid ViewModel state.
3. **MANDATORY Cleanup (always execute BEFORE starting Probe 4B and on any failure/abort)**:
   ```bash
   adb shell settings put global always_finish_activities 0
   ```

---

## 4. Probe 4B — True Process Death (OS LMK Simulation)

Tests full Linux process termination (`Application`, Hilt `@Singleton`s, `ViewModel`s, and Compose tree wiped) while preserving the `NavHost` backstack and saved `Bundle`s:

1. Resolve the exact running `<applicationId>` (including flavor/buildType suffix, e.g. via `adb shell dumpsys activity activities | grep mResumedActivity`).
2. **Repeat the full LMK kill-and-restore cycle for EVERY distinct stateful screen, non-root destination, and critical interactive state in the Probe Checklist**:
   1. Navigate to the target screen/destination and set up its active state (e.g., query/filter, selected tab, detail route, draft input, or stateful sheet).
   2. Capture `PID_BEFORE` via `adb shell pidof <applicationId>` (**MUST be non-empty**), and clear logs (`adb logcat -c`).
   3. Background the app via `adb shell input keyevent KEYCODE_HOME` and wait ~1–2 seconds so Android finishes `onStop()` + `onSaveInstanceState()` and lowers the process to *Cached* priority.
   4. Kill the cached process cleanly:
      ```bash
      adb shell am kill <applicationId>
      ```
      *(NEVER use `am force-stop`, which wipes the task stack and saved instance state.)*
   5. Confirm the process is dead: `adb shell pidof <applicationId>` returns empty *(if still alive, wait 2 seconds and retry `am kill` once; never substitute `am force-stop`)*.
   6. Restore the existing task exclusively via **Recents** (`adb shell input keyevent KEYCODE_APP_SWITCH` + tap app card via `@android-cli` — NEVER a plain cold `am start -n` that bypasses task restoration).
   7. Confirm `PID_AFTER` (`adb shell pidof <applicationId>`) is non-empty and **`PID_AFTER != PID_BEFORE`** (proving real process death occurred).
   8. Verify via `adb logcat -d AndroidRuntime:E JavaBinder:E *:S` and `android layout` that:
      - Zero crashes (`NullPointerException`, deserialization errors, `TransactionTooLargeException`, `FAILED BINDER TRANSACTION`) occurred.
      - The app restored directly onto that exact active destination with intact data/input state (not blank, not reset to root unexpectedly, not stuck in infinite `Loading`).

---

## 5. Mandatory Reporting

Record every probed screen/state as its own row in the **Level 4 Process Death & Recreation Matrix** (Section 3.3 of [Validation Rubric](validation-rubric.md)). Omitting any stateful screen, non-root route, or persistable interactive state touched by the feature invalidates `accept`.
