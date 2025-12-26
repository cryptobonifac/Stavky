namespace {{PROJECT_NAME}}.Tests.PageObjects;

/// <summary>
/// Base page object class that provides common functionality for all page objects
/// </summary>
public abstract class BasePage
{
    protected readonly IPage Page;
    protected readonly string BaseUrl;

    protected BasePage(IPage page, string baseUrl = "http://localhost:3000")
    {
        Page = page;
        BaseUrl = baseUrl;
    }

    /// <summary>
    /// Navigate to a specific path
    /// </summary>
    public async Task NavigateAsync(string path = "")
    {
        var url = string.IsNullOrEmpty(path) ? BaseUrl : $"{BaseUrl}/{path.TrimStart('/')}";
        await Page.GotoAsync(url);
        await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
    }

    /// <summary>
    /// Get element by test ID
    /// </summary>
    protected ILocator GetByTestId(string testId) => Page.GetByTestId(testId);

    /// <summary>
    /// Get element by role
    /// </summary>
    protected ILocator GetByRole(AriaRole role, PageGetByRoleOptions? options = null) => Page.GetByRole(role, options);

    /// <summary>
    /// Get element by text
    /// </summary>
    protected ILocator GetByText(string text, PageGetByTextOptions? options = null) => Page.GetByText(text, options);

    /// <summary>
    /// Get element by label
    /// </summary>
    protected ILocator GetByLabel(string label) => Page.GetByLabel(label);

    /// <summary>
    /// Wait for element to be visible
    /// </summary>
    protected async Task WaitForVisibleAsync(ILocator locator, int timeout = 30000)
    {
        await locator.WaitForAsync(new LocatorWaitForOptions
        {
            State = WaitForSelectorState.Visible,
            Timeout = timeout
        });
    }

    /// <summary>
    /// Take a screenshot
    /// </summary>
    public async Task<byte[]> TakeScreenshotAsync(string? path = null)
    {
        var options = new PageScreenshotOptions { FullPage = true };
        if (path != null)
        {
            options.Path = path;
        }
        return await Page.ScreenshotAsync(options);
    }

    /// <summary>
    /// Get current page title
    /// </summary>
    public async Task<string> GetTitleAsync() => await Page.TitleAsync();

    /// <summary>
    /// Get current page URL
    /// </summary>
    public string GetUrl() => Page.Url;
}
