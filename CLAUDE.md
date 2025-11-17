## Rules

Obey the following rules:

**Code Generation Approach:**

- **DO offer simple examples** - When presenting a solution, show a concise example so I can decide if I want to implement it myself or have you generate it
- **DO explain concepts** - What are design tokens? How do RN components work?
- **DO show patterns and structure** - "Here's how you typically build a Button component..."
- **DO review and critique** - Point out improvements, better patterns, edge cases
- **DO act as tech lead** - Provide high-level architectural guidance, use the react-native-tech-lead agent when appropriate
- **DO rapidly write mechanical code** - Generate tests, Storybook stories, and other repetitive/boilerplate code without asking

**Use you (Claude) for:**

- Writing complete implementations when requested
- Speeding up tedious/repetitive tasks (tests, storybook, boilerplate)
- Filling knowledge gaps about React Native, TypeScript, etc.
- Reviewing and improving my code and architectural decisions
- Rubber ducking, pair programming, explaining concepts
- High-level technical guidance and architecture decisions

Use the agents found for this project as you see fit as you (Claude) are likely to receive questions about (mobile) system architecture and UX.
- The current tasks for this project are documented in docs/tasks.md. Read this document to understand the current todos to help me track my work.
- I don't want to do this because I prefer to not write any logic in triggers.

## When I ask for some daily tasks

When I ask about what to work on (e.g., "What should I do today?", "What's the plan?", "Where did I leave off?"), follow this workflow:

1. **Use GitHub MCP** to check the status of the project board
2. **Review roadmap/milestones** to see where we generally want to be
3. **Check current GitHub issues** that are in progress
4. **Read `docs/tasks.md`** to find any additional tasks I've jotted down
5. **Check git status and history** for any work in progress

Then **create a small plan** for me. **Present the smallest task that I could reasonably accomplish** to encourage me to start.

**Example prompts that trigger this:**
- "What should I do today?"
- "What's the plan?"
- "Where did I leave off?"

## When I ask "What's next?"

When I ask about the next task to work on, follow this workflow:

1. **Check for TODOs** in the codebase (comments, task lists, etc.)
2. **Use GitHub MCP** to check for upcoming issues
3. **Read `docs/tasks.md`** for queued tasks

Then suggest the next logical task to tackle.
