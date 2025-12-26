namespace {{PROJECT_NAME}}.Tests;

/// <summary>
/// Example NUnit + Playwright tests
/// These tests run independently from Reqnroll scenarios
/// </summary>
[TestFixture]
[Parallelizable(ParallelScope.Self)]
public class ExampleTests : PageTest
{
    private string _baseUrl = "http://localhost:3000";

    [SetUp]
    public async Task Setup()
    {
        // This runs before each test
        // PageTest base class provides the Page property
        await Page.GotoAsync(_baseUrl);
    }

    [Test]
    [Category("Smoke")]
    public async Task Should_Load_Home_Page()
    {
        // Arrange & Act
        await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);

        // Assert
        var url = Page.Url;
        url.Should().Contain(_baseUrl);

        var body = Page.Locator("body");
        (await body.IsVisibleAsync()).Should().BeTrue();
    }

    [Test]
    [Category("Smoke")]
    public async Task Should_Have_Valid_Page_Title()
    {
        // Act
        var title = await Page.TitleAsync();

        // Assert
        title.Should().NotBeNullOrEmpty();
    }

    [Test]
    [Category("Navigation")]
    public async Task Should_Navigate_And_Display_Content()
    {
        // Arrange
        await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);

        // Act
        var content = Page.Locator("body");
        await content.WaitForAsync(new LocatorWaitForOptions { State = WaitForSelectorState.Visible });

        // Assert
        (await content.IsVisibleAsync()).Should().BeTrue();
        var textContent = await content.TextContentAsync();
        textContent.Should().NotBeNullOrEmpty();
    }

    [Test]
    [Category("E2E")]
    public async Task Should_Handle_Page_Interactions()
    {
        // Example of using Playwright's powerful selectors
        await Page.WaitForLoadStateAsync(LoadState.DOMContentLoaded);

        // Example: Click a button (update selector to match your app)
        // var button = Page.GetByRole(AriaRole.Button, new() { Name = "Click me" });
        // if (await button.IsVisibleAsync())
        // {
        //     await button.ClickAsync();
        // }

        // Example: Fill a form (update selectors to match your app)
        // var input = Page.GetByLabel("Email");
        // await input.FillAsync("test@example.com");

        // Example: Assert on elements using data-testid
        // var element = Page.GetByTestId("welcome-message");
        // (await element.IsVisibleAsync()).Should().BeTrue();

        // For now, just verify page is interactive
        var body = Page.Locator("body");
        (await body.IsVisibleAsync()).Should().BeTrue();
    }

    [TearDown]
    public async Task TearDown()
    {
        // Screenshot on failure
        if (TestContext.CurrentContext.Result.Outcome.Status == NUnit.Framework.Interfaces.TestStatus.Failed)
        {
            var screenshotPath = $"test-results/screenshots/{TestContext.CurrentContext.Test.Name}.png";
            await Page.ScreenshotAsync(new PageScreenshotOptions { Path = screenshotPath, FullPage = true });
            Console.WriteLine($"Screenshot saved: {screenshotPath}");
        }
    }
}
