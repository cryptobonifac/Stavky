using Microsoft.Playwright;
using Reqnroll;

namespace Stavky.Tests.Steps;

[Binding]
public class AccountActivationSteps
{
    private IPage Page => (IPage)ScenarioContext.Current["Page"];
    private string _baseUrl = "http://localhost:3000";

    [Given(@"the application is running at ""(.*)""")]
    public void GivenTheApplicationIsRunningAt(string url)
    {
        _baseUrl = url;
        Console.WriteLine($"Application URL set to: {url}");
    }

    // --- Test user credentials (must exist in local Supabase) ---
    private const string InactiveCustomerEmail = "customer5@gmail.com";
    private const string InactiveCustomerPassword = "test1234";
    private const string ActiveCustomerEmail = "activecustomer@test.com";
    private const string ActiveCustomerPassword = "test1234";
    private const string AdminEmail = "admin@stavky.com";
    private const string AdminPassword = "test1234";

    // ============================================================
    // Helper: Login
    // ============================================================

    private async Task LoginAs(string email, string password)
    {
        await Page.GotoAsync($"{_baseUrl}/en/login");
        await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);

        var emailInput = Page.Locator("[data-testid='login-email-input']");
        await emailInput.FillAsync(email);

        var passwordInput = Page.Locator("[data-testid='login-password-input']");
        await passwordInput.FillAsync(password);

        var submitButton = Page.Locator("[data-testid='login-submit-button']");
        await submitButton.ClickAsync();

        // Wait for navigation after login
        await Page.WaitForURLAsync(url => !url.Contains("/login"), new PageWaitForURLOptions
        {
            Timeout = 15000
        });

