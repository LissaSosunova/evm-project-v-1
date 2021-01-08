import * as user1 from '../../../backend_server/src/admin_api/for_e2e/user1/e2eUser.json';
import * as user2 from '../../../backend_server/src/admin_api/for_e2e/user2/e2eUser.json';
import * as user3 from '../../../backend_server/src/admin_api/for_e2e/user3/e2eUser.json';
import {config} from '../../config';
import { deleteCookie, setCookie } from '../utils/cookies-service';

then('I see the {string}', component => {
    cy.get(component).should('exist');
});

then('I do not see the {string}', element => {
    cy.get(element).should('not.exist');
});

given('I visit login page', () => {
    cy.visit('/login');
});

given('I am alredy sign-out', () => {
    cy.window().then($window => {
        deleteCookie('token_key', $window.document);
        deleteCookie('access_token', $window.document);
    });
});

given('I visit home page', () => {
    cy.visit('/main/home');
});

then ('I see button {string} which can be clicked', button => {
    cy.get(button).click();
});

given('I am already signed-in as {string}', username => {
    const userObj = {user1, user2, user3};
    cy.task('createUser', username);
    cy.request('POST', `${config.backendUrl}/login`, {username: userObj[username].username, password: userObj[username].password})
    .then((response: Cypress.Response) => {
        cy.window().then($window => {
            setCookie('access_token', response.body.access_token, $window.document);
            setCookie('token_key', response.body.token_key, $window.document);
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

then('I delete event {string}', eventName => {
    cy.task('deleteEvent', eventName);
});

then('I wait for {string} seconds', delay => {
    cy.wait(+delay * 1000);
});

then('I type {string} in input {string}', (text, input) => {
    cy.get(input).clear().type(text);
});

then('I click on document', () => {
    document.body.click();
});

then('I see button {string} with content {string} which can be clicked', (button, content) => {
    cy.get(button).contains(content).click();
});
