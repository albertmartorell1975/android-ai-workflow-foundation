# Compose Design System Testing

> **Scope**: This document applies **exclusively to isolated, pure widgets inside the `:design-system` module** (e.g. `MM*` components). It MUST NEVER be used to test application Screens, Features, or navigation. Those are covered by Pure JVM tests (ViewModels/Mappers), `@Preview` + `lintDebug`, and black-box validation via `@android-cli` (see `testing-setup` §3.1, §3.6, §3.7).

## Core principle

Test the smallest UI contract that proves the behavior of a single widget. Pass fixed state and capture callbacks; never construct ViewModels, Hilt graphs, or navigation.

## Test target choice

| What you need to prove | Test shape |
| :--- | :--- |
| Text, enabled/disabled, conditional content of a widget | Plain Compose test with semantics assertions |
| Callback wiring from click/input | Plain Compose test with a captured value |
| Hover, pressed, focused, dragged appearance | Plain test with injected `MutableInteractionSource` |
| Visual layout, typography, elevation, theming | Roborazzi snapshot of the existing `@Preview` (see `design-system-governance` §4) |
| Locale / RTL / font scale / window size | `DeviceConfigurationOverride` |

## Semantics first

- Assert semantics when behavior is semantic: `onNodeWithText`, `assertIsEnabled`, `assertIsNotEnabled`, `assertIsDisplayed`, `assertDoesNotExist`.
- Use test tags only for nodes without stable user-visible text or when several nodes share text.
- Never expose visual properties (colors, font size, radius) through custom semantics just to test them; use a Roborazzi snapshot instead.

## Callback testing

```kotlin
var clicked = false

composeTestRule.setContent {
    MMButton(text = "Save", onClick = { clicked = true })
}

composeTestRule.onNodeWithText("Save").performClick()
composeTestRule.runOnIdle { assertTrue(clicked) }
```

## Interaction state with `MutableInteractionSource`

Inject a `MutableInteractionSource` and emit the interaction directly. Do NOT simulate pointer/mouse events to trigger hover/press/focus: that is fragile and environment-dependent.

```kotlin
val interactionSource = MutableInteractionSource()

composeTestRule.setContent {
    MMButton(text = "Save", onClick = {}, interactionSource = interactionSource)
}

runBlocking { interactionSource.emit(HoverInteraction.Enter()) }
composeTestRule.waitForIdle()

// Assert the semantic result, or capture a Roborazzi snapshot for the visual result.
composeTestRule.onNodeWithText("Save").assertIsDisplayed()
```

The same pattern works for `PressInteraction.Press` / `Release` / `Cancel`, `FocusInteraction.Focus` / `Unfocus`, and `DragInteraction.Start` / `Stop` / `Cancel`.

## Device configurations

`DeviceConfigurationOverride` is a test-only API to force dark mode, font scale, locale, layout direction, or size locally:

```kotlin
composeTestRule.setContent {
    DeviceConfigurationOverride(
        DeviceConfigurationOverride.ForcedSize(DpSize(1280.dp, 800.dp)) then
            DeviceConfigurationOverride.FontScale(2.0f)
    ) {
        MMCard(title = "Title")
    }
}
```

## Deterministic state

- Use fixed data; freeze clocks and animation progress.
- Replace image/network loading with the fake preview handler (see `design-system-governance` §4, *AsyncImage in Previews*).
- Keep a widget test within the Strict Test Budget (`testing-setup` §3.2).

## Common mistakes

| Mistake | Fix |
| :--- | :--- |
| Testing a whole Screen with `composeTestRule` | Forbidden; use Pure JVM tests + `@Preview` + `@android-cli` Level 4 |
| Snapshot test for simple text presence | Use a semantics assertion |
| Semantics test for padding/color/focus ring | Use a Roborazzi snapshot |
| Simulating hover/press with pointer events | Inject `MutableInteractionSource` and emit |
| Relying on the default internal interaction source | Pass a `MutableInteractionSource` |