        Console.WriteLine($"Logged in as {email}, URL: {Page.Url}");
    }

    // ============================================================
    // Given steps
    // ============================================================

    [Given(@"I am logged in as an inactive customer")]
    public async Task GivenIAmLoggedInAsAnInactiveCustomer()
    {
        await LoginAs(InactiveCustomerEmail, InactiveCustomerPassword);
    }

    [Given(@"I am logged in as an active customer")]
    public async Task GivenIAmLoggedInAsAnActiveCustomer()
    {
        await LoginAs(ActiveCustomerEmail, ActiveCustomerPassword);
    }

    [Given(@"I am logged in as an admin")]
    public async Task GivenIAmLoggedInAsAnAdmin()
    {
        await LoginAs(AdminEmail, AdminPassword);
    }

    // ============================================================
    // When steps - Navigation
    // ============================================================

    [When(@"I navigate to the bettings page")]
    public async Task WhenINavigateToTheBettingsPage()
    {
        await Page.GotoAsync($"{_baseUrl}/en/bettings");
        await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
        Console.WriteLine($"Navigated to bettings, URL: {Page.Url}");
    }

    [When(@"I navigate to the activation page")]
    public async Task WhenINavigateToTheActivationPage()
    {
        await Page.GotoAsync($"{_baseUrl}/en/activation");
        await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
        Console.WriteLine($"Navigated to activation, URL: {Page.Url}");
    }

    [When(@"I navigate to the settings page")]
    public async Task WhenINavigateToTheSettingsPage()
    {
        await Page.GotoAsync($"{_baseUrl}/en/settings");
        await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
        Console.WriteLine($"Navigated to settings, URL: {Page.Url}");
    }

    [When(@"I click the back to home button")]
    public async Task WhenIClickTheBackToHomeButton()
    {
        var backButton = Page.Locator("a[href*='/en']").Filter(new LocatorFilterOptions
        {
            HasText = "Back to Home"
        });
        await backButton.ClickAsync();
        await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
        Console.WriteLine("Clicked back to home button");
    }

    // ============================================================
    // When steps - Admin User Management
    // ============================================================

    [When(@"I search for user ""(.*)"" in the user search")]
    public async Task WhenISearchForUserInTheUserSearch(string email)
    {
        var autocomplete = Page.Locator("[data-testid='settings-user-search']");
        await autocomplete.ClearAsync();
        await autocomplete.FillAsync(email);

        // Wait for dropdown option and click it
        var option = Page.Locator($".MuiAutocomplete-option:has-text('{email}')");
        await option.WaitForAsync(new LocatorWaitForOptions { Timeout = 5000 });
        await option.ClickAsync();

        Console.WriteLine($"Selected user: {email}");
    }

    [When(@"I set the account active until date to next year")]
    public async Task WhenISetTheAccountActiveUntilDateToNextYear()
    {
        var dateInput = Page.Locator("[data-testid='settings-user-active-until']");
        await dateInput.ClearAsync();

        var nextYear = DateTime.Now.AddYears(1).ToString("MM/dd/yyyy hh:mm tt");
        await dateInput.FillAsync(nextYear);

        Console.WriteLine($"Set account active until: {nextYear}");
    }

    [When(@"I save the user settings")]
    public async Task WhenISaveTheUserSettings()
    {
        var saveButton = Page.Locator("[data-testid='settings-user-save-button']");
        await saveButton.ClickAsync();
        await Page.WaitForTimeoutAsync(2000);
        Console.WriteLine("Saved user settings");
    }

    // ============================================================
    // When steps - Admin Activation Settings
    // ============================================================

    [When(@"I set the monthly price to ""(.*)""")]
    public async Task WhenISetTheMonthlyPriceTo(string price)
    {
        var input = Page.Locator("[data-testid='activation-monthly-price']");
        await input.ClearAsync();
        await input.FillAsync(price);
        Console.WriteLine($"Set monthly price to: {price}");
    }

    [When(@"I set the yearly price to ""(.*)""")]
    public async Task WhenISetTheYearlyPriceTo(string price)
    {
        var input = Page.Locator("[data-testid='activation-yearly-price']");
        await input.ClearAsync();
        await input.FillAsync(price);
        Console.WriteLine($"Set yearly price to: {price}");
    }

    [When(@"I set the IBAN to ""(.*)""")]
    public async Task WhenISetTheIBANTo(string iban)
    {
        var input = Page.Locator("[data-testid='activation-iban']");
        await input.ClearAsync();
        await input.FillAsync(iban);
        Console.WriteLine($"Set IBAN to: {iban}");
    }

    [When(@"I set the English activation message to ""(.*)""")]
    public async Task WhenISetTheEnglishActivationMessageTo(string message)
    {
        var input = Page.Locator("[data-testid='activation-message-en']");
        await input.ClearAsync();
        await input.FillAsync(message);
        Console.WriteLine($"Set English message to: {message}");
    }

    [When(@"I save the activation settings")]
    public async Task WhenISaveTheActivationSettings()
    {
        var saveButton = Page.Locator("[data-testid='activation-settings-save']");
        await saveButton.ClickAsync();
        await Page.WaitForTimeoutAsync(2000);
        Console.WriteLine("Saved activation settings");
    }

    // ============================================================
    // When steps - Auth
    // ============================================================

    [When(@"I log out")]
    public async Task WhenILogOut()
    {
        // Try desktop logout button first, then mobile
        var logoutButton = Page.Locator("[data-testid='nav-logout-button']");
        if (await logoutButton.IsVisibleAsync())
        {
            await logoutButton.ClickAsync();
        }
        else
        {
            var mobileLogoutButton = Page.Locator("[data-testid='nav-mobile-logout-button']");
            await mobileLogoutButton.ClickAsync();
        }

        await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
        Console.WriteLine("Logged out");
    }

    [When(@"I log in as ""(.*)""")]
    public async Task WhenILogInAs(string email)
    {
        // Determine password based on email
        var password = email switch
        {
            InactiveCustomerEmail => InactiveCustomerPassword,
            ActiveCustomerEmail => ActiveCustomerPassword,
            AdminEmail => AdminPassword,
            _ => "test1234"
        };

        await LoginAs(email, password);
    }

    // ============================================================
    // Then steps - Activation Page
    // ============================================================

    [Then(@"I should be redirected to the activation page")]
    public async Task ThenIShouldBeRedirectedToTheActivationPage()
    {
        await Page.WaitForURLAsync(url => url.Contains("/activation"), new PageWaitForURLOptions
        {
            Timeout = 10000
        });

        Assert.That(Page.Url, Does.Contain("/activation"),
            $"Expected to be on activation page, but URL is: {Page.Url}");
        Console.WriteLine($"Redirected to activation page: {Page.Url}");
    }

    [Then(@"I should see the activation heading")]
    public async Task ThenIShouldSeeTheActivationHeading()
    {
        var heading = Page.GetByRole(AriaRole.Heading, new PageGetByRoleOptions
        {
            Name = "Activate Your Account"
        });
        await Assertions.Expect(heading).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions
        {
            Timeout = 5000
        });
        Console.WriteLine("Activation heading is visible");
    }

    [Then(@"I should see the monthly price ""(.*)""")]
    public async Task ThenIShouldSeeTheMonthlyPrice(string price)
    {
        var priceText = Page.GetByText($"{price}€").First;
        await Assertions.Expect(priceText).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions
        {
            Timeout = 5000
        });
        Console.WriteLine($"Monthly price {price}€ is visible");
    }

    [Then(@"I should see the yearly price ""(.*)""")]
    public async Task ThenIShouldSeeTheYearlyPrice(string price)
    {
        var priceText = Page.GetByText($"{price}€").Last;
        await Assertions.Expect(priceText).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions
        {
            Timeout = 5000
        });
        Console.WriteLine($"Yearly price {price}€ is visible");
    }

    [Then(@"I should see the IBAN section")]
    public async Task ThenIShouldSeeTheIBANSection()
    {
        var ibanLabel = Page.GetByText("IBAN");
        await Assertions.Expect(ibanLabel.First).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions
        {
            Timeout = 5000
        });
        Console.WriteLine("IBAN section is visible");
    }

    [Then(@"I should see the payment instructions message")]
    public async Task ThenIShouldSeeThePaymentInstructionsMessage()
    {
        var message = Page.GetByText("Payment Instructions");
        await Assertions.Expect(message).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions
        {
            Timeout = 5000
        });
        Console.WriteLine("Payment instructions message is visible");
    }

    [Then(@"I should be on the home page")]
    public async Task ThenIShouldBeOnTheHomePage()
    {
        await Page.WaitForURLAsync(url =>
            url.EndsWith("/en") || url.EndsWith("/en/"),
            new PageWaitForURLOptions { Timeout = 10000 });

        Console.WriteLine($"On home page: {Page.Url}");
    }

    // ============================================================
    // Then steps - Bettings Page
    // ============================================================

    [Then(@"I should be redirected to the bettings page")]
    public async Task ThenIShouldBeRedirectedToTheBettingsPage()
    {
        await Page.WaitForURLAsync(url => url.Contains("/bettings"), new PageWaitForURLOptions
        {
            Timeout = 10000
        });

        Assert.That(Page.Url, Does.Contain("/bettings"),
            $"Expected to be on bettings page, but URL is: {Page.Url}");
        Console.WriteLine($"Redirected to bettings page: {Page.Url}");
    }

    [Then(@"I should see the bettings page content")]
    public async Task ThenIShouldSeeTheBettingsPageContent()
    {
        await Page.WaitForURLAsync(url => url.Contains("/bettings"), new PageWaitForURLOptions
        {
            Timeout = 10000
        });

        // The bettings page should show either tips list or "no active tips" message
        var pageContent = Page.Locator("main");
        await Assertions.Expect(pageContent).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions
        {
            Timeout = 5000
        });

        Assert.That(Page.Url, Does.Contain("/bettings"),
            $"Expected bettings content, but URL is: {Page.Url}");
        Console.WriteLine("Bettings page content is visible");
    }

    // ============================================================
    // Then steps - Admin Settings
    // ============================================================

    [Then(@"I should see the activation section")]
    public async Task ThenIShouldSeeTheActivationSection()
    {
        var sectionTitle = Page.GetByRole(AriaRole.Heading, new PageGetByRoleOptions
        {
            Name = "Activation"
        });
        await Assertions.Expect(sectionTitle.First).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions
        {
            Timeout = 5000
        });
        Console.WriteLine("Activation section is visible");
    }

    [Then(@"I should see the user search field")]
    public async Task ThenIShouldSeeTheUserSearchField()
    {
        var searchField = Page.Locator("[data-testid='settings-user-search']");
        await Assertions.Expect(searchField).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions
        {
            Timeout = 5000
        });
        Console.WriteLine("User search field is visible");
    }

    [Then(@"I should see the activation settings form")]
    public async Task ThenIShouldSeeTheActivationSettingsForm()
    {
        var monthlyPriceInput = Page.Locator("[data-testid='activation-monthly-price']");
        await Assertions.Expect(monthlyPriceInput).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions
        {
            Timeout = 5000
        });

        var yearlyPriceInput = Page.Locator("[data-testid='activation-yearly-price']");
        await Assertions.Expect(yearlyPriceInput).ToBeVisibleAsync();

        var ibanInput = Page.Locator("[data-testid='activation-iban']");
        await Assertions.Expect(ibanInput).ToBeVisibleAsync();

        Console.WriteLine("Activation settings form is visible");
    }

    [Then(@"I should see the user email ""(.*)"" in the details")]
    public async Task ThenIShouldSeeTheUserEmailInTheDetails(string email)
    {
        var emailField = Page.Locator("[data-testid='settings-user-email']");
        await Assertions.Expect(emailField).ToHaveValueAsync(email, new LocatorAssertionsToHaveValueOptions
        {
            Timeout = 5000
        });
        Console.WriteLine($"User email {email} is displayed in details");
    }

    [Then(@"I should see the account active until date picker")]
    public async Task ThenIShouldSeeTheAccountActiveUntilDatePicker()
    {
        var datePicker = Page.Locator("[data-testid='settings-user-active-until']");
        await Assertions.Expect(datePicker).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions
        {
            Timeout = 5000
        });
        Console.WriteLine("Account active until date picker is visible");
    }

    [Then(@"I should see a success message")]
    public async Task ThenIShouldSeeASuccessMessage()
    {
        var successAlert = Page.Locator(".MuiAlert-standardSuccess, .MuiAlert-filledSuccess, .MuiAlert-outlinedSuccess");
        await Assertions.Expect(successAlert.First).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions
        {
            Timeout = 10000
        });
        Console.WriteLine("Success message is visible");
    }

    // ============================================================
    // Then steps - Admin Preview
    // ============================================================

    [Then(@"the activation preview should show price ""(.*)""")]
    public async Task ThenTheActivationPreviewShouldShowPrice(string price)
    {
        // The preview card contains the price
        var previewPrice = Page.GetByText($"{price}€");
        await Assertions.Expect(previewPrice.First).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions
        {
            Timeout = 5000
        });
        Console.WriteLine($"Preview shows price: {price}€");
    }

    [Then(@"the activation preview should show the IBAN ""(.*)""")]
    public async Task ThenTheActivationPreviewShouldShowTheIBAN(string iban)
    {
        var previewIban = Page.GetByText(iban);
        await Assertions.Expect(previewIban.First).ToBeVisibleAsync(new LocatorAssertionsToBeVisibleOptions
        {
            Timeout = 5000
        });
        Console.WriteLine($"Preview shows IBAN: {iban}");
    }
}
