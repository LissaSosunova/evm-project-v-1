import * as user1 from '../../../../backend_server/src/admin_api/for_e2e/user1/e2eUser.json';
import * as user2 from '../../../../backend_server/src/admin_api/for_e2e/user2/e2eUser.json';
import * as user3 from '../../../../backend_server/src/admin_api/for_e2e/user3/e2eUser.json';

given('I create user', () => {
    cy.visit('/');
    cy.task('createUser', 'user1');
});

then('I sign-in as {string}', username => {
    const userObj = {user1, user2, user3};
    cy.visit('/login');
    cy.get('[name=userInput] input').type(userObj[username].username);
    cy.get('[name=passwordInput] input').type(userObj[username].password);
    cy.wait(2000);
    cy.get('button[type=submit]').click();
    cy.get('app-main').should('exist');
});
