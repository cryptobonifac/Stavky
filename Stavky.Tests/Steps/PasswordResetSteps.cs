using Microsoft.Playwright;
using Reqnroll;

namespace Stavky.Tests.Steps;

[Binding]
public class PasswordResetSteps
{
    private IPage Page => (IPage)ScenarioContext.Current["Page"];
    private string _baseUrl = "http://localhost:3000";

    [Given(@"I am on the login page")]
    public async Task GivenIAmOnTheLoginPage()
    {
        await Page.GotoAsync($"{_baseUrl}/en/login");
        await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
        Console.WriteLine($"Navigated to login page: {Page.Url}");
    }

    [Then(@"I should see the forgot password link")]
    public async Task ThenIShouldSeeTheForgotPasswordLink()
    {
        var forgotPasswordLink = Page.Locator("[data-testid='forgot-password-link']");
        await Assertions.Expect(forgotPasswordLink).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions
        {
            Timeout = 5000
        });
        Console.WriteLine("Forgot password link is visible");
    }

    [When(@"I click on the forgot password link")]
    public async Task WhenIClickOnTheForgotPasswordLink()
    {
        var forgotPasswordLink = Page.Locator("[data-testid='forgot-password-link']");
        await forgotPasswordLink.ClickAsync();
        await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
        Console.WriteLine("Clicked on forgot password link");
    }

    [Then(@"I should be on the forgot password page")]
    public async Task ThenIShouldBeOnTheForgotPasswordPage()
    {
        await Page.WaitForURLAsync(url => url.Contains("/forgot-password"), new PageWaitForURLOptions
        {
            Timeout = 10000
        });

        Assert.That(Page.Url, Does.Contain("/forgot-password"),
            $"Expected to be on forgot password page, but URL is: {Page.Url}");
        Console.WriteLine($"Successfully on forgot password page: {Page.Url}");
    }

    [Then(@"I should see the forgot password form")]
    public async Task ThenIShouldSeeTheForgotPasswordForm()
    {
        var form = Page.Locator("[data-testid='forgot-password-form']");
        await Assertions.Expect(form).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions
        {
            Timeout = 5000
        });
        Console.WriteLine("Forgot password form is visible");
    }

    [Given(@"I am on the forgot password page")]
    public async Task GivenIAmOnTheForgotPasswordPage()
    {
        await Page.GotoAsync($"{_baseUrl}/en/forgot-password");
        await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
        Console.WriteLine($"Navigated to forgot password page: {Page.Url}");
    }

    [When(@"I enter email ""(.*)"" in the forgot password form")]
    public async Task WhenIEnterEmailInTheForgotPasswordForm(string email)
    {
        var emailInput = Page.Locator("[data-testid='forgot-password-email-input']");
        await emailInput.FillAsync(email);
        Console.WriteLine($"Entered email: {email}");
    }

    [When(@"I submit the forgot password form")]
    public async Task WhenISubmitTheForgotPasswordForm()
    {
        var submitButton = Page.Locator("[data-testid='forgot-password-submit-button']");
        await submitButton.ClickAsync();
        await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
        Console.WriteLine("Submitted forgot password form");
    }

    [Then(@"I should see the success message")]
    public async Task ThenIShouldSeeTheSuccessMessage()
    {
        var successMessage = Page.Locator("[data-testid='forgot-password-success']");
        await Assertions.Expect(successMessage).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions
        {
            Timeout = 10000
        });
        Console.WriteLine("Success message is visible");
    }

    [When(@"I submit the forgot password form without entering email")]
    public async Task WhenISubmitTheForgotPasswordFormWithoutEnteringEmail()
    {
        // Leave email field empty and submit
        var submitButton = Page.Locator("[data-testid='forgot-password-submit-button']");
        await submitButton.ClickAsync();
        await Page.WaitForTimeoutAsync(1000);
        Console.WriteLine("Submitted forgot password form without email");
    }

    [Then(@"I should see an email required error")]
    public async Task ThenIShouldSeeAnEmailRequiredError()
    {
        var errorMessage = Page.Locator("[data-testid='forgot-password-error']");
        await Assertions.Expect(errorMessage).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions
        {
            Timeout = 5000
        });
        Console.WriteLine("Email required error is visible");
    }

    [Then(@"I should see an invalid email error")]
    public async Task ThenIShouldSeeAnInvalidEmailError()
    {
        var errorMessage = Page.Locator("[data-testid='forgot-password-error']");
        await Assertions.Expect(errorMessage).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions
        {
            Timeout = 5000
        });
        Console.WriteLine("Invalid email error is visible");
    }

    [When(@"I click the back to login link")]
    public async Task WhenIClickTheBackToLoginLink()
    {
        var backLink = Page.Locator("a[href*='/login']").First;
        await backLink.ClickAsync();
        await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
        Console.WriteLine("Clicked back to login link");
    }

    [Then(@"I should be on the login page")]
    public async Task ThenIShouldBeOnTheLoginPage()
    {
        await Page.WaitForURLAsync(url => url.Contains("/login") && !url.Contains("forgot"), new PageWaitForURLOptions
        {
            Timeout = 10000
        });

        Assert.That(Page.Url, Does.Contain("/login").And.Not.Contain("forgot"),
            $"Expected to be on login page, but URL is: {Page.Url}");
        Console.WriteLine($"Successfully on login page: {Page.Url}");
    }
}
