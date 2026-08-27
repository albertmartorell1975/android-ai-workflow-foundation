---
name: design-system-governance
description: Codifies A11y, RTL, Adaptive, and Reusability standards for the Design System.
metadata:
  author: Albert Martorell Garcia
  version: 1.1.0
  keywords: [design-system, a11y, rtl, adaptive, stateless, compose, tokens, testing, roborazzi]
---
# Design System Governance Rules

This skill ensures that any AI agent or developer modifying the UI adheres to the professional standards defined for the project.

## 1. Architectural Principles (Super-Hoisting)
- **Statelessness**: Every `MM*` component MUST be stateless. No internal `remember { mutableStateOf(...) }`.
- **Stateless Previews (CRITICAL)**: Corresponding `@Preview` functions MUST also be stateless. Avoid instantiating components that depend on Firebase, Hilt, or other infrastructure, as the **Roborazzi Automated Scanner** will fail to render them in unit test environments.
- **Slot API Pattern**: Mandatory for components receiving content. Use `content: @Composable RowScope.() -> Unit` or equivalent.
- **Modifier Requirement**: Every component MUST include `modifier: Modifier = Modifier` as its first optional parameter.

## 2. Infrastructure Requirements
- **JDK 21**: Mandatory for projects targeting SDK 36+. Robolectric and Roborazzi require Java 21 to accurately simulate modern Android runtimes.

## 2. Accessibility (A11y) & Low Vision
- **Contrast**: Mandatory **WCAG AA** (4.5:1 ratio). Use `MaterialTheme.colorScheme` roles correctly.
- **Touch Targets**: Min 48x48dp via `Modifier.minimumInteractiveComponentSize()`.
- **Scaling**: Support 200% font scaling without clipping. Always use **sp** for text.
- **Reflow**: NEVER use `height(fixed_dp)` in containers with text. Use `wrapContentHeight()` or `minHeight`.
- **Pinch-to-zoom**: Implement in-app scaling via `MMDensityProvider` where contextually appropriate.
- **Persistence**: User legibility settings MUST be saved via **DataStore**.

## 3. RTL & Adaptive Support
- **Mirroring**: Use `start/end` exclusively. No `left/right`. Directional icons MUST be mirrored in RTL.
- **Navigation**: Use `MMNavigation` (wrapping `NavigationSuiteScaffold`) to handle Bar/Rail transitions.
- **Insets**: Components must handle `WindowInsets` for **Android 15 Edge-to-Edge** compliance.

## 4. Visual Excellence & Motion
- **Typography**: Use variable font axes (weight) for interaction feedback via **Roboto Flex**.
- **Motion**: Use **Spring Physics** (Spring.StiffnessMediumLow) for all transitions (natural feedback).
- **Feedback**: Use `AnimatedIcon` for expressive state changes.

## 5. Behavioral Matrix (Version Compliance)

| Feature | Android 12+ (API 31) | Android 11 & Lower |
| :--- | :--- | :--- |
| **Color Palette** | **Dynamic**: Material You (Wallpaper-based). | **Static**: Uses predefined Reference Tokens. |
| **Font Scaling** | **Non-linear (A14+)**: Adaptive scaling via `sp`. | **Linear**: Uniform scaling. |
| **Edge-to-Edge** | **Native (A15+)**: Mandatory bar transparency. | **Custom**: Handled via `WindowInsets` logic. |
| **Navigation** | **Adaptive**: Automatic Bar vs. Rail transition. | **Fixed**: Width-based transition logic. |

## 6. Testing & Verification (Roborazzi)
To verify UI changes, use the following commands:
- **Record**: `./gradlew recordRoborazziDebug` (Generate Golden Images).
- **Verify**: `./gradlew verifyRoborazziDebug` (Check visual regression).

### Testing Matrix
Every component MUST be verified against **16 permutations**:
`LayoutDirection (LTR/RTL)` x `Orientation (Port/Land)` x `Font Scale (1.0/2.0)` x `Theme (Light/Dark)`.
Roborazzi's `generateComposePreviewRobolectricTests` handles this automatically for every `@Preview` found in the `ui` package.
