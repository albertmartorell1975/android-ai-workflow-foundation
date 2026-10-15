# Jetpack Integrations with Hilt

## 1. WorkManager Assisted Injection
To safely instantiate background tasks with runtime arguments and Hilt-injected dependencies, custom on-demand initialization is required.

### Step 1: Implement the Worker
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

### Step 2: Disable Default WorkManager Initializer
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

### Step 3: Implement On-Demand Initialization in MyApplication
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

## 2. Firebase Cloud Messaging (FCM) Integration
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