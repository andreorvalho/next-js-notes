describe('User Login and Logout', () => {
  it('should login and display the user name', () => {
    // Visit the login page
    cy.visit('/login');

    // Fill in the login form with the seeded test user
    cy.get('input').should('have.length', 2);
    cy.get('input[id="email"]').type('test@example.com');
    cy.get('input[id="password"]').type('Password123!');

    // Submit the login form
    cy.get('button[type="submit"]').click();

    // Check if the user is redirected to the home page (notes page)
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);

    // Check if the notes page header is displayed
    cy.contains('h1', 'Notes').should('be.visible');

    // Check if notes counter is visible (should show seeded notes)
    cy.contains('notes').should('be.visible');

    // Click the logout button (scroll to it first to ensure it's visible)
    cy.get('button')
      .contains('Logout')
      .scrollIntoView()
      .should('be.visible')
      .click();

    // Check if the user is redirected to the login page
    cy.url().should('eq', `${Cypress.config().baseUrl}/login`);
  });
});
