using Microsoft.Playwright;
using Reqnroll;

namespace Stavky.Tests.Steps;

[Binding]
public class CustomerSubscriptionFlowSteps
{
    private IPage Page => (IPage)ScenarioContext.Current["Page"];
    private string _baseUrl = "http://localhost:3000";
    private string _testEmail = string.Empty;
    private const string TestPassword = "TestPassword123!";

    [Given(@"the application is running at ""(.*)""")]
    public void GivenTheApplicationIsRunningAt(string baseUrl)
    {
        _baseUrl = baseUrl;
        Console.WriteLine($"Base URL set to: {_baseUrl}");
    }

    [Given(@"I am on the signup page")]
    public async Task GivenIAmOnTheSignupPage()
    {
        await Page.GotoAsync($"{_baseUrl}/en/signup");
        await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
        Console.WriteLine($"Navigated to signup page: {Page.Url}");
    }

    [When(@"I fill in the registration form with a unique email")]
    public async Task WhenIFillInTheRegistrationFormWithAUniqueEmail()
    {
        // Generate a unique email for each test run
        _testEmail = $"test.user.{DateTime.UtcNow.Ticks}@example.com";

        // Fill in email
        var emailInput = Page.Locator("[data-testid='signup-email-input']");
        await emailInput.FillAsync(_testEmail);

        // Fill in password
        var passwordInput = Page.Locator("[data-testid='signup-password-input']");
        await passwordInput.FillAsync(TestPassword);

        // Fill in confirm password
        var confirmPasswordInput = Page.Locator("[data-testid='signup-confirm-password-input']");
        await confirmPasswordInput.FillAsync(TestPassword);

        Console.WriteLine($"Filled registration form with email: {_testEmail}");
    }

    [When(@"I submit the registration form")]
    public async Task WhenISubmitTheRegistrationForm()
    {
        var submitButton = Page.Locator("[data-testid='signup-submit-button']");
        await submitButton.ClickAsync();

        // Wait for navigation or response
        await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
        Console.WriteLine("Registration form submitted");
    }

    [Then(@"I should be redirected to the bettings page")]
    public async Task ThenIShouldBeRedirectedToTheBettingsPage()
    {
        // Wait for navigation to complete
        await Page.WaitForURLAsync(url => url.Contains("/bettings"), new PageWaitForURLOptions
        {
            Timeout = 10000
        });

        Assert.That(Page.Url, Does.Contain("/bettings"),
            $"Expected to be on bettings page, but URL is: {Page.Url}");
        Console.WriteLine($"Successfully redirected to: {Page.Url}");
    }

