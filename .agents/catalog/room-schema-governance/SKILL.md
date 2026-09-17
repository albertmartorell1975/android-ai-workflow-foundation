---
name: room-schema-governance
description: Ensures database integrity and schema evolution rules for Room.
metadata:
  author: Albert Martorell Garcia
  version: 1.0.0
  keywords:
  - room
  - database
  - schema
  - migration
  - persistence
---
# Room Schema Governance Specialist

This skill enforces strict rules for Room database evolution to prevent `IllegalStateException` and data loss during development and production.

## Core Rules

### 1. Automatic Version Increment
Whenever a file annotated with `@Entity` (typically in the `.../db/model/` directory) is modified, added, or deleted, the agent **MUST**:
1. Locate the abstract class annotated with `@Database`.
2. Increment the `version` number by exactly 1.
3. Apply **trailing commas** to the `entities` list if modified.

### 2. Migration Protocol
- **Development Phase**: Use `.fallbackToDestructiveMigration()` in the Room database builder to allow rapid schema changes without manual migration scripts.
- **Production Readiness**: When a schema change is performed on a "Stable" or "Release" branch, the agent must propose a manual `Migration` implementation instead of destructive fallback.

### 3. Verification Step
After any schema change:
1. Run `./gradlew :app:assembleDebug` to trigger the Room annotation processor.
2. If Room detects an issue, it will fail at compile time or during the first app launch in tests.
3. Always verify the `exportSchema` setting; if `true`, ensure the new schema JSON is generated and tracked.

## Implementation Checklist
- [ ] Identify if an `@Entity` class was changed.
- [ ] Increment `version` in `@Database` class.
- [ ] Add the new entity to the `entities = [...]` array if it's a new class.
- [ ] Verify trailing commas in the database declaration.
- [ ] Run a clean build to verify the processor output.
