Feature: sign-in and sign-out testing

Background:
    Given I am alredy sign-out

Scenario Outline: I test sign-in and sign-out
    Given I create user
    Then I sign-in
    Then I sign-out
    Then I delete user "<username>"

Examples:
  | username |
  | user1    |  