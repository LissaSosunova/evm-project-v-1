Feature: I check chats page

Background:
    
Scenario Outline: I test chats page
    Given I am already signed-in as "user1"
    And I visit chats page
    Then I see the "<chatsComponent>"
    Then I see the "<privateChatListComponent>"
    Then I see the "<groupChatListComponent>"
    Then I sign-out

Examples:
    | chatsComponent | privateChatListComponent    | groupChatListComponent     |
    | app-chats      | app-chat-list[flag=private] | app-chat-list[flag=group]  |

Scenario Outline: I create another user for chat creating    
    Given I am already signed-in as "user2"
    And I visit contacts page
    Then I see button "<add>" which can be clicked
    Then I see the "#add"
    Then I search user "<username1>" with name "<name1>"
    Then I see button "<addUserBtn>" which can be clicked
    Then I sign-out

Examples:
    | add           | username1 | name1         | addUserBtn        |
    | [data-cy=add] | e2eUser1  | test user 1   | [data-cy=addUser] |

Scenario Outline: I create new chat
    Given I am already signed-in as "user1"
    And I visit contacts page
    Then I see button "<avaiting>" which can be clicked
    Then I see the "#avaiting"
    Then I open confirm popup within element "[data-cy=awaiting-contacts]" on user "<name2>" clicking on button "<confirmBtn>"
    Then I see button "<contacts>" which can be clicked
    Then I see "<name2>" in element "[data-cy=contact-list]"
    Then I create new chat with user "<name2>" in "[data-cy=contact-list]" clicking on button "<newChat>"
    Then I see the "<chatWindow>"
    Then I see the "<privateChatListComponent>"
    Then I see the "<groupChatListComponent>"
    Then I see the "<openEmoBtn>"
    Then I see button "<openEmoBtn>" which can be clicked
    Then I see the ".smile-container"
    Then I see button "<openEmoBtn>" which can be clicked
    Then I do not see the ".smile-container"
    Then I see the "<multilineInput>"
    Then I see disabled button "<sendMessageBtn>"
    Then I send message "<message>" in chat using "<multilineInput>" and "<sendMessageBtn>"
    Then I see "<message>" in element ".message-box app-message-text"
    Then I sign-out
    
Examples:
    | avaiting           | name2        | confirmBtn        | contacts           | username1    | username2 | newChat            | chatWindow       | privateChatListComponent    | groupChatListComponent      | sendMessageBtn   | message            | multilineInput        | openEmoBtn        |
    | [data-cy=avaiting] | test user 2  | [data-cy=confirm] | [data-cy=contacts] | e2eUser1     | e2eUser2  | [data-cy=new-chat] | app-chat-window  | app-chat-list[flag=private] | app-chat-list[flag=group]   | [data-cy=send]   | first test message | text-field textarea   | [data-cy=openEmo] |

Scenario Outline: I sign-in from another user
    Given I am already signed-in as "user2"
    And I visit chats page
    Then I see the "<privateChatListComponent>"
    Then I click on user "<name1>" in "private" chat list
    Then I see the "<chatWindow>"
    Then I see the "<privateChatListComponent>"
    Then I see the "<groupChatListComponent>"
    Then I see the "<multilineInput>"
    Then I see disabled button "<sendMessageBtn>"
    Then I see "<message>" in element ".message-box app-message-text"
    Then I send message "<anotherMessage>" in chat using "<multilineInput>" and "<sendMessageBtn>"
    Then I see "<message>" in element ".message-box app-message-text"
    Then I see button "<openMenu>" which can be clicked
    Then I see button "<editBtn>" which can be clicked
    Then I edit message "<anotherEditedMessage>" in chat using "<multilineInput>" and "<completeEditingBtn>"
    Then I see "<anotherEditedMessage>" in element ".message-box app-message-text"
    Then I see label for edited message "<anotherEditedMessage>"
    Then I see button "<openMenu>" which can be clicked
    Then I see button "<deleteBtn>" which can be clicked
    Then I do not see "<anotherEditedMessage>" in element ".message-box app-message-text"
    Then I sign-out
    Then I am already signed-in as "user1"
    Then I visit chats page
    Then I see the "<privateChatListComponent>"
    Then I click on user "<name2>" in "private" chat list
    Then I see the "<chatWindow>"
    Then I do not see "<anotherEditedMessage>" in element ".message-box app-message-text"
    

Examples:
    | username1    | username2 | privateChatListComponent       | name1        | name2       | chatWindow       | privateChatListComponent    | groupChatListComponent     |  sendMessageBtn  | message            | anotherMessage | openMenu            | editBtn                 | deleteBtn                 | anotherEditedMessage  | completeEditingBtn         | multilineInput      |
    | e2eUser1     | e2eUser2  | app-chat-list[flag=private]    | test user 1  | test user 2 | app-chat-window  | app-chat-list[flag=private] | app-chat-list[flag=group]  |  [data-cy=send]  | first test message | second message | [data-cy=open-menu] | [data-cy=edit-message]  | [data-cy=delete-message]  | Second edited message | [data-cy=complete-editing] | text-field textarea |

Scenario Outline: I test chat window scroll
    Given I visit chats page
    Then I see the "<privateChatListComponent>"
    Then I click on user "<name2>" in "private" chat list
    Then I see the "<chatWindow>"
    Then I send "40" messages in chat using "<multilineInput>" and "<sendMessageBtn>"
    Then I reload page
    Then I scroll chat window "<messageWindow>" to the top


Examples:
    | textFieldComponent | sendMessageBtn | messageWindow            | privateChatListComponent    | name2         | chatWindow        | multilineInput         |
    | text-field         | [data-cy=send] | [data-cy=message-window] | app-chat-list[flag=private] | test user 2   | app-chat-window   | text-field textarea    |

Scenario Outline: I test draft messages
    Given I visit chats page
    Then I see the "<privateChatListComponent>"
    Then I click on user "<name2>" in "private" chat list
    Then I see the "<chatWindow>"
    Then I type message "<message>" in "<textFieldComponent>"
    Then I wait for "2" seconds
    Then I reload page
    Then I see message "<message>" in "<textFieldComponent>"
    Then I type message "<anotherMessage>" in "<textFieldComponent>"
    Then I see button "<sidebarBtn>" which can be clicked
    Then I visit chats page
    Then I see the "<privateChatListComponent>"
    Then I click on user "<name2>" in "private" chat list
    Then I see the "<chatWindow>"
    Then I see message "<anotherMessage>" in "<textFieldComponent>"
    Then I sign-out
    Then I delete user "<username1>"
    Then I delete user "<username2>"
    Then I delete private chat between user "<username1>" and "<username2>"

Examples:
    | username1 | username2 | privateChatListComponent      | name2         | chatWindow        | message                  | textFieldComponent     | anotherMessage  | sidebarBtn                                         |
    | e2eUser1  | e2eUser2  | app-chat-list[flag=private]   | test user 2   | app-chat-window   | This is draft message    | text-field textarea    | another message | app-sidebar aside nav li:first-child i:first-child |
