Feature: Customer Registration and Subscription Flow
  As a new customer
  I want to register and see subscription options
  So that I can subscribe to the betting tips service

  Background:
    Given the application is running at "http://localhost:3000"

  Scenario: New customer registers and sees Statistics page and Stripe payment options
    # Registration
    Given I am on the signup page
    When I fill in the registration form with a unique email
    And I submit the registration form
    Then I should be redirected to the bettings page

    # Verify Statistics is accessible in sidebar
    And the sidebar should display the Statistics link
    When I click on the Statistics link in the sidebar
    Then I should be on the Statistics page
    And the Statistics page should load successfully

    # Verify Stripe payment options on bettings page
    When I navigate to the bettings page
    Then I should see the subscription options
    And I should see the Subscribe button

    # Verify Stripe checkout page with payment options
    When I click on the Subscribe button
    Then I should be on the checkout page
    And I should see the monthly subscription option
    And I should see the yearly subscription option
    And I should see the Stripe payment buttons

  Scenario: Non-subscribed customer can access Statistics from sidebar
    Given I am logged in as a non-subscribed customer
    When I am on the bettings page
    Then the sidebar should display the Statistics link
    When I click on the Statistics link in the sidebar
    Then I should be on the Statistics page

  Scenario: Non-subscribed customer sees Stripe payment options on bettings page
    Given I am logged in as a non-subscribed customer
    When I am on the bettings page
    Then I should see the account not active message
    And I should see the Subscribe button
    When I click on the Subscribe button
    Then I should be on the checkout page
    And I should see the monthly subscription option
    And I should see the yearly subscription option
