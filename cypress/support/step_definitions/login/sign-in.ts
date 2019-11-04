import * as userCreds from '../../../../backend_server/admin_api/testUserCreds.json';

given('I create user', () => {
    cy.visit('/');
    cy.task('createUser');
});

then('I sign-in', () => {
    cy.visit('/login');
    cy.get('[name=userInput] input').type(userCreds.username);
    cy.get('[name=passwordInput] input').type(userCreds.password);
    cy.wait(2000);
    cy.get('button[type=submit]').click();
    cy.get('app-main').should('exist');
});

then ('I sign-out', () => {
    cy.get('app-sidebar a[title=exit]').click();
    cy.get('app-login-page').should('exist');
});

then('I delete user {string}', username => {
    cy.task('deleteUser', username);
});
