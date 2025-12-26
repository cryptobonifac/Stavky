---
name: dotnet-nextjs-testing-setup
description: Complete .NET 10 project setup with Next.js frontend and comprehensive C# testing infrastructure using Playwright, Reqnroll (BDD), and NUnit. Use when creating a new full-stack project that requires (1) .NET backend/testing with Next.js frontend, (2) End-to-end testing with Playwright in C#, (3) BDD testing with Reqnroll/SpecFlow patterns, (4) NUnit test framework setup, or (5) VS Code configuration for .NET testing workflow.
---

# .NET + Next.js Testing Setup

## Overview

Automated setup for .NET 10 projects with Next.js frontend and a complete C# testing infrastructure using Playwright for E2E testing, Reqnroll for BDD scenarios, and NUnit as the test runner.

## Requirements
- python 3

## Quick Start

Run the setup script to create a new project:

```bash
python3 scripts/setup_project.py <project-name>
```

The script creates:
- Solution file (.sln)
- Next.js application in `app/` directory
- .NET test project in `tests/` directory with:
  - Playwright configured for C# browser automation
  - Reqnroll configured for BDD scenarios
  - NUnit as the test framework
  - Example feature files, step definitions, and tests
  - VS Code configuration for debugging

## Project Structure

```
ProjectName/
├── ProjectName.sln
├── app/                          # Next.js application
│   ├── package.json
│   ├── next.config.js
│   └── ...
├── tests/                        # .NET test project
│   ├── ProjectName.Tests.csproj
│   ├── Features/
│   │   └── Sample.feature        # Reqnroll feature files
│   ├── StepDefinitions/
│   │   └── SampleSteps.cs        # Reqnroll step definitions
│   ├── PageObjects/
│   │   └── BasePage.cs           # Playwright page objects
│   ├── Support/
│   │   └── Hooks.cs              # Reqnroll hooks
│   ├── Tests/
│   │   └── ExampleTest.cs        # NUnit + Playwright tests
│   ├── appsettings.json
│   ├── reqnroll.json
│   └── GlobalUsings.cs
├── .vscode/
│   ├── launch.json               # Debug configuration
│   ├── settings.json             # Workspace settings
│   └── .runsettings              # Test run settings
└── README.md
```

## VS Code Setup

### Required Extensions

See [references/vscode-extensions.md](references/vscode-extensions.md) for the complete list of required VS Code extensions.

Essential extensions:
- C# Dev Kit
- .NET Install Tool
- Reqnroll (for feature file support)
- Test Explorer UI

### Running Tests

**From VS Code:**
1. Open Test Explorer (flask icon in sidebar)
2. Run individual tests or test suites
3. Use breakpoints for debugging

**From Command Line:**
```bash
cd tests
dotnet test
```

**Run specific tests:**
```bash
dotnet test --filter "TestCategory=Smoke"
dotnet test --filter "FullyQualifiedName~Login"
```

## Testing Workflow

### 1. BDD Testing with Reqnroll

Create feature files in `tests/Features/`:

```gherkin
Feature: User Login
  As a user
  I want to log in to the application
  So that I can access my account

Scenario: Successful login
  Given I am on the login page
  When I enter valid credentials
  And I click the login button
  Then I should see the dashboard
```

Implement step definitions in `tests/StepDefinitions/`.

### 2. E2E Testing with Playwright

Write NUnit tests with Playwright in `tests/Tests/`:

```csharp
[Test]
public async Task Should_Navigate_To_Home_Page()
{
    await Page.GotoAsync("http://localhost:3000");
    await Expect(Page).ToHaveTitleAsync("Home");
}
```

### 3. Page Object Pattern

Use the base page object for consistent element interactions:

```csharp
public class LoginPage : BasePage
{
    public LoginPage(IPage page) : base(page) { }

    public async Task LoginAsync(string username, string password)
    {
        await Page.FillAsync("[data-testid='username']", username);
        await Page.FillAsync("[data-testid='password']", password);
        await Page.ClickAsync("[data-testid='login-button']");
    }
}
```

## Configuration

### Playwright Configuration

Playwright is configured to:
- Use Chromium by default
- Run headless in CI/CD
- Take screenshots on failure
- Record traces for debugging

### Reqnroll Configuration

Reqnroll is configured in `reqnroll.json` with:
- NUnit runner integration
- Step definition scanning
- Report generation settings

### Test Settings

`.runsettings` file includes:
- Test timeout configuration
- Parallel execution settings
- Environment variables
- Result output configuration

## Troubleshooting

See [references/troubleshooting.md](references/troubleshooting.md) for common issues and solutions.

### Quick Fixes

**Playwright browsers not installed:**
```bash
pwsh tests/bin/Debug/net10.0/playwright.ps1 install
```

**Reqnroll code-behind files not generated:**
```bash
cd tests
dotnet build
```

**VS Code not recognizing tests:**
- Reload VS Code window
- Ensure C# Dev Kit extension is installed
- Check .NET SDK is properly installed

## Resources

This skill includes:

### scripts/
- `setup_project.py` - Automated project initialization script

### references/
- `vscode-extensions.md` - Required VS Code extensions
- `troubleshooting.md` - Common issues and solutions

### assets/
- Template files for test project configuration
- Example feature files and step definitions
- VS Code configuration templates
- Page object base classes

## Additional Documentation

For comprehensive user-facing documentation on how to use this skill:

- **[USAGE.md](USAGE.md)** - Complete guide for end users on triggering the skill, what to expect during setup, and how to use the generated project
- **[README.md](README.md)** - Quick reference and skill overview

When a user asks how to use this skill or needs help after project creation, direct them to these resources.

## Successfull installation
- when the skill successfully creates a new project add this text to new project README.md file 
  
 ```text 
1. Open the project in VS Code:
  cd DemoProject
  code .
  1. Install recommended VS Code extensions:
    - C# Dev Kit
    - .NET Install Tool
    - Reqnroll
    - Test Explorer UI
  2. Install Playwright browsers (if not already done):
  cd tests
  powershell -File bin/Debug/net10.0/playwright.ps1 install
  1. Run the Next.js app:
  cd app
  npm run dev
  1. Visit http://localhost:3000
  2. Run the tests:
  cd tests
  dotnet test
```
  Your project is ready for development