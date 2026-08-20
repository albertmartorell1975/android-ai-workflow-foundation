---
name: hilt-dependency-injection
description: Official guidelines, clean architecture boundaries, static graph optimizations, and comprehensive multibinding patterns for the MeteoMartoCompose native Android project.
version: 1.1.0
ecosystem: Android, Kotlin, Dagger, Hilt, Jetpack Compose
keywords:
  - hilt
  - dagger
  - dependency-injection
  - multibinding
  - clean-architecture
  - jetpack-compose
  - workmanager
  - fcm
---

## Prerequisites
* Project MUST use Jetpack Compose as its UI toolkit.
* Project MUST be configured with Dagger Hilt for Dependency Injection.
* Project MUST use Kotlin Symbol Processing (KSP) or Kapt for incremental annotation processing.

---

## 1. Clean Architecture Boundaries

To preserve strict layer isolation in the `MeteoMartoCompose` project, Hilt dependencies must conform to the following architectural rules:

* **The `:domain` Module**: This module must remain completely agnostic of Hilt, Dagger, or any Android framework classes (such as `Context`). No DI annotations are allowed in this module. All domain entities, use-case contracts, and repository interfaces are defined here purely.
* **The `:usecases` Module**: Business use cases or interactors must reside in this layer. They must resolve their domain repository dependencies purely via **constructor injection** using the `@Inject` annotation on the constructor. They are not allowed to declare modules or access Android context.
* **The `:data` Module**: This module contains repository implementations, network service adapters (such as Retrofit/OkHttpClient), and local database architectures (such as Room). Hilt modules with `@Binds` or `@Provides` reside in this module to wire repository interfaces to their concrete implementations.
* **The `:app` Module**: Serves as the central orchestrator that glues the entire application together. It defines the `@HiltAndroidApp` class, registers application-level Android entry points (`@AndroidEntryPoint` or `@HiltViewModel`), and initializes system components like background processes, WorkManager, and Firebase Cloud Messaging (FCM).

---

## 2. Structural Module Guidelines & Optimizations

Combining interface bindings and dynamic provider declarations in the same Hilt module is a major anti-pattern that slows compiler performance and increases the compiled binary size.

### Rule 1: Strict Isolation of `@Binds` and `@Provides`
* **Interface Mappings (`@Binds`)**: Must be declared inside an `abstract class` (or Kotlin `interface`) annotated with `@Module` and `@InstallIn`. The methods must be abstract, take a single concrete parameter, and return the abstract interface.
* **Object Instantiation (`@Provides`)**: Must be declared inside a Kotlin `object` annotated with `@Module` and `@InstallIn`. This is used for third-party libraries, builder patterns, or instances requiring initialization arguments.

### Rule 2: Complete Prohibition of Companion Objects in `@Binds` Modules
Never embed a `companion object` containing `@Provides` methods inside an abstract class that declares `@Binds` methods. 

### Rule 3: Kotlin 2.x Explicit Annotation Targets
When using Hilt qualifiers (like `@ApplicationContext`) or custom qualifiers inside a class constructor's properties, you MUST use the `@param:` target prefix to avoid compilation warnings and ensure future-proof bytecode mapping.

#### Example: Correct Target Specificity
```kotlin
class WorkScheduler @Inject constructor(
    @param:ApplicationContext private val context: Context,
    @param:ApplicationScope private val scope: CoroutineScope
)
```

#### Compilation Failure Analysis (Rule 2)
1. **Redundant Class Generation**: The Kotlin compiler compiles `companion object` blocks into a separate inner class file (e.g., `MyModule$Companion.class`). The annotation processors (Kapt/KSP) are forced to analyze multiple scopes and generate redundant factory boilerplate, bloating compiled method counts.
2. **Slower Incremental Build Times**: During incremental builds, Kapt or KSP must re-parse and compile the entire enclosing class structure if a single binding in either the parent abstract module or child companion object changes. Purely isolated abstract modules and static object modules allow optimal compiler caching.

### Canonical Examples

#### RIGHT (Pure `@Binds` Abstract Class)
```kotlin
@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds
    @Singleton
    abstract fun bindWeatherRepository(
        impl: WeatherRepositoryImpl
    ): WeatherRepository
}
```

#### RIGHT (Pure `@Provides` Kotlin Object)
```kotlin
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideRetrofit(): Retrofit {
        return Retrofit.Builder()
            .baseUrl("https://api.meteomarto.com/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
}
```

#### WRONG (Mixed Companion Object)
```kotlin
@Module
@InstallIn(SingletonComponent::class)
abstract class WeatherModule {

    @Binds
    abstract fun bindWeatherRepository(impl: WeatherRepositoryImpl): WeatherRepository

    // PROHIBITED: Do not mix Provides and Binds using companion objects!
    companion object {
        @Provides
        fun provideWeatherApi(): WeatherApi {
            return Retrofit.Builder().build().create(WeatherApi::class.java)
        }
    }
}
```

---

## 3. Advanced Multibindings Patterns

