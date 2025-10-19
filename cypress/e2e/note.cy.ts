describe('Create Note', () => {
  before(() => {
    cy.task('resetTestDatabase');
  });

  beforeEach(() => {
    // Mock the session instead of doing programmatic login
    cy.mockSession();
  });

  it('should create a new note and see it in the list', () => {
    // Visit the notes page
    cy.visit('/notes');

    // Wait for the page to load and verify we're on the correct page
    cy.url().should('include', '/notes');

    // Click on the "New" button in the sidebar to create a new note
    cy.contains('button', 'New', { timeout: 10000 }).click();

    // Wait for the form to be visible
    cy.get('.note-title', { timeout: 5000 }).should('be.visible');

    // Click on the title area to start editing
    cy.get('.note-title').click();

    // Type the title
    cy.get('input[placeholder="Note title"]', { timeout: 5000 })
      .should('be.visible')
      .type('My Test Note');

    // Press Enter to save the title
    cy.get('input[placeholder="Note title"]').type('{enter}');

    // Wait for the note to be saved
    cy.contains('Note saved', { timeout: 5000 }).should('be.visible');

    // Click on the content area to start editing
    cy.get('.note-content').click();

    // Type the content
    cy.get('textarea[placeholder="Start writing your note content here..."]', {
      timeout: 5000,
    })
      .should('be.visible')
      .type('This is the content of my test note.');

    // Press Ctrl+Enter (or Cmd+Enter on Mac) to save the content
    cy.get(
      'textarea[placeholder="Start writing your note content here..."]'
    ).type('{ctrl+enter}');

    // Wait for the note to be saved again
    cy.contains('Note saved', { timeout: 5000 }).should('be.visible');

    // Verify the note appears in the list on the left sidebar
    cy.contains('My Test Note', { timeout: 5000 }).should('be.visible');

    // Verify the content preview appears in the list
    cy.contains('This is the content of my test note.').should('be.visible');

    // Verify we can see "6 notes" counter in the sidebar (5 seeded + 1 new)
    cy.contains('6 notes').should('be.visible');
  });
});


