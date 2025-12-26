# .NET + Next.js Testing Setup Skill

A Claude Code skill that automatically sets up .NET 10 projects with Next.js frontend and comprehensive C# testing infrastructure.

## What This Skill Does

Automates the complete setup of a full-stack project with:
- ✅ .NET 10 solution and test project
- ✅ Next.js application with TypeScript
- ✅ Playwright for browser automation (C#)
- ✅ Reqnroll for BDD testing
- ✅ NUnit as the test framework
- ✅ VS Code configuration for debugging
- ✅ Example tests and page objects

## Quick Start

In Claude Code, simply say:

```
Create a new .NET project with Next.js and testing called "MyProject"
```

Claude Code will automatically invoke this skill and set up everything for you.

## Skill Triggers

This skill activates when you ask to:
- Set up a new .NET project with Next.js and testing
- Create a new project with Playwright and Reqnroll tests
- Initialize a .NET 10 + Next.js project
- Set up E2E testing with Playwright in C#
- Create a BDD testing project with Reqnroll

## Documentation

- **[USAGE.md](USAGE.md)** - Complete guide on how to use this skill
- **[SKILL.md](SKILL.md)** - Skill reference for Claude Code
- **[references/vscode-extensions.md](references/vscode-extensions.md)** - Required VS Code extensions
- **[references/troubleshooting.md](references/troubleshooting.md)** - Common issues and solutions

## What Gets Created

```
YourProjectName/
├── YourProjectName.sln           # Solution file
├── app/                          # Next.js application
├── tests/                        # .NET test project
│   ├── Features/                 # Reqnroll .feature files
│   ├── StepDefinitions/          # BDD step definitions
│   ├── PageObjects/              # Playwright page objects
│   ├── Tests/                    # NUnit tests
│   └── Support/                  # Test hooks and utilities
├── .vscode/                      # VS Code configuration
│   ├── launch.json               # Debug configurations
│   ├── settings.json             # Workspace settings
│   └── .runsettings              # Test settings
└── README.md                     # Project documentation
```

## Prerequisites

Before using this skill, ensure you have:
- .NET 10 SDK
- Node.js 18+ and npm
- PowerShell (for Playwright browser installation)
- VS Code with Claude Code

## Examples

### Basic Usage
```
User: "Set up a new .NET project with testing"
Claude: [Invokes skill, creates project with all testing infrastructure]
```

### With Project Name
```
User: "Create a project called ShoppingCart with .NET, Next.js, and Playwright tests"
Claude: [Invokes skill, creates ShoppingCart project]
```

### Specific Location
```
User: "Initialize a .NET + Next.js project in ./projects/myapp"
Claude: [Invokes skill, creates project in specified location]
```

## After Setup

Once the skill completes:

1. **Open in VS Code**: `cd YourProject && code .`
2. **Install extensions**: When prompted, install recommended VS Code extensions
3. **Start Next.js**: `cd app && npm run dev`
4. **Run tests**: `cd tests && dotnet test`

## Features

### Testing Capabilities
- Browser automation with Playwright (Chromium, Firefox, WebKit)
- BDD scenarios with Reqnroll/Gherkin syntax
- NUnit test framework with async support
- Page Object pattern for maintainable tests
- Screenshot and video recording on failure
- Trace recording for debugging

### VS Code Integration
- Debug configurations for tests
- Test Explorer integration
- IntelliSense for C# and TypeScript
- Reqnroll feature file support
- Playwright test discovery

### Configuration
- Customizable test settings (browser type, timeouts, etc.)
- Test run settings for parallel execution
- Environment variable configuration
- CI/CD ready with TRX logger support

## Support

For detailed usage instructions, see [USAGE.md](USAGE.md).

For troubleshooting, see [references/troubleshooting.md](references/troubleshooting.md).

## Skill Details

- **Type**: Project Setup Skill
- **Target Framework**: .NET 10
- **Frontend**: Next.js 15+ with TypeScript
- **Testing**: Playwright + Reqnroll + NUnit
- **IDE**: VS Code optimized

## Version

This skill uses the latest stable versions of all dependencies as of the installation date.

## License

This skill is part of the Claude Code skill ecosystem.

---

**Need help?** Check [USAGE.md](USAGE.md) for complete documentation.
