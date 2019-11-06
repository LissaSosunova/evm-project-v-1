then('I see {string} inputs', number => {
    cy.get('app-registration .input-container')
    .its('length')
    .then(elementsLength => {
        expect(elementsLength).to.be.equal(+number);
    });
});

then('I fill registration form with data {string}', data => {
    const dataPieces: string[] = data.split(';');
    cy.get('.input-container input').each(($input, i) => {
        cy.wrap($input).clear().type(dataPieces[i]);
    });
});
