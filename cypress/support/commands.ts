/// <reference types="cypress" />

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
      mockSession(): Chainable<void>
    }
  }
}

