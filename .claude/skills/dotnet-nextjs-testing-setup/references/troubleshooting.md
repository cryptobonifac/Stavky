# Troubleshooting Guide

Common issues and solutions for .NET + Next.js testing projects.

## Table of Contents

- [Playwright Issues](#playwright-issues)
- [Reqnroll Issues](#reqnroll-issues)
- [Build and Compilation Issues](#build-and-compilation-issues)
- [Test Execution Issues](#test-execution-issues)
- [Next.js Issues](#nextjs-issues)
- [VS Code Issues](#vs-code-issues)
- [NuGet Package Issues](#nuget-package-issues)

## Playwright Issues

### Browsers Not Installed

**Problem:** Tests fail with "Browser executable not found" or similar error.

**Solution:**
```bash
cd tests
pwsh bin/Debug/net10.0/playwright.ps1 install
```

If PowerShell is not available:
```bash
# Windows
.\bin\Debug\net10.0\playwright.ps1 install

# macOS/Linux
pwsh bin/Debug/net10.0/playwright.ps1 install
```

**Root Cause:** Playwright requires browser binaries to be downloaded after package installation.

### Playwright Script Not Found

**Problem:** `playwright.ps1` script doesn't exist in bin directory.

**Solution:**
1. Build the project first: `dotnet build`
2. Check the correct framework path (e.g., `net10.0` vs `net8.0`)
3. Verify Microsoft.Playwright.NUnit package is installed

### Headless Mode Issues

**Problem:** Tests pass in headed mode but fail in headless mode.

**Solution:**
1. Check timing issues - add explicit waits
2. Verify viewport size is set correctly
3. Take screenshots to debug visual issues:
```csharp
await Page.ScreenshotAsync(new() { Path = "debug.png", FullPage = true });
```

### Browser Launch Timeout

**Problem:** Browser takes too long to launch, causing timeout.

**Solution:**
1. Increase launch timeout in test configuration
2. Check system resources (CPU/RAM)
3. Use specific browser executable path if needed:
```csharp
var browser = await _playwright.Chromium.LaunchAsync(new()
{
    Timeout = 60000, // 60 seconds
    Headless = true
});
```

## Reqnroll Issues

### Code-Behind Files Not Generated

**Problem:** `.feature.cs` files are not created, tests don't appear.

**Solution:**
1. Build the project: `dotnet build`
2. Check `reqnroll.json` exists and is valid
3. Verify Reqnroll.NUnit package is installed
4. Clean and rebuild: `dotnet clean && dotnet build`

### Step Definitions Not Found

**Problem:** "No matching step definition found for..." error.

**Solution:**
1. Verify step definition method signatures match feature file
2. Check `[Binding]` attribute is present on step class
3. Ensure correct regex pattern or Given/When/Then text
4. Build project to update step bindings

Example matching step definition:
```csharp
[Binding]
public class LoginSteps
{
    [Given(@"I am on the login page")]
    public void GivenIAmOnTheLoginPage()
    {
        // Implementation
    }
}
```

### ScenarioContext Not Working

**Problem:** `ScenarioContext` injection fails or values are lost.

**Solution:**
1. Ensure ScenarioContext is injected via constructor:
```csharp
private readonly ScenarioContext _scenarioContext;

public MySteps(ScenarioContext scenarioContext)
{
    _scenarioContext = scenarioContext;
}
```
2. Don't create new instances - always inject
3. Store/retrieve values correctly:
```csharp
_scenarioContext.Add("key", value);
var value = _scenarioContext.Get<MyType>("key");
```

### Hooks Not Executing

**Problem:** `[BeforeScenario]` or `[AfterScenario]` hooks don't run.

**Solution:**
1. Verify `[Binding]` attribute on hook class
2. Check method signature is correct (public, async if needed)
3. Ensure hooks are in step assembly configured in `reqnroll.json`

## Build and Compilation Issues

### Cannot Find Microsoft.Playwright Namespace

**Problem:** Build error: "The type or namespace name 'Microsoft.Playwright' could not be found"

**Solution:**
1. Verify package is installed: `dotnet list package`
2. Restore packages: `dotnet restore`
3. Check .csproj file includes:
```xml
<PackageReference Include="Microsoft.Playwright.NUnit" Version="1.xx.x" />
```
4. Add to GlobalUsings.cs: `global using Microsoft.Playwright;`

### Multiple Framework Versions

**Problem:** Project targets wrong .NET version.

**Solution:**
1. Check .csproj `<TargetFramework>` property:
```xml
<TargetFramework>net10.0</TargetFramework>
```
2. Ensure consistent versions across all projects
3. Update SDK in global.json if needed

### Assembly Binding Errors

**Problem:** "Could not load file or assembly" errors.

**Solution:**
1. Clean and rebuild: `dotnet clean && dotnet build`
2. Clear NuGet cache: `dotnet nuget locals all --clear`
3. Delete bin/obj folders manually
4. Restore packages: `dotnet restore`

## Test Execution Issues

### Tests Not Discovered

**Problem:** No tests appear in Test Explorer or `dotnet test`.

**Solution:**
1. Build project first: `dotnet build`
2. Check test methods have `[Test]` attribute (NUnit)
3. Verify test class has `[TestFixture]` attribute
4. For Reqnroll: ensure .feature files have scenarios
5. Reload VS Code or rebuild solution

### Tests Timeout

**Problem:** Tests fail with timeout errors.

**Solution:**
1. Increase test timeout in `.runsettings`:
```xml
<TestSessionTimeout>600000</TestSessionTimeout>
```
2. Or in individual tests:
```csharp
[Test, Timeout(60000)] // 60 seconds
public async Task MyTest() { }
```
3. Check if application is actually running and accessible

### Parallel Test Failures

**Problem:** Tests fail when run in parallel but pass individually.

**Solution:**
1. Ensure tests are isolated (no shared state)
2. Use separate browser contexts per test
3. Configure parallelism in `.runsettings`:
```xml
<NUnit>
  <NumberOfTestWorkers>1</NumberOfTestWorkers>
</NUnit>
```
4. Use `[NonParallelizable]` attribute when needed

### Application Not Running

**Problem:** Tests fail because Next.js app is not running.

**Solution:**
1. Start Next.js app in separate terminal:
```bash
cd app
npm run dev
```
2. Wait for "ready - started server" message
3. Verify URL matches test configuration (default: http://localhost:3000)
4. Check firewall/port availability

## Next.js Issues

### Port Already in Use

**Problem:** "Port 3000 is already in use"

**Solution:**
1. Find and kill process using port:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```
2. Or use different port: `npm run dev -- -p 3001`

### Module Not Found

**Problem:** Next.js build fails with module errors.

**Solution:**
1. Delete node_modules and reinstall:
```bash
cd app
rm -rf node_modules
npm install
```
2. Clear Next.js cache:
```bash
rm -rf .next
npm run build
```

### TypeScript Errors

**Problem:** Type checking errors in Next.js app.

**Solution:**
1. Update TypeScript: `npm install -D typescript@latest`
2. Check `tsconfig.json` configuration
3. Install missing type definitions: `npm install -D @types/node @types/react`

## VS Code Issues

### C# IntelliSense Not Working

**Problem:** No code completion or red squiggles in C# files.

**Solution:**
1. Check C# Dev Kit extension is installed
2. Reload window: Ctrl+Shift+P → "Developer: Reload Window"
3. Check .NET SDK: `dotnet --version`
4. Open solution file (.sln) in VS Code
5. Check C# output panel for errors

### Debugger Not Attaching

**Problem:** Breakpoints not hitting during debug.

**Solution:**
1. Check launch.json configuration exists
2. Build in Debug mode: `dotnet build -c Debug`
3. Disable "Just My Code" in launch.json:
```json
{
  "justMyCode": false
}
```
4. Check breakpoint is in executable code (not comment/whitespace)

### Test Explorer Empty

**Problem:** Test Explorer shows no tests.

**Solution:**
1. Install Test Explorer UI extension
2. Install .NET Core Test Explorer extension
3. Rebuild project: `dotnet build`
4. Click refresh button in Test Explorer
5. Check workspace contains .sln file

## NuGet Package Issues

### Package Restore Fails

**Problem:** Cannot restore NuGet packages.

**Solution:**
1. Check internet connection and NuGet.org access
2. Clear NuGet cache: `dotnet nuget locals all --clear`
3. Check NuGet.Config for any source issues
4. Try manual restore: `dotnet restore --force`

### Version Conflicts

**Problem:** "Package version conflicts" or "Could not resolve dependencies"

**Solution:**
1. Check for conflicting package versions
2. Update all packages to compatible versions:
```bash
dotnet list package --outdated
dotnet add package <PackageName> --version <Version>
```
3. Use `<PackageReference>` with explicit versions in .csproj

### Package Not Found

**Problem:** "Package 'X' is not found in the following sources"

**Solution:**
1. Verify package name spelling
2. Check package exists on NuGet.org
3. Add NuGet source if using private feed:
```bash
dotnet nuget add source <URL> --name <Name>
```

## Getting Additional Help

If issues persist:

1. Check [Playwright .NET Documentation](https://playwright.dev/dotnet/)
2. Check [Reqnroll Documentation](https://docs.reqnroll.net/)
3. Check [.NET Documentation](https://docs.microsoft.com/dotnet/)
4. Search GitHub issues for known problems
5. Enable detailed logging to diagnose issues

### Enable Detailed Logging

For Playwright:
```csharp
Environment.SetEnvironmentVariable("DEBUG", "pw:api");
```

For .NET tests:
```bash
dotnet test --logger "console;verbosity=detailed"
```

For Reqnroll:
```json
{
  "trace": {
    "traceSuccessfulSteps": true,
    "traceTimings": true
  }
}
```
