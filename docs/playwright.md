# .NET Playwright Testing Guide

This guide explains how to set up, write, and run Playwright tests using .NET (C#) for the Stavky application.

## Overview

The project uses **Microsoft.Playwright.NUnit** for end-to-end testing. Tests are written in C# and use the NUnit testing framework.

**Project Location:** `Stavky.Tests/`

## Prerequisites

- **.NET SDK** (version 10.0 or later)
- **Visual Studio** or **Visual Studio Code** with C# extension (recommended)
- **PowerShell** (for running installation scripts on Windows)

## Installation

### Step 1: Verify Project Setup

The test project is located at `Stavky.Tests/Stavky.Tests.csproj`. It already includes:

- `Microsoft.Playwright.NUnit` (version 1.57.0)
- `NUnit` (version 4.3.2)
- `Microsoft.NET.Test.Sdk`

### Step 2: Install Playwright Browsers

After building the project, install Playwright browsers:

**Windows (PowerShell):**
```powershell
cd Stavky.Tests
dotnet build
powershell -ExecutionPolicy Bypass -File bin\Debug\net10.0\playwright.ps1 install
```

**Windows (Command Prompt):**
```cmd
cd Stavky.Tests
dotnet build
powershell -ExecutionPolicy Bypass -File bin\Debug\net10.0\playwright.ps1 install
```

**Linux/macOS:**
```bash
cd Stavky.Tests
dotnet build
bash bin/Debug/net10.0/playwright.sh install
```

This installs Chromium, Firefox, and WebKit browsers needed for testing.

### Step 3: Verify Installation

Run the installation verification test:

```cmd
cd Stavky.Tests
dotnet test --filter "FullyQualifiedName~PlaywrightInstallationTest"
```

If all tests pass, Playwright is correctly installed! ✅

## Project Structure

```
Stavky.Tests/
├── Stavky.Tests.csproj          # Project file with dependencies
├── PlaywrightInstallationTest.cs # Installation verification test
├── UnitTest1.cs                  # Example test file
└── bin/Debug/net10.0/
    └── playwright.ps1            # Browser installation script
```

## Running Tests

### Run All Tests

```cmd
cd Stavky.Tests
dotnet test
```

### Run Specific Test Class

```cmd
dotnet test --filter "FullyQualifiedName~PlaywrightInstallationTest"
```

### Run Specific Test Method

```cmd
dotnet test --filter "FullyQualifiedName~PlaywrightInstallationTest.PlaywrightInstallation_ShouldWork"
```

### Run Tests with Verbose Output

```cmd
dotnet test --verbosity normal
```

### Run Tests in Parallel (Default)

Tests run in parallel by default. To run sequentially:

```cmd
dotnet test -- -- NUnit.NumberOfTestWorkers=1
```

### Run Tests with Code Coverage

```cmd
dotnet test --collect:"XPlat Code Coverage"
```

## Writing Tests

### Basic Test Structure

All Playwright tests should inherit from `PageTest` base class:

```csharp
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;

namespace Stavky.Tests;

[TestFixture]
public class MyTest : PageTest
{
    [Test]
    public async Task MyTest_ShouldWork()
    {
        // Page, Browser, and BrowserContext are available automatically
        await Page.GotoAsync("https://example.com");
        
        // Your test logic here
        var title = await Page.TitleAsync();
        Assert.That(title, Is.Not.Empty);
    }
}
```

### Available Properties

The `PageTest` base class provides:

- **`Page`** - Current page instance
- **`Browser`** - Browser instance
- **`BrowserContext`** - Browser context
- **`BrowserName`** - Name of the browser (chromium, firefox, webkit)

### Common Operations

#### Navigation

```csharp
// Navigate to URL
await Page.GotoAsync("http://localhost:3000");

// Navigate with options
await Page.GotoAsync("http://localhost:3000", new PageGotoOptions
{
    WaitUntil = WaitUntilState.NetworkIdle,
    Timeout = 30000
});
```

#### Finding Elements

```csharp
// By CSS selector
var button = Page.Locator("button.submit");

// By text
var heading = Page.Locator("text=Welcome");

// By test ID (recommended)
var form = Page.GetByTestId("login-form");

// By role
var submitButton = Page.GetByRole(AriaRole.Button, new() { Name = "Submit" });
```

#### Interacting with Elements

```csharp
// Click
await button.ClickAsync();

// Fill input
await Page.Locator("input[name='email']").FillAsync("test@example.com");

// Select option
await Page.Locator("select").SelectOptionAsync("option-value");

// Check checkbox
await Page.Locator("input[type='checkbox']").CheckAsync();
```

#### Assertions

```csharp
// Using NUnit assertions
Assert.That(Page.Url, Does.Contain("example.com"));
Assert.That(title, Is.EqualTo("Expected Title"));

// Using Playwright expectations (recommended)
await Expect(Page.Locator("h1")).ToBeVisibleAsync();
await Expect(Page).ToHaveTitleAsync("Expected Title");
await Expect(Page).ToHaveURLAsync("https://example.com");
```

#### Waiting

```csharp
// Wait for element
await Page.Locator("button").WaitForAsync();

// Wait for navigation
await Page.WaitForURLAsync("**/success");

// Wait for network
await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
```

## Example Test

Here's a complete example test:

```csharp
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;

namespace Stavky.Tests;

[TestFixture]
public class HomePageTest : PageTest
{
    [Test]
    public async Task HomePage_ShouldLoad()
    {
        // Navigate to homepage
        await Page.GotoAsync("http://localhost:3000");
        
        // Verify page loaded
        await Expect(Page).ToHaveTitleAsync(new Regex(".*Stavky.*"));
        
        // Verify main content is visible
        var heading = Page.Locator("h1, h2").First();
        await Expect(heading).ToBeVisibleAsync();
        
        // Verify navigation links
        var loginLink = Page.GetByRole(AriaRole.Link, new() { Name = "Login" });
        await Expect(loginLink).ToBeVisibleAsync();
    }
    
    [Test]
    public async Task HomePage_CanNavigateToLogin()
    {
        await Page.GotoAsync("http://localhost:3000");
        
        // Click login link
        await Page.GetByRole(AriaRole.Link, new() { Name = "Login" }).ClickAsync();
        
        // Verify navigation
        await Expect(Page).ToHaveURLAsync(new Regex(".*/login.*"));
        
        // Verify login form is visible
        var loginForm = Page.GetByTestId("login-form");
        await Expect(loginForm).ToBeVisibleAsync();
    }
}
```

## Test Configuration

### Browser Selection

By default, tests run in Chromium. To specify a different browser, use the `Browser` attribute:

```csharp
[Test]
[Browser(BrowserType.Chromium)]
public async Task TestInChromium() { }

[Test]
[Browser(BrowserType.Firefox)]
public async Task TestInFirefox() { }

[Test]
[Browser(BrowserType.Webkit)]
public async Task TestInWebkit() { }
```

### Screenshots and Videos

Screenshots and videos are automatically captured on test failure. To capture manually:

```csharp
await Page.ScreenshotAsync(new PageScreenshotOptions
{
    Path = "screenshot.png",
    FullPage = true
});
```

### Test Isolation

Each test runs in its own browser context by default, ensuring test isolation. To share context:

```csharp
[TestFixture]
public class SharedContextTest : PageTest
{
    // All tests in this class share the same browser context
}
```

## Best Practices

### 1. Use Test IDs

Prefer test IDs over CSS selectors for better reliability:

```csharp
// Good
var button = Page.GetByTestId("submit-button");

// Avoid
var button = Page.Locator("button.btn-primary");
```

### 2. Use Explicit Waits

Always wait for elements before interacting:

```csharp
// Good
await Expect(button).ToBeVisibleAsync();
await button.ClickAsync();

// Avoid
await button.ClickAsync(); // May fail if element not ready
```

### 3. Use Page Object Model (Optional)

For complex tests, consider using Page Object Model:

```csharp
public class LoginPage
{
    private readonly IPage _page;
    
    public LoginPage(IPage page) => _page = page;
    
    public ILocator EmailInput => _page.Locator("input[name='email']");
    public ILocator PasswordInput => _page.Locator("input[name='password']");
    public ILocator SubmitButton => _page.GetByTestId("submit-button");
    
    public async Task LoginAsync(string email, string password)
    {
        await EmailInput.FillAsync(email);
        await PasswordInput.FillAsync(password);
        await SubmitButton.ClickAsync();
    }
}

// Usage in test
[Test]
public async Task CanLogin()
{
    var loginPage = new LoginPage(Page);
    await loginPage.LoginAsync("test@example.com", "password");
}
```

### 4. Clean Up After Tests

The `PageTest` base class automatically cleans up, but you can add custom cleanup:

```csharp
[TearDown]
public async Task Cleanup()
{
    // Custom cleanup if needed
    await Page.CloseAsync();
}
```

## Troubleshooting

### Issue: "Playwright browsers not found"

**Solution:**
```cmd
cd Stavky.Tests
powershell -ExecutionPolicy Bypass -File bin\Debug\net10.0\playwright.ps1 install
```

### Issue: "Test timeout"

**Solution:** Increase timeout in test:
```csharp
[Test]
[Timeout(60000)] // 60 seconds
public async Task LongRunningTest() { }
```

### Issue: "Element not found"

**Solution:** Add explicit wait:
```csharp
await Expect(element).ToBeVisibleAsync();
await element.ClickAsync();
```

### Issue: "Localhost connection refused"

**Solution:** Ensure your development server is running:
```cmd
npm run dev
```

### Issue: Tests run too slowly

**Solutions:**
- Run tests in parallel (default)
- Use headless mode (default)
- Reduce wait timeouts where appropriate
- Use `WaitForLoadStateAsync(LoadState.DOMContentLoaded)` instead of `NetworkIdle` when possible

## CI/CD Integration

### GitHub Actions Example

```yaml
name: .NET Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '10.0.x'
      
      - name: Restore dependencies
        run: dotnet restore
      
      - name: Build
        run: dotnet build --no-restore
      
      - name: Install Playwright browsers
        run: |
          cd Stavky.Tests
          dotnet build
          pwsh bin/Debug/net10.0/playwright.ps1 install --with-deps
      
      - name: Run tests
        run: dotnet test --no-build --verbosity normal
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: Stavky.Tests/TestResults/
```

## Resources

- [Microsoft Playwright .NET Documentation](https://playwright.dev/dotnet/)
- [NUnit Documentation](https://docs.nunit.org/)
- [Playwright Best Practices](https://playwright.dev/dotnet/docs/best-practices)

## Quick Reference

```cmd
# Build project
cd Stavky.Tests
dotnet build

# Install browsers
powershell -ExecutionPolicy Bypass -File bin\Debug\net10.0\playwright.ps1 install

# Run all tests
dotnet test

# Run specific test
dotnet test --filter "FullyQualifiedName~TestName"

# Run with verbose output
dotnet test --verbosity normal

# Run with code coverage
dotnet test --collect:"XPlat Code Coverage"
```



