import * as userCreds from '../../../../backend_server/admin_api/for_e2e/user1/e2eUser.json';

given('I create user', () => {
    cy.visit('/');
    cy.task('createUser', 'user1');
});

then('I sign-in', () => {
    cy.visit('/login');
    cy.get('[name=userInput] input').type(userCreds.username);
    cy.get('[name=passwordInput] input').type(userCreds.password);
    cy.wait(2000);
    cy.get('button[type=submit]').click();
    cy.get('app-main').should('exist');
});