Multibindings allow multiple independent modules to contribute elements or entries into a single injectable collection (a `Set` or `Map`), effectively decoupling feature implementations from the central coordinator.

### 3.1 Set Multibindings
Set multibinding is an excellent mechanism to build extensible initialization pipelines without compile-time coupling to feature modules.

* Use `@IntoSet` on a provider or binding method to add a single element to a `Set<T>`.
* Use `@ElementsIntoSet` to contribute a `Set<T>` (multiple elements at once) to the final set.
* Use `@Multibinds` on an abstract method in an abstract module to declare that a set can be empty, which prevents missing binding compilation errors.

#### Example: Module Initialization Pattern
Define a core initializer contract in a common module:
```kotlin
interface AppInitializer {
    fun initialize(application: Application)
}
```

Feature modules can implement this and contribute their initializers:
```kotlin
@Module
@InstallIn(SingletonComponent::class)
abstract class FirebaseInitializerModule {

    @Binds
    @IntoSet
    abstract fun bindFirebaseInitializer(
        impl: FirebaseRemoteConfigInitializer
    ): AppInitializer
}
```

The `:app` module simply injects the complete `Set<AppInitializer>` at startup, completely unaware of what specific features are being initialized:
```kotlin
class AppInitializers @Inject constructor(
    private val initializers: Set<@JvmSuppressWildcards AppInitializer>
) {
    fun initializeAll(application: Application) {
        initializers.forEach { it.initialize(application) }
    }
}
```

### 3.2 Map Multibindings
Map multibindings allow you to associate contributed values with specific compile-time keys (using `@StringKey`, `@ClassKey`, or custom `@MapKey` annotations).

```kotlin
@MapKey
@Retention(AnnotationRetention.BINARY)
annotation class ScreenKey(val value: AppScreen)

@Module
@InstallIn(ActivityComponent::class)
abstract class ScreenModule {

    @Binds
    @IntoMap
    @ScreenKey(AppScreen.WeatherDetails)
    abstract fun bindWeatherDetailsPresenter(impl: WeatherDetailsPresenter): Presenter
}
```

### 3.3 The Kotlin Wildcard Gotcha (`@JvmSuppressWildcards`)
Because Kotlin collections are covariant by default, a read-only Kotlin `Set<T>` is compiled into the Java signature `Set<? extends T>`. 

Dagger and Hilt operate on strict Java invariant type matching. Therefore, the compiler will see `Set<? extends T>` and fail with a `[Dagger/MissingBinding]` error, stating that `Set<? extends T>` cannot be provided.

**Standard Fix**: You MUST annotate the injection target with `@JvmSuppressWildcards` at the type argument level to force the Kotlin compiler to output invariant type parameters in the Java bytecode.

#### Example: Correct Wildcard Suppression
```kotlin
class DashboardPresenter @Inject constructor(
    // JvmSuppressWildcards is required to compile correctly
    private val initializers: Set<@JvmSuppressWildcards AppInitializer>
)
```

### 3.4 Scoping Multibindings vs. Scoping Collections
A scope annotation (like `@Singleton` or `@ActivityScoped`) applied to a multibinding contribution method applies **only to the contributed element**, not to the resulting `Set` or `Map` collection.
* If `@IntoSet` is scoped with `@Singleton`, Hilt ensures the contributed element instance is shared and instantiated once.
* However, the `Set` container instance itself remains unscoped. Every class injecting the `Set` will receive a new `Set` collection instance containing those shared, scoped references.

### 3.5 The Factory Scoping Trap
A critical runtime issue occurs when a scoped coordinator class consumes a multibound collection that is modified by a child subcomponent. This commonly affects `ViewModelProvider.Factory` or centralized registry classes.

1. If a custom `ViewModelProvider.Factory` is scoped as `@Singleton` in the `SingletonComponent`, Hilt instantiates and caches this factory once upon app launch, injecting the ViewModels available at the root level.
2. If a child activity or fragment subcomponent attempts to contribute an activity-specific or feature-specific ViewModel to the multibound map, the cached `@Singleton` factory **cannot see it**. 
3. Navigating to the feature screen will result in a runtime crash because the cached factory has no awareness of the subcomponent's contributions.

#### Remediation Strategies
* **Remove the Scope**: Leave the coordinator or factory class unscoped. This allows Hilt to instantiate a fresh factory instance within the child subcomponent's context, receiving the fully accumulated map.
* **Annotate with `@Reusable`**: Allows Hilt to cache the factory instance locally within component boundaries without enforcing global singleton lifecycle limits, preventing leakage across subcomponent scopes.

### 3.6 Workaround for Dynamic Runtime Map Keys
Hilt map keys must be compile-time constants. If your system requires keys that are only known at runtime, map multibinding cannot be validated at compile time.

**Workaround**: Use Set multibindings to contribute a set of custom map entries, and then programmatically transform the set into a non-multibound map at injection time.

