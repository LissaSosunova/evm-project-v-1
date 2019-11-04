then('I see the {string}', component => {
    cy.get(component).should('exist');
});

given('I visit login page', () => {
    cy.visit('/login');
});

given('I am alredy sign-out', () => {
    cy.window().then($window => {
        if ($window.sessionStorage.getItem('_token')) {
            $window.sessionStorage.removeItem('_token');
        }
        if ($window.sessionStorage.getItem('token_key')) {
            $window.sessionStorage.removeItem('token_key');
        }
    });
});

given('I visit home page', () => {
    cy.visit('/main/home');
});

then ('I see button {string} which can be clicked', button => {
    cy.get(button).click();
});
