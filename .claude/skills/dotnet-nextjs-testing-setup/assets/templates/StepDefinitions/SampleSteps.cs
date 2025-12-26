namespace {{PROJECT_NAME}}.Tests.StepDefinitions;

[Binding]
public class SampleSteps
{
    private readonly ScenarioContext _scenarioContext;
    private IPage _page = null!;
    private string _baseUrl = "http://localhost:3000";

    public SampleSteps(ScenarioContext scenarioContext)
    {
        _scenarioContext = scenarioContext;
    }

    [BeforeScenario]
    public async Task BeforeScenario()
    {
        // Get the page from scenario context (set up in Hooks)
        if (_scenarioContext.TryGetValue("page", out IPage page))
        {
            _page = page;
        }
    }

    [Given(@"I navigate to the home page")]
    public async Task GivenINavigateToTheHomePage()
    {
        await _page.GotoAsync(_baseUrl);
        await _page.WaitForLoadStateAsync(LoadState.NetworkIdle);
    }

    [Then(@"I should see the page title ""(.*)""")]
    public async Task ThenIShouldSeeThePageTitle(string expectedTitle)
    {
        var title = await _page.TitleAsync();
        title.Should().Contain(expectedTitle);
    }

    [Then(@"the page should be loaded successfully")]
    public async Task ThenThePageShouldBeLoadedSuccessfully()
    {
        var url = _page.Url;
        url.Should().Contain(_baseUrl);
    }

    [Then(@"I should see the main content")]
    public async Task ThenIShouldSeeTheMainContent()
    {
        var body = _page.Locator("body");
        await body.WaitForAsync(new LocatorWaitForOptions { State = WaitForSelectorState.Visible });
        (await body.IsVisibleAsync()).Should().BeTrue();
    }
}
