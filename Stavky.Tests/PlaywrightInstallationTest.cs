using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;

namespace Stavky.Tests;

/// <summary>
/// Simple test to verify Playwright installation is working correctly.
/// This test confirms that:
/// - Playwright browsers are installed
/// - Browser can be launched
/// - Page navigation works
/// - Basic assertions work
/// </summary>
[TestFixture]
public class PlaywrightInstallationTest : PageTest
{
    [Test]
    public async Task PlaywrightInstallation_ShouldWork()
    {
        // Navigate to a simple page to verify browser works
        await Page.GotoAsync("https://example.com");
        
        // Verify page loaded
        Assert.That(Page.Url, Does.Contain("example.com"));
        
        // Verify page title
        var title = await Page.TitleAsync();
        Assert.That(title, Is.Not.Empty);
        Assert.That(title, Does.Contain("Example"));
        
        // Verify page content loaded
        var heading = Page.Locator("h1");
        await Expect(heading).ToBeVisibleAsync();
        
        Console.WriteLine("✅ Playwright installation verified successfully!");
        Console.WriteLine($"   - Browser: {BrowserName}");
        Console.WriteLine($"   - Page URL: {Page.Url}");
        Console.WriteLine($"   - Page Title: {title}");
    }


    [Test]
    public async Task Playwright_CanInteractWithPage()
    {
        // Navigate to a page with interactive elements
        await Page.GotoAsync("https://example.com");
        
        // Verify we can find elements
        var body = Page.Locator("body");
        await Expect(body).ToBeVisibleAsync();
        
        // Verify we can get text content
        var bodyText = await body.TextContentAsync();
        Assert.That(bodyText, Is.Not.Null);
        Assert.That(bodyText, Is.Not.Empty);
        
        Console.WriteLine("✅ Page interaction verified!");
        Console.WriteLine($"   - Can locate elements: ✓");
        Console.WriteLine($"   - Can read text content: ✓");
    }
}
