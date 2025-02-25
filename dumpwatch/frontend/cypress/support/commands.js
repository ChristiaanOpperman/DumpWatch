/* eslint-disable no-unused-expressions */
/* global cy */
/* global Cypress */
const jwt = require('jsonwebtoken');

function createMockJWT() {
    const secret = Cypress.env('jwtSecret');
    if (!secret || typeof secret !== 'string') {
        throw new Error(`JWT Secret is missing or invalid!`);
    }

    const payload = {
        sub: '123',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
    };

    return jwt.sign(payload, Buffer.from(secret), { algorithm: 'HS256' });
}

Cypress.Commands.add('loginByAuth', () => {
    const token = createMockJWT();

    cy.intercept('POST', 'http://localhost:8080/login', {
        statusCode: 200,
        body: { token, userId: '3', userType: 'Community Member' }
    });

    cy.visit('/login');
    cy.get('input[name="email"]').type('test@gmail.com');
    cy.get('input[name="password"]').type('skyrim99');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/home');
    cy.window().its('localStorage.token').should('exist');
    cy.window().its('localStorage.userType').should('exist');
});