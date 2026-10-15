# Layer-Based Package Structure

To satisfy Clean Architecture boundaries, contracts and business logic live in `:domain`, their implementations live in `:data`, and UI/DI wiring remain in `:app`.

```text
:domain (Pure Kotlin)
└── src/main/java/com/example/app/domain
    ├── model/                       // Pure Kotlin business models
    │   └── BasketMatch.kt
    ├── usecase/                     // Orchestrates business logic using repositories
    │   ├── GetBasketMatchesUseCase.kt
    │   └── ToggleMatchFavoriteUseCase.kt
    └── repository/                  // The INTERFACES (Contracts)
        └── BasketRepository.kt      

:data (Android Library)
└── src/main/java/com/example/app/data
    ├── network
    │   ├── ApiService.kt            // Retrofit interface
    │   └── model/                   // Network DTOs
    ├── database
    │   ├── AppDatabase.kt           // Room Database abstract class
    │   ├── dao/                     // Room DAOs
    │   └── entity/                  // Room Entities
    └── repository
        └── BasketRepositoryImpl.kt  // IMPLEMENTS interface from :domain (Mappers go here)

:app (Android Application)
└── src/main/java/com/example/app
    ├── di
    │   ├── NetworkModule.kt         // Hilt Module (provides Retrofit, Room DB using Context)
    │   └── RepositoryModule.kt      // Hilt Module to @Binds implementations
    ├── ui
    │   └── main/                    // Main screen (Compose + ViewModel)
    └── MainActivity.kt
```
