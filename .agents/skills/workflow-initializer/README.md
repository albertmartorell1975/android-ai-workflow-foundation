# Workflow Initializer Skill

This is the central component of the **Workflow Foundation Seed**. Its function is to automate the deployment of governance and the initial configuration of any Android or KMP project.

## 🚀 Getting Started

### 1. Seed Installation
If you haven't installed the foundation yet, run this command in your project's root:
```bash
npx skills add albertmartorell/android-ai-workflow-foundation -y
```

### 2. Workflow Activation
Once installed, open the agent chat in Android Studio and say:
> "Activate the **workflow-initializer** skill to configure the project."

## ⚙️ What does this Skill do?

### Phase 1: Governance Deployment
The agent will automatically create the control files in the project root:
- `.agents/rules.md`: Prompt Engineering and proactivity rules.
- `.agents/AGENTS.md`: AI role definitions based on Clean Architecture.

### Phase 2: Stack Diagnosis (Customization)
The agent will ask you about your architecture to adjust the roles:
- **Architecture**: MVI or MVVM.
- **DI**: Hilt, Koin, or Native.
- **Data**: Retrofit, Room, etc.
- **Platform**: Android or KMP.

### Phase 3: Git Baseline
If the project doesn't have Git, the agent will:
1. Execute `git init`.
2. Create the `main` and `develop` branches.
3. Make the first commit with the deployed governance.

## 🛡️ Applied Principles
- **Clean Architecture**: Maintenance of Domain, UseCase, Data, and UI layers.
- **SOLID**: Single responsibilities for each agent.
- **Human-in-the-loop**: AI never makes architectural decisions or performs commits without human approval.
