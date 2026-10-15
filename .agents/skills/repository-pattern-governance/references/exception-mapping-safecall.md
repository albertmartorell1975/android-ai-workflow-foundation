# Exception Mapping and safeCall

To protect the Domain and UI layers from technical details, the Data Layer must catch technical framework exceptions and convert them into typed `DomainError` instances.

## Technical Exception Mapping Helper (`data/.../util/ExceptionMapper.kt`)
In the Data Layer, implement helper extensions that catch framework exceptions and convert them.

```kotlin
package com.example.app.data.util

import com.example.app.domain.model.DomainError
import com.example.app.domain.model.Result
import retrofit2.HttpException
import java.io.IOException
import java.net.SocketTimeoutException
import kotlinx.coroutines.CancellationException

fun Throwable.toDomainError(): DomainError = when (this) {
    is SocketTimeoutException -> DomainError.Network.Timeout
    is IOException -> DomainError.Network.NoInternet
    is HttpException -> when (code()) {
        401 -> DomainError.Network.Unauthorized
        in 500..599 -> DomainError.Network.ServerError(code())
        else -> DomainError.Network.ServerError(code(), message())
    }
    else -> DomainError.Generic(message = localizedMessage, cause = this)
}

suspend inline fun <T> safeCall(
    crossinline action: suspend () -> T
): Result<T, DomainError> = try {
    Result.Success(action())
} catch (e: CancellationException) {
    throw e // IMPORTANT: Never catch coroutine cancellation. Doing so breaks structured concurrency.
} catch (e: Exception) {
    Result.Error(e.toDomainError())
}
```