# 🚀 Android AI Workflow Foundation

A standardized, AI-assisted development workflow seed for Android and KMP projects. Built on Clean Architecture, SOLID principles, and a strict Human-in-the-loop governance.

## 🛠 Installation

Run the following command in your new project's root:
```bash
npx skills add albertmartorell/android-ai-workflow-foundation -y
```

## ⚡️ Getting Started

1. **Open Android Studio** and the Agent chat.
2. **Say Hello**: The agent is proactive! It will detect the foundation and offer to initialize the project if it's not already deployed.
3. **Diagnosis Phase**: The agent will ask about your Stack:
   - Architecture: MVI / MVVM
   - DI: Hilt / Koin / Native
   - Network/Persistence: Retrofit, Room, etc.
4. **Auto-Deployment**: The agent will automatically create `.agents/rules.md` and `.agents/AGENTS.md` tailored to your choices.
5. **Git Setup**: It will also help you initialize Git and create `main`/`develop` branches.

## 🛡 Governance Features
- **Gateway Protocol**: Agents never code without a human-approved plan.
- **Atomic Commits**: Standardized Git Flow and commit naming.
- **Clean Architecture Enforcement**: Strict boundaries between Domain, Data, UseCases, and UI.

## 📦 Exportable Package Structure
This repository is designed to be consumed as an Agent Skill. It includes:
- `package.json`: The manifest defining the skills.
- `.agents/rules.md`: Core prompting rules.
- `.agents/AGENTS.md`: Role definitions.
- `.agents/skills/`: Specialized workflow automations.
