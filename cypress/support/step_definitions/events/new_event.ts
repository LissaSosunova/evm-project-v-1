given('I visit new event page', () => {
    cy.visit('/main/new_event');
});

then('I fill today date in datepicker input {string} clicking on {string}', (datepickerInput, button) => {
    cy.get(datepickerInput).click();
    cy.get(button).click();
});

then('I select user {string}', name => {
    cy.get('app-checkbox-dropdown').click();
    cy.get('.app-dropdown__panel').should('be.visible');
    cy.get('.app-dropdown__panel label').contains(name).click();
    cy.get('app-checkbox-dropdown').click();
});
