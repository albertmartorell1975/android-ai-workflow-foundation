---
name: design-system-governance
description: Codifies A11y, RTL, Adaptive, and Reusability standards for the MeteoMarto Design System.
metadata:
  author: Albert Martorell Garcia
  version: 1.0.0
  keywords: [design-system, a11y, rtl, adaptive, stateless, compose, tokens]
---
# Design System Governance Rules

This skill ensures that any AI agent or developer modifying the UI of **MeteoMartoCompose** adheres to the professional standards defined in feature `MM-02`.

## 1. Architectural Principles (Super-Hoisting)
- **Statelessness**: Every `MM*` component MUST be stateless. No internal `remember { mutableStateOf(...) }`.
- **Slot API Pattern**: Mandatory for components receiving content. Use `content: @Composable RowScope.() -> Unit` or equivalent.
- **Modifier Requirement**: Every component MUST include `modifier: Modifier = Modifier` as its first optional parameter.

## 2. Accessibility (A11y) & Low Vision
- **Contrast**: Mandatory **WCAG AA** (4.5:1 ratio). Use `MaterialTheme.colorScheme` roles correctly.
- **Touch Targets**: Min 48x48dp via `Modifier.minimumInteractiveComponentSize()`.
- **Scaling**: Support 200% font scaling without clipping. Always use **sp** for text.
- **Reflow**: NEVER use `height(fixed_dp)` in containers with text. Use `wrapContentHeight()` or `minHeight`.
- **Pinch-to-zoom**: Implement in-app scaling via `MMDensityProvider` where contextually appropriate.
- **Persistence**: User legibility settings MUST be saved via **DataStore**.

## 3. RTL & Adaptive Support
- **Mirroring**: Use `start/end` exclusively. No `left/right`. Directional icons (arrows, etc.) MUST be mirrored in RTL.
- **Navigation**: Use `MMNavigation` (wrapping `NavigationSuiteScaffold`) to handle Bar/Rail transitions.
- **Insets**: Components must handle `WindowInsets` to ensure **Android 15 Edge-to-Edge** compliance.

## 4. Visual Excellence (M3 Expressive)
- **Typography**: Use variable font axes (weight) for interaction feedback via **Roboto Flex**.
- **Motion**: Use **Spring Physics** (Spring.StiffnessMediumLow) for all transitions to ensure natural, tactile feedback.
- **Feedback**: Use `AnimatedIcon` for state changes where expressive feedback adds value.
