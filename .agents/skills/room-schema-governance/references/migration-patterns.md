# Room Migration Patterns & Testing Guide (`room-schema-governance`)

Reference patterns for configuring schema export, choosing between `@AutoMigration` and manual `Migration`, preserving SQLite DDL parity, and testing migrations purely on the JVM.

---

## 1. Schema Export Configuration

Configure Room to export versioned JSON snapshots under `<module>/schemas/` and commit them to version control.

### Option A — KSP Argument (Standard)
```kotlin
ksp {
    arg("room.schemaLocation", "$projectDir/schemas")
}
```

### Option B — Official Room Gradle Plugin
```kotlin
plugins {
    id("androidx.room")
}

room {
    schemaDirectory("$projectDir/schemas")
}
```

**Immutable History Rule**: Once `<module>/schemas/<package>.<DatabaseName>/<version>.json` is committed, never edit or delete it. Room compares `<from>.json` and `<to>.json` at compile time to generate `@AutoMigration` SQL.

---

## 2. `@AutoMigration` vs Manual `Migration`

### Decision Matrix

| Scenario | Recommended Mechanism | Notes |
| :--- | :--- | :--- |
| Adding a nullable column or `NOT NULL` column with `@ColumnInfo(defaultValue = "...")`, **and** `<from>.json` exists | `@AutoMigration(from = X, to = Y)` | Zero hand-written SQL; verified at compile time. |
| Renaming or deleting a table/column, **and** `<from>.json` exists | `@AutoMigration(from = X, to = Y, spec = ...)` | Implement `AutoMigrationSpec` with `@RenameColumn`, `@DeleteColumn`, `@RenameTable`, or `@DeleteTable`. |
| `<from>.json` does **not** exist (legacy DB had `exportSchema = false`) | Manual `Migration(X, Y)` | Export `<to>.json` in the same change so subsequent `Y -> Z` upgrades can use `@AutoMigration`. |
| Complex data backfill, table split, or primary-key change | Manual `Migration(X, Y)` | Use explicit SQLite DDL inside a transaction-safe migration. |

### `@AutoMigration` Example
```kotlin
@Database(
    entities = [
        UserEntity::class,
        ItemEntity::class,
    ],
    version = 4,
    exportSchema = true,
    autoMigrations = [
        AutoMigration(from = 3, to = 4),
    ],
)
abstract class AppDatabase : RoomDatabase()
```

### Manual `Migration` Naming & DI Wiring
Follow the official Android Room naming convention `MIGRATION_<from>_<to>` inside a dedicated `<DatabaseName>Migrations.kt` file:

```kotlin
val MIGRATION_2_3: Migration = object : Migration(2, 3) {
    override fun migrate(db: SupportSQLiteDatabase) {
        db.execSQL(
            "ALTER TABLE ItemEntity ADD COLUMN categoryId INTEGER NOT NULL DEFAULT 0",
        )
        db.execSQL(
            "ALTER TABLE ItemEntity ADD COLUMN isArchived INTEGER NOT NULL DEFAULT 0",
        )
    }
}
```

Register explicitly in the Room builder (never use `.fallbackToDestructiveMigration(...)` in shared/release builds):
```kotlin
Room.databaseBuilder(app, AppDatabase::class.java, DATABASE_NAME)
    .addMigrations(MIGRATION_2_3)
    .build()
```

---

## 3. `@ColumnInfo(defaultValue = "...")` vs Kotlin Defaults

Do **not** confuse SQLite column defaults with Kotlin constructor defaults:

```kotlin
// GOOD: SQL default ensures DDL parity with ALTER TABLE ... DEFAULT 0,
// while zero Kotlin defaults enforce explicit mapper construction at compile time.
@Entity
data class ItemEntity(
    @PrimaryKey val id: String,
    @ColumnInfo(defaultValue = "0")
    val categoryId: Int,
    @ColumnInfo(defaultValue = "0")
    val isArchived: Boolean,
)

// BAD: Missing @ColumnInfo(defaultValue = "0") causes Room IllegalStateException
// on migrated installs because SQLite's PRAGMA table_info differs from CREATE TABLE.
// Adding Kotlin `= 0` also violates Model Hygiene by hiding unmapped fields.
```

---

## 4. Main-Safe Room Coroutines

Room already executes `suspend` DAO methods, `Flow` queries, and `db.withTransaction { ... }` on its own internal query/transaction executors:

```kotlin
// GOOD: Main-safe, atomic, zero redundant dispatcher hopping
override suspend fun replaceAll(items: List<ItemEntity>) {
    db.withTransaction {
        itemDao.clearAll()
        itemDao.insertAll(items)
    }
}

// BAD: Redundant thread hop
// withContext(Dispatchers.IO) { itemDao.clearAll(); itemDao.insertAll(items) }
```

---

## 5. Pure JVM Migration & Schema Parity Verification

To verify migrations rapidly without Robolectric or `androidTest` instrumentation bloat:

1. **Migration SQL Recorder Test (`1 @Test`)**: Create a lightweight `java.lang.reflect.Proxy` implementing `SupportSQLiteDatabase` that captures single-argument `execSQL(String)` calls, assert `startVersion` / `endVersion`, exact `ALTER TABLE` DDL, and zero destructive statements (`DROP`, `DELETE`, `TRUNCATE`).
2. **Exported Schema Parity Test (`1 @Test`)**: Parse `<module>/schemas/.../<version>.json` with `kotlinx.serialization.json` (supporting both module CWD `schemas/...` and repo-root CWD `<module>/schemas/...`), and assert `database.version`, entity `createSql`, and exact field `affinity`, `notNull`, and `defaultValue` parity.
3. **Optional Live Upgrade Check (Emulator)**: When an emulator has the previous build installed, run `adb install -r <apk>` (preserving app data), launch the app, check `logcat` for zero Room errors, and inspect `PRAGMA user_version` / `PRAGMA table_info(<Table>)` via `adb exec-out run-as <package>`.
