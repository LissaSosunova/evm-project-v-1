given('I visit new event page', () => {
    cy.visit('/main/new_event');
});

then('I fill today date in datepicker input {string}', datepickerInput => {
    const today: Date = new Date();
    cy.get(datepickerInput).click();
    cy.get('mat-month-view table td div').contains(String(today.getDate())).click();
});

then('I select user {string}', name => {
    cy.get('app-checkbox-dropdown').click();
    cy.get('.app-dropdown__panel').should('be.visible');
    cy.get('.app-dropdown__panel label').contains(name).click();
    cy.get('app-checkbox-dropdown').click();
});
