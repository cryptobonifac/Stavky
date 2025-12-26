# Required VS Code Extensions

This document lists all VS Code extensions required for working with .NET + Next.js testing projects.

## Essential Extensions

### C# Development

**C# Dev Kit** (`ms-dotnettools.csdevkit`)
- Official Microsoft C# extension
- Provides IntelliSense, debugging, and test discovery
- Includes C# language server and project management
- **Required** for .NET development in VS Code

**C#** (`ms-dotnettools.csharp`)
- Lightweight C# editing support
- Automatically installed with C# Dev Kit
- Provides syntax highlighting and basic IntelliSense

**.NET Install Tool** (`ms-dotnettools.vscode-dotnet-runtime`)
- Manages .NET SDK installations
- Ensures correct .NET version is available
- **Required** for running .NET commands

### Testing Extensions

**Reqnroll** (`Reqnroll.Reqnroll-VSCode`)
- Official Reqnroll (SpecFlow successor) extension
- Syntax highlighting for .feature files
- Step definition navigation
- Gherkin autocomplete
- **Required** for BDD development

**Test Explorer UI** (`hbenl.vscode-test-explorer`)
- Unified test explorer interface
- Shows all NUnit and Reqnroll tests
- Run/debug individual tests or suites
- **Recommended** for better test management

**.NET Core Test Explorer** (`formulahendry.dotnet-test-explorer`)
- Discovers and runs .NET tests
- Integrates with Test Explorer UI
- **Recommended** for enhanced test visibility

### Next.js / TypeScript Development

**ESLint** (`dbaeumer.vscode-eslint`)
- JavaScript/TypeScript linting
- **Required** for Next.js development

**Prettier - Code formatter** (`esbenp.prettier-vscode`)
- Code formatting for JS/TS/JSON
- **Recommended** for consistent code style

**TypeScript Vue Plugin (Volar)** (`Vue.vscode-typescript-vue-plugin`)
- Enhanced TypeScript support
- **Optional** but helpful for Next.js projects

## Additional Recommended Extensions

### General Productivity

**GitLens** (`eamodio.gitlens`)
- Enhanced Git integration
- Useful for tracking changes in tests and code

**Path Intellisense** (`christian-kohler.path-intellisense`)
- Autocompletes file paths
- Helpful for imports and file references

**Auto Rename Tag** (`formulahendry.auto-rename-tag`)
- Automatically renames paired HTML/JSX tags
- Useful for Next.js component editing

**IntelliCode** (`VisualStudioExptTeam.vscodeintellicode`)
- AI-assisted IntelliSense
- Improves code completion quality

### Testing & Debugging

**Playwright Test for VSCode** (`ms-playwright.playwright`)
- Official Playwright extension
- **Note:** This is for the Node.js version of Playwright, not .NET
- **Optional** - mainly useful if you also write JavaScript/TypeScript tests

**Rest Client** (`humao.rest-client`)
- Test HTTP requests directly in VS Code
- Useful for API testing scenarios

**Thunder Client** (`rangav.vscode-thunder-client`)
- Alternative REST API client
- Lightweight and easy to use

## Installation

### Install All Essential Extensions at Once

Open the command palette (Ctrl+Shift+P / Cmd+Shift+P) and run:

```
Extensions: Show Recommended Extensions
```

Or install individually:

```bash
# Essential extensions
code --install-extension ms-dotnettools.csdevkit
code --install-extension ms-dotnettools.vscode-dotnet-runtime
code --install-extension Reqnroll.Reqnroll-VSCode
code --install-extension hbenl.vscode-test-explorer
code --install-extension formulahendry.dotnet-test-explorer

# Next.js development
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode

# Recommended
code --install-extension eamodio.gitlens
code --install-extension VisualStudioExptTeam.vscodeintellicode
```

### Create .vscode/extensions.json

To recommend extensions to team members, create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "ms-dotnettools.csdevkit",
    "ms-dotnettools.vscode-dotnet-runtime",
    "Reqnroll.Reqnroll-VSCode",
    "hbenl.vscode-test-explorer",
    "formulahendry.dotnet-test-explorer",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "eamodio.gitlens",
    "VisualStudioExptTeam.vscodeintellicode"
  ]
}
```

## Extension Configuration

Some extensions may require additional configuration. Check `.vscode/settings.json` for project-specific settings.

### Reqnroll Configuration

The Reqnroll extension works best when configured in workspace settings:

```json
{
  "reqnroll.features.enabled": true,
  "reqnroll.features.defaultLanguage": "en",
  "cucumberautocomplete.steps": ["tests/StepDefinitions/**/*.cs"],
  "cucumberautocomplete.syncfeatures": "tests/Features/**/*.feature"
}
```

### Test Explorer Configuration

```json
{
  "dotnet-test-explorer.testProjectPath": "tests",
  "dotnet.defaultSolution": "*.sln"
}
```

## Troubleshooting Extensions

### C# Dev Kit Not Working

1. Ensure .NET SDK is installed: `dotnet --version`
2. Reload VS Code window: Ctrl+Shift+P → "Developer: Reload Window"
3. Check C# output: View → Output → Select "C#" from dropdown

### Test Explorer Not Showing Tests

1. Build the project: `cd tests && dotnet build`
2. Reload Test Explorer: Click refresh icon in Test Explorer
3. Check test project is referenced in solution
4. Verify NUnit/Reqnroll packages are installed

### Reqnroll Extension Not Recognizing Features

1. Check `.feature` files are in correct encoding (UTF-8)
2. Verify `reqnroll.json` exists in test project
3. Build project to generate code-behind files
4. Reload VS Code window

## Additional Resources

- [C# Dev Kit Documentation](https://code.visualstudio.com/docs/csharp/get-started)
- [Reqnroll Documentation](https://docs.reqnroll.net/)
- [VS Code Testing Documentation](https://code.visualstudio.com/docs/editor/testing)
