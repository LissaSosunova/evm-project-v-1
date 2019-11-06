Feature: I check registration page

Background:
    Given I am alredy sign-out

Scenario Outline: I test registration page
    Given I visit login page    
    Then I see button "<registration>" which can be clicked
    Then I see the "<registrationComponent>"
    Then I see the "<regForm>"
    Then I see "5" inputs
    Then I see disabled button "button[type=submit]"
    Then I fill registration form with data "<regData>"
    Then I wait for "1" seconds
    Then I see button "[type=submit]" which can be clicked
    Then I see "Check your email to complete registration" in element "snack-bar-container app-toast-success"
    Then I wait for "6" seconds
    Then I do not see the "snack-bar-container app-toast-success"

Examples:
| registration           | registrationComponent    | regForm                   | regData                                       |
| [data-cy=registration] | app-registration         | [name=registrationForm]   | testName;IDname;test@mail.com;test123;test123 |