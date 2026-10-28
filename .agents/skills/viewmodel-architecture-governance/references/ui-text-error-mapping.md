# Zero Hardcoded Strings & Resource Isolation (`DomainError` + `UiText`)

## Architectural Rationale

ViewModels are responsible for coordinating state transitions, not for formatting or localizing user-facing strings. Hardcoding error strings or importing `R.string` inside a ViewModel to resolve domain failures creates tight coupling to presentation concerns and fails when an error carries dynamic server messages alongside static fallback resources.

### Core Rules
1. **No Hardcoded Strings in ViewModels**: ViewModels MUST NEVER construct literal user-facing error strings.
2. **Primary Content Errors Carry `DomainError`**: Inside the Hybrid UI State `sealed interface`, the `Error` state (`data class Error(val error: DomainError)`) exposes the typed `DomainError` from the Domain Layer. The ViewModel does not import `R.string` or inject error string mappers.
3. **UI Layer Owns Message Resolution via `UiText`**: The UI Layer translates `DomainError` into a `UiText` wrapper (`DynamicString` or `StringResource`) via an extension function (`fun DomainError.toUiText(): UiText`) and resolves it inside the `@Composable` using `uiText.asString()`.
4. **Transient UI Messages (Toasts / Snackbars)**: When an overlay/additive state requires a transient message not backed by a `DomainError` (e.g., `toastMessage: UiText?`), use `UiText` directly so the ViewModel never requires an Android `Context`.

---

## 1. The `UiText` Contract (`ui/util/UiText.kt`)

`UiText` transports either a dynamic runtime string (e.g., a diagnostic message returned by an API) or a localized Android string resource ID (`@StringRes`) to Jetpack Compose without leaking `Context` outside the UI tree.

```kotlin
package com.example.app.ui.util

import androidx.annotation.StringRes
import androidx.compose.runtime.Composable
import androidx.compose.ui.res.stringResource

/**
 * A text wrapper ready to be consumed exclusively by the UI layer.
 * Transports either a dynamic string or a localized string resource to Compose
 * without injecting Android Context into the ViewModel.
 */
sealed interface UiText {

    data class DynamicString(val value: String) : UiText
    data class StringResource(@get:StringRes val resId: Int) : UiText

    @Composable
    fun asString(): String = when (this) {
        is DynamicString -> value
        is StringResource -> stringResource(resId)
    }
}
```

---

## 2. UI-Layer `DomainError` Extension (`ui/.../mapper/DomainErrorExt.kt`)

Map typed `DomainError` instances to `UiText` in the UI layer. Dynamic server or generic messages take precedence when present, falling back to localized `@StringRes` resources.

```kotlin
package com.example.app.ui.feature.mapper

import com.example.app.R
import com.example.app.domain.model.DomainError
import com.example.app.ui.util.UiText

fun DomainError.toUiText(): UiText = when (this) {
    is DomainError.Local.NotFound -> UiText.StringResource(R.string.error_not_found)
    is DomainError.Network.NoInternet -> UiText.StringResource(R.string.error_no_internet)
    is DomainError.Network.ServerError -> {
        val serverMessage = message
        if (!serverMessage.isNullOrBlank()) {
            UiText.DynamicString(serverMessage)
        } else {
            UiText.StringResource(R.string.error_generic)
        }
    }
    is DomainError.Generic -> {
        val genericMessage = message
        if (!genericMessage.isNullOrBlank()) {
            UiText.DynamicString(genericMessage)
        } else {
            UiText.StringResource(R.string.error_generic)
        }
    }
    else -> UiText.StringResource(R.string.error_generic)
}
```

---

## 3. End-to-End Flow (`ViewModel -> Screen -> ErrorView`)

### A. ViewModel (Pure `DomainError`, Zero `R.string`)
```kotlin
@HiltViewModel
class FeatureViewModel @Inject constructor(
    private val getFeatureDataUseCase: GetFeatureDataUseCase,
    private val mapper: FeatureUiMapper
) : ViewModel() {

    private val _uiState = MutableStateFlow(
        FeatureUiState(content = FeatureUiContent.Loading, isRefreshing = false)
    )
    val uiState: StateFlow<FeatureUiState> = _uiState.asStateFlow()

    fun loadData() {
        if (_uiState.value.isRefreshing) return
        _uiState.update { it.copy(isRefreshing = true) }

        viewModelScope.launch {
            when (val result = getFeatureDataUseCase()) {
                is Result.Success -> {
                    _uiState.update {
                        FeatureUiState(
                            content = mapper.toSuccess(result.data),
                            isRefreshing = false
                        )
                    }
                }
                is Result.Error -> {
                    _uiState.update {
                        FeatureUiState(
                            content = FeatureUiContent.Error(error = result.error),
                            isRefreshing = false
                        )
                    }
                }
            }
        }
    }
}
```

### B. Screen & ErrorView (Resolving `UiText` in Compose)
```kotlin
@Composable
fun FeatureScreen(
    uiState: FeatureUiState,
    onRetry: () -> Unit
) {
    when (val content = uiState.content) {
        is FeatureUiContent.Loading -> FeatureLoadingView()
        is FeatureUiContent.Error -> FeatureErrorView(
            message = content.error.toUiText(),
            onRetry = onRetry
        )
        is FeatureUiContent.Success -> FeatureContent(uiState = content)
    }
}

@Composable
fun FeatureErrorView(
    message: UiText,
    onRetry: () -> Unit
) {
    Column {
        Text(text = message.asString())
        Button(onClick = onRetry) {
            Text(text = stringResource(R.string.retry))
        }
    }
}
```
