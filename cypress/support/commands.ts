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

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>
      loginByCredentials(email: string, password: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('loginByCredentials', (email: string, password: string) => {
  cy.request('GET', '/api/auth/csrf').then(({ body }) => {
    const csrfToken = body.csrfToken as string;
    cy.request({
      method: 'POST',
      url: '/api/auth/callback/credentials?json=true',
      form: true,
      body: {
        csrfToken,
        email,
        password,
        callbackUrl: '/',
        json: 'true',
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then(() => {
      cy.request('/api/auth/session').its('status').should('eq', 200);
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
    { cacheAcrossSpecs: true }
  );
});
