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
> **Default Provider Rule**: If no AI provider is specified, or if an unrecognized provider name is entered, default to **Gemini (`.aiexclude`)**.

## Template Source of Truth

The Foundation stores the canonical baseline templates under:

```text
docs/templates/ai-context-exclusion/
├── .aiexclude
├── .cursorignore
└── claude-settings.json
```

## Common Exclusion Baseline

All providers share the same conservative common baseline by default:

```text
local.properties

/build/
/captures/
/.externalNativeBuild/
/.cxx/

.gradle/

.idea/
*.iml

.DS_Store
```

### Optional / Project-Specific Rules
Do not enable broad sensitive patterns by default. Keep project-specific patterns as commented examples or explicit user choices:

```text
# Environment / Secrets
# .env
# .env.*
# **/secrets.*
# **/credentials.*

# Android / Firebase
# **/google-services.json
# **/service-account*.json

# Signing / Certificates
# **/*.jks
# **/*.keystore
# **/*.p12
# **/*.pfx

# Private / Sensitive Data
# **/private/
# **/sensitive/
# **/confidential/
# **/production-data/
```

---

## Initial Creation Protocol

When invoked during project kickoff (e.g. delegated from `workflow-initializer`):

1. **Resolve Provider**: Check the provided AI Provider argument.
   - If no AI provider argument is specified or if it is ambiguous, the agent **MUST** use the `ask_user` tool to prompt the user to select their provider:
     * `Gemini / Android Studio (.aiexclude)`
     * `Cursor (.cursorignore)`
     * `Claude Code (.claude/settings.json)`
   - If `Gemini` is chosen/specified → Select `.aiexclude`.
   - If `Cursor` is chosen/specified → Select `.cursorignore`.
   - If `Claude Code` is chosen/specified → Select `.claude/settings.json`.
2. **Materialize File**: Read the baseline template from `docs/templates/ai-context-exclusion/` for the selected provider and write it to the project root.
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
