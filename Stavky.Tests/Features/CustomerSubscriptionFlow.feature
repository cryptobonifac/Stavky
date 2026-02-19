Feature: Customer Registration and Subscription Flow
  As a new customer
  I want to register, login, and purchase a subscription
  So that I can access betting tips

  Background:
    Given the application is running at "http://localhost:3000"

  @e2e @subscription @polar
  Scenario: New customer registers, purchases monthly subscription, and verifies access to betting tips
    # Registration
    Given I am on the signup page
    When I fill in the registration form with a unique email
    And I submit the registration form
    Then I should be redirected to the bettings page

    # Verify non-subscriber cannot see betting tips in sidebar
    Then the sidebar should NOT display the Betting Tips link
    And the sidebar should display the Subscription link

    # Navigate to checkout
    When I click on the Subscription link in the sidebar
    Then I should be on the subscription page
    And I should see the no active subscription message
    When I click on the Create Subscription button
    Then I should be on the checkout page
    And I should see the monthly subscription option
    And I should see the yearly subscription option

    # Purchase monthly subscription via Polar sandbox
    When I click on the monthly subscription button
    Then I should be redirected to Polar checkout page
    When I complete the Polar sandbox payment with test card
    Then I should be redirected to the checkout success page

    # Sync subscription locally (webhooks don't reach localhost)
    When I sync the subscription via admin endpoint

    # Navigate back and verify access
    When I navigate to the subscription page
    Then I should see the active subscription status
    And I should see subscription details with active status

    # Verify sidebar now shows Betting Tips
    When I navigate to the bettings page
    Then the sidebar should display the Betting Tips link
    And I should see the betting tips list

    # Verify database has active subscription
    Then the database should show the user has an active subscription

  @e2e @subscription
  Scenario: New customer registers and sees subscription options
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

    # Verify subscription options on bettings page
    When I navigate to the bettings page
    Then I should see the subscription options
    And I should see the Subscribe button

    # Verify checkout page with payment options
    When I click on the Subscribe button
    Then I should be on the checkout page
    And I should see the monthly subscription option
    And I should see the yearly subscription option
    And I should see the Polar payment buttons

  @e2e @sidebar
  Scenario: Non-subscribed customer can access Statistics from sidebar
    Given I am logged in as a non-subscribed customer
    When I am on the bettings page
    Then the sidebar should display the Statistics link
    When I click on the Statistics link in the sidebar
    Then I should be on the Statistics page

  @e2e @sidebar
  Scenario: Non-subscribed customer sees subscription options on bettings page
    Given I am logged in as a non-subscribed customer
    When I am on the bettings page
    Then I should see the account not active message
    And I should see the Subscribe button
    When I click on the Subscribe button
    Then I should be on the checkout page
    And I should see the monthly subscription option
    And I should see the yearly subscription option
