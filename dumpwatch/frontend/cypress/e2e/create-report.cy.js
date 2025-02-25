/* eslint-disable no-unused-expressions */
/* global cy */
/* global Cypress */
describe('Create Report', () => {
    beforeEach(() => {
        cy.loginByAuth();
        cy.wait(1000);
    });

    it('should allow a logged-in user to create a report', () => {
        cy.get('form').should('be.visible');
        cy.get('.mt-4').click();

        cy.contains('Use Current Location').click();

        cy.get('.css-19bb58m').first().click();
        cy.get('#react-select-5-option-0').click();

        cy.get(':nth-child(3) > .w-full > .css-13cymwt-control > .css-hlgwow').click();
        cy.get('#react-select-7-option-0').click();
        cy.get('textarea').type('Illegal dumping spotted near the community park.');

        cy.get('.cursor-pointer').selectFile('cypress/fixtures/sample-image.jpg');

        cy.wait(1000);

        cy.get('button[type="submit"]').click();

        cy.contains('Upload Post Success!').should('be.visible');
    });
});
