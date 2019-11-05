Feature: I check home page

Background:
    Given I am already signed-in as "user1"

Scenario Outline: I test home page
    Given I visit home page
    Then I see the "<mainComponent>"
    Then I see the "<homeComponent>"
    Then I see the "<sideBar>"
    Then I see the "div.header"
    Then I see name of user "<username>"
    Then I see avatar
    Then I see evm logo
    Then I see expanded sidebar "<labels>"
    Then I see button "<toogleSidebarBtn>" which can be clicked
    Then I see narrowed sidebar "<labels>"
    Then I see button "<toogleSidebarBtn>" which can be clicked
    Then I navigate to other pages using sidebar "<allLabels>" and checking "<components>"
    Then I delete user "<username>"

Examples:
| username    | mainComponent  | homeComponent | sideBar     | toogleSidebarBtn          | labels                                         | allLabels                                           | components                                                                                 |
| e2eUser1    | app-main       | app-home      | app-sidebar | [data-cy=toggleSidebar]   | Contacts;Chat;Events;New event;Calendar;Exit   | Contacts;Home;Chat;Events;New event;Calendar;Exit   | app-contacts;app-home;app-chats;app-events;app-new-event;app-event-calendar;app-login-page |