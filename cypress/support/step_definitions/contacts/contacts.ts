given('I visit contacts page', () => {
    cy.visit('/main/contacts');
});

then('I search unexisting user {string}', user => {
    cy.get('[data-cy=search] input').type(user);
    cy.get('.nothing-found').contains('Nothing found');
});

then('I search user {string} with name {string}', (username, name) => {
    cy.get('[data-cy=search] input').clear().wait(1000).type(username);
    cy.get('[data-cy=searched-contacts]').contains(name);
});

then('I open confirm popup within element {string} on user {string} clicking on button {string}', (parentElement, name, selector) => {
    cy.get(parentElement)
    .contains(name)
    .parent(parentElement)
    .within(() => {
        cy.get(selector).click();
    });
});
