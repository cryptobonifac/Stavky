namespace {{PROJECT_NAME}}.Tests.Support;

/// <summary>
/// Reqnroll hooks for test lifecycle management
/// </summary>
[Binding]
public class Hooks
{
    private static IPlaywright? _playwright;
    private static IBrowser? _browser;
    private IPage? _page;
    private IBrowserContext? _context;
    private readonly ScenarioContext _scenarioContext;

    public Hooks(ScenarioContext scenarioContext)
    {
        _scenarioContext = scenarioContext;
    }

    [BeforeTestRun]
    public static async Task BeforeTestRun()
    {
        // Initialize Playwright once for all tests
        _playwright = await Playwright.CreateAsync();

        // Launch browser once for all tests
        _browser = await _playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
        {
            Headless = true,
            SlowMo = 0
        });

        Console.WriteLine("Browser initialized for test run");
    }

    [BeforeScenario]
    public async Task BeforeScenario()
    {
        // Create a new browser context for each scenario (isolated cookies, cache, etc.)
        _context = await _browser!.NewContextAsync(new BrowserNewContextOptions
        {
            ViewportSize = new ViewportSize { Width = 1920, Height = 1080 },
            RecordVideoDir = "test-results/videos",
            RecordVideoSize = new RecordVideoSize { Width = 1920, Height = 1080 }
        });

        // Start tracing for debugging
        await _context.Tracing.StartAsync(new TracingStartOptions
        {
            Screenshots = true,
            Snapshots = true,
            Sources = true
        });

        // Create a new page for the scenario
        _page = await _context.NewPageAsync();

        // Store page in scenario context so step definitions can access it
        _scenarioContext.Add("page", _page);

        Console.WriteLine($"Starting scenario: {_scenarioContext.ScenarioInfo.Title}");
    }

    [AfterScenario]
    public async Task AfterScenario()
    {
        if (_context != null)
        {
            // Save trace if scenario failed
            if (_scenarioContext.TestError != null)
            {
                var tracePath = $"test-results/traces/{_scenarioContext.ScenarioInfo.Title.Replace(" ", "_")}.zip";
                await _context.Tracing.StopAsync(new TracingStopOptions { Path = tracePath });
                Console.WriteLine($"Trace saved to: {tracePath}");

                // Take screenshot on failure
                if (_page != null)
                {
                    var screenshotPath = $"test-results/screenshots/{_scenarioContext.ScenarioInfo.Title.Replace(" ", "_")}.png";
                    await _page.ScreenshotAsync(new PageScreenshotOptions { Path = screenshotPath, FullPage = true });
                    Console.WriteLine($"Screenshot saved to: {screenshotPath}");
                }
            }
            else
            {
                await _context.Tracing.StopAsync();
            }

            await _context.CloseAsync();
        }

        Console.WriteLine($"Finished scenario: {_scenarioContext.ScenarioInfo.Title}");
    }

    [AfterTestRun]
    public static async Task AfterTestRun()
    {
        // Clean up browser after all tests
        if (_browser != null)
        {
            await _browser.CloseAsync();
        }

        _playwright?.Dispose();

        Console.WriteLine("Browser closed after test run");
    }
}
