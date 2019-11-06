import * as userCreds from '../../../../backend_server/admin_api/for_e2e/user1/e2eUser.json';

given('I visit home page', () => {
    cy.visit('/main/home');
});

then('I see name of user {string}', username => {
    cy.wrap(userCreds).its('username').should('eq', username);
    cy.get('span.header-user-container').contains(userCreds.name);
});

then('I see avatar', () => {
    cy.get('img.avatar').should('exist');
    cy.get('input[type=file]').should('exist');
});

then('I see evm logo', () => {
    cy.get('div.header img[alt="EVENT messenger"]').should('exist');
});

then('I see expanded sidebar {string}', labels => {
    const labelsArr: string[] = labels.split(';');
    labelsArr.forEach(label => {
        cy.get('aside nav li i').contains(label);
    });
});

then('I see narrowed sidebar {string}', labels => {
    const labelsArr: string[] = labels.split(';');
    labelsArr.forEach(label => {
        cy.get('aside nav li i').should('not.contain', label);
    });
});

then('I navigate to other pages using sidebar {string} and checking {string}', (labels, components) => {
    const componentsArr: string[] = components.split(';');
    const labelsArr: string[] = labels.split(';');
    labelsArr.forEach((label, i) => {
        cy.get('aside nav li i').contains(label).click();
        cy.get('aside nav li i').should('not.contain', label);
        cy.get(componentsArr[i]).should('exist');
    });
});
