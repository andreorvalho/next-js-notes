describe('Create Note', () => {
  before(() => {
    cy.task('resetTestDatabase');
  });

  beforeEach(() => {
    // Mock the session instead of doing programmatic login
    cy.mockSession();
  });

  it('should create a new note and see it in the list', () => {
    // Intercept API calls
    cy.intercept('POST', '/api/notes').as('createNote');
    cy.intercept('PUT', '/api/notes/*').as('updateNote');
    cy.intercept('GET', '/api/notes*').as('getNotes');

    // Visit the home page (notes page)
    cy.visit('/');

    // Wait for initial notes to load
    cy.wait('@getNotes');

    // Wait for the page to load and verify we're on the correct page
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);

    // Click on the "New" button in the sidebar to create a new note
    cy.contains('button', 'New', { timeout: 10000 }).click();

    // Wait for the form to be visible
    cy.get('.note-title', { timeout: 5000 }).should('be.visible');

    // Click on the title area to start editing
    cy.get('.note-title').click();

    // Wait for input to appear and type the title
    cy.get('input.inline-edit-input', { timeout: 5000 })
      .should('be.visible')
      .should('be.focused')
      .clear()
      .type('My Test Note{enter}');

    // Wait for the API call to complete
    cy.wait('@createNote').its('response.statusCode').should('eq', 200);

    // Wait for the note to be saved
    cy.contains('Note saved', { timeout: 10000 }).should('be.visible');

    // Click on the content area to start editing
    cy.get('.note-content').click();

    // Wait for textarea to appear and type the content
    cy.get('textarea.inline-edit-input', { timeout: 5000 })
      .should('be.visible')
      .should('be.focused')
      .clear()
      .type('This is the content of my test note.{ctrl+enter}');

    // Wait for the API call to update the note
    cy.wait('@updateNote', { timeout: 10000 })
      .its('response.statusCode')
      .should('eq', 200);

    // Wait for the note to be saved again
    cy.contains('Note saved', { timeout: 10000 }).should('be.visible');

    // Verify the note appears in the list on the left sidebar
    cy.contains('My Test Note', { timeout: 5000 }).should('be.visible');

    // Verify the content preview appears in the list
    cy.contains('This is the content of my test note.').should('be.visible');

    // Verify we can see "6 notes" counter in the sidebar (5 seeded + 1 new)
    cy.contains('6 notes').should('be.visible');
  });
});


