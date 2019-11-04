given('Login page should be displayed', () => {
    cy.location('pathname').should('eq', '/login');
    cy.get('app-login-page').should('exist');
});
