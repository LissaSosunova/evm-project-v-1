given('I visit chats page', () => {
    cy.visit('/main/chats');
});

then('I create new chat with user {string} in {string} clicking on button {string}', (name, element, button) => {
    cy.get(element)
    .contains(name)
    .parent(element)
    .within(() => {
        cy.get(button).click();
    });
});

then('I send message {string} in chat using {string} and {string}', (message, input, sendButton) => {
    cy.get(input).type(message);
    cy.get(sendButton).click();
});

then('I click on user {string} in {string} chat list', (name, chatType) => {
    cy.get(`app-chat-list[flag=${chatType}] li div`).contains(name).click();
});

then('I edit message {string} in chat using {string} and {string}', (message, input, editButton) => {
    cy.get(input).clear().type(message);
    cy.get(editButton).click();
});

then('I see label for edited message {string}', message => {
    cy.get('app-message-text')
    .contains(message)
    .parents('.message-container')
    .contains('Edited');
});
