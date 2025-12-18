using Microsoft.Playwright;
using static Microsoft.Playwright.Assertions;
using Reqnroll;

namespace Stavky.Tests.Steps;

[Binding]
public class PlaywrightInstallationTestSteps
{
    private IPage Page => (IPage)ScenarioContext.Current["Page"];

    private string? _pageTitle;
    private string? _bodyText;
    private ILocator? _heading;
    private ILocator? _body;


public PlaywrightInstallationTestSteps()
{

}
    [Given(@"Playwright browsers are installed")]
    public void GivenPlaywrightBrowsersAreInstalled()
    {
        // Playwright browsers are already installed if we can use PageTest
        // This step serves as documentation that browsers should be installed
        Console.WriteLine($"✅ Playwright browser initialized");
    }

    [When(@"I navigate to ""(.*)""")]
    public async Task WhenINavigateTo(string url)
    {
        await Page.GotoAsync(url);
        Console.WriteLine($"   - Navigated to: {url}");
    }

    [Then(@"the page URL should contain ""(.*)""")]
    public void ThenThePageUrlShouldContain(string expectedUrl)
    {
        Assert.That(Page.Url, Does.Contain(expectedUrl), 
            $"Expected page URL to contain '{expectedUrl}', but got '{Page.Url}'");
        Console.WriteLine($"   - Page URL: {Page.Url}");
    }

    [Then(@"the page title should not be empty")]
    public async Task ThenThePageTitleShouldNotBeEmpty()
    {
        _pageTitle = await Page.TitleAsync();
        Assert.That(_pageTitle, Is.Not.Empty, "Page title should not be empty");
        Console.WriteLine($"   - Page Title: {_pageTitle}");
    }

    [Then(@"the page title should contain ""(.*)""")]
    public void ThenThePageTitleShouldContain(string expectedTitle)
    {
        Assert.That(_pageTitle, Is.Not.Null, "Page title should have been retrieved");
        Assert.That(_pageTitle, Does.Contain(expectedTitle), 
            $"Expected page title to contain '{expectedTitle}', but got '{_pageTitle}'");
    }

    [Then(@"the heading element should be visible")]
    public async Task ThenTheHeadingElementShouldBeVisible()
    {
        _heading = Page.Locator("h1");
        await Assertions.Expect(_heading).ToBeVisibleAsync();
        Console.WriteLine("✅ Heading element is visible");
    }

    [Then(@"the body element should be visible")]
    public async Task ThenTheBodyElementShouldBeVisible()
    {
        _body = Page.Locator("body");
        await Assertions.Expect(_body).ToBeVisibleAsync();
        Console.WriteLine("✅ Body element is visible");
    }

    [Then(@"the body text content should not be null")]
    public async Task ThenTheBodyTextContentShouldNotBeNull()
    {
        _body ??= Page.Locator("body");
        _bodyText = await _body.TextContentAsync();
        Assert.That(_bodyText, Is.Not.Null, "Body text content should not be null");
        Console.WriteLine("✅ Body text content is not null");
    }

    [Then(@"the body text content should not be empty")]
    public void ThenTheBodyTextContentShouldNotBeEmpty()
    {
        Assert.That(_bodyText, Is.Not.Null, "Body text content should have been retrieved");
        Assert.That(_bodyText, Is.Not.Empty, "Body text content should not be empty");
        Console.WriteLine("✅ Body text content is not empty");
        Console.WriteLine("✅ Page interaction verified!");
        Console.WriteLine($"   - Can locate elements: ✓");
        Console.WriteLine($"   - Can read text content: ✓");
    }
}



