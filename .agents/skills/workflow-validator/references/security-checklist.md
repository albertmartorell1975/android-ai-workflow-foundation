# Feature Security Checklist (`workflow-validator`)

Use this checklist during Level 2 of feature validation. It is a feature-scoped security review anchored to:

- the selected feature spec (`docs/features/<feature-id>/spec.md`),
- the implementation diff,
- files changed by the implementation (`AndroidManifest.xml`, network/repository classes, deep links, intents, storage),
- directly supporting files needed to understand the changed security behavior.

## Security Review Principles

- Stay diff-focused: review changed behavior and directly supporting code, not the whole repo.
- Think in `source -> control -> sink` paths: where input/data comes from, what checks transform or restrict it, and where it is used.
- Preserve evidence: cite file paths, relevant code behavior, commands, or missing controls.
- Prefer concrete findings over generic advice.
- If a risk is theoretical but not exploitable in this feature slice, record it as a note, not a blocking finding.
- If a security issue blocks acceptance, include it in the `Implementation Repair Brief` in `docs/features/<feature-id>/validator/validation-report.md`.

## Core Checks

### 1. Android Component & Intent Security (`android-intent-security`)

When the feature touches `AndroidManifest.xml`, Activities, Services, BroadcastReceivers, ContentProviders, Deep Links, or `Intent` extras:

- Verify explicit `android:exported="false"` unless the component is intentionally public.
- Verify that exported components enforce appropriate permissions or caller checks.
- Prevent **Intent Redirection**: never extract a nested `Intent` from untrusted extras (`getParcelableExtra`) and launch it directly (`startActivity`, `startService`, `sendBroadcast`) without strict component/package allowlisting.
- Ensure `PendingIntent` instances use `FLAG_IMMUTABLE` by default (or validate mutability requirements carefully).

### 2. Secrets And Configuration

Check for:

- committed API keys, tokens, private URLs, keystore passwords, OAuth client secrets, or `local.properties` / `.env` contents,
- secrets embedded in tests, fixtures, screenshots, logs, or docs,
- unsafe default credentials.

Pass signal:

- no secrets in the diff,
- sensitive configuration is injected securely and excluded from version control.

### 3. Authentication, Session & Token Storage

When the feature touches login, biometrics, tokens, sessions, or user roles:

- sensitive tokens are stored in encrypted storage (DataStore + Tink / Keystore), never in plain-text SharedPreferences or logs,
- revoked or expired session states are handled cleanly and mapped to `DomainError.Unauthorized` / `SessionExpired`,
- UI role checks are backed by domain/server enforcement.

### 4. Input Validation, SQL & Deep Links

When the feature handles user input, search queries, Room/SQL queries, WebViews, or Deep Links:

- Room queries use parameterized `@Query` bindings (never raw string concatenation in `@RawQuery`),
- Deep link parameters and URIs are validated before navigation or file/network access,
- file paths cannot traverse outside allowed app storage directories (`Path Traversal`).

### 5. Data Exposure, Logging & Privacy

Check that:

- PII, passwords, auth headers, and session tokens are never printed to `Log.*` or crash breadcrumbs in release builds (`HttpLoggingInterceptor` restricted to debug or redacted),
- sensitive screens handle privacy appropriately.

### 6. External Services & Network Security

When the feature calls REST/GraphQL APIs, webhooks, or third-party SDKs:

- HTTPS/TLS is enforced (no accidental `usesCleartextTraffic="true"` in `AndroidManifest.xml`),
- timeouts and retries are bounded,
- network exceptions are caught at the `data` boundary and mapped to typed `DomainError` instances (`repository-pattern-governance`).

### 7. Dependency And Tooling Risk

When `gradle/libs.versions.toml` or `build.gradle.kts` change:

- new dependencies follow `dependency-manager` governance, are necessary for the feature, and come from trusted Maven repositories (`google()`, `mavenCentral()`),
- generated build artifacts (`build/`, `.worktrees/`, `.gradle/`) remain ignored.

## Security Finding Format

When reporting a security issue in `docs/features/<feature-id>/validator/validation-report.md`, include:

- **Severity**: `Critical` | `High` | `Medium` | `Low`
- **File / Evidence**: `<file path and lines>`
- **Attack path**: How an untrusted Intent, deep link, network payload, or local actor reaches the issue.
- **Affected asset**: User credentials, private local data, exported component, etc.
- **Required change & Suggested implementation steps**: Concrete fix for `workflow-implementer`.
