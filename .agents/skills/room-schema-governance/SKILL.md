---
name: room-schema-governance
description: Ensures Room database integrity, non-destructive schema evolution, tracked schema exports, and main-safe persistence rules.
metadata:
  author: Albert Martorell Garcia
  version: 2.0.0
  keywords:
    - room
    - database
    - schema
    - migration
    - automigration
    - persistence
---
# Room Schema Governance Specialist

This skill enforces strict rules for Android Room database evolution to prevent `IllegalStateException`, silent local data loss, and redundant coroutine thread hops.

## Core Rules

### 1. Version & Entity Hygiene
Whenever any `@Entity` class is modified, added, or deleted, you **MUST**:
1. Increment `@Database.version` by exactly `1`.
2. Keep **trailing commas** on the `entities = [...]` array.
3. Keep `@Entity` Kotlin constructors free of default parameter values (`= 0`, `= ""`, `= null`) so mappers remain compile-time explicit.
4. Annotate newly added `NOT NULL` migrated columns with SQL `@ColumnInfo(defaultValue = "...")` (never Kotlin defaults) so fresh `CREATE TABLE` DDL matches `ALTER TABLE ... DEFAULT ...`.

### 2. Mandatory Schema Export (`exportSchema = true`)
- Always set `exportSchema = true` on `@Database` and configure `room.schemaLocation` via KSP (or the `androidx.room` Gradle plugin).
- Commit generated `<version>.json` files to Git. **NEVER** manually edit or delete historical schema JSON snapshots — they are required for future `@AutoMigration` steps and migration verification.

### 3. Non-Destructive Migration Protocol
- **Prefer `@AutoMigration(from = X, to = Y)`** (plus `AutoMigrationSpec` for column/table renames or deletions) for simple schema changes whenever `<X>.json` already exists in Git.
- **Use manual `Migration(X, Y)`** when `<X>.json` is missing or custom SQL/data transformation is required. Follow the official `MIGRATION_<from>_<to>` constant convention (e.g., `MIGRATION_2_3`) grouped inside `<DatabaseName>Migrations.kt`, and register it with `.addMigrations(...)`.
- **NEVER** leave `.fallbackToDestructiveMigration(...)` in shared integration, staging, or release branches (permitted only for throwaway pre-v1 local prototypes).

### 4. Main-Safety & Transactions
- Room `suspend` DAO methods, `Flow` queries, and `db.withTransaction { ... }` are already main-safe. **NEVER** wrap them in redundant `withContext(Dispatchers.IO)`.

### 5. Flavor-Aware Verification
1. Run the project's active debug assemble task (e.g., `./gradlew assemble<Flavor>Debug` or `./gradlew :app:assembleDebug`) to trigger KSP/Room compilation and schema export.
2. Confirm `<version>.json` was generated cleanly and tracked in Git.
3. Verify migration SQL statements and exported `<version>.json` column parity (`affinity`, `notNull`, `defaultValue`) using pure JVM unit tests (no `androidTest` / Robolectric bloat required), plus an optional live upgrade check on an active emulator (`adb install -r`).

> **Detailed examples & test patterns**: See **[Migration Patterns & Testing Guide](references/migration-patterns.md)**.

## Implementation Checklist
- [ ] `@Entity` updated without Kotlin constructor defaults; `@ColumnInfo(defaultValue = "...")` set on newly migrated `NOT NULL` columns.
- [ ] `@Database.version` incremented by `+1`, `exportSchema = true`, and trailing commas preserved in `entities`.
- [ ] `@AutoMigration` (when `<prev>.json` exists) or non-destructive `MIGRATION_<from>_<to>` registered via `.addMigrations(...)` (zero `.fallbackToDestructiveMigration(...)`).
- [ ] Exported `<version>.json` generated and tracked in Git (historical JSON files untouched).
- [ ] Zero redundant `withContext(Dispatchers.IO)` around Room `suspend` / `Flow` / `withTransaction` calls.
- [ ] Active debug assemble task and pure JVM migration/schema parity tests pass cleanly.
