# How to Use the .NET + Next.js Testing Setup Skill

This guide explains how to use the `dotnet-nextjs-testing-setup` skill with Claude Code to create new .NET projects with Next.js and comprehensive testing infrastructure.

## Table of Contents

- [Quick Start](#quick-start)
- [When to Use This Skill](#when-to-use-this-skill)
- [What This Skill Creates](#what-this-skill-creates)
- [Step-by-Step Usage](#step-by-step-usage)
- [After Setup](#after-setup)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)

## Quick Start

**In Claude Code, simply say:**

```
Create a new .NET project with Next.js and testing called "MyAwesomeApp"
```

or

```
Set up a new .NET 10 project with Playwright and Reqnroll tests called "MyProject"
```

Claude Code will automatically invoke this skill and guide you through the setup process.

## When to Use This Skill

Use this skill when you need:

1. **New Full-Stack Project**: Starting a new project with .NET backend/testing and Next.js frontend
2. **E2E Testing Setup**: Adding Playwright browser automation to your workflow
3. **BDD Testing**: Implementing Behavior-Driven Development with Reqnroll
4. **Standardized Project Structure**: Creating a consistent project setup across your team
5. **VS Code Integration**: Getting a fully configured VS Code environment for .NET testing

## What This Skill Creates

The skill sets up a complete project structure:

### Project Structure

```
YourProjectName/
├── YourProjectName.sln              # Solution file
├── app/                             # Next.js application
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── public/
├── tests/                           # .NET test project
│   ├── YourProjectName.Tests.csproj
│   ├── Features/
│   │   └── Sample.feature           # Example Reqnroll scenario
│   ├── StepDefinitions/
│   │   └── SampleSteps.cs           # Example step definitions
│   ├── PageObjects/
│   │   └── BasePage.cs              # Playwright page object base
│   ├── Support/
│   │   └── Hooks.cs                 # Reqnroll test hooks
│   ├── Tests/
│   │   └── ExampleTest.cs           # Example NUnit tests
│   ├── GlobalUsings.cs              # Global using statements
│   ├── appsettings.json             # Test configuration
│   └── reqnroll.json                # Reqnroll configuration
├── .vscode/
│   ├── launch.json                  # Debug configurations
│   ├── settings.json                # Workspace settings
│   └── .runsettings                 # Test execution settings
└── README.md                        # Project documentation
```

### Installed Packages

**NuGet Packages (in tests/):**
- Microsoft.Playwright.NUnit - Playwright browser automation
- Reqnroll.NUnit - BDD framework
- Reqnroll - Core Reqnroll library
- FluentAssertions - Fluent assertion library
- Microsoft.Extensions.Configuration - Configuration support

**npm Packages (in app/):**
- next - Next.js framework
- react - React library
- typescript - TypeScript support
- tailwindcss - CSS framework

## Step-by-Step Usage

### 1. Prerequisites

Before using the skill, ensure you have:

- ✅ .NET 10 SDK installed (`dotnet --version`)
- ✅ Node.js 18+ and npm installed (`node --version`)
- ✅ PowerShell (for Playwright browser installation)
- ✅ VS Code with Claude Code installed
- ✅ Git (optional, for version control)

### 2. Trigger the Skill

In Claude Code, use natural language to request a new project. Examples:

**Basic Usage:**
```
Set up a new .NET project with Next.js and testing
```

**With Project Name:**
```
Create a new project called "EcommerceApp" with .NET, Next.js, Playwright, and Reqnroll
```

**Specific Location:**
```
Initialize a .NET 10 + Next.js project called "MyAPI" in the ./projects directory
```

### 3. Claude Code Will Execute the Setup

The skill will automatically:

1. ✅ Check prerequisites (.NET, Node.js, npm, PowerShell)
2. ✅ Create the project directory
3. ✅ Generate the .sln file
4. ✅ Set up the Next.js app with TypeScript
5. ✅ Create the .NET test project
6. ✅ Install all NuGet packages
7. ✅ Install Playwright browsers
8. ✅ Copy template files (tests, configs, etc.)
9. ✅ Configure VS Code settings
10. ✅ Create project README

### 4. Setup Output

You'll see output like:

```
╔═══════════════════════════════════════════════════════════════╗
║  .NET + Next.js Testing Setup                                 ║
║  Creating: MyProject                                          ║
╚═══════════════════════════════════════════════════════════════╝

🔍 Checking prerequisites...
  ✅ .NET SDK found
  ✅ Node.js found
  ✅ npm found
  ✅ PowerShell found

📦 Creating solution file...
  → dotnet new sln -n MyProject

⚛️  Setting up Next.js application...
  Creating Next.js app (this may take a minute)...
  ✅ Next.js app created successfully

🧪 Creating test project...
  → dotnet new nunit -n MyProject.Tests -o tests
  → dotnet sln add tests/MyProject.Tests.csproj

📦 Installing NuGet packages...
  → dotnet add package Microsoft.Playwright.NUnit
  → dotnet add package Reqnroll.NUnit
  ...

🔨 Building test project...
  → dotnet build

🌐 Installing Playwright browsers...
  → pwsh bin/Debug/net10.0/playwright.ps1 install

📄 Creating project files from templates...
  ✅ Created GlobalUsings.cs
  ✅ Created appsettings.json
  ✅ Created Features/Sample.feature
  ...

⚙️  Setting up VS Code configuration...
  ✅ Created .vscode/launch.json
  ✅ Created .vscode/settings.json

📝 Creating README...
  ✅ README.md created

╔═══════════════════════════════════════════════════════════════╗
║  ✅ Setup Complete!                                           ║
╚═══════════════════════════════════════════════════════════════╝

Project created at: C:\Projects\MyProject

Next steps:
  1. cd MyProject
  2. Open in VS Code
  3. Install recommended extensions when prompted
  4. Run the Next.js app: cd app && npm run dev
  5. Run tests: cd tests && dotnet test

Happy testing! 🚀
```

## After Setup

### 1. Open the Project in VS Code

```bash
cd MyProject
code .
```

### 2. Install Recommended Extensions

When you open the project, VS Code will prompt you to install recommended extensions:

- C# Dev Kit
- .NET Install Tool
- Reqnroll
- Test Explorer UI
- ESLint
- Prettier

Click "Install All" or install them individually.

### 3. Start the Next.js App

```bash
cd app
npm run dev
```

Visit http://localhost:3000 to see your app running.

### 4. Run the Tests

**Run all tests:**
```bash
cd tests
dotnet test
```

**Run tests from VS Code:**
1. Open Test Explorer (flask icon in sidebar)
2. Click the play button to run tests
3. Use breakpoints for debugging

### 5. Explore the Example Code

The skill creates example files to help you get started:

**BDD Example (tests/Features/Sample.feature):**
```gherkin
Feature: Sample Feature
    As a user
    I want to navigate to the home page
    So that I can see the application

Scenario: Navigate to home page
    Given I navigate to the home page
    Then I should see the page title "Home"
```

**Step Definitions (tests/StepDefinitions/SampleSteps.cs):**
```csharp
[Given(@"I navigate to the home page")]
public async Task GivenINavigateToTheHomePage()
{
    await _page.GotoAsync(_baseUrl);
}
```

**NUnit + Playwright Test (tests/Tests/ExampleTest.cs):**
```csharp
[Test]
[Category("Smoke")]
public async Task Should_Load_Home_Page()
{
    await Page.GotoAsync(_baseUrl);
    (await Page.Locator("body").IsVisibleAsync()).Should().BeTrue();
}
```

## Customization

### Modify Base URL

Edit `tests/appsettings.json`:
```json
{
  "TestSettings": {
    "BaseUrl": "http://localhost:3000"  // Change this
  }
}
```

### Change Browser Type

Edit `tests/appsettings.json` or `.vscode/.runsettings`:
```json
{
  "TestSettings": {
    "BrowserType": "firefox"  // chromium, firefox, or webkit
  }
}
```

### Add More Tests

**Create a new feature file:**
```bash
# Create tests/Features/Login.feature
```

**Create corresponding step definitions:**
```bash
# Create tests/StepDefinitions/LoginSteps.cs
```

**Create page objects:**
```bash
# Create tests/PageObjects/LoginPage.cs
```

### Configure Test Parallelization

Edit `.vscode/.runsettings`:
```xml
<NUnit>
  <NumberOfTestWorkers>4</NumberOfTestWorkers>  <!-- Adjust this -->
</NUnit>
```

## Troubleshooting

### Common Issues

**Playwright browsers not installed:**
```bash
cd tests
pwsh bin/Debug/net10.0/playwright.ps1 install
```

**Tests not appearing in Test Explorer:**
1. Rebuild the project: `dotnet build`
2. Reload VS Code window: Ctrl+Shift+P → "Developer: Reload Window"
3. Refresh Test Explorer

**Next.js port already in use:**
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- -p 3001
```

**For more troubleshooting, see:**
- `references/troubleshooting.md` in the skill
- `references/vscode-extensions.md` for extension setup

## Best Practices

### 1. Use Data-Test Attributes

In your Next.js components:
```tsx
<button data-testid="login-button">Login</button>
```

In your tests:
```csharp
await Page.GetByTestId("login-button").ClickAsync();
```

### 2. Follow Page Object Pattern

Create page objects for each page:
```csharp
public class LoginPage : BasePage
{
    public LoginPage(IPage page) : base(page) { }

    public async Task LoginAsync(string email, string password)
    {
        await Page.GetByLabel("Email").FillAsync(email);
        await Page.GetByLabel("Password").FillAsync(password);
        await Page.GetByRole(AriaRole.Button, new() { Name = "Login" }).ClickAsync();
    }
}
```

### 3. Use Meaningful Scenario Names

```gherkin
# Good
Scenario: User can login with valid credentials and access dashboard

# Less clear
Scenario: Test login
```

### 4. Take Screenshots on Failure

The hooks automatically take screenshots on failure. Find them in:
```
tests/test-results/screenshots/
```

### 5. Use Tags for Test Organization

```gherkin
@smoke @authentication
Scenario: User can login
```

Run tagged tests:
```bash
dotnet test --filter "Category=smoke"
```

## Advanced Usage

### Running Tests in CI/CD

The `.runsettings` file is configured for CI/CD environments:

```bash
dotnet test --settings .vscode/.runsettings --logger trx
```

### Debugging Tests

1. Set breakpoints in your test code or step definitions
2. Open Test Explorer
3. Right-click a test → "Debug Test"
4. Or use the debug configurations in `.vscode/launch.json`

### Recording Test Videos

Edit `tests/Support/Hooks.cs`:
```csharp
_context = await _browser!.NewContextAsync(new()
{
    RecordVideoDir = "test-results/videos",  // Already enabled
    RecordVideoSize = new() { Width = 1920, Height = 1080 }
});
```

Videos are saved automatically for all tests.

### Viewing Traces

Traces are saved on test failure in `test-results/traces/`.

View traces:
```bash
npx playwright show-trace test-results/traces/scenario-name.zip
```

## Getting Help

If you encounter issues:

1. Check `references/troubleshooting.md` in the skill
2. Check `references/vscode-extensions.md` for extension setup
3. Review the example code in the generated project
4. Ask Claude Code for help with specific errors
5. Consult official documentation:
   - [Playwright .NET](https://playwright.dev/dotnet/)
   - [Reqnroll](https://docs.reqnroll.net/)
   - [Next.js](https://nextjs.org/docs)

## Example Workflow

Here's a typical workflow after setup:

1. **Start the Next.js app**: `cd app && npm run dev`
2. **Write a feature file**: Describe user behavior in Gherkin
3. **Implement step definitions**: Write C# code to execute steps
4. **Create page objects**: Encapsulate page interactions
5. **Run tests**: `dotnet test` or use Test Explorer
6. **Debug failures**: Use breakpoints and traces
7. **Refactor**: Improve test code and add more coverage
8. **Commit**: Version control your tests alongside your code

## Summary

This skill provides a complete, production-ready setup for:
- ✅ Full-stack development (.NET + Next.js)
- ✅ E2E testing with Playwright
- ✅ BDD testing with Reqnroll
- ✅ Professional VS Code configuration
- ✅ CI/CD ready test infrastructure

Just say what you want to build, and the skill handles the setup!
