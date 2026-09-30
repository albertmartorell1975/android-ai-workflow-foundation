---
name: ai-context-exclusion
description: Provider-agnostic AI context exclusion governance across Gemini, Cursor, and Claude Code. Translates semantic exclusion rules between provider formats (.aiexclude, .cursorignore, .claude/settings.json).
metadata:
  author: Albert Martorell Garcia
  version: 1.0.0
  keywords:
  - context-exclusion
  - aiexclude
  - cursorignore
  - claude-settings
  - security
  - privacy
---
# AI Context Exclusion Governance

This skill manages provider-agnostic AI context exclusion policies for Android projects. It ensures that sensitive developer files, build artifacts, local configurations, and private credentials are excluded from the AI agent's context regardless of which AI assistant or IDE tool is used.

## Supported Providers & Formats

Different AI assistants use different exclusion formats and file paths:

| AI Provider | Configuration File | Format / Pattern Style |
| :--- | :--- | :--- |
| **Gemini / Android Studio (Default)** | `.aiexclude` (project root) | Gitignore-style patterns |
| **Cursor** | `.cursorignore` (project root) | Gitignore-style patterns |
| **Claude Code** | `.claude/settings.json` (project root) | JSON permission rules (`permissions.deny` array with `Read(...)` strings) |

> [!IMPORTANT]
> **Default Provider Rule**: If no AI provider is specified, or if an unrecognized provider name is entered, default to **Gemini (`.aiexclude`)** or prompt the user using `ask_user`.

---

## Templates Source of Truth (Embedded)

Since `docs/` is not installed in consuming projects, all baseline exclusion templates are embedded directly within this skill file.

### 1. Gemini / Android Studio Template (`.aiexclude`)
```text
# ==========================================
# AI Context Exclusion — Gemini / Android Studio
# ==========================================
# File: .aiexclude
# Format: Gitignore-style patterns

# 1. Local / Developer-specific Configuration
local.properties

# 2. Build Outputs & Generated Files
/build/
/captures/
/.externalNativeBuild/
/.cxx/

# 3. Gradle & Build Caches
.gradle/

# 4. IDE Configuration & Project Files
.idea/
*.iml

# 5. OS-specific Files
.DS_Store

# ==========================================
# 6. Project-Specific Additions (Examples)
# ==========================================
# Environment / Secrets
# .env
# .env.*
# **/secrets.*
# **/credentials.*
#
# Android / Firebase
# **/google-services.json
# **/service-account*.json
#
# Signing / Certificates
# **/*.jks
# **/*.keystore
# **/*.p12
# **/*.pfx
#
# Private / Sensitive Data
# **/private/
# **/sensitive/
# **/confidential/
# **/production-data/
#
# Other Sensitive Files
# **/*api-key*
# **/*token*
# **/*password*
# **/*private-key*
```

### 2. Cursor Template (`.cursorignore`)
```text
# ==========================================
# AI Context Exclusion — Cursor
# ==========================================
# File: .cursorignore
# Format: Gitignore-style patterns

# 1. Local / Developer-specific Configuration
local.properties

# 2. Build Outputs & Generated Files
/build/
/captures/
/.externalNativeBuild/
/.cxx/

# 3. Gradle & Build Caches
.gradle/

# 4. IDE Configuration & Project Files
.idea/
*.iml

# 5. OS-specific Files
.DS_Store

# ==========================================
# 6. Project-Specific Additions (Examples)
# ==========================================
# Environment / Secrets
# .env
# .env.*
# **/secrets.*
# **/credentials.*
#
# Android / Firebase
# **/google-services.json
# **/service-account*.json
#
# Signing / Certificates
# **/*.jks
# **/*.keystore
# **/*.p12
# **/*.pfx
#
# Private / Sensitive Data
# **/private/
# **/sensitive/
# **/confidential/
# **/production-data/
#
# Other Sensitive Files
# **/*api-key*
# **/*token*
# **/*password*
# **/*private-key*
```

