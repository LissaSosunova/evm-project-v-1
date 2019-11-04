then('I see {string} inputs', number => {
    cy.get('app-registration .input-container')
    .its('length')
    .then(elementsLength => {
        expect(elementsLength).to.be.equal(+number);
    });
});
