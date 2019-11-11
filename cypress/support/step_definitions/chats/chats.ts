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

then('I send {string} messages in chat using {string} and {string}', (messagesAmount, input, sendButton) => {
    const messagesNumber: number = +messagesAmount;
    for (let i = 0; i <= messagesNumber; i++) {
        cy.get(input).type(`This is ${String(i)} message`);
        cy.get(sendButton).click();
    }
});

then('I scroll chat window {string} to the top', chatWindow => {
    cy.wait(1000);
    cy.get(chatWindow).scrollTo(0, -100);
    cy.get('app-section-spinner mat-spinner').should('be.visible');
    cy.get('app-section-spinner mat-spinner').should('not.be.visible');
    cy.wait(1000);
    cy.get('.arrow-down i').should('be.visible');
    cy.get(chatWindow).scrollTo(0, -100);
    cy.wait(1000);
    cy.get('.arrow-down i').click();
    cy.get('.arrow-down i').should('not.be.visible');
});

then('I type message {string} in {string}', (message, input) => {
    cy.get(input).clear().type(message);
});

then('I see message {string} in {string}', (message, input) => {
    cy.get(input)
    .invoke('val')
    .then(draftMessage => {
        cy.wrap(draftMessage).should('eq', message);
    });
});