### 3. Claude Code Template (`.claude/settings.json`)
```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "deny": [
      "Read(./local.properties)",
      "Read(./build/**)",
      "Read(./captures/**)",
      "Read(./.externalNativeBuild/**)",
      "Read(./.cxx/**)",
      "Read(./.gradle/**)",
      "Read(./.idea/**)",
      "Read(./*.iml)",
      "Read(./.DS_Store)"
    ]
  }
}
```

---

## Initial Creation Protocol

When invoked during project kickoff (e.g. delegated from `workflow-initializer`):

1. **Resolve Provider**: Check the provided AI Provider argument.
   - If no AI provider argument is specified or if it is ambiguous, the agent **MUST** use the `ask_user` tool to prompt the user to select their provider:
     * `Gemini / Android Studio (.aiexclude)`
     * `Cursor (.cursorignore)`
     * `Claude Code (.claude/settings.json)`
   - If `Gemini` is chosen/specified → Select `.aiexclude` template.
   - If `Cursor` is chosen/specified → Select `.cursorignore` template.
   - If `Claude Code` is chosen/specified → Select `.claude/settings.json` template.
2. **Materialize File**: Write the corresponding embedded template to the project root (`.aiexclude`, `.cursorignore`, or `.claude/settings.json`).
3. **Single File Constraint**: Create **only** the selected provider's exclusion configuration file. Do not generate all provider files by default.

---

## Format Translation Rules

When converting or synchronizing exclusion rules between providers, translate the **semantic rules**, not simple string copies.

### 1. Gitignore Style (`.aiexclude` ↔ `.cursorignore`)
Since both `.aiexclude` and `.cursorignore` use standard Gitignore-style matching, rules can be synchronized directly line-by-line while preserving comment blocks.

### 2. Gitignore Style → Claude Code (`.claude/settings.json`)
Convert Gitignore entries into `Read(...)` strings inside the `permissions.deny` array:

* `local.properties` → `"Read(./local.properties)"`
* `/build/` or `build/` → `"Read(./build/**)"`
* `/.cxx/` → `"Read(./.cxx/**)"`
* `*.iml` → `"Read(./*.iml)"`

**Safe Merging Rule for `.claude/settings.json`**:
When writing to `.claude/settings.json`:
1. Read existing `.claude/settings.json` if it exists.
2. Preserve all existing keys (e.g. `$schema`, `permissions.allow`, `hooks`, etc.).
3. Under `permissions.deny`, merge new `Read(...)` entries without removing existing ones.
4. Format the JSON cleanly with 2-space indentation.

### 3. Claude Code (`.claude/settings.json`) → Gitignore Style (`.aiexclude` / `.cursorignore`)
Extract `Read(...)` strings from `permissions.deny` and map back to Gitignore patterns:

* `"Read(./local.properties)"` → `local.properties`
* `"Read(./build/**)"` or `"Read(./build/*)"` → `/build/`
* `"Read(./*.iml)"` → `*.iml`

---

## Provider Switching Protocol

When a developer switches AI providers (e.g., Gemini → Cursor → Claude Code → Gemini):

1. **Identify Source Format**: Locate the existing active exclusion file (`.aiexclude`, `.cursorignore`, or `.claude/settings.json`).
2. **Extract Rules**: Parse all active non-commented exclusion rules.
3. **Target Format Generation**:
   - Create only the target provider's configuration file.
   - Apply semantic conversion according to the Format Translation Rules.
   - Do not delete old configuration files unless requested by the user, but ensure the new provider file is fully active.
4. **Verify Baseline Integrity**: Confirm that all core baseline entries (`local.properties`, `/build/`, `.gradle/`, `.idea/`, `.DS_Store`) remain protected in the target format.

---

## Actionable Checklist for Context Exclusion
- [ ] If no AI provider is specified or ambiguous, prompt the user interactively using the `ask_user` tool (`Gemini`, `Cursor`, or `Claude Code`).
- [ ] Ensure only the selected provider's configuration file is created or updated.
- [ ] Verify common baseline rules are enforced.
- [ ] When switching providers, perform semantic translation between formats.
- [ ] If updating `.claude/settings.json`, perform a safe merge without overwriting existing settings.
