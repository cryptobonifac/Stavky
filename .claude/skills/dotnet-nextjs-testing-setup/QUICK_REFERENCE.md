# Quick Reference Card

## Trigger the Skill

```
Create a new .NET project with Next.js and testing called "MyProject"
```

## Essential Commands

### Setup
```bash
# Skill runs automatically via Claude Code
# Creates project structure, installs dependencies, configures VS Code
```

### Start Next.js App
```bash
cd app
npm run dev              # Visit http://localhost:3000
```

### Run Tests
```bash
cd tests
dotnet test                           # Run all tests
dotnet test --filter "Category=Smoke" # Run by category
dotnet test --filter "FullyQualifiedName~Login" # Run by name
```

### Build
```bash
cd tests
dotnet build             # Build test project
dotnet clean             # Clean build artifacts
```

### Install Playwright Browsers
```bash
cd tests
pwsh bin/Debug/net10.0/playwright.ps1 install
```

## Project Structure

```
MyProject/
├── MyProject.sln        # Solution file
├── app/                 # Next.js app (npm run dev)
├── tests/               # .NET tests (dotnet test)
│   ├── Features/        # .feature files (BDD scenarios)
│   ├── StepDefinitions/ # Step implementations
│   ├── PageObjects/     # Page object classes
│   ├── Tests/           # NUnit tests
│   └── Support/         # Hooks and utilities
└── .vscode/             # Debug configs
```

## VS Code

### Required Extensions
- C# Dev Kit
- .NET Install Tool
- Reqnroll
- Test Explorer UI
- ESLint
- Prettier

### Run/Debug Tests
1. Open Test Explorer (flask icon)
2. Click play button to run
3. Use breakpoints for debugging

## Common Test Patterns

### BDD Feature File
```gherkin
Feature: User Login
Scenario: Successful login
  Given I am on the login page
  When I enter valid credentials
  Then I should see the dashboard
```

### Step Definition
```csharp
[Given(@"I am on the login page")]
public async Task GivenIAmOnTheLoginPage()
{
    await _page.GotoAsync($"{_baseUrl}/login");
}
```

### NUnit + Playwright Test
```csharp
[Test]
[Category("Smoke")]
public async Task Should_Load_Home_Page()
{
    await Page.GotoAsync("http://localhost:3000");
    await Expect(Page).ToHaveTitleAsync("Home");
}
```

### Page Object
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

## Configuration Files

| File | Purpose |
|------|---------|
| `appsettings.json` | Test settings (base URL, browser type, timeouts) |
| `reqnroll.json` | Reqnroll configuration |
| `.vscode/launch.json` | Debug configurations |
| `.vscode/settings.json` | Workspace settings |
| `.vscode/.runsettings` | Test execution settings |

## Playwright Selectors

```csharp
// Recommended: Use data-testid
Page.GetByTestId("login-button")

// By role (accessible)
Page.GetByRole(AriaRole.Button, new() { Name = "Login" })

// By label (forms)
Page.GetByLabel("Email")

// By text
Page.GetByText("Welcome")

// CSS selector (last resort)
Page.Locator("button.primary")
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Browsers not installed | `pwsh tests/bin/Debug/net10.0/playwright.ps1 install` |
| Tests not showing | `dotnet build` then reload VS Code |
| Port 3000 in use | `npm run dev -- -p 3001` |
| Reqnroll not working | `dotnet build` to generate code-behind |

## Test Results

- **Screenshots**: `tests/test-results/screenshots/`
- **Videos**: `tests/test-results/videos/`
- **Traces**: `tests/test-results/traces/`
- **Logs**: `tests/TestResults/`

## View Trace
```bash
npx playwright show-trace tests/test-results/traces/scenario-name.zip
```

## Environment Variables

Edit `.vscode/.runsettings` or `appsettings.json`:

```xml
<HEADLESS>true</HEADLESS>
<BROWSER>chromium</BROWSER>
<BASE_URL>http://localhost:3000</BASE_URL>
```

## Running in CI/CD

```bash
dotnet test --settings .vscode/.runsettings --logger trx
```

## Test Categories

```csharp
[Test]
[Category("Smoke")]      // Quick sanity tests
[Category("E2E")]        // Full end-to-end flows
[Category("Integration")] // Integration tests
[Category("Regression")]  // Regression suite
```

Run by category:
```bash
dotnet test --filter "TestCategory=Smoke"
```

## Best Practices

1. ✅ Use `data-testid` attributes in React components
2. ✅ Follow Page Object pattern
3. ✅ Write meaningful scenario names
4. ✅ Use async/await consistently
5. ✅ Take screenshots on failure (automatic)
6. ✅ Use FluentAssertions for readable assertions
7. ✅ Tag tests by category

## Getting Help

- **Full Guide**: [USAGE.md](USAGE.md)
- **Troubleshooting**: [references/troubleshooting.md](references/troubleshooting.md)
- **VS Code Setup**: [references/vscode-extensions.md](references/vscode-extensions.md)
- **Skill Reference**: [SKILL.md](SKILL.md)

## Official Docs

- [Playwright .NET](https://playwright.dev/dotnet/)
- [Reqnroll](https://docs.reqnroll.net/)
- [Next.js](https://nextjs.org/docs)
- [NUnit](https://docs.nunit.org/)
