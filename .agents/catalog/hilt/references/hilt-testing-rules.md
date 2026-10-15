# Testing with Hilt

When writing tests in an Android project using Hilt, you MUST follow these standardized guidelines to ensure fast execution and maintainable test infrastructure.

This document serves as the Hilt-specific extension to the broader project testing strategy defined in `@testing-setup`.

## 1. Unit Tests (No Hilt Required)
Hilt **is not necessary** and should not be used for standard unit tests (e.g., testing ViewModels, UseCases, or Repositories in isolation). 

* Since Hilt encourages constructor injection (`@Inject constructor`), you simply instantiate the class directly in your test and pass in Mocks or Fakes manually.
* This keeps unit tests extremely fast.

```kotlin
class UserViewModelTest {
    @Test
    fun `Happy path`() {
        // You don't need Hilt. Pass a Fake Repository directly!
        val viewModel = UserViewModel(fakeUserRepository)
        // ... assertions ...
    }
}
```

## 2. Replacing Bindings in Tests (`@TestInstallIn` vs `@UninstallModules`)

When you do need to run an integration test (e.g., UI tests or Robolectric tests), you often need to replace real network/database modules with Fake modules.

**MANDATE:** Always prefer `@TestInstallIn` over `@UninstallModules`.

### Why `@TestInstallIn`?
`@TestInstallIn` replaces a production module with a test module globally for all tests in that source set. This allows Hilt to reuse a single generated component, dramatically improving test build and execution times.

```kotlin
@Module
@TestInstallIn(
    components = [SingletonComponent::class],
    replaces = [AnalyticsModule::class] // The production module to replace
)
abstract class FakeAnalyticsModule {
    @Singleton
    @Binds
    abstract fun bindAnalyticsService(fake: FakeAnalyticsService): AnalyticsService
}
```

### When to use `@UninstallModules`
`@UninstallModules` forces Hilt to generate a unique component just for that single test class. **Use it sparingly** only when a specific test requires a highly custom dependency graph that contradicts the rest of the test suite.

## 3. UI Test Setup Boilerplate

Any instrumented or Robolectric test that relies on Hilt must:
1. Be annotated with `@HiltAndroidTest`.
2. Include the `HiltAndroidRule` (ordered before Compose rules).
3. Use an Application class that supports Hilt (like `HiltTestApplication`).

```kotlin
@HiltAndroidTest
@Config(application = HiltTestApplication::class) // For Robolectric
class SettingsScreenTest {

    // 1. Hilt Rule must run first
    @get:Rule(order = 0)
    val hiltRule = HiltAndroidRule(this)

    // 2. Compose Rule runs second
    @get:Rule(order = 1)
    val composeRule = createAndroidComposeRule<HiltTestActivity>()

    @Before
    fun setup() {
        hiltRule.inject() // 3. Populate @Inject fields in the test
    }
    
    // ... tests ...
}
```

## 4. Injecting Mocks Easily (`@BindValue`)
If you need a quick mock/fake injected into the graph for a single test class (often used alongside `@UninstallModules`), you can use `@BindValue`:

```kotlin
@UninstallModules(AnalyticsModule::class)
@HiltAndroidTest
class SettingsScreenTest {

  // Hilt will automatically bind this instance into the graph!
  @BindValue @JvmField
  val analyticsService: AnalyticsService = FakeAnalyticsService()
  
  // ...
}
```

For more architectural testing contexts, refer to the global testing documentation in `@testing-setup`.