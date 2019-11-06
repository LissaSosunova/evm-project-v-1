Feature: I check contacts page

Background:
    

Scenario Outline: I test contacts page
    Given I am already signed-in as "user1"
    Then I visit contacts page
    Then I see the "<contactsComponent>"
    Then I see the "#menu-switcher"
    Then I see the "#contacts"
    Then I see button "<avaiting>" which can be clicked
    Then I see the "#avaiting"
    Then I reload page
    Then I see the "#avaiting"
    Then I see button "<requested>" which can be clicked
    Then I see the "#requested"
    Then I reload page
    Then I see the "#requested"
    Then I see button "<add>" which can be clicked
    Then I see the "#add"
    Then I reload page
    Then I see the "#add"
    Then I search unexisting user "<user>"
    Then I sign-out

Examples:
    | contactsComponent | avaiting           | requested           | add           | user  |
    | app-contacts      | [data-cy=avaiting] | [data-cy=requested] | [data-cy=add] | asdfg |

Scenario Outline: I test adding contacts
    Given I am already signed-in as "user2"
    Then I visit contacts page
    Then I see button "<add>" which can be clicked
    Then I see the "#add"
    Then I search user "<username1>" with name "<name1>"
    Then I see button "<addUserBtn>" which can be clicked
    Then I see button "<requested>" which can be clicked
    Then I see the "#requested"
    Then I see "<name1>" in element "<requestedContacts>"
    Then I open confirm popup within element "[data-cy=requested-contacts]" on user "<name1>" clicking on button "<cancelBtn>"
    Then I see the "app-popup-details app-popup"
    Then I see button "[data-cy=cancelPopupBtn]" which can be clicked
    Then I see "<name1>" in element "<requestedContacts>"
    Then I open confirm popup within element "[data-cy=requested-contacts]" on user "<name1>" clicking on button "<cancelBtn>"
    Then I see button "app-popup [type=submit]" which can be clicked
    Then I do not see "<name1>" in element "<requestedContacts>"
    Then I see button "<add>" which can be clicked
    Then I see the "#add"
    Then I search user "<username1>" with name "<name1>"
    Then I see button "<addUserBtn>" which can be clicked
    Then I sign-out
    Then I am already signed-in as "user1"
    Then I visit contacts page
    Then I see button "<avaiting>" which can be clicked
    Then I see the "#avaiting"
    Then I see button "<avaiting>" which can be clicked
    Then I open confirm popup within element "[data-cy=awaiting-contacts]" on user "<name2>" clicking on button "<cancelBtn>"
    Then I see button "[data-cy=cancelPopupBtn]" which can be clicked
    Then I open confirm popup within element "[data-cy=awaiting-contacts]" on user "<name2>" clicking on button "<cancelBtn>"
    Then I see button "app-popup [type=submit]" which can be clicked
    Then I do not see "<name2>" in element "<avaiting>"
    Then I see button "<add>" which can be clicked
    Then I see the "#add"
    Then I search user "<username2>" with name "<name2>"
    Then I see button "<addUserBtn>" which can be clicked
    Then I sign-out
    Then I am already signed-in as "user2"
    Then I visit contacts page
    Then I see button "<avaiting>" which can be clicked
    Then I see the "#avaiting"
    Then I see button "<avaiting>" which can be clicked
    Then I open confirm popup within element "[data-cy=awaiting-contacts]" on user "<name1>" clicking on button "<confirmBtn>"
    Then I see button "<contacts>" which can be clicked
    Then I see "<name1>" in element "[data-cy=contact-list]"
    Then I delete user "<username1>"
    Then I delete user "<username2>"

Examples:
    | username1  | name1        | username2 | name2       | contactsComponent | contacts           | avaiting            | requested             | add             | addUserBtn         | requestedContacts             | cancelBtn             | confirmBtn          |
    | e2eUser1   | test user 1  | e2eUser2  | test user 2 | app-contacts      | [data-cy=contacts] |[data-cy=avaiting]   | [data-cy=requested]   | [data-cy=add]   | [data-cy=addUser]  | [data-cy=requested-contacts]  | [data-cy=cancel-btn]  | [data-cy=confirm]   |
