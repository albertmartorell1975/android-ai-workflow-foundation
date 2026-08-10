# Git Conventions Reference

## Branch Naming Guide

Always use lowercase and hyphens for branch names.

- **features**: `feature/[ID]-[short-description]` (e.g., `feature/MM-101-login-screen`). Always from `develop`.
- **bugs**: `bugfix/[ID]-[desc]`. Parent depends on context:
    - From `develop`: If the bug is in the current dev cycle.
    - From `release/vX.Y.Z`: If the bug is found during release testing.
    - From `feature/[name]`: If the bug is localized to an ongoing feature.
- **hotfixes**: `hotfix/[ID]-[version]` (e.g., `hotfix/MM-202-v1.0.1`). Always from `main`.

## Commit Message Standards

We use **Conventional Commits** with Task ID integration.

### Format
`<type>(<module>): [ID] <description>`

### Types
- **feat**: A new feature for the user.
- **fix**: A bug fix for the user.
- **docs**: Changes to documentation.
- **style**: Formatting, missing semi-colons, etc; no code change.
- **refactor**: Refactoring a specific section of the codebase.
- **test**: Adding missing tests.
- **chore**: Updating build tasks, package manager configs, etc; no production code change.

### Examples
- `feat(ui): [MM-123] add favorites button to city detail`
- `fix(data): [MM-124] correct coordinate mapping in OpenWeather response`
- `docs(ai): [MM-125] update AGENTS.md with new quality rules`
- `refactor(domain): [MM-126] simplify Weather entity structure`
