Feature: Playwright Installation Verification
  As a developer
  I want to verify that Playwright is correctly installed and working
  So that I can ensure the testing environment is properly configured

  Scenario: Playwright installation should work correctly
    Given Playwright browsers are installed
    When I navigate to "https://example.com"
    Then the page URL should contain "example.com"
    And the page title should not be empty
    And the page title should contain "Example"
    And the heading element should be visible

  Scenario: Playwright can interact with page elements
    Given Playwright browsers are installed
    When I navigate to "https://example.com"
    Then the body element should be visible
    And the body text content should not be null
    And the body text content should not be empty
