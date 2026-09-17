# 🚀 Android AI Workflow Foundation v3.0.0

Exploring how AI agents can become part of a disciplined, human-supervised software engineering process.

**Android AI Workflow Foundation** is a modular development framework for Android projects. It provides a shared foundation of engineering standards, technical expertise, and governance while allowing projects to choose how AI agents collaborate during feature development.

The goal is not to automate software development completely. The developer remains responsible for architecture, technical decisions, review, and final validation.

---

## 🏗 Architecture

The Foundation separates three concerns:

```text
Foundation Core
      │
      ├── Project Initialization
      ├── Engineering Governance
      ├── Android & Kotlin Expertise
      └── Technical Guardrails
                │
                ▼
        Workflow Selection
          ┌─────┴─────┐
          │           │
     Foundation    AI Expert
      Workflow     Workflow
     Single Agent  Multi-Agent
```

The same Foundation can therefore support different AI-assisted development methodologies without changing the underlying engineering standards.

---

## 1. Foundation Core

The Foundation Core provides the common capabilities shared by all projects and workflows.

### Project Initialization

`workflow-initializer` bootstraps and customizes the project. It performs stack diagnosis, configures the project-specific context, manages optional plugins, and lets the project select its development workflow.

### Engineering Governance

Core skills provide the common rules and verification mechanisms used across the project, including:

* `compiler`
* `git-governance`
* `dependency-manager`
* `testing-setup`
* `kotlin-style`
* `to-plan`
* `foundation-evolve`
* architecture and platform governance skills

### Android & System Expertise

The Foundation also includes technical Android and system-level skills covering areas such as:

* Android CLI
* adaptive UI
* edge-to-edge
* Navigation 3
* Android Intent security
* R8
* Compose and Kotlin practices

See the [Expert Skills Index](.agents/skills/README.md) for the complete list.

---

## 2. Pluggable Development Methodologies

The Foundation can use different workflows to organize feature development.

The main distinction is **how responsibility is distributed between AI agents**.

### Foundation Workflow

**Single-agent, centralized workflow.**

`workflow-feature` acts as the Foundation's native Workflow Architect.

The same agent can:

1. Analyze the feature and the current repository.
2. Define the technical approach.
3. Generate a persistent `WORKFLOW_FEATURE.md` roadmap.
4. Guide the implementation.
5. Apply the project's engineering and verification rules.

This approach keeps the feature context centralized and minimizes handoff and coordination overhead.

Use it when one agent can effectively own the feature from analysis through implementation and verification.

### AI Expert Workflow

**Multi-agent, specialized workflow.**

The AI Expert Workflow introduces explicit roles for different stages of feature development.

The workflow includes:

1. **build-brief** — guided discovery and clarification of the product or feature.
2. **harness-starter** — prepares the minimal project harness and development context.
3. **feature-spec** — creates an implementation-ready specification.
4. **feature-implementer** — implements the approved specification.
5. **feature-validator** — independently validates the implementation.
6. **feature-flow** — orchestrates the feature workflow and coordinates the specialized agents.

The key characteristic is the separation between planning, implementation, and validation.

This approach is useful when explicit handoffs, specialized agent roles, and independent validation provide enough value to justify the additional coordination.

### Choosing a Workflow

The choice is not strictly based on whether the project is new or existing.

A practical rule is:

> **Use the Foundation Workflow when one agent can efficiently own the task end to end.**

> **Use the AI Expert Workflow when the task benefits from separating planning, implementation, and validation across specialized agents.**

Both workflows can be used with new or existing projects.

---

## 3. Human Supervision

Both workflows are designed to remain **human-supervised**.

The difference is not autonomous AI versus human-controlled AI. The human remains the highest-level supervisor in both models.

### Foundation Workflow

```text
Human
  ↓
Single AI Agent
  ├── Analyze
  ├── Plan
  ├── Implement
  └── Verify
  ↓
Human Review
```

### AI Expert Workflow

```text
Human
  ↓
Workflow Orchestrator
  ├── Planner
  ├── Implementer
  └── Validator
  ↓
Human Review
```

The human can review, correct, approve, or interrupt the process at any stage.

---

## 4. Workflow Routing

The active workflow is stored in:

```text
.agents/workflow.json
```

For example:

```json
{
  "activeWorkflow": "foundation"
}
```

or:

```json
{
  "activeWorkflow": "ai-expert-workflow"
}
```

This configuration acts as a routing and safety boundary.

When the Foundation Workflow is active:

```text
activeWorkflow = foundation
        ↓
workflow-feature
```

When the AI Expert Workflow is active:

```text
activeWorkflow = ai-expert-workflow
        ↓
feature-flow
```

The inactive workflow remains available where installed, but must not orchestrate feature development.

This prevents mixing the two methodologies within the same feature workflow.

---

## 🛠 Installation

### Scenario A: New Project

Initialize your Android project first, then run:

```bash
npx skills add albertmartorell1975/android-ai-workflow-foundation
```

Open Android Studio and the Agent chat, then activate:

```text
Activate workflow-initializer
```

The initializer will:

* inspect the project,
* customize the Foundation,
* configure the project context,
* present workflow options,
* and activate optional skills or workflow plugins as needed.

### Scenario B: Existing Project

Run the same command from the project root:

```bash
npx skills add albertmartorell1975/android-ai-workflow-foundation
```

Then activate:

```text
Activate workflow-initializer
```

The Foundation can be introduced into an existing project without requiring the project to adopt a new development methodology.

---

## 🧩 Optional Plugins & Workflows

The Foundation catalog contains optional skills and workflow methodologies that are not part of the mandatory Foundation Core.

They can be activated through `workflow-initializer` when appropriate.

Examples include:

* specialized Android technologies,
* Firebase or other platform integrations,
* expert Compose/Kotlin skills,
* alternative development workflows.

### AI Expert Workflow

The AI Expert Workflow was originally created by **Antonio Leiva / Nino Ruano** for the **AI Expert** course and is integrated and adapted here with the author's permission.

Its workflow skills are maintained under `.agents/catalog`.

---

## 🔄 Maintaining & Updating

### Syncing Installed Skills

To receive updates to skills already installed in the project:

```bash
npx skills update
```

### Evolving the Foundation

The `foundation-evolve` skill is used to promote useful skills and improvements from working projects back into the Foundation.

The repository separates:

```text
.agents/skills/
```

for active Foundation skills from:

```text
.agents/catalog/
```

for optional skills and workflow plugins.

See the [Expert Skills Index](.agents/skills/README.md) for the current Foundation skill set.

---

## 🙏 Acknowledgments & Credits

This Foundation incorporates knowledge and methodologies from multiple sources:

* **Foundation Methodology:** Albert Martorell Garcia.
* **AI Expert Workflow:** **Antonio Leiva** / **Nino Ruano**, originally created for the AI Expert course.
* **External Expert Patterns:** Includes curated skills from experts such as **Chris Banes**.
* **Official Documentation:** Integrates knowledge and guidance from Google Android and Firebase documentation.

Included skills retain their original authorship and source metadata. Please respect the corresponding licenses and attribution requirements.

---

## Core Principle

The Foundation is designed around a simple idea:

> **Same Foundation, different development methodology.**

Shared engineering standards provide consistency, while the selected workflow determines how AI agents collaborate to build the software.
