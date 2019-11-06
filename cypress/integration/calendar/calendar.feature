Feature: I test calendar page

Background:
    Given I am already signed-in as "user3"

Scenario Outline: I check calendar
    Given I visit calendar page
    Then I see the "<eventCalendarComponent>"
    Then I see the "<fullcalendar>" 
    Then I see the ".fc-header-toolbar"
    Then I see the ".fc-view-container"
    Then I sign-out
    Then I delete user "<username3>" 

Examples:
    | eventCalendarComponent | username3 | fullcalendar             |
    | app-event-calendar     | e2eUser3  | app-angular-fullcalendar |