    [Then(@"the sidebar should display the Statistics link")]
    public async Task ThenTheSidebarShouldDisplayTheStatisticsLink()
    {
        // Look for the Statistics link in the sidebar
        var statisticsLink = Page.Locator("nav a[href*='/statistics']");
        await Assertions.Expect(statisticsLink).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions
        {
            Timeout = 5000
        });
        Console.WriteLine("Statistics link is visible in sidebar");
    }

    [When(@"I click on the Statistics link in the sidebar")]
    public async Task WhenIClickOnTheStatisticsLinkInTheSidebar()
    {
        var statisticsLink = Page.Locator("nav a[href*='/statistics']");
        await statisticsLink.ClickAsync();
        await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
        Console.WriteLine("Clicked on Statistics link");
    }

    [Then(@"I should be on the Statistics page")]
    public async Task ThenIShouldBeOnTheStatisticsPage()
    {
        await Page.WaitForURLAsync(url => url.Contains("/statistics"), new PageWaitForURLOptions
        {
            Timeout = 10000
        });

        Assert.That(Page.Url, Does.Contain("/statistics"),
            $"Expected to be on statistics page, but URL is: {Page.Url}");
        Console.WriteLine($"Successfully on Statistics page: {Page.Url}");
    }

    [Then(@"the Statistics page should load successfully")]
    public async Task ThenTheStatisticsPageShouldLoadSuccessfully()
    {
        // Wait for page content to load
        await Page.WaitForLoadStateAsync(LoadState.DOMContentLoaded);

        // Verify the page has main content area
        var mainContent = Page.Locator("main");
        await Assertions.Expect(mainContent).ToBeVisibleAsync();
        Console.WriteLine("Statistics page loaded successfully");
    }

    [When(@"I navigate to the bettings page")]
    public async Task WhenINavigateToTheBettingsPage()
    {
        await Page.GotoAsync($"{_baseUrl}/en/bettings");
        await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
        Console.WriteLine($"Navigated to bettings page: {Page.Url}");
    }

    [Then(@"I should see the subscription options")]
    public async Task ThenIShouldSeeTheSubscriptionOptions()
    {
        // For non-active accounts, subscription options should be visible
        // Look for the SubscribeButton card or the subscription section
        var subscriptionCard = Page.Locator("text=Subscribe").First;
        await Assertions.Expect(subscriptionCard).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions
        {
            Timeout = 5000
        });
        Console.WriteLine("Subscription options are visible");
    }

    [Then(@"I should see the Subscribe button")]
    public async Task ThenIShouldSeeTheSubscribeButton()
    {
        // The SubscribeButton component contains a button to redirect to checkout
        // Look for button containing subscribe text (English or Slovak)
        var subscribeButton = Page.Locator("button:has-text('Subscribe'), button:has-text('Predplatiť'), button:has-text('predplatiť')").First;

        await Assertions.Expect(subscribeButton).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions
        {
            Timeout = 5000
        });
        Console.WriteLine("Subscribe button is visible");
    }

    [When(@"I click on the Subscribe button")]
    public async Task WhenIClickOnTheSubscribeButton()
    {
        var subscribeButton = Page.Locator("button:has-text('Subscribe'), button:has-text('Predplatiť'), button:has-text('predplatiť')").First;

        await subscribeButton.ClickAsync();
        await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
        Console.WriteLine("Clicked on Subscribe button");
    }

    [Then(@"I should be on the checkout page")]
    public async Task ThenIShouldBeOnTheCheckoutPage()
    {
        await Page.WaitForURLAsync(url => url.Contains("/checkout"), new PageWaitForURLOptions
        {
            Timeout = 10000
        });

        Assert.That(Page.Url, Does.Contain("/checkout"),
            $"Expected to be on checkout page, but URL is: {Page.Url}");
        Console.WriteLine($"Successfully on checkout page: {Page.Url}");
    }

    [Then(@"I should see the monthly subscription option")]
    public async Task ThenIShouldSeeTheMonthlySubscriptionOption()
    {
        // Look for monthly subscription card/button
        var monthlyOption = Page.Locator("button:has-text('Monthly'), button:has-text('Mesačne'), button:has-text('mesačn')").First;

        await Assertions.Expect(monthlyOption).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions
        {
            Timeout = 10000
        });
        Console.WriteLine("Monthly subscription option is visible");
    }

    [Then(@"I should see the yearly subscription option")]
    public async Task ThenIShouldSeeTheYearlySubscriptionOption()
    {
        // Look for yearly subscription card/button
        var yearlyOption = Page.Locator("button:has-text('Yearly'), button:has-text('Ročne'), button:has-text('ročn')").First;

        await Assertions.Expect(yearlyOption).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions
        {
            Timeout = 10000
        });
        Console.WriteLine("Yearly subscription option is visible");
    }

    [Then(@"I should see the Stripe payment buttons")]
    public async Task ThenIShouldSeeTheStripePaymentButtons()
    {
        // Verify subscription buttons are present (these trigger Stripe checkout)
        // Look for buttons with shopping cart icon or subscribe text
        var monthlyButton = Page.Locator("button:has-text('Monthly'), button:has-text('Mesačne')").First;
        var yearlyButton = Page.Locator("button:has-text('Yearly'), button:has-text('Ročne')").First;

        await Assertions.Expect(monthlyButton).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions
        {
            Timeout = 5000
        });
        await Assertions.Expect(yearlyButton).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions
        {
            Timeout = 5000
        });

        Console.WriteLine("Stripe payment buttons are visible");
    }

    [Given(@"I am logged in as a non-subscribed customer")]
    public async Task GivenIAmLoggedInAsANonSubscribedCustomer()
    {
        // Generate unique email for this test
        _testEmail = $"test.nonsubscribed.{DateTime.UtcNow.Ticks}@example.com";

        // First, register the user
        await Page.GotoAsync($"{_baseUrl}/en/signup");
        await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);

        // Fill in registration form
        await Page.Locator("[data-testid='signup-email-input']").FillAsync(_testEmail);
        await Page.Locator("[data-testid='signup-password-input']").FillAsync(TestPassword);
        await Page.Locator("[data-testid='signup-confirm-password-input']").FillAsync(TestPassword);

        // Submit registration
        await Page.Locator("[data-testid='signup-submit-button']").ClickAsync();
        await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);

        // Wait for redirect to bettings page (user is now logged in)
        try
        {
            await Page.WaitForURLAsync(url => url.Contains("/bettings"), new PageWaitForURLOptions
            {
                Timeout = 10000
            });
        }
        catch
        {
            // If not redirected, try logging in
            await Page.GotoAsync($"{_baseUrl}/en/login");
            await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            await Page.Locator("[data-testid='login-email-input']").FillAsync(_testEmail);
            await Page.Locator("[data-testid='login-password-input']").FillAsync(TestPassword);
            await Page.Locator("[data-testid='login-submit-button']").ClickAsync();
            await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
        }

        Console.WriteLine($"Logged in as non-subscribed customer: {_testEmail}");
    }

    [When(@"I am on the bettings page")]
    public async Task WhenIAmOnTheBettingsPage()
    {
        if (!Page.Url.Contains("/bettings"))
        {
            await Page.GotoAsync($"{_baseUrl}/en/bettings");
            await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
        }

        Assert.That(Page.Url, Does.Contain("/bettings"),
            $"Expected to be on bettings page, but URL is: {Page.Url}");
        Console.WriteLine($"On bettings page: {Page.Url}");
    }

    [Then(@"I should see the account not active message")]
    public async Task ThenIShouldSeeTheAccountNotActiveMessage()
    {
        // Look for the alert message indicating account is not active
        var alertMessage = Page.Locator(".MuiAlert-root");
        await Assertions.Expect(alertMessage).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions
        {
            Timeout = 5000
        });

        Console.WriteLine("Account not active message is visible");
    }
}
