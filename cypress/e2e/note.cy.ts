describe('Create Note', () => {
  before(() => {
    cy.task('resetTestDatabase');
  });

  beforeEach(() => {
    // Mock the session instead of doing programmatic login
    cy.mockSession();
  });

  it('should create a new note when logged in', () => {
    cy.visit('/note/new');

    // Wait for the page to load and verify we're on the correct page
    cy.url().should('include', '/note/new');

    // Wait for the form to be visible (this handles auth redirects and loading states)
    cy.get('form', { timeout: 10000 }).should('be.visible');

    // Verify we can see the title input field
    cy.get('input[name="title"]', { timeout: 5000 }).should('be.visible');
    cy.get('input[name="title"]').type('My first note');

    cy.get('textarea[name="content"]').should('be.visible');
    cy.get('textarea[name="content"]').type('This is the content of my note.');

    // Click the submit button
    cy.get('button[type="submit"]').contains('Create Note').click();

    // Wait for the redirect to complete
    cy.url({ timeout: 10000 }).should('eq', `${Cypress.config().baseUrl}/`);

    // Verify we can see the success message or home page content
    cy.contains('Welcome').should('be.visible');
  });
});


