describe('Create Note', () => {
  before(() => {
    cy.task('resetTestDatabase');
  });

  beforeEach(() => {
    // Mock the session instead of doing programmatic login
    cy.mockSession();
  });

  it('should create a new note when logged in', () => {
    cy.visit('/notes/new');

    // Wait for the page to load and verify we're on the correct page
    cy.url().should('include', '/notes/new');

    // Wait for the note document to be visible
    cy.get('.note-document', { timeout: 10000 }).should('be.visible');

    // Click on the title area to start editing
    cy.get('.note-title').click();

    // Type the title
    cy.get('.inline-edit-input').first().type('My first note');

    // Press Enter to save the title
    cy.get('.inline-edit-input').first().type('{enter}');

    // Wait for the title to be saved (check for success message or last saved indicator)
    cy.contains('Note saved', { timeout: 5000 }).should('be.visible');

    // Click on the content area to start editing
    cy.get('.note-content').click();

    // Type the content
    cy.get('.inline-edit-input').last().type('This is the content of my note.');

    // Press Ctrl+Enter (or Cmd+Enter on Mac) to save the content
    cy.get('.inline-edit-input').last().type('{ctrl+enter}');

    // Wait for the note to be saved and redirected
    cy.url({ timeout: 10000 }).should('eq', `${Cypress.config().baseUrl}/`);

    // Verify we can see the success message or home page content
    cy.contains('Welcome').should('be.visible');
  });
});


