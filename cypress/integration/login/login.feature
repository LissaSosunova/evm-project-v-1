Feature: I check login page

Background:
    Given I am alredy sign-out

Scenario Outline: Testing login page
    Given I visit login page
    Then I see the "<rootComponent>"
    Then I see the "<sideBarComponent>"
    Then I see the "<loginPageComponent>"
    Then I see disabled button "button[type=submit]"

Examples:
    | rootComponent     | loginPageComponent    | sideBarComponent  |
    | app-root          |  app-login-page       | app-sidebar       |

Scenario Outline: Testing guard
    Given I visit home page
    Then Login page should be displayed

Examples:
    | Header 1 |
    | Value 1  |  

Scenario Outline: Testing forgot password page
    Given I visit login page
    Then I see button "<forgotPasswordBtn>" which can be clicked
    Then I see the "<forgotPasswordComponent>"
    Then I see disabled button "button[type=submit]"

Examples:
    | forgotPasswordBtn           | forgotPasswordComponent   |
    | [data-cy=forgot-password]   | app-forgot-password       |