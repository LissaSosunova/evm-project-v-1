Feature: I check registration page

Background:
    Given I am alredy sign-out

Scenario Outline: I test registration page
    Given I visit login page    
    Then I see button "<registration>" which can be clicked
    Then I see the "<registrationComponent>"
    Then I see the "<regForm>"
    Then I see "5" inputs

Examples:
| registration           | registrationComponent    | regForm                   |
| [data-cy=registration] | app-registration         | [name=registrationForm]   |