describe('Create Note', () => {
  before(() => {
    cy.task('resetTestDatabase');
  });

  beforeEach(() => {
    cy.login();
  });

  it('should create a new note when logged in', () => {
    cy.visit('/note/new');

    cy.get('input[name="title"]').type('My first note');
    cy.get('textarea[name="content"]').type('This is the content of my note.');

    // Click the submit button
    cy.get('button[type="submit"]').contains('Create Note').click();

    // Wait for the redirect to complete
    cy.url({ timeout: 10000 }).should('eq', `${Cypress.config().baseUrl}/`);

    // Verify we can see the success message or home page content
    cy.contains('Welcome').should('be.visible');
  });
});


