---
name: design-system-governance
description: Codifies A11y, RTL, Adaptive, and Reusability standards for the Design System.
metadata:
  author: Albert Martorell Garcia
  version: 1.2.0
  keywords: [design-system, a11y, rtl, adaptive, stateless, compose, tokens, testing, roborazzi, boundary]
---
# Design System Governance Rules

This skill ensures that any AI agent or developer modifying the UI adheres to the professional standards defined for the project, following the [Official Compose Component API Guidelines](https://android.googlesource.com/platform/frameworks/support/+/androidx-main/compose/docs/compose-component-api-guidelines.md).

## 1. Architectural Principles & Boundaries
- **Statelessness**: Every `MM*` component MUST be stateless. No internal `remember { mutableStateOf(...) }`.
- **API Parameter Order**: Following the official Android standards, parameters MUST follow this order:
    1. **Required parameters**: Those without default values (e.g., `onClick`, `text`).
    2. **Modifier**: `modifier: Modifier = Modifier` MUST be the first optional parameter.
    3. **Optional parameters**: Other parameters with default values.
    4. **Trailing Lambda**: If the component accepts content, the Composable lambda MUST be the last parameter.
- **Typographic Boundary**: Use `MMText` exclusively for typography in feature screens.

## 2. Accessibility (A11y), Adaptive & Scaling
- **Universal RTL**: Use `start/end` exclusively. No `left/right`. Directional icons MUST be mirrored.
- **Scaling**: Support 200% font scaling via `sp`. Use `wrapContentHeight()` or `minHeight` in containers.
- **Touch Targets**: Minimum 48x48dp via `Modifier.minimumInteractiveComponentSize()`.
- **Adaptive Navigation**: Use `NavigationSuiteScaffold` to handle Bar/Rail transitions based on Window Size Classes.
- **Scaling SSOT**: User visual scale (DataStore) must be applied via `MMDensityProvider`, separating font scaling from structural density.

## 3. Visual Excellence & Motion
- **Typography**: Use variable font axes (weight) for interaction feedback via **Roboto Flex**.
- **Motion**: Use **Spring Physics** (`MMMotion.SpringExpressive`) for consistent, tactile transitions.

## 4. Verification & Testing Protocol
- **JDK 21**: Mandatory for projects targeting SDK 36+ (Robolectric/Roborazzi simulation).
- **Multipreview Infrastructure**: Establish reusable annotation-based Previews (e.g., `@MMPreview`) for common configurations.
- **Pragmatic Snapshots**: Do not blindly follow a 16-permutation rule. Determine significant behavioral dimensions per component for Roborazzi verification to avoid snapshot bloat.
- **Stateless Previews**: `@Preview` functions MUST be stateless and must not instantiate infrastructure-dependent components.

## 5. Behavioral Matrix (Version Compliance)

| Feature | Android 12+ (API 31) | Android 11 & Lower |
| :--- | :--- | :--- |
| **Color Palette** | **Dynamic**: Material You (Wallpaper-based). | **Static**: Uses predefined Reference Tokens. |
| **Font Scaling** | **Non-linear (A14+)**: Adaptive scaling via `sp`. | **Linear**: Uniform scaling. |
| **Edge-to-Edge** | **Native (A15+)**: Mandatory bar transparency. | **Custom**: Handled via `WindowInsets` logic. |
| **Navigation** | **Adaptive**: Automatic Bar vs. Rail transition. | **Fixed**: Width-based transition logic. |
