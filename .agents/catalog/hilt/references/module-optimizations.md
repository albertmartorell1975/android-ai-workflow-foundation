# Structural Module Guidelines & Optimizations

Combining interface bindings and dynamic provider declarations in the same Hilt module is a major anti-pattern that slows compiler performance and increases the compiled binary size.

## Rule 1: Strict Isolation of `@Binds` and `@Provides`
* **Interface Mappings (`@Binds`)**: Must be declared inside an `abstract class` (or Kotlin `interface`) annotated with `@Module` and `@InstallIn`. The methods must be abstract, take a single concrete parameter, and return the abstract interface.
* **Object Instantiation (`@Provides`)**: Must be declared inside a Kotlin `object` annotated with `@Module` and `@InstallIn`. This is used for third-party libraries, builder patterns, or instances requiring initialization arguments.

## Rule 2: Complete Prohibition of Companion Objects in `@Binds` Modules
Never embed a `companion object` containing `@Provides` methods inside an abstract class that declares `@Binds` methods. 

### Compilation Failure Analysis (Rule 2)
1. **Redundant Class Generation**: The Kotlin compiler compiles `companion object` blocks into a separate inner class file (e.g., `MyModule$Companion.class`). The annotation processors (Kapt/KSP) are forced to analyze multiple scopes and generate redundant factory boilerplate, bloating compiled method counts.
2. **Slower Incremental Build Times**: During incremental builds, Kapt or KSP must re-parse and compile the entire enclosing class structure if a single binding in either the parent abstract module or child companion object changes. Purely isolated abstract modules and static object modules allow optimal compiler caching.

## Rule 3: Kotlin 2.x Explicit Annotation Targets
When using Hilt qualifiers (like `@ApplicationContext`) or custom qualifiers inside a class constructor's properties, you MUST use the `@param:` target prefix to avoid compilation warnings and ensure future-proof bytecode mapping.

#### Example: Correct Target Specificity
```kotlin
class WorkScheduler @Inject constructor(
    @param:ApplicationContext private val context: Context,
    @param:ApplicationScope private val scope: CoroutineScope
)
```

## Canonical Examples

### RIGHT (Pure `@Binds` Abstract Class)
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

### RIGHT (Pure `@Provides` Kotlin Object)
```kotlin
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideRetrofit(): Retrofit {
        return Retrofit.Builder()
            .baseUrl("https://api.example.com/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
}
```

### WRONG (Mixed Companion Object)
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