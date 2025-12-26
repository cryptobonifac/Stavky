Feature: Sample Feature
    As a user
    I want to navigate to the home page
    So that I can see the application

Scenario: Navigate to home page
    Given I navigate to the home page
    Then I should see the page title "Home"

Scenario: Verify page elements
    Given I navigate to the home page
    Then the page should be loaded successfully
    And I should see the main content
