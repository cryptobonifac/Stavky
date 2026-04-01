Feature: Account Activation Flow
  As a new user who signed up
  I want to see activation instructions with IBAN and pricing
  So that I know how to pay and activate my account

  As an admin
  I want to manually activate user accounts and configure activation settings
  So that I can manage access after receiving bank payments

  Background:
    Given the application is running at "http://localhost:3000"

  # --- Inactive Customer Flow ---

  @e2e @activation @customer
  Scenario: Inactive customer is redirected to activation page from bettings
    Given I am logged in as an inactive customer
    When I navigate to the bettings page
    Then I should be redirected to the activation page
    And I should see the activation heading
    And I should see the monthly price "40"
    And I should see the yearly price "360"
    And I should see the IBAN section

  @e2e @activation @customer
  Scenario: Activation page displays locale-specific message
    Given I am logged in as an inactive customer
    When I navigate to the activation page
    Then I should see the activation heading
    And I should see the payment instructions message

  @e2e @activation @customer
  Scenario: Activation page has a back to home button
    Given I am logged in as an inactive customer
    When I navigate to the activation page
    And I click the back to home button
    Then I should be on the home page

  @e2e @activation @customer
  Scenario: Active customer is not shown the activation page
    Given I am logged in as an active customer
    When I navigate to the activation page
    Then I should be redirected to the bettings page

  @e2e @activation @customer
  Scenario: Active customer can access bettings page
    Given I am logged in as an active customer
    When I navigate to the bettings page
    Then I should see the bettings page content

  # --- Admin Activation Settings ---

  @e2e @activation @admin
  Scenario: Admin can see the activation section in settings
    Given I am logged in as an admin
    When I navigate to the settings page
    Then I should see the activation section
    And I should see the user search field
    And I should see the activation settings form

  @e2e @activation @admin
  Scenario: Admin can search for a user by email in activation section
    Given I am logged in as an admin
    When I navigate to the settings page
    And I search for user "customer5@gmail.com" in the user search
    Then I should see the user email "customer5@gmail.com" in the details
    And I should see the account active until date picker

  @e2e @activation @admin
  Scenario: Admin can set account active until date for a user
    Given I am logged in as an admin
    When I navigate to the settings page
    And I search for user "customer5@gmail.com" in the user search
    And I set the account active until date to next year
    And I save the user settings
    Then I should see a success message

  @e2e @activation @admin
  Scenario: Admin can update activation prices
    Given I am logged in as an admin
    When I navigate to the settings page
    And I set the monthly price to "50"
    And I set the yearly price to "400"
    And I save the activation settings
    Then I should see a success message

  @e2e @activation @admin
  Scenario: Admin can update the IBAN
    Given I am logged in as an admin
    When I navigate to the settings page
    And I set the IBAN to "SK31 1200 0000 1987 4263 7541"
    And I save the activation settings
    Then I should see a success message

  @e2e @activation @admin
  Scenario: Admin can update activation messages
    Given I am logged in as an admin
    When I navigate to the settings page
    And I set the English activation message to "Please transfer the amount to activate your account."
    And I save the activation settings
    Then I should see a success message

  @e2e @activation @admin
  Scenario: Admin sees live preview of activation page
    Given I am logged in as an admin
    When I navigate to the settings page
    And I set the monthly price to "45"
    And I set the IBAN to "CZ65 0800 0000 1920 0014 5399"
    Then the activation preview should show price "45"
    And the activation preview should show the IBAN "CZ65 0800 0000 1920 0014 5399"

  # --- Full Activation Lifecycle ---

  @e2e @activation @lifecycle
  Scenario: Full activation flow - admin activates inactive customer
    Given I am logged in as an admin
    When I navigate to the settings page
    And I search for user "customer5@gmail.com" in the user search
    And I set the account active until date to next year
    And I save the user settings
    Then I should see a success message
    When I log out
    And I log in as "customer5@gmail.com"
    And I navigate to the bettings page
    Then I should see the bettings page content
