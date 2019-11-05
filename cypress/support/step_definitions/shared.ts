import * as user1 from '../../../backend_server/admin_api/for_e2e/user1/e2eUser.json';
import * as user2 from '../../../backend_server/admin_api/for_e2e/user2/e2eUser.json';
import {config} from '../../config';
// import * as fs from 'fs';
// import * as path from 'path';

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

given('I am already signed-in as {string}', username => {
    // const userCreds = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../../../backend_server/admin_api/for_e2e/${username}/e2eUser.json`), 'utf8'));
    const userObj = {user1, user2};
    cy.task('createUser', username);
    cy.request('POST', `${config.backendUrl}/login`, {username: userObj[username].username, password: userObj[username].password})
    .then((response: Cypress.Response) => {
        cy.window().then($window => {
            $window.sessionStorage.setItem('_token', response.body.access_token);
            $window.sessionStorage.setItem('token_key', response.body.token_key);
        });
    });
});

then('I delete user {string}', username => {
    cy.task('deleteUser', username);
});

then('I reload page', () => {
    cy.reload();
});

then('I sign-out', () => {
    cy.get('app-sidebar a[title=exit]').click();
    cy.get('app-login-page').should('exist');
});

then('I see {string} in element {string}', (content, element) => {
    cy.get(element).contains(content);
});

then('I do not see {string} in element {string}', (content, element) => {
    cy.get(element).should('not.contain', content);
});

then('I see disabled button {string}', button => {
    cy.get(button)
        .invoke('attr', 'disabled');
});

then('I delete private chat between user {string} and {string}', (username1, username2) => {
    const usernames = {username1, username2};
    cy.task('deleteChat', usernames);
});
