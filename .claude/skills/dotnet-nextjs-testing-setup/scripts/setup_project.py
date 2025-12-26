#!/usr/bin/env python3
"""
.NET + Next.js Testing Setup Script

Creates a complete .NET 10 project with Next.js frontend and C# testing infrastructure
using Playwright, Reqnroll, and NUnit.

Usage:
    python setup_project.py <project-name> [--path <output-directory>]

Example:
    python setup_project.py MyProject
    python setup_project.py MyProject --path ./projects
"""

import sys
import subprocess
import shutil
from pathlib import Path


def run_command(command, cwd=None, shell=True):
    """Run a shell command and return success status."""
    try:
        print(f"  → {command}")
        result = subprocess.run(
            command,
            shell=shell,
            cwd=cwd,
            capture_output=True,
            text=True
        )
        if result.returncode != 0:
            print(f"    ❌ Error: {result.stderr}")
            return False
        if result.stdout:
            print(f"    {result.stdout.strip()}")
        return True
    except Exception as e:
        print(f"    ❌ Exception: {e}")
        return False


def check_prerequisites():
    """Check if required tools are installed."""
    print("🔍 Checking prerequisites...")

    required_tools = [
        ("dotnet", "dotnet --version", ".NET SDK"),
        ("node", "node --version", "Node.js"),
        ("npm", "npm --version", "npm"),
        ("pwsh", "pwsh -Version", "PowerShell")
    ]

    all_present = True
    for cmd, check_cmd, name in required_tools:
        if shutil.which(cmd):
            print(f"  ✅ {name} found")
        else:
            print(f"  ❌ {name} not found - please install it first")
            all_present = False

    return all_present


def create_solution(project_name, project_dir):
    """Create the .NET solution file."""
    print("\n📦 Creating solution file...")
    sln_path = project_dir / f"{project_name}.sln"
    return run_command(f"dotnet new sln -n {project_name}", cwd=project_dir)


def setup_nextjs_app(project_dir):
    """Set up Next.js application."""
    print("\n⚛️  Setting up Next.js application...")
    app_dir = project_dir / "app"

    # Create Next.js app with default settings
    print("  Creating Next.js app (this may take a minute)...")
    success = run_command(
        f"npx create-next-app@latest app --typescript --tailwind --app --no-src-dir --import-alias '@/*'",
        cwd=project_dir
    )

    if success:
        print("  ✅ Next.js app created successfully")

    return success


def create_test_project(project_name, project_dir, assets_dir):
    """Create and configure the .NET test project."""
    print("\n🧪 Creating test project...")

    tests_dir = project_dir / "tests"
    tests_dir.mkdir(exist_ok=True)

    # Create NUnit test project
    test_project_name = f"{project_name}.Tests"
    if not run_command(f"dotnet new nunit -n {test_project_name} -o tests", cwd=project_dir):
        return False

    # Add test project to solution
    if not run_command(f"dotnet sln add tests/{test_project_name}.csproj", cwd=project_dir):
        return False

    print("\n📦 Installing NuGet packages...")
    packages = [
        "Microsoft.Playwright.NUnit",
        "Reqnroll.NUnit",
        "Reqnroll",
        "FluentAssertions",
        "Microsoft.Extensions.Configuration",
        "Microsoft.Extensions.Configuration.Json"
    ]

    for package in packages:
        if not run_command(f"dotnet add package {package}", cwd=tests_dir):
            print(f"  ⚠️  Warning: Failed to add {package}")

    # Build the project to generate Playwright installation script
    print("\n🔨 Building test project...")
    if not run_command("dotnet build", cwd=tests_dir):
        return False

    # Install Playwright browsers
    print("\n🌐 Installing Playwright browsers...")
    # Find the playwright.ps1 script in bin directory
    bin_dirs = list(tests_dir.glob("bin/**/playwright.ps1"))
    if bin_dirs:
        playwright_script = bin_dirs[0]
        run_command(f"pwsh {playwright_script} install", cwd=tests_dir)
    else:
        print("  ⚠️  Warning: Playwright installation script not found. Run manually later.")

    # Copy template files from assets
    print("\n📄 Creating project files from templates...")
    copy_template_files(tests_dir, assets_dir, project_name)

    return True


def copy_template_files(tests_dir, assets_dir, project_name):
    """Copy and customize template files."""
    templates_dir = assets_dir / "templates"

    # Create necessary directories
    (tests_dir / "Features").mkdir(exist_ok=True)
    (tests_dir / "StepDefinitions").mkdir(exist_ok=True)
    (tests_dir / "PageObjects").mkdir(exist_ok=True)
    (tests_dir / "Support").mkdir(exist_ok=True)
    (tests_dir / "Tests").mkdir(exist_ok=True)

    # Copy template files
    template_mappings = {
        "GlobalUsings.cs": "GlobalUsings.cs",
        "appsettings.json": "appsettings.json",
        "reqnroll.json": "reqnroll.json",
        "Features/Sample.feature": "Features/Sample.feature",
        "StepDefinitions/SampleSteps.cs": "StepDefinitions/SampleSteps.cs",
        "PageObjects/BasePage.cs": "PageObjects/BasePage.cs",
        "Support/Hooks.cs": "Support/Hooks.cs",
        "Tests/ExampleTest.cs": "Tests/ExampleTest.cs"
    }

    for template_file, target_file in template_mappings.items():
        src = templates_dir / template_file
        dst = tests_dir / target_file
        if src.exists():
            content = src.read_text()
            # Replace placeholder with actual project name
            content = content.replace("{{PROJECT_NAME}}", project_name)
            dst.write_text(content)
            print(f"  ✅ Created {target_file}")
        else:
            print(f"  ⚠️  Template not found: {template_file}")


