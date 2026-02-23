Feature: Password Reset Flow
  As a user who forgot their password
  I want to be able to reset my password
  So that I can regain access to my account

  Background:
    Given the application is running at "http://localhost:3000"

  @e2e @auth @password-reset
  Scenario: User can navigate to forgot password page from login
    Given I am on the login page
    Then I should see the forgot password link
    When I click on the forgot password link
    Then I should be on the forgot password page
    And I should see the forgot password form

  @e2e @auth @password-reset
  Scenario: User can request password reset email
    Given I am on the forgot password page
    When I enter email "test@example.com" in the forgot password form
    And I submit the forgot password form
    Then I should see the success message

  @e2e @auth @password-reset
  Scenario: Forgot password shows validation error for empty email
    Given I am on the forgot password page
    When I submit the forgot password form without entering email
    Then I should see an email required error

  @e2e @auth @password-reset
  Scenario: Forgot password shows validation error for invalid email format
    Given I am on the forgot password page
    When I enter email "invalid-email" in the forgot password form
    And I submit the forgot password form
    Then I should see an invalid email error

  @e2e @auth @password-reset
  Scenario: User can navigate back to login from forgot password page
    Given I am on the forgot password page
    When I click the back to login link
    Then I should be on the login page
