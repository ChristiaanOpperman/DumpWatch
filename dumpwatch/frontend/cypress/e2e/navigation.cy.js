/* eslint-disable no-unused-expressions */
/* global cy */
/* global Cypress */
// const jwt = require('jsonwebtoken');

describe('Auth Flow', () => {
  beforeEach(() => {
    if (!Cypress.env('jwtSecret')) {
      throw new Error('JWT_SECRET environment variable is required');
    }
  });

  it('should show error message with invalid credentials', () => {
    // Intercept the login request and mock a failed response
    cy.intercept('POST', 'http://localhost:8080/login', {
      statusCode: 401,
      body: { error: 'Invalid credentials' }
    }).as('loginAttempt');

    cy.visit('/login');

    // Type invalid credentials
    cy.get('input[name="email"]').type('wrong@email.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Wait for the request to complete
    cy.wait('@loginAttempt');

    // Check that error message is displayed
    cy.contains('Invalid credentials').should('be.visible');

    // Verify we're still on the login page
    cy.url().should('include', '/login');

    // Verify no token was stored
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.be.null;
    });
  });

  it('should successfully login and logout', () => {
    cy.loginByAuth();
    cy.get('button[aria-label="menu-header"]').click();
    cy.get('.transform.translate-x-0').should('exist');
    cy.contains('button', 'Log Out').click();
    cy.url().should('include', '/login');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.be.null;
    });
  });
});

describe('Community Features', () => {
  beforeEach(() => {
    cy.loginByAuth();
  });

  it('should navigate to community page', () => {
    cy.get('button[aria-label="menu-header"]').click();
    cy.get('a[href="/community"]').should('be.visible').click();
    cy.url().should('include', '/community');
  });

  it('should view and interact with community post', () => {
    cy.visit('/community');

    cy.get('body').then(($body) => {
      if ($body.find('.bg-white.rounded-lg.shadow-md').length > 0) {
        cy.get('.bg-white.rounded-lg.shadow-md').first().click();
        cy.url().should('include', '/community/');

        const commentText = 'This needs urgent cleanup!';
        cy.get('textarea').type(commentText);
        cy.contains(commentText).should('be.visible');
      } else {
        cy.log('No reports found.');
      }
    });
  });
});

describe('Knowledge Base', () => {
  beforeEach(() => {
    cy.loginByAuth();
  });

  it('should navigate to knowledge base', () => {
    cy.get('button[aria-label="menu-header"]').click();
    cy.get('a[href="/knowledge-base"]').should('be.visible').click();
    cy.url().should('include', '/knowledge-base');
  });

  it('should log out ', () => {
    cy.get('button[aria-label="menu-header"]').click();
    cy.get('.transform.translate-x-0').should('exist');

    cy.contains('button', 'Log Out')
      .should('be.visible')
      .click();
    cy.url().should('include', '/login');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.be.null;
    });
  })
});