def setup_vscode_config(project_dir, assets_dir):
    """Set up VS Code configuration."""
    print("\n⚙️  Setting up VS Code configuration...")

    vscode_dir = project_dir / ".vscode"
    vscode_dir.mkdir(exist_ok=True)

    templates_dir = assets_dir / "templates" / "vscode"

    config_files = ["launch.json", "settings.json", ".runsettings"]
    for config_file in config_files:
        src = templates_dir / config_file
        dst = vscode_dir / config_file
        if src.exists():
            shutil.copy2(src, dst)
            print(f"  ✅ Created .vscode/{config_file}")
        else:
            print(f"  ⚠️  Template not found: {config_file}")


def create_readme(project_name, project_dir):
    """Create a README file."""
    print("\n📝 Creating README...")

    readme_content = f"""# {project_name}

.NET 10 project with Next.js frontend and C# testing infrastructure.

## Project Structure

- `app/` - Next.js application
- `tests/` - .NET test project with Playwright and Reqnroll

## Getting Started

### Prerequisites

- .NET 10 SDK
- Node.js 18+ and npm
- PowerShell (for Playwright browser installation)

### Running the Next.js App

```bash
cd app
npm run dev
```

Visit http://localhost:3000

### Running Tests

```bash
cd tests
dotnet test
```

### VS Code Setup

Install the following extensions:
- C# Dev Kit
- .NET Install Tool
- Reqnroll
- Test Explorer UI

See `.vscode/` for launch and debug configurations.

## Testing

### BDD with Reqnroll

Feature files are in `tests/Features/`. Step definitions are in `tests/StepDefinitions/`.

### E2E with Playwright

Write tests in `tests/Tests/` using NUnit and Playwright.

### Running Specific Tests

```bash
# Run by category
dotnet test --filter "TestCategory=Smoke"

# Run by name
dotnet test --filter "FullyQualifiedName~Login"
```

## Troubleshooting

### Playwright browsers not installed

```bash
cd tests
pwsh bin/Debug/net10.0/playwright.ps1 install
```

### Reqnroll code-behind not generated

```bash
cd tests
dotnet build
```

## Documentation

Generated by claude-code dotnet-nextjs-testing-setup skill.
"""

    readme_path = project_dir / "README.md"
    readme_path.write_text(readme_content)
    print("  ✅ README.md created")


def main():
    """Main setup routine."""
    if len(sys.argv) < 2:
        print("Usage: python setup_project.py <project-name> [--path <output-directory>]")
        sys.exit(1)

    project_name = sys.argv[1]
    output_path = Path(".")

    # Parse optional --path argument
    if len(sys.argv) >= 4 and sys.argv[2] == "--path":
        output_path = Path(sys.argv[3])

    project_dir = output_path.resolve() / project_name

    # Get the assets directory (relative to this script)
    script_dir = Path(__file__).parent
    skill_dir = script_dir.parent
    assets_dir = skill_dir / "assets"

    print(f"""
╔═══════════════════════════════════════════════════════════════╗
║  .NET + Next.js Testing Setup                                 ║
║  Creating: {project_name:<48}║
╚═══════════════════════════════════════════════════════════════╝
""")

    # Check prerequisites
    if not check_prerequisites():
        print("\n❌ Missing prerequisites. Please install required tools and try again.")
        sys.exit(1)

    # Check if directory exists
    if project_dir.exists():
        print(f"\n❌ Error: Directory '{project_dir}' already exists")
        sys.exit(1)

    # Create project directory
    print(f"\n📁 Creating project directory: {project_dir}")
    project_dir.mkdir(parents=True)

    try:
        # Create solution
        if not create_solution(project_name, project_dir):
            raise Exception("Failed to create solution")

        # Set up Next.js app
        if not setup_nextjs_app(project_dir):
            raise Exception("Failed to set up Next.js app")

        # Create test project
        if not create_test_project(project_name, project_dir, assets_dir):
            raise Exception("Failed to create test project")

        # Set up VS Code configuration
        setup_vscode_config(project_dir, assets_dir)

        # Create README
        create_readme(project_name, project_dir)

        print(f"""
╔═══════════════════════════════════════════════════════════════╗
║  ✅ Setup Complete!                                           ║
╚═══════════════════════════════════════════════════════════════╝

Project created at: {project_dir}

Next steps:
  1. cd {project_name}
  2. Open in VS Code
  3. Install recommended extensions when prompted
  4. Run the Next.js app: cd app && npm run dev
  5. Run tests: cd tests && dotnet test

Happy testing! 🚀
""")

    except Exception as e:
        print(f"\n❌ Setup failed: {e}")
        print(f"You may need to clean up the directory: {project_dir}")
        sys.exit(1)


if __name__ == "__main__":
    main()
