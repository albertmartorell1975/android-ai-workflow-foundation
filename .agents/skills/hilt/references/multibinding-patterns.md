# Advanced Multibindings Patterns

Multibindings allow multiple independent modules to contribute elements or entries into a single injectable collection (a `Set` or `Map`), effectively decoupling feature implementations from the central coordinator.

## 1. Set Multibindings
Set multibinding is an excellent mechanism to build extensible initialization pipelines without compile-time coupling to feature modules.

* Use `@IntoSet` on a provider or binding method to add a single element to a `Set<T>`.
* Use `@ElementsIntoSet` to contribute a `Set<T>` (multiple elements at once) to the final set.
* Use `@Multibinds` on an abstract method in an abstract module to declare that a set can be empty, which prevents missing binding compilation errors.

### Example: Module Initialization Pattern
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

## 2. Map Multibindings
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

## 3. The Kotlin Wildcard Gotcha (`@JvmSuppressWildcards`)
Because Kotlin collections are covariant by default, a read-only Kotlin `Set<T>` is compiled into the Java signature `Set<? extends T>`. 

Dagger and Hilt operate on strict Java invariant type matching. Therefore, the compiler will see `Set<? extends T>` and fail with a `[Dagger/MissingBinding]` error, stating that `Set<? extends T>` cannot be provided.

**Standard Fix**: You MUST annotate the injection target with `@JvmSuppressWildcards` at the type argument level to force the Kotlin compiler to output invariant type parameters in the Java bytecode.

### Example: Correct Wildcard Suppression
```kotlin
class DashboardPresenter @Inject constructor(
    // JvmSuppressWildcards is required to compile correctly
    private val initializers: Set<@JvmSuppressWildcards AppInitializer>
)
```

## 4. Scoping Multibindings vs. Scoping Collections
A scope annotation (like `@Singleton` or `@ActivityScoped`) applied to a multibinding contribution method applies **only to the contributed element**, not to the resulting `Set` or `Map` collection.
* If `@IntoSet` is scoped with `@Singleton`, Hilt ensures the contributed element instance is shared and instantiated once.
* However, the `Set` container instance itself remains unscoped. Every class injecting the `Set` will receive a new `Set` collection instance containing those shared, scoped references.

## 5. The Factory Scoping Trap
A critical runtime issue occurs when a scoped coordinator class consumes a multibound collection that is modified by a child subcomponent. This commonly affects `ViewModelProvider.Factory` or centralized registry classes.

1. If a custom `ViewModelProvider.Factory` is scoped as `@Singleton` in the `SingletonComponent`, Hilt instantiates and caches this factory once upon app launch, injecting the ViewModels available at the root level.
2. If a child activity or fragment subcomponent attempts to contribute an activity-specific or feature-specific ViewModel to the multibound map, the cached `@Singleton` factory **cannot see it**. 
3. Navigating to the feature screen will result in a runtime crash because the cached factory has no awareness of the subcomponent's contributions.

### Remediation Strategies
* **Remove the Scope**: Leave the coordinator or factory class unscoped. This allows Hilt to instantiate a fresh factory instance within the child subcomponent's context, receiving the fully accumulated map.
* **Annotate with `@Reusable`**: Allows Hilt to cache the factory instance locally within component boundaries without enforcing global singleton lifecycle limits, preventing leakage across subcomponent scopes.

## 6. Workaround for Dynamic Runtime Map Keys
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