```kotlin
// 1. Define a wrapper or Map.Entry equivalent
data class RuntimeSettingContribution(
    val key: String,
    val provider: Provider<SettingHandler>
)

// 2. Feature modules contribute to the Set of contributions
@Module
@InstallIn(SingletonComponent::class)
object NotificationSettingModule {

    @Provides
    @IntoSet
    fun provideNotificationSetting(
        handlerProvider: Provider<NotificationSettingHandler>
    ): RuntimeSettingContribution {
        return RuntimeSettingContribution("notification_threshold", handlerProvider)
    }
}

// 3. Central module collects the Set and provides the Map
@Module
@InstallIn(SingletonComponent::class)
object SettingsMapModule {

    @Provides
    @Singleton
    fun provideRuntimeSettingsMap(
        contributions: Set<@JvmSuppressWildcards RuntimeSettingContribution>
    ): Map<String, Provider<SettingHandler>> {
        return contributions.associate { it.key to it.provider }
    }
}
```

---

## 4. Jetpack Integrations

### 4.1 WorkManager Assisted Injection
To safely instantiate background tasks with runtime arguments and Hilt-injected dependencies, custom on-demand initialization is required.

#### Step 1: Implement the Worker
Annotate your background worker with `@HiltWorker` and use `@AssistedInject` on its constructor. All system parameters (like `Context` and `WorkerParameters`) must be marked with `@Assisted`.
```kotlin
@HiltWorker
class TemperatureThresholdWorker @AssistedInject constructor(
    @Assisted context: Context,
    @Assisted workerParams: WorkerParameters,
    private val remoteConfig: FirebaseRemoteConfigRepository // Injected by Hilt
) : CoroutineWorker(context, workerParams) {

    override suspend fun doWork(): Result {
        val threshold = remoteConfig.getTemperatureThreshold()
        // Execute background notification logic
        return Result.success()
    }
}
```

#### Step 2: Disable Default WorkManager Initializer
To prevent WorkManager from self-initializing before Hilt has performed field injection on the Application class, remove the default initializer in `AndroidManifest.xml`:
```xml
<application ...>
    <provider
        android:name="androidx.startup.InitializationProvider"
        android:authorities="${applicationId}.androidx-startup"
        android:exported="false"
        tools:node="merge">
        <meta-data
            android:name="androidx.work.WorkManagerInitializer"
            android:value="androidx.startup"
            tools:node="remove" />
    </provider>
</application>
```

#### Step 3: Implement On-Demand Initialization in MyApplication
Implement `Configuration.Provider` and inject `HiltWorkerFactory` into your Application class:
```kotlin
@HiltAndroidApp
class MyApplication : Application(), Configuration.Provider {

    @Inject
    lateinit var workerFactory: HiltWorkerFactory

    override val workManagerConfiguration: Configuration
        get() = Configuration.Builder()
            .setWorkerFactory(workerFactory)
            .build()
}
```

### 4.2 Firebase Cloud Messaging (FCM) Integration
Android services are instantiated directly by the operating system, meaning constructor injection is not possible.

* Services must use field injection and be annotated with `@AndroidEntryPoint`.
* Injected properties cannot be `private`.
* The service should act as a simple event bridge, passing notifications to a decoupled business logic interactor (like a clean Use Case).

```kotlin
@AndroidEntryPoint
class WeatherMessagingService : FirebaseMessagingService() {

    @Inject
    lateinit var sendPushNotificationUseCase: SendPushNotificationUseCase // Field Injection

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        val title = remoteMessage.notification?.title ?: return
        val body = remoteMessage.notification?.body ?: return
        
        // Delegate executing business logic to Use Case
        sendPushNotificationUseCase.execute(title, body)
    }
}
```

---

## 5. Verification Checklist

The automated assistant or developer MUST verify compliance with this checklist before committing changes to the dependency injection graph:

| Checklist Item | Verification Criteria | Checked |
| :--- | :--- | :---: |
| **Strict Module Isolation** | Mappings are abstract using `@Binds`. Third-party creations use Kotlin `object` and `@Provides`. They never coexist in the same class. | [ ] |
| **Companion Object Exclusion** | No abstract Hilt module contains an inner `companion object` block housing `@Provides` methods. | [ ] |
| **Wildcard Suppression** | Every Set or Map multibinding injection target in Kotlin contains the `@JvmSuppressWildcards` annotation. | [ ] |
| **Empty Multibindings** | Set or Map multibindings that may be empty are abstractly declared using `@Multibinds` instead of returning empty collections. | [ ] |
| **Factory Scoping Check** | Coordinators injecting subcomponent-dependent multibound maps (such as ViewModel factories) are either `@Reusable` or completely unscoped. | [ ] |
| **Worker DI Configuration** | Background workers are annotated with `@HiltWorker` and use `@AssistedInject` and `@Assisted` correctly. | [ ] |
| **FCM Property Visibility** | Injected properties in `FirebaseMessagingService` are either `internal` or `public`, and never marked as `private`. | [ ] |
| **Compiler Optimizations** | Incremental annotation processing is enabled and code formatting is disabled inside the gradle properties. | [ ] |
