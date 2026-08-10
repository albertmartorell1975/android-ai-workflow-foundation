# Compiler Skill Command Reference

Detailed list of commands used by the `compiler` skill for project verification.

## Local Build Commands
- `./gradlew compileDebugKotlin`: Compiles Kotlin source files for the debug variant.
- `./gradlew assembleDebug`: Builds the full debug APK, verifying the entire project structure.
- `./gradlew :[module]:test`: Runs unit tests for a specific module (e.g., `:domain`, `:data`).

## Android CLI Interaction
- `android emulator start [name]`: Launches a virtual device.
- `android run`: Deploys the current application to an active device/emulator.
- `android layout`: Dumps the UI hierarchy for visual debugging.
- `android screenshot`: Captures the current screen.
