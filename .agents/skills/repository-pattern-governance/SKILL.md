---
name: repository-pattern-governance
description: Automates the creation and governance of the data layer, repository pattern, and error handling in Android projects. Ensures adherence to Google's Android Data Layer architecture, Single Source of Truth (SSOT), Clean Architecture boundaries (Domain vs Data modules), typed domain error modeling (DomainError), and reactive flow patterns.
---
# Repository Pattern & Data Layer Governance

## Context & Principles
The Data Layer is responsible for handling business logic and application data. The Repository Pattern abstracts data sources (network, database, files) from the rest of the app. This skill enforces rules for building Repositories based on Google's official Data Layer guidelines and Clean Architecture reference implementations (such as *NowInAndroid*).

### Core Architecture Rules
1. **Separation of Concerns**: The Data Layer must be completely decoupled from the UI Layer. ViewModels should only interact with the Data Layer through interfaces defined in the Domain Layer.
2. **Clean Architecture Boundaries**: 
   - **Domain Module**: Defines the contract (Interface), domain models, and typed domain errors (`DomainError`). Must NOT contain Android framework dependencies (like Retrofit, Room, or Ktor), nor should it know about technical exceptions or data source implementation details.
   - **Data Module**: Implements the repository interface. Handles data sources (Network/Local), entity mapping (DTOs/Entities to Domain models), and exception translation (`Throwable` -> `DomainError`).
3. **Single Source of Truth (SSOT)**: The local database or cache should ideally act as the SSOT. The repository should expose this truth via reactive streams, avoiding returning data directly from the network when offline capabilities or local state (like `isFavorite`) are required.
4. **Typed Domain Errors vs. Naked Exceptions**: Never leak technology-specific exceptions (`HttpException`, `SQLiteException`, `IOException`) into the Domain or UI layers. The Data Layer MUST translate technical framework exceptions into typed domain errors (`DomainError`).
5. **Concurrency**: All operations must be main-safe. Use Kotlin Coroutines (`suspend`) for one-shot operations and `Flow` for continuous data streams.

---

## Instructions for Agents
When generating or refactoring a Repository or Data Layer, you MUST follow these steps. For implementation details, consult the appropriate reference file in the `references/` directory.

1. **Locate/Create Domain Error & Result**: 
   - Ensure `DomainError` and `Result<T, DomainError>` exist in the `domain` module. 
   - Never use raw `java.lang.Exception` in domain result types.
   - Prefer idiomatic Kotlin `Result<T, E : DomainError>` over FP monads (`Either<L, R>`) unless the codebase explicitly mandates Arrow FP conventions.
   - **Read:** `references/error-modeling-result.md` for the domain models and rationale.

2. **Define Domain Contract**: 
   - Place the repository interface in `domain/.../repository/`. 
   - Return `Result<T, DomainError>` or `Flow<Result<T, DomainError>>`.
   - **Read:** `references/repository-implementation.md` for interface examples.

3. **Implement Exception Mapping in Data Layer**: 
   - Use `safeCall` or custom `Throwable.toDomainError()` mappers to catch technical exceptions (`HttpException`, `SQLiteException`, `IOException`) and convert them to `DomainError` before returning to the Domain Layer.
   - **CRITICAL:** Never catch `CancellationException` in your `safeCall` block, as it breaks structured concurrency.
   - **Read:** `references/exception-mapping-safecall.md` for the exact `safeCall` implementation.

4. **Enforce Clean Mapping Pipeline**: 
   - The Data Layer implementation MUST strictly follow: `Network DTO -> Local Entity -> Domain Model`. 
   - Coordinate the Single Source of Truth (SSOT).
   - Never leak DTOs, Room Entities, or Retrofit annotations into the Domain Layer.
   - **Read:** `references/repository-implementation.md` for the concrete SSOT repository implementation.

5. **Strict Default-Free & Non-Nullable Models (Mappers as Sole Authority)**:
   - Network DTOs, Local Entities, and Domain Models MUST NOT declare default parameter values (`= ...`) or nullable fields (`?`) unless nullability represents a genuine domain state explicitly required by business rules.
   - Mappers (`Dto -> Entity -> Domain`) are the sole authority for data normalization, formatting, and fallback resolution, ensuring compile-time fail-fast safety whenever a model changes.