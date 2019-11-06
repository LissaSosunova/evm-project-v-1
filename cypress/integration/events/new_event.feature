Feature: I check new event page

Background:

Scenario Outline: I create users and friend them
    Given I am already signed-in as "user1"
    Then I visit home page
    Then I sign-out
    Then I am already signed-in as "user2"
    Then I visit contacts page
    Then I see button "<add>" which can be clicked
    Then I see the "#add"
    Then I search user "<username1>" with name "<name1>"
    Then I see button "<addUserBtn>" which can be clicked
    Then I sign-out
    Then I am already signed-in as "user1" 
    Then I visit contacts page
    Then I see button "<avaiting>" which can be clicked
    Then I see the "#avaiting"
    Then I open confirm popup within element "[data-cy=awaiting-contacts]" on user "<name2>" clicking on button "<confirmBtn>"
    Then I sign-out

Examples:
    | add            | username1 | name1       | name2       | addUserBtn        | avaiting           | confirmBtn        |
    | [data-cy=add]  | e2eUser1  | test user 1 | test user 2 | [data-cy=addUser] | [data-cy=avaiting] | [data-cy=confirm] |


Scenario Outline: I test leave guard
    Given I am already signed-in as "user1"
    And I visit new event page
    Then I see the "<newEventComponent>"
    Then I type "<eventName>" in input "<eventNameInput>"
    Then I wait for "1" seconds
    Then I see button "<sidebarBtn>" with content "Events" which can be clicked
    Then I see the "app-new-event-leave-popup app-popup"
    Then I see button "<cancelBtn>" which can be clicked
    Then I see button "<sidebarBtn>" with content "Events" which can be clicked
    Then I see button "app-popup [type=submit]" which can be clicked
    Then I see the "<eventComponent>"
    Then I sign-out

Examples:
    | newEventComponent | eventName  | eventNameInput          | sidebarBtn                 | cancelBtn                 | eventComponent |
    | app-new-event     | test event | [name=eventTitle] input | app-sidebar aside nav li i | [data-cy=cancelPopupBtn]  | app-events     |

Scenario Outline: I test creating new event
    Given I am already signed-in as "user1"
    And I visit new event page
    Then I see the "<newEventComponent>"
    Then I see disabled button "<saveEventBtn>"
    Then I type "<eventName>" in input "<eventNameInput>"
    Then I see button "#mat-radio-4" which can be clicked
    Then I fill today date in datepicker input "[name=startDate] input[name=visible]"
    Then I select user "<name2>"
    Then I type "<eventLocation>" in input "<eventLocationInput>"
    Then I see button "mat-checkbox" which can be clicked
    Then I type "<addInfo>" in input "<addInfoInput>"
    Then I see button "<saveEventBtn>" which can be clicked
    Then I see "New event was successfully saved" in element "snack-bar-container app-toast-success"
    Then I see button "<sidebarBtn>" with content "Events" which can be clicked
    Then I see the "<eventComponent>"
    Then I see "<eventName>" in element ".event-list li"
    Then I reload page
    Then I see "<eventName>" in element ".event-list li"
    Then I sign-out
    Then I delete user "<username1>"
    Then I delete user "<username2>"
    Then I delete event "<eventName>"

Examples:
    | newEventComponent | saveEventBtn         | eventName | eventNameInput          | name2        | eventLocation | eventLocationInput         | addInfo   | addInfoInput                             | sidebarBtn                 | eventComponent | username1 | username2 |
    | app-new-event     | button[type=submit]  | test event| [name=eventTitle] input | test user 2  | test location | [name=eventLocation] input | test info | [name=additional] [contenteditable=true] | app-sidebar aside nav li i | app-events     | e2eUser1  | e2eUser2  |
