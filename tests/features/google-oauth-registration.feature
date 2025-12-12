Feature: Google OAuth Registration
  As a new user
  I want to register using my Google account
  So that I can quickly create an account without filling out forms

  Background:
    Given the application is running
    And I am not authenticated

  Scenario: Successful registration with Google OAuth
    Given I navigate to the signup page
    When I click the "Continue with Google" button
    Then I should be redirected to Google's OAuth consent page
    When I authenticate with valid Google credentials
    And I grant the required permissions
    Then I should be redirected back to the application
    And I should be on the "/en/bettings" page
    And I should be authenticated
    And my user account should be created in the database
    And my user should have the "customer" role assigned
    And my account should be active until "2099-12-31"

  Scenario: Registration with Google OAuth from login page
    Given I navigate to the login page
    When I click the "Continue with Google" button
    Then I should be redirected to Google's OAuth consent page
    When I authenticate with valid Google credentials
    And I grant the required permissions
    Then I should be redirected back to the application
    And I should be on the "/en/bettings" page
    And I should be authenticated
    And my user account should be created in the database

  Scenario: User profile is properly loaded after Google OAuth registration
    Given I have successfully registered via Google OAuth
    When I check my user profile
    Then my profile should contain my email address
    And my profile should have the "customer" role
    And my profile should have an account active date
    And I should be able to access customer features

  Scenario: Betting account registration with Google OAuth
    Given I navigate to the signup page
    When I click the "Continue with Google" button
    And I authenticate with a Google account email in the betting accounts list
    Then I should be redirected back to the application
    And I should be on the "/en/newbet" page
    And my user should have the "betting" role assigned
    And my account should be active for one year from registration

  Scenario: Session persistence after Google OAuth registration
    Given I have successfully registered via Google OAuth
    When I refresh the page
    Then I should remain authenticated
    And my user session should persist
    When I close and reopen the browser
    Then I should still be authenticated

  Scenario: OAuth callback handles missing code parameter
    Given I navigate to the auth callback URL without a code parameter
    Then I should be redirected to the login page
    And I should see an error message about "missing_code"

  Scenario: OAuth callback handles invalid code parameter
    Given I navigate to the auth callback URL with an invalid code
    Then I should be redirected to the login page
    And I should see an error message

  Scenario: Locale preservation during Google OAuth flow
    Given I am on the Czech language signup page "/cs/signup"
    When I click the "Continue with Google" button
    And I complete the Google OAuth flow
    Then I should be redirected to "/cs/bettings"
    And the page should be displayed in Czech language

  Scenario: User cannot register twice with the same Google account
    Given I have already registered with a Google account
    When I try to sign in again with the same Google account
    Then I should be successfully authenticated
    And my existing user account should be used
    And no duplicate user should be created
