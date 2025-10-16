/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { HTTP_GET, HTTP_POST } from '../../types';
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }


// Custom commands can be added here
// Note: Database reset command is handled in plugins/index.js for Node.js context

// Mock useSession to return authenticated user
Cypress.Commands.add('mockSession', () => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com'
  };

  const mockSession = {
    user: mockUser,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
  };

  // Intercept the session API call and return our mock data
  cy.intercept('GET', '/api/auth/session', {
    statusCode: 200,
    body: mockSession
  }).as('getSession');

  // Also intercept any other auth-related calls
  cy.intercept('GET', '/api/auth/csrf', {
    statusCode: 200,
    body: { csrfToken: 'mock-csrf-token' }
  }).as('getCsrf');

  cy.intercept('GET', '/api/auth/providers', {
    statusCode: 200,
    body: {
      credentials: {
        id: 'credentials',
        name: 'Credentials',
        type: 'credentials'
      }
    }
  }).as('getProviders');
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>
      loginByCredentials(email: string, password: string): Chainable<void>
      mockSession(): Chainable<void>
    }
  }
}

Cypress.Commands.add('loginByCredentials', (email: string, password: string) => {
  // Get CSRF token first
  cy.request(HTTP_GET, '/api/auth/csrf').then((response) => {
    const csrfToken = response.body.csrfToken;

    // Perform the login request
    cy.request({
      method: HTTP_POST,
      url: '/api/auth/callback/credentials',
      body: {
        email,
        password,
        csrfToken,
        json: 'true',
      },
    }).then((loginResponse) => {
      // For JWT strategy, NextAuth should return a 200 with cookies
      expect(loginResponse.status).to.eq(200);

      // The cookies should be automatically set by Cypress
      // Verify the session is working
      cy.request('/api/auth/session').then((sessionResponse) => {
        expect(sessionResponse.status).to.eq(200);
        expect(sessionResponse.body).to.have.property('user');
        expect(sessionResponse.body.user.email).to.eq(email);
      });
    });
  });
});

Cypress.Commands.add('login', () => {
  const email = 'test@example.com';
  const password = 'Password123!';

  cy.session(
    email,
    () => {
      cy.loginByCredentials(email, password);
    },
    {
      cacheAcrossSpecs: true,
      validate: () => {
        // Verify the session is still valid
        cy.request('/api/auth/session').then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('user');
        });
      }
    }
  );
});
