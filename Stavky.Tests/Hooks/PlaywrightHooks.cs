using Microsoft.Playwright;
using Reqnroll;

namespace Stavky.Tests.Steps;

[Binding]
public class PlaywrightHooks
{
    [BeforeScenario]
    public async Task InitializePlaywright()
    {
        var playwright = await Playwright.CreateAsync();
        var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
        {
            Headless = true // Run in headless mode for CI/CD
        });
        var page = await browser.NewPageAsync();

        ScenarioContext.Current["Playwright"] = playwright;
        ScenarioContext.Current["Browser"] = browser;
        ScenarioContext.Current["Page"] = page;
    }

    [AfterScenario]
    public async Task DisposePlaywright()
    {
        var page = ScenarioContext.Current["Page"] as IPage;
        await page?.CloseAsync();

        var browser = ScenarioContext.Current["Browser"] as IBrowser;
        await browser?.CloseAsync();

        var playwright = ScenarioContext.Current["Playwright"] as IPlaywright;
        playwright?.Dispose();
    }
}