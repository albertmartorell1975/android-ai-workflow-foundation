# Domain Error Modeling (Result vs Either)

## The Friction with Naked Exceptions
A common mistake in Clean Architecture implementations is passing raw `java.lang.Exception` inside a generic `Result.Error(val exception: Throwable)`. 

* **The Problem**: This leaks technical framework exceptions (e.g. Retrofit `HttpException`, OkHttp `IOException`, Room `SQLiteException`) into the Domain Layer and UI Layer. ViewModels and UI Composables should NEVER need to import `retrofit2.HttpException` or inspect technical error codes to show a user error message.

## Why `Result<T, E : DomainError>` and NOT `Either<L, R>` (Arrow / FP)
Some purists advocate using the `Either<Left, Right>` pattern from Functional Programming (FP) and third-party libraries like Arrow.

* **The Senior Criteria (KISS & Idiomatic Kotlin)**:
  1. **KISS (Keep It Simple, Stupid)**: Introducing `Either` forces the entire team to learn functional programming concepts (`monads`, `flatMap`, `fold`) and pulls in heavy third-party dependencies (Arrow).
  2. **Idiomatic Kotlin & Standard Alignment**: An aseptic, domain-focused `Result<T, E : DomainError>` (`Success` or `Error`) is 100% idiomatic Kotlin, highly readable, self-documenting, and fully aligned with Google's official Android Architecture guidelines and reference projects.

## 1. Domain Error Modeling (`domain/.../model/DomainError.kt`)
Define a `sealed interface DomainError` in the Domain Layer representing failure categories that business logic and UI care about.

```kotlin
package com.example.app.domain.model

sealed interface DomainError {
    sealed interface Network : DomainError {
        data object NoInternet : Network
        data object Timeout : Network
        data class ServerError(val code: Int, val message: String? = null) : Network
        data object Unauthorized : Network
        data object Unknown : Network
    }

    sealed interface Local : DomainError {
        data object DiskFull : Local
        data object DatabaseError : Local
        data object NotFound : Local
    }

    data class Generic(val message: String? = null, val cause: Throwable? = null) : DomainError
}
```

## 2. Domain Result Modeling (`domain/.../model/Result.kt`)
Define an aseptic, typed `Result` in the Domain Layer:

```kotlin
package com.example.app.domain.model

sealed interface Result<out T, out E : DomainError> {
    data class Success<out T>(val data: T) : Result<T, Nothing>
    data class Error<out E : DomainError>(val error: E) : Result<Nothing, E>
}

inline fun <T, E : DomainError, R> Result<T, E>.map(transform: (T) -> R): Result<R, E> =
    when (this) {
        is Result.Success -> Result.Success(transform(data))
        is Result.Error -> Result.Error(error)
    }

inline fun <T, E : DomainError> Result<T, E>.onSuccess(action: (T) -> Unit): Result<T, E> {
    if (this is Result.Success) action(data)
    return this
}

inline fun <T, E : DomainError> Result<T, E>.onError(action: (E) -> Unit): Result<T, E> {
    if (this is Result.Error) action(error)
    return this
